import { MapPin, BellOff, Notebook, Layers, Clock, Smartphone } from 'lucide-react';
import type { AppContent } from './types';

export const hush: AppContent = {
  slug: 'hush-silent-mode-reminder-app',
  appId: '6787279321',
  name: 'Hush',
  storeName: 'Hush: Silent Mode Reminder',
  subtitle: 'Place-Based Mute Reminders',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/hush-silent-mode-reminder/id6787279321',
  icon: '/apps/hush/icon.webp',
  accent: '#8b5cf6',
  accentDark: '#5b21b6',
  heroTitle: {
    pre: 'Get Reminded to Silence Your Phone',
    highlight: 'Before It Rings',
    post: '',
  },
  heroDescription:
    'Hush is a silent mode reminder for the places where a ringing phone is a problem. Set up your quiet places once — the office, lecture halls, church, the library, the cinema — and Hush reminds you to mute when you arrive.',
  heroBenefits: [
    'Location-based reminders to switch your phone to silent',
    'Set up work, school, meetings and worship once',
    'A note per place, so you remember why it matters',
    'All your quiet places in one clean list',
    'No account, no clutter — it does one job',
  ],
  metaTitle: 'Hush – Silent Mode Reminder App for iPhone (Location Based)',
  metaDescription:
    'Stop your phone ringing in meetings, lectures or church. Hush sends a location-based reminder to switch to silent mode when you arrive at your quiet places. Free on iPhone.',
  metaKeywords:
    'silent mode reminder, mute phone reminder, location based reminder app, phone rang in meeting, silence phone at work, do not disturb reminder, quiet place reminder, library silent app',
  screenshots: [
    { src: '/apps/hush/screenshot-1.webp', alt: 'Hush silent mode reminder app – list of quiet places on iPhone' },
    { src: '/apps/hush/screenshot-2.webp', alt: 'Hush – adding a quiet place with a location-based mute reminder' },
    { src: '/apps/hush/screenshot-3.webp', alt: 'Hush – reminder to switch the phone to silent on arrival' },
    { src: '/apps/hush/screenshot-4.webp', alt: 'Hush – notes for each quiet place' },
    { src: '/apps/hush/screenshot-5.webp', alt: 'Hush – managing saved silent mode places' },
    { src: '/apps/hush/screenshot-6.webp', alt: 'Hush – simple settings for place-based silent reminders' },
  ],
  audience: [
    {
      badge: 'Work',
      title: 'Meeting-Heavy Jobs',
      description: 'If your calendar is wall-to-wall meetings, one forgotten ringtone is all it takes. Hush reminds you at the office door, not after the interruption.',
      color: '#5b21b6',
    },
    {
      badge: 'Study',
      title: 'Students & Researchers',
      description: 'Lecture halls, seminar rooms, libraries and study spaces — set them up once at the start of term and stop worrying about it.',
      color: '#0284c7',
    },
    {
      badge: 'Everyday',
      title: 'Worship, Cinema & Appointments',
      description: 'Church, the cinema, the doctor’s waiting room: places where a phone going off is genuinely awkward, and easy to forget about until it happens.',
      color: '#be185d',
    },
  ],
  features: [
    {
      icon: MapPin,
      title: 'Place-Based Reminders',
      description:
        'Add the places where your phone should be quiet. When you arrive, Hush reminds you to switch to silent — the reminder comes from where you are, not from a clock.',
      color: '#5b21b6',
    },
    {
      icon: BellOff,
      title: 'One Job, Done Well',
      description:
        'Hush is not a task manager or a focus suite. It exists to stop your phone ringing at the wrong moment, which keeps it fast to set up and impossible to misuse.',
      color: '#0284c7',
    },
    {
      icon: Notebook,
      title: 'Notes Per Place',
      description:
        'Add a short note to each quiet place — "silent + vibrate off", "lectures Mon/Wed", "back row, leave by 6" — so the reminder carries context, not just a nudge.',
      color: '#d97706',
    },
    {
      icon: Layers,
      title: 'All Places in One List',
      description:
        'Every quiet place lives in a single clean list you can edit in seconds. Add a new one when your timetable changes, remove one when it no longer applies.',
      color: '#059669',
    },
    {
      icon: Clock,
      title: 'For Focus Time Too',
      description:
        'The same reminders work for deep-work spots: the study room, your usual café table, the desk where you write. Arriving becomes the cue to cut interruptions.',
      color: '#be185d',
    },
    {
      icon: Smartphone,
      title: 'Simple and Private',
      description:
        'No account to create and no social layer. Your quiet places are yours, and setup takes under a minute per place.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Add a Quiet Place', description: 'Pick the office, lecture hall, church or library where your phone should be silent.' },
    { title: 'Add a Note', description: 'Write what you need to remember about that place — the reminder shows it back to you.' },
    { title: 'Get Reminded on Arrival', description: 'Hush nudges you to switch to silent when you get there.' },
    { title: 'Keep the List Tidy', description: 'Edit, add or remove quiet places whenever your routine changes.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Hush is free to download and free to use for your quiet places, reminders and notes.',
  pricingPro: {
    name: 'Hush Pro',
    bullets: [
      'Unlock the full set of quiet places',
      'Supports ongoing development',
      'Subscription or lifetime unlock',
      'Free features stay usable without buying',
    ],
    note: 'Optional in-app purchase',
  },
  guides: [
    {
      slug: 'how-to-remember-to-silence-your-phone',
      keyword: 'how to remember to silence your phone',
      title: 'How to Remember to Silence Your Phone (Without Missing Calls Later)',
      metaTitle: 'How to Remember to Silence Your Phone: Reminders That Work',
      metaDescription:
        'Forgetting to mute your phone is a memory problem, not a manners problem. Here is how location cues, Focus modes and place-based reminders fix it — and how to avoid staying silent all day.',
      excerpt: 'Why muting is a memory problem, and the location-cue setup that fixes it without leaving you silent all day.',
      intro: [
        'Nobody forgets to silence their phone because they do not care. They forget because muting is a small action attached to a change of place, and the brain is unreliable at exactly that: remembering to do something at a moment in the future when your attention is somewhere else.',
        'The two failure modes matter equally. Forgetting to mute is embarrassing. Forgetting to unmute means missing the call that mattered — which is why "just leave it on silent forever" is not the answer.',
      ],
      sections: [
        {
          heading: 'Why a mental note fails',
          bullets: [
            'The intention forms while you are walking, driving or talking — never at the moment the action is needed.',
            'The cue that should trigger it (arriving somewhere) is the same cue as fifty other arrivals in your week.',
            'Nothing goes wrong when you forget — until it does, publicly, once every few months.',
            'Time-based alarms do not match the problem: it is not 9:00 that needs your phone silent, it is being in the room.',
          ],
        },
        {
          heading: 'Cues that actually work',
          numbered: [
            'Tie muting to the place, not the clock — the reminder should fire when you arrive.',
            'Keep a short list of genuinely quiet places rather than muting everywhere; a reminder you ignore is worse than none.',
            'Pair the physical cue with the digital one: the silent switch on the side of the iPhone is faster than any menu.',
            'Decide your unmute trigger too — leaving the building, or the end of the event.',
            'Use Focus modes for scheduled, predictable blocks, and place-based reminders for everything that moves around your week.',
          ],
        },
        {
          heading: 'When to use a Focus mode instead',
          paragraphs: [
            'Focus modes are excellent for recurring, timetabled situations — the same meeting every Monday, sleep hours, a fixed shift. They are weaker for irregular arrivals: a client site you visit twice a month, a hospital appointment, a friend’s wedding.',
            'A place-based reminder covers those cases without you having to build a schedule for something that has no schedule.',
          ],
        },
      ],
      howToHeading: 'Setting it up with Hush',
      howToSteps: [
        { title: 'List your real quiet places', text: 'Start with the three or four where a ringing phone would actually cause a problem — not every location you visit.' },
        { title: 'Add each place once', text: 'Save it in Hush with a short note about what "quiet" means there — silent only, or vibrate off too.' },
        { title: 'Let arrival be the cue', text: 'Hush reminds you when you get there, at the moment the action is possible.' },
        { title: 'Review at the start of each term or quarter', text: 'Timetables change. Two minutes of tidying keeps the reminders meaningful.' },
      ],
      faqs: [
        {
          question: 'Does Hush switch my phone to silent automatically?',
          answer: 'Hush reminds you to switch to silent when you arrive at a quiet place — the mute itself stays your decision, which avoids muting you at the wrong moment.',
        },
        {
          question: 'Will this drain my battery?',
          answer: 'Place-based reminders on iPhone use the system’s energy-efficient location services rather than continuous GPS tracking.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'phone-rang-in-a-meeting',
      keyword: 'phone rang in a meeting what to do',
      title: 'Your Phone Rang in a Meeting: What to Do and How to Prevent It',
      metaTitle: 'Phone Rang in a Meeting? How to Recover and Prevent It',
      metaDescription:
        'A ringing phone in a meeting, lecture or interview happens to everyone. Here is the fastest way to recover gracefully — and the setup that stops it happening again.',
      excerpt: 'The graceful recovery, and the setup that means you never need it again.',
      intro: [
        'It always happens in the quietest second of the meeting. The recovery matters less than people think — what people remember is whether it kept happening.',
        'Here is the short version of handling it, and the longer version of making sure the next one never fires.',
      ],
      sections: [
        {
          heading: 'In the moment',
          numbered: [
            'Silence it immediately with the side button — do not dig for the app or answer to explain.',
            'Say nothing beyond a short "sorry" if the room has stopped; a long apology extends the interruption you are trying to end.',
            'Mute properly straight away, so the follow-up call does not ring thirty seconds later.',
            'If it was genuinely urgent — a school, a hospital — say so briefly and step out. That is a legitimate reason and people understand it.',
          ],
        },
        {
          heading: 'The situations worth protecting',
          bullets: [
            'Client meetings and interviews, where the phone ringing shapes the impression of you.',
            'Lectures, seminars and exams, where it disrupts a whole room.',
            'Worship, funerals and ceremonies, where the cost is social rather than professional.',
            'Cinemas, theatres and libraries, where the rule is explicit.',
            'Shared offices and hospital wards, where a repeat offender becomes known for it.',
          ],
        },
      ],
      howToHeading: 'Preventing the next one with Hush',
      howToSteps: [
        { title: 'Add the meeting rooms you use', text: 'Your own office, the client site, the lecture hall — each becomes a quiet place in Hush.' },
        { title: 'Get the nudge at the door', text: 'Hush reminds you as you arrive, which is the only moment muting is both possible and top of mind.' },
        { title: 'Note the specifics', text: '"Vibrate off too — the table amplifies it" is the kind of detail worth writing once.' },
        { title: 'Keep the list current', text: 'Add new sites as your work moves around; remove the ones you no longer visit.' },
      ],
      faqs: [
        {
          question: 'Should I just leave my phone on silent permanently?',
          answer: 'Many people try, and then miss calls that mattered. Muting where it matters and staying reachable elsewhere is usually the better trade.',
        },
        {
          question: 'Does Hush work for places I visit rarely?',
          answer: 'Yes — that is where it helps most. Rare visits are exactly the ones no habit or schedule covers.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'location-based-reminders-for-quiet-places',
      keyword: 'location based reminders',
      title: 'Location-Based Reminders: Why Place Beats Time',
      metaTitle: 'Location-Based Reminders vs Time Alarms: Which Works Better?',
      metaDescription:
        'Time-based alarms fire when you cannot act. Location-based reminders fire where the action is possible. Here is when to use each — and how to set up place reminders that you do not ignore.',
      excerpt: 'Time alarms fire when you cannot act. Place reminders fire where the action is possible.',
      intro: [
        'A reminder is only useful if it arrives at a moment when you can actually do the thing. That is the structural weakness of time-based alarms for anything tied to a place: 08:45 finds you in traffic, not at the desk where the task lives.',
        'Location-based reminders invert that. They wait until you are standing in the right place, which for a whole category of small actions is exactly right.',
      ],
      sections: [
        {
          heading: 'What place-based reminders are good at',
          bullets: [
            'Actions bound to a room or building: mute the phone, badge in, take the parking ticket with you.',
            'Irregular visits that no schedule can predict.',
            'Situations where the trigger is arriving rather than a specific hour.',
            'Anything you have already forgotten more than once — repeated forgetting is a sign the cue is wrong, not that you need more willpower.',
          ],
        },
        {
          heading: 'Where time-based still wins',
          bullets: [
            'Medication and anything with a strict schedule.',
            'Recurring meetings at a fixed hour.',
            'Deadlines, where the point is the date, not the place.',
          ],
        },
        {
          heading: 'Keeping reminders from becoming noise',
          paragraphs: [
            'The fastest way to ruin place-based reminders is to add too many. Ten quiet places you half-care about turn into ten notifications you swipe away without reading, and the one that mattered goes with them.',
            'Keep the list to the places where the consequence is real. Reminders you always act on stay reminders; the rest become wallpaper.',
          ],
        },
      ],
      howToHeading: 'Building your quiet-place list in Hush',
      howToSteps: [
        { title: 'Start with three places', text: 'Pick the three where a ringing phone would genuinely embarrass you or disturb others.' },
        { title: 'Save each with a note', text: 'The note is what makes the reminder specific rather than generic.' },
        { title: 'Use it for a fortnight', text: 'Two weeks is enough to see which reminders you act on and which you ignore.' },
        { title: 'Prune, then add', text: 'Delete the ones you ignore before adding new ones — a short list stays a useful one.' },
      ],
      faqs: [
        {
          question: 'How many quiet places should I set up?',
          answer: 'Start small — three or four you will always act on. A short, meaningful list beats a long list you learn to swipe away.',
        },
        {
          question: 'Is Hush a to-do app?',
          answer: 'No. It deliberately does one thing: reminding you to mute your phone at the places where that matters.',
        },
      ],
      screenshotIndex: 1,
    },
  ],
  faqs: [
    {
      question: 'What is Hush?',
      answer:
        'Hush is a silent mode reminder for iPhone. You save the places where your phone should be quiet — work, school, meetings, worship, libraries, cinemas — and Hush reminds you to switch to silent when you arrive.',
      learnMoreSlug: 'how-to-remember-to-silence-your-phone',
    },
    {
      question: 'Does Hush mute my phone automatically?',
      answer:
        'Hush sends you the reminder; switching to silent stays your call. That avoids the app muting you at a moment you did not intend.',
      learnMoreSlug: 'phone-rang-in-a-meeting',
    },
    {
      question: 'How is this different from a Focus mode?',
      answer:
        'Focus modes are ideal for scheduled, recurring blocks. Hush covers the irregular arrivals a schedule cannot predict — a client site, an appointment, a one-off ceremony.',
      learnMoreSlug: 'location-based-reminders-for-quiet-places',
    },
    {
      question: 'Can I add notes to a place?',
      answer: 'Yes — each quiet place can carry a short note, so the reminder tells you what "quiet" means there.',
    },
    {
      question: 'Do I need an account?',
      answer: 'No. Hush works without any account or sign-up.',
    },
    {
      question: 'Is Hush free?',
      answer:
        'Yes, Hush is free to download and use. An optional Pro purchase unlocks the full set of quiet places and supports development; the free features stay available without buying.',
    },
  ],
  ctaHeading: 'Never Let Your Phone Ring at the Wrong Moment',
  ctaText: 'Download Hush free, add your quiet places in a minute, and let arrival be the reminder.',
  category: 'UtilitiesApplication',
  downloadNote: 'Free to download • Optional in-app purchases',
};
