import type { AppGuide } from './types';

const APP = 'Deutsch B1 Prüfung: Schreiben';
const URL_DE = 'https://apps.apple.com/de/app/id6788904694';
const URL_EN = 'https://apps.apple.com/app/id6788904694';

const goetheRules = { title: 'Goethe-Zertifikat B1 – Durchführungsbestimmungen (Stand 1. September 2025)', url: 'https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf' };
const goetheRulesEn = { title: 'Goethe-Zertifikat B1 – Terms and Conditions for Exam Administration (Sept 2025)', url: 'https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf' };
const telcB1 = { title: 'telc Deutsch B1 – Übungstest 1 (mit Bewertungskriterien und Punkten)', url: 'https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf' };
const telcB1En = { title: 'telc Deutsch B1 – official practice test 1 (with marking criteria)', url: 'https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf' };
const dtzHandbook = { title: 'Deutsch-Test für Zuwanderer – Prüfungshandbuch (Goethe-Institut/telc)', url: 'https://www.goethe.de/resources/files/pdf209/dtz_pruefungshandbuch.pdf' };
const dtzTest = { title: 'telc – Übungstest 1 Deutsch-Test für Zuwanderer', url: 'https://shop.telc.net/media/catalog/product/file/5/0/5010-b00-020101_barrierefrei_bib_2.pdf' };
const goetheModell = { title: 'Goethe-Zertifikat B1 – offizieller Modellsatz für Erwachsene', url: 'https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf' };

