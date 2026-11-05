import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { clockHands } from './clock-hands';
import { answerOf, promptsOf } from './test-utils';

describe('math/clock-hands', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(clockHands)).toEqual([]);
  });

  it('matches times worked out by hand', () => {
    // 2:20: hour hand 60 + 10 = 70 degrees, minute hand 120: gap 50.
    expect(answerOf(clockHands, 'angle-2:20')).toBe(50);
    // 9:50: hour hand 270 + 25 = 295, minute hand 300: gap 5.
    expect(answerOf(clockHands, 'angle-9:50')).toBe(5);
  });

  it('counts overlaps and opposite hands the way a stopwatch would', () => {
    // Known: 11 overlaps in 12 hours, 22 in a day; 22 right angles in 12 hours.
    expect(answerOf(clockHands, 'count-together-12')).toBe(11);
    expect(answerOf(clockHands, 'count-together-24')).toBe(22);
    expect(answerOf(clockHands, 'count-right-angle-12')).toBe(22);
  });

  it('checks every angle by exact arithmetic in half degrees', () => {
    const angles = clockHands
      .candidates()
      .filter((c) => c.key.startsWith('angle-'));
    expect(angles.length).toBeGreaterThanOrEqual(10);
    for (const { key } of angles) {
      const [h, m] = key.slice('angle-'.length).split(':').map(Number);
      const hourHalf = ((h % 12) * 60 + m) % 720;
      const minuteHalf = 12 * m;
      const gap = Math.abs(hourHalf - minuteHalf);
      expect(answerOf(clockHands, key) * 2).toBe(Math.min(gap, 720 - gap));
    }
  });

  it('has enough candidates and varied stories', () => {
    expect(clockHands.candidates().length).toBeGreaterThanOrEqual(15);
    expect(promptsOf(clockHands, 'angle-2:20').size).toBeGreaterThan(1);
  });
});
