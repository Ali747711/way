import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { interleaving } from './interleaving';
import { expectOracleAgrees } from './oracle';

import { oracle } from './interleaving.oracle';

describe('code/interleaving', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(interleaving)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(interleaving, oracle);
  });

  it('accepts the shuffles named in the prompt and the tricky repeated-letter case', () => {
    expect(oracle(['abc', 'xy', 'axbyc'])).toBe(true);
    expect(oracle(['abc', 'xy', 'ayxbc'])).toBe(false);
    expect(oracle(['ab', 'ac', 'acab'])).toBe(true);
  });
});
