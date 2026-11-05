import { defineCreateFamily, type CreateItem } from './define';

export const CONSTRAINED_ITEMS: readonly CreateItem[] = [
  {
    key: 'cat-apology',
    difficulty: 4,
    title: 'A cat says sorry, alphabetically',
    task: "Write the apology a cat would give after knocking its owner's favourite plant off the shelf.",
    minWords: 25,
    maxWords: 70,
    constraints: [
      { type: 'sentence-count', count: 5 },
      { type: 'alphabet-run', from: 'a' }
    ],
    authorNote:
      'A strong answer keeps the alphabet invisible: each opening word feels chosen for the voice, not forced by the letter. It also stays in character. A cat apologises without ever admitting fault, and the last sentence turns the apology into something else.',
    hints: [
      'Which excuses would a proud cat give, and which would it never admit to?',
      'For each letter from A to E, which opening word could start a sentence naturally, so the alphabet does not show?',
      'Can your last sentence turn the apology into something that is not really an apology at all?'
    ],
    example:
      'A plant fell, and I watched it go. Before you shout, consider the angle of the sun. Clearly the pot wanted to be lower. Dirt on the rug is a fresh pattern, really. Every great artist starts with one bold mess.',
    whyItWorks:
      'Each sentence begins with the next letter (A, Before, Clearly, Dirt, Every), yet every opening reads as a natural choice. The cat never once says sorry, and the final line reframes the mess as art, which is the joke.',
    tags: ['constraint', 'voice']
  }
];

export const constrained = defineCreateFamily(
  'create/constrained',
  CONSTRAINED_ITEMS
);
