import { AREAS } from '@/lib/areas';
import { contentStatusSchema } from '@/lib/content/schema';

import { readProblemFiles } from './lib/files';

const STATUSES = contentStatusSchema.options;

const main = async (): Promise<void> => {
  const problems = (await readProblemFiles()).map((f) => f.problem);

  const table = Object.fromEntries(
    STATUSES.map((status) => {
      const inStatus = problems.filter((p) => p.status === status);
      const row: Record<string, number> = Object.fromEntries(
        AREAS.map((area) => [
          area,
          inStatus.filter((p) => p.area === area).length
        ])
      );
      row.total = inStatus.length;
      return [status, row];
    })
  );
  const totals: Record<string, number> = Object.fromEntries(
    AREAS.map((area) => [area, problems.filter((p) => p.area === area).length])
  );
  totals.total = problems.length;
  console.table({ ...table, total: totals });

  console.log('');
  for (const p of problems.filter((p) => p.status === 'verified')) {
    console.log(`${p.id}  ${p.title}`);
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
