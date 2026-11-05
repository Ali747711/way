import { isIntIn, isText, randomText } from './helpers';
import { oracle } from './caesar-shift.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function shiftText(text, k) {
  const shift = ((k % 26) + 26) % 26;
  let result = '';
  for (const ch of text) {
    if (ch >= 'a' && ch <= 'z') {
      result += String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26) + 97);
    } else if (ch >= 'A' && ch <= 'Z') {
      result += String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
    } else {
      result += ch;
    }
  }
  return result;
}`;

const MIXED =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ  0123456789.,!?-';

export const caesarShift = defineSingleCodeFamily({
  id: 'code/caesar-shift',
  difficulty: 3,
  title: 'Slide the alphabet',
  task: 'A *shift cipher* moves every letter `k` places along the alphabet and wraps around: with `k = 1`, `y` becomes `z` and `z` becomes `a`. Capital letters stay capital and small letters stay small. Every other character (spaces, digits, punctuation) stays exactly as it is.\n\nWrite `shiftText(text, k)` that takes a string `text` of 0 to 60 printable ASCII characters and a whole number `k` from -100 to 100, and returns the shifted string. A negative `k` moves letters backwards, so `k = -1` turns `b` into `a` and `a` into `z`.',
  oracle,
  inDomain: ([text, k]) =>
    isText(text, /^[ -~]{0,60}$/) && isIntIn(k, -100, 100),
  entry: 'shiftText',
  params: 'text, k',
  reference: REFERENCE,
  examples: [
    ['Hello, World!', 3],
    ['xyz 123', -3]
  ],
  tests: (rng) => [
    ['', 5],
    ['abc', 0],
    ['abc', 26],
    ['abc', -26],
    ['Zz', 1],
    ['a', -1],
    ['Way 2 go!', 100],
    ['Way 2 go!', -100],
    ...Array.from({ length: 5 }, () => [
      randomText(rng, MIXED, 1, 40),
      rng.int(-100, 100)
    ])
  ],
  hints: [
    'If you number the letters 0 to 25, what number does the shifted letter get, and what happens when that number goes past 25?',
    'How can the remainder operator bring any k, even a negative one or one bigger than 26, into the range 0 to 25?',
    'Capital and small letters start at different character codes. How will your code know which start to use, and when to leave a character alone?'
  ],
  approach:
    'Turn each letter into a number from 0 to 25, add the shift, wrap with `% 26`, and turn it back. Anything that is not a letter is copied over unchanged.',
  notes:
    'In JavaScript `-3 % 26` is `-3`, not `23`, so the line `((k % 26) + 26) % 26` is what makes negative shifts work. A shift of 26 (or -26) changes nothing, which is a quick check for your wrap-around.',
  tags: ['strings', 'loops']
});
