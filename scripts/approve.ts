import { approveProblems } from '@/lib/pipeline/review';

import { failuresFor } from './lib/checkAll';
import { parseIdsFlag, writeChanged } from './lib/statusChange';
import { readProblemFiles } from './lib/files';
import { loadWords } from './lib/words';

const main = async (): Promise<void> => {
  const ids = parseIdsFlag(process.argv.slice(2), 'approve');
  const files = await readProblemFiles();
  const words = await loadWords();
  const result = approveProblems(
    files.map((f) => f.problem),
    ids,
    failuresFor(words)
  );
  await writeChanged(files, result, 'approved');
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
