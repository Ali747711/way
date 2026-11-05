import { isText, randomText } from './helpers';
import { oracle } from './luhn-check.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function passesLuhn(digits) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}`;

/** Sum used to build a number that passes: try each last digit until the sum fits. */
const luhnSum = (digits: string): number =>
  [...digits].reverse().reduce((sum, ch, i) => {
    const d = Number(ch) * (i % 2 === 1 ? 2 : 1);
    return sum + (d > 9 ? d - 9 : d);
  }, 0);

const withCheckDigit = (body: string): string => {
  for (let last = 0; last < 10; last++) {
    const candidate = `${body}${last}`;
    if (luhnSum(candidate) % 10 === 0) return candidate;
  }
  throw new Error('no check digit found');
};

export const luhnCheck = defineSingleCodeFamily({
  id: 'code/luhn-check',
  difficulty: 3,
  title: 'Does the check digit fit?',
  task: 'Many card and ID numbers end in a check digit, so a typing slip can be caught. One common rule works like this. Start at the **rightmost** digit and move left. Keep the rightmost digit as it is, **double** the next one, keep the next, double the next, and so on. If a doubled digit is more than 9, subtract 9 from it. Add up all the values you now have, doubled or not. The number is valid when the total is a multiple of 10.\n\nWrite `passesLuhn(digits)` that takes a string of 2 to 19 digit characters and returns `true` if it is valid by this rule and `false` if not.',
  oracle,
  inDomain: ([digits]) => isText(digits, /^[0-9]{2,19}$/),
  entry: 'passesLuhn',
  params: 'digits',
  reference: REFERENCE,
  examples: [['79927398713'], ['79927398710']],
  tests: (rng) => [
    ['00'],
    ['18'],
    ['59'],
    ['91'],
    ['0000000000'],
    ['4111111111111111'],
    ['4111111111111112'],
    ...Array.from({ length: 4 }, () => [
      withCheckDigit(randomText(rng, '0123456789', 1, 18))
    ]),
    ...Array.from({ length: 3 }, () => [randomText(rng, '0123456789', 2, 19)])
  ],
  hints: [
    'Which end of the string do you count from when you decide which digits to double?',
    'Can you walk from the last character to the first and flip a true/false switch each step, so every second digit is doubled?',
    'A doubled digit can reach 18. What simple adjustment keeps it to a single digit, and what do you test about the final sum?'
  ],
  approach:
    'Walk the digits from right to left with a switch that alternates. Double the digit when the switch is on, subtract 9 if the result is over 9, add to a running total, and finally check that the total is divisible by 10.',
  notes:
    'Counting from the left is the common mistake: the doubling pattern depends on the *right* end, so it changes with the length of the number. Subtracting 9 from a doubled digit equals adding its two digits (`16` becomes `1 + 6 = 7`, and `16 - 9 = 7`). This rule is the Luhn check.',
  tags: ['strings', 'loops', 'checksums']
});
