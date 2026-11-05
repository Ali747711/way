import { defineCodeFamily } from './define';
import { isIntIn } from './helpers';

type Op = 'multiply' | 'add';

// Independent oracle: recursion over digit arrays, unlike the loop reference.
export const oracle = (op: string, n: number): number => {
  if (n < 10) return 0;
  const digits = String(n).split('').map(Number);
  const next =
    op === 'multiply'
      ? digits.reduce((a, d) => a * d, 1)
      : digits.reduce((a, d) => a + d, 0);
  return 1 + oracle(op, next);
};

const NAMES: Record<Op, string> = { multiply: 'multiplyDown', add: 'addDown' };

export const digitPersistence = defineCodeFamily<Op>({
  id: 'code/digit-persistence',
  difficulty: 3,
  variants: ['multiply', 'add'],
  key: (op) => op,
  title: (op) =>
    op === 'multiply' ? 'Multiply until one digit' : 'Add until one digit',
  task: (op) => {
    const verb = op === 'multiply' ? 'Multiply' : 'Add';
    const sample =
      op === 'multiply'
        ? '`39` becomes 3 × 9 = `27`, then 2 × 7 = `14`, then 1 × 4 = `4`: three steps.'
        : '`199` becomes 1 + 9 + 9 = `19`, then 1 + 9 = `10`, then 1 + 0 = `1`: three steps.';
    return `${verb} the digits of a whole number together, then do the same to the result, and keep going until only one digit is left. ${sample}\n\nWrite \`${NAMES[op]}(n)\` that takes a whole number \`n\` from 0 up to 10¹⁵ and returns how many steps it takes. A number that already has one digit takes 0 steps.`;
  },
  oracle: (op, [n]) => oracle(op, n as number),
  inDomain: (_, [n]) => isIntIn(n, 0, 10 ** 15),
  entry: (op) => NAMES[op],
  params: () => 'n',
  reference: (op) =>
    [
      `function ${NAMES[op]}(n) {`,
      '  let steps = 0;',
      '  while (n >= 10) {',
      `    let next = ${op === 'multiply' ? 1 : 0};`,
      `    for (const digit of String(n)) next ${op === 'multiply' ? '*' : '+'}= Number(digit);`,
      '    n = next;',
      '    steps++;',
      '  }',
      '  return steps;',
      '}'
    ].join('\n'),
  examples: (op) => (op === 'multiply' ? [[39], [4]] : [[199], [7]]),
  tests: (op, rng) => [
    [0],
    [9],
    [10],
    [25],
    [999],
    op === 'multiply' ? [277777788888899] : [999999999999999],
    ...Array.from({ length: 5 }, () => [rng.int(11, 999999)])
  ],
  hints: (op) => [
    'What should your function return for a number that already has a single digit?',
    'How can you get at the digits of a number one by one, with % 10 or by turning it into a string?',
    `Can you wrap the "${op} the digits" step in a loop that counts each pass until the number drops below 10?`
  ],
  approach: () =>
    'Repeat one step while the number has two or more digits, and count how many times you repeat it.',
  notes: (op) =>
    op === 'multiply'
      ? 'Checking `n >= 10` before the first step makes single digits return 0 without a special case. Any number containing a 0 collapses to 0 in one step. The smallest number that needs 11 steps is `277777788888899`, and no number needing 12 has ever been found.'
      : 'Checking `n >= 10` before the first step makes single digits return 0 without a special case. Adding shrinks numbers fast: even a 15-digit number needs at most three steps, and the final digit is the old trick of "casting out nines".',
  tags: ['loops', 'digits']
});
