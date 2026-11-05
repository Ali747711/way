import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { expectOracleAgrees } from './oracle';
import { pascalRow } from './pascal-row';

import { oracle } from './pascal-row.oracle';

describe('code/pascal-row', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(pascalRow)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(pascalRow, oracle);
  });

  it('matches known rows', () => {
    expect(oracle([5])).toEqual([1, 5, 10, 10, 5, 1]);
  });
});
