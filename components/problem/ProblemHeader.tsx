import { useContentLang, useMessages } from '@/components/i18n/LocaleProvider';
import Markdown from '@/components/Markdown';
import AreaTile from '@/components/way/AreaTile';
import type { Problem } from '@/lib/content/schema';

interface ProblemHeaderProps {
  problem: Problem;
  position: { index: number; total: number };
}

/** Area, position, title and prompt read as one block, in that order. */
export default function ProblemHeader({
  problem,
  position
}: ProblemHeaderProps) {
  const m = useMessages();
  const lang = useContentLang();
  return (
    <div>
      <header className="flex items-center gap-2.5">
        <AreaTile area={problem.area} size="sm" />
        <span className="text-[0.9375rem] font-extrabold">
          {m.areas[problem.area]}
        </span>
        {position.total > 1 && (
          <span className="rounded-full bg-track px-2.5 py-1 text-sm leading-none font-semibold text-ink-muted tabular-nums">
            {m.problem.position(position.index + 1, position.total)}
          </span>
        )}
      </header>

      <h1
        lang={lang}
        className="mt-4 text-[1.75rem] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance sm:text-[2.5rem] sm:leading-[1.02] sm:font-black sm:tracking-[-0.025em]"
      >
        {problem.title}
      </h1>
      <Markdown lang={lang} className="mt-4">
        {problem.prompt}
      </Markdown>
    </div>
  );
}
