import type { Answer } from '@/lib/content/schema';

import { checkAnswer } from './checkAnswer';
import { countWords } from './normalize';

type OpenAnswer = Extract<Answer, { type: 'open' }>;

const wordLimitNotice = ({ minWords, maxWords }: OpenAnswer): string => {
  if (minWords !== undefined && maxWords !== undefined) {
    return minWords === maxWords
      ? `Use exactly ${minWords} words.`
      : `Use ${minWords}–${maxWords} words.`;
  }
  if (minWords !== undefined) return `Use at least ${minWords} words.`;
  return `Use at most ${maxWords ?? 0} words.`;
};

/**
 * The one-line explanation shown after a submission that was refused without
 * costing an attempt. Null when the draft is not invalid.
 */
export const invalidNotice = (answer: Answer, draft: string): string | null => {
  if (answer.type === 'code') return null;
  const verdict = checkAnswer(answer, draft);
  if (verdict.correct || verdict.reason !== 'invalid') return null;
  if (draft.trim() === '') {
    return answer.type === 'choice'
      ? 'Pick an option first.'
      : 'Type an answer first.';
  }
  switch (answer.type) {
    case 'number':
      return 'Enter a number.';
    case 'open':
      return wordLimitNotice(answer);
    default:
      return 'Pick an option first.';
  }
};

/** Live count line for open answers that have a word limit, else null. */
export const wordCountLabel = (
  answer: Answer,
  draft: string
): string | null => {
  if (answer.type !== 'open') return null;
  if (answer.minWords === undefined && answer.maxWords === undefined) {
    return null;
  }
  const n = countWords(draft);
  return `${n} ${n === 1 ? 'word' : 'words'}`;
};
