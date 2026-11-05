import { isText, randomText } from './helpers';
import { oracle } from './longest-run.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function longestRun(text) {
  let best = '';
  let runStart = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || text[i] !== text[runStart]) {
      if (i - runStart > best.length) {
        best = text.slice(runStart, i);
      }
      runStart = i;
    }
  }
  return best;
}`;

export const longestRun = defineSingleCodeFamily({
  id: 'code/longest-run',
  difficulty: 3,
  title: 'The longest streak',
  task: 'A *run* is a stretch of identical characters sitting next to each other. In `"aabbbcc"` the runs are `aa`, `bbb` and `cc`.\n\nWrite `longestRun(text)` that takes a string of 0 to 40 lowercase letters and returns its longest run as a string. If two runs are equally long, return the one that starts first. An empty string returns an empty string.',
  oracle,
  inDomain: ([text]) => isText(text, /^[a-z]{0,40}$/),
  entry: 'longestRun',
  params: 'text',
  reference: REFERENCE,
  examples: [['aabbbcc'], ['abcd']],
  tests: (rng) => [
    [''],
    ['z'],
    ['aabb'],
    ['abbbaaa'],
    ['xxxxxx'],
    ['abababab'],
    ['cbaaa'],
    ...Array.from({ length: 5 }, () => [randomText(rng, 'abc', 1, 30)])
  ],
  hints: [
    'How can you tell that the character at position i continues the run that began earlier, and when does a new run start?',
    'Can you remember just where the current run started, and compare its length with the best length so far each time it ends?',
    'If two runs tie, should the later one replace the earlier one, or only a strictly longer one?'
  ],
  approach:
    'Remember where the current run began. When the next character differs (or the string ends), the run is over: compare its length with the best so far and start a new run.',
  notes:
    'Using `>` instead of `>=` when comparing lengths keeps the earliest run on ties. Handling the end of the string inside the same loop (index `text.length`) avoids a forgotten last run.',
  tags: ['strings', 'loops', 'edge-cases']
});
