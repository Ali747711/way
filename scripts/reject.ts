import { rejectProblems } from '@/lib/pipeline/review';

import { parseIdsFlag, writeChanged } from './lib/statusChange';
import { readProblemFiles } from './lib/files';

const main = async (): Promise<void> => {
  const ids = parseIdsFlag(process.argv.slice(2), 'reject');
  const files = await readProblemFiles();
  await writeChanged(
    files,
    rejectProblems(
      files.map((f) => f.problem),
      ids
    ),
    'rejected'
  );
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
