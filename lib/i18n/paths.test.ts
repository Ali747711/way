import { describe, expect, it } from 'vitest';

import { localeHref, parsePagePath } from './paths';

describe('localeHref', () => {
  it('keeps English paths and prefixes Uzbek ones', () => {
    expect(localeHref('/', 'en')).toBe('/');
    expect(localeHref('/deep', 'en')).toBe('/deep');
    expect(localeHref('/about', 'en')).toBe('/about');
    expect(localeHref('/', 'uz')).toBe('/uz');
    expect(localeHref('/deep', 'uz')).toBe('/uz/deep');
    expect(localeHref('/about', 'uz')).toBe('/uz/about');
  });
});

describe('parsePagePath', () => {
  it('reads each page in each language', () => {
    expect(parsePagePath('/')).toEqual({ page: '/', locale: 'en' });
    expect(parsePagePath('/deep')).toEqual({ page: '/deep', locale: 'en' });
    expect(parsePagePath('/about')).toEqual({ page: '/about', locale: 'en' });
    expect(parsePagePath('/uz')).toEqual({ page: '/', locale: 'uz' });
    expect(parsePagePath('/uz/deep')).toEqual({ page: '/deep', locale: 'uz' });
    expect(parsePagePath('/uz/about')).toEqual({
      page: '/about',
      locale: 'uz'
    });
  });

  it('ignores a trailing slash', () => {
    expect(parsePagePath('/uz/')).toEqual({ page: '/', locale: 'uz' });
    expect(parsePagePath('/about/')).toEqual({ page: '/about', locale: 'en' });
    expect(parsePagePath('')).toEqual({ page: '/', locale: 'en' });
  });

  it('is null for anything that is not a page', () => {
    expect(parsePagePath('/nope')).toBeNull();
    expect(parsePagePath('/uz/nope')).toBeNull();
    expect(parsePagePath('/uzbek')).toBeNull();
    expect(parsePagePath('/uz/uz')).toBeNull();
  });

  it('round-trips with localeHref', () => {
    for (const page of ['/', '/deep', '/about'] as const) {
      for (const locale of ['en', 'uz'] as const) {
        expect(parsePagePath(localeHref(page, locale))).toEqual({
          page,
          locale
        });
      }
    }
  });
});
