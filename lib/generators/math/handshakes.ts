import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer } from './shared';

type Mode = 'couples' | 'once-reverse' | 'twice-reverse';

interface Params {
  mode: Mode;
  /** Clubs, couples or teams, depending on the mode. */
  n: number;
}

const SIZES: Record<Mode, readonly number[]> = {
  couples: [5, 6, 7, 8, 9, 12],
  'once-reverse': [9, 11, 14, 16, 17, 20],
  'twice-reverse': [9, 12, 14, 15, 18]
};

const pairs = (n: number): number => (n * (n - 1)) / 2;

const gamesFor = ({ mode, n }: Params): number => {
  if (mode === 'once-reverse') return pairs(n);
  if (mode === 'twice-reverse') return n * (n - 1);
  return pairs(2 * n) - n;
};

const isReverse = (mode: Mode): boolean => mode.endsWith('reverse');

export const answerFor = (p: Params): number =>
  isReverse(p.mode) ? p.n : gamesFor(p);

interface Story {
  title: string;
  text: string;
  /** Plural and singular name of who takes part, and what is counted. */
  who: string;
  one: string;
  what: string;
}

const STORIES: Record<
  Exclude<Mode, 'couples'>,
  readonly ((n: number) => Story)[]
> = {
  'once-reverse': [
    (n) => ({
      title: 'How many teams?',
      text: `In a league every team plays every other team exactly once. In total ${pairs(n)} games are played.\n\nHow many teams are in the league?`,
      who: 'teams',
      one: 'team',
      what: 'games'
    }),
    (n) => ({
      title: 'Counting the guests',
      text: `At a party every guest shook hands exactly once with every other guest, and there were ${pairs(n)} handshakes in all.\n\nHow many guests were at the party?`,
      who: 'guests',
      one: 'guest',
      what: 'handshakes'
    }),
    (n) => ({
      title: 'Chess players wanted',
      text: `A chess club played a round robin in which every player met every other player once. ${pairs(n)} games were played.\n\nHow many players took part?`,
      who: 'players',
      one: 'player',
      what: 'games'
    })
  ],
  'twice-reverse': [
    (n) => ({
      title: 'Matches for a season',
      text: `In a league every club plays every other club twice, home and away. The season has ${n * (n - 1)} matches.\n\nHow many clubs are in the league?`,
      who: 'clubs',
      one: 'club',
      what: 'matches'
    }),
    (n) => ({
      title: 'The long fixture list',
      text: `A double round robin has every player meeting every other player twice. There are ${n * (n - 1)} matches in total.\n\nHow many players are there?`,
      who: 'players',
      one: 'player',
      what: 'matches'
    }),
    (n) => ({
      title: 'Serving first',
      text: `In a table-tennis event every two players play two games, and each of them serves first in one of those games. ${n * (n - 1)} games are played in all.\n\nHow many players are in the event?`,
      who: 'players',
      one: 'player',
      what: 'games'
    })
  ]
};

const couplesStories: readonly ((n: number) => {
  title: string;
  text: string;
})[] = [
  (n) => ({
    title: 'Couples at the party',
    text: `${n} couples go to a party, so there are ${2 * n} people. Everyone shakes hands once with every other person, except that nobody shakes hands with their own partner.\n\nHow many handshakes are there?`
  }),
  (n) => ({
    title: 'Partners stay out of it',
    text: `At a wedding table there are ${n} married couples. Each person shakes hands exactly once with every other person at the table, except their own spouse.\n\nHow many handshakes take place?`
  })
];

const slip = (text: string): string => `\n\nThe common slip is ${text}`;

const couplesSolution = (n: number): string => {
  const total = pairs(2 * n) - n;
  return `**${total}.**\n\nThere are ${2 * n} people. If everyone shook hands with everyone, there would be (${2 * n} × ${2 * n - 1}) ÷ 2 = ${pairs(2 * n)} handshakes. But the ${n} couples do not shake hands with each other, so take away ${n}: ${pairs(2 * n)} − ${n} = **${total}**.${slip(`taking away ${2 * n} instead of ${n}. Each couple is only one missing handshake, not two.`)}`;
};

