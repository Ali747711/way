import type { Metadata } from 'next';

import DeepPlay from '@/components/play/DeepPlay';

export const metadata: Metadata = { title: 'Way · Deep' };

export default function DeepPage() {
  return <DeepPlay />;
}
