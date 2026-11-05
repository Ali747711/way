import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';

import { defineSingleCodeFamily, type SingleTask } from './single';

const task: SingleTask = {
  id: 'code/double',
  difficulty: 3,
  title: 'Double it',
  task: 'Write `double(n)` that returns `n` times two, for a whole number `n` from 0 to 100.',
  entry: 'double',
  params: 'n',
  reference: 'function double(n) {\n  return n * 2;\n}',
  oracle: ([n]) => (n as number) + (n as number),
  inDomain: ([n]) => typeof n === 'number' && n >= 0 && n <= 100,
  examples: [[2], [5]],
  tests: (rng) => [[0], [1], [3], [4], [50], [99], [100], [rng.int(0, 100)]],
  hints: ['What is n plus n?', 'Is zero handled?', 'Is 100 handled?'],
  approach: 'Multiply by two.',
  notes: 'Nothing tricky.',
  tags: ['math']
};

const build = (t: SingleTask) =>
  defineSingleCodeFamily(t).candidates()[0].build(createRng(1));

describe('defineCodeFamily checks', () => {
  it('builds when the oracle agrees and inputs are in range', () => {
    expect(() => build(task)).not.toThrow();
  });

  it('throws, naming the family and input, when the oracle disagrees', () => {
    const wrong = { ...task, oracle: ([n]: unknown[]) => (n as number) * 3 };
    expect(() => build(wrong)).toThrow(/code\/double only input \[2\]/);
  });

  it('throws when a generated input leaves the stated range', () => {
    const outside = {
      ...task,
      tests: () => [[0], [1], [3], [4], [5], [6], [101]]
    };
    expect(() => build(outside)).toThrow(/outside the range/);
  });
});
