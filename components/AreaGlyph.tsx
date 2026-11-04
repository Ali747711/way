import type { Area } from '@/lib/areas';
import { cn } from '@/lib/utils';

import { AREA_STYLE } from './areaStyle';

interface AreaGlyphProps {
  area: Area;
  className?: string;
}

/** A small decorative mark for an area; the label next to it carries the meaning. */
export default function AreaGlyph({ area, className }: AreaGlyphProps) {
  const { glyph, weight } = AREA_STYLE[area];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-3.5 shrink-0', className)}
    >
      <path d={glyph} />
    </svg>
  );
}
