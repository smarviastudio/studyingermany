import { Zap, PieChart, PillBottle, FileText, CalendarDays, Lock } from 'lucide-react';
import type { AppContent } from './types';

export const migraene: AppContent = {
  slug: 'migraene-tagebuch-app',
  appId: '6795666523',
  name: 'Migräne Tagebuch',
  storeName: 'Migräne App & Tracker',
  subtitle: 'Drei Taps pro Attacke',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/migr%C3%A4ne-app-tracker/id6795666523',
  icon: '/apps/migraene/icon.webp',
  accent: '#8b5cf6',
  accentDark: '#5b21b6',
  heroTitle: {
    pre: 'Ein Migräne-Tagebuch,',
    highlight: 'das man auch mit Migräne noch bedienen kann',
    post: '',
  },
  heroDescription:
    'Stärke antippen, Medikament antippen, fertig. Schon nach dem ersten Tap ist die Attacke gespeichert — alles Weitere ergänzt du später, wenn es dir besser geht. Aus den Einträgen entstehen Trigger-Analyse, Medikamenten-Monitor und der Arztbericht als PDF.',
  heroBenefits: [
    'Attacke in drei Taps erfasst, Rest später ergänzbar',
    'Trigger-Analyse mit Wirkung am Folgetag',
    'Medikamenten-Monitor nach der 10-Tage-Regel',
    'Arztbericht als PDF mit genau den abgefragten Zahlen',
    'Zyklus-Auswertung erkennt menstruelle Migräne',
    'Kein Konto, kein Server, alles bleibt auf dem iPhone',
  ],
  metaTitle: 'Migräne Tagebuch App: Trigger finden & Arztbericht als PDF',
  metaDescription:
    'Migräne-Attacken in drei Taps erfassen. Die App findet Trigger, überwacht die 10-Tage-Regel bei Schmerzmitteln und erstellt den Arztbericht als PDF — offline und ohne Konto.',
  metaKeywords:
    'migräne app, migräne tagebuch, kopfschmerzkalender, migräne tracker, trigger finden migräne, medikamentenübergebrauch kopfschmerz, 10 tage regel, migräne arztbericht, menstruelle migräne',
  screenshots: [
    { src: '/apps/migraene/screenshot-1.webp', alt: 'Migräne App – Attacke in drei Taps erfassen' },
    { src: '/apps/migraene/screenshot-2.webp', alt: 'Migräne Tagebuch – Trigger-Analyse der letzten Wochen' },
    { src: '/apps/migraene/screenshot-3.webp', alt: 'Medikamenten-Monitor nach der 10-Tage-Regel' },
    { src: '/apps/migraene/screenshot-4.webp', alt: 'Arztbericht als PDF mit Kopfschmerztagen und Medikamententagen' },
    { src: '/apps/migraene/screenshot-5.webp', alt: 'Migräne Kalender mit Häufungen im Monatsüberblick' },
  ],
  audience: [
    {
      badge: 'Betroffene',
      title: 'Menschen mit häufigen Attacken',
      description:
        'Wer mehrmals im Monat ausfällt, braucht kein Formular mit vierzig Feldern. Der erste Tap speichert die Attacke; der Rest ist optional.',
      color: '#5b21b6',
    },
    {
      badge: 'Vor dem Arzttermin',
      title: 'Wer zur Sprechstunde geht',
      description:
        'Neurologen fragen nach Kopfschmerztagen und Medikamententagen pro Monat. Ohne Dokumentation ist die Antwort geraten — mit ist sie belastbar.',
      color: '#0369a1',
    },
    {
      badge: 'Vorbeugung',
      title: 'Wer Trigger sucht',
      description:
        'Rotwein und Schlafmangel wirken oft erst am Folgetag. Eine Auswertung, die das nicht berücksichtigt, findet den Zusammenhang nie.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: Zap,
      title: 'Drei Taps',
      description:
        'Stärke antippen, Medikament antippen, fertig. Die Attacke ist schon nach dem ersten Tap gespeichert — Dauer, Symptome und Auslöser kannst du nachtragen, wenn es dir besser geht.',
      color: '#5b21b6',
    },
    {
      icon: PieChart,
      title: 'Trigger-Analyse',
      description:
        'Die App vergleicht deine Tage mit und ohne jeden Faktor, auch mit Wirkung am Folgetag. Ein Faktor wird erst bewertet, wenn genug Tage vorliegen — keine voreiligen Behauptungen.',
      color: '#059669',
    },
    {
      icon: PillBottle,
      title: 'Medikamenten-Monitor',
      description:
        'Zählt deine Einnahmetage nach der 10-Tage-Regel — Triptane und Kombipräparate ab 10 Tagen, einfache Schmerzmittel ab 15 Tagen im Monat — und warnt rechtzeitig.',
      color: '#dc2626',
    },
    {
      icon: FileText,
      title: 'Arztbericht als PDF',
      description:
        'Kopfschmerztage und Medikamententage pro Monat, Schmerzstärke, Dauer, Begleitsymptome und die Einzelattacken. Genau die Zahlen, die in der Sprechstunde gefragt werden.',
      color: '#0369a1',
    },
    {
      icon: CalendarDays,
      title: 'Kalender und Zyklus',
      description:
        'Ein Blick genügt, um Häufungen zu sehen. Die Zyklus-Auswertung erkennt eine menstruelle Migräne, die anders behandelt wird als die übrige.',
      color: '#be185d',
    },
    {
      icon: Lock,
      title: 'Bleibt auf dem iPhone',
      description:
        'Kein Konto, kein Server, keine Werbung, kein Tracking. Der Bericht entsteht auf dem Gerät — du entscheidest, wer ihn bekommt.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Attacke erfassen', description: 'Stärke antippen — gespeichert. Medikament antippen, wenn du eines genommen hast.' },
    { title: 'Später ergänzen', description: 'Dauer, Begleitsymptome und mögliche Auslöser, sobald es dir wieder besser geht.' },
    { title: 'Muster erkennen', description: 'Nach einigen Wochen zeigt die Trigger-Analyse, welche Faktoren bei dir tatsächlich zählen.' },
    { title: 'Bericht mitnehmen', description: 'Vor dem Arzttermin das PDF erzeugen — mit den Zahlen, die dort gefragt werden.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Attacken erfassen, der Tages-Check-in, der Kalender und der Medikamenten-Monitor mit der 10-Tage-Regel bleiben unbegrenzt kostenlos. Ein Tagebuch, das dich am Eintragen hindert, wäre sinnlos.',
  pricingPro: {
    name: 'Migräne-Tagebuch Pro',
    bullets: [
      'Trigger-Analyse inklusive Folgetags-Wirkung',
      'Arztbericht als PDF',
      'Zyklus-Auswertung',
      'Wirksamkeits-Auswertung deiner Medikamente',
    ],
    note: 'Einmalig zahlen, kein Abo',
  },
  guides: [
    {
      slug: 'migraene-trigger-finden',
      lang: 'de',
      keyword: 'migräne trigger finden',
      title: 'Migräne-Trigger finden: warum die meisten Tagebücher scheitern',
      metaTitle: 'Migräne Trigger finden – so wertest du richtig aus',
      metaDescription:
        'Trigger erkennt man nicht durch Erinnern, sondern durch Vergleich von Tagen mit und ohne den Faktor. Warum die Folgetags-Wirkung entscheidend ist.',
      excerpt: 'Warum Erinnern trügt, was die Folgetags-Wirkung ist und wie viele Tage es wirklich braucht.',
      intro: [
        'Fast jeder Mensch mit Migräne hat eine Theorie über seine Auslöser. Bemerkenswert oft hält sie einer Auswertung nicht stand — und ebenso oft steht der tatsächliche Faktor gar nicht auf der Liste.',
        'Der Grund ist kein Mangel an Aufmerksamkeit. Er liegt darin, wie Erinnerung funktioniert: Wir merken uns die Tage, an denen Verdacht und Attacke zusammenfielen, und vergessen die vielen Tage, an denen derselbe Faktor da war und nichts passierte.',
      ],
      sections: [
        {
          heading: 'Was ein Trigger-Verdacht wirklich braucht',
          bullets: [
            'Tage mit dem Faktor und Tage ohne den Faktor — beide Gruppen, sonst gibt es nichts zu vergleichen.',
            'Genug Tage insgesamt: Bei seltenen Faktoren dauert es Monate, bis eine Aussage überhaupt möglich ist.',
            'Die Möglichkeit einer verzögerten Wirkung — bei Rotwein und Schlafmangel zeigt sie sich typischerweise am Folgetag.',
            'Ehrlichkeit über die Prodromalphase: Heißhunger auf Schokolade ist oft schon Teil der Attacke, nicht ihr Auslöser.',
          ],
        },
        {
          heading: 'Die Falle der Prodromalphase',
          paragraphs: [
            'Stunden bis Tage vor dem Schmerz beginnt bei vielen Betroffenen eine Vorphase: Gähnen, Heißhunger, Nackenverspannung, Stimmungsschwankung, erhöhte Lichtempfindlichkeit.',
            'Genau in dieser Phase entstehen die Verhaltensweisen, die später als Auslöser verdächtigt werden — der Schokoriegel, der Rückzug, die Verspannung. Der Zusammenhang ist echt, die Richtung aber umgekehrt.',
            'Eine Auswertung, die Tage systematisch vergleicht, hilft hier mehr als jede Selbstbeobachtung, weil sie nicht auf die zeitliche Reihenfolge im Gedächtnis angewiesen ist.',
          ],
        },
        {
          heading: 'Faktoren, die sich zu erfassen lohnen',
          bullets: [
            'Schlaf: Dauer und Regelmäßigkeit, nicht nur „gut" oder „schlecht".',
            'Mahlzeiten und ausgelassene Mahlzeiten.',
            'Alkohol, insbesondere Rotwein, mit Blick auf den Folgetag.',
            'Stress und, wichtiger, das Nachlassen von Stress — die Wochenendmigräne ist ein klassisches Muster.',
            'Zyklus, Wetterwechsel, Bildschirmzeit und körperliche Belastung.',
          ],
        },
      ],
      howToHeading: 'Trigger-Analyse in der App nutzen',
      howToSteps: [
        { title: 'Täglich kurz einchecken', text: 'Der Tages-Check-in dauert Sekunden und liefert die Vergleichstage ohne Attacke.' },
        { title: 'Attacken sofort erfassen', text: 'Drei Taps genügen; Details lassen sich später ergänzen.' },
        { title: 'Auswertung abwarten', text: 'Die App bewertet einen Faktor erst, wenn genug Tage vorliegen — bewusst zurückhaltend.' },
        { title: 'Einzelne Faktoren testen', text: 'Wenn ein Verdacht bestätigt wird, gezielt verändern und die nächsten Wochen beobachten.' },
      ],
      faqs: [
        {
          question: 'Wie lange muss ich führen, bis etwas herauskommt?',
          answer:
            'Das hängt von der Häufigkeit ab. Bei mehreren Attacken pro Monat werden erste Faktoren nach einigen Wochen bewertbar; seltene Faktoren brauchen deutlich länger.',
        },
        {
          question: 'Was heißt Wirkung am Folgetag?',
          answer:
            'Manche Auslöser wirken zeitversetzt. Die Analyse prüft deshalb auch, ob ein Faktor am Vortag mit einer Attacke zusammenhängt — sonst bliebe genau dieses Muster unsichtbar.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'medikamentenuebergebrauch-kopfschmerz',
      lang: 'de',
      keyword: 'medikamentenübergebrauch kopfschmerz',
      title: 'Wenn Schmerzmittel selbst Kopfschmerzen machen: die 10-Tage-Regel',
      metaTitle: 'Medikamentenübergebrauch-Kopfschmerz – die 10-Tage-Regel',
      metaDescription:
        'Ab wann Schmerzmittel eigene Kopfschmerzen auslösen, welche Grenzen für Triptane und einfache Analgetika gelten und woran man den Übergang erkennt.',
      excerpt: 'Ab 10 beziehungsweise 15 Einnahmetagen im Monat kippt die Behandlung in die Ursache.',
      intro: [
        'Es ist eine der unangenehmeren Eigenheiten der Migräne: Die Mittel, die eine Attacke beenden, können bei zu häufiger Anwendung selbst Kopfschmerzen auslösen. Der resultierende Dauerkopfschmerz fühlt sich anders an als die Migräne und wird deshalb oft als Verschlechterung der Grunderkrankung gedeutet.',
        'Die Schwelle ist keine Frage der Menge pro Tag, sondern der Zahl der Einnahmetage pro Monat. Genau deshalb ist Zählen der einzige verlässliche Schutz.',
      ],
      sections: [
        {
          heading: 'Die Grenzwerte',
          bullets: [
            'Triptane, Ergotamine, Opioide und Kombinationspräparate: ab 10 Einnahmetagen im Monat kritisch.',
            'Einfache Schmerzmittel wie Ibuprofen, Paracetamol oder ASS: ab 15 Einnahmetagen im Monat kritisch.',
            'Maßgeblich ist der Tag, nicht die Tablettenzahl — drei Tabletten an einem Tag zählen als ein Tag.',
            'Kritisch wird es, wenn das Muster über etwa drei Monate anhält.',
          ],
        },
        {
          heading: 'Woran man den Übergang bemerkt',
          bullets: [
            'Der Kopfschmerz ist an immer mehr Tagen da, aber schwächer und dumpfer als eine typische Attacke.',
            'Er ist morgens beim Aufwachen schon vorhanden.',
            'Die gewohnte Medikation wirkt kürzer und unvollständiger.',
            'Die Einnahme verschiebt sich nach vorn — man nimmt vorsorglich, bevor es richtig anfängt.',
          ],
        },
        {
          heading: 'Was daraus folgt',
          paragraphs: [
            'Der Ausweg ist keine Selbstbehandlung: Ein Entzug gehört ärztlich begleitet, und häufige Attacken sind ein Grund, über eine Prophylaxe zu sprechen, statt die Akutmedikation weiter zu strecken.',
            'Was du selbst beitragen kannst, ist die Zahl. Wer beim Arzttermin sagen kann „im letzten Quartal 12, 9 und 14 Einnahmetage", bekommt eine andere Beratung als wer „ziemlich oft" sagt.',
            'Diese App ist ein Tagebuch und kein Medizinprodukt. Sie stellt keine Diagnose und ersetzt keine ärztliche Behandlung.',
          ],
        },
      ],
      howToHeading: 'Den Monitor in der App nutzen',
      howToSteps: [
        { title: 'Medikament bei der Attacke antippen', text: 'Der zweite Tap reicht — daraus entsteht der Einnahmetag.' },
        { title: 'Warnung ernst nehmen', text: 'Die App meldet sich, bevor die Grenze erreicht ist, nicht erst danach.' },
        { title: 'Monatswerte ansehen', text: 'Einnahmetage pro Monat stehen im Bericht neben den Kopfschmerztagen.' },
        { title: 'Zahlen mitnehmen', text: 'In der Sprechstunde ist die Monatsreihe die aussagekräftigste Angabe, die du machen kannst.' },
      ],
      faqs: [
        {
          question: 'Zählt ein Tag mit zwei Tabletten doppelt?',
          answer: 'Nein. Maßgeblich ist die Zahl der Einnahmetage im Monat, nicht die Zahl der Tabletten.',
        },
        {
          question: 'Ist der Monitor kostenlos?',
          answer:
            'Ja. Attacken erfassen, der Tages-Check-in, der Kalender und der Medikamenten-Monitor bleiben unbegrenzt kostenlos.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'migraene-arztbericht-vorbereiten',
      lang: 'de',
      keyword: 'migräne arzttermin vorbereiten',
      title: 'Den Neurologen-Termin vorbereiten: welche Zahlen gefragt werden',
      metaTitle: 'Migräne Arzttermin vorbereiten – diese Angaben zählen',
      metaDescription:
        'Kopfschmerztage, Medikamententage, Dauer und Begleitsymptome: was in der Sprechstunde abgefragt wird und wie ein brauchbarer Bericht aussieht.',
      excerpt: 'Was in der Sprechstunde wirklich gefragt wird — und warum „ziemlich oft" keine Antwort ist.',
      intro: [
        'Ein Termin beim Neurologen dauert selten lange, und ein erheblicher Teil davon geht für Fragen drauf, die sich vorher beantworten lassen. Wer mit Zahlen kommt, gewinnt Zeit für das eigentliche Gespräch: Prophylaxe, Wirksamkeit, nächste Schritte.',
        'Die gefragten Angaben sind erstaunlich konstant — und fast alle beziehen sich auf den Monat als Einheit.',
      ],
      sections: [
        {
          heading: 'Die Kernzahlen',
          bullets: [
            'Kopfschmerztage pro Monat, über mehrere Monate hinweg.',
            'Davon Migränetage, wenn du beides unterscheiden kannst.',
            'Medikamenten-Einnahmetage pro Monat, getrennt nach Substanzgruppe.',
            'Typische Attackendauer, unbehandelt und behandelt.',
            'Schmerzstärke im Mittel, meist auf einer Skala von 1 bis 10.',
          ],
        },
        {
          heading: 'Was den Unterschied macht',
          bullets: [
            'Begleitsymptome: Übelkeit, Erbrechen, Licht- und Lärmempfindlichkeit, Aura.',
            'Wirksamkeit einzelner Präparate: Was hat wie schnell und wie vollständig gewirkt?',
            'Ausfalltage — Tage, an denen du nicht arbeiten oder den Alltag nicht bewältigen konntest.',
            'Zusammenhang mit dem Zyklus, falls vorhanden: Menstruelle Migräne wird anders behandelt.',
          ],
        },
        {
          heading: 'Wie du den Termin strukturierst',
          numbered: [
            'Bericht ausdrucken oder als PDF mitbringen, statt im Handy zu blättern.',
            'Mit der Monatsreihe beginnen — sie ordnet alles Weitere ein.',
            'Danach die Medikamententage nennen, bevor danach gefragt wird.',
            'Zwei bis drei konkrete Fragen vorbereiten, sonst gehen sie im Gespräch unter.',
            'Am Ende festhalten, was bis zum nächsten Termin beobachtet werden soll.',
          ],
        },
      ],
      howToHeading: 'Den Bericht in der App erzeugen',
      howToSteps: [
        { title: 'Zeitraum wählen', text: 'Meist die letzten drei bis sechs Monate — genug für ein erkennbares Muster.' },
        { title: 'PDF erstellen', text: 'Der Bericht entsteht auf dem Gerät und enthält Monatswerte und Einzelattacken.' },
        { title: 'Ausdrucken oder teilen', text: 'Du entscheidest, wer den Bericht bekommt — nichts wird automatisch übertragen.' },
        { title: 'Nach dem Termin weiterführen', text: 'Ein neuer Wirkstoff lässt sich nur beurteilen, wenn davor und danach dokumentiert ist.' },
      ],
      faqs: [
        {
          question: 'Verlassen meine Daten das iPhone?',
          answer:
            'Nein. Es gibt kein Konto und keinen Server; der Bericht wird auf dem Gerät erstellt. Geteilt wird nur, was du selbst weitergibst.',
        },
        {
          question: 'Ersetzt der Bericht eine ärztliche Beurteilung?',
          answer:
            'Nein. Die App ist ein Tagebuch und kein Medizinprodukt. Sie stellt keine Diagnose und ersetzt keine ärztliche Behandlung.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'Wie schnell ist eine Attacke erfasst?',
      answer:
        'Drei Taps: Stärke, Medikament, fertig. Schon nach dem ersten Tap ist die Attacke gespeichert — Dauer, Symptome und Auslöser kannst du später ergänzen, wenn es dir besser geht.',
    },
    {
      question: 'Wie findet die App Trigger?',
      answer:
        'Sie vergleicht deine Tage mit und ohne jeden Faktor, auch mit Wirkung am Folgetag, wie sie bei Rotwein und Schlafmangel typisch ist. Ein Faktor wird erst bewertet, wenn genug Tage vorliegen.',
      learnMoreSlug: 'migraene-trigger-finden',
    },
    {
      question: 'Was ist die 10-Tage-Regel?',
      answer:
        'Triptane und Kombipräparate ab 10 Einnahmetagen im Monat, einfache Schmerzmittel ab 15 — darüber können Schmerzmittel selbst Kopfschmerzen auslösen. Der Monitor zählt mit und warnt rechtzeitig.',
      learnMoreSlug: 'medikamentenuebergebrauch-kopfschmerz',
    },
    {
      question: 'Was steht im Arztbericht?',
      answer:
        'Kopfschmerztage und Medikamententage pro Monat, Schmerzstärke, Dauer, Begleitsymptome und die Einzelattacken — als PDF, auf dem Gerät erzeugt.',
      learnMoreSlug: 'migraene-arztbericht-vorbereiten',
    },
    {
      question: 'Was ist kostenlos?',
      answer:
        'Attacken erfassen, der Tages-Check-in, der Kalender und der Medikamenten-Monitor bleiben unbegrenzt kostenlos. Pro schaltet Trigger-Analyse, Arztbericht, Zyklus- und Wirksamkeits-Auswertung frei — einmalig, kein Abo.',
    },
    {
      question: 'Ist die App ein Medizinprodukt?',
      answer:
        'Nein. Sie ist ein Tagebuch, stellt keine Diagnose und ersetzt keine ärztliche Behandlung.',
    },
  ],
  ctaHeading: 'Ein Tagebuch, das dich am Migränetag nicht überfordert',
  ctaText:
    'Drei Taps pro Attacke, und nach ein paar Wochen siehst du Muster, die vorher unsichtbar waren. Kostenlos laden — ohne Konto, ohne Server.',
  category: 'HealthApplication',
  downloadNote: 'Kostenlos laden • Optionale Einmalzahlung',
};
