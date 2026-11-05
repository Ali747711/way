import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { choose, keepFair, numberAnswer } from './shared';

interface Params {
  /** Count the whole numbers from 1 up to and including this. */
  limit: number;
  /** The digit sum wanted. */
  sum: number;
}

// Four-digit limits with a few non-zero digits, so the stage list stays short.
const CANDIDATES: readonly Params[] = [
  { limit: 2800, sum: 12 },
  { limit: 3400, sum: 14 },
  { limit: 4700, sum: 16 },
  { limit: 2500, sum: 13 },
  { limit: 3600, sum: 15 },
  { limit: 5000, sum: 18 },
  { limit: 2026, sum: 11 },
  { limit: 4200, sum: 17 }
];

const digitSum = (n: number): number =>
  String(n)
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);

/** Strings of `places` digits (leading zeros allowed) with digit sum `total`. */
const strings = (places: number, total: number): number => {
  if (total < 0) return 0;
  let count = 0;
  // Inclusion-exclusion over digits forced to 10 or more.
  for (let bad = 0; bad <= places; bad++) {
    const rest = total - 10 * bad;
    if (rest < 0) break;
    const sign = bad % 2 === 0 ? 1 : -1;
    count += sign * choose(places, bad) * choose(rest + places - 1, places - 1);
  }
  return count;
};

/** Numbers from 0 to limit (a four-digit limit) with the given digit sum. */
export const answerFor = ({ limit, sum }: Params): number => {
  const digits = String(limit).split('').map(Number);
  let count = 0;
  let prefix = 0;
  digits.forEach((d, i) => {
    const remaining = digits.length - i - 1;
    for (let lead = 0; lead < d; lead++) {
      count += strings(remaining, sum - prefix - lead);
    }
    prefix += d;
  });
  return count + (digitSum(limit) === sum ? 1 : 0);
};

const STORIES = [
  ({ limit, sum }: Params) => ({
    title: 'Digits that add up',
    text: `How many whole numbers from 1 to ${limit} (both included) have digits that add up to exactly ${sum}? For example, 4 + 1 + 7 = 12, so 417 has a digit sum of 12.`
  }),
  ({ limit, sum }: Params) => ({
    title: 'Lucky tickets',
    text: `A raffle sells tickets numbered 1 to ${limit}. A ticket is lucky if the digits in its number add up to ${sum}. Ticket 66 has a digit sum of 12, for example.\n\nHow many tickets are lucky?`
  }),
  ({ limit, sum }: Params) => ({
    title: 'Counting by digit sum',
    text: `Look at every whole number from 1 up to ${limit}, including both ends. For each, add its digits together; the number 1905 gives 1 + 9 + 0 + 5 = 15.\n\nHow many of these numbers have a digit sum of exactly ${sum}?`
  })
];

const stageLines = ({ limit, sum }: Params): string => {
  const digits = String(limit).split('').map(Number);
  const rows: string[] = [];
  let prefix = 0;
  digits.forEach((d, i) => {
    const remaining = digits.length - i - 1;
    for (let lead = 0; lead < d; lead++) {
      const need = sum - prefix - lead;
      const ways = strings(remaining, need);
      if (ways === 0) continue;
      const label =
        i === 0 && lead === 0
          ? `Numbers below ${10 ** remaining} (written with leading zeros)`
          : `Numbers starting ${digits.slice(0, i).join('')}${lead}`;
      const free = `the last ${remaining} digit${remaining === 1 ? '' : 's'}`;
      rows.push(
        `- ${label}: ${free} must add to ${need}, which can be done in ${ways} way${ways === 1 ? '' : 's'}`
      );
    }
    prefix += d;
  });
  return rows.join('\n');
};

const solutionFor = (p: Params): string => {
  const answer = answerFor(p);
  const limitCounts = digitSum(p.limit) === p.sum;
  const groups = answer - (limitCounts ? 1 : 0);
  const ending = limitCounts
    ? `The limit ${p.limit} itself has digit sum ${p.sum}, so it adds one more.`
    : `The limit ${p.limit} has digit sum ${digitSum(p.limit)}, not ${p.sum}, so it adds nothing.`;
  const check =
    p.limit === 5000 && p.sum === 18
      ? `**A check.** Replacing every digit d by 9 − d turns 0000–4999 into 5000–9999 and keeps a digit sum of 18 (36 − 18). So exactly half of all four-digit strings with digit sum 18 are at most 4999, which is the answer to this problem.\n\n`
      : '';
  return `**${answer}.**\n\n**Stage 1: count strings of digits.** Write every number as four digits with leading zeros, so 47 is 0047. To count strings of k digits that add to s, first ignore the rule that a digit is at most 9. Then the number of ways to split s into k parts, each 0 or more, is C(s + k − 1, k − 1) ("stars and bars"). Now remove the strings in which some digit is 10 or more: pick that digit (k ways), take 10 off the total, and count again. For instance, three digits adding to 12: C(14, 2) = 91, minus 3 × C(4, 2) = 18, leaves 73. (For sums below 20 two digits cannot both be 10 or more, so nothing else needs correcting.)\n\n**Stage 2: split by where the number first drops below the limit.** Compare a number with ${p.limit} from the left. It either agrees with the limit for a while and then has a smaller digit, or it is the limit itself. For each smaller digit, the digits after it are free (groups that cannot reach the total are left out):\n\n${stageLines(p)}\n\n**Stage 3: add the groups.** The groups add to ${groups}. ${ending} The total is **${answer}**.\n\n${check}**Why shortcuts fail.** Listing numbers one by one is far too long. Counting four free digits adding to ${p.sum} counts numbers above ${p.limit}. Forgetting the correction for digits above 9 counts strings such as 0, 0, 0, ${p.sum} that are not made of digits at all.`;
};

const solverFor = ({ limit, sum }: Params): string =>
  [
    'let count = 0;',
    `for (let n = 1; n <= ${limit}; n++) {`,
    '  let total = 0;',
    '  for (const d of String(n)) total += Number(d);',
    `  if (total === ${sum}) count++;`,
    '}',
    'return count;'
  ].join('\n');

const HINTS = [
  'Can you count, by hand, how many two-digit numbers have digits adding to a small total such as 7, and see how the count changes for other totals?',
  'If you allow leading zeros so that every number has the same number of digits, how can you count the strings of digits that add to a given total?',
  'Why might a count that ignores the rule that a digit is at most 9 be too big, and what do you subtract to fix it?',
  'Which numbers up to the largest one can you group by their first digit, and how many digits are then free for each group?',
  'What do you get when you add up the groups, and does the largest number itself need to be added or not?'
];

const build = (p: Params, rng: Rng) => {
  const story = rng.pick(STORIES)(p);
  return {
    difficulty: 5,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: HINTS,
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['counting', 'digits', 'stars and bars']
  };
};

export const digitSumCount = defineFamily<Params>({
  id: 'math/digit-sum-count',
  area: 'math',
  slot: 'deep',
  params: () => keepFair(CANDIDATES, build),
  key: ({ limit, sum }) => `${limit}-${sum}`,
  build
});
