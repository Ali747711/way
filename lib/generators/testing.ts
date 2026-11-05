// Test helper only: imported from *.test.ts files, never from app code.
import { AREA_CONFIG, DEEP_DIFFICULTY } from '@/lib/areas';
import type { Problem } from '@/lib/content/schema';
import { runChecks } from '@/lib/pipeline/checks';
import { checkReference, checkSolver } from '@/lib/pipeline/reference';

import { nextIds, toProblem } from './assemble';
import type { Family } from './family';
import { createRng } from './rng';

const SEEDS = [1, 2, 3];

/**
 * Builds every candidate of a family under a few seeds and returns a list of
 * problems found wrong: schema, hint rules, difficulty band, open examples,
 * code reference against its tests, and the Math solver against the answer.
 * An empty list means the family is safe to generate from.
 */
export const auditFamily = (family: Family): string[] => {
  const errors: string[] = [];
  const candidates = family.candidates();
  if (candidates.length === 0) errors.push(`${family.id}: no candidates`);
  if (family.id.includes(':')) errors.push(`${family.id}: id contains ':'`);

  const keys = candidates.map((c) => c.key);
  const duplicate = keys.find((k, i) => keys.indexOf(k) !== i);
  if (duplicate !== undefined)
    errors.push(`${family.id}: duplicate key ${duplicate}`);

  const [id] = nextIds(
    [],
    family.slot === 'deep' ? 'd' : AREA_CONFIG[family.area].idPrefix,
    1
  );
  for (const candidate of candidates) {
    for (const seed of SEEDS) {
      const where = `${family.id} ${candidate.key} seed ${seed}`;
      let problem: Problem;
      try {
        problem = toProblem(candidate.build(createRng(seed)), {
          id,
          area: family.area,
          familyId: family.id,
          key: candidate.key,
          createdAt: '2026-11-05T00:00:00.000Z'
        });
      } catch (error) {
        errors.push(
          `${where}: ${error instanceof Error ? error.message : String(error)}`
        );
        continue;
      }
      const deep = problem.difficulty === DEEP_DIFFICULTY;
      if (deep !== (family.slot === 'deep')) {
        errors.push(
          `${where}: difficulty ${problem.difficulty} does not match slot ${family.slot}`
        );
      }
      if (family.area === 'math' && problem.solver === undefined) {
        errors.push(`${where}: math problems need a solver`);
      }
      const failures = [
        ...runChecks(problem, { words: new Set() }),
        ...checkReference(problem),
        ...checkSolver(problem)
      ];
      for (const f of failures)
        errors.push(`${where}: ${f.check}: ${f.message}`);
    }
  }
  return errors;
};
