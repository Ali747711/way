import type { ProblemDraft } from '../family';
import { createRng } from '../rng';
import type { Rng } from '../rng';

export const gcd = (x: number, y: number): number =>
  y === 0 ? x : gcd(y, x % y);

export const lcm = (x: number, y: number): number => (x / gcd(x, y)) * y;

/** A fraction reduced to lowest terms. */
export const reduce = (p: number, q: number): { p: number; q: number } => {
  const g = gcd(p, q);
  return { p: p / g, q: q / g };
};

/** n choose k for small n, by the multiplicative formula (exact below 2^53). */
export const choose = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 1; i <= k; i++) result = (result * (n - k + i)) / i;
  return Math.round(result);
};

export const numberAnswer = (value: number) => ({
  type: 'number' as const,
  value,
  tolerance: 0
});

/** Whole numbers written in a text, as strings (so 007 and 7 differ). */
const numbersIn = (text: string): string[] => text.match(/\d+/g) ?? [];

/** True when the answer appears as a number in the prompt or in a hint. */
export const leaksAnswer = (draft: ProblemDraft): boolean => {
  if (draft.answer.type !== 'number') return false;
  const token = String(draft.answer.value);
  return [draft.prompt, ...draft.hints].some((text) =>
    numbersIn(text).includes(token)
  );
};

const STORY_SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Keeps only parameter sets whose problem never shows its own answer, whichever
 * story variant the rng picks.
 */
export const keepFair = <P>(
  items: readonly P[],
  build: (params: P, rng: Rng) => ProblemDraft
): P[] =>
  items.filter(
    (params) =>
      !STORY_SEEDS.some((seed) => leaksAnswer(build(params, createRng(seed))))
  );

const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** A whole number as superscript digits, so powers read 2³⁰ and not 2^30. */
export const sup = (n: number): string =>
  String(n).replace(/\d/g, (d) => SUPERSCRIPT_DIGITS[Number(d)]);
