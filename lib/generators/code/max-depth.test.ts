import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { maxDepth } from './max-depth';
import { expectOracleAgrees } from './oracle';

import { oracle } from './max-depth.oracle';

describe('code/max-depth', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(maxDepth)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(maxDepth, oracle);
  });
});
