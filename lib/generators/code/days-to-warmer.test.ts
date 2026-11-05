import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { daysToWarmer } from './days-to-warmer';
import { expectOracleAgrees } from './oracle';

import { oracle } from './days-to-warmer.oracle';

describe('code/days-to-warmer', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(daysToWarmer)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(daysToWarmer, oracle);
  });

  it('matches the documented example', () => {
    expect(oracle([[20, 25, 22, 19, 30]])).toEqual([1, 3, 2, 1, 0]);
  });
});
