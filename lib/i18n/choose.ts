import { isLocale } from './messages';
import type { Locale } from './types';

/** localStorage key for the language the reader picked with the switch. */
export const LOCALE_KEY = 'way:locale';

/** A stored value, if it names a locale; anything else counts as unset. */
export const parseStoredLocale = (value: string | null): Locale | null =>
  isLocale(value) ? value : null;

/**
 * The first of the browser's languages that Way speaks, if any. Order
 * matters: a reader who lists English before Uzbek prefers English.
 */
export const preferredLocale = (
  languages: readonly string[]
): Locale | null => {
  for (const tag of languages) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return null;
};

interface LocaleChoice {
  /** The language of the page being shown. */
  page: Locale;
  /** The reader's pick from the switch, if they made one. */
  stored: Locale | null;
  /** `navigator.languages`. */
  languages: readonly string[];
}

/**
 * The language to move to, or null to stay. An explicit pick always wins,
 * and a page already in the picked language never moves, so `/` and `/uz`
 * cannot send a reader back and forth. Without a pick, only the English
 * pages follow the browser: an Uzbek page someone opened stays Uzbek.
 */
export const chooseLocale = ({
  page,
  stored,
  languages
}: LocaleChoice): Locale | null => {
  if (stored !== null) return stored === page ? null : stored;
  if (page !== 'en') return null;
  const preferred = preferredLocale(languages);
  return preferred === null || preferred === page ? null : preferred;
};
