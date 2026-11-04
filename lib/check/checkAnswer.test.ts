import { describe, expect, it } from 'vitest';

import { checkAnswer, type CheckableAnswer } from './checkAnswer';
import { normalizeText } from './normalize';

describe('normalizeText', () => {
  it('trims, lowercases and collapses whitespace', () => {
    expect(normalizeText('  The   Cat ', 'trim-lower')).toBe('the cat');
  });

  it('leaves text alone in none mode', () => {
    expect(normalizeText(' A ', 'none')).toBe(' A ');
  });
});

describe('checkAnswer exact', () => {
  const answer: CheckableAnswer = {
    type: 'exact',
    accepted: ['cat', 'kitten'],
    normalize: 'trim-lower'
  };

  it('accepts any accepted answer after normalization', () => {
    expect(checkAnswer(answer, ' Kitten ')).toEqual({ correct: true });
  });

  it('rejects a wrong answer', () => {
    expect(checkAnswer(answer, 'dog')).toEqual({
      correct: false,
      reason: 'wrong'
    });
  });

  it('treats blank as invalid', () => {
    expect(checkAnswer(answer, '   ')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('compares case-sensitively when normalize is none', () => {
    const strict: CheckableAnswer = {
      type: 'exact',
      accepted: ['Cat'],
      normalize: 'none'
    };
    expect(checkAnswer(strict, 'Cat')).toEqual({ correct: true });
    expect(checkAnswer(strict, 'cat')).toEqual({
      correct: false,
      reason: 'wrong'
    });
  });
});

describe('checkAnswer number', () => {
  const answer: CheckableAnswer = {
    type: 'number',
    value: 42,
    tolerance: 0
  };

  it('accepts 42', () => {
    expect(checkAnswer(answer, '42')).toEqual({ correct: true });
  });

  it('accepts 42.0', () => {
    expect(checkAnswer(answer, '42.0')).toEqual({ correct: true });
  });

  it('rejects 41 as wrong', () => {
    expect(checkAnswer(answer, '41')).toEqual({
      correct: false,
      reason: 'wrong'
    });
  });

  it('treats abc as invalid', () => {
    expect(checkAnswer(answer, 'abc')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('treats blank as invalid', () => {
    expect(checkAnswer(answer, '   ')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('honors tolerance', () => {
    expect(
      checkAnswer({ type: 'number', value: 3.1416, tolerance: 0.01 }, '3.14')
    ).toEqual({ correct: true });
  });

  it('rejects values outside tolerance', () => {
    expect(
      checkAnswer({ type: 'number', value: 3.1416, tolerance: 0.001 }, '3.14')
    ).toEqual({ correct: false, reason: 'wrong' });
  });
});

describe('checkAnswer choice', () => {
  const answer: CheckableAnswer = {
    type: 'choice',
    options: ['red', 'green', 'blue'],
    correctIndex: 2
  };

  it('accepts the correct index', () => {
    expect(checkAnswer(answer, '2')).toEqual({ correct: true });
  });

  it('rejects a wrong index', () => {
    expect(checkAnswer(answer, '0')).toEqual({
      correct: false,
      reason: 'wrong'
    });
  });

  it('treats an out-of-range index as invalid', () => {
    expect(checkAnswer(answer, '9')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('treats a negative index as invalid', () => {
    expect(checkAnswer(answer, '-1')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('treats a non-integer index as invalid', () => {
    expect(checkAnswer(answer, '1.5')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('treats blank as invalid', () => {
    expect(checkAnswer(answer, '')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });
});

describe('checkAnswer open', () => {
  it('treats text below minWords as invalid', () => {
    const answer: CheckableAnswer = {
      type: 'open',
      minWords: 3,
      authorNote: ''
    };
    expect(checkAnswer(answer, 'one two')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('accepts text that meets minWords', () => {
    const answer: CheckableAnswer = {
      type: 'open',
      minWords: 3,
      authorNote: ''
    };
    expect(checkAnswer(answer, 'one two three')).toEqual({ correct: true });
  });

  it('treats text above maxWords as invalid', () => {
    const answer: CheckableAnswer = {
      type: 'open',
      maxWords: 3,
      authorNote: ''
    };
    expect(checkAnswer(answer, 'one two three four')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });

  it('accepts text within maxWords', () => {
    const answer: CheckableAnswer = {
      type: 'open',
      maxWords: 3,
      authorNote: ''
    };
    expect(checkAnswer(answer, 'one two three')).toEqual({ correct: true });
  });

  it('accepts any non-blank text when no limits are set', () => {
    const answer: CheckableAnswer = { type: 'open', authorNote: '' };
    expect(checkAnswer(answer, 'x')).toEqual({ correct: true });
  });

  it('treats blank as invalid', () => {
    const answer: CheckableAnswer = { type: 'open', authorNote: '' };
    expect(checkAnswer(answer, '  \n ')).toEqual({
      correct: false,
      reason: 'invalid'
    });
  });
});
