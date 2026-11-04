import Link from 'next/link';

import { COLUMN, DISPLAY } from '@/components/classes';
import { useMessages } from '@/components/i18n/LocaleProvider';
import Masthead from '@/components/Masthead';
import { glass } from '@/components/way/GlassButton';

export default function NoSet({ message }: { message: string }) {
  const t = useMessages().noSet;
  return (
    <>
      <Masthead />
      <main className={`${COLUMN} way-enter space-y-8 pt-6 pb-16 sm:pt-10`}>
        <p className={DISPLAY}>{message}</p>
        <Link href="/about" className={glass('white')}>
          {t.about}
        </Link>
      </main>
    </>
  );
}
