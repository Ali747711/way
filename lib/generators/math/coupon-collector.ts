import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { gcd, keepFair, numberAnswer } from './shared';

interface Params {
  /** How many items of each colour the bag holds. */
  counts: readonly number[];
}

const COLOURS = ['red', 'blue', 'green', 'yellow'] as const;

const CANDIDATES: readonly Params[] = [
  { counts: [2, 1, 1] },
  { counts: [3, 1, 1] },
  { counts: [2, 2, 1] },
  { counts: [3, 2, 1] },
  { counts: [2, 1, 1, 1] },
  { counts: [3, 1, 1, 1] }
];

interface Fraction {
  p: number;
  q: number;
}

const reduce = ({ p, q }: Fraction): Fraction => {
  const g = gcd(Math.abs(p), q);
  return { p: p / g, q: q / g };
};
const add = (a: Fraction, b: Fraction): Fraction =>
  reduce({ p: a.p * b.q + b.p * a.q, q: a.q * b.q });
const sub = (a: Fraction, b: Fraction): Fraction =>
  reduce({ p: a.p * b.q - b.p * a.q, q: a.q * b.q });
const mul = (a: Fraction, b: Fraction): Fraction =>
  reduce({ p: a.p * b.p, q: a.q * b.q });
const div = (a: Fraction, b: Fraction): Fraction =>
  reduce({ p: a.p * b.q, q: a.q * b.p });
const whole = (n: number): Fraction => ({ p: n, q: 1 });

const total = (counts: readonly number[]): number =>
  counts.reduce((a, b) => a + b, 0);

/** Weight of the colours in a set (bit i is colour i). */
const weight = (counts: readonly number[], mask: number): number =>
  counts.reduce((sum, w, i) => sum + (mask & (1 << i) ? w : 0), 0);

/**
 * Inclusion-exclusion (the min-max formula): the average wait to see every
 * colour is the sum over non-empty sets J of (-1)^(|J|+1) / P(J).
 */
const expected = ({ counts }: Params): Fraction => {
  let result = whole(0);
  const full = (1 << counts.length) - 1;
  for (let mask = 1; mask <= full; mask++) {
    const size = counts.filter((_, i) => mask & (1 << i)).length;
    const term: Fraction = { p: total(counts), q: weight(counts, mask) };
    result = size % 2 === 1 ? add(result, term) : sub(result, term);
  }
  return result;
};

export const answerFor = (params: Params): number => {
  const { p, q } = reduce(expected(params));
  return p + q;
};

const names = (counts: readonly number[]): readonly string[] =>
  COLOURS.slice(0, counts.length);

const describe = (counts: readonly number[]): string => {
  const parts = counts.map((c, i) => `${c} ${COLOURS[i]}`);
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
};

interface Story {
  title: string;
  text: (p: Params) => string;
}

const STORIES: readonly Story[] = [
  {
    title: 'A bag with uneven colours',
    text: (p) =>
      `A bag holds ${total(p.counts)} marbles: ${describe(p.counts)}. One marble is drawn at random, its colour is noted, and it is put back; then the bag is shaken and the draw repeats. Every marble is equally likely on every draw.\n\nOn average, how many draws are needed until every colour has been seen at least once? Written as a fraction p/q in lowest terms, what is p + q?`
  },
  {
    title: 'Drawing every colour',
    text: (p) =>
      `A jar holds ${total(p.counts)} beads: ${describe(p.counts)}. A bead is picked without looking, its colour is noted and it goes back in the jar, which is then shaken. Every bead is equally likely each time.\n\nOn average, how many picks does it take until you have seen all the colours? The average is a fraction p/q in lowest terms. What is p + q?`
  },
  {
    title: 'The rare colour',
    text: (p) =>
      `A box holds ${total(p.counts)} counters: ${describe(p.counts)}. A counter is taken out at random, its colour is written down and it is put back. Each counter is equally likely each time.\n\nOn average, how many draws until every colour has been written down at least once? Give the average as p/q in lowest terms and find p + q.`
  }
];

const label = (counts: readonly number[], mask: number): string =>
  names(counts)
    .filter((_, i) => mask & (1 << i))
    .join(' + ');

const fractionText = ({ p, q }: Fraction): string =>
  q === 1 ? String(p) : `${p}/${q}`;

/** Average further draws from each set of seen colours, worked backwards. */
const states = (counts: readonly number[]): Map<number, Fraction> => {
  const m = total(counts);
  const full = (1 << counts.length) - 1;
  const e = new Map<number, Fraction>([[full, whole(0)]]);
  for (let mask = full - 1; mask >= 0; mask--) {
    let top = whole(m);
    counts.forEach((w, i) => {
      if (!(mask & (1 << i))) {
        top = add(top, mul(whole(w), e.get(mask | (1 << i)) as Fraction));
      }
    });
    e.set(mask, div(top, whole(m - weight(counts, mask))));
  }
  return e;
};

