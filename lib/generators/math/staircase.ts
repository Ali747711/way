import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer } from './shared';

type Mode = 'plain' | 'broken' | 'three';

interface Params {
  mode: Mode;
  /** Number of steps. */
  n: number;
  /** The broken step ('broken' mode only; 0 otherwise). */
  broken: number;
}

const CANDIDATES: readonly Params[] = [
  ...[7, 8, 9, 10, 11, 12].map((n) => ({
    mode: 'plain' as const,
    n,
    broken: 0
  })),
  ...(
    [
      [9, 4],
      [9, 6],
      [10, 3],
      [10, 5],
      [11, 4],
      [11, 7],
      [12, 5],
      [12, 8]
    ] as const
  ).map(([n, broken]) => ({ mode: 'broken' as const, n, broken })),
  ...[6, 7, 8, 9, 10].map((n) => ({ mode: 'three' as const, n, broken: 0 }))
];

/** Ways to climb m steps using steps of 1 and 2: the Fibonacci numbers. */
const ways = (m: number, sizes: readonly number[]): number => {
  const table = [1];
  for (let i = 1; i <= m; i++) {
    table.push(
      sizes.reduce((sum, s) => sum + (i - s >= 0 ? table[i - s] : 0), 0)
    );
  }
  return table[m];
};

export const answerFor = ({ mode, n, broken }: Params): number => {
  if (mode === 'plain') return ways(n, [1, 2]);
  if (mode === 'three') return ways(n, [1, 2, 3]);
  // Reach the step before the broken one, jump over it, then finish.
  return ways(broken - 1, [1, 2]) * ways(n - broken - 1, [1, 2]);
};

const key = ({ mode, n, broken }: Params): string =>
  mode === 'broken' ? `broken-${n}-${broken}` : `${mode}-${n}`;

const STORIES: Record<
  Mode,
  readonly ((p: Params) => { title: string; text: string })[]
> = {
  plain: [
    ({ n }) => ({
      title: 'Up the staircase',
      text: `A staircase has ${n} steps. Each move takes you up either 1 step or 2 steps. Two climbs are different if the list of moves is different.\n\nIn how many different ways can you climb from the floor to the top step?`
    }),
    ({ n }) => ({
      title: 'A frog on the steps',
      text: `A frog sits at the bottom of ${n} stone steps. Each hop takes it up 1 step or 2 steps, and it wants to land exactly on the top step. Two journeys are different if the hops are different.\n\nHow many different journeys are there?`
    }),
    ({ n }) => ({
      title: 'Ways to the top',
      text: `You climb a flight of ${n} steps, taking 1 step or 2 steps at a time. Climbing 1 then 2 is different from climbing 2 then 1.\n\nHow many different ways are there to reach the top?`
    })
  ],
  broken: [
    ({ n, broken }) => ({
      title: 'The broken step',
      text: `A staircase has ${n} steps, but step number ${broken} is broken and you must never put your foot on it. Each move takes you up 1 step or 2 steps. Two climbs are different if the list of moves is different.\n\nIn how many different ways can you climb from the floor to the top step?`
    }),
    ({ n, broken }) => ({
      title: 'A frog and a broken stone',
      text: `A frog starts on the bank and hops along a line of ${n} flat stones, called step 1 to step ${n}. Step ${broken} is broken, so the frog cannot land on it. Each hop covers 1 step or 2 steps, and the frog must land exactly on step ${n}.\n\nHow many different sequences of hops can the frog use?`
    })
  ],
  three: [
    ({ n }) => ({
      title: 'Taking the stairs in threes',
      text: `A staircase has ${n} steps. Each move takes you up 1, 2 or 3 steps. Two climbs are different if the list of moves is different.\n\nIn how many different ways can you climb to the top step exactly?`
    }),
    ({ n }) => ({
      title: 'A longer stride',
      text: `You climb ${n} steps, and each move can be a single step, a double step or a triple step. The order of the moves matters.\n\nHow many different climbs reach the top exactly?`
    })
  ]
};

const table = (m: number, sizes: readonly number[]): string =>
  Array.from({ length: m + 1 }, (_, i) => ways(i, sizes)).join(', ');

