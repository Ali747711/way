'use client';

import { useEffect, useState } from 'react';

import DoneScreen from '@/components/done/DoneScreen';
import Masthead from '@/components/Masthead';
import ProblemView from '@/components/problem/ProblemView';
import { DAILY_HINTS } from '@/lib/areas';
import { fetchDay } from '@/lib/content/client';
import type { DayFile } from '@/lib/content/schema';
import { toLocalDate } from '@/lib/date/localDate';

import NoSet from './NoSet';
import SetStrip from './SetStrip';
import { toMarks } from './setMarks';
import { usePlaySession } from './usePlaySession';

interface Loaded {
  key: string;
  day: DayFile | null;
}

const today = (): string => toLocalDate(new Date());

export default function DailyPlay() {
  const [key, setKey] = useState(today);
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    // A failed fetch is shown as "nothing scheduled" rather than a crash.
    fetchDay(key)
      .catch(() => null)
      .then((day) => {
        if (!cancelled) setLoaded({ key, day });
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const settled = loaded !== null && loaded.key === key;
  const problems = settled ? (loaded.day?.problems ?? null) : null;

  const session = usePlaySession({
    slot: 'daily',
    key,
    problems,
    settled,
    deep: false,
    resolveKey: today,
    onKeyChange: setKey
  });

  const { phase, problem, current, state } = session;

  if (phase === 'no-set')
    return <NoSet message="Nothing scheduled for today." />;
  if (phase === 'done' && state !== null && problems !== null) {
    return (
      <>
        <Masthead />
        <DoneScreen
          records={state.records}
          ids={problems.map((p) => p.id)}
          today={key}
        />
      </>
    );
  }
  if (phase === 'playing' && problem !== null && current !== null) {
    const marks =
      state !== null && problems !== null
        ? toMarks(problems, state.records, session.index)
        : [];
    return (
      <>
        <Masthead>
          <SetStrip marks={marks} />
        </Masthead>
        <ProblemView
          problem={problem}
          position={{ index: session.index, total: problems?.length ?? 0 }}
          current={current}
          maxHints={DAILY_HINTS}
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
      <Masthead />
      <div aria-busy="true" />
    </>
  );
}
