import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { gcd, keepFair, numberAnswer, reduce } from './shared';

interface DiceEvent {
  id: string;
  title: string;
  /** Finishes "The probability that ..." */
  text: string;
  /** Typed test, used for the answer and the worked rows. */
  test: (a: number, b: number) => boolean;
  /** The same test as a JS expression in a and b, for the solver. */
  code: string;
  /** A question that points to the useful way of counting. */
  idea: string;
  /** What the shortcut or the trap is. */
  note: string;
}

interface Params {
  event: DiceEvent;
}

const FACES = [1, 2, 3, 4, 5, 6] as const;

const isSquare = (n: number): boolean => Math.sqrt(n) % 1 === 0;

const atLeast = (k: number): DiceEvent => ({
  id: `some-die-at-least-${k}`,
  title: k === 6 ? 'Hunting for a six' : `A die of ${k} or more`,
  text:
    k === 6
      ? 'at least one of the two dice shows a 6'
      : `at least one of the two dice shows ${k} or more`,
  test: (a, b) => a >= k || b >= k,
  code: `Math.max(a, b) >= ${k}`,
  idea: 'Is it easier to count the outcomes where the event happens, or the outcomes where it does not?',
  note: `(A quicker count: the opposite, both dice showing ${k - 1} or less, happens in ${k - 1} × ${k - 1} = ${(k - 1) ** 2} ways, and 36 − ${(k - 1) ** 2} = ${36 - (k - 1) ** 2}.)`
});

const multipleOf = (k: number): DiceEvent => ({
  id: `product-multiple-of-${k}`,
  title: k === 2 ? 'An even product' : `A product in the ${k} times table`,
  text: `the two numbers multiply to a multiple of ${k}`,
  test: (a, b) => (a * b) % k === 0,
  code: `[a, b].some((v) => v % ${k} === 0)`,
  idea: `When is a product of two whole numbers not a multiple of ${k}, and how many outcomes is that?`,
  note:
    k === 2
      ? '(A quicker count: a product is odd only when both dice are odd, which happens in 3 × 3 = 9 ways, and 36 − 9 = 27.)'
      : `(A quicker count: because ${k} is prime, the product is outside the ${k} times table only when neither die shows a multiple of ${k}, which happens in ${6 - Math.floor(6 / k)} × ${6 - Math.floor(6 / k)} = ${(6 - Math.floor(6 / k)) ** 2} ways, and 36 − ${(6 - Math.floor(6 / k)) ** 2} = ${36 - (6 - Math.floor(6 / k)) ** 2}.)`
});

const sumMultipleOf = (k: number): DiceEvent => ({
  id: `sum-multiple-of-${k}`,
  title: `Totals in the ${k} times table`,
  text: `the total is a multiple of ${k}`,
  test: (a, b) => (a + b) % k === 0,
  code: `Array.from({ length: 12 / ${k} }, (_, i) => (i + 1) * ${k}).includes(a + b)`,
  idea: `Which totals from 2 to 12 are multiples of ${k}, and in how many ways can each be made?`,
  note: 'Count the ways to make each possible total, remembering that the same two numbers in a different order are a different outcome.'
});

const within = (d: number): DiceEvent => ({
  id: `difference-at-most-${d}`,
  title: d === 1 ? 'Dice that nearly agree' : 'Dice that stay close',
  text: `the two numbers differ by ${d} or less (a difference of 0 counts)`,
  test: (a, b) => Math.abs(a - b) <= d,
  code: `Math.max(a, b) - Math.min(a, b) <= ${d}`,
  idea: 'For each possible size of difference, how many ordered outcomes have exactly that difference?',
  note: 'A difference of j can happen in 2 × (6 − j) ordered ways when j is not 0, since either die can be the bigger one, and in 6 ways when j is 0.'
});

