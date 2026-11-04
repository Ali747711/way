export const AREAS = ['words', 'logic', 'math', 'code', 'create'] as const;

export type Area = (typeof AREAS)[number];

export interface AreaConfig {
  label: string;
  slot: 1 | 2 | 3 | 4 | 5;
  difficulty: readonly number[];
  idPrefix: string;
}

export const AREA_CONFIG: Record<Area, AreaConfig> = {
  words: { label: 'Words', slot: 1, difficulty: [1], idPrefix: 'w' },
  logic: { label: 'Logic', slot: 2, difficulty: [2], idPrefix: 'l' },
  math: { label: 'Math', slot: 3, difficulty: [3], idPrefix: 'm' },
  code: { label: 'Code', slot: 4, difficulty: [3, 4], idPrefix: 'c' },
  create: { label: 'Create', slot: 5, difficulty: [3, 4], idPrefix: 'cr' }
};

export const DAILY_SET_SIZE = 5;
export const DAILY_HINTS = 3;
export const DEEP_HINTS = 5;
export const DEEP_DIFFICULTY = 5;
export const DEEP_ID_PREFIX = 'd';
