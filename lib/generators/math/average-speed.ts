import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, lcm, numberAnswer } from './shared';

interface Params {
  /** Speed on the first leg, km/h. */
  out: number;
  /** Speed on the way back, km/h. */
  back: number;
  /** Average speed of the whole round trip, km/h (a whole number). */
  average: number;
}

// Both leg speeds are given; the harmonic mean is a whole number.
const PAIRS: readonly (readonly [number, number])[] = [
  [6, 12],
  [10, 15],
  [12, 20],
  [20, 30],
  [24, 40],
  [30, 45],
  [36, 45],
  [40, 60],
  [60, 90],
  [15, 60],
  [8, 24],
  [18, 36]
];

const harmonic = (a: number, b: number): number => (2 * a * b) / (a + b);

export const answerFor = (p: Params): number => p.average;

interface Story {
  title: string;
  /** Fastest speed, in km/h, that is believable for this traveller. */
  limit: number;
  text: (p: Params) => string;
}

const STORIES: readonly Story[] = [
  {
    title: 'Out and back along the river',
    limit: 15,
    text: (p) =>
      `A runner goes along a river path to a bridge at ${p.out} km/h, then turns round and returns along the same path at ${p.back} km/h.\n\nWhat is the runner's average speed, in km/h, for the whole run?`
  },
  {
    title: 'Up the hill and back',
    limit: 40,
    text: (p) =>
      `A cyclist rides up a hill at ${p.out} km/h and straight back down the same road at ${p.back} km/h.\n\nWhat is the average speed, in km/h, over the whole round trip?`
  },
  {
    title: 'To town and home again',
    limit: 120,
    text: (p) =>
      `A bus drives from the depot to the town centre at ${p.out} km/h, then turns straight round and drives back along the same road at ${p.back} km/h, with no stops.\n\nWhat is its average speed, in km/h, for the whole round trip?`
  }
];

const hrs = (n: number): string => `${n} ${n === 1 ? 'hour' : 'hours'}`;

const solutionFor = ({ out, back, average }: Params): string => {
  const road = lcm(out, back);
  const t1 = road / out;
  const t2 = road / back;
  const mean = (out + back) / 2;
  return `**${average} km/h.**\n\nAverage speed is total distance divided by total time, not the average of the two speeds.\n\nAny length of road gives the same answer, so choose ${road} km, which both speeds divide exactly. The first leg takes ${road} ÷ ${out} = ${hrs(t1)} and the second takes ${road} ÷ ${back} = ${hrs(t2)}. The round trip is 2 × ${road} = ${2 * road} km in ${t1} + ${t2} = ${hrs(t1 + t2)}, so the average is ${2 * road} ÷ ${t1 + t2} = **${average} km/h**.\n\nThe tempting answer is ${mean} km/h, the mean of the two speeds. It is too high because more time is spent at the slower speed.`;
};

// Simulates the trip in one-minute steps instead of using a formula.
const solverFor = ({ out, back }: Params): string =>
  [
    'const road = 840; // km, divisible by every speed used',
    `const speeds = [${out}, ${back}];`,
    'let minutes = 0;',
    'for (const speed of speeds) {',
    '  let covered = 0;',
    '  while (covered < road) {',
    '    covered += speed / 60;',
    '    minutes++;',
    '  }',
    '}',
    'return Math.round((2 * road) / (minutes / 60));'
  ].join('\n');

const HINTS = [
  'Is average speed the mean of the two speeds, or the total distance divided by the total time?',
  'Choose a length for the road that both speeds divide exactly: how long does each leg take?',
  'What is the total distance of the round trip, the total time, and so the average speed?'
];

const build = (p: Params, rng: Rng) => {
  const story = rng.pick(
    STORIES.filter((s) => s.limit >= Math.max(p.out, p.back))
  );
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text(p),
    answer: numberAnswer(answerFor(p)),
    hints: HINTS,
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['rates', 'average speed']
  };
};

const candidates = (): Params[] =>
  PAIRS.map(([out, back]) => ({ out, back, average: harmonic(out, back) }));

export const averageSpeed = defineFamily<Params>({
  id: 'math/average-speed',
  area: 'math',
  slot: 'daily',
  params: () => keepFair(candidates(), build),
  key: (p) => `average-${p.out}-${p.back}`,
  build
});
