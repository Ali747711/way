// Oracle: brute force over every start and end, checking each stretch with a set.
export const oracle = ([text]: unknown[]): number => {
  const chars = text as string;
  let best = 0;
  for (let start = 0; start < chars.length; start++) {
    for (let end = start + 1; end <= chars.length; end++) {
      const piece = chars.slice(start, end);
      if (new Set(piece).size === piece.length)
        best = Math.max(best, piece.length);
    }
  }
  return best;
};
