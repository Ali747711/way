import { isIntIn, isListOf, randomInts } from './helpers';
import { oracle } from './second-largest.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function secondBiggest(nums) {
  let first = null;
  let second = null;
  for (const n of nums) {
    if (first === null || n > first) {
      second = first;
      first = n;
    } else if (n < first && (second === null || n > second)) {
      second = n;
    }
  }
  return second;
}`;

export const secondLargest = defineSingleCodeFamily({
  id: 'code/second-largest',
  difficulty: 3,
  title: 'Runner-up value',
  task: 'The *runner-up* in a list of numbers is the second-largest *different* value. In `[7, 7, 5, 2]` the largest is `7` and the runner-up is `5`; the second `7` does not count, because it is the same value.\n\nWrite `secondBiggest(nums)` that takes an array of 0 to 20 whole numbers, each from -1000 to 1000, and returns the runner-up. If the array has fewer than two different values, return `null`.',
  oracle,
  inDomain: ([nums]) => isListOf(nums, 20, (n) => isIntIn(n, -1000, 1000)),
  entry: 'secondBiggest',
  params: 'nums',
  reference: REFERENCE,
  examples: [[[7, 7, 5, 2]], [[4, 4, 4]]],
  tests: (rng) => [
    [[]],
    [[9]],
    [[1, 2]],
    [[2, 1]],
    [[-5, -5, -8]],
    [[3, 9, 9, 9, 8, 8]],
    [[0, -1000, 1000]],
    ...Array.from({ length: 5 }, () => [randomInts(rng, -6, 6, 0, 12)])
  ],
  hints: [
    'What should the function return when every value is the same, or when there are no values at all?',
    'Could you keep just two numbers as you go, the best so far and the runner-up so far, instead of sorting?',
    'When a new number equals the current best, should it change the runner-up?'
  ],
  approach:
    'Keep the largest value seen and the largest value seen that is smaller than it. Update both in a single pass and return the second one.',
  notes:
    'The trap is duplicates of the maximum: `n < first` stops a repeated maximum from becoming its own runner-up. Start with `null`, not `0`, because every number from -1000 to 1000 can be a real answer.',
  tags: ['arrays', 'loops', 'edge-cases']
});
