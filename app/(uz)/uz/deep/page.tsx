import type { Metadata } from 'next';

import DeepPlay from '@/components/play/DeepPlay';
import { MESSAGES } from '@/lib/i18n/messages';

export const metadata: Metadata = { title: MESSAGES.uz.meta.deepTitle };

export default function UzbekDeepPage() {
  return <DeepPlay />;
}
