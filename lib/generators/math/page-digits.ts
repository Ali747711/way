import { defineFamily } from '../family';
import type { Rng } from '../rng';

import { keepFair, numberAnswer } from './shared';

type Mode = 'digits' | 'pages';

interface Params {
  mode: Mode;
  /** Number of pages in the book. */
  pages: number;
}

const DIGIT_PAGES = [120, 135, 148, 175, 210, 234, 267, 312, 405, 487];
const PAGE_COUNTS = [112, 126, 159, 188, 223, 275, 306, 354, 428, 1040];

/** Digits printed for pages 1 to n, by place-value blocks. */
const digitsFor = (n: number): number => {
  let total = 0;
  for (let width = 1, low = 1; low <= n; width++, low *= 10) {
    const high = Math.min(n, low * 10 - 1);
    total += (high - low + 1) * width;
  }
  return total;
};

export const answerFor = ({ mode, pages }: Params): number =>
  mode === 'digits' ? digitsFor(pages) : pages;

const DIGIT_STORIES: readonly ((n: number) => {
  title: string;
  text: string;
})[] = [
  (n) => ({
    title: 'Numbering a book',
    text: `A printer numbers the pages of a book from 1 to ${n}, printing one number on each page. Page 7 gets the single digit 7, and page 120 gets three digits.\n\nHow many digits does the printer use in total?`
  }),
  (n) => ({
    title: 'Stamping the page numbers',
    text: `A clerk stamps a number on every page of a ledger, from page 1 up to page ${n}. A stamp for page 45 uses two digit stamps.\n\nHow many digit stamps are used for the whole ledger?`
  }),
  (n) => ({
    title: 'Ink for the page numbers',
    text: `A book has ${n} pages, numbered 1, 2, 3 and so on up to ${n}. Each digit printed in a page number takes one tiny drop of ink.\n\nHow many drops of ink are needed for all the page numbers?`
  })
];

const PAGE_STORIES: readonly ((total: number) => {
  title: string;
  text: string;
})[] = [
  (d) => ({
    title: 'How long is the book?',
    text: `A printer numbers the pages of a book starting at 1, one number per page, and uses ${d} digits in total.\n\nHow many pages does the booklet have?`
  }),
  (d) => ({
    title: 'Counting pages from digits',
    text: `The page numbers of a ledger run 1, 2, 3 and so on, with nothing skipped. Printing all of them took ${d} digit stamps.\n\nHow many pages are in the ledger?`
  }),
  (d) => ({
    title: 'Counting back the pages',
    text: `A book's page numbers start at 1 and go up one at a time to the last page. Printing every page number took exactly ${d} digits.\n\nHow many pages does the book have?`
  })
];

const blocks = (n: number): string[] => {
  const out: string[] = [];
  for (let width = 1, low = 1; low <= n; width++, low *= 10) {
    const high = Math.min(n, low * 10 - 1);
    const count = high - low + 1;
    out.push(
      `- ${width}-digit pages (${low} to ${high}): ${count} pages × ${width} = ${count * width} digits`
    );
  }
  return out;
};

const solutionFor = ({ mode, pages }: Params): string => {
  const total = digitsFor(pages);
  if (mode === 'digits') {
    return `**${total}.**\n\nSplit the pages by how many digits their numbers have:\n\n${blocks(pages).join('\n')}\n\nAdd them up: **${total}** digits.\n\nThe common slip is multiplying ${pages} by the number of digits of the last page. That counts the one-digit and two-digit pages as if they were also that long.`;
  }
  const rows = blocks(pages);
  const full = rows.slice(0, -1);
  const lastWidth = String(pages).length;
  const lastLow = 10 ** (lastWidth - 1);
  const used = digitsFor(lastLow - 1);
  const left = total - used;
  return `**${pages}.**\n\nFirst use up the short pages. Counting complete blocks: ${full.map((r) => r.slice(2)).join('; ')}. That is ${used} digits.\n\nThat leaves ${total} − ${used} = ${left} digits, all in ${lastWidth}-digit page numbers, so there are ${left} ÷ ${lastWidth} = ${left / lastWidth} more pages after page ${lastLow - 1}. The last page is ${lastLow - 1} + ${left / lastWidth} = **${pages}**.\n\nThe common slip is dividing ${total} by ${lastWidth} straight away. That treats every page as having a ${lastWidth}-digit number, including pages 1 to 9.`;
};

const solverFor = ({ mode, pages }: Params): string =>
  mode === 'digits'
    ? [
        'let digits = 0;',
        `for (let page = 1; page <= ${pages}; page++) {`,
        '  digits += String(page).length;',
        '}',
        'return digits;'
      ].join('\n')
    : [
        'let digits = 0;',
        'for (let page = 1; page <= 100000; page++) {',
        '  digits += String(page).length;',
        `  if (digits === ${digitsFor(pages)}) return page;`,
        `  if (digits > ${digitsFor(pages)}) return NaN;`,
        '}',
        'return NaN;'
      ].join('\n');

const HINTS: Record<Mode, string[]> = {
  digits: [
    'Do all page numbers use the same number of digits?',
    'How many pages have a one-digit number, how many have a two-digit number, and how many are left?',
    'How many digits does each of those groups of pages use, and what is the total?'
  ],
  pages: [
    'Do all page numbers use the same number of digits?',
    'How many digits are used up by the pages with one-digit numbers, and then by the pages with two-digit numbers?',
    'How many digits are left over for the longer numbers, and how many pages is that?'
  ]
};

const build = (p: Params, rng: Rng) => {
  const story =
    p.mode === 'digits'
      ? rng.pick(DIGIT_STORIES)(p.pages)
      : rng.pick(PAGE_STORIES)(digitsFor(p.pages));
  return {
    difficulty: 3,
    title: story.title,
    prompt: story.text,
    answer: numberAnswer(answerFor(p)),
    hints: HINTS[p.mode],
    solution: solutionFor(p),
    solver: solverFor(p),
    tags: ['counting', 'place value', 'digits']
  };
};

const params = (): Params[] =>
  keepFair(
    [
      ...DIGIT_PAGES.map((pages) => ({ mode: 'digits' as const, pages })),
      ...PAGE_COUNTS.map((pages) => ({ mode: 'pages' as const, pages }))
    ],
    build
  );

export const pageDigits = defineFamily<Params>({
  id: 'math/page-digits',
  area: 'math',
  slot: 'daily',
  group: (p) => p.mode,
  params,
  key: ({ mode, pages }) => `${mode}-${pages}`,
  build
});
