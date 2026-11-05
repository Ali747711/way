import { isIntIn, isListOf, randomInts } from './helpers';
import { oracle } from './count-pairs.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function countPairs(nums, target) {
  const seen = new Map();
  let pairs = 0;
  for (const n of nums) {
    pairs += seen.get(target - n) ?? 0;
    seen.set(n, (seen.get(n) ?? 0) + 1);
  }
  return pairs;
}`;

export const countPairs = defineSingleCodeFamily({
  id: 'code/count-pairs',
  difficulty: 3,
  title: 'Two that make the target',
  task: 'Count how many *pairs* of items in a list add up to a target. A pair is two different positions `i` and `j` with `i < j`, so the same position is never used twice. If a value appears several times, each position is its own item: in `[2, 2, 2]` with target `4` there are 3 pairs.\n\nWrite `countPairs(nums, target)` that takes an array of 0 to 20 whole numbers, each from -10 to 10, and a whole number `target` from -20 to 20, and returns the number of pairs of positions whose values add up to `target`.',
  oracle,
  inDomain: ([nums, target]) =>
    isListOf(nums, 20, (n) => isIntIn(n, -10, 10)) && isIntIn(target, -20, 20),
  entry: 'countPairs',
  params: 'nums, target',
  reference: REFERENCE,
  examples: [
    [[1, 5, 3, 3, 7], 8],
    [[2, 2, 2], 4]
  ],
  tests: (rng) => [
    [[], 0],
    [[5], 10],
    [[5, 5], 10],
    [[0, 0, 0, 0], 0],
    [[-3, 3, -3, 3], 0],
    [[1, 2, 3], 20],
    [[4, 4, 4, 4, 4], 8],
    ...Array.from({ length: 5 }, () => [
      randomInts(rng, -10, 10, 0, 20),
      rng.int(-20, 20)
    ])
  ],
  hints: [
    'For one value, which other value would complete the pair?',
    'As you walk through the list, can you remember how many times each value has appeared before the current position?',
    'When the same value is needed twice (like 2 + 2 = 4), do you count each earlier copy as its own partner?'
  ],
  approach:
    'Walk through the list once, remembering how many times each value has been seen. For each number, add the count of `target - number` seen so far, then record the number itself.',
  notes:
    'Checking before recording stops a number from pairing with itself. Because each earlier copy is a separate partner, duplicates are counted correctly: the third `2` in `[2, 2, 2]` adds 2 pairs. Two loops over all pairs also work, but this version runs in a single pass.',
  tags: ['arrays', 'counting', 'maps']
});
