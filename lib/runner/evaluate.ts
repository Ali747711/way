import type { CaseResult, RunRequest } from './types';

const ENTRY_MISSING = 'entry function not found';

export const isEqual = (a: unknown, b: unknown): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

const loadEntry = (code: string, entry: string): unknown => {
  try {
    return new Function(`${code}\n;return ${entry};`)();
  } catch {
    return undefined;
  }
};

/** Pure: runs in the worker and in Node tests, never touches the DOM. */
export const evaluate = (req: RunRequest): CaseResult[] => {
  const fn = loadEntry(req.code, req.entry);
  if (typeof fn !== 'function') {
    return req.cases.map(() => ({ passed: false, error: ENTRY_MISSING }));
  }
  return req.cases.map((c): CaseResult => {
    try {
      const actual: unknown = fn(...c.input);
      return { passed: isEqual(actual, c.expected), actual };
    } catch (err) {
      return { passed: false, error: String(err) };
    }
  });
};
