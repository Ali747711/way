import type { Metadata, Viewport } from 'next';

import { COLUMN, DISPLAY } from '@/components/classes';
import { glass } from '@/components/way/GlassButton';
import { MESSAGES } from '@/lib/i18n/messages';
import { localeHref } from '@/lib/i18n/paths';

import RootDocument, { VIEWPORT } from './_root/RootDocument';

const STATUS = '404';
const { en, uz } = MESSAGES;

export const metadata: Metadata = {
  title: `${STATUS}: ${en.notFound.message}`,
  description: en.meta.description
};

export const viewport: Viewport = VIEWPORT;

const MESSAGE = 'text-lg font-semibold text-ink-muted';

// Unmatched URLs of every language land on this one page, so it speaks
// both: English first (the document's language), then Uzbek marked as such.
export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <main className={`${COLUMN} way-enter pt-16 pb-16`}>
        <h1 className={DISPLAY}>{STATUS}</h1>
        <div className="mt-4 flex flex-col items-start gap-5">
          <p className={MESSAGE}>{en.notFound.message}</p>
          <a href={localeHref('/', 'en')} className={glass('blue')}>
            {en.about.backToToday}
          </a>
        </div>
        <div lang="uz" className="mt-10 flex flex-col items-start gap-5">
          <p className={MESSAGE}>{uz.notFound.message}</p>
          <a
            href={localeHref('/', 'uz')}
            hrefLang="uz"
            className={glass('white')}
          >
            {uz.about.backToToday}
          </a>
        </div>
      </main>
    </RootDocument>
  );
}
