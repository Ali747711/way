import type { Metadata, Viewport } from 'next';

import { MESSAGES } from '@/lib/i18n/messages';

import RootDocument, { VIEWPORT } from '../../_root/RootDocument';

const m = MESSAGES.uz;

export const metadata: Metadata = {
  title: m.meta.title,
  description: m.meta.description
};

export const viewport: Viewport = VIEWPORT;

// Uzbek's own root layout, so the exported pages say `lang="uz"`.
export default function UzbekLayout({ children }: LayoutProps<'/uz'>) {
  return <RootDocument locale="uz">{children}</RootDocument>;
}
