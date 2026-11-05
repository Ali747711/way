import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { expectOracleAgrees } from './oracle';
import { topWords } from './top-words';

import { oracle } from './top-words.oracle';

describe('code/top-words', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(topWords)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(topWords, oracle);
  });
});
