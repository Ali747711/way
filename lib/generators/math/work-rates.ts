import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, lcm, numberAnswer, reduce } from './shared';

type Mode = 'together' | 'three' | 'leak';

interface Params {
  mode: Mode;
  /** Hours each worker or pipe needs alone; for 'leak': [fill alone, fill with leak]. */
  times: readonly number[];
}

const together = (a: number, b: number): Params => ({
  mode: 'together',
  times: [a, b]
});
const three = (a: number, b: number, c: number): Params => ({
  mode: 'three',
  times: [a, b, c]
});
const leak = (fill: number, withLeak: number): Params => ({
  mode: 'leak',
  times: [fill, withLeak]
});

const CANDIDATES: readonly Params[] = [
  together(12, 6),
  together(20, 5),
  together(15, 10),
  together(30, 20),
  together(24, 8),
  together(30, 6),
  together(36, 12),
  together(60, 40),
  three(10, 15, 30),
  three(12, 20, 30),
  three(8, 12, 24),
  three(6, 8, 24),
  three(20, 24, 30),
  leak(4, 6),
  leak(6, 8),
  leak(5, 6),
  leak(10, 12),
  leak(10, 15),
  leak(12, 18)
];

export const answerFor = ({ mode, times }: Params): number => {
  if (mode === 'together') {
    const [a, b] = times;
    return (a * b) / (a + b);
  }
  if (mode === 'three') {
    const [a, b, c] = times;
    return (a * b * c) / (b * c + a * c + a * b);
  }
  const [fill, net] = times;
  return (fill * net) / (net - fill);
};

const key = ({ mode, times }: Params): string => `${mode}-${times.join('-')}`;

const STORIES: Record<
  Mode,
  readonly ((p: Params) => {
    title: string;
    text: string;
    noun: string;
    each?: string;
  })[]
> = {
  together: [
    ({ times: [a, b] }) => ({
      title: 'Two taps, one tank',
      noun: 'tank',
      each: 'tap',
      text: `A tank is filled by two taps. The first tap alone would fill the empty tank in ${a} hours. The second tap alone would take ${b} hours. Both taps run at a steady rate.\n\nHow many hours does it take to fill the empty tank with both taps open?`
    }),
    ({ times: [a, b] }) => ({
      title: 'Painting the fence together',
      noun: 'fence',
      each: 'painter',
      text: `Mira can paint a long fence in ${a} hours working alone, and Dev can paint the same fence in ${b} hours alone. Each paints at a steady pace, and they do not get in each other's way.\n\nHow many hours will they take to paint the fence together?`
    }),
    ({ times: [a, b] }) => ({
      title: 'Two printers in a race',
      noun: 'order',
      each: 'printer',
      text: `A print shop has two printers. To print a full order, printer A needs ${a} hours and printer B needs ${b} hours. Both work at a steady speed.\n\nHow many hours do they need to print the order if both start at the same time and share the work?`
    })
  ],
  three: [
    ({ times: [a, b, c] }) => ({
      title: 'Three pipes into a pool',
      noun: 'pool',
      each: 'pipe',
      text: `Three pipes can each fill an empty pool alone. The first takes ${a} hours, the second ${b} hours and the third ${c} hours. All flow at steady rates.\n\nHow many hours does it take to fill the empty pool with all three pipes open?`
    }),
    ({ times: [a, b, c] }) => ({
      title: 'Three painters',
      noun: 'hall',
      each: 'painter',
      text: `Three painters can each paint a hall alone in ${a}, ${b} and ${c} hours. Each works at a steady pace.\n\nHow many hours will they take to paint the hall if all three work together?`
    })
  ],
  leak: [
    ({ times: [fill, net] }) => ({
      title: 'A tank with a hole',
      noun: 'tank',
      each: 'tap',
      text: `A tap fills an empty tank in ${fill} hours. The tank has a hole in the bottom, and with the hole open the same tap takes ${net} hours to fill the empty tank. The water leaks out at a steady rate whatever the depth.\n\nIf the tank were full, with the tap off, how many hours would the hole take to empty it?`
    }),
    ({ times: [fill, net] }) => ({
      title: 'The leaking rain tank',
      noun: 'tank',
      each: 'tap',
      text: `A farmer fills an empty rain tank from a hose in ${fill} hours. The tank has a small leak, and with the leak the same hose takes ${net} hours to fill it. The leak runs at a steady rate.\n\nHow many hours would the leak alone take to drain a full tank?`
    })
  ]
};

