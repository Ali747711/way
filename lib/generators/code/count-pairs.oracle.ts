// Oracle: try every pair of positions i < j.
export const oracle = ([nums, target]: unknown[]): number => {
  const list = nums as number[];
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i] + list[j] === target) count += 1;
    }
  }
  return count;
};
