import { isGrid, many } from './helpers';
import { oracle } from './count-islands.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function countIslands(grid) {
  const seen = grid.map((row) => row.map(() => false));
  let islands = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 1 && !seen[r][c]) {
        islands++;
        const stack = [[r, c]];
        seen[r][c] = true;
        while (stack.length > 0) {
          const [y, x] = stack.pop();
          for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const ny = y + dy;
            const nx = x + dx;
            if (grid[ny] && grid[ny][nx] === 1 && !seen[ny][nx]) {
              seen[ny][nx] = true;
              stack.push([ny, nx]);
            }
          }
        }
      }
    }
  }
  return islands;
}`;

export const countIslands = defineSingleCodeFamily({
  id: 'code/count-islands',
  difficulty: 4,
  title: 'Islands on the map',
  task: 'A map is a grid of `0` (water) and `1` (land). Land squares that touch **up, down, left or right** belong to the same island. Squares that only touch at a corner do **not** join.\n\nWrite `countIslands(grid)` that takes a grid with 0 to 6 rows, where every row has the same length (1 to 6) and holds only `0` and `1`, and returns the number of islands. A grid with no rows has 0 islands. The input must not be changed.',
  oracle,
  inDomain: ([grid]) => isGrid(grid, 6, 6, (c) => c === 0 || c === 1),
  entry: 'countIslands',
  params: 'grid',
  reference: REFERENCE,
  examples: [
    [
      [
        [1, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 0, 0, 1]
      ]
    ],
    [
      [
        [1, 0],
        [0, 1]
      ]
    ]
  ],
  tests: (rng) => [
    [[]],
    [[[0]]],
    [[[1]]],
    [[[1, 1, 1, 1]]],
    [
      [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
      ]
    ],
    [
      [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ]
    ],
    [
      [
        [0, 0],
        [0, 0]
      ]
    ],
    ...many(5, () => {
      const rows = rng.int(1, 6);
      const cols = rng.int(1, 6);
      return [many(rows, () => many(cols, () => (rng.next() < 0.45 ? 1 : 0)))];
    })
  ],
  hints: [
    'If you stand on one land square, which other squares belong to the same island?',
    'How can you "flood" an island from one square, marking every connected land square so you never count it again?',
    'When you scan the grid square by square, what tells you that you have found a brand new island?'
  ],
  approach:
    'Scan every square. When you find land that has not been visited, count one island and explore it completely (with a stack or recursion), marking each land square you reach as visited.',
  notes:
    'Mark squares as visited in a separate grid so the input stays unchanged. Only four directions are used: a diagonal neighbour is a different island. A ring of land around one water square is still one island.',
  tags: ['grids', 'search', 'counting']
});
