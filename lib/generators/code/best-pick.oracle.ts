// Oracle: try every subset of stones (as a bit mask) and keep the best one with no neighbours.
export const oracle = ([values]: unknown[]): number => {
  const list = values as number[];
  let best = 0;
  for (let mask = 0; mask < 2 ** list.length; mask++) {
    if ((mask & (mask >> 1)) !== 0) continue;
    let total = 0;
    list.forEach((value, i) => {
      if ((mask >> i) & 1) total += value;
    });
    best = Math.max(best, total);
  }
  return best;
};
