import { isText, randomText } from './helpers';
import { oracle } from './longest-unique.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function longestUnique(text) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < text.length; i++) {
    const at = lastSeen.get(text[i]);
    if (at !== undefined && at >= start) {
      start = at + 1;
    }
    lastSeen.set(text[i], i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`;

export const longestUnique = defineSingleCodeFamily({
  id: 'code/longest-unique',
  difficulty: 4,
  title: 'No repeats allowed',
  task: 'A *stretch* of a string is a piece of consecutive characters. You want the longest stretch in which no character appears twice. In `"abcabcbb"` the stretch `"abc"` works (length 3), and nothing longer does.\n\nWrite `longestUnique(text)` that takes a string of 0 to 40 characters (letters, digits and spaces; a space counts as a character, and capital and small letters are different) and returns the **length** of the longest stretch with no repeated character. An empty string returns `0`.',
  oracle,
  inDomain: ([text]) => isText(text, /^[A-Za-z0-9 ]{0,40}$/),
  entry: 'longestUnique',
  params: 'text',
  reference: REFERENCE,
  examples: [['abcabcbb'], ['aaaa']],
  tests: (rng) => [
    [''],
    ['z'],
    ['ab'],
    ['aa'],
    ['abba'],
    ['abcdef'],
    ['Aa Aa'],
    ['dvdf'],
    ...Array.from({ length: 5 }, () => [randomText(rng, 'abcdeABC 12', 1, 30)])
  ],
  hints: [
    'How can you check, for a given stretch, that it has no repeated character?',
    'Could you keep a window with a left edge and a right edge, moving the right edge forward one character at a time?',
    'When the new character is already inside the window, how far must the left edge move so the window is clean again?'
  ],
  approach:
    'Slide a window across the string. Remember the last position of every character. When the next character already appears inside the window, move the left edge just past that earlier copy. After each step, the window length is a candidate for the best.',
  notes:
    'The left edge must never move backwards: in `"abba"`, the second `a` was last seen at 0, which is already outside the window, so it must not pull the edge back. Trying every stretch with a set also works for short strings, but is much slower for long ones.',
  tags: ['strings', 'two-pointers', 'sliding-window']
});
