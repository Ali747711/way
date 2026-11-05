// Test helper only: imported from *.test.ts files, never from app code.
import vm from 'node:vm';

import { expect } from 'vitest';

import type { Family } from '../family';
import { createRng } from '../rng';

export type Oracle = (args: unknown[]) => unknown;

const loadReference = (reference: string, entry: string) =>
  vm.runInNewContext(`${reference}\n;${entry}`, {}) as (
    ...args: unknown[]
  ) => unknown;

/**
 * Every example and hidden test (seeds 1, 2, 3) must match an oracle written
 * differently from the reference. Also checks the shape rules of the task:
 * 1-3 examples, at least 7 hidden tests, 3 hints, varied outputs, and a
 * reference that leaves its input alone.
 */
export const expectOracleAgrees = (family: Family, oracle: Oracle): void => {
  for (const candidate of family.candidates()) {
    // build() itself checks every case against the family's oracle and its
    // stated input ranges, and throws on a mismatch.
    for (let seed = 1; seed <= 200; seed++) {
      expect(() => candidate.build(createRng(seed))).not.toThrow();
    }
    for (const seed of [1, 2, 3]) {
      const draft = candidate.build(createRng(seed));
      if (draft.answer.type !== 'code') throw new Error('not a code answer');
      const { examples, tests, reference, entry } = draft.answer;
      expect(examples.length).toBeGreaterThanOrEqual(1);
      expect(examples.length).toBeLessThanOrEqual(3);
      expect(tests.length).toBeGreaterThanOrEqual(7);
      expect(draft.hints).toHaveLength(3);
      const shown = examples.map((c) => JSON.stringify(c.input));
      for (const t of tests)
        expect(shown).not.toContain(JSON.stringify(t.input));
      const outputs = new Set(tests.map((t) => JSON.stringify(t.expected)));
      expect(outputs.size).toBeGreaterThanOrEqual(2);

      const fn = loadReference(reference, entry);
      for (const c of [...examples, ...tests]) {
        expect(c.expected).toEqual(oracle(structuredClone(c.input)));
        const copy = structuredClone(c.input);
        fn(...copy);
        expect(copy).toEqual(c.input);
      }
    }
  }
};