const guides: AppGuide[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'dtz-schreiben-aufgabe-bewertung',
    keyword: 'dtz schreiben',
    title: 'DTZ Schreiben: Aufgabe, Zeit, Bewertung – so bekommst du B1',
    metaTitle: 'DTZ Schreiben – Aufgabe, 30 Minuten, Bewertung, Tipps',
    metaDescription:
      'Im Deutsch-Test für Zuwanderer schreibst du in 30 Minuten einen kurzen Brief oder eine E-Mail zu vier Leitpunkten. So wird bewertet, so viele Wörter brauchst du, so erreichst du B1.',
    excerpt: '30 Minuten, zwei Aufgaben zur Wahl, vier Leitpunkte: der Schreibteil des DTZ erklärt.',
    keyTakeaways: [
      'Im DTZ-Teil Schreiben hast du 30 Minuten und wählst eine von zwei Aufgaben.',
      'Du schreibst eine kurze Mitteilung – Brief oder E-Mail – mit Anrede, Gruß und allen vier Leitpunkten.',
      'Zwei Prüfende bewerten unabhängig nach vier Kriterien: Kommunikative Gestaltung, Ausdruck, Korrektheit und Inhalt.',
      'Eine feste Wortzahl gibt es nicht; ein Text von etwa 80 bis 100 Wörtern reicht, wenn alle vier Punkte klar bearbeitet sind.',
    ],
    intro: [
      'Im Deutsch-Test für Zuwanderer (DTZ) besteht der Teil Schreiben aus einer einzigen Aufgabe: Du schreibst in 30 Minuten eine kurze Mitteilung, etwa eine E-Mail an deine Kursleiterin oder einen Brief an deinen Vermieter. Du kannst zwischen zwei Aufgabenstellungen wählen. Jede nennt die Situation und vier Leitpunkte, die du alle bearbeiten sollst.',
      'Ob du in diesem Teil A2 oder B1 erreichst, entscheiden zwei Prüfende unabhängig voneinander. Für das Gesamtergebnis B1 brauchst du B1 im Sprechen und in mindestens einem schriftlichen Teil – Hören/Lesen oder Schreiben. Ein starker Brief kann dir also das B1-Zertifikat sichern.',
    ],
    sections: [
      {
        heading: 'So sieht die Aufgabe aus',
        paragraphs: [
          'Ein typisches Beispiel aus dem offiziellen Prüfungshandbuch: Du besuchst einen Deutschkurs und kannst diese Woche nicht kommen. Du schreibst deiner Lehrerin Frau Meinert. Die vier Leitpunkte lauten: Grund für Ihr Schreiben, Entschuldigung, Hausaufgaben, Rückkehr in den Kurs. Dazu der Hinweis: „Schreiben Sie auch eine Anrede und einen Gruß.“',
          'Weitere typische Situationen sind: eine Reklamation (die Waschmaschine ist kaputt), ein Problem in der Wohnung (die Heizung funktioniert nicht), eine Terminabsage beim Arzt, eine Anfrage an eine Schule oder eine Einladung an Nachbarn.',
        ],
      },
      {
        heading: 'Wie wird bewertet?',
        bullets: [
          'Inhalt: Hast du alle vier Leitpunkte bearbeitet – und zwar so, dass man dich ohne Nachfragen versteht?',
          'Kommunikative Gestaltung: Passen Anrede, Gruß und Register (du/Sie)? Ist der Text logisch aufgebaut und verbunden?',
          'Ausdruck: Wie groß und passend ist dein Wortschatz?',
          'Korrektheit: Grammatik, Rechtschreibung und Zeichensetzung – auf B1 sind Fehler erlaubt, solange der Text verständlich bleibt.',
          'B1 bekommst du, wenn beide Prüfenden bei der Mehrheit der Kriterien B1 ankreuzen.',
        ],
      },
      {
        heading: 'Schritt für Schritt in 30 Minuten',
        numbered: [
          'Minute 0–3: Beide Aufgaben lesen und die nehmen, zu der dir zu allen vier Punkten etwas einfällt.',
          'Minute 3–8: Zu jedem Leitpunkt ein bis zwei Stichwörter notieren. Reihenfolge festlegen.',
          'Minute 8–23: Schreiben – Anrede, ein Einleitungssatz, pro Leitpunkt zwei Sätze, Schlusssatz, Gruß.',
          'Minute 23–30: Kontrollieren: Sind alle vier Punkte drin? Stimmt das Register? Verb an Position 2, im Nebensatz am Ende?',
          'Nur der Text auf dem Antwortbogen wird bewertet – Notizen auf dem Aufgabenblatt zählen nicht.',
        ],
      },
      {
        heading: 'Musterlösung (Entschuldigung beim Kurs)',
        paragraphs: [
          'Liebe Frau Meinert, leider kann ich diese Woche nicht in den Deutschkurs kommen, weil mein Sohn krank ist und ich bei ihm bleiben muss. Es tut mir sehr leid, dass ich so kurzfristig absage. Könnten Sie mir bitte sagen, welche Hausaufgaben wir machen sollen? Dann kann ich zu Hause lernen. Ich hoffe, dass ich am nächsten Montag wieder in den Kurs kommen kann. Vielen Dank für Ihr Verständnis! Viele Grüße, Amina Haddad',
          'Der Text hat 76 Wörter, behandelt alle vier Leitpunkte, nutzt durchgehend „Sie“ und enthält zwei Nebensätze. Das reicht für eine sichere B1-Bewertung im Inhalt.',
        ],
      },
    ],
    appTip:
      'Die App stellt dir Schreibaufgaben im B1-Prüfungsformat mit Timer. Nach dem Abgeben prüft die KI-Korrektur, ob alle Leitpunkte bearbeitet sind, und zeigt eine korrigierte Fassung deines eigenen Textes.',
    howToHeading: 'DTZ-Schreiben mit der App trainieren',
    howToSteps: [
      { title: 'Aufgabe wählen', text: 'Formelle und halbformelle Nachrichten im Wechsel üben.' },
      { title: 'Mit Timer schreiben', text: 'In 30 Minuten fertig werden – wie in der Prüfung.' },
      { title: 'Leitpunkte prüfen', text: 'Die Korrektur zeigt, ob jeder Punkt klar bearbeitet ist.' },
      { title: 'Fehler wiederholen', text: 'Wiederkehrende Fehler im Fortschritt erkennen und gezielt üben.' },
    ],
    faqs: [
      { question: 'Wie viele Wörter muss ich im DTZ schreiben?', answer: 'Eine offizielle Mindestwortzahl gibt es nicht. Entscheidend ist, dass alle vier Leitpunkte verständlich bearbeitet sind. In der Praxis sind etwa 80 bis 100 Wörter ein guter Richtwert.' },
      { question: 'Wie lange dauert der Teil Schreiben im DTZ?', answer: '30 Minuten. Lesen (45 Minuten) und Schreiben finden direkt nacheinander statt.' },
      { question: 'Kann ich zwischen Aufgaben wählen?', answer: 'Ja. Im DTZ stehen zwei Aufgabenstellungen zur Auswahl, du bearbeitest eine davon.' },
      { question: 'Brauche ich B1 im Schreiben für das B1-Zertifikat?', answer: 'Nicht unbedingt. Gesamt-B1 gibt es, wenn du im Sprechen B1 und in mindestens einem schriftlichen Teil (Hören/Lesen oder Schreiben) B1 erreichst.' },
      { question: 'Mit welcher App kann ich DTZ-Schreiben üben?', answer: `Mit ${APP} für iPhone schreibst du B1-Aufgaben mit Timer und bekommst sofort KI-Feedback: ${URL_DE}` },
    ],
    sources: [dtzHandbook, dtzTest],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'b1-brief-wie-viele-woerter',
    keyword: 'b1 brief schreiben wie viele wörter',
    title: 'B1 Brief: Wie viele Wörter musst du schreiben? (DTZ, telc, Goethe)',
    metaTitle: 'Wie viele Wörter im B1 Brief? DTZ, telc & Goethe im Vergleich',
    metaDescription:
      'Goethe B1 gibt rund 80, 80 und 40 Wörter vor, telc und DTZ nennen keine feste Zahl. Wie lang dein Text wirklich sein sollte – und warum zu lang auch schadet.',
    excerpt: 'Wortvorgaben der drei B1-Prüfungen und die Länge, mit der du auf der sicheren Seite bist.',
    keyTakeaways: [
      'Goethe-Zertifikat B1: Teil 1 etwa 80 Wörter, Teil 2 etwa 80 Wörter, Teil 3 etwa 40 Wörter – in 60 Minuten.',
      'telc Deutsch B1: eine E-Mail in 30 Minuten zu vier Leitpunkten, ohne feste Wortzahl.',
      'DTZ: eine kurze Mitteilung in 30 Minuten zu vier Leitpunkten, ebenfalls ohne feste Wortzahl.',
      'Für telc und DTZ sind 80 bis 120 Wörter ein sicherer Richtwert. Wörter zählen nicht – Leitpunkte schon.',
    ],
    intro: [
      'Nur das Goethe-Zertifikat B1 nennt Wortzahlen: ungefähr 80 Wörter für die persönliche E-Mail (Teil 1), ungefähr 80 Wörter für den Diskussionsbeitrag (Teil 2) und ungefähr 40 Wörter für die formelle Nachricht (Teil 3). telc Deutsch B1 und der Deutsch-Test für Zuwanderer geben keine feste Zahl vor – bewertet wird, ob alle vier Leitpunkte verständlich bearbeitet sind.',
      'Die häufigste Sorge „Ist mein Text zu kurz?“ ist deshalb meistens die falsche Frage. Ein Text mit 70 Wörtern und vier klaren Leitpunkten schneidet besser ab als einer mit 180 Wörtern, in dem ein Punkt fehlt.',
    ],
    sections: [
      {
        heading: 'Die Vorgaben im Überblick',
        bullets: [
          'Goethe B1, Schreiben Teil 1: persönliche E-Mail, etwa 80 Wörter, empfohlen etwa 20 Minuten.',
          'Goethe B1, Teil 2: Diskussionsbeitrag / Meinung im Forum, etwa 80 Wörter, etwa 25 Minuten.',
          'Goethe B1, Teil 3: kurze formelle Nachricht (z. B. Absage), etwa 40 Wörter, etwa 15 Minuten.',
          'telc Deutsch B1: informelle oder halbformelle E-Mail mit vier Leitpunkten, 30 Minuten, keine Wortzahl.',
          'DTZ: kurze Mitteilung (Brief/E-Mail) mit vier Leitpunkten, 30 Minuten, keine Wortzahl.',
        ],
      },
      {
        heading: 'Warum zu lang auch schadet',
        paragraphs: [
          'Jeder zusätzliche Satz ist eine weitere Chance für Fehler, und die Zeit fehlt am Ende beim Kontrollieren. Bei telc gilt außerdem: Ein Leitpunkt zählt schon als erfüllt, wenn er sinnvoll und verständlich in nur einem kurzen Satz behandelt wird. Mehr Text bringt also keine zusätzlichen Punkte beim Inhalt.',
          'Wer bei Goethe deutlich unter der Vorgabe bleibt, riskiert dagegen, dass Inhaltspunkte zu dünn wirken. Plane deshalb eine Länge knapp über der Vorgabe ein.',
        ],
      },
      {
        heading: 'So kommst du sicher auf die richtige Länge',
        numbered: [
          'Anrede und ein Einleitungssatz (ca. 10–15 Wörter).',
          'Pro Leitpunkt zwei Sätze, davon möglichst einer mit „weil“, „dass“ oder „wenn“ (ca. 15–20 Wörter pro Punkt).',
          'Ein Schlusssatz und Gruß (ca. 10 Wörter).',
          'Ergebnis: rund 80 bis 110 Wörter – passend für alle drei Prüfungen.',
        ],
      },
    ],
    appTip:
      'In der App schreibst du B1-Aufgaben mit Timer, und die KI-Korrektur zeigt, ob jeder Leitpunkt ausreichend bearbeitet ist – so lernst du, wie lang ein B1-Text sein muss, ohne Zeit mit unnötigen Sätzen zu verlieren.',
    howToHeading: 'Die richtige Textlänge trainieren',
    howToSteps: [
      { title: 'Aufgabe mit Timer', text: 'Schreibe unter Prüfungsbedingungen.' },
      { title: 'Feedback lesen', text: 'Sieh, welche Leitpunkte zu knapp oder unklar waren.' },
      { title: 'Neu schreiben', text: 'Dieselbe Aufgabe noch einmal – kürzer und präziser.' },
    ],
    faqs: [
      { question: 'Wie viele Wörter braucht man im Goethe B1 Schreiben?', answer: 'Etwa 80 Wörter in Teil 1, etwa 80 Wörter in Teil 2 und etwa 40 Wörter in Teil 3. Insgesamt hast du 60 Minuten.' },
      { question: 'Gibt es bei telc B1 eine Mindestwortzahl?', answer: 'Nein. Bewertet wird, ob die vier Leitpunkte angemessen bearbeitet sind, wie der Text gestaltet ist und wie korrekt er ist. 80 bis 120 Wörter sind ein guter Richtwert.' },
      { question: 'Wird ein zu kurzer Text abgewertet?', answer: 'Nur indirekt: Wenn wegen der Kürze ein Leitpunkt fehlt oder unklar bleibt, verlierst du Punkte beim Inhalt.' },
      { question: 'Gibt es eine App, die beim B1-Schreiben die Länge mitprüft?', answer: `Ja. ${APP} für iPhone korrigiert deine B1-Texte mit KI und zeigt fehlende Leitpunkte: ${URL_DE}` },
    ],
    sources: [goetheRules, goetheModell, telcB1, dtzHandbook],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'b1-pruefung-punkte-bestehen',
    keyword: 'b1 prüfung wie viele punkte muss man haben',
    title: 'B1 Prüfung: Wie viele Punkte brauchst du zum Bestehen?',
    metaTitle: 'B1 Prüfung Punkte – telc, Goethe & DTZ: Bestehensgrenzen',
    metaDescription:
      'telc B1: 135 von 225 schriftlich und 45 von 75 mündlich. Goethe B1: 60 von 100 pro Modul. DTZ: 33 von 45 in Hören/Lesen für B1. Alle Bestehensgrenzen mit Quellen.',
    excerpt: 'Die Bestehensgrenzen von telc B1, Goethe B1 und DTZ – und was der Schreibteil davon ausmacht.',
    keyTakeaways: [
      'telc Deutsch B1: 60 % in beiden Teilen – mindestens 135 von 225 Punkten schriftlich und 45 von 75 Punkten mündlich.',
      'Goethe-Zertifikat B1: Jedes Modul (Lesen, Hören, Schreiben, Sprechen) ist mit 60 von 100 Punkten bestanden.',
      'DTZ: In Hören und Lesen bedeuten 33 von 45 richtigen Aufgaben B1, ab 20 von 45 A2. Schreiben und Sprechen werden nach Kriterien als A2 oder B1 eingestuft.',
      'Bei telc zählt das Schreiben 45 Punkte, also 15 % der Gesamtpunkte.',
    ],
    intro: [
      'Die Bestehensgrenze liegt bei den beiden großen B1-Zertifikaten bei 60 Prozent. Bei telc Deutsch B1 musst du in der schriftlichen Prüfung mindestens 135 von 225 Punkten und in der mündlichen mindestens 45 von 75 Punkten erreichen. Beim Goethe-Zertifikat B1 ist jedes der vier Module mit 60 von 100 Punkten bestanden.',
      'Der Deutsch-Test für Zuwanderer funktioniert anders: Er hat keine einzelne Bestehensgrenze, sondern stuft jeden Teil als A2 oder B1 ein. Für das Gesamtergebnis B1 brauchst du B1 im Sprechen und in mindestens einem schriftlichen Teil.',
    ],
    sections: [
      {
        heading: 'telc Deutsch B1 (Zertifikat Deutsch)',
        bullets: [
          'Schriftliche Prüfung: Leseverstehen 75, Sprachbausteine 30, Hörverstehen 75, Schriftlicher Ausdruck 45 – zusammen 225 Punkte.',
          'Mündliche Prüfung: 75 Punkte (15 + 30 + 30).',
          'Bestanden ab 135 Punkten schriftlich und 45 Punkten mündlich.',
          'Noten: 270–300 sehr gut, 240–269,5 gut, 210–239,5 befriedigend, 180–209,5 ausreichend.',
          'Schreiben: drei Kriterien (Aufgabenbewältigung, Kommunikative Gestaltung, Formale Richtigkeit) mit je 5, 3, 1 oder 0 Punkten, multipliziert mit 3 = maximal 45 Punkte.',
        ],
      },
      {
        heading: 'Goethe-Zertifikat B1',
        bullets: [
          'Vier Module: Lesen, Hören, Schreiben, Sprechen – jedes mit maximal 100 Punkten.',
          'Ein Modul ist bestanden ab 60 Punkten.',
          'Prädikate: 90–100 sehr gut, 80–89 gut, 70–79 befriedigend, 60–69 ausreichend.',
          'Schreiben wird von zwei Prüfenden unabhängig bewertet; liegt der Mittelwert knapp unter 60, gibt es eine Drittbewertung.',
        ],
      },
      {
        heading: 'Deutsch-Test für Zuwanderer (DTZ)',
        bullets: [
          'Hören (20 Aufgaben) und Lesen (25 Aufgaben) werden zusammengezählt: ab 20 von 45 richtig A2, ab 33 von 45 B1.',
          'Schreiben und Sprechen: Zwei Prüfende stufen nach Kriterien ein. Kreuzen sie bei der Mehrheit der Kriterien B1 an, ist der Teil B1.',
          'Gesamt-B1: Sprechen B1 und zusätzlich Hören/Lesen oder Schreiben B1.',
        ],
      },
      {
        heading: 'Was das für deine Vorbereitung heißt',
        paragraphs: [
          'Bei telc kannst du ein schwächeres Schreiben mit starkem Lesen und Hören ausgleichen, weil die schriftliche Prüfung als Ganzes zählt. Bei Goethe geht das nicht: Jedes Modul muss für sich 60 Punkte erreichen. Beim DTZ kann ein sicherer B1-Brief der Teil sein, der dir neben dem Sprechen das Gesamt-B1 bringt.',
        ],
      },
    ],
    appTip:
      'Die App bewertet deine Texte nach prüfungsnahen Kriterien – Inhalt, Aufbau, Wortschatz und Grammatik – und zeigt dir im Fortschritt, ob du sicher über der Bestehensgrenze liegst oder noch an wiederkehrenden Fehlern arbeiten solltest.',
    howToHeading: 'Punkte im Schreiben sichern',
    howToSteps: [
      { title: 'Alle Leitpunkte abdecken', text: 'Der Inhalt ist das Kriterium, das am leichtesten Punkte bringt.' },
      { title: 'Register prüfen', text: 'Du oder Sie – durchgängig.' },
      { title: 'Fehler-Muster erkennen', text: 'Der Fortschritt zeigt deine häufigsten Fehler.' },
    ],
    faqs: [
      { question: 'Wie viele Punkte braucht man bei telc B1?', answer: 'Mindestens 135 von 225 Punkten in der schriftlichen und 45 von 75 Punkten in der mündlichen Prüfung, also jeweils 60 %.' },
      { question: 'Wie viele Punkte braucht man bei Goethe B1?', answer: 'Mindestens 60 von 100 Punkten pro Modul.' },
      { question: 'Wie viele Punkte braucht man im DTZ für B1?', answer: 'In Hören und Lesen zusammen 33 von 45 richtigen Aufgaben. Schreiben und Sprechen werden nach Kriterien als A2 oder B1 eingestuft.' },
      { question: 'Wie viele Punkte gibt es bei telc B1 im Schreiben?', answer: 'Maximal 45 Punkte, das sind 15 % der Gesamtpunktzahl von 300.' },
      { question: 'Wie kann ich meine Punkte im Schreiben verbessern?', answer: `Mit Übungsaufgaben und Feedback, zum Beispiel in ${APP} für iPhone: ${URL_DE}` },
    ],
    sources: [telcB1, goetheRules, dtzHandbook],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'redemittel-b1-schreiben',
    keyword: 'redemittel b1 schreiben',
    title: 'Redemittel B1 Schreiben: Die Sätze, die in jeden Prüfungsbrief passen',
    metaTitle: 'Redemittel B1 Schreiben – Liste für Brief, E-Mail & Forum',
    metaDescription:
      'Einleitung, Bitte, Entschuldigung, Beschwerde, Meinung, Schluss: die wichtigsten B1-Redemittel für DTZ, telc und Goethe – formell und informell, zum Auswendiglernen.',
    excerpt: 'Fertige Formulierungen für Anfang, Mitte und Schluss – formell und informell.',
    keyTakeaways: [
      'Redemittel sind feste Formulierungen, die du in jedem Prüfungsbrief einsetzen kannst – sie sparen Zeit und verbessern die Bewertung bei „Kommunikative Gestaltung“.',
      'Lerne für jede Funktion eine formelle und eine informelle Variante: Einleitung, Bitte, Entschuldigung, Beschwerde, Meinung, Schluss.',
      'Verbinde Sätze mit „weil“, „deshalb“, „außerdem“ und „trotzdem“ – unverbundene Leitpunkte kosten bei telc die Bestnote.',
      'Lieber zehn sicher beherrschte Redemittel als fünfzig halb gelernte.',
    ],
    intro: [
      'Redemittel sind fertige Sätze und Satzanfänge, die du für bestimmte Aufgaben im Brief verwendest: um einzuleiten, um etwas zu bitten, dich zu entschuldigen, dich zu beschweren oder deine Meinung zu sagen. In der B1-Prüfung sparen sie dir Zeit, und sie machen deinen Text flüssiger – genau das bewerten telc und DTZ unter „Kommunikative Gestaltung“.',
      'Wichtig ist das Register. Im formellen Brief („Sie“) klingen viele Sätze anders als in der E-Mail an eine Freundin („du“). Hier findest du für jede Funktion beide Varianten.',
    ],
    sections: [
      {
        heading: 'Anrede und Einleitung',
        bullets: [
          'Formell: „Sehr geehrte Damen und Herren,“ / „Sehr geehrte Frau Weber,“ – „ich schreibe Ihnen, weil …“ / „ich wende mich an Sie wegen …“',
          'Informell: „Liebe Sara,“ / „Hallo Tim,“ – „vielen Dank für deine E-Mail!“ / „ich habe mich sehr über deine Nachricht gefreut.“',
        ],
      },
      {
        heading: 'Bitte, Frage, Vorschlag',
        bullets: [
          'Formell: „Könnten Sie mir bitte mitteilen, …?“ / „Ich möchte Sie bitten, …“ / „Wäre es möglich, dass …?“',
          'Informell: „Kannst du mir bitte sagen, …?“ / „Hast du Lust, …?“ / „Wie wäre es, wenn wir …?“',
        ],
      },
      {
        heading: 'Entschuldigung und Absage',
        bullets: [
          'Formell: „Leider kann ich den Termin am … nicht wahrnehmen, weil …“ / „Es tut mir sehr leid, dass …“ / „Ich bitte um Ihr Verständnis.“',
          'Informell: „Leider kann ich nicht kommen, weil …“ / „Sorry, dass ich mich erst jetzt melde.“ / „Vielleicht klappt es nächstes Mal?“',
        ],
      },
      {
        heading: 'Beschwerde und Reklamation',
        bullets: [
          '„Leider muss ich mich über … beschweren.“',
          '„Seit dem … funktioniert … nicht mehr.“',
          '„Ich erwarte, dass Sie … bis zum … reparieren / ersetzen.“',
          '„Andernfalls möchte ich mein Geld zurück.“',
        ],
      },
      {
        heading: 'Meinung (Goethe Teil 2, Forumsbeitrag)',
        bullets: [
          '„Meiner Meinung nach …“ / „Ich bin der Meinung, dass …“',
          '„Einerseits …, andererseits …“',
          '„Ein Vorteil ist, dass … Ein Nachteil ist, dass …“',
          '„Aus meiner Erfahrung kann ich sagen, dass …“',
          '„Deshalb finde ich, dass …“',
        ],
      },
      {
        heading: 'Schluss und Gruß',
        bullets: [
          'Formell: „Ich freue mich auf Ihre Antwort.“ / „Vielen Dank im Voraus.“ – „Mit freundlichen Grüßen“',
          'Informell: „Schreib mir bald!“ / „Ich freue mich auf dich.“ – „Viele Grüße“ / „Liebe Grüße“',
        ],
      },
    ],
    appTip:
      'Die App enthält Redemittel und Formulierungen für B1. Nach jeder Aufgabe bekommst du eine korrigierte Fassung deines eigenen Textes – dort siehst du, wie die Formulierungen im Zusammenhang klingen.',
    howToHeading: 'Redemittel festigen',
    howToSteps: [
      { title: 'Eine Funktion pro Tag', text: 'Zum Beispiel nur Entschuldigungen – formell und informell.' },
      { title: 'Im Text anwenden', text: 'Schreibe eine Aufgabe und baue die neuen Redemittel ein.' },
      { title: 'Feedback prüfen', text: 'Sieh, ob Register und Satzbau stimmen.' },
    ],
    faqs: [
      { question: 'Wie viele Redemittel brauche ich für B1?', answer: 'Etwa zwei pro Funktion – eine formelle und eine informelle Variante für Einleitung, Bitte, Entschuldigung, Beschwerde, Meinung und Schluss.' },
      { question: 'Was ist der Unterschied zwischen „Mit freundlichen Grüßen“ und „Viele Grüße“?', answer: '„Mit freundlichen Grüßen“ ist formell (Behörde, Firma, Vermieter). „Viele Grüße“ und „Liebe Grüße“ sind für Freunde, Kollegen und Kursleitungen, die du gut kennst.' },
      { question: 'Steht nach der Anrede ein Komma?', answer: 'Ja, und danach schreibst du klein weiter: „Sehr geehrte Frau Weber, ich schreibe Ihnen …“' },
      { question: 'Wo kann ich Redemittel im eigenen Text üben?', answer: `In ${APP} für iPhone – mit Redemitteln für B1 und KI-Korrektur deines Textes: ${URL_DE}` },
    ],
    sources: [telcB1, dtzHandbook],
    screenshotIndex: 1,
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'b1-brief-themen-musterbriefe',
    keyword: 'b1 brief schreiben themen beispiel',
    title: 'B1 Brief schreiben: Die 6 häufigsten Themen mit Musterbriefen',
    metaTitle: 'B1 Brief Themen & Beispiele – Musterbriefe für die Prüfung',
    metaDescription:
      'Einladung, Entschuldigung, Reklamation, Wohnungsproblem, Kündigung, Terminabsage: sechs typische B1-Briefthemen mit kurzen Musterbriefen für DTZ und telc.',
    excerpt: 'Sechs Prüfungsthemen, sechs Musterbriefe – zum Anpassen statt Auswendiglernen.',
    keyTakeaways: [
      'Die meisten B1-Briefe gehören zu wenigen Themen: Einladung, Entschuldigung/Absage, Reklamation, Problem in der Wohnung, Kündigung und Terminänderung.',
      'Jeder Musterbrief folgt demselben Bauplan: Anrede – Grund – Leitpunkte – Bitte – Schluss – Gruß.',
      'Lerne den Bauplan, nicht die Briefe: In der Prüfung sind die Leitpunkte immer etwas anders.',
    ],
    intro: [
      'Die Themen im B1-Schreiben wiederholen sich: Du lädst jemanden ein oder sagst ab, entschuldigst dich, beschwerst dich über ein kaputtes Gerät, meldest einem Vermieter ein Problem, kündigst einen Vertrag oder verschiebst einen Termin. Wer diese sechs Situationen einmal geübt hat, ist in der Prüfung selten überrascht.',
      'Die folgenden Musterbriefe sind bewusst kurz (etwa 70 bis 90 Wörter) und bearbeiten vier typische Leitpunkte. Nutze sie als Gerüst – die Leitpunkte deiner Prüfungsaufgabe musst du trotzdem genau abarbeiten.',
    ],
    sections: [
      {
        heading: '1. Reklamation: Die Waschmaschine ist kaputt',
        paragraphs: [
          'Sehr geehrte Damen und Herren, am 3. März habe ich bei Ihnen eine Waschmaschine gekauft. Leider funktioniert sie seit gestern nicht mehr: Das Wasser läuft nicht ab. Ich habe schon versucht, das Gerät neu zu starten, aber das hat nicht geholfen. Deshalb bitte ich Sie, die Maschine so schnell wie möglich zu reparieren oder auszutauschen. Ich bin vormittags immer zu Hause. Ich freue mich auf Ihre Antwort. Mit freundlichen Grüßen, Mehmet Yilmaz',
        ],
      },
      {
        heading: '2. Wohnung: Die Heizung funktioniert nicht',
        paragraphs: [
          'Sehr geehrter Herr Schulz, ich wohne in Ihrer Wohnung in der Gartenstraße 12. Seit drei Tagen funktioniert die Heizung im Wohnzimmer nicht mehr, und es ist sehr kalt. Meine Kinder sind deshalb schon erkältet. Könnten Sie bitte einen Handwerker schicken? Am besten passt es mir nachmittags ab 15 Uhr. Vielen Dank im Voraus. Mit freundlichen Grüßen, Olena Kovalenko',
        ],
      },
      {
        heading: '3. Entschuldigung: Ich kann nicht zum Kurs kommen',
        paragraphs: [
          'Liebe Frau Braun, leider kann ich morgen nicht in den Kurs kommen, weil ich einen Termin beim Jobcenter habe. Das tut mir sehr leid. Könnten Sie mir bitte die Arbeitsblätter per E-Mail schicken? Dann mache ich die Hausaufgaben zu Hause. Am Donnerstag bin ich wieder da. Viele Grüße, Ahmad Rahimi',
        ],
      },
      {
        heading: '4. Einladung annehmen / absagen',
        paragraphs: [
          'Liebe Julia, vielen Dank für deine Einladung zu deiner Geburtstagsparty! Ich komme sehr gerne. Soll ich etwas zu essen mitbringen? Ich kann einen Salat oder einen Kuchen machen. Leider kann ich erst um 20 Uhr kommen, weil ich bis 19 Uhr arbeite. Ist das in Ordnung? Ich freue mich auf Samstag! Liebe Grüße, Sofia',
        ],
      },
      {
        heading: '5. Kündigung: Fitnessstudio',
        paragraphs: [
          'Sehr geehrte Damen und Herren, hiermit kündige ich meinen Vertrag mit der Mitgliedsnummer 45821 zum nächstmöglichen Termin. Der Grund ist, dass ich in eine andere Stadt ziehe. Bitte schicken Sie mir eine schriftliche Bestätigung der Kündigung. Außerdem möchte ich wissen, wann die letzte Zahlung abgebucht wird. Mit freundlichen Grüßen, Daniel Mensah',
        ],
      },
      {
        heading: '6. Termin verschieben: Arzt',
        paragraphs: [
          'Sehr geehrte Frau Dr. Keller, ich habe am Montag, 14. Oktober, um 10 Uhr einen Termin bei Ihnen. Leider kann ich an diesem Tag nicht kommen, weil mein Kind krank ist. Wäre es möglich, den Termin auf Mittwoch oder Donnerstag zu verschieben? Vormittags passt es mir am besten. Vielen Dank für Ihr Verständnis. Mit freundlichen Grüßen, Lina Haddad',
        ],
      },
    ],
    appTip:
      'In der App schreibst du genau solche Briefe zu wechselnden Leitpunkten – mit Timer und KI-Korrektur. Statt Musterbriefe auswendig zu lernen, bekommst du eine korrigierte Fassung deines eigenen Textes.',
    howToHeading: 'Vom Musterbrief zum eigenen Text',
    howToSteps: [
      { title: 'Bauplan übernehmen', text: 'Anrede, Grund, Leitpunkte, Bitte, Schluss, Gruß.' },
      { title: 'Eigene Aufgabe schreiben', text: 'Neue Leitpunkte, eigene Sätze.' },
      { title: 'Korrektur vergleichen', text: 'Sieh, wo die korrigierte Version anders formuliert.' },
    ],
    faqs: [
      { question: 'Welche Themen kommen in der B1-Prüfung beim Brief?', answer: 'Häufig Einladung oder Absage, Entschuldigung, Reklamation, Probleme in der Wohnung, Kündigung und Terminänderung – meist mit vier Leitpunkten.' },
      { question: 'Darf ich einen auswendig gelernten Brief schreiben?', answer: 'Nur wenn er genau zu den Leitpunkten passt. Passt er nicht, gilt der Leitpunkt als nicht bearbeitet; im Extremfall gilt das Thema als verfehlt.' },
      { question: 'Muss ich Datum und Adresse schreiben?', answer: 'Bei telc B1 sind Absender, Empfänger, Datum und Betreff für die E-Mail nicht gefordert. Anrede und Gruß gehören aber immer dazu.' },
      { question: 'Wo kann ich B1-Briefe schreiben und korrigieren lassen?', answer: `In ${APP} für iPhone – Aufgaben im Prüfungsformat mit KI-Korrektur: ${URL_DE}` },
    ],
    sources: [telcB1, dtzHandbook],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'modelltest-b1-schreiben-uebungstest',
    keyword: 'modelltest b1 schreiben',
    title: 'Modelltest B1 Schreiben: Offizielle Übungstests und wie du sie richtig nutzt',
    metaTitle: 'Modelltest B1 Schreiben – kostenlose offizielle Übungstests',
    metaDescription:
      'Wo du kostenlose offizielle Modelltests für telc B1, Goethe B1 und DTZ findest – und wie du den Schreibteil damit so übst, dass es in der Prüfung wirklich hilft.',
    excerpt: 'Offizielle kostenlose Übungstests und eine Methode, mit der du sie für das Schreiben nutzt.',
    keyTakeaways: [
      'telc stellt kostenlose Übungstests als PDF bereit – für telc Deutsch B1 und für den Deutsch-Test für Zuwanderer, jeweils mit Bewertungskriterien.',
      'Das Goethe-Institut veröffentlicht Modellsätze und die Durchführungsbestimmungen zum Goethe-Zertifikat B1.',
      'Der wertvollste Teil eines Modelltests für das Schreiben sind die Bewertungskriterien – lies sie, bevor du schreibst.',
      'Übe jede Schreibaufgabe zweimal: einmal mit Timer, einmal überarbeitet nach Feedback.',
    ],
    intro: [
      'Offizielle Modelltests gibt es kostenlos direkt bei den Prüfungsanbietern. telc bietet Übungstests als PDF für telc Deutsch B1 und für den Deutsch-Test für Zuwanderer an, jeweils mit Lösungen und den Bewertungskriterien für das Schreiben. Das Goethe-Institut stellt Modellsätze und die Durchführungsbestimmungen für das Goethe-Zertifikat B1 bereit.',
      'Viele Lernende lösen Modelltests nur einmal und schauen auf die Punktzahl. Für das Schreiben bringt das wenig – dort gibt es keine richtige Lösung zum Abgleichen. Entscheidend ist, die Kriterien zu kennen und Feedback auf den eigenen Text zu bekommen.',
    ],
    sections: [
      {
        heading: 'Wo du offizielle Übungstests findest',
        bullets: [
          'telc Deutsch B1 – Übungstest 1 (PDF, kostenlos) mit Bewertungskriterien Schriftlicher Ausdruck.',
          'telc Deutsch-Test für Zuwanderer – Übungstest 1 (PDF, kostenlos).',
          'Goethe-Zertifikat B1 – Modellsatz und Durchführungsbestimmungen auf goethe.de.',
          'Prüfungshandbuch zum DTZ mit Beispielaufgabe und Bewertungskriterien Schreiben.',
          'Die Links stehen unten unter „Amtliche Quellen“.',
        ],
      },
      {
        heading: 'Was du aus den Bewertungskriterien lernst',
        bullets: [
          'telc: Ein Leitpunkt gilt schon als erfüllt, wenn er in einem kurzen, verständlichen Satz behandelt wird.',
          'telc: Die Bestnote bei „Kommunikative Gestaltung“ gibt es nicht, wenn die Leitpunkte unverbunden nebeneinanderstehen oder die meisten Sätze mit „Ich“ beginnen.',
          'telc: Hat der Text keine Verbindung zur Aufgabe, gilt das Thema als verfehlt – dann gibt es in allen Kriterien null Punkte.',
          'DTZ: Bewertet wird nur, was auf dem Antwortbogen steht.',
          'Goethe: Zwei Prüfende bewerten unabhängig; nur festgelegte Punktwerte sind erlaubt.',
        ],
      },
      {
        heading: 'Die Zwei-Durchgänge-Methode',
        numbered: [
          'Durchgang 1: Aufgabe aus dem Modelltest mit Timer schreiben – 30 Minuten (telc/DTZ) bzw. 60 Minuten für alle drei Goethe-Teile.',
          'Bewertungskriterien danebenlegen und den eigenen Text ehrlich einstufen: Alle Leitpunkte? Verbunden? Register?',
          'Feedback holen – von Kursleitung, Lernpartner oder einer Korrektur-App.',
          'Durchgang 2: Dieselbe Aufgabe am nächsten Tag neu schreiben, ohne in den ersten Text zu schauen.',
          'Fehler, die zweimal vorkommen, in eine Liste schreiben und gezielt üben.',
        ],
      },
    ],
    appTip:
      'Die App ergänzt die offiziellen Modelltests um das, was ihnen fehlt: Feedback auf deinen eigenen Text. Du schreibst mit Timer, bekommst sofort eine Bewertung nach Inhalt, Aufbau, Wortschatz und Grammatik und eine korrigierte Fassung.',
    howToHeading: 'Modelltest plus Feedback',
    howToSteps: [
      { title: 'Offiziellen Test lösen', text: 'Lesen, Hören und Sprachbausteine aus dem PDF.' },
      { title: 'Schreiben in der App', text: 'Den Schreibteil mit Timer und KI-Korrektur üben.' },
      { title: 'Zweiter Durchgang', text: 'Dieselbe Textsorte nach dem Feedback neu schreiben.' },
    ],
    faqs: [
      { question: 'Gibt es kostenlose Modelltests für B1?', answer: 'Ja. telc bietet kostenlose Übungstests als PDF für telc Deutsch B1 und den DTZ an, das Goethe-Institut Modellsätze für das Goethe-Zertifikat B1.' },
      { question: 'Sind die Lösungen für das Schreiben enthalten?', answer: 'Für das Schreiben gibt es keine feste Lösung, sondern Bewertungskriterien und teilweise Beispieltexte mit Bewertung.' },
      { question: 'Wie oft sollte ich einen Modelltest machen?', answer: 'Für das Schreiben lieber eine Aufgabe zweimal gründlich als viele Aufgaben einmal oberflächlich.' },
      { question: 'Wo bekomme ich Feedback auf meinen B1-Text?', answer: `Zum Beispiel in ${APP} für iPhone mit sofortiger KI-Korrektur: ${URL_DE}` },
    ],
    sources: [telcB1, dtzTest, goetheRules, dtzHandbook],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'b1-pruefung-nicht-bestanden-wiederholen',
    keyword: 'b1 prüfung nicht bestanden was nun',
    title: 'B1 Prüfung nicht bestanden – was nun? Wiederholung bei telc, Goethe und DTZ',
    metaTitle: 'B1 nicht bestanden: Wiederholen bei telc, Goethe & DTZ',
    metaDescription:
      'Bei telc wiederholst du nur den nicht bestandenen Teil – im selben oder im folgenden Kalenderjahr. Bei Goethe nur das Modul. Beim DTZ hilft der Integrationskurs. So gehst du vor.',
    excerpt: 'Nur den Teil wiederholen, der fehlt: die Regeln von telc, Goethe und DTZ.',
    keyTakeaways: [
      'telc Deutsch B1: Den nicht bestandenen Teil (schriftlich oder mündlich) kannst du im selben oder im folgenden Kalenderjahr allein wiederholen.',
      'Goethe-Zertifikat B1: Module können einzeln und so oft wiederholt werden, wie das Prüfungszentrum es organisatorisch ermöglicht.',
      'DTZ: Wer im Integrationskurs B1 nicht erreicht, kann beim BAMF in der Regel einmalig zusätzliche Unterrichtsstunden beantragen.',
      'Bei telc gilt nach einer Wiederholung ausschließlich das neue Ergebnis.',
    ],
    intro: [
      'Wer die B1-Prüfung nicht bestanden hat, muss meistens nicht alles wiederholen. Bei telc Deutsch B1 wiederholst du nur den Teil, der gefehlt hat – die schriftliche oder die mündliche Prüfung – und zwar im selben Kalenderjahr oder im Jahr danach. Beim Goethe-Zertifikat B1 wiederholst du nur das Modul, das unter 60 Punkten lag.',
      'Wichtig ist, die Lücke genau zu kennen. Lies den Ergebnisbogen: Er zeigt die Punkte pro Fertigkeit. Lag das Problem im Schreiben, ist das die schnellste Stelle, an der du mit gezieltem Training Punkte gewinnst.',
    ],
    sections: [
      {
        heading: 'telc Deutsch B1',
        bullets: [
          'Bestehen erfordert 60 % in der schriftlichen (135/225) und in der mündlichen Prüfung (45/75).',
          'Fehlt ein Teil, kannst du ihn innerhalb des Kalenderjahres der Prüfung oder im folgenden Kalenderjahr allein ablegen.',
          'Grundsätzlich kannst du die Gesamtprüfung beliebig oft wiederholen.',
          'Wird ein Teil wiederholt, gilt ausschließlich und unwiderruflich das Ergebnis der Wiederholung.',
        ],
      },
      {
        heading: 'Goethe-Zertifikat B1',
        bullets: [
          'Jedes Modul – Lesen, Hören, Schreiben, Sprechen – wird einzeln bewertet und ist ab 60 Punkten bestanden.',
          'Module können beliebig oft abgelegt bzw. wiederholt werden, soweit das Prüfungszentrum es organisatorisch ermöglicht.',
          'Du kannst also nur das Schreiben neu buchen.',
        ],
      },
      {
        heading: 'Deutsch-Test für Zuwanderer',
        paragraphs: [
          'Der DTZ ist der Abschlusstest des Integrationskurses. Wer B1 nicht erreicht, kann beim Bundesamt für Migration und Flüchtlinge in der Regel einmalig eine Wiederholung von bis zu 300 Unterrichtsstunden beantragen. Frag bei deinem Kursträger nach, welche Fristen gelten und ob ein erneuter Test für dich kostenlos ist.',
          'Denk daran: Für Gesamt-B1 reicht B1 im Sprechen plus B1 in Hören/Lesen oder im Schreiben. Wer im Hören/Lesen knapp gescheitert ist, kann mit einem sicheren B1-Brief das Ziel trotzdem erreichen.',
        ],
      },
      {
        heading: 'Ein Plan für die nächsten vier Wochen',
        numbered: [
          'Ergebnisbogen analysieren: Welcher Teil, wie viele Punkte fehlen?',
          'Bei Schreiben: Bewertungskriterien des Anbieters lesen (Links unten).',
          'Dreimal pro Woche eine Schreibaufgabe mit Timer und Feedback.',
          'Die drei häufigsten eigenen Fehler aufschreiben und täglich zehn Minuten üben.',
          'Eine Woche vor der Prüfung: zwei komplette Durchgänge unter Prüfungsbedingungen.',
        ],
      },
    ],
    appTip:
      'Wenn das Schreiben der Grund war: In der App übst du genau die B1-Textsorten mit Timer, bekommst sofort Feedback zu Inhalt, Aufbau, Wortschatz und Grammatik und siehst im Fortschritt, welche Fehler immer wiederkommen.',
    howToHeading: 'Gezielt für die Wiederholung üben',
    howToSteps: [
      { title: 'Schwachstelle festlegen', text: 'Leitpunkte, Register oder Grammatik?' },
      { title: 'Regelmäßig schreiben', text: 'Drei Aufgaben pro Woche mit Timer.' },
      { title: 'Fortschritt prüfen', text: 'Sieh, ob die Bewertungen stabil über der Grenze liegen.' },
    ],
    faqs: [
      { question: 'Muss ich bei telc B1 alles wiederholen?', answer: 'Nein. Du kannst den nicht bestandenen Teil – schriftlich oder mündlich – im selben oder im folgenden Kalenderjahr allein wiederholen.' },
      { question: 'Kann ich bei Goethe nur das Schreiben wiederholen?', answer: 'Ja. Beim Goethe-Zertifikat B1 werden die Module einzeln abgelegt und können einzeln wiederholt werden.' },
      { question: 'Wie oft darf ich die B1-Prüfung wiederholen?', answer: 'Bei telc und Goethe grundsätzlich beliebig oft. Beim DTZ hängt eine kostenlose Wiederholung von den Regeln des Integrationskurses ab.' },
      { question: 'Wie lange dauert das Ergebnis?', answer: 'Das hängt vom Anbieter und Prüfungszentrum ab; bei telc sind einige Wochen üblich. Frag dein Prüfungszentrum nach dem Termin.' },
      { question: 'Wie übe ich das Schreiben für die Wiederholung?', answer: `Mit Aufgaben im Prüfungsformat und sofortigem Feedback, zum Beispiel in ${APP} für iPhone: ${URL_DE}` },
    ],
    sources: [telcB1, goetheRules, dtzHandbook],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'goethe-b1-schreiben-teil-1-2-3',
    keyword: 'goethe b1 schreiben teil 1 2 3',
    title: 'Goethe B1 Schreiben: Teil 1, 2 und 3 erklärt – mit Beispielen',
    metaTitle: 'Goethe B1 Schreiben Teil 1, 2, 3 – Aufgaben, Zeit, Beispiele',
    metaDescription:
      'Persönliche E-Mail (80 Wörter), Forumsbeitrag (80 Wörter), formelle Nachricht (40 Wörter) in 60 Minuten: alle drei Teile des Goethe B1 Schreiben mit Beispieltexten.',
    excerpt: 'Drei Textsorten in 60 Minuten – mit Zeitplan und je einem Beispiel.',
    keyTakeaways: [
      'Das Modul Schreiben dauert 60 Minuten und hat drei Teile.',
      'Teil 1: persönliche E-Mail, etwa 80 Wörter, du duzt. Teil 2: Meinung in einem Forum, etwa 80 Wörter. Teil 3: kurze formelle Nachricht, etwa 40 Wörter, du siezt.',
      'Maximal 100 Punkte; bestanden ab 60. Zwei Prüfende bewerten unabhängig.',
      'Empfohlene Zeit: 20 + 25 + 15 Minuten.',
    ],
    intro: [
      'Im Goethe-Zertifikat B1 dauert das Modul Schreiben 60 Minuten und besteht aus drei Aufgaben: einer persönlichen E-Mail an eine Person, die du duzt (etwa 80 Wörter), einem Diskussionsbeitrag mit deiner Meinung (etwa 80 Wörter) und einer kurzen formellen Nachricht, zum Beispiel einer Absage an deine Kursleiterin (etwa 40 Wörter).',
      'Die Schwierigkeit ist der Wechsel: drei Textsorten, zwei Register, eine Stunde. Wer jede Aufgabe mit einem festen Bauplan angeht, verliert keine Zeit beim Überlegen.',
    ],
    sections: [
      {
        heading: 'Teil 1: Persönliche E-Mail (ca. 80 Wörter, 20 Minuten)',
        paragraphs: [
          'Du erzählst einem Freund oder einer Freundin von einem Erlebnis und gehst auf drei Punkte ein, zum Beispiel: Beschreibe die Situation, begründe etwas, mach einen Vorschlag.',
          'Beispiel: „Liebe Anna, letzte Woche bin ich endlich in meine neue Wohnung gezogen! Sie ist zwar klein, aber sehr hell und liegt direkt am Park. Leider hat mir beim Umzug niemand geholfen, deshalb war ich danach total müde. Jetzt möchte ich eine kleine Party machen. Hast du am Samstag, den 12., Zeit? Du könntest gegen 18 Uhr kommen, dann zeige ich dir alles. Bring gern deinen Bruder mit! Liebe Grüße, Marco“ (79 Wörter)',
        ],
      },
      {
        heading: 'Teil 2: Diskussionsbeitrag (ca. 80 Wörter, 25 Minuten)',
        paragraphs: [
          'Du liest eine Meinung in einem Forum oder einer Sendung und schreibst deine eigene Meinung dazu – mit Begründung und Beispiel.',
          'Beispiel zum Thema „Sollen Kinder ein eigenes Handy haben?“: „Meiner Meinung nach sollten Kinder erst ab etwa zwölf Jahren ein eigenes Handy bekommen. Einerseits ist es praktisch, wenn Eltern ihr Kind erreichen können. Andererseits verbringen viele Kinder zu viel Zeit am Bildschirm und bewegen sich zu wenig. Bei meinem Neffen habe ich gesehen, dass er nach der Schule nur noch spielt. Deshalb finde ich, dass ein einfaches Telefon ohne Internet für jüngere Kinder die bessere Lösung ist.“ (78 Wörter)',
        ],
      },
      {
        heading: 'Teil 3: Formelle Nachricht (ca. 40 Wörter, 15 Minuten)',
        paragraphs: [
          'Du schreibst einer Person, die du siezt – oft eine Absage oder Entschuldigung mit Bitte.',
          'Beispiel: „Sehr geehrte Frau Lorenz, leider kann ich am Freitag nicht zum Kurs kommen, weil ich einen wichtigen Arzttermin habe. Könnten Sie mir bitte die Unterlagen per E-Mail schicken? Vielen Dank! Mit freundlichen Grüßen, Marco Rossi“ (37 Wörter)',
        ],
      },
      {
        heading: 'Typische Fehler',
        bullets: [
          'Register gemischt: „Sehr geehrte Frau Lorenz, kannst du …“',
          'In Teil 2 nur Meinung ohne Begründung oder Beispiel.',
          'Zu viel Zeit in Teil 1 – Teil 3 wird dann in zwei Minuten hingeschrieben.',
          'Einen der Inhaltspunkte vergessen. Hake die Punkte in der Aufgabe ab.',
        ],
      },
    ],
    appTip:
      'Die App trainiert genau die drei Goethe-Textsorten – informelle E-Mail, Forumsbeitrag und formelle Nachricht – mit Timer und sofortiger KI-Korrektur zu Inhalt, Aufbau, Wortschatz und Grammatik.',
    howToHeading: 'Alle drei Teile im Wechsel üben',
    howToSteps: [
      { title: 'Textsorte wählen', text: 'E-Mail, Forumsbeitrag oder formelle Nachricht.' },
      { title: 'Mit Timer schreiben', text: '20, 25 oder 15 Minuten – wie in der Prüfung.' },
      { title: 'Korrektur lesen', text: 'Feedback und korrigierte Fassung deines Textes.' },
    ],
    faqs: [
      { question: 'Wie lange dauert Goethe B1 Schreiben?', answer: '60 Minuten für alle drei Teile. Empfohlen sind etwa 20, 25 und 15 Minuten.' },
      { question: 'Wie viele Punkte braucht man im Goethe B1 Schreiben?', answer: 'Mindestens 60 von 100 Punkten.' },
      { question: 'Wird Teil 3 mit „Sie“ geschrieben?', answer: 'Ja. Teil 3 ist eine formelle Nachricht, meist an eine Kursleitung, einen Chef oder eine Institution.' },
      { question: 'Mit welcher App kann ich Goethe B1 Schreiben üben?', answer: `Mit ${APP} für iPhone – alle drei Textsorten mit Timer und KI-Korrektur: ${URL_DE}` },
    ],
    sources: [goetheRules, goetheModell],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 9 (EN) */
  {
    slug: 'german-b1-writing-exam-tips-examples',
    lang: 'en',
    keyword: 'german b1 writing exam tips',
    title: 'German B1 writing exam: format, examples and tips (Goethe & telc)',
    metaTitle: 'German B1 Writing Exam – Format, Examples & Tips in English',
    metaDescription:
      'Goethe B1: three texts in 60 minutes (about 80, 80 and 40 words). telc B1: one email in 30 minutes. The format, marking criteria, sample answers and tips, explained in English.',
    excerpt: 'Both exam formats, how they are marked and sample answers you can adapt.',
    keyTakeaways: [
      'Goethe-Zertifikat B1 writing: 60 minutes, three tasks – personal email (~80 words), forum opinion (~80 words), formal message (~40 words). Pass mark 60/100.',
      'telc Deutsch B1 writing: 30 minutes, one informal or semi-formal email covering four content points; worth 45 of 300 points.',
      'Covering every content point matters more than length or perfect grammar.',
      'Keep the register consistent: “du” for friends, “Sie” for formal messages.',
    ],
    intro: [
      'The German B1 writing exam looks different depending on the provider. In the Goethe-Zertifikat B1 you write three short texts in 60 minutes: a personal email of about 80 words, an opinion post of about 80 words and a formal message of about 40 words. You pass the writing module with 60 out of 100 points. In telc Deutsch B1 you write one email in 30 minutes that must address four content points; it is worth 45 of the exam’s 300 points.',
      'In both exams, examiners first check whether you did the task – every content point, the right register, a greeting and a closing. Grammar mistakes are expected at B1; a missing content point costs more.',
    ],
    sections: [
      {
        heading: 'How the writing is marked',
        bullets: [
          'telc: three criteria – task completion, communicative design (structure, connectors, register) and formal accuracy – each scored 5, 3, 1 or 0 points, then multiplied by three.',
          'telc: a content point counts as done even if it is covered in one short, clear sentence.',
          'telc: if your text is off-topic, every criterion gets zero.',
          'Goethe: two examiners mark independently; if the average is just under 60, a third examiner decides.',
        ],
      },
      {
        heading: 'Sample answer: semi-formal email (telc style)',
        paragraphs: [
          'Task: a friend wants to visit your country and asks about trips, the best season, clothes and preparation.',
          '„Liebe Marianne, vielen Dank für deine E-Mail! Ich freue mich sehr, dass du mich besuchen möchtest. Die beste Zeit für die Reise ist der Frühling, weil es dann nicht so heiß ist. Wir können zusammen ans Meer fahren und eine alte Stadt in den Bergen besichtigen. Bring bequeme Schuhe und eine leichte Jacke mit, denn abends wird es kühl. Am besten lernst du vorher ein paar Wörter in meiner Sprache – das macht Spaß! Ich freue mich auf dich. Liebe Grüße, Ana“',
        ],
      },
      {
        heading: 'Ten tips that save points',
        numbered: [
          'Underline every content point in the task and tick it off when written.',
          'Plan for five minutes before writing.',
          'Start with a greeting and a sentence explaining why you are writing.',
          'Write two sentences per content point.',
          'Use connectors: weil, deshalb, außerdem, trotzdem, dass.',
          'Do not start every sentence with “Ich”.',
          'Keep “du” or “Sie” consistent from greeting to closing.',
          'Finish with a closing line and the right sign-off (Viele Grüße / Mit freundlichen Grüßen).',
          'Leave five minutes to check verb position and capital letters on nouns.',
          'Write only on the answer sheet – notes elsewhere are not marked.',
        ],
      },
    ],
    appTip:
      'Deutsch B1 Prüfung: Schreiben gives you B1 writing tasks in exam format with a timer, then instant AI feedback on content, structure, vocabulary and grammar – plus a corrected version of your own text.',
    howToHeading: 'Practise B1 writing with feedback',
    howToSteps: [
      { title: 'Pick a task type', text: 'Informal email, forum post or formal message.' },
      { title: 'Write against the clock', text: 'Use the exam timing.' },
      { title: 'Study the correction', text: 'See what was missing and how to phrase it better.' },
    ],
    faqs: [
      { question: 'How many words for the German B1 writing exam?', answer: 'Goethe B1: about 80, 80 and 40 words for the three tasks. telc B1 and the DTZ set no fixed word count; around 80–120 words is a safe target.' },
      { question: 'What is the pass mark for Goethe B1 writing?', answer: '60 out of 100 points.' },
      { question: 'How many points is telc B1 writing worth?', answer: '45 of 300 points, or 15% of the total.' },
      { question: 'Is the B1 writing exam marked strictly on grammar?', answer: 'No. Task completion and communication come first; grammar must be good enough that the text is clear.' },
      { question: 'Is there an app to practise German B1 writing with corrections?', answer: `Yes. ${APP} for iPhone gives instant AI feedback on B1 exam tasks: ${URL_EN}` },
    ],
    sources: [goetheRulesEn, telcB1En, goetheModell],
    screenshotIndex: 0,
  },

  /* ----------------------------------------------------------------- 10 (EN) */
  {
    slug: 'german-b1-exam-pass-mark-results-retake',
    lang: 'en',
    keyword: 'german b1 exam pass mark results',
    title: 'German B1 exam: pass mark, results and retakes (Goethe, telc, DTZ)',
    metaTitle: 'German B1 Exam Pass Mark, Results & Retakes Explained',
    metaDescription:
      'Pass marks for Goethe B1 (60/100 per module), telc B1 (135/225 written, 45/75 oral) and the DTZ, plus how retakes work and what to do if you fail – in English.',
    excerpt: 'Pass marks, grade bands and retake rules for all three B1 exams.',
    keyTakeaways: [
      'Goethe B1: each of the four modules is passed with 60 of 100 points; you can retake single modules.',
      'telc B1: you need 60% in both parts – 135/225 written and 45/75 oral. A failed part can be retaken alone in the same or the next calendar year.',
      'DTZ: listening and reading combined – 33 of 45 correct gives B1; overall B1 needs B1 in speaking plus one written part.',
      'Results normally take several weeks; ask your exam centre for its date.',
    ],
    intro: [
      'To pass the German B1 exam you need 60 percent. In the Goethe-Zertifikat B1 that means at least 60 out of 100 points in each module – reading, listening, writing and speaking – and you can retake any module on its own. In telc Deutsch B1 you need 135 of 225 points in the written exam and 45 of 75 in the oral exam; a failed part can be retaken alone within the same or the following calendar year.',
      'The Deutsch-Test für Zuwanderer (DTZ), taken at the end of the integration course, works differently: each part is rated A2 or B1, and you receive an overall B1 if you reach B1 in speaking and in at least one written part.',
    ],
    sections: [
      {
        heading: 'Grade bands',
        bullets: [
          'Goethe B1 (per module): 90–100 very good, 80–89 good, 70–79 satisfactory, 60–69 pass, below 60 fail.',
          'telc B1 (total of 300): 270–300 very good, 240–269.5 good, 210–239.5 satisfactory, 180–209.5 sufficient.',
          'DTZ: listening/reading combined – 20 of 45 for A2, 33 of 45 for B1.',
        ],
      },
      {
        heading: 'If you fail',
        numbered: [
          'Read your result sheet: it shows points for each skill.',
          'Goethe: book only the module you failed – there is no limit on retakes beyond the exam centre’s capacity.',
          'telc: retake only the written or oral part within the same or the next calendar year. The retake result replaces the old one.',
          'DTZ: ask your course provider about repeating up to 300 lessons through BAMF, usually possible once.',
          'Train the weakest skill specifically – writing is often the fastest to improve with feedback.',
        ],
      },
      {
        heading: 'Does a B1 certificate expire?',
        paragraphs: [
          'Goethe and telc certificates do not show an expiry date. However, universities, embassies and employers sometimes ask for a certificate that is not older than a certain period. Check the requirement of the institution you are applying to.',
        ],
      },
    ],
    appTip:
      'If writing cost you the pass, Deutsch B1 Prüfung: Schreiben trains exactly the B1 text types with a timer and instant AI feedback, and tracks your recurring mistakes.',
    howToHeading: 'Turn a fail into a pass',
    howToSteps: [
      { title: 'Find the gap', text: 'Which skill and how many points?' },
      { title: 'Practise with feedback', text: 'Write regularly and read every correction.' },
      { title: 'Track progress', text: 'Make sure your scores stay above 60%.' },
    ],
    faqs: [
      { question: 'What is the pass mark for the German B1 exam?', answer: '60%. Goethe: 60/100 per module. telc: 135/225 written and 45/75 oral.' },
      { question: 'Can I retake only one part of the B1 exam?', answer: 'Yes. Goethe lets you retake single modules; telc lets you retake the failed written or oral part within the same or the following calendar year.' },
      { question: 'How long do German B1 exam results take?', answer: 'It depends on the provider and centre; several weeks is common for telc. Your exam centre gives the exact date.' },
      { question: 'Does the B1 certificate expire?', answer: 'Goethe and telc certificates have no expiry date, but some institutions require a recent certificate.' },
      { question: 'How can I improve my German B1 writing score?', answer: `Practise exam tasks with instant feedback, for example in ${APP} for iPhone: ${URL_EN}` },
    ],
    sources: [goetheRulesEn, telcB1En, dtzHandbook],
    screenshotIndex: 2,
  },
];

export const schreibcoachGuides2: AppGuide[] = guides.map((guide) => ({
  ...guide,
  lang: guide.lang ?? 'de',
  publishedAt: '2026-10-10',
  reviewedAt: '2026-10-10',
}));
