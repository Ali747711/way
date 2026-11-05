import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { averageSpeed } from './average-speed';
import { answerOf, promptsOf } from './test-utils';

describe('math/average-speed', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(averageSpeed)).toEqual([]);
  });

  it('matches hand-computed round trips', () => {
    // 60 km each way: 60/6 + 60/12 = 15 hours for 120 km = 8 km/h.
    expect(answerOf(averageSpeed, 'average-6-12')).toBe(8);
    // 120 km each way: 3 h + 2 h = 5 h for 240 km = 48 km/h.
    expect(answerOf(averageSpeed, 'average-40-60')).toBe(48);
  });

  it('checks every candidate by total distance over total time', () => {
    const keys = averageSpeed.candidates().map((c) => c.key);
    expect(keys.length).toBeGreaterThanOrEqual(8);
    for (const key of keys) {
      const [, out, back] = key.split('-').map(Number);
      const time = 840 / out + 840 / back;
      expect((2 * 840) / time).toBeCloseTo(answerOf(averageSpeed, key), 9);
    }
  });

  it('has no return-speed question (that is m-005) and varies the story', () => {
    const keys = averageSpeed.candidates().map((c) => c.key);
    expect(keys.every((k) => k.startsWith('average-'))).toBe(true);
    expect(promptsOf(averageSpeed, 'average-20-30').size).toBeGreaterThan(1);
  });

  it('never gives a runner a speed above 15 km/h', () => {
    for (const { key } of averageSpeed.candidates()) {
      for (let seed = 1; seed <= 8; seed++) {
        const [, out, back] = key.split('-').map(Number);
        const prompt = [...promptsOf(averageSpeed, key)].join('\n');
        if (Math.max(out, back) > 15) expect(prompt).not.toContain('runner');
      }
    }
  });
});
