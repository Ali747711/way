// Oracle: k rounds of "pick the best remaining word" with a linear scan.
export const oracle = ([text, k]: unknown[]): string[] => {
  const words = (text as string).split(' ').filter((w) => w !== '');
  const remaining = [...new Set(words)];
  const countOf = (w: string): number => words.filter((x) => x === w).length;
  const result: string[] = [];
  while (result.length < (k as number) && remaining.length > 0) {
    let best = 0;
    for (let i = 1; i < remaining.length; i++) {
      const better =
        countOf(remaining[i]) > countOf(remaining[best]) ||
        (countOf(remaining[i]) === countOf(remaining[best]) &&
          remaining[i] < remaining[best]);
      if (better) best = i;
    }
    result.push(remaining.splice(best, 1)[0]);
  }
  return result;
};
