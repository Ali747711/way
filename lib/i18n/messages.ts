import { en } from './en';
import type { Locale, Messages } from './types';

export type { AccentedText, Locale, Messages, SpokenStatus } from './types';

export const DEFAULT_LOCALE: Locale = 'en';

export const MESSAGES: Record<Locale, Messages> = { en };
