import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { answerFor, dominoTilings } from './domino-tilings';
import { answerOf, promptsOf } from './test-utils';

/** Counts tilings of a 3 x n board whose columns cannot be separated by a clean vertical line. */
const countTilings = (n: number, uncuttableOnly: boolean): number => {
  const filled = new Array<boolean>(3 * n).fill(false);
  // crossings[c] is true if some horizontal domino crosses the line after column c.
  const crossings = new Array<number>(n).fill(0);
  const go = (position: number): number => {
    while (position < filled.length && filled[position]) position++;
    if (position === filled.length) {
      return !uncuttableOnly || crossings.slice(0, n - 1).every((c) => c > 0)
        ? 1
        : 0;
    }
    const col = Math.floor(position / 3);
    const row = position % 3;
    let ways = 0;
    filled[position] = true;
    if (col + 1 < n && !filled[position + 3]) {
      filled[position + 3] = true;
      crossings[col]++;
      ways += go(position + 1);
      crossings[col]--;
      filled[position + 3] = false;
    }
    if (row + 1 < 3 && !filled[position + 1]) {
      filled[position + 1] = true;
      ways += go(position + 1);
      filled[position + 1] = false;
    }
    filled[position] = false;
    return ways;
  };
  return go(0);
};

describe('math/domino-tilings', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(dominoTilings)).toEqual([]);
  });

  it('matches the known small counts', () => {
    expect(answerFor({ n: 2 })).toBe(3);
    expect(answerFor({ n: 4 })).toBe(11);
    expect(answerFor({ n: 6 })).toBe(41);
    expect(answerOf(dominoTilings, '3x8')).toBe(153);
  });

  it('confirms the solution claims: 3 uncuttable tilings of width 2, 2 of each larger width', () => {
    expect(countTilings(2, true)).toBe(3);
    for (const width of [4, 6, 8, 10]) {
      expect(countTilings(width, true)).toBe(2);
    }
  });

  it('agrees with a direct count for every candidate width up to 12', () => {
    const keys = dominoTilings.candidates().map((c) => c.key);
    expect(keys.length).toBeGreaterThanOrEqual(3);
    for (const key of keys) {
      const n = Number(key.slice(2));
      if (n <= 12) {
        expect(answerOf(dominoTilings, key)).toBe(countTilings(n, false));
      }
    }
  });

  it('varies the story', () => {
    expect(promptsOf(dominoTilings, '3x8').size).toBeGreaterThan(1);
  });
});