const EVENTS: readonly DiceEvent[] = [
  {
    id: 'one-is-double',
    title: 'One die double the other',
    text: 'one die shows exactly twice the number on the other die',
    test: (a, b) => a === 2 * b || b === 2 * a,
    code: 'Math.max(a, b) === 2 * Math.min(a, b)',
    idea: 'Which numbers on one die have a double that the other die can show?',
    note: 'Only 1, 2 and 3 can be the smaller number, and each pair can land in two orders.'
  },
  {
    id: 'sum-square',
    title: 'A square total',
    text: 'the total is a perfect square',
    test: (a, b) => isSquare(a + b),
    code: '[4, 9].includes(a + b)',
    idea: 'Which perfect squares lie between 2 and 12, and in how many ways can each be made?',
    note: 'Only the totals 4 and 9 are possible, since 1 is too small and 16 is too large.'
  },
  multipleOf(2),
  multipleOf(3),
  multipleOf(5),
  atLeast(3),
  atLeast(4),
  atLeast(5),
  atLeast(6),
  within(1),
  within(2),
  sumMultipleOf(4),
  sumMultipleOf(5),
  {
    id: 'second-multiple-of-first',
    title: 'Dice that divide',
    text: 'the number on the blue die is a multiple of the number on the red die (a number counts as a multiple of itself)',
    test: (red, blue) => blue % red === 0,
    code: 'Array.from({ length: 6 }, (_, i) => (i + 1) * a).includes(b)',
    idea: 'If the red die shows 1, then 2, then 3 and so on, how many blue values work each time?',
    note: 'The red die matters most: a red 1 divides everything, while a red 4, 5 or 6 divides only itself.'
  },
  {
    id: 'sum-beats-product',
    title: 'When adding beats multiplying',
    text: 'the total of the two numbers is larger than their product',
    test: (a, b) => a + b > a * b,
    code: '(a - 1) * (b - 1) < 1',
    idea: 'Compared with their sum, what happens to the product of two whole numbers when neither of them is 1?',
    note: 'If neither die shows 1, the product is at least as large as the sum, so a 1 must appear. Then check that every outcome with a 1 really works.'
  },
  {
    id: 'square-product',
    title: 'A square product',
    text: 'the two numbers multiply to a perfect square',
    test: (a, b) => isSquare(a * b),
    code: '[1, 4, 9, 16, 25, 36].includes(a * b)',
    idea: 'Which perfect squares up to 36 can be made as a product of two numbers from 1 to 6?',
    note: 'Do not forget the pairs of equal numbers, which give a square every time, and the pair 1 and 4, which can fall in two orders.'
  },
  {
    id: 'coprime',
    title: 'Dice with nothing in common',
    text: 'the two numbers have no common factor larger than 1',
    test: (a, b) => gcd(a, b) === 1,
    code: '[2, 3, 5].every((f) => !(a % f === 0 && b % f === 0))',
    idea: 'Is it quicker to count the pairs that do share a factor?',
    note: 'The pairs that share a factor are the ones sharing a 2, a 3 or a 5. Be careful not to count a pair like 6 and 6 twice.'
  }
];

const waysFor = (event: DiceEvent): number =>
  FACES.reduce(
    (sum, a) => sum + FACES.filter((b) => event.test(a, b)).length,
    0
  );

export const answerFor = ({ event }: Params): number => {
  const { p, q } = reduce(waysFor(event), 36);
  return p + q;
};

const SETUPS = [
  'Two fair six-sided dice are rolled together, one red and one blue.',
  'In a board game you roll a red die and a blue die. Both are fair and have faces 1 to 6.',
  'A teacher rolls a red die and a blue die at once. Each die is fair, with faces numbered 1 to 6.'
];

const rowsFor = (event: DiceEvent): string =>
  FACES.map((a) => {
    const good = FACES.filter((b) => event.test(a, b));
    const list = good.length === 0 ? 'no value' : good.join(', ');
    return `- Red shows ${a}: blue can show ${list} (${good.length} of 6).`;
  }).join('\n');

const solutionFor = ({ event }: Params): string => {
  const ways = waysFor(event);
  const { p: top, q } = reduce(ways, 36);
  const answer = top + q;
  const reduced =
    top === ways
      ? `${ways}/36 is already in lowest terms`
      : `${ways}/36 reduces to ${top}/${q}`;
  return `**${answer}.**\n\nThere are 6 × 6 = 36 equally likely (red, blue) outcomes, because the two dice are different colours. Go through the red die one value at a time:\n\n${rowsFor(event)}\n\nThat is ${ways} outcomes out of 36. ${event.note} ${reduced}, so p + q = ${top} + ${q} = **${answer}**.\n\nThe common slip is counting unordered pairs, such as 2 and 5, as one outcome. A pair of different numbers can happen in two ways, a double in only one, so only the 36 ordered outcomes are equally likely.`;
};

const solverFor = ({ event }: Params): string =>
  [
    'const outcomes = [];',
    'for (let a = 1; a <= 6; a++) {',
    '  for (let b = 1; b <= 6; b++) outcomes.push([a, b]);',
    '}',
    `const hits = outcomes.filter(([a, b]) => ${event.code}).length;`,
    'const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));',
    'const g = gcd(hits, outcomes.length);',
    'return hits / g + outcomes.length / g;'
  ].join('\n');

const build = (p: Params, rng: Rng) => ({
  difficulty: 3,
  title: p.event.title,
  prompt: `${rng.pick(SETUPS)}\n\nThe probability that ${p.event.text} can be written as a fraction p/q in lowest terms. What is p + q?`,
  answer: numberAnswer(answerFor(p)),
  hints: [
    'How many equally likely (red, blue) outcomes are there altogether?',
    p.event.idea,
    'How many of the equally likely outcomes work in all, and what does that fraction reduce to?'
  ],
  solution: solutionFor(p),
  solver: solverFor(p),
  tags: ['probability', 'dice', 'counting']
});

export const diceEvents = defineFamily<Params>({
  id: 'math/dice-events',
  area: 'math',
  slot: 'daily',
  group: ({ event }) => event.id.split('-')[0],
  params: () =>
    keepFair(
      EVENTS.map((event) => ({ event })),
      build
    ),
  key: ({ event }) => event.id,
  build
});
