import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { latestTime } from './latest-time';
import { oracle } from './latest-time.oracle';
import { expectOracleAgrees } from './oracle';

describe('code/latest-time', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(latestTime)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(latestTime, oracle);
  });

  it('matches the documented examples', () => {
    expect(oracle([[1, 2, 3, 4]])).toBe('23:41');
    expect(oracle([[5, 5, 6, 6]])).toBe('');
  });
});
