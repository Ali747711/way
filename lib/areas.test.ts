import { describe, expect, it } from 'vitest';

import { AREA_CONFIG, AREAS, DEEP_DIFFICULTY } from './areas';

describe('areas', () => {
  it('lists the five areas in slot order', () => {
    expect(AREAS).toEqual(['words', 'logic', 'math', 'code', 'create']);
    expect(AREAS.map((a) => AREA_CONFIG[a].slot)).toEqual([1, 2, 3, 4, 5]);
  });

  it('pins the difficulty bands from the spec', () => {
    expect(AREA_CONFIG.words.difficulty).toEqual([1]);
    expect(AREA_CONFIG.code.difficulty).toEqual([3, 4]);
    expect(DEEP_DIFFICULTY).toBe(5);
  });
});
