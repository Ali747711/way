import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { workRates } from './work-rates';
import { answerOf, promptsOf } from './test-utils';

describe('math/work-rates', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(workRates)).toEqual([]);
  });

  it('matches hand-computed rates', () => {
    // 1/12 + 1/6 = 3/12 = 1/4 per hour.
    expect(answerOf(workRates, 'together-12-6')).toBe(4);
    // 1/10 + 1/15 + 1/30 = 6/30 = 1/5.
    expect(answerOf(workRates, 'three-10-15-30')).toBe(5);
    // 1/4 - 1/6 = 1/12 per hour leaks away.
    expect(answerOf(workRates, 'leak-4-6')).toBe(12);
  });

  it('puts the answer back in: the combined rate fills exactly one job', () => {
    const candidates = workRates.candidates();
    expect(candidates.length).toBeGreaterThanOrEqual(15);
    for (const { key } of candidates) {
      const [mode, ...rest] = key.split('-');
      const times = rest.map(Number);
      const answer = answerOf(workRates, key);
      if (mode === 'leak') {
        const [fill, net] = times;
        // After `net` hours with the leak, exactly one tank is held.
        expect(net / fill - net / answer).toBeCloseTo(1, 9);
      } else {
        const done = times.reduce((sum, t) => sum + answer / t, 0);
        expect(done).toBeCloseTo(1, 9);
      }
    }
  });

  it('varies the story', () => {
    expect(promptsOf(workRates, 'together-12-6').size).toBeGreaterThan(1);
  });
});
