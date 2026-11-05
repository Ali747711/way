import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer } from './shared';

type Term = readonly [base: number, exponent: number];

interface Params {
  terms: readonly Term[];
}

// The repeating last digits of powers, by last digit of the base.
const CYCLES: Record<number, readonly number[]> = {
  2: [2, 4, 8, 6],
  3: [3, 9, 7, 1],
  4: [4, 6],
  7: [7, 9, 3, 1],
  8: [8, 4, 2, 6],
  9: [9, 1]
};

const SETS: readonly (readonly Term[])[] = [
  [
    [7, 2031],
    [3, 2029]
  ],
  [
    [2, 2027],
    [9, 1999]
  ],
  [
    [13, 1998],
    [8, 2022]
  ],
  [
    [4, 1991],
    [7, 2030]
  ],
  [
    [17, 2026],
    [24, 2025]
  ],
  [
    [2, 1999],
    [3, 2000]
  ],
  [
    [8, 2026],
    [3, 2023]
  ],
  [
    [9, 2025],
    [7, 2027]
  ],
  [
    [2, 2024],
    [3, 2024],
    [7, 2024]
  ],
  [
    [3, 2025],
    [8, 2025],
    [9, 2025]
  ],
  [
    [14, 2027],
    [23, 2028],
    [2, 2026]
  ],
  [
    [4, 2030],
    [9, 2029],
    [2, 2029]
  ]
];

const lastDigitOfTerm = ([base, exponent]: Term): number => {
  const cycle = CYCLES[base % 10];
  return cycle[(exponent - 1) % cycle.length];
};

export const answerFor = ({ terms }: Params): number =>
  terms.reduce((sum, term) => sum + lastDigitOfTerm(term), 0) % 10;

const SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

const power = (base: number, exponent: number): string =>
  `${base}${String(exponent)
    .split('')
    .map((d) => SUPERSCRIPTS[Number(d)])
    .join('')}`;

const expression = ({ terms }: Params): string =>
  terms.map(([b, e]) => power(b, e)).join(' + ');

const TITLES = [
  'The last digit of giant powers',
  'Two giants, one digit',
  'The digit at the very end'
];

const INTROS: readonly ((p: Params) => string)[] = [
  (p) =>
    `The number ${expression(p)} is far too large to write out. Only its last digit is needed.`,
  (p) =>
    `A calculator cannot show ${expression(p)}, but its last digit can still be found with paper and pen.`,
  (p) => `Look at the sum ${expression(p)}. Each term is a very large power.`
];

const termSolution = ([base, exponent]: Term): string => {
  const cycle = CYCLES[base % 10];
  const length = cycle.length;
  const q = Math.floor((exponent - 1) / length);
  const r = ((exponent - 1) % length) + 1;
  const digit = cycle[r - 1];
  const list = cycle.join(', ');
  const place =
    r === length
      ? `${exponent} is a multiple of ${length}, so it lands on the last place in the cycle`
      : `${exponent} = ${length} × ${q} + ${r}, so it lands on place ${r} of the cycle`;
  const lead =
    base >= 10 ? `The base ${base} ends in ${base % 10}, so the` : 'The';
  return `- ${lead} last digits of the powers of ${base % 10} go ${list}, then repeat every ${length} steps. ${place}: ${power(base, exponent)} ends in ${digit}.`;
};

const solutionFor = (p: Params): string => {
  const digits = p.terms.map(lastDigitOfTerm);
  const total = digits.reduce((a, b) => a + b, 0);
  const answer = answerFor(p);
  return `**${answer}.**\n\nOnly the last digit of each number matters for the last digit of a sum, and only the last digit of the base matters for the last digit of a power. So each term can be replaced by the repeating pattern of last digits.\n\n${p.terms.map(termSolution).join('\n')}\n\nAdding the last digits: ${digits.join(' + ')} = ${total}, whose last digit is **${answer}**.\n\nThe common slip is mixing up the place in the cycle: when the exponent is an exact multiple of the cycle length, the answer is the last digit of the cycle, not the first.`;
};

const solverFor = ({ terms }: Params): string =>
  [
    `const terms = ${JSON.stringify(terms)};`,
    'let total = 0;',
    'for (const [base, exponent] of terms) {',
    '  let digit = 1;',
    '  for (let i = 0; i < exponent; i++) digit = (digit * base) % 10;',
    '  total += digit;',
    '}',
    'return total % 10;'
  ].join('\n');

const build = (p: Params, rng: Rng) => ({
  difficulty: 3,
  title: rng.pick(TITLES),
  prompt: `${rng.pick(INTROS)(p)}\n\nWhat is the last digit of ${expression(p)}?`,
  answer: numberAnswer(answerFor(p)),
  hints: [
    'If you only want the last digit of a power, which digits of the base actually matter?',
    'Write out the last digits of the first few powers of one base: after how many steps does the pattern start repeating?',
    'When you divide each exponent by the length of its pattern, what remainder tells you where you land, and what is the last digit of the sum of the results?'
  ],
  solution: solutionFor(p),
  solver: solverFor(p),
  tags: ['number theory', 'last digit', 'cycles']
});

const params = (): Params[] =>
  keepFair(
    SETS.map((terms) => ({ terms })),
    build
  ).filter((p) => answerFor(p) !== 0);

export const lastDigitPowers = defineFamily<Params>({
  id: 'math/last-digit-powers',
  area: 'math',
  slot: 'daily',
  params,
  key: ({ terms }) => terms.map(([b, e]) => `${b}p${e}`).join('-'),
  build
});
