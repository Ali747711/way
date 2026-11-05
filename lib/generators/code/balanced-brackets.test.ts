import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { balancedBrackets } from './balanced-brackets';
import { expectOracleAgrees } from './oracle';

import { oracle } from './balanced-brackets.oracle';

describe('code/balanced-brackets', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(balancedBrackets)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(balancedBrackets, oracle);
  });
});
