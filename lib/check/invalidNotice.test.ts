import { describe, expect, it } from 'vitest';

import type { Answer } from '@/lib/content/schema';

import { invalidNotice } from './invalidNotice';

const open = (extra: { minWords?: number; maxWords?: number }): Answer => ({
  type: 'open',
  authorNote: 'note',
  ...extra
});
const exact: Answer = {
  type: 'exact',
  accepted: ['cat'],
  normalize: 'trim-lower'
};
const num: Answer = { type: 'number', value: 4, tolerance: 0 };
const choice: Answer = { type: 'choice', options: ['a', 'b'], correctIndex: 0 };

describe('invalidNotice', () => {
  it('asks for a range when both limits differ', () => {
    expect(invalidNotice(open({ minWords: 3, maxWords: 8 }), 'one two')).toBe(
      'Use 3–8 words.'
    );
    expect(
      invalidNotice(open({ minWords: 3, maxWords: 8 }), 'a b c d e f g h i')
    ).toBe('Use 3–8 words.');
  });

  it('asks for an exact count when min equals max', () => {
    expect(invalidNotice(open({ minWords: 6, maxWords: 6 }), 'one two')).toBe(
      'Use exactly 6 words.'
    );
  });

  it('names the single limit that is set', () => {
    expect(invalidNotice(open({ minWords: 3 }), 'one two')).toBe(
      'Use at least 3 words.'
    );
    expect(invalidNotice(open({ maxWords: 2 }), 'one two three')).toBe(
      'Use at most 2 words.'
    );
  });

  it('is null when an open answer is within limits', () => {
    expect(invalidNotice(open({ minWords: 3 }), 'one two three')).toBeNull();
    expect(invalidNotice(open({}), 'anything')).toBeNull();
  });

  it('asks for text when a text answer is blank', () => {
    expect(invalidNotice(exact, '   ')).toBe('Type an answer first.');
    expect(invalidNotice(num, '')).toBe('Type an answer first.');
    expect(invalidNotice(open({ minWords: 3 }), '')).toBe(
      'Type an answer first.'
    );
  });

  it('asks for a number when the draft is not numeric', () => {
    expect(invalidNotice(num, 'abc')).toBe('Enter a number.');
  });

  it('asks to pick an option when a choice has no selection', () => {
    expect(invalidNotice(choice, '')).toBe('Pick an option first.');
  });

  it('is null for a wrong-but-valid answer and for code', () => {
    expect(invalidNotice(exact, 'dog')).toBeNull();
    expect(invalidNotice(num, '5')).toBeNull();
    expect(invalidNotice(choice, '1')).toBeNull();
    const code: Answer = {
      type: 'code',
      signature: 'function f() {}',
      entry: 'f',
      examples: [],
      tests: [],
      timeLimitMs: 1000,
      reference: ''
    };
    expect(invalidNotice(code, '')).toBeNull();
  });
});
