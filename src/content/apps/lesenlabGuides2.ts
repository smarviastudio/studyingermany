import type { AppGuide } from './types';

const APP = 'Lesen Lab: Learn German A1–B2';
const URL = 'https://apps.apple.com/app/id6752349330';

const cefr = { title: 'Council of Europe – CEFR global scale (A1–C2 descriptors)', url: 'https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale' };
const goetheFaq = { title: 'Goethe-Institut – FAQ: lessons needed per level', url: 'https://goethe.de/ins/gb/en/sta/lon/kur/faq.html' };
const goetheLevels = { title: 'Goethe-Institut – German language levels', url: 'https://www.goethe.de/ins/de/en/uun/dln.html' };
const goetheB1Rules = { title: 'Goethe-Zertifikat B1 – exam regulations (Sept 2025)', url: 'https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf' };
const dwNicos = { title: 'DW Learn German – Nicos Weg (free A1–B1 course)', url: 'https://learngerman.dw.com/en/nicos-weg/c-36519789' };

const guides: AppGuide[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'how-to-learn-german-on-your-own',
    keyword: 'how to learn german on your own',
    title: 'How to learn German on your own: a 6-month self-study plan',
    metaTitle: 'How to Learn German on Your Own – A Realistic Self-Study Plan',
    metaDescription:
      'A month-by-month plan to teach yourself German from zero to A2/B1: daily routine, free resources, reading and listening practice, and how to test your level.',
    excerpt: 'A daily routine and a month-by-month plan from zero to A2/B1 without a classroom.',
    keyTakeaways: [
      'Self-study works if you combine four things daily: input (reading and listening), vocabulary review, a little grammar, and output (writing or speaking).',
      '45–60 minutes a day is enough to reach A2 in about six months for most learners; the Goethe-Institut estimates roughly 150–260 hours of instruction for A2.',
      'Graded reading with audio is the most efficient input for self-learners: you see and hear the same words in context.',
      'Test yourself every two months with an official model exam so you know when you are ready.',
    ],
    intro: [
      'Yes, you can learn German on your own. The learners who succeed follow a simple daily routine: about 20 minutes of reading or listening at their level, 10 minutes of vocabulary review with spaced repetition, 10 minutes of grammar, and 10 minutes of writing or speaking. That adds up to under an hour a day – and it is enough to reach A2 in roughly six months.',
      'The biggest risk when teaching yourself is not difficulty but drift: jumping between apps, YouTube videos and grammar books without a plan. The month-by-month plan below gives you structure and tells you what “done” looks like at each step.',
    ],
    sections: [
      {
        heading: 'The daily 50-minute routine',
        numbered: [
          '20 minutes input: a graded story or dialogue at your level – read it, then listen to the audio, then read again.',
          '10 minutes vocabulary: review flashcards with spaced repetition; add 5–10 new words from today’s text.',
          '10 minutes grammar: one topic at a time (articles, verb position, perfect tense …) with a few exercises.',
          '10 minutes output: write five sentences about your day, or say them out loud and record yourself.',
        ],
      },
      {
        heading: 'Month-by-month plan',
        bullets: [
          'Month 1 (A1 start): pronunciation, numbers, present tense, word order (verb in position 2), 300 words. Read A1 stories with audio.',
          'Month 2: articles and cases (nominative, accusative), modal verbs, questions. 600 words.',
          'Month 3 (A1 complete): separable verbs, perfect tense, dative. Take an A1 model test.',
          'Month 4: subordinate clauses with weil/dass/wenn, comparatives, reflexive verbs. A2 stories.',
          'Month 5: past tense of common verbs, prepositions with dative/accusative. Start writing short emails.',
          'Month 6 (A2): adjective endings (basics), relative clauses (basics). Take an A2 model test.',
        ],
      },
      {
        heading: 'Free resources that are worth your time',
        bullets: [
          'DW Learn German – “Nicos Weg”, a free video course from A1 to B1 (searches for it are rising sharply in 2026).',
          'Official model tests from the Goethe-Institut and telc to check your level.',
          'Slow German podcasts and radio news for listening practice.',
          'Graded readers and reading apps that let you tap unknown words instead of reaching for a dictionary.',
        ],
      },
      {
        heading: 'Common mistakes when learning alone',
        bullets: [
          'Only using a gamified app – you collect streaks but rarely read a full text.',
          'Learning words without articles: always learn “der Tisch”, not “Tisch”.',
          'Never producing language: write or speak a little every day, even if nobody corrects it.',
          'Reading texts that are too hard. If you need to look up more than one word in ten, choose an easier level.',
        ],
      },
    ],
    appTip:
      'Lesen Lab covers the input and vocabulary part of this routine: 1000+ graded stories from A1 to B2 with native audio and slow mode, tap-to-translate for any word, and spaced-repetition flashcards built from what you read.',
    howToHeading: 'Use Lesen Lab for your daily input',
    howToSteps: [
      { title: 'Pick your level', text: 'Start with A1 or A2 stories that feel slightly easy.' },
      { title: 'Read, listen, read', text: 'Read the story, play the native audio, read it again.' },
      { title: 'Save new words', text: 'Tap unknown words and review them as flashcards tomorrow.' },
    ],
    faqs: [
      { question: 'Can I really learn German by myself?', answer: 'Yes. With a daily routine of reading/listening, vocabulary review, grammar and some writing, most learners reach A2 in about six months on their own.' },
      { question: 'How many hours a day should I study German?', answer: '45–60 minutes a day is enough for steady progress. Consistency matters more than long weekend sessions.' },
      { question: 'What is the best free way to learn German?', answer: 'Combine a free structured course such as DW’s Nicos Weg with graded reading, a podcast at your level and official model tests.' },
      { question: 'How do I know when I reach A1 or A2?', answer: 'Take an official Goethe or telc model test for that level. If you score around 60% or more, you are close.' },
      { question: 'Which app helps with reading practice for self-study?', answer: `${APP} for iPhone and iPad offers 1000+ graded German stories with audio, tap-to-translate and flashcards: ${URL}` },
    ],
    sources: [goetheFaq, dwNicos, cefr],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'german-levels-a1-a2-b1-b2-explained',
    keyword: 'german levels a1 a2 b1 b2 explained',
    title: 'German levels A1, A2, B1, B2 explained – and how to know your level',
    metaTitle: 'German Levels A1–B2 Explained – What Each Level Means',
    metaDescription:
      'What you can do at A1, A2, B1 and B2 in German, how many hours each level takes according to the Goethe-Institut, which exams prove it and how to find your current level.',
    excerpt: 'What each CEFR level means in practice, how long it takes and how to test yourself.',
    keyTakeaways: [
      'German levels follow the Common European Framework of Reference (CEFR): A1 and A2 (basic), B1 and B2 (independent), C1 and C2 (proficient).',
      'Goethe-Institut estimates (instruction hours): A1 about 60–150, A2 about 150–260, B1 about 260–490, B2 about 450–600 – cumulative from zero.',
      'B1 is the level usually required for German citizenship and permanent residence; B2 is common for nursing, many jobs and some study programmes.',
      'The quickest way to know your level is an official model test or a free placement test.',
    ],
    intro: [
      'German language levels use the six-step CEFR scale. A1 means you can handle very basic everyday phrases, A2 simple routine situations, B1 most situations while travelling or living in Germany, and B2 fluent conversation with native speakers on many topics. Each level builds on the previous one.',
      'According to the Goethe-Institut, reaching A1 takes roughly 60–150 hours of instruction, A2 about 150–260, B1 about 260–490 and B2 about 450–600 hours in total. Your own time depends on your native language, other languages you know and how much you practise outside class.',
    ],
    sections: [
      {
        heading: 'What you can do at each level',
        bullets: [
          'A1: introduce yourself, ask and answer simple questions about where you live and people you know, understand slow, clear speech.',
          'A2: talk about your background and immediate needs, handle shopping, the doctor or the bank in simple sentences, read short everyday texts.',
          'B1: understand the main points of clear standard speech on familiar topics, deal with most situations when travelling, write simple connected texts and give reasons for opinions.',
          'B2: understand the main ideas of complex texts, talk spontaneously with native speakers without strain, write clear detailed texts.',
        ],
      },
      {
        heading: 'Which level do you need?',
        bullets: [
          'Spouse visa: usually A1.',
          'Permanent settlement permit and citizenship: B1 (Goethe, telc or the DTZ from the integration course).',
          'Nursing and many healthcare jobs: often B1 or B2 depending on the federal state and profession.',
          'German-taught university degrees: usually C1 (TestDaF, DSH, Goethe C1).',
        ],
      },
      {
        heading: 'How to find your current level',
        numbered: [
          'Take a free online placement test from a language school or the Goethe-Institut.',
          'Download an official model test for the level you think you have and do it under exam conditions.',
          'Read a graded text at that level: if you understand the main points and need fewer than one in ten words translated, the level fits.',
          'Ask a teacher to rate a short text you have written.',
        ],
      },
    ],
    appTip:
      'Every story in Lesen Lab is labelled A1, A2, B1 or B2. Reading a few stories at each level is a quick, honest way to see where you are – and the built-in quizzes after each text show whether you really understood it.',
    howToHeading: 'Find your reading level in Lesen Lab',
    howToSteps: [
      { title: 'Try one story per level', text: 'Start at A1 and move up.' },
      { title: 'Count unknown words', text: 'More than one in ten? Stay one level lower.' },
      { title: 'Take the quiz', text: 'Check comprehension after each text.' },
    ],
    faqs: [
      { question: 'What does German A1 mean?', answer: 'A1 is the first CEFR level: you can understand and use very basic expressions, introduce yourself and ask simple questions.' },
      { question: 'Is B1 German good?', answer: 'B1 means you are an independent user: you can handle most everyday situations and write simple connected texts. It is the level required for German citizenship.' },
      { question: 'How long does it take to go from A1 to B1?', answer: 'The Goethe-Institut estimates about 260–490 hours of instruction in total to reach B1 from zero, so A1 to B1 is roughly 200–350 additional hours.' },
      { question: 'How can I test my German level for free?', answer: 'Use a free online placement test or an official model exam, and read graded texts at different levels.' },
      { question: 'Which app has German texts sorted by level?', answer: `${APP} sorts 1000+ German stories by CEFR level from A1 to B2: ${URL}` },
    ],
    sources: [cefr, goetheFaq, goetheLevels],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'how-long-does-it-take-to-learn-german',
    keyword: 'how long does it take to learn german',
    title: 'How long does it take to learn German? Realistic timelines per level',
    metaTitle: 'How Long Does It Take to Learn German? A1 to B2 Timelines',
    metaDescription:
      'From zero to A1 in about 2–3 months, B1 in about a year of steady study. Official hour estimates from the Goethe-Institut, plus what speeds you up or slows you down.',
    excerpt: 'Hours per level from the Goethe-Institut and realistic calendars for part-time learners.',
    keyTakeaways: [
      'Goethe-Institut estimate of total instruction hours from zero: A1 60–150, A2 150–260, B1 260–490, B2 450–600.',
      'At about 1 hour a day, that is roughly 2–4 months for A1, 6 months for A2, 12 months for B1 and 18–24 months for B2.',
      'The US Foreign Service Institute places German in its second difficulty category for English speakers – about 36 weeks of full-time study to professional working proficiency.',
      'Daily practice and lots of reading and listening shorten the timeline more than any single method.',
    ],
    intro: [
      'Learning German to a solid conversational level (B1) takes most adults about 350–650 lessons, or roughly a year at an hour a day. The Goethe-Institut estimates total instruction time from zero at about 60–150 hours for A1, 150–260 hours for A2, 260–490 hours for B1 and 450–600 hours for B2.',
      'These are classroom hours. Self-study and practice outside class count too – which is why people who read and listen to German every day often move faster than the estimates suggest.',
    ],
    sections: [
      {
        heading: 'Realistic calendars',
        bullets: [
          '30 minutes a day: A1 in 4–6 months, A2 in about a year, B1 in about two years.',
          '1 hour a day: A1 in 2–4 months, A2 in about 6 months, B1 in about 12 months.',
          'Intensive course (about 20 lessons a week): one level every 1–2 months up to B1.',
          'Living in Germany and using German daily speeds everything up – if you actually use it.',
        ],
      },
      {
        heading: 'What speeds you up',
        bullets: [
          'Knowing English, Dutch or a Scandinavian language – many words are related.',
          'Daily contact instead of weekend sessions.',
          'Lots of comprehensible input: graded stories, slow podcasts, subtitled series.',
          'Spaced-repetition vocabulary review, so words do not need to be relearned.',
        ],
      },
      {
        heading: 'What slows you down',
        bullets: [
          'Ignoring articles (der, die, das) at the start – fixing it later costs more time.',
          'Studying only grammar without reading or listening.',
          'Texts that are far too hard, which turn reading into dictionary work.',
          'Long breaks: a month off can undo several weeks of progress.',
        ],
      },
    ],
    appTip:
      'Reading at the right level is the cheapest way to add hours of German to your week. Lesen Lab has 1000+ graded stories with native audio, so five minutes on the bus count as real practice.',
    howToHeading: 'Add daily input with Lesen Lab',
    howToSteps: [
      { title: 'One story a day', text: 'Short stories fit into breaks and commutes.' },
      { title: 'Listen in slow mode', text: 'Train your ear at the same time.' },
      { title: 'Review words', text: 'Spaced repetition keeps new words from fading.' },
    ],
    faqs: [
      { question: 'How long does it take to learn German to B1?', answer: 'About 260–490 hours of instruction according to the Goethe-Institut – roughly one year at one hour a day.' },
      { question: 'Can I learn German in 3 months?', answer: 'You can reach a solid A1 or begin A2 in three months with daily study. Fluency takes much longer.' },
      { question: 'Is German hard for English speakers?', answer: 'It is moderately hard. The US Foreign Service Institute places it in its second difficulty category, mainly because of cases, genders and word order.' },
      { question: 'How long does it take to learn German to B2?', answer: 'About 450–600 hours of instruction in total from zero, or roughly 18–24 months of steady part-time study.' },
      { question: 'What is the fastest way to add German practice to my day?', answer: `Read and listen to short graded stories daily, for example in ${APP}: ${URL}` },
    ],
    sources: [goetheFaq, cefr],
    screenshotIndex: 1,
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'german-a1-reading-texts-with-questions',
    keyword: 'german a1 reading texts with questions',
    title: 'German A1 reading practice: 3 short texts with questions and answers',
    metaTitle: 'German A1 Reading Texts with Questions & Answers (Free)',
    metaDescription:
      'Three short A1 German texts – introducing yourself, a day in the city, a message to a friend – each with comprehension questions, answers and key vocabulary.',
    excerpt: 'Three original A1 texts with questions, answers and vocabulary.',
    keyTakeaways: [
      'A1 texts use present tense, simple main clauses and everyday topics: people, family, food, time, places.',
      'Read each text twice: once for the general idea, once for details. Then answer the questions without looking back.',
      'In the Goethe A1 exam, reading tasks are short notices, emails and adverts with true/false or matching questions.',
    ],
    intro: [
      'A1 reading texts are short and use everyday words, the present tense and simple sentences. Below are three original A1 texts with comprehension questions and answers. Read each text first without a dictionary, answer the questions, then check the answers and the vocabulary list.',
      'If you understand most of each text, you are ready for A1 exam reading tasks. If not, read them aloud a few times – repetition is how A1 vocabulary sticks.',
    ],
    sections: [
      {
        heading: 'Text 1: Ich heiße Lara',
        paragraphs: [
          'Hallo! Ich heiße Lara und ich bin 24 Jahre alt. Ich komme aus Spanien, aber ich wohne jetzt in Köln. Ich bin Studentin und lerne Deutsch. Ich habe einen Bruder. Er heißt Pablo und wohnt in Madrid. Am Wochenende spiele ich gern Tennis und koche mit meinen Freunden. Mein Lieblingsessen ist Pizza.',
          'Fragen: 1. Wie alt ist Lara? 2. Wo wohnt sie jetzt? 3. Was macht sie am Wochenende? — Antworten: 1. 24 Jahre. 2. In Köln. 3. Sie spielt Tennis und kocht mit Freunden.',
        ],
      },
      {
        heading: 'Text 2: Ein Tag in der Stadt',
        paragraphs: [
          'Heute ist Samstag. Tom fährt um zehn Uhr mit dem Bus in die Stadt. Zuerst kauft er Brot und Käse im Supermarkt. Dann trinkt er einen Kaffee im Café am Markt. Um zwölf Uhr trifft er seine Freundin Mia. Sie gehen zusammen ins Museum. Am Abend sind sie müde und essen zu Hause Suppe.',
          'Fragen: 1. Wie fährt Tom in die Stadt? 2. Was kauft er? 3. Wann trifft er Mia? — Antworten: 1. Mit dem Bus. 2. Brot und Käse. 3. Um zwölf Uhr.',
        ],
      },
      {
        heading: 'Text 3: Eine Nachricht',
        paragraphs: [
          'Hi Jonas, ich bin krank und kann heute nicht zum Fußball kommen. Kannst du bitte dem Trainer Bescheid sagen? Am Donnerstag bin ich wieder da. Hast du am Freitag Zeit? Dann können wir zusammen lernen. Bis bald, Sam',
          'Richtig oder falsch? 1. Sam spielt heute Fußball. 2. Sam möchte am Freitag mit Jonas lernen. — Antworten: 1. Falsch. 2. Richtig.',
        ],
      },
      {
        heading: 'Key vocabulary',
        bullets: [
          'wohnen – to live · der Bruder – brother · das Wochenende – weekend',
          'zuerst – first · dann – then · treffen – to meet · müde – tired',
          'krank – ill · Bescheid sagen – to let someone know · bis bald – see you soon',
        ],
      },
    ],
    appTip:
      'Lesen Lab has hundreds of A1 stories like these, each with native audio, slow mode and a quiz. Tap any word you don’t know for an instant English translation and save it as a flashcard.',
    howToHeading: 'Practise A1 reading in Lesen Lab',
    howToSteps: [
      { title: 'Choose an A1 story', text: 'Short texts on everyday topics.' },
      { title: 'Listen and read', text: 'Native audio helps you link spelling and sound.' },
      { title: 'Take the quiz', text: 'Check your understanding after each story.' },
    ],
    faqs: [
      { question: 'What kind of texts are A1 level?', answer: 'Short texts about everyday life – introductions, shopping, time, simple messages – in the present tense with simple sentences.' },
      { question: 'How many words should I know for A1?', answer: 'Roughly 500–700 words is a common estimate for A1.' },
      { question: 'How is reading tested in Goethe A1?', answer: 'With short everyday texts such as notices, emails and adverts, answered with true/false or matching tasks.' },
      { question: 'Where can I find more A1 German texts with audio?', answer: `${APP} offers hundreds of A1 stories with native audio and quizzes: ${URL}` },
    ],
    sources: [cefr, goetheLevels],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'german-a2-reading-practice-texts',
    keyword: 'german a2 reading practice',
    title: 'German A2 reading practice: texts with questions, answers and tips',
    metaTitle: 'German A2 Reading Practice – Texts with Questions & Answers',
    metaDescription:
      'Two original A2 German texts with comprehension questions and answers, the grammar you meet at A2 and a method to read faster without translating every word.',
    excerpt: 'Two A2 texts with answers plus a method to read without translating every word.',
    keyTakeaways: [
      'A2 texts add the perfect tense, subordinate clauses with weil/dass/wenn and longer everyday topics like work, travel and health.',
      'Read for the main idea first; only look up words that block understanding.',
      'Aim to understand at least 90% of the words in a practice text – otherwise choose an easier one.',
    ],
    intro: [
      'At A2 you read longer everyday texts: emails about plans, short articles, adverts and instructions. You meet the perfect tense (“ich habe gekauft”), subordinate clauses (“weil ich krank bin”) and more vocabulary about work, travel and health.',
      'Try the two original texts below. Read each once quickly for the main idea, then again for details, and only then answer the questions.',
    ],
    sections: [
      {
        heading: 'Text 1: Der neue Job',
        paragraphs: [
          'Liebe Oma, seit Montag arbeite ich in einer Bäckerei in der Nähe vom Bahnhof. Ich muss sehr früh aufstehen, weil die Bäckerei schon um sechs Uhr öffnet. Am Anfang war das schwer, aber jetzt gefällt mir die Arbeit. Meine Kollegen sind sehr nett, und mittags essen wir oft zusammen. Gestern hat mir mein Chef gezeigt, wie man Brezeln macht. Am Wochenende habe ich frei. Vielleicht besuche ich dich im nächsten Monat. Viele Grüße, deine Elena',
          'Fragen: 1. Wo arbeitet Elena? 2. Warum muss sie früh aufstehen? 3. Was hat sie gestern gelernt? — Antworten: 1. In einer Bäckerei in der Nähe vom Bahnhof. 2. Weil die Bäckerei um sechs Uhr öffnet. 3. Wie man Brezeln macht.',
        ],
      },
      {
        heading: 'Text 2: Beim Arzt',
        paragraphs: [
          'Herr Novak hat seit drei Tagen Kopfschmerzen und Fieber. Deshalb ruft er am Morgen in der Praxis von Dr. Berger an. Die Arzthelferin sagt, dass er um elf Uhr kommen kann. Der Arzt untersucht ihn und sagt, dass er eine Grippe hat. Herr Novak soll viel trinken, im Bett bleiben und eine Woche nicht arbeiten. Er bekommt eine Krankmeldung für seinen Arbeitgeber.',
          'Richtig oder falsch? 1. Herr Novak ist seit einer Woche krank. 2. Er hat um elf Uhr einen Termin. 3. Er muss eine Woche zu Hause bleiben. — Antworten: 1. Falsch (seit drei Tagen). 2. Richtig. 3. Richtig.',
        ],
      },
      {
        heading: 'How to read A2 texts faster',
        numbered: [
          'Look at the title and the first sentence: what is the topic?',
          'Find the verbs – they tell you what happens. In subordinate clauses the verb is at the end.',
          'Guess unknown words from context before you look them up.',
          'Underline time words (seit, gestern, am Wochenende) – exam questions often ask about them.',
        ],
      },
    ],
    appTip:
      'Lesen Lab’s A2 stories use exactly this kind of language. Tap any word or full sentence for an English translation, listen to native audio in slow mode, and finish each story with a short quiz.',
    howToHeading: 'Train A2 reading with Lesen Lab',
    howToSteps: [
      { title: 'Pick A2 stories', text: 'Everyday topics with perfect tense and subordinate clauses.' },
      { title: 'Translate only blockers', text: 'Tap a word only when you can’t guess it.' },
      { title: 'Quiz yourself', text: 'Check details like times and reasons.' },
    ],
    faqs: [
      { question: 'What grammar appears in A2 reading texts?', answer: 'Mostly the perfect tense, modal verbs, dative, and subordinate clauses with weil, dass and wenn.' },
      { question: 'How long are A2 reading texts?', answer: 'Usually 100–200 words – emails, short articles, adverts and notices.' },
      { question: 'How can I improve German reading at A2?', answer: 'Read a short graded text every day, guess words from context, and review new words with spaced repetition.' },
      { question: 'Is there an app with A2 German stories and audio?', answer: `Yes. ${APP} has A2 stories with native audio, translations and quizzes: ${URL}` },
    ],
    sources: [cefr, goetheLevels],
    screenshotIndex: 1,
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'goethe-b1-lesen-reading-exam-tips',
    keyword: 'goethe b1 lesen tips',
    title: 'Goethe B1 reading (Lesen): format, time and tips – with a practice text',
    metaTitle: 'Goethe B1 Lesen – Reading Exam Format, Tips & Practice Text',
    metaDescription:
      'The Goethe B1 reading module takes 65 minutes and has five parts; you pass with 60 of 100 points. How each part works, strategies, and a B1 practice text with answers.',
    excerpt: 'Five parts in 65 minutes, the pass mark and a B1 practice text.',
    keyTakeaways: [
      'The Goethe-Zertifikat B1 reading module (Lesen) takes 65 minutes.',
      'Your raw score is converted to 100 points; you pass with 60.',
      'Text types include blog posts, newspaper articles, adverts, opinions and rules or instructions.',
      'Answer the questions first, then search the text – you don’t need to understand every word.',
    ],
    intro: [
      'The reading module of the Goethe-Zertifikat B1 lasts 65 minutes and is the longest written module. It has five parts with different text types – a personal blog post, newspaper articles, short adverts, opinions from readers and rules such as house rules or terms. Your answers are converted to a score out of 100, and you pass with 60 points.',
      'Most candidates who fail Lesen run out of time rather than understanding. The strategies below help you finish all five parts.',
    ],
    sections: [
      {
        heading: 'The five parts (overview)',
        bullets: [
          'A personal text such as a blog post or email – true/false questions.',
          'Newspaper or magazine articles – multiple choice.',
          'Short adverts or announcements matched to people’s needs.',
          'Reader opinions on a topic – decide whether each person is for or against.',
          'Rules or instructions (e.g. house rules, course conditions) – multiple choice.',
        ],
      },
      {
        heading: 'Strategies that save time',
        numbered: [
          'Read the questions before the text and underline key words.',
          'Scan the text for those words or synonyms – the answer is usually nearby.',
          'Don’t get stuck: if a question takes more than two minutes, mark it and come back.',
          'Watch for negations (nicht, kein, nie) – they flip true/false answers.',
          'Leave five minutes to transfer answers to the answer sheet.',
        ],
      },
      {
        heading: 'Practice text (B1)',
        paragraphs: [
          'Seit zwei Jahren wohne ich ohne Auto – und ich vermisse es kaum. Ich fahre jeden Tag mit dem Fahrrad zur Arbeit, auch im Winter. Für längere Strecken nutze ich den Zug, und wenn ich etwas Großes transportieren muss, leihe ich mir ein Auto über Carsharing. Am Anfang dachte ich, dass das kompliziert wird. Inzwischen spare ich aber jeden Monat etwa 300 Euro, weil ich keine Versicherung, keine Reparaturen und kein Benzin mehr bezahle. Nur wenn ich meine Eltern auf dem Land besuche, ist es manchmal schwierig, weil der Bus dort nur zweimal am Tag fährt.',
          'Richtig oder falsch? 1. Die Autorin fährt im Winter nicht mit dem Fahrrad. 2. Sie spart durch das Leben ohne Auto Geld. 3. Ihre Eltern wohnen in einer großen Stadt. — Antworten: 1. Falsch. 2. Richtig. 3. Falsch (auf dem Land).',
        ],
      },
    ],
    appTip:
      'Lesen Lab is built for Goethe, telc and TestDaF preparation: graded B1 stories train exactly the reading speed and vocabulary the exam expects, and the quiz after each text checks details just like exam questions.',
    howToHeading: 'Build B1 reading speed',
    howToSteps: [
      { title: 'Read B1 stories daily', text: 'Short texts on everyday and social topics.' },
      { title: 'Time yourself', text: 'Aim to finish a text and its quiz in a few minutes.' },
      { title: 'Review vocabulary', text: 'Spaced repetition for words that blocked you.' },
    ],
    faqs: [
      { question: 'How long is the Goethe B1 reading exam?', answer: '65 minutes.' },
      { question: 'What is the pass mark for Goethe B1 Lesen?', answer: '60 out of 100 points.' },
      { question: 'Can I use a dictionary in the B1 reading exam?', answer: 'No. Dictionaries and other aids are not allowed.' },
      { question: 'How can I improve my B1 reading speed?', answer: 'Read B1 texts daily, read questions first, and practise scanning for key words and synonyms.' },
      { question: 'Which app helps with Goethe B1 reading practice?', answer: `${APP} offers graded B1 stories with quizzes and audio for exam preparation: ${URL}` },
    ],
    sources: [goetheB1Rules, { title: 'Goethe-Zertifikat B1 – official model test (adults)', url: 'https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf' }, cefr],
    screenshotIndex: 4,
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'can-you-learn-german-by-reading',
    keyword: 'can you learn german by reading',
    title: 'Can you learn German just by reading? What works – and what doesn’t',
    metaTitle: 'Can You Learn German by Reading? A Method That Works',
    metaDescription:
      'Reading builds vocabulary and grammar intuition faster than drills – but only at the right level and combined with listening and a little output. Here is a method that works.',
    excerpt: 'Why reading works, its limits, and the read-listen-review method.',
    keyTakeaways: [
      'Reading is one of the most efficient ways to grow vocabulary and absorb grammar – if texts are at your level (about 95% known words).',
      'Reading alone won’t teach pronunciation or speaking; pair it with audio of the same text.',
      'Graded readers and level-sorted stories are better than novels for beginners.',
      'Combine reading with spaced-repetition review so new words stay.',
    ],
    intro: [
      'Yes, reading is one of the most effective ways to learn German – but not on its own and not with any text. When you understand about 95% of the words, your brain can guess the rest from context, and you absorb vocabulary and grammar patterns without drilling them. With harder texts, reading turns into slow dictionary work and you learn far less.',
      'Reading also has limits: it does not train pronunciation, listening speed or speaking. The solution is to read and listen to the same text, and to produce a little German yourself.',
    ],
    sections: [
      {
        heading: 'Why reading works',
        bullets: [
          'You meet words many times in different contexts, which is how long-term memory forms.',
          'You see grammar in use – case endings, verb position, word order – instead of as rules.',
          'You control the speed, which is easier than listening at the start.',
          'It is enjoyable, so you keep going.',
        ],
      },
      {
        heading: 'The read-listen-review method',
        numbered: [
          'Choose a text at your level (one unknown word in twenty or fewer).',
          'Read it once for the story – don’t stop for every unknown word.',
          'Listen to the audio while reading along.',
          'Read again and save five to ten useful new words.',
          'Review those words the next day with spaced repetition.',
          'Write two or three sentences about the text.',
        ],
      },
      {
        heading: 'What to read at each level',
        bullets: [
          'A1–A2: short graded stories and dialogues with audio.',
          'B1: graded readers, simple news (e.g. slow news formats), blog posts.',
          'B2: young adult novels, magazine articles, non-fiction on topics you love.',
        ],
      },
    ],
    appTip:
      'Lesen Lab is built around this method: 1000+ graded stories, native audio for every story, tap-to-translate so you don’t lose the flow, and flashcards with spaced repetition for the words you save.',
    howToHeading: 'Read-listen-review in Lesen Lab',
    howToSteps: [
      { title: 'Read the story', text: 'Tap words only when you’re stuck.' },
      { title: 'Listen along', text: 'Native audio, with slow mode.' },
      { title: 'Review tomorrow', text: 'Spaced-repetition flashcards from your saved words.' },
    ],
    faqs: [
      { question: 'Can you become fluent in German just by reading?', answer: 'Reading builds vocabulary and grammar, but fluency also needs listening and speaking practice. Pair reading with audio and some output.' },
      { question: 'What German books should beginners read?', answer: 'Graded readers or level-sorted stories at A1/A2, ideally with audio, rather than original novels.' },
      { question: 'How many unknown words is too many?', answer: 'If you need to look up more than about one word in ten, the text is too hard to learn from efficiently.' },
      { question: 'Is reading or listening better for learning German?', answer: 'Both. Reading is easier at the start; listening to the same text trains pronunciation and comprehension speed.' },
      { question: 'Which app combines German reading, audio and flashcards?', answer: `${APP} combines graded stories, native audio and spaced-repetition flashcards: ${URL}` },
    ],
    sources: [cefr],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'best-german-podcasts-for-learners',
    keyword: 'best german podcasts for learners',
    title: 'The best German podcasts for learners, sorted by level',
    metaTitle: 'Best German Podcasts for Learners (A1–B2) in 2026',
    metaDescription:
      'Slow German, Coffee Break German, Easy German, DW’s slow news and more – German podcasts for every level, and how to turn listening into real progress.',
    excerpt: 'Podcasts for every level and a method to learn from them.',
    keyTakeaways: [
      'Beginners (A1–A2): Coffee Break German explains in English; DW’s free courses add listening with video.',
      'Lower intermediate (A2–B1): Slow German speaks clearly and slowly about everyday and cultural topics.',
      'Intermediate (B1–B2): Easy German Podcast – natural conversations; DW “Langsam gesprochene Nachrichten” – news read slowly.',
      'Podcasts work best with a transcript: read what you hear when you get lost.',
    ],
    intro: [
      'The best German podcasts for learners match your level. Beginners do well with Coffee Break German, which teaches in English; lower-intermediate learners with Slow German; and intermediate learners with the Easy German Podcast and DW’s slowly spoken news. Interest in German learning podcasts is rising – “best german podcasts” searches grew by about 140% in the past year.',
      'Listening only helps when you understand most of what you hear. A transcript or a text version lets you check the parts you miss.',
    ],
    sections: [
      {
        heading: 'Podcasts by level',
        bullets: [
          'A1–A2 · Coffee Break German: structured lessons with explanations in English.',
          'A2–B1 · Slow German: short episodes about life and culture in Germany, spoken slowly and clearly.',
          'B1 · DW “Langsam gesprochene Nachrichten”: current news read at a slower pace, with text.',
          'B1–B2 · Easy German Podcast: relaxed conversations about life in Germany and learning German.',
          'Video bonus · DW “Nicos Weg”: a free A1–B1 video course with exercises.',
        ],
      },
      {
        heading: 'How to learn from a podcast (not just listen)',
        numbered: [
          'Listen once without stopping – what is the topic?',
          'Listen again with the transcript; underline phrases you want to use.',
          'Repeat short sentences out loud (shadowing).',
          'Save five new words and review them the next day.',
          'Re-listen to the same episode a week later – you will understand much more.',
        ],
      },
      {
        heading: 'When podcasts aren’t enough',
        paragraphs: [
          'Podcasts are great for commuting, but it is hard to see spelling, articles and word endings. Read-along audio – the same text in writing and speech – fills that gap, especially at A1 and A2.',
        ],
      },
    ],
    appTip:
      'Lesen Lab pairs every story with native German audio and a slow mode, so you get the benefit of a podcast plus the text in front of you – and you can tap any word you don’t catch.',
    howToHeading: 'Read-along listening with Lesen Lab',
    howToSteps: [
      { title: 'Play the audio', text: 'Listen first without reading.' },
      { title: 'Read along', text: 'Follow the text and tap unknown words.' },
      { title: 'Slow it down', text: 'Use slow mode for difficult passages.' },
    ],
    faqs: [
      { question: 'What is the best German podcast for beginners?', answer: 'Coffee Break German is popular with beginners because it explains in English. Slow German suits learners from about A2.' },
      { question: 'Is there a German podcast with slow speech?', answer: 'Yes – Slow German and DW’s “Langsam gesprochene Nachrichten” are spoken slowly and clearly.' },
      { question: 'Can I learn German only with podcasts?', answer: 'Podcasts build listening skills, but you also need reading, vocabulary review and some speaking or writing.' },
      { question: 'Is there an app with German stories read aloud?', answer: `Yes. ${APP} has native audio with slow mode for every story: ${URL}` },
    ],
    sources: [dwNicos, cefr],
    screenshotIndex: 1,
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'learn-german-for-free-best-resources',
    keyword: 'learn german for free',
    title: 'Learn German for free: the best free resources in 2026',
    metaTitle: 'Learn German for Free – Best Free Courses, Apps & Tests',
    metaDescription:
      'DW’s Nicos Weg, free model exams from Goethe and telc, slow-news podcasts, libraries and free app tiers: how to build a complete German course without paying.',
    excerpt: 'A complete free learning stack: course, reading, listening, tests.',
    keyTakeaways: [
      'A free structured course: DW Learn German – Nicos Weg covers A1 to B1 with video and exercises.',
      'Free level checks: official model tests from the Goethe-Institut and telc.',
      'Free listening: Slow German, DW slow news, Easy German on YouTube.',
      'Free reading: graded stories in apps with free tiers, and German e-books from public libraries.',
    ],
    intro: [
      'You can learn German to B1 without paying for a course. Combine a free structured course such as DW’s Nicos Weg (A1–B1) with free reading and listening material, and check your progress with the free model tests published by the Goethe-Institut and telc.',
      'What free resources rarely give you is feedback and a plan. Set a fixed daily time and a level goal, and test yourself every two months.',
    ],
    sections: [
      {
        heading: 'A complete free stack',
        bullets: [
          'Course: DW Learn German – Nicos Weg (A1, A2, B1), with videos, exercises and grammar.',
          'Grammar reference: DW’s grammar sections and free online grammar tables.',
          'Listening: Slow German, DW “Langsam gesprochene Nachrichten”, Easy German (YouTube).',
          'Reading: free tiers of reading apps, children’s books and graded readers from your library.',
          'Tests: Goethe-Institut and telc model tests (PDF) for A1–B2.',
          'Speaking: language exchange meetups or tandem partners.',
        ],
      },
      {
        heading: 'A free weekly plan',
        numbered: [
          'Monday–Friday: one Nicos Weg lesson (20 min) + one graded story (15 min).',
          'Daily: 10 minutes flashcard review.',
          'Saturday: one podcast episode with transcript.',
          'Sunday: write a short text about your week; once a month, do one part of a model test.',
        ],
      },
    ],
    appTip:
      'Lesen Lab is free to download and you can start reading straight away – graded A1–B2 stories with native audio, tap-to-translate and flashcards fit neatly into the reading slot of this free plan.',
    howToHeading: 'Add free graded reading',
    howToSteps: [
      { title: 'Download Lesen Lab', text: 'Free to start on iPhone and iPad.' },
      { title: 'Read one story a day', text: 'At your current level.' },
      { title: 'Review saved words', text: 'Flashcards with spaced repetition.' },
    ],
    faqs: [
      { question: 'What is the best free way to learn German?', answer: 'DW’s free Nicos Weg course combined with graded reading, a slow podcast and official model tests.' },
      { question: 'Is Nicos Weg really free?', answer: 'Yes. DW (Deutsche Welle) offers Nicos Weg for free online, covering A1 to B1.' },
      { question: 'Where can I take a free German level test?', answer: 'Use the free model tests from the Goethe-Institut and telc, or online placement tests from language schools.' },
      { question: 'Can I get a German certificate for free?', answer: 'Official certificates (Goethe, telc) cost a fee. In Germany, the DTZ at the end of an integration course can be free or subsidised.' },
      { question: 'Is there a free app for German reading practice?', answer: `${APP} is free to download with graded stories you can start reading right away: ${URL}` },
    ],
    sources: [dwNicos, goetheLevels, cefr],
    screenshotIndex: 0,
  },

  /* ----------------------------------------------------------------- 10 */
  {
    slug: 'easy-german-books-by-level',
    keyword: 'easy german books for beginners',
    title: 'Easy German books by level: what to read from A1 to B2',
    metaTitle: 'Easy German Books for Beginners – Reading List A1 to B2',
    metaDescription:
      'Graded readers for A1–A2, children’s classics like “Das doppelte Lottchen” and “Emil und die Detektive” for B1, and modern novels like “Tschick” for B2 – with tips on reading them.',
    excerpt: 'What to read at each level, from graded readers to Kästner and “Tschick”.',
    keyTakeaways: [
      'A1–A2: graded readers and level-sorted short stories – original books are still too hard.',
      'B1: German children’s classics such as Erich Kästner’s “Das doppelte Lottchen” or “Emil und die Detektive”, and “Der kleine Prinz” in German.',
      'B2: modern young-adult and contemporary novels such as Wolfgang Herrndorf’s “Tschick” or Michael Ende’s “Momo”.',
      'Choose books you would enjoy in your own language – motivation beats difficulty.',
    ],
    intro: [
      'The easiest German books for beginners are graded readers – stories written for a specific level (A1, A2 …) with limited vocabulary. Real German books become realistic at B1, where children’s classics like Erich Kästner’s “Das doppelte Lottchen” work well, and at B2 you can read modern novels such as “Tschick”.',
      'The rule for choosing a book: read the first page. If you need to look up more than one word in ten, put it back and choose something easier – you will learn more from three easy books than from one hard one you never finish.',
    ],
    sections: [
      {
        heading: 'A1–A2: graded readers and short stories',
        bullets: [
          'Graded readers from German language publishers, usually with audio and exercises, labelled by CEFR level.',
          'Level-sorted short-story collections and apps where every text has a level label.',
          'Picture books and early readers for children – simple, but useful for everyday vocabulary.',
        ],
      },
      {
        heading: 'B1: children’s classics',
        bullets: [
          '“Das doppelte Lottchen” (Erich Kästner) – twins swap places; clear language and a gripping plot.',
          '“Emil und die Detektive” (Erich Kästner) – a boy chases a thief through Berlin.',
          '“Der kleine Prinz” (German translation) – familiar story, short chapters.',
          '“Die kleine Hexe” (Otfried Preußler) – simple, funny chapters.',
        ],
      },
      {
        heading: 'B2: modern novels',
        bullets: [
          '“Tschick” (Wolfgang Herrndorf) – a road trip through eastern Germany; widely read in German schools.',
          '“Momo” (Michael Ende) – a modern fable about time.',
          '“Die Welle” (Morton Rhue, German translation) – short and discussion-friendly.',
        ],
      },
      {
        heading: 'How to read a German book without giving up',
        numbered: [
          'Read a chapter for the plot first; don’t look up every word.',
          'Mark only words that appear several times or block understanding.',
          'Use the audiobook version for difficult chapters.',
          'Set a small daily goal – five pages is enough.',
        ],
      },
    ],
    appTip:
      'Before you are ready for real books, Lesen Lab bridges the gap: 1000+ stories sorted from A1 to B2, each with audio and tap-to-translate, so you can build the vocabulary that makes Kästner and “Tschick” enjoyable.',
    howToHeading: 'Build up to real books',
    howToSteps: [
      { title: 'Start with graded stories', text: 'A1 and A2 stories in Lesen Lab.' },
      { title: 'Move up a level', text: 'When a level feels easy, switch to the next.' },
      { title: 'Try a real book at B1', text: 'Your saved vocabulary makes it manageable.' },
    ],
    faqs: [
      { question: 'What is the easiest German book to read?', answer: 'For true beginners, graded readers written for A1. Among original books, short children’s classics like “Die kleine Hexe” are relatively easy at B1.' },
      { question: 'What German book should I read at B1?', answer: 'Erich Kästner’s “Das doppelte Lottchen” or “Emil und die Detektive” are popular choices for B1 learners.' },
      { question: 'Is “Tschick” good for learners?', answer: 'Yes, at about B2. It uses modern colloquial German and is widely read in German schools.' },
      { question: 'Should I read German books with a dictionary?', answer: 'Only for words that block understanding. Looking up every word slows you down and kills motivation.' },
      { question: 'Is there an app with easy German stories by level?', answer: `Yes. ${APP} has 1000+ stories sorted A1–B2 with audio and translations: ${URL}` },
    ],
    sources: [cefr],
    screenshotIndex: 0,
  },
];

export const lesenlabGuides2: AppGuide[] = guides.map((guide) => ({
  ...guide,
  lang: 'en',
  publishedAt: '2026-10-10',
  reviewedAt: '2026-10-10',
}));
