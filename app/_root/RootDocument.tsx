import type { Viewport } from 'next';
import { Caveat, Figtree, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import LocaleProvider from '@/components/i18n/LocaleProvider';
import type { Locale } from '@/lib/i18n/messages';

import '../globals.css';

// The document shared by every root layout. Each language has its own root
// layout so the exported HTML carries the right `lang`; this is everything
// else they have in common.

// Fonts are downloaded at build time and served from the app itself, so the
// page makes no font request to Google at runtime.

// Everything is set in Figtree, from 400 body text to 900 display. The
// variable file covers every weight in one download, and it is the only
// face preloaded.
const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap'
});

// The handwritten accent: one rotated caption per screen at most. Caveat at
// 600 is closest to the reference's thin slanted marker; Gochi Hand and
// Shantell Sans read heavier and more cartoonish next to Figtree 900.
const hand = Caveat({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-caveat',
  display: 'swap',
  preload: false
});

// Code and code results. A tall x-height and distinct 0/O and 1/l/I keep
// 14px results legible on a phone.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false
});

// Browser chrome matches the page ground.
export const VIEWPORT: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0d' }
  ]
};

interface RootDocumentProps {
  locale: Locale;
  children: ReactNode;
}

export default function RootDocument({ locale, children }: RootDocumentProps) {
  return (
    <html
      lang={locale}
      className={`${figtree.variable} ${hand.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
