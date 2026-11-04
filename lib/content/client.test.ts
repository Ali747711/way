import { ZodError } from 'zod';
import { describe, expect, it } from 'vitest';

import type { Area } from '@/lib/areas';

import { fetchDay, fetchDeep, type FetchLike } from './client';
import type { DayFile, DeepFile, Problem } from './schema';

function makeProblem(id: string, area: Area, difficulty: number): Problem {
  return {
    id,
    area,
    difficulty,
    title: `Problem ${id}`,
    prompt: 'What is the answer?',
    answer: { type: 'exact', accepted: ['yes'], normalize: 'trim-lower' },
    hints: Array.from(
      { length: difficulty === 5 ? 5 : 3 },
      (_, i) => `hint ${i + 1}`
    ),
    solution: 'Because.',
    source: { kind: 'original' },
    status: 'published',
    tags: [],
    createdAt: '2030-01-01'
  };
}

function fakeFetch(status: number, body: unknown) {
  const requested: string[] = [];
  const fetchFn: FetchLike = async (url) => {
    requested.push(url);
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body
    };
  };
  return { fetchFn, requested };
}

const validDay: DayFile = {
  date: '2030-01-01',
  problems: [
    makeProblem('w-001', 'words', 1),
    makeProblem('l-001', 'logic', 2),
    makeProblem('m-001', 'math', 3),
    makeProblem('c-001', 'code', 3),
    makeProblem('cr-001', 'create', 3)
  ]
};

const validDeep: DeepFile = {
  week: '2030-W01',
  problem: makeProblem('d-001', 'code', 5)
};

describe('fetchDay', () => {
  it('resolves null on 404', async () => {
    const { fetchFn } = fakeFetch(404, {});
    await expect(fetchDay('2030-01-01', fetchFn)).resolves.toBeNull();
  });

  it('returns the parsed DayFile on a valid 200', async () => {
    const { fetchFn } = fakeFetch(200, validDay);
    await expect(fetchDay('2030-01-01', fetchFn)).resolves.toEqual(validDay);
  });

  it('rejects with ZodError when the 200 body is invalid', async () => {
    const { fetchFn } = fakeFetch(200, {});
    await expect(fetchDay('2030-01-01', fetchFn)).rejects.toBeInstanceOf(
      ZodError
    );
  });

  it('rejects with "content 500" on a server error', async () => {
    const { fetchFn } = fakeFetch(500, {});
    await expect(fetchDay('2030-01-01', fetchFn)).rejects.toThrow(
      'content 500'
    );
  });

  it('requests /content/days/<date>.json', async () => {
    const { fetchFn, requested } = fakeFetch(200, validDay);
    await fetchDay('2030-01-01', fetchFn);
    expect(requested).toEqual(['/content/days/2030-01-01.json']);
  });
});

describe('fetchDeep', () => {
  it('returns the parsed DeepFile on a valid 200', async () => {
    const { fetchFn, requested } = fakeFetch(200, validDeep);
    await expect(fetchDeep('2030-W01', fetchFn)).resolves.toEqual(validDeep);
    expect(requested).toEqual(['/content/deep/2030-W01.json']);
  });
});
