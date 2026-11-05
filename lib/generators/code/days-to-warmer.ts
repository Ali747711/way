import { isIntIn, isListOf, randomInts } from './helpers';
import { oracle } from './days-to-warmer.oracle';
import { defineSingleCodeFamily } from './single';

const REFERENCE = `function daysToWarmer(temps) {
  const waits = new Array(temps.length).fill(0);
  const waiting = [];
  for (let day = 0; day < temps.length; day++) {
    while (waiting.length > 0 && temps[waiting[waiting.length - 1]] < temps[day]) {
      const earlier = waiting.pop();
      waits[earlier] = day - earlier;
    }
    waiting.push(day);
  }
  return waits;
}`;

export const daysToWarmer = defineSingleCodeFamily({
  id: 'code/days-to-warmer',
  difficulty: 4,
  title: 'How long until it warms up?',
  task: 'A list holds the temperature for each day in a row, in whole degrees. For every day you want to know how many days you must wait until a **strictly warmer** day arrives. A day that is just as warm does not count.\n\nWrite `daysToWarmer(temps)` that takes an array of 0 to 30 whole numbers from -30 to 45 and returns an array of the same length. Entry `i` is the number of days from day `i` to the next day with a higher temperature, or `0` if no later day is warmer. An empty array returns `[]`.',
  oracle,
  inDomain: ([temps]) => isListOf(temps, 30, (t) => isIntIn(t, -30, 45)),
  entry: 'daysToWarmer',
  params: 'temps',
  reference: REFERENCE,
  examples: [[[20, 25, 22, 19, 30]], [[10, 10, 9]]],
  tests: (rng) => [
    [[]],
    [[5]],
    [[1, 2, 3, 4]],
    [[4, 3, 2, 1]],
    [[7, 7, 7]],
    [[-5, -10, 0, -3, -3, 2]],
    [[30, 20, 25, 20, 26, 27, 1]],
    ...Array.from({ length: 5 }, () => [randomInts(rng, -10, 30, 1, 25)])
  ],
  hints: [
    'For one day, how would you find its answer if you just looked ahead day by day?',
    'Can you keep a list of earlier days that are still waiting for a warmer day, and settle some of them every time a new day arrives?',
    'Which waiting days does a new, warmer day settle, and in what order are they stored so you can reach them quickly?'
  ],
  approach:
    'Keep a stack of days still waiting for a warmer one. For each new day, while the day on top of the stack is colder, pop it and record how many days it waited. Then push the new day.',
  notes:
    'The stack stays ordered from colder at the top to warmer below, so each day is pushed once and popped once. Days left on the stack at the end never saw a warmer day and keep their `0`. A day with the same temperature must not settle a waiting day, so the comparison is strictly `<`.',
  tags: ['arrays', 'stack']
});
