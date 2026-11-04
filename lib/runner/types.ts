import type { TestCase } from '@/lib/content/schema';

export interface CaseResult {
  passed: boolean;
  actual?: unknown;
  error?: string;
}

export interface RunResult {
  passed: number;
  total: number;
  timedOut: boolean;
  firstFailure?: {
    index: number;
    input: unknown[];
    expected: unknown;
    actual?: unknown;
    error?: string;
  };
}

export interface RunRequest {
  code: string;
  entry: string;
  cases: TestCase[];
}
