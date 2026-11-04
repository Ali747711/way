import { FOCUS_RING } from '@/components/classes';
import { cn } from '@/lib/utils';

/**
 * Fields and choice options are white pills with a soft inset; focus turns
 * the edge blue and adds the outline.
 */
export const FIELD = cn(
  'rounded-[20px] border-field bg-surface text-ink shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] focus-visible:border-blue-line dark:bg-surface',
  FOCUS_RING
);
