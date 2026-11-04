import { describe, expect, it } from 'vitest';

import {
  areaCaption,
  areaTone,
  daysSinceExercised,
  isSetDone,
  setSummary
} from './selectors';
import type { ProblemRecord, WayState } from './schema';

const rec = (over: Partial<ProblemRecord>): ProblemRecord => ({
  area: 'words',
  status: 'solved',
  attempts: 0,
  hints: 0,
  date: '2030-01-01',
  seconds: 10,
  ...over
});

const session = (index: number) => ({
  key: 'k',
  index,
  current: {
    attempts: 0,
    hints: 0,
    draft: '',
    startedAt: 0,
    result: null
  }
});

describe('isSetDone', () => {
  it('is false for no session', () => {
    expect(isSetDone(null, 5)).toBe(false);
  });
  it('is false before the end and true at the end', () => {
    expect(isSetDone(session(4), 5)).toBe(false);
    expect(isSetDone(session(5), 5)).toBe(true);
  });
});

describe('setSummary', () => {
  it('only counts the given ids', () => {
    const records: WayState['records'] = {
      a: rec({ status: 'solved', hints: 1, seconds: 20 }),
      b: rec({ status: 'gave_up', hints: 2, seconds: 30 }),
      c: rec({ status: 'solved', hints: 9, seconds: 99 })
    };
    expect(setSummary(records, ['a', 'b', 'missing'])).toEqual({
      solved: 1,
      total: 3,
      hints: 3,
      seconds: 50
    });
  });
});

describe('daysSinceExercised', () => {
  it('is null when the area has no records', () => {
    expect(daysSinceExercised({}, 'words', '2030-01-10')).toBeNull();
    expect(
      daysSinceExercised({ a: rec({ area: 'math' }) }, 'words', '2030-01-10')
    ).toBeNull();
  });
  it('is 0 for a record today', () => {
    expect(
      daysSinceExercised(
        { a: rec({ date: '2030-01-10' }) },
        'words',
        '2030-01-10'
      )
    ).toBe(0);
  });
  it('takes the minimum across the area records', () => {
    const records = {
      a: rec({ date: '2030-01-01' }),
      b: rec({ date: '2030-01-07' }),
      c: rec({ date: '2030-01-09', area: 'math' })
    };
    expect(daysSinceExercised(records, 'words', '2030-01-10')).toBe(3);
  });
});

describe('areaTone', () => {
  it.each([
    [0, 'fresh'],
    [1, 'recent'],
    [2, 'recent'],
    [3, 'fading'],
    [6, 'fading'],
    [7, 'quiet'],
    [null, 'quiet']
  ] as const)('maps %s to %s', (days, tone) => {
    expect(areaTone(days)).toBe(tone);
  });
});

describe('areaCaption', () => {
  it('formats all four forms', () => {
    expect(areaCaption(0)).toBe('last: today');
    expect(areaCaption(1)).toBe('last: 1 day ago');
    expect(areaCaption(5)).toBe('last: 5 days ago');
    expect(areaCaption(null)).toBe('never');
  });
});
