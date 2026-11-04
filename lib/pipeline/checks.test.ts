import { describe, expect, it } from 'vitest';

import type { Problem } from '@/lib/content/schema';

import {
  checkDifficultyBand,
  checkHintsAreQuestions,
  checkHintsHideAnswer,
  checkWordList,
  runChecks
} from './checks';

const makeProblem = (overrides: Partial<Problem> = {}): Problem => ({
  id: 'w-001',
  area: 'words',
  difficulty: 1,
  title: 'Pet',
  prompt: 'Name a small furry pet that purrs.',
  answer: { type: 'exact', accepted: ['cat'], normalize: 'trim-lower' },
  hints: ['Does it live indoors?', 'Does it chase mice?', 'Does it meow?'],
  solution: 'A cat purrs.',
  source: { kind: 'original' },
  status: 'draft',
  tags: [],
  createdAt: '2026-11-04',
  ...overrides
});

const words = new Set(['cat', 'dog']);

describe('checkHintsAreQuestions', () => {
  it('fails a hint that is not a question', () => {
    const p = makeProblem({
      hints: ['Have you tried smaller numbers', 'Why?', 'How?']
    });
    const failures = checkHintsAreQuestions(p);
    expect(failures).toHaveLength(1);
    expect(failures[0].check).toBe('hints-are-questions');
    expect(failures[0].message).toContain('0');
  });

  it('passes when every hint ends with a question mark', () => {
    expect(checkHintsAreQuestions(makeProblem())).toEqual([]);
  });
});

describe('checkHintsHideAnswer', () => {
  it('fails when a hint contains an accepted answer', () => {
    const p = makeProblem({
      hints: ['Is it a mammal?', 'Is the answer cat?', 'Does it meow?']
    });
    const failures = checkHintsHideAnswer(p);
    expect(failures).toHaveLength(1);
    expect(failures[0].check).toBe('hints-hide-answer');
    expect(failures[0].message).toContain('1');
  });

  it('matches the number as a whole token only', () => {
    const number = (hint: string) =>
      makeProblem({
        area: 'math',
        difficulty: 3,
        answer: { type: 'number', value: 42, tolerance: 0 },
        hints: [hint, 'Is it even?', 'Is it small?']
      });
    expect(checkHintsHideAnswer(number('Is it 42?'))).toHaveLength(1);
    expect(checkHintsHideAnswer(number('Is it near 420?'))).toEqual([]);
  });

  it('fails when a hint contains the correct choice text', () => {
    const p = makeProblem({
      answer: { type: 'choice', options: ['Red', 'Blue'], correctIndex: 1 },
      hints: ['Is it Blue?', 'Is it cold?', 'Is it the sky?']
    });
    expect(checkHintsHideAnswer(p)).toHaveLength(1);
  });
});

describe('checkDifficultyBand', () => {
  it('fails a code problem at difficulty 2', () => {
    const failures = checkDifficultyBand(
      makeProblem({ area: 'code', difficulty: 2 })
    );
    expect(failures).toHaveLength(1);
    expect(failures[0].check).toBe('difficulty-band');
  });

  it('allows the band and the deep difficulty', () => {
    expect(
      checkDifficultyBand(makeProblem({ area: 'code', difficulty: 4 }))
    ).toEqual([]);
    expect(
      checkDifficultyBand(makeProblem({ area: 'code', difficulty: 5 }))
    ).toEqual([]);
  });
});

describe('checkWordList', () => {
  it('fails a word missing from the list and names it', () => {
    const p = makeProblem({
      answer: { type: 'exact', accepted: ['xqzt'], normalize: 'trim-lower' }
    });
    const failures = checkWordList(p, words);
    expect(failures).toHaveLength(1);
    expect(failures[0].check).toBe('word-list');
    expect(failures[0].message).toContain('xqzt');
  });

  it('ignores other areas', () => {
    const p = makeProblem({
      area: 'logic',
      difficulty: 2,
      answer: { type: 'exact', accepted: ['xqzt'], normalize: 'trim-lower' }
    });
    expect(checkWordList(p, words)).toEqual([]);
  });
});

describe('runChecks', () => {
  it('returns no failures for a clean problem', () => {
    expect(runChecks(makeProblem(), { words })).toEqual([]);
  });
});
