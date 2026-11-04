import { describe, expect, it } from 'vitest';

import { daysBetween, isoWeekKey, toLocalDate } from './localDate';

describe('localDate helpers', () => {
  it('formats a local date without timezone shift', () => {
    expect(toLocalDate(new Date(2030, 0, 1, 23, 59))).toBe('2030-01-01');
  });

  it('computes ISO week keys', () => {
    expect(isoWeekKey('2030-01-01')).toBe('2030-W01');
    expect(isoWeekKey('2027-01-01')).toBe('2026-W53');
    expect(isoWeekKey('2026-11-04')).toBe('2026-W45');
  });

  it('counts calendar days', () => {
    expect(daysBetween('2030-01-01', '2030-01-04')).toBe(3);
    expect(daysBetween('2030-01-04', '2030-01-01')).toBe(-3);
  });
});
