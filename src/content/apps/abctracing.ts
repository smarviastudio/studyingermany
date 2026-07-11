import { PenLine, Hash, Shapes, Volume2, Globe, ShieldCheck } from 'lucide-react';
import type { AppContent } from './types';

export const abctracing: AppContent = {
  slug: 'abc-letter-tracing-app',
  appId: '6756505099',
  name: 'ABC Tracing',
  storeName: 'ABC Kids: Tracing & Phonics',
  subtitle: 'Phonics, Numbers & Writing',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/abc-kids-tracing-phonics/id6756505099',
  icon: '/apps/abctracing/icon.webp',
  accent: '#fbbf24',
  accentDark: '#d97706',
  heroTitle: {
    pre: 'The Letter Tracing App That Teaches Kids to',
    highlight: 'Write & Read',
    post: '',
  },
  heroDescription:
    'ABC Tracing gives toddlers and preschoolers a head start: guided tracing for every letter A–Z, numbers 0–9 and shapes, with audio that speaks each letter aloud — the phonics foundation of reading. No ads ever, no data collected, in 5 languages.',
  heroBenefits: [
    'Guided tracing for all uppercase & lowercase letters (A–Z)',
    'Number tracing 0–9 for kindergarten math readiness',
    'Shapes, plus a free drawing mode for creativity',
    'Audio speaks every letter and number aloud (phonics)',
    '5 languages: English, German, Spanish, Portuguese, French',
    'No ads — ever. No data collected.',
  ],
  metaTitle: 'ABC Tracing – Letter Tracing App for Toddlers & Preschoolers',
  metaDescription:
    'Teach your child to write letters, numbers and shapes with guided tracing and phonics audio. Ad-free, no data collected, 5 languages. Free on iPhone and iPad.',
  metaKeywords:
    'letter tracing app, abc tracing app, learn to write letters app, alphabet app for toddlers, preschool writing app, phonics app for kids, number tracing, handwriting practice kids, kindergarten readiness app',
  screenshots: [
    { src: '/apps/abctracing/screenshot-1.webp', alt: 'ABC Tracing app – guided letter tracing for toddlers' },
    { src: '/apps/abctracing/screenshot-2.webp', alt: 'ABC Tracing – uppercase and lowercase alphabet tracing' },
    { src: '/apps/abctracing/screenshot-3.webp', alt: 'ABC Tracing app – number tracing 0 to 9' },
    { src: '/apps/abctracing/screenshot-4.webp', alt: 'ABC Tracing – shape tracing for fine motor skills' },
    { src: '/apps/abctracing/screenshot-5.webp', alt: 'ABC Tracing app – free drawing mode for kids' },
    { src: '/apps/abctracing/screenshot-6.webp', alt: 'ABC Tracing – phonics audio speaks each letter aloud' },
    { src: '/apps/abctracing/screenshot-7.webp', alt: 'ABC Tracing app – learn letters in 5 languages' },
    { src: '/apps/abctracing/screenshot-8.webp', alt: 'ABC Tracing – safe, ad-free learning for preschoolers' },
  ],
  audience: [
    {
      badge: 'Ages 2–3',
      title: 'Toddlers',
      description: 'First finger control: trace big shapes and letters with forgiving guides, and hear every letter spoken aloud.',
      color: '#d97706',
    },
    {
      badge: 'Ages 3–5',
      title: 'Preschoolers',
      description: 'Build real pre-writing skills: uppercase, lowercase, numbers, and the letter-sound connections reading is built on.',
      color: '#059669',
    },
    {
      badge: 'Bilingual',
      title: 'Multilingual Families',
      description: 'Switch between English, German, Spanish, Portuguese and French anytime — one app for both of your child\'s languages.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: PenLine,
      title: 'Guided Letter Tracing (A–Z)',
      description:
        'Every uppercase and lowercase letter with guided paths kids follow with their finger — building the muscle memory that real handwriting is made of.',
      color: '#d97706',
    },
    {
      icon: Hash,
      title: 'Number Tracing (0–9)',
      description:
        'Step-by-step tracing for every number — the perfect preparation for kindergarten math readiness.',
      color: '#0284c7',
    },
    {
      icon: Shapes,
      title: 'Shapes & Fine Motor Skills',
      description:
        'Circles, stars, hearts, triangles and more. Tracing shapes develops the fine motor control and spatial awareness younger kids need before letters.',
      color: '#7c3aed',
    },
    {
      icon: Volume2,
      title: 'Phonics Audio',
      description:
        'Every letter and number is spoken aloud, helping kids connect written symbols with sounds — the foundation skill of learning to read.',
      color: '#059669',
    },
    {
      icon: Globe,
      title: '5 Languages Built In',
      description:
        'English, German, Spanish, Portuguese and French — switch anytime. Perfect for bilingual families and early language exposure.',
      color: '#db2777',
    },
    {
      icon: ShieldCheck,
      title: 'Genuinely Kid-Safe',
      description:
        'No ads — ever. No data collected. No links out. Just a calm, safe space where your child can learn without you hovering over every tap.',
      color: '#dd0000',
    },
  ],
  steps: [
    { title: 'Pick Letters, Numbers or Shapes', description: 'Your child chooses what to practice — big friendly menus they can navigate alone.' },
    { title: 'Trace With a Finger', description: 'Guided paths show exactly where to go; forgiving feedback keeps frustration away.' },
    { title: 'Hear the Sound', description: 'Each completed letter or number is spoken aloud, wiring symbols to sounds.' },
    { title: 'Create Freely', description: 'The free drawing canvas rewards practice with pure creative play.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'ABC Tracing is free to download on iPhone and iPad, with no ads and no data collection. In-app purchases unlock the complete letter, number and shape library.',
  guides: [
    {
      slug: 'teach-toddler-to-write-letters',
      keyword: 'how to teach a toddler to write letters',
      title: 'How to Teach a Toddler to Write Letters (Ages 2–5, Step by Step)',
      metaTitle: 'How to Teach a Toddler to Write Letters: Step-by-Step (Ages 2–5)',
      metaDescription:
        'Teaching a toddler to write starts with fine motor play, moves through finger tracing, and ends with pencil grip. The full developmental sequence, plus how tracing apps accelerate it.',
      excerpt: 'The developmental sequence from scribbles to letters — and where finger tracing fits before pencil grip.',
      intro: [
        'Children learn to write in a predictable sequence: scribbling, then lines and circles, then shapes, then letters — usually the ones in their own name first. Trying to skip stages (handing a 2-year-old a pencil and an alphabet worksheet) produces frustration, not progress.',
        'The most effective early tool is the child\'s own finger. Finger tracing builds the motor patterns of each letter without the added challenge of gripping a pencil — which is why occupational therapists recommend tracing before writing.',
      ],
      sections: [
        {
          heading: 'The developmental sequence',
          numbered: [
            'Ages ~2–3: vertical lines, horizontal lines and circles — the strokes all letters are made of.',
            'Ages ~3–4: simple shapes (cross, square), then big uppercase letters with straight lines: L, T, E, H.',
            'Ages ~4–5: curved uppercase letters (C, O, S), then lowercase, then numbers.',
            'Age ~5+: pencil work, letter sizing and spacing — actual handwriting.',
          ],
        },
        {
          heading: 'Why finger tracing works so well',
          bullets: [
            'It isolates the skill: the letter\'s shape is learned without fighting pencil grip at the same time.',
            'Guided paths prevent bad habits: starting letters at the wrong point is the #1 habit teachers must undo later.',
            'Immediate feedback keeps motivation high — no wrong-looking wobbly results on paper.',
            'Audio pairing (hearing "B says buh" while tracing B) builds reading and writing simultaneously.',
          ],
        },
        {
          heading: 'Keep sessions short and playful',
          paragraphs: [
            'Five to ten minutes is a full session for a toddler. Stop while it is still fun, celebrate every attempt, and never correct more than you praise. The goal at this age is a child who wants to make letters — speed and neatness come years later.',
          ],
        },
      ],
      howToHeading: 'How to practice with ABC Tracing',
      howToSteps: [
        { title: 'Start with shapes', text: 'For younger toddlers, begin in the shapes section — circles and stars build the strokes letters need.' },
        { title: 'Move to uppercase letters', text: 'Guided paths show your child exactly where to start and where to go, with forgiving feedback.' },
        { title: 'Let the audio teach sounds', text: 'Every completed letter is spoken aloud — your child learns the sound while mastering the shape.' },
        { title: 'End with free drawing', text: 'Finish each session in the drawing canvas. Creative play is the reward that brings them back tomorrow.' },
      ],
      faqs: [
        {
          question: 'At what age should a child start tracing letters?',
          answer: 'Around 3 for letters — earlier for lines and shapes. If your child can draw a circle and a cross, they are ready to trace simple uppercase letters.',
        },
        {
          question: 'Uppercase or lowercase first?',
          answer: 'Uppercase first: the strokes are simpler and more distinct. Introduce lowercase once a dozen capitals feel easy.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'handwriting-practice-before-kindergarten',
      keyword: 'handwriting practice before kindergarten',
      title: 'Handwriting Readiness Before Kindergarten: What Kids Actually Need',
      metaTitle: 'Handwriting Practice Before Kindergarten: The Readiness Checklist',
      metaDescription:
        'Kindergarten teachers wish every child arrived with these pre-writing skills: pencil-free letter knowledge, stroke control, and letter-sound links. Here is the readiness checklist.',
      excerpt: 'What kindergarten teachers actually hope kids arrive with — a readiness checklist and daily 10-minute routine.',
      intro: [
        'Kindergarten readiness is not about writing perfect letters — teachers will handle that. What makes the first school year dramatically easier is arriving with the precursors: knowing letter shapes, controlling basic strokes, and connecting letters to sounds.',
        'Ten minutes of playful daily practice in the year before school covers all of it comfortably.',
      ],
      sections: [
        {
          heading: 'The readiness checklist',
          bullets: [
            'Recognizes most uppercase letters by sight and names them.',
            'Traces letters with a finger following the correct stroke order.',
            'Draws basic strokes on request: line down, line across, circle, cross.',
            'Knows the sounds of at least half the alphabet ("what does M say?").',
            'Recognizes and attempts the letters of their own name.',
            'Counts and recognizes numbers 0–9.',
          ],
        },
        {
          heading: 'The 10-minute daily routine',
          numbered: [
            'Two minutes: warm-up shapes or free drawing.',
            'Five minutes: trace 3–4 letters — two familiar, one or two new. Say the sound together each time.',
            'Two minutes: trace one number.',
            'One minute: "find the letter" — spot today\'s letters on cereal boxes, signs or books.',
          ],
        },
        {
          heading: 'Correct stroke order matters more than neatness',
          paragraphs: [
            'A wobbly letter traced in the right direction beats a neat letter drawn bottom-up. Stroke order becomes automatic within weeks and is very hard to retrain later — it is the single thing worth gently insisting on. Guided tracing paths handle this automatically by only accepting the correct path.',
          ],
        },
      ],
      howToHeading: 'Building readiness with ABC Tracing',
      howToSteps: [
        { title: 'Follow the built-in progression', text: 'Shapes → uppercase → lowercase → numbers mirrors the developmental order teachers expect.' },
        { title: 'Trust the guided paths', text: 'The app only accepts correct stroke order, so proper habits form from the first trace.' },
        { title: 'Pair shapes with sounds', text: 'Phonics audio links every letter to its sound — half of the readiness checklist in one habit.' },
        { title: 'Keep it to ten minutes', text: 'Short daily sessions with the free-drawing reward beat long weekend marathons every time.' },
      ],
      faqs: [
        {
          question: 'Should my child write with a pencil before kindergarten?',
          answer: 'It is a bonus, not a requirement. Finger-traced letter knowledge plus drawing-based pencil comfort is exactly what teachers hope for; formal pencil handwriting is kindergarten\'s job.',
        },
        {
          question: 'How long before school should we start?',
          answer: 'A relaxed year of 10-minute sessions is ideal, but even 8–12 weeks of daily practice makes a visible difference in readiness.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'phonics-apps-for-preschoolers',
      keyword: 'phonics apps for preschoolers',
      title: 'Phonics for Preschoolers: How Letter Sounds Unlock Reading',
      metaTitle: 'Phonics Apps for Preschoolers: How Letter Sounds Unlock Reading',
      metaDescription:
        'Phonics — connecting letters to sounds — is the strongest predictor of early reading success. What preschool phonics should look like, and how tracing + audio builds it naturally.',
      excerpt: 'Why letter-sound knowledge predicts reading success — and how tracing with audio builds phonics without flashcard drills.',
      intro: [
        'Decades of reading research agree on one thing: children who know their letter sounds learn to read faster and more confidently. Phonics — the link between written letters and spoken sounds — is the single strongest predictor of early reading success.',
        'For preschoolers, phonics should not look like drills. It should be woven into play: hearing "S says sss" while tracing an S plants the connection effortlessly, hundreds of times, without a single flashcard.',
      ],
      sections: [
        {
          heading: 'What preschool phonics actually is',
          bullets: [
            'Letter-sound links: "M says mmm" — one reliable sound per letter first; exceptions come later.',
            'Sound play: rhymes, alliteration, "what sound does your name start with?"',
            'Multi-sensory anchoring: seeing the letter, hearing the sound and tracing the shape at the same moment — the strongest memory glue there is.',
          ],
        },
        {
          heading: 'What to look for in a phonics app',
          bullets: [
            'Audio on every letter — spoken clearly, repeated on demand.',
            'Tracing paired with the sound, not separated into different games.',
            'No ads or reward loops that hijack attention away from learning.',
            'Multiple languages if your family is bilingual — sounds differ across languages, and kids handle both effortlessly.',
          ],
        },
        {
          heading: 'The bilingual bonus',
          paragraphs: [
            'Bilingual children benefit from hearing letter sounds in both languages early — German and English vowels, for example, differ substantially. An app that switches languages lets one child practice "A says ah" in German and "A says ay" in English, building both sound systems in parallel without confusion.',
          ],
        },
      ],
      howToHeading: 'How ABC Tracing teaches phonics',
      howToSteps: [
        { title: 'Trace with sound on', text: 'Every letter your child traces is spoken aloud — the see-hear-trace triple that makes sounds stick.' },
        { title: 'Repeat favorites freely', text: 'Kids naturally re-trace letters they like; every repeat is another phonics repetition.' },
        { title: 'Switch languages anytime', text: 'Choose English, German, Spanish, Portuguese or French — ideal for bilingual households.' },
        { title: 'Connect to the world', text: 'After each session, hunt today\'s letter sounds in books and signs — the app plants the link, the world waters it.' },
      ],
      faqs: [
        {
          question: 'When should phonics start?',
          answer: 'Playful phonics can start around age 3 — no formal instruction needed. Letter-sound play in the preschool years is the ideal preparation for reading instruction at school.',
        },
        {
          question: 'Is screen-based phonics effective?',
          answer: 'Yes, when the app is well designed: interactive tracing with audio outperforms passive video because the child acts on each letter rather than just watching.',
        },
      ],
      screenshotIndex: 5,
    },
  ],
  faqs: [
    {
      question: 'What is ABC Tracing?',
      answer:
        'ABC Tracing is a learn-to-write app for toddlers and preschoolers: guided finger tracing for all letters A–Z (upper and lowercase), numbers 0–9 and shapes, with phonics audio and a free drawing mode — completely ad-free.',
      learnMoreSlug: 'teach-toddler-to-write-letters',
    },
    {
      question: 'What age is ABC Tracing for?',
      answer:
        'Roughly ages 2–6: toddlers start with shapes and big letters, preschoolers progress through the full alphabet and numbers on the way to kindergarten readiness.',
      learnMoreSlug: 'handwriting-practice-before-kindergarten',
    },
    {
      question: 'Does the app teach letter sounds (phonics)?',
      answer:
        'Yes — every letter and number is spoken aloud as your child traces it, building the letter-sound connections that early reading is built on.',
      learnMoreSlug: 'phonics-apps-for-preschoolers',
    },
    {
      question: 'Are there really no ads?',
      answer:
        'Really none — ever. No ads, no data collection and no outside links. It is a calm, safe space your child can use independently.',
    },
    {
      question: 'Which languages does ABC Tracing support?',
      answer:
        'English, German, Spanish, Portuguese and French — switchable anytime, which makes it perfect for bilingual families.',
    },
    {
      question: 'Is ABC Tracing free?',
      answer:
        'The app is free to download with core content included; in-app purchases unlock the complete letter, number and shape library.',
    },
  ],
  ctaHeading: 'Give Your Child a Head Start',
  ctaText: 'Download ABC Tracing free and watch your child trace their first letters today — no ads, no data, just learning.',
  ratingValue: '5.0',
  ratingCount: '1',
  category: 'EducationApplication',
  downloadNote: 'Free to download • No ads ever • No data collected',
};
