import { FOCUS_RING } from '@/components/classes';
import { cn } from '@/lib/utils';

/**
 * Fields and choice options are white pills with a soft inset; focus turns
 * the edge blue and adds the outline.
 */
export const FIELD = cn(
  'rounded-[20px] border-field bg-surface text-ink inset-shadow-field focus-visible:border-blue-line dark:bg-surface',
  FOCUS_RING
);
