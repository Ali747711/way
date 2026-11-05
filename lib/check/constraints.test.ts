import { describe, expect, it } from 'vitest';

import { checkConstraints, sentencesOf, wordsOf } from './constraints';

describe('wordsOf', () => {
  it('splits on whitespace and trims punctuation, keeping hyphenated words whole', () => {
    expect(wordsOf('  Hello, store-bought world!  ')).toEqual([
      'Hello',
      'store-bought',
      'world'
    ]);
  });
  it('drops tokens that are only punctuation', () => {
    expect(wordsOf('Wait — what?')).toEqual(['Wait', 'what']);
  });
});

describe('sentencesOf', () => {
  it('splits after . ! or ? and keeps an unpunctuated tail', () => {
    expect(sentencesOf('One. Two? Three! Four')).toEqual([
      'One.',
      'Two?',
      'Three!',
      'Four'
    ]);
  });
  it('returns nothing for blank text', () => {
    expect(sentencesOf('   ')).toEqual([]);
  });
});

describe('checkConstraints', () => {
  it('no-letter fails on the letter in any case', () => {
    expect(
      checkConstraints('A cat sat.', [{ type: 'no-letter', letter: 'e' }])
    ).toEqual([]);
    expect(
      checkConstraints('Every cat.', [{ type: 'no-letter', letter: 'e' }])
    ).toHaveLength(1);
  });

  it('max-word-length counts letters only', () => {
    const c = [{ type: 'max-word-length' as const, letters: 4 }];
    expect(checkConstraints('I ran far, fast!', c)).toEqual([]);
    expect(checkConstraints('I sprinted.', c)).toHaveLength(1);
  });

  it('sentence-count needs the exact number', () => {
    const c = [{ type: 'sentence-count' as const, count: 2 }];
    expect(checkConstraints('One. Two.', c)).toEqual([]);
    expect(checkConstraints('One. Two. Three.', c)).toHaveLength(1);
  });

  it('sentence-words needs every sentence at the exact length', () => {
    const c = [{ type: 'sentence-words' as const, words: 3 }];
    expect(checkConstraints('I like tea. You like coffee.', c)).toEqual([]);
    expect(checkConstraints('I like tea. You do.', c)).toHaveLength(1);
  });

  it('all-questions needs every sentence to end with ?', () => {
    const c = [{ type: 'all-questions' as const }];
    expect(checkConstraints('Who? Why not?', c)).toEqual([]);
    expect(checkConstraints('Who? Because.', c)).toHaveLength(1);
  });

  it('acrostic reads the first letter of each sentence', () => {
    const c = [{ type: 'acrostic' as const, word: 'sun' }];
    expect(checkConstraints('Stay. Unwind. Nap.', c)).toEqual([]);
    expect(checkConstraints('Stay. Nap. Unwind.', c)).toHaveLength(1);
    expect(checkConstraints('Stay. Unwind.', c)).toHaveLength(1);
  });

  it('alphabet-run needs consecutive starting letters', () => {
    const c = [{ type: 'alphabet-run' as const, from: 'c' }];
    expect(checkConstraints('Cats nap. Dogs run. Eels swim.', c)).toEqual([]);
    expect(checkConstraints('Cats nap. Eels swim.', c)).toHaveLength(1);
  });

  it('must-include matches whole words, any case', () => {
    const c = [{ type: 'must-include' as const, words: ['rain', 'key'] }];
    expect(checkConstraints('The Rain hid my key.', c)).toEqual([]);
    expect(checkConstraints('The rainbow hid my keys.', c)).toEqual([
      'missing rain, key'
    ]);
  });

  it('forbid-words rejects any listed word', () => {
    const c = [{ type: 'forbid-words' as const, words: ['very'] }];
    expect(checkConstraints('It was cold.', c)).toEqual([]);
    expect(checkConstraints('It was Very cold.', c)).toHaveLength(1);
  });

  it('same-start needs every word to begin with the letter', () => {
    const c = [{ type: 'same-start' as const, letter: 's' }];
    expect(checkConstraints('Sam sees seven swans.', c)).toEqual([]);
    expect(checkConstraints('Sam sees a swan.', c)).toHaveLength(1);
  });

  it('no-repeat rejects any word used twice, ignoring case', () => {
    const c = [{ type: 'no-repeat' as const }];
    expect(checkConstraints('One two three.', c)).toEqual([]);
    expect(checkConstraints('The cat saw the dog.', c)).toHaveLength(1);
  });

  it('reports one message per failed constraint', () => {
    const out = checkConstraints('Every very big thing.', [
      { type: 'no-letter', letter: 'e' },
      { type: 'forbid-words', words: ['very'] }
    ]);
    expect(out).toHaveLength(2);
  });

  it('no-letter sees through accents', () => {
    const c = [{ type: 'no-letter' as const, letter: 'e' }];
    expect(checkConstraints('A café.', c)).toHaveLength(1);
  });

  it('forbid-words catches the word inside hyphens and possessives', () => {
    const thank = [{ type: 'forbid-words' as const, words: ['thank'] }];
    expect(checkConstraints('A thank-you note.', thank)).toHaveLength(1);
    const night = [{ type: 'forbid-words' as const, words: ['night'] }];
    expect(checkConstraints('The night’s end.', night)).toHaveLength(1);
    expect(checkConstraints('A nightly walk.', night)).toEqual([]);
  });

  it('must-include accepts the word inside a hyphenated word', () => {
    const c = [{ type: 'must-include' as const, words: ['rain'] }];
    expect(checkConstraints('A rain-soaked day.', c)).toEqual([]);
  });

  it('sentence-words counts by spaces, like the word limit', () => {
    const c = [{ type: 'sentence-words' as const, words: 3 }];
    expect(checkConstraints('Wait — what?', c)).toEqual([]);
  });

  it('alphabet-run fails a run that would go past z', () => {
    const c = [{ type: 'alphabet-run' as const, from: 'y' }];
    expect(checkConstraints('Yes. Zoom.', c)).toEqual([]);
    expect(checkConstraints('Yes. Zoom. Again.', c)).toHaveLength(1);
  });

  it('treats curly and straight apostrophes alike', () => {
    const c = [{ type: 'forbid-words' as const, words: ["night's"] }];
    expect(checkConstraints('The night’s end.', c)).toHaveLength(1);
  });
});
