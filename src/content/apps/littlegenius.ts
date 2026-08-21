import { Type, Volume2, Hash, Palette, Sticker, ShieldCheck } from 'lucide-react';
import type { AppContent } from './types';

export const littlegenius: AppContent = {
  slug: 'preschool-learning-games-app',
  appId: '6787775177',
  name: 'Little Genius',
  storeName: 'Little Genius: Preschool Games',
  subtitle: 'Letters, Phonics, Numbers & Tracing',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/little-genius-preschool-games/id6787775177',
  icon: '/apps/littlegenius/icon.webp',
  accent: '#f43f5e',
  accentDark: '#9f1239',
  heroTitle: {
    pre: 'One Playful App for Letters, Numbers and',
    highlight: 'Everything Before School',
    post: '',
  },
  heroDescription:
    'Little Genius is a colourful early learning world for children aged 2 to 7. Tracing, phonics, first words, counting, memory games, quizzes and drawing live in one app — built for short sessions and independent play, with time limits parents control.',
  heroBenefits: [
    'Trace letters, numbers and shapes with guided strokes',
    'Phonics sounds matched to the right letter',
    'Build first words with picture hints',
    'Counting, memory and quick quizzes',
    'Drawing tools, stars, badges and stickers',
  ],
  metaTitle: 'Little Genius – Preschool Learning Games App for Ages 2–7',
  metaDescription:
    'Letters, phonics, tracing, numbers, words, memory and drawing in one preschool app. Little Genius builds early reading, writing and counting confidence for ages 2–7. Free on iPhone and iPad.',
  metaKeywords:
    'preschool app, learning games for kids, abc app for toddlers, phonics app, letter tracing app, counting app for preschoolers, kindergarten readiness, educational games ages 3-5, toddler learning app',
  screenshots: [
    { src: '/apps/littlegenius/screenshot-1.webp', alt: 'Little Genius preschool app – colourful learning activity menu' },
    { src: '/apps/littlegenius/screenshot-2.webp', alt: 'Little Genius – letter tracing activity for preschoolers' },
    { src: '/apps/littlegenius/screenshot-3.webp', alt: 'Little Genius – phonics sounds and letter matching game' },
    { src: '/apps/littlegenius/screenshot-4.webp', alt: 'Little Genius – counting and number recognition activity' },
    { src: '/apps/littlegenius/screenshot-5.webp', alt: 'Little Genius – memory cards and quiz games for kids' },
    { src: '/apps/littlegenius/screenshot-6.webp', alt: 'Little Genius – drawing and colouring tools with rewards' },
  ],
  audience: [
    {
      badge: 'Ages 2–4',
      title: 'Toddlers Getting Started',
      description: 'Big touch targets, sounds and instant feedback. Early activities work before a child can read a single instruction.',
      color: '#9f1239',
    },
    {
      badge: 'Ages 4–7',
      title: 'Preschool & Kindergarten',
      description: 'Tracing, phonics and first words map onto exactly what children practise in their first years of school.',
      color: '#0284c7',
    },
    {
      badge: 'Parents',
      title: 'Parents Who Watch Screen Time',
      description: 'Daily time limits, a progress view and no chaotic reward loops — designed for a focused fifteen minutes, not an afternoon.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: Type,
      title: 'Letter & Number Tracing',
      description:
        'Guided strokes for uppercase letters, lowercase letters, numbers and shapes — the fine motor practice that comes before handwriting.',
      color: '#9f1239',
    },
    {
      icon: Volume2,
      title: 'Phonics That Sound Right',
      description:
        'Children hear a sound and choose the matching letter, building the sound-to-letter link that early reading depends on.',
      color: '#0284c7',
    },
    {
      icon: Hash,
      title: 'Counting & Numbers',
      description:
        'Count objects, pick the matching number, and connect quantity to symbol — the foundation under all early maths.',
      color: '#059669',
    },
    {
      icon: Sticker,
      title: 'Words, Memory & Quizzes',
      description:
        'Build simple words with picture hints, match memory cards and answer quick quizzes that keep sessions varied and short.',
      color: '#d97706',
    },
    {
      icon: Palette,
      title: 'Draw and Create',
      description:
        'Open-ended drawing and colouring tools give children somewhere to play freely once the structured activities are done.',
      color: '#7c3aed',
    },
    {
      icon: ShieldCheck,
      title: 'Parent Controls',
      description:
        'Set a daily time limit and check the progress view to see which activities your child is actually spending time on.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Pick an Activity', description: 'Tracing, phonics, counting, words, memory, quiz or drawing.' },
    { title: 'Play a Short Session', description: 'Activities are built for a few focused minutes, not endless play.' },
    { title: 'Earn Stars and Badges', description: 'Stickers and friendly buddies reward finishing, not just tapping.' },
    { title: 'Check Progress', description: 'Parents see what has been practised and can set a daily time limit.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'Little Genius is free to download with a set of activities available from the start.',
  pricingPro: {
    name: 'Little Genius Premium',
    bullets: [
      'The complete learning world unlocked',
      'All activity types and content',
      'One simple premium unlock',
      'No ads interrupting the activities',
    ],
    note: 'Optional in-app purchase',
  },
  guides: [
    {
      slug: 'teach-preschooler-letters-and-phonics',
      keyword: 'how to teach a preschooler letters and phonics',
      title: 'How to Teach a Preschooler Letters and Phonics (In the Right Order)',
      metaTitle: 'Teaching Preschoolers Letters & Phonics: The Right Order',
      metaDescription:
        'Letter names or letter sounds first? Here is the order early reading actually develops, which letters to start with, and how much practice a 3–5 year old needs.',
      excerpt: 'Sounds before names, common letters before the alphabet song — the order early reading actually develops in.',
      intro: [
        'Most parents start with the alphabet song and uppercase letters, because that is how we remember learning it. Reading research points somewhere slightly different: children get further, faster, when they learn letter sounds before letter names, and start with the letters that appear most in simple words.',
        'None of this requires a curriculum at home. It requires knowing the order, and doing a little of it often.',
      ],
      sections: [
        {
          heading: 'The order that works',
          numbered: [
            'Sounds before names: "mmm" is more useful for reading than "em". Letter names come along naturally afterwards.',
            'Start with high-frequency, easy-to-blend letters — s, a, t, p, i, n — rather than marching through A to Z.',
            'Blend as soon as you have a few sounds: with s, a and t a child can read "sat". Reading a real word early is enormously motivating.',
            'Add lowercase early. Books are mostly lowercase, but children are usually taught uppercase first.',
            'Bring in tracing alongside sounds — writing a letter reinforces recognising it.',
          ],
        },
        {
          heading: 'How much practice is enough',
          bullets: [
            'Five to ten minutes a day beats an hour at the weekend — early literacy is built by frequency.',
            'Stop while the child is still enjoying it. Ending on success is what makes them willing tomorrow.',
            'Mix modes: hearing a sound, choosing a letter, tracing it, finding it in a book.',
            'Expect uneven progress. Plateaus of several weeks are completely normal at this age.',
          ],
        },
        {
          heading: 'What not to worry about',
          paragraphs: [
            'Letter reversals — b and d, p and q — are developmentally normal well into the first years of school and are not a sign of a problem on their own.',
            'Nor is a child who recognises letters but shows no interest in writing them. Fine motor control develops on its own timeline, and forcing pencil work early tends to build resistance rather than skill.',
          ],
        },
      ],
      howToHeading: 'Practising with Little Genius',
      howToSteps: [
        { title: 'Start with the phonics activity', text: 'Your child hears a sound and picks the letter — the core skill, practised directly.' },
        { title: 'Trace the same letters', text: 'Move to tracing straight after, so hearing, seeing and writing reinforce each other.' },
        { title: 'Move to word building', text: 'Once a handful of sounds are secure, simple words with picture hints turn sounds into reading.' },
        { title: 'Keep sessions short', text: 'Set a daily time limit so the app stops before your child’s attention does.' },
      ],
      faqs: [
        {
          question: 'What age should a child know the alphabet?',
          answer: 'Most children recognise many letters between 4 and 5 and know the full alphabet around 5 to 6. There is a wide normal range, and later recognition is not by itself a concern.',
        },
        {
          question: 'Should I teach uppercase or lowercase first?',
          answer: 'Uppercase is easier to distinguish and usually comes first, but introduce lowercase early — almost everything a child will read is lowercase.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'screen-time-rules-for-preschoolers',
      keyword: 'screen time rules for preschoolers',
      title: 'Screen Time for Preschoolers: Setting Rules That Hold',
      metaTitle: 'Screen Time Rules for Preschoolers That Actually Hold',
      metaDescription:
        'How much screen time is reasonable for a 3–5 year old, why the type of app matters more than the minutes, and how to end a session without a meltdown.',
      excerpt: 'Why what is on the screen matters more than the minutes — and how to end a session without a fight.',
      intro: [
        'Guidance from health bodies generally lands around an hour a day of high-quality content for children aged 2 to 5, ideally with an adult nearby. That number is a useful anchor, but on its own it says nothing about what those minutes contain.',
        'Twenty minutes of an autoplay video feed and twenty minutes of tracing letters are not the same twenty minutes.',
      ],
      sections: [
        {
          heading: 'What separates good screen time from the rest',
          bullets: [
            'It ends by itself: a defined activity with a finish, not an infinite feed.',
            'The child acts rather than watches — tracing, choosing, answering.',
            'It is repeatable without becoming compulsive: no streaks or loot loops aimed at children.',
            'An adult can join in and talk about it, which is what turns app time into learning.',
            'No ads, especially none that a preschooler cannot distinguish from the content.',
          ],
        },
        {
          heading: 'Ending a session without a fight',
          numbered: [
            'Warn before the end: "two more letters, then we stop" works better than a sudden finish.',
            'Use a timer the child can see or hear, so the limit comes from the rule rather than from you.',
            'End on a completed activity — stopping mid-task is what most tantrums are actually about.',
            'Have the next thing ready. The gap after the screen is where things fall apart.',
            'Keep it consistent. A limit that moves when they protest teaches protesting.',
          ],
        },
      ],
      howToHeading: 'How Little Genius fits into a screen-time plan',
      howToSteps: [
        { title: 'Set the daily time limit', text: 'Little Genius has a parent-controlled daily limit, so the app enforces the rule you set.' },
        { title: 'Choose the activity together', text: 'Deciding "tracing today" before you start turns open-ended play into a session with a shape.' },
        { title: 'Sit alongside where you can', text: 'Naming letters and sounds out loud with your child does more than the app can alone.' },
        { title: 'Finish on a badge', text: 'Ending on a completed activity and a reward makes the stopping point feel like an achievement.' },
      ],
      faqs: [
        {
          question: 'How much screen time is right for a 4-year-old?',
          answer: 'Common guidance is up to about an hour a day of high-quality content for ages 2 to 5, ideally shared with an adult. Content and how it ends matter as much as the total.',
        },
        {
          question: 'Does Little Genius have a time limit feature?',
          answer: 'Yes — parents can set a daily time limit so sessions end without a negotiation.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'kindergarten-readiness-checklist',
      keyword: 'kindergarten readiness checklist',
      title: 'Kindergarten Readiness: What Actually Matters Before School',
      metaTitle: 'Kindergarten Readiness Checklist: Skills That Actually Matter',
      metaDescription:
        'Not reading and counting to 100 — the skills that predict a good start at school are simpler than parents fear. Here is the honest checklist and how to practise it.',
      excerpt: 'The honest checklist: independence and language matter more than reading before school.',
      intro: [
        'Ask a reception or kindergarten teacher what they want children to arrive with and the answer is rarely academic. Reading and arithmetic are what school is for. What helps most is a child who can manage themselves for a few hours in a room full of other children.',
        'That said, some early literacy and number familiarity does make the first months easier. Here is the balance.',
      ],
      sections: [
        {
          heading: 'What teachers actually ask for',
          bullets: [
            'Can separate from a parent and settle within a few minutes.',
            'Can manage the toilet, coat, shoes and lunchbox mostly independently.',
            'Can follow a two-step instruction: "put your bag on the hook and sit on the carpet".',
            'Can sit with a task for five to ten minutes without wandering off.',
            'Can ask for help, take turns, and cope with not going first.',
          ],
        },
        {
          heading: 'The academic basics that help',
          numbered: [
            'Recognising their own name in writing — the single most used piece of text in the first term.',
            'Knowing many letter sounds, without needing the full alphabet.',
            'Counting objects to ten with one-to-one correspondence — pointing at each item as they count.',
            'Holding a pencil comfortably and drawing lines, circles and simple shapes.',
            'Enjoying being read to, and knowing that books go left to right, top to bottom.',
          ],
        },
        {
          heading: 'What not to push',
          paragraphs: [
            'Reading fluently, writing sentences and counting to 100 are not prerequisites, and pushing them at four often produces a child who dislikes the work before school has started.',
            'The strongest predictor of a good academic start is not early achievement but language: how much a child is spoken with, read to, and asked open questions. No app substitutes for that, though a good one can add to it.',
          ],
        },
      ],
      howToHeading: 'Practising readiness skills with Little Genius',
      howToSteps: [
        { title: 'Work on name and letters', text: 'Tracing and phonics activities cover the letters children meet first — starting with the ones in their own name.' },
        { title: 'Build number sense', text: 'Counting activities pair objects with numerals, which is the skill that matters more than reciting numbers.' },
        { title: 'Practise finishing a task', text: 'Short, complete activities train sitting with something until it is done.' },
        { title: 'Talk through it together', text: 'Say the sounds and numbers out loud with your child — the conversation is where most of the learning happens.' },
      ],
      faqs: [
        {
          question: 'Should my child be able to read before starting school?',
          answer: 'No. Recognising their name and knowing some letter sounds is plenty; teaching reading is the school’s job.',
        },
        {
          question: 'My child is not interested in writing. Is that a problem?',
          answer: 'Usually not at 3 or 4. Fine motor skills develop unevenly, and tracing games often build the interest that a pencil and worksheet do not.',
        },
      ],
      screenshotIndex: 1,
    },
  ],
  faqs: [
    {
      question: 'What is Little Genius?',
      answer:
        'Little Genius is a preschool learning app for children aged 2 to 7. It combines letter and number tracing, phonics, word building, counting, memory games, quizzes and drawing in one playful world.',
      learnMoreSlug: 'teach-preschooler-letters-and-phonics',
    },
    {
      question: 'What age is Little Genius for?',
      answer:
        'Ages 2 to 7. Younger children start with tracing and phonics; older ones move on to word building, counting and quizzes.',
      learnMoreSlug: 'kindergarten-readiness-checklist',
    },
    {
      question: 'Can I limit how long my child uses it?',
      answer:
        'Yes — parents can set a daily time limit, and the progress view shows what has been practised.',
      learnMoreSlug: 'screen-time-rules-for-preschoolers',
    },
    {
      question: 'Does it teach letter sounds or letter names?',
      answer: 'Both, with the emphasis on sounds — the phonics activities pair a sound with the letter that makes it, which is what early reading depends on.',
    },
    {
      question: 'Does it work on iPad?',
      answer: 'Yes, Little Genius runs on both iPhone and iPad. The larger iPad screen suits tracing and drawing particularly well.',
    },
    {
      question: 'Is Little Genius free?',
      answer:
        'It is free to download with activities available from the start. A single premium unlock opens the full learning world.',
    },
  ],
  ctaHeading: 'Letters, Numbers and Confidence — In One Playful App',
  ctaText: 'Download Little Genius free and let your child start with tracing, phonics and counting today.',
  category: 'EducationalApplication',
  downloadNote: 'Free to download • In-app purchase available',
};
