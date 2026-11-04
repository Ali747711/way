import { describe, expect, it } from 'vitest';

import { evaluate, isEqual } from './evaluate';

const cases = [
  { input: [123], expected: 6 },
  { input: [0], expected: 0 }
];

describe('evaluate', () => {
  it('passes a correct solution', () => {
    const results = evaluate({
      code: 'function sumDigits(n){return String(n).split("").reduce((a,c)=>a+Number(c),0)}',
      entry: 'sumDigits',
      cases
    });
    expect(results.every((r) => r.passed)).toBe(true);
  });

  it('reports actual for a wrong solution', () => {
    const results = evaluate({
      code: 'function sumDigits(n){return n}',
      entry: 'sumDigits',
      cases
    });
    expect(results[0]).toEqual({ passed: false, actual: 123 });
  });

  it('reports a thrown error', () => {
    const results = evaluate({
      code: 'function sumDigits(){throw new Error("boom")}',
      entry: 'sumDigits',
      cases
    });
    expect(results[0].passed).toBe(false);
    expect(results[0].error).toContain('boom');
  });

  it('reports a missing entry for every case', () => {
    const results = evaluate({
      code: 'const x = 1',
      entry: 'sumDigits',
      cases
    });
    expect(results).toEqual([
      { passed: false, error: 'entry function not found' },
      { passed: false, error: 'entry function not found' }
    ]);
  });

  it('compares arrays and objects by value', () => {
    expect(isEqual([1, 2], [1, 2])).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
});
