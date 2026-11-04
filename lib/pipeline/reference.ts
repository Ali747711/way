// Node only (uses node:vm): never import this from browser code.
import vm from 'node:vm';

import { normalizeText } from '@/lib/check/normalize';
import type { Problem } from '@/lib/content/schema';
import { isEqual } from '@/lib/runner/evaluate';

import type { CheckFailure } from './checks';

const SOLVER_TIMEOUT_MS = 2000;

const errorMessage = (error: unknown): string => {
  if (
    error instanceof Error &&
    'code' in error &&
    error.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT'
  ) {
    return 'timed out';
  }
  return error instanceof Error ? error.message : String(error);
};

export const checkReference = (p: Problem): CheckFailure[] => {
  const { answer } = p;
  if (answer.type !== 'code') return [];
  const timeout = answer.timeLimitMs;
  const fail = (message: string): CheckFailure[] => [
    { check: 'reference', message }
  ];

  let fn: unknown;
  try {
    fn = vm.runInNewContext(
      `${answer.reference}\n;${answer.entry}`,
      {},
      {
        timeout
      }
    );
  } catch (error) {
    return fail(`reference failed to load: ${errorMessage(error)}`);
  }
  if (typeof fn !== 'function') {
    return fail(`entry ${answer.entry} is not a function`);
  }

  const cases = [...answer.examples, ...answer.tests];
  for (const [i, { input, expected }] of cases.entries()) {
    const label = `case ${i} input ${JSON.stringify(input)}`;
    try {
      const actual: unknown = vm.runInNewContext(
        'fn(...args)',
        { fn, args: input },
        { timeout }
      );
      if (!isEqual(actual, expected)) {
        return fail(
          `${label}: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`
        );
      }
    } catch (error) {
      return fail(`${label}: ${errorMessage(error)}`);
    }
  }
  return [];
};

const matchesAnswer = (result: unknown, p: Problem): boolean => {
  const { answer } = p;
  if (answer.type === 'number') {
    return (
      typeof result === 'number' &&
      Math.abs(result - answer.value) <= answer.tolerance
    );
  }
  if (answer.type === 'exact') {
    const text = normalizeText(String(result), answer.normalize);
    return answer.accepted.some(
      (a) => normalizeText(a, answer.normalize) === text
    );
  }
  return false;
};

export const checkSolver = (p: Problem): CheckFailure[] => {
  if (typeof p.solver !== 'string') return [];
  const fail = (message: string): CheckFailure[] => [
    { check: 'solver', message }
  ];
  let result: unknown;
  try {
    result = vm.runInNewContext(
      `(() => { ${p.solver} })()`,
      {},
      {
        timeout: SOLVER_TIMEOUT_MS
      }
    );
  } catch (error) {
    return fail(`solver failed: ${errorMessage(error)}`);
  }
  return matchesAnswer(result, p)
    ? []
    : fail(
        `solver returned ${JSON.stringify(result)}, which does not match the answer`
      );
};
