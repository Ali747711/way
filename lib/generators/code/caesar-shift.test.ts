import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { caesarShift } from './caesar-shift';
import { expectOracleAgrees } from './oracle';

import { oracle } from './caesar-shift.oracle';

describe('code/caesar-shift', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(caesarShift)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(caesarShift, oracle);
  });
});
