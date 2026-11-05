import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { answerOf } from './test-utils';

import { answerFor, lastDigitPowers } from './last-digit-powers';

describe('math/last-digit-powers', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(lastDigitPowers)).toEqual([]);
  });

  it('matches hand-computed small powers', () => {
    // 7^3 = 343 and 3^2 = 9: 3 + 9 = 12, last digit 2.
    expect(
      answerFor({
        terms: [
          [7, 3],
          [3, 2]
        ]
      })
    ).toBe(2);
    // 2^4 = 16, 4^5 = 1024, 9^3 = 729: 6 + 4 + 9 = 19.
    expect(
      answerFor({
        terms: [
          [2, 4],
          [4, 5],
          [9, 3]
        ]
      })
    ).toBe(9);
  });

  it('agrees with BigInt arithmetic on every candidate', () => {
    const lastDigitBig = (b: number, e: number): number => {
      let r = BigInt(1);
      for (let i = 0; i < e; i++) r = (r * BigInt(b)) % BigInt(10);
      return Number(r);
    };
    const keys = lastDigitPowers.candidates().map((c) => c.key);
    expect(keys.length).toBeGreaterThanOrEqual(8);
    for (const key of keys) {
      const sum = key
        .split('-')
        .map((part) => part.split('p').map(Number))
        .reduce((acc, [b, e]) => acc + lastDigitBig(b, e), 0);
      expect(answerOf(lastDigitPowers, key)).toBe(sum % 10);
    }
  });
});
