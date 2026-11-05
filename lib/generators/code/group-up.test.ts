import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { groupUp } from './group-up';
import { expectOracleAgrees } from './oracle';

import { oracle } from './group-up.oracle';

describe('code/group-up', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(groupUp)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(groupUp, oracle);
  });
});
