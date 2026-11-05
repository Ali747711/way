import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer } from './shared';

type Mode = 'foot' | 'top';

interface Params {
  length: number;
  /** Foot distance from the wall before and after the slip. */
  start: number;
  end: number;
  mode: Mode;
}

// Lengths that are the longest side of more than one whole-number right triangle.
const LENGTHS = [25, 50, 65, 85];
// Already in the bank as m-004: ladder 25, foot 7, top slips 4.
const TAKEN = new Set(['25-7-15-foot']);

const heightOf = (length: number, foot: number): number | null => {
  const square = length * length - foot * foot;
  const root = Math.round(Math.sqrt(square));
  return root * root === square && root > 0 ? root : null;
};

const feet = (length: number): number[] =>
  Array.from({ length: length - 1 }, (_, i) => i + 1).filter(
    (x) => heightOf(length, x) !== null
  );

/** True for any scaling of the 7-24-25 triangle used by the published m-004. */
const isPublishedTriangle = (length: number, foot: number): boolean => {
  const height = heightOf(length, foot);
  if (height === null || length % 25 !== 0) return false;
  const k = length / 25;
  return [foot, height].sort((a, b) => a - b).join() === `${7 * k},${24 * k}`;
};

const key = (p: Params): string => `${p.length}-${p.start}-${p.end}-${p.mode}`;

/** Height lost by the top when the foot moves from start to end. */
const slipOf = (p: Params): number =>
  (heightOf(p.length, p.start) ?? 0) - (heightOf(p.length, p.end) ?? 0);

const slideOf = (p: Params): number => p.end - p.start;

export const answerFor = (p: Params): number =>
  p.mode === 'foot' ? slideOf(p) : slipOf(p);

interface Story {
  title: string;
  name: string;
  surface: string;
  unit: string;
  /** Opening words, e.g. "A ladder". */
  opening: string;
  /** Longest length that is believable for this object, in its unit. */
  maxLength: number;
}

const STORIES: readonly Story[] = [
  {
    title: 'A ladder that slips',
    name: 'ladder',
    surface: 'wall',
    unit: 'metres',
    opening: 'A ladder',
    maxLength: 30
  },
  {
    title: 'The leaning stick',
    name: 'stick',
    surface: 'wall',
    unit: 'centimetres',
    opening: 'A straight stick',
    maxLength: 100
  },
  {
    title: 'Sliding down the fence',
    name: 'plank',
    surface: 'fence',
    unit: 'centimetres',
    opening: 'A plank',
    maxLength: 100
  }
];

const promptFor = (p: Params, s: Story): string => {
  const intro = `${s.opening} ${p.length} ${s.unit} long leans against a vertical ${s.surface} on level ground. Its foot is ${p.start} ${s.unit} from the ${s.surface}.`;
  if (p.mode === 'foot') {
    return `${intro} The top slips down the ${s.surface} by ${slipOf(p)} ${s.unit}, and the foot slides out along the ground. The length stays the same.\n\nHow many ${s.unit} does the foot slide?`;
  }
  return `${intro} The foot is then pulled ${slideOf(p)} ${s.unit} further from the ${s.surface}, and the top slides down the ${s.surface}. The length stays the same.\n\nHow many ${s.unit} does the top slide down?`;
};

