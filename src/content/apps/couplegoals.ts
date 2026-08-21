import { HandHeart, MessageCircleHeart, Gamepad2, Calendar, Sparkles, Smartphone } from 'lucide-react';
import type { AppContent } from './types';

export const couplegoals: AppContent = {
  slug: 'couples-app-love-notes',
  appId: '6789631223',
  name: 'CoupleGoals',
  storeName: 'CoupleGoals: Games & Notes',
  subtitle: 'Love Notes, Games & Shared Calendar',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/couplegoals-games-notes/id6789631223',
  icon: '/apps/couplegoals/icon.webp',
  accent: '#ec4899',
  accentDark: '#9d174d',
  heroTitle: {
    pre: 'A Private Space for Two —',
    highlight: 'Notes, Games and Your Days Together',
    post: '',
  },
  heroDescription:
    'CoupleGoals is a shared app just for the two of you. Draw a love note that lands on your partner’s Home Screen, answer the same daily question and reveal your answers together, play couple games, and keep your dates, goals and anniversaries in one shared calendar.',
  heroBenefits: [
    'Draw love notes that appear on their Home Screen widget',
    'One daily question, answered separately, revealed together',
    'Would You Rather and relationship flash cards',
    'Date ideas by category — cosy, adventure, foodie, budget',
    'Shared goals, mood log and key-date countdowns',
  ],
  metaTitle: 'CoupleGoals – Love Notes, Games & Shared Calendar',
  metaDescription:
    'A private app for two: draw love notes to your partner\'s Home Screen widget, answer a daily question together, play games and share a calendar.',
  metaKeywords:
    'couples app, app for couples, love notes app, relationship app, long distance relationship app, daily question for couples, would you rather couples, shared calendar for couples, anniversary countdown app',
  screenshots: [
    { src: '/apps/couplegoals/screenshot-1.webp', alt: 'CoupleGoals couples app – shared home screen with days together' },
    { src: '/apps/couplegoals/screenshot-2.webp', alt: 'CoupleGoals – relationship flash cards for couples' },
    { src: '/apps/couplegoals/screenshot-3.webp', alt: 'CoupleGoals – shared calendar with anniversaries and date nights' },
    { src: '/apps/couplegoals/screenshot-4.webp', alt: 'CoupleGoals – Would You Rather game for couples' },
    { src: '/apps/couplegoals/screenshot-5.webp', alt: 'CoupleGoals – date ideas by category' },
    { src: '/apps/couplegoals/screenshot-6.webp', alt: 'CoupleGoals – couple games and daily question' },
  ],
  audience: [
    {
      badge: 'Long Distance',
      title: 'Couples Living Apart',
      description: 'Time zones make live conversation hard. A note waiting on their Home Screen and a question you both answer works across any gap.',
      color: '#9d174d',
    },
    {
      badge: 'Busy Life',
      title: 'Couples With No Free Evenings',
      description: 'Work, kids, shifts. Small daily contact keeps a relationship warm when a proper date night is three weeks away.',
      color: '#7c3aed',
    },
    {
      badge: 'Long Term',
      title: 'Couples Who Know Each Other Well',
      description: 'After years together, conversation can go on autopilot. A daily question you both answer blind still surprises people.',
      color: '#0284c7',
    },
  ],
  features: [
    {
      icon: HandHeart,
      title: 'Love Notes on the Home Screen',
      description:
        'Draw a quick note and send it straight to your partner’s Home Screen widget. They see it without opening anything. Free covers one a day; Premium makes it unlimited.',
      color: '#9d174d',
    },
    {
      icon: MessageCircleHeart,
      title: 'One Daily Question',
      description:
        'The same question for both of you, every day. Answer separately, reveal together, and find out how well you actually know each other.',
      color: '#7c3aed',
    },
    {
      icon: Gamepad2,
      title: 'Couple Games',
      description:
        'Would You Rather shows how in sync you are, and flash cards built around your relationship turn into the kind of conversation that does not start on its own.',
      color: '#0284c7',
    },
    {
      icon: Sparkles,
      title: 'Date Ideas',
      description:
        'Browse ideas by category — cosy, adventure, foodie, budget — and add the ones you like straight to your shared goals instead of forgetting them.',
      color: '#d97706',
    },
    {
      icon: Calendar,
      title: 'Goals, Mood & Key Dates',
      description:
        'Set goals together, log how you are feeling, and keep anniversaries, birthdays and date nights on a shared calendar with countdowns.',
      color: '#059669',
    },
    {
      icon: Smartphone,
      title: 'Home Screen Widget',
      description:
        'Your latest note and your days-together counter sit on the Home Screen, which is the difference between an app you open and one you actually see.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Connect With Your Partner', description: 'Link your two phones into one shared private space.' },
    { title: 'Send Your First Note', description: 'Draw something and watch it appear on their Home Screen widget.' },
    { title: 'Answer Today’s Question', description: 'Both answer separately, then reveal together.' },
    { title: 'Plan What Is Next', description: 'Add date ideas, goals and key dates to your shared calendar.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'CoupleGoals is free to use together, including one love note a day, the daily question, games and your shared calendar.',
  pricingPro: {
    name: 'CoupleGoals Premium',
    bullets: [
      'Unlimited love notes',
      'Full access for both partners',
      'One subscription unlocks both phones',
      'Monthly or yearly',
    ],
    note: 'When either partner subscribes, Premium unlocks on both phones',
  },
  guides: [
    {
      slug: 'long-distance-relationship-apps',
      keyword: 'long distance relationship app ideas',
      title: 'Making a Long-Distance Relationship Work (Without Living on Video Calls)',
      metaTitle: 'Long-Distance Relationship Apps & Habits That Actually Help',
      metaDescription:
        'Long-distance couples burn out on scheduled video calls. What actually sustains the connection — asynchronous contact and small daily signals.',
      excerpt: 'Why scheduled video calls burn out, and the asynchronous habits that hold a relationship together instead.',
      intro: [
        'Long-distance couples usually start with a rule: we will video call every evening. It works for a few weeks, then a call gets missed, then the calls become an obligation, and eventually both people are sitting in silence watching each other scroll.',
        'The couples who make distance work tend to rely less on scheduled synchronous time and more on small, frequent, asynchronous contact that survives a bad week and an eight-hour time difference.',
      ],
      sections: [
        {
          heading: 'Why the daily video call fails',
          bullets: [
            'It demands both people be free, alert and interesting at the same moment — three conditions that rarely align.',
            'It turns connection into a performance rather than something ambient.',
            'A missed call becomes a small failure, and small failures accumulate into guilt.',
            'It compresses everything into one slot instead of spreading contact through the day.',
          ],
        },
        {
          heading: 'What works instead',
          numbered: [
            'Asynchronous notes: something small they find when they wake up beats a call neither of you had the energy for.',
            'A shared daily ritual that takes a minute — the same question, answered separately, revealed together.',
            'Visible countdowns to the next visit, which reframes the distance as finite.',
            'Parallel activity: playing the same game or watching the same thing separately, then talking about it.',
            'Keeping a shared record of plans, so the relationship has a future tense and not just a present one.',
          ],
        },
        {
          heading: 'The role of the Home Screen',
          paragraphs: [
            'There is a real difference between a message inside an app and something visible without opening anything. A widget on the Home Screen is seen dozens of times a day without any deliberate act of checking.',
            'For distance especially, that ambient presence does more than a longer conversation once a day, because it is what makes the other person feel nearby rather than scheduled.',
          ],
        },
      ],
      howToHeading: 'Setting up your shared space in CoupleGoals',
      howToSteps: [
        { title: 'Link both phones', text: 'One shared space, visible to the two of you and nobody else.' },
        { title: 'Add the widget', text: 'Put the CoupleGoals widget on both Home Screens so notes arrive where they will be seen.' },
        { title: 'Make the daily question your ritual', text: 'A minute each, at whatever hour suits your time zones — no scheduling required.' },
        { title: 'Count down to the next visit', text: 'Add the date as a key date so the countdown sits on both screens.' },
      ],
      faqs: [
        {
          question: 'Does CoupleGoals work across time zones?',
          answer: 'Yes — notes and daily questions are asynchronous, so neither of you has to be awake at the same time.',
        },
        {
          question: 'Do both partners need Premium?',
          answer: 'No. When either partner subscribes, Premium unlocks on both phones.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'questions-to-ask-your-partner-daily',
      keyword: 'daily questions to ask your partner',
      title: 'Daily Questions to Ask Your Partner (That Are Not Small Talk)',
      metaTitle: 'Daily Questions for Couples: 30 That Are Not Small Talk',
      metaDescription:
        '"How was your day?" gets the same answer every time. Better daily questions for couples, why answering separately matters, and building the habit.',
      excerpt: 'Better than "how was your day" — questions that produce real answers, and why you should answer them blind.',
      intro: [
        '"How was your day?" is not a question, it is a greeting. Everyone knows the expected answer is "fine, busy", and both people move on. Over years, that exchange can be the majority of a couple’s conversation.',
        'Better questions are specific, slightly unexpected, and answerable in a sentence. The best ones you answer before hearing the other person’s answer.',
      ],
      sections: [
        {
          heading: 'Questions that produce real answers',
          bullets: [
            'What was the best five minutes of your day?',
            'What is something you are quietly worried about this week?',
            'What did I do recently that you appreciated but did not mention?',
            'If we had a free Saturday with no money, what would you want to do?',
            'What is something you have changed your mind about lately?',
            'What do you think I would say is your best quality?',
            'What is one thing you want more of in the next month?',
          ],
        },
        {
          heading: 'Why answering separately matters',
          paragraphs: [
            'When one person answers first, the second answer is shaped by the first — that is simple anchoring, and it removes most of what makes the exercise interesting.',
            'Answering blind and revealing together preserves the difference between your two answers, and the difference is the conversation. It is also the mechanism behind why couples who have been together fifteen years still get surprised.',
          ],
        },
        {
          heading: 'Making it a habit',
          numbered: [
            'One question a day, not five — this is a habit, not an exercise.',
            'Answer whenever suits you rather than at a fixed time you will both eventually miss.',
            'Keep answers short. A sentence invites a follow-up; a paragraph ends the exchange.',
            'Never use it as a way to deliver a complaint. That kills the ritual within a week.',
            'Let the reveal lead into a real conversation when it wants to, and let it be a nice moment when it does not.',
          ],
        },
      ],
      howToHeading: 'The daily question in CoupleGoals',
      howToSteps: [
        { title: 'Get the same question', text: 'Both of you see the same question each day, synced across both phones.' },
        { title: 'Answer separately', text: 'Neither answer is visible until you have both responded.' },
        { title: 'Reveal together', text: 'See both answers side by side — the gap between them is the interesting part.' },
        { title: 'Keep going', text: 'A minute a day, repeated, does more than an occasional long talk.' },
      ],
      faqs: [
        {
          question: 'What if we already know everything about each other?',
          answer: 'That is the usual assumption, and the daily reveal is where it quietly falls apart. Preferences and worries change; the questions surface the changes.',
        },
        {
          question: 'Can we see previous answers?',
          answer: 'Your shared space keeps the record, which becomes a surprisingly good diary of a year together.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'date-night-ideas-that-actually-happen',
      keyword: 'date night ideas that actually happen',
      title: 'Date Night Ideas That Actually Happen',
      metaTitle: 'Date Night Ideas That Actually Happen (Not Just Get Saved)',
      metaDescription:
        'Everyone saves date ideas and nobody does them. Why date nights collapse, how to plan ones that survive a busy week, and ideas by budget.',
      excerpt: 'Why saved date ideas never happen, and the planning rule that fixes it.',
      intro: [
        'Most couples do not have a shortage of date ideas. They have a folder of screenshots, a list in someone’s notes app, and three months since the last one.',
        'The gap is not inspiration, it is logistics: an idea only becomes a date when it has a day, a time, and no remaining decisions.',
      ],
      sections: [
        {
          heading: 'Why date nights collapse',
          bullets: [
            'The idea lives in one person’s head or phone, so it depends on that person remembering and organising it.',
            'No date is attached, and "sometime soon" is not a date.',
            'It is too ambitious for the energy you actually have on a Friday at 7pm.',
            'Both people are waiting for the other to suggest something, which reads as neither of you being bothered.',
            'Every open decision — where, when, who books — is another chance for it to not happen.',
          ],
        },
        {
          heading: 'Ideas by energy level',
          numbered: [
            'Low energy, low cost: cook one recipe neither of you has made, phones in another room.',
            'Low energy, out of the house: a walk somewhere you have never been, then coffee.',
            'Medium: a market, an exhibition, a swim, a proper breakfast on a weekday morning off.',
            'Higher effort: a day trip to a nearby town, booked at least a week ahead.',
            'Cosy: the same film you both like, actually watched, without a second screen.',
          ],
        },
        {
          heading: 'The rule that makes it stick',
          paragraphs: [
            'Put the date in a shared calendar the moment you agree on the idea, with the decisions already made. An unbooked intention is not a plan.',
            'It also helps to alternate who chooses. Rotating removes the invisible organising work that otherwise lands on one person and eventually turns into resentment.',
          ],
        },
      ],
      howToHeading: 'Planning dates in CoupleGoals',
      howToSteps: [
        { title: 'Browse by category', text: 'Cosy, adventure, foodie or budget — pick from ideas rather than starting at zero.' },
        { title: 'Save it to shared goals', text: 'The idea goes somewhere you can both see, not into one person’s screenshots.' },
        { title: 'Give it a date', text: 'Add it to the shared calendar with a countdown so it stops being hypothetical.' },
        { title: 'Alternate who picks', text: 'Take turns choosing so the planning is not always the same person’s job.' },
      ],
      faqs: [
        {
          question: 'Is CoupleGoals a dating app?',
          answer: 'No. It is a private space for two people who are already together — no strangers, no browsing, no ads.',
        },
        {
          question: 'Can we both add ideas and dates?',
          answer: 'Yes — goals, ideas and key dates are shared, so either of you can add and both of you see them.',
        },
      ],
      screenshotIndex: 4,
    },
  ],
  faqs: [
    {
      question: 'What is CoupleGoals?',
      answer:
        'CoupleGoals is a private app for two. You can draw love notes that appear on your partner’s Home Screen widget, answer a daily question and reveal your answers together, play couple games, browse date ideas, and share goals, moods and key dates.',
      learnMoreSlug: 'questions-to-ask-your-partner-daily',
    },
    {
      question: 'Is CoupleGoals good for long-distance relationships?',
      answer:
        'Yes — notes and daily questions are asynchronous, so they work across time zones without scheduling a call.',
      learnMoreSlug: 'long-distance-relationship-apps',
    },
    {
      question: 'Can we plan dates together in the app?',
      answer:
        'Yes. Browse date ideas by category, save the ones you like to your shared goals and put them in the shared calendar with a countdown.',
      learnMoreSlug: 'date-night-ideas-that-actually-happen',
    },
    {
      question: 'Do both of us need to pay for Premium?',
      answer: 'No — when either partner subscribes, Premium unlocks automatically on both phones.',
    },
    {
      question: 'Is it private?',
      answer: 'CoupleGoals is a space just for the two of you. It is not a dating app: there are no strangers and no ads.',
    },
    {
      question: 'Is CoupleGoals free?',
      answer:
        'Yes, it is free to use together, including one love note a day. Premium adds unlimited notes and full access, as a monthly or yearly subscription that covers both partners.',
    },
  ],
  ctaHeading: 'A Small Space That Is Just Yours',
  ctaText: 'Download CoupleGoals free, link your phones, and send the first note to their Home Screen today.',
  category: 'LifestyleApplication',
  downloadNote: 'Free to download • Subscription available',
};
