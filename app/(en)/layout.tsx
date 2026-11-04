import type { Metadata, Viewport } from 'next';

import { MESSAGES } from '@/lib/i18n/messages';

import RootDocument, { VIEWPORT } from '../_root/RootDocument';

const m = MESSAGES.en;

export const metadata: Metadata = {
  title: m.meta.title,
  description: m.meta.description
};

export const viewport: Viewport = VIEWPORT;

export default function EnglishLayout({ children }: LayoutProps<'/'>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
