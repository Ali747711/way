import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer, sup } from './shared';

type Mode = 'factorial' | 'smallest' | 'evens' | 'fives';

interface Params {
  mode: Mode;
  /** The factorial size, the number of zeros, or half the last even number. */
  n: number;
}

const SIZES: Record<Mode, readonly number[]> = {
  factorial: [55, 65, 80, 90, 120, 130, 150, 180, 200],
  smallest: [7, 9, 10, 12, 13, 14, 15, 16, 19, 21, 24, 26],
  evens: [20, 30, 35, 40, 45, 60],
  fives: [10, 16, 20, 25, 30, 40]
};

/** Number of factors of p in n!, by counting multiples of p, p², p³... */
const factorsOf = (p: number, n: number): number => {
  let count = 0;
  for (let power = p; power <= n; power *= p) count += Math.floor(n / power);
  return count;
};

const zerosOfFactorial = (n: number): number => factorsOf(5, n);

const smallestFor = (zeros: number): number | null => {
  for (let m = 5; m <= 5000; m += 5) {
    const z = zerosOfFactorial(m);
    if (z === zeros) return m;
    if (z > zeros) return null;
  }
  return null;
};

export const answerFor = ({ mode, n }: Params): number => {
  switch (mode) {
    case 'factorial':
      return zerosOfFactorial(n);
    case 'smallest': {
      const found = smallestFor(n);
      if (found === null)
        throw new Error(`no factorial ends in exactly ${n} zeros`);
      return found;
    }
    case 'evens':
      // 2 × 4 × ... × 2n = 2^n × n!: plenty of 2s, so the 5s decide.
      return Math.min(n + factorsOf(2, n), factorsOf(5, n));
    case 'fives':
      // 5 × 10 × ... × 5n = 5^n × n!: plenty of 5s, so the 2s decide.
      return Math.min(factorsOf(2, n), n + factorsOf(5, n));
  }
};

const fivesIn = (n: number, label: string): string => {
  const parts: string[] = [];
  const terms: number[] = [];
  for (let power = 5; power <= n; power *= 5) {
    const c = Math.floor(n / power);
    terms.push(c);
    parts.push(
      power === 5
        ? `each of the ${c} multiples of 5 gives one five`
        : `the ${c} multiple${c === 1 ? '' : 's'} of ${power} give${c === 1 ? 's' : ''} one more each`
    );
  }
  const list =
    parts.length === 1
      ? parts[0]
      : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
  const total = terms.reduce((x, y) => x + y, 0);
  return `Count the factors of 5 in ${label}: ${list}, so ${terms.join(' + ')} = ${total}.`;
};

const solutionFor = (p: Params): string => {
  const { mode, n } = p;
  const answer = answerFor(p);
  if (mode === 'factorial') {
    return `**${answer}.**\n\nA trailing zero comes from a factor of 10 = 2 × 5. In ${n}! there are far more 2s than 5s, so the number of 5s sets the limit.\n\n${fivesIn(n, `${n}!`)}\n\nSo ${n}! ends in **${answer}** zeros.\n\nThe common slip is counting only the multiples of 5, which gives ${Math.floor(n / 5)}, and forgetting that 25 and 50 each hide a second 5.`;
  }
  if (mode === 'smallest') {
    const guess = 5 * n;
    return `**${answer}.**\n\nThe number of trailing zeros of m! is the number of factors of 5 in it, and that count goes up only when m reaches a multiple of 5, so the answer is a multiple of 5.\n\nTry m = ${answer}. ${fivesIn(answer, `${answer}!`)} So ${answer}! ends in exactly ${n} zeros. One multiple of 5 earlier, ${answer - 5}!, has ${zerosOfFactorial(answer - 5)}, which is too few. So the smallest is **${answer}**.\n\nThe common slip is answering 5 × ${n} = ${guess}. That works only while no multiple of 25 has appeared, and here ${guess}! has ${zerosOfFactorial(guess)} zeros, ${zerosOfFactorial(guess) - n} too many.`;
  }
  if (mode === 'evens') {
    return `**${answer}.**\n\nWrite every even number as 2 × something: 2 × 4 × 6 × … × ${2 * n} = (2 × 1)(2 × 2)…(2 × ${n}) = 2${sup(n)} × ${n}!.\n\nA trailing zero needs a 2 and a 5. The product has at least ${n} twos from the 2${sup(n)} alone, and ${n}! has plenty more, while the fives come only from ${n}!. So the fives decide.\n\n${fivesIn(n, `${n}!`)}\n\nThe product ends in **${answer}** zeros.\n\nThe common slip is counting the multiples of 5 from 1 to ${2 * n}, which gives ${Math.floor((2 * n) / 5)}, but the odd ones, such as 5 and 15, are not in the product.`;
  }
  const twos = factorsOf(2, n);
  return `**${answer}.**\n\nWrite every multiple of 5 as 5 × something: 5 × 10 × 15 × … × ${5 * n} = (5 × 1)(5 × 2)…(5 × ${n}) = 5${sup(n)} × ${n}!.\n\nA trailing zero needs a 2 and a 5. Now the fives are plentiful, since 5${sup(n)} alone gives ${n} of them, and the twos are scarce: they come only from ${n}!. So the twos decide.\n\nCount the factors of 2 in ${n}!: ${n} ÷ 2, ${n} ÷ 4, ${n} ÷ 8 and so on, rounded down, add up to ${twos}.\n\nThe product ends in **${answer}** zeros.\n\nThe common slip is to use the 5s as the limit, as for a factorial. Here the 5s are the plentiful ones.`;
};

