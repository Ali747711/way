import { describe, expect, it } from 'vitest';

import { AREAS, type Area } from '@/lib/areas';

import { AssembleError, assembleDay, assembleWeek } from './assemble';
import type { Problem, Schedule } from './schema';

const IDS: Record<Area, string> = {
  words: 'w-001',
  logic: 'l-001',
  math: 'm-001',
  code: 'c-001',
  create: 'cr-001'
};

function makeProblem(
  id: string,
  area: Problem['area'],
  overrides: Partial<Problem> = {}
): Problem {
  return {
    id,
    area,
    difficulty: 1,
    title: `Title ${id}`,
    prompt: 'Prompt',
    answer: { type: 'exact', accepted: ['x'], normalize: 'trim-lower' },
    hints: ['a', 'b', 'c'],
    solution: 'Solution',
    source: { kind: 'original' },
    status: 'published',
    tags: [],
    createdAt: '2030-01-01',
    ...overrides
  };
}

function makeById(overrides: Record<string, Partial<Problem>> = {}) {
  const byId = new Map<string, Problem>();
  for (const area of AREAS) {
    byId.set(IDS[area], makeProblem(IDS[area], area, overrides[IDS[area]]));
  }
  byId.set(
    'd-001',
    makeProblem('d-001', 'logic', {
      difficulty: 5,
      hints: ['1', '2', '3', '4', '5'],
      ...overrides['d-001']
    })
  );
  return byId;
}

const schedule: Schedule = {
  // Deliberately not in AREAS order to prove ordering comes from AREAS.
  days: {
    '2030-01-01': {
      create: IDS.create,
      code: IDS.code,
      math: IDS.math,
      logic: IDS.logic,
      words: IDS.words
    }
  },
  weeks: { '2030-W01': 'd-001' }
};

describe('assembleDay', () => {
  it('assembles a day in area order', () => {
    const day = assembleDay(schedule, makeById(), '2030-01-01');
    expect(day.date).toBe('2030-01-01');
    expect(day.problems.map((p) => p.area)).toEqual([...AREAS]);
  });

  it('throws naming every missing id', () => {
    const byId = makeById();
    byId.delete('w-001');
    byId.delete('m-001');
    let error: unknown;
    try {
      assembleDay(schedule, byId, '2030-01-01');
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(AssembleError);
    expect((error as AssembleError).problems).toEqual(['w-001', 'm-001']);
    expect((error as Error).message).toContain('w-001');
    expect((error as Error).message).toContain('m-001');
  });

  it('throws when the whole bank is empty', () => {
    expect(() => assembleDay(schedule, new Map(), '2030-01-01')).toThrow(
      AssembleError
    );
  });

  it('throws when a problem is not published', () => {
    const byId = makeById({ 'l-001': { status: 'approved' } });
    let error: unknown;
    try {
      assembleDay(schedule, byId, '2030-01-01');
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(AssembleError);
    expect((error as AssembleError).problems).toEqual(['l-001']);
  });

  it('throws for a date not in the schedule', () => {
    expect(() => assembleDay(schedule, makeById(), '2031-01-01')).toThrow(
      AssembleError
    );
  });
});

describe('assembleWeek', () => {
  it('assembles a week', () => {
    const deep = assembleWeek(schedule, makeById(), '2030-W01');
    expect(deep.week).toBe('2030-W01');
    expect(deep.problem.id).toBe('d-001');
  });

  it('throws for a week not in the schedule', () => {
    expect(() => assembleWeek(schedule, makeById(), '2030-W02')).toThrow(
      AssembleError
    );
  });

  it('throws when the deep problem is missing', () => {
    const byId = makeById();
    byId.delete('d-001');
    expect(() => assembleWeek(schedule, byId, '2030-W01')).toThrow(
      AssembleError
    );
  });

  it('throws when the deep problem is not published', () => {
    const byId = makeById({ 'd-001': { status: 'verified' } });
    let error: unknown;
    try {
      assembleWeek(schedule, byId, '2030-W01');
    } catch (e) {
      error = e;
    }
    expect((error as AssembleError).problems).toEqual(['d-001']);
  });
});
