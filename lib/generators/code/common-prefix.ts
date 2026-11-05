import { isListOf, isText, many, randomText } from './helpers';
import { oracle } from './common-prefix.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function commonPrefix(words) {
  if (words.length === 0) return '';
  const first = words[0];
  for (let i = 0; i < first.length; i++) {
    for (const word of words) {
      if (word[i] !== first[i]) {
        return first.slice(0, i);
      }
    }
  }
  return first;
}`;

export const commonPrefix = defineSingleCodeFamily({
  id: 'code/common-prefix',
  difficulty: 3,
  title: 'How all the words begin',
  task: 'The *common prefix* of some words is the longest string that every one of them starts with. For `["flower", "flow", "flight"]` it is `"fl"`.\n\nWrite `commonPrefix(words)` that takes an array of 0 to 8 lowercase words (each 0 to 12 letters, and a word may be the empty string) and returns their common prefix. If the words share nothing, or the array is empty, return an empty string. A word that is the whole prefix counts: the common prefix of `["car", "cart"]` is `"car"`.',
  oracle,
  inDomain: ([words]) => isListOf(words, 8, (w) => isText(w, /^[a-z]{0,12}$/)),
  entry: 'commonPrefix',
  params: 'words',
  reference: REFERENCE,
  examples: [[['flower', 'flow', 'flight']], [['dog', 'cat']]],
  tests: (rng) => [
    [[]],
    [['alone']],
    [['car', 'cart']],
    [['cart', 'car']],
    [['same', 'same', 'same']],
    [['', 'abc']],
    [['abc', '', 'abd']],
    ...Array.from({ length: 5 }, () => {
      const prefix = randomText(rng, 'abc', 0, 4);
      return [many(rng.int(1, 5), () => prefix + randomText(rng, 'abc', 0, 5))];
    })
  ],
  hints: [
    'What should you return for an empty array, and for a single word?',
    'Could you compare the words letter by letter, one column at a time, and stop at the first column where they disagree?',
    'What if one word is shorter than the others, so a column has no letter at all for it?'
  ],
  approach:
    'Take the first word as the candidate. For each position in it, check that every word has the same letter there. At the first mismatch, return the part before that position.',
  notes:
    'Reading past the end of a short word gives `undefined`, which never equals a real letter, so a short word stops the scan by itself. If the loop finishes without a mismatch, the whole first word is the prefix.',
  tags: ['strings', 'loops', 'edge-cases']
});
