import type { Metadata } from 'next';
import Link from 'next/link';

import { COLUMN } from '@/components/classes';
import AreaTile from '@/components/way/AreaTile';
import { Squiggle } from '@/components/way/Doodle';
import { glass } from '@/components/way/GlassButton';
import { AREAS, AREA_CONFIG } from '@/lib/areas';
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

const bodyClass = 'text-[1.0625rem] leading-[1.6] text-pretty sm:text-lg';

// The page title is the wordmark at display size, so About has no masthead.
export default function AboutPage() {
  return (
    <main
      data-grid="short"
      className={`${COLUMN} way-enter pt-10 pb-16 sm:pt-16`}
    >
      <h1 className="inline-flex items-center gap-2 text-[4rem] leading-none font-black tracking-[-0.035em]">
        Way
        <Squiggle className="mt-3 h-5 w-12 text-blue-line" />
      </h1>
      <section className="mt-6 space-y-4">
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
      {/* The five areas, in slot order: the tiles that make up a day. */}
      <ul role="list" className="mt-10 grid grid-cols-5 gap-2">
        {AREAS.map((area) => (
          <li key={area} className="flex flex-col items-center gap-2">
            <AreaTile area={area} size="lg" />
            <span className="text-[0.8125rem] font-extrabold">
              {AREA_CONFIG[area].label}
            </span>
          </li>
        ))}
      </ul>
      <section className="mt-12">
        <h2 className="text-2xl font-black tracking-[-0.02em]">Principles</h2>
        {/* Real list markers, so the numbering is spoken; they are just
            drawn large. */}
        <ol className="mt-4 list-[way-numeral] space-y-1 pl-11 text-lg font-semibold marker:text-[1.75rem] marker:font-black marker:text-blue-line">
          {PRINCIPLES.map((principle) => (
            <li key={principle} className="py-1.5 pl-1 leading-snug">
              {principle}
            </li>
          ))}
        </ol>
      </section>
      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className={glass('blue')}>
          Back to today
        </Link>
        <a href={REPO_URL} className={glass('black')}>
          Source on GitHub
        </a>
      </nav>
    </main>
  );
}