const solutionFor = (p: Params): string => {
  const answer = answerFor(p);
  const { n, broken } = p;
  if (p.mode === 'plain') {
    return `**${answer}.**\n\nLet w(k) be the number of ways to reach step k. The last move into step k came from step k − 1 (a single step) or from step k − 2 (a double step), so w(k) = w(k − 1) + w(k − 2). To start the table, w(0) = 1 (do nothing) and w(1) = 1.\n\nThe table for steps 0 to ${n} reads ${table(n, [1, 2])}, each number being the sum of the two before it. The last one is **${answer}**.\n\nThe common slip is starting with w(2) = 1, forgetting that two single steps and one double step are different climbs, so w(2) = 2.`;
  }
  if (p.mode === 'three') {
    return `**${answer}.**\n\nLet w(k) be the number of ways to reach step k. The last move into step k was a step of 1, 2 or 3, so w(k) = w(k − 1) + w(k − 2) + w(k − 3), with w(0) = 1 and anything below zero counting as 0.\n\nThe table for steps 0 to ${n} reads ${table(n, [1, 2, 3])}. From w(3) on, each number is the sum of the three before it. The last one is **${answer}**.\n\nThe common slip is adding only the two numbers before, as you would if each move were only 1 or 2 steps.`;
  }
  const before = ways(broken - 1, [1, 2]);
  const after = ways(n - broken - 1, [1, 2]);
  return `**${answer}.**\n\nYou can never stand on step ${broken}, so a climb must reach step ${broken - 1} and then take a double step over the broken one to step ${broken + 1}.\n\nWays to reach steps 0 to ${broken - 1} go ${table(broken - 1, [1, 2])}, each the sum of the two before it, so there are ${before} ways to reach step ${broken - 1}.\n\nFrom step ${broken + 1} to step ${n} is a staircase of ${n - broken - 1} steps, and the ways to reach its steps 0 to ${n - broken - 1} go ${table(n - broken - 1, [1, 2])}, so there are ${after} ways to finish.\n\nThe two parts are independent, so multiply: ${before} × ${after} = **${answer}**.\n\nThe common slip is treating the broken step as if it removed a step, so the staircase simply gets shorter. The broken step stays where it is, and you still have to cover its distance with a double step.`;
};

const solverFor = (p: Params): string => {
  const sizes = p.mode === 'three' ? [1, 2, 3] : [1, 2];
  const banned = p.mode === 'broken' ? p.broken : -1;
  return [
    `const sizes = ${JSON.stringify(sizes)};`,
    `const top = ${p.n};`,
    `const banned = ${banned};`,
    'const climb = (position) => {',
    '  if (position === top) return 1;',
    '  let count = 0;',
    '  for (const s of sizes) {',
    '    const next = position + s;',
    '    if (next <= top && next !== banned) count += climb(next);',
    '  }',
    '  return count;',
    '};',
    'return climb(0);'
  ].join('\n');
};

const HINTS: Record<Mode, string[]> = {
  plain: [
    'Think about the very last move onto the top step: from which steps could it have started?',
    'If you knew the number of ways to reach each of those two steps, how would you get the number for the top?',
    'Can you start from the first two steps and build the whole table one step at a time?'
  ],
  three: [
    'Think about the very last move onto the top step: from which steps could it have started?',
    'If you knew the number of ways to reach each of those steps, how would you get the number for the top?',
    'Can you start from the bottom and build the whole table one step at a time?'
  ],
  broken: [
    'What must you do when you reach the step just below the broken one?',
    'How many ways are there to reach that step, and then how many ways to finish from the step just above the broken one?',
    'Do the choices before the broken step and after it affect each other, and so how should you combine the two counts?'
  ]
};

const build = (p: Params, rng: Rng) => {
  const story = rng.pick(STORIES[p.mode])(p);
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: HINTS[p.mode],
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['counting', 'recursion', 'sequences']
  };
};

export const staircase = defineFamily<Params>({
  id: 'math/staircase',
  area: 'math',
  slot: 'daily',
  group: (p) => p.mode,
  params: () => keepFair(CANDIDATES, build),
  key,
  build
});
