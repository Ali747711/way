import { isIntIn, isListOf, randomInts } from './helpers';
import { oracle } from './best-pick.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function bestPick(values) {
  let skipLast = 0;
  let takeLast = 0;
  for (const value of values) {
    const next = Math.max(skipLast, takeLast);
    takeLast = skipLast + value;
    skipLast = next;
  }
  return Math.max(skipLast, takeLast);
}`;

export const bestPick = defineSingleCodeFamily({
  id: 'code/best-pick',
  difficulty: 4,
  title: 'Stepping stones, no neighbours',
  task: 'A row of stepping stones each holds some coins. You may collect the coins from any stones you like, but never from two stones that sit next to each other.\n\nWrite `bestPick(values)` that takes an array of 0 to 14 whole numbers from 0 to 50, the coins on each stone in order, and returns the largest total you can collect. You may collect from no stones at all. An empty array returns `0`.',
  oracle,
  inDomain: ([values]) => isListOf(values, 14, (v) => isIntIn(v, 0, 50)),
  entry: 'bestPick',
  params: 'values',
  reference: REFERENCE,
  examples: [[[4, 1, 1, 5]], [[3, 9, 3]]],
  tests: (rng) => [
    [[]],
    [[7]],
    [[7, 8]],
    [[0, 0, 0]],
    [[5, 5, 5, 5]],
    [[2, 7, 9, 3, 1]],
    [[10, 1, 1, 10, 1, 1, 10]],
    ...Array.from({ length: 5 }, () => [randomInts(rng, 0, 50, 1, 14)])
  ],
  hints: [
    'For the very last stone, what are your two choices, and what must be true about the stones before it in each case?',
    'If you know the best total for the stones so far in two situations, with the previous stone taken and not taken, can you work out the same two numbers for one more stone?',
    'Is a greedy rule such as "always take the biggest stone" safe, or can you find a row where it loses coins?'
  ],
  approach:
    'Walk along the row keeping two numbers: the best total if the previous stone was skipped, and the best total if it was taken. A new stone can be taken only after a skipped one, or skipped after either.',
  notes:
    'Greedy fails: in `[3, 4, 3]` the biggest stone is 4, but taking it blocks both 3s, and 3 + 3 = 6 beats it. You only ever need the last two totals, so no table is needed.',
  tags: ['dynamic-programming', 'arrays']
});
