import type { Metadata } from 'next';

import AboutView from '@/components/about/AboutView';
import { MESSAGES } from '@/lib/i18n/messages';

export const metadata: Metadata = { title: MESSAGES.en.meta.aboutTitle };

export default function AboutPage() {
  return <AboutView locale="en" />;
}
