import type { Messages } from './types';

// The English interface. Tests and the e2e suite read these strings, so
// change them on purpose only.
export const en: Messages = {
  meta: {
    title: 'Way',
    description: 'A finite daily set of problems',
    deepTitle: 'Way · Deep',
    aboutTitle: 'Way · About'
  },
  areas: {
    words: 'Words',
    logic: 'Logic',
    math: 'Math',
    code: 'Code',
    create: 'Create'
  },
  problem: {
    position: (index, total) => `${index} of ${total}`,
    hint: (step, max) => `Hint ${step} of ${max}`,
    submit: 'Submit',
    run: 'Run',
    giveUp: 'Give up',
    next: 'Next',
    report: 'Report a problem'
  },
  outcome: {
    solved: 'Solved',
    wrong: 'Not quite',
    failed: 'Out of attempts',
    gave_up: 'The solution',
    attemptsLeft: (n) => (n === 1 ? '1 attempt left' : `${n} attempts left`),
    strongAnswer: 'What a strong answer does'
  },
  giveUp: {
    question: "Show the solution? You can't retry today.",
    confirm: 'Show solution',
    keepTrying: 'Keep trying'
  },
  code: {
    timedOut: 'Timed out',
    passed: (passed, total) => `passed ${passed} of ${total}`,
    input: 'Input:',
    expected: 'Expected:',
    error: 'Error:',
    actual: 'Actual:'
  },
  answer: {
    wordCount: (n) => `${n} ${n === 1 ? 'word' : 'words'}`,
    exactWords: (n) => `Use exactly ${n} words.`,
    wordRange: (min, max) => `Use ${min}–${max} words.`,
    atLeastWords: (n) => `Use at least ${n} words.`,
    atMostWords: (n) => `Use at most ${n} words.`,
    enterNumber: 'Enter a number.',
    typeFirst: 'Type an answer first.',
    pickFirst: 'Pick an option first.'
  },
  set: {
    label: "Today's set",
    // Worded apart from the outcome headings so the page never shows those
    // phrases twice.
    status: {
      solved: 'solved',
      gave_up: 'gave up',
      failed: 'not solved',
      open: 'not started',
      current: 'current'
    },
    mark: (area, status) => `${area}, ${status}`
  },
  done: {
    title: { lead: "That's ", accent: 'today.', tail: '' },
    summary: (solved, total, hints, minutes) =>
      `Solved ${solved} of ${total} · ${hints} hints · ${minutes} min`,
    deepLink: "This week's deep problem",
    comeBack: 'Come back tomorrow.'
  },
  areaMap: {
    never: 'never',
    today: 'last: today',
    daysAgo: (n) => (n === 1 ? 'last: 1 day ago' : `last: ${n} days ago`)
  },
  deep: {
    badge: 'Deep',
    title: { lead: "That's ", accent: 'this week.', tail: '' },
    backToToday: 'Back to today'
  },
  noSet: {
    today: 'Nothing scheduled for today.',
    week: 'Nothing scheduled for this week.',
    about: 'About Way'
  },
  about: {
    intro: [
      'Way is a free web app that replaces late-night scrolling with short bursts of real thinking. Each day it offers a small, finite set of problems across different areas, solved one at a time.',
      'Hints only ask questions. The answer appears only after you commit. When the set is done, Way says so and stops.',
      'It exists because AI has made thinking optional, and the effortful parts of life (reading, reasoning, searching, discussing) stop getting exercised. The fixes that mean leaving the device fail for people who live on devices, so Way lives inside screen time and replaces the content. It is an AI-era product whose point is to make people think more, not less.'
    ],
    contentNote: null,
    principlesHeading: 'Principles',
    principles: [
      'Ten seconds to thinking.',
      'One problem at a time.',
      'The set ends.',
      'Coach, not oracle.',
      'Variety over depth, daily.',
      'No guilt.',
      'Free, no ads, no paywall, no data harvesting.'
    ],
    backToToday: 'Back to today',
    source: 'Source on GitHub'
  },
  // Next's default 404 wording, kept from before the routes moved into
  // per-language root layouts.
  notFound: {
    title: '404: This page could not be found.',
    status: '404',
    message: 'This page could not be found.'
  }
};
