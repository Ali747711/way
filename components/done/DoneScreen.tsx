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
    <main className="mx-auto w-full max-w-160 space-y-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          That&apos;s today.
        </h1>
        <p className="text-base text-muted-foreground tabular-nums">
          {`Solved ${solved} of ${total} · ${hints} hints · ${Math.round(seconds / 60)} min`}
        </p>
      </header>
      <AreaMap records={records} today={today} />
      <Link
        href="/deep"
        className="inline-block py-2 text-base font-medium underline underline-offset-4"
      >
        This week&apos;s deep problem
      </Link>
      <p className="text-base text-muted-foreground">Come back tomorrow.</p>
    </main>
  );
}
