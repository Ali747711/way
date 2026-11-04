import { LOCALE_KEY, parseStoredLocale } from './choose';
import type { Locale } from './types';

// Storage can be missing or throw (private mode, blocked site data). Then
// the pick is simply not remembered and the page stays where it is.

export const readStoredLocale = (): Locale | null => {
  try {
    return parseStoredLocale(window.localStorage.getItem(LOCALE_KEY));
  } catch {
    return null;
  }
};

/** Remembers the pick; returns false when storage refused it. */
export const storeLocale = (locale: Locale): boolean => {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
    return true;
  } catch {
    return false;
  }
};