const solverFor = ({ mode, n }: Params): string => {
  const zeros = [
    'const zerosOf = (value) => {',
    '  let count = 0;',
    '  while (value % 10n === 0n) {',
    '    value /= 10n;',
    '    count++;',
    '  }',
    '  return count;',
    '};'
  ];
  if (mode === 'factorial') {
    return [
      ...zeros,
      'let product = 1n;',
      `for (let i = 2n; i <= ${n}n; i++) product *= i;`,
      'return zerosOf(product);'
    ].join('\n');
  }
  if (mode === 'smallest') {
    return [
      ...zeros,
      'let product = 1n;',
      'for (let m = 1n; m <= 2000n; m++) {',
      '  product *= m;',
      `  if (zerosOf(product) === ${n}) return Number(m);`,
      '}',
      'return NaN;'
    ].join('\n');
  }
  const step = mode === 'evens' ? 2 : 5;
  return [
    ...zeros,
    'let product = 1n;',
    `for (let i = 1n; i <= ${n}n; i++) product *= ${step}n * i;`,
    'return zerosOf(product);'
  ].join('\n');
};

const FACTORIAL_STORIES = [
  ({ n }: Params) => ({
    title: 'Zeros at the end of a factorial',
    text: `The number ${n}! is the product 1 × 2 × 3 × … × ${n}.\n\nHow many zeros does ${n}! have at its right-hand end?`
  }),
  ({ n }: Params) => ({
    title: 'A very long product',
    text: `Multiply together every whole number from 1 to ${n}. The result is written out in full.\n\nHow many zeros are at the end of that number?`
  }),
  ({ n }: Params) => ({
    title: 'Counting the tail zeros',
    text: `Let P be the product of all the whole numbers from 1 up to ${n}.\n\nWhen P is written in ordinary digits, how many zeros come at the very end?`
  })
];

const SMALLEST_STORIES = [
  ({ n }: Params) => ({
    title: 'The first factorial with enough zeros',
    text: `The number m! is the product 1 × 2 × 3 × … × m. For some values of m, m! ends in exactly ${n} zeros.\n\nWhat is the smallest such m?`
  }),
  ({ n }: Params) => ({
    title: 'Reaching the zeros',
    text: `A factorial m! (the product of all whole numbers from 1 to m) is written out and ends in exactly ${n} zeros.\n\nWhat is the smallest whole number m for which this happens?`
  })
];

const EVENS_STORIES = [
  ({ n }: Params) => ({
    title: 'Zeros in a product of evens',
    text: `Multiply all the even numbers from 2 to ${2 * n}: 2 × 4 × 6 × … × ${2 * n}.\n\nHow many zeros does the product have at its right-hand end?`
  }),
  ({ n }: Params) => ({
    title: 'Only the even numbers',
    text: `Let E be the product of every even number from 2 up to ${2 * n}.\n\nHow many zeros are at the end of E?`
  })
];

const FIVES_STORIES = [
  ({ n }: Params) => ({
    title: 'Zeros in the five times table',
    text: `Multiply the first ${n} multiples of 5 together: 5 × 10 × 15 × … × ${5 * n}.\n\nHow many zeros does the product have at its right-hand end?`
  }),
  ({ n }: Params) => ({
    title: 'A product of fives',
    text: `Let F be the product 5 × 10 × 15 × … × ${5 * n}, the first ${n} multiples of 5.\n\nHow many zeros come at the end of F?`
  })
];

const STORIES = {
  factorial: FACTORIAL_STORIES,
  smallest: SMALLEST_STORIES,
  evens: EVENS_STORIES,
  fives: FIVES_STORIES
} as const;

const HINTS: Record<Mode, string[]> = {
  factorial: [
    'A zero at the end of a number comes from a factor of 10: which two prime factors make a 10?',
    'In a long product like this, which of those two primes is scarcer, so that it limits the number of tens?',
    'How many of the numbers are multiples of 5, how many are multiples of 25, and so on, and how do you add those up?'
  ],
  smallest: [
    'A zero at the end of a number comes from a factor of 10: which prime factor of 10 is the scarce one in a factorial?',
    'How does the number of fives in m! change as m grows by one at a time? When does it first go up?',
    'Is it enough to multiply the number of zeros by 5, or do multiples of 25 change the count?'
  ],
  evens: [
    'What do you get if you take a 2 out of every even number in the product?',
    'After doing that, which of the two primes 2 and 5 is scarce and which is plentiful?',
    'How many factors of the scarce prime are there altogether, counting multiples of 5, of 25 and so on?'
  ],
  fives: [
    'What do you get if you take a 5 out of every multiple of 5 in the product?',
    'After doing that, which of the two primes 2 and 5 is scarce and which is plentiful?',
    'How many factors of the scarce prime are there altogether, counting multiples of 2, of 4 and so on?'
  ]
};

const build = (p: Params, rng: Rng) => {
  const story = rng.pick<(q: Params) => { title: string; text: string }>(
    STORIES[p.mode]
  )(p);
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: HINTS[p.mode],
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['number theory', 'factorials', 'prime factors']
  };
};

const params = (): Params[] =>
  keepFair(
    (Object.keys(SIZES) as Mode[])
      .flatMap((mode) => SIZES[mode].map((n) => ({ mode, n })))
      .filter((p) => p.mode !== 'smallest' || smallestFor(p.n) !== null),
    build
  );

export const trailingZeros = defineFamily<Params>({
  id: 'math/trailing-zeros',
  area: 'math',
  slot: 'daily',
  group: (p) => p.mode,
  params,
  key: ({ mode, n }) => `${mode}-${n}`,
  build
});
