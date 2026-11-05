// Oracle: each entry from the choose-formula C(n, k) = C(n, k - 1) * (n - k + 1) / k.
export const oracle = ([n]: unknown[]): number[] => {
  const row = [1];
  for (let k = 1; k <= (n as number); k++) {
    row.push((row[k - 1] * ((n as number) - k + 1)) / k);
  }
  return row;
};
