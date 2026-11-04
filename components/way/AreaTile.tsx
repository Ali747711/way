import type { ReactNode } from 'react';

import AreaGlyph from '@/components/AreaGlyph';
import { areaVars } from '@/components/areaStyle';
import type { Area } from '@/lib/areas';
import { cn } from '@/lib/utils';

export type TileSize = 'sm' | 'md' | 'lg';

const SIZE: Record<TileSize, { box: string; glyph: string }> = {
  sm: { box: 'size-7', glyph: 'size-3.5' },
  md: { box: 'size-8', glyph: 'size-4' },
  lg: { box: 'size-14', glyph: 'size-7' }
};

interface AreaTileProps {
  area: Area;
  size?: TileSize;
  /** Replaces the area glyph, e.g. with a status mark. */
  children?: ReactNode;
  className?: string;
}

/**
 * Way's signature object: an area as a small glossy "app tile". Decorative;
 * the text next to it (or an sr-only label) carries the meaning.
 */
export default function AreaTile({
  area,
  size = 'md',
  children,
  className
}: AreaTileProps) {
  return (
    <span
      aria-hidden="true"
      style={areaVars(area)}
      className={cn('area-tile', SIZE[size].box, className)}
    >
      {children ?? <AreaGlyph area={area} className={SIZE[size].glyph} />}
    </span>
  );
}
