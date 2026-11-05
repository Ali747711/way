import { isIntIn, isListOf } from './helpers';
import { oracle } from './coin-ways.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function countWays(amount, coins) {
  const ways = new Array(amount + 1).fill(0);
  ways[0] = 1;
  for (const coin of coins) {
    for (let total = coin; total <= amount; total++) {
      ways[total] += ways[total - coin];
    }
  }
  return ways[amount];
}`;

/** A few distinct coin values in a random order. */
const coinSet = (
  shuffle: <T>(x: readonly T[]) => T[],
  size: number
): number[] =>
  shuffle([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]).slice(0, size);

export const coinWays = defineSingleCodeFamily({
  id: 'code/coin-ways',
  difficulty: 4,
  title: 'Ways to pay exactly',
  task: 'A machine pays out an exact amount using coins. You have as many coins of each value as you like. Two ways are the same if they use the same number of each coin, whatever the order: `1 + 2` and `2 + 1` count as one way.\n\nWrite `countWays(amount, coins)` that takes a whole number `amount` from 0 to 60 and an array `coins` of 1 to 4 different whole numbers from 1 to 25, in any order, and returns how many different ways there are to make `amount`. There is exactly one way to make `0` (use no coins). If an amount cannot be made, return `0`.',
  oracle,
  inDomain: ([amount, coins]) =>
    isIntIn(amount, 0, 60) &&
    isListOf(coins, 4, (c) => isIntIn(c, 1, 25), 1) &&
    new Set(coins as number[]).size === (coins as unknown[]).length,
  entry: 'countWays',
  params: 'amount, coins',
  reference: REFERENCE,
  examples: [
    [4, [1, 2, 3]],
    [3, [2]]
  ],
  tests: (rng) => [
    [0, [5]],
    [0, [1, 2]],
    [1, [2, 3]],
    [10, [10]],
    [10, [5, 2, 1]],
    [60, [1, 5, 10, 25]],
    [7, [3, 5]],
    ...Array.from({ length: 5 }, () => [
      rng.int(0, 60),
      coinSet((items) => rng.shuffle(items), rng.int(1, 4))
    ])
  ],
  hints: [
    'If you only had one kind of coin, how would you decide whether an amount can be paid, and in how many ways?',
    'How could you build a table where entry `t` holds the number of ways to pay `t`, adding one coin type at a time?',
    'To avoid counting `1 + 2` and `2 + 1` as different ways, should you loop over the coins on the outside or the inside?'
  ],
  approach:
    'Keep a table `ways[t]` for every total up to `amount`, starting with `ways[0] = 1`. For each coin in turn, for every total from that coin upwards, add `ways[total - coin]`. Handling one coin type at a time counts each combination only once.',
  notes:
    'The order of the two loops is the whole trick. With coins on the outside you count combinations; swap the loops and the same table counts *orders*, so `1 + 2` and `2 + 1` would both be counted. If you get `7` for 4 with coins 1, 2, 3, you counted orders by mistake; the answer is 4.',
  tags: ['dynamic-programming', 'counting', 'arrays']
});
