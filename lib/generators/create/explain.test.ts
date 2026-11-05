import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { auditFamily } from '../testing';

import { describeAll } from './define';
import { EXPLAIN_ITEMS, explain } from './explain';
import { independentViolations } from './independent-check';

describe('create/explain', () => {
  it('passes the audit, so every example meets its rules', () => {
    expect(explain).toBeDefined();
    expect(auditFamily(explain)).toEqual([]);
  });

  it('meets every rule under an independent check', () => {
    expect(EXPLAIN_ITEMS.flatMap(independentViolations)).toEqual([]);
  });

  it('states every rule in the prompt', () => {
    for (const item of EXPLAIN_ITEMS) {
      const candidate = explain.candidates().find((c) => c.key === item.key);
      const prompt = candidate?.build(createRng(1)).prompt ?? '';
      for (const line of describeAll(item.constraints))
        expect(prompt).toContain(line);
    }
  });

  it('has unique titles and keys', () => {
    expect(new Set(EXPLAIN_ITEMS.map((i) => i.title)).size).toBe(
      EXPLAIN_ITEMS.length
    );
    expect(new Set(EXPLAIN_ITEMS.map((i) => i.key)).size).toBe(
      EXPLAIN_ITEMS.length
    );
  });
});
