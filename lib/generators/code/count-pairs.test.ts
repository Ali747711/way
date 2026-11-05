import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { countPairs } from './count-pairs';
import { expectOracleAgrees } from './oracle';

import { oracle } from './count-pairs.oracle';

describe('code/count-pairs', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(countPairs)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(countPairs, oracle);
  });
});
