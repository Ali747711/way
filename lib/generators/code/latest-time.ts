import { isIntIn, isListOf } from './helpers';
import { oracle } from './latest-time.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function latestTime(digits) {
  let best = '';
  const used = [false, false, false, false];
  const chosen = [];
  function place() {
    if (chosen.length === 4) {
      const hours = chosen[0] * 10 + chosen[1];
      const minutes = chosen[2] * 10 + chosen[3];
      if (hours < 24 && minutes < 60) {
        const time = '' + chosen[0] + chosen[1] + ':' + chosen[2] + chosen[3];
        if (time > best) best = time;
      }
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!used[i]) {
        used[i] = true;
        chosen.push(digits[i]);
        place();
        chosen.pop();
        used[i] = false;
      }
    }
  }
  place();
  return best;
}`;

export const latestTime = defineSingleCodeFamily({
  id: 'code/latest-time',
  difficulty: 4,
  title: 'The latest face on the clock',
  task: 'A 24-hour digital clock shows `"HH:MM"`: hours `00` to `23`, minutes `00` to `59`, always two digits each. You are given four digits and must place **each of them exactly once** into the four slots to make a valid time. You want the **latest** valid time.\n\nWrite `latestTime(digits)` that takes an array of exactly four whole numbers, each from 0 to 9 (repeats allowed), and returns the latest valid time as an `"HH:MM"` string. If no arrangement makes a valid time, return an empty string `""`. For example `[1, 2, 3, 4]` gives `"23:41"`, not `"23:14"`.',
  entry: 'latestTime',
  params: 'digits',
  reference: REFERENCE,
  oracle,
  inDomain: ([digits]) => isListOf(digits, 4, (d) => isIntIn(d, 0, 9), 4),
  examples: [[[1, 2, 3, 4]], [[5, 5, 6, 6]]],
  tests: (rng) => [
    [[0, 0, 0, 0]],
    [[2, 3, 5, 9]],
    [[9, 9, 9, 9]],
    [[2, 4, 6, 0]],
    [[1, 9, 6, 6]],
    [[0, 6, 6, 6]],
    [[2, 2, 2, 2]],
    ...Array.from({ length: 5 }, () => [
      Array.from({ length: 4 }, () => rng.int(0, 9))
    ])
  ],
  hints: [
    'How many different ways are there to order four digits, and is that few enough to simply try them all?',
    'For one ordering, which two conditions make it a valid time, and how do you compare two valid times to see which is later?',
    'If you write every time as "HH:MM" with two digits each, can you compare two of them as plain strings?'
  ],
  approach:
    'Try every ordering of the four digits with recursion: pick an unused digit for the next slot, go deeper, then put it back. When all four slots are filled, check that the hours are below 24 and the minutes below 60, and keep the latest valid time seen.',
  notes:
    'Use each position once, not each value once: `[2, 2, 2, 2]` is allowed, and it gives `"22:22"`. Because the times are zero-padded `"HH:MM"` strings, comparing them as text puts them in clock order. A greedy rule that puts the biggest allowed digit in each slot from the left can fail: for `[2, 0, 6, 6]` it picks hour 20 and is left with minutes 66, but `"06:26"` is valid.',
  tags: ['recursion', 'permutations', 'time']
});
