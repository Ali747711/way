import type { ReactNode } from 'react';

import { COLUMN } from './classes';
import { Squiggle } from './way/Doodle';

interface MastheadProps {
  /** Shown at the right of the wordmark, such as the day's set strip. */
  children?: ReactNode;
}

/** The wordmark, heavy and black, with one small doodle beside it. */
export default function Masthead({ children }: MastheadProps) {
  return (
    <div className={`${COLUMN} sm:pt-4`}>
      <header className="flex min-h-16 items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1 text-[1.75rem] leading-none font-black tracking-[-0.03em]">
          Way
          <Squiggle className="mt-1 text-blue-line" />
        </span>
        {children}
      </header>
    </div>
  );
}
