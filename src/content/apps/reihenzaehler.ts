import { Hand, Layers, Ruler, Boxes, Vibrate, Lock } from 'lucide-react';
import type { AppContent } from './types';

export const reihenzaehler: AppContent = {
  slug: 'reihenzaehler-app-stricken-haekeln',
  appId: '6796241755',
  name: 'Reihenzähler',
  storeName: 'Häkeln & Stricken Reihenzähler',
  subtitle: 'Zählen ohne hinzusehen',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/h%C3%A4keln-stricken-reihenz%C3%A4hler/id6796241755',
  icon: '/apps/reihenzaehler/icon.webp',
  accent: '#d946ef',
  accentDark: '#a21caf',
  heroTitle: {
    pre: 'Der ganze Bildschirm ist die Taste —',
    highlight: 'du zählst, ohne hinzusehen',
    post: '',
  },
  heroDescription:
    'Du triffst den Zähler auch mit Nadeln in der Hand, und jede Reihe gibt ein kurzes Vibrieren. Mehrere Zähler pro Projekt für Reihen, Musterrapport und Zunahmen, dazu Garnvorrat mit Partie und ein Maschenproben-Rechner, der die Anleitung auf deine Probe umrechnet.',
  heroBenefits: [
    'Ganzflächiger Zähler mit Vibration bei jeder Reihe',
    'Mehrere Zähler pro Projekt, jeder mit eigenem Ziel',
    'Eigenes Vibrationsmuster am Ende jeder Musterwiederholung',
    'Schritt pro Tipp auf 2 stellen, wenn du nur Hinreihen zählst',
    'Garnvorrat mit Marke, Farbe, Partie und Restmenge',
    'Maschenproben-Rechner und Nadelstärken-Tabelle mm/US/UK',
  ],
  metaTitle: 'Reihenzähler App für Stricken & Häkeln – zählen ohne hinzusehen',
  metaDescription:
    'Reihenzähler mit ganzflächiger Taste und Vibration, mehreren Zählern pro Projekt, Garnvorrat mit Partie und Maschenproben-Rechner. Ohne Konto, ohne Werbung.',
  metaKeywords:
    'reihenzähler app, reihenzähler stricken, häkeln zähler, strickprojekte verwalten, maschenprobe rechner, garnvorrat app, nadelstärken tabelle, musterrapport zählen, strickapp deutsch',
  screenshots: [
    { src: '/apps/reihenzaehler/screenshot-1.webp', alt: 'Reihenzähler App – ganzflächiger Zähler für Stricken und Häkeln' },
    { src: '/apps/reihenzaehler/screenshot-2.webp', alt: 'Mehrere Zähler pro Projekt für Reihen, Muster und Zunahmen' },
    { src: '/apps/reihenzaehler/screenshot-3.webp', alt: 'Strickprojekte mit Garn, Nadelstärke und Foto' },
    { src: '/apps/reihenzaehler/screenshot-4.webp', alt: 'Garnvorrat mit Marke, Farbe, Partie und Restmenge' },
    { src: '/apps/reihenzaehler/screenshot-5.webp', alt: 'Maschenproben-Rechner mit Nadelstärken-Tabelle' },
  ],
  audience: [
    {
      badge: 'Strickerinnen',
      title: 'Wer nach Anleitung strickt',
      description:
        'Sobald ein Muster einen Rapport hat, reicht ein einzelner Zähler nicht mehr. Reihen, Rapport und Zunahmen laufen hier parallel, jeder mit eigenem Ziel.',
      color: '#a21caf',
    },
    {
      badge: 'Häkeln',
      title: 'Häkelprojekte mit Runden',
      description:
        'Runden zählen heißt oft, die Arbeit aus der Hand zu legen. Der ganzflächige Zähler und die Lautstärketasten machen genau das überflüssig.',
      color: '#0369a1',
    },
    {
      badge: 'Mehrere Projekte',
      title: 'Wer mehr als ein Stück offen hat',
      description:
        'So viele Projekte parallel wie du willst — mit Garn, Nadelstärke, Foto und Notizen. Fertige Stücke wandern ins Archiv statt gelöscht zu werden.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: Hand,
      title: 'Der ganze Bildschirm zählt',
      description:
        'Keine kleine Taste, die man mit Nadeln in der Hand verfehlt. Du tippst irgendwo hin, und die Reihe ist gezählt — der Bildschirm bleibt dabei an.',
      color: '#a21caf',
    },
    {
      icon: Vibrate,
      title: 'Rückmeldung ohne Blick',
      description:
        'Jede Reihe gibt ein kurzes Vibrieren. Am Ende jeder Musterwiederholung vibriert das iPhone anders, damit du es auch dann merkst, wenn du nicht auf das Display schaust.',
      color: '#be185d',
    },
    {
      icon: Layers,
      title: 'Mehrere Zähler pro Projekt',
      description:
        'Reihen, Musterrapport und Zunahmen gleichzeitig, jeder mit eigenem Ziel. Nach einer Pause springst du direkt zu einer Reihe, statt neu hochzuzählen.',
      color: '#0369a1',
    },
    {
      icon: Boxes,
      title: 'Garnvorrat mit Partie',
      description:
        'Marke, Farbe, Partie und Restmenge. Zwei Knäuel derselben Farbe aus verschiedenen Partien sehen im fertigen Stück unterschiedlich aus — deshalb steht die Partie hier an erster Stelle. Angefangene Knäuel gehen auch: 2,5 ist völlig in Ordnung.',
      color: '#d97706',
    },
    {
      icon: Ruler,
      title: 'Maschenproben-Rechner',
      description:
        'Trag ein, was die Anleitung verlangt und was du gemessen hast, und du bekommst die Maschenzahl, die bei dir wirklich passt. Dazu eine Nadelstärken-Tabelle in mm, US und UK.',
      color: '#059669',
    },
    {
      icon: Lock,
      title: 'Ohne alles',
      description:
        'Kein Konto, keine Anmeldung, keine Werbung, kein Tracking. Alle Daten bleiben auf deinem iPhone. Pro ist eine Einmalzahlung, kein Abo.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Projekt anlegen', description: 'Mit Garn, Nadelstärke, Foto und Notizen — so weißt du später, welches Knäuel dazugehörte.' },
    { title: 'Zähler einrichten', description: 'Einen für Reihen, einen für den Rapport, einen für Zunahmen. Schritt pro Tipp auf 2 stellen, wenn du nur Hinreihen zählst.' },
    { title: 'Losstricken', description: 'Tippen, vibrieren, weiter. Optional zählen die Lautstärketasten mit, damit du das Strickzeug nicht aus der Hand legst.' },
    { title: 'Archivieren', description: 'Fertige Stücke wandern ins Archiv — mit Foto und dem verwendeten Garn.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Zählen, Projekte anlegen und die Nadelstärken-Tabelle sind kostenlos nutzbar.',
  pricingPro: {
    name: 'Reihenzähler Pro',
    bullets: [
      'Unbegrenzt viele Projekte und Zähler',
      'Garnvorrat mit Partie und Restmenge',
      'Maschenproben-Rechner',
      'Archiv für fertige Stücke',
    ],
    note: 'Einmalzahlung, kein Abo',
  },
  guides: [
    {
      slug: 'reihen-zaehlen-beim-stricken',
      lang: 'de',
      keyword: 'reihen zählen stricken',
      title: 'Reihen zählen beim Stricken: warum man sich immer verzählt',
      metaTitle: 'Reihen zählen beim Stricken – Methoden im Vergleich',
      metaDescription:
        'Striche auf Papier, Markierer, Kopfrechnen oder App: warum die klassischen Methoden bei Mustern scheitern und wie mehrere Zähler das Problem lösen.',
      excerpt: 'Warum Striche auf Papier bei Mustern scheitern — und was stattdessen funktioniert.',
      intro: [
        'Sich zu verzählen ist keine Frage der Konzentration. Es ist eine Frage der Unterbrechung: Das Telefon klingelt, jemand spricht dich an, du legst die Arbeit ab — und beim Wiederaufnehmen fehlt die letzte sichere Zahl.',
        'Die klassischen Methoden haben alle dieselbe Schwäche: Sie verlangen, dass du das Zählen selbst nicht vergisst.',
      ],
      sections: [
        {
          heading: 'Die üblichen Methoden und ihre Grenzen',
          bullets: [
            'Striche auf Papier: zuverlässig, solange der Zettel in Reichweite liegt und du daran denkst.',
            'Maschenmarkierer alle zehn Reihen: gut für die Grobzählung, ungeeignet für den Rapport.',
            'Mitzählen im Kopf: funktioniert bis zur ersten Unterbrechung.',
            'Ein einzelner mechanischer Zähler: löst genau ein Zählproblem — bei Muster plus Zunahmen sind es aber drei.',
          ],
        },
        {
          heading: 'Warum mehrere Zähler nötig sind',
          paragraphs: [
            'Eine typische Anleitung verlangt gleichzeitig: die Gesamtreihe, die Position innerhalb des Musterrapports und die Zahl der bereits gearbeiteten Zunahmen. Diese drei laufen unterschiedlich schnell und lassen sich nicht ineinander umrechnen, ohne nachzudenken.',
            'Genau dieses Nachdenken ist die Fehlerquelle. Drei getrennte Zähler mit eigenen Zielen nehmen die Umrechnung heraus.',
          ],
        },
        {
          heading: 'Hin- und Rückreihen',
          paragraphs: [
            'Viele Anleitungen zählen jede Reihe, während man selbst in Hinreihen denkt — oder umgekehrt. Wer das im Kopf umrechnet, verzählt sich früher oder später um genau eine Reihe, und bei symmetrischen Mustern fällt es erst zehn Reihen später auf.',
            'Sauberer ist, den Schritt pro Tipp auf 2 zu stellen. Dann tippst du weiter einmal pro Hinreihe, und der Zähler zeigt die Zahl, die in der Anleitung steht.',
          ],
        },
      ],
      howToHeading: 'Zähler in der App einrichten',
      howToSteps: [
        { title: 'Hauptzähler anlegen', text: 'Für die Reihen, mit dem Gesamtziel aus der Anleitung.' },
        { title: 'Rapport-Zähler ergänzen', text: 'Mit der Länge der Musterwiederholung als Ziel — am Ende jeder Wiederholung vibriert das iPhone anders.' },
        { title: 'Schrittweite anpassen', text: 'Auf 2 stellen, wenn du in Hinreihen zählst, die Anleitung aber jede Reihe zählt.' },
        { title: 'Nach der Pause springen', text: 'Wenn du doch einmal den Faden verlierst, springst du direkt zur gezählten Reihe.' },
      ],
      faqs: [
        {
          question: 'Bleibt der Bildschirm beim Zählen an?',
          answer: 'Ja. Solange der Zähler geöffnet ist, schaltet sich das Display nicht ab.',
        },
        {
          question: 'Kann ich ohne Bildschirmberührung zählen?',
          answer: 'Ja, optional zählen die Lautstärketasten mit — praktisch, wenn du das Strickzeug nicht aus der Hand legen willst.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'maschenprobe-umrechnen',
      lang: 'de',
      keyword: 'maschenprobe umrechnen',
      title: 'Maschenprobe passt nicht: so rechnest du die Anleitung um',
      metaTitle: 'Maschenprobe umrechnen – Anleitung an die eigene Probe anpassen',
      metaDescription:
        'Wenn deine Maschenprobe von der Anleitung abweicht, hast du drei Möglichkeiten. Wie du richtig misst und wie die Umrechnung funktioniert.',
      excerpt: 'Drei Wege, wenn die Probe nicht passt — und warum Nadelstärke ändern meist der beste ist.',
      intro: [
        'Die Maschenprobe ist der unbeliebteste Teil jedes Projekts und der einzige, der über die Passform entscheidet. Zehn Prozent Abweichung klingen harmlos und ergeben bei einem Pullover mit 100 cm Umfang zehn Zentimeter Unterschied.',
        'Wenn deine Probe nicht zur Anleitung passt, ist das kein Fehler. Es heißt nur, dass du eine Entscheidung treffen musst.',
      ],
      sections: [
        {
          heading: 'Richtig messen',
          numbered: [
            'Mindestens 15 × 15 cm stricken, im vorgesehenen Muster — nicht glatt rechts, wenn das Stück ein Zopfmuster wird.',
            'Die Probe genauso behandeln wie das fertige Stück: waschen und trocknen lassen, wenn du das Stück später wäschst.',
            'In der Mitte messen, nie an den Rändern.',
            'Über 10 cm zählen und ruhig halbe Maschen notieren.',
            'Reihen und Maschen getrennt messen — sie weichen oft unterschiedlich ab.',
          ],
        },
        {
          heading: 'Die drei Möglichkeiten',
          bullets: [
            'Nadelstärke ändern: zu viele Maschen auf 10 cm heißt dickere Nadel, zu wenige heißt dünnere. Meist der sauberste Weg.',
            'Eine andere Größe der Anleitung stricken, deren Maschenzahl zu deinen Maßen passt.',
            'Die Anleitung umrechnen: deine Maschen pro Zentimeter mal die gewünschte Breite.',
          ],
        },
        {
          heading: 'Die Nadelstärken-Falle',
          paragraphs: [
            'Nadelstärken werden in Millimetern, in US-Größen und in UK-Größen angegeben, und die drei Systeme sind nicht kompatibel. Besonders tückisch: Britische Größen laufen rückwärts — eine größere Zahl bedeutet eine dünnere Nadel.',
            'Wer eine amerikanische oder britische Anleitung strickt und die Größe ungeprüft übernimmt, sitzt hinterher an einer Maschenprobe, die aus einem einfachen Umrechnungsfehler stammt.',
          ],
        },
      ],
      howToHeading: 'Umrechnen in der App',
      howToSteps: [
        { title: 'Sollwerte eintragen', text: 'Maschen und Reihen auf 10 cm, wie die Anleitung sie verlangt.' },
        { title: 'Eigene Probe eintragen', text: 'Was du nach dem Waschen tatsächlich gemessen hast.' },
        { title: 'Ergebnis übernehmen', text: 'Die App gibt die Maschenzahl aus, die bei dir zur gewünschten Breite führt.' },
        { title: 'Nadelstärke prüfen', text: 'Die Tabelle rechnet mm, US und UK ineinander um — inklusive der rückwärts laufenden UK-Größen.' },
      ],
      faqs: [
        {
          question: 'Muss ich die Maschenprobe wirklich waschen?',
          answer:
            'Wenn das fertige Stück gewaschen wird, ja. Viele Garne verändern beim ersten Waschen Maschenbild und Maße deutlich.',
        },
        {
          question: 'Was mache ich, wenn Maschen passen und Reihen nicht?',
          answer:
            'Das ist häufig. Bei Anleitungen mit Längenangaben in Zentimetern ist es unkritisch; bei Angaben in Reihen musst du die Reihenzahl an deine Probe anpassen.',
        },
      ],
      screenshotIndex: 4,
    },
    {
      slug: 'garnvorrat-organisieren',
      lang: 'de',
      keyword: 'garnvorrat verwalten',
      title: 'Garnvorrat organisieren: warum die Partie wichtiger ist als die Farbe',
      metaTitle: 'Garnvorrat verwalten – Partie, Restmenge und Nachkaufen',
      metaDescription:
        'Zwei Knäuel derselben Farbe aus verschiedenen Partien sehen im fertigen Stück unterschiedlich aus. Wie du deinen Vorrat so erfasst, dass er nutzbar bleibt.',
      excerpt: 'Zwei Knäuel derselben Farbe, zwei Partien, ein sichtbarer Streifen im fertigen Stück.',
      intro: [
        'Wer länger strickt, sammelt Garn an. Der Vorrat ist aber nur dann etwas wert, wenn du beim nächsten Projekt weißt, was du hast — und zwar genau genug, um damit zu planen.',
        'Genau genug heißt: nicht „graue Wolle", sondern Marke, Farbnummer, Partie und die tatsächliche Restmenge.',
      ],
      sections: [
        {
          heading: 'Warum die Partie an erster Stelle steht',
          paragraphs: [
            'Garn wird partieweise gefärbt. Zwei Knäuel mit identischer Farbnummer aus verschiedenen Färbepartien unterscheiden sich minimal im Ton — im Knäuel unsichtbar, im fertigen Stück als Streifen deutlich sichtbar, besonders bei glatt rechts.',
            'Deshalb ist die Partienummer die wichtigste Angabe im Vorrat. Wer sie notiert, kann Reste zusammenlegen; wer sie weglässt, hat lauter Einzelknäuel.',
            'Praktischer Rat für neue Projekte: lieber ein Knäuel zu viel aus derselben Partie kaufen als eines nachkaufen zu müssen.',
          ],
        },
        {
          heading: 'Was in den Vorrat gehört',
          bullets: [
            'Marke und genauer Garnname.',
            'Farbnummer und Partienummer.',
            'Restmenge in Knäueln — angefangene zählen als Bruchteil, 2,5 ist völlig in Ordnung.',
            'Lauflänge und Gewicht, damit sich Bedarf überhaupt rechnen lässt.',
            'Die empfohlene Nadelstärke von der Banderole.',
          ],
        },
        {
          heading: 'Reste sinnvoll nutzen',
          bullets: [
            'Kleine Mengen derselben Partie für Bündchen, Kragen und Manschetten zurücklegen.',
            'Reste unterschiedlicher Partien bewusst für Streifenmuster einplanen, wo der Unterschied nicht stört.',
            'Ein Foto pro Garn erspart das Suchen in der Kiste.',
            'Beim Projekt notieren, welches Garn verbraucht wurde — im Archiv steht es dann beim fertigen Stück.',
          ],
        },
      ],
      howToHeading: 'Den Vorrat in der App führen',
      howToSteps: [
        { title: 'Garn anlegen', text: 'Marke, Farbe, Partie und Restmenge — die Partie ist das Feld, das später den Unterschied macht.' },
        { title: 'Angefangene Knäuel eintragen', text: 'Bruchteile sind erlaubt, damit die Restmenge realistisch bleibt.' },
        { title: 'Mit Projekten verknüpfen', text: 'Das verwendete Garn steht am Projekt und bleibt im Archiv erhalten.' },
        { title: 'Vor dem Einkauf nachsehen', text: 'Zwei Minuten im Vorrat ersparen das dritte Knäuel derselben Farbe.' },
      ],
      faqs: [
        {
          question: 'Kann ich angefangene Knäuel erfassen?',
          answer: 'Ja — Bruchteile sind vorgesehen. 2,5 Knäuel sind ein gültiger Wert.',
        },
        {
          question: 'Bleiben fertige Projekte erhalten?',
          answer: 'Ja. Fertige Stücke wandern ins Archiv statt gelöscht zu werden, mit Foto, Garn und Notizen.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'Muss ich den Zähler genau treffen?',
      answer:
        'Nein — der ganze Bildschirm ist die Taste. Du triffst ihn auch mit Nadeln in der Hand, und jede Reihe gibt ein kurzes Vibrieren.',
      learnMoreSlug: 'reihen-zaehlen-beim-stricken',
    },
    {
      question: 'Kann ich mehrere Dinge gleichzeitig zählen?',
      answer:
        'Ja. Reihen, Musterrapport und Zunahmen laufen parallel, jeder Zähler mit eigenem Ziel. Am Ende jeder Musterwiederholung vibriert das iPhone anders.',
      learnMoreSlug: 'reihen-zaehlen-beim-stricken',
    },
    {
      question: 'Meine Anleitung zählt jede Reihe, ich zähle Hinreihen. Geht das?',
      answer: 'Ja — stell den Schritt pro Tipp auf 2, dann zeigt der Zähler die Zahl aus der Anleitung.',
    },
    {
      question: 'Warum steht die Partie im Garnvorrat so weit vorne?',
      answer:
        'Weil zwei Knäuel derselben Farbe aus verschiedenen Partien im fertigen Stück unterschiedlich aussehen. Die Partie entscheidet, ob sich Reste kombinieren lassen.',
      learnMoreSlug: 'garnvorrat-organisieren',
    },
    {
      question: 'Was macht der Maschenproben-Rechner?',
      answer:
        'Du trägst ein, was die Anleitung verlangt und was du gemessen hast — er gibt die Maschenzahl aus, die bei dir wirklich passt. Dazu gibt es eine Nadelstärken-Tabelle in mm, US und UK.',
      learnMoreSlug: 'maschenprobe-umrechnen',
    },
    {
      question: 'Brauche ich ein Konto?',
      answer:
        'Nein. Keine Anmeldung, keine Werbung, kein Tracking. Alle Daten bleiben auf deinem iPhone, und Pro ist eine Einmalzahlung.',
    },
  ],
  ctaHeading: 'Zähl deine Reihen, ohne die Arbeit aus der Hand zu legen',
  ctaText:
    'Ganzflächiger Zähler, Vibration bei jeder Reihe, mehrere Zähler pro Projekt. Kostenlos laden und beim nächsten Projekt ausprobieren.',
  category: 'LifestyleApplication',
  downloadNote: 'Kostenlos laden • Optionale Einmalzahlung',
};
