// Oracle: fill the new grid cell by cell with new[r][c] = old[height - 1 - c][r].
export const oracle = ([grid]: unknown[]): number[][] => {
  const old = grid as number[][];
  if (old.length === 0) return [];
  const height = old.length;
  const width = old[0].length;
  const result: number[][] = [];
  for (let r = 0; r < width; r++) {
    const row: number[] = [];
    for (let c = 0; c < height; c++) row.push(old[height - 1 - c][r]);
    result.push(row);
  }
  return result;
};
