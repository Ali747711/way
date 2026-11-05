import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { answerFor, trailingZeros } from './trailing-zeros';
import { answerOf, promptsOf } from './test-utils';

const zerosOfBig = (value: bigint): number => {
  const text = value.toString();
  return text.length - text.replace(/0+$/, '').length;
};
const product = (terms: number[]): bigint =>
  terms.reduce((acc, t) => acc * BigInt(t), BigInt(1));
const range = (from: number, to: number, step = 1): number[] =>
  Array.from(
    { length: Math.floor((to - from) / step) + 1 },
    (_, i) => from + i * step
  );

describe('math/trailing-zeros', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(trailingZeros)).toEqual([]);
  });

  it('matches small cases computed by hand', () => {
    // 10! = 3628800 (2 zeros); 25! has 5 + 1 = 6 fives.
    expect(answerFor({ mode: 'factorial', n: 10 })).toBe(2);
    expect(answerFor({ mode: 'factorial', n: 25 })).toBe(6);
    // 2 x 4 x 6 x 8 x 10 = 3840: one zero. 5 x 10 x 15 x 20 = 15000: three.
    expect(answerFor({ mode: 'evens', n: 5 })).toBe(1);
    expect(answerFor({ mode: 'fives', n: 4 })).toBe(3);
  });

  it('agrees with exact BigInt products for every candidate', () => {
    for (const { key } of trailingZeros.candidates()) {
      const [mode, nText] = key.split('-');
      const n = Number(nText);
      const answer = answerOf(trailingZeros, key);
      if (mode === 'factorial') {
        expect(zerosOfBig(product(range(1, n)))).toBe(answer);
      } else if (mode === 'evens') {
        expect(zerosOfBig(product(range(2, 2 * n, 2)))).toBe(answer);
      } else if (mode === 'fives') {
        expect(zerosOfBig(product(range(5, 5 * n, 5)))).toBe(answer);
      } else {
        expect(zerosOfBig(product(range(1, answer)))).toBe(n);
        expect(zerosOfBig(product(range(1, answer - 1)))).not.toBe(n);
        for (let m = 1; m < answer; m++) {
          expect(zerosOfBig(product(range(1, m)))).not.toBe(n);
        }
      }
    }
  });

  it('has enough candidates and varied stories', () => {
    expect(trailingZeros.candidates().length).toBeGreaterThanOrEqual(20);
    expect(promptsOf(trailingZeros, 'factorial-55').size).toBeGreaterThan(1);
  });
});
