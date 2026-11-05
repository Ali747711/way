import { isIntIn, isText } from './helpers';
import { oracle } from './top-words.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function topWords(text, k) {
  const counts = new Map();
  for (const word of text.split(' ')) {
    if (word !== '') counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.keys()]
    .sort((a, b) => counts.get(b) - counts.get(a) || (a < b ? -1 : 1))
    .slice(0, k);
}`;

const POOL = ['sun', 'moon', 'star', 'cloud', 'rain', 'wind', 'snow', 'fog'];

export const topWords = defineSingleCodeFamily({
  id: 'code/top-words',
  difficulty: 4,
  title: 'The most-used words',
  task: 'A weather diary is a text of lowercase words separated by single spaces. You want the words that appear most often.\n\nWrite `topWords(text, k)` that takes a string `text` (0 to 40 words, no leading, trailing or double spaces; an empty string has no words) and a whole number `k` from 1 to 10, and returns an array of the `k` most frequent words, most frequent first. If two words appear equally often, the one that comes first in alphabetical order goes first. If the text has fewer than `k` different words, return all of them.',
  oracle,
  inDomain: ([text, k]) =>
    isText(text, /^(?:[a-z]+(?: [a-z]+)*)?$/) &&
    (text as string).split(' ').length <= 40 &&
    isIntIn(k, 1, 10),
  entry: 'topWords',
  params: 'text, k',
  reference: REFERENCE,
  examples: [
    ['rain sun rain fog sun rain', 2],
    ['b a c', 5]
  ],
  tests: (rng) => [
    ['', 3],
    ['solo', 1],
    ['b a', 1],
    ['b b a a c', 2],
    ['x y z x y z x', 3],
    ['one two three four', 2],
    ['snow snow snow', 4],
    ...Array.from({ length: 5 }, () => [
      Array.from({ length: rng.int(1, 25) }, () => rng.pick(POOL)).join(' '),
      rng.int(1, 6)
    ])
  ],
  hints: [
    'What do you need to count, and which structure lets you look up a word and add one to its count?',
    'Once every word has a count, how do you order the different words so that bigger counts come first?',
    'When two counts are equal, what second rule must the ordering use, and what do you do with the empty string?'
  ],
  approach:
    'Count each word in a map. Then sort the distinct words by count (largest first), breaking ties alphabetically, and take the first `k`.',
  notes:
    'Sorting with two rules in one comparison, `countDifference || alphabeticalOrder`, works because the second part only runs when the counts tie. Splitting an empty string gives `[""]`, so skip empty pieces or the "word" `""` will be counted.',
  tags: ['strings', 'counting', 'sorting']
});
