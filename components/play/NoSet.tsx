import Link from 'next/link';

import { COLUMN, TEXT_LINK } from '@/components/classes';
import Masthead from '@/components/Masthead';

export default function NoSet({ message }: { message: string }) {
  return (
    <>
      <Masthead />
      <main className={`${COLUMN} way-enter space-y-3 pt-10 pb-16 sm:pt-14`}>
        <p className="font-serif text-[2rem] leading-tight font-medium tracking-[-0.015em] text-balance">
          {message}
        </p>
        <Link
          href="/about"
          className={`${TEXT_LINK} text-base text-muted-foreground hover:text-foreground`}
        >
          About Way
        </Link>
      </main>
    </>
  );
}
