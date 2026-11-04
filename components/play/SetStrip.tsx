import { areaVars } from '@/components/areaStyle';
import { AREA_CONFIG } from '@/lib/areas';
import { cn } from '@/lib/utils';

import type { MarkStatus, SetMark } from './setMarks';

// Read out in place of the colours. Worded apart from the outcome headings
// so the page never shows those phrases twice.
const SPOKEN: Record<MarkStatus, string> = {
  solved: 'solved',
  gave_up: 'gave up',
  failed: 'not solved',
  open: 'not started'
};

// Solved fills with the area colour; gave up and out of attempts share one
// quiet tone, so the strip records what happened without grading it.
const FILL: Record<MarkStatus, string> = {
  solved: 'border-(--area) bg-(--area)',
  gave_up: 'border-mark-muted bg-mark-muted',
  failed: 'border-mark-muted bg-mark-muted',
  open: 'border-mark-empty'
};

interface SetStripProps {
  marks: SetMark[];
  /** `sm` sits beside the wordmark; `lg` spans the column on Done. */
  size?: 'sm' | 'lg';
  className?: string;
}

/** The day's set as a finite object: one mark per problem, in slot order. */
export default function SetStrip({
  marks,
  size = 'sm',
  className
}: SetStripProps) {
  return (
    <ol
      aria-label="Today's set"
      className={cn('flex', size === 'sm' ? 'gap-1.5' : 'gap-2', className)}
    >
      {marks.map((mark) => {
        const spoken =
          mark.current && mark.status === 'open'
            ? 'current'
            : SPOKEN[mark.status];
        return (
          <li
            key={mark.id}
            style={areaVars(mark.area)}
            className={cn(
              'rounded-full border-[1.5px] motion-safe:transition-colors motion-safe:duration-200',
              size === 'sm' ? 'h-1.5 w-5.5' : 'h-2.5 flex-1',
              FILL[mark.status],
              mark.current && 'border-ring'
            )}
          >
            <span className="sr-only">{`${AREA_CONFIG[mark.area].label}, ${spoken}`}</span>
          </li>
        );
      })}
    </ol>
  );
}
