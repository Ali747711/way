import type { Metadata } from 'next';
import Link from 'next/link';

import { COLUMN } from '@/components/classes';
import AreaTile from '@/components/way/AreaTile';
import { Squiggle } from '@/components/way/Doodle';
import { glass } from '@/components/way/GlassButton';
import { AREAS } from '@/lib/areas';
import { REPO_URL } from '@/lib/config';
import { MESSAGES } from '@/lib/i18n/messages';

const m = MESSAGES.en;

export const metadata: Metadata = { title: m.meta.aboutTitle };

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
        {m.about.intro.map((paragraph) => (
          <p key={paragraph} className={bodyClass}>
            {paragraph}
          </p>
        ))}
      </section>
      {/* The five areas, in slot order: the tiles that make up a day. */}
      <ul role="list" className="mt-10 grid grid-cols-5 gap-2">
        {AREAS.map((area) => (
          <li key={area} className="flex flex-col items-center gap-2">
            <AreaTile area={area} size="lg" />
            <span className="text-[0.8125rem] font-extrabold">
              {m.areas[area]}
            </span>
          </li>
        ))}
      </ul>
      <section className="mt-12">
        <h2 className="text-2xl font-black tracking-[-0.02em]">
          {m.about.principlesHeading}
        </h2>
        {/* Real list markers, so the numbering is spoken; they are just
            drawn large. */}
        <ol className="mt-4 list-[way-numeral] space-y-1 pl-11 text-lg font-semibold marker:text-[1.75rem] marker:font-black marker:text-blue-line">
          {m.about.principles.map((principle) => (
            <li key={principle} className="py-1.5 pl-1 leading-snug">
              {principle}
            </li>
          ))}
        </ol>
      </section>
      <nav className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className={glass('blue')}>
          {m.about.backToToday}
        </Link>
        <a href={REPO_URL} className={glass('black')}>
          {m.about.source}
        </a>
      </nav>
    </main>
  );
}
