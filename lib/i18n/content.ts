import type { Locale } from './types';

/**
 * The language problems are written in. Problems are English for now, in
 * every interface language; pages in another language mark them with
 * `lang` so screen readers switch voice.
 */
export const CONTENT_LOCALE: Locale = 'en';

/** The `lang` to put on problem content shown in `locale`, if it differs. */
export const contentLang = (locale: Locale): Locale | undefined =>
  locale === CONTENT_LOCALE ? undefined : CONTENT_LOCALE;
