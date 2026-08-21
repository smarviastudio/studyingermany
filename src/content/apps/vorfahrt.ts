import { Car, Gauge, BookOpen, ClipboardList, Snowflake, TrendingUp } from 'lucide-react';
import type { AppContent } from './types';

export const vorfahrt: AppContent = {
  slug: 'vorfahrt-ueben-app',
  appId: '6794609450',
  name: 'Vorfahrt üben 3D',
  storeName: 'Fahrschule 3D: Vorfahrt üben',
  subtitle: 'Kreuzungen aus der Fahrerperspektive',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/fahrschule-3d-vorfahrt-üben/id6794609450',
  icon: '/apps/vorfahrt/icon.webp',
  accent: '#14b8a6',
  accentDark: '#0f766e',
  heroTitle: {
    pre: 'Wer darf zuerst fahren? Üben an',
    highlight: 'echten Kreuzungen in 3D',
    post: '',
  },
  heroDescription:
    'Statt abstrakter Skizzen sitzt du mitten in der Kreuzung: Autos, Schilder, Ampeln und Fußgänger aus der Fahrerperspektive. Du entscheidest, wer zuerst fährt — danach fahren alle in der richtigen Reihenfolge los und du siehst sofort, ob du richtig lagst.',
  heroBenefits: [
    '52 Vorfahrtsituationen aus der Theorieprüfung',
    'Echte 3D-Kreuzungen statt Karteikarten',
    'StVO-Regel und Begründung zu jeder Situation',
    'Fahrsimulator mit Gas und Bremse, 23 Level',
    'Komplett auf Deutsch und Englisch',
  ],
  metaTitle: 'Vorfahrt üben in 3D – Kreuzungen für die Theorieprüfung',
  metaDescription:
    'Rechts vor links, Stoppschild, abknickende Vorfahrt: Übe an echten 3D-Kreuzungen aus der Fahrerperspektive — mit StVO-Erklärung und Prüfungsmodus.',
  metaKeywords:
    'vorfahrt üben, rechts vor links, theorieprüfung üben, führerschein app, vorfahrtsregeln lernen, kreuzung vorfahrt, stvo lernen, fahrschule app, vorfahrt achten schild',
  screenshots: [
    { src: '/apps/vorfahrt/screenshot-1.webp', alt: 'Vorfahrt üben 3D – Kreuzung aus der Fahrerperspektive auf dem iPhone' },
    { src: '/apps/vorfahrt/screenshot-2.webp', alt: 'Fahrschule 3D – selbst durch die Kreuzung fahren mit Gas und Bremse' },
    { src: '/apps/vorfahrt/screenshot-3.webp', alt: 'Vorfahrt üben – StVO-Regel und Begründung zur Situation' },
    { src: '/apps/vorfahrt/screenshot-4.webp', alt: 'Fahrschule 3D – Prüfungsmodus mit Anweisungen wie vom Prüfer' },
    { src: '/apps/vorfahrt/screenshot-5.webp', alt: 'Vorfahrt üben – Kreuzung bei Schnee, Nebel und Regen' },
    { src: '/apps/vorfahrt/screenshot-6.webp', alt: 'Fahrschule 3D – Notfallsituation mit Warndreieck und Unfallstelle' },
  ],
  audience: [
    {
      badge: 'Theoriephase',
      title: 'Fahrschüler',
      description: 'Vorfahrt ist der Themenblock, an dem die meisten in der Theorieprüfung scheitern — und der sich mit Karteikarten am schlechtesten lernen lässt.',
      color: '#0f766e',
    },
    {
      badge: 'Wiederholer',
      title: 'Nach dem ersten Versuch',
      description: 'Wer durchgefallen ist, kennt die Fragen meistens auswendig, aber nicht die Situation. In 3D sieht die Kreuzung endlich aus wie eine Kreuzung.',
      color: '#0284c7',
    },
    {
      badge: 'Auffrischen',
      title: 'Alle mit Führerschein',
      description: 'Abknickende Vorfahrt, Blaulicht, Zebrastreifen: Regeln, die man nach zehn Jahren Fahrpraxis erstaunlich unsicher beantwortet.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: Car,
      title: 'Echte Kreuzungen in 3D',
      description:
        'Keine abstrakten Draufsichten. Du sitzt an der Kreuzung und triffst die Entscheidung aus derselben Perspektive wie später im Auto.',
      color: '#0f766e',
    },
    {
      icon: ClipboardList,
      title: '52 Prüfungssituationen',
      description:
        'Rechts vor links, Vorfahrtsstraße, Vorfahrt gewähren, Stoppschild, Ampeln, abknickende Vorfahrt, Zebrastreifen und Blaulicht — jede Situation dauert unter einer Minute.',
      color: '#0284c7',
    },
    {
      icon: BookOpen,
      title: 'StVO-Regel mit Begründung',
      description:
        'Zu jeder Situation die passende Regel — etwa § 8 rechts vor links — und die Erklärung dazu. So lernst du das Warum und nicht nur die richtige Antwort.',
      color: '#7c3aed',
    },
    {
      icon: Gauge,
      title: 'Fahrsimulator mit Gas & Bremse',
      description:
        '23 Level, in denen du selbst durch die Kreuzung fährst. Fehler landen im Fahrtenbuch, damit du genau die Situationen nachüben kannst, die schiefgingen.',
      color: '#d97706',
    },
    {
      icon: Snowflake,
      title: 'Wetter und Notfälle',
      description:
        'Schnee, Nebel, Regen, Unfallstelle, Warndreieck: Trainiere, wie du bei Glätte und schlechter Sicht reagierst — Situationen, die in der Prüfung gern vorkommen.',
      color: '#0369a1',
    },
    {
      icon: TrendingUp,
      title: 'Fortschritt im Blick',
      description:
        'Jede gemeisterte Situation wird gespeichert. Auf einen Blick siehst du, welche Themen sitzen und wo du noch üben solltest.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Situation ansehen', description: 'Du stehst an der Kreuzung und siehst Schilder, Ampeln und die anderen Fahrzeuge.' },
    { title: 'Reihenfolge festlegen', description: 'Entscheide, wer zuerst fahren darf — in Sekunden, wie im echten Verkehr.' },
    { title: 'Auflösung sehen', description: 'Alle fahren in der richtigen Reihenfolge los, dazu kommt die StVO-Regel.' },
    { title: 'Selbst fahren', description: 'Im Simulator steuerst du mit Gas und Bremse durch die Kreuzung.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Die ersten Situationen sind gratis — du kannst die App vollständig ausprobieren, bevor du etwas kaufst.',
  pricingPro: {
    name: 'Vollversion',
    bullets: [
      'Alle 52 Vorfahrtsituationen',
      'Alle 23 Simulator-Level',
      'Praktische Prüfung und Notfallszenarien',
      'Vollständiger Fortschritt',
    ],
    note: 'Optionaler In-App-Kauf',
  },
  guides: [
    {
      slug: 'rechts-vor-links-einfach-erklaert',
      keyword: 'rechts vor links regel',
      title: 'Rechts vor links: die Regel, die häufiger gilt als gedacht',
      metaTitle: 'Rechts vor links erklärt – Beispiele und Ausnahmen',
      metaDescription:
        'Wann gilt rechts vor links, wann nicht? Die Grundregel nach § 8 StVO, die wichtigsten Ausnahmen, verkehrsberuhigte Bereiche und Parkplätze.',
      excerpt: 'Wann rechts vor links gilt, wann nicht — inklusive Parkplatz, Verkehrsberuhigung und Pattsituation.',
      intro: [
        'Rechts vor links ist die Grundregel des deutschen Straßenverkehrs: Sie gilt immer dann, wenn nichts anderes geregelt ist — kein Schild, keine Ampel, keine Polizei.',
        'Genau dieses „wenn nichts anderes geregelt ist" ist die Stelle, an der es in der Prüfung schiefgeht. Die Regel selbst kann jeder aufsagen; die Frage ist, ob sie im konkreten Bild überhaupt greift.',
      ],
      sections: [
        {
          heading: 'Wann rechts vor links gilt',
          bullets: [
            'An Kreuzungen und Einmündungen ohne Vorfahrtschilder und ohne Ampel.',
            'In Wohngebieten und Tempo-30-Zonen, wo Schilder bewusst weggelassen wurden.',
            'Auch dann, wenn die von rechts kommende Straße schmaler oder schlechter ausgebaut ist — die Breite spielt keine Rolle.',
          ],
        },
        {
          heading: 'Wann sie nicht gilt',
          numbered: [
            'Bei Vorfahrtschildern: Vorfahrtsstraße, „Vorfahrt gewähren" oder Stoppschild gehen immer vor.',
            'An Ampeln, solange sie in Betrieb sind. Blinkt nur Gelb, gilt wieder die Beschilderung oder rechts vor links.',
            'Beim Abbiegen aus einem Grundstück, einem Feldweg oder einer verkehrsberuhigten Zone: Wer von dort kommt, muss sich einordnen und hat keine Vorfahrt.',
            'Auf Parkplätzen: Fahrgassen sind meist keine Straßen im Sinne der StVO. Dort gilt gegenseitige Rücksichtnahme, nicht automatisch rechts vor links.',
            'Gegenüber Schienenfahrzeugen und Einsatzfahrzeugen mit Blaulicht und Martinshorn.',
          ],
        },
        {
          heading: 'Die Pattsituation',
          paragraphs: [
            'Wenn an einer Kreuzung ohne Schilder drei oder vier Fahrzeuge aus verschiedenen Richtungen kommen, kann rechts vor links zirkulär werden: Jeder hat jemanden rechts von sich.',
            'Aufgelöst wird das nicht durch eine zusätzliche Regel, sondern durch Verständigung — jemand verzichtet erkennbar auf die Vorfahrt, und danach gilt die normale Reihenfolge. In der Prüfung ist die richtige Antwort meistens genau diese Verständigung.',
          ],
        },
      ],
      howToHeading: 'Rechts vor links trainieren in 3D',
      howToSteps: [
        { title: 'Situationen ohne Schilder üben', text: 'Die App zeigt Kreuzungen, an denen bewusst kein Schild steht — genau dort greift die Grundregel.' },
        { title: 'Erst entscheiden, dann sehen', text: 'Du legst die Reihenfolge fest, danach fahren die Fahrzeuge sie ab.' },
        { title: 'Begründung lesen', text: 'Zu jeder Auflösung gehört die StVO-Regel, damit die Entscheidung nachvollziehbar wird.' },
        { title: 'Ausnahmen dazunehmen', text: 'Danach dieselbe Kreuzung mit Schild oder Ampel — der Unterschied ist der eigentliche Lerninhalt.' },
      ],
      faqs: [
        {
          question: 'Gilt rechts vor links auf Parkplätzen?',
          answer: 'In der Regel nicht. Fahrgassen auf Parkplätzen sind meist keine Straßen im Sinne der StVO; dort gilt gegenseitige Rücksichtnahme. Anders sieht es aus, wenn die Gassen eindeutig Straßencharakter haben.',
        },
        {
          question: 'Was gilt bei einer blinkenden gelben Ampel?',
          answer: 'Die Ampel regelt dann nicht mehr. Es gilt die Beschilderung, und wenn keine vorhanden ist, rechts vor links.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'vorfahrtsschilder-uebersicht',
      keyword: 'vorfahrtsschilder bedeutung',
      title: 'Vorfahrtsschilder: Bedeutung und Reihenfolge auf einen Blick',
      metaTitle: 'Vorfahrtsschilder: Bedeutung, Rangfolge & Fallen',
      metaDescription:
        'Vorfahrtsstraße, Vorfahrt gewähren, Stoppschild: was jedes Schild bedeutet, in welcher Rangfolge Regelungen gelten und welche Fallen es gibt.',
      excerpt: 'Was jedes Schild bedeutet, in welcher Rangfolge Regelungen gelten und wo die Prüfungsfallen liegen.',
      intro: [
        'Vorfahrt wird in Deutschland in einer festen Rangfolge geregelt: Polizeibeamte vor Ampeln, Ampeln vor Schildern, Schilder vor rechts vor links. Wer diese Reihenfolge im Kopf hat, kann fast jede Prüfungsfrage systematisch lösen.',
        'Der zweite Teil ist die Bedeutung der einzelnen Schilder — insbesondere der Unterschied zwischen „Vorfahrt gewähren" und Stoppschild, der öfter falsch beantwortet wird als jeder andere.',
      ],
      sections: [
        {
          heading: 'Die wichtigsten Schilder',
          bullets: [
            'Vorfahrtsstraße (gelbe Raute): Du hast Vorfahrt, bis das Schild aufgehoben wird.',
            'Vorfahrt gewähren (auf der Spitze stehendes Dreieck): Du musst andere durchlassen, darfst aber rollen, wenn frei ist.',
            'Stoppschild: Du musst anhalten — vollständiger Stillstand, auch wenn die Kreuzung leer ist.',
            'Kreuzung mit Vorfahrt von rechts (Kreuz-Schild): Erinnerung, dass hier die Grundregel gilt.',
            'Abknickende Vorfahrtstraße: Die Vorfahrt folgt dem dick gezeichneten Verlauf, nicht der Geradeausrichtung — und wer ihr folgt, muss blinken.',
          ],
        },
        {
          heading: 'Die Rangfolge',
          numbered: [
            'Anweisungen von Polizeibeamten gehen allem vor.',
            'Lichtzeichen (Ampel) gehen vor Verkehrszeichen.',
            'Verkehrszeichen gehen vor der allgemeinen Regel.',
            'Rechts vor links gilt, wenn nichts davon vorhanden ist.',
          ],
        },
        {
          heading: 'Klassische Prüfungsfallen',
          bullets: [
            '„Vorfahrt gewähren" mit Zusatzschild zum Verlauf der Vorfahrtsstraße: Die Vorfahrt knickt ab, und plötzlich kommt der Vorfahrtberechtigte von links.',
            'Stoppschild bei völlig freier Sicht: trotzdem anhalten, sonst ist es ein Fehler.',
            'Blaulicht mit Martinshorn: geht allen Regelungen vor, auch der grünen Ampel.',
            'Straßenbahnen: haben in vielen Situationen Vorrang, auch aus Richtungen, in denen man ihn nicht erwartet.',
            'Fußgänger am Zebrastreifen: Vorrang unabhängig von der Vorfahrtregelung der Kreuzung.',
          ],
        },
      ],
      howToHeading: 'Schilder in der Situation üben',
      howToSteps: [
        { title: 'Schild in der 3D-Ansicht sehen', text: 'Nicht als Symbol auf einer Karte, sondern dort, wo es im Verkehr tatsächlich steht.' },
        { title: 'Entscheidung treffen', text: 'Reihenfolge festlegen, so wie du es an der echten Kreuzung tun müsstest.' },
        { title: 'Rangfolge nachvollziehen', text: 'Die Erklärung zeigt, welche Regelung greift und warum die anderen zurücktreten.' },
        { title: 'Sonderfälle üben', text: 'Abknickende Vorfahrt, Blaulicht und Zebrastreifen gezielt wiederholen.' },
      ],
      faqs: [
        {
          question: 'Was ist der Unterschied zwischen „Vorfahrt gewähren" und Stopp?',
          answer: 'Bei „Vorfahrt gewähren" musst du nur anhalten, wenn Verkehr kommt. Beim Stoppschild musst du immer vollständig anhalten, auch bei völlig freier Kreuzung.',
        },
        {
          question: 'Wer hat Vorfahrt bei abknickender Vorfahrtstraße?',
          answer: 'Die Vorfahrt folgt dem dick gezeichneten Verlauf auf dem Zusatzschild. Wer ihr folgt, muss blinken, auch wenn er auf der Vorfahrtsstraße bleibt.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'theoriepruefung-vorfahrt-bestehen',
      keyword: 'theorieprüfung vorfahrt fragen',
      title: 'Theorieprüfung: warum Vorfahrtfragen so oft schiefgehen',
      metaTitle: 'Theorieprüfung Vorfahrt: Fehlerquellen und Lernstrategie',
      metaDescription:
        'Vorfahrtfragen sind die häufigste Fehlerquelle in der Theorieprüfung. Warum Auswendiglernen scheitert und wie du Situationen systematisch löst.',
      excerpt: 'Warum Auswendiglernen bei Vorfahrtfragen scheitert — und ein Vier-Schritte-Schema für jede Situation.',
      intro: [
        'Vorfahrtfragen sind in der Theorieprüfung überdurchschnittlich häufig für Fehlerpunkte verantwortlich, und das hat einen strukturellen Grund: Man kann sie nicht auswendig lernen. Es gibt nicht die eine richtige Antwort, sondern eine Kombination aus Schildern, Fahrzeugpositionen und Fahrtrichtungen, die sich jedes Mal ändert.',
        'Wer stattdessen ein festes Prüfschema anwendet, wird zuverlässig — unabhängig davon, welche Variante in der Prüfung erscheint.',
      ],
      sections: [
        {
          heading: 'Warum Auswendiglernen scheitert',
          bullets: [
            'Die Fragen sehen ähnlich aus, unterscheiden sich aber in einem Detail — einem Blinker, einem Zusatzschild.',
            'Auf Karteikarten fehlt die Perspektive: Von oben sieht eine Kreuzung völlig anders aus als aus dem Auto.',
            'Wer die Antwort kennt, aber nicht das Warum, überträgt sie nicht auf die nächste Variante.',
            'Im echten Verkehr gibt es keine Antwortmöglichkeiten, sondern nur die Situation.',
          ],
        },
        {
          heading: 'Das Vier-Schritte-Schema',
          numbered: [
            'Gibt es eine übergeordnete Regelung? Polizei, Ampel, Schild — in dieser Reihenfolge prüfen.',
            'Wer muss abbiegen und wohin? Abbieger warten auf Geradeausfahrer und auf den Gegenverkehr.',
            'Gibt es Sonderfälle? Schienenfahrzeug, Blaulicht, Fußgänger am Zebrastreifen.',
            'Erst danach rechts vor links anwenden — auf die verbleibenden Fahrzeuge.',
          ],
        },
        {
          heading: 'Sinnvoll üben',
          numbered: [
            'Täglich zehn Minuten statt einmal zwei Stunden am Wochenende.',
            'Nach jeder falschen Antwort die Begründung lesen, nicht nur die Lösung ansehen.',
            'Falsche Situationen markieren und nach ein paar Tagen wiederholen.',
            'Die Situation laut erklären: Wer begründen kann, warum er zuerst fährt, hat es verstanden.',
            'In der letzten Woche vor der Prüfung nur noch wiederholen, nichts Neues anfangen.',
          ],
        },
      ],
      howToHeading: 'Vorbereiten mit Vorfahrt üben 3D',
      howToSteps: [
        { title: 'Situationen der Reihe nach durchgehen', text: '52 Prüfungssituationen, jede unter einer Minute — passt in jede Pause.' },
        { title: 'Fehler im Fahrtenbuch nachüben', text: 'Falsche Entscheidungen werden gesammelt, damit du genau die wiederholen kannst.' },
        { title: 'Praktische Prüfung testen', text: 'Sechs Anweisungen wie vom Prüfer — Übung für den Ablauf, bevor du im Auto sitzt.' },
        { title: 'Fortschritt kontrollieren', text: 'Die Übersicht zeigt, welche Themen sitzen und wo noch Lücken sind.' },
      ],
      faqs: [
        {
          question: 'Wie viele Fehlerpunkte darf man in der Theorieprüfung haben?',
          answer: 'Beim Ersterwerb der Klasse B sind bis zu 10 Fehlerpunkte erlaubt, allerdings nicht zwei Fragen mit je 5 Punkten. Vorfahrtfragen gehören häufig zu den höher gewichteten.',
        },
        {
          question: 'Gibt es die App auch auf Englisch?',
          answer: 'Ja, sie ist vollständig auf Deutsch und Englisch verfügbar — praktisch, wenn Deutsch nicht deine Muttersprache ist und du trotzdem den deutschen Führerschein machst.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'Was macht diese App?',
      answer:
        'Sie trainiert Vorfahrtsituationen an echten 3D-Kreuzungen aus der Fahrerperspektive: Du entscheidest, wer zuerst fährt, siehst die Auflösung als Animation und bekommst die passende StVO-Regel dazu.',
      learnMoreSlug: 'theoriepruefung-vorfahrt-bestehen',
    },
    {
      question: 'Wie viele Situationen gibt es?',
      answer:
        '52 Situationen aus der Theorieprüfung — rechts vor links, Vorfahrtsstraße, Stoppschild, Ampeln, abknickende Vorfahrt, Zebrastreifen und Blaulicht — plus 23 Level im Fahrsimulator.',
      learnMoreSlug: 'vorfahrtsschilder-uebersicht',
    },
    {
      question: 'Bekomme ich zu jeder Situation eine Erklärung?',
      answer:
        'Ja. Zu jeder Auflösung gehört die passende Regel, zum Beispiel § 8 rechts vor links, mit einer klaren Begründung.',
      learnMoreSlug: 'rechts-vor-links-einfach-erklaert',
    },
    {
      question: 'Kann ich auch selbst fahren?',
      answer: 'Ja — im Fahrsimulator steuerst du mit Gas und Bremse durch 23 Level. Fehler landen im Fahrtenbuch, damit du sie gezielt nachüben kannst.',
    },
    {
      question: 'Gibt es die App auf Englisch?',
      answer: 'Ja, komplett auf Deutsch und Englisch.',
    },
    {
      question: 'Ist die App kostenlos?',
      answer:
        'Die ersten Situationen sind gratis. Die Vollversion schaltet alle Situationen, Simulator-Level und die praktische Prüfung frei.',
    },
  ],
  ctaHeading: 'An der Kreuzung nicht mehr raten',
  ctaText: 'App kostenlos laden, die ersten Kreuzungen gratis üben und mit sicherem Gefühl in die Theorieprüfung gehen.',
  category: 'EducationalApplication',
  downloadNote: 'Kostenlos laden • Optionale In-App-Käufe',
};
