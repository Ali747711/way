// Test helper only: imported from *.test.ts files, never from app code.
import type { Family, ProblemDraft } from '../family';
import { createRng } from '../rng';

export const draftFor = (
  family: Family,
  key: string,
  seed = 1
): ProblemDraft => {
  const candidate = family.candidates().find((c) => c.key === key);
  if (candidate === undefined) throw new Error(`no candidate ${key}`);
  return candidate.build(createRng(seed));
};

export const answerOf = (family: Family, key: string): number => {
  const { answer } = draftFor(family, key);
  if (answer.type !== 'number') throw new Error('not a number answer');
  return answer.value;
};

export const titlesOf = (family: Family, key: string): Set<string> =>
  new Set([1, 2, 3, 4, 5, 6, 7, 8].map((s) => draftFor(family, key, s).title));

export const promptsOf = (family: Family, key: string): Set<string> =>
  new Set([1, 2, 3, 4, 5, 6, 7, 8].map((s) => draftFor(family, key, s).prompt));
