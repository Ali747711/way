// @vitest-environment node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { Problem, Schedule } from '@/lib/content/schema';

import {
  PROBLEMS_DIR,
  SCHEDULE_PATH,
  problemPath,
  readProblemFiles,
  readSchedule,
  writeProblemFile,
  writeSchedule
} from './files';

const problem: Problem = {
  id: 'words-001',
  area: 'words',
  difficulty: 1,
  title: 'Opposite',
  prompt: 'What is the opposite of hot?',
  answer: { type: 'exact', accepted: ['cold'], normalize: 'trim-lower' },
  hints: ['a', 'b', 'c'],
  solution: 'Cold.',
  source: { kind: 'original' },
  status: 'draft',
  tags: [],
  createdAt: '2030-01-01'
};

let dir: string;

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'way-'));
});

afterEach(async () => {
  await fs.rm(dir, { recursive: true, force: true });
});

describe('problemPath', () => {
  it('builds content/problems/<area>/<id>.json', () => {
    expect(problemPath(problem)).toBe(
      path.join(PROBLEMS_DIR, 'words', 'words-001.json')
    );
    expect(PROBLEMS_DIR).toBe('content/problems');
    expect(SCHEDULE_PATH).toBe('content/schedule.json');
  });
});

describe('problem files', () => {
  it('round-trips a problem and writes 2-space JSON with a newline', async () => {
    const file = path.join(dir, 'words', 'words-001.json');
    await writeProblemFile(file, problem);
    const raw = await fs.readFile(file, 'utf8');
    expect(raw).toBe(JSON.stringify(problem, null, 2) + '\n');

    const found = await readProblemFiles(dir);
    expect(found).toEqual([{ path: file, problem }]);
  });

  it('returns [] for a missing root', async () => {
    expect(await readProblemFiles(path.join(dir, 'nope'))).toEqual([]);
  });

  it('throws listing every invalid file with its path', async () => {
    await fs.mkdir(path.join(dir, 'words'), { recursive: true });
    const bad1 = path.join(dir, 'words', 'bad1.json');
    const bad2 = path.join(dir, 'words', 'bad2.json');
    await fs.writeFile(bad1, JSON.stringify({ id: 'x' }));
    await fs.writeFile(bad2, '{ not json');
    await writeProblemFile(path.join(dir, 'words', 'ok.json'), problem);

    const error = await readProblemFiles(dir).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain(bad1);
    expect(message).toContain(bad2);
    expect(message).not.toContain('ok.json');
  });
});

describe('schedule files', () => {
  it('returns an empty schedule when the file is missing', async () => {
    expect(await readSchedule(path.join(dir, 'missing.json'))).toEqual({
      days: {},
      weeks: {}
    });
  });

  it('round-trips a schedule and creates parent directories', async () => {
    const schedule: Schedule = {
      days: {
        '2030-01-01': {
          words: 'w-001',
          logic: 'l-001',
          math: 'm-001',
          code: 'c-001',
          create: 'cr-001'
        }
      },
      weeks: { '2030-W01': 'd-001' }
    };
    const file = path.join(dir, 'nested', 'schedule.json');
    await writeSchedule(schedule, file);
    expect(await fs.readFile(file, 'utf8')).toBe(
      JSON.stringify(schedule, null, 2) + '\n'
    );
    expect(await readSchedule(file)).toEqual(schedule);
  });

  it('throws on an invalid schedule file', async () => {
    const file = path.join(dir, 'schedule.json');
    await fs.writeFile(file, JSON.stringify({ days: { nope: {} }, weeks: {} }));
    await expect(readSchedule(file)).rejects.toThrow();
  });
});
