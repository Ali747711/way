import type { TestCase } from '@/lib/content/schema';

import type { CaseResult, RunResult } from './types';

export const summarize = (
  cases: TestCase[],
  results: CaseResult[]
): RunResult => {
  const passed = results.filter((r) => r.passed).length;
  const index = results.findIndex((r) => !r.passed);
  const summary: RunResult = { passed, total: cases.length, timedOut: false };
  if (index === -1) return summary;

  const failed = results[index];
  return {
    ...summary,
    firstFailure: {
      index,
      input: cases[index].input,
      expected: cases[index].expected,
      ...(failed.actual !== undefined && { actual: failed.actual }),
      ...(failed.error !== undefined && { error: failed.error })
    }
  };
};

export const timedOutResult = (total: number): RunResult => ({
  passed: 0,
  total,
  timedOut: true
});
