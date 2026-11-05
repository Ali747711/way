import { describe, expect, it } from 'vitest';

import type { Problem } from '@/lib/content/schema';

import { planBatch } from './batch';
import { defineFamily, type ProblemDraft } from './family';
import { createRng } from './rng';

const draft = (difficulty: number, hints: number): ProblemDraft => ({
  difficulty,
  title: 'T',
  prompt: 'P?',
  answer: { type: 'number', value: 1, tolerance: 0 },
  hints: Array.from({ length: hints }, (_, i) => `Hint ${i}?`),
  solution: '**1.**',
  solver: 'return 1;',
  tags: []
});

const daily = defineFamily<number>({
  id: 'math/d',
  area: 'math',
  slot: 'daily',
  params: () => [1, 2, 3],
  key: (n) => `k${n}`,
  build: (n) => ({ ...draft(3, 3), title: `Daily ${n}` })
});
const deep = defineFamily<number>({
  id: 'math/deep',
  area: 'math',
  slot: 'deep',
  params: () => [1],
  key: (n) => `k${n}`,
  build: (n) => ({ ...draft(5, 5), title: `Deep ${n}` })
});

const existing: Problem[] = [
  {
    ...draft(3, 3),
    id: 'm-007',
    area: 'math',
    source: { kind: 'generated', attribution: 'template:math/d:k1' },
    status: 'approved',
    createdAt: '2026-11-04'
  },
  {
    ...draft(5, 5),
    id: 'd-001',
    area: 'math',
    source: { kind: 'original' },
    status: 'published',
    createdAt: '2026-11-04'
  }
];

describe('planBatch', () => {
  const plan = (count: number, deepCount: number) =>
    planBatch({
      existing,
      area: 'math',
      daily: [daily],
      deep: [deep],
      count,
      deepCount,
      rng: createRng(1),
      createdAt: '2026-11-05T00:00:00.000Z'
    });

  it('numbers daily and deep problems after the existing ids', () => {
    const ids = plan(2, 1).problems.map((p) => p.id);
    expect(ids).toEqual(['m-008', 'm-009', 'd-002']);
  });

  it('skips candidates already in the bank and reports the shortfall', () => {
    const batch = plan(5, 3);
    const keys = batch.problems.map((p) => p.source.attribution);
    expect(keys).not.toContain('template:math/d:k1');
    expect(batch.missing).toEqual({ daily: 3, deep: 2 });
  });

  it('writes drafts only', () => {
    expect(plan(1, 0).problems.every((p) => p.status === 'draft')).toBe(true);
  });

  it('redraws the wording to avoid a title already in the bank', () => {
    const worded = defineFamily<number>({
      id: 'math/w',
      area: 'math',
      slot: 'daily',
      params: () => [1, 2],
      key: (n) => `k${n}`,
      build: (_, rng) => ({
        ...draft(3, 3),
        title: rng.pick(['T', 'Fresh A', 'Fresh B', 'Fresh C'])
      })
    });
    const batch = planBatch({
      existing,
      area: 'math',
      daily: [worded],
      deep: [],
      count: 2,
      deepCount: 0,
      rng: createRng(3),
      createdAt: '2026-11-05'
    });
    const titles = batch.problems.map((p) => p.title);
    expect(titles).not.toContain('T');
    expect(new Set(titles).size).toBe(2);
  });

  it('moves on to another candidate when every wording clashes', () => {
    const fixed = defineFamily<number>({
      id: 'math/f',
      area: 'math',
      slot: 'daily',
      params: () => [1, 2, 3],
      key: (n) => `k${n}`,
      build: (n) => ({ ...draft(3, 3), title: n === 1 ? 'T' : `Only ${n}` })
    });
    const batch = planBatch({
      existing,
      area: 'math',
      daily: [fixed],
      deep: [],
      count: 3,
      deepCount: 0,
      rng: createRng(4),
      createdAt: '2026-11-05'
    });
    expect(batch.problems.map((p) => p.title).sort()).toEqual([
      'Only 2',
      'Only 3'
    ]);
    expect(batch.missing.daily).toBe(1);
    expect(batch.titleSkips).toBe(1);
  });
});
