import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { answerFor, couponCollector } from './coupon-collector';
import { answerOf, promptsOf } from './test-utils';

/** Independent method: follow the chance of each set of seen colours draw by draw. */
const byDistribution = (counts: number[]): number => {
  const m = counts.reduce((a, b) => a + b, 0);
  const full = (1 << counts.length) - 1;
  let state = new Array<number>(full + 1).fill(0);
  state[0] = 1;
  let average = 0;
  for (let draw = 0; draw < 20000; draw++) {
    const notDone = 1 - state[full];
    average += notDone;
    if (notDone < 1e-15) break;
    const next = new Array<number>(full + 1).fill(0);
    for (let mask = 0; mask <= full; mask++) {
      if (mask === full) {
        next[mask] += state[mask];
        continue;
      }
      counts.forEach((w, i) => {
        next[mask | (1 << i)] += state[mask] * (w / m);
      });
    }
    state = next;
  }
  for (let q = 1; q <= 5000; q++) {
    const p = Math.round(average * q);
    if (Math.abs(average - p / q) < 1e-9) return p + q;
  }
  return Number.NaN;
};

describe('math/coupon-collector', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(couponCollector)).toEqual([]);
  });

  it('matches hand-computed values', () => {
    // 2 red, 1 blue, 1 green: 10 - 14/3 + 1 = 19/3, so 22.
    expect(answerFor({ counts: [2, 1, 1] })).toBe(22);
    expect(answerOf(couponCollector, '2-1-1')).toBe(22);
    // 3 red, 1 blue, 1 green: 35/3 - 5 + 1 = 23/3, so 26.
    expect(answerFor({ counts: [3, 1, 1] })).toBe(26);
    // Equal chances reduce to the usual sum: 3 colours, 1 each: 11/2.
    expect(answerFor({ counts: [1, 1, 1] })).toBe(13);
  });

  it('agrees with the draw-by-draw distribution for every candidate', () => {
    const keys = couponCollector.candidates().map((c) => c.key);
    expect(keys.length).toBeGreaterThanOrEqual(4);
    for (const key of keys) {
      const counts = key.split('-').map(Number);
      expect(answerOf(couponCollector, key)).toBe(byDistribution(counts));
    }
  });

  it('varies the story', () => {
    expect(promptsOf(couponCollector, '2-1-1').size).toBeGreaterThan(1);
  });
});
