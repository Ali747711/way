/**
 * The single reading column, with the 16px gutter at phone width. At 36rem
 * the 18px prompt sets about 64 characters a line on a laptop.
 */
export const COLUMN = 'mx-auto w-full max-w-144 px-4';

/**
 * The focus mark for the shadcn controls: a 3px blue outline outside the
 * edge. An outline, not a ring, so it never fights a control's own shadows.
 */
export const FOCUS_RING =
  'focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-blue-line';

/** The quiet text button (Give up, Show solution): no fill, still 44px+. */
export const QUIET = `h-12 rounded-2xl px-4 text-base font-semibold text-ink-muted hover:bg-transparent hover:text-ink hover:underline hover:underline-offset-4 dark:hover:bg-transparent ${FOCUS_RING}`;

/** Display headings: Done, NoSet, Deep done, About. */
export const DISPLAY =
  'text-[2.75rem] leading-[1.02] font-black tracking-[-0.025em] text-balance sm:text-[3.5rem]';
