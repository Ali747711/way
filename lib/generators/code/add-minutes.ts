import { isIntIn, isText } from './helpers';
import { oracle } from './add-minutes.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function addMinutes(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const pad = (n) => String(n).padStart(2, '0');
  return pad(Math.floor(wrapped / 60)) + ':' + pad(wrapped % 60);
}`;

const pad = (n: number): string => String(n).padStart(2, '0');

export const addMinutes = defineSingleCodeFamily({
  id: 'code/add-minutes',
  difficulty: 3,
  title: 'Clock after a delay',
  task: 'A 24-hour clock shows times as `"HH:MM"`, with two digits for the hours (`00` to `23`) and two for the minutes (`00` to `59`). After `23:59` the next minute is `00:00`.\n\nWrite `addMinutes(time, minutes)` that takes a valid `"HH:MM"` string and a whole number `minutes` from -5000 to 5000, and returns the clock time that many minutes later, in the same `"HH:MM"` format with leading zeros. A negative `minutes` goes back in time. The result always has hours from `00` to `23`; midnight is `"00:00"`, never `"24:00"`.',
  oracle,
  inDomain: ([time, minutes]) =>
    isText(time, /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/) &&
    isIntIn(minutes, -5000, 5000),
  entry: 'addMinutes',
  params: 'time, minutes',
  reference: REFERENCE,
  examples: [
    ['23:50', 25],
    ['00:10', -20]
  ],
  tests: (rng) => [
    ['00:00', 0],
    ['12:30', 0],
    ['23:59', 1],
    ['00:00', -1],
    ['10:15', 1440],
    ['10:15', -1440],
    ['06:05', 5000],
    ['06:05', -5000],
    ...Array.from({ length: 5 }, () => [
      `${pad(rng.int(0, 23))}:${pad(rng.int(0, 59))}`,
      rng.int(-5000, 5000)
    ])
  ],
  hints: [
    'Could you turn the clock time into one number, the minutes since midnight, and do the sum on that?',
    'A day has 1440 minutes. How can the remainder operator wrap a total back into a single day?',
    'What does % give for a negative total, and what can you add before the final % to fix it?'
  ],
  approach:
    'Convert `"HH:MM"` to minutes since midnight, add the delay, wrap into 0 to 1439, then turn it back into hours and minutes with padding.',
  notes:
    'Negative totals are the catch: `-10 % 1440` is `-10` in JavaScript, so add 1440 and take `%` again. `padStart(2, "0")` gives the leading zeros, so `5` becomes `"05"`.',
  tags: ['strings', 'math', 'time']
});
