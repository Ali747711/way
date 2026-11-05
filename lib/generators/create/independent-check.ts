import type { Constraint } from '@/lib/content/schema';

import type { CreateItem } from './define';

// A second implementation of the Create rules, written differently from
// lib/check/constraints.ts: it scans with regular expressions and counts
// letters directly, so a shared mistake in the app checker would show up.

const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

const wordsIn = (text: string): string[] => text.match(WORD) ?? [];

const sentencesIn = (text: string): string[] =>
  text.split(/[.!?]+/u).filter((part) => /[\p{L}\p{N}]/u.test(part));

const letterCount = (word: string): number =>
  [...word].filter((ch) => /\p{L}/u.test(ch)).length;

const firstLetterOf = (sentence: string): string =>
  (wordsIn(sentence)[0] ?? '').charAt(0).toLowerCase();

// Accents stripped, so 'é' is an 'e', as the app checker treats it.
const bare = (s: string): string =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

// Whole words plus their pieces between hyphens and apostrophes.
const pieces = (words: string[]): string[] =>
  words.flatMap((w) => [w, ...w.split(/['’-]/).filter((x) => x !== '')]);

const spaceCount = (s: string): number =>
  s.split(/\s+/).filter((x) => x !== '').length;

const brokenBy = (text: string, c: Constraint): boolean => {
  const words = wordsIn(bare(text));
  const sentences = sentencesIn(text);
  switch (c.type) {
    case 'no-letter':
      return [...bare(text)].includes(c.letter);
    case 'max-word-length':
      return words.some((w) => letterCount(w) > c.letters);
    case 'sentence-count':
      return sentences.length !== c.count;
    case 'sentence-words':
      return sentences.some((s) => spaceCount(s) !== c.words);
    case 'all-questions':
      return (text.match(/[.!?]/gu) ?? []).some((mark) => mark !== '?');
    case 'acrostic':
      return sentences.map(firstLetterOf).join('') !== c.word;
    case 'alphabet-run':
      return sentences.some(
        (s, i) =>
          firstLetterOf(s) !==
          String.fromCharCode(97 + (c.from.charCodeAt(0) - 97) + i)
      );
    case 'must-include':
      return c.words.some((w) => !pieces(words).includes(bare(w)));
    case 'forbid-words':
      return c.words.some((w) => pieces(words).includes(bare(w)));
    case 'same-start':
      return words.some((w) => !w.startsWith(c.letter));
    case 'no-repeat':
      return new Set(words).size !== words.length;
  }
};

/** Messages for every rule or word limit the example breaks; [] when fine. */
export const independentViolations = (item: CreateItem): string[] => {
  const count = wordsIn(item.example).length;
  const broken = item.constraints
    .filter((c) => brokenBy(item.example, c))
    .map((c) => `${item.key}: breaks ${c.type}`);
  const limits: string[] = [];
  if (item.minWords !== undefined && count < item.minWords)
    limits.push(`${item.key}: ${count} words, below ${item.minWords}`);
  if (item.maxWords !== undefined && count > item.maxWords)
    limits.push(`${item.key}: ${count} words, above ${item.maxWords}`);
  return [...broken, ...limits];
};
