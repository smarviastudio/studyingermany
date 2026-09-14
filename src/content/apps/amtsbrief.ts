import { ScanLine, Languages, CalendarClock, SquarePen, FileText, ShieldCheck } from 'lucide-react';
import type { AppContent } from './types';

export const amtsbrief: AppContent = {
  slug: 'amtsbrief-uebersetzer-app',
  appId: '6787681296',
  name: 'Amtsbrief AI',
  storeName: 'Amtsbrief: Post Übersetzer',
  subtitle: 'Behördenpost scannen & verstehen',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/amtsbrief-post-übersetzer/id6787681296',
  icon: '/apps/amtsbrief/icon.webp',
  accent: '#0ea5e9',
  accentDark: '#0369a1',
  heroTitle: {
    pre: 'Behördenbriefe scannen und',
    highlight: 'endlich verstehen',
    post: '',
  },
  heroDescription:
    'Amtsbrief AI erklärt deutsche Behördenpost in deiner Sprache. Brief scannen, verständliche Zusammenfassung lesen, Fristen und Beträge auf einen Blick sehen — und bei Bedarf direkt eine formelle Antwort auf Deutsch entwerfen.',
  heroBenefits: [
    'Brief scannen, PDF importieren oder Text einfügen',
    'Verständliche Zusammenfassung in deiner Sprache',
    'Frist, Betrag, Aktenzeichen und nächste Schritte erkennen',
    'Formelle Antwort oder Widerspruch auf Deutsch entwerfen',
    'Fristerinnerung setzen und Antwort als PDF exportieren',
  ],
  metaTitle: 'Amtsbrief AI – Behördenbriefe scannen & verstehen',
  metaDescription:
    'Post vom Finanzamt oder der Ausländerbehörde verstehen: Amtsbrief AI scannt den Brief, erklärt ihn in deiner Sprache und erkennt Fristen.',
  metaKeywords:
    'behördenbrief verstehen, amtsbrief übersetzen, behördendeutsch übersetzer, brief vom jobcenter, finanzamt brief erklären, ausländerbehörde brief, widerspruch schreiben, amtliche post app, deutsche behördenpost',
  screenshots: [
    { src: '/apps/amtsbrief/screenshot-1.webp', alt: 'Amtsbrief AI – Behördenbrief scannen und verständliche Erklärung erhalten' },
    { src: '/apps/amtsbrief/screenshot-2.webp', alt: 'Amtsbrief AI – Fristen, Beträge und nächste Schritte auf einen Blick' },
  ],
  audience: [
    {
      badge: 'Neu in Deutschland',
      title: 'Zugewanderte & Internationale',
      description: 'Behördendeutsch ist auch für Muttersprachler schwer. Wer neu hier ist, bekommt die Erklärung in der eigenen Sprache — inklusive der Frage, was jetzt zu tun ist.',
      color: '#0369a1',
    },
    {
      badge: 'Studium',
      title: 'Studierende & Berufseinsteiger',
      description: 'BAföG, Krankenkasse, Rundfunkbeitrag, Finanzamt: die erste eigene Post kommt gebündelt und ohne Anleitung.',
      color: '#7c3aed',
    },
    {
      badge: 'Alltag',
      title: 'Alle mit stapelweise Post',
      description: 'Bescheide, Mahnungen, Anhörungen und Inkassoschreiben — sortiert nach dem, was wirklich eine Frist hat.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: ScanLine,
      title: 'Brief erfassen, wie es passt',
      description:
        'Mit der Kamera scannen, ein PDF importieren, ein Foto hinzufügen oder den Text einfach einfügen. Auch mehrseitige Bescheide sind kein Problem.',
      color: '#0369a1',
    },
    {
      icon: Languages,
      title: 'Erklärung in deiner Sprache',
      description:
        'Die App fasst den Brief in einfacher Sprache zusammen — auf Deutsch oder in deiner Muttersprache — und übersetzt die typischen Begriffe aus dem Behördendeutsch.',
      color: '#7c3aed',
    },
    {
      icon: CalendarClock,
      title: 'Fristen sofort sichtbar',
      description:
        'Absender, Brieftyp, Frist, Beträge, IBAN und Aktenzeichen werden herausgezogen und übersichtlich angezeigt. Für die Frist lässt sich direkt eine Erinnerung setzen.',
      color: '#dc2626',
    },
    {
      icon: SquarePen,
      title: 'Antwort auf Deutsch entwerfen',
      description:
        'Widerspruch, Fristverlängerung, Rückfrage oder einfache Antwort: Die App entwirft ein formell korrektes Schreiben auf Deutsch, das du vor dem Versenden prüfst und anpasst.',
      color: '#059669',
    },
    {
      icon: FileText,
      title: 'Als A4-PDF exportieren',
      description:
        'Die fertige Antwort lässt sich kopieren, teilen oder als sauberes A4-PDF exportieren — bereit zum Ausdrucken und Abschicken.',
      color: '#d97706',
    },
    {
      icon: ShieldCheck,
      title: 'Klar in den Grenzen',
      description:
        'Amtsbrief AI ist ein KI-Assistent und keine Rechtsberatung. Die App sagt dir, was im Brief steht und was üblicherweise als Nächstes kommt — die Entscheidung bleibt bei dir.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Brief scannen', description: 'Mit der Kamera aufnehmen, PDF importieren oder Text einfügen.' },
    { title: 'Zusammenfassung lesen', description: 'In einfacher Sprache: Wer schreibt, worum geht es, was ist gefordert.' },
    { title: 'Frist notieren', description: 'Frist und Beträge werden erkannt — Erinnerung mit einem Tipp setzen.' },
    { title: 'Antwort entwerfen', description: 'Formelles Schreiben auf Deutsch erstellen, prüfen und als PDF exportieren.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Amtsbrief AI ist kostenlos ladbar und in den Grundfunktionen kostenlos nutzbar.',
  pricingPro: {
    name: 'Amtsbrief Pro',
    bullets: [
      'Mehr Briefe analysieren',
      'Antwortschreiben und PDF-Export',
      'Abo oder einmalige Lifetime-Freischaltung',
      'Kostenlose Funktionen bleiben nutzbar',
    ],
    note: 'Optionaler In-App-Kauf',
  },
  guides: [
    {
      slug: 'behoerdenbrief-verstehen',
      keyword: 'behördenbrief verstehen',
      title: 'Behördenbrief verstehen: die 7 Dinge, auf die es ankommt',
      metaTitle: 'Behördenbrief verstehen: Frist, Betrag & Schritte',
      metaDescription:
        'Bescheid, Anhörung oder Mahnung? So liest du einen deutschen Behördenbrief richtig: Absender, Brieftyp, Frist, Betrag und Aktenzeichen.',
      excerpt: 'Absender, Brieftyp, Frist, Betrag, Aktenzeichen: die sieben Stellen, die in jedem Bescheid wirklich zählen.',
      intro: [
        'Ein deutscher Behördenbrief ist selten kurz und nie freundlich formuliert. Das Entscheidende steht dabei fast immer an denselben Stellen — der Rest ist Verwaltungssprache, die man beim ersten Lesen überspringen kann.',
        'Wer weiß, wonach er sucht, braucht für die wichtigsten Fragen zwei Minuten: Was will die Behörde, bis wann, und was passiert, wenn ich nichts tue.',
      ],
      sections: [
        {
          heading: 'Die 7 Stellen, die zählen',
          numbered: [
            'Absender und Behörde: Finanzamt, Jobcenter, Ausländerbehörde, Krankenkasse oder ein privates Inkassounternehmen — das ändert alles Weitere.',
            'Betreff und Brieftyp: Bescheid, Anhörung, Mahnung, Aufforderung oder reine Information. Ein „Bescheid" ist eine Entscheidung, eine „Anhörung" ist die Gelegenheit, vorher etwas zu sagen.',
            'Aktenzeichen oder Steuernummer: gehört in jede Antwort, sonst landet dein Schreiben im Nichts.',
            'Die Frist: meist als konkretes Datum oder als „innerhalb eines Monats nach Bekanntgabe".',
            'Der Betrag und die Zahlungsdaten: Was ist gefordert, bis wann, auf welches Konto.',
            'Die Rechtsbehelfsbelehrung am Ende: Sie sagt, ob und wie du Widerspruch einlegen kannst und wie lange du Zeit hast.',
            'Die geforderte Handlung: zahlen, Unterlagen nachreichen, widersprechen oder nichts tun.',
          ],
        },
        {
          heading: 'Typische Begriffe aus dem Behördendeutsch',
          bullets: [
            '„Bescheid": eine verbindliche Entscheidung der Behörde.',
            '„Anhörung": du darfst dich äußern, bevor entschieden wird — eine Chance, keine Strafe.',
            '„Mitwirkungspflicht": du musst Unterlagen liefern, sonst darf zu deinen Lasten entschieden werden.',
            '„Bekanntgabe": gilt in der Regel drei Tage nach dem Datum des Briefes — davon läuft die Frist.',
            '„Vollziehbar" oder „sofortige Vollziehung": die Maßnahme gilt, auch wenn du widersprichst.',
            '„Kostenfestsetzung": die Gebühren des Verfahrens, getrennt von der eigentlichen Forderung.',
          ],
        },
        {
          heading: 'Was gefährlich ist',
          paragraphs: [
            'Der häufigste teure Fehler ist nicht das Missverstehen, sondern das Liegenlassen. Viele Fristen sind Ausschlussfristen: Ist der Monat vorbei, ist der Bescheid bestandskräftig — auch wenn er inhaltlich falsch war.',
            'Der zweithäufigste ist die formlose Antwort per E-Mail oder Telefon, wenn Schriftform verlangt ist. Steht im Brief „schriftlich", dann zählt nur ein Schreiben mit Aktenzeichen, Datum und Unterschrift.',
          ],
        },
      ],
      howToHeading: 'So gehst du mit Amtsbrief AI vor',
      howToSteps: [
        { title: 'Brief scannen', text: 'Kamera, PDF oder eingefügter Text — die App liest den kompletten Brief ein.' },
        { title: 'Zusammenfassung lesen', text: 'In einfacher Sprache und auf Wunsch in deiner Muttersprache: worum es geht und was gefordert wird.' },
        { title: 'Eckdaten prüfen', text: 'Absender, Brieftyp, Frist, Betrag, IBAN und Aktenzeichen stehen übersichtlich beisammen.' },
        { title: 'Erinnerung setzen', text: 'Die Frist landet als Erinnerung im Kalender, damit der Monat nicht unbemerkt abläuft.' },
      ],
      faqs: [
        {
          question: 'Ab wann läuft die Frist?',
          answer: 'In der Regel ab der Bekanntgabe, die bei einem einfachen Brief üblicherweise drei Tage nach dem Briefdatum angenommen wird. Maßgeblich ist immer der Text deines Bescheids.',
        },
        {
          question: 'Ersetzt die App eine Rechtsberatung?',
          answer: 'Nein. Amtsbrief AI erklärt den Inhalt und hilft beim Formulieren. Bei hohen Beträgen, drohenden Konsequenzen oder unklarer Rechtslage gehört der Fall zu einer Beratungsstelle oder einem Anwalt.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'widerspruch-schreiben',
      keyword: 'widerspruch gegen bescheid schreiben',
      title: 'Widerspruch gegen einen Bescheid schreiben: Aufbau und Frist',
      metaTitle: 'Widerspruch gegen einen Bescheid: Aufbau & Frist',
      metaDescription:
        'Wie ein Widerspruch aufgebaut sein muss, welche Frist gilt und warum ein kurzer fristwahrender Widerspruch oft der richtige erste Schritt ist.',
      excerpt: 'Aufbau, Frist und der fristwahrende Einzeiler, der dir Zeit für die Begründung kauft.',
      intro: [
        'Ein Widerspruch ist kein Streit, sondern ein normaler Verwaltungsvorgang. Er muss nicht juristisch klingen — er muss rechtzeitig da sein, eindeutig zuordenbar sein und erkennen lassen, dass du mit der Entscheidung nicht einverstanden bist.',
        'Die Frist beträgt meistens einen Monat ab Bekanntgabe; die genaue Angabe steht in der Rechtsbehelfsbelehrung am Ende des Bescheids.',
      ],
      sections: [
        {
          heading: 'Was in jeden Widerspruch gehört',
          numbered: [
            'Deine vollständigen Daten: Name, Adresse, Geburtsdatum, gegebenenfalls Kundennummer.',
            'Das Aktenzeichen und das Datum des Bescheids, gegen den du dich wendest.',
            'Der klare Satz: „Hiermit lege ich Widerspruch gegen den Bescheid vom … ein."',
            'Die Begründung — sie darf auch nachgereicht werden.',
            'Ort, Datum und Unterschrift.',
          ],
        },
        {
          heading: 'Der fristwahrende Widerspruch',
          paragraphs: [
            'Wenn die Frist knapp ist und dir Unterlagen oder Argumente fehlen, schickst du zuerst nur den Widerspruch selbst — drei Zeilen genügen — und ergänzt: „Die Begründung reiche ich innerhalb von zwei Wochen nach."',
            'Damit ist die Frist gewahrt und du hast Zeit für die eigentliche Argumentation. Dieser Schritt ist der Grund, warum ein Bescheid selten wegen des Inhalts, sondern fast immer wegen des Kalenders verloren geht.',
          ],
        },
        {
          heading: 'Häufige Fehler',
          bullets: [
            'Zu spät: nach Ablauf der Frist ist der Bescheid bestandskräftig, unabhängig davon, wie gut die Argumente sind.',
            'Kein Aktenzeichen: das Schreiben lässt sich nicht zuordnen.',
            'Nur telefonisch widersprochen — nicht nachweisbar, und häufig formunwirksam.',
            'Emotional statt sachlich: Vorwürfe ändern nichts an der Prüfung, Fakten und Nachweise schon.',
            'Zahlungsaufforderung ignoriert: ein Widerspruch hat nicht automatisch aufschiebende Wirkung. Ob du trotzdem zahlen musst, steht im Bescheid.',
          ],
        },
      ],
      howToHeading: 'Widerspruch mit Amtsbrief AI entwerfen',
      howToSteps: [
        { title: 'Bescheid einlesen', text: 'Die App erkennt Aktenzeichen, Datum, Behörde und die Rechtsbehelfsbelehrung.' },
        { title: 'Antworttyp wählen', text: 'Widerspruch, Fristverlängerung oder Rückfrage — je nachdem, was du brauchst.' },
        { title: 'Entwurf prüfen', text: 'Du bekommst ein formell korrektes deutsches Schreiben, das du inhaltlich kontrollierst und anpasst.' },
        { title: 'Als PDF exportieren', text: 'A4-PDF erzeugen, ausdrucken, unterschreiben und abschicken.' },
      ],
      faqs: [
        {
          question: 'Wie lange habe ich Zeit für einen Widerspruch?',
          answer: 'In der Regel einen Monat ab Bekanntgabe. Fehlt eine Rechtsbehelfsbelehrung oder ist sie fehlerhaft, verlängert sich die Frist häufig auf ein Jahr — maßgeblich ist dein konkreter Bescheid.',
        },
        {
          question: 'Muss ich den Widerspruch begründen?',
          answer: 'Nicht sofort. Der fristwahrende Widerspruch reicht zunächst, die Begründung kannst du nachreichen.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'frist-verpasst-was-tun',
      keyword: 'behördenfrist verpasst was tun',
      title: 'Frist verpasst: was jetzt noch geht',
      metaTitle: 'Behördenfrist verpasst? Wiedereinsetzung & Schritte',
      metaDescription:
        'Die Frist im Bescheid ist abgelaufen. Was jetzt noch möglich ist: Wiedereinsetzung, Überprüfungsantrag, Ratenzahlung — und wie es nicht wieder passiert.',
      excerpt: 'Wiedereinsetzung, Überprüfungsantrag, Ratenzahlung — was nach Fristablauf noch möglich ist.',
      intro: [
        'Eine abgelaufene Frist fühlt sich endgültig an, ist es aber nicht immer. Das deutsche Verwaltungsrecht kennt mehrere Wege zurück — sie sind enger als der normale Widerspruch, aber sie existieren.',
        'Wichtig ist Tempo: Alle diese Möglichkeiten haben selbst wieder Fristen, die ab dem Moment laufen, in dem das Hindernis weggefallen ist.',
      ],
      sections: [
        {
          heading: 'Wiedereinsetzung in den vorigen Stand',
          paragraphs: [
            'Wer eine Frist ohne eigenes Verschulden versäumt hat — Krankenhausaufenthalt, nachweislich nicht zugestellte Post, längere Abwesenheit ohne Möglichkeit der Kenntnisnahme —, kann Wiedereinsetzung beantragen.',
            'Der Antrag muss in der Regel innerhalb von zwei Wochen nach Wegfall des Hindernisses gestellt werden, die versäumte Handlung wird gleichzeitig nachgeholt, und der Grund muss belegt werden. „Vergessen" oder „nicht verstanden" reicht dafür grundsätzlich nicht.',
          ],
        },
        {
          heading: 'Weitere Wege',
          bullets: [
            'Überprüfungsantrag: bei Sozialleistungen kann ein bestandskräftiger Bescheid unter Umständen noch überprüft werden, wenn er von Anfang an rechtswidrig war.',
            'Änderungsantrag für die Zukunft: der alte Bescheid bleibt, aber ab jetzt gelten neue Umstände.',
            'Stundung oder Ratenzahlung: ändert nichts an der Forderung, verhindert aber Vollstreckung und weitere Kosten.',
            'Beratungsstelle einschalten: Sozialverbände, Migrationsberatung, Verbraucherzentrale oder Mieterverein — oft schnell, günstig und mit Erfahrung in genau diesem Bescheidtyp.',
          ],
        },
        {
          heading: 'Damit es nicht wieder passiert',
          numbered: [
            'Jeden Brief am Tag des Eingangs öffnen — auch die, die nach Werbung aussehen.',
            'Das Eingangsdatum auf dem Briefumschlag oder dem Brief notieren.',
            'Jede erkannte Frist sofort als Kalendererinnerung anlegen, mit einer Vorwarnung eine Woche vorher.',
            'Bei längerer Abwesenheit Nachsendeauftrag stellen oder jemanden bevollmächtigen.',
            'Wichtige Post digital ablegen, damit Aktenzeichen und Fristen später auffindbar sind.',
          ],
        },
      ],
      howToHeading: 'Fristen im Griff behalten mit Amtsbrief AI',
      howToSteps: [
        { title: 'Brief sofort scannen', text: 'Direkt beim Öffnen — dann steht das Eingangsdatum fest und die Frist ist erfasst.' },
        { title: 'Frist als Erinnerung setzen', text: 'Die erkannte Frist wandert in eine Erinnerung, inklusive Vorwarnzeit.' },
        { title: 'Fristverlängerung entwerfen', text: 'Reicht die Zeit nicht, erstellt die App ein Schreiben mit der Bitte um Verlängerung.' },
        { title: 'Alles zusammen behalten', text: 'Brief, Zusammenfassung und deine Antwort bleiben beieinander — hilfreich, wenn später jemand nachfragt.' },
      ],
      faqs: [
        {
          question: 'Kann ich nach Fristablauf noch etwas erreichen?',
          answer: 'Manchmal — über Wiedereinsetzung bei unverschuldeter Versäumnis oder je nach Rechtsgebiet über einen Überprüfungsantrag. Beides ist enger als ein rechtzeitiger Widerspruch, deshalb zählt jeder Tag.',
        },
        {
          question: 'Wann sollte ich eine Beratungsstelle einschalten?',
          answer: 'Bei hohen Beträgen, drohender Vollstreckung, aufenthaltsrechtlichen Themen oder wenn die Behörde auf deine Antwort nicht reagiert.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'brief-von-der-auslaenderbehoerde-verstehen',
      lang: 'de',
      keyword: 'brief von der ausländerbehörde',
      title: 'Brief von der Ausländerbehörde: was Anhörung, Mitwirkung und Fiktionsbescheinigung bedeuten',
      metaTitle: 'Brief von der Ausländerbehörde verstehen – Anhörung, Frist, Fiktion',
      metaDescription:
        'Die Schreiben der Ausländerbehörde sind kurz, formell und folgenreich. Was die häufigsten Betreffzeilen bedeuten, welche Fristen dahinterstehen und wann eine Antwort zwingend ist.',
      excerpt: 'Die fünf häufigsten Schreiben der Ausländerbehörde, übersetzt in das, was sie von dir wollen.',
      intro: [
        'Kaum eine Behörde schreibt so knapp und so folgenreich wie die Ausländerbehörde. Ein Absatz Amtsdeutsch kann bedeuten, dass ein Aufenthaltstitel verlängert wird, dass ein Nachweis fehlt oder dass eine Ablehnung bevorsteht — und der Unterschied steckt in Wörtern, die außerhalb von Behörden niemand benutzt.',
        'Wer diese Wörter kennt, weiß nach dem ersten Lesen, ob es eilt.',
      ],
      sections: [
        {
          heading: 'Die häufigsten Schreiben',
          bullets: [
            'Anhörung: Die Behörde beabsichtigt eine für dich nachteilige Entscheidung — etwa Ablehnung oder Befristung — und gibt dir vorher Gelegenheit zur Stellungnahme. Das ist kein Bescheid, aber die letzte Chance, ihn abzuwenden. Frist einhalten, schriftlich antworten, Nachweise beilegen.',
            'Aufforderung zur Mitwirkung: Es fehlen Unterlagen — Passkopie, Krankenversicherung, Finanzierungsnachweis, Mietvertrag. Ohne Antwort kann der Antrag abgelehnt werden.',
            'Fiktionsbescheinigung: Dein alter Titel ist abgelaufen, der neue noch nicht entschieden. Die Bescheinigung sichert den Aufenthalt und meist die Erwerbstätigkeit bis zur Entscheidung. Sie ist kein Titel, aber ein legaler Status.',
            'Terminvergabe oder Einladung zur Vorsprache: Fast immer mit Liste der mitzubringenden Dokumente; ein versäumter Termin verschiebt alles um Monate.',
            'Bescheid: Die Entscheidung — Erteilung, Verlängerung, Ablehnung, Befristung — mit Rechtsbehelfsbelehrung am Ende. Gegen eine Ablehnung läuft ab Zustellung eine Frist von einem Monat.',
          ],
        },
        {
          heading: 'Wörter, die Fristen auslösen',
          bullets: [
            '„bis spätestens": ein hartes Datum, kein Richtwert.',
            '„andernfalls": danach steht, was passiert, wenn du nicht antwortest — meist Entscheidung nach Aktenlage, also Ablehnung.',
            '„Zustellung" oder „zugestellt am": Ab diesem Tag laufen Rechtsbehelfsfristen, nicht ab dem Tag, an dem du den Brief liest.',
            '„nach Aktenlage": Die Behörde entscheidet mit dem, was sie hat. Wenn ihr etwas fehlt, geht es gegen dich.',
          ],
        },
        {
          heading: 'Richtig reagieren',
          numbered: [
            'Datum der Zustellung notieren und die Frist im Kalender eintragen — bei Bescheiden einen Monat, bei Anhörungen und Mitwirkung das genannte Datum.',
            'Genau die geforderten Unterlagen zusammenstellen, nicht mehr und nicht weniger; jede Seite mit Aktenzeichen versehen.',
            'Schriftlich antworten, mit Aktenzeichen im Betreff, und einen Nachweis der Absendung aufbewahren — Einschreiben oder Upload-Bestätigung.',
            'Wenn eine Frist nicht zu halten ist: vor Ablauf schriftlich um Verlängerung bitten, mit Begründung. Das wird meist gewährt; ein stilles Verstreichen nie.',
            'Bei Anhörungen zu Ablehnungen und bei Bescheiden mit Ablehnung: Beratung suchen — Migrationsberatung, Studierendenwerk, Anwalt — innerhalb der Frist, nicht danach.',
          ],
        },
        {
          heading: 'Was Studierende besonders betrifft',
          paragraphs: [
            'Bei der Verlängerung der Aufenthaltserlaubnis zum Studium prüft die Behörde den Studienfortschritt. Ein Schreiben mit der Bitte um eine Bescheinigung der Hochschule über den Leistungsstand ist Routine, aber die Antwort entscheidet: Wer deutlich hinter der Regelstudienzeit liegt, sollte die Gründe dokumentieren und vor der Antwort mit der Studienberatung sprechen.',
            'Nach dem Abschluss ist der Wechsel in die Aufenthaltserlaubnis zur Arbeitsplatzsuche fristgebunden — der Antrag muss vor Ablauf des Studententitels gestellt sein, sonst entfällt die Fiktionswirkung.',
          ],
        },
      ],
      howToHeading: 'Schreiben mit Amtsbrief einordnen',
      howToSteps: [
        { title: 'Brief fotografieren', text: 'Die App liest das Schreiben und erklärt in einfachem Deutsch oder deiner Sprache, worum es geht.' },
        { title: 'Handlungsbedarf sehen', text: 'Anhörung, Mitwirkung, Bescheid — die App ordnet den Typ zu und sagt, ob du antworten musst.' },
        { title: 'Frist übernehmen', text: 'Das im Brief genannte Datum wird erkannt und lässt sich als Erinnerung setzen.' },
        { title: 'Antwort vorbereiten', text: 'Die App hilft bei einem sachlichen Antwortschreiben mit Aktenzeichen und Anlagenliste.' },
      ],
      faqs: [
        {
          question: 'Ist eine Anhörung schon eine Ablehnung?',
          answer: 'Nein. Sie kündigt eine mögliche nachteilige Entscheidung an und gibt dir Gelegenheit, sie mit Argumenten und Nachweisen abzuwenden. Die Antwort ist entscheidend.',
        },
        {
          question: 'Darf ich mit einer Fiktionsbescheinigung arbeiten und reisen?',
          answer: 'Arbeiten meist ja, im Umfang des bisherigen Titels — es steht auf der Bescheinigung. Reisen ins Ausland nur, wenn die Bescheinigung nach § 81 Abs. 4 AufenthG ausgestellt ist; vorher bei der Behörde nachfragen.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'mahnung-zahlungserinnerung-was-tun',
      lang: 'de',
      keyword: 'mahnung erhalten was tun',
      title: 'Mahnung erhalten: Zahlungserinnerung, Mahnbescheid und Inkasso auseinanderhalten',
      metaTitle: 'Mahnung erhalten – Zahlungserinnerung, Mahnbescheid, Inkasso erklärt',
      metaDescription:
        'Nicht jede Mahnung ist gleich ernst. Was eine Zahlungserinnerung von einem gerichtlichen Mahnbescheid trennt, welche Gebühren erlaubt sind und wann du unbedingt innerhalb von 14 Tagen reagieren musst.',
      excerpt: 'Vier Stufen von harmlos bis gerichtlich — und die eine, bei der Schweigen richtig teuer wird.',
      intro: [
        'Eine Mahnung im Briefkasten löst bei vielen Panik aus, bei anderen Gleichgültigkeit. Beides ist falsch, weil das Wort für sehr unterschiedliche Dinge steht: von der freundlichen Erinnerung eines Onlineshops bis zum gelben Umschlag vom Amtsgericht, der eine Zwei-Wochen-Frist mit ernsten Folgen enthält.',
        'Wer die Stufen kennt, weiß, was zu tun ist — und was man ignorieren darf.',
      ],
      sections: [
        {
          heading: 'Die vier Stufen',
          bullets: [
            'Zahlungserinnerung: Freundlicher Hinweis, meist ohne Gebühr. Rechtlich noch nichts passiert, aber die Rechnung ist offenbar fällig.',
            'Mahnung: Setzt dich in Verzug, oft mit Mahngebühr und Verzugszinsen. Erlaubt sind nur tatsächliche Kosten — ein paar Euro für Porto und Bearbeitung, keine Fantasiebeträge.',
            'Inkasso: Ein Dienstleister übernimmt die Forderung und stellt eigene Gebühren in Rechnung. Diese sind gesetzlich gedeckelt; überhöhte Inkassokosten muss man nicht zahlen, die Hauptforderung schon.',
            'Gerichtlicher Mahnbescheid: Kommt im gelben Umschlag vom Amtsgericht. Ab Zustellung laufen zwei Wochen für den Widerspruch. Wer nichts tut, bekommt einen Vollstreckungsbescheid — und danach den Gerichtsvollzieher.',
          ],
        },
        {
          heading: 'Erst prüfen, dann zahlen',
          numbered: [
            'Stimmt die Forderung? Absender, Rechnungsnummer, Datum und Betrag mit den eigenen Unterlagen abgleichen.',
            'Ist sie verjährt? Die meisten Alltagsforderungen verjähren nach drei Jahren zum Jahresende. Verjährte Forderungen darf man verweigern — muss es aber ausdrücklich tun.',
            'Sind die Nebenkosten erlaubt? Mahngebühren nur in tatsächlicher Höhe, Inkassokosten nur bis zur gesetzlichen Grenze.',
            'Ist es überhaupt echt? Betrügerische Mahnungen imitieren Inkassobüros und Gerichte. Ein echter Mahnbescheid kommt nur vom Amtsgericht im gelben Umschlag, nie per E-Mail.',
          ],
        },
        {
          heading: 'Reagieren nach Stufe',
          bullets: [
            'Berechtigte Forderung, zahlbar: sofort begleichen, mit Verwendungszweck aus dem Schreiben, und die Zahlung dokumentieren.',
            'Berechtigt, aber nicht zahlbar: Ratenzahlung schriftlich anbieten — Gläubiger und Inkassobüros akzeptieren das in der Regel, weil es billiger ist als Gericht.',
            'Unberechtigt oder zweifelhaft: schriftlich widersprechen und begründen. Keine Zahlung „um Ruhe zu haben" — das kann als Anerkenntnis gewertet werden.',
            'Mahnbescheid: innerhalb von 14 Tagen Widerspruch auf dem beiliegenden Formular, auch wenn du nur Teile bestreitest. Danach entscheidet ein normales Gerichtsverfahren, nicht die Fristversäumnis.',
          ],
        },
        {
          heading: 'Der teuerste Fehler',
          paragraphs: [
            'Nicht die Mahnung selbst ist teuer, sondern das Schweigen. Eine offene Forderung von 60 Euro wird durch Verzugszinsen, Inkasso und Gerichtskosten leicht zu 200 Euro — und ein Vollstreckungsbescheid landet bei der Schufa, was Wohnungssuche und Verträge auf Jahre erschwert.',
            'Wer ein Schreiben nicht versteht, sollte es deshalb übersetzen lassen, statt es wegzulegen. Das gilt besonders für Zugewanderte, an die Inkassobüros bewusst besonders unverständlich schreiben.',
          ],
        },
      ],
      howToHeading: 'Mahnungen mit Amtsbrief einordnen',
      howToSteps: [
        { title: 'Schreiben fotografieren', text: 'Die App erkennt, ob es sich um Erinnerung, Mahnung, Inkasso oder Mahnbescheid handelt.' },
        { title: 'Frist und Betrag sehen', text: 'Fälligkeit, Hauptforderung und Nebenkosten werden getrennt ausgewiesen.' },
        { title: 'Antwort formulieren', text: 'Vorlagen für Widerspruch, Ratenzahlungsangebot und Verjährungseinrede — sachlich und vollständig.' },
        { title: 'Erinnerung setzen', text: 'Bei Mahnbescheiden zählt jeder Tag; die App erinnert vor Ablauf der zwei Wochen.' },
      ],
      faqs: [
        {
          question: 'Muss ich Inkassogebühren zahlen?',
          answer: 'Wenn die Hauptforderung berechtigt ist und du in Verzug warst, ja — aber nur bis zur gesetzlichen Höhe. Überhöhte Beträge kannst du schriftlich zurückweisen und nur den zulässigen Teil zahlen.',
        },
        {
          question: 'Was passiert, wenn ich den Mahnbescheid ignoriere?',
          answer: 'Nach zwei Wochen kann der Gläubiger einen Vollstreckungsbescheid beantragen. Danach ist die Forderung vollstreckbar, auch wenn sie unberechtigt war.',
        },
      ],
      screenshotIndex: 1,
    },
  ],
  faqs: [
    {
      question: 'Was macht Amtsbrief AI?',
      answer:
        'Die App scannt deutsche Behördenpost, fasst sie in einfacher Sprache zusammen, erkennt Absender, Brieftyp, Fristen, Beträge, IBAN und Aktenzeichen — und entwirft auf Wunsch eine formelle Antwort auf Deutsch.',
      learnMoreSlug: 'behoerdenbrief-verstehen',
    },
    {
      question: 'Kann die App einen Widerspruch schreiben?',
      answer:
        'Ja. Widerspruch, Fristverlängerung oder Rückfrage werden als formell korrektes deutsches Schreiben entworfen, das du vor dem Versenden prüfst und als A4-PDF exportieren kannst.',
      learnMoreSlug: 'widerspruch-schreiben',
    },
    {
      question: 'Und wenn die Frist schon abgelaufen ist?',
      answer:
        'Dann kommt es auf den Grund an — bei unverschuldeter Versäumnis ist eine Wiedereinsetzung möglich, je nach Bereich auch ein Überprüfungsantrag.',
      learnMoreSlug: 'frist-verpasst-was-tun',
    },
    {
      question: 'Welche Briefe kann ich analysieren?',
      answer: 'Post vom Finanzamt, Jobcenter, der Ausländerbehörde, Krankenkasse, von Ämtern, Vermietern und Inkassounternehmen — Bescheide, Mahnungen, Anhörungen, Kündigungen und Forderungen.',
    },
    {
      question: 'In welchen Sprachen bekomme ich die Erklärung?',
      answer: 'Die Zusammenfassung erscheint in einfacher Sprache — auf Deutsch oder in deiner Muttersprache. Antwortschreiben werden immer auf Deutsch erstellt, weil Behörden Deutsch verlangen.',
    },
    {
      question: 'Ist das eine Rechtsberatung?',
      answer:
        'Nein. Amtsbrief AI ist ein KI-Assistent und ersetzt keine Rechtsberatung. Prüfe wichtige Antworten sorgfältig und wende dich bei hohen Beträgen oder unklarer Lage an eine Beratungsstelle oder einen Anwalt.',
    },
  ],
  ctaHeading: 'Der nächste Behördenbrief ist kein Rätsel mehr',
  ctaText: 'Amtsbrief AI kostenlos laden, Brief scannen und in einer Minute wissen, was zu tun ist.',
  category: 'ProductivityApplication',
  downloadNote: 'Kostenlos laden • Optionale In-App-Käufe',
};
