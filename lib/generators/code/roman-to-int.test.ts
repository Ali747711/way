import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { expectOracleAgrees } from './oracle';
import { romanToInt } from './roman-to-int';

import { oracle } from './roman-to-int.oracle';

describe('code/roman-to-int', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(romanToInt)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(romanToInt, oracle);
  });

  it('knows a few values by hand', () => {
    expect(oracle(['XVI'])).toBe(16);
    expect(oracle(['XLIX'])).toBe(49);
    expect(oracle(['MCMXCIV'])).toBe(1994);
  });
});
