import { AREA_CONFIG, DEEP_DIFFICULTY } from '@/lib/areas';
import { checkConstraints } from '@/lib/check/constraints';
import { countWords, normalizeText } from '@/lib/check/normalize';
import type { Problem } from '@/lib/content/schema';

export interface CheckFailure {
  check: string;
  message: string;
}

const fail = (check: string, message: string): CheckFailure => ({
  check,
  message
});

export const checkHintsAreQuestions = (p: Problem): CheckFailure[] =>
  p.hints.flatMap((hint, i) =>
    hint.trim().endsWith('?')
      ? []
      : [fail('hints-are-questions', `hint ${i} does not end with '?'`)]
  );

/** Normalized strings a hint must not contain (exact and choice answers). */
const hiddenTexts = (p: Problem): string[] => {
  const { answer } = p;
  if (answer.type === 'exact') {
    return answer.accepted.map((a) => normalizeText(a, 'trim-lower'));
  }
  if (answer.type === 'choice') {
    return [normalizeText(answer.options[answer.correctIndex], 'trim-lower')];
  }
  return [];
};

export const checkHintsHideAnswer = (p: Problem): CheckFailure[] => {
  const { answer } = p;
  const check = 'hints-hide-answer';
  if (answer.type === 'number') {
    const token = String(answer.value);
    return p.hints.flatMap((hint, i) =>
      (hint.match(/-?\d+(\.\d+)?/g) ?? ([] as string[])).includes(token)
        ? [fail(check, `hint ${i} contains the answer ${token}`)]
        : []
    );
  }
  const hidden = hiddenTexts(p);
  return p.hints.flatMap((hint, i) => {
    const text = normalizeText(hint, 'trim-lower');
    const leaked = hidden.find((h) => h !== '' && text.includes(h));
    return leaked === undefined
      ? []
      : [fail(check, `hint ${i} contains the answer '${leaked}'`)];
  });
};

export const checkDifficultyBand = (p: Problem): CheckFailure[] =>
  p.difficulty === DEEP_DIFFICULTY ||
  AREA_CONFIG[p.area].difficulty.includes(p.difficulty)
    ? []
    : [
        fail(
          'difficulty-band',
          `difficulty ${p.difficulty} is outside the ${p.area} band`
        )
      ];

export const checkWordList = (
  p: Problem,
  words: Set<string>
): CheckFailure[] => {
  if (p.area !== 'words' || p.answer.type !== 'exact') return [];
  const { accepted } = p.answer;
  const missing = new Set<string>();
  for (const answer of accepted) {
    for (const word of normalizeText(answer, 'trim-lower').split(' ')) {
      if (word !== '' && !words.has(word)) missing.add(word);
    }
  }
  return [...missing].map((word) =>
    fail('word-list', `'${word}' is not in the word list`)
  );
};

/**
 * A Create problem with checkable rules must carry an example answer that
 * follows them and fits the word limits, which proves the prompt is fair.
 */
export const checkOpenExample = (p: Problem): CheckFailure[] => {
  const { answer } = p;
  if (answer.type !== 'open') return [];
  const check = 'open-example';
  const { constraints = [], example, minWords, maxWords } = answer;
  if (example === undefined) {
    return constraints.length > 0
      ? [fail(check, 'constraints need an example answer that meets them')]
      : [];
  }
  const words = countWords(example);
  const limits: CheckFailure[] = [];
  if (minWords !== undefined && words < minWords) {
    limits.push(fail(check, `example has ${words} words, below ${minWords}`));
  }
  if (maxWords !== undefined && words > maxWords) {
    limits.push(fail(check, `example has ${words} words, above ${maxWords}`));
  }
  return [
    ...limits,
    ...checkConstraints(example, constraints).map((message) =>
      fail(check, `example ${message}`)
    )
  ];
};

export const runChecks = (
  p: Problem,
  ctx: { words: Set<string> }
): CheckFailure[] => [
  ...checkHintsAreQuestions(p),
  ...checkHintsHideAnswer(p),
  ...checkDifficultyBand(p),
  ...checkWordList(p, ctx.words),
  ...checkOpenExample(p)
];
