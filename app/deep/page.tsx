import type { Metadata } from 'next';

import DeepPlay from '@/components/play/DeepPlay';
import { MESSAGES } from '@/lib/i18n/messages';

export const metadata: Metadata = { title: MESSAGES.en.meta.deepTitle };

export default function DeepPage() {
  return <DeepPlay />;
}
