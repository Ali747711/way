import Link from 'next/link';

import { COLUMN, DISPLAY } from '@/components/classes';
import LanguageSwitch from '@/components/i18n/LanguageSwitch';
import { useLocale, useMessages } from '@/components/i18n/LocaleProvider';
import SetStrip from '@/components/play/SetStrip';
import { doneMarks } from '@/components/play/setMarks';
import Accented from '@/components/way/Accented';
import { Arrow } from '@/components/way/Doodle';
import { localeHref } from '@/lib/i18n/paths';
import { setSummary } from '@/lib/state/selectors';
import type { WayState } from '@/lib/state/schema';

import AreaMap from './AreaMap';

interface DoneScreenProps {
  records: WayState['records'];
  ids: string[];
  today: string;
}

export default function DoneScreen({ records, ids, today }: DoneScreenProps) {
  const t = useMessages().done;
  const locale = useLocale();
  const { solved, total, hints, seconds } = setSummary(records, ids);
  return (
    <main className={`${COLUMN} way-enter pt-6 pb-16 sm:pt-10`}>
      <header className="space-y-3">
        <h1 className={DISPLAY}>
          <Accented text={t.title} />
        </h1>
        <p className="text-[1.0625rem] font-semibold text-ink-muted tabular-nums">
          {t.summary(solved, total, hints, Math.round(seconds / 60))}
        </p>
      </header>
      {/* The strip from the problem screen, grown into the day's summary. */}
      <SetStrip marks={doneMarks(ids, records)} size="lg" className="mt-7" />
      <AreaMap records={records} today={today} className="mt-8" />
      {/* The one way forward on Done: a full-width band, like a banner. */}
      <Link
        href={localeHref('/deep', locale)}
        className="group mt-10 flex min-h-16 items-center justify-between gap-4 rounded-[20px] bg-blue px-6 py-4 text-lg leading-tight font-black text-on-blue shadow-raised hover:bg-blue-hover"
      >
        {t.deepLink}
        <Arrow className="shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
      </Link>
      <p className="mt-8 inline-block origin-left -rotate-2 font-hand text-[1.875rem] leading-none text-ink-muted">
        {t.comeBack}
      </p>
      <footer className="mt-10">
        <LanguageSwitch />
      </footer>
    </main>
  );
}
