import type { Family } from '../family';
import type { Rng } from '../rng';

import { defineCodeFamily } from './define';

/** A code family with exactly one task: the plain fields, no per-variant functions. */
export interface SingleTask {
  /** Like 'code/caesar-shift'. */
  id: string;
  difficulty: 3 | 4;
  title: string;
  /** The task in Markdown. Examples are appended automatically. */
  task: string;
  entry: string;
  /** Parameter list for the empty signature, like 'n' or 'words, k'. */
  params: string;
  /** Full JavaScript source of a correct function named `entry`. It must not change its input. */
  reference: string;
  /** Independent check of the reference, written differently from it. */
  oracle: (args: unknown[]) => unknown;
  /** True when an argument list stays inside the ranges the task text states. */
  inDomain: (args: unknown[]) => boolean;
  /** One to three inputs shown to the player, each an argument list. */
  examples: unknown[][];
  /** Hidden inputs: fixed edge cases plus generated ones. */
  tests: (rng: Rng) => unknown[][];
  hints: string[];
  approach: string;
  notes: string;
  tags: string[];
}

export const defineSingleCodeFamily = (t: SingleTask): Family =>
  defineCodeFamily<'only'>({
    id: t.id,
    difficulty: t.difficulty,
    variants: ['only'],
    key: () => 'only',
    title: () => t.title,
    task: () => t.task,
    entry: () => t.entry,
    params: () => t.params,
    reference: () => t.reference,
    oracle: (_, args) => t.oracle(args),
    inDomain: (_, args) => t.inDomain(args),
    examples: () => t.examples,
    tests: (_, rng) => t.tests(rng),
    hints: () => t.hints,
    approach: () => t.approach,
    notes: () => t.notes,
    tags: t.tags
  });
