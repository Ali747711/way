import { isIntIn, isListOf, randomInts } from './helpers';
import { oracle } from './group-up.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function groupUp(items, size) {
  const groups = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  const last = groups[groups.length - 1];
  if (groups.length > 1 && last.length < size) {
    groups.pop();
    groups[groups.length - 1] = groups[groups.length - 1].concat(last);
  }
  return groups;
}`;

export const groupUp = defineSingleCodeFamily({
  id: 'code/group-up',
  difficulty: 3,
  title: 'Teams with no stragglers',
  task: 'A coach splits players into teams of a fixed size, in the order they are listed. If the last team would be too small, its players join the team before it instead, so nobody is left in a tiny team of their own.\n\nWrite `groupUp(items, size)` that takes an array of 0 to 25 whole numbers and a whole number `size` from 1 to 10, and returns an array of groups (arrays). Every group except the last has exactly `size` items; the last group has `size` or more items. The one exception is when there are fewer than `size` items in total: then there is a single group holding all of them. An empty array returns `[]`. The input must not be changed.',
  oracle,
  inDomain: ([items, size]) =>
    isListOf(items, 25, (n) => isIntIn(n, 0, 99)) && isIntIn(size, 1, 10),
  entry: 'groupUp',
  params: 'items, size',
  reference: REFERENCE,
  examples: [
    [[1, 2, 3, 4, 5, 6, 7], 3],
    [[1, 2], 5]
  ],
  tests: (rng) => [
    [[], 3],
    [[9], 1],
    [[1, 2, 3], 1],
    [[1, 2, 3, 4, 5, 6], 3],
    [[1, 2, 3, 4, 5, 6, 7, 8], 4],
    [[1, 2, 3, 4, 5], 5],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10],
    ...Array.from({ length: 5 }, () => [
      randomInts(rng, 0, 99, 0, 25),
      rng.int(1, 10)
    ])
  ],
  hints: [
    'If you ignored the stragglers rule, how would you cut the array into pieces of `size`, one slice at a time?',
    'After cutting, how can you tell that the last piece is too short, and what should you do with it when there is an earlier piece?',
    'What happens when there is only one piece in total, and when the array is empty?'
  ],
  approach:
    'First cut the array into slices of `size`. Then, if there is more than one slice and the last is short, remove it and append its items to the slice before.',
  notes:
    'Two edge cases decide the result: a short last slice with nothing before it must stay as it is, and an exact fit must not be merged at all. Test `[1,2,3,4,5,6]` with size 3 (an exact fit, no merge) and `[1,2]` with size 5 (a short slice with nothing before it).',
  tags: ['arrays', 'loops', 'edge-cases']
});
