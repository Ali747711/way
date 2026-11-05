import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { diceEvents } from './dice-events';
import { answerOf, promptsOf } from './test-utils';

describe('math/dice-events', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(diceEvents)).toEqual([]);
  });

  it('matches hand-computed answers for every event', () => {
    // Favourable outcomes out of 36, reduced, then p + q.
    const table: Record<string, number> = {
      'one-is-double': 7, // 6/36 = 1/6
      'sum-square': 43, // totals 4 and 9: 3 + 4 = 7 ways, 7/36
      'product-multiple-of-2': 7, // 36 - 9 = 27, 3/4
      'product-multiple-of-3': 14, // 36 - 16 = 20, 5/9
      'product-multiple-of-5': 47, // 36 - 25 = 11
      'some-die-at-least-3': 17, // 36 - 4 = 32, 8/9
      'some-die-at-least-4': 7, // 36 - 9 = 27, 3/4
      'some-die-at-least-5': 14, // 36 - 16 = 20, 5/9
      'some-die-at-least-6': 47, // 36 - 25 = 11
      'difference-at-most-1': 13, // 6 + 10 = 16, 4/9
      'difference-at-most-2': 5, // 16 + 8 = 24, 2/3
      'sum-multiple-of-4': 5, // 3 + 5 + 1 = 9, 1/4
      'sum-multiple-of-5': 43, // 4 + 3 = 7
      'second-multiple-of-first': 25, // 6+3+2+1+1+1 = 14, 7/18
      'sum-beats-product': 47, // a 1 on either die: 11
      'square-product': 11, // 1+3+1+1+1+1 = 8, 2/9
      coprime: 59 // 36 - 13 = 23
    };
    const keys = diceEvents.candidates().map((c) => c.key);
    expect(keys.length).toBeGreaterThanOrEqual(12);
    for (const key of keys) {
      expect(table[key], key).toBeDefined();
      expect(answerOf(diceEvents, key), key).toBe(table[key]);
    }
  });

  it('has several candidates and varied wording', () => {
    const keys = diceEvents.candidates().map((c) => c.key);
    expect(keys.length).toBeGreaterThanOrEqual(10);
    expect(promptsOf(diceEvents, keys[0]).size).toBeGreaterThan(1);
  });
});
