import { en } from './en';
import type { Locale, Messages } from './types';
import { uz } from './uz';

export type {
  AboutIntro,
  AccentedText,
  Locale,
  Messages,
  Principles,
  SpokenStatus
} from './types';

export const LOCALES: readonly Locale[] = ['en', 'uz'];

export const DEFAULT_LOCALE: Locale = 'en';

export const MESSAGES: Record<Locale, Messages> = { en, uz };

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.some((locale) => locale === value);
