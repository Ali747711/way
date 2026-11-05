import { isText, randomText } from './helpers';
import { oracle } from './interleaving.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function isInterleaving(a, b, c) {
  if (a.length + b.length !== c.length) return false;
  // ok[i][j]: the first i letters of a and first j letters of b can make the first i + j letters of c.
  const ok = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(false)
  );
  ok[0][0] = true;
  for (let i = 0; i <= a.length; i++) {
    for (let j = 0; j <= b.length; j++) {
      if (i > 0 && ok[i - 1][j] && a[i - 1] === c[i + j - 1]) ok[i][j] = true;
      if (j > 0 && ok[i][j - 1] && b[j - 1] === c[i + j - 1]) ok[i][j] = true;
    }
  }
  return ok[a.length][b.length];
}`;

export const interleaving = defineSingleCodeFamily({
  id: 'code/interleaving',
  difficulty: 4,
  title: 'Shuffled together',
  task: 'Two strings are *shuffled together* like two halves of a deck of cards: you take letters from one or the other, but each string keeps its own letters in their original order. `"axbyc"` is made by shuffling `"abc"` and `"xy"` together, but `"ayxbc"` is not, because `y` would come before `x`.\n\nWrite `isInterleaving(a, b, c)` that takes three strings of lowercase letters, `a` and `b` with 0 to 8 letters each and `c` with 0 to 16, and returns `true` if `c` can be made by shuffling `a` and `b` together, using every letter of both exactly once. Otherwise return `false`.',
  oracle,
  inDomain: ([a, b, c]) =>
    isText(a, /^[a-z]{0,8}$/) &&
    isText(b, /^[a-z]{0,8}$/) &&
    isText(c, /^[a-z]{0,16}$/),
  entry: 'isInterleaving',
  params: 'a, b, c',
  reference: REFERENCE,
  examples: [
    ['abc', 'xy', 'axbyc'],
    ['ab', 'cd', 'adbc']
  ],
  tests: (rng) => {
    const shuffled = (): [string, string, string] => {
      const a = randomText(rng, 'ab', 0, 6);
      const b = randomText(rng, 'ab', 0, 6);
      let [i, j, c] = [0, 0, ''];
      while (i < a.length || j < b.length) {
        const takeA = j === b.length || (i < a.length && rng.next() < 0.5);
        c += takeA ? a[i++] : b[j++];
      }
      return [a, b, c];
    };
    const [a1, b1, c1] = shuffled();
    const [a2, b2, c2] = shuffled();
    const [a3, b3, c3] = shuffled();
    return [
      ['', '', ''],
      ['', 'ab', 'ab'],
      ['ab', '', 'ba'],
      ['a', 'b', 'ab'],
      ['ab', 'ac', 'acab'],
      ['abc', 'def', 'abcde'],
      [a1, b1, c1],
      [a2, b2, c2],
      [a3, b3, [...c3].reverse().join('')],
      [a3, b3, c3.slice(0, -1) + (c3.endsWith('a') ? 'b' : 'a')]
    ];
  },
  hints: [
    'Before anything else, what must be true about the lengths of the three strings?',
    'Look at the first letter of `c`. Which strings could it have come from, and what is left to check once you decide?',
    'Can you describe a state by two numbers, how many letters of `a` and of `b` are used so far, and note which states are reachable?'
  ],
  approach:
    'Let `ok[i][j]` mean "the first `i` letters of `a` and the first `j` letters of `b` can be shuffled into the first `i + j` letters of `c`". A state is reachable if the last letter used matches `c` and the state before it was reachable. The answer is `ok[a.length][b.length]`.',
  notes:
    'A greedy rule that takes from `a` whenever the letters match fails: with `a = "ab"`, `b = "ac"` and `c = "acab"`, both strings start with `a`, and only taking it from `b` first works. That is why you must keep every possible state, not one path.',
  tags: ['strings', 'dynamic-programming']
});
