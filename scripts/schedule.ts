import { addDays, buildSchedule } from '@/lib/pipeline/schedule';

import {
  readProblemFiles,
  readSchedule,
  writeProblemFile,
  writeSchedule
} from './lib/files';

const USAGE = 'usage: schedule --from YYYY-MM-DD --days N';
const DATE_SHAPE = /^\d{4}-\d{2}-\d{2}$/;

const flag = (argv: string[], name: string): string | undefined => {
  const i = argv.indexOf(name);
  return i === -1 ? undefined : argv[i + 1];
};

const parseArgs = (argv: string[]): { from: string; days: number } => {
  const from = flag(argv, '--from');
  const rawDays = flag(argv, '--days');
  const days = Number(rawDays);
  if (
    !from ||
    !DATE_SHAPE.test(from) ||
    addDays(from, 0) !== from ||
    !rawDays ||
    !/^\d+$/.test(rawDays) ||
    !Number.isInteger(days) ||
    days < 1
  ) {
    throw new Error(USAGE);
  }
  return { from, days };
};

const main = async (): Promise<void> => {
  const { from, days } = parseArgs(process.argv.slice(2));
  const files = await readProblemFiles();

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const { problem } of files) {
    if (seen.has(problem.id)) duplicates.add(problem.id);
    seen.add(problem.id);
  }
  if (duplicates.size > 0) {
    for (const id of duplicates) console.error(`duplicate id ${id}`);
    process.exitCode = 1;
    return;
  }

  const existing = await readSchedule();
  const { schedule, used, shortages } = buildSchedule(
    files.map(({ problem }) => problem),
    existing,
    from,
    days
  );

  if (shortages.length > 0) {
    for (const s of shortages) {
      const where = [s.date ?? s.week, s.area].filter(Boolean).join(' ');
      console.error(`shortage ${where}: ${s.message}`);
    }
    process.exitCode = 1;
    return;
  }

  await writeSchedule(schedule);
  const usedIds = new Set(used);
  for (const { path, problem } of files) {
    if (usedIds.has(problem.id)) {
      await writeProblemFile(path, { ...problem, status: 'published' });
    }
  }
  const newDays =
    Object.keys(schedule.days).length - Object.keys(existing.days).length;
  const newWeeks =
    Object.keys(schedule.weeks).length - Object.keys(existing.weeks).length;
  console.log(`scheduled ${newDays} days, ${newWeeks} weeks`);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
