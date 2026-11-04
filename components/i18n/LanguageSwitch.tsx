'use client';

import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

import { FOCUS_RING } from '@/components/classes';
import { localeHref, parsePagePath } from '@/lib/i18n/paths';
import { storeLocale } from '@/lib/i18n/storage';
import type { Locale } from '@/lib/i18n/types';
import { cn } from '@/lib/utils';

import { useLocale, useMessages } from './LocaleProvider';

// Each language is named in itself, so a reader finds theirs whichever page
// they are on.
const OPTIONS: ReadonlyArray<{ locale: Locale; short: string; name: string }> =
  [
    { locale: 'en', short: 'EN', name: 'English' },
    { locale: 'uz', short: 'UZ', name: 'Oʻzbekcha' }
  ];

/**
 * The design system's segmented pill: a grey track with the current
 * language on a white item. Each option is a link to this page in that
 * language; choosing one is remembered, so later visits open in it.
 */
export default function LanguageSwitch({ className }: { className?: string }) {
  const current = useLocale();
  const { language } = useMessages();
  const page = parsePagePath(usePathname() ?? '')?.page ?? '/';

  const choose = (locale: Locale) => (e: MouseEvent<HTMLAnchorElement>) => {
    storeLocale(locale);
    // Already here: remember the pick without reloading the page.
    if (locale === current) e.preventDefault();
  };

  return (
    <nav aria-label={language.label} className={className}>
      <ul
        role="list"
        className="inline-flex gap-1 rounded-[21.6px] bg-track p-1"
      >
        {OPTIONS.map(({ locale, short, name }) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <a
                href={localeHref(page, locale)}
                hrefLang={locale}
                lang={locale}
                aria-label={name}
                aria-current={active ? 'page' : undefined}
                onClick={choose(locale)}
                className={cn(
                  'inline-flex h-11.5 min-w-14 items-center justify-center rounded-[17.6px] px-4 text-[0.9375rem] font-semibold',
                  // In dark mode the surface is darker than the track, so
                  // the current item takes the lighter hairline grey to
                  // stay raised.
                  active
                    ? 'bg-surface text-ink shadow-soft dark:bg-hairline'
                    : 'text-ink-muted hover:text-ink',
                  FOCUS_RING
                )}
              >
                {short}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
