import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { coinWays } from './coin-ways';
import { expectOracleAgrees } from './oracle';

import { oracle } from './coin-ways.oracle';

describe('code/coin-ways', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(coinWays)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(coinWays, oracle);
  });

  it('matches the documented small case', () => {
    expect(oracle([4, [1, 2, 3]])).toBe(4);
  });
});
