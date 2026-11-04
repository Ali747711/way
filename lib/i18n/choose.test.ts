import { describe, expect, it } from 'vitest';

import type { Locale } from './types';
import { chooseLocale, parseStoredLocale, preferredLocale } from './choose';

describe('parseStoredLocale', () => {
  it('accepts the two locales and nothing else', () => {
    expect(parseStoredLocale('en')).toBe('en');
    expect(parseStoredLocale('uz')).toBe('uz');
    expect(parseStoredLocale(null)).toBeNull();
    expect(parseStoredLocale('')).toBeNull();
    expect(parseStoredLocale('UZ')).toBeNull();
    expect(parseStoredLocale('ru')).toBeNull();
  });
});

describe('preferredLocale', () => {
  it('finds Uzbek in any region or script tag', () => {
    expect(preferredLocale(['uz'])).toBe('uz');
    expect(preferredLocale(['uz-UZ'])).toBe('uz');
    expect(preferredLocale(['uz-Latn-UZ'])).toBe('uz');
    expect(preferredLocale(['UZ-uz'])).toBe('uz');
  });

  it('takes the first language Way speaks, in the reader’s order', () => {
    expect(preferredLocale(['ru-RU', 'uz-UZ', 'en'])).toBe('uz');
    expect(preferredLocale(['en-US', 'uz'])).toBe('en');
  });

  it('is null when the browser lists none of them', () => {
    expect(preferredLocale([])).toBeNull();
    expect(preferredLocale(['ru', 'kk'])).toBeNull();
  });
});

describe('chooseLocale', () => {
  const pick = (page: Locale, stored: Locale | null, languages: string[]) =>
    chooseLocale({ page, stored, languages });

  it('follows the stored pick over the browser', () => {
    expect(pick('en', 'uz', ['en-US'])).toBe('uz');
    expect(pick('uz', 'en', ['uz-UZ'])).toBe('en');
  });

  it('never moves a page that is already in the picked language', () => {
    expect(pick('en', 'en', ['uz-UZ'])).toBeNull();
    expect(pick('uz', 'uz', ['en-US'])).toBeNull();
  });

  it('sends an Uzbek browser from English to Uzbek before any pick', () => {
    expect(pick('en', null, ['uz-UZ'])).toBe('uz');
    expect(pick('en', null, ['ru', 'uz'])).toBe('uz');
  });

  it('leaves English pages alone for other browsers', () => {
    expect(pick('en', null, ['en-US'])).toBeNull();
    expect(pick('en', null, ['ru'])).toBeNull();
    expect(pick('en', null, [])).toBeNull();
  });

  it('never sends an Uzbek page away without a pick', () => {
    expect(pick('uz', null, ['en-US'])).toBeNull();
    expect(pick('uz', null, [])).toBeNull();
  });

  it('cannot loop: after one move the new page stays put', () => {
    const cases: Array<[Locale | null, string[]]> = [
      [null, ['uz-UZ']],
      [null, ['en-US']],
      ['en', ['uz-UZ']],
      ['uz', ['en-US']]
    ];
    for (const [stored, languages] of cases) {
      for (const start of ['en', 'uz'] as const) {
        const first = pick(start, stored, languages);
        if (first !== null) {
          expect(pick(first, stored, languages)).toBeNull();
        }
      }
    }
  });
});
