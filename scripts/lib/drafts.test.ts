import { describe, expect, it } from 'vitest';

import { extractDraftArray } from './drafts';

describe('extractDraftArray', () => {
  it('parses a bare JSON array', () => {
    expect(extractDraftArray('[{"a":1},{"b":2}]')).toEqual([
      { a: 1 },
      { b: 2 }
    ]);
  });

  it('unwraps an object with an elements array', () => {
    expect(extractDraftArray('{"elements":[{"a":1}]}')).toEqual([{ a: 1 }]);
  });

  it('strips a code fence and surrounding prose', () => {
    const text = 'Here they are:\n```json\n[{"a":1}]\n```\nDone.';
    expect(extractDraftArray(text)).toEqual([{ a: 1 }]);
  });

  it('throws when the reply holds no JSON', () => {
    expect(() => extractDraftArray('sorry, no problems today')).toThrow(
      /no JSON/
    );
  });

  it('throws when the JSON is not an array of drafts', () => {
    expect(() => extractDraftArray('{"title":"x"}')).toThrow(/array/);
  });

  it('throws on truncated JSON', () => {
    expect(() => extractDraftArray('[{"a":1},{"b":')).toThrow();
  });
});
