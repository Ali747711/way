'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { COLUMN, DISPLAY } from '@/components/classes';
import Masthead from '@/components/Masthead';
import ProblemView from '@/components/problem/ProblemView';
import { glass } from '@/components/way/GlassButton';
import { DEEP_HINTS } from '@/lib/areas';
import { fetchDeep } from '@/lib/content/client';
import type { DeepFile } from '@/lib/content/schema';
import { isoWeekKey, toLocalDate } from '@/lib/date/localDate';

import NoSet from './NoSet';
import { usePlaySession } from './usePlaySession';

interface Loaded {
  key: string;
  deep: DeepFile | null;
}

const thisWeek = (): string => isoWeekKey(toLocalDate(new Date()));

// The deep page names itself in the masthead; it has no set strip.
const DeepMasthead = () => (
  <Masthead>
    <span className="rounded-full bg-track px-3 py-1.5 text-sm leading-none font-extrabold text-ink-muted">
      Deep
    </span>
  </Masthead>
);

function DeepDone() {
  return (
    <>
      <DeepMasthead />
      <main className={`${COLUMN} way-enter space-y-8 pt-6 pb-16 sm:pt-10`}>
        <h1 className={DISPLAY}>
          That&apos;s <span className="text-red">this week.</span>
        </h1>
        <Link href="/" className={glass('blue')}>
          Back to today
        </Link>
      </main>
    </>
  );
}

export default function DeepPlay() {
  const [key, setKey] = useState(thisWeek);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    // A failed fetch is shown as "nothing scheduled" rather than a crash.
    fetchDeep(key)
      .catch(() => null)
      .then((deep) => {
        if (!cancelled) setLoaded({ key, deep });
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const settled = loaded !== null && loaded.key === key;
  const problems = settled && loaded.deep ? [loaded.deep.problem] : null;

  const session = usePlaySession({
    slot: 'deep',
    key,
    problems,
    settled,
    deep: true,
    resolveKey: thisWeek,
    onKeyChange: setKey
  });

  const { phase, problem, current } = session;

  if (phase === 'no-set')
    return <NoSet message="Nothing scheduled for this week." />;
  if (phase === 'done') return <DeepDone />;
  if (phase === 'playing' && problem !== null && current !== null) {
    return (
      <>
        <DeepMasthead />
        <ProblemView
          problem={problem}
          position={{ index: 0, total: 1 }}
          current={current}
          maxHints={DEEP_HINTS}
          outcome={session.outcome}
          codeResult={
            problem.answer.type === 'code' ? session.codeResult : null
          }
          busy={session.busy}
          onDraftChange={session.draft}
          onHint={session.hint}
          onSubmit={session.submit}
          onRun={session.run}
          onGiveUp={session.giveUp}
          onNext={session.next}
        />
      </>
    );
  }
  return (
    <>
      <DeepMasthead />
      <div aria-busy="true" />
    </>
  );
}
