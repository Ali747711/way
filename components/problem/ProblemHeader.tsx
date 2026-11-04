import AreaGlyph from '@/components/AreaGlyph';
import { areaVars } from '@/components/areaStyle';
import Markdown from '@/components/Markdown';
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
      <header
        className="flex items-center gap-3 text-sm tabular-nums"
        style={areaVars(problem.area)}
      >
        <span className="inline-flex items-center gap-1.5 font-medium text-(--area)">
          <AreaGlyph area={problem.area} className="size-3.5" />
          {AREA_CONFIG[problem.area].label}
        </span>
        {position.total > 1 && (
          <span className="text-muted-foreground">{`${position.index + 1} of ${position.total}`}</span>
        )}
      </header>

      <h1 className="mt-3 font-serif text-[1.875rem] leading-[1.15] font-medium tracking-[-0.015em] text-balance sm:text-[2.25rem]">
        {problem.title}
      </h1>
      <Markdown className="mt-5">{problem.prompt}</Markdown>
    </div>
  );
}
