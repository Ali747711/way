import type { Messages } from './types';

// The Uzbek interface, in Latin script and the current orthography: oʻ and
// gʻ take U+02BB (ʻ), the tutuq belgisi takes U+02BC (ʼ), never an ASCII
// apostrophe. Polite "siz", short and calm. Uzbek does not pluralise a noun
// after a numeral, so counts read "{n} ta …".
export const uz: Messages = {
  meta: {
    title: 'Way',
    description: 'Kunlik cheklangan masalalar toʻplami',
    deepTitle: 'Way · Chuqur masala',
    aboutTitle: 'Way haqida'
  },
  areas: {
    words: 'Soʻzlar',
    logic: 'Mantiq',
    math: 'Matematika',
    code: 'Kod',
    create: 'Ijod'
  },
  problem: {
    position: (index, total) => `${index} / ${total}`,
    hint: (step, max) => `Maslahat ${step} / ${max}`,
    submit: 'Yuborish',
    run: 'Ishga tushirish',
    giveUp: 'Taslim boʻlish',
    next: 'Keyingisi',
    report: 'Xato haqida xabar berish'
  },
  outcome: {
    solved: 'Yechildi',
    wrong: 'Hali emas',
    failed: 'Urinishlar tugadi',
    gave_up: 'Yechim',
    attemptsLeft: (n) => `${n} ta urinish qoldi`,
    strongAnswer: 'Kuchli javob qanday boʻladi'
  },
  giveUp: {
    question: 'Yechimni koʻrsataymi? Bugun qayta urinib boʻlmaydi.',
    confirm: 'Yechimni koʻrsatish',
    keepTrying: 'Yana urinib koʻrish'
  },
  code: {
    timedOut: 'Vaqt tugadi',
    passed: (passed, total) => `${total} ta testdan ${passed} tasi oʻtdi`,
    input: 'Kiritilgan:',
    expected: 'Kutilgan:',
    error: 'Xato:',
    actual: 'Natija:'
  },
  answer: {
    wordCount: (n) => `${n} ta soʻz`,
    exactWords: (n) => `Aniq ${n} ta soʻz yozing.`,
    wordRange: (min, max) => `${min}–${max} ta soʻz yozing.`,
    atLeastWords: (n) => `Kamida ${n} ta soʻz yozing.`,
    atMostWords: (n) => `Koʻpi bilan ${n} ta soʻz yozing.`,
    enterNumber: 'Son kiriting.',
    typeFirst: 'Avval javob yozing.',
    pickFirst: 'Avval variantni tanlang.'
  },
  set: {
    label: 'Bugungi toʻplam',
    status: {
      solved: 'yechildi',
      gave_up: 'voz kechildi',
      failed: 'yechilmadi',
      open: 'boshlanmagan',
      current: 'joriy'
    },
    mark: (area, status) => `${area}, ${status}`
  },
  done: {
    title: { lead: '', accent: 'Bugungisi', tail: ' shu.' },
    // A no-break space ties each number to its unit, so a line never
    // breaks between "0" and "daqiqa" on a phone.
    summary: (solved, total, hints, minutes) =>
      `${total}\u00a0tadan ${solved}\u00a0tasi yechildi · ${hints}\u00a0ta maslahat · ${minutes}\u00a0daqiqa`,
    deepLink: 'Shu haftaning chuqur masalasi',
    comeBack: 'Ertaga qaytib keling.'
  },
  areaMap: {
    never: 'hali yoʻq',
    today: 'oxirgi: bugun',
    daysAgo: (n) => (n === 1 ? 'oxirgi: kecha' : `oxirgi: ${n} kun oldin`)
  },
  deep: {
    badge: 'Chuqur',
    title: { lead: '', accent: 'Bu haftaniki', tail: ' shu.' },
    backToToday: 'Bugunga qaytish'
  },
  noSet: {
    today: 'Bugun uchun masala yoʻq.',
    week: 'Bu hafta uchun masala yoʻq.',
    about: 'Way haqida'
  },
  about: {
    intro: [
      'Way — kechalari lentani behuda varaqlash oʻrniga qisqa, chinakam fikrlash lahzalarini beradigan bepul veb-ilova. Har kuni u turli sohalardan birma-bir yechiladigan kichik, cheklangan masalalar toʻplamini taklif qiladi.',
      'Maslahatlar faqat savol beradi. Yechim faqat siz javob berganingizdan soʻng ochiladi. Toʻplam tugagach, Way buni aytadi va toʻxtaydi.',
      'Way sunʼiy intellekt fikrlashni ixtiyoriy qilib qoʻygani uchun yaratilgan: hayotning kuch talab qiladigan qismlari (oʻqish, mulohaza yuritish, izlanish, muhokama) endi mashq qilinmay qoʻydi. Qurilmadan voz kechishni talab qiladigan usullar kuni qurilmalarda oʻtadigan odamlarga yordam bermaydi, shuning uchun Way ekran vaqti ichida yashaydi va uning mazmunini almashtiradi. Bu sunʼiy intellekt davrining mahsuloti boʻlib, maqsadi odamlarni kamroq emas, koʻproq fikrlashga undashdir.'
    ],
    // Delete this line if the problems are translated too.
    contentNote: 'Masalalar hozircha ingliz tilida.',
    principlesHeading: 'Tamoyillar',
    principles: [
      'Fikrlashgacha oʻn soniya.',
      'Bir vaqtda bitta masala.',
      'Toʻplam tugaydi.',
      'Murabbiy, tayyor javob emas.',
      'Har kuni: chuqurlikdan koʻra xilma-xillik.',
      'Aybdorlik hissi yoʻq.',
      'Bepul: reklama yoʻq, pullik qism yoʻq, maʼlumotlaringiz yigʻilmaydi.'
    ],
    backToToday: 'Bugunga qaytish',
    source: 'Manba kodi GitHubda'
  },
  notFound: {
    message: 'Sahifa topilmadi.'
  },
  language: {
    label: 'Til'
  }
};
