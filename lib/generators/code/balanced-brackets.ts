import { randomText } from './helpers';
import { oracle } from './balanced-brackets.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function isBalanced(text) {
  const closers = { ')': '(', ']': '[', '}': '{' };
  const open = [];
  for (const ch of text) {
    if (ch === '(' || ch === '[' || ch === '{') {
      open.push(ch);
    } else if (ch in closers) {
      if (open.pop() !== closers[ch]) return false;
    }
  }
  return open.length === 0;
}`;

/** Builds a matched string (so true cases are common) from random brackets. */
const matched = (pick: () => number, pairs: number): string => {
  const kinds = ['()', '[]', '{}'];
  const open: string[] = [];
  let out = '';
  let left = pairs;
  while (left > 0 || open.length > 0) {
    if (left > 0 && (open.length === 0 || pick() % 2 === 0)) {
      const kind = kinds[pick() % 3];
      out += kind[0];
      open.push(kind[1]);
      left -= 1;
    } else {
      out += open.pop();
    }
  }
  return out;
};

export const balancedBrackets = defineSingleCodeFamily({
  id: 'code/balanced-brackets',
  difficulty: 4,
  title: 'Do the brackets match?',
  task: 'Text can contain three kinds of brackets: round `( )`, square `[ ]` and curly `{ }`. The brackets are *matched* when every opening bracket is closed by a bracket of the **same kind**, and brackets close in the opposite order they opened: `{[()]}` is matched, but `([)]` and `(]` are not.\n\nWrite `isBalanced(text)` that takes a string of 0 to 40 characters and returns `true` if its brackets are matched and `false` if not. Characters that are not brackets are ignored. A string with no brackets is matched.',
  oracle,
  inDomain: ([text]) => typeof text === 'string' && text.length <= 40,
  entry: 'isBalanced',
  params: 'text',
  reference: REFERENCE,
  examples: [['{[()]} ok'], ['([)]']],
  tests: (rng) => {
    const pick = (): number => rng.int(0, 5);
    return [
      [''],
      ['no brackets here'],
      ['('],
      [')'],
      ['(]'],
      ['(()'],
      ['())'],
      ['{[]()}[{}]'],
      [matched(pick, 4)],
      [matched(pick, 7) + ')'],
      [matched(pick, 6)],
      ...Array.from({ length: 3 }, () => [randomText(rng, '()[]{}a', 1, 12)])
    ];
  },
  hints: [
    'When you meet a closing bracket, which opening bracket must be the most recent one that is still open?',
    'Which simple structure lets you add an opening bracket and later take back the latest one, in last-in, first-out order?',
    'Besides a wrong kind of closing bracket, what two other situations make the text not matched?'
  ],
  approach:
    'Use a stack. Push every opening bracket. For a closing bracket, pop the top and check that it is the matching kind. At the end the stack must be empty.',
  notes:
    'Three things can go wrong: a closer of the wrong kind, a closer with nothing open (popping an empty stack gives `undefined`, which never matches), and openers left over at the end. Counting each kind separately is not enough, because `([)]` has equal counts but is still wrong.',
  tags: ['strings', 'stack', 'brackets']
});
