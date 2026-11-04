import type { Answer } from '@/lib/content/schema';

import { countWords, normalizeText } from './normalize';

export type CheckResult =
  { correct: true } | { correct: false; reason: 'wrong' | 'invalid' };

/** Code answers are judged by running tests, so they never reach this module. */
export type CheckableAnswer = Exclude<Answer, { type: 'code' }>;

const invalid: CheckResult = { correct: false, reason: 'invalid' };
const wrong: CheckResult = { correct: false, reason: 'wrong' };

const checkExact = (
  answer: Extract<CheckableAnswer, { type: 'exact' }>,
  submission: string
): CheckResult => {
  const given = normalizeText(submission, answer.normalize);
  const accepted = answer.accepted.map((a) =>
    normalizeText(a, answer.normalize)
  );
  return accepted.includes(given) ? { correct: true } : wrong;
};

const checkNumber = (
  answer: Extract<CheckableAnswer, { type: 'number' }>,
  submission: string
): CheckResult => {
  const parsed = Number(submission.trim());
  if (Number.isNaN(parsed)) {
    return invalid;
  }
  return Math.abs(parsed - answer.value) <= answer.tolerance
    ? { correct: true }
    : wrong;
};

const checkChoice = (
  answer: Extract<CheckableAnswer, { type: 'choice' }>,
  submission: string
): CheckResult => {
  const trimmed = submission.trim();
  const index = Number(trimmed);
  const isInteger = /^-?\d+$/.test(trimmed);
  if (!isInteger || index < 0 || index >= answer.options.length) {
    return invalid;
  }
  return index === answer.correctIndex ? { correct: true } : wrong;
};

const checkOpen = (
  answer: Extract<CheckableAnswer, { type: 'open' }>,
  submission: string
): CheckResult => {
  const words = countWords(submission);
  if (answer.minWords !== undefined && words < answer.minWords) {
    return invalid;
  }
  if (answer.maxWords !== undefined && words > answer.maxWords) {
    return invalid;
  }
  return { correct: true };
};

/**
 * Checks a non-code answer. Blank input is invalid for every type, so the
 * learner is never marked wrong for submitting nothing.
 */
export const checkAnswer = (
  answer: CheckableAnswer,
  submission: string
): CheckResult => {
  if (submission.trim() === '') {
    return invalid;
  }
  switch (answer.type) {
    case 'exact':
      return checkExact(answer, submission);
    case 'number':
      return checkNumber(answer, submission);
    case 'choice':
      return checkChoice(answer, submission);
    case 'open':
      return checkOpen(answer, submission);
  }
};
