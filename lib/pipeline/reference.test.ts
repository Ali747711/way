import { describe, expect, it } from 'vitest';

import type { Problem } from '@/lib/content/schema';

import { checkReference, checkSolver } from './reference';

const makeProblem = (
  reference: string,
  overrides: Partial<Problem> = {}
): Problem => ({
  id: 'c-001',
  area: 'code',
  difficulty: 3,
  title: 'Sum digits',
  prompt: 'Sum the digits.',
  answer: {
    type: 'code',
    signature: 'function sumDigits(n)',
    entry: 'sumDigits',
    examples: [{ input: [123], expected: 6 }],
    tests: [
      { input: [123], expected: 6 },
      { input: [909], expected: 18 }
    ],
    timeLimitMs: 200,
    reference
  },
  hints: ['Is it a loop?', 'Is it modulo?', 'Is it a string?'],
  solution: 'Add digits.',
  source: { kind: 'original' },
  status: 'draft',
  tags: [],
  createdAt: '2026-11-04',
  ...overrides
});

const good =
  'function sumDigits(n) { return String(n).split("").reduce((a, d) => a + Number(d), 0); }';

describe('checkReference', () => {
  it('passes a correct reference', () => {
    expect(checkReference(makeProblem(good))).toEqual([]);
  });

  it('reports the first failing input only', () => {
    const bad = 'function sumDigits(n) { return n; }';
    const failures = checkReference(makeProblem(bad));
    expect(failures).toHaveLength(1);
    expect(failures[0].check).toBe('reference');
    expect(failures[0].message).toContain('[123]');
  });

  it('reports a timeout for an infinite loop', () => {
    const failures = checkReference(makeProblem('while(true){}'));
    expect(failures).toHaveLength(1);
    expect(failures[0].message).toContain('timed out');
  });

  it('times out when the function body loops forever', () => {
    const failures = checkReference(
      makeProblem('function sumDigits(n) { while (true) {} }')
    );
    expect(failures).toHaveLength(1);
    expect(failures[0].message).toContain('timed out');
  });

  it('times out on a never-ending microtask in the reference', () => {
    const failures = checkReference(
      makeProblem(
        'Promise.resolve().then(() => { while (true) {} }); function sumDigits(n) { return n; }'
      )
    );
    expect(failures).toHaveLength(1);
    expect(failures[0].message).toContain('timed out');
  });

  it('returns nothing for non-code answers', () => {
    expect(
      checkReference(
        makeProblem('', {
          answer: { type: 'number', value: 1, tolerance: 0 }
        })
      )
    ).toEqual([]);
  });
});

describe('checkSolver', () => {
  const numberProblem = (solver?: string): Problem =>
    makeProblem('', {
      area: 'math',
      answer: { type: 'number', value: 42, tolerance: 0 },
      solver
    });

  it('passes a solver that computes the answer', () => {
    expect(checkSolver(numberProblem('return 6 * 7'))).toEqual([]);
  });

  it('fails a solver with the wrong result', () => {
    const failures = checkSolver(numberProblem('return 7'));
    expect(failures).toHaveLength(1);
    expect(failures[0].check).toBe('solver');
  });

  it('checks exact answers after normalizing', () => {
    const p = makeProblem('', {
      area: 'words',
      answer: { type: 'exact', accepted: ['cat'], normalize: 'trim-lower' },
      solver: 'return " Cat "'
    });
    expect(checkSolver(p)).toEqual([]);
  });

  it('times out on a never-ending microtask in the solver', () => {
    const failures = checkSolver(
      numberProblem(
        'Promise.resolve().then(() => { while (true) {} }); return 42'
      )
    );
    expect(failures).toHaveLength(1);
    expect(failures[0].message).toContain('timed out');
  });

  it('survives a trailing line comment in the solver', () => {
    expect(checkSolver(numberProblem('return 42 // done'))).toEqual([]);
  });

  it('returns nothing without a solver', () => {
    expect(checkSolver(numberProblem())).toEqual([]);
  });
});
