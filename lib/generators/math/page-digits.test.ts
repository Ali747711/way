import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { pageDigits } from './page-digits';
import { answerOf, promptsOf } from './test-utils';

describe('math/page-digits', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(pageDigits)).toEqual([]);
  });

  it('matches hand counts', () => {
    // 9 one-digit pages (9 digits) + 90 two-digit pages (180) + 21 three-digit pages (63).
    expect(answerOf(pageDigits, 'digits-120')).toBe(252);
    // 1000 to 1040 adds 41 four-digit pages: 9 + 180 + 2700 + 164.
    expect(answerOf(pageDigits, 'pages-1040')).toBe(1040);
  });

  it('reverse problems invert the forward count', () => {
    const digitsIn = (n: number): number =>
      Array.from({ length: n }, (_, i) => String(i + 1).length).reduce(
        (a, b) => a + b,
        0
      );
    expect(digitsIn(120)).toBe(252);
    const forward = pageDigits
      .candidates()
      .filter((c) => c.key.startsWith('digits-'));
    expect(forward.length).toBeGreaterThanOrEqual(8);
    for (const { key } of forward) {
      const pages = Number(key.slice('digits-'.length));
      expect(answerOf(pageDigits, key)).toBe(digitsIn(pages));
    }
  });

  it('has enough candidates and varied stories', () => {
    expect(pageDigits.candidates().length).toBeGreaterThanOrEqual(16);
    expect(promptsOf(pageDigits, 'digits-120').size).toBeGreaterThan(1);
  });
});
