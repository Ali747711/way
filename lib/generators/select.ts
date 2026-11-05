import { attributionFor, type Candidate, type Family } from './family';
import type { Rng } from './rng';

export interface Picked {
  family: Family;
  candidate: Candidate;
}

interface Queue {
  family: Family;
  remaining: Candidate[];
  /** How often each group of this family is in the bank or already picked. */
  uses: Map<string, number>;
}

const groupOf = (c: Candidate): string => c.group ?? c.key;

const queueFor = (
  family: Family,
  used: ReadonlySet<string>,
  rng: Rng
): Queue => {
  const all = family.candidates();
  const isUsed = (c: Candidate) => used.has(attributionFor(family.id, c.key));
  const uses = new Map<string, number>();
  for (const c of all.filter(isUsed)) {
    uses.set(groupOf(c), (uses.get(groupOf(c)) ?? 0) + 1);
  }
  return {
    family,
    remaining: rng.shuffle(all.filter((c) => !isUsed(c))),
    uses
  };
};

/** Takes the queue's least-used group, keeping the shuffled order on ties. */
const takeNext = (queue: Queue): Candidate | undefined => {
  const count = (c: Candidate) => queue.uses.get(groupOf(c)) ?? 0;
  const best = queue.remaining.reduce<Candidate | undefined>(
    (min, c) => (min === undefined || count(c) < count(min) ? c : min),
    undefined
  );
  if (best === undefined) return undefined;
  queue.remaining = queue.remaining.filter((c) => c !== best);
  queue.uses.set(groupOf(best), count(best) + 1);
  return best;
};

/**
 * Picks up to `count` unused candidates, one family at a time in turn, so a
 * batch mixes families and consecutive days differ. Within a family it
 * prefers the kinds of problem used least so far. Returns fewer when the
 * families run out. `used` holds attributions already in the bank.
 */
export const pickCandidates = (
  families: readonly Family[],
  used: ReadonlySet<string>,
  count: number,
  rng: Rng
): Picked[] => {
  const queues = rng.shuffle(families).map((f) => queueFor(f, used, rng));
  const picked: Picked[] = [];
  while (picked.length < count && queues.some((q) => q.remaining.length > 0)) {
    for (const queue of queues) {
      if (picked.length >= count) break;
      const candidate = takeNext(queue);
      if (candidate) picked.push({ family: queue.family, candidate });
    }
  }
  return picked;
};
