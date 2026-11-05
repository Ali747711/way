import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer } from './shared';

type Target = 'together' | 'right-angle' | 'opposite';

interface AngleParams {
  kind: 'angle';
  hour: number;
  minute: number;
}

interface CountParams {
  kind: 'count';
  target: Target;
  /** Length of the period in hours: 12 (noon to noon) or 24 (a full day). */
  hours: 12 | 24;
}

type Params = AngleParams | CountParams;

const TIMES: readonly (readonly [number, number])[] = [
  [2, 20],
  [3, 40],
  [4, 10],
  [5, 30],
  [7, 20],
  [8, 40],
  [9, 50],
  [10, 10],
  [11, 30],
  [6, 10],
  [12, 20],
  [1, 40],
  [3, 20],
  [4, 50]
];

const COUNTS: readonly CountParams[] = (
  ['together', 'right-angle', 'opposite'] as const
).flatMap((target) =>
  ([12, 24] as const).map((hours) => ({
    kind: 'count' as const,
    target,
    hours
  }))
);

/** Smaller angle between the hands, in degrees, at hour:minute. */
const angleAt = (hour: number, minute: number): number => {
  const hourHand = 30 * (hour % 12) + minute / 2;
  const minuteHand = 6 * minute;
  const gap = Math.abs(hourHand - minuteHand);
  return Math.min(gap, 360 - gap);
};

/** Laps of the minute hand against the hour hand, times meetings per lap. */
const PER_LAP: Record<Target, number> = {
  together: 1,
  opposite: 1,
  'right-angle': 2
};

export const answerFor = (p: Params): number =>
  p.kind === 'angle'
    ? angleAt(p.hour, p.minute)
    : (PER_LAP[p.target] * 11 * p.hours) / 12;

const clock = (h: number, m: number): string =>
  `${h}:${String(m).padStart(2, '0')}`;

const ANGLE_STORIES = [
  ({ hour, minute }: AngleParams) => ({
    title: 'The angle on the clock face',
    text: `An analogue clock shows exactly ${clock(hour, minute)}. The hour hand moves smoothly, so by ${clock(hour, minute)} it has moved on past the hour mark.\n\nWhat is the smaller angle, in degrees, between the hour hand and the minute hand?`
  }),
  ({ hour, minute }: AngleParams) => ({
    title: 'Between the two hands',
    text: `At ${clock(hour, minute)} on a clock with smoothly moving hands, the hour hand and the minute hand make two angles with each other, one going each way round.\n\nHow many degrees is the smaller of the two?`
  }),
  ({ hour, minute }: AngleParams) => ({
    title: 'A glance at the clock',
    text: `A wall clock with smoothly moving hands shows ${clock(hour, minute)}.\n\nWhat is the angle, in degrees, between its hands, measured the short way round?`
  })
];

const WHAT: Record<Target, string> = {
  together: 'point exactly the same way, one on top of the other',
  'right-angle': 'make exactly a right angle (90 degrees) with each other',
  opposite: 'point in exactly opposite directions (180 degrees apart)'
};

const countPrompt = (p: CountParams, rng: Rng) => {
  const period =
    p.hours === 12
      ? 'From noon up to, but not including, the following midnight'
      : 'From midnight up to, but not including, the next midnight';
  const intro = rng.pick([
    'A clock has a smoothly moving hour hand and minute hand.',
    'Look at an analogue clock whose hands move smoothly.'
  ]);
  return {
    title: {
      together: 'When the hands meet',
      'right-angle': 'Hands at right angles',
      opposite: 'Hands pointing apart'
    }[p.target],
    text: `${intro} ${period}, how many times do the hour hand and the minute hand ${WHAT[p.target]}?`
  };
};

const angleSolution = ({ hour, minute }: AngleParams): string => {
  const hourHand = 30 * (hour % 12) + minute / 2;
  const minuteHand = 6 * minute;
  const gap = Math.abs(hourHand - minuteHand);
  const answer = angleAt(hour, minute);
  const turn =
    gap > 180
      ? `The gap is ${gap}°, which is more than half a turn, so the short way round is 360 − ${gap} = **${answer}°**.`
      : `The gap is ${gap}°, which is less than half a turn, so it is already the smaller angle: **${answer}°**.`;
  return `**${answer}°.**\n\nThe hour hand turns 360° in 12 hours, which is 30° each hour or 0.5° each minute. The minute hand turns 360° in 60 minutes, which is 6° each minute.\n\nMeasured from 12, the hour hand is at ${30 * (hour % 12)}° for the hour plus ${minute} × 0.5 = ${minute / 2}° for the minutes, so ${hourHand}°. The minute hand is at ${minute} × 6 = ${minuteHand}°. ${turn}\n\nThe common slip is placing the hour hand exactly on the hour mark, at ${30 * (hour % 12)}°, and forgetting that it has crept ${minute / 2}° further.`;
};

