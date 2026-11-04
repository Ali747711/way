'use client';

import { createContext, useContext, type ReactNode } from 'react';

import {
  DEFAULT_LOCALE,
  MESSAGES,
  type Locale,
  type Messages
} from '@/lib/i18n/messages';

// Without a provider (as in component tests) the interface is English.
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

interface LocaleProviderProps {
  locale: Locale;
  children: ReactNode;
}

/**
 * Takes the locale rather than the messages: messages hold functions, which
 * cannot cross from a server layout into the client.
 */
export default function LocaleProvider({
  locale,
  children
}: LocaleProviderProps) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export const useLocale = (): Locale => useContext(LocaleContext);

export const useMessages = (): Messages => MESSAGES[useLocale()];
