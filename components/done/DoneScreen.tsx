import Link from 'next/link';

import { COLUMN } from '@/components/classes';
import SetStrip from '@/components/play/SetStrip';
import { doneMarks } from '@/components/play/setMarks';
import { setSummary } from '@/lib/state/selectors';
import type { WayState } from '@/lib/state/schema';

import AreaMap from './AreaMap';

interface DoneScreenProps {
  records: WayState['records'];
  ids: string[];
  today: string;
}

export default function DoneScreen({ records, ids, today }: DoneScreenProps) {
  const { solved, total, hints, seconds } = setSummary(records, ids);
  return (
    <main className={`${COLUMN} way-enter pt-10 pb-16 sm:pt-14`}>
      <header className="space-y-2">
        <h1 className="font-serif text-[2.5rem] leading-[1.1] font-medium tracking-[-0.02em]">
          That&apos;s today.
        </h1>
        <p className="text-base text-muted-foreground tabular-nums">
          {`Solved ${solved} of ${total} · ${hints} hints · ${Math.round(seconds / 60)} min`}
        </p>
      </header>
      {/* The strip from the problem screen, grown into the day's summary. */}
      <SetStrip marks={doneMarks(ids, records)} size="lg" className="mt-6" />
      <div className="mt-8">
        <AreaMap records={records} today={today} />
      </div>
      {/* The optional extra and the sign-off close the screen as one group. */}
      <div className="mt-10 space-y-2">
        {/* The underline sits on the words only, in the accent: on Done this
            link is the one way forward. */}
        <Link
          href="/deep"
          className="group inline-flex min-h-11 items-center gap-2 text-base font-medium"
        >
          <span className="underline decoration-ring decoration-[1.5px] underline-offset-[5px]">
            This week&apos;s deep problem
          </span>
          <span
            aria-hidden="true"
            className="text-muted-foreground motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
        <p className="font-serif text-xl text-muted-foreground italic">
          Come back tomorrow.
        </p>
      </div>
    </main>
  );
}
