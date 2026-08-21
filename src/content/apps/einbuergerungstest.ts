import { FileQuestion, Timer, MapPin, Languages, Shield, TrendingUp } from 'lucide-react';
import type { AppContent } from './types';

export const einbuergerungstest: AppContent = {
  slug: 'einbuergerungstest-2026-app',
  appId: '6748231679',
  name: 'Einbürgerungstest 2026',
  storeName: 'Einbürgerungstest 2026 - BAMF',
  subtitle: 'Leben in Deutschland Test 2026',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/de/app/einb%C3%BCrgerungstest-2026-bamf/id6748231679',
  icon: '/apps/einbuergerungstest/icon.webp',
  accent: '#ffce00',
  accentDark: '#dd0000',
  heroTitle: {
    pre: 'Pass the',
    highlight: 'Einbürgerungstest 2026',
    post: 'on Your First Try',
  },
  heroDescription:
    'Practice all 310 official BAMF questions for the Einbürgerungstest and the Leben in Deutschland test — with exam simulation, questions for all 16 federal states, explanations and translations in 10 languages. Fully offline, ad-free, no account needed.',
  heroBenefits: [
    'All 310 official BAMF questions, updated for 2026',
    'Real exam simulation: 33 questions in 60 minutes with pass/fail result',
    'State-specific questions for all 16 Bundesländer',
    'Translations in English, Russian, Turkish, Arabic, Ukrainian & more',
    'Works 100% offline — practice anywhere, no account, no ads',
  ],
  metaTitle: 'Einbürgerungstest 2026 App – Alle 310 Fragen (offline)',
  metaDescription:
    'Alle 310 offiziellen BAMF-Fragen für den Einbürgerungstest 2026 üben – mit Prüfungssimulation, Bundesland-Fragen und Übersetzungen. Offline und werbefrei.',
  metaKeywords:
    'Einbürgerungstest 2026 App, Einbürgerungstest üben, BAMF test app, German citizenship test app, Leben in Deutschland Test, 310 Fragen, Einbürgerungstest Fragen, German naturalization test, Einbürgerungstest simulation',
  screenshots: [
    { src: '/apps/einbuergerungstest/screenshot-1.webp', alt: 'Einbürgerungstest 2026 App – alle 310 offiziellen BAMF Fragen üben' },
    { src: '/apps/einbuergerungstest/screenshot-2.webp', alt: 'Einbürgerungstest App – Prüfungssimulation mit 33 Fragen und Timer' },
    { src: '/apps/einbuergerungstest/screenshot-3.webp', alt: 'Leben in Deutschland Test – Fragen mit Erklärungen und Übersetzungen' },
    { src: '/apps/einbuergerungstest/screenshot-4.webp', alt: 'Einbürgerungstest App – Bundesland-Fragen für alle 16 Länder' },
    { src: '/apps/einbuergerungstest/screenshot-5.webp', alt: 'Einbürgerungstest 2026 – Fortschritt und Fehleranalyse' },
    { src: '/apps/einbuergerungstest/screenshot-6.webp', alt: 'Einbürgerungstest App – Übersetzungen in 10 Sprachen' },
    { src: '/apps/einbuergerungstest/screenshot-7.webp', alt: 'Einbürgerungstest 2026 App – offline lernen ohne Konto' },
  ],
  audience: [
    {
      badge: 'Citizenship',
      title: 'Einbürgerung Applicants',
      description: 'Applying for German citizenship? Master all 310 official questions and walk into the test knowing you will pass.',
      color: '#dd0000',
    },
    {
      badge: 'LiD Test',
      title: 'Integration Course Participants',
      description: 'The Leben in Deutschland test uses the same 310-question catalog. Prepare for your course final exam with the exact questions.',
      color: '#7c3aed',
    },
    {
      badge: '10 Languages',
      title: 'Learners Who Need Translations',
      description: 'Read every question and explanation in English, Russian, Turkish, Arabic, Ukrainian, Polish, Hindi and more while you learn the German originals.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: FileQuestion,
      title: 'All 310 Official BAMF Questions',
      description:
        'The complete official catalog: 300 general questions plus 10 for your federal state — including the 2026 updates with new topics such as Jewish life in Germany and current politics.',
      color: '#dd0000',
    },
    {
      icon: Timer,
      title: 'Real Exam Simulation',
      description:
        'Simulate the real test: 33 questions, 60 minutes, official pass mark (17 correct). See your pass/fail result and exactly which questions you missed.',
      color: '#7c3aed',
    },
    {
      icon: MapPin,
      title: 'All 16 Federal States',
      description:
        'Filter the state-specific questions for your Bundesland — from Bayern to Berlin to NRW — so you only practice what your local test will actually ask.',
      color: '#059669',
    },
    {
      icon: Languages,
      title: 'Translations in 10 Languages',
      description:
        'Questions and explanations available in German, English, Russian, Turkish, Farsi, Polish, Romanian, Hindi, Arabic and Ukrainian — understand first, memorize second.',
      color: '#0284c7',
    },
    {
      icon: TrendingUp,
      title: 'Smart Practice & Error Tracking',
      description:
        'Practice mode gives instant feedback with explanations, tracks your weak questions and lets you repeat exactly the ones you got wrong until they stick.',
      color: '#d97706',
    },
    {
      icon: Shield,
      title: 'Offline, Ad-Free, No Account',
      description:
        'The whole catalog works offline after download. No ads interrupt your learning, and you never need to create an account or share personal data.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Choose Your Bundesland', description: 'Select your federal state to load the right 310 questions — 300 general plus your 10 state questions.' },
    { title: 'Practice with Feedback', description: 'Work through the catalog in practice mode with instant feedback, explanations and translations.' },
    { title: 'Repeat Your Mistakes', description: 'The app tracks wrong answers so you can drill your weak spots until they become strengths.' },
    { title: 'Simulate the Exam', description: 'Take timed 33-question simulations until you pass comfortably — then book your real test with confidence.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'Einbürgerungstest 2026 is free to download on iPhone and iPad, works completely offline and shows no ads. Optional in-app upgrades unlock premium convenience features.',
  guides: [
    {
      slug: 'einbuergerungstest-310-fragen-ueben',
      keyword: 'einbürgerungstest 310 fragen üben',
      title: 'Einbürgerungstest: Alle 310 Fragen üben – so bestehst du 2026',
      metaTitle: 'Einbürgerungstest 2026: Alle 310 Fragen üben (offline)',
      metaDescription:
        'Alle 310 offiziellen BAMF-Fragen für den Einbürgerungstest 2026 üben: 300 allgemeine plus 10 Bundesland-Fragen, mit Erklärungen und Übersetzungen.',
      excerpt: 'Der komplette Fragenkatalog erklärt: wie die 310 Fragen aufgebaut sind und mit welchem Lernplan du sie in 3–4 Wochen sicher beherrschst.',
      intro: [
        'Der Einbürgerungstest besteht aus einem offiziellen Katalog von 310 Fragen: 300 allgemeine Fragen zu Politik, Geschichte, Gesellschaft und Recht plus 10 Fragen zu deinem Bundesland. In der Prüfung bekommst du 33 dieser Fragen — 17 richtige Antworten reichen zum Bestehen.',
        'Die gute Nachricht: Alle Fragen sind öffentlich. Wer den Katalog systematisch übt, kann in der Prüfung nicht überrascht werden. Hier ist der Lernplan, mit dem du die 310 Fragen in drei bis vier Wochen sicher beherrschst.',
      ],
      sections: [
        {
          heading: 'So ist der Fragenkatalog aufgebaut',
          bullets: [
            '300 allgemeine Fragen: Demokratie und Grundrechte, Geschichte (Nationalsozialismus, DDR, Wiedervereinigung), Rechtsordnung, Sozialsystem und Alltag in Deutschland.',
            '10 Bundesland-Fragen: Wappen, Landtag, Ministerpräsident:in und regionale Besonderheiten deines Bundeslandes.',
            'Seit den letzten Aktualisierungen: neue Themen wie jüdisches Leben in Deutschland und aktuelle politische Grundlagen.',
            'In der Prüfung: 33 Fragen (30 allgemeine + 3 aus deinem Bundesland), 60 Minuten Zeit, 17 richtige Antworten = bestanden.',
          ],
        },
        {
          heading: 'Der 4-Wochen-Lernplan',
          numbered: [
            'Woche 1: Jeden Tag 30–40 neue Fragen im Übungsmodus durchgehen. Erklärungen lesen, bei Bedarf Übersetzung einblenden.',
            'Woche 2: Restliche Fragen abschließen und ab jetzt täglich die falsch beantworteten Fragen wiederholen.',
            'Woche 3: Nur noch Fehlerfragen üben plus die 10 Fragen deines Bundeslandes perfektionieren.',
            'Woche 4: Jeden zweiten Tag eine komplette Prüfungssimulation (33 Fragen, 60 Minuten). Ziel: dreimal hintereinander 25+ richtige Antworten.',
          ],
        },
        {
          heading: 'Die häufigsten Fehler beim Üben',
          paragraphs: [
            'Der größte Fehler ist passives Lesen: Wer die Fragen nur durchscrollt, erkennt die richtige Antwort in der Prüfung nicht sicher wieder. Aktives Beantworten mit sofortigem Feedback ist doppelt so effektiv. Zweiter Fehler: die Bundesland-Fragen bis zum Schluss aufschieben — sie sind nur 10 Fragen, aber 3 davon kommen garantiert in deiner Prüfung dran.',
          ],
        },
      ],
      howToHeading: 'So übst du die 310 Fragen mit der Einbürgerungstest 2026 App',
      howToSteps: [
        { title: 'Bundesland wählen', text: 'Wähle dein Bundesland — die App lädt automatisch die richtigen 310 Fragen inklusive deiner 10 Landesfragen.' },
        { title: 'Übungsmodus starten', text: 'Beantworte Fragen mit sofortigem Feedback und Erklärungen. Bei Bedarf blendest du die Übersetzung in deiner Sprache ein.' },
        { title: 'Fehler automatisch wiederholen', text: 'Die App merkt sich jede falsche Antwort. Im Fehlermodus übst du genau diese Fragen, bis sie sitzen.' },
        { title: 'Prüfung simulieren', text: 'Starte die Simulation: 33 Fragen, 60 Minuten, echtes Bestehen-Limit. Wiederhole sie, bis du konstant sicher bestehst.' },
      ],
      faqs: [
        {
          question: 'Wie viele der 310 Fragen kommen in der Prüfung dran?',
          answer: '33 Fragen: 30 aus den 300 allgemeinen Fragen und 3 aus den 10 Fragen deines Bundeslandes. Mit 17 richtigen Antworten hast du bestanden.',
        },
        {
          question: 'Wie lange dauert es, alle 310 Fragen zu lernen?',
          answer: 'Mit 30–45 Minuten täglichem Üben beherrschen die meisten den Katalog in drei bis vier Wochen sicher.',
        },
        {
          question: 'Sind die Fragen in der App aktuell für 2026?',
          answer: 'Ja, die App enthält den aktuellen offiziellen BAMF-Katalog inklusive der neuen Themen wie jüdisches Leben in Deutschland.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'leben-in-deutschland-test-simulation',
      keyword: 'leben in deutschland test simulation',
      title: 'Leben in Deutschland Test: Simulation, Ablauf und Bestehen-Grenze',
      metaTitle: 'Leben in Deutschland Test: Simulation mit 33 Fragen',
      metaDescription:
        'So läuft der Leben in Deutschland Test ab: 33 Fragen, 60 Minuten, 17 richtige zum Bestehen. Mit realistischer Prüfungssimulation vorbereiten.',
      excerpt: 'Ablauf, Zeitlimit und Bestehen-Grenze des LiD-Tests — und warum Prüfungssimulationen der Schlüssel zum sicheren Bestehen sind.',
      intro: [
        'Der "Leben in Deutschland" Test (LiD) ist die Abschlussprüfung des Orientierungskurses — und nutzt denselben offiziellen Katalog von 310 Fragen wie der Einbürgerungstest. In der Prüfung beantwortest du 33 Multiple-Choice-Fragen in maximal 60 Minuten; 17 richtige Antworten reichen zum Bestehen.',
        'Wer vorher realistische Simulationen macht, geht ohne Nervosität in die Prüfung: Du kennst das Zeitgefühl, das Frageformat und deine sichere Trefferquote schon vorher.',
      ],
      sections: [
        {
          heading: 'So läuft der Test ab',
          bullets: [
            '33 Fragen im Multiple-Choice-Format mit je 4 Antwortmöglichkeiten — genau eine ist richtig.',
            '60 Minuten Zeit — in der Praxis brauchen gut vorbereitete Teilnehmer 15–25 Minuten.',
            '17 richtige Antworten = bestanden (für die Einbürgerung). Für das LiD-Zertifikat nach dem Orientierungskurs gelten dieselben Fragen.',
            'Ergebnis: Das Zertifikat wird dir per Post zugeschickt und gilt unbegrenzt.',
          ],
        },
        {
          heading: 'Warum Simulationen so wirksam sind',
          paragraphs: [
            'Eine Simulation trainiert drei Dinge, die reines Fragenlernen nicht abdeckt: das Durchhalten über 33 Fragen ohne Feedback, den Umgang mit dem Zeitdruck und das Aushalten von Unsicherheit bei schweren Fragen. Wer fünf Simulationen mit konstant 25+ richtigen Antworten geschafft hat, besteht die echte Prüfung mit sehr hoher Wahrscheinlichkeit.',
          ],
        },
        {
          heading: 'Anmeldung und Kosten',
          paragraphs: [
            'Den Einbürgerungstest legst du bei einer Volkshochschule oder einer anderen zugelassenen Prüfstelle ab; die Gebühr beträgt in der Regel 25 Euro. Termine bekommst du direkt bei der Prüfstelle — in Großstädten lohnt sich frühe Anmeldung, da Termine oft Wochen im Voraus ausgebucht sind.',
          ],
        },
      ],
      howToHeading: 'So simulierst du die Prüfung in der App',
      howToSteps: [
        { title: 'Simulation starten', text: 'Wähle den Prüfungsmodus: Die App stellt dir 33 zufällige Fragen aus deinem Katalog — wie in der echten Prüfung.' },
        { title: 'Unter echten Bedingungen antworten', text: 'Der Timer läuft mit 60 Minuten. Beantworte alle Fragen ohne Hilfen und Übersetzungen — genau wie im Testcenter.' },
        { title: 'Ergebnis analysieren', text: 'Nach der Simulation siehst du dein Bestehen-Ergebnis und jede falsche Antwort mit Erklärung.' },
        { title: 'Schwächen gezielt üben', text: 'Wiederhole die Fehlerfragen im Übungsmodus und starte die nächste Simulation — bis du konstant sicher bestehst.' },
      ],
      faqs: [
        {
          question: 'Ist der Leben in Deutschland Test derselbe wie der Einbürgerungstest?',
          answer: 'Beide nutzen denselben Katalog von 310 Fragen und dasselbe Format (33 Fragen). Der LiD-Test ist die Abschlussprüfung des Orientierungskurses, der Einbürgerungstest der Nachweis für die Staatsbürgerschaft.',
        },
        {
          question: 'Wie oft kann ich den Test wiederholen?',
          answer: 'Du kannst den Einbürgerungstest beliebig oft wiederholen; pro Versuch fällt die Prüfungsgebühr von ca. 25 Euro an.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'german-citizenship-test-english',
      keyword: 'german citizenship test in english',
      title: 'German Citizenship Test in English: Questions, Rules & How to Prepare',
      metaTitle: 'German Citizenship Test in English: Questions & Prep',
      metaDescription:
        'The German citizenship test is taken in German, but you can prepare in English: all 310 BAMF questions with translations and exam simulation.',
      excerpt: 'The exam itself is in German — but here\'s how to prepare in English, with translated questions and what the test actually covers.',
      intro: [
        'A common question from internationals applying for German citizenship: can I take the Einbürgerungstest in English? The exam itself is only offered in German — but you can absolutely prepare in English, and doing so makes the German questions far easier to memorize because you actually understand what they mean.',
        'The test asks 33 multiple-choice questions from a public catalog of 310, covering German politics, history, law and society. You need 17 correct answers to pass — and with translated preparation, pass rates are extremely high.',
      ],
      sections: [
        {
          heading: 'What the test covers',
          bullets: [
            'Democracy & constitution: basic rights, elections, separation of powers, the Grundgesetz.',
            'History: National Socialism, the Holocaust, divided Germany, reunification.',
            'Law & society: legal system, religious freedom, equality, everyday rules.',
            'Your federal state: 10 questions about your Bundesland\'s parliament, coat of arms and minister-president — 3 appear in your exam.',
          ],
        },
        {
          heading: 'How to prepare in English (while passing in German)',
          numbered: [
            'Read each question in German first, then check the English translation to understand the meaning — never memorize German strings blindly.',
            'Learn the recurring key terms (Grundgesetz, Bundestag, Wahlrecht, Meinungsfreiheit) — around 50 words unlock most of the catalog.',
            'Switch translations off in your final week and practice German-only, exactly like the real exam.',
            'Finish with timed simulations: 33 questions, 60 minutes, no help.',
          ],
        },
        {
          heading: 'Language requirements beyond the test',
          paragraphs: [
            'Note that the citizenship application also requires German language proficiency (usually B1) as a separate certificate — the Einbürgerungstest itself is a civics test, not a language test. The vocabulary in the questions is simpler than B1 reading texts, so most B1 learners find the test language very manageable.',
          ],
        },
      ],
      howToHeading: 'How to prepare in English with the app',
      howToSteps: [
        { title: 'Set English translations', text: 'Enable English in the app — every question and explanation is available in English alongside the official German.' },
        { title: 'Practice bilingually', text: 'Answer in German, verify your understanding in English. The app\'s explanations give the context behind each answer.' },
        { title: 'Drill your mistakes', text: 'Wrong answers are tracked automatically so you can repeat them until the German versions feel natural.' },
        { title: 'Simulate German-only', text: 'In your final week, run full 33-question simulations without translations — the exact conditions of the real test.' },
      ],
      faqs: [
        {
          question: 'Can I take the German citizenship test in English?',
          answer: 'No — the official exam is only in German. But the questions use simple, repetitive vocabulary, and preparing with English translations makes them easy to master.',
        },
        {
          question: 'How hard is the German citizenship test?',
          answer: 'With preparation, not hard: you need 17 of 33 correct from a public catalog of 310 questions. Prepared candidates pass at rates above 90%.',
        },
        {
          question: 'What languages does the app translate into?',
          answer: 'English, Russian, Turkish, Farsi, Polish, Romanian, Hindi, Arabic and Ukrainian — plus the official German originals.',
        },
      ],
      screenshotIndex: 5,
    },
    {
      slug: 'einbuergerungstest-bundesland-fragen',
      keyword: 'einbürgerungstest bundesland fragen',
      title: 'Einbürgerungstest Bundesland-Fragen: Was dein Land wissen will',
      metaTitle: 'Einbürgerungstest Bundesland-Fragen üben (alle 16 Länder)',
      metaDescription:
        'Drei der 33 Prüfungsfragen kommen aus deinem Bundesland: Landtag, Wappen, Ministerpräsident. So übst du die 10 Fragen für alle 16 Länder.',
      excerpt: 'Drei Prüfungsfragen kommen garantiert aus deinem Bundesland — welche Themen das sind und wie du sie gezielt übst.',
      intro: [
        'Von den 33 Fragen deiner Einbürgerungstest-Prüfung stammen genau 3 aus dem Katalog deines Bundeslandes — aus nur 10 möglichen Fragen. Das sind die einfachsten Punkte der ganzen Prüfung, wenn du sie vorher gesehen hast, und die überraschendsten, wenn nicht.',
        'Die Bundesland-Fragen folgen in allen 16 Ländern demselben Muster. Wer das Muster kennt, lernt die 10 Fragen in einer halben Stunde.',
      ],
      sections: [
        {
          heading: 'Das fragt jedes Bundesland ab',
          bullets: [
            'Das Landeswappen: Du bekommst Wappen zur Auswahl und musst deines erkennen.',
            'Das Landesparlament: Wie heißt es (Landtag, Bürgerschaft, Abgeordnetenhaus) und wo tagt es?',
            'Regierungschef:in: Wie lautet die Amtsbezeichnung (Ministerpräsident:in, Regierender Bürgermeister:in)?',
            'Farben, Nachbarländer und Besonderheiten deines Landes.',
          ],
        },
        {
          heading: 'Sonderfälle: Stadtstaaten',
          paragraphs: [
            'Berlin, Hamburg und Bremen weichen vom Muster ab: Das Parlament heißt Abgeordnetenhaus (Berlin) bzw. Bürgerschaft (Hamburg, Bremen), und die Regierungschefs heißen Regierender Bürgermeister (Berlin), Erster Bürgermeister (Hamburg) und Bürgermeister/Präsident des Senats (Bremen). Wer in einem Stadtstaat wohnt, sollte diese Begriffe besonders sicher können.',
          ],
        },
        {
          heading: 'Umzug vor der Prüfung?',
          paragraphs: [
            'Entscheidend ist das Bundesland, in dem du zur Prüfung angemeldet bist. Wenn du kurz vor der Prüfung umziehst, lerne die 10 Fragen des neuen Bundeslandes — die App stellt dir nach dem Wechsel sofort den richtigen Katalog zusammen.',
          ],
        },
      ],
      howToHeading: 'So übst du deine Bundesland-Fragen in der App',
      howToSteps: [
        { title: 'Bundesland einstellen', text: 'Wähle dein Bundesland in der App — der Katalog enthält automatisch deine 10 Landesfragen.' },
        { title: 'Landesfragen filtern', text: 'Übe die Bundesland-Fragen gezielt als eigenen Block, bis alle 10 sicher sitzen.' },
        { title: 'Mit Erklärungen lernen', text: 'Zu jeder Frage gibt es Erklärungen — so merkst du dir Wappen und Parlamentsnamen mit Kontext statt auswendig.' },
        { title: 'In der Simulation prüfen', text: 'In der Prüfungssimulation erscheinen 3 zufällige Landesfragen — genau wie im echten Test.' },
      ],
      faqs: [
        {
          question: 'Wie viele Bundesland-Fragen kommen in der Prüfung?',
          answer: 'Genau 3 von 33 Fragen stammen aus dem 10-Fragen-Katalog deines Bundeslandes.',
        },
        {
          question: 'Kann ich die Fragen anderer Bundesländer sehen?',
          answer: 'Ja, in der App kannst du das Bundesland jederzeit wechseln und alle 16 Kataloge üben.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'What is the Einbürgerungstest 2026 app?',
      answer:
        'It is a complete preparation app for the German Einbürgerungstest and Leben in Deutschland test: all 310 official BAMF questions with explanations, translations in 10 languages, error tracking and a realistic exam simulator — offline and ad-free.',
      learnMoreSlug: 'einbuergerungstest-310-fragen-ueben',
    },
    {
      question: 'How many questions are in the Einbürgerungstest?',
      answer:
        'The official catalog has 310 questions: 300 general questions plus 10 about your federal state. In the exam you answer 33 of them and need 17 correct to pass.',
      learnMoreSlug: 'einbuergerungstest-310-fragen-ueben',
    },
    {
      question: 'Does the app include the Leben in Deutschland test?',
      answer:
        'Yes — the LiD test uses the same official 310-question catalog. The app\'s exam simulation (33 questions, 60 minutes) matches both test formats exactly.',
      learnMoreSlug: 'leben-in-deutschland-test-simulation',
    },
    {
      question: 'Can I prepare for the German citizenship test in English?',
      answer:
        'The real exam is in German, but the app shows every question and explanation in English (plus Russian, Turkish, Arabic, Ukrainian and more), so you understand what you are memorizing.',
      learnMoreSlug: 'german-citizenship-test-english',
    },
    {
      question: 'Are the questions for my Bundesland included?',
      answer:
        'Yes — all 16 federal states are covered. Select your state and the app builds your exact 310-question catalog, including the 10 state questions.',
      learnMoreSlug: 'einbuergerungstest-bundesland-fragen',
    },
    {
      question: 'Does the app work offline?',
      answer:
        'Yes. After download, the complete question catalog, explanations and translations work without any internet connection — and there are no ads and no account requirement.',
    },
    {
      question: 'Is the question catalog up to date for 2026?',
      answer:
        'Yes, the app uses the current official BAMF catalog, including recent additions such as questions on Jewish life in Germany.',
    },
  ],
  ctaHeading: 'Pass Your Einbürgerungstest With Confidence',
  ctaText:
    'Download the app free, choose your Bundesland and start practicing all 310 official questions today — offline, ad-free, in your language.',
  ratingValue: '4.0',
  ratingCount: '1',
  category: 'EducationApplication',
  downloadNote: 'Free to download • Works offline • No account needed',
};
