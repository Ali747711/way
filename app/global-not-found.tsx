import type { Metadata, Viewport } from 'next';

import { COLUMN, DISPLAY } from '@/components/classes';
import { MESSAGES } from '@/lib/i18n/messages';

import RootDocument, { VIEWPORT } from './_root/RootDocument';

const m = MESSAGES.en;

export const metadata: Metadata = {
  title: m.notFound.title,
  description: m.meta.description
};

export const viewport: Viewport = VIEWPORT;

// Unmatched URLs of every language land here, so it is in English.
export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <main className={`${COLUMN} way-enter space-y-4 pt-16 pb-16`}>
        <h1 className={DISPLAY}>{m.notFound.status}</h1>
        <p className="text-lg font-semibold text-ink-muted">
          {m.notFound.message}
        </p>
      </main>
    </RootDocument>
  );
}
