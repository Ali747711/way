import type { ReactNode } from 'react';

import { COLUMN } from './classes';

interface MastheadProps {
  /** Shown at the right of the wordmark, such as the day's set strip. */
  children?: ReactNode;
}

/** The small wordmark over a hairline rule, like the head of a notebook page. */
export default function Masthead({ children }: MastheadProps) {
  return (
    <div className={`${COLUMN} sm:pt-4`}>
      <header className="flex min-h-12 items-center justify-between gap-4 border-b border-border">
        <span className="font-serif text-[1.375rem] leading-none font-medium tracking-[-0.01em] italic">
          Way
        </span>
        {children}
      </header>
    </div>
  );
}
