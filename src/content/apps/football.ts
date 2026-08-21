import { CalendarClock, Bell, LayoutGrid, NotebookPen, CalendarCheck, Brain } from 'lucide-react';
import type { AppContent } from './types';

export const football: AppContent = {
  slug: 'world-cup-2026-schedule-app',
  appId: '6778400403',
  name: 'Football Schedule Planner',
  storeName: 'Football Schedule Planner 2026',
  subtitle: 'Widgets, reminders, AI',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/football-schedule-planner-2026/id6778400403',
  icon: '/apps/football/icon.webp',
  accent: '#4ade80',
  accentDark: '#166534',
  heroTitle: {
    pre: 'Never Miss a',
    highlight: 'World Cup 2026',
    post: 'Kickoff',
  },
  heroDescription:
    'Football Schedule Planner 2026 is your personal match planner for the biggest tournament ever: 104 matches, 3 countries, 16 time zones\' worth of confusion — organized into your schedule with kickoff reminders, countdown widgets, calendar sync and AI predictions. A planner, not another noisy live-score feed.',
  heroBenefits: [
    'Full 2026 tournament schedule in your local time',
    'Kickoff reminders exactly when you want them',
    'Countdown widgets for Home Screen & Lock Screen',
    'Sync matches to your calendar in one tap',
    'Fact-based AI match predictions & personal notes',
  ],
  metaTitle: 'World Cup 2026 Schedule App – Fixtures, Reminders & Widgets',
  metaDescription:
    'Plan every World Cup 2026 match: full schedule in your time zone, kickoff reminders, countdown widgets and calendar sync. Free on iPhone.',
  metaKeywords:
    'world cup 2026 schedule app, world cup 2026 fixtures, football schedule app, match reminder app, world cup countdown widget, soccer schedule 2026, world cup calendar sync, football planner',
  screenshots: [
    { src: '/apps/football/screenshot-1.webp', alt: 'World Cup 2026 schedule app – full fixture list in your local time zone' },
    { src: '/apps/football/screenshot-2.webp', alt: 'Football Schedule Planner – kickoff countdown widgets on iPhone Home Screen' },
    { src: '/apps/football/screenshot-3.webp', alt: 'Football Schedule Planner 2026 – match reminders before kickoff' },
    { src: '/apps/football/screenshot-4.webp', alt: 'World Cup 2026 app – browse matches by group, team and stage' },
    { src: '/apps/football/screenshot-5.webp', alt: 'Football Schedule Planner – AI match predictions and notes' },
  ],
  audience: [
    {
      badge: 'Fans',
      title: 'Dedicated Fans',
      description: 'Follow your team through the group stage into the knockouts with reminders tuned to exactly the matches you care about.',
      color: '#166534',
    },
    {
      badge: 'Busy',
      title: 'Busy Schedules',
      description: 'Work, family, time zones — sync the matches that matter into your calendar and let widgets count down to kickoff.',
      color: '#0284c7',
    },
    {
      badge: 'Watch Party',
      title: 'Watch-Party Hosts',
      description: 'Plan viewing parties with match notes, kickoff times in your zone, and AI predictions to fuel the pre-match debate.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: CalendarClock,
      title: 'Your Schedule, Your Time Zone',
      description:
        'Every 2026 fixture displayed in your local time automatically — no more mental math between Mexico City, New York and Vancouver kickoffs.',
      color: '#166534',
    },
    {
      icon: Bell,
      title: 'Smart Kickoff Reminders',
      description:
        'Choose when you want the nudge — 15 minutes, an hour, or a day before kickoff — for every match you save.',
      color: '#dd0000',
    },
    {
      icon: LayoutGrid,
      title: 'Countdown Widgets',
      description:
        'Home Screen and Lock Screen widgets count down to your next saved match, so the next kickoff is always one glance away.',
      color: '#7c3aed',
    },
    {
      icon: CalendarCheck,
      title: 'Calendar Sync',
      description:
        'Push your saved matches into your iPhone calendar in one tap — watch parties, family plans and kickoffs finally share one schedule.',
      color: '#0284c7',
    },
    {
      icon: Brain,
      title: 'Fact-Based AI Predictions',
      description:
        'AI predictions grounded in team facts give you a smart take on every fixture — great for debates, brackets and watch-party banter.',
      color: '#d97706',
    },
    {
      icon: NotebookPen,
      title: 'Match Notes & Watchlist',
      description:
        'Save favorite teams and fixtures, organize by group, team or stage, and attach notes — where you\'re watching, who\'s coming, what\'s at stake.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Pick Your Teams', description: 'Save your favorite teams and the fixtures you care about — your schedule stays focused.' },
    { title: 'Set Reminders', description: 'Choose how early you want the kickoff nudge for each saved match.' },
    { title: 'Add Widgets', description: 'Put the countdown on your Home Screen and Lock Screen so the next match is always visible.' },
    { title: 'Enjoy Every Kickoff', description: 'Sync to your calendar, read the AI prediction, and be on the couch before the whistle.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'Football Schedule Planner 2026 is free to download on iPhone and iPad, with optional premium upgrades inside the app.',
  guides: [
    {
      slug: 'world-cup-2026-schedule-time-zone',
      keyword: 'world cup 2026 schedule in my time zone',
      title: 'World Cup 2026 Schedule in Your Time Zone: How to Never Miscalculate',
      metaTitle: 'World Cup 2026 Schedule in Your Time Zone (Auto-Converted)',
      metaDescription:
        'World Cup 2026 spans three countries and multiple time zones. How to see all 104 matches auto-converted to your local kickoff time.',
      excerpt: '104 matches across 3 host countries and multiple time zones — how to see every kickoff in your local time automatically.',
      intro: [
        'The 2026 World Cup is the biggest ever: 48 teams, 104 matches, 16 host cities spread across the USA, Canada and Mexico — and at least four different kickoff time zones on any given matchday. A 7 PM kickoff in Vancouver is 4 AM the next morning in Berlin and 10 PM in New York.',
        'Manually converting a hundred kickoffs is how you end up missing the one match you wanted most. The sane approach: view the schedule in software that converts every fixture to your local time automatically.',
      ],
      sections: [
        {
          heading: 'Why 2026\'s schedule is uniquely confusing',
          bullets: [
            'Host cities span from Pacific (Vancouver, Seattle, Los Angeles) to Eastern (New York/New Jersey, Miami, Toronto) plus Mexico\'s Central zone.',
            '104 matches — up from 64 — means group-stage days with four or more kickoffs across the continent.',
            'Late group-stage rounds have simultaneous kickoffs; knockouts stretch from June 28 to the July 19 final at MetLife Stadium.',
            'Daylight-saving quirks: broadcast listings in "ET" don\'t help if you\'re watching from Europe or Asia.',
          ],
        },
        {
          heading: 'The reliable setup',
          numbered: [
            'Use a schedule that displays kickoff times converted to your device\'s time zone — automatically, including any DST changes.',
            'Save the matches you actually plan to watch; a watchlist of 15 games is manageable, 104 is noise.',
            'Sync saved matches to your calendar so family plans and kickoffs can negotiate early.',
            'Add a countdown widget for your next match — the glanceable answer to "when do I need to be on the couch?"',
          ],
        },
      ],
      howToHeading: 'How to set it up in Football Schedule Planner 2026',
      howToSteps: [
        { title: 'Open the full schedule', text: 'All 104 fixtures are listed with kickoff times already converted to your local time zone.' },
        { title: 'Save your matches', text: 'Tap to save the games you care about — by team, group or stage — into your personal watchlist.' },
        { title: 'Sync to calendar', text: 'One tap pushes your saved matches into your iPhone calendar with the correct local times.' },
        { title: 'Add the widget', text: 'The countdown widget shows time-to-kickoff for your next saved match, right on your Home Screen.' },
      ],
      faqs: [
        {
          question: 'When is the World Cup 2026 final?',
          answer: 'Sunday, July 19, 2026 at MetLife Stadium in New Jersey. The app shows the kickoff in your exact local time.',
        },
        {
          question: 'Does the app handle daylight saving changes?',
          answer: 'Yes — times follow your device\'s time zone settings, so DST conversions are always correct automatically.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'world-cup-2026-countdown-widget',
      keyword: 'world cup 2026 countdown widget iphone',
      title: 'World Cup 2026 Countdown Widget for iPhone: Setup in 2 Minutes',
      metaTitle: 'World Cup 2026 Countdown Widget for iPhone',
      metaDescription:
        'Put a live countdown to the next World Cup 2026 kickoff on your iPhone Home Screen and Lock Screen. Two-minute setup guide with widget options and tips.',
      excerpt: 'A live kickoff countdown on your Home Screen and Lock Screen — the two-minute setup, step by step.',
      intro: [
        'The best World Cup upgrade for your iPhone costs nothing and takes two minutes: a countdown widget that always shows time remaining until your next saved match. No unlocking, no app-opening, no "wait, when is the game?" — the answer lives on your Home Screen.',
        'During the knockout rounds happening right now, when every match is win-or-go-home, a glanceable countdown is the difference between catching the pre-match buildup and arriving at halftime.',
      ],
      sections: [
        {
          heading: 'What the widget shows',
          bullets: [
            'Time to kickoff for your next saved match — days, hours, minutes, live.',
            'The fixture itself: teams, stage and your local kickoff time.',
            'Multiple sizes: compact Lock Screen widgets and richer Home Screen cards.',
          ],
        },
        {
          heading: 'Adding widgets on iPhone (the general steps)',
          numbered: [
            'Home Screen: long-press any empty area until apps jiggle, tap Edit/+, search for the app, choose a widget size and tap Add Widget.',
            'Lock Screen: long-press the Lock Screen, tap Customize → Lock Screen, select the widget area and add the countdown.',
            'Position it where your thumb rests — the point of a widget is zero-effort glancing.',
          ],
        },
        {
          heading: 'Widget strategy for the tournament',
          paragraphs: [
            'Save every match of your team plus the knockouts you plan to watch, and let the widget surface whichever comes next. During group stage you will glance at it daily; during knockout week it becomes the most-checked pixel on your phone.',
          ],
        },
      ],
      howToHeading: 'Setting up the countdown in Football Schedule Planner',
      howToSteps: [
        { title: 'Save at least one match', text: 'The widget counts down to your next saved fixture — pick your matches in the app first.' },
        { title: 'Add the Home Screen widget', text: 'Long-press your Home Screen, tap +, find Football Schedule Planner and add your preferred size.' },
        { title: 'Add the Lock Screen widget', text: 'Customize your Lock Screen and slot in the compact countdown for zero-unlock glancing.' },
        { title: 'Let it roll over', text: 'After each final whistle, the countdown automatically switches to your next saved kickoff.' },
      ],
      faqs: [
        {
          question: 'Do the widgets drain battery?',
          answer: 'No — iOS widgets update on an efficient schedule managed by the system, not by running the app continuously.',
        },
        {
          question: 'Can I count down to a specific match only?',
          answer: 'Save just that fixture and the widget dedicates itself to it — perfect for building anticipation for a final.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'football-match-reminders',
      keyword: 'football match reminder app',
      title: 'Match Reminders That Actually Work: Watch Football Without Living in Apps',
      metaTitle: 'Football Match Reminder App: Never Miss Kickoff Again',
      metaDescription:
        'Live-score apps bury you in notifications and calendars forget football exists. The reminder setup that gets you to the couch before kickoff.',
      excerpt: 'The reminder setup that beats both noisy live-score apps and silent calendars — tuned to the matches you chose.',
      intro: [
        'There are two failure modes for football fans: the live-score app that pings you forty times a day about leagues you don\'t follow, and the calendar that stays silent because you never entered the fixtures. Both end the same way — you look up from your day and the match you cared about is in the 60th minute.',
        'The fix is a planner mindset: pick your matches once, choose when you want to be nudged, and let the system handle the rest.',
      ],
      sections: [
        {
          heading: 'Designing reminders you won\'t ignore',
          bullets: [
            'One reminder per match beats five: alert fatigue is why you swipe away the important ones.',
            'Time it to your reality: 15 minutes works for home viewing; an hour if you\'re heading to a bar or a friend\'s place.',
            'Big matches deserve a day-before nudge too — for planning, not just watching.',
            'Reminders should name the fixture and local kickoff time in the notification itself, no unlock required.',
          ],
        },
        {
          heading: 'Why a planner beats a live-score app for this',
          paragraphs: [
            'Live-score apps optimize for engagement during matches — goals, cards, lineups, transfer gossip. Great when you\'re already watching; noise when you\'re living your life. A schedule planner inverts the model: silence by default, and exactly one timely nudge for exactly the matches you pre-selected. Your attention stays yours until kickoff.',
          ],
        },
      ],
      howToHeading: 'Setting up reminders in Football Schedule Planner',
      howToSteps: [
        { title: 'Build your watchlist', text: 'Save your teams and the individual fixtures you plan to watch — group games, knockouts, finals.' },
        { title: 'Choose your lead time', text: 'Set reminders 15 minutes, an hour or a day before kickoff — per match, matching your plans.' },
        { title: 'Add notes for plans', text: 'Attach a note to each match — where you\'re watching, who\'s hosting — and it travels with the reminder.' },
        { title: 'Stay silent otherwise', text: 'No goals-in-other-leagues spam: the app only speaks when a match you chose is coming up.' },
      ],
      faqs: [
        {
          question: 'Can I get reminders for every match of my team?',
          answer: 'Yes — save the team and every fixture, including future knockout slots as they are decided, feeds your reminders.',
        },
        {
          question: 'Does it work for matches at 4 AM local time?',
          answer: 'The reminder fires whenever you scheduled it — and for brutal time zones, the day-before nudge helps you decide between the alarm clock and the replay.',
        },
      ],
      screenshotIndex: 2,
    },
  ],
  faqs: [
    {
      question: 'What is Football Schedule Planner 2026?',
      answer:
        'A personal match planner for the 2026 tournament: the full fixture list in your local time, kickoff reminders, countdown widgets, calendar sync, match notes and fact-based AI predictions — without live-score noise.',
      learnMoreSlug: 'football-match-reminders',
    },
    {
      question: 'Are all World Cup 2026 fixtures included?',
      answer:
        'Yes — all 104 matches across the USA, Canada and Mexico, browsable by day, group, team and stage, with kickoff times converted to your time zone automatically.',
      learnMoreSlug: 'world-cup-2026-schedule-time-zone',
    },
    {
      question: 'How do the countdown widgets work?',
      answer:
        'Add the widget to your Home Screen or Lock Screen and it counts down live to your next saved match, rolling over automatically after each game.',
      learnMoreSlug: 'world-cup-2026-countdown-widget',
    },
    {
      question: 'Can I sync matches to my calendar?',
      answer:
        'Yes — one tap pushes your saved fixtures into your iPhone calendar with correct local times, so kickoffs and life plans share one schedule.',
    },
    {
      question: 'What are the AI predictions based on?',
      answer:
        'Fact-based team data — not hype. They\'re a smart starting point for brackets, debates and watch-party banter.',
    },
    {
      question: 'Is this a live-score app?',
      answer:
        'Deliberately not. It\'s a planner: it gets you to kickoff informed and on time, then lets the match itself take over.',
    },
  ],
  ctaHeading: 'The Knockouts Are On — Don\'t Miss a Whistle',
  ctaText: 'Download free, save your matches, and put the next kickoff on your Home Screen in the next five minutes.',
  category: 'SportsApplication',
  downloadNote: 'Free to download • In-app purchases available',
};
