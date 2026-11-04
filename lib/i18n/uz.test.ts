import { describe, expect, it } from 'vitest';

import type { Answer } from '@/lib/content/schema';
import { invalidNotice, wordCountLabel } from '@/lib/check/invalidNotice';
import { areaCaption } from '@/lib/state/selectors';

import { en } from './en';
import type { Messages } from './types';
import { uz } from './uz';

/** Every string in a messages object, with functions called on samples. */
const leaves = (value: unknown, path = ''): Array<[string, string]> => {
  if (typeof value === 'string') return [[path, value]];
  if (typeof value === 'function') {
    const out = (value as (...args: number[]) => unknown)(0, 1, 2, 3);
    return typeof out === 'string' ? [[`${path}()`, out]] : [];
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, v]) =>
      leaves(v, path ? `${path}.${key}` : key)
    );
  }
  return [];
};

const keyPaths = (value: unknown, path = ''): string[] =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, v]) =>
        keyPaths(v, path ? `${path}.${key}` : key)
      )
    : [path];

describe('uz messages', () => {
  const strings = leaves(uz);

  it('has the same keys as English', () => {
    expect(keyPaths(uz)).toEqual(keyPaths(en));
  });

  it('has no empty string', () => {
    // The accented headings start with the accent word, so `lead` is empty.
    const empty = strings.filter(
      ([path, s]) => s.trim() === '' && !path.endsWith('.lead')
    );
    expect(empty).toEqual([]);
  });

  it('never puts an ASCII apostrophe, backtick or curly quote inside a word', () => {
    const wrong = strings.filter(([, s]) => /\p{L}['`‘’]\p{L}/u.test(s));
    expect(wrong).toEqual([]);
  });

  it('writes oʻ and gʻ with U+02BB, and nothing else with it', () => {
    const all = strings.map(([, s]) => s).join('\n');
    expect(all).toMatch(/oʻ/);
    expect(all).toMatch(/gʻ/);
    expect(all.match(/[^oOgG]ʻ/gu)).toBeNull();
  });

  it('writes the tutuq belgisi with U+02BC', () => {
    expect(uz.about.principles.join(' ')).toContain('maʼlumot');
    expect(uz.about.intro.join(' ')).toContain('sunʼiy');
  });
});

describe('uz messages with numbers', () => {
  const t: Messages = uz;

  it('counts without a plural noun after the numeral', () => {
    expect([0, 1, 2].map(t.outcome.attemptsLeft)).toEqual([
      '0 ta urinish qoldi',
      '1 ta urinish qoldi',
      '2 ta urinish qoldi'
    ]);
    expect([0, 1, 2].map(t.answer.wordCount)).toEqual([
      '0 ta soʻz',
      '1 ta soʻz',
      '2 ta soʻz'
    ]);
  });

  it('shows positions and hints as fractions', () => {
    expect(t.problem.position(1, 5)).toBe('1 / 5');
    expect(t.problem.hint(1, 3)).toBe('Maslahat 1 / 3');
  });

  it('reads code results and the day summary', () => {
    expect(t.code.passed(0, 2)).toBe('2 tadan 0 tasi oʻtdi');
    expect(t.code.passed(2, 2)).toBe('2 tadan 2 tasi oʻtdi');
    expect(t.done.summary(5, 5, 1, 12)).toBe(
      '5 tadan 5 tasi yechildi · 1 ta maslahat · 12 daqiqa'
    );
  });

  it('gives each word limit as an instruction', () => {
    expect(t.answer.exactWords(6)).toBe('Aniq 6 ta soʻz yozing.');
    expect(t.answer.wordRange(3, 8)).toBe('3–8 ta soʻz yozing.');
    expect(t.answer.atLeastWords(1)).toBe('Kamida 1 ta soʻz yozing.');
    expect(t.answer.atMostWords(2)).toBe('Koʻpi bilan 2 ta soʻz yozing.');
  });

  it('captions the area map', () => {
    expect(areaCaption(null, uz)).toBe('hali yoʻq');
    expect(areaCaption(0, uz)).toBe('oxirgi: bugun');
    expect(areaCaption(1, uz)).toBe('oxirgi: 1 kun oldin');
    expect(areaCaption(2, uz)).toBe('oxirgi: 2 kun oldin');
  });

  it('feeds the invalid-answer notices and the word count', () => {
    const open: Answer = {
      type: 'open',
      authorNote: 'note',
      minWords: 3,
      maxWords: 8
    };
    const num: Answer = { type: 'number', value: 4, tolerance: 0 };
    const choice: Answer = {
      type: 'choice',
      options: ['a', 'b'],
      correctIndex: 0
    };
    expect(invalidNotice(open, 'bir ikki', uz)).toBe('3–8 ta soʻz yozing.');
    expect(invalidNotice(num, 'abc', uz)).toBe('Son kiriting.');
    expect(invalidNotice(num, '', uz)).toBe('Avval javob yozing.');
    expect(invalidNotice(choice, '', uz)).toBe('Avval variantni tanlang.');
    expect(wordCountLabel(open, 'bir ikki', uz)).toBe('2 ta soʻz');
  });
});