const frac = (n: number): string => `1/${n}`;

const andList = (items: string[]): string =>
  items.length === 1
    ? items[0]
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** "takes q hours" when the rate is 1/q, else "takes q ÷ p = answer hours". */
const takes = (rate: { p: number; q: number }, answer: number): string =>
  rate.p === 1
    ? `**${answer}** hours`
    : `${rate.q} ÷ ${rate.p} = **${answer}** hours`;

const solutionFor = (p: Params, noun: string, each: string): string => {
  const answer = answerFor(p);
  const { mode, times } = p;
  if (mode === 'leak') {
    const [fill, net] = times;
    const rate = reduce(net - fill, fill * net);
    return `**${answer} hours.**\n\nThink in fractions of the ${noun} per hour. The tap fills ${frac(fill)} of the ${noun} each hour. With the leak open, the ${noun} gains only ${frac(net)} each hour, so the leak removes the difference: ${frac(fill)} − ${frac(net)} = ${rate.p}/${rate.q} of the ${noun} per hour.\n\nIf ${rate.p}/${rate.q} of a full ${noun} leaks away each hour, the leak alone takes ${takes(rate, answer)} to empty it.\n\nThe common slip is subtracting the times, ${net} − ${fill} = ${net - fill}. Times do not subtract, but rates do.`;
  }
  const sum = times.map(frac).join(' + ');
  const common = times.reduce((a, b) => lcm(a, b), 1);
  const numerator = times.reduce((acc, t) => acc + common / t, 0);
  const rate = reduce(numerator, common);
  const who = mode === 'together' ? 'both' : 'all three';
  return `**${answer} hours.**\n\nThink in fractions of the ${noun} per hour. Working alone, the ${each}s do ${andList(times.map(frac))} of the ${noun} in one hour. Working together, their rates add: ${sum} = ${numerator}/${common} = ${rate.p}/${rate.q} of the ${noun} per hour.\n\nIf ${rate.p}/${rate.q} of the ${noun} is done each hour, the whole ${noun} takes ${takes(rate, answer)} with ${who} ${each}s at work.\n\nThe common slip is adding or averaging the times. Times do not add, but rates do.`;
};

const solverFor = ({ mode, times }: Params): string => {
  if (mode === 'leak') {
    const [fill, net] = times;
    return [
      `const fill = ${fill};`,
      `const net = ${net};`,
      'for (let leak = 1; leak <= 10000; leak++) {',
      '  // Balance the rates 1/fill - 1/leak = 1/net without fractions.',
      '  if (net * leak - net * fill === fill * leak) return leak;',
      '}',
      'return NaN;'
    ].join('\n');
  }
  return [
    `const times = ${JSON.stringify(times)};`,
    'for (let hours = 1; hours <= 10000; hours++) {',
    '  const done = times.reduce((sum, t) => sum + hours / t, 0);',
    '  if (Math.abs(done - 1) < 1e-9) return hours;',
    '}',
    'return NaN;'
  ].join('\n');
};

const hintsFor = (mode: Mode, noun: string, each: string): string[] => {
  if (mode === 'leak') {
    return [
      `What fraction of the ${noun} does the tap fill in one hour with no leak, and what fraction does it gain in one hour with the leak?`,
      'Where did the difference between those two fractions go?',
      `If that fraction of a full ${noun} leaks away each hour, how long does the whole ${noun} take to empty?`
    ];
  }
  const group = mode === 'together' ? `both ${each}s` : `all three ${each}s`;
  return [
    `If one ${each} working alone needs a given number of hours for the whole ${noun}, what fraction of the ${noun} does it do in one hour?`,
    `When ${group} work at once, how do the fractions of the ${noun} done in an hour combine?`,
    `If that combined fraction is done every hour, how many hours does the whole ${noun} take?`
  ];
};

const build = (p: Params, rng: Rng) => {
  const story = rng.pick(STORIES[p.mode])(p);
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: hintsFor(p.mode, story.noun, story.each ?? 'tap'),
    solution: solutionFor(p, story.noun, story.each ?? 'tap'),
    solver: solverFor(p),
    tags: ['rates', 'work', 'fractions']
  };
};

export const workRates = defineFamily<Params>({
  id: 'math/work-rates',
  area: 'math',
  slot: 'daily',
  group: (p) => p.mode,
  params: () => keepFair(CANDIDATES, build),
  key,
  build
});
