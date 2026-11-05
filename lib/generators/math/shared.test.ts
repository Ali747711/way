import { describe, expect, it } from 'vitest';

import { sup } from './shared';

describe('sup', () => {
  it('writes every digit as a superscript', () => {
    expect(sup(2026)).toBe('²⁰²⁶');
    expect(sup(30)).toBe('³⁰');
    expect(sup(1789)).toBe('¹⁷⁸⁹');
  });
});
