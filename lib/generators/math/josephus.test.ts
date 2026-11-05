import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { answerFor, josephus } from './josephus';
import { answerOf, promptsOf } from './test-utils';

/** Independent method: the standard recurrence J(1) = 0, J(n) = (J(n-1) + 2) mod n. */
const winnerByRecurrence = (n: number): number => {
  let position = 0;
  for (let size = 2; size <= n; size++) position = (position + 2) % size;
  return position + 1;
};

describe('math/josephus', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(josephus)).toEqual([]);
  });

  it('matches circles worked out by hand', () => {
    // 5 people: 2 leaves, 4 leaves, 1 leaves (counting on from 5), 5 leaves: 3 stays.
    expect(answerFor({ limit: 5 })).toBe(1 + 1 + 3 + 1 + 3);
    // W(1..7) = 1, 1, 3, 1, 3, 5, 7: sum 21.
    expect(answerFor({ limit: 7 })).toBe(21);
  });

  it('agrees with the modular recurrence for every candidate', () => {
    const candidates = josephus.candidates();
    expect(candidates.length).toBeGreaterThanOrEqual(5);
    for (const { key } of candidates) {
      const n = Number(key.split('-')[1]);
      const expected = Array.from({ length: n }, (_, i) =>
        winnerByRecurrence(i + 1)
      ).reduce((a, b) => a + b, 0);
      expect(answerOf(josephus, key)).toBe(expected);
    }
  });

  it('matches a verified total for 200 circles', () => {
    expect(answerFor({ limit: 200 })).toBe(10790);
  });

  it('varies the story', () => {
    expect(promptsOf(josephus, 'sum-100').size).toBeGreaterThan(1);
  });
});
