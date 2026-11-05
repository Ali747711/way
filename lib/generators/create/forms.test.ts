import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { auditFamily } from '../testing';

import { describeAll } from './define';
import { FORM_ITEMS, forms } from './forms';
import { independentViolations } from './independent-check';

describe('create/forms', () => {
  it('passes the audit, so every example meets its rules', () => {
    expect(forms).toBeDefined();
    expect(auditFamily(forms)).toEqual([]);
  });

  it('meets every rule under an independent check', () => {
    expect(FORM_ITEMS.flatMap(independentViolations)).toEqual([]);
  });

  it('states every rule in the prompt', () => {
    for (const item of FORM_ITEMS) {
      const candidate = forms.candidates().find((c) => c.key === item.key);
      const prompt = candidate?.build(createRng(1)).prompt ?? '';
      for (const line of describeAll(item.constraints))
        expect(prompt).toContain(line);
    }
  });

  it('has unique titles and keys', () => {
    expect(new Set(FORM_ITEMS.map((i) => i.title)).size).toBe(
      FORM_ITEMS.length
    );
    expect(new Set(FORM_ITEMS.map((i) => i.key)).size).toBe(FORM_ITEMS.length);
  });
});
