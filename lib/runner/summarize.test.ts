import { describe, expect, it } from 'vitest';

import { summarize, timedOutResult } from './summarize';

const cases = [
  { input: [1], expected: 1 },
  { input: [2], expected: 4 }
];

describe('summarize', () => {
  it('counts passed cases', () => {
    const result = summarize(cases, [
      { passed: true },
      { passed: false, actual: 2 }
    ]);
    expect(result.passed).toBe(1);
    expect(result.total).toBe(2);
    expect(result.timedOut).toBe(false);
  });

  it('carries the first failure', () => {
    const result = summarize(cases, [
      { passed: true },
      { passed: false, actual: 2 }
    ]);
    expect(result.firstFailure).toEqual({
      index: 1,
      input: [2],
      expected: 4,
      actual: 2
    });
  });

  it('omits firstFailure when all pass', () => {
    const result = summarize(cases, [{ passed: true }, { passed: true }]);
    expect(result.firstFailure).toBeUndefined();
  });

  it('includes the error and omits actual when absent', () => {
    const result = summarize(cases, [
      { passed: false, error: 'boom' },
      { passed: true }
    ]);
    expect(result.firstFailure).toEqual({
      index: 0,
      input: [1],
      expected: 1,
      error: 'boom'
    });
    expect(result.firstFailure).not.toHaveProperty('actual');
  });

  it('builds a timed-out result', () => {
    expect(timedOutResult(3)).toEqual({ passed: 0, total: 3, timedOut: true });
  });
});
