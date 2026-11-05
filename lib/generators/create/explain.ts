import { defineCreateFamily, type CreateItem } from './define';

/** A real idea, explained to a child under one rule that forces clear thinking. */
export const EXPLAIN_ITEMS: readonly CreateItem[] = [
  {
    key: 'sky-blue-questions',
    difficulty: 3,
    title: 'Why the sky is blue, in questions',
    task: 'Explain to a curious five-year-old why the sky is blue. Walk them to the answer one question at a time, so that they could nearly say it themselves.',
    minWords: 30,
    maxWords: 90,
    constraints: [{ type: 'all-questions' }],
    authorNote:
      'A strong answer builds the idea in the right order: sunlight hides every colour, the air scatters light, blue scatters most, so blue comes from all over the sky. Each question should set up the next, so that the child feels clever, not tested. The idea has to stay true, even when it is simple.',
    hints: [
      'What is the first surprising thing about sunlight that a child could picture?',
      'What does light run into on its way down, and what happens to it there?',
      'Which question leads the child to look up and see the answer for themselves?'
    ],
    example:
      'Do you know that sunlight looks white but hides every colour inside? What happens when that light runs into the air, which is full of tiny, tiny bits? Does the short, wiggly blue light get bounced around more than the long, lazy red light? And if blue light is bouncing everywhere, where would you have to look to see it?',
    whyItWorks:
      'The four questions follow the real order of the explanation: mixed light, scattering, why blue wins, and what we see. The last question hands the answer back to the child, who only has to look up.',
    tags: ['constraint', 'explain', 'science']
  },
  {
    key: 'vaccine-practice',
    difficulty: 4,
    title: 'How a vaccine trains the body',
    task: 'Explain to a child how a vaccine trains the body to fight a germ. Be accurate: the vaccine cannot give you the illness, and the body must really learn something.',
    minWords: 40,
    maxWords: 90,
    constraints: [
      { type: 'must-include', words: ['practice'] },
      {
        type: 'forbid-words',
        words: [
          'immune',
          'immunity',
          'antibody',
          'antibodies',
          'virus',
          'viruses'
        ]
      }
    ],
    authorNote:
      'Banning the jargon forces an image, and a strong answer picks one and keeps to it: guards, a wanted poster, a training drill. It makes clear that the vaccine cannot give you the illness, that the body remembers, and that the real germ meets a body that is ready.',
    hints: [
      "What image from a child's world also involves practising for something that has not happened yet?",
      'How can you say that the vaccine is safe, without any scary words?',
      'What does the body do on the day the real germ turns up, and why is it faster?'
    ],
    example:
      'Imagine your body has a team of guards. A vaccine shows them a harmless picture of a germ, like a wanted poster, so they can get some practice spotting it. It cannot give you the illness, and the guards remember the face. Later, if the real germ ever turns up, the guards know it at once and chase it out before it can make you badly ill.',
    whyItWorks:
      'One image carries the whole idea: the poster is the vaccine, the guards are the body, and remembering the face is learning. It is simple, and it is still true to how the body responds.',
    tags: ['constraint', 'explain', 'science']
  },
  {
    key: 'ice-floats-explained',
    difficulty: 3,
    title: 'Why ice floats',
    task: 'Explain to a seven-year-old why ice floats on water, even though ice is made of water.',
    minWords: 25,
    maxWords: 60,
    constraints: [{ type: 'sentence-count', count: 3 }],
    authorNote:
      'Three sentences leave room for one cause and its effect. A strong answer says what is odd about freezing (the water spreads into a roomier pattern), what follows from that (more room, same stuff, so lighter for its size), and then gives an everyday picture to hold on to.',
    hints: [
      'What changes about the tiny pieces of water when it freezes?',
      'If the same water takes up more room, what happens to how heavy it feels for its size?',
      'What everyday object floats because it is light for its size?'
    ],
    example:
      'When water freezes, its tiny pieces lock into a roomy, open pattern with empty gaps in between. Those gaps make a block of ice take up more room than the same water did. Bigger and lighter for its size, the ice has to sit on top, like a beach ball in a bath.',
    whyItWorks:
      'Each sentence does one job: what freezing does, why that matters, and a picture to remember. The beach ball makes the idea something a child can hold.',
    tags: ['constraint', 'explain', 'science']
  },
  {
    key: 'tides-acrostic',
    difficulty: 3,
    title: 'The tide, spelled out',
    task: 'Explain to a child why the sea rises and falls along the shore each day.',
    minWords: 30,
    maxWords: 80,
    constraints: [{ type: 'acrostic', word: 'tide' }],
    authorNote:
      'The acrostic gives the explanation a spine of four steps, so a strong answer plans the steps first (the moon tugs, the free-flowing sea moves most, the ocean swells into two hills, one facing the moon and one on the far side, and the turning Earth carries the shore through both) and only then finds natural opening words. The hidden word should never make a sentence clumsy.',
    hints: [
      'What are the four steps of the idea, in order, before you think about letters?',
      'For each of T, I, D and E, which ordinary opening word would sound natural for that step?',
      'How do you show that the water moves while the shore stays still?'
    ],
    example:
      'The moon is far away, but it still tugs on everything on Earth. It moves the sea the most, because water is free to flow. Drawn and stretched by the moon, the ocean bulges into two low hills, one on each side of the planet. Every day the Earth spins your beach through both hills, so the sea rises and falls twice, and that is the tide.',
    whyItWorks:
      'The four sentences are the four steps of the real explanation, and the first letters spell the topic without strain. The word *tide* is saved for the last line, so the reader earns it.',
    tags: ['constraint', 'explain', 'acrostic']
  },
  {
    key: 'seasons-forty-words',
    difficulty: 4,
    title: 'Seasons in forty words',
    task: 'Explain to a child why we have summer and winter. The cause is not how far the Earth is from the sun.',
    minWords: 40,
    maxWords: 40,
    constraints: [
      { type: 'sentence-count', count: 5 },
      { type: 'sentence-words', words: 8 }
    ],
    authorNote:
      'Five sentences of exactly eight words leave no room for waffle. A strong answer picks the one true cause (the tilt of the Earth), shows what it does to each half, and says the halves swap places over the year, all in even, plain sentences.',
    hints: [
      'What is the one thing about the Earth that causes the seasons, in plain words?',
      'What happens to a half that leans towards the sun, and to the half that leans away?',
      'How can you finish by saying that the seasons come back round?'
    ],
    example:
      'Our Earth leans a little as it travels. The half tipped towards the sun gets summer. Sunbeams land there more directly, heating everything up. The half tipped away gets weaker, winter sunbeams. Six months on, the two halves swap jobs.',
    whyItWorks:
      'The five sentences follow the cause, the effect, the reason and the swap. The even length gives it the feel of a poem, and *swap jobs* leaves a child with an easy way to remember it.',
    tags: ['constraint', 'explain', 'science']
  },
  {
    key: 'tree-drinks-straw',
    difficulty: 3,
    title: 'How a tree drinks',
    task: 'Explain to a child how a very tall tree gets water from its roots all the way up to its highest leaf.',
    minWords: 40,
    maxWords: 90,
    constraints: [{ type: 'must-include', words: ['straw', 'sun'] }],
    authorNote:
      'The required words point at the real mechanism: a straw-like set of tubes, and the sun that pulls water out through the leaves. A strong answer makes the pulling clear, so the child understands that the leaves do the work, not the roots.',
    hints: [
      'What everyday object also lifts a drink upward, and how is a tree like it?',
      'What happens to the water in the leaves on a sunny day?',
      'Why does one bit of water leaving pull the next bit up?'
    ],
    example:
      'A tree is like a giant drinking straw standing in the ground. The sun warms the leaves, and tiny bits of water dry off into the air through little holes in them. Water is clingy, so every bit that leaves tugs the next one up behind it, all the way from the roots. A hot day means a very thirsty tree.',
    whyItWorks:
      "The straw gives the picture and the sun gives the cause. *Water is clingy* is the real reason, in a child's own words, and the last line ties it to something a child can notice on a hot day.",
    tags: ['constraint', 'explain', 'science']
  }
];

export const explain = defineCreateFamily('create/explain', EXPLAIN_ITEMS);
