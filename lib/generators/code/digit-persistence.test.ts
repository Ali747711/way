import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { auditFamily } from '../testing';

import { digitPersistence, oracle } from './digit-persistence';

describe('code/digit-persistence', () => {
  it('passes the audit for every candidate', () => {
    expect(auditFamily(digitPersistence)).toEqual([]);
  });

  it('agrees with an independent oracle on every case', () => {
    for (const candidate of digitPersistence.candidates()) {
      for (const seed of [1, 2, 3]) {
        const draft = candidate.build(createRng(seed));
        if (draft.answer.type !== 'code') throw new Error('not code');
        for (const c of [...draft.answer.examples, ...draft.answer.tests]) {
          expect(c.expected).toBe(oracle(candidate.key, c.input[0] as number));
        }
      }
    }
  });

  it('shows the examples in the prompt and keeps them out of the hidden tests', () => {
    const draft = digitPersistence.candidates()[0].build(createRng(1));
    if (draft.answer.type !== 'code') throw new Error('not code');
    expect(draft.prompt).toContain('`multiplyDown(39)` returns `3`');
    const shown = draft.answer.examples.map((c) => JSON.stringify(c.input));
    for (const t of draft.answer.tests) {
      expect(shown).not.toContain(JSON.stringify(t.input));
    }
    expect(draft.answer.tests.length).toBeGreaterThanOrEqual(5);
  });
});
