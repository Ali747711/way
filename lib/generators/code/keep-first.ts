import { isListOf, isText, randomText } from './helpers';
import { oracle } from './keep-first.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function keepFirst(names) {
  const seen = new Set();
  const result = [];
  for (const name of names) {
    if (!seen.has(name)) {
      seen.add(name);
      result.push(name);
    }
  }
  return result;
}`;

export const keepFirst = defineSingleCodeFamily({
  id: 'code/keep-first',
  difficulty: 3,
  title: 'First come, first kept',
  task: 'A guest list has some names written down twice. Keep only the **first** time each name appears and drop every later copy, without changing the order of the names that stay.\n\nWrite `keepFirst(names)` that takes an array of 0 to 30 strings (each 1 to 3 lowercase letters) and returns a new array with every repeated string removed except its first appearance. Two strings are the same only if they are exactly equal. The input array must not be changed.',
  oracle,
  inDomain: ([names]) => isListOf(names, 30, (n) => isText(n, /^[a-z]{1,3}$/)),
  entry: 'keepFirst',
  params: 'names',
  reference: REFERENCE,
  examples: [[['bo', 'al', 'bo', 'cy', 'al']], [['x', 'y']]],
  tests: (rng) => [
    [[]],
    [['a']],
    [['a', 'a', 'a']],
    [['ab', 'a', 'b', 'ab', 'a']],
    [['c', 'b', 'a', 'a', 'b', 'c']],
    [['z', 'y', 'x']],
    ...Array.from({ length: 5 }, () => [
      Array.from({ length: rng.int(1, 20) }, () => randomText(rng, 'abc', 1, 2))
    ])
  ],
  hints: [
    'As you walk through the list, what do you need to remember about the names you have already met?',
    'Which tool can answer "have I seen this one before?" quickly, without scanning the whole result each time?',
    'When you meet a name for the second time, should you add it to the result, and should it change what you remember?'
  ],
  approach:
    'Walk through the names once, keeping a set of names already seen. Add a name to the result only if it is not in the set yet, and put it in the set.',
  notes:
    'In JavaScript a `Set` also keeps insertion order, so `[...new Set(names)]` is a correct one-liner; the loop shows what it does. Strings such as `"ab"` and `"a"` are different values, so only exact matches are dropped.',
  tags: ['arrays', 'sets', 'loops']
});
