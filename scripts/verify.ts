import { runChecks, type CheckFailure } from '@/lib/pipeline/checks';
import { checkReference, checkSolver } from '@/lib/pipeline/reference';

import { readProblemFiles, writeProblemFile } from './lib/files';
import { loadWords } from './lib/words';

const parseIds = (argv: string[]): string[] | null => {
  const i = argv.indexOf('--ids');
  if (i === -1) return null;
  const ids = (argv[i + 1] ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (ids.length === 0) {
    throw new Error('usage: verify [--ids id1,id2]');
  }
  return ids;
};

const main = async (): Promise<void> => {
  const ids = parseIds(process.argv.slice(2));
  const files = await readProblemFiles();
  const unknown = (ids ?? []).filter(
    (id) => !files.some(({ problem }) => problem.id === id)
  );
  for (const id of unknown) console.log(`unknown id ${id}`);
  let failed = unknown.length > 0;

  const selected = files.filter(({ problem }) =>
    ids ? ids.includes(problem.id) : problem.status === 'draft'
  );
  if (selected.length === 0) {
    if (failed) process.exitCode = 1;
    return;
  }

  const words = await loadWords();
  for (const { path, problem } of selected) {
    const failures: CheckFailure[] = [
      ...runChecks(problem, { words }),
      ...checkReference(problem),
      ...checkSolver(problem)
    ];
    if (failures.length === 0) {
      // Only drafts are promoted; never downgrade an approved problem.
      if (problem.status === 'draft') {
        await writeProblemFile(path, { ...problem, status: 'verified' });
        console.log(`ok ${problem.id}`);
      } else {
        console.log(`ok ${problem.id} (status kept)`);
      }
      continue;
    }
    failed = true;
    for (const f of failures) {
      console.log(`FAIL ${problem.id}: ${f.check}: ${f.message}`);
    }
  }
  if (failed) process.exitCode = 1;
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
