import { FOCUS_RING } from '@/components/classes';

// One shape for every action: 44px tall, 8px corners. Amber marks the way
// forward; the outline is for trying; the quiet text button is the way out.
export const PRIMARY = `h-11 min-w-28 rounded-lg px-7 text-base font-semibold ${FOCUS_RING}`;

export const OUTLINE = `h-11 rounded-lg border-input bg-transparent px-5 text-base hover:bg-muted dark:border-input dark:bg-transparent dark:hover:bg-muted ${FOCUS_RING}`;

export const QUIET = `h-11 rounded-lg px-4 text-base font-normal text-muted-foreground hover:text-foreground ${FOCUS_RING}`;
