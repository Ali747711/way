import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { countIslands } from './count-islands';
import { expectOracleAgrees } from './oracle';

import { oracle } from './count-islands.oracle';

describe('code/count-islands', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(countIslands)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(countIslands, oracle);
  });
});
