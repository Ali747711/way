import { describe, expect, it } from 'vitest';

import type { Area } from '@/lib/areas';
import type { Problem, Schedule } from '@/lib/content/schema';

import { addDays, buildSchedule } from './schedule';

interface Spec {
  id: string;
  area: Area;
  difficulty: number;
  status?: Problem['status'];
}

const makeProblem = ({
  id,
  area,
  difficulty,
  status = 'approved'
}: Spec): Problem => ({
  id,
  area,
  difficulty,
  title: id,
  prompt: 'Prompt?',
  answer: { type: 'exact', accepted: ['x'], normalize: 'trim-lower' },
  hints: Array.from(
    { length: difficulty === 5 ? 5 : 3 },
    (_, i) => `Hint ${i}?`
  ),
  solution: 'Because.',
  source: { kind: 'original' },
  status,
  tags: [],
  createdAt: '2026-11-04'
});

const day = (n: number): Problem[] => {
  const s = String(n);
  return [
    makeProblem({ id: `w-${s}`, area: 'words', difficulty: 1 }),
    makeProblem({ id: `l-${s}`, area: 'logic', difficulty: 2 }),
    makeProblem({ id: `m-${s}`, area: 'math', difficulty: 3 }),
    makeProblem({ id: `c-${s}`, area: 'code', difficulty: 4 }),
    makeProblem({ id: `cr-${s}`, area: 'create', difficulty: 3 })
  ];
};

const deep = (id: string): Problem =>
  makeProblem({ id, area: 'logic', difficulty: 5 });

const empty: Schedule = { days: {}, weeks: {} };

describe('buildSchedule', () => {
  it('fills a day in area order from approved problems with lowest ids first', () => {
    const problems = [...day(2), ...day(1), deep('d-1')];
    const { schedule, used, shortages } = buildSchedule(
      problems,
      empty,
      '2030-01-01',
      1
    );
    expect(shortages).toEqual([]);
    expect(schedule.days['2030-01-01']).toEqual({
      words: 'w-1',
      logic: 'l-1',
      math: 'm-1',
      code: 'c-1',
      create: 'cr-1'
    });
    expect(used).toEqual(['w-1', 'l-1', 'm-1', 'c-1', 'cr-1', 'd-1']);
  });

  it('never reuses a problem already in the existing schedule', () => {
    const existing: Schedule = {
      days: {
        '2029-12-31': {
          words: 'w-1',
          logic: 'l-1',
          math: 'm-1',
          code: 'c-1',
          create: 'cr-1'
        }
      },
      weeks: { '2030-W01': 'd-1' }
    };
    const problems = [...day(1), ...day(2), deep('d-1'), deep('d-2')];
    const { schedule, used } = buildSchedule(
      problems,
      existing,
      '2030-01-01',
      1
    );
    expect(schedule.days['2030-01-01']?.words).toBe('w-2');
    expect(used).not.toContain('w-1');
    expect(used).not.toContain('d-1');
    expect(existing.days).toHaveProperty(['2029-12-31']);
    expect(Object.keys(existing.days)).toHaveLength(1);
  });

  it('reports a shortage per missing area and leaves that date out', () => {
    const problems = day(1).filter(
      (p) => p.area !== 'math' && p.area !== 'code'
    );
    const { schedule, used, shortages } = buildSchedule(
      problems,
      empty,
      '2030-01-01',
      1
    );
    expect(schedule.days).toEqual({});
    expect(used).toEqual([]);
    const dayShortages = shortages.filter((s) => s.date === '2030-01-01');
    expect(dayShortages.map((s) => s.area)).toEqual(['math', 'code']);
  });

  it('releases picks from a skipped date back to the pool', () => {
    // Day 2 picks w-2 then fails on logic; w-2 must not count as used.
    const problems = [
      ...day(1),
      makeProblem({ id: 'w-2', area: 'words', difficulty: 1 }),
      deep('d-1')
    ];
    const { schedule, used, shortages } = buildSchedule(
      problems,
      empty,
      '2030-01-01',
      2
    );
    expect(Object.keys(schedule.days)).toEqual(['2030-01-01']);
    expect(used).not.toContain('w-2');
    expect(shortages.filter((s) => s.date === '2030-01-02')).toHaveLength(4);
  });

  it('schedules one difficulty-5 problem per ISO week', () => {
    const problems = [
      ...day(1),
      ...day(2),
      ...day(3),
      deep('d-2'),
      deep('d-1')
    ];
    // 2030-01-06 is a Sunday (W01); 2030-01-07 is a Monday (W02).
    const { schedule, shortages } = buildSchedule(
      problems,
      empty,
      '2030-01-06',
      2
    );
    expect(shortages).toEqual([]);
    expect(schedule.weeks).toEqual({ '2030-W01': 'd-1', '2030-W02': 'd-2' });
  });

  it('records a week shortage when no deep problem remains', () => {
    const { shortages } = buildSchedule(day(1), empty, '2030-01-01', 1);
    expect(shortages).toHaveLength(1);
    expect(shortages[0].week).toBe('2030-W01');
  });

  it('skips dates already scheduled', () => {
    const existing: Schedule = {
      days: {
        '2030-01-01': {
          words: 'w-0',
          logic: 'l-0',
          math: 'm-0',
          code: 'c-0',
          create: 'cr-0'
        }
      },
      weeks: {}
    };
    const problems = [...day(1), ...day(2), deep('d-1')];
    const { schedule, shortages } = buildSchedule(
      problems,
      existing,
      '2030-01-01',
      2
    );
    expect(shortages).toEqual([]);
    expect(schedule.days['2030-01-01']?.words).toBe('w-0');
    expect(schedule.days['2030-01-02']?.words).toBe('w-1');
  });

  it('ignores draft and verified problems', () => {
    const problems = day(1).map((p, i) => ({
      ...p,
      status: i % 2 === 0 ? ('draft' as const) : ('verified' as const)
    }));
    const { schedule, used, shortages } = buildSchedule(
      problems,
      empty,
      '2030-01-01',
      1
    );
    expect(schedule.days).toEqual({});
    expect(used).toEqual([]);
    expect(shortages.filter((s) => s.date)).toHaveLength(5);
  });
});

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2030-01-31', 1)).toBe('2030-02-01');
    expect(addDays('2030-12-31', 1)).toBe('2031-01-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2030-03-01', -1)).toBe('2030-02-28');
  });
});
