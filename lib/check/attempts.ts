import type { AnswerType } from '@/lib/content/schema';

/**
 * Attempts allowed per answer type on a daily problem. Deep problems are
 * unlimited for every type. Code is unlimited because each run is judged by
 * tests, not by a guess limit.
 */
const DAILY_ATTEMPTS: Record<AnswerType, number> = {
  exact: 3,
  number: 3,
  choice: 1,
  code: Infinity,
  open: 1
};

export const maxAttempts = (type: AnswerType, deep = false): number =>
  deep ? Infinity : DAILY_ATTEMPTS[type];
