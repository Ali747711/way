// Oracle: remove duplicates, sort high to low, take the second item.
export const oracle = ([nums]: unknown[]): number | null => {
  const distinct = [...new Set(nums as number[])].sort((a, b) => b - a);
  return distinct.length >= 2 ? distinct[1] : null;
};
