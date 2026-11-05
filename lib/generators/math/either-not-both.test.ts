import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { auditFamily } from '../testing';

import { answerFor, eitherNotBoth } from './either-not-both';

describe('math/either-not-both', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(eitherNotBoth)).toEqual([]);
  });

  it('matches hand counts', () => {
    // Neither: 12 - |{3,4,6,8,9,12}| = 6.
    expect(answerFor({ n: 12, a: 3, b: 4, mode: 'neither' })).toBe(6);
  });

  it('has plenty of candidates and varies the story by seed', () => {
    const [candidate] = eitherNotBoth.candidates();
    expect(eitherNotBoth.candidates().length).toBeGreaterThan(50);
    const titles = new Set(
      [1, 2, 3, 4, 5, 6].map((s) => candidate.build(createRng(s)).title)
    );
    expect(titles.size).toBeGreaterThan(1);
  });
});
