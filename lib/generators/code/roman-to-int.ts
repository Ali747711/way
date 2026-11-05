import { isText } from './helpers';
import { oracle } from './roman-to-int.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function romanToInt(numeral) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < numeral.length; i++) {
    const value = values[numeral[i]];
    const next = values[numeral[i + 1]] ?? 0;
    total += value < next ? -value : value;
  }
  return total;
}`;

const TABLE: readonly (readonly [number, string])[] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
];

/** Writes a number from 1 to 3999 as a standard Roman numeral (used to make test inputs). */
const toRoman = (n: number): string => {
  let rest = n;
  let out = '';
  for (const [value, symbol] of TABLE) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
};

export const romanToInt = defineSingleCodeFamily({
  id: 'code/roman-to-int',
  difficulty: 3,
  title: 'Read the old numerals',
  task: 'Roman numerals use the letters `I` (1), `V` (5), `X` (10), `L` (50), `C` (100), `D` (500) and `M` (1000). Letters are normally added from left to right, so `XVI` is 10 + 5 + 1 = 16. But when a smaller letter comes right before a bigger one, it is subtracted instead: `IV` is 4 and `XC` is 90.\n\nWrite `romanToInt(numeral)` that takes a valid Roman numeral in capital letters, written in the standard way, for any whole number from 1 to 3999, and returns its value as a number. You do not need to handle invalid numerals.',
  oracle,
  inDomain: ([numeral]) =>
    isText(
      numeral,
      /^(?=.)M{0,3}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})$/
    ),
  entry: 'romanToInt',
  params: 'numeral',
  reference: REFERENCE,
  examples: [['XVI'], ['XLIX']],
  tests: (rng) => [
    ['I'],
    ['IV'],
    ['IX'],
    ['MCMXCIV'],
    ['MMMCMXCIX'],
    ['MMXXVI'],
    ['DCCCXC'],
    ...Array.from({ length: 5 }, () => [toRoman(rng.int(1, 3999))])
  ],
  hints: [
    'What do you need to compare, as you look at each letter, to know whether it is added or subtracted?',
    'Could you look one letter ahead, and subtract the current value when the next letter is worth more?',
    'What should "the next letter" be when you are standing on the last letter of the numeral?'
  ],
  approach:
    'Read left to right. Add each letter, but subtract it instead when the letter after it is worth more. The last letter is always added.',
  notes:
    'The `?? 0` makes the missing letter after the end count as nothing, so the last letter is added without a special case. This works because standard numerals only subtract one letter before a bigger one, never a long chain.',
  tags: ['strings', 'loops', 'lookup']
});
