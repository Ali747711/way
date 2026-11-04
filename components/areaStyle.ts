import type { CSSProperties } from 'react';

import type { Area } from '@/lib/areas';

export interface AreaStyle {
  /** CSS custom property in globals.css holding the area's tile fill. */
  token: `--area-${Area}`;
  /** CSS custom property for the glyph and marks drawn on that fill. */
  ink: '--area-light-ink' | '--area-math-ink';
  /** Path data for a 16×16 glyph drawn with a round stroke. */
  glyph: string;
  /** Stroke width override; zero-length segments with a wide stroke are dots. */
  weight?: number;
}

export const AREA_STYLE: Record<Area, AreaStyle> = {
  // Two lines of text, the second shorter.
  words: {
    token: '--area-words',
    ink: '--area-light-ink',
    glyph: 'M3 5.5h10M3 10.5h6.5'
  },
  // "Therefore": three dots in a triangle.
  logic: {
    token: '--area-logic',
    ink: '--area-light-ink',
    glyph: 'M8 4h0M4 11.5h0M12 11.5h0',
    weight: 3.6
  },
  // Yellow is light, so its glyph is the dark yellow ink.
  math: {
    token: '--area-math',
    ink: '--area-math-ink',
    glyph: 'M8 3v10M3 8h10'
  },
  code: {
    token: '--area-code',
    ink: '--area-light-ink',
    glyph: 'M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4'
  },
  create: {
    token: '--area-create',
    ink: '--area-light-ink',
    glyph: 'M8 2.5v11M3.25 5.25l9.5 5.5M3.25 10.75l9.5-5.5'
  }
};

/**
 * Exposes the area's fill as `--area` and its glyph colour as `--area-ink`,
 * so children can use `bg-(--area)` without one class per area.
 */
export const areaVars = (area: Area): CSSProperties =>
  ({
    '--area': `var(${AREA_STYLE[area].token})`,
    '--area-ink': `var(${AREA_STYLE[area].ink})`
  }) as CSSProperties;
