import { MapPin, Camera, Timer, Route, Star, History } from 'lucide-react';
import type { AppContent } from './types';

export const parkspot: AppContent = {
  slug: 'parkspot-find-my-car-app',
  appId: '6787163799',
  name: 'ParkSpot',
  storeName: 'ParkSpot: Find My Car',
  subtitle: 'Save Your Spot & Walk Back',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/parkspot-find-my-car/id6787163799',
  icon: '/apps/parkspot/icon.webp',
  accent: '#22c55e',
  accentDark: '#15803d',
  heroTitle: {
    pre: 'Save Your Parking Spot in One Tap and',
    highlight: 'Always Find Your Car',
    post: '',
  },
  heroDescription:
    'ParkSpot pins your car the moment you park, keeps a photo of the pillar or level, and runs a parking timer on your Lock Screen so the meter never wins. When you come back, follow the map straight to your car.',
  heroBenefits: [
    'One tap saves your exact spot with the address',
    'Photo of the level, pillar or garage entrance',
    'Parking timer on the Lock Screen and Dynamic Island',
    'Walk-back map with live distance to your car',
    'Favourite spots, notes, cost tracking and history',
  ],
  metaTitle: 'ParkSpot – Find My Car App with Parking Timer for iPhone',
  metaDescription:
    'Never lose your car in a parking garage again. ParkSpot saves the spot with a photo, runs a meter timer on your Lock Screen, and guides you back.',
  metaKeywords:
    'find my car app, parking spot app, where did I park, parking timer app, parking meter reminder, car finder app, parking garage app, save parking location, parking history',
  screenshots: [
    { src: '/apps/parkspot/screenshot-1.webp', alt: 'ParkSpot find my car app – parking history with locations and cost' },
    { src: '/apps/parkspot/screenshot-2.webp', alt: 'ParkSpot – favourite parking spots saved for one-tap start' },
    { src: '/apps/parkspot/screenshot-3.webp', alt: 'ParkSpot – map guiding you back to your parked car' },
    { src: '/apps/parkspot/screenshot-4.webp', alt: 'ParkSpot – walking route home to the saved parking spot' },
    { src: '/apps/parkspot/screenshot-5.webp', alt: 'ParkSpot – parking session details with floor, notes and cost' },
  ],
  audience: [
    {
      badge: 'City Drivers',
      title: 'Anyone Who Parks in Cities',
      description: 'Multi-storey garages, unfamiliar streets, late-night parking — ParkSpot remembers the spot so you do not have to.',
      color: '#15803d',
    },
    {
      badge: 'Commuters',
      title: 'Daily Commuters',
      description: 'Save your office garage and your usual street as favourites, then start a parking session in a single tap every morning.',
      color: '#0284c7',
    },
    {
      badge: 'Travellers',
      title: 'Airport & Event Parking',
      description: 'Park for a week at the airport or in a festival field, snap a photo of the row marker, and find the car again without the panic lap.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: MapPin,
      title: 'One-Tap Spot Saving',
      description:
        'Park, tap, done. ParkSpot pins the exact GPS location together with the street address, so level numbers and row letters stop being something you have to memorise.',
      color: '#15803d',
    },
    {
      icon: Camera,
      title: 'Photo of Your Spot',
      description:
        'Snap the pillar number, the garage entrance or the street sign. Photos are stored on your device only — nothing is uploaded anywhere.',
      color: '#0284c7',
    },
    {
      icon: Timer,
      title: 'Parking Timer with Live Activities',
      description:
        'Set the time your meter or free zone expires and watch the countdown on your Lock Screen and Dynamic Island. ParkSpot warns you before the ticket, not after it.',
      color: '#d97706',
    },
    {
      icon: Route,
      title: 'Walk Back to Your Car',
      description:
        'Open the map and follow the pin back, with the remaining distance and the address in view the whole way.',
      color: '#7c3aed',
    },
    {
      icon: Star,
      title: 'Favourite Spots',
      description:
        'The office garage, the gym, your street — save the places you park all the time and start a new session there in seconds.',
      color: '#be185d',
    },
    {
      icon: History,
      title: 'History & Costs',
      description:
        'Every session is logged: where you parked, how long you stayed and what it cost. Handy for expenses, and for spotting which garage is quietly draining your wallet.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Tap Save When You Park', description: 'ParkSpot pins the exact location and address of your car.' },
    { title: 'Add a Photo & Details', description: 'Snap the pillar or level, add the floor, zone or a short note.' },
    { title: 'Start the Timer', description: 'Enter how long you are allowed to stay and get a warning before it expires.' },
    { title: 'Follow the Map Back', description: 'When you return, open ParkSpot and walk straight to your car.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'ParkSpot is free to download and free for everyday parking — saving spots, photos, notes, the timer and the walk-back map are all included.',
  pricingPro: {
    name: 'ParkSpot Pro',
    bullets: [
      'Unlimited favourite parking spots',
      'Supports ongoing development',
      'Monthly or yearly with a free trial',
      'Lifetime one-time purchase available',
    ],
    note: 'Optional — the free version stays fully usable',
  },
  guides: [
    {
      slug: 'how-to-find-your-car-in-a-parking-garage',
      keyword: 'how to find your car in a parking garage',
      title: 'How to Find Your Car in a Parking Garage (Every Time)',
      metaTitle: 'How to Find Your Car in a Parking Garage: 6 Ways',
      metaDescription:
        'Lost your car in a multi-storey garage? Six reliable ways to find it again — from level markers and photos to GPS pins — and how to avoid it.',
      excerpt: 'Six reliable ways to find a car in a multi-storey garage — and the 5-second habit that prevents the search entirely.',
      intro: [
        'Parking garages are designed to be forgettable. Every level looks the same, the signage is inconsistent, and you are usually thinking about the appointment you are late for rather than the letter painted on the pillar next to you.',
        'The result is the parking lap: walking floor after floor pressing the key fob and listening for a beep. Here is how to shortcut that search, and how to make it unnecessary.',
      ],
      sections: [
        {
          heading: 'Six ways to find your car right now',
          numbered: [
            'Check your phone first: if you had navigation running, your maps app may still show the last stopped position.',
            'Work outwards from the entrance you used, not from where you are standing — most people park within one level of the entrance they drove in through.',
            'Use the key fob systematically: walk the centre aisle of one level pressing lock, then move up or down. Sound carries badly between concrete floors, so cover each level separately.',
            'Look for the payment machine you walked to. People almost always park near the lift or stairwell they used.',
            'Check the ticket: many garages print the level or zone on the parking ticket itself.',
            'Ask at the office — most large garages have cameras and staff who deal with this several times a day.',
          ],
        },
        {
          heading: 'The 5-second habit that prevents it',
          paragraphs: [
            'Every method above is recovery. Prevention takes five seconds: the moment you switch the engine off, save the spot and take one photo of the nearest pillar marker or level sign.',
            'A GPS pin alone is not always enough in a garage — signal is poor under concrete and a pin cannot tell you which of five identical floors you are on. A pin plus a photo of "Level 3, Row F" solves both halves of the problem.',
          ],
        },
      ],
      howToHeading: 'How to never lose your car with ParkSpot',
      howToSteps: [
        { title: 'Tap save as you switch off', text: 'ParkSpot records the GPS position and the street address of the garage before you even open the door.' },
        { title: 'Photograph the level marker', text: 'One photo of the pillar number or row letter answers the question GPS cannot: which floor.' },
        { title: 'Add the floor as a note', text: 'Type "P3, row F" into the note field — it appears next to the spot when you come back.' },
        { title: 'Follow the map out', text: 'On your way back, ParkSpot shows the pin and your live distance to the car.' },
      ],
      faqs: [
        {
          question: 'Does GPS work inside a parking garage?',
          answer: 'Often only partially — thick concrete blocks satellite signal. That is why the saved address, your photo and a floor note matter as much as the pin itself.',
        },
        {
          question: 'Can I find my car if my phone was offline?',
          answer: 'Yes. ParkSpot saves the position on your device, so the spot, photo and notes are there without a connection.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'parking-timer-avoid-parking-tickets',
      keyword: 'parking timer app to avoid tickets',
      title: 'How to Stop Getting Parking Tickets (Use a Timer, Not Your Memory)',
      metaTitle: 'Parking Timer App: How to Never Get a Parking Ticket Again',
      metaDescription:
        'Most parking fines are for overstaying by a few minutes. How to use a parking timer with Lock Screen alerts so you get back before it runs out.',
      excerpt: 'Most fines are for overstaying by minutes. A timer with a warning buffer fixes that for good.',
      intro: [
        'The typical parking fine is not for parking illegally. It is for parking legally and then staying eleven minutes too long, because a two-hour limit that started at 14:07 is not something the human brain tracks in the background.',
        'A parking timer solves this — but only if it warns you early enough to actually walk back.',
      ],
      sections: [
        {
          heading: 'Why mental timers fail',
          bullets: [
            'You rarely park at a round number. "Two hours from 14:07" needs arithmetic you will not repeat later.',
            'The activity you parked for — a meeting, a meal, a queue — absorbs your attention completely.',
            'Free-parking discs and paid meters have different rules in the same street, so the deadline changes by ten metres.',
            'A phone alarm at the exact expiry time is already too late: you still have to walk back.',
          ],
        },
        {
          heading: 'Set the timer properly',
          numbered: [
            'Start the timer as you leave the car, not when you remember later — the clock starts at the meter, not at your memory.',
            'Enter the real expiry time from the ticket or sign, including any grace period the sign mentions.',
            'Build in a walk-back buffer: if you are ten minutes from the car, you want the warning at least fifteen minutes out.',
            'Keep the countdown visible — on the Lock Screen you see it every time you check the time, without opening anything.',
            'Log what the session cost so you can compare garages later.',
          ],
        },
      ],
      howToHeading: 'Using the ParkSpot parking timer',
      howToSteps: [
        { title: 'Start a session when you park', text: 'Save the spot and set how long you are allowed to stay — paid meter or free-parking zone.' },
        { title: 'Watch it on the Lock Screen', text: 'The Live Activity shows the remaining time on your Lock Screen and Dynamic Island, no app needed.' },
        { title: 'Get warned in time', text: 'ParkSpot reminds you before the time runs out, so the walk back fits inside the buffer.' },
        { title: 'Track the cost', text: 'Add what the session cost and it lands in your parking history for expenses.' },
      ],
      faqs: [
        {
          question: 'Does the timer work if the app is closed?',
          answer: 'Yes — the countdown runs as an iPhone Live Activity on your Lock Screen and Dynamic Island, and the reminder fires as a notification.',
        },
        {
          question: 'Can I use it for free-parking discs?',
          answer: 'Yes. Set the timer to the maximum stay allowed by the sign — the app does not care whether you paid or set a disc.',
        },
      ],
      screenshotIndex: 4,
    },
    {
      slug: 'best-way-to-remember-where-you-parked',
      keyword: 'best way to remember where you parked',
      title: 'Photos, Notes or an App: The Best Way to Remember Where You Parked',
      metaTitle: 'Best Way to Remember Where You Parked (Photo vs Note vs App)',
      metaDescription:
        'Dropping a pin, taking a photo or typing a note — each has a failure mode. Here is what actually works for garages, airports and unfamiliar streets.',
      excerpt: 'Pin, photo or note — each fails differently. Here is the combination that holds up in a garage.',
      intro: [
        'Everyone has a system for remembering where they parked. Most of them work fine until the one time they do not: the airport after a ten-day trip, the multi-storey garage at a shopping centre, the residential street in a city you visited once.',
        'Comparing the common approaches shows why the reliable answer is not one method but a small combination.',
      ],
      sections: [
        {
          heading: 'What each method gets right and wrong',
          bullets: [
            'Dropping a map pin: precise outdoors, unreliable under concrete, and it tells you nothing about the level.',
            'Taking a photo: perfect for level and row markers, useless for navigating back from three streets away.',
            'Typing a note: great detail, but it lives in a notes app you will not think to open.',
            'Remembering a landmark: works until every level of the garage has the same red pillar.',
            'Key-fob hunting: the fallback everyone ends up using, and the slowest one.',
          ],
        },
        {
          heading: 'The combination that actually holds up',
          paragraphs: [
            'The reliable setup is a GPS pin for the walk back, a photo for the level and row, and a one-line note for anything the photo does not show — all captured in the same five seconds, in one place, so there is nothing to reconstruct later.',
            'The other half is retrieval. A method only works if, standing in an unfamiliar lobby, you know exactly which app holds the answer. One app that always has it beats three that sometimes do.',
          ],
        },
      ],
      howToHeading: 'Setting it up once in ParkSpot',
      howToSteps: [
        { title: 'Make saving a reflex', text: 'Tap save every time you park, even on streets you know — the habit is what makes it reliable.' },
        { title: 'Capture pin, photo and note together', text: 'ParkSpot stores all three in a single parking session instead of three separate apps.' },
        { title: 'Save regular spots as favourites', text: 'Your office garage and usual street become one-tap sessions.' },
        { title: 'Review your history', text: 'Past sessions show where you parked, for how long and at what cost.' },
      ],
      faqs: [
        {
          question: 'Are my parking photos private?',
          answer: 'Yes — photos stay on your device and are not uploaded.',
        },
        {
          question: 'Can ParkSpot detect parking automatically?',
          answer: 'ParkSpot is built around a deliberate one-tap save, which is more reliable than automatic detection and does not need constant background location access.',
        },
      ],
      screenshotIndex: 1,
    },
  ],
  faqs: [
    {
      question: 'What is ParkSpot?',
      answer:
        'ParkSpot is a find-my-car app for iPhone. It saves your parking spot with the address and a photo, runs a parking timer on your Lock Screen, and guides you back to the car on a map.',
      learnMoreSlug: 'how-to-find-your-car-in-a-parking-garage',
    },
    {
      question: 'Does the parking timer show on the Lock Screen?',
      answer:
        'Yes. The countdown runs as a Live Activity on your Lock Screen and Dynamic Island, and ParkSpot reminds you before your time expires.',
      learnMoreSlug: 'parking-timer-avoid-parking-tickets',
    },
    {
      question: 'Does ParkSpot work in underground garages?',
      answer:
        'Yes — the spot, your photo and your notes are saved on the device, so they are available even where GPS and mobile signal are weak.',
      learnMoreSlug: 'best-way-to-remember-where-you-parked',
    },
    {
      question: 'Are my photos and locations uploaded anywhere?',
      answer: 'No. Photos and parking data stay on your iPhone.',
    },
    {
      question: 'Can I track what parking costs me?',
      answer: 'Yes — add the cost to each session and your parking history keeps a running record, which is useful for expenses.',
    },
    {
      question: 'Is ParkSpot free?',
      answer:
        'Yes, ParkSpot is free to download and use. ParkSpot Pro is an optional purchase that unlocks unlimited favourite spots, available as a subscription with a free trial or a one-time lifetime unlock.',
    },
  ],
  ctaHeading: 'Never Lose Your Car Again',
  ctaText: 'Download ParkSpot free, save your spot in one tap, and let the timer and the map handle the rest.',
  category: 'TravelApplication',
  downloadNote: 'Free to download • Optional in-app purchases',
};
