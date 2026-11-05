import { isIntIn, isListOf } from './helpers';
import { oracle } from './missing-number.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function findMissing(tickets) {
  const n = tickets.length + 1;
  let expected = (n * (n + 1)) / 2;
  for (const ticket of tickets) {
    expected -= ticket;
  }
  return expected;
}`;

export const missingNumber = defineSingleCodeFamily({
  id: 'code/missing-number',
  difficulty: 3,
  title: 'The lost raffle ticket',
  task: 'A box should hold raffle tickets numbered `1` up to `n`, but one ticket has fallen out. The tickets that are left are in a random order.\n\nWrite `findMissing(tickets)` that takes an array of the remaining ticket numbers and returns the number of the missing ticket. The array has `n - 1` different whole numbers, all between `1` and `n`, where `n` is one more than the length of the array (`n` is at most 40). An empty array means `n` is 1, so the missing ticket is `1`.',
  oracle,
  inDomain: ([tickets]) =>
    isListOf(tickets, 39, (n) =>
      isIntIn(n, 1, (tickets as unknown[]).length + 1)
    ) && new Set(tickets as number[]).size === (tickets as unknown[]).length,
  entry: 'findMissing',
  params: 'tickets',
  reference: REFERENCE,
  examples: [[[3, 1, 4]], [[2, 3, 1, 5, 6]]],
  tests: (rng) => {
    const random = (n: number): number[] => {
      const missing = rng.int(1, n);
      return rng.shuffle(
        Array.from({ length: n }, (_, i) => i + 1).filter((x) => x !== missing)
      );
    };
    return [
      [[]],
      [[1]],
      [[2]],
      [[1, 2, 3]],
      [[2, 3, 4]],
      [[4, 3, 1]],
      [random(40)],
      [random(12)],
      [random(7)]
    ];
  },
  hints: [
    'If all the tickets were present, what would they add up to, and is there a short way to work that total out from n alone?',
    'How does the total of the tickets still in the box differ from the total of a full box?',
    'What is n when the array is empty, and does your method still give the right ticket?'
  ],
  approach:
    'A full box adds up to `n * (n + 1) / 2`. Subtract every ticket still in the box from that total; what is left is the missing number.',
  notes:
    'You do not need to sort or search. With `n` equal to `length + 1`, an empty array gives `1 * 2 / 2 = 1`, so the empty case needs no special code. Sorting and looking for the first gap also works, just slower.',
  tags: ['arrays', 'math', 'counting']
});
