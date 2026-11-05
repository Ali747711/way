/**
 * A small seeded random source, so a generator run is repeatable: the same
 * seed always produces the same problems in the same order.
 */
export interface Rng {
  /** A float in [0, 1). */
  next: () => number;
  /** An integer in [min, max], both ends included. */
  int: (min: number, max: number) => number;
  pick: <T>(items: readonly T[]) => T;
  /** A shuffled copy; the input is not changed. */
  shuffle: <T>(items: readonly T[]) => T[];
}

// mulberry32: tiny, fast and well distributed for this use.
const mulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Golden-ratio multiply plus Murmur3's finalizer: spreads nearby seeds (1, 2, 3...) far apart, which
// mulberry32 alone does not do for its first outputs.
const scramble = (seed: number): number => {
  let h = Math.imul(seed >>> 0, 0x9e3779b1) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
};

export const createRng = (seed: number): Rng => {
  const next = mulberry32(scramble(seed));
  // Discard a few outputs so the first value used is well mixed.
  for (let i = 0; i < 4; i++) next();
  const int = (min: number, max: number): number => {
    if (max < min) throw new Error(`empty range ${min}..${max}`);
    return min + Math.floor(next() * (max - min + 1));
  };
  const pick = <T>(items: readonly T[]): T => {
    if (items.length === 0) throw new Error('cannot pick from an empty list');
    return items[int(0, items.length - 1)];
  };
  const shuffle = <T>(items: readonly T[]): T[] => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = int(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return { next, int, pick, shuffle };
};
