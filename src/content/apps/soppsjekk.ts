import { Camera, BookOpen, Map, ListChecks, WifiOff, ShieldAlert } from 'lucide-react';
import type { AppContent } from './types';

export const soppsjekk: AppContent = {
  slug: 'mushroom-identification-guide-app',
  appId: '6798817337',
  name: 'Soppsjekk',
  storeName: 'Soppsjekk: Sopp Guide & Kart',
  subtitle: 'Compare features, log your finds',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/no/app/soppsjekk-sopp-guide-kart/id6798817337',
  icon: '/apps/soppsjekk/icon.webp',
  accent: '#a16207',
  accentDark: '#713f12',
  heroTitle: {
    pre: 'A field companion for mushroom foraging —',
    highlight: 'compare the features yourself',
    post: '',
  },
  heroDescription:
    'Photograph a mushroom and use the app to compare its features against species in the library. Save finds with photo, date and map position, browse the species library, and use the feature guide offline. Soppsjekk helps you look properly — it does not tell you what is safe to eat.',
  heroBenefits: [
    'Photograph a find and compare its features with species in the app',
    'Save finds with photo, date and position on the map',
    'Species library to browse before and after a trip',
    'Feature guide works offline, where the mushrooms are',
    'Built for Norwegian foraging conditions',
    'Use several features before you decide — and never eat what you are unsure about',
  ],
  metaTitle: 'Soppsjekk – Mushroom Guide, Feature Comparison and Find Map',
  metaDescription:
    'Photograph a mushroom, compare its features against the species library, and log your finds on a map. Offline feature guide for foraging trips.',
  metaKeywords:
    'mushroom guide app, mushroom foraging app, soppsjekk, mushroom species library, mushroom find map, foraging log, mushroom features guide, sopp app',
  screenshots: [
    { src: '/apps/soppsjekk/screenshot-1.webp', alt: 'Soppsjekk – photograph a mushroom and compare its features' },
    { src: '/apps/soppsjekk/screenshot-2.webp', alt: 'Soppsjekk species library with mushroom characteristics' },
    { src: '/apps/soppsjekk/screenshot-3.webp', alt: 'Soppsjekk – saved finds shown on a map' },
    { src: '/apps/soppsjekk/screenshot-4.webp', alt: 'Soppsjekk feature guide available offline' },
    { src: '/apps/soppsjekk/screenshot-5.webp', alt: 'Soppsjekk – a logged find with photo, date and position' },
  ],
  audience: [
    {
      badge: 'Beginners',
      title: 'New foragers',
      description:
        'The hardest part at the start is not naming a mushroom — it is knowing which features to look at. The guide walks through them one at a time.',
      color: '#713f12',
    },
    {
      badge: 'Regulars',
      title: 'People with their own spots',
      description:
        'Good patches repeat year after year. Saving finds with date and position turns one lucky autumn into a map you can return to.',
      color: '#059669',
    },
    {
      badge: 'Learning',
      title: 'Anyone building up knowledge',
      description:
        'The species library is worth reading at home, not only in the forest. Recognising a species before you meet it is far easier than the reverse.',
      color: '#0369a1',
    },
  ],
  features: [
    {
      icon: Camera,
      title: 'Photograph and Compare',
      description:
        'Take a picture of the mushroom and use the app to compare its features against species in the library. The comparison is a starting point for your own examination, not a verdict.',
      color: '#713f12',
    },
    {
      icon: ListChecks,
      title: 'Feature Guide',
      description:
        'Cap, gills, stem, ring, base, smell, spore print and habitat — the guide takes them one at a time, so you check several features rather than deciding on the first impression.',
      color: '#0369a1',
    },
    {
      icon: BookOpen,
      title: 'Species Library',
      description:
        'Browse species with their distinguishing characteristics. Reading about a species before the season starts is the cheapest preparation there is.',
      color: '#059669',
    },
    {
      icon: Map,
      title: 'Finds on a Map',
      description:
        'Every saved find carries a photo, a date and a position. Over a couple of seasons that becomes a personal map of where and when things appear.',
      color: '#7c3aed',
    },
    {
      icon: WifiOff,
      title: 'Works Offline',
      description:
        'The feature guide and the library are available without a signal, which is where mushroom picking actually happens.',
      color: '#0f766e',
    },
    {
      icon: ShieldAlert,
      title: 'Honest About Limits',
      description:
        'The app helps you compare features. It does not confirm that a mushroom is safe to eat, and it says so — because a confident-sounding app is the most dangerous thing a beginner can carry.',
      color: '#dc2626',
    },
  ],
  steps: [
    { title: 'Photograph the mushroom', description: 'In place if you can, with the surroundings visible — habitat is a feature too.' },
    { title: 'Work through the features', description: 'Cap, gills, stem, base and smell, one at a time, using the guide.' },
    { title: 'Compare with the library', description: 'Look at the species that share those features, and at the ones they are confused with.' },
    { title: 'Save the find', description: 'Photo, date and position go on the map — useful whether or not you take the mushroom home.' },
  ],
  platforms: ['iPhone'],
  pricingFree: 'Free to download, with the feature guide, species library and find map available offline.',
  guides: [
    {
      slug: 'mushroom-features-to-check',
      keyword: 'how to identify mushrooms features',
      title: 'The Features to Check Before You Name a Mushroom',
      metaTitle: 'Mushroom Identification: Which Features Actually Matter',
      metaDescription:
        'Cap colour is the least reliable feature and the one beginners use first. The characteristics that actually separate species, in the order to check them.',
      excerpt: 'Cap colour is the least reliable feature — and the one beginners reach for first.',
      intro: [
        'Nearly every mistake a beginner makes has the same shape: one feature matched, so the identification felt settled. Colour is the usual culprit, because it is the first thing you see and the thing that varies most with age, weather and light.',
        'Experienced foragers work through a sequence instead, and they treat a single matching feature as the beginning of the question rather than the answer.',
      ],
      sections: [
        {
          heading: 'The sequence worth following',
          numbered: [
            'Habitat and substrate: what is it growing on or near, and which trees are around it? This narrows the field more than colour ever will.',
            'The underside: gills, pores or spines — and if gills, how they attach to the stem.',
            'The stem: is there a ring, a bulb, a sheath at the base? Dig gently rather than snapping it off, because the base carries decisive features.',
            'Flesh: does it change colour when cut, and does it exude anything?',
            'Smell, and only smell — never taste as an identification step.',
            'Spore print, when the species groups you are considering are separated by spore colour.',
          ],
        },
        {
          heading: 'Why one feature is never enough',
          paragraphs: [
            'Species that look alike often differ in exactly one or two characteristics, and those are rarely the conspicuous ones. That is precisely why an identification built on a single match is unreliable — the feature you matched may be the one the species share.',
            'The practical rule is to be able to state several independent features that agree, and to name what the mushroom could be confused with. If you cannot name a confusion species, you have not finished looking.',
          ],
        },
        {
          heading: 'Photographing so the photo is useful',
          bullets: [
            'Take the cap from above, the underside, and the whole stem including the base.',
            'Include the surroundings in one shot — habitat is diagnostic information.',
            'Add something for scale.',
            'Photograph in natural light rather than with flash, which distorts colour.',
            'Take the photos in place, before you carry the mushroom home in a bag.',
          ],
        },
      ],
      howToHeading: 'Using the app in the field',
      howToSteps: [
        { title: 'Photograph before picking', text: 'Cap, underside, stem base and surroundings — the app keeps them with the find.' },
        { title: 'Work through the guide', text: 'One feature at a time, rather than jumping to a name.' },
        { title: 'Compare with the library', text: 'Look at the candidate species and at what they are confused with.' },
        { title: 'Save it either way', text: 'Even an unidentified find is worth logging with date and position for next season.' },
      ],
      faqs: [
        {
          question: 'Can the app tell me if a mushroom is edible?',
          answer:
            'No. It helps you compare features against species in the library. Edibility is not something to decide from an app — do not eat any mushroom you are unsure about.',
        },
        {
          question: 'Why does the base of the stem matter so much?',
          answer:
            'Several decisive features — a bulb, a sac-like sheath, a rooting base — are only visible if the mushroom is lifted whole rather than cut at ground level.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'mushroom-foraging-safety',
      keyword: 'mushroom foraging safety',
      title: 'Foraging Safely: Rules That Do Not Change',
      metaTitle: 'Mushroom Foraging Safety Rules for Beginners',
      metaDescription:
        'Why apps and photo comparison are not enough for edibility, where to get a real check, and the habits that keep beginners out of trouble.',
      excerpt: 'The rules that hold regardless of how good your app or your memory is.',
      intro: [
        'Mushroom picking is a low-risk hobby with a small number of high-consequence mistakes. The risk is not spread evenly across species: a handful account for nearly all serious poisonings, and they are all mistaken for common edible ones.',
        'None of the habits below depend on which app you use. They are what makes the app safe to carry.',
      ],
      sections: [
        {
          heading: 'The rules',
          bullets: [
            'Never eat a mushroom you are not certain about, and treat "probably" as "no".',
            'Never rely on a photo comparison — from an app, a book or a website — as the final word on edibility.',
            'Get an in-person check from someone qualified before eating an unfamiliar species. In Norway, mushroom control stations run through the season for exactly this purpose.',
            'Learn the dangerous species first. Knowing what to avoid is more useful than knowing many edible ones.',
            'Learn a small number of species properly rather than many superficially.',
            'Do not rely on folk tests — silver spoons, animals eating it, cooking it thoroughly. None of them work.',
          ],
        },
        {
          heading: 'Practical habits in the field',
          bullets: [
            'Carry an open basket rather than a plastic bag, so spores drop and the mushrooms do not sweat.',
            'Keep uncertain finds separate from the ones you are confident about — separate containers, not one basket.',
            'Lift the whole mushroom including the base when you intend to identify it.',
            'Note the habitat while you are standing in it; you will not remember it accurately at the kitchen table.',
            'Tell someone where you are going, and remember that a phone in a forest often has no signal.',
          ],
        },
        {
          heading: 'If something goes wrong',
          paragraphs: [
            'If you or someone else has eaten a mushroom and feels unwell, contact emergency services or a poison information centre immediately — do not wait to see whether it passes. Some of the most serious poisonings have a symptom-free interval of many hours, and treatment is far more effective when it starts early.',
            'Keep any remaining mushroom, and the photographs you took. Identification of the actual specimen changes the treatment.',
          ],
        },
      ],
      howToHeading: 'How the app fits in',
      howToSteps: [
        { title: 'Use it to look properly', text: 'The feature guide is a checklist for examination, not a verdict.' },
        { title: 'Photograph everything you pick', text: 'If a question arises later, the photos are what make it answerable.' },
        { title: 'Take uncertain finds to a real check', text: 'A mushroom control station or an experienced forager, in person.' },
        { title: 'Log what you learn', text: 'Saved finds with dates and positions build genuine local knowledge over seasons.' },
      ],
      faqs: [
        {
          question: 'Is an app enough to start foraging?',
          answer:
            'It is a good learning tool and a good field notebook. It is not a substitute for an in-person check before eating anything unfamiliar.',
        },
        {
          question: 'What should I learn first?',
          answer:
            'The dangerous species in your area, and the common edible species they are confused with. That pairing is the useful unit of knowledge.',
        },
      ],
      screenshotIndex: 3,
    },
    {
      slug: 'mushroom-find-map',
      keyword: 'mushroom foraging map log',
      title: 'Keeping a Find Map: Why Foragers Log Everything',
      metaTitle: 'Mushroom Find Map: Logging Spots, Dates and Photos',
      metaDescription:
        'Mushrooms return to the same places at the same time of year. How a logged find map turns a lucky season into repeatable knowledge.',
      excerpt: 'Mushrooms come back to the same places. A logged map turns luck into knowledge.',
      intro: [
        'Foraging rewards memory more than almost any other outdoor activity, because mushrooms fruit in the same places year after year, in roughly the same weeks, when the weather cooperates. The problem is that human memory for forest locations is poor and gets worse over a winter.',
        'A logged map fixes that, and it takes a few seconds per find.',
      ],
      sections: [
        {
          heading: 'What to record',
          bullets: [
            'Position — the single most valuable field, and the one you cannot reconstruct later.',
            'Date, because timing repeats more reliably than quantity.',
            'A photo of the find in place, including the surroundings.',
            'Habitat notes: tree species nearby, ground cover, how wet the spot is.',
            'Quantity, roughly, so you can tell a good year from a poor one at the same spot.',
          ],
        },
        {
          heading: 'What the map tells you after a season or two',
          paragraphs: [
            'Patterns emerge that are invisible in a single autumn: which slopes produce first, how many days after heavy rain a spot becomes worth visiting, which patches held up in a dry year.',
            'It also stops the most annoying kind of loss — finding a good patch, being certain you will remember it, and then walking past it the following year without recognising anything.',
          ],
        },
        {
          heading: 'Logging what you did not identify',
          paragraphs: [
            'Unidentified finds are worth saving too. A photographed, positioned, dated find you could not name in October is often easy to name in February with a book, and next season you know exactly where to go back and look again.',
            'Over time these become the most educational entries in the log, because each one is a question you eventually answered yourself.',
          ],
        },
      ],
      howToHeading: 'Building your map',
      howToSteps: [
        { title: 'Save every find', text: 'Photo, date and position, whether or not you identified it.' },
        { title: 'Add habitat notes', text: 'Trees, ground and moisture — the details you will not remember in spring.' },
        { title: 'Review before the season', text: 'Last year is the best guide to where and when to start this year.' },
        { title: 'Revisit and update', text: 'Note the years a patch produced nothing; that is information too.' },
      ],
      faqs: [
        {
          question: 'Are my find locations private?',
          answer: 'Your finds are your own log. Foragers guard good spots, and the app is built to be a personal record.',
        },
        {
          question: 'Does the map work without a signal?',
          answer:
            'Position is recorded on the device, and the feature guide and library work offline — which matters, because forests rarely have coverage.',
        },
      ],
      screenshotIndex: 2,
    },
  ],
  faqs: [
    {
      question: 'Does Soppsjekk tell me whether a mushroom is safe to eat?',
      answer:
        'No, and that is deliberate. It helps you compare features against species in the library so you examine the mushroom properly. Use several features before you decide, and do not eat a mushroom you are unsure about.',
      learnMoreSlug: 'mushroom-foraging-safety',
    },
    {
      question: 'How does the photo comparison work?',
      answer:
        'You photograph the mushroom and the app helps you compare its characteristics with species in the library. It is a tool for looking carefully, not an identification verdict.',
      learnMoreSlug: 'mushroom-features-to-check',
    },
    {
      question: 'Does it work without a signal?',
      answer: 'Yes. The feature guide and species library are available offline, which is where foraging actually takes place.',
    },
    {
      question: 'What gets saved with a find?',
      answer: 'A photo, the date and the position on the map — so you can return to a good spot in a later season.',
      learnMoreSlug: 'mushroom-find-map',
    },
    {
      question: 'Is it useful for beginners?',
      answer:
        'Yes, particularly the feature guide, which teaches which characteristics to look at and in what order. Pair it with an in-person check before eating anything unfamiliar.',
    },
    {
      question: 'Which language is the app in?',
      answer: 'Soppsjekk is a Norwegian app, built around Norwegian foraging conditions and species.',
    },
  ],
  ctaHeading: 'Look Properly Before You Decide',
  ctaText:
    'A feature guide, a species library and a find map that works offline. Free to download — and never eat a mushroom you are unsure about.',
  category: 'ReferenceApplication',
  downloadNote: 'Free to download',
};
