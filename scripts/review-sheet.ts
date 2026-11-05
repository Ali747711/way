import fs from 'node:fs/promises';

import { renderReviewSheet } from '@/lib/pipeline/review';

import { readProblemFiles } from './lib/files';

const OUT = 'content/review.md';

const main = async (): Promise<void> => {
  const verified = (await readProblemFiles())
    .map((f) => f.problem)
    .filter((p) => p.status === 'verified');
  await fs.writeFile(OUT, renderReviewSheet(verified));
  console.log(`${verified.length} problems to review: ${OUT}`);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
