import { countWords } from '@/lib/check/normalize';
import type { Constraint } from '@/lib/content/schema';

import { defineFamily, type Family } from '../family';

export interface CreateItem {
  /** Unique in its family, like 'cat-apology'. */
  key: string;
  difficulty: 3 | 4;
  title: string;
  /** The brief in Markdown, without the rules; the rules are appended. */
  task: string;
  minWords?: number;
  maxWords?: number;
  constraints: Constraint[];
  /** What a strong answer does, shown after submission. */
  authorNote: string;
  hints: [string, string, string];
  /** A real answer that meets every rule; verify checks it. */
  example: string;
  /** Why the example works, shown under it in the solution. */
  whyItWorks: string;
  tags: string[];
}

const upper = (s: string): string => s.toUpperCase();

const list = (words: readonly string[]): string =>
  words.map((w) => `*${w}*`).join(words.length === 2 ? ' and ' : ', ');

/** One plain sentence per rule, so the prompt always matches what is checked. */
export const describeConstraint = (c: Constraint): string => {
  switch (c.type) {
    case 'no-letter':
      return `Do not use the letter *${c.letter}* anywhere${c.letter === 'e' ? ', not even in *the*' : ''}.`;
    case 'max-word-length':
      return `No word may be longer than ${c.letters} letters.`;
    case 'sentence-count':
      return c.count === 1
        ? 'Write exactly one sentence.'
        : `Write exactly ${c.count} sentences.`;
    case 'sentence-words':
      return `Every sentence must be exactly ${c.words} words long.`;
    case 'all-questions':
      return 'Every sentence must be a question.';
    case 'acrostic':
      return `The first letters of your sentences, in order, must spell *${upper(c.word)}*.`;
    case 'alphabet-run': {
      const next = String.fromCharCode(c.from.charCodeAt(0) + 1);
      return `Start your first sentence with *${upper(c.from)}*, the next with *${upper(next)}*, and so on through the alphabet.`;
    }
    case 'must-include':
      return `Use the word${c.words.length === 1 ? '' : 's'} ${list(c.words)}.`;
    case 'forbid-words':
      return `Do not use the word${c.words.length === 1 ? '' : 's'} ${list(c.words)}.`;
    case 'same-start':
      return `Every word must start with the letter *${c.letter}*.`;
    case 'no-repeat':
      return 'Do not use any word more than once.';
  }
};

export const describeWordLimit = (
  min?: number,
  max?: number
): string | null => {
  if (min !== undefined && max !== undefined) {
    return min === max
      ? `Write exactly ${min} words.`
      : `Write ${min} to ${max} words.`;
  }
  if (max !== undefined) return `Use at most ${max} words.`;
  if (min !== undefined) return `Write at least ${min} words.`;
  return null;
};

const SENTENCE_RULES = new Set<Constraint['type']>([
  'sentence-count',
  'sentence-words',
  'all-questions',
  'acrostic',
  'alphabet-run'
]);

const NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten'
];

/**
 * With a fixed sentence count, an alphabet run names its exact letters in one
 * sentence that replaces the general rule. Null when it cannot (past z).
 */
const alphabetWithCount = (
  run: Extract<Constraint, { type: 'alphabet-run' }>,
  count: number
): string | null => {
  const start = run.from.charCodeAt(0);
  if (start + count - 1 > 'z'.charCodeAt(0)) return null;
  const letters = Array.from(
    { length: count },
    (_, i) => `*${upper(String.fromCharCode(start + i))}*`
  );
  if (count === 1) return `Start your sentence with ${letters[0]}.`;
  const named = `${letters.slice(0, -1).join(', ')} and ${letters[count - 1]}`;
  return `Start your ${NUMBER_WORDS[count] ?? count} sentences with ${named}, in that order.`;
};

/** The sentence for every rule, exactly as the prompt states it. */
export const describeAll = (constraints: readonly Constraint[]): string[] => {
  const count = constraints.find((c) => c.type === 'sentence-count');
  return constraints.map((c) => {
    if (c.type === 'alphabet-run' && count?.type === 'sentence-count') {
      return alphabetWithCount(c, count.count) ?? describeConstraint(c);
    }
    return describeConstraint(c);
  });
};

export const rulesFor = (
  item: Pick<CreateItem, 'constraints' | 'minWords' | 'maxWords'>
): string => {
  const lines = describeAll(item.constraints);
  const limit = describeWordLimit(item.minWords, item.maxWords);
  if (limit) lines.push(limit);
  const notes: string[] = [];
  const countsWords =
    limit !== null || item.constraints.some((c) => c.type === 'sentence-words');
  if (countsWords) notes.push('Words are counted by the spaces between them.');
  if (item.constraints.some((c) => SENTENCE_RULES.has(c.type))) {
    notes.push(
      'A sentence ends with a full stop, a question mark or an exclamation mark.'
    );
  }
  return [lines.join(' '), notes.join(' ')].filter(Boolean).join('\n\n');
};

export const defineCreateFamily = (
  id: string,
  items: readonly CreateItem[]
): Family =>
  defineFamily<CreateItem>({
    id,
    area: 'create',
    slot: 'daily',
    params: () => items,
    key: (item) => item.key,
    build: (item) => ({
      difficulty: item.difficulty,
      title: item.title,
      prompt: `${item.task}\n\n${rulesFor(item)}`,
      answer: {
        type: 'open',
        ...(item.minWords === undefined ? {} : { minWords: item.minWords }),
        ...(item.maxWords === undefined ? {} : { maxWords: item.maxWords }),
        authorNote: item.authorNote,
        constraints: item.constraints,
        example: item.example
      },
      hints: [...item.hints],
      solution: `One example answer (${countWords(item.example)} words):\n\n> ${item.example}\n\n${item.whyItWorks}`,
      tags: item.tags
    })
  });
