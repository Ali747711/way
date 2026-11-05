import { describe, expect, it } from 'vitest';

import { createRng } from '../rng';
import { auditFamily } from '../testing';

import { describeAll } from './define';
import { STORY_ITEMS, stories } from './stories';
import { independentViolations } from './independent-check';

describe('create/stories', () => {
  it('passes the audit, so every example meets its rules', () => {
    expect(stories).toBeDefined();
    expect(auditFamily(stories)).toEqual([]);
  });

  it('meets every rule under an independent check', () => {
    expect(STORY_ITEMS.flatMap(independentViolations)).toEqual([]);
  });

  it('states every rule in the prompt', () => {
    for (const item of STORY_ITEMS) {
      const candidate = stories.candidates().find((c) => c.key === item.key);
      const prompt = candidate?.build(createRng(1)).prompt ?? '';
      for (const line of describeAll(item.constraints))
        expect(prompt).toContain(line);
    }
  });

  it('has unique titles and keys', () => {
    expect(new Set(STORY_ITEMS.map((i) => i.title)).size).toBe(
      STORY_ITEMS.length
    );
    expect(new Set(STORY_ITEMS.map((i) => i.key)).size).toBe(
      STORY_ITEMS.length
    );
  });
});
