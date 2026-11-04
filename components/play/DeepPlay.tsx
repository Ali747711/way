'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import ProblemView from '@/components/problem/ProblemView';
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

function DeepDone() {
  return (
    <main className="mx-auto w-full max-w-160 space-y-3 px-4 pt-10 pb-16 sm:pt-16">
      <h1 className="text-3xl leading-tight font-semibold tracking-tight">
        That&apos;s this week.
      </h1>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-base font-medium underline underline-offset-4"
      >
        Back to today
      </Link>
    </main>
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
      <ProblemView
        problem={problem}
        position={{ index: 0, total: 1 }}
        current={current}
        maxHints={DEEP_HINTS}
        outcome={session.outcome}
        codeResult={problem.answer.type === 'code' ? session.codeResult : null}
        busy={session.busy}
        onDraftChange={session.draft}
        onHint={session.hint}
        onSubmit={session.submit}
        onRun={session.run}
        onGiveUp={session.giveUp}
        onNext={session.next}
      />
    );
  }
  return <div aria-busy="true" />;
}
