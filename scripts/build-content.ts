import fs from 'node:fs/promises';
import path from 'node:path';

import {
  AssembleError,
  assembleDay,
  assembleWeek
} from '@/lib/content/assemble';
import type { Problem } from '@/lib/content/schema';

import { readProblemFiles, readSchedule } from './lib/files';

const OUT_DIR = path.join(process.cwd(), 'public', 'content');

const writeOut = async (
  folder: string,
  name: string,
  value: unknown
): Promise<void> => {
  const dir = path.join(OUT_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${name}.json`), JSON.stringify(value));
};

const main = async (): Promise<void> => {
  const root = process.cwd();
  const problems = await readProblemFiles(path.join(root, 'content/problems'));
  const schedule = await readSchedule(path.join(root, 'content/schedule.json'));
  const byId = new Map<string, Problem>(
    problems.map(({ problem }) => [problem.id, problem])
  );

  const dates = Object.keys(schedule.days);
  const weeks = Object.keys(schedule.weeks);
  for (const date of dates) {
    await writeOut('days', date, assembleDay(schedule, byId, date));
  }
  for (const week of weeks) {
    await writeOut('deep', week, assembleWeek(schedule, byId, week));
  }
  console.log(`wrote ${dates.length} days, ${weeks.length} weeks`);
};

main().catch((error: unknown) => {
  if (error instanceof AssembleError) {
    console.error(`build:content failed. ${error.message}`);
    for (const id of error.problems) console.error(`  - ${id}`);
  } else {
    console.error(error);
  }
  process.exit(1);
});
