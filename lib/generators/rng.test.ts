import { describe, expect, it } from 'vitest';

import { createRng } from './rng';

describe('createRng', () => {
  it('repeats the same sequence for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 5 }, () => a.next());
    const seqB = Array.from({ length: 5 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('gives different sequences for different seeds', () => {
    expect(createRng(1).next()).not.toBe(createRng(2).next());
  });

  it('spreads the first value of consecutive small seeds', () => {
    const firsts = Array.from({ length: 16 }, (_, i) =>
      createRng(i + 1).next()
    );
    expect(firsts.filter((x) => x < 0.5).length).toBeGreaterThanOrEqual(4);
    expect(firsts.filter((x) => x >= 0.5).length).toBeGreaterThanOrEqual(4);
  });

  it('returns floats in [0, 1)', () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const x = rng.next();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it('int stays inside the inclusive range and reaches both ends', () => {
    const rng = createRng(3);
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) seen.add(rng.int(2, 5));
    expect([...seen].sort()).toEqual([2, 3, 4, 5]);
  });

  it('int rejects an empty range', () => {
    expect(() => createRng(1).int(5, 4)).toThrow();
  });

  it('pick returns an element and rejects an empty list', () => {
    const rng = createRng(9);
    expect(['a', 'b', 'c']).toContain(rng.pick(['a', 'b', 'c']));
    expect(() => rng.pick([])).toThrow();
  });

  it('shuffle keeps the elements and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const out = createRng(5).shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...out].sort()).toEqual(input);
  });
});
