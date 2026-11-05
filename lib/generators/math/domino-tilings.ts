import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer, sup } from './shared';

interface Params {
  /** Length of the 3-row board, always even. */
  n: number;
}

const WIDTHS = [8, 10, 12, 14];

/** t(0) = 1 and t(k) = 3 t(k-2) + 2 (t(k-4) + ... + t(0)) for even k. */
const tilings = (n: number): number[] => {
  const t = [1];
  for (let k = 1; k <= n; k++) {
    if (k % 2 === 1) {
      t.push(0);
      continue;
    }
    let sum = 3 * t[k - 2];
    for (let j = k - 4; j >= 0; j -= 2) sum += 2 * t[j];
    t.push(sum);
  }
  return t;
};

export const answerFor = ({ n }: Params): number => tilings(n)[n];

const STORIES = [
  ({ n }: Params) => ({
    title: 'Tiling a narrow hallway',
    text: `A hallway floor is a rectangle 3 squares wide and ${n} squares long, where a square is the size of one small floor tile. It is to be covered completely with rectangular tiles called dominoes, each exactly 2 squares long and 1 square wide. A tile can lie either way round, tiles may not overlap, and none may stick out.\n\nTwo tilings are different if some tile sits in a different place. In how many different ways can the floor be tiled?`
  }),
  ({ n }: Params) => ({
    title: 'Dominoes on a strip',
    text: `A strip of paper has 3 rows and ${n} columns of squares. Dominoes, each covering exactly two squares that share a side, are laid on it so that every square is covered exactly once. Dominoes can be placed in either direction.\n\nHow many different ways are there to cover the strip? Two ways are different if at least one domino is in a different position.`
  }),
  ({ n }: Params) => ({
    title: 'Paving a garden path',
    text: `A garden path is ${n} squares long and 3 squares wide, where a square is the size of one small slab. The builder has plenty of double slabs, called dominoes, each covering two squares side by side, and can lay them in either direction. They must cover the path exactly, with no gaps, overlaps or cutting.\n\nHow many different patterns can the builder make? Patterns are different if some double slab is in a different place.`
  })
];

const row = (n: number): string => {
  const t = tilings(n);
  return Array.from(
    { length: n / 2 + 1 },
    (_, i) => `t(${2 * i}) = ${t[2 * i]}`
  ).join(', ');
};

const solutionFor = ({ n }: Params): string => {
  const t = tilings(n);
  const answer = t[n];
  const terms = [3 * t[n - 2]];
  const parts = [`3 × ${t[n - 2]}`];
  for (let j = n - 4; j >= 0; j -= 2) {
    terms.push(2 * t[j]);
    parts.push(`2 × ${t[j]}`);
  }
  return `**${answer}.**\n\nCall the area a board and each piece a domino (it covers two squares). Let t(k) be the number of tilings of a 3 by k board. Take t(0) = 1 (the empty board has one tiling: use no dominoes).\n\n**Stage 1: small boards.** A 3 by k board has 3k squares, and dominoes cover two each, so k must be even: for odd lengths t = 0. A 3 by 2 board has exactly 3 tilings: three horizontal dominoes stacked up, or a pair of vertical dominoes with one horizontal domino above them, or one below them. So t(2) = 3.\n\n**Stage 2: cut the board at the first clean line.** Look for the leftmost vertical line, between two columns, that no domino crosses. It splits the tiling into a left part that cannot be cut again and a right part that is any tiling of the rest. So t(k) is the sum, over the length j of the left part, of (the number of uncuttable tilings of length j) × t(k − j).\n\n**Stage 3: count the uncuttable tilings.** Length 2 has 3 of them, all of those above. Length 4 or more has exactly 2. The left column cannot hold three horizontal dominoes, because then the first two columns would be a finished block with a clean line after them. So the left column holds one vertical domino, on its top two squares or on its bottom two. Then the last square of that column must be covered by a horizontal domino reaching into the second column. In the second column the other two squares must then take horizontal dominoes reaching into the third column (a vertical domino there would cut the board cleanly), and so on, in a staircase of bricks that is forced all the way to the right end, where a vertical domino closes it. The only choice is whether the left end has its vertical domino at the top or at the bottom, so there are 2.\n\n**Stage 4: the rule.** t(k) = 3 t(k − 2) + 2 t(k − 4) + 2 t(k − 6) + … + 2 t(0). Building up: ${row(n)}. For example the last step is t(${n}) = ${parts.join(' + ')} = ${terms.join(' + ')} = **${answer}**.\n\n**Why shortcuts fail.** Counting only the tilings built from blocks of length 2 gives 3${sup(n / 2)} = ${3 ** (n / 2)}, which misses every tiling that has a staircase in it. Trying to list the tilings by hand is hopeless at this size, and guessing a pattern from t(2) = 3 and t(4) = 11 does not give the rule.`;
};

/** Backtracking: fill the first empty square with a horizontal or vertical domino. */
const solverFor = ({ n }: Params): string =>
  [
    `const columns = ${n};`,
    'const filled = new Array(3 * columns).fill(false);',
    'const cell = (row, col) => col * 3 + row;',
    'const count = (position) => {',
    '  while (position < filled.length && filled[position]) position++;',
    '  if (position === filled.length) return 1;',
    '  const col = Math.floor(position / 3);',
    '  const row = position % 3;',
    '  let ways = 0;',
    '  filled[position] = true;',
    '  if (col + 1 < columns && !filled[cell(row, col + 1)]) {',
    '    filled[cell(row, col + 1)] = true;',
    '    ways += count(position + 1);',
    '    filled[cell(row, col + 1)] = false;',
    '  }',
    '  if (row + 1 < 3 && !filled[position + 1]) {',
    '    filled[position + 1] = true;',
    '    ways += count(position + 1);',
    '    filled[position + 1] = false;',
    '  }',
    '  filled[position] = false;',
    '  return ways;',
    '};',
    'return count(0);'
  ].join('\n');

const HINTS = [
  'Why can a floor 3 squares wide be covered by dominoes only when its length is even, and in how many ways can you cover a floor just 2 squares long?',
  'If a tiling has a vertical line from top to bottom that no domino crosses, what do the two sides of that line look like?',
  'Look at a tiling with no such line for length 2, and then try to build one for length 4: how many are there?',
  'Once the first domino in such a tiling is placed, are the rest forced, and how many uncuttable tilings are there for each larger even length?',
  'How do you combine the uncuttable pieces with the tilings of smaller boards into a rule for t(k), and how do you build the answer up from t(0) = 1?'
];

const build = (p: Params, rng: Rng) => {
  const story = rng.pick(STORIES)(p);
  return {
    difficulty: 5,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: HINTS,
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['counting', 'tilings', 'recurrence']
  };
};

export const dominoTilings = defineFamily<Params>({
  id: 'math/domino-tilings',
  area: 'math',
  slot: 'deep',
  params: () =>
    keepFair(
      WIDTHS.map((n) => ({ n })),
      build
    ),
  key: ({ n }) => `3x${n}`,
  build
});
