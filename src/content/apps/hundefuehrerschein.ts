import { Dog, ClipboardList, Timer, Repeat, BookOpen, TrendingUp } from 'lucide-react';
import type { AppContent } from './types';

export const hundefuehrerschein: AppContent = {
  slug: 'hundefuehrerschein-app',
  appId: '6792896602',
  name: 'Hundeführerschein',
  storeName: 'Hundeführerschein: Prüfung',
  subtitle: 'Sachkundeprüfung sicher bestehen',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/hundeführerschein-prüfung/id6792896602',
  icon: '/apps/hundefuehrerschein/icon.webp',
  accent: '#84cc16',
  accentDark: '#4d7c0f',
  heroTitle: {
    pre: 'Den Hundeführerschein',
    highlight: 'beim ersten Versuch bestehen',
    post: '',
  },
  heroDescription:
    'Die komplette Vorbereitung auf die theoretische Sachkundeprüfung nach § 11 TierSchG: alle offiziellen Prüfungsfragen aus den fünf amtlichen Themenbereichen, echte Prüfungssimulation, Bildfragen zur Körpersprache und ein Fehlertraining, das gezielt deine Schwächen wiederholt.',
  heroBenefits: [
    '200 Übungsfragen aus allen fünf Prüfungsbereichen',
    'Prüfungssimulation: 35 Fragen, 45 Minuten, 80 % zum Bestehen',
    'Bildfragen zur Körpersprache von Hunden',
    'Intelligentes Fehlertraining wiederholt deine Schwächen',
    'Erklärung zu jeder Antwort — auch auf Englisch',
  ],
  metaTitle: 'Hundeführerschein App – Sachkundenachweis Prüfung üben',
  metaDescription:
    'Sachkundeprüfung nach § 11 TierSchG üben: alle offiziellen Fragen aus den fünf Themenbereichen, Prüfungssimulation mit 35 Fragen in 45 Minuten, Erklärungen und Fehlertraining.',
  metaKeywords:
    'hundeführerschein, sachkundenachweis hund, sachkundeprüfung hund, hundeführerschein fragen, § 11 tierschg, hundeführerschein üben, hundehalter prüfung, hundeführerschein app, theoretische sachkundeprüfung',
  screenshots: [
    { src: '/apps/hundefuehrerschein/screenshot-1.webp', alt: 'Hundeführerschein App – Startseite mit Prüfungsvorbereitung' },
    { src: '/apps/hundefuehrerschein/screenshot-2.webp', alt: 'Hundeführerschein – Übungsfragen aus dem offiziellen Fragenkatalog' },
    { src: '/apps/hundefuehrerschein/screenshot-3.webp', alt: 'Hundeführerschein – Bildfrage zur Körpersprache von Hunden' },
    { src: '/apps/hundefuehrerschein/screenshot-4.webp', alt: 'Hundeführerschein – Prüfungssimulation mit 35 Fragen in 45 Minuten' },
  ],
  audience: [
    {
      badge: 'Pflicht',
      title: 'Pflicht-Sachkundenachweis',
      description: 'In mehreren Bundesländern ist der Nachweis vorgeschrieben — je nach Land für alle Halter oder für bestimmte Hunde.',
      color: '#4d7c0f',
    },
    {
      badge: 'Freiwillig',
      title: 'Freiwilliger Hundeführerschein',
      description: 'Manche Kommunen senken die Hundesteuer, viele Vermieter und Versicherer sehen den Nachweis gern — und der Lerneffekt bleibt.',
      color: '#0284c7',
    },
    {
      badge: 'Vor dem Hund',
      title: 'Künftige Hundehalter',
      description: 'Wer den Fragenkatalog vor dem ersten eigenen Hund durchgeht, versteht Körpersprache, Erziehung und Recht, bevor es darauf ankommt.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: ClipboardList,
      title: '200 Übungsfragen',
      description:
        'Der komplette Fragenkatalog aus allen fünf Prüfungsbereichen, inklusive der offiziellen Beispielfragen — nichts Erfundenes, nichts Ausgedachtes.',
      color: '#4d7c0f',
    },
    {
      icon: BookOpen,
      title: 'Die fünf Themenbereiche',
      description:
        'Haltung und Tierschutz, Sozialverhalten und Rassen, Gefahrensituationen, Erziehung und Ausbildung sowie Recht und Vorschriften — einzeln übbar.',
      color: '#0284c7',
    },
    {
      icon: Timer,
      title: 'Echte Prüfungssimulation',
      description:
        '35 Fragen, 45 Minuten, bestanden ab 80 Prozent — genau wie in der echten Prüfung. So oft wiederholbar, wie du willst.',
      color: '#d97706',
    },
    {
      icon: Dog,
      title: 'Körpersprache verstehen',
      description:
        'Bildfragen trainieren den Blick für Mimik und Körperhaltung: Erkennst du, ob ein Hund entspannt, unsicher, ängstlich oder drohend ist?',
      color: '#7c3aed',
    },
    {
      icon: Repeat,
      title: 'Intelligentes Fehlertraining',
      description:
        'Die App merkt sich, was du noch nicht sicher beherrschst, und wiederholt genau diese Fragen — statt dich zum zehnten Mal durch die zu schicken, die längst sitzen.',
      color: '#be185d',
    },
    {
      icon: TrendingUp,
      title: 'Prüfungsbereitschaft im Blick',
      description:
        'Lernstreak, Fortschritt je Themenbereich und eine ehrliche Einschätzung, ob du bereit bist — nicht nur, wie viele Fragen du gesehen hast.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Themenbereich wählen', description: 'Von Haltung und Tierschutz bis Recht und Vorschriften.' },
    { title: 'Fragen üben', description: 'Mit Erklärung zu jeder Antwort — auch zu den richtigen.' },
    { title: 'Prüfung simulieren', description: '35 Fragen in 45 Minuten unter echten Bedingungen.' },
    { title: 'Schwächen wiederholen', description: 'Das Fehlertraining bringt genau die Fragen zurück, die noch wackeln.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Die App ist kostenlos ladbar, die erste Übung startest du gratis.',
  pricingPro: {
    name: 'Vollzugang',
    bullets: [
      'Alle 200 Prüfungsfragen',
      'Unbegrenzte Prüfungssimulationen',
      'Komplettes Fehlertraining',
      'Vollständige Fortschrittsauswertung',
    ],
    note: 'Optionaler In-App-Kauf',
  },
  guides: [
    {
      slug: 'sachkundepruefung-hund-ablauf',
      keyword: 'sachkundeprüfung hund ablauf',
      title: 'Sachkundeprüfung für Hundehalter: Ablauf, Inhalte, Kosten',
      metaTitle: 'Sachkundeprüfung Hund: Ablauf, Themen und Kosten im Überblick',
      metaDescription:
        'Wie die theoretische Sachkundeprüfung abläuft, welche fünf Themenbereiche geprüft werden, wie viele Fragen kommen, was sie kostet und wie du dich sinnvoll vorbereitest.',
      excerpt: 'Ablauf, die fünf Themenbereiche, Kosten und ein realistischer Lernplan für vier Wochen.',
      intro: [
        'Die theoretische Sachkundeprüfung — umgangssprachlich Hundeführerschein — weist nach, dass du die Grundlagen von Haltung, Verhalten und Recht rund um den Hund beherrschst. Grundlage ist § 11 TierSchG in Verbindung mit den Regelungen deines Bundeslandes.',
        'Der Ablauf ist überall ähnlich, die Details unterscheiden sich je nach Land und Prüfstelle.',
      ],
      sections: [
        {
          heading: 'Die fünf Themenbereiche',
          bullets: [
            'Haltung und Tierschutz: Bedürfnisse, Ernährung, Gesundheit, artgerechte Unterbringung.',
            'Sozialverhalten und Rassen: Kommunikation, Sozialisierung, Rassemerkmale und ihre Bedeutung.',
            'Gefahrensituationen: Konflikte erkennen, Beißvorfälle vermeiden, richtig reagieren.',
            'Erziehung und Ausbildung: Lernverhalten, Grundsignale, Umgang mit Problemverhalten.',
            'Recht und Vorschriften: Leinen- und Maulkorbpflicht, Haftung, Steuer, landesrechtliche Regelungen.',
          ],
        },
        {
          heading: 'Der Ablauf',
          numbered: [
            'Anmeldung bei einer anerkannten Prüfstelle, häufig Tierärztekammer, Veterinäramt oder ein zugelassener Verein.',
            'Theoretische Prüfung als Multiple-Choice-Test, typischerweise etwa 35 Fragen in 45 Minuten.',
            'Bestehensgrenze in der Regel bei rund 80 Prozent richtiger Antworten.',
            'Bescheinigung nach bestandener Prüfung — je nach Bundesland zeitlich unbegrenzt gültig.',
            'In manchen Ländern folgt ein praktischer Teil mit dem eigenen Hund.',
          ],
        },
        {
          heading: 'Kosten und Vorbereitung',
          paragraphs: [
            'Die Gebühren liegen je nach Stelle und Bundesland meist im zweistelligen bis niedrigen dreistelligen Bereich; der praktische Teil wird gesondert berechnet. Die genauen Sätze nennt deine Prüfstelle.',
            'Für die Vorbereitung reichen bei den meisten Kandidaten drei bis vier Wochen mit täglich fünfzehn bis zwanzig Minuten. Entscheidend ist nicht die Gesamtzeit, sondern regelmäßiges Wiederholen — und dass du die Begründungen liest, nicht nur die richtigen Antworten anklickst.',
          ],
        },
      ],
      howToHeading: 'Vorbereitung mit der App',
      howToSteps: [
        { title: 'Themenbereiche einzeln durchgehen', text: 'Erst Bereich für Bereich lernen, statt gleich alles gemischt.' },
        { title: 'Erklärungen mitlesen', text: 'Zu jeder Frage gibt es die Begründung — dort steckt das eigentliche Wissen.' },
        { title: 'Simulation ab Woche zwei', text: '35 Fragen in 45 Minuten zeigen früh, wo du wirklich stehst.' },
        { title: 'Letzte Woche nur wiederholen', text: 'Fehlertraining statt neuer Themen — das bringt kurz vor der Prüfung am meisten.' },
      ],
      faqs: [
        {
          question: 'Wie viele Fragen kommen in der Prüfung?',
          answer: 'Üblich sind etwa 35 Fragen in 45 Minuten mit einer Bestehensgrenze um 80 Prozent. Die genaue Ausgestaltung legt deine Prüfstelle fest.',
        },
        {
          question: 'Ist die Bescheinigung bundesweit gültig?',
          answer: 'Das hängt vom Bundesland ab. Anerkennung über Landesgrenzen hinweg ist nicht garantiert — frag im Zweifel bei deinem Veterinäramt nach.',
        },
      ],
      screenshotIndex: 3,
    },
    {
      slug: 'hundefuehrerschein-bundeslaender',
      keyword: 'hundeführerschein pflicht bundesland',
      title: 'Hundeführerschein: Wo er Pflicht ist und was er bringt',
      metaTitle: 'Hundeführerschein Pflicht: Regelungen nach Bundesland',
      metaDescription:
        'In welchen Bundesländern ein Sachkundenachweis vorgeschrieben ist, für welche Hunde er gilt, welche Vorteile der freiwillige Hundeführerschein bringt und was bei einem Umzug gilt.',
      excerpt: 'Wo der Nachweis Pflicht ist, für welche Hunde er gilt und was der freiwillige Schein bringt.',
      intro: [
        'Hunderecht ist in Deutschland Ländersache, und entsprechend unübersichtlich ist die Lage: Niedersachsen verlangt einen Sachkundenachweis grundsätzlich von allen Haltern, andere Länder knüpfen ihn an bestimmte Rassen, an die Größe oder an einen Vorfall, wieder andere kennen gar keine allgemeine Pflicht.',
        'Verbindlich ist immer das Landeshundegesetz und die Satzung deiner Gemeinde — beides ändert sich häufiger, als man denkt.',
      ],
      sections: [
        {
          heading: 'Welche Modelle es gibt',
          bullets: [
            'Allgemeine Pflicht für alle Halter, unabhängig von der Rasse.',
            'Pflicht für gelistete Hunde, oft „gefährliche Rassen" nach Landesliste.',
            'Pflicht ab einer Größe oder einem Gewicht, teilweise mit zusätzlichen Auflagen.',
            'Pflicht nach einem Vorfall, angeordnet durch die Behörde.',
            'Keine allgemeine Pflicht, aber freiwillige Prüfung mit Vorteilen.',
          ],
        },
        {
          heading: 'Was der freiwillige Nachweis bringt',
          numbered: [
            'Ermäßigte Hundesteuer in vielen Kommunen — oft der schnellste finanzielle Effekt.',
            'Bessere Position bei Vermietern und in Wohnungseigentümergemeinschaften.',
            'Argument gegenüber Versicherern und teils günstigere Haftpflichttarife.',
            'Befreiung von Auflagen wie Leinenpflicht in manchen Gemeinden.',
            'Und der eigentliche Punkt: Du verstehst deinen Hund besser, was Konflikte gar nicht erst entstehen lässt.',
          ],
        },
        {
          heading: 'Bei Umzug',
          paragraphs: [
            'Ein Umzug in ein anderes Bundesland kann bedeuten, dass dein Nachweis dort nicht anerkannt wird oder umgekehrt plötzlich einer nötig ist. Ebenso können Listenhund-Regelungen abweichen: Ein Hund, der in einem Land unauffällig gehalten wird, kann in einem anderen unter zusätzliche Auflagen fallen.',
            'Der zuverlässigste Weg ist eine kurze Anfrage beim Ordnungsamt der neuen Gemeinde vor dem Umzug — nicht danach.',
          ],
        },
      ],
      howToHeading: 'Vorbereiten, unabhängig vom Bundesland',
      howToSteps: [
        { title: 'Regelung deines Landes prüfen', text: 'Landeshundegesetz und Gemeindesatzung sagen, was für dich gilt.' },
        { title: 'Fragenkatalog durcharbeiten', text: 'Die Inhalte der fünf Themenbereiche sind länderübergreifend weitgehend gleich.' },
        { title: 'Prüfung simulieren', text: 'Unter Zeitdruck üben, damit die echte Prüfung keine Überraschung ist.' },
        { title: 'Bescheinigung aufbewahren', text: 'Sie wird bei Steuerermäßigung, Vermietern und Versicherern verlangt.' },
      ],
      faqs: [
        {
          question: 'Brauche ich den Hundeführerschein in meinem Bundesland?',
          answer: 'Das hängt vom Landeshundegesetz und teilweise von deiner Gemeinde ab. Die verbindliche Auskunft gibt das zuständige Ordnungs- oder Veterinäramt.',
        },
        {
          question: 'Lohnt sich die Prüfung, wenn sie freiwillig ist?',
          answer: 'Häufig ja — durch ermäßigte Hundesteuer, bessere Chancen bei Vermietern und Versicherern und die Auflagen, von denen manche Gemeinden befreien.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'koerpersprache-hund-erkennen',
      keyword: 'körpersprache hund erkennen',
      title: 'Körpersprache von Hunden lesen: die Signale, die zählen',
      metaTitle: 'Körpersprache bei Hunden erkennen: Beschwichtigung bis Drohung',
      metaDescription:
        'Rute, Ohren, Maul, Blick, Körperhaltung: die wichtigsten Signale der Hundekörpersprache, die häufigsten Fehldeutungen und warum Beschwichtigungssignale so oft übersehen werden.',
      excerpt: 'Beschwichtigungssignale, Drohsignale und die Fehldeutungen, die zu Beißvorfällen führen.',
      intro: [
        'Bildfragen zur Körpersprache gehören zu den Aufgaben, an denen in der Sachkundeprüfung am meisten gerätselt wird — und sie sind gleichzeitig der Teil mit dem größten Nutzen im Alltag. Fast jeder Beißvorfall hat eine Vorgeschichte aus Signalen, die niemand gelesen hat.',
        'Hunde kommunizieren dabei nie über ein einzelnes Merkmal, sondern über das Gesamtbild aus Rute, Ohren, Maul, Blick, Körperspannung und Kontext.',
      ],
      sections: [
        {
          heading: 'Die wichtigsten Signalgruppen',
          bullets: [
            'Entspannt: lockerer Körper, weiches Auge, leicht geöffnetes Maul, Rute in neutraler Höhe und locker bewegt.',
            'Unsicher oder beschwichtigend: Blick abwenden, Lecken über die Nase, Gähnen, Pfote heben, Bogen laufen, sich klein machen.',
            'Ängstlich: geduckte Haltung, Rute eingezogen, Ohren nach hinten, Rückzug, gegebenenfalls Zittern.',
            'Drohend: steifer Körper, Gewicht nach vorn, fixierender Blick, hoch getragene, steife Rute, gerunzelte Nase, Zähne zeigen.',
            'Überdreht statt freundlich: hektisches Hin und Her, hohe Körperspannung — häufig verwechselt mit Spielfreude.',
          ],
        },
        {
          heading: 'Häufige Fehldeutungen',
          numbered: [
            'Wedelnde Rute heißt freundlich: falsch. Entscheidend sind Höhe, Steifheit und Frequenz.',
            'Gähnen heißt müde: oft ein Beschwichtigungssignal in Stresssituationen.',
            'Der Hund „grinst": angehobene Lefzen mit gerunzelter Nase sind eine Drohung, kein Lächeln.',
            'Bauch zeigen heißt Streicheln wollen: kann auch ein Unterwerfungssignal sein — bei angespanntem Körper besser nicht anfassen.',
            '„Er hat ohne Vorwarnung gebissen": in aller Regel gab es Warnungen, sie wurden nur nicht erkannt oder wegtrainiert.',
          ],
        },
        {
          heading: 'Warum Beschwichtigung wichtiger ist als Drohung',
          paragraphs: [
            'Beschwichtigungssignale kommen früh und sind leise: Blick abwenden, über die Nase lecken, sich wegdrehen. Sie sagen sinngemäß „mir ist das zu viel" — und wer sie beachtet, kommt gar nicht erst zur Drohung.',
            'Wer sie dagegen ignoriert, bringt dem Hund bei, dass sie nichts bewirken. Genau dann werden Hunde still: Die leisen Signale fallen weg, und was bleibt, ist der Schnapper, der von außen wie „aus dem Nichts" aussieht.',
          ],
        },
      ],
      howToHeading: 'Körpersprache mit Bildfragen trainieren',
      howToSteps: [
        { title: 'Bildfragen üben', text: 'Fotos statt Textbeschreibungen — genau das Format, das in der Prüfung vorkommt.' },
        { title: 'Erklärung lesen', text: 'Zu jedem Bild wird erklärt, welche Merkmale die Deutung tragen.' },
        { title: 'Im Alltag anwenden', text: 'Beim nächsten Spaziergang bewusst auf Rute, Ohren und Körperspannung achten.' },
        { title: 'Unsicherheiten wiederholen', text: 'Das Fehlertraining bringt die Bilder zurück, bei denen du danebenlagst.' },
      ],
      faqs: [
        {
          question: 'Kommen Bildfragen in der Prüfung wirklich vor?',
          answer: 'Ja, das Erkennen von Mimik und Körperhaltung gehört zum Bereich Sozialverhalten und Gefahrensituationen und wird häufig mit Bildern geprüft.',
        },
        {
          question: 'Wie erkenne ich, dass ein Hund gleich zuschnappt?',
          answer: 'Auf die Reihenfolge achten: erst leise Beschwichtigung, dann Erstarren, fixierender Blick und Körperspannung nach vorn. Spätestens beim Erstarren gilt: Abstand vergrößern, nichts erzwingen.',
        },
      ],
      screenshotIndex: 2,
    },
  ],
  faqs: [
    {
      question: 'Was ist der Hundeführerschein?',
      answer:
        'Der umgangssprachliche Name für den Sachkundenachweis nach § 11 TierSchG: eine theoretische Prüfung zu Haltung, Verhalten, Gefahrensituationen, Erziehung und Recht, in manchen Bundesländern mit praktischem Teil.',
      learnMoreSlug: 'sachkundepruefung-hund-ablauf',
    },
    {
      question: 'Ist der Nachweis in meinem Bundesland Pflicht?',
      answer:
        'Das regelt jedes Bundesland selbst — mal für alle Halter, mal nur für bestimmte Hunde. Verbindlich ist die Auskunft deines Ordnungs- oder Veterinäramts.',
      learnMoreSlug: 'hundefuehrerschein-bundeslaender',
    },
    {
      question: 'Wie läuft die Prüfungssimulation ab?',
      answer:
        '35 Fragen in 45 Minuten mit einer Bestehensgrenze von 80 Prozent — genau wie in der echten Prüfung, beliebig oft wiederholbar.',
      learnMoreSlug: 'sachkundepruefung-hund-ablauf',
    },
    {
      question: 'Gibt es Fragen zur Körpersprache?',
      answer: 'Ja. Bildfragen trainieren, ob du an Mimik und Körperhaltung erkennst, wie ein Hund gerade gestimmt ist.',
      learnMoreSlug: 'koerpersprache-hund-erkennen',
    },
    {
      question: 'Gibt es die Fragen auch auf Englisch?',
      answer: 'Ja — jede Frage, Antwort und Erklärung ist auch auf Englisch verfügbar.',
    },
    {
      question: 'Ist die App kostenlos?',
      answer:
        'Die App ist kostenlos ladbar und die erste Übung gratis. Der Vollzugang schaltet alle Fragen, unbegrenzte Simulationen und das komplette Fehlertraining frei.',
    },
  ],
  ctaHeading: 'Vorbereitet in die Sachkundeprüfung',
  ctaText: 'App kostenlos laden, erste Übung gratis starten und mit der Prüfungssimulation testen, wo du stehst.',
  category: 'EducationalApplication',
  downloadNote: 'Kostenlos laden • Optionale In-App-Käufe',
};
