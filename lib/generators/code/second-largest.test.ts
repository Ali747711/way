import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { expectOracleAgrees } from './oracle';
import { secondLargest } from './second-largest';

import { oracle } from './second-largest.oracle';

describe('code/second-largest', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(secondLargest)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(secondLargest, oracle);
  });
});
