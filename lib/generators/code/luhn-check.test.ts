import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { auditFamily } from '../testing';

import { luhnCheck } from './luhn-check';
import { expectOracleAgrees } from './oracle';

import { oracle } from './luhn-check.oracle';

describe('code/luhn-check', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(luhnCheck)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(luhnCheck, oracle);
  });

  it('contains both valid and invalid hidden tests', () => {
    const draft = luhnCheck.candidates()[0].build(createRng(1));
    if (draft.answer.type !== 'code') throw new Error('not code');
    const outcomes = draft.answer.tests.map((t) => t.expected);
    expect(outcomes).toContain(true);
    expect(outcomes).toContain(false);
  });
});
