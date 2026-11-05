import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { lcm } from './shared';

type Mode = 'neither';

interface Params {
  n: number;
  a: number;
  b: number;
  mode: Mode;
}

const PAIRS: readonly [number, number][] = [
  [3, 4],
  [4, 6],
  [3, 5],
  [6, 8],
  [6, 9],
  [4, 10],
  [5, 7],
  [6, 10],
  [8, 12]
];
const LIMITS = [120, 150, 200, 240, 300, 360];
const MODES: readonly Mode[] = ['neither'];

const counts = ({ n, a, b }: Params) => {
  const l = lcm(a, b);
  return {
    l,
    ca: Math.floor(n / a),
    cb: Math.floor(n / b),
    both: Math.floor(n / l)
  };
};

export const answerFor = (p: Params): number => {
  const { ca, cb, both } = counts(p);
  return p.n - (ca + cb - both);
};

const key = (p: Params): string => `${p.n}-${p.a}-${p.b}-${p.mode}`;

const params = (): Params[] =>
  LIMITS.flatMap((n) =>
    PAIRS.flatMap(([a, b]) => MODES.map((mode) => ({ n, a, b, mode })))
  ).filter((p) => {
    const answer = answerFor(p);
    // An answer equal to a number in the prompt would leak through the hints.
    return ![p.n, p.a, p.b].includes(answer);
  });

const STORIES: Record<
  Mode,
  ((p: Params) => { title: string; setup: string; ask: string })[]
> = {
  neither: [
    ({ n, a, b }) => ({
      title: 'Days with no chores',
      setup: `Over a stretch of ${n} days, numbered 1 to ${n}, you water the plants on every day whose number is a multiple of ${a}, and you take out the recycling on every day whose number is a multiple of ${b}. Some days you do both.`,
      ask: 'On how many of the days do you do neither chore?'
    }),
    ({ n, a, b }) => ({
      title: 'Plain lamps on a long street',
      setup: `A street has ${n} lamp posts numbered 1 to ${n}. Every post whose number is a multiple of ${a} gets a flower basket. Every post whose number is a multiple of ${b} gets a bench. Some posts get both.`,
      ask: 'How many posts get neither a basket nor a bench?'
    }),
    ({ n, a, b }) => ({
      title: 'Seats nobody marked',
      setup: `A theatre has ${n} seats numbered 1 to ${n}. An usher puts a ribbon on every seat whose number is a multiple of ${a}, and a cushion on every seat whose number is a multiple of ${b}. Some seats get both.`,
      ask: 'How many seats get no ribbon and no cushion?'
    })
  ]
};

const HINTS: Record<Mode, (p: Params) => string[]> = {
  neither: ({ n, a, b }) => [
    `How many numbers from 1 to ${n} are multiples of ${a}, and how many are multiples of ${b}?`,
    `Which numbers are multiples of both ${a} and ${b}, and did you count each of them twice?`,
    `Once you know how many numbers get at least one of the two, how many of the ${n} are left over?`
  ]
};

const solutionFor = (p: Params): string => {
  const { n, a, b } = p;
  const { l, ca, cb, both } = counts(p);
  const answer = answerFor(p);
  const overlap =
    l === a * b
      ? `A number is a multiple of both exactly when it is a multiple of ${l}.`
      : `A number is a multiple of both exactly when it is a multiple of ${l}, the least common multiple. It is not ${a} × ${b} = ${a * b}, because ${a} and ${b} share a factor.`;
  const counted = `From 1 to ${n} there are ${ca} multiples of ${a} (${n} ÷ ${a}, rounded down) and ${cb} multiples of ${b}. ${overlap} There are ${both} of those.`;
  const atLeastOne = ca + cb - both;
  return `**${answer}.**\n\n${counted}\n\nThose ${both} numbers were counted twice, once in each list, so the numbers with at least one are ${ca} + ${cb} − ${both} = ${atLeastOne}. Everything else gets neither: ${n} − ${atLeastOne} = **${answer}**.\n\nThe common slip is forgetting the overlap, which gives ${n - ca - cb}: it takes the shared numbers away twice.`;
};

const solverFor = ({ n, a, b }: Params): string =>
  [
    'let count = 0;',
    `for (let k = 1; k <= ${n}; k++) {`,
    `  const first = k % ${a} === 0;`,
    `  const second = k % ${b} === 0;`,
    '  if (!first && !second) count++;',
    '}',
    'return count;'
  ].join('\n');

const build = (p: Params, rng: Rng) => {
  const story = rng.pick(STORIES[p.mode])(p);
  return {
    difficulty: 3,
    title: story.title,
    prompt: `${story.setup}\n\n${story.ask}`,
    answer: { type: 'number' as const, value: answerFor(p), tolerance: 0 },
    hints: HINTS[p.mode](p),
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['counting', 'multiples', 'inclusion-exclusion']
  };
};

export const eitherNotBoth = defineFamily<Params>({
  id: 'math/either-not-both',
  area: 'math',
  slot: 'daily',
  params,
  key,
  build
});
