import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, lcm, numberAnswer } from './shared';

interface Params {
  /** Group sizes. */
  moduli: readonly number[];
  /** Left over when counting in each group size. */
  remainders: readonly number[];
  /** The answer must be larger than this (0 means just positive). */
  above: number;
}

/** Every group size leaves it k short of a whole group. */
const short = (moduli: number[], k: number): Params => ({
  moduli,
  remainders: moduli.map((m) => m - k),
  above: 0
});

const mixed = (moduli: number[], remainders: number[], above = 0): Params => ({
  moduli,
  remainders,
  above
});

const CANDIDATES: readonly Params[] = [
  short([4, 5, 6], 1),
  short([3, 5, 7], 1),
  short([4, 6, 9], 1),
  short([5, 6, 8], 1),
  short([4, 5, 7], 2),
  short([6, 8, 9], 1),
  mixed([3, 4, 5], [2, 1, 3]),
  mixed([4, 5, 7], [1, 2, 3]),
  mixed([3, 5, 7], [1, 2, 4], 100),
  mixed([5, 6, 7], [3, 4, 5], 100),
  mixed([4, 9, 5], [3, 2, 1], 200),
  mixed([7, 8, 3], [5, 3, 1], 150)
];

const isShort = ({ moduli, remainders }: Params): number | null => {
  const gaps = moduli.map((m, i) => m - remainders[i]);
  return gaps.every((g) => g === gaps[0]) ? gaps[0] : null;
};

/** Steps through the numbers that fit the largest group size, testing the rest. */
export const answerFor = (p: Params): number => {
  const biggest = Math.max(...p.moduli);
  const base = p.remainders[p.moduli.indexOf(biggest)];
  for (let n = base; n < 100000; n += biggest) {
    if (n > p.above && n > 0 && fits(p, n)) return n;
  }
  return 0;
};

const fits = (p: Params, n: number): boolean =>
  p.moduli.every((m, i) => n % m === p.remainders[i]);

const key = (p: Params): string =>
  `${p.moduli.join('.')}-${p.remainders.join('.')}-${p.above}`;

const ITEMS = [
  { title: 'Marbles in the bag', thing: 'marbles', unit: 'bag' },
  { title: 'Stickers to share', thing: 'stickers', unit: 'sheet' },
  { title: 'Eggs for the market', thing: 'eggs', unit: 'box' },
  { title: 'A pile of coins', thing: 'coins', unit: 'stack' }
] as const;

const clauses = (p: Params, thing: string): string =>
  p.moduli
    .map(
      (m, i) =>
        `in groups of ${m}, ${p.remainders[i]} ${p.remainders[i] === 1 ? `${thing.replace(/s$/, '')} is` : `${thing} are`} left over`
    )
    .join('; ');

const promptFor = (
  p: Params,
  rng: Rng
): { title: string; text: string; thing: string } => {
  const item = rng.pick(ITEMS);
  const bound =
    p.above > 0
      ? `There are more than ${p.above} ${item.thing}.`
      : `There is at least one ${item.thing.replace(/s$/, '')}.`;
  return {
    title: item.title,
    thing: item.thing,
    text: `A pile of ${item.thing} is counted out in different ways: ${clauses(p, item.thing)}. ${bound}\n\nWhat is the smallest number of ${item.thing} the pile could hold?`
  };
};

const failure = (p: Params, n: number): string => {
  const i = p.moduli.findIndex((m, j) => n % m !== p.remainders[j]);
  return i === -1
    ? `${n} fits every condition`
    : `${n} leaves ${n % p.moduli[i]} in groups of ${p.moduli[i]}, not ${p.remainders[i]}`;
};

const listFits = (p: Params): string => {
  const biggest = Math.max(...p.moduli);
  const base = p.remainders[p.moduli.indexOf(biggest)];
  const answer = answerFor(p);
  const tried: number[] = [];
  for (let n = base; n <= answer; n += biggest) {
    if (n > p.above && n > 0) tried.push(n);
  }
  const shown = tried.slice(-6);
  const skipped =
    tried.length > shown.length
      ? 'The earlier ones fail in the same way. '
      : '';
  const lines = shown.map((n) => `- ${failure(p, n)}`).join('\n');
  return `Start with the largest group size, ${biggest}: the numbers leaving ${base} over go ${base}, ${base + biggest}, ${base + 2 * biggest}, and so on. Test them in turn against the other conditions. ${skipped}\n\n${lines}\n\nSo ${answer} is the first that satisfies all of them.`;
};

const solutionFor = (p: Params, thing: string): string => {
  const answer = answerFor(p);
  const gap = isShort(p);
  if (gap !== null) {
    const l = p.moduli.reduce((a, b) => lcm(a, b), 1);
    const product = p.moduli.reduce((a, b) => a * b, 1);
    const slip =
      l === product
        ? `The common slip is stopping at ${l}, the number every group size divides, and forgetting that the pile is ${gap} short of it.`
        : `The common slip is multiplying the group sizes, which gives ${product}, instead of taking the least common multiple, ${l}.`;
    return `**${answer}.**\n\nEvery group size leaves the pile ${gap} short of a full group. So if ${gap} more ${gap === 1 ? thing.replace(/s$/, '') : thing} were added, every group size would divide the pile exactly. The pile plus ${gap} would be a common multiple of ${p.moduli.join(', ')}.\n\nThe smallest common multiple is lcm(${p.moduli.join(', ')}) = ${l}, so the pile is ${l} − ${gap} = **${answer}**.\n\n${slip}`;
  }
  const bound = p.above > 0 ? ` and is larger than ${p.above}` : '';
  return `**${answer}.**\n\nA number that fits one condition is easy to list, so list the ones for the largest group size and test them against the rest.\n\n${listFits(p)}\n\nSo the smallest number that fits every condition${bound} is **${answer}**.\n\nThe common slip is to stop at the first number that fits two of the conditions, without checking the third.`;
};

const solverFor = (p: Params): string =>
  [
    `const moduli = ${JSON.stringify(p.moduli)};`,
    `const remainders = ${JSON.stringify(p.remainders)};`,
    `for (let n = ${p.above + 1}; n < 1000000; n++) {`,
    '  if (moduli.every((m, i) => n % m === remainders[i])) return n;',
    '}',
    'return NaN;'
  ].join('\n');

const hintsFor = (p: Params): string[] =>
  isShort(p) !== null
    ? [
        'In each way of counting, how many more would you need to make the last group complete?',
        'What does that tell you about the pile if you imagine adding that many?',
        'What is the smallest positive number that every group size divides exactly?'
      ]
    : [
        'Which of the conditions gives the shortest list of possible numbers, and what are the first few?',
        'Which of those numbers also satisfy the next condition?',
        'Once a number fits all the conditions, how do you know it is the smallest one that is allowed?'
      ];

const build = (p: Params, rng: Rng) => {
  const story = promptFor(p, rng);
  const thing = story.thing;
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: hintsFor(p),
    solution: solutionFor(p, thing),
    solver: solverFor(p),
    tags: ['number theory', 'remainders', 'multiples']
  };
};

export const remainders = defineFamily<Params>({
  id: 'math/remainders',
  area: 'math',
  slot: 'daily',
  group: (p) => (isShort(p) === null ? 'mixed' : 'short'),
  params: () => keepFair(CANDIDATES, build),
  key,
  build
});
