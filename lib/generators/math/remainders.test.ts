import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { remainders } from './remainders';
import { answerOf, promptsOf } from './test-utils';

const parse = (key: string) => {
  const [moduli, rems, above] = key.split('-');
  return {
    moduli: moduli.split('.').map(Number),
    remainders: rems.split('.').map(Number),
    above: Number(above)
  };
};

/** Brute check: counts upward and confirms the answer is the first match. */
const firstMatch = (key: string): number => {
  const { moduli, remainders: rems, above } = parse(key);
  for (let n = above + 1; ; n++) {
    if (moduli.every((m, i) => n % m === rems[i])) return n;
  }
};

describe('math/remainders', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(remainders)).toEqual([]);
  });

  it('matches a small case worked by hand', () => {
    // Groups of 4, 5, 6 leaving 3, 4, 5: one short each time, lcm 60, so 59.
    expect(answerOf(remainders, '4.5.6-3.4.5-0')).toBe(59);
    // 53 = 2 mod 3, 1 mod 4, 3 mod 5.
    expect(answerOf(remainders, '3.4.5-2.1.3-0')).toBe(53);
  });

  it('is always the first number that satisfies every condition', () => {
    const candidates = remainders.candidates();
    expect(candidates.length).toBeGreaterThanOrEqual(10);
    for (const { key } of candidates) {
      expect(answerOf(remainders, key)).toBe(firstMatch(key));
    }
  });

  it('varies the story', () => {
    expect(promptsOf(remainders, '4.5.6-3.4.5-0').size).toBeGreaterThan(1);
  });
});
