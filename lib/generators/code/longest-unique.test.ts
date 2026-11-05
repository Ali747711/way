import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { longestUnique } from './longest-unique';
import { expectOracleAgrees } from './oracle';

import { oracle } from './longest-unique.oracle';

describe('code/longest-unique', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(longestUnique)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(longestUnique, oracle);
  });
});
