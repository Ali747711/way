import type { Family } from '../family';

import { constrained } from './constrained';
import { explain } from './explain';
import { forms } from './forms';
import { stories } from './stories';

export const createFamilies: readonly Family[] = [
  constrained,
  forms,
  explain,
  stories
];
