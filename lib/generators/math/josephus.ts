import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer } from './shared';

interface Params {
  /** Add the survivors of the circles of size 1 up to this. */
  limit: number;
}

// Not one less than a power of two, so the last block is incomplete.
const LIMITS = [100, 150, 200, 250, 300, 400];

const highestPowerOfTwo = (n: number): number => 2 ** Math.floor(Math.log2(n));

/** Survivor when every second person is removed: write n = 2ᵐ + L, answer 2L + 1. */
const survivorOf = (n: number): number => 2 * (n - highestPowerOfTwo(n)) + 1;

export const answerFor = ({ limit }: Params): number => {
  let total = 0;
  for (let n = 1; n <= limit; n++) total += survivorOf(n);
  return total;
};

const rule = `Going clockwise from person 1, people alternately stay and leave: person 1 stays, person 2 leaves, person 3 stays, person 4 leaves, and so on. The count carries on round the circle without restarting, skipping anyone who has already left, so the person after the last one to leave stays and the next one leaves, until only one person is left.`;

const STORIES = [
  ({ limit }: Params) => ({
    title: 'Winners of every circle',
    text: `For each circle size n, people are numbered 1 to n round the circle. ${rule} Let W(n) be the number of the last person standing in a circle of n people. For example, W(1) = 1 and W(3) = 3.\n\nWhat is W(1) + W(2) + W(3) + … + W(${limit})?`
  }),
  ({ limit }: Params) => ({
    title: 'Adding up the survivors',
    text: `A circle of n people is numbered 1 to n. ${rule} Call the survivor's number W(n). So W(1) = 1 and W(3) = 3.\n\nFind W(1) + W(2) + … + W(${limit}).`
  }),
  ({ limit }: Params) => ({
    title: 'A game played in every size of circle',
    text: `A game is played once in each circle size from 1 person up to ${limit} people, the people in each circle being numbered 1 to n. ${rule} Let W(n) be the number of the person who remains in the circle of size n. For example, W(2) = 1 and W(3) = 3.\n\nWhat do you get when you add up all of W(1), W(2), …, W(${limit})?`
  })
];

const sumBlocks = (limit: number): string => {
  const rows: string[] = [];
  for (let m = 1; m <= limit; m *= 2) {
    const top = Math.min(2 * m - 1, limit);
    const count = top - m + 1;
    const survivors = Array.from({ length: count }, (_, i) => 2 * i + 1);
    const sum = survivors.reduce((a, b) => a + b, 0);
    const list =
      count <= 3
        ? survivors.join(', ')
        : `1, 3, …, ${2 * count - 1} (${count} of them)`;
    const range = m === top ? `n = ${m}` : `n from ${m} to ${top}`;
    rows.push(`- ${range}: survivors ${list}, which sum to ${count}² = ${sum}`);
  }
  return rows.join('\n');
};

const solutionFor = ({ limit }: Params): string => {
  const answer = answerFor({ limit });
  const m = highestPowerOfTwo(limit);
  return `**${answer}.**\n\n**Stage 1: find the survivor rule.** Work out small circles by hand: W(1) = 1, W(2) = 1, W(3) = 3, W(4) = 1, W(5) = 3, W(6) = 5, W(7) = 7, W(8) = 1. In a circle of 2, 4, 8, … people, one lap removes every even number and leaves the same game on the odd numbers, with the count back at person 1, so W is 1 whenever n is a power of 2. For other n, write n = 2ᵐ + L. After L people have left (persons 2, 4, …, 2L), exactly 2ᵐ people remain and the count reaches person 2L + 1, who stays. Person 2L + 1 now plays the part of person 1 in a circle of 2ᵐ, so W(n) = 2L + 1.\n\n**Stage 2: group the sizes by power of two.** For n from 2ᵐ to 2ᵐ⁺¹ − 1, L runs from 0 up to 2ᵐ − 1, so the survivors are 1, 3, 5, …, each odd number once. The first k odd numbers add to k², so a complete block of 2ᵐ sizes adds to (2ᵐ)².\n\n**Stage 3: add the blocks, the last one incomplete.**\n\n${sumBlocks(limit)}\n\n**Stage 4: total.** The last block starts at ${m}, so it holds ${limit - m + 1} sizes and sums to ${limit - m + 1}². Adding the block sums gives **${answer}**.\n\n**Why shortcuts fail.** Playing the game out for all ${limit} circle sizes by hand is far too long, and a guess from W(1) to W(8) does not show the pattern. Summing the first ${limit} odd numbers ignores the way the survivors start again at each power of 2, and treating the last block as complete overcounts it.`;
};

const solverFor = ({ limit }: Params): string =>
  [
    'const winner = (n) => {',
    '  const circle = Array.from({ length: n }, (_, i) => i + 1);',
    '  let index = 0;',
    '  while (circle.length > 1) {',
    '    index = (index + 1) % circle.length;',
    '    circle.splice(index, 1);',
    '    if (index === circle.length) index = 0;',
    '  }',
    '  return circle[0];',
    '};',
    'let total = 0;',
    `for (let n = 1; n <= ${limit}; n++) total += winner(n);`,
    'return total;'
  ].join('\n');

const HINTS = [
  'Can you work out the survivor by hand for circles of 1 to 8 people? What do you notice?',
  'What happens in a circle with a power of 2 (such as 4, 8 or 16) people after one full lap: who is left, and where does the counting restart?',
  'If you write n as a power of 2 plus a remainder L, what has happened once L people have left, and who then plays the part of person 1?',
  'For all the n from one power of 2 up to just before the next, what list of survivors do you get, and how do you add up a run of odd numbers starting from 1?',
  'How many complete blocks are there below the limit, what does the last incomplete block look like, and what is the total?'
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
    tags: ['counting', 'patterns', 'recursion', 'josephus']
  };
};

export const josephus = defineFamily<Params>({
  id: 'math/josephus',
  area: 'math',
  slot: 'deep',
  params: () =>
    keepFair(
      LIMITS.map((limit) => ({ limit })),
      build
    ),
  key: ({ limit }) => `sum-${limit}`,
  build
});
