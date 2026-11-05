import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { commonPrefix } from './common-prefix';
import { expectOracleAgrees } from './oracle';

import { oracle } from './common-prefix.oracle';

describe('code/common-prefix', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(commonPrefix)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(commonPrefix, oracle);
  });
});
