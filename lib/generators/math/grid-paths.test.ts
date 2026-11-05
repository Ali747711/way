import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { gridPaths } from './grid-paths';
import { answerOf, promptsOf } from './test-utils';

/** Counts monotone paths by walking every east/north word (independent of binomials). */
const countByWords = (
  east: number,
  north: number,
  blocked: [number, number][],
  mustPass?: [number, number]
): number => {
  const total = east + north;
  let count = 0;
  for (let mask = 0; mask < 1 << total; mask++) {
    let ones = 0;
    for (let i = 0; i < total; i++) if (mask & (1 << i)) ones++;
    if (ones !== east) continue;
    let x = 0;
    let y = 0;
    let ok = true;
    let passed = mustPass === undefined;
    for (let i = 0; i < total && ok; i++) {
      if (mask & (1 << i)) x++;
      else y++;
      if (blocked.some(([bx, by]) => bx === x && by === y)) ok = false;
      if (mustPass && mustPass[0] === x && mustPass[1] === y) passed = true;
    }
    if (ok && passed) count++;
  }
  return count;
};

const parsePoint = (text: string): [number, number] => {
  const [x, y] = text.split('.').map(Number);
  return [x, y];
};

describe('math/grid-paths', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(gridPaths)).toEqual([]);
  });

  it('matches a small grid counted by hand', () => {
    // 3 east, 2 north, must pass (1,1): 2 ways to reach it, 3 ways onward = 6.
    expect(countByWords(3, 2, [], [1, 1])).toBe(6);
  });

  it('agrees with a word-by-word count for every candidate', () => {
    const candidates = gridPaths.candidates();
    expect(candidates.length).toBeGreaterThanOrEqual(12);
    for (const { key } of candidates) {
      const [mode, size, a, b] = key.replace('avoid-two', 'two').split('-');
      const [east, north] = size.split('x').map(Number);
      const expected =
        mode === 'via'
          ? countByWords(east, north, [], parsePoint(a))
          : mode === 'avoid'
            ? countByWords(east, north, [parsePoint(a)])
            : mode === 'two'
              ? countByWords(east, north, [parsePoint(a), parsePoint(b)])
              : Number.NaN;
      expect(answerOf(gridPaths, key)).toBe(expected);
    }
  });

  it('varies the story', () => {
    const [{ key }] = gridPaths.candidates();
    expect(promptsOf(gridPaths, key).size).toBeGreaterThan(1);
  });
});
