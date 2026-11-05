import type { Constraint } from '@/lib/content/schema';

import { countWords } from './normalize';

const EDGE_PUNCTUATION = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;

/**
 * Words with punctuation trimmed from each end; a hyphenated word stays one
 * word. Tokens that are only punctuation (a dash on its own) are dropped, so
 * use countWords, not this, when a rule counts words.
 */
export const wordsOf = (text: string): string[] =>
  text
    .trim()
    .split(/\s+/)
    .map((token) => token.replace(EDGE_PUNCTUATION, ''))
    .filter((word) => word !== '');

/** Sentences end at . ! or ?; text after the last one counts as a sentence. */
export const sentencesOf = (text: string): string[] =>
  text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence !== '');

/**
 * Lowercase, accents removed and curly apostrophes made straight, so 'É'
 * counts as 'e' and night’s matches night's.
 */
const plainLetters = (s: string): string =>
  s.normalize('NFD').replace(/\p{M}/gu, '').replace(/’/g, "'").toLowerCase();

const lettersOf = (word: string): string =>
  plainLetters(word).replace(/[^\p{L}]/gu, '');

const firstLetter = (sentence: string): string =>
  lettersOf(wordsOf(sentence)[0] ?? '').charAt(0);

/**
 * Every form a word can match: the whole word and the parts between hyphens
 * and apostrophes, so a ban on 'thank' also catches 'thank-you'.
 */
const wordForms = (text: string): Set<string> =>
  new Set(
    wordsOf(text).flatMap((w) => {
      const whole = plainLetters(w);
      return [whole, ...whole.split(/[-'’]/).filter(Boolean)];
    })
  );

type Checker<C> = (text: string, c: C) => string | null;
type CheckerFor = {
  [T in Constraint['type']]: Checker<Extract<Constraint, { type: T }>>;
};

const CHECKERS: CheckerFor = {
  'no-letter': (text, c) =>
    plainLetters(text).includes(c.letter)
      ? `uses the letter "${c.letter}"`
      : null,
  'max-word-length': (text, c) => {
    const long = wordsOf(text).find((w) => lettersOf(w).length > c.letters);
    return long ? `"${long}" is longer than ${c.letters} letters` : null;
  },
  'sentence-count': (text, c) => {
    const n = sentencesOf(text).length;
    return n === c.count ? null : `has ${n} sentences, needs ${c.count}`;
  },
  'sentence-words': (text, c) => {
    const bad = sentencesOf(text).find((s) => countWords(s) !== c.words);
    return bad ? `"${bad}" is not ${c.words} words long` : null;
  },
  'all-questions': (text) => {
    const bad = sentencesOf(text).find((s) => !s.endsWith('?'));
    return bad ? `"${bad}" is not a question` : null;
  },
  acrostic: (text, c) => {
    const spelled = sentencesOf(text).map(firstLetter).join('');
    return spelled === c.word
      ? null
      : `sentence starts spell "${spelled}", not "${c.word}"`;
  },
  'alphabet-run': (text, c) => {
    const start = c.from.charCodeAt(0);
    const bad = sentencesOf(text)
      .map(firstLetter)
      .findIndex((letter, i) => {
        const expected = start + i;
        // Past 'z' there is no next letter, so the run cannot continue.
        return expected > 122 || letter !== String.fromCharCode(expected);
      });
    return bad === -1 ? null : `sentence ${bad + 1} breaks the alphabet run`;
  },
  'must-include': (text, c) => {
    const forms = wordForms(text);
    const missing = c.words.filter((w) => !forms.has(plainLetters(w)));
    return missing.length === 0 ? null : `missing ${missing.join(', ')}`;
  },
  'forbid-words': (text, c) => {
    const forms = wordForms(text);
    const used = c.words.find((w) => forms.has(plainLetters(w)));
    return used ? `uses "${used}"` : null;
  },
  'same-start': (text, c) => {
    const bad = wordsOf(text).find((w) => !lettersOf(w).startsWith(c.letter));
    return bad ? `"${bad}" does not start with "${c.letter}"` : null;
  },
  'no-repeat': (text) => {
    const seen = new Set<string>();
    const repeated = wordsOf(text)
      .map(plainLetters)
      .find((w) => {
        if (seen.has(w)) return true;
        seen.add(w);
        return false;
      });
    return repeated ? `repeats "${repeated}"` : null;
  }
};

const checkOne = <T extends Constraint['type']>(
  text: string,
  c: Extract<Constraint, { type: T }>
): string | null => (CHECKERS[c.type as T] as Checker<typeof c>)(text, c);

/** One message per constraint the text breaks; empty when it follows all. */
export const checkConstraints = (
  text: string,
  constraints: readonly Constraint[]
): string[] =>
  constraints.flatMap((c) => {
    const message = checkOne(text, c);
    return message === null ? [] : [message];
  });
