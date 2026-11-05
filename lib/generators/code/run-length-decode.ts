import { isText, many } from './helpers';
import { oracle } from './run-length-decode.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function unpackRuns(s) {
  let result = '';
  let count = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      count = count * 10 + Number(ch);
    } else {
      result += ch.repeat(count);
      count = 0;
    }
  }
  return result;
}`;

export const runLengthDecode = defineSingleCodeFamily({
  id: 'code/run-length-decode',
  difficulty: 3,
  title: 'Unpack the runs',
  task: 'A packed string stores repeated letters as a count followed by the letter: `3a2b` means `aaabb`. Counts can have more than one digit, so `12x` means the letter `x` twelve times.\n\nWrite `unpackRuns(s)` that takes a packed string and returns the full string. The input is made of zero or more runs. Each run is a count from 1 to 99 (no leading zeros) followed by one lowercase letter. Two neighbouring runs may use the same letter: `2a3a` unpacks to `aaaaa`. An empty input returns an empty string.',
  oracle,
  inDomain: ([s]) => isText(s, /^(?:[1-9][0-9]?[a-z])*$/),
  entry: 'unpackRuns',
  params: 's',
  reference: REFERENCE,
  examples: [['3a2b'], ['12x1y']],
  tests: (rng) => [
    [''],
    ['1a'],
    ['2a3a'],
    ['10z'],
    ['99q'],
    ['1a1b1c1d'],
    ['9c10c'],
    ...many(5, () =>
      many(
        rng.int(1, 6),
        () => `${rng.int(1, 30)}${'abcde'[rng.int(0, 4)]}`
      ).join('')
    ).map((s) => [s])
  ],
  hints: [
    'When you meet a digit, you cannot act yet. What do you need to keep track of until the letter arrives?',
    'How do you build up a count like 12 from the characters 1 and 2, one at a time?',
    'After you write out a run, what must you reset so that the next run starts counting from nothing?'
  ],
  approach:
    'Walk through the string once. Digits build up the current count (`count * 10 + digit`); a letter writes itself `count` times and resets the count.',
  notes:
    'Reading only one digit per count is the classic slip: `12x` would become one `x` after a lone `1` and then break. The input always has a count before every letter, so there is no run to guess.',
  tags: ['strings', 'loops', 'parsing']
});
