import Link from 'next/link';

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
    <main className="mx-auto w-full max-w-160 space-y-10 px-4 pt-10 pb-16 sm:pt-16">
      <header className="space-y-2">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight">
          That&apos;s today.
        </h1>
        <p className="text-base text-muted-foreground tabular-nums">
          {`Solved ${solved} of ${total} · ${hints} hints · ${Math.round(seconds / 60)} min`}
        </p>
      </header>
      <AreaMap records={records} today={today} />
      {/* The optional extra and the sign-off close the screen as one group. */}
      <div className="space-y-1">
        <Link
          href="/deep"
          className="inline-flex min-h-11 items-center text-base font-medium underline underline-offset-4"
        >
          This week&apos;s deep problem
        </Link>
        <p className="text-base text-muted-foreground">Come back tomorrow.</p>
      </div>
    </main>
  );
}
