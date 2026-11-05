import { isGrid, isIntIn, many } from './helpers';
import { oracle } from './rotate-grid.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function rotateRight(grid) {
  if (grid.length === 0) return [];
  return grid[0].map((_, col) => grid.map((row) => row[col]).reverse());
}`;

export const rotateGrid = defineSingleCodeFamily({
  id: 'code/rotate-grid',
  difficulty: 3,
  title: 'Turn the picture',
  task: 'A small picture is stored as a grid: an array of rows, each row an array of whole numbers. Turning the picture a quarter turn **clockwise** moves its left column to the top row, read upwards from the bottom. For example, turning\n\n```\n1 2 3\n4 5 6\n```\n\nclockwise gives\n\n```\n4 1\n5 2\n6 3\n```\n\nWrite `rotateRight(grid)` that takes a grid with 0 to 5 rows, where every row has the same length (1 to 5 numbers), and returns the rotated grid as a new array of arrays. A grid with no rows returns `[]`. The input must not be changed.',
  oracle,
  inDomain: ([grid]) => isGrid(grid, 5, 5, (c) => isIntIn(c, 0, 99)),
  entry: 'rotateRight',
  params: 'grid',
  reference: REFERENCE,
  examples: [
    [
      [
        [1, 2, 3],
        [4, 5, 6]
      ]
    ],
    [[[7]]]
  ],
  tests: (rng) => [
    [[]],
    [[[1, 2, 3]]],
    [[[1], [2], [3]]],
    [
      [
        [1, 2],
        [3, 4]
      ]
    ],
    [
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]
    ],
    ...many(5, () => {
      const rows = rng.int(1, 5);
      const cols = rng.int(1, 5);
      return [many(rows, () => many(cols, () => rng.int(0, 9)))];
    })
  ],
  hints: [
    'If the grid has 2 rows and 3 columns, how many rows and columns will the turned grid have?',
    'Which old column becomes the first new row, and in which direction do you read that column?',
    'Can you build each new row by taking one column from every old row, and then reversing it?'
  ],
  approach:
    'Each new row is an old column, read from the bottom row up. So for every column index, collect that column from all rows and reverse it.',
  notes:
    'The new grid is as tall as the old one was wide. Use `map` (which builds new arrays) rather than reordering the input in place, and check an empty grid first, because there is no first row to measure the width from.',
  tags: ['arrays', 'grids', 'loops']
});
