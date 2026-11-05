import type { Problem } from '@/lib/content/schema';
import { runChecks } from '@/lib/pipeline/checks';
import { checkReference, checkSolver } from '@/lib/pipeline/reference';

/** Every automatic check verify runs, as plain messages. */
export const failuresFor =
  (words: Set<string>) =>
  (p: Problem): string[] =>
    [...runChecks(p, { words }), ...checkReference(p), ...checkSolver(p)].map(
      (f) => `${f.check}: ${f.message}`
    );
