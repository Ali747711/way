import type { Metadata } from 'next';
import Link from 'next/link';

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

const linkClass =
  'inline-block py-2 text-base font-medium underline underline-offset-4';

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-160 space-y-10 px-4 py-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Way</h1>
        <p className="text-base leading-relaxed">
          Way is a free web app that replaces late-night scrolling with short
          bursts of real thinking. Each day it offers a small, finite set of
          problems across different areas, solved one at a time.
        </p>
        <p className="text-base leading-relaxed">
          Hints only ask questions. The answer appears only after you commit.
          When the set is done, Way says so and stops.
        </p>
        <p className="text-base leading-relaxed">
          It exists because AI has made thinking optional, and the effortful
          parts of life (reading, reasoning, searching, discussing) stop getting
          exercised. The fixes that mean leaving the device fail for people who
          live on devices, so Way lives inside screen time and replaces the
          content. It is an AI-era product whose point is to make people think
          more, not less.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Principles</h2>
        <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed marker:text-muted-foreground">
          {PRINCIPLES.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ol>
      </section>
      <nav className="flex flex-col items-start">
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
