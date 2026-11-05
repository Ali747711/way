// Oracle: sort, then find the first place where the value is not its position + 1.
export const oracle = ([tickets]: unknown[]): number => {
  const sorted = [...(tickets as number[])].sort((a, b) => a - b);
  const gap = sorted.findIndex((value, i) => value !== i + 1);
  return gap === -1 ? sorted.length + 1 : gap + 1;
};
