import { describe, expect, it } from 'vitest';

import type { Problem } from '@/lib/content/schema';

import {
  checkDifficultyBand,
  checkHintsAreQuestions,
  checkHintsHideAnswer,
  checkOpenExample,
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

  it('catches negative and decimal answers', () => {
    const number = (value: number, hint: string) =>
      makeProblem({
        area: 'math',
        difficulty: 3,
        answer: { type: 'number', value, tolerance: 0 },
        hints: [hint, 'Is it small?', 'Is it odd?']
      });
    expect(checkHintsHideAnswer(number(-5, 'Is it -5?'))).toHaveLength(1);
    expect(checkHintsHideAnswer(number(3.5, 'Is it 3.5?'))).toHaveLength(1);
    expect(checkHintsHideAnswer(number(3.5, 'Is it 3.55?'))).toEqual([]);
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

describe('checkOpenExample', () => {
  const open = (extra: Record<string, unknown> = {}): Problem['answer'] =>
    ({
      type: 'open',
      minWords: 3,
      maxWords: 6,
      authorNote: 'note',
      ...extra
    }) as Problem['answer'];
  const createProblem = (answer: Problem['answer']): Problem =>
    makeProblem({ area: 'create', difficulty: 3, answer });

  it('ignores problems that are not open', () => {
    expect(checkOpenExample(makeProblem())).toEqual([]);
  });

  it('passes an open problem with no constraints and no example', () => {
    expect(checkOpenExample(createProblem(open()))).toEqual([]);
  });

  it('passes an example that meets every constraint and the word limits', () => {
    const answer = open({
      constraints: [{ type: 'no-letter', letter: 'e' }],
      example: 'A cat sat down.'
    });
    expect(checkOpenExample(createProblem(answer))).toEqual([]);
  });

  it('fails constraints that come without an example', () => {
    const answer = open({ constraints: [{ type: 'no-letter', letter: 'e' }] });
    const failures = checkOpenExample(createProblem(answer));
    expect(failures).toHaveLength(1);
    expect(failures[0].check).toBe('open-example');
  });

  it('fails an example that breaks a constraint', () => {
    const answer = open({
      constraints: [{ type: 'no-letter', letter: 'e' }],
      example: 'The cat sat down.'
    });
    expect(checkOpenExample(createProblem(answer))[0].message).toContain('"e"');
  });

  it('fails an example outside the word limits', () => {
    const short = open({ example: 'Too short.' });
    const long = open({ example: 'This one has far too many words in it.' });
    expect(checkOpenExample(createProblem(short))).toHaveLength(1);
    expect(checkOpenExample(createProblem(long))).toHaveLength(1);
  });

  it('runs as part of runChecks', () => {
    const answer = open({
      constraints: [{ type: 'no-letter', letter: 'e' }],
      example: 'The cat sat down.'
    });
    const p = makeProblem({
      area: 'create',
      difficulty: 3,
      answer,
      hints: ['Why?', 'How?', 'What?']
    });
    expect(runChecks(p, { words }).map((f) => f.check)).toContain(
      'open-example'
    );
  });
});
