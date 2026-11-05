// Oracle: read c letter by letter, tracking the set of possible "letters of a used" counts.
// The letters of b used is then fixed by the position in c.
export const oracle = ([a, b, c]: unknown[]): boolean => {
  const [first, second, target] = [a as string, b as string, c as string];
  if (first.length + second.length !== target.length) return false;
  let states = new Set<number>([0]);
  for (let pos = 0; pos < target.length; pos++) {
    const next = new Set<number>();
    for (const usedA of states) {
      const usedB = pos - usedA;
      if (usedA < first.length && first[usedA] === target[pos])
        next.add(usedA + 1);
      if (usedB < second.length && second[usedB] === target[pos])
        next.add(usedA);
    }
    states = next;
  }
  return states.has(first.length);
};
