import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { bestPick } from './best-pick';
import { expectOracleAgrees } from './oracle';

import { oracle } from './best-pick.oracle';

describe('code/best-pick', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(bestPick)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(bestPick, oracle);
  });
});
