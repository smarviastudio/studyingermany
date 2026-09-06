import { Ruler, Move3d, Compass, ScanLine, FileDown, Lock } from 'lucide-react';
import type { AppContent } from './types';

export const mitta: AppContent = {
  slug: 'measuring-tape-spirit-level-app',
  appId: '6799262573',
  name: 'Mitta',
  storeName: 'Målebånd, Vaterpas, Måling',
  subtitle: 'Tape measure, level and ruler in one',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/no/app/m%C3%A5leb%C3%A5nd-vaterpas-m%C3%A5ling/id6799262573',
  icon: '/apps/mitta/icon.webp',
  accent: '#f59e0b',
  accentDark: '#b45309',
  heroTitle: {
    pre: 'Tape measure, spirit level, protractor and ruler —',
    highlight: 'and you pay only once',
    post: '',
  },
  heroDescription:
    'Measure length, several segments in a row, and area with the camera. Enter a wall height and get the room volume, or produce a floor plan with the dimensions on every wall. No subscription, no account, and nothing leaves your phone.',
  heroBenefits: [
    'AR tape measure for length, multi-segment runs and area',
    'Room volume from wall height, and a floor plan with dimensions',
    'Room scan with walls, doors and windows on LiDAR devices',
    'Spirit level, protractor, inclinometer and a card-calibrated screen ruler',
    'Projects, PDF and CSV export, floor plan shared as an image',
    'One purchase — no subscription, no account, no data leaving the phone',
  ],
  metaTitle: 'Measuring Tape & Spirit Level App – Measure Rooms With the Camera',
  metaDescription:
    'Turn your iPhone into a tape measure, spirit level, protractor and ruler. Measure length and area with the camera, get room volume and a floor plan, export to PDF or CSV.',
  metaKeywords:
    'measuring tape app, spirit level app, ar measure app, room measurement app, floor plan app iphone, protractor app, screen ruler, lidar room scan, measure area iphone',
  screenshots: [
    { src: '/apps/mitta/screenshot-1.webp', alt: 'Mitta – AR tape measure measuring a wall with the camera' },
    { src: '/apps/mitta/screenshot-2.webp', alt: 'Mitta – spirit level and protractor tools' },
    { src: '/apps/mitta/screenshot-3.webp', alt: 'Mitta – floor plan with dimensions on every wall' },
  ],
  audience: [
    {
      badge: 'Moving',
      title: 'People measuring a new flat',
      description:
        'Viewings are short and a tape measure is rarely to hand. A floor plan with dimensions on every wall answers the sofa question before you sign anything.',
      color: '#b45309',
    },
    {
      badge: 'DIY',
      title: 'Home projects',
      description:
        'Shelves, frames, flooring and paint all start with a measurement. Level, protractor and tape measure in one app cover most of a weekend job.',
      color: '#0369a1',
    },
    {
      badge: 'Quotes',
      title: 'Anyone getting work quoted',
      description:
        'Floor area, wall area and room volume are the numbers tradespeople ask for. Export them as a PDF instead of reading them out over the phone.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: Ruler,
      title: 'Measure With the Camera',
      description:
        'Length, several segments in a row, and area. Enter the wall height and you get the room volume — the figure needed for heating, paint and moving quotes.',
      color: '#b45309',
    },
    {
      icon: ScanLine,
      title: 'Floor Plan and Room Scan',
      description:
        'A floor plan with the dimensions written on every wall. On devices with LiDAR, a full room scan picks up walls, doors and windows.',
      color: '#0369a1',
    },
    {
      icon: Move3d,
      title: 'Spirit Level',
      description:
        'For surfaces and edges — the shelf, the picture frame, the washing machine that has been rocking for a year.',
      color: '#7c3aed',
    },
    {
      icon: Compass,
      title: 'Protractor and Ruler',
      description:
        'An angle and inclination meter, plus a screen ruler calibrated against a payment card, so short measurements do not need any setup at all.',
      color: '#059669',
    },
    {
      icon: FileDown,
      title: 'Projects and Export',
      description:
        'Collect measurements into named projects, export as PDF or CSV, and share the floor plan as an image.',
      color: '#0f766e',
    },
    {
      icon: Lock,
      title: 'Pay Once',
      description:
        'No subscription and no account. No data leaves your phone — which for photographs of the inside of your home is worth more than it sounds.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Point and measure', description: 'Length, multi-segment runs or area — the app shows how reliable the current measurement is.' },
    { title: 'Add the wall height', description: 'Enter it once and the room volume follows from the floor area.' },
    { title: 'Build the floor plan', description: 'Each wall is labelled with its dimension; on LiDAR devices a full scan picks up doors and windows.' },
    { title: 'Export it', description: 'PDF or CSV for the file, or the floor plan as an image to send on.' },
  ],
  platforms: ['iPhone'],
  pricingFree: 'Free to download, with the core measuring tools available to try.',
  pricingPro: {
    name: 'Mitta Pro',
    bullets: [
      'Unlimited measurements and projects',
      'Floor plan and room volume',
      'PDF and CSV export',
      'No subscription and no account',
    ],
    note: 'One-time purchase',
  },
  guides: [
    {
      slug: 'measure-a-room-with-your-phone',
      keyword: 'measure a room with your phone',
      title: 'Measuring a Room With Your Phone: How Accurate Is It Really?',
      metaTitle: 'Measure a Room With Your Phone – Accuracy and Technique',
      metaDescription:
        'What AR measurement can and cannot do, why LiDAR changes the answer, and the technique that gets you within a percent or two.',
      excerpt: 'What phone measurement is good enough for — and when to reach for a real tape.',
      intro: [
        'Phone measurement has moved from a party trick to a genuinely useful tool, but the accuracy question deserves a straight answer rather than marketing. It depends on the hardware, the light, the distance and the surface — and it is never as exact as a tape held taut.',
        'Knowing the error margin is what makes the tool usable, because it tells you which jobs it is fine for and which it is not.',
      ],
      sections: [
        {
          heading: 'What to expect',
          bullets: [
            'Without a LiDAR scanner, expect roughly 1–5% deviation depending on conditions.',
            'With LiDAR, accuracy improves noticeably, particularly on larger distances and flat surfaces.',
            'Poor light, reflective or transparent surfaces and long distances all make it worse.',
            'Standing too far from the surface degrades the reading — the app will tell you when you are.',
          ],
        },
        {
          heading: 'Jobs where this is enough',
          bullets: [
            'Will the sofa fit through the door and along that wall?',
            'Roughly how much paint or flooring does this room need?',
            'What is the room volume, for a heating or moving quote?',
            'Recording a flat during a viewing, when there is no time for a tape measure.',
            'A sketch floor plan to send to someone who was not there.',
          ],
        },
        {
          heading: 'Jobs where it is not',
          paragraphs: [
            'Anything cut to fit — worktops, shelves cut to a millimetre, joinery, tiling that must meet a line. For those, measure with a tape and measure twice; a two percent error over three metres is six centimetres, which is the difference between a fitted shelf and a gap.',
            'The sensible workflow is to use the phone for the survey and the tape for the cut.',
          ],
        },
        {
          heading: 'Technique that improves the reading',
          numbered: [
            'Move the phone slowly across the surface first so the app can map the plane before you start.',
            'Stand at a sensible distance — close enough for detail, far enough to see the whole run.',
            'Get more light on the surface; measurement in dim rooms is where most of the error comes from.',
            'Measure long walls in segments rather than one long span.',
            'Take the same measurement twice and compare — a large gap between the two means conditions are poor.',
          ],
        },
      ],
      howToHeading: 'Measuring a room in Mitta',
      howToSteps: [
        { title: 'Measure the walls', text: 'Segment by segment around the room; the app keeps them as one run.' },
        { title: 'Enter the wall height', text: 'Once per room — the volume follows from the floor area.' },
        { title: 'Generate the floor plan', text: 'Each wall is labelled with its dimension, ready to share as an image.' },
        { title: 'Check the reliability indicator', text: 'The app shows how reliable the current measurement is and warns when conditions are poor.' },
      ],
      faqs: [
        {
          question: 'Do I need a LiDAR iPhone?',
          answer:
            'No. The camera-based tools work without it, with a larger error margin. Full room scanning with walls, doors and windows requires LiDAR.',
        },
        {
          question: 'Should I trust it for something I am cutting to size?',
          answer: 'No. Use it for the survey and a tape measure for anything that has to fit exactly.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'phone-spirit-level-accuracy',
      keyword: 'phone spirit level accuracy',
      title: 'Using Your Phone as a Spirit Level',
      metaTitle: 'Phone Spirit Level: How to Use It and When to Calibrate',
      metaDescription:
        'A phone level is accurate enough for most household jobs if you calibrate it and account for the case. How to check it in ten seconds.',
      excerpt: 'Accurate enough for the shelf — provided you check it the right way first.',
      intro: [
        'The accelerometers in a modern phone are good enough that a software spirit level is genuinely useful for household work. What throws it off is almost never the sensor: it is the case, an uneven back, or a calibration done on a surface that was not level.',
        'Ten seconds of checking removes most of the doubt.',
      ],
      sections: [
        {
          heading: 'The ten-second check',
          numbered: [
            'Place the phone on a surface and note the reading.',
            'Rotate it 180 degrees in place and read again.',
            'If both readings agree, the level is calibrated — the surface may be sloped but the tool is honest.',
            'If they differ, the offset between them is your calibration error; recalibrate and repeat.',
          ],
        },
        {
          heading: 'What affects the reading',
          bullets: [
            'A thick or uneven case, especially with a camera bump lifting one end.',
            'Calibrating on a surface you assumed was level but was not.',
            'Measuring on a soft or flexible surface that gives under the weight of the phone.',
            'Temperature swings, which is why a re-check before precise work is worthwhile.',
          ],
        },
        {
          heading: 'Jobs it handles well',
          bullets: [
            'Hanging pictures, mirrors and shelves.',
            'Levelling a washing machine or fridge.',
            'Checking whether a floor or worktop slopes, and by how much.',
            'Setting an angle with the inclinometer — a ramp, a drainage fall, a ladder.',
          ],
        },
      ],
      howToHeading: 'Using the level in Mitta',
      howToSteps: [
        { title: 'Take the case off', text: 'Or at least check with and without it — most calibration error lives in the case.' },
        { title: 'Calibrate on a known surface', text: 'Then verify with the 180-degree rotation check.' },
        { title: 'Use edge mode for verticals', text: 'The edge of the phone against a door frame or shelf upright.' },
        { title: 'Switch to the protractor for angles', text: 'For anything that needs a specific degree rather than plumb or level.' },
      ],
      faqs: [
        {
          question: 'Is a phone level as good as a real one?',
          answer:
            'For household jobs, close enough once calibrated. For structural work or long spans, a proper spirit level is still the right tool.',
        },
        {
          question: 'Why is the screen ruler calibrated with a card?',
          answer:
            'Payment cards are a standardised size worldwide, so they make a reliable reference for scaling the on-screen ruler to your particular display.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'floor-plan-from-phone',
      keyword: 'make a floor plan with your phone',
      title: 'Making a Floor Plan With Your Phone',
      metaTitle: 'Create a Floor Plan on iPhone – Rooms, Dimensions and Export',
      metaDescription:
        'When a sketch plan is worth making, what to capture during a viewing, and how to export something a landlord or tradesperson can actually use.',
      excerpt: 'What to capture in the ten minutes you have at a viewing.',
      intro: [
        'A floor plan is the most useful thing you can leave a viewing with, and almost nobody does. Photographs tell you what a flat looks like; only dimensions tell you whether your furniture fits and whether the rent is fair for the space.',
        'It takes about ten minutes if you know what to capture.',
      ],
      sections: [
        {
          heading: 'What to capture per room',
          bullets: [
            'Each wall length, going around the room in order.',
            'Ceiling height, once — it drives volume, heating and whether your wardrobe stands up.',
            'Door and window positions, since they determine where furniture cannot go.',
            'Radiators, sockets and the fuse box, which constrain layout more than people expect.',
            'Anything awkward: sloped ceilings, pillars, boxed-in pipework.',
          ],
        },
        {
          heading: 'Why the plan beats the photos',
          paragraphs: [
            'Two flats with the same stated floor area can be very different to live in, depending on how the space is divided and where the doors sit. A plan makes that comparable; photographs actively hide it, because wide-angle lenses make every room look larger.',
            'A plan also settles the furniture question before you commit, which is the most expensive mistake in a move.',
          ],
        },
        {
          heading: 'Sending it on',
          bullets: [
            'PDF for anything going to a landlord, agent or tradesperson.',
            'CSV when the measurements feed into a quote or a spreadsheet.',
            'The floor plan as an image for a quick message to whoever could not attend the viewing.',
            'Keep each flat as its own named project, so a week of viewings stays comparable.',
          ],
        },
      ],
      howToHeading: 'Building the plan in Mitta',
      howToSteps: [
        { title: 'Create a project per flat', text: 'Named, so three viewings in a day do not blur together.' },
        { title: 'Measure wall by wall', text: 'The dimensions are written onto the plan as you go.' },
        { title: 'Scan the room if you can', text: 'On LiDAR devices, walls, doors and windows are picked up automatically.' },
        { title: 'Export before you leave', text: 'PDF, CSV or an image — while the room is still in front of you.' },
      ],
      faqs: [
        {
          question: 'Can I keep several properties separate?',
          answer: 'Yes. Measurements are collected into named projects, so each flat or room stays its own set.',
        },
        {
          question: 'Does anything get uploaded?',
          answer: 'No. There is no account and no data leaves your phone — you share only what you export yourself.',
        },
      ],
      screenshotIndex: 2,
    },
  ],
  faqs: [
    {
      question: 'How accurate is measuring with the camera?',
      answer:
        'Without a LiDAR scanner, expect 1–5% deviation. The app shows how reliable the current measurement is and warns you when you are too far away or the light is poor. Check with a tape measure for anything that must be exact.',
      learnMoreSlug: 'measure-a-room-with-your-phone',
    },
    {
      question: 'What do I get without LiDAR?',
      answer:
        'All the camera measuring, the level, the protractor and the screen ruler. Full room scanning with walls, doors and windows requires a LiDAR device.',
    },
    {
      question: 'Can I get the room volume?',
      answer: 'Yes — enter the wall height and the volume follows from the measured floor area.',
      learnMoreSlug: 'floor-plan-from-phone',
    },
    {
      question: 'How do I export measurements?',
      answer: 'As PDF or CSV, collected into named projects. The floor plan can also be shared as an image.',
      learnMoreSlug: 'floor-plan-from-phone',
    },
    {
      question: 'Is there a subscription?',
      answer: 'No. Mitta is a one-time purchase, with no account and no subscription.',
    },
    {
      question: 'Does my data leave the phone?',
      answer: 'No. Nothing is uploaded — you share only what you choose to export.',
    },
  ],
  ctaHeading: 'Four Tools, One App, One Purchase',
  ctaText:
    'Tape measure, spirit level, protractor and ruler — plus floor plans and room volume. No subscription, no account.',
  category: 'UtilitiesApplication',
  downloadNote: 'Free to download • One-time purchase',
};
