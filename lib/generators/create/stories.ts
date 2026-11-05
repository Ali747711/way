import { defineCreateFamily, type CreateItem } from './define';

/** Short fiction, dialogue and play with sound, where the rule shapes the voice. */
export const STORY_ITEMS: readonly CreateItem[] = [
  {
    key: 'goldfish-cat-questions',
    difficulty: 4,
    title: 'A goldfish and a cat, in questions',
    task: 'Write the conversation between a goldfish and a cat who are staring at each other through the glass of the tank. Label each line with who is speaking.',
    minWords: 30,
    maxWords: 80,
    constraints: [
      { type: 'all-questions' },
      { type: 'sentence-count', count: 6 }
    ],
    authorNote:
      'When nobody can state anything, each question has to carry a hint of an opinion. A strong answer gives the two a real contrast (the cat is hungry, the fish is calm), makes each question answer the last one, and lets the last line be the sharpest.',
    hints: [
      'What does each animal want, and which question reveals it without saying it?',
      'How could each reply mirror the question before it, so that they sound like a real argument?',
      'Which animal gets the last question, and does it win?'
    ],
    example:
      'Cat: Do you ever get tired of swimming in circles? Fish: Do you ever get tired of sitting on the edge of things? Cat: Is that a fish, or a very small orange opinion? Fish: Is that a cat, or a long wait for dinner? Cat: Would you come out if I asked nicely? Fish: Would you come in if I asked nicely?',
    whyItWorks:
      'Each reply copies the shape of the question and turns it around, which is how a real taunt works. The fish wins on the last line, calmly, from behind glass.',
    tags: ['constraint', 'dialogue', 'humour']
  },
  {
    key: 'one-sentence-bridge-story',
    difficulty: 4,
    title: 'A whole story in one sentence',
    task: 'Tell a whole story, with a beginning, a middle and an end, in a single sentence.',
    minWords: 25,
    maxWords: 70,
    constraints: [
      { type: 'sentence-count', count: 1 },
      { type: 'must-include', words: ['bridge', 'promise'] }
    ],
    authorNote:
      'One sentence has to move through time, so a strong answer leans on clauses that carry the story along (when, yet, and, until). It sets up a person, a goal and a cost, and the last clause lands a small surprise that changes what the promise meant.',
    hints: [
      'Who makes the promise, and what does it cost them?',
      'Which small words (when, yet, until) can carry the story from the start to the end?',
      'What could the last clause reveal that changes what the bridge was for?'
    ],
    example:
      'When the old ferryman made a promise to build a bridge before he died, nobody believed him, yet he laid one plank each morning for forty years, and when the last plank went down the whole village crossed to thank him, only to see him rowing home the old way, because he had never trusted bridges.',
    whyItWorks:
      'The sentence has a clear beginning, middle and end. The last clause turns the story: the man who kept a forty-year promise to everyone else still trusts only his boat.',
    tags: ['constraint', 'micro-story', 'one-sentence']
  },
  {
    key: 'late-train-no-s',
    difficulty: 3,
    title: 'The late train, with no S',
    task: 'Write a tiny story about someone waiting on a platform for a train that is very late.',
    minWords: 25,
    maxWords: 70,
    constraints: [{ type: 'no-letter', letter: 's' }],
    authorNote:
      'The letter *s* hides in plurals, in *is* and *was*, and in *she* and *his*. A strong answer plans around it: past-tense verbs, names in place of pronouns, singular nouns. It still has a small turn, so the story is more than a puzzle solved.',
    hints: [
      'Which small words that you use all the time contain an *s*, and what can stand in for them?',
      'If you write in the past tense about one named person, how many *s* words do you avoid?',
      'What small change in the person could end the story, so it is more than a list of waiting?'
    ],
    example:
      "Nan, a tall woman in a grey coat, waited on the platform. Eight o'clock came and went, and no train. Nan read the board, then read it again. Nine o'clock came and went too. Nan grinned, took out a novel, and began to enjoy the wait.",
    whyItWorks:
      'The story gives its character a name to avoid *she*, and keeps to the past tense. The turn is quiet: waiting stops being a problem, and the lack of any *s* is never mentioned.',
    tags: ['constraint', 'micro-story', 'no-letter']
  },
  {
    key: 'weather-odd-things',
    difficulty: 3,
    title: 'Forecast: scattered teaspoons',
    task: 'Write the weather report for a town where odd things fall from the sky. Read it in the calm voice of a presenter.',
    minWords: 30,
    maxWords: 70,
    constraints: [{ type: 'alphabet-run', from: 'n' }],
    authorNote:
      "A strong answer keeps the presenter's even tone while the forecast gets stranger, and lets the alphabet run fade into the background. The best ones follow the day (morning, lunchtime, evening) and finish with a piece of calm advice.",
    hints: [
      'What does a real forecast cover, in order, through a day?',
      'What is the oddest thing that could fall, said in the plainest possible voice?',
      'What calm advice would the presenter give to the town at the end?'
    ],
    example:
      'Nobody should be alarmed by the light shower of teaspoons this morning. Over lunchtime, expect scattered buttons, heavier near the river. Pillows are forecast for the evening, so keep your windows open. Quite possibly, a single large sofa will land on the town hall. Residents are asked to wave politely and carry on.',
    whyItWorks:
      'The voice never panics, so every impossible detail sounds routine. The letters N to R are carried by ordinary forecast phrases (*over lunchtime*, *pillows are forecast*, *quite possibly*).',
    tags: ['constraint', 'alphabet', 'humour']
  },
  {
    key: 'early-bakery-twister',
    difficulty: 4,
    title: 'A tongue twister for an early bakery',
    task: 'Write a tongue twister about a bakery that opens far too early in the morning.',
    minWords: 10,
    maxWords: 25,
    constraints: [
      { type: 'same-start', letter: 'b' },
      { type: 'sentence-count', count: 2 }
    ],
    authorNote:
      'With only one starting letter, a writer has to hunt for *b* words that still make a picture. A strong answer has real sense (who, where, when) and a bounce in the rhythm, so it is fun to read aloud, even when it is hard to say.',
    hints: [
      'Which *b* words describe the people, the place and the time of day?',
      'How can you avoid small words like *the* and *a*, which do not start with *b*?',
      'Does it make you stumble when you say it aloud, in a good way?'
    ],
    example:
      'Bleary bakers bang big brass bowls before breakfast, banishing bedtime. Bakery bells buzz, batter bubbles, bread blooms boldly.',
    whyItWorks:
      'The first line gives a scene (tired bakers, loud bowls, too early). The second line adds sounds and smells in short bursts, and the pile of *b* sounds makes it a true twister.',
    tags: ['constraint', 'wordplay', 'same-start']
  },
  {
    key: 'small-dragon-bedtime',
    difficulty: 3,
    title: 'A bedtime story for a small dragon',
    task: 'Write a bedtime story for a small dragon who is afraid of the dark. The word *dragon* is itself too long to use, so give the hero a name.',
    minWords: 30,
    maxWords: 80,
    constraints: [{ type: 'max-word-length', letters: 5 }],
    authorNote:
      'Short words make a soothing, steady voice, so a strong answer lets the limit help the mood. It gives a small fear, a small helper and a small change in how the hero sees the dark, and it ends on rest.',
    hints: [
      'What short name and short word for a creature can replace *dragon*?',
      'Who or what helps the hero look at the dark in a new way?',
      'How can the last sentence feel like falling asleep?'
    ],
    example:
      'Ember was a small beast who hid from the dark. Each night, she hid under one wing and shook. Then a moth came by and said, "Look up." She did. The sky was full of tiny lamps, just like her own warm flame. Now she naps with one eye on the stars, and the dark is just a big, soft room.',
    whyItWorks:
      'Every word is short, which makes the story sound like a lullaby. The moth offers one gentle idea (the dark is full of lamps), and the ending turns the fear into a soft room.',
    tags: ['constraint', 'bedtime', 'max-word-length']
  },
  {
    key: 'empty-house-three-sentences',
    difficulty: 4,
    title: 'The empty house in three sentences',
    task: 'Write a very short ghost story about a house that everyone says is empty.',
    minWords: 18,
    maxWords: 18,
    constraints: [
      { type: 'sentence-count', count: 3 },
      { type: 'sentence-words', words: 6 }
    ],
    authorNote:
      'Three sentences of six words leave no space for decoration, so a strong answer lets one plain, concrete detail do the frightening. The first line sets up a claim, the second breaks it, and the last leaves the reader to finish the thought.',
    hints: [
      'What does everyone claim about the house, in six words?',
      'What is one ordinary object that would be most unsettling in an empty house?',
      'Can the last sentence stop just before it explains?'
    ],
    example:
      'The house was empty, they said. Yet someone had laid the table. Four places, and one cup steaming.',
    whyItWorks:
      'The claim, the contradiction and the detail each take one short line. Four places and one steaming cup suggest a guest who has only just left, and the story stops before it says so.',
    tags: ['constraint', 'micro-story', 'ghost']
  },
  {
    key: 'thank-you-no-thanks',
    difficulty: 3,
    title: 'A thank-you note without the words',
    task: 'A stranger found your lost wallet, cash and all, and posted it back with only a return address on the envelope. Write them a thank-you note, without using the words that usually do the job.',
    minWords: 30,
    maxWords: 70,
    constraints: [
      {
        type: 'forbid-words',
        words: [
          'thank',
          'thanks',
          'thankful',
          'grateful',
          'gratitude',
          'appreciate'
        ]
      }
    ],
    authorNote:
      'Gratitude is strongest when it is specific, and the banned words force that. A strong answer names what came back, what the stranger could have done instead, and what the writer would now like to give, so the thanks is felt, not announced.',
    hints: [
      'What exactly was in the wallet, and what did it mean to you?',
      'What could the stranger have done, and what did they do instead?',
      'What would you like to give back, and how can you say it without sounding stiff?'
    ],
    example:
      'Dear stranger, I opened the envelope and found my whole week folded inside: the bus pass, the photo, the coupon I will never use. You could have kept every bit of it. Instead you licked a stamp and walked to a postbox. I owe you a coffee, a favour, and a slightly better opinion of everyone.',
    whyItWorks:
      'The note lists what came back and shows the small, deliberate effort the stranger chose to make, so the kindness is clear. The last line says what the gift changed, which is better than any single word of thanks.',
    tags: ['constraint', 'letter', 'gratitude']
  }
];

export const stories = defineCreateFamily('create/stories', STORY_ITEMS);
