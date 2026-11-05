import { AREAS, AREA_CONFIG } from '@/lib/areas';
import type { Answer, Problem, TestCase } from '@/lib/content/schema';

const fence = (lang: string, body: string): string[] => [
  '```' + lang,
  body,
  '```'
];

const caseLine = (entry: string, c: TestCase): string =>
  `- \`${entry}(${c.input.map((a) => JSON.stringify(a)).join(', ')})\` → \`${JSON.stringify(c.expected)}\``;

const answerLines = (answer: Answer): string[] => {
  switch (answer.type) {
    case 'number':
      return [
        `**${answer.value}**${answer.tolerance > 0 ? ` (± ${answer.tolerance})` : ''}`
      ];
    case 'exact':
      return [`Accepted: ${answer.accepted.map((a) => `**${a}**`).join(', ')}`];
    case 'choice':
      return answer.options.map(
        (o, i) => `${i === answer.correctIndex ? '✅' : '▫️'} ${o}`
      );
    case 'code':
      return [
        `Shown examples (${answer.examples.length}):`,
        '',
        ...answer.examples.map((c) => caseLine(answer.entry, c)),
        '',
        `Hidden tests (${answer.tests.length}):`,
        '',
        ...answer.tests.map((c) => caseLine(answer.entry, c))
      ];
    case 'open': {
      const limits = [answer.minWords, answer.maxWords].some(
        (n) => n !== undefined
      )
        ? `${answer.minWords ?? 0} to ${answer.maxWords ?? '∞'} words`
        : 'no word limit';
      const rules = answer.constraints?.map((c) => c.type).join(', ');
      return [
        `Open answer, ${limits}${rules ? `; checked rules: ${rules}` : ''}`,
        '',
        `Author note (shown after submitting): ${answer.authorNote}`
      ];
    }
  }
};

const solverLines = (p: Problem): string[] =>
  p.solver === undefined
    ? []
    : ['### Solver (recomputes the answer)', '', ...fence('js', p.solver), ''];

const section = (p: Problem): string =>
  [
    `## ${p.id} · ${AREA_CONFIG[p.area].label} · difficulty ${p.difficulty} · ${p.title}`,
    '',
    `Source: ${p.source.attribution ?? p.source.kind}`,
    '',
    '### Prompt',
    '',
    p.prompt,
    '',
    '### Answer',
    '',
    ...answerLines(p.answer),
    '',
    '### Hints',
    '',
    ...p.hints.map((h, i) => `${i + 1}. ${h}`),
    '',
    '### Solution',
    '',
    p.solution,
    '',
    ...solverLines(p),
    '---',
    ''
  ].join('\n');

const order = (p: Problem): string =>
  `${p.difficulty === 5 ? 'z' : AREAS.indexOf(p.area)}-${p.id.padStart(8, '0')}`;

/** One Markdown page for reading problems before approving them. */
export const renderReviewSheet = (problems: readonly Problem[]): string => {
  const sorted = [...problems].sort((a, b) => (order(a) < order(b) ? -1 : 1));
  const ids = sorted.map((p) => p.id).join(',');
  return [
    `# Problems to review (${sorted.length})`,
    '',
    'Fix anything wrong in the JSON file, then approve the ones you accept and reject the rest:',
    '',
    '```bash',
    `npm run content:approve -- --ids ${ids}`,
    '```',
    '',
    '```bash',
    'npm run content:reject -- --ids <ids you do not want>',
    '```',
    '',
    '---',
    '',
    ...sorted.map(section)
  ].join('\n');
};

export interface StatusChange {
  changed: Problem[];
  skipped: { id: string; reason: string }[];
}

const changeStatus = (
  problems: readonly Problem[],
  ids: readonly string[],
  decide: (p: Problem) => { next: Problem } | { reason: string }
): StatusChange => {
  const byId = new Map(problems.map((p) => [p.id, p]));
  const changed: Problem[] = [];
  const skipped: { id: string; reason: string }[] = [];
  for (const id of new Set(ids)) {
    const p = byId.get(id);
    if (!p) {
      skipped.push({ id, reason: 'unknown id' });
      continue;
    }
    const result = decide(p);
    if ('next' in result) changed.push(result.next);
    else skipped.push({ id, reason: result.reason });
  }
  return { changed, skipped };
};

/**
 * Moves the named verified problems to approved, re-running the checks first
 * so an edit made while reviewing cannot ship unchecked.
 */
export const approveProblems = (
  problems: readonly Problem[],
  ids: readonly string[],
  failuresFor: (p: Problem) => string[]
): StatusChange =>
  changeStatus(problems, ids, (p) => {
    if (p.status !== 'verified') return { reason: `status is ${p.status}` };
    const failures = failuresFor(p);
    return failures.length > 0
      ? { reason: `fails checks: ${failures.join('; ')}` }
      : { next: { ...p, status: 'approved' } };
  });

/**
 * Marks problems as rejected. The file stays, so generators never make the
 * same problem again. Published problems need the unpublish procedure.
 */
export const rejectProblems = (
  problems: readonly Problem[],
  ids: readonly string[]
): StatusChange =>
  changeStatus(problems, ids, (p) =>
    p.status === 'published' || p.status === 'rejected'
      ? { reason: `status is ${p.status}` }
      : { next: { ...p, status: 'rejected' } }
  );
