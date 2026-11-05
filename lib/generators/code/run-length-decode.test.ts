import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { expectOracleAgrees } from './oracle';
import { runLengthDecode } from './run-length-decode';

import { oracle } from './run-length-decode.oracle';

describe('code/run-length-decode', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(runLengthDecode)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(runLengthDecode, oracle);
  });
});
