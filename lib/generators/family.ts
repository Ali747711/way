import type { Area } from '@/lib/areas';
import type { Answer } from '@/lib/content/schema';

import type { Rng } from './rng';

/** Everything a problem needs except its id, status, source and date. */
export interface ProblemDraft {
  difficulty: number;
  title: string;
  prompt: string;
  answer: Answer;
  hints: string[];
  solution: string;
  /** Function body that recomputes the answer independently (Math). */
  solver?: string;
  tags: string[];
}

/** 'daily' fills an area's slot; 'deep' is the weekly difficulty-5 problem. */
export type Slot = 'daily' | 'deep';

export interface Candidate {
  /** Unique within its family; stored on the problem so it is never reused. */
  key: string;
  /** A kind of problem within the family (often its mode); see FamilySpec. */
  group?: string;
  /**
   * The rng varies wording and generated test inputs. What counts as a
   * correct answer depends on the key alone.
   */
  build: (rng: Rng) => ProblemDraft;
}

export interface Family {
  /** Like 'math/either-not-both'; must not contain ':'. */
  id: string;
  area: Area;
  slot: Slot;
  candidates: () => Candidate[];
}

export interface FamilySpec<P> {
  id: string;
  area: Area;
  slot: Slot;
  /** Every parameter set this family accepts, already filtered for fair answers. */
  params: () => readonly P[];
  key: (params: P) => string;
  /**
   * Optional kind of problem, like the mode ('three', 'broken'). The picker
   * prefers the kinds a family has used least, so a batch varies them.
   */
  group?: (params: P) => string;
  build: (params: P, rng: Rng) => ProblemDraft;
}

/** Wraps a typed spec so families with different parameters share one list. */
export const defineFamily = <P>(spec: FamilySpec<P>): Family => ({
  id: spec.id,
  area: spec.area,
  slot: spec.slot,
  candidates: () =>
    spec.params().map((params) => ({
      key: spec.key(params),
      ...(spec.group ? { group: spec.group(params) } : {}),
      build: (rng: Rng) => spec.build(params, rng)
    }))
});

const PREFIX = 'template:';

export const attributionFor = (familyId: string, key: string): string =>
  `${PREFIX}${familyId}:${key}`;
