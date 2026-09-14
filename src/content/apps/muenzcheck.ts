import { ScanLine, Coins, Landmark, Sparkles, Euro, ClipboardList } from 'lucide-react';
import type { AppContent } from './types';

export const muenzcheck: AppContent = {
  slug: 'muenzen-wert-scanner-app',
  appId: '6794744006',
  name: 'MünzCheck',
  storeName: 'Münzen Wert Scanner: MünzCheck',
  subtitle: 'Münzwert prüfen & Sammlung führen',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/münzen-wert-scanner-münzcheck/id6794744006',
  icon: '/apps/muenzcheck/icon.webp',
  accent: '#eab308',
  accentDark: '#a16207',
  heroTitle: {
    pre: 'Was ist deine Münze wirklich wert?',
    highlight: 'Die ehrliche Antwort',
    post: '',
  },
  heroDescription:
    'MünzCheck ist für deutsche Sammler gebaut: alle fünf Prägestätten, die Serien, die hier wirklich gesammelt werden, und Richtwerte aus einem geprüften Katalog statt aus einer Schätzung. Auch dann, wenn die Antwort „ungefähr drei Euro" lautet.',
  heroBenefits: [
    'Wert-Check ohne Foto: Jahrgang und Prägebuchstabe eingeben',
    'KI-Scanner erkennt Nennwert, Jahrgang und Prägezeichen',
    'Bundesländer-Serie I komplett kostenlos sammelbar',
    'Raritäten-Check mit Magnettest zum Selberprüfen',
    'D-Mark-Umrechnung zum amtlichen Kurs',
  ],
  metaTitle: 'MünzCheck – Münzen Wert Scanner & Sammlung',
  metaDescription:
    'Münzwert bestimmen ohne Rätselraten: Jahrgang und Prägestätte eingeben oder Münze scannen. Richtwerte aus geprüftem Katalog und D-Mark-Umrechnung.',
  metaKeywords:
    'münzen wert, münzwert bestimmen, münzen scanner app, 2 euro münzen wert, d-mark wert, prägestätte buchstaben, münzsammlung app, seltene münzen deutschland, bundesländer serie münzen',
  screenshots: [
    { src: '/apps/muenzcheck/screenshot-1.webp', alt: 'MünzCheck – Münze mit dem KI-Scanner erkennen' },
    { src: '/apps/muenzcheck/screenshot-2.webp', alt: 'MünzCheck – Sammelalbum der Bundesländer-Serie' },
    { src: '/apps/muenzcheck/screenshot-3.webp', alt: 'MünzCheck – Übersicht der Sammlung mit Richtwerten' },
    { src: '/apps/muenzcheck/screenshot-4.webp', alt: 'MünzCheck – Raritäten und seltene deutsche Münzen' },
    { src: '/apps/muenzcheck/screenshot-5.webp', alt: 'MünzCheck – Wert-Check mit Jahrgang und Prägebuchstabe' },
  ],
  audience: [
    {
      badge: 'Erbstück',
      title: 'Geerbte Münzkisten',
      description: 'Eine Schachtel D-Mark vom Dachboden: Die häufigste Frage ist, ob etwas dabei ist. MünzCheck beantwortet sie, ohne etwas schönzureden.',
      color: '#a16207',
    },
    {
      badge: 'Sammler',
      title: 'Aktive Sammler',
      description: 'Bundesländer-Serie, 2-Euro-Gedenkmünzen, D-Mark-Porträtserie — mit allen fünf Prägestätten sauber geführt.',
      color: '#0284c7',
    },
    {
      badge: 'Alltag',
      title: 'Wechselgeld-Prüfer',
      description: 'Wer wissen will, ob die 2-Euro-Münze im Portemonnaie eine gesuchte ist: Jahrgang und Buchstabe eingeben, fertig.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: Coins,
      title: 'Wert-Check ohne Foto',
      description:
        'Jahrgang und Prägebuchstaben eingeben, Wert ablesen. Ohne Kamera, ohne Internet — der schnellste Weg zur Antwort und oft der einzige, der bei abgegriffenen Münzen zuverlässig funktioniert.',
      color: '#a16207',
    },
    {
      icon: ScanLine,
      title: 'KI-Scanner',
      description:
        'Münze fotografieren, Nennwert, Jahrgang und Prägezeichen werden abgelesen. Der Wert kommt dabei immer aus dem geprüften Katalog der App — nie aus der KI.',
      color: '#0284c7',
    },
    {
      icon: Landmark,
      title: 'Alle fünf Prägestätten',
      description:
        'A Berlin, D München, F Stuttgart, G Karlsruhe, J Hamburg. Karlsruhe prägt nur rund 14 Prozent — deshalb fehlt das G am Ende fast jeder Sammlung.',
      color: '#059669',
    },
    {
      icon: Sparkles,
      title: 'Raritäten-Check',
      description:
        '2 Pfennig 1968 und 1969 aus massivem Kupfer mit Magnettest zum Selberprüfen, 5 D-Mark 1958 J, 50 Pfennig 1950 G — und die ehrliche Einordnung, dass über 95 Prozent aller Münzen eben nicht selten sind.',
      color: '#be185d',
    },
    {
      icon: Euro,
      title: 'D-Mark verstehen',
      description:
        'Umrechnung zum amtlichen Kurs von 1,95583 DM je Euro. Die Bundesbank tauscht D-Mark unbefristet und gebührenfrei um — nur bei einer Rarität wäre das ein teurer Fehler.',
      color: '#d97706',
    },
    {
      icon: ClipboardList,
      title: 'Sammlung führen',
      description:
        'Die Bundesländer-Serie I mit 16 Motiven in fünf Prägestätten — 80 Münzen — ist vollständig kostenlos sammelbar. Pro ergänzt Serie II, weitere Gedenkmünzen und den laufenden Richtwert deiner Sammlung.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Münze prüfen', description: 'Jahrgang und Prägebuchstaben eingeben — oder die Münze scannen.' },
    { title: 'Richtwert lesen', description: 'Der Wert kommt aus dem geprüften Katalog, nicht aus einer Schätzung.' },
    { title: 'In die Sammlung eintragen', description: 'Fundstücke landen im Album, sortiert nach Serie und Prägestätte.' },
    { title: 'Raritäten checken', description: 'Beim Verdacht auf ein Spitzenstück: Magnettest und Einordnung in der App.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Kostenlos: die komplette Bundesländer-Serie I mit 80 Münzen, der Wert-Check, drei KI-Scans zum Ausprobieren, die D-Mark-Umrechnung und die ersten Raritäten.',
  pricingPro: {
    name: 'MünzCheck Pro',
    bullets: [
      'Bundesländer-Serie II und weitere 2-Euro-Gedenkmünzen',
      '2-DM-Porträtserie und frühe 5-DM-Silbergedenkmünzen',
      'Alle bekannten Raritäten',
      'Richtwert der Sammlung und Export als Liste',
    ],
    note: 'Einmalig, kein Abo — inklusive 10 KI-Scans',
  },
  guides: [
    {
      slug: 'muenzwert-bestimmen',
      keyword: 'münzwert bestimmen',
      title: 'Münzwert bestimmen: was den Preis wirklich macht',
      metaTitle: 'Münzwert bestimmen: Jahrgang, Prägestätte, Erhaltung',
      metaDescription:
        'Warum dieselbe Münze zwei Euro oder zweihundert wert sein kann: Auflage, Prägestätte, Erhaltungsgrad und Nachfrage — Alter zählt fast nie.',
      excerpt: 'Auflage, Prägestätte, Erhaltung, Nachfrage — und warum Alter fast nichts über den Wert sagt.',
      intro: [
        'Die häufigste Annahme beim Münzwert ist auch die falscheste: dass alte Münzen wertvoll sind. Eine römische Münze kostet oft zwanzig Euro, weil Millionen davon existieren; eine deutsche Münze von 1969 kann das Zehnfache bringen, weil ein Prägefehler sie selten gemacht hat.',
        'Was den Wert bestimmt, sind vier Faktoren — und Alter gehört nicht dazu.',
      ],
      sections: [
        {
          heading: 'Die vier Faktoren',
          numbered: [
            'Auflage: Wie viele wurden geprägt? Das ist der wichtigste Punkt. Ein Jahrgang mit 500.000 Stück ist etwas völlig anderes als einer mit 50 Millionen.',
            'Prägestätte: Dieselbe Münze mit anderem Buchstaben kann ein Vielfaches wert sein, weil einzelne Prägestätten deutlich kleinere Mengen liefern.',
            'Erhaltungsgrad: Von „stark abgegriffen" bis „bankfrisch" liegen oft Faktoren, nicht Prozente. Eine Zirkulationsmünze aus dem Portemonnaie erreicht selten die oberen Stufen.',
            'Nachfrage: Wert entsteht dort, wo gesammelt wird. Deutsche Sammler suchen deutsche Serien — das ist der Grund, warum international bewertete Apps hier oft danebenliegen.',
          ],
        },
        {
          heading: 'Was den Wert zerstört',
          bullets: [
            'Reinigen. Der häufigste und teuerste Fehler — Kratzer und verlorene Patina kosten oft mehr Wert als der Schmutz.',
            'Lose in einer Dose aufbewahren, wo Münzen aneinander scheuern.',
            'Anfassen der Prägefläche mit bloßen Fingern statt am Rand.',
            'Löcher bohren, Lackieren, Polieren — macht aus einer Sammlermünze ein Stück Metall.',
          ],
        },
        {
          heading: 'Was ein Richtwert ist und was nicht',
          paragraphs: [
            'Ein Katalogwert ist ein Orientierungspreis, kein Angebot. Was du tatsächlich bekommst, hängt vom Erhaltungsgrad, vom Käufer und vom Weg ab: Händler zahlen weniger als der Katalog, Auktionen können darüber liegen, und Sammlerbörsen liegen dazwischen.',
            'Seriös ist deshalb jede Angabe, die eine Spanne nennt und beim Erhaltungsgrad unterscheidet. Ein einzelner Eurobetrag ohne Kontext ist Marketing, keine Bewertung.',
          ],
        },
      ],
      howToHeading: 'Wert prüfen mit MünzCheck',
      howToSteps: [
        { title: 'Jahrgang und Buchstaben eingeben', text: 'Der Wert-Check funktioniert ohne Foto und ohne Internet.' },
        { title: 'Prägestätte beachten', text: 'Gerade bei deutschen Münzen entscheidet der Buchstabe häufig über den Wert.' },
        { title: 'Erhaltung realistisch einschätzen', text: 'Umlaufmünzen aus dem Portemonnaie erreichen die oberen Erhaltungsstufen praktisch nie.' },
        { title: 'Katalogwert einordnen', text: 'Die App nennt Richtwerte aus geprüftem Katalog — kein Verkaufsversprechen.' },
      ],
      faqs: [
        {
          question: 'Sollte ich meine Münzen vor dem Verkauf reinigen?',
          answer: 'Nein. Reinigen senkt bei Sammlermünzen fast immer den Wert, oft erheblich. Im Zweifel gar nichts tun und einen Fachmann fragen.',
        },
        {
          question: 'Warum zeigen andere Apps höhere Werte?',
          answer: 'Viele internationale Scanner-Apps schätzen Werte automatisch und unterscheiden deutsche Prägestätten nicht sauber. MünzCheck nimmt Richtwerte aus einem geprüften Katalog, auch wenn das Ergebnis unspektakulär ausfällt.',
        },
      ],
      screenshotIndex: 4,
    },
    {
      slug: 'praegestaetten-buchstaben',
      keyword: 'prägestätten buchstaben münzen',
      title: 'A, D, F, G, J: die Prägestätten-Buchstaben auf deutschen Münzen',
      metaTitle: 'Prägestätten auf deutschen Münzen: A, D, F, G und J erklärt',
      metaDescription:
        'Was die Buchstaben auf deutschen Münzen bedeuten, welche Prägestätte welche Mengen liefert und wo der Buchstabe auf der Münze zu finden ist.',
      excerpt: 'Was A, D, F, G und J bedeuten, welche Mengen sie liefern und warum das G am schwersten zu finden ist.',
      intro: [
        'Auf jeder deutschen Umlaufmünze steht ein kleiner Buchstabe. Er verrät, in welcher der fünf staatlichen Prägestätten sie hergestellt wurde — und er ist für Sammler oft wichtiger als der Jahrgang.',
        'Der Grund ist simpel: Die Prägemengen sind nach einem festen Schlüssel verteilt, und die kleinste Prägestätte liefert weniger als ein Sechstel der größten.',
      ],
      sections: [
        {
          heading: 'Die fünf Prägestätten',
          bullets: [
            'A — Berlin',
            'D — München',
            'F — Stuttgart',
            'G — Karlsruhe',
            'J — Hamburg',
          ],
        },
        {
          heading: 'Warum das G fehlt',
          paragraphs: [
            'Die Prägeaufträge werden nach einem festen Anteil verteilt. Karlsruhe kommt dabei auf rund 14 Prozent, während größere Standorte deutlich mehr produzieren. Über eine komplette Serie hinweg bedeutet das: Statistisch ist jede sechste bis siebte Münze ein G — und in einer Sammlung, die aus Wechselgeld entsteht, ist es fast immer die letzte Lücke.',
            'Für einzelne Jahrgänge kann der Unterschied noch drastischer sein, wenn eine Prägestätte einen Auftrag gar nicht mitgeprägt hat. Genau diese Kombinationen sind es, die aus einer Alltagsmünze eine gesuchte macht.',
          ],
        },
        {
          heading: 'Wo der Buchstabe steht',
          numbered: [
            'Bei Euro-Münzen: auf der nationalen Seite, meist am unteren Rand oder neben dem Motiv.',
            'Bei D-Mark-Münzen: auf der Wertseite unter oder neben der Jahreszahl.',
            'Bei 2-Euro-Gedenkmünzen: im Motiv integriert, oft klein am Rand — dort wird er am häufigsten übersehen.',
            'Bei stark abgegriffenen Münzen hilft schräg einfallendes Licht mehr als eine Lupe.',
          ],
        },
      ],
      howToHeading: 'Prägestätten in der Sammlung verwalten',
      howToSteps: [
        { title: 'Buchstaben ablesen', text: 'Bei schwacher Prägung schräges Licht nutzen, dann ist der Buchstabe meist erkennbar.' },
        { title: 'Nach Prägestätte eintragen', text: 'Das Album führt jede Serie in allen fünf Prägestätten getrennt.' },
        { title: 'Lücken sehen', text: 'Auf einen Blick erkennst du, welcher Buchstabe dir fehlt — meistens das G.' },
        { title: 'Gezielt suchen', text: 'Mit der Lückenliste weißt du beim Durchsehen von Wechselgeld genau, worauf du achtest.' },
      ],
      faqs: [
        {
          question: 'Warum gibt es kein B, C oder E?',
          answer: 'Diese Buchstaben gehörten zu früheren Prägestätten, die nicht mehr existieren. Heute prägen nur noch die fünf Standorte A, D, F, G und J.',
        },
        {
          question: 'Ist eine Münze mit G immer wertvoller?',
          answer: 'Nicht automatisch. Die kleinere Prägemenge macht sie tendenziell schwerer zu finden, aber der Wert hängt zusätzlich von Jahrgang, Serie und Erhaltung ab.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'd-mark-umtauschen-oder-behalten',
      keyword: 'd-mark umtauschen oder behalten',
      title: 'D-Mark umtauschen oder behalten? Erst prüfen, dann tauschen',
      metaTitle: 'D-Mark umtauschen: Kurs, Bundesbank & Behalten',
      metaDescription:
        'Die Bundesbank tauscht D-Mark unbefristet und gebührenfrei um. Wann sich das lohnt und welche Münzen mehr wert sind als ihr Umtauschwert.',
      excerpt: 'Unbefristeter Umtausch zum amtlichen Kurs — und die Münzen, bei denen Tauschen ein teurer Fehler wäre.',
      intro: [
        'Nach der Euro-Einführung sind in deutschen Haushalten Milliardenbeträge in D-Mark geblieben, ein erheblicher Teil davon in Münzen. Die gute Nachricht: Die Deutsche Bundesbank tauscht D-Mark unbefristet und gebührenfrei zum amtlichen Kurs von 1,95583 DM je Euro um.',
        'Die schlechte: Wer eine Kiste Münzen ungeprüft einreicht, kann dabei ein Sammlerstück zum Materialwert weggeben.',
      ],
      sections: [
        {
          heading: 'So funktioniert der Umtausch',
          numbered: [
            'Der Kurs ist fest: 1 Euro = 1,95583 DM. Er ändert sich nicht mehr.',
            'Der Umtausch ist unbefristet und gebührenfrei — es gibt keine Frist, die abläuft.',
            'Möglich ist er bei den Filialen der Bundesbank sowie per Einsendung mit dem entsprechenden Formular.',
            'Banken und Sparkassen tauschen in der Regel nicht mehr um.',
            'Vor dem Einreichen: aussortieren, was mehr wert sein könnte als der Nennwert.',
          ],
        },
        {
          heading: 'Was du vorher aussortieren solltest',
          bullets: [
            '2 Pfennig 1968 und 1969: teilweise aus massivem Kupfer statt kupferbeschichtetem Eisen — mit dem Magnettest in Sekunden zu prüfen.',
            '5 D-Mark 1958 J: eines der bekanntesten Spitzenstücke der Nachkriegszeit.',
            '50 Pfennig 1950 G: eine der gesuchtesten Kleinmünzen überhaupt.',
            'Silbermünzen: die frühen 5-DM-Gedenkmünzen enthalten Silber und haben schon deshalb einen Materialwert über dem Umtauschwert.',
            'Alles in auffallend guter Erhaltung: bankfrische Rollenware ist eine eigene Kategorie.',
          ],
        },
        {
          heading: 'Der Magnettest',
          paragraphs: [
            'Die 2-Pfennig-Münzen der Jahrgänge 1968 und 1969 wurden teils aus massivem Kupfer, teils aus kupferplattiertem Eisen geprägt. Ein Haushaltsmagnet unterscheidet beide sofort: Bleibt die Münze haften, ist sie Eisen und damit die häufige Variante. Haftet sie nicht, lohnt der genauere Blick.',
            'Der Test dauert Sekunden und ist der Grund, warum eine ungeprüfte Münzkiste selten eine gute Idee ist — der Unterschied zwischen den beiden Varianten ist erheblich.',
          ],
        },
      ],
      howToHeading: 'Vor dem Umtausch mit MünzCheck prüfen',
      howToSteps: [
        { title: 'Kiste grob sortieren', text: 'Nach Nennwert und Jahrgang trennen — das geht schneller als einzeln prüfen.' },
        { title: 'Auffällige Jahrgänge checken', text: 'Jahrgang und Prägebuchstabe eingeben, Richtwert lesen.' },
        { title: 'Magnettest machen', text: 'Bei 2 Pfennig 1968 und 1969 entscheidet der Magnet in Sekunden.' },
        { title: 'Rest umrechnen', text: 'Was übrig bleibt, rechnet die App zum amtlichen Kurs um — dann lohnt der Weg zur Bundesbank.' },
      ],
      faqs: [
        {
          question: 'Kann ich D-Mark noch umtauschen?',
          answer: 'Ja. Die Bundesbank tauscht D-Mark-Bargeld unbefristet und gebührenfrei zum amtlichen Kurs von 1,95583 DM je Euro um.',
        },
        {
          question: 'Lohnt es sich, D-Mark zu behalten?',
          answer: 'Für den Großteil des Umlaufgelds nicht — der Sammlerwert liegt beim Nennwert. Lohnend ist es bei Raritäten, Silbermünzen und sehr guten Erhaltungsgraden, deshalb vorher prüfen.',
        },
      ],
      screenshotIndex: 3,
    },
    {
      slug: '2-euro-muenzen-fehlpraegungen-wert',
      lang: 'de',
      keyword: '2 euro münzen fehlprägung wert',
      title: '2-Euro-Münzen mit Fehlprägung: welche wirklich wertvoll sind und welche nur so aussehen',
      metaTitle: '2 Euro Fehlprägung Wert – echte Fehler vs. Abnutzung',
      metaDescription:
        'Verschobene Ringe, fehlende Sterne, doppelte Prägung: Welche Fehlprägungen bei 2-Euro-Münzen Sammlerwert haben, welche nur Beschädigung sind und wie man den Unterschied erkennt.',
      excerpt: 'Die meisten „Fehlprägungen" aus dem Portemonnaie sind Abnutzung. Woran man die echten erkennt.',
      intro: [
        'Kaum eine Suchanfrage rund ums Münzensammeln ist so verbreitet — und so oft von Enttäuschung gefolgt — wie die nach wertvollen 2-Euro-Fehlprägungen. Der Grund: Jede Münze, die jahrelang im Umlauf war, hat Kratzer, Dellen und Kanten, die auf den ersten Blick wie ein Prägefehler wirken.',
        'Echte Fehlprägungen entstehen in der Prägeanstalt, nicht im Geldbeutel. Sie sind selten, sie haben einen Markt, und sie lassen sich mit ein paar Kriterien von Beschädigungen unterscheiden.',
      ],
      sections: [
        {
          heading: 'Fehlprägungen, die einen Markt haben',
          bullets: [
            'Verschobener oder fehlender Pillenkern: Der innere Teil sitzt nicht mittig oder ist ganz getrennt geprägt worden.',
            'Doppelprägung oder Stempeldrehung: Das Motiv erscheint doppelt oder Vorder- und Rückseite stehen deutlich verdreht zueinander.',
            'Prägung auf falschem Rohling — etwa ein 2-Euro-Motiv auf einem 1-Euro-Rohling.',
            'Fehlende Randschrift oder Randschrift eines anderen Landes.',
            'Bekannte Varianten wie fehlende Sterne oder Stempelfehler bestimmter Jahrgänge und Prägestätten, die in Katalogen geführt werden.',
          ],
        },
        {
          heading: 'Was nur nach Fehler aussieht',
          bullets: [
            'Kratzer, Riefen und Dellen: Umlaufspuren, kein Sammlerwert.',
            'Verfärbungen und Flecken: Chemische Reaktionen, meist wertmindernd statt wertsteigernd.',
            'Leicht unscharfe Details: Abgenutzte Stempel sind normal und bringen nichts.',
            'Lose Pillen bei stark abgenutzten Münzen: Materialermüdung, keine Fehlprägung.',
            'Manipulierte Münzen aus Werkstätten — verschobene Kerne lassen sich nachträglich erzeugen und werden als Fehlprägung angeboten.',
          ],
        },
        {
          heading: 'Vom Verdacht zum Wert',
          numbered: [
            'Münze nicht reinigen — Reinigung zerstört die Oberfläche und mindert jeden Wert.',
            'Fehler dokumentieren: Foto beider Seiten und des Rands bei gutem Licht.',
            'In Katalogen und Sammlerforen nach der Kombination aus Land, Jahr, Prägestätte und Fehlertyp suchen.',
            'Bei plausiblem Verdacht eine Prüfung durch ein Münzhandelshaus oder einen Gutachter anfragen — Echtheit ist die Frage, die den Preis macht.',
            'Verkauf über Fachhandel oder Auktion, nicht über Kleinanzeigen, wo Fehlprägungen regelmäßig weit unter Wert weggehen.',
          ],
        },
        {
          heading: 'Die Sache mit den Gerüchten',
          paragraphs: [
            'Jedes Jahr kursieren Meldungen über 2-Euro-Münzen, die angeblich Tausende wert sind. Fast immer geht es um normale Gedenkmünzen mit hoher Auflage, deren Wert bei zwei bis vier Euro liegt. Echte vierstellige Preise gibt es nur bei nachgewiesenen, seltenen Fehlprägungen oder bei Kleinstauflagen wie den Gedenkmünzen aus Monaco, San Marino oder dem Vatikan.',
            'Wer eine Münze für wertvoll hält, sollte sie deshalb erst identifizieren und dann bewerten — nicht umgekehrt.',
          ],
        },
      ],
      howToHeading: 'Münzen mit der App prüfen',
      howToSteps: [
        { title: 'Beide Seiten scannen', text: 'Die App erkennt Land, Jahrgang und Motiv und ordnet die Münze dem Katalogeintrag zu.' },
        { title: 'Auflage ansehen', text: 'Die Auflagenzahl zeigt sofort, ob es sich um eine Massenmünze oder eine Seltenheit handelt.' },
        { title: 'Prägestätte prüfen', text: 'Bei deutschen Münzen entscheidet der Buchstabe A, D, F, G oder J mit über den Wert.' },
        { title: 'Verdacht notieren', text: 'Fotos und Notizen zu einer möglichen Fehlprägung bleiben bei der Münze in deiner Sammlung.' },
      ],
      faqs: [
        {
          question: 'Sind die 2-Euro-Gedenkmünzen aus dem Umlauf etwas wert?',
          answer: 'Deutsche Bundesländer-Serien und die meisten EU-Gedenkmünzen haben Auflagen in Millionenhöhe und liegen bei zwei bis vier Euro. Wertvoll sind Kleinstauflagen und echte Fehlprägungen.',
        },
        {
          question: 'Erkennt die App Fehlprägungen?',
          answer: 'Die App identifiziert die Münze und zeigt Auflage und Katalogwert. Ob ein Fehler echt ist, kann nur eine Begutachtung klären — die App hilft, den Verdacht sauber zu dokumentieren.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'muenzen-reinigen-oder-nicht',
      lang: 'de',
      keyword: 'münzen reinigen',
      title: 'Münzen reinigen: warum Sammler es nicht tun — und was erlaubt ist',
      metaTitle: 'Münzen reinigen – warum es den Wert zerstört',
      metaDescription:
        'Eine geputzte Münze ist für Sammler eine beschädigte Münze. Was die Patina schützt, welche Hausmittel den Wert vernichten und welche schonende Behandlung ausnahmsweise vertretbar ist.',
      excerpt: 'Glänzend heißt nicht wertvoll: Warum Reinigung der häufigste Fehler von Erben und Einsteigern ist.',
      intro: [
        'Wer eine alte Münzsammlung erbt oder im Nachlass findet, greift oft als Erstes zu Zahnpasta, Essig oder Silberputzmittel. Das Ergebnis glänzt — und ist für jeden Händler sofort als gereinigt erkennbar. Bei Sammlermünzen bedeutet das regelmäßig einen Wertverlust von der Hälfte bis fast zum Metallwert.',
        'Der Grund liegt in der Oberfläche: Die natürliche Patina und die feinen Prägespuren sind Teil dessen, was bewertet wird. Sie lassen sich entfernen, aber nie wiederherstellen.',
      ],
      sections: [
        {
          heading: 'Was Reinigung anrichtet',
          bullets: [
            'Mikrokratzer durch jedes Reibmittel, auch weiche Tücher — unter der Lupe sofort sichtbar.',
            'Entfernte Patina: Bei Silber und Kupfer ist die dunkle Schicht Schutz und Echtheitsmerkmal zugleich.',
            'Unnatürlicher Glanz, der eine Umlaufmünze wie eine schlecht gefälschte Prägefrische aussehen lässt.',
            'Chemische Angriffe durch Essig, Zitronensäure oder Cola, die Ränder abrunden und Details auflösen.',
          ],
        },
        {
          heading: 'Wann Reinigung ausnahmsweise vertretbar ist',
          bullets: [
            'Bei Umlaufmünzen ohne Sammlerwert, die nur ansehnlich sein sollen.',
            'Bei Erde und losem Schmutz auf Bodenfunden: nur mit destilliertem Wasser und ohne Reiben.',
            'Bei Fettspuren und Fingerabdrücken auf modernen Münzen: kurzes Bad in destilliertem Wasser, an der Luft trocknen, nicht abwischen.',
            'Nie bei Gold-, Silber- oder Kupfermünzen mit Patina, nie bei Münzen, deren Wert man nicht kennt.',
          ],
        },
        {
          heading: 'Richtig aufbewahren statt reinigen',
          numbered: [
            'Nur am Rand anfassen; Hautfett hinterlässt Spuren, die Jahre später sichtbar werden.',
            'Trocken lagern, fern von PVC-haltigen Hüllen, die Weichmacher abgeben und grüne Beläge erzeugen.',
            'Kapseln oder säurefreie Münzrähmchen verwenden.',
            'Sammlung dokumentieren — Herkunft, Zustand und Fotos — bevor irgendjemand auf die Idee kommt, sie zu putzen.',
          ],
        },
        {
          heading: 'Der Erbfall',
          paragraphs: [
            'Die meisten wertvollen Münzen, die gereinigt werden, gehören Menschen, die den Wert nicht kannten. Wer eine Sammlung übernimmt, sollte deshalb zuerst identifizieren und bewerten und erst dann entscheiden, was mit den einzelnen Stücken geschieht.',
            'Ein einziger Nachmittag mit Lupe, Katalog und Kamera verhindert Fehler, die sich nicht rückgängig machen lassen.',
          ],
        },
      ],
      howToHeading: 'Geerbte Sammlungen mit der App erfassen',
      howToSteps: [
        { title: 'Münze für Münze scannen', text: 'Land, Jahrgang, Motiv und Prägestätte werden erkannt, ohne dass du die Münze berühren musst.' },
        { title: 'Wert und Auflage sehen', text: 'Du weißt sofort, welche Stücke Umlaufmünzen sind und welche eine Begutachtung verdienen.' },
        { title: 'Zustand notieren', text: 'Fotos und Notizen zu Patina und Erhaltung bleiben beim Eintrag — vor jeder Entscheidung über Reinigung.' },
        { title: 'Sammlung ordnen', text: 'Nach Land, Metall oder Wert sortieren, um einen Überblick über den Nachlass zu bekommen.' },
      ],
      faqs: [
        {
          question: 'Kann ich D-Mark-Münzen reinigen?',
          answer: 'Umlaufmünzen mit hoher Auflage ja, sie haben ohnehin nur Nennwert. Bei Silber-Gedenkmünzen und seltenen Jahrgängen nicht — dort zählt die Erhaltung.',
        },
        {
          question: 'Woran erkennt ein Händler, dass eine Münze gereinigt wurde?',
          answer: 'An feinen parallelen Kratzern, an fehlender Patina in Vertiefungen und an einem Glanz, der nicht zum Abnutzungsgrad der Prägung passt.',
        },
      ],
      screenshotIndex: 1,
    },
  ],
  faqs: [
    {
      question: 'Was macht MünzCheck?',
      answer:
        'MünzCheck bestimmt den Richtwert deutscher Münzen — per Eingabe von Jahrgang und Prägebuchstabe oder per KI-Scan — und führt deine Sammlung nach Serien und allen fünf Prägestätten.',
      learnMoreSlug: 'muenzwert-bestimmen',
    },
    {
      question: 'Woher kommen die Werte?',
      answer:
        'Aus einem geprüften Katalog in der App, nie aus einer KI-Schätzung. Der Scanner liest nur Nennwert, Jahrgang und Prägezeichen ab.',
      learnMoreSlug: 'muenzwert-bestimmen',
    },
    {
      question: 'Was bedeuten die Buchstaben A, D, F, G und J?',
      answer:
        'Sie stehen für die fünf Prägestätten Berlin, München, Stuttgart, Karlsruhe und Hamburg. Karlsruhe prägt am wenigsten, weshalb das G in den meisten Sammlungen zuletzt fehlt.',
      learnMoreSlug: 'praegestaetten-buchstaben',
    },
    {
      question: 'Kann ich D-Mark noch umtauschen?',
      answer:
        'Ja, bei der Bundesbank unbefristet und gebührenfrei zum Kurs von 1,95583 DM je Euro. Vorher lohnt der Blick auf mögliche Raritäten.',
      learnMoreSlug: 'd-mark-umtauschen-oder-behalten',
    },
    {
      question: 'Was ist kostenlos?',
      answer:
        'Die komplette Bundesländer-Serie I mit 80 Münzen, der Wert-Check ohne Foto, drei KI-Scans, die D-Mark-Umrechnung und die ersten Raritäten.',
    },
    {
      question: 'Ist Pro ein Abo?',
      answer:
        'Nein. MünzCheck Pro ist eine einmalige Freischaltung und enthält Serie II, weitere Gedenkmünzen, alle bekannten Raritäten, den Sammlungswert samt Export und 10 KI-Scans.',
    },
  ],
  ctaHeading: 'Erst prüfen, dann entscheiden',
  ctaText: 'MünzCheck kostenlos laden, Jahrgang und Prägebuchstaben eingeben und in Sekunden wissen, was die Münze wirklich wert ist.',
  category: 'ReferenceApplication',
  downloadNote: 'Kostenlos laden • Pro einmalig, kein Abo',
};