const reverseSolution = (p: Params, s: Story): string => {
  const { n } = p;
  const once = p.mode === 'once-reverse';
  const total = gamesFor(p);
  const product = once ? 2 * total : total;
  const derive = once
    ? `If there are n ${s.who}, each of the n takes part in n − 1 of the ${s.what}, and n × (n − 1) counts every one of the ${s.what} twice, once for each of its two sides. So n × (n − 1) ÷ 2 = ${total}, which means n × (n − 1) = ${product}.`
    : `If there are n ${s.who}, each of the n has n − 1 opponents, and every pair meets twice, once with each side first. Counting from each ${s.one}'s own side gives n × (n − 1) ${s.what} in all, with no halving. So n × (n − 1) = ${product}.`;
  const wrong = once
    ? `solving n × (n − 1) = ${total}, without the doubling. The total was already halved.`
    : 'halving the total, as if each pair met only once.';
  return `**${n}.**\n\n${derive} We need two consecutive whole numbers whose product is ${product}: ${n} and ${n - 1}, since ${n} × ${n - 1} = ${product}. So there are **${n}** ${s.who}.\n\nCheck: ${n - 1} × ${n - 2} = ${(n - 1) * (n - 2)} is too small and ${n + 1} × ${n} = ${(n + 1) * n} is too big.${slip(wrong)}`;
};

const reverseLoop = (total: number, times: number): string =>
  [
    'for (let n = 2; n <= 500; n++) {',
    '  let count = 0;',
    '  for (let a = 1; a <= n; a++) {',
    `    for (let b = a + 1; b <= n; b++) count += ${times};`,
    '  }',
    `  if (count === ${total}) return n;`,
    '}',
    'return NaN;'
  ].join('\n');

const solverFor = (p: Params): string => {
  if (p.mode === 'couples') {
    return [
      'let count = 0;',
      `const people = ${2 * p.n};`,
      'for (let a = 0; a < people; a++) {',
      '  for (let b = a + 1; b < people; b++) {',
      '    const partners = Math.floor(a / 2) === Math.floor(b / 2);',
      '    if (!partners) count++;',
      '  }',
      '}',
      'return count;'
    ].join('\n');
  }
  return reverseLoop(gamesFor(p), p.mode === 'once-reverse' ? 1 : 2);
};

const couplesHints = [
  'How many handshakes would there be if everyone shook hands with everyone else, partners included?',
  'How many of those handshakes never happen because of the partner rule?',
  'What is left once you take those away?'
];

const reverseHints = (p: Params, s: Story): string[] =>
  p.mode === 'once-reverse'
    ? [
        `If there are n ${s.who}, in how many ${s.what} does each ${s.one} take part, and why does multiplying by n count every one of the ${s.what} twice?`,
        `So what must n × (n − 1) equal, in terms of the total number of ${s.what}?`,
        'Which two consecutive whole numbers multiply to that?'
      ]
    : [
        `If there are n ${s.who}, how many opponents does each ${s.one} have?`,
        `Each pair meets twice, once with each side first. Counting from each ${s.one}'s own side, what must n × (n − 1) equal in terms of the total number of ${s.what}?`,
        'Which two consecutive whole numbers multiply to that?'
      ];

const TAGS: Record<Mode, string[]> = {
  couples: ['counting', 'pairs', 'handshakes'],
  'once-reverse': ['counting', 'pairs', 'quadratics'],
  'twice-reverse': ['counting', 'pairs', 'quadratics']
};

const build = (p: Params, rng: Rng) => {
  if (p.mode === 'couples') {
    const story = rng.pick(couplesStories)(p.n);
    return {
      difficulty: 3,
      title: story.title,
      prompt: story.text,
      answer: numberAnswer(answerFor(p)),
      hints: couplesHints,
      solution: couplesSolution(p.n),
      solver: solverFor(p),
      tags: TAGS[p.mode]
    };
  }
  const story = rng.pick(STORIES[p.mode])(p.n);
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: reverseHints(p, story),
    solution: reverseSolution(p, story),
    solver: solverFor(p),
    tags: TAGS[p.mode]
  };
};

const params = (): Params[] =>
  keepFair(
    (Object.keys(SIZES) as Mode[]).flatMap((mode) =>
      SIZES[mode].map((n) => ({ mode, n }))
    ),
    build
  );

export const handshakes = defineFamily<Params>({
  id: 'math/handshakes',
  area: 'math',
  slot: 'daily',
  group: (p) => p.mode,
  params,
  key: ({ mode, n }) => `${mode}-${n}`,
  build
});
