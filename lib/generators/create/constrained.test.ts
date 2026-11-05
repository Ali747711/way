import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { auditFamily } from '../testing';

import { CONSTRAINED_ITEMS, constrained } from './constrained';
import {
  describeAll,
  describeConstraint,
  describeWordLimit,
  rulesFor
} from './define';
import { independentViolations } from './independent-check';

describe('create/constrained', () => {
  it('passes the audit, so every example meets its rules', () => {
    expect(auditFamily(constrained)).toEqual([]);
  });

  it('states every rule in the prompt', () => {
    for (const item of CONSTRAINED_ITEMS) {
      const candidate = constrained
        .candidates()
        .find((c) => c.key === item.key);
      const prompt = candidate?.build(createRng(1)).prompt ?? '';
      for (const line of describeAll(item.constraints))
        expect(prompt).toContain(line);
    }
  });

  it('meets every rule under an independent check', () => {
    expect(CONSTRAINED_ITEMS.flatMap(independentViolations)).toEqual([]);
  });

  it('has unique titles', () => {
    const titles = CONSTRAINED_ITEMS.map((i) => i.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('describe helpers', () => {
  it('words every constraint type', () => {
    expect(describeConstraint({ type: 'no-letter', letter: 'e' })).toContain(
      'not even in *the*'
    );
    expect(describeConstraint({ type: 'no-letter', letter: 'a' })).toBe(
      'Do not use the letter *a* anywhere.'
    );
    expect(
      describeConstraint({ type: 'max-word-length', letters: 4 })
    ).toContain('4 letters');
    expect(describeConstraint({ type: 'sentence-count', count: 1 })).toBe(
      'Write exactly one sentence.'
    );
    expect(describeConstraint({ type: 'sentence-count', count: 3 })).toContain(
      '3 sentences'
    );
    expect(describeConstraint({ type: 'sentence-words', words: 5 })).toContain(
      '5 words'
    );
    expect(describeConstraint({ type: 'all-questions' })).toContain('question');
    expect(describeConstraint({ type: 'acrostic', word: 'sun' })).toContain(
      '*SUN*'
    );
    expect(describeConstraint({ type: 'alphabet-run', from: 'c' })).toContain(
      '*D*'
    );
    expect(describeConstraint({ type: 'must-include', words: ['rain'] })).toBe(
      'Use the word *rain*.'
    );
    expect(
      describeConstraint({ type: 'must-include', words: ['a', 'b'] })
    ).toBe('Use the words *a* and *b*.');
    expect(
      describeConstraint({ type: 'forbid-words', words: ['x', 'y', 'z'] })
    ).toBe('Do not use the words *x*, *y*, *z*.');
    expect(describeConstraint({ type: 'same-start', letter: 's' })).toContain(
      '*s*'
    );
    expect(describeConstraint({ type: 'no-repeat' })).toContain(
      'more than once'
    );
  });

  it('words the limits', () => {
    expect(describeWordLimit(6, 6)).toBe('Write exactly 6 words.');
    expect(describeWordLimit(10, 20)).toBe('Write 10 to 20 words.');
    expect(describeWordLimit(undefined, 20)).toBe('Use at most 20 words.');
    expect(describeWordLimit(10)).toBe('Write at least 10 words.');
    expect(describeWordLimit()).toBeNull();
  });

  it('names the letters of an alphabet run with a fixed sentence count', () => {
    expect(
      rulesFor({
        constraints: [
          { type: 'sentence-count', count: 5 },
          { type: 'alphabet-run', from: 'a' }
        ]
      })
    ).toContain(
      'Start your five sentences with *A*, *B*, *C*, *D* and *E*, in that order.'
    );
    expect(
      rulesFor({
        constraints: [
          { type: 'sentence-count', count: 1 },
          { type: 'alphabet-run', from: 'q' }
        ]
      })
    ).toContain('Start your sentence with *Q*.');
    expect(
      rulesFor({
        constraints: [
          { type: 'sentence-count', count: 3 },
          { type: 'alphabet-run', from: 'y' }
        ]
      })
    ).toContain('and so on through the alphabet');
    expect(
      rulesFor({ constraints: [{ type: 'sentence-words', words: 6 }] })
    ).toContain('counted by the spaces');
  });

  it('adds the counting notes only when they apply', () => {
    expect(
      rulesFor({ constraints: [{ type: 'no-letter', letter: 'e' }] })
    ).not.toContain('counted');
    const both = rulesFor({
      constraints: [{ type: 'sentence-count', count: 2 }],
      minWords: 5,
      maxWords: 9
    });
    expect(both).toContain('counted by the spaces');
    expect(both).toContain('A sentence ends');
  });
});
