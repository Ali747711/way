/**
 * The single reading column, with the 16px gutter at phone width. At 36rem
 * the prompt serif sets about 70 characters a line on a laptop.
 */
export const COLUMN = 'mx-auto w-full max-w-144 px-4';

/**
 * Full-strength focus ring with a gap, for the shadcn controls (their default
 * ring is 50% alpha, and an amber ring touching an amber button disappears).
 */
export const FOCUS_RING =
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** A text link with a 44px touch target. */
export const TEXT_LINK =
  'inline-flex min-h-11 items-center underline decoration-1 underline-offset-4';
