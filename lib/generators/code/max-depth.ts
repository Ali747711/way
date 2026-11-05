import { randomText } from './helpers';
import { oracle } from './max-depth.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function maxDepth(text) {
  let depth = 0;
  let deepest = 0;
  for (const ch of text) {
    if (ch === '(') {
      depth++;
      deepest = Math.max(deepest, depth);
    } else if (ch === ')') {
      depth--;
      if (depth < 0) return -1;
    }
  }
  return depth === 0 ? deepest : -1;
}`;

export const maxDepth = defineSingleCodeFamily({
  id: 'code/max-depth',
  difficulty: 3,
  title: 'Brackets inside brackets',
  task: 'Round brackets can sit inside each other, like the sentence `(a (b) (c (d)))`. The *depth* of a spot is how many brackets are open there. The sentence above reaches depth 3, inside the `d`.\n\nWrite `maxDepth(text)` that takes a string of 0 to 40 characters and returns the largest depth reached. Only `(` and `)` count; every other character is ignored. If the brackets are not properly matched (a `)` closes nothing, or a `(` is never closed), return `-1`. A text with no brackets has depth `0`.',
  oracle,
  inDomain: ([text]) => typeof text === 'string' && text.length <= 40,
  entry: 'maxDepth',
  params: 'text',
  reference: REFERENCE,
  examples: [['(a (b) (c (d)))'], ['())(']],
  tests: (rng) => [
    [''],
    ['no brackets'],
    ['()'],
    ['(('],
    [')('],
    ['()()()'],
    ['((()))'],
    ['(a)(b)((c))'],
    ...Array.from({ length: 4 }, () => [randomText(rng, '(()) ab', 1, 14)])
  ],
  hints: [
    'What single number could you update every time you meet a bracket, so that it always says how deep you are right now?',
    'Which bracket makes the number go up, which makes it go down, and what should you record each time it reaches a new high?',
    'Which two situations mean the brackets are not matched, and when can you tell each one?'
  ],
  approach:
    'Keep a running depth: add 1 for `(`, subtract 1 for `)`. Track the highest value reached. A negative depth at any moment, or a non-zero depth at the end, means the brackets do not match.',
  notes:
    'Two different failures give `-1`: closing too early (the depth drops below zero, so stop right away) and never closing (the depth is above zero at the end). The text `")("` has equal numbers of each but is still wrong, which is why counting both is not enough.',
  tags: ['strings', 'loops', 'brackets']
});