const solutionFor = (p: Params, s: Story): string => {
  const { length: L, start: x1, end: x2 } = p;
  const y1 = heightOf(L, x1) ?? 0;
  const y2 = heightOf(L, x2) ?? 0;
  const answer = answerFor(p);
  const triangle = `The ${s.name}, the ${s.surface} and the ground make a right triangle with the ${s.name} as its longest side, so (foot)² + (height)² = ${L}² = ${L * L}.`;
  const before = `At the start the foot is ${x1} from the ${s.surface}, so the height is √(${L * L} − ${x1 * x1}) = √${y1 * y1} = ${y1}.`;
  const after = `Afterwards the foot is ${x2} from the ${s.surface}, so the height is √(${L * L} − ${x2 * x2}) = √${y2 * y2} = ${y2}.`;
  if (p.mode === 'foot') {
    return `**${answer}.**\n\n${triangle}\n\n${before} After the top slips ${y1 - y2}, the height is ${y1} − ${y1 - y2} = ${y2}, so the foot is √(${L * L} − ${y2 * y2}) = √${x2 * x2} = ${x2} from the ${s.surface}. It has slid ${x2} − ${x1} = **${answer}**.\n\nThe common slip is thinking the foot slides as far as the top slips. The two distances are different, because the triangle changes shape.`;
  }
  return `**${answer}.**\n\n${triangle}\n\n${before} The foot ends ${x1} + ${x2 - x1} = ${x2} from the ${s.surface}. ${after.replace('Afterwards the foot is ' + x2 + ' from the ' + s.surface + ', so the', 'So the')} The top has come down ${y1} − ${y2} = **${answer}**.\n\nThe common slip is thinking the top slides as far as the foot is pulled. The two distances are different, because the triangle changes shape.`;
};

const solverFor = (p: Params): string => {
  const find = [
    'const root = (square) => {',
    '  for (let r = 1; r * r <= square; r++) if (r * r === square) return r;',
    '  return NaN;',
    '};',
    `const length = ${p.length};`
  ];
  if (p.mode === 'foot') {
    return [
      ...find,
      `const top = root(length * length - ${p.start} * ${p.start});`,
      `const newTop = top - ${slipOf(p)};`,
      'const newFoot = root(length * length - newTop * newTop);',
      `return newFoot - ${p.start};`
    ].join('\n');
  }
  return [
    ...find,
    `const top = root(length * length - ${p.start} * ${p.start});`,
    `const newTop = root(length * length - ${p.end} * ${p.end});`,
    'return top - newTop;'
  ].join('\n');
};

const hintsFor = (mode: Mode, s: Story): string[] => {
  const first = `The ${s.name}, the ${s.surface} and the ground make a right triangle: which side is the ${s.name}, and what does that tell you about the other two sides?`;
  return mode === 'foot'
    ? [
        first,
        `How high up the ${s.surface} does the ${s.name} reach at the start, and how high does it reach after the top has slipped?`,
        `How far from the ${s.surface} is the foot at the end, and how much further out is that than at the start?`
      ]
    : [
        first,
        `How far from the ${s.surface} is the foot at the end, and how high does the ${s.name} reach there?`,
        `How high did the ${s.name} reach at the start, and how much lower is the top now?`
      ];
};

const build = (p: Params, rng: Rng) => {
  const story = rng.pick(STORIES.filter((s) => s.maxLength >= p.length));
  return {
    difficulty: 3,
    title: story.title,
    prompt: promptFor(p, story),
    answer: numberAnswer(answerFor(p)),
    hints: hintsFor(p.mode, story),
    solution: solutionFor(p, story),
    solver: solverFor(p),
    tags: ['geometry', 'Pythagoras', 'right triangles']
  };
};

const candidates = (): Params[] =>
  LENGTHS.flatMap((length) => {
    const xs = feet(length);
    return xs.flatMap((start) =>
      xs
        .filter((end) => end > start)
        .flatMap((end) =>
          (['foot', 'top'] as const).map((mode) => ({
            length,
            start,
            end,
            mode
          }))
        )
    );
  }).filter(
    (p) =>
      slipOf(p) !== slideOf(p) &&
      !TAKEN.has(key(p)) &&
      !isPublishedTriangle(p.length, p.start) &&
      !isPublishedTriangle(p.length, p.end)
  );

// Keep a spread: one in four of the possible ladders, taken in a fixed pattern.
const params = (): Params[] =>
  keepFair(
    candidates().filter((_, i) => i % 4 === 0),
    build
  );

export const ladderSlip = defineFamily<Params>({
  id: 'math/ladder-slip',
  area: 'math',
  slot: 'daily',
  group: (p) => p.mode,
  params,
  key,
  build
});
