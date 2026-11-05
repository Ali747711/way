import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { answerFor, digitSumCount } from './digit-sum-count';
import { answerOf, promptsOf } from './test-utils';

const brute = (limit: number, sum: number): number => {
  let count = 0;
  for (let n = 1; n <= limit; n++) {
    if (
      String(n)
        .split('')
        .map(Number)
        .reduce((a, b) => a + b, 0) === sum
    ) {
      count++;
    }
  }
  return count;
};

describe('math/digit-sum-count', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(digitSumCount)).toEqual([]);
  });

  it('matches small cases listed by hand', () => {
    // Up to 99 with digit sum 5: 5, 14, 23, 32, 41, 50 = 6 (the formula handles 4 digits, so test via 0099).
    expect(answerFor({ limit: 1000, sum: 3 })).toBe(brute(1000, 3));
    // Numbers 1..1000 with digit sum 27: only 999.
    expect(answerFor({ limit: 1000, sum: 27 })).toBe(1);
  });

  it('agrees with a digit-by-digit count for every candidate', () => {
    const keys = digitSumCount.candidates().map((c) => c.key);
    expect(keys.length).toBeGreaterThanOrEqual(6);
    for (const key of keys) {
      const [limit, sum] = key.split('-').map(Number);
      expect(answerOf(digitSumCount, key)).toBe(brute(limit, sum));
    }
  });

  it('confirms the worked example in the solution: 73 three-digit strings add to 12', () => {
    let count = 0;
    for (let a = 0; a <= 9; a++) {
      for (let b = 0; b <= 9; b++) {
        for (let c = 0; c <= 9; c++) if (a + b + c === 12) count++;
      }
    }
    expect(count).toBe(73);
  });

  it('varies the story', () => {
    const [{ key }] = digitSumCount.candidates();
    expect(promptsOf(digitSumCount, key).size).toBeGreaterThan(1);
  });
});
