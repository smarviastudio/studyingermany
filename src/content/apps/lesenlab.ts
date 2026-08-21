import { BookOpen, Headphones, Languages, Brain, GraduationCap, Sparkles } from 'lucide-react';
import type { AppContent } from './types';

export const lesenlab: AppContent = {
  slug: 'lesenlab-german-reading-app',
  appId: '6752349330',
  name: 'Lesen Lab',
  storeName: 'Lesen Lab: Learn German A1-B2',
  subtitle: 'Reading, Audio & Flashcards',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/lesen-lab-learn-german-a1-b2/id6752349330',
  icon: '/apps/lesenlab/icon.webp',
  accent: '#f472b6',
  accentDark: '#7c3aed',
  heroTitle: {
    pre: 'The German Reading App That Teaches You With',
    highlight: 'Real Stories',
    post: '(A1–B2)',
  },
  heroDescription:
    'Lesen Lab is a German reading app for iPhone and iPad with 1000+ graded short stories from A1 to B2 — every one with native German audio, tap-to-translate, and built-in flashcards. Learn German the way that actually sticks: through stories you enjoy, not random sentences you forget.',
  heroBenefits: [
    '1000+ German stories sorted by CEFR level (A1, A2, B1, B2)',
    'Native German audio with slow mode for every story',
    'Tap any word or sentence for an instant English translation',
    'Spaced-repetition flashcards and quizzes after each text',
    'Built for Goethe, telc and TestDaF exam preparation',
  ],
  metaTitle: 'Lesen Lab – German Reading App: Stories A1–B2',
  metaDescription:
    'Learn German with 1000+ graded stories (A1–B2), native audio, instant translations and flashcards. The German reading app for Goethe and telc prep.',
  metaKeywords:
    'German reading app, learn German with stories, German stories for beginners, German stories A1 A2 B1 B2, German reading practice, Goethe reading practice, telc reading practice, TestDaF preparation app, German graded readers, learn German vocabulary',
  screenshots: [
    { src: '/apps/lesenlab/screenshot-1.webp', alt: 'Lesen Lab German reading app – learn German by stories with a graded A1 story and audio player' },
    { src: '/apps/lesenlab/screenshot-2.webp', alt: 'Lesen Lab – reading a German short story with native audio' },
    { src: '/apps/lesenlab/screenshot-3.webp', alt: 'Lesen Lab – tap-to-translate a German word into English instantly' },
    { src: '/apps/lesenlab/screenshot-4.webp', alt: 'Lesen Lab – German vocabulary flashcards with spaced repetition' },
    { src: '/apps/lesenlab/screenshot-5.webp', alt: 'Lesen Lab – German grammar tips and exercises' },
    { src: '/apps/lesenlab/screenshot-6.webp', alt: 'Lesen Lab – quiz after a German story to review vocabulary' },
    { src: '/apps/lesenlab/screenshot-7.webp', alt: 'Lesen Lab – progress tracking across German levels A1 to B2' },
  ],
  audience: [
    {
      badge: 'A1–A2',
      title: 'Beginners',
      description: 'Start with very short, simple stories with audio and instant translations, so you build confidence from your first week of German.',
      color: '#059669',
    },
    {
      badge: 'B1–B2',
      title: 'Exam Candidates',
      description: 'Preparing for Goethe, telc or TestDaF? Train the reading and listening skills the exams actually test, at the right CEFR level.',
      color: '#7c3aed',
    },
    {
      badge: 'All Levels',
      title: 'Story Lovers',
      description: 'Tired of drilling random sentences in other apps? Read fairy tales, dialogues and real-life articles that make German memorable.',
      color: '#db2777',
    },
  ],
  features: [
    {
      icon: BookOpen,
      title: 'Graded German Stories (A1–B2)',
      description:
        'Over 1000 German stories divided by CEFR level — fairy tales, everyday dialogues and real articles. Clear level labels mean you always read at the right difficulty: challenged, never overwhelmed.',
      color: '#db2777',
    },
    {
      icon: Headphones,
      title: 'Read & Listen Together',
      description:
        'Every story comes with native German audio, so you train listening and pronunciation while you read. Use slow mode and replay tricky sentences as often as you like.',
      color: '#7c3aed',
    },
    {
      icon: Languages,
      title: 'Instant Tap-to-Translate',
      description:
        'Stuck on a word or sentence? Tap it and see the English translation instantly — no dictionary apps, no losing your place in the story.',
      color: '#059669',
    },
    {
      icon: Brain,
      title: 'Flashcards & Spaced Repetition',
      description:
        'New words are saved into built-in flashcards with spaced repetition, so vocabulary moves into long-term memory. Quizzes after each text review words and grammar in context.',
      color: '#d97706',
    },
    {
      icon: GraduationCap,
      title: 'Goethe, telc & TestDaF Prep',
      description:
        'Structured reading and listening practice across A1–B2 — exactly the skills tested in Goethe, telc and TestDaF exams. Track your progress by level and watch your German improve.',
      color: '#0284c7',
    },
    {
      icon: Sparkles,
      title: 'Free to Start',
      description:
        'Download free and read your first stories today. Upgrade to PRO for the full library, all grammar explanations, unlimited flashcards and offline mode — weekly, monthly, yearly or lifetime.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Choose Your Level', description: 'Pick your German level (A1–B2) and a short story that matches your skills and interests.' },
    { title: 'Read & Listen', description: 'Read along with native German audio, tapping any word for an instant translation.' },
    { title: 'Review & Practice', description: 'Save new words to flashcards, then take the quiz after the story to lock in vocabulary and grammar.' },
    { title: 'Track Progress', description: 'Watch your level rise from A1 towards B2 with consistent daily reading practice.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'Lesen Lab is free to download on iPhone and iPad. Start reading immediately, and upgrade to PRO when you want the full library — with weekly, monthly, yearly and lifetime options available in the app.',
  pricingPro: {
    name: 'Lesen Lab PRO',
    bullets: [
      'Full story library (1000+ stories, A1–B2)',
      'All grammar explanations & exercises',
      'Unlimited flashcards & review mode',
      'Offline mode — read German anywhere',
    ],
    note: 'Weekly, monthly, yearly & lifetime options available',
  },
  guides: [
    {
      slug: 'learn-german-with-stories',
      keyword: 'learn german with stories',
      title: 'How to Learn German With Stories (and Why It Works)',
      metaTitle: 'Learn German With Stories: The Method That Sticks',
      metaDescription:
        'Learning German with stories builds vocabulary, grammar and listening in context. Why it works, and how to do it with graded A1–B2 stories.',
      excerpt: 'Why story-based learning beats sentence drills — and a step-by-step routine for learning German through graded stories.',
      intro: [
        'Learning German with stories is one of the most effective methods in language research — and one of the most enjoyable. Instead of memorizing isolated words, you meet vocabulary and grammar inside a context your brain actually wants to remember: characters, problems, and what happens next.',
        'The catch is that stories only work when they match your level. A newspaper article at A2 is frustrating; a children\'s book at B2 is boring. That is exactly the problem graded readers — and Lesen Lab — were built to solve.',
      ],
      sections: [
        {
          heading: 'Why stories beat vocabulary lists',
          paragraphs: [
            'Research on "comprehensible input" shows that languages are acquired fastest when you understand messages that are just slightly above your current level. A story gives every new word a context, an emotion and a plot hook — three memory anchors a flashcard alone can never provide.',
          ],
          bullets: [
            'Words repeat naturally: high-frequency German vocabulary appears again and again across stories.',
            'Grammar is absorbed in patterns: you see "weil" sentences and dative articles used correctly hundreds of times.',
            'Reading builds listening: following a story with audio trains your ear at the same time.',
            'Motivation lasts: finishing a story feels like progress, so you come back tomorrow.',
          ],
        },
        {
          heading: 'The 20-minute daily story routine',
          numbered: [
            'Pick a story at your exact CEFR level (A1–B2) — you should understand roughly 90% without help.',
            'Read it once while listening to the native audio, without stopping.',
            'Read it again, tapping unknown words for translations and saving them to flashcards.',
            'Do the quiz after the story to check comprehension.',
            'Review yesterday\'s flashcards for five minutes before starting today\'s story.',
          ],
        },
      ],
      howToHeading: 'How to learn German with stories in Lesen Lab',
      howToSteps: [
        { title: 'Choose your level', text: 'Open Lesen Lab and select A1, A2, B1 or B2. Every one of the 1000+ stories is clearly labeled, so you never guess whether a text fits you.' },
        { title: 'Read with audio', text: 'Press play and read along with native German narration. Use slow mode when the pace is too quick, and replay any sentence.' },
        { title: 'Tap to translate', text: 'Tap any word or full sentence for an instant English translation — you stay inside the story instead of switching to a dictionary.' },
        { title: 'Save words to flashcards', text: 'New words go straight into spaced-repetition flashcards, so they come back for review exactly when you are about to forget them.' },
        { title: 'Finish with the quiz', text: 'Each story ends with a short quiz on vocabulary and grammar, turning passive reading into active recall.' },
      ],
      faqs: [
        {
          question: 'Can a complete beginner learn German with stories?',
          answer: 'Yes — if the stories are written for A1 level. Lesen Lab\'s A1 stories use short sentences, present tense and high-frequency words, with audio and instant translations so you are never stuck.',
        },
        {
          question: 'How many stories should I read per day?',
          answer: 'One story a day (15–20 minutes) is enough for steady progress. Consistency beats bingeing: 7 short sessions a week outperform one long weekend session.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'german-short-stories-for-beginners',
      keyword: 'german short stories for beginners',
      title: 'German Short Stories for Beginners (A1/A2) — With Audio & Translations',
      metaTitle: 'German Short Stories for Beginners (A1/A2) With Audio',
      metaDescription:
        'Looking for German short stories for beginners? Get 1000+ graded A1/A2 stories with native audio, translations and flashcards. Free to start.',
      excerpt: 'Where to find genuinely beginner-friendly German stories — and what a good A1/A2 story needs to teach you fast.',
      intro: [
        'The best German short stories for beginners share three traits: they are genuinely written for A1/A2 level (not just "simplified"), they come with audio so you learn pronunciation from day one, and they let you check any word instantly so frustration never wins.',
        'Free stories on random websites usually fail at least one of these tests — most have no audio, no level grading and no translation support. Here is what to look for, and how Lesen Lab packs all of it into one app.',
      ],
      sections: [
        {
          heading: 'What makes a story truly "beginner level"?',
          bullets: [
            'Short sentences (max. 8–10 words) using present tense and the most common 500–1000 German words.',
            'A clear, everyday setting — at the bakery, at the train station, meeting a friend — so context does half the translation work.',
            'Repetition of key structures: the same verbs and articles appearing naturally throughout the text.',
            'Length of 100–300 words: long enough for a real plot, short enough to finish in one sitting.',
          ],
        },
        {
          heading: 'Why audio matters from your first story',
          paragraphs: [
            'German pronunciation is regular, but only if your brain has heard enough of it. Reading "ch", "ei" and "eu" without audio lets wrong pronunciations fossilize. Listening while reading — even at slow speed — wires spelling and sound together from the start, which pays off enormously when you later train speaking and listening comprehension.',
          ],
        },
        {
          heading: 'From A1 stories to A2: when to level up',
          paragraphs: [
            'Move up when a story at your level feels easy: you understand 95%+ without tapping translations, and the quiz feels effortless. In Lesen Lab you can jump between levels freely, so try one A2 story as a test — if you understand about 90%, it is time.',
          ],
        },
      ],
      howToHeading: 'How to read beginner German stories in Lesen Lab',
      howToSteps: [
        { title: 'Start in the A1 section', text: 'Lesen Lab labels every story by CEFR level. As a beginner, start with A1 fairy tales and everyday dialogues.' },
        { title: 'Listen first, then read along', text: 'Play the native audio once with the text in front of you, then read again with slow mode if needed.' },
        { title: 'Tap unknown words', text: 'Instant English translations keep you moving — aim to understand the story, not to memorize everything.' },
        { title: 'Review with flashcards & quiz', text: 'Save new words and finish with the story quiz. After 20–30 A1 stories, test yourself with an A2 story.' },
      ],
      faqs: [
        {
          question: 'Are Lesen Lab\'s beginner stories free?',
          answer: 'You can download Lesen Lab for free and start reading immediately. PRO unlocks the full library of 1000+ stories plus unlimited flashcards and offline mode.',
        },
        {
          question: 'Do the stories use real, everyday German?',
          answer: 'Yes. A1/A2 stories are built around everyday scenes — shopping, travel, friends, work — using the vocabulary you will actually need in Germany, Austria or Switzerland.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'improve-german-reading-comprehension',
      keyword: 'how to improve german reading comprehension',
      title: 'How to Improve Your German Reading Comprehension: 7 Techniques',
      metaTitle: 'How to Improve German Reading Comprehension',
      metaDescription:
        'Struggling with German texts? These 7 techniques — graded reading, re-reading with audio, chunking and active recall — improve comprehension.',
      excerpt: 'Seven concrete techniques to understand German texts faster — from graded input to re-reading with audio.',
      intro: [
        'If German texts still feel like decoding instead of reading, the problem is usually not vocabulary — it is method. Reading texts far above your level, translating word by word, and never re-reading are the three habits that keep comprehension stuck.',
        'These seven techniques are used in reading research and exam prep courses, and every one of them is faster with the right tools.',
      ],
      sections: [
        {
          heading: 'The 7 techniques',
          numbered: [
            'Read at 90% comprehension ("i+1"): choose graded texts where only ~1 word in 10 is new. Below that, you are decoding, not reading.',
            'Read the same text twice: first pass for the plot, second pass for the details. Comprehension typically jumps 20–30% on the second pass.',
            'Add audio: listening while reading forces your brain to process at natural speed and stops subvocalized mistranslation.',
            'Chunk, don\'t translate: train yourself to understand phrase by phrase ("am nächsten Morgen", "auf dem Weg zur Arbeit") instead of word by word.',
            'Predict before you read: look at the title and guess the content in German. Prediction primes comprehension.',
            'Use active recall: after reading, summarize the story in 2–3 German sentences or take a quiz — this doubles retention versus just moving on.',
            'Track unknown words, not pages: if your "new words per story" count drops week over week at the same level, your comprehension is measurably improving.',
          ],
        },
        {
          heading: 'The biggest mistake: reading texts that are too hard',
          paragraphs: [
            'News articles and novels feel like "real German", but if you understand less than 80%, your brain has no spare capacity to acquire anything — every sentence becomes a dictionary session. Graded stories that grow with you (A1 → A2 → B1 → B2) keep you in the acquisition zone the whole way to fluent reading.',
          ],
        },
      ],
      howToHeading: 'How to apply these techniques in Lesen Lab',
      howToSteps: [
        { title: 'Set the right level', text: 'Choose the CEFR level where you understand about 90% — Lesen Lab\'s levels make "i+1" reading automatic.' },
        { title: 'First read with audio', text: 'Play native audio while reading for plot understanding at natural speed.' },
        { title: 'Second read with taps', text: 'Re-read, tapping the words you missed. Save them as flashcards for spaced review.' },
        { title: 'Quiz for active recall', text: 'The after-story quiz is your comprehension check — aim for full marks before moving to the next story.' },
        { title: 'Watch your stats', text: 'Track progress by level in the app and level up when stories start feeling easy.' },
      ],
      faqs: [
        {
          question: 'How long does it take to improve German reading comprehension?',
          answer: 'With daily 20-minute graded reading, most learners feel a clear difference within 4–6 weeks and can typically move up a CEFR sublevel within 2–3 months.',
        },
        {
          question: 'Should I read out loud?',
          answer: 'Occasionally, yes — reading a paragraph aloud after listening to the native audio improves pronunciation and reading fluency at the same time.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'goethe-telc-testdaf-reading-practice',
      keyword: 'goethe telc testdaf reading practice',
      title: 'Goethe, telc & TestDaF Reading Practice: How to Prepare (A1–B2)',
      metaTitle: 'Goethe, telc & TestDaF Reading Practice App (A1–B2)',
      metaDescription:
        'Goethe, telc and TestDaF reading sections reward daily graded practice. What each exam tests, and how to build speed with 1000+ A1–B2 stories.',
      excerpt: 'What the Goethe, telc and TestDaF reading sections actually test — and the daily practice that raises your score.',
      intro: [
        'Every major German exam — Goethe-Zertifikat, telc Deutsch and TestDaF — has a dedicated reading section, and it is the section where daily habits matter most. You cannot cram reading speed; you build it, story by story, in the weeks before the exam.',
        'Here is what each exam expects at A1–B2, and a preparation routine that trains exactly those skills.',
      ],
      sections: [
        {
          heading: 'What the reading sections test',
          bullets: [
            'Goethe-Zertifikat A1–B2: short everyday texts (ads, emails, articles) with matching, true/false and multiple-choice tasks — speed and gist reading matter.',
            'telc Deutsch A2–B2: reading comprehension of practical texts plus language elements in context — vocabulary breadth is rewarded.',
            'TestDaF (B2+): longer academic texts with detail and inference questions — stamina and structured reading are decisive.',
          ],
        },
        {
          heading: 'The 6-week reading preparation plan',
          numbered: [
            'Weeks 1–2: read one graded story daily at your exam level; save every unknown word to flashcards.',
            'Weeks 3–4: increase to two stories daily — one read intensively (tap, save, quiz), one read fast for gist only.',
            'Week 5: mix levels — read one story above your exam level daily to make exam texts feel easy by comparison.',
            'Week 6: simulate exam conditions — read without translations, answer the quiz, then check what you missed.',
          ],
        },
        {
          heading: 'Why graded stories beat past papers (until the final week)',
          paragraphs: [
            'Past exam papers are for strategy, not skill. There are only a handful of official practice sets, and repeating them teaches you the format, not the language. The skill itself — fast, confident comprehension of German text — comes from volume: dozens of level-appropriate texts with immediate feedback. Save the past papers for your final week.',
          ],
        },
      ],
      howToHeading: 'How to prep for your exam with Lesen Lab',
      howToSteps: [
        { title: 'Match your exam level', text: 'Choose the CEFR level of your target exam — A1 to B2 — and read only at that level for the first two weeks.' },
        { title: 'Train listening in parallel', text: 'Play the native audio with every story: Goethe and telc test listening too, and story audio trains both skills at once.' },
        { title: 'Build exam vocabulary', text: 'Save unknown words to flashcards; spaced repetition ensures they stick before exam day.' },
        { title: 'Quiz like it\'s the exam', text: 'Treat every after-story quiz as a mini reading task: no translations, time pressure, full marks as the goal.' },
        { title: 'Track readiness', text: 'When you consistently understand 95% of stories at exam level, your reading section is ready.' },
      ],
      faqs: [
        {
          question: 'Is Lesen Lab enough to pass the Goethe B1 reading section?',
          answer: 'Lesen Lab builds the underlying skill — fast comprehension of B1-level German. Combine daily story practice with one or two official practice sets in your final week to learn the task formats.',
        },
        {
          question: 'Which level should I read at for TestDaF?',
          answer: 'TestDaF sits at roughly B2–C1. Read B2 stories daily, and use the intensive re-read technique to squeeze full value from each text.',
        },
      ],
      screenshotIndex: 4,
    },
    {
      slug: 'german-listening-practice',
      keyword: 'german listening practice for beginners',
      title: 'German Listening Practice for Beginners: Read-Along Audio Stories',
      metaTitle: 'German Listening Practice: Audio Stories (A1–B2)',
      metaDescription:
        'The fastest German listening practice is read-along audio: native narration you follow with the text. The method, plus 1000+ graded stories.',
      excerpt: 'Why read-along audio stories are the fastest listening practice — and how to use slow mode and replay properly.',
      intro: [
        'Most beginners find spoken German overwhelming: native speed, unfamiliar sounds, words melting together. The fix is not more podcasts — it is read-along listening, where you hear native audio while following the exact text with your eyes.',
        'Read-along listening removes the guesswork. Your ears learn what "Ich hätte gern…" actually sounds like while your eyes confirm what was said — and after a few dozen stories, you stop needing the text.',
      ],
      sections: [
        {
          heading: 'Why podcasts fail beginners (and read-along works)',
          paragraphs: [
            'A podcast for learners still leaves you guessing whenever you miss a word — and at A1/A2 you miss many. Guessing wrong reinforces wrong hearing. With synchronized text, every sound is instantly verified, so your brain builds correct sound-to-word mappings hundreds of times per story.',
          ],
          bullets: [
            'Text anchors your ear: no word goes unidentified.',
            'Slow mode gives your brain processing time without distorting pronunciation.',
            'Replay lets you drill exactly the sentence that lost you.',
            'Graded stories keep the vocabulary load manageable while your ear catches up.',
          ],
        },
        {
          heading: 'The 3-pass listening method',
          numbered: [
            'Pass 1 — Listen only: play the story without reading. Understand what you can; do not worry about the rest.',
            'Pass 2 — Listen + read: follow the text while listening. Notice every word you missed in pass 1.',
            'Pass 3 — Listen only again: play it once more without the text. The jump in comprehension between pass 1 and pass 3 is your listening skill growing in real time.',
          ],
        },
      ],
      howToHeading: 'How to practice listening with Lesen Lab',
      howToSteps: [
        { title: 'Pick a story at your level', text: 'Choose an A1 or A2 story — listening practice only works when the vocabulary is mostly familiar.' },
        { title: 'Run the 3-pass method', text: 'Listen blind, then listen while reading, then listen blind again. Use slow mode on pass 2 if needed.' },
        { title: 'Replay hard sentences', text: 'Rewind any sentence that melts together. Hearing it five times with text is what fixes it permanently.' },
        { title: 'Check with the quiz', text: 'Finish with the story quiz to confirm you understood — not just heard — the German.' },
      ],
      faqs: [
        {
          question: 'How much listening practice per day do beginners need?',
          answer: 'Fifteen minutes of focused read-along listening daily beats an hour of background podcasts. The 3-pass method on one short story is a perfect daily session.',
        },
        {
          question: 'Is the audio in Lesen Lab from native speakers?',
          answer: 'Yes — every story has native German audio, with slow mode and per-sentence replay so you can train at your own pace.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'learn-german-vocabulary-flashcards',
      keyword: 'best way to learn german vocabulary',
      title: 'The Best Way to Learn German Vocabulary: Stories + Spaced Repetition',
      metaTitle: 'Best Way to Learn German Vocabulary: Spaced Repetition',
      metaDescription:
        'The best way to learn German vocabulary combines stories with spaced-repetition flashcards. The science, and a daily routine that makes words stick.',
      excerpt: 'Context plus spaced repetition is the vocabulary formula — here\'s the routine that makes German words stick permanently.',
      intro: [
        'There are two proven pillars of vocabulary learning: context (meeting words inside real sentences) and spaced repetition (reviewing them at growing intervals just before you forget). Most learners use one or the other. The learners who progress fastest use both, connected.',
        'That connection is the trick: words you save while reading a story carry their context with them — and context is what makes a flashcard reviewable years later.',
      ],
      sections: [
        {
          heading: 'Why word lists fail',
          paragraphs: [
            'A list of 50 translated words gives your memory nothing to grip: no sentence, no situation, no emotion. Research consistently shows contextualized vocabulary outperforms isolated lists on long-term retention — often by a factor of two or more. If you have ever "learned" a list on Monday and lost it by Friday, you have felt this.',
          ],
        },
        {
          heading: 'The spaced repetition effect',
          paragraphs: [
            'Your brain strengthens a memory most when it retrieves it just before forgetting. Spaced-repetition systems (SRS) schedule each word\'s reviews at exactly those moments — typically after 1 day, 3 days, 1 week, 1 month. Ten minutes of SRS review daily maintains thousands of words.',
          ],
          bullets: [
            'New words come back the next day, while still fresh.',
            'Known words wait longer, so you never waste reviews.',
            'Struggling words repeat sooner, automatically.',
          ],
        },
        {
          heading: 'The daily vocabulary routine (20 minutes)',
          numbered: [
            'Read one graded story and tap-save every genuinely useful unknown word (5–10 per story is ideal).',
            'Review today\'s due flashcards — the app schedules them, you just answer.',
            'Take the story quiz to retrieve the new words one extra time in context.',
          ],
        },
      ],
      howToHeading: 'How Lesen Lab combines stories and flashcards',
      howToSteps: [
        { title: 'Save words as you read', text: 'Tap any word in a story for the translation, and save it to your flashcard deck in the same tap.' },
        { title: 'Review with spaced repetition', text: 'Lesen Lab schedules each card\'s reviews automatically, so words return exactly when your memory needs them.' },
        { title: 'Reinforce with quizzes', text: 'After-story quizzes retrieve new vocabulary in context — a second memory pathway on top of the flashcards.' },
        { title: 'Watch your word count grow', text: 'Track saved and mastered words by level as your active German vocabulary compounds week after week.' },
      ],
      faqs: [
        {
          question: 'How many German words should I learn per day?',
          answer: 'Five to ten new words daily from your reading is sustainable and compounds to 2000–3500 words a year — enough to reach B1–B2 comprehension.',
        },
        {
          question: 'Are Lesen Lab flashcards unlimited?',
          answer: 'The free version includes flashcards to get started; Lesen Lab PRO unlocks unlimited flashcards plus the full review mode.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'What is Lesen Lab?',
      answer:
        'Lesen Lab is a German reading app for iPhone and iPad that teaches German through 1000+ short, graded stories from A1 to B2 — each with native audio, instant translations, flashcards and quizzes.',
      learnMoreSlug: 'learn-german-with-stories',
    },
    {
      question: 'Is Lesen Lab good for complete beginners?',
      answer:
        'Yes. The A1 section uses very short sentences, everyday vocabulary, native audio with slow mode and tap-to-translate, so you can start reading real German from your first day.',
      learnMoreSlug: 'german-short-stories-for-beginners',
    },
    {
      question: 'Can I use Lesen Lab for Goethe, telc or TestDaF preparation?',
      answer:
        'Yes. Lesen Lab trains the reading and listening comprehension these exams test, with content organized by the same CEFR levels (A1–B2) the exams use.',
      learnMoreSlug: 'goethe-telc-testdaf-reading-practice',
    },
    {
      question: 'How is Lesen Lab different from Duolingo?',
      answer:
        'Duolingo drills short exercises; Lesen Lab builds deep reading and listening skills with complete stories, native audio and contextual flashcards. Many learners use both — stories for skill, drills for habit.',
      learnMoreSlug: 'improve-german-reading-comprehension',
    },
    {
      question: 'Does Lesen Lab help with listening comprehension?',
      answer:
        'Every story includes native German audio with slow mode and replay, so you train listening and reading simultaneously — the fastest route to understanding spoken German.',
      learnMoreSlug: 'german-listening-practice',
    },
    {
      question: 'How does the vocabulary trainer work?',
      answer:
        'Words you tap while reading can be saved as flashcards with spaced repetition. The app schedules reviews at the optimal moment, and quizzes after each story reinforce the words in context.',
      learnMoreSlug: 'learn-german-vocabulary-flashcards',
    },
    {
      question: 'Is Lesen Lab free?',
      answer:
        'Lesen Lab is free to download with a selection of stories and features included. PRO unlocks all 1000+ stories, full grammar explanations, unlimited flashcards and offline mode — as weekly, monthly, yearly or lifetime plans.',
    },
    {
      question: 'Which devices does Lesen Lab support?',
      answer:
        'Lesen Lab runs on iPhone and iPad (iOS 18.5 or later). Your progress and flashcards stay in sync on your device.',
    },
  ],
  ctaHeading: 'Start Learning German Today',
  ctaText:
    'Join learners around the world improving their German with Lesen Lab. Download free and finish your first story in the next ten minutes.',
  ratingValue: '5.0',
  ratingCount: '1',
  category: 'EducationApplication',
  downloadNote: 'Free to download • In-app purchases available',
};
