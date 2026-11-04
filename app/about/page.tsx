import type { Metadata } from 'next';
import Link from 'next/link';

import { COLUMN, TEXT_LINK } from '@/components/classes';
import { REPO_URL } from '@/lib/config';

export const metadata: Metadata = { title: 'Way · About' };

const PRINCIPLES = [
  'Ten seconds to thinking.',
  'One problem at a time.',
  'The set ends.',
  'Coach, not oracle.',
  'Variety over depth, daily.',
  'No guilt.',
  'Free, no ads, no paywall, no data harvesting.'
];

const linkClass = `${TEXT_LINK} text-base font-medium`;

const bodyClass = 'font-serif text-[1.1875rem] leading-[1.6] text-pretty';

// The page title is the wordmark at display size, so About has no masthead.
export default function AboutPage() {
  return (
    <main className={`${COLUMN} way-enter pt-10 pb-16 sm:pt-16`}>
      <h1 className="border-b border-border pb-5 font-serif text-[3.5rem] leading-none font-medium tracking-[-0.02em] italic">
        Way
      </h1>
      <section className="mt-8 space-y-4">
        <p className={bodyClass}>
          Way is a free web app that replaces late-night scrolling with short
          bursts of real thinking. Each day it offers a small, finite set of
          problems across different areas, solved one at a time.
        </p>
        <p className={bodyClass}>
          Hints only ask questions. The answer appears only after you commit.
          When the set is done, Way says so and stops.
        </p>
        <p className={bodyClass}>
          It exists because AI has made thinking optional, and the effortful
          parts of life (reading, reasoning, searching, discussing) stop getting
          exercised. The fixes that mean leaving the device fail for people who
          live on devices, so Way lives inside screen time and replaces the
          content. It is an AI-era product whose point is to make people think
          more, not less.
        </p>
      </section>
      <section className="mt-12 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Principles
        </h2>
        <ol className="border-t border-border font-serif text-[1.1875rem]">
          {PRINCIPLES.map((principle, i) => (
            <li
              key={principle}
              className="flex min-h-12 items-baseline gap-4 border-b border-border py-2.5"
            >
              <span
                aria-hidden="true"
                className="w-4 shrink-0 font-sans text-sm text-muted-foreground tabular-nums"
              >
                {i + 1}
              </span>
              {principle}
            </li>
          ))}
        </ol>
      </section>
      <nav className="mt-10 flex flex-col items-start">
        <a href={REPO_URL} className={linkClass}>
          Source on GitHub
        </a>
        <Link href="/" className={linkClass}>
          Back to today
        </Link>
      </nav>
    </main>
  );
}