const tableLines = (counts: readonly number[]): string => {
  const e = states(counts);
  const full = (1 << counts.length) - 1;
  const m = total(counts);
  const masks = Array.from({ length: full - 1 }, (_, i) => full - 1 - i);
  return masks
    .map((mask) => {
      const w = weight(counts, mask);
      return `- ${label(counts, mask)} seen: a draw repeats a seen colour with chance ${w}/${m}; average further draws **${fractionText(e.get(mask) as Fraction)}**`;
    })
    .join('\n');
};

const solutionFor = (params: Params): string => {
  const { counts } = params;
  const m = total(counts);
  const result = reduce(expected(params));
  const answer = result.p + result.q;
  const e = states(counts);
  const singles = counts.reduce((acc, w) => acc + m / w, 0);
  const rarest = m / Math.min(...counts);
  const start = counts
    .map((w, i) => `${w}/${m} × ${fractionText(e.get(1 << i) as Fraction)}`)
    .join(' + ');
  return `**${answer}.**\n\n**Stage 1: the chances.** The ${m} items are equally likely, so the chances of the colours are ${counts.map((w, i) => `${COLOURS[i]} ${w}/${m}`).join(', ')}. They are not equal, so the wait for a new colour depends on which colours you have already seen, not just how many.\n\n**Stage 2: one waiting time.** If each draw succeeds with chance s, the average number of draws up to and including the first success is 1/s. To see why, call it E. The first draw succeeds with chance s; otherwise one draw is spent and the wait starts again, so E = 1 + (1 − s) × E, which gives E = 1/s.\n\n**Stage 3: track the colours seen.** Let E(S) be the average number of further draws when the colours in S have been seen. If every colour has been seen, E = 0. Otherwise one draw is spent, and then either a seen colour comes up and nothing changes, or a new colour c comes up with chance p(c) and moves us to the larger set. So E(S) = 1 + P(S) × E(S) + (the sum over new colours c of p(c) × E(S with c)), where P(S) is the chance of a seen colour. Rearranged, E(S) = (1 + the sum of p(c) × E(S with c)) ÷ (1 − P(S)). Working backwards from the finished set, the sets with at least one colour seen give:\n\n${tableLines(counts)}\n\n**Stage 4: the start.** With nothing seen, the first draw always shows a colour, so E = 1 + ${start}. That adds to ${fractionText(result)} draws, in lowest terms, so p + q = ${result.p} + ${result.q} = **${answer}**.\n\n**Why shortcuts fail.** Adding the separate waits for each colour (${counts.map((w) => `${m}/${w}`).join(' + ')} = ${singles}) counts the same draws several times, because the waits run at the same time. Using only the wait for the rarest colour (${rarest}) ignores the other colours. The true average lies between the two, and it cannot be found without tracking which colours are already seen.`;
};

/** Method: exact subset recursion, E(S) = (m + sum of w_c E(S+c)) / (m - W(S)). */
const solverFor = ({ counts }: Params): string =>
  [
    `const counts = ${JSON.stringify(counts)};`,
    'const m = counts.reduce((a, b) => a + b, 0);',
    'const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));',
    'const norm = (n, d) => {',
    '  const g = gcd(Math.abs(n), d);',
    '  return [n / g, d / g];',
    '};',
    'const full = (1 << counts.length) - 1;',
    'const e = new Array(full + 1);',
    'e[full] = [0, 1];',
    'for (let mask = full - 1; mask >= 0; mask--) {',
    '  let top = [m, 1];',
    '  let seen = 0;',
    '  counts.forEach((w, i) => {',
    '    if (mask & (1 << i)) {',
    '      seen += w;',
    '    } else {',
    '      const [n, d] = e[mask | (1 << i)];',
    '      top = norm(top[0] * d + w * n * top[1], top[1] * d);',
    '    }',
    '  });',
    '  e[mask] = norm(top[0], top[1] * (m - seen));',
    '}',
    'return e[0][0] + e[0][1];'
  ].join('\n');

const HINTS = [
  'If you have seen only some of the colours, what is the chance that the next draw shows a colour you have not seen yet, and does it depend only on how many colours you have seen?',
  'If every draw has the same chance s of success, how many draws does it take on average to get the first success?',
  'Which sets of colours can you have seen so far, and from each set, which draws move you to a bigger set?',
  'For one set of seen colours, can you write the average number of further draws in terms of the sets you can move to, remembering that a draw showing a seen colour leaves you where you were?',
  'Which set is easiest to deal with, in what order should you work out the others, and which set do you start in?'
];

const build = (params: Params, rng: Rng) => {
  const story = rng.pick(STORIES);
  return {
    difficulty: 5,
    title: story.title,
    prompt: story.text(params),
    answer: numberAnswer(answerFor(params)),
    hints: HINTS,
    solution: solutionFor(params),
    solver: solverFor(params),
    tags: ['probability', 'expected value', 'fractions']
  };
};

export const couponCollector = defineFamily<Params>({
  id: 'math/coupon-collector',
  area: 'math',
  slot: 'deep',
  params: () => keepFair(CANDIDATES, build),
  key: ({ counts }) => counts.join('-'),
  build
});