const countSolution = (p: CountParams): string => {
  const answer = answerFor(p);
  const laps = (11 * p.hours) / 12;
  const per = PER_LAP[p.target];
  const meet =
    p.target === 'right-angle'
      ? 'twice (once when the minute hand is a quarter-turn ahead and once when it is a quarter-turn behind)'
      : 'once';
  return `**${answer}.**\n\nMeasure the minute hand relative to the hour hand. The minute hand gains 360° − 30° = 330° every hour, so it gains a full turn on the hour hand every 360 ÷ 330 = 12/11 hours.\n\nIn ${p.hours} hours that is ${p.hours} ÷ (12/11) = ${laps} full laps. In each lap the hour hand and the minute hand ${WHAT[p.target]} ${meet}, so ${per === 1 ? `${laps} laps give **${answer}** times` : `the count is ${laps} × ${per} = **${answer}**`}.\n\nThe common slip is to count ${p.hours} laps, one per hour on the dial, forgetting that the hour hand is also moving and so the minute hand only catches up ${laps} times.`;
};

const solverFor = (p: Params): string => {
  if (p.kind === 'angle') {
    return [
      '// Simulate the hands minute by minute from 12:00.',
      `const minutes = (${p.hour} % 12) * 60 + ${p.minute};`,
      'let hourHand = 0;',
      'let minuteHand = 0;',
      'for (let i = 0; i < minutes; i++) {',
      '  hourHand = (hourHand + 0.5) % 360;',
      '  minuteHand = (minuteHand + 6) % 360;',
      '}',
      'const gap = Math.abs(hourHand - minuteHand);',
      'return Math.min(gap, 360 - gap);'
    ].join('\n');
  }
  const target = { together: 0, 'right-angle': 90, opposite: 180 }[p.target];
  const targets = p.target === 'right-angle' ? [90, 270] : [target];
  // Work in units of 1/120 degree per second: the minute hand moves 12, the
  // hour hand 1, so their difference grows by 11 units a second.
  return [
    `const seconds = ${p.hours} * 3600;`,
    `const targets = ${JSON.stringify(targets.map((t) => t * 120))};`,
    'const lap = 360 * 120;',
    'let count = 0;',
    'for (let s = 0; s < seconds; s++) {',
    '  for (const t of targets) {',
    '    const before = Math.floor((11 * s - t) / lap);',
    '    const after = Math.floor((11 * (s + 1) - t) / lap);',
    '    if (after > before) count++;',
    '  }',
    '}',
    'return count;'
  ].join('\n');
};

const ANGLE_HINTS = [
  'How many degrees does the hour hand turn in one hour, and how many does it turn in one minute?',
  'Measured from 12, where is the hour hand at this time, remembering that it has moved on past the hour mark? Where is the minute hand?',
  'What is the difference between the two positions, and is it the smaller of the two angles the hands make?'
];

const COUNT_HINTS = [
  'In one hour, how far round the dial does each hand turn, in degrees?',
  'How much does the minute hand gain on the hour hand each hour, and how long does it take to gain one full turn?',
  'How many such laps fit in the period, and how many times in each lap do the hands reach the required position?'
];

const build = (p: Params, rng: Rng) => {
  const story =
    p.kind === 'angle' ? rng.pick(ANGLE_STORIES)(p) : countPrompt(p, rng);
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: p.kind === 'angle' ? ANGLE_HINTS : COUNT_HINTS,
    solution: p.kind === 'angle' ? angleSolution(p) : countSolution(p),
    solver: solverFor(p),
    tags: ['clocks', 'angles', 'rates']
  };
};

const key = (p: Params): string =>
  p.kind === 'angle'
    ? `angle-${clock(p.hour, p.minute)}`
    : `count-${p.target}-${p.hours}`;

const candidates = (): Params[] => [
  ...TIMES.map(([hour, minute]) => ({ kind: 'angle' as const, hour, minute })),
  ...COUNTS
];

export const clockHands = defineFamily<Params>({
  id: 'math/clock-hands',
  area: 'math',
  slot: 'daily',
  group: (p) => (p.kind === 'angle' ? 'angle' : p.target),
  params: () => keepFair(candidates(), build),
  key,
  build
});
