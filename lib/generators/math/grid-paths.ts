import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { choose, keepFair, numberAnswer } from './shared';

type Mode = 'via' | 'avoid' | 'avoid-two';

type Point = readonly [number, number];

interface Params {
  mode: Mode;
  /** Blocks east and north from start to finish. */
  east: number;
  north: number;
  /** The point to pass through, or the first blocked point. */
  point: Point;
  /** The second blocked point ('avoid-two' only). */
  other: Point;
}

const NONE: Point = [0, 0];

const via = (east: number, north: number, point: Point): Params => ({
  mode: 'via',
  east,
  north,
  point,
  other: NONE
});
const avoid = (east: number, north: number, point: Point): Params => ({
  mode: 'avoid',
  east,
  north,
  point,
  other: NONE
});
const avoidTwo = (
  east: number,
  north: number,
  point: Point,
  other: Point
): Params => ({ mode: 'avoid-two', east, north, point, other });

const CANDIDATES: readonly Params[] = [
  via(6, 4, [3, 2]),
  via(6, 5, [2, 3]),
  via(7, 4, [4, 1]),
  via(7, 5, [5, 3]),
  via(8, 5, [3, 2]),
  via(7, 6, [4, 4]),
  avoid(5, 4, [2, 2]),
  avoid(6, 4, [3, 2]),
  avoid(6, 5, [4, 3]),
  avoid(7, 5, [3, 2]),
  avoid(7, 6, [4, 3]),
  avoid(8, 5, [5, 2]),
  avoidTwo(5, 4, [1, 3], [3, 1]),
  avoidTwo(6, 4, [2, 3], [4, 1]),
  avoidTwo(6, 5, [2, 4], [4, 2]),
  avoidTwo(7, 5, [2, 4], [5, 2]),
  avoidTwo(7, 6, [3, 4], [5, 2])
];

const paths = (e: number, n: number): number => choose(e + n, e);
const through = (e: number, n: number, [px, py]: Point): number =>
  paths(px, py) * paths(e - px, n - py);

export const answerFor = (p: Params): number => {
  const { east: e, north: n } = p;
  if (p.mode === 'via') return through(e, n, p.point);
  if (p.mode === 'avoid') return paths(e, n) - through(e, n, p.point);
  return paths(e, n) - through(e, n, p.point) - through(e, n, p.other);
};

interface Actor {
  title: string;
  who: string;
  the: string;
  floor: string;
}

const ACTORS: readonly Record<Mode, Actor>[] = [
  {
    via: {
      title: 'A robot that must check in',
      who: 'A robot',
      the: 'the robot',
      floor: 'floor'
    },
    avoid: {
      title: 'A broken tile',
      who: 'A robot',
      the: 'the robot',
      floor: 'floor'
    },
    'avoid-two': {
      title: 'Two broken tiles',
      who: 'A robot',
      the: 'the robot',
      floor: 'floor'
    }
  },
  {
    via: {
      title: 'The snail and the sunny tile',
      who: 'A snail',
      the: 'the snail',
      floor: 'terrace'
    },
    avoid: {
      title: 'The snail and the cracked tile',
      who: 'A snail',
      the: 'the snail',
      floor: 'terrace'
    },
    'avoid-two': {
      title: 'A terrace with two cracks',
      who: 'A snail',
      the: 'the snail',
      floor: 'terrace'
    }
  },
  {
    via: {
      title: 'A cleaner with a stop to make',
      who: 'A cleaning robot',
      the: 'the cleaning robot',
      floor: 'hall'
    },
    avoid: {
      title: 'Around the loose tile',
      who: 'A cleaning robot',
      the: 'the cleaning robot',
      floor: 'hall'
    },
    'avoid-two': {
      title: 'Two loose tiles',
      who: 'A cleaning robot',
      the: 'the cleaning robot',
      floor: 'hall'
    }
  }
];

const tile = ([x, y]: Point): string => `${x} right and ${y} up from the start`;

const promptFor = (p: Params, a: Actor): string => {
  const intro = `${a.who} starts on one tile of a large tiled ${a.floor} and must reach the tile ${p.east} tiles to the right of it and ${p.north} tiles up. Each move takes it one tile right or one tile up.`;
  if (p.mode === 'via') {
    return `${intro}\n\nIt must step on the marked tile, which is ${tile(p.point)}. How many different paths are there?`;
  }
  if (p.mode === 'avoid') {
    return `${intro}\n\nThe tile ${tile(p.point)} is broken, so ${a.the} never steps on it. How many different paths are there?`;
  }
  return `${intro}\n\nTwo tiles are broken, so ${a.the} never steps on them: the tile ${tile(p.point)}, and the tile ${tile(p.other)}. How many different paths are there?`;
};

const choiceText = (e: number, n: number): string =>
  `${e + n} moves, of which ${e} are right: C(${e + n}, ${e}) = ${paths(e, n)}`;

