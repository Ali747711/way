import { describe, expect, it } from 'vitest';

import { auditFamily } from '../testing';

import { expectOracleAgrees } from './oracle';
import { rotateGrid } from './rotate-grid';

import { oracle } from './rotate-grid.oracle';

describe('code/rotate-grid', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(rotateGrid)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    expectOracleAgrees(rotateGrid, oracle);
  });

  it('turns the example grid the documented way', () => {
    expect(
      oracle([
        [
          [1, 2, 3],
          [4, 5, 6]
        ]
      ])
    ).toEqual([
      [4, 1],
      [5, 2],
      [6, 3]
    ]);
  });
});
