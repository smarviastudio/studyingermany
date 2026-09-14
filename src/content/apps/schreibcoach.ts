import { PenLine, Sparkles, Timer, ClipboardList, BookOpen, TrendingUp } from 'lucide-react';
import type { AppContent } from './types';

export const schreibcoach: AppContent = {
  slug: 'deutsch-b1-schreiben-app',
  appId: '6788904694',
  name: 'SchreibCoach',
  storeName: 'Deutsch B1 Prüfung: Schreiben',
  subtitle: 'B1 Schreibtraining mit KI-Korrektur',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/deutsch-b1-prüfung-schreiben/id6788904694',
  icon: '/apps/schreibcoach/icon.webp',
  accent: '#6366f1',
  accentDark: '#3730a3',
  heroTitle: {
    pre: 'B1 Schreiben üben — mit',
    highlight: 'Korrektur nach jedem Text',
    post: '',
  },
  heroDescription:
    'SchreibCoach trainiert genau die Schreibaufgaben der Deutsch-B1-Prüfung: informelle E-Mail, Forumsbeitrag und formelle Nachricht. Du schreibst mit Timer wie in der Prüfung und bekommst sofort KI-Feedback zu Inhalt, Aufbau, Wortschatz und Grammatik — inklusive korrigierter Beispielversion.',
  heroBenefits: [
    'Schreibaufgaben im echten B1-Prüfungsstil',
    'KI-Korrektur zu Inhalt, Aufbau, Wortschatz und Grammatik',
    'Korrigierte Beispielversion deines eigenen Textes',
    'Redemittel und Formulierungen für B1',
    'Fortschritt, Bewertungen und wiederkehrende Fehler',
  ],
  metaTitle: 'Deutsch B1 Schreiben üben – App mit KI-Korrektur',
  metaDescription:
    'B1 Prüfung Schreiben trainieren: E-Mail, Forumsbeitrag und formelle Nachricht mit Timer schreiben und sofort KI-Feedback zu Grammatik erhalten.',
  metaKeywords:
    'b1 schreiben üben, deutsch b1 prüfung, b1 brief schreiben, telc b1 schreiben, goethe b1 schreiben, deutsch schreiben lernen, b1 forumsbeitrag, formelle email deutsch, deutschprüfung vorbereitung',
  screenshots: [
    { src: '/apps/schreibcoach/screenshot-1.webp', alt: 'SchreibCoach – B1 Schreibaufgabe im Prüfungsstil auf dem iPhone' },
    { src: '/apps/schreibcoach/screenshot-2.webp', alt: 'SchreibCoach – Text schreiben mit Timer wie in der B1 Prüfung' },
    { src: '/apps/schreibcoach/screenshot-3.webp', alt: 'SchreibCoach – KI-Korrektur mit Feedback zu Grammatik und Aufbau' },
    { src: '/apps/schreibcoach/screenshot-4.webp', alt: 'SchreibCoach – korrigierte Beispielversion des eigenen Textes' },
    { src: '/apps/schreibcoach/screenshot-5.webp', alt: 'SchreibCoach – Redemittel und Formulierungen für B1' },
    { src: '/apps/schreibcoach/screenshot-6.webp', alt: 'SchreibCoach – Fortschritt und wiederkehrende Fehler im Blick' },
  ],
  audience: [
    {
      badge: 'Prüfung',
      title: 'Vor der B1-Prüfung',
      description: 'Wer telc, Goethe oder ÖSD B1 vor sich hat, braucht vor allem Übung unter Zeitdruck — und jemanden, der den Text danach anschaut.',
      color: '#3730a3',
    },
    {
      badge: 'Ohne Kurs',
      title: 'Selbstlernende',
      description: 'Sprechen kann man mit Menschen üben, Schreiben nicht ohne Korrektur. Genau diese Lücke füllt die App.',
      color: '#0284c7',
    },
    {
      badge: 'Alltag',
      title: 'Schreiben für Beruf & Behörden',
      description: 'Formelle Nachrichten, Beschwerden und Anfragen sind auch außerhalb der Prüfung genau die Texte, die im Alltag in Deutschland gebraucht werden.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: PenLine,
      title: 'Aufgaben im Prüfungsformat',
      description:
        'Informelle E-Mail an Freunde, Forumsbeitrag mit eigener Meinung und formelle Nachricht an eine Firma oder Behörde — die drei Textsorten, die in der B1-Prüfung wirklich vorkommen.',
      color: '#3730a3',
    },
    {
      icon: Sparkles,
      title: 'KI-Korrektur mit Begründung',
      description:
        'Feedback zu Inhalt, Aufbau, Wortschatz und Grammatik — nicht nur „falsch", sondern warum es falsch ist und wie die bessere Formulierung lautet.',
      color: '#7c3aed',
    },
    {
      icon: ClipboardList,
      title: 'Korrigierte Beispielversion',
      description:
        'Du siehst deinen eigenen Text in einer korrigierten Fassung. Der Vergleich zwischen dem, was du geschrieben hast, und dem, was daraus wird, ist der eigentliche Lerneffekt.',
      color: '#059669',
    },
    {
      icon: Timer,
      title: 'Mit Timer wie in der Prüfung',
      description:
        'In der Prüfung fehlt nicht das Vokabular, sondern die Zeit. Der Timer trainiert Planen, Schreiben und Kontrollieren in genau dem Rahmen, den du am Prüfungstag hast.',
      color: '#d97706',
    },
    {
      icon: BookOpen,
      title: 'Redemittel für B1',
      description:
        'Bausteine für Anrede, Einleitung, Meinung, Begründung, Bitte und Gruß — die Formulierungen, die Prüfer erwarten und die deinen Text sofort strukturierter machen.',
      color: '#0284c7',
    },
    {
      icon: TrendingUp,
      title: 'Fortschritt und Schwachstellen',
      description:
        'Bewertungen über die Zeit und die Fehler, die immer wiederkommen. Wer weiß, dass es fast immer die Nebensatzstellung ist, kann gezielt daran arbeiten.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Aufgabe wählen', description: 'E-Mail, Forumsbeitrag oder formelle Nachricht — im B1-Prüfungsstil.' },
    { title: 'Mit Timer schreiben', description: 'Unter realistischen Bedingungen schreiben statt in Ruhe formulieren.' },
    { title: 'Korrektur lesen', description: 'Feedback zu Inhalt, Aufbau, Wortschatz und Grammatik, mit Beispielversion.' },
    { title: 'Gezielt nachüben', description: 'Wiederkehrende Fehler erkennen und dieselbe Textsorte noch einmal schreiben.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'SchreibCoach ist kostenlos ladbar; erste Schreibaufgaben und Korrekturen sind ohne Kauf nutzbar.',
  pricingPro: {
    name: 'SchreibCoach Pro',
    bullets: [
      'Alle Schreibaufgaben',
      'Unbegrenzte KI-Korrekturen',
      'Vollständige Fortschrittsauswertung',
      'Abo oder einmalige Freischaltung',
    ],
    note: 'Optionaler In-App-Kauf',
  },
  guides: [
    {
      slug: 'b1-pruefung-schreiben-aufgaben',
      keyword: 'b1 prüfung schreiben aufgaben',
      title: 'B1 Prüfung Schreiben: Aufgabentypen, Zeit und Bewertung',
      metaTitle: 'B1 Prüfung Schreiben: Aufgaben, Zeit und Bewertungskriterien',
      metaDescription:
        'Welche Schreibaufgaben in der B1-Prüfung vorkommen, wie viel Zeit du pro Aufgabe hast, wie bewertet wird und mit welchem Zeitplan du fertig wirst.',
      excerpt: 'Die drei Textsorten, die Bewertungskriterien und ein Zeitplan, mit dem du im Prüfungsraum fertig wirst.',
      intro: [
        'Der Prüfungsteil Schreiben wirkt auf viele Lernende wie der unberechenbarste — dabei ist er der am besten vorhersagbare. Die Textsorten wiederholen sich, die Bewertungskriterien sind veröffentlicht, und die Aufgabenstellung sagt dir fast wörtlich, was im Text stehen muss.',
        'Wer das Muster einmal verstanden hat, schreibt nicht mehr „irgendetwas auf Deutsch", sondern erfüllt eine Checkliste.',
      ],
      sections: [
        {
          heading: 'Die Textsorten',
          bullets: [
            'Informelle E-Mail oder Brief an eine Person, die du duzt — Einladung, Absage, Bericht, Bitte um Hilfe.',
            'Forumsbeitrag oder Kommentar zu einem Thema, mit eigener Meinung und Begründung.',
            'Formelle Nachricht an eine Firma, Behörde, Schule oder Vermieter — mit Anliegen, Begründung und höflicher Bitte.',
          ],
        },
        {
          heading: 'Worauf die Bewertung schaut',
          numbered: [
            'Inhalt: Sind alle Leitpunkte der Aufgabe bearbeitet? Ein vergessener Punkt kostet mehr als drei Grammatikfehler.',
            'Aufbau: Anrede, Einleitung, Hauptteil, Schluss, Gruß — und Absätze, die den Text lesbar machen.',
            'Wortschatz: Bandbreite und Genauigkeit. Zweimal dasselbe Wort in einem Satz fällt auf.',
            'Grammatik: Verbstellung, Zeiten, Fälle. Erwartet wird kein fehlerfreier Text, sondern ein verständlicher.',
            'Register: Du oder Sie — durchgängig. Ein „Hallo Frau Müller, kannst du…" ist ein schwerer Fehler in einem formellen Brief.',
          ],
        },
        {
          heading: 'Zeitplan für den Prüfungsraum',
          numbered: [
            'Fünf Minuten: Aufgabe lesen und die Leitpunkte am Rand markieren.',
            'Fünf Minuten: Stichpunkte zu jedem Leitpunkt, in der Reihenfolge, in der du sie schreiben willst.',
            'Zwanzig Minuten: durchschreiben, ohne zurückzuspringen und zu verbessern.',
            'Fünf Minuten: kontrollieren — erst Leitpunkte abhaken, dann Verbstellung, dann Groß- und Kleinschreibung.',
          ],
        },
      ],
      howToHeading: 'So übst du das mit SchreibCoach',
      howToSteps: [
        { title: 'Textsorte wählen', text: 'Übe alle drei Typen im Wechsel, nicht nur die, die dir am leichtesten fällt.' },
        { title: 'Timer mitlaufen lassen', text: 'Schreiben ohne Zeitdruck bereitet nicht auf eine Prüfung mit Zeitdruck vor.' },
        { title: 'Leitpunkte abhaken', text: 'Die Korrektur zeigt dir, ob wirklich alle geforderten Punkte im Text stehen.' },
        { title: 'Denselben Typ wiederholen', text: 'Zwei Versuche derselben Textsorte hintereinander bringen mehr als zwei verschiedene Aufgaben.' },
      ],
      faqs: [
        {
          question: 'Wie lang muss ein B1-Text sein?',
          answer: 'Je nach Prüfung und Aufgabe meist etwa 80 bis 150 Wörter. Die genaue Vorgabe steht in der Aufgabenstellung — deutlich zu kurz kostet Punkte, sehr viel länger bringt keine.',
        },
        {
          question: 'Ist ein Text mit Fehlern automatisch durchgefallen?',
          answer: 'Nein. Auf B1 wird Verständlichkeit bewertet, nicht Fehlerfreiheit. Entscheidend ist, dass alle Leitpunkte bearbeitet sind und der Text lesbar bleibt.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'formelle-email-deutsch-schreiben',
      keyword: 'formelle email auf deutsch schreiben',
      title: 'Formelle E-Mail auf Deutsch schreiben: Aufbau und Formulierungen',
      metaTitle: 'Formelle E-Mail auf Deutsch: Aufbau, Anrede und Redemittel',
      metaDescription:
        'Anrede, Einleitung, Anliegen, Bitte, Gruß: der Aufbau einer formellen deutschen E-Mail mit fertigen Redemitteln — für die B1-Prüfung und den Alltag.',
      excerpt: 'Aufbau und fertige Redemittel für formelle E-Mails — in der Prüfung und im echten Leben.',
      intro: [
        'Die formelle Nachricht ist die Textsorte, die in der Prüfung am häufigsten schiefgeht und im Alltag am meisten gebraucht wird: Beschwerde beim Vermieter, Anfrage bei der Krankenkasse, Kündigung eines Vertrags.',
        'Der Aufbau ist zum Glück immer derselbe. Wer fünf Bausteine auswendig kann, schreibt in zehn Minuten einen brauchbaren formellen Brief.',
      ],
      sections: [
        {
          heading: 'Die fünf Bausteine',
          numbered: [
            'Anrede: „Sehr geehrte Damen und Herren," wenn du keinen Namen hast, sonst „Sehr geehrte Frau Müller,". Danach klein weiterschreiben.',
            'Einleitung: Warum du schreibst — „ich schreibe Ihnen, weil …" oder „mit Bezug auf Ihr Schreiben vom …".',
            'Hauptteil: Das Anliegen mit Begründung, ein Gedanke pro Absatz.',
            'Bitte oder Forderung: „Ich bitte Sie, … " oder „Könnten Sie mir bitte mitteilen, ob …".',
            'Gruß: „Mit freundlichen Grüßen" und darunter dein Name.',
          ],
        },
        {
          heading: 'Redemittel, die immer passen',
          bullets: [
            'Bezug nehmen: „Mit Bezug auf Ihr Schreiben vom 3. März …"',
            'Anliegen einleiten: „Ich wende mich an Sie, weil …"',
            'Begründen: „Der Grund dafür ist, dass …" / „Aus diesem Grund …"',
            'Höflich bitten: „Ich wäre Ihnen sehr dankbar, wenn Sie …"',
            'Frist nennen: „Ich bitte Sie um eine Antwort bis zum …"',
            'Abschluss: „Vielen Dank im Voraus für Ihre Bemühungen."',
          ],
        },
        {
          heading: 'Die typischen Fehler',
          bullets: [
            'Register wechseln: mittendrin vom Sie zum Du — der häufigste schwere Fehler.',
            'Zu emotional: „Das ist eine Frechheit" gehört nicht in einen formellen Brief, sachliche Kritik schon.',
            'Kein konkretes Anliegen: Der Leser muss nach dem ersten Absatz wissen, was du willst.',
            'Fehlende Absätze: eine Textwand kostet Punkte für Aufbau, auch wenn der Inhalt stimmt.',
            'Keine Angaben zur Person: Kundennummer, Aktenzeichen oder Vertragsnummer gehören dazu.',
          ],
        },
      ],
      howToHeading: 'Formelle Nachrichten mit SchreibCoach trainieren',
      howToSteps: [
        { title: 'Formelle Aufgabe wählen', text: 'Anfrage, Beschwerde oder Bitte an eine Firma oder Behörde.' },
        { title: 'Mit Redemitteln arbeiten', text: 'Nutze die Bausteine aus der App und setze sie in deinen eigenen Text ein.' },
        { title: 'Register prüfen lassen', text: 'Die Korrektur weist dich auf jeden Wechsel zwischen Du und Sie hin.' },
        { title: 'Beispielversion vergleichen', text: 'Der korrigierte Text zeigt dir die Formulierungen, die du beim nächsten Mal selbst verwendest.' },
      ],
      faqs: [
        {
          question: 'Sehr geehrte Damen und Herren oder Hallo?',
          answer: '„Sehr geehrte Damen und Herren" ohne bekannten Namen, „Sehr geehrte Frau …" mit Namen. „Hallo" ist im formellen Brief und in der Prüfung ein Registerfehler.',
        },
        {
          question: 'Brauche ich das auch nach der Prüfung?',
          answer: 'Ständig. Vermieter, Krankenkasse, Arbeitgeber, Ämter — die formelle Nachricht ist die nützlichste Textsorte des ganzen Kurses.',
        },
      ],
      screenshotIndex: 4,
    },
    {
      slug: 'typische-fehler-b1-schreiben',
      keyword: 'typische fehler b1 schreiben',
      title: 'Die typischen Fehler im B1-Schreiben — und wie du sie loswirst',
      metaTitle: 'Typische Fehler beim B1 Schreiben und wie du sie vermeidest',
      metaDescription:
        'Verbstellung, Nebensätze, Fälle, Perfekt, Kommasetzung: die häufigsten Fehler auf B1, warum sie passieren und wie du sie selbst findest.',
      excerpt: 'Die Fehler, die auf B1 am häufigsten Punkte kosten — und eine Kontrollroutine in vier Durchgängen.',
      intro: [
        'Fehler auf B1 sind erstaunlich vorhersehbar. Fast alle lassen sich auf eine Handvoll Strukturen zurückführen, die im Deutschen anders funktionieren als in den meisten Ausgangssprachen.',
        'Das ist eine gute Nachricht: Man muss nicht „besser Deutsch" lernen, sondern fünf konkrete Dinge kontrollieren.',
      ],
      sections: [
        {
          heading: 'Die häufigsten Fehler',
          numbered: [
            'Verb an zweiter Position im Hauptsatz — „Gestern ich habe" statt „Gestern habe ich".',
            'Verb ans Ende im Nebensatz nach weil, dass, wenn, obwohl — hier verlieren die meisten die meisten Punkte.',
            'Falscher Fall nach Präposition: mit dem, für den, wegen des. Verben und Präpositionen lernt man als Paar, nicht einzeln.',
            'Haben oder sein im Perfekt, plus die starken Partizipien, die man einfach kennen muss.',
            'Groß- und Kleinschreibung: Nomen groß, alles andere klein — und Anredepronomen im formellen Brief.',
          ],
        },
        {
          heading: 'Kontrollroutine in vier Durchgängen',
          numbered: [
            'Erster Durchgang: alle Leitpunkte der Aufgabe abhaken.',
            'Zweiter Durchgang: nur die Verben ansehen — Position im Hauptsatz, Position im Nebensatz.',
            'Dritter Durchgang: Nomen und Artikel prüfen, besonders nach Präpositionen.',
            'Vierter Durchgang: Groß- und Kleinschreibung sowie Anrede und Gruß.',
          ],
        },
        {
          heading: 'Warum Wiederholung mehr bringt als neue Aufgaben',
          paragraphs: [
            'Wer nach jeder Korrektur sofort die nächste, andere Aufgabe schreibt, macht meistens dieselben Fehler noch einmal. Die Korrektur wird gelesen, aber nicht angewendet.',
            'Deutlich wirksamer ist, denselben Text noch einmal zu schreiben — mit dem Feedback im Kopf, aber ohne die alte Version daneben. Erst dabei wird aus einer Korrektur eine Gewohnheit.',
          ],
        },
      ],
      howToHeading: 'Fehler gezielt abbauen mit SchreibCoach',
      howToSteps: [
        { title: 'Feedback nach Kategorien lesen', text: 'Inhalt, Aufbau, Wortschatz und Grammatik werden getrennt bewertet — so siehst du, wo es wirklich klemmt.' },
        { title: 'Muster erkennen', text: 'Die Fortschrittsansicht zeigt die Fehler, die immer wiederkommen.' },
        { title: 'Denselben Text neu schreiben', text: 'Wiederholung mit Feedback im Kopf ist der eigentliche Lernschritt.' },
        { title: 'Vor der Prüfung nur noch kontrollieren', text: 'In der letzten Woche zählt die Kontrollroutine mehr als neuer Wortschatz.' },
      ],
      faqs: [
        {
          question: 'Wie oft sollte ich vor der Prüfung schreiben?',
          answer: 'Lieber viermal pro Woche ein kurzer Text mit Korrektur als einmal ein langer. Frequenz schlägt Länge, weil die Fehler sich über Wiederholung abschleifen.',
        },
        {
          question: 'Ist die KI-Korrektur so gut wie eine Lehrkraft?',
          answer: 'Sie ersetzt keine Lehrkraft, ist aber jederzeit verfügbar und geduldig. Für die typischen B1-Fehlermuster und für schnelles Feedback nach jedem Text ist sie ausgesprochen brauchbar.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'beschwerdebrief-deutsch-b1-schreiben',
      lang: 'de',
      keyword: 'beschwerdebrief b1 schreiben',
      title: 'Beschwerdebrief auf Deutsch (B1): Aufbau, Redemittel und ein Muster, das in der Prüfung funktioniert',
      metaTitle: 'Beschwerdebrief B1 schreiben – Aufbau, Redemittel, Muster',
      metaDescription:
        'Der Beschwerdebrief ist die häufigste Schreibaufgabe der B1-Prüfung. Die vier Absätze, die Redemittel für Höflichkeit und Forderung und die Fehler, die Punkte kosten.',
      excerpt: 'Vier Absätze, ein klarer Ton und die Forderung am Ende — so besteht der Beschwerdebrief.',
      intro: [
        'In der B1-Prüfung von telc und Goethe taucht der Beschwerdebrief regelmäßig auf: Ein Produkt war defekt, ein Kurs fiel aus, eine Wohnung entsprach nicht der Anzeige. Die Aufgabe prüft nicht, ob du dich ärgern kannst, sondern ob du einen Sachverhalt geordnet darstellst, höflich bleibst und eine konkrete Lösung verlangst.',
        'Wer die Struktur einmal beherrscht, schreibt jeden Beschwerdebrief nach demselben Schema — in der Prüfung wie im Alltag.',
      ],
      sections: [
        {
          heading: 'Der Aufbau in vier Absätzen',
          numbered: [
            'Anlass: Worum geht es? Datum, Produkt oder Dienstleistung, Bestell- oder Kundennummer. „Am 3. März habe ich bei Ihnen einen Staubsauger bestellt."',
            'Problem: Was ist passiert, und was ist nicht in Ordnung? Sachlich, in der Vergangenheit, ohne Beleidigung. „Das Gerät funktionierte schon am zweiten Tag nicht mehr."',
            'Folgen und Erwartung: Was bedeutet das für dich, und was verlangst du? „Ich bitte Sie daher, das Gerät umzutauschen oder mir den Kaufpreis zu erstatten."',
            'Frist und Schluss: Bis wann, und was passiert sonst? „Bitte melden Sie sich bis zum 20. März. Andernfalls werde ich mich an die Verbraucherzentrale wenden."',
          ],
        },
        {
          heading: 'Redemittel, die Prüfer erwarten',
          bullets: [
            'Einleitung: „Sehr geehrte Damen und Herren," / „ich schreibe Ihnen, weil …" / „hiermit möchte ich mich über … beschweren."',
            'Problem: „Leider musste ich feststellen, dass …" / „Zu meiner Enttäuschung …" / „Das entspricht nicht dem, was vereinbart war."',
            'Forderung: „Ich bitte Sie, …" / „Ich erwarte, dass …" / „Ich fordere Sie auf, …" — die Reihenfolge ist von höflich nach bestimmt.',
            'Schluss: „Ich hoffe auf eine schnelle Lösung." / „Mit freundlichen Grüßen".',
          ],
        },
        {
          heading: 'Fehler, die Punkte kosten',
          bullets: [
            'Emotionaler Ton: „Das ist eine Frechheit!" — sachliche Kritik wird höher bewertet als Empörung.',
            'Keine konkrete Forderung: Ein Brief, der nur beschreibt, ist keine Beschwerde.',
            'Fehlende Textteile: Anrede, Grußformel, Absender-Bezug — jede fehlende Konvention wird abgezogen.',
            'Zu kurz: Die Aufgabe nennt eine Mindestwortzahl und mehrere Inhaltspunkte; jeder ausgelassene Punkt kostet.',
            'Falsche Zeitform: Der Vorfall steht in der Vergangenheit, die Forderung im Präsens oder mit „würde".',
          ],
        },
        {
          heading: 'Muster in Kurzform',
          paragraphs: [
            'Sehr geehrte Damen und Herren, am 12. Mai habe ich in Ihrem Online-Shop eine Jacke bestellt (Bestellnummer 4471). Leider musste ich beim Auspacken feststellen, dass der Reißverschluss defekt ist und die Jacke außerdem eine andere Farbe hat als bestellt. Da ich die Jacke für eine Reise am 25. Mai brauche, bitte ich Sie, mir schnellstmöglich ein einwandfreies Exemplar in der richtigen Farbe zu schicken. Falls das nicht möglich ist, erwarte ich die Rückerstattung des Kaufpreises. Bitte antworten Sie mir bis zum 20. Mai. Mit freundlichen Grüßen, Amira Haddad.',
            'Etwa 90 Wörter, vier Absätze, alle Inhaltspunkte — das ist das Format, das die Prüfung verlangt.',
          ],
        },
      ],
      howToHeading: 'Beschwerdebriefe mit SchreibCoach üben',
      howToSteps: [
        { title: 'Aufgabe wählen', text: 'Die App stellt Beschwerde-Aufgaben im Prüfungsformat mit Inhaltspunkten und Wortvorgabe.' },
        { title: 'Brief schreiben', text: 'Du schreibst frei; die App prüft Aufbau, Register, Zeitformen und ob alle Punkte abgedeckt sind.' },
        { title: 'Korrektur lesen', text: 'Fehler werden markiert und erklärt — nicht nur verbessert, damit du sie beim nächsten Mal selbst vermeidest.' },
        { title: 'Redemittel sammeln', text: 'Gelungene Formulierungen wandern in deine persönliche Liste für die Prüfung.' },
      ],
      faqs: [
        {
          question: 'Darf ich im Beschwerdebrief „du" verwenden?',
          answer: 'Nein. Beschwerden gehen an Firmen oder Behörden und stehen immer in der Sie-Form — mit förmlicher Anrede und Grußformel.',
        },
        {
          question: 'Wie lang muss der Brief sein?',
          answer: 'Die Aufgabe gibt eine Wortzahl vor, bei B1 meist 80 bis 120 Wörter. Wichtiger als die Länge ist, dass alle genannten Inhaltspunkte behandelt werden.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'telc-b1-vs-goethe-b1-schreiben',
      lang: 'de',
      keyword: 'telc b1 oder goethe b1',
      title: 'telc B1 oder Goethe B1: Unterschiede im Schreibteil und welche Prüfung zu dir passt',
      metaTitle: 'telc B1 vs Goethe B1 – Unterschiede, Schreibteil, Anerkennung',
      metaDescription:
        'Beide Zertifikate gelten für Einbürgerung und Aufenthalt. Wie sich Schreibaufgaben, Bewertung, Zeit und Terminangebot unterscheiden und welche Prüfung für dein Ziel die richtige ist.',
      excerpt: 'Gleiche Anerkennung, verschiedene Prüfung: Wo sich telc und Goethe beim Schreiben unterscheiden.',
      intro: [
        'Für die Einbürgerung, die Niederlassungserlaubnis und die meisten Ausbildungen reicht ein B1-Zertifikat — und in Deutschland kommt es fast immer von telc oder vom Goethe-Institut. Beide sind gleich anerkannt. Trotzdem lohnt sich der Vergleich, weil sich Format und Bewertung unterscheiden und weil das Terminangebot darüber entscheidet, wie schnell du das Zertifikat in der Hand hast.',
        'Der Schreibteil ist der Teil, in dem sich die beiden Prüfungen am deutlichsten unterscheiden.',
      ],
      sections: [
        {
          heading: 'Der Schreibteil im Vergleich',
          bullets: [
            'Goethe-Zertifikat B1: Drei Aufgaben in 60 Minuten — eine informelle E-Mail oder ein Brief, ein Diskussionsbeitrag zu einer Meinungsfrage und eine kurze formelle Nachricht. Drei Textsorten, drei Register.',
            'telc Deutsch B1 (Zertifikat Deutsch): Eine Aufgabe in 30 Minuten — ein halbformeller oder formeller Brief zu einer Situation mit vier Leitpunkten, von denen mindestens drei behandelt werden müssen.',
            'Goethe verlangt mehr Textsorten und Tempo; telc verlangt einen längeren, sorgfältiger ausgearbeiteten Brief.',
          ],
        },
        {
          heading: 'Bewertung und Bestehen',
          bullets: [
            'Goethe: Die vier Module Lesen, Hören, Schreiben, Sprechen werden einzeln bestanden und können einzeln wiederholt werden. Wer nur im Schreiben scheitert, wiederholt nur das Schreiben.',
            'telc: Schriftliche Prüfung (Lesen, Sprachbausteine, Hören, Schreiben) und mündliche Prüfung werden getrennt bewertet; die schriftliche Prüfung zählt als Ganzes. Wer im Schreiben schwach ist, kann das durch Lesen und Hören ausgleichen — oder umgekehrt daran scheitern.',
            'Bei beiden liegt die Bestehensgrenze bei 60 Prozent.',
          ],
        },
        {
          heading: 'Praktische Unterschiede',
          bullets: [
            'Termine: telc-Prüfungen bieten Volkshochschulen und Sprachschulen fast überall und oft; Goethe-Termine sind seltener und früher ausgebucht.',
            'Kosten: In der Regel zwischen 150 und 250 Euro, telc meist etwas günstiger.',
            'Ergebnis: telc typischerweise nach vier bis sechs Wochen, Goethe oft schneller.',
            'Integrationskurs: Der Abschlusstest „Deutsch-Test für Zuwanderer" ist eine telc-Prüfung und ersetzt das B1-Zertifikat für Einbürgerung und Aufenthalt.',
          ],
        },
        {
          heading: 'Welche passt zu dir',
          paragraphs: [
            'Wer beim Schreiben unsicher ist, aber Lesen und Hören gut beherrscht, hat bei telc bessere Chancen, weil die schriftliche Prüfung als Ganzes zählt. Wer in einem Bereich klar stark und in einem klar schwach ist, profitiert bei Goethe von der Modulwiederholung.',
            'Wer schnell einen Termin braucht, landet meist bei telc. Wer das Zertifikat im Ausland oder für ein Studium außerhalb Deutschlands verwenden will, ist mit Goethe oft besser bedient, weil der Name international bekannter ist.',
          ],
        },
      ],
      howToHeading: 'Für beide Formate mit SchreibCoach vorbereiten',
      howToSteps: [
        { title: 'Prüfungsformat wählen', text: 'Die App enthält Aufgaben im telc- und im Goethe-Format, mit den jeweiligen Zeit- und Wortvorgaben.' },
        { title: 'Textsorten trainieren', text: 'Formeller Brief, informelle E-Mail, Meinungsbeitrag — jede mit eigener Struktur und eigenen Redemitteln.' },
        { title: 'Unter Zeitdruck schreiben', text: 'Der Timer simuliert die 30 oder 60 Minuten der echten Prüfung.' },
        { title: 'Bewertung verstehen', text: 'Die Korrektur folgt den Kriterien der Prüfungsanbieter — Inhalt, Aufbau, Wortschatz, Grammatik.' },
      ],
      faqs: [
        {
          question: 'Akzeptiert die Einbürgerungsbehörde beide Zertifikate?',
          answer: 'Ja. Für die Einbürgerung gilt ein B1-Zertifikat eines anerkannten Anbieters — telc, Goethe, der Deutsch-Test für Zuwanderer und einige weitere.',
        },
        {
          question: 'Kann ich bei telc nur den Schreibteil wiederholen?',
          answer: 'Nein. Bei telc wird die schriftliche Prüfung als Ganzes wiederholt; nur die mündliche Prüfung ist getrennt. Modulweise Wiederholung gibt es beim Goethe-Zertifikat.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'Was macht SchreibCoach?',
      answer:
        'SchreibCoach trainiert den Prüfungsteil Schreiben für Deutsch B1: typische Aufgaben wie informelle E-Mail, Forumsbeitrag und formelle Nachricht, mit Timer, KI-Korrektur und korrigierter Beispielversion deines Textes.',
      learnMoreSlug: 'b1-pruefung-schreiben-aufgaben',
    },
    {
      question: 'Passt die App zu telc, Goethe und ÖSD?',
      answer:
        'Die Textsorten und Bewertungskriterien auf B1 ähneln sich bei allen drei Anbietern stark, deshalb ist das Training übertragbar. Die App ist unabhängig und nicht offiziell mit Prüfungsinstituten verbunden.',
      learnMoreSlug: 'b1-pruefung-schreiben-aufgaben',
    },
    {
      question: 'Wie funktioniert die Korrektur?',
      answer:
        'Dein Text wird nach prüfungsnahen Kriterien bewertet — Inhalt, Aufbau, Wortschatz und Grammatik — mit konkreten Verbesserungen und einer korrigierten Fassung deines eigenen Textes.',
      learnMoreSlug: 'typische-fehler-b1-schreiben',
    },
    {
      question: 'Hilft die App auch für formelle Briefe im Alltag?',
      answer: 'Ja. Die formelle Nachricht ist genau der Brieftyp, den man für Vermieter, Krankenkasse, Arbeitgeber und Behörden braucht.',
      learnMoreSlug: 'formelle-email-deutsch-schreiben',
    },
    {
      question: 'Garantiert die App, dass ich bestehe?',
      answer: 'Nein. Die KI-Korrektur ist Lernfeedback und keine Garantie für ein bestimmtes Prüfungsergebnis.',
    },
    {
      question: 'Ist SchreibCoach kostenlos?',
      answer:
        'Die App ist kostenlos ladbar und in den Grundfunktionen nutzbar. Pro schaltet alle Aufgaben, unbegrenzte Korrekturen und die vollständige Auswertung frei.',
    },
  ],
  ctaHeading: 'Schreiben üben — und endlich wissen, was falsch war',
  ctaText: 'SchreibCoach kostenlos laden, ersten B1-Text schreiben und in einer Minute die Korrektur lesen.',
  category: 'EducationalApplication',
  downloadNote: 'Kostenlos laden • Optionale In-App-Käufe',
};
