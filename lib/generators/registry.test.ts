import { describe, expect, it } from 'vitest';

import { AREAS } from '@/lib/areas';

import { ALL_FAMILIES, familiesFor } from './registry';

describe('registry', () => {
  it('gives every family a unique id', () => {
    const ids = ALL_FAMILIES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('prefixes each id with its area', () => {
    for (const f of ALL_FAMILIES)
      expect(f.id.startsWith(`${f.area}/`)).toBe(true);
  });

  it('has daily families for math, code and create, and deep ones for math', () => {
    for (const area of ['math', 'code', 'create'] as const) {
      expect(familiesFor(area, 'daily').length).toBeGreaterThan(0);
    }
    expect(familiesFor('math', 'deep').length).toBeGreaterThan(0);
    expect(AREAS).toContain('words');
  });
});
