import AreaGlyph from '@/components/AreaGlyph';
import AreaTile from '@/components/way/AreaTile';
import { AREA_CONFIG } from '@/lib/areas';
import { cn } from '@/lib/utils';

import type { MarkStatus, SetMark } from './setMarks';

// Read out in place of the marks. Worded apart from the outcome headings
// so the page never shows those phrases twice.
const SPOKEN: Record<MarkStatus, string> = {
  solved: 'solved',
  gave_up: 'gave up',
  failed: 'not solved',
  open: 'not started'
};

// Status is drawn as a shape, never only as colour: a check for solved, a
// dash for gave up or out of attempts, a ring for current, an outline for
// upcoming.
const CHECK = 'M3.5 8.5l2.75 2.75L12.5 5';
const DASH = 'M4 8h8';

function StatusPath({ d, className }: { d: string; className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

function Mark({ mark, size }: { mark: SetMark; size: 'sm' | 'lg' }) {
  const box = size === 'sm' ? 'size-7' : 'size-14';
  if (mark.status === 'open' && !mark.current) {
    return (
      <span
        className={cn(
          'block rounded-[28%] border-[1.5px] border-mark-empty',
          box
        )}
      />
    );
  }
  const done = mark.status !== 'open';
  const d = mark.status === 'solved' ? CHECK : DASH;
  // On the strip the status replaces the glyph; on Done the large tile
  // keeps its glyph and shows the status as a badge on its corner.
  const content = !done ? undefined : size === 'sm' ? (
    <StatusPath d={d} className="size-4" />
  ) : (
    <>
      <AreaGlyph area={mark.area} className="size-7" />
      <span className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-ink text-ground ring-2 ring-ground">
        <StatusPath d={d} className="size-4" />
      </span>
    </>
  );
  return (
    <AreaTile
      area={mark.area}
      size={size}
      className={cn(
        done && 'way-pop',
        done && mark.status !== 'solved' && 'saturate-35',
        mark.current && 'outline-2 outline-offset-2 outline-blue-line'
      )}
    >
      {content}
    </AreaTile>
  );
}

interface SetStripProps {
  marks: SetMark[];
  /** `sm` sits beside the wordmark; `lg` spans the column on Done. */
  size?: 'sm' | 'lg';
  className?: string;
}

/** The day's set as a finite object: one tile per problem, in slot order. */
export default function SetStrip({
  marks,
  size = 'sm',
  className
}: SetStripProps) {
  return (
    <ol
      role="list"
      aria-label="Today's set"
      className={cn(
        'flex',
        size === 'sm' ? 'gap-1.5' : 'justify-between sm:justify-start sm:gap-5',
        className
      )}
    >
      {marks.map((mark) => {
        const spoken =
          mark.current && mark.status === 'open'
            ? 'current'
            : SPOKEN[mark.status];
        return (
          <li key={mark.id} className="flex">
            <Mark mark={mark} size={size} />
            <span className="sr-only">{`${AREA_CONFIG[mark.area].label}, ${spoken}`}</span>
          </li>
        );
      })}
    </ol>
  );
}
