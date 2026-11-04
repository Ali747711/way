'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { chooseLocale } from '@/lib/i18n/choose';
import { localeHref, parsePagePath } from '@/lib/i18n/paths';
import { readStoredLocale } from '@/lib/i18n/storage';

import { useLocale } from './LocaleProvider';

const browserLanguages = (): readonly string[] =>
  navigator.languages?.length ? navigator.languages : [navigator.language];

/**
 * Moves the reader to the same page in their language: the one they picked
 * with the switch, or, before any pick and when arriving from another site,
 * an Uzbek browser's. The decision is the pure `chooseLocale`; this only
 * applies it.
 */
export default function LocaleRedirect() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const here = parsePagePath(pathname ?? '');
    if (here === null) return;
    const target = chooseLocale({
      page: locale,
      stored: readStoredLocale(),
      languages: browserLanguages(),
      referrer: document.referrer,
      origin: window.location.origin
    });
    if (target !== null) router.replace(localeHref(here.page, target));
  }, [locale, pathname, router]);

  return null;
}
