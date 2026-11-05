import { isIntIn } from './helpers';
import { oracle } from './pascal-row.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function pascalRow(n) {
  let row = [1];
  for (let step = 0; step < n; step++) {
    const next = [1];
    for (let i = 1; i < row.length; i++) {
      next.push(row[i - 1] + row[i]);
    }
    next.push(1);
    row = next;
  }
  return row;
}`;

export const pascalRow = defineSingleCodeFamily({
  id: 'code/pascal-row',
  difficulty: 3,
  title: 'A row of the number triangle',
  task: 'Build a triangle of numbers. The top row (row 0) is just `1`. Every row starts and ends with `1`, and every number in between is the sum of two numbers in the row above: the one directly above it and the one to the left of that. The first rows are:\n\n```\n1\n1 1\n1 2 1\n1 3 3 1\n```\n\nWrite `pascalRow(n)` that takes a whole number `n` from 0 to 30 and returns row `n` as an array. Row `n` has `n + 1` numbers.',
  oracle,
  inDomain: ([n]) => isIntIn(n, 0, 30),
  entry: 'pascalRow',
  params: 'n',
  reference: REFERENCE,
  examples: [[4], [0]],
  tests: (rng) => [
    [1],
    [2],
    [3],
    [10],
    [20],
    [30],
    [rng.int(5, 29)],
    [rng.int(5, 29)]
  ],
  hints: [
    'If you already had row 3, how would you compute every number of row 4 from it?',
    'Which two numbers of the row above feed the number at position i, and what feeds the two ends?',
    'Can you start from row 0 and repeat the "build the next row" step n times?'
  ],
  approach:
    'Start with `[1]` and build each next row from the previous one: begin with `1`, add neighbours pairwise, and finish with `1`. Repeat `n` times.',
  notes:
    'Row 0 needs no work, so the loop simply runs zero times. The numbers in row 30 reach about 155 million, which still fits comfortably in a JavaScript number. These numbers also count combinations: the number at position `k` of row `n` is how many ways there are to choose `k` things from `n`.',
  tags: ['arrays', 'loops', 'patterns']
});
