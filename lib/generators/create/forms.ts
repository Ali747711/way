import { defineCreateFamily, type CreateItem } from './define';

/** Everyday forms written the wrong way round: labels, ads, reviews, rules. */
export const FORM_ITEMS: readonly CreateItem[] = [
  {
    key: 'sofa-warning-label',
    difficulty: 4,
    title: 'The sofa that swallows Sundays',
    task: 'Write the warning label for a sofa that is far too comfortable. It should sound official on the surface and be funny underneath.',
    minWords: 25,
    maxWords: 60,
    constraints: [
      { type: 'sentence-count', count: 4 },
      {
        type: 'forbid-words',
        words: ['warning', 'danger', 'caution', 'risk']
      }
    ],
    authorNote:
      'A strong answer keeps the flat, legal voice of a real label and lets the absurd detail do the work. Banning the usual warning words forces fresh official-sounding openings, and the best labels escalate: a small claim, a bigger one, then an instruction nobody could follow.',
    hints: [
      'Which phrases make a label sound official, and which of them are not the banned words?',
      'What is the first harmless-sounding effect of sitting down, and what is the bigger one that follows it?',
      'Could your last sentence be a calm instruction that the reader cannot possibly obey?'
    ],
    example:
      'Notice: this sofa has been known to swallow whole afternoons. Users who sit down for a minute may rise hours later, holding a cold cup of tea and no plans. Do not operate the sofa while any chores are waiting. If you feel a nap approaching, accept it.',
    whyItWorks:
      'The voice never winks: it says *notice*, *users* and *operate* as a real label would. The jokes grow from lost afternoons to cold tea to surrender, and the last line breaks the rule that labels only say no.',
    tags: ['constraint', 'humour', 'voice']
  },
  {
    key: 'umbrella-eulogy',
    difficulty: 3,
    title: 'Goodbye to a broken umbrella',
    task: 'Write a short eulogy for an umbrella that has just turned inside out in a storm and been left beside a bin.',
    minWords: 40,
    maxWords: 90,
    constraints: [{ type: 'must-include', words: ['rain', 'wind', 'forgot'] }],
    authorNote:
      'A strong answer treats the umbrella with full ceremony and lets the comedy come from how seriously it grieves. It names one loyal habit, one cause of death and one small thing the umbrella leaves behind, and it turns a little guilty at the end.',
    hints: [
      'What would a solemn speaker say first, to make this sound like a real funeral?',
      'What small, specific things did the umbrella put up with that a person would be proud of?',
      'What does the speaker owe the umbrella, and can the speech admit it?'
    ],
    example:
      'Friends, we are here for a faithful servant. For six winters it met the rain with open arms and asked for nothing but a hook by the door. It was not beaten by the rain. It was beaten by the wind, which respects no one, and by us, who forgot it on every single train. It leaves behind one glove, three receipts and a puddle. May its next life be indoors.',
    whyItWorks:
      'The grand opening and the plain ending frame the joke. The three required words each do a job: rain is the enemy it beat, wind is the one that beat it, and forgot is the guilt we share.',
    tags: ['constraint', 'humour', 'eulogy']
  },
  {
    key: 'paper-clip-museum-label',
    difficulty: 4,
    title: 'The paper clip, behind glass',
    task: 'Write the label a museum would put beside an ordinary paper clip, found in a kitchen drawer, as if it were a treasure from a lost age.',
    minWords: 24,
    maxWords: 40,
    constraints: [
      { type: 'sentence-words', words: 8 },
      { type: 'must-include', words: ['clip', 'drawer'] }
    ],
    authorNote:
      'Short, even sentences give the label its stiff museum rhythm, so a strong answer does not fight them. It states one dull fact, one grand claim, one mystery and one closing line that sounds like wisdom but is really about the object.',
    hints: [
      'How does a museum label usually begin, and what is the plainest true thing you can say about a paper clip?',
      'What could scholars be unsure about, if they were studying something this ordinary?',
      'What does a paper clip actually do that your last sentence could dress up as a lesson?'
    ],
    example:
      'Object: a clip, bent once and never straightened. It held paper together for a forgotten age. Scholars ask why it sleeps in a drawer. Its only message is: stay together, and bend.',
    whyItWorks:
      'Every sentence is eight words, which gives the deadpan beat of a real label. The last line is a joke that also turns out to be good advice.',
    tags: ['constraint', 'humour', 'museum']
  },
  {
    key: 'key-acrostic-letter',
    difficulty: 3,
    title: "A key's complaint",
    task: 'A house key writes a short note to the person who keeps losing it. Let it be fond, tired and a little threatening.',
    minWords: 25,
    maxWords: 70,
    constraints: [{ type: 'acrostic', word: 'lost' }],
    authorNote:
      'A strong answer makes the four opening words feel natural, so the acrostic hides in plain sight. The key has a clear personality (patient, dry, slightly hurt) and the final sentence lands a gentle threat or a forgiveness.',
    hints: [
      'What does a key know about its owner that the owner would rather forget?',
      "For each of L, O, S and T, which opening word could begin a sentence in the key's voice?",
      'Should the ending forgive the owner, or warn them?'
    ],
    example:
      'Last Tuesday you looked for me for forty minutes. Once, I was in your pocket the whole time. Sooner or later I will learn to hide on purpose. Tonight, hang me on the hook and I will forgive everything.',
    whyItWorks:
      'The four openings (Last, Once, Sooner, Tonight) are ordinary words that time the story, so the hidden word never shows. The key is wounded but funny, and it ends on a deal.',
    tags: ['constraint', 'acrostic', 'voice']
  },
  {
    key: 'quiet-sunday-recipe',
    difficulty: 4,
    title: 'A recipe for a quiet Sunday',
    task: 'Write a recipe for a quiet Sunday afternoon, with ingredients and a method, but nothing anyone could eat.',
    minWords: 25,
    maxWords: 60,
    constraints: [{ type: 'sentence-count', count: 4 }, { type: 'no-repeat' }],
    authorNote:
      'Never repeating a word pushes a writer to vary every verb and noun, which suits a recipe: each step names a new ingredient and a new action. A strong answer keeps the cooking voice (take, add, simmer) while the ingredients are things like silence, light and time.',
    hints: [
      'Which cooking verbs could you use once each, one per step, without repeating any?',
      'What ingredients make a Sunday feel quiet, and which of them are not food?',
      'Since small words like *the* and *a* count too, how can you build sentences that avoid using them twice?'
    ],
    example:
      'Take one empty afternoon and two soft socks. Switch off every screen, then draw curtains halfway. Add a blanket, an unread book, plus daylight going gold. Simmer gently until nobody needs anything from you.',
    whyItWorks:
      'Every word appears once, yet it reads like a real recipe: take, switch, add, simmer. The last step gives the dish its real definition: it is done when nobody needs you.',
    tags: ['constraint', 'no-repeat', 'recipe']
  },
  {
    key: 'snail-courier-pitch',
    difficulty: 4,
    title: 'Pitching the snail couriers',
    task: 'Pitch a courier service run entirely by snails to a room of busy investors.',
    minWords: 30,
    maxWords: 65,
    constraints: [
      { type: 'sentence-count', count: 3 },
      {
        type: 'forbid-words',
        words: ['slow', 'slowly', 'fast', 'quick', 'quickly']
      }
    ],
    authorNote:
      "The obvious joke is speed, and the rule takes it away. A strong answer sells the product's one real feature (patience, a trail, reliability, charm) with a confident salesperson's voice, and names the flaw only to sell it as a feature.",
    hints: [
      'If you cannot mention speed, what else could a snail courier honestly offer?',
      'What would a confident founder say about the competition in the first sentence?',
      'Which three kinds of parcel would make investors laugh and also nod?'
    ],
    example:
      'Every other courier promises speed, and every customer is still disappointed. Our couriers promise patience: parcels arrive late, but they arrive covered in a glossy trail that no one can forge. Hand us your wedding invitations, your love letters and your overdue apologies, and we will deliver them eventually.',
    whyItWorks:
      'The pitch turns the weakness into a feature (a trail nobody can forge) without ever using the banned words. The final sentence picks parcels where lateness is already a joke.',
    tags: ['constraint', 'pitch', 'humour']
  },
  {
    key: 'ghost-house-rules',
    difficulty: 3,
    title: 'House rules from a friendly ghost',
    task: 'Write the house rules a friendly ghost leaves for the family moving into its haunted house.',
    minWords: 30,
    maxWords: 80,
    constraints: [{ type: 'sentence-count', count: 5 }],
    authorNote:
      'A strong answer lets the ghost be the polite one: every spooky habit is explained as help or hospitality. Numbering the rules gives a clear rhythm, and the last rule should feel warmer than the first.',
    hints: [
      'Which spooky habits could the ghost explain as being helpful or friendly?',
      'How do the rules sound if the ghost is nervous about the new family leaving?',
      'Could the final rule say something the ghost has never said out loud?'
    ],
    example:
      'Rule one: the third stair squeaks, and that is me saying hello. Rule two: please leave the cold spot by the window alone, because it is my favourite. Rule three: if the lights flicker, I am only trying to help you find the switch. Rule four: if you sing in the bath, I will join in from the pipes. Rule five: stay as long as you like, because the quiet was getting very lonely.',
    whyItWorks:
      'Each rule turns a classic haunting into good manners. The fifth rule drops the joke and tells the truth, which is why the whole piece feels kind.',
    tags: ['constraint', 'rules', 'humour']
  },
  {
    key: 'moon-one-star-review',
    difficulty: 4,
    title: 'One star for the moon',
    task: 'Write a one-star review of the moon from a guest who stayed overnight.',
    minWords: 30,
    maxWords: 65,
    constraints: [
      { type: 'sentence-count', count: 4 },
      {
        type: 'forbid-words',
        words: ['bright', 'dark', 'night', 'light']
      }
    ],
    authorNote:
      'The banned words are the first four a writer reaches for. A strong answer complains about the right things (no air, no neighbours, no kettle) in the voice of someone who expected a hotel, and keeps one honest compliment hidden in the grumbling.',
    hints: [
      'What would a hotel guest expect that the moon cannot supply?',
      'Which real facts about the moon (craters, dust, footprints, silence) could sound like complaints?',
      'Why would a reviewer give one star and not zero?'
    ],
    example:
      'No air, no welcome, no kettle, and the carpet is nothing but dust. The view of home was lovely, but the neighbours are all craters and silence. Nobody warned me that a single footprint here lasts for millions of years. One star, awarded only for the view.',
    whyItWorks:
      'Real moon facts are dressed as customer complaints. The review ends on the one star it grudgingly gives, which is also the only sincere line.',
    tags: ['constraint', 'review', 'humour']
  },
  {
    key: 'pigeon-complaint',
    difficulty: 4,
    title: 'A pigeon files a complaint',
    task: 'Write a formal complaint from a pigeon to the person who used to feed it on a park bench and has stopped.',
    minWords: 30,
    maxWords: 70,
    constraints: [
      { type: 'sentence-count', count: 4 },
      { type: 'must-include', words: ['bench', 'crumbs'] }
    ],
    authorNote:
      'A strong answer gives the pigeon real dignity: it speaks like a customer with a long history, not like a beggar. Specific grievances (days, generations, standards) make the complaint feel formal, and a stiff sign-off lands the joke.',
    hints: [
      'How would a very formal customer open a letter of complaint?',
      'What history does the pigeon claim with the bench, and what does it think it is owed?',
      'How could the sign-off be both polite and a little threatening?'
    ],
    example:
      'To the keeper of the bench: I have sat here since Monday and the crumbs have stopped. My family has kept this bench company for generations, and we expect proper payment for our decorations. Please resume the crumbs, or we will have to find another statue to stand on. Yours in hunger, a loyal customer.',
    whyItWorks:
      'The pigeon treats the bench as a business with a contract, which is the whole joke. *Payment for our decorations* is the line a player will remember.',
    tags: ['constraint', 'letter', 'humour']
  },
  {
    key: 'scarecrow-job-advert',
    difficulty: 3,
    title: 'Wanted: one scarecrow',
    task: 'Write a job advert for a scarecrow to guard a field of barley.',
    minWords: 30,
    maxWords: 70,
    constraints: [
      {
        type: 'forbid-words',
        words: ['must', 'experience', 'hardworking', 'team', 'passionate']
      }
    ],
    authorNote:
      'Job adverts run on stock phrases, and banning five of them forces a writer to say what the job really is. A strong answer keeps the advert format (duties, hours, qualities, pay) while the details come from the odd life of a scarecrow.',
    hints: [
      'Which parts does a job advert always have, and what does each one look like for a scarecrow?',
      'What are the real duties, hours and benefits of standing still in a field?',
      'What would the pay be, if the employer is a farmer?'
    ],
    example:
      'Wanted: one scarecrow for a large field of barley. Duties include standing still, looking worried and wearing whatever the farmer finds. Hours are every hour, with no holidays, though the view is excellent. Our ideal candidate is tall, patient and unbothered by crows. Pay is one hat and the respect of the barley.',
    whyItWorks:
      'It keeps the stiff shape of an advert (*duties include*, *ideal candidate*, *pay is*) and fills it with scarecrow facts. *The respect of the barley* is the unexpected last beat.',
    tags: ['constraint', 'advert', 'humour']
  }
];

export const forms = defineCreateFamily('create/forms', FORM_ITEMS);
