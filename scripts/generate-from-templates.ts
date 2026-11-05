import { AREAS, type Area } from '@/lib/areas';
import { planBatch } from '@/lib/generators/batch';
import type { Family } from '@/lib/generators/family';
import { familiesFor } from '@/lib/generators/registry';
import { createRng } from '@/lib/generators/rng';

import { failuresFor } from './lib/checkAll';
import { problemPath, readProblemFiles, writeProblemFile } from './lib/files';
import { loadWords } from './lib/words';

const USAGE =
  'usage: generate-from-templates --area <area> [--count N] [--deep N] [--seed S] [--families id1,id2] [--dry-run]';

const flag = (argv: string[], name: string): string | undefined => {
  const i = argv.indexOf(name);
  return i === -1 ? undefined : argv[i + 1];
};

const whole = (raw: string | undefined, fallback: number): number => {
  if (raw === undefined) return fallback;
  if (!/^\d+$/.test(raw)) throw new Error(USAGE);
  return Number(raw);
};

const parseArgs = (argv: string[]) => {
  const area = flag(argv, '--area');
  if (!area || !(AREAS as readonly string[]).includes(area))
    throw new Error(USAGE);
  const count = whole(flag(argv, '--count'), 0);
  const deep = whole(flag(argv, '--deep'), 0);
  if (count + deep === 0) throw new Error(USAGE);
  const families = flag(argv, '--families')
    ?.split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return {
    area: area as Area,
    count,
    deep,
    seed: whole(flag(argv, '--seed'), Date.now() % 2147483647),
    families,
    dryRun: argv.includes('--dry-run')
  };
};

/**
 * --families limits a run to some families, for example to generate the ones
 * that echo a recently published problem in a later run, so they land later.
 */
const selectFamilies = (area: Area, ids: string[] | undefined) => {
  const daily = familiesFor(area, 'daily');
  const deep = familiesFor(area, 'deep');
  if (ids === undefined) return { daily, deep };
  const unknown = ids.filter(
    (id) => ![...daily, ...deep].some((f) => f.id === id)
  );
  if (unknown.length > 0)
    throw new Error(`unknown family ${unknown.join(', ')}`);
  const keep = (f: Family) => ids.includes(f.id);
  return { daily: daily.filter(keep), deep: deep.filter(keep) };
};

const main = async (): Promise<void> => {
  const { area, count, deep, seed, families, dryRun } = parseArgs(
    process.argv.slice(2)
  );
  const files = await readProblemFiles();
  const batch = planBatch({
    existing: files.map((f) => f.problem),
    area,
    ...selectFamilies(area, families),
    count,
    deepCount: deep,
    rng: createRng(seed),
    createdAt: new Date().toISOString()
  });
  console.log(`seed ${seed}`);

  // Generated content must pass the same checks as verify before anything is
  // written; a failure here is a bug in a family, not a content problem.
  const check = failuresFor(await loadWords());
  const failures = batch.problems.flatMap((p) =>
    check(p).map((f) => `FAIL ${p.id} ${p.source.attribution}: ${f}`)
  );
  if (failures.length > 0) {
    for (const line of failures) console.error(line);
    console.error('nothing written');
    process.exitCode = 1;
    return;
  }

  for (const p of batch.problems) {
    if (!dryRun) await writeProblemFile(problemPath(p), p);
    console.log(
      `${dryRun ? 'would write' : 'new'} ${p.id}  ${p.title}  (${p.source.attribution})`
    );
  }
  if (batch.missing.daily > 0)
    console.log(
      `only ${count - batch.missing.daily} of ${count} daily problems available`
    );
  if (batch.missing.deep > 0)
    console.log(
      `only ${deep - batch.missing.deep} of ${deep} deep problems available`
    );
  if (batch.titleSkips > 0)
    console.log(
      `${batch.titleSkips} candidates skipped because every wording repeats an existing title; add title variants to those families`
    );
  if (!dryRun && batch.problems.length > 0) {
    console.log('next: npm run content:verify, then review and approve');
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
