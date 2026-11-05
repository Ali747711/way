import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { addMinutes } from './add-minutes';
import { expectOracleAgrees } from './oracle';

import { oracle } from './add-minutes.oracle';

describe('code/add-minutes', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(addMinutes)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(addMinutes, oracle);
  });
});
