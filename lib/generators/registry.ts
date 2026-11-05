import type { Area } from '@/lib/areas';

import { codeFamilies } from './code';
import { createFamilies } from './create';
import type { Family, Slot } from './family';
import { mathFamilies } from './math';

export const ALL_FAMILIES: readonly Family[] = [
  ...mathFamilies,
  ...codeFamilies,
  ...createFamilies
];

export const familiesFor = (area: Area, slot: Slot): Family[] =>
  ALL_FAMILIES.filter((f) => f.area === area && f.slot === slot);
