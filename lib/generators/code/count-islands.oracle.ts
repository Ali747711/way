// Oracle: union-find over cell numbers; the answer is land cells minus successful unions.
export const oracle = ([grid]: unknown[]): number => {
  const cells = grid as number[][];
  if (cells.length === 0) return 0;
  const width = cells[0].length;
  const parent = Array.from({ length: cells.length * width }, (_, i) => i);
  const find = (i: number): number => {
    let root = i;
    while (parent[root] !== root) root = parent[root];
    return root;
  };
  let islands = 0;
  const link = (a: number, b: number): void => {
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) {
      parent[ra] = rb;
      islands -= 1;
    }
  };
  cells.forEach((row, r) =>
    row.forEach((value, c) => {
      if (value !== 1) return;
      islands += 1;
      if (r > 0 && cells[r - 1][c] === 1)
        link(r * width + c, (r - 1) * width + c);
      if (c > 0 && cells[r][c - 1] === 1)
        link(r * width + c, r * width + c - 1);
    })
  );
  return islands;
};
