import { describe, expect, it } from 'vitest';

import { nextIds, toProblem } from './assemble';
import { attributionFor, defineFamily, type ProblemDraft } from './family';
import { createRng } from './rng';
import { pickCandidates } from './select';

const draft = (n: number): ProblemDraft => ({
  difficulty: 3,
  title: `Count ${n}`,
  prompt: `What is ${n} + 1?`,
  answer: { type: 'number', value: n + 1, tolerance: 0 },
  hints: ['What comes next?', 'Can you count on?', 'What is one more?'],
  solution: `**${n + 1}.**`,
  solver: `return ${n} + 1;`,
  tags: ['test']
});

const family = (id: string, keys: number[]) =>
  defineFamily<number>({
    id,
    area: 'math',
    slot: 'daily',
    params: () => keys,
    key: (n) => `n${n}`,
    build: (n) => draft(n)
  });

describe('attributionFor', () => {
  it('joins the family id and key', () => {
    expect(attributionFor('math/x', 'a:b')).toBe('template:math/x:a:b');
  });
});

describe('defineFamily', () => {
  it('turns every parameter set into a keyed candidate', () => {
    const f = family('math/a', [1, 2]);
    const candidates = f.candidates();
    expect(candidates.map((c) => c.key)).toEqual(['n1', 'n2']);
    expect(candidates[0].build(createRng(1)).title).toBe('Count 1');
  });
});

describe('pickCandidates', () => {
  const families = [family('math/a', [1, 2, 3]), family('math/b', [4])];

  it('alternates families before repeating one', () => {
    const picked = pickCandidates(families, new Set(), 2, createRng(1));
    expect(new Set(picked.map((p) => p.family.id)).size).toBe(2);
  });

  it('skips candidates already in the bank', () => {
    const used = new Set([attributionFor('math/b', 'n4')]);
    const picked = pickCandidates(families, used, 10, createRng(1));
    expect(picked.map((p) => p.candidate.key).sort()).toEqual([
      'n1',
      'n2',
      'n3'
    ]);
  });

  it('returns fewer than asked when the families run out', () => {
    expect(pickCandidates(families, new Set(), 10, createRng(2))).toHaveLength(
      4
    );
  });

  it('is repeatable for a seed', () => {
    const keys = (seed: number) =>
      pickCandidates(families, new Set(), 4, createRng(seed)).map(
        (p) => p.candidate.key
      );
    expect(keys(9)).toEqual(keys(9));
  });
});

describe('pickCandidates with groups', () => {
  const grouped = defineFamily<string>({
    id: 'math/g',
    area: 'math',
    slot: 'daily',
    params: () => ['a-1', 'a-2', 'a-3', 'b-1', 'b-2'],
    key: (k) => k,
    group: (k) => k.split('-')[0],
    build: () => draft(1)
  });

  it('alternates groups within a family', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const groups = pickCandidates(
        [grouped],
        new Set(),
        2,
        createRng(seed)
      ).map((p) => p.candidate.group);
      expect(new Set(groups).size).toBe(2);
    }
  });

  it('prefers groups the bank has used least', () => {
    const used = new Set([attributionFor('math/g', 'a-1')]);
    for (const seed of [1, 2, 3]) {
      const [first] = pickCandidates([grouped], used, 1, createRng(seed));
      expect(first.candidate.group).toBe('b');
    }
  });

  it('keeps every candidate reachable', () => {
    const all = pickCandidates([grouped], new Set(), 10, createRng(1));
    expect(all.map((p) => p.candidate.key).sort()).toEqual([
      'a-1',
      'a-2',
      'a-3',
      'b-1',
      'b-2'
    ]);
  });
});

describe('nextIds', () => {
  it('continues after the highest id with the prefix', () => {
    expect(nextIds(['m-001', 'm-005', 'd-009'], 'm', 2)).toEqual([
      'm-006',
      'm-007'
    ]);
  });
  it('does not confuse c- and cr- ids', () => {
    expect(nextIds(['c-004', 'cr-010'], 'c', 1)).toEqual(['c-005']);
    expect(nextIds(['c-004', 'cr-010'], 'cr', 1)).toEqual(['cr-011']);
  });
  it('starts at 001 when there are none', () => {
    expect(nextIds([], 'd', 1)).toEqual(['d-001']);
  });
});

describe('toProblem', () => {
  it('builds a schema-valid draft with a template attribution', () => {
    const p = toProblem(draft(2), {
      id: 'm-010',
      area: 'math',
      familyId: 'math/a',
      key: 'n2',
      createdAt: '2026-11-05T00:00:00.000Z'
    });
    expect(p.status).toBe('draft');
    expect(p.source).toEqual({
      kind: 'generated',
      attribution: 'template:math/a:n2'
    });
    expect(p.solver).toBe('return 2 + 1;');
  });
  it('rejects a draft the schema refuses', () => {
    const bad = { ...draft(1), hints: ['Only one?'] };
    expect(() =>
      toProblem(bad, {
        id: 'm-011',
        area: 'math',
        familyId: 'math/a',
        key: 'n1',
        createdAt: '2026-11-05'
      })
    ).toThrow();
  });
});
