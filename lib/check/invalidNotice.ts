import type { Answer } from '@/lib/content/schema';
import { en } from '@/lib/i18n/en';
import type { Messages } from '@/lib/i18n/types';

import { checkAnswer } from './checkAnswer';
import { countWords } from './normalize';

type OpenAnswer = Extract<Answer, { type: 'open' }>;

const wordLimitNotice = (
  { minWords, maxWords }: OpenAnswer,
  { answer: t }: Messages
): string => {
  if (minWords !== undefined && maxWords !== undefined) {
    return minWords === maxWords
      ? t.exactWords(minWords)
      : t.wordRange(minWords, maxWords);
  }
  if (minWords !== undefined) return t.atLeastWords(minWords);
  return t.atMostWords(maxWords ?? 0);
};

/**
 * The one-line explanation shown after a submission that was refused without
 * costing an attempt. Null when the draft is not invalid.
 */
export const invalidNotice = (
  answer: Answer,
  draft: string,
  messages: Messages = en
): string | null => {
  if (answer.type === 'code') return null;
  const verdict = checkAnswer(answer, draft);
  if (verdict.correct || verdict.reason !== 'invalid') return null;
  const t = messages.answer;
  if (draft.trim() === '') {
    return answer.type === 'choice' ? t.pickFirst : t.typeFirst;
  }
  switch (answer.type) {
    case 'number':
      return t.enterNumber;
    case 'open':
      return wordLimitNotice(answer, messages);
    default:
      return t.pickFirst;
  }
};

/** Live count line for open answers that have a word limit, else null. */
export const wordCountLabel = (
  answer: Answer,
  draft: string,
  messages: Messages = en
): string | null => {
  if (answer.type !== 'open') return null;
  if (answer.minWords === undefined && answer.maxWords === undefined) {
    return null;
  }
  return messages.answer.wordCount(countWords(draft));
};
