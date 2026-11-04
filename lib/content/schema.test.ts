import { describe, expect, it } from 'vitest';

import { dayFileSchema, problemSchema, scheduleSchema } from './schema';

function validExact() {
  return {
    id: 'words-001',
    area: 'words',
    difficulty: 1,
    title: 'Opposite',
    prompt: 'What is the opposite of hot?',
    answer: { type: 'exact', accepted: ['cold'] },
    hints: ['Think temperature', 'Not warm', 'Starts with c'],
    solution: 'The opposite of hot is cold.',
    source: { kind: 'original' },
    status: 'draft',
    createdAt: '2030-01-01'
  };
}

describe('problemSchema', () => {
  it('parses a valid exact problem and applies defaults', () => {
    const p = problemSchema.parse(validExact());
    expect(p.answer.type === 'exact' && p.answer.normalize).toBe('trim-lower');
    expect(p.tags).toEqual([]);
  });

  it('rejects 3 hints on a difficulty 5 problem', () => {
    const result = problemSchema.safeParse({ ...validExact(), difficulty: 5 });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0].path).toEqual(['hints']);
  });

  it('rejects a choice correctIndex outside options', () => {
    const answer = { type: 'choice', options: ['a', 'b'], correctIndex: 2 };
    const result = problemSchema.safeParse({ ...validExact(), answer });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0].path).toEqual([
      'answer',
      'correctIndex'
    ]);
  });

  it('defaults code timeLimitMs to 2000', () => {
    const testCase = { input: [1, 2], expected: 3 };
    const answer = {
      type: 'code',
      signature: 'function add(a, b)',
      entry: 'add',
      examples: [testCase],
      tests: [testCase],
      reference: 'function add(a, b) { return a + b }'
    };
    const p = problemSchema.parse({ ...validExact(), answer });
    expect(p.answer.type === 'code' && p.answer.timeLimitMs).toBe(2000);
  });
});

describe('scheduleSchema', () => {
  it('rejects a malformed schedule date key', () => {
    expect(() =>
      scheduleSchema.parse({ days: { '2030-1-1': {} }, weeks: {} })
    ).toThrow();
  });
});

describe('dayFileSchema', () => {
  it('requires exactly five problems in a day file', () => {
    const four = Array.from({ length: 4 }, () => validExact());
    const five = Array.from({ length: 5 }, () => validExact());
    expect(() =>
      dayFileSchema.parse({ date: '2030-01-01', problems: four })
    ).toThrow();
    expect(
      dayFileSchema.parse({ date: '2030-01-01', problems: five }).problems
    ).toHaveLength(5);
  });
});
