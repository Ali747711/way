import { describe, expect, it } from 'vitest';

import type { Locale } from './types';
import {
  chooseLocale,
  isSameOrigin,
  parseStoredLocale,
  preferredLocale
} from './choose';

const ORIGIN = 'https://way.example';

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
  // A direct visit: no referrer.
  const pick = (page: Locale, stored: Locale | null, languages: string[]) =>
    chooseLocale({ page, stored, languages, referrer: '', origin: ORIGIN });

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

  it('skips browser detection when arriving from one of its own pages', () => {
    // Storage blocked: the switch to English was not kept, but the reader
    // came from /uz/about by choice and must not be sent back.
    expect(
      chooseLocale({
        page: 'en',
        stored: null,
        languages: ['uz-UZ'],
        referrer: `${ORIGIN}/uz/about`,
        origin: ORIGIN
      })
    ).toBeNull();
  });

  it('still detects when arriving from another site', () => {
    expect(
      chooseLocale({
        page: 'en',
        stored: null,
        languages: ['uz-UZ'],
        referrer: 'https://search.example/?q=way',
        origin: ORIGIN
      })
    ).toBe('uz');
  });

  it('lets a stored pick win whatever the referrer', () => {
    expect(
      chooseLocale({
        page: 'en',
        stored: 'uz',
        languages: ['en-US'],
        referrer: `${ORIGIN}/about`,
        origin: ORIGIN
      })
    ).toBe('uz');
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

describe('isSameOrigin', () => {
  it('matches only this origin', () => {
    expect(isSameOrigin(`${ORIGIN}/uz`, ORIGIN)).toBe(true);
    expect(isSameOrigin(`${ORIGIN}/`, ORIGIN)).toBe(true);
    expect(isSameOrigin('https://other.example/uz', ORIGIN)).toBe(false);
    expect(isSameOrigin('http://way.example/uz', ORIGIN)).toBe(false);
    expect(isSameOrigin('', ORIGIN)).toBe(false);
    expect(isSameOrigin('not a url', ORIGIN)).toBe(false);
  });
});
