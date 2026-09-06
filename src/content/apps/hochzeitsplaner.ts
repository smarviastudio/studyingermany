import { Users, LayoutGrid, PiggyBank, ClipboardCheck, Clock, Printer } from 'lucide-react';
import type { AppContent } from './types';

export const hochzeitsplaner: AppContent = {
  slug: 'hochzeitsplaner-app',
  appId: '6795662846',
  name: 'Hochzeitsplaner',
  storeName: 'Hochzeitsplaner & Gästeliste',
  subtitle: 'Gästeliste, Sitzplan, Budget — zu zweit',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/hochzeitsplaner-g%C3%A4steliste/id6795662846',
  icon: '/apps/hochzeitsplaner/icon.webp',
  accent: '#e11d48',
  accentDark: '#9f1239',
  heroTitle: {
    pre: 'Eure ganze Hochzeitsplanung an einem Ort —',
    highlight: 'und auf beiden Handys',
    post: '',
  },
  heroDescription:
    'Gästeliste, Sitzplan, Budget, Aufgaben und Tagesablauf von der Verlobung bis zum Tag danach. Ein Code verbindet eure beiden Handys: neue Zusage, neuer Posten, abgehakte Aufgabe — ihr seid immer auf demselben Stand.',
  heroBenefits: [
    'Zu zweit planen, jede Änderung sofort beim anderen',
    'Gästeliste mit Menüwunsch, Allergien und Begleitung',
    'Sitzplan mit automatischer Verteilung und Warnung bei vollen Tischen',
    'Budget mit Anzahlungen, offenen Beträgen und Kosten pro Gast',
    'Checkliste für Deutschland: Standesamt, Aufgebot, Trauzeugen',
    'Alle Listen als PDF für Location, Standesamt und Catering',
  ],
  metaTitle: 'Hochzeitsplaner App: Gästeliste, Sitzplan & Budget',
  metaDescription:
    'Plant eure Hochzeit zu zweit auf beiden Handys: Gästeliste mit Menüwünschen, Sitzplan, Budget mit Anzahlungen, Checkliste fürs Standesamt und Tagesablauf.',
  metaKeywords:
    'hochzeitsplaner app, gästeliste hochzeit, sitzplan hochzeit, hochzeit budget, hochzeit checkliste, hochzeitsplanung app, tischordnung hochzeit, standesamt checkliste, hochzeit organisieren',
  screenshots: [
    { src: '/apps/hochzeitsplaner/screenshot-1.webp', alt: 'Hochzeitsplaner App – Übersicht der Hochzeitsplanung' },
    { src: '/apps/hochzeitsplaner/screenshot-2.webp', alt: 'Gästeliste mit Zusagen, Menüwunsch und Allergien' },
    { src: '/apps/hochzeitsplaner/screenshot-3.webp', alt: 'Sitzplan mit Tischen und automatischer Verteilung' },
    { src: '/apps/hochzeitsplaner/screenshot-4.webp', alt: 'Hochzeitsbudget mit Anzahlungen und offenen Beträgen' },
    { src: '/apps/hochzeitsplaner/screenshot-5.webp', alt: 'Checkliste und Tagesablauf für den Hochzeitstag' },
  ],
  audience: [
    {
      badge: 'Brautpaare',
      title: 'Paare, die zu zweit planen',
      description:
        'Nicht eine Person plant und die andere fragt nach. Beide Handys zeigen denselben Stand — Zusagen, Budget, offene Aufgaben.',
      color: '#9f1239',
    },
    {
      badge: 'Trauzeugen',
      title: 'Trauzeugen und Helfer',
      description:
        'Als Helfer beitreten, alles sehen, nichts versehentlich ändern. Wer am Tag selbst Verantwortung übernimmt, hat den Ablauf auf dem eigenen Handy.',
      color: '#7c3aed',
    },
    {
      badge: 'Große Feiern',
      title: 'Hochzeiten ab 60 Gästen',
      description:
        'Ab dieser Größe kippt die Planung aus dem Kopf in die Tabelle. Menüwünsche, Allergien und Sitzordnung sind dann keine Nebensache mehr, sondern der Kern.',
      color: '#0369a1',
    },
  ],
  features: [
    {
      icon: Users,
      title: 'Gästeliste fürs Catering',
      description:
        'Zusagen, Menüwunsch, Allergien und Begleitung pro Gast — getrennt nach Trauung, Kaffee, Abendessen und Party. Am Ende steht die Kopfzahl fürs Abendessen, nicht bloß die Gästezahl.',
      color: '#9f1239',
    },
    {
      icon: LayoutGrid,
      title: 'Sitzplan mit Warnung',
      description:
        'Tische anlegen, Gäste mit einem Tipp setzen, automatisch nach Familie, Freunden und Seite verteilen. Wird ein Tisch zu voll, sagt die App es sofort — Begleitungen zählen als eigener Platz.',
      color: '#7c3aed',
    },
    {
      icon: PiggyBank,
      title: 'Budget mit Anzahlungen',
      description:
        'Geplant, tatsächlich, Anzahlung und offener Betrag getrennt geführt. 20 Kategorien, vorbelegt nach deutschen Durchschnittswerten, plus Kosten pro Gast auf einen Blick.',
      color: '#059669',
    },
    {
      icon: ClipboardCheck,
      title: 'Checkliste für Deutschland',
      description:
        'Standesamt, kirchliche oder freie Trauung — die Aufgaben passen sich an. Aufgebot, Trauzeugen, Polterabend, jede Aufgabe mit echtem Termin, berechnet aus eurem Hochzeitstag.',
      color: '#0369a1',
    },
    {
      icon: Clock,
      title: 'Tagesablauf',
      description:
        'Von der Trauung bis zum letzten Tanz, mit Verantwortlichen für Trauzeugen, DJ und Fotograf. Am Tag selbst weiß jeder, wann er dran ist.',
      color: '#d97706',
    },
    {
      icon: Printer,
      title: 'Alles als PDF',
      description:
        'Gästeliste, Sitzordnung, Tagesablauf, Catering-Übersicht und Budget zum Ausdrucken — genau die Listen, die Location, Standesamt und Catering sehen wollen.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Hochzeitstag eintragen', description: 'Aus dem Datum berechnet die App alle Fristen der Checkliste rückwärts.' },
    { title: 'Handys verbinden', description: 'Ein Code, und ihr plant beide in derselben Hochzeit — Trauzeugen können als Helfer dazukommen.' },
    { title: 'Gäste übernehmen', description: 'Direkt aus den Kontakten, statt 100 Namen zu tippen. Menüwunsch und Allergien kommen später dazu.' },
    { title: 'Drucken und übergeben', description: 'Kurz vor dem Termin die PDFs erzeugen und an Location, Catering und Trauzeugen geben.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Checkliste, Budget, Sitzplan, Tagesablauf und die ersten 25 Gäste sind kostenlos. Auch das gemeinsame Planen zu zweit ist frei — euer Partner muss nichts kaufen, um mitzuplanen.',
  pricingPro: {
    name: 'Hochzeitsplaner Pro',
    bullets: [
      'Unbegrenzt viele Gäste',
      'Alle Designs und Farbwelten',
      'Smart Planner',
      'Eigene Hochzeitswebsite',
    ],
    note: 'Einmalig kaufen, kein Abo',
  },
  guides: [
    {
      slug: 'hochzeit-checkliste-deutschland',
      lang: 'de',
      keyword: 'hochzeit checkliste',
      title: 'Hochzeits-Checkliste für Deutschland: was wann erledigt sein muss',
      metaTitle: 'Hochzeit Checkliste – Zeitplan vom Antrag bis zum Tag danach',
      metaDescription:
        'Standesamt, Aufgebot, Trauzeugen, Location: welche Aufgaben zwölf Monate vorher anstehen, welche vier Wochen vorher — und was wirklich Fristen hat.',
      excerpt: 'Der realistische Zeitplan — und die drei Aufgaben, bei denen ein verpasster Termin richtig weh tut.',
      intro: [
        'Die meisten Hochzeits-Checklisten im Netz sind aus dem Amerikanischen übersetzt und passen deshalb nur halb: Sie kennen kein Standesamt, keine Anmeldung der Eheschließung und keinen Unterschied zwischen standesamtlicher und kirchlicher Trauung.',
        'In Deutschland gibt es drei Aufgaben mit echten Fristen — der Rest ist Organisation, die sich verschieben lässt. Es hilft, die beiden Kategorien auseinanderzuhalten.',
      ],
      sections: [
        {
          heading: 'Die Aufgaben mit echten Fristen',
          bullets: [
            'Anmeldung der Eheschließung beim Standesamt: frühestens sechs Monate vor dem Termin, und die Unterlagen brauchen Vorlauf.',
            'Beglaubigte Abschriften aus dem Geburtenregister — bei internationalen Paaren kommen Übersetzung und Apostille dazu, das dauert Monate.',
            'Der Trautermin selbst: beliebte Samstage in großen Städten sind ein Jahr im Voraus vergeben.',
          ],
        },
        {
          heading: 'Zwölf bis neun Monate vorher',
          bullets: [
            'Budgetrahmen festlegen, bevor die erste Location besichtigt wird — nicht danach.',
            'Ungefähre Gästezahl festlegen; sie bestimmt Location, Catering und die halbe Kostenstruktur.',
            'Location und Standesamt-Termin abstimmen, in dieser Reihenfolge.',
            'Fotograf und Musik anfragen — beide sind an guten Terminen früh ausgebucht.',
          ],
        },
        {
          heading: 'Sechs bis drei Monate vorher',
          bullets: [
            'Einladungen versenden und die Rückmeldefrist bewusst früh setzen.',
            'Menüauswahl und Getränkepauschale mit dem Catering klären.',
            'Anzahlungen im Blick behalten — sie werden gestaffelt fällig und verschwinden gern aus dem Budget.',
            'Trauzeugen offiziell fragen und Aufgaben verteilen.',
          ],
        },
        {
          heading: 'Der letzte Monat',
          numbered: [
            'Endgültige Kopfzahl an das Catering geben — meist zehn bis vierzehn Tage vorher verbindlich.',
            'Sitzplan finalisieren, wenn die letzten Zu- und Absagen da sind.',
            'Tagesablauf schreiben und an alle Beteiligten verteilen, nicht nur an die Trauzeugen.',
            'Restzahlungen und Trinkgelder in Umschläge vorbereiten.',
            'Alle Listen ausdrucken — am Tag selbst ist niemand in der Stimmung, im Handy zu suchen.',
          ],
        },
      ],
      howToHeading: 'Die Checkliste in der App nutzen',
      howToSteps: [
        { title: 'Hochzeitstag eintragen', text: 'Alle Aufgaben bekommen daraus automatisch einen echten Termin.' },
        { title: 'Trauungsart wählen', text: 'Standesamtlich, kirchlich oder frei — die Liste passt sich an.' },
        { title: 'Aufgaben verteilen', text: 'Wer was übernimmt, steht an der Aufgabe. Trauzeugen sehen es als Helfer mit.' },
        { title: 'Erinnerungen zulassen', text: 'Einmal pro Planungsphase, nicht öfter — fällige Zahlungen und Meilensteine.' },
      ],
      faqs: [
        {
          question: 'Wie früh muss ich die Eheschließung anmelden?',
          answer:
            'Frühestens sechs Monate vor dem Termin. Wichtiger als die Frist ist der Vorlauf für die Unterlagen — besonders wenn Dokumente aus dem Ausland kommen.',
        },
        {
          question: 'Passt die Checkliste auch für eine freie Trauung?',
          answer:
            'Ja. Die Aufgaben ändern sich je nach gewählter Trauungsart; die standesamtlichen Schritte bleiben, die kirchlichen entfallen.',
        },
      ],
      screenshotIndex: 4,
    },
    {
      slug: 'gaesteliste-hochzeit-organisieren',
      lang: 'de',
      keyword: 'gästeliste hochzeit',
      title: 'Gästeliste für die Hochzeit: die Zahl, die das Catering wirklich braucht',
      metaTitle: 'Gästeliste Hochzeit – Zusagen, Menüwünsche und Kopfzahl',
      metaDescription:
        'Warum die Gästezahl und die Kopfzahl fürs Abendessen nicht dasselbe sind, wie ihr Allergien sauber erfasst und was auf die Absagen-Quote Einfluss hat.',
      excerpt: 'Gästezahl ist nicht Kopfzahl. Der Unterschied kostet oder spart vierstellig.',
      intro: [
        'Die Gästeliste ist die teuerste Liste der ganzen Hochzeit: Fast jeder große Posten — Catering, Getränke, Location, Sitzplan, Papeterie — hängt direkt an ihr. Ein Fehler von zehn Personen bewegt vierstellige Beträge.',
        'Der häufigste Fehler ist, mit einer einzigen Zahl zu arbeiten. In Wirklichkeit gibt es mehrere: eingeladen, zugesagt, beim Abendessen, in der Party. Das Catering rechnet mit der dritten.',
      ],
      sections: [
        {
          heading: 'Die vier Zahlen, die ihr getrennt braucht',
          bullets: [
            'Eingeladene Personen — die Basis für Papeterie und Porto.',
            'Zusagen inklusive Begleitungen — die Basis für die Location-Kapazität.',
            'Kopfzahl fürs Abendessen — die Basis für die Cateringrechnung, oft deutlich kleiner als die Zusagen.',
            'Gäste bei Kaffee oder Party — Menschen, die erst später dazukommen oder früher gehen.',
          ],
        },
        {
          heading: 'Was pro Gast erfasst gehört',
          bullets: [
            'Menüwunsch, inklusive vegetarisch und vegan — das Catering fragt danach, meist zwei Wochen vorher.',
            'Allergien und Unverträglichkeiten, wörtlich notiert statt als Häkchen.',
            'Begleitung: Name, wenn bekannt, sonst zumindest der Platz.',
            'Kinder mit Alter — Kinderteller und Hochstuhl hängen daran.',
            'Zu welchen Programmteilen die Person kommt.',
          ],
        },
        {
          heading: 'Absagen realistisch einplanen',
          paragraphs: [
            'Bei Hochzeiten in Deutschland liegt die Absagequote je nach Gästekreis und Anreiseweg erfahrungsgemäß zwischen zehn und zwanzig Prozent. Wer knapp kalkuliert und keine Reserve einplant, hat am Ende halbleere Tische im Sitzplan.',
            'Sinnvoll ist eine Warteliste statt einer Aufrundung: Wer absagt, macht Platz für jemanden, der ohnehin auf der Kippe stand. Das ist ehrlicher als eine zu große Erstliste.',
            'Die Rückmeldefrist gehört deutlich vor die Frist des Caterings — mindestens drei Wochen Puffer, denn ein Teil der Gäste antwortet grundsätzlich erst nach der Erinnerung.',
          ],
        },
      ],
      howToHeading: 'Die Gästeliste in der App führen',
      howToSteps: [
        { title: 'Gäste aus Kontakten holen', text: 'Statt 100 Namen zu tippen, direkt aus dem Adressbuch übernehmen.' },
        { title: 'Programmteile zuordnen', text: 'Trauung, Kaffee, Abendessen und Party getrennt — daraus entsteht die Kopfzahl.' },
        { title: 'Menü und Allergien erfassen', text: 'Beides steht am Gast und landet später in der Catering-Übersicht.' },
        { title: 'Catering-PDF erzeugen', text: 'Die Übersicht enthält genau die Zahlen, die das Catering abfragt.' },
      ],
      faqs: [
        {
          question: 'Zählt eine Begleitung als eigener Platz?',
          answer: 'Ja — im Sitzplan und in der Kopfzahl. Genau daran scheitern selbstgebaute Tabellen am häufigsten.',
        },
        {
          question: 'Können wir beide gleichzeitig an der Gästeliste arbeiten?',
          answer: 'Ja. Änderungen erscheinen sofort auf beiden Handys, ohne dass ihr Listen abgleichen müsst.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'hochzeitsbudget-planen',
      lang: 'de',
      keyword: 'hochzeit budget',
      title: 'Hochzeitsbudget: wohin das Geld wirklich geht',
      metaTitle: 'Hochzeit Budget planen – Kostenverteilung und Anzahlungen',
      metaDescription:
        'Wie sich ein Hochzeitsbudget in Deutschland typischerweise verteilt, warum Anzahlungen die Planung sprengen und welche Posten regelmäßig vergessen werden.',
      excerpt: 'Die typische Kostenverteilung, die vergessenen Posten und warum Anzahlungen getrennt geführt gehören.',
      intro: [
        'Ein Hochzeitsbudget kippt selten wegen einer großen Fehlentscheidung. Es kippt, weil zwanzig kleine Posten nirgends standen und weil Anzahlungen und Endbeträge im Kopf durcheinandergeraten.',
        'Wer beides sauber trennt — geplant gegen tatsächlich, angezahlt gegen offen — behält bis zum Schluss den Überblick, auch wenn einzelne Posten teurer werden.',
      ],
      sections: [
        {
          heading: 'Die grobe Verteilung',
          bullets: [
            'Catering und Getränke sind fast immer der größte Block und skalieren direkt mit der Kopfzahl.',
            'Location kommt als zweiter großer Posten dazu, oft mit Mindestumsatz statt fixer Miete.',
            'Fotograf und Musik bilden zusammen den dritten Block — hier ist die Preisspanne am größten.',
            'Kleidung, Ringe, Papeterie, Blumen und Deko wirken einzeln klein und summieren sich erheblich.',
          ],
        },
        {
          heading: 'Die Posten, die regelmäßig fehlen',
          bullets: [
            'Trinkgelder für Service, Fotograf, DJ und Trauredner.',
            'Übernachtung für das Brautpaar und gegebenenfalls für angereiste Familie.',
            'Korkgeld, wenn ihr eigene Getränke mitbringt.',
            'Standesamtgebühren, Stammbuch und beglaubigte Abschriften.',
            'Beauty am Morgen, Anproben und Änderungsschneiderei.',
            'Dankeskarten und Porto nach der Hochzeit — der Posten kommt, wenn das Budget mental schon geschlossen ist.',
          ],
        },
        {
          heading: 'Anzahlungen getrennt führen',
          paragraphs: [
            'Fast alle großen Dienstleister arbeiten mit Anzahlungen. Wer nur den Gesamtbetrag notiert, sieht nicht, wie viel tatsächlich schon abgeflossen ist und wie viel kurz vor der Hochzeit auf einmal fällig wird.',
            'Sinnvoll sind vier Werte pro Posten: geplant, tatsächlich vereinbart, bereits angezahlt und offen. Erst der vierte Wert sagt euch, was in den letzten Wochen noch vom Konto geht — und genau dort entsteht sonst der Engpass.',
          ],
        },
      ],
      howToHeading: 'Das Budget in der App aufsetzen',
      howToSteps: [
        { title: 'Kategorien übernehmen', text: '20 Kategorien sind mit deutschen Durchschnittswerten vorbelegt und lassen sich anpassen.' },
        { title: 'Anzahlungen eintragen', text: 'Geplant, tatsächlich, angezahlt und offen werden getrennt geführt.' },
        { title: 'Kosten pro Gast prüfen', text: 'Die Zahl zeigt sofort, was eine Änderung der Gästezahl wirklich bedeutet.' },
        { title: 'Vor Fälligkeit erinnern lassen', text: 'Die App meldet sich, bevor eine Anzahlung fällig wird.' },
      ],
      faqs: [
        {
          question: 'Sehen wir beide dasselbe Budget?',
          answer: 'Ja. Jeder neue Posten und jede Zahlung erscheint sofort auf beiden Handys.',
        },
        {
          question: 'Können wir das Budget exportieren?',
          answer: 'Ja, als PDF — zusammen mit Gästeliste, Sitzordnung, Tagesablauf und Catering-Übersicht.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'Können wir zu zweit planen?',
      answer:
        'Ja, das ist der Kern der App. Ein Code verbindet eure beiden Handys, jede Änderung erscheint automatisch beim anderen. Trauzeugen können als Helfer beitreten: alles sehen, nichts versehentlich ändern.',
    },
    {
      question: 'Muss mein Partner die App kaufen?',
      answer: 'Nein. Gemeinsames Planen ist kostenlos — auch wenn nur eine Person Pro gekauft hat.',
    },
    {
      question: 'Was kann die Gästeliste, das eine Tabelle nicht kann?',
      answer:
        'Sie trennt Trauung, Kaffee, Abendessen und Party und rechnet daraus die Kopfzahl fürs Abendessen — genau die Zahl, die das Catering abfragt. Begleitungen zählen dabei als eigener Platz.',
      learnMoreSlug: 'gaesteliste-hochzeit-organisieren',
    },
    {
      question: 'Passt die Checkliste zu einer Hochzeit in Deutschland?',
      answer:
        'Ja. Standesamt, Aufgebot, Trauzeugen und Polterabend sind enthalten, und die Aufgaben passen sich an standesamtliche, kirchliche oder freie Trauung an.',
      learnMoreSlug: 'hochzeit-checkliste-deutschland',
    },
    {
      question: 'Was ist kostenlos?',
      answer:
        'Checkliste, Budget, Sitzplan, Tagesablauf und die ersten 25 Gäste. Pro schaltet unbegrenzt viele Gäste, alle Designs, den Smart Planner und die Hochzeitswebsite frei — einmalig, kein Abo.',
    },
    {
      question: 'Was passiert, wenn ein Handy verloren geht?',
      answer:
        'Eure Planung liegt sicher, weil beide Geräte denselben Stand haben. Ihr verliert kein Gerät mit der einzigen Kopie eurer Gästeliste.',
    },
  ],
  ctaHeading: 'Eure Hochzeit, auf beiden Handys',
  ctaText:
    'Gästeliste, Sitzplan, Budget und Tagesablauf an einem Ort. Kostenlos starten — die ersten 25 Gäste und das gemeinsame Planen sind frei.',
  category: 'LifestyleApplication',
  downloadNote: 'Kostenlos laden • Optionale Einmalzahlung',
};
