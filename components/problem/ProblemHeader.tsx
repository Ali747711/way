import Markdown from '@/components/Markdown';
import AreaTile from '@/components/way/AreaTile';
import { AREA_CONFIG } from '@/lib/areas';
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
  return (
    <div>
      <header className="flex items-center gap-2.5">
        <AreaTile area={problem.area} size="sm" />
        <span className="text-[0.9375rem] font-extrabold">
          {AREA_CONFIG[problem.area].label}
        </span>
        {position.total > 1 && (
          <span className="rounded-full bg-track px-2.5 py-1 text-sm leading-none font-semibold text-ink-muted tabular-nums">{`${position.index + 1} of ${position.total}`}</span>
        )}
      </header>

      <h1 className="mt-4 text-[1.75rem] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance sm:text-[2.5rem] sm:leading-[1.02] sm:font-black sm:tracking-[-0.025em]">
        {problem.title}
      </h1>
      <Markdown className="mt-4">{problem.prompt}</Markdown>
    </div>
  );
}
