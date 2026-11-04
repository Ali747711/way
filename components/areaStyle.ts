import type { CSSProperties } from 'react';

import type { Area } from '@/lib/areas';

export interface AreaStyle {
  /** CSS custom property in globals.css holding the area's identity colour. */
  token: `--area-${Area}`;
  /** Path data for a 16×16 glyph drawn with a round stroke. */
  glyph: string;
  /** Stroke width override; zero-length segments with a wide stroke are dots. */
  weight?: number;
}

export const AREA_STYLE: Record<Area, AreaStyle> = {
  // Two lines of text, the second shorter.
  words: { token: '--area-words', glyph: 'M2 5h12M2 11h8' },
  // "Therefore": three dots in a triangle.
  logic: {
    token: '--area-logic',
    glyph: 'M8 3.5h0M3 12h0M13 12h0',
    weight: 3.4
  },
  math: { token: '--area-math', glyph: 'M8 2v12M2 8h12' },
  code: {
    token: '--area-code',
    glyph: 'M5.5 3 1 8l4.5 5M10.5 3 15 8l-4.5 5'
  },
  create: {
    token: '--area-create',
    glyph: 'M8 1.5v13M2.4 4.75l11.2 6.5M2.4 11.25l11.2-6.5'
  }
};

/**
 * Exposes the area's colour as `--area` on an element, so its children can use
 * `text-(--area)` or `bg-(--area)` without one class per area.
 */
export const areaVars = (area: Area): CSSProperties =>
  ({ '--area': `var(${AREA_STYLE[area].token})` }) as CSSProperties;
