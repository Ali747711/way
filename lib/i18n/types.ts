import type { Area } from '@/lib/areas';

/** Interface languages. Problem content has its own (see content.ts). */
export type Locale = 'en' | 'uz';

/** A display heading with one accent word drawn in red. */
export interface AccentedText {
  lead: string;
  accent: string;
  tail: string;
}

/** The About intro: three paragraphs in every language. */
export type AboutIntro = readonly [string, string, string];

/** The seven principles, in order, in every language. */
export type Principles = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

/** How a mark on the set strip is read out. */
export type SpokenStatus = 'solved' | 'gave_up' | 'failed' | 'open' | 'current';

/**
 * Every piece of interface text. Members are strings, or small functions
 * where a number goes into the text. Each locale's messages are typed
 * against this, so a missing key fails the type check.
 */
export interface Messages {
  meta: {
    title: string;
    description: string;
    deepTitle: string;
    aboutTitle: string;
  };
  areas: Record<Area, string>;
  problem: {
    /** Position in the set, 1-based. */
    position: (index: number, total: number) => string;
    hint: (step: number, max: number) => string;
    submit: string;
    run: string;
    giveUp: string;
    next: string;
    report: string;
  };
  outcome: {
    solved: string;
    wrong: string;
    failed: string;
    gave_up: string;
    attemptsLeft: (n: number) => string;
    strongAnswer: string;
  };
  giveUp: {
    question: string;
    confirm: string;
    keepTrying: string;
  };
  code: {
    timedOut: string;
    passed: (passed: number, total: number) => string;
    input: string;
    expected: string;
    error: string;
    actual: string;
  };
  answer: {
    wordCount: (n: number) => string;
    exactWords: (n: number) => string;
    wordRange: (min: number, max: number) => string;
    atLeastWords: (n: number) => string;
    atMostWords: (n: number) => string;
    enterNumber: string;
    typeFirst: string;
    pickFirst: string;
  };
  set: {
    label: string;
    status: Record<SpokenStatus, string>;
    mark: (area: string, status: string) => string;
  };
  done: {
    title: AccentedText;
    summary: (
      solved: number,
      total: number,
      hints: number,
      minutes: number
    ) => string;
    deepLink: string;
    comeBack: string;
  };
  areaMap: {
    never: string;
    today: string;
    daysAgo: (n: number) => string;
  };
  deep: {
    badge: string;
    title: AccentedText;
    backToToday: string;
  };
  noSet: {
    today: string;
    week: string;
    about: string;
  };
  about: {
    intro: AboutIntro;
    /** A line under the intro about the problems' language, if any. */
    contentNote: string | null;
    principlesHeading: string;
    principles: Principles;
    backToToday: string;
    source: string;
  };
  notFound: {
    /** Shown under the 404 status; the page title is `404: <message>`. */
    message: string;
  };
  language: {
    /** Names the language switch for assistive technology. */
    label: string;
  };
}
