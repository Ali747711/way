import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { keepFirst } from './keep-first';
import { expectOracleAgrees } from './oracle';

import { oracle } from './keep-first.oracle';

describe('code/keep-first', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(keepFirst)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(keepFirst, oracle);
  });
});
