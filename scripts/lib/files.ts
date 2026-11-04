import fs from 'node:fs/promises';
import path from 'node:path';

import { AREAS } from '@/lib/areas';
import {
  problemSchema,
  scheduleSchema,
  type Problem,
  type Schedule
} from '@/lib/content/schema';

export const PROBLEMS_DIR = 'content/problems';
export const SCHEDULE_PATH = 'content/schedule.json';

const isNotFound = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && error.code === 'ENOENT';

const writeJson = async (file: string, value: unknown): Promise<void> => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
};

export const problemPath = (problem: Pick<Problem, 'area' | 'id'>): string =>
  path.join(PROBLEMS_DIR, problem.area, `${problem.id}.json`);

const listJsonFiles = async (dir: string): Promise<string[]> => {
  try {
    const names = await fs.readdir(dir);
    return names
      .filter((name) => name.endsWith('.json'))
      .sort()
      .map((name) => path.join(dir, name));
  } catch (error) {
    if (isNotFound(error)) return [];
    throw error;
  }
};

const readOne = async (
  file: string
): Promise<{ problem?: Problem; failure?: string }> => {
  let json: unknown;
  try {
    json = JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { failure: `${file}: ${reason}` };
  }
  const result = problemSchema.safeParse(json);
  if (result.success) return { problem: result.data };
  const issue = result.error.issues[0];
  return { failure: `${file}: ${issue.path.join('.')} ${issue.message}` };
};

export const readProblemFiles = async (
  root: string = PROBLEMS_DIR
): Promise<{ path: string; problem: Problem }[]> => {
  const files = (
    await Promise.all(AREAS.map((area) => listJsonFiles(path.join(root, area))))
  ).flat();

  const found: { path: string; problem: Problem }[] = [];
  const failures: string[] = [];
  for (const file of files) {
    const { problem, failure } = await readOne(file);
    if (problem) found.push({ path: file, problem });
    if (failure) failures.push(failure);
  }

  if (failures.length > 0) {
    throw new Error(`Invalid problem files:\n${failures.join('\n')}`);
  }
  return found;
};

export const writeProblemFile = (
  file: string,
  problem: Problem
): Promise<void> => writeJson(file, problem);

export const readSchedule = async (
  file: string = SCHEDULE_PATH
): Promise<Schedule> => {
  let raw: string;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (error) {
    if (isNotFound(error)) return { days: {}, weeks: {} };
    throw error;
  }
  return scheduleSchema.parse(JSON.parse(raw));
};

export const writeSchedule = (
  schedule: Schedule,
  file: string = SCHEDULE_PATH
): Promise<void> => writeJson(file, schedule);
