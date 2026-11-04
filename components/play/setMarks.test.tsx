import { describe, expect, it } from 'vitest';

import type { ProblemRecord } from '@/lib/state/schema';

import { doneMarks, toMarks } from './setMarks';

const record = (
  area: ProblemRecord['area'],
  status: ProblemRecord['status']
): ProblemRecord => ({
  area,
  status,
  attempts: 1,
  hints: 0,
  date: '2030-01-01',
  seconds: 30
});

const items = [
  { id: 'w', area: 'words' },
  { id: 'l', area: 'logic' },
  { id: 'm', area: 'math' }
] as const;

describe('toMarks', () => {
  it('marks finished problems by their record and the current one', () => {
    const records = { w: record('words', 'solved') };
    expect(toMarks(items, records, 1)).toEqual([
      { id: 'w', area: 'words', status: 'solved', current: false },
      { id: 'l', area: 'logic', status: 'open', current: true },
      { id: 'm', area: 'math', status: 'open', current: false }
    ]);
  });

  it('shows the current problem outcome before Next', () => {
    const records = {
      w: record('words', 'gave_up'),
      l: record('logic', 'failed')
    };
    const marks = toMarks(items, records, 1);
    expect(marks.map((m) => m.status)).toEqual(['gave_up', 'failed', 'open']);
    expect(marks[1].current).toBe(true);
  });

  it('ignores records for problems not reached yet', () => {
    const records = { m: record('math', 'solved') };
    expect(toMarks(items, records, 0)[2].status).toBe('open');
  });
});

describe('doneMarks', () => {
  it('has no current mark and takes areas from records', () => {
    const records = {
      a: record('words', 'solved'),
      b: record('logic', 'gave_up')
    };
    const marks = doneMarks(['a', 'b'], records);
    expect(marks.map((m) => [m.area, m.status, m.current])).toEqual([
      ['words', 'solved', false],
      ['logic', 'gave_up', false]
    ]);
  });

  it('falls back to slot order when a record is missing', () => {
    expect(doneMarks(['a', 'b'], {})[1]).toEqual({
      id: 'b',
      area: 'logic',
      status: 'open',
      current: false
    });
  });
});
