import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { longestRun } from './longest-run';
import { expectOracleAgrees } from './oracle';

import { oracle } from './longest-run.oracle';

describe('code/longest-run', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(longestRun)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(longestRun, oracle);
  });
});
