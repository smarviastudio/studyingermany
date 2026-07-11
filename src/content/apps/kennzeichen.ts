import { ScanLine, Map, Trophy, GraduationCap, WifiOff, Users } from 'lucide-react';
import type { AppContent } from './types';

export const kennzeichen: AppContent = {
  slug: 'kennzeichen-scanner-app',
  appId: '6757681231',
  name: 'KennzeichenSammler',
  storeName: 'Kennzeichen Scanner & Sammler',
  subtitle: 'Nummernschilder Spiel & Karte',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/kennzeichen-scanner-sammler/id6757681231',
  icon: '/apps/kennzeichen/icon.webp',
  accent: '#38bdf8',
  accentDark: '#1d4ed8',
  heroTitle: {
    pre: 'Mach jede Autofahrt zum',
    highlight: 'Kennzeichen-Spiel',
    post: '',
  },
  heroDescription:
    'KennzeichenSammler ist die Kennzeichen-App mit AI-Scanner: Einfach ein Nummernschild fotografieren — die KI erkennt es automatisch, trägt es in deine Sammlung ein und zeigt dir sofort, woher das Auto kommt. Perfekt für lange Autofahrten mit Kindern, Roadtrips und alle, die Kennzeichen lieben.',
  heroBenefits: [
    'AI-Scanner: Foto machen, fertig — kein Tippen nötig',
    'Kennzeichen aus hunderten Ländern weltweit sammeln',
    'Interaktive Weltkarte & Statistiken deiner Funde',
    'Punkte & Achievements für seltene Kennzeichen',
    'Funktioniert offline — ideal für unterwegs',
  ],
  metaTitle: 'Kennzeichen App mit AI-Scanner – Nummernschilder sammeln & erkennen',
  metaDescription:
    'Kennzeichen scannen statt tippen: Die KennzeichenSammler-App erkennt Nummernschilder per KI, zeigt Herkunft auf der Weltkarte und macht jede Autofahrt zum Spiel. Gratis für iPhone.',
  metaKeywords:
    'kennzeichen app, autokennzeichen scanner, kennzeichen erkennen, nummernschilder sammeln, kennzeichen spiel, autokennzeichen deutschland, ortskennzeichen, kennzeichen quiz, roadtrip spiel kinder',
  screenshots: [
    { src: '/apps/kennzeichen/screenshot-1.webp', alt: 'Kennzeichen App – Nummernschild mit AI-Scanner fotografieren und erkennen' },
    { src: '/apps/kennzeichen/screenshot-2.webp', alt: 'KennzeichenSammler – erkanntes Kennzeichen mit Herkunftsregion' },
    { src: '/apps/kennzeichen/screenshot-3.webp', alt: 'Kennzeichen App – interaktive Weltkarte der gesammelten Kennzeichen' },
    { src: '/apps/kennzeichen/screenshot-4.webp', alt: 'KennzeichenSammler – Punkte und Achievements für seltene Funde' },
    { src: '/apps/kennzeichen/screenshot-5.webp', alt: 'Kennzeichen App – Sammlung und Statistiken' },
  ],
  audience: [
    {
      badge: 'Familien',
      title: 'Familien mit Kindern',
      description: 'Das klassische Autobahn-Spiel, endlich ohne Streit ums Erkennen: Kinder scannen, die KI bestätigt, die Sammlung wächst.',
      color: '#1d4ed8',
    },
    {
      badge: 'Roadtrips',
      title: 'Vielfahrer & Pendler',
      description: 'Aus dem Stau wird eine Schatzsuche: Seltene Ortskennzeichen und ausländische Schilder bringen Punkte und Achievements.',
      color: '#059669',
    },
    {
      badge: 'Sammler',
      title: 'Kennzeichen-Fans',
      description: 'Weltweite Kennzeichen-Systeme, Lernmodus und Statistiken — für alle, die bei jedem fremden Schild kurz hinschauen müssen.',
      color: '#d97706',
    },
  ],
  features: [
    {
      icon: ScanLine,
      title: 'AI-Scanner statt Tippen',
      description:
        'Kamera aufs Kennzeichen halten, Foto machen, fertig — die KI erkennt das Schild automatisch und trägt es in deine Sammlung ein. Anders als klassische Kennzeichen-Apps musst du nichts manuell eingeben.',
      color: '#1d4ed8',
    },
    {
      icon: Map,
      title: 'Weltkarte & Statistik',
      description:
        'Sieh auf einer interaktiven Weltkarte, aus welchen Ländern und Regionen deine Funde stammen — mit Statistiken zu deiner gesamten Sammlung.',
      color: '#059669',
    },
    {
      icon: Trophy,
      title: 'Punkte & Achievements',
      description:
        'Seltene Kennzeichen, Länder-Meilensteine und besondere Herausforderungen bringen Punkte — das Sammelfieber ist eingebaut.',
      color: '#d97706',
    },
    {
      icon: GraduationCap,
      title: 'Lernmodus',
      description:
        'Erfahre, wie Kennzeichen-Systeme verschiedener Länder funktionieren, was Ortskürzel bedeuten und welche historischen Besonderheiten es gibt.',
      color: '#7c3aed',
    },
    {
      icon: WifiOff,
      title: 'Offline nutzbar',
      description:
        'Scannen und Sammeln funktionieren auch ohne Internet — ideal für Autobahn-Funklöcher und Auslandsfahrten ohne Roaming.',
      color: '#dd0000',
    },
    {
      icon: Users,
      title: 'Weltweit sammeln',
      description:
        'Nicht nur D/A/CH: Sammle Kennzeichen aus hunderten Ländern auf der ganzen Welt — jede Urlaubsfahrt erweitert die Karte.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Kennzeichen fotografieren', description: 'Kamera auf ein Nummernschild richten und Foto machen — mehr braucht es nicht.' },
    { title: 'KI erkennt automatisch', description: 'Die KI liest das Kennzeichen, erkennt Land und Region und trägt alles in deine Sammlung ein.' },
    { title: 'Herkunft entdecken', description: 'Sieh sofort, woher das Auto kommt — und lerne im Lernmodus, was die Kürzel bedeuten.' },
    { title: 'Sammlung ausbauen', description: 'Sammle Punkte und Achievements, fülle die Weltkarte und jage seltene Schilder.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'KennzeichenSammler ist kostenlos für iPhone und iPad erhältlich. Optionale Premium-Funktionen lassen sich per In-App-Kauf freischalten.',
  guides: [
    {
      slug: 'autokennzeichen-spiel-fuer-kinder',
      keyword: 'autokennzeichen spiel für kinder',
      title: 'Das Autokennzeichen-Spiel für Kinder: Regeln, Varianten & App',
      metaTitle: 'Autokennzeichen-Spiel für Kinder: Regeln & moderne App-Variante',
      metaDescription:
        'Das Kennzeichen-Spiel ist der Klassiker gegen Langeweile auf langen Autofahrten. Hier sind die besten Regeln und Varianten für Kinder — plus die moderne Version mit AI-Scanner.',
      excerpt: 'Der Klassiker gegen „Wann sind wir daaa?" — Spielregeln, Varianten nach Alter und die moderne Scanner-Version.',
      intro: [
        '„Wann sind wir daaa?" — jede Familie kennt die Frage, meistens 20 Minuten nach der Abfahrt. Das Autokennzeichen-Spiel ist seit Generationen die beste Antwort: Es kostet nichts, braucht kein Zubehör und verwandelt jede Autobahnfahrt in eine Schatzsuche.',
        'Das Prinzip: Kennzeichen entdecken, Herkunft erraten, Punkte sammeln. Und mit einem AI-Scanner wird daraus eine echte Sammlung, die über Jahre wächst.',
      ],
      sections: [
        {
          heading: 'Die klassischen Spielvarianten',
          bullets: [
            'Kennzeichen-Bingo: Vor der Fahrt 10 Ortskürzel aufschreiben — wer zuerst alle gesehen hat, gewinnt.',
            'Herkunfts-Raten: Ein Kürzel entdecken (z. B. „GAP") und raten, wofür es steht (Garmisch-Partenkirchen).',
            'Alphabet-Jagd: Kennzeichen mit A, dann B, dann C finden — in der richtigen Reihenfolge.',
            'Weiteste Reise: Wer bis zur Pause das am weitesten entfernte Kennzeichen entdeckt, bestimmt die Snacks.',
            'Ausland zählt doppelt: NL, DK, PL und CH geben Bonuspunkte — auf Ferienstrecken ein Renner.',
          ],
        },
        {
          heading: 'Altersgerechte Anpassungen',
          paragraphs: [
            'Ab etwa 4 Jahren funktioniert reines Entdecken („Findest du ein gelbes Kennzeichen?"), ab 6 das Buchstaben-Erkennen, ab 8 das Herkunfts-Raten mit Punkten. Ältere Kinder lieben die Sammel-Logik: Welche Kürzel fehlen uns noch? Welches ist das seltenste, das wir je gesehen haben?',
          ],
        },
        {
          heading: 'Warum das Spiel mehr ist als Zeitvertreib',
          paragraphs: [
            'Nebenbei trainiert das Kennzeichen-Spiel Geografie (Wo liegt Cuxhaven?), Buchstaben und Konzentration — und es holt die Kinder vom Tablet-Bildschirm zurück ans Fenster. Eltern-Bonus: Ein Kind, das Kennzeichen jagt, fragt seltener nach der Ankunftszeit.',
          ],
        },
      ],
      howToHeading: 'So wird das Spiel mit KennzeichenSammler modern',
      howToSteps: [
        { title: 'Kinder scannen selbst', text: 'Beifahrer-Kinder fotografieren entdeckte Kennzeichen — die KI erkennt sie automatisch, ohne Tippen und ohne Streit.' },
        { title: 'Herkunft sofort sehen', text: 'Nach dem Scan zeigt die App Land und Region — das Raten wird sofort aufgelöst und ganz nebenbei Geografie gelernt.' },
        { title: 'Punkte & Achievements jagen', text: 'Seltene Kennzeichen und neue Länder bringen Punkte — die eingebaute Motivation für jede weitere Fahrt.' },
        { title: 'Die Familien-Sammlung wächst', text: 'Auf der Weltkarte sehen alle, was die Familie schon entdeckt hat — und was auf der nächsten Fahrt noch fehlt.' },
      ],
      faqs: [
        {
          question: 'Ab welchem Alter können Kinder die App nutzen?',
          answer: 'Das Scannen selbst klappt ab etwa 6 Jahren gut. Jüngere Kinder entdecken die Schilder und lassen ältere Geschwister oder den Beifahrer scannen.',
        },
        {
          question: 'Funktioniert die App auch ohne Internet?',
          answer: 'Ja — Scannen und Sammeln funktionieren offline, perfekt für Funklöcher auf der Autobahn und Auslandsfahrten.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'wo-kommt-das-kennzeichen-her',
      keyword: 'kennzeichen herkunft erkennen',
      title: 'Wo kommt das Kennzeichen her? Deutsche Ortskürzel verstehen',
      metaTitle: 'Kennzeichen-Herkunft erkennen: Deutsche Ortskürzel erklärt',
      metaDescription:
        'Was bedeutet GAP, HRO oder WOB? So funktioniert das deutsche Kennzeichen-System mit über 700 Ortskürzeln — und so erkennst du jede Herkunft sofort per Scan.',
      excerpt: 'Über 700 deutsche Ortskürzel — wie das System funktioniert, welche Kürzel Geschichten erzählen und wie der Scan sofort auflöst.',
      intro: [
        'B wie Berlin und M wie München kennt jeder — aber wer tippt bei GAP, HRO oder WOB richtig? Deutschland hat über 700 Unterscheidungszeichen, und hinter vielen steckt mehr Geschichte, als man denkt.',
        'Das System zu verstehen macht jede Autofahrt interessanter — und mit einem KI-Scanner musst du nie wieder ungelöst raten.',
      ],
      sections: [
        {
          heading: 'So funktioniert das deutsche System',
          bullets: [
            'Das Unterscheidungszeichen (1–3 Buchstaben) steht für Stadt oder Landkreis: B = Berlin, HH = Hansestadt Hamburg, GAP = Garmisch-Partenkirchen.',
            'Faustregel: je kürzer das Kürzel, desto größer die Stadt — Einbuchstaber wie B, M, K und F gingen an Metropolen.',
            'Danach folgen Erkennungsnummer (1–2 Buchstaben + bis zu 4 Ziffern) — die freie Wahl vieler Halter für Initialen und Wunschzahlen.',
            'Seit 2012 kehren Alt-Kennzeichen abgeschaffter Landkreise zurück — deshalb sieht man wieder Kürzel, die es jahrzehntelang nicht gab.',
          ],
        },
        {
          heading: 'Kürzel mit Geschichte',
          paragraphs: [
            'Manche Kürzel sind kleine Geschichtsstunden: HRO steht für die Hansestadt Rostock, WOB für Wolfsburg — eine Stadt, die es erst seit 1938 gibt und die ihr Kennzeichen dem VW-Werk verdankt. Und die Hansestädte tragen ihr H bis heute stolz voran: HH (Hamburg), HB (Bremen), HL (Lübeck), HGW (Greifswald).',
          ],
        },
        {
          heading: 'Und international?',
          paragraphs: [
            'Im Ausland fängt das Rätseln erst richtig an: Frankreichs Départements-Nummern, Italiens Provinz-Kürzel, die Farbcodes der Niederlande. Wer europaweit unterwegs ist, sammelt Systeme gleich mit — der Lernmodus der App erklärt die wichtigsten Länder.',
          ],
        },
      ],
      howToHeading: 'Herkunft sofort erkennen mit KennzeichenSammler',
      howToSteps: [
        { title: 'Schild scannen', text: 'Kamera aufs Kennzeichen, Foto — die KI liest das Kürzel automatisch, auch bei Tempo-Differenz auf der Autobahn-Raststätte.' },
        { title: 'Region entdecken', text: 'Die App zeigt sofort Stadt bzw. Landkreis und das Herkunftsland — kein Nachschlagen, kein Raten.' },
        { title: 'Im Lernmodus vertiefen', text: 'Der Lernmodus erklärt Kennzeichen-Systeme verschiedener Länder, historische Kürzel und Besonderheiten.' },
        { title: 'Wissen sammeln', text: 'Jeder Scan landet in deiner Sammlung — nach einem Sommer kennst du mehr Ortskürzel als jedes Quiz.' },
      ],
      faqs: [
        {
          question: 'Wie viele Kennzeichen-Kürzel gibt es in Deutschland?',
          answer: 'Über 700 Unterscheidungszeichen sind aktuell zugeteilt — inklusive der seit 2012 wieder eingeführten Alt-Kennzeichen ehemaliger Landkreise.',
        },
        {
          question: 'Erkennt die App auch ausländische Kennzeichen?',
          answer: 'Ja — die KI erkennt Kennzeichen aus hunderten Ländern und zeigt dir Land und Region auf der Weltkarte.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'kennzeichen-sammeln-roadtrip',
      keyword: 'kennzeichen sammeln roadtrip',
      title: 'Kennzeichen sammeln auf dem Roadtrip: So wird die Fahrt zum Spiel',
      metaTitle: 'Kennzeichen sammeln auf Roadtrips: Anleitung & Sammel-Strategie',
      metaDescription:
        'Aus Kilometern werden Trophäen: So baust du auf Roadtrips eine Kennzeichen-Sammlung auf — mit AI-Scanner, Weltkarte, Punktesystem und Strategie für seltene Funde.',
      excerpt: 'Vom Beifahrersitz zur Trophäensammlung: die Sammel-Strategie für Urlaubsfahrten, Grenzregionen und seltene Funde.',
      intro: [
        'Jeder Roadtrip produziert hunderte Begegnungen mit Autos aus ganz Europa — und normalerweise verpuffen sie ungenutzt. Kennzeichen-Sammler sehen das anders: Jede Raststätte ist ein Jagdrevier, jeder Grenzübertritt erweitert die Karte, und ein bulgarisches Kennzeichen auf einem norwegischen Parkplatz ist ein Jackpot.',
        'Mit einem AI-Scanner wird aus dem flüchtigen „Guck mal, Finnland!" eine dauerhafte Sammlung mit Karte, Statistik und Punktestand.',
      ],
      sections: [
        {
          heading: 'Die Sammel-Strategie für unterwegs',
          bullets: [
            'Raststätten sind Goldminen: Auf 10 Minuten Parkplatz-Runde kommen oft 5+ Länder zusammen.',
            'Grenzregionen maximieren die Ausbeute — Strecken wie Basel, Aachen oder der Brenner liefern Dreiländer-Sammlungen.',
            'Fähren und Campingplätze bringen die Exoten: Hier stehen die Langstrecken-Reisenden aus Portugal, Griechenland oder dem Baltikum.',
            'Urlaubszeit nutzen: Im Sommer rollen Kennzeichen durch Deutschland, die es im November schlicht nicht zu sehen gibt.',
          ],
        },
        {
          heading: 'Was eine gute Sammlung ausmacht',
          paragraphs: [
            'Sammeln lebt von Struktur: Länder-Abdeckung (wie viele der ~50 europäischen Länder hast du?), regionale Tiefe (alle 16 Bundesländer? alle bayerischen Regierungsbezirke?) und die Trophäen — Funde, die eine Geschichte haben. Punktesysteme und Achievements geben der Jagd Ziele, die über die einzelne Fahrt hinausreichen.',
          ],
        },
        {
          heading: 'Sicherheit zuerst',
          paragraphs: [
            'Gescannt wird vom Beifahrersitz oder im Stand — nie vom Fahrersitz während der Fahrt. Die besten Sammel-Momente sind ohnehin Pausen, Parkplätze und Staus; die Autobahn bei Tempo 130 gehört den Augen auf die Straße.',
          ],
        },
      ],
      howToHeading: 'Deine Roadtrip-Sammlung mit KennzeichenSammler',
      howToSteps: [
        { title: 'Vor der Fahrt: App aufs Beifahrer-Handy', text: 'KennzeichenSammler funktioniert offline — auch im Ausland ohne Roaming-Sorgen.' },
        { title: 'Unterwegs scannen', text: 'Foto vom entdeckten Kennzeichen, die KI erledigt Erkennung und Einordnung automatisch.' },
        { title: 'Karte füllen', text: 'Nach jeder Etappe zeigt die Weltkarte neue Länder und Regionen — der sichtbarste Fortschrittsbalken, den ein Roadtrip haben kann.' },
        { title: 'Achievements jagen', text: 'Seltene Kennzeichen und Länder-Meilensteine bringen Punkte — und Ziele für den nächsten Trip.' },
      ],
      faqs: [
        {
          question: 'Brauche ich unterwegs Internet zum Sammeln?',
          answer: 'Nein — Scannen und Sammeln funktionieren komplett offline. Ideal für Auslandsfahrten und Funklöcher.',
        },
        {
          question: 'Werden Fotos der Autos gespeichert?',
          answer: 'Die App nutzt das Foto zur Kennzeichen-Erkennung für deine persönliche Sammlung. Es geht ums Sammeln der Kürzel und Regionen — nicht um Personen oder Fahrzeuge.',
        },
      ],
      screenshotIndex: 2,
    },
  ],
  faqs: [
    {
      question: 'Was ist KennzeichenSammler?',
      answer:
        'Eine Kennzeichen-App mit AI-Scanner: Nummernschild fotografieren, die KI erkennt es automatisch und trägt es mit Herkunftsland und Region in deine Sammlung ein — mit Weltkarte, Punkten und Achievements.',
      learnMoreSlug: 'kennzeichen-sammeln-roadtrip',
    },
    {
      question: 'Wie funktioniert der AI-Scanner?',
      answer:
        'Kamera aufs Kennzeichen halten und Foto machen — die KI liest das Schild, erkennt Land und Region und speichert den Fund. Anders als bei klassischen Kennzeichen-Apps musst du nichts manuell eintippen.',
      learnMoreSlug: 'wo-kommt-das-kennzeichen-her',
    },
    {
      question: 'Ist die App für Kinder geeignet?',
      answer:
        'Ja — das klassische Autobahn-Kennzeichen-Spiel ist mit der App wie neu: Kinder scannen vom Rücksitz, lernen nebenbei Geografie und sammeln Punkte für die Familie.',
      learnMoreSlug: 'autokennzeichen-spiel-fuer-kinder',
    },
    {
      question: 'Funktioniert die App offline?',
      answer:
        'Ja — Scannen und Sammeln funktionieren ohne Internetverbindung, ideal für Autobahn-Funklöcher und Auslandsfahrten ohne Roaming.',
    },
    {
      question: 'Welche Länder werden erkannt?',
      answer:
        'Die KI erkennt Kennzeichen aus hunderten Ländern weltweit — von D/A/CH über ganz Europa bis zu exotischen Urlaubsfunden.',
    },
    {
      question: 'Was kostet KennzeichenSammler?',
      answer:
        'Die App ist kostenlos für iPhone und iPad. Optionale Premium-Funktionen gibt es als In-App-Kauf.',
    },
  ],
  ctaHeading: 'Deine Sammlung startet mit dem nächsten Schild',
  ctaText: 'Lade KennzeichenSammler kostenlos und scanne auf der nächsten Fahrt dein erstes Kennzeichen — die Weltkarte wartet.',
  category: 'GameApplication',
  downloadNote: 'Kostenlos laden • In-App-Käufe verfügbar',
};
