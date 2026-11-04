import { describe, expect, it } from 'vitest';

import { maxAttempts } from './attempts';

describe('maxAttempts', () => {
  it.each([
    ['exact', 3],
    ['number', 3],
    ['choice', 1],
    ['code', Infinity],
    ['open', 1]
  ] as const)('limits %s answers to %s attempt(s)', (type, expected) => {
    expect(maxAttempts(type)).toBe(expected);
  });

  it('allows unlimited attempts in deep mode', () => {
    expect(maxAttempts('exact', true)).toBe(Infinity);
  });
});
