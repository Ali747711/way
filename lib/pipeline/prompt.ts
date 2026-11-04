import {
  AREA_CONFIG,
  DAILY_HINTS,
  DEEP_DIFFICULTY,
  DEEP_HINTS,
  DEEP_ID_PREFIX,
  type Area
} from '@/lib/areas';
import { problemObjectSchema, type Problem } from '@/lib/content/schema';

export interface GenerationRequest {
  area: Area;
  difficulty: number;
  count: number;
  examples: Problem[];
  existingTitles: string[];
  template: string;
}

/** What the model returns; ids, status, source and timestamps are assigned by the script. */
export const draftSchema = problemObjectSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  source: true
});

export const idPrefixFor = (area: Area, difficulty: number): string =>
  difficulty === DEEP_DIFFICULTY ? DEEP_ID_PREFIX : AREA_CONFIG[area].idPrefix;

export const nextId = (prefix: string, existingIds: string[]): string => {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const max = existingIds.reduce((highest, id) => {
    const match = pattern.exec(id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

const rules = (hintCount: number): string =>
  [
    '- Every hint is a question: each hint ends with a question mark.',
    '- A hint must never contain the answer, including as a number token (for example the digits of a numeric answer).',
    `- Give exactly ${hintCount} hints, ordered from a gentle nudge to a strong one.`,
    '- The solution shows the reasoning, not just the result.',
    '- Exact answers list every alternative accepted spelling in `accepted` where wording varies.',
    '- Number answers give `tolerance` only when it is needed.',
    '- Answers of type exact in the Words area, and all accepted words, must be real dictionary words.',
    '- Code answers give `signature` (a JavaScript function stub), `entry` (the function name), 1-3 `examples`, 4-8 `tests`, and a correct `reference` implementation.',
    '- Create answers give `minWords` and `maxWords` when useful, and an `authorNote` describing what a good response contains.',
    '- A `solver` (JavaScript that returns the answer) is required for number answers and welcome for exact ones.',
    '- Every prompt is self-contained and needs no outside knowledge.'
  ].join('\n');

const examplesBlock = (examples: Problem[]): string =>
  examples.length === 0
    ? 'No examples yet; follow the schema exactly.'
    : examples.map((example) => JSON.stringify(example, null, 2)).join('\n\n');

const titlesBlock = (titles: string[]): string =>
  titles.length === 0
    ? '(none)'
    : titles.map((title) => `- ${title}`).join('\n');

export const buildGenerationPrompt = (req: GenerationRequest): string => {
  const { area, difficulty, count } = req;
  const config = AREA_CONFIG[area];
  const hintCount = difficulty === DEEP_DIFFICULTY ? DEEP_HINTS : DAILY_HINTS;
  const kind = difficulty === DEEP_DIFFICULTY ? 'deep weekly' : 'daily';

  return [
    req.template.trim(),
    `## Target\nWrite ${kind} ${config.label} problems at difficulty ${difficulty} on a 1-5 scale. See the template above for what difficulty ${difficulty} means in this area.`,
    `## Rules\nThe automatic checks will reject a problem that breaks any rule below.\n${rules(hintCount)}`,
    `## Example problems\n${examplesBlock(req.examples)}`,
    `## Existing titles to avoid\nDo not reuse or closely imitate these titles or their ideas.\n${titlesBlock(req.existingTitles)}`,
    `## Output\nReturn exactly ${count} problems as a JSON array matching the schema, nothing else. Use area "${area}" and difficulty ${difficulty} for every problem. Do not include id, status, source or createdAt.`
  ].join('\n\n');
};