const solutionFor = (p: Params): string => {
  const { east: e, north: n, point } = p;
  const answer = answerFor(p);
  const total = `Any path is ${choiceText(e, n)} (choose which moves go right).`;
  const first = `${point[0]} right and ${point[1]} up to reach it: C(${point[0] + point[1]}, ${point[0]}) = ${paths(point[0], point[1])} ways, then ${e - point[0]} right and ${n - point[1]} up from there: C(${e - point[0] + n - point[1]}, ${e - point[0]}) = ${paths(e - point[0], n - point[1])} ways`;
  if (p.mode === 'via') {
    return `**${answer}.**\n\nA path that steps on the marked tile is a path to that tile followed by a path from it to the end, and the two parts are independent.\n\nTo the marked tile: ${point[0]} right and ${point[1]} up, so C(${point[0] + point[1]}, ${point[0]}) = ${paths(point[0], point[1])} ways. From the marked tile to the end: ${e - point[0]} right and ${n - point[1]} up, so C(${e - point[0] + n - point[1]}, ${e - point[0]}) = ${paths(e - point[0], n - point[1])} ways. Multiply: ${paths(point[0], point[1])} × ${paths(e - point[0], n - point[1])} = **${answer}**.\n\nThe common slip is to add the two counts instead of multiplying them.`;
  }
  if (p.mode === 'avoid') {
    return `**${answer}.**\n\nCount all paths, then take away the ones that step on the broken tile.\n\n${total}\n\nPaths through the broken tile: ${first}, so ${through(e, n, point)} in all. The answer is ${paths(e, n)} − ${through(e, n, point)} = **${answer}**.\n\nThe common slip is to subtract only the ${paths(point[0], point[1])} ways of reaching the broken tile, forgetting that each of them can continue to the end in several ways.`;
  }
  const other = p.other;
  return `**${answer}.**\n\nCount all paths, then take away the ones that step on either broken tile.\n\n${total}\n\nThrough the first broken tile: ${paths(point[0], point[1])} × ${paths(e - point[0], n - point[1])} = ${through(e, n, point)}. Through the second: ${paths(other[0], other[1])} × ${paths(e - other[0], n - other[1])} = ${through(e, n, other)}.\n\nNo path can use both tiles, because one is further right but lower than the other, and a path never goes left or down. So nothing is subtracted twice, and the answer is ${paths(e, n)} − ${through(e, n, point)} − ${through(e, n, other)} = **${answer}**.\n\nThe common slip is subtracting only one of the two broken tiles.`;
};

const solverFor = (p: Params): string => {
  const blocked: Point[] =
    p.mode === 'avoid'
      ? [p.point]
      : p.mode === 'avoid-two'
        ? [p.point, p.other]
        : [];
  const lines = [
    `const east = ${p.east};`,
    `const north = ${p.north};`,
    `const blocked = new Set(${JSON.stringify(blocked.map(([x, y]) => `${x},${y}`))});`,
    'const run = (fromX, fromY, toX, toY) => {',
    '  const grid = [];',
    '  for (let x = fromX; x <= toX; x++) {',
    '    grid[x] = [];',
    '    for (let y = fromY; y <= toY; y++) {',
    '      if (blocked.has(`${x},${y}`)) {',
    '        grid[x][y] = 0;',
    '      } else if (x === fromX && y === fromY) {',
    '        grid[x][y] = 1;',
    '      } else {',
    '        const left = x > fromX ? grid[x - 1][y] : 0;',
    '        const below = y > fromY ? grid[x][y - 1] : 0;',
    '        grid[x][y] = left + below;',
    '      }',
    '    }',
    '  }',
    '  return grid[toX][toY];',
    '};'
  ];
  if (p.mode === 'via') {
    return [
      ...lines,
      `const [px, py] = [${p.point[0]}, ${p.point[1]}];`,
      'return run(0, 0, px, py) * run(px, py, east, north);'
    ].join('\n');
  }
  return [...lines, 'return run(0, 0, east, north);'].join('\n');
};

const HINTS: Record<Mode, string[]> = {
  via: [
    'A path is a string of right moves and up moves: how many of each does a path to the marked tile need?',
    'How many paths lead from the start to the marked tile, and how many from the marked tile on to the end?',
    'Since every path to the marked tile can be followed by every path from it, should you add the two counts or combine them another way?'
  ],
  avoid: [
    'A path is a string of right moves and up moves: how many moves does a path to the end have, and how many of them go right?',
    'How many paths are there if no tile is broken?',
    'How many of those paths step on the broken tile, counting the part before it and the part after it?'
  ],
  'avoid-two': [
    'A path is a string of right moves and up moves: how many moves does a path to the end have, and how many of them go right?',
    'How many paths step on each of the two broken tiles, counting the part before it and the part after it?',
    'Could a single path step on both broken tiles? What does that tell you about subtracting them?'
  ]
};

const build = (p: Params, rng: Rng) => {
  const actor = rng.pick(ACTORS)[p.mode];
  return {
    difficulty: 3,
    title: actor.title,
    prompt: promptFor(p, actor),
    answer: numberAnswer(answerFor(p)),
    hints: HINTS[p.mode],
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['counting', 'paths', 'grids']
  };
};

const key = (p: Params): string =>
  [
    p.mode,
    `${p.east}x${p.north}`,
    p.point.join('.'),
    ...(p.mode === 'avoid-two' ? [p.other.join('.')] : [])
  ].join('-');

export const gridPaths = defineFamily<Params>({
  id: 'math/grid-paths',
  area: 'math',
  slot: 'daily',
  group: (p) => p.mode,
  params: () => keepFair(CANDIDATES, build),
  key,
  build
});
