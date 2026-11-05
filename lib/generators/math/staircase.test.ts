import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { staircase } from './staircase';
import { answerOf, promptsOf } from './test-utils';

describe('math/staircase', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(staircase)).toEqual([]);
  });

  it('matches small cases listed by hand', () => {
    // 4 steps with 1 or 2: 1111, 112, 121, 211, 22 = 5 (so 7 steps = 21).
    expect(answerOf(staircase, 'plain-7')).toBe(21);
    // Tribonacci: 1, 1, 2, 4, 7, 13, 24 for 0..6 steps.
    expect(answerOf(staircase, 'three-6')).toBe(24);
  });

  it('counts climbs that avoid the broken step by enumerating them', () => {
    // Independent method: list every step-landing set explicitly as a
    // subset of the steps that must include n and avoid the broken one.
    const countBySubsets = (n: number, broken: number): number => {
      let count = 0;
      for (let mask = 0; mask < 1 << (n - 1); mask++) {
        const landings = [0];
        for (let step = 1; step < n; step++) {
          if (mask & (1 << (step - 1))) landings.push(step);
        }
        landings.push(n);
        const gapsOk = landings.every(
          (v, i) => i === 0 || v - landings[i - 1] <= 2
        );
        if (gapsOk && !landings.includes(broken)) count++;
      }
      return count;
    };
    const brokenKeys = staircase
      .candidates()
      .filter((c) => c.key.startsWith('broken-'));
    expect(brokenKeys.length).toBeGreaterThanOrEqual(6);
    for (const { key } of brokenKeys) {
      const [, n, broken] = key.split('-').map(Number);
      expect(answerOf(staircase, key)).toBe(countBySubsets(n, broken));
    }
  });

  it('has enough candidates and varied stories', () => {
    expect(staircase.candidates().length).toBeGreaterThanOrEqual(15);
    expect(promptsOf(staircase, 'plain-7').size).toBeGreaterThan(1);
  });
});
