import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { missingNumber } from './missing-number';
import { expectOracleAgrees } from './oracle';

import { oracle } from './missing-number.oracle';

describe('code/missing-number', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(missingNumber)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(missingNumber, oracle);
  });
});
