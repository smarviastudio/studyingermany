import type { AppGuide } from './types';

const APP_URL = 'https://apps.apple.com/de/app/id6794609450';
const APP = 'Fahrschule 3D: Vorfahrt üben';

const law = (para: string, title: string, book = 'stvo_2013') => ({
  title,
  url: `https://www.gesetze-im-internet.de/${book}/__${para}.html`,
});
const stvo3 = law('3', '§ 3 StVO – Geschwindigkeit');
const stvo5 = law('5', '§ 5 StVO – Überholen');
const stvo8 = law('8', '§ 8 StVO – Vorfahrt');
const stvo9 = law('9', '§ 9 StVO – Abbiegen, Wenden und Rückwärtsfahren');
const stvo10 = law('10', '§ 10 StVO – Einfahren und Anfahren');
const stvo11 = law('11', '§ 11 StVO – Besondere Verkehrslagen');
const stvo15 = law('15', '§ 15 StVO – Liegenbleiben von Fahrzeugen');
const stvo17 = law('17', '§ 17 StVO – Beleuchtung');
const stvo20 = law('20', '§ 20 StVO – Öffentliche Verkehrsmittel und Schulbusse');
const stvo26 = law('26', '§ 26 StVO – Fußgängerüberwege');
const stvo36 = law('36', '§ 36 StVO – Zeichen und Weisungen der Polizeibeamten');
const stvo37 = law('37', '§ 37 StVO – Wechsellichtzeichen, Dauerlichtzeichen und Grünpfeil');
const stvo38 = law('38', '§ 38 StVO – Blaues und gelbes Blinklicht');
const stvo2 = law('2', '§ 2 StVO – Straßenbenutzung durch Fahrzeuge');
const anlage2 = { title: 'Anlage 2 StVO – Vorschriftzeichen (u. a. Zeichen 206 Stopp)', url: 'https://www.gesetze-im-internet.de/stvo_2013/anlage_2.html' };
const stvg2a = law('2a', '§ 2a StVG – Fahrerlaubnis auf Probe', 'stvg');
const stvg24c = law('24c', '§ 24c StVG – Alkoholverbot für Fahranfänger', 'stvg');
const stgb323c = law('323c', '§ 323c StGB – Unterlassene Hilfeleistung', 'stgb');
const bkat = { title: 'Bußgeldkatalog-Verordnung (BKatV)', url: 'https://www.gesetze-im-internet.de/bkatv_2013/' };

const guides: AppGuide[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'stoppschild-richtig-anhalten',
    keyword: 'stoppschild richtig anhalten',
    title: 'Stoppschild: Wo genau musst du anhalten – und wie lange?',
    metaTitle: 'Stoppschild richtig anhalten – Haltlinie, Sichtlinie, Prüfung',
    metaDescription:
      'Am Stoppschild (Zeichen 206) musst du immer vollständig anhalten – an der Haltlinie oder dort, wo du die Straße einsehen kannst. So geht es richtig, auch in der Fahrprüfung.',
    excerpt: 'Haltlinie, Sichtlinie, zweimal anhalten: was Zeichen 206 wirklich verlangt.',
    keyTakeaways: [
      'Am Stoppschild (Zeichen 206 „Halt. Vorfahrt gewähren.“) musst du immer vollständig anhalten – auch wenn die Kreuzung leer ist.',
      'Gibt es eine Haltlinie, hältst du dort. Gibt es keine, hältst du dort, wo du die Vorfahrtstraße überblicken kannst.',
      'Siehst du an der Haltlinie nichts, hältst du ein zweites Mal an der Sichtlinie.',
      'Nach dem Anhalten musst du allen Vorfahrt gewähren – auch Radfahrern auf dem Radweg der Vorfahrtstraße.',
    ],
    intro: [
      'Das Stoppschild ist das einzige Verkehrszeichen, das ausnahmslos einen vollständigen Halt verlangt. „Langsam ranrollen und schauen“ reicht nicht: Die Räder müssen kurz komplett stillstehen, auch wenn weit und breit kein Fahrzeug zu sehen ist. Danach gilt dasselbe wie bei „Vorfahrt gewähren“ – du lässt den Verkehr auf der Vorfahrtstraße durch.',
      'In der praktischen Prüfung ist das „Rollstopp“ am Stoppschild einer der Klassiker unter den Fehlern, die sofort zum Abbruch führen können. In der Theorieprüfung wird vor allem gefragt, wo genau angehalten werden muss. Beides klärt dieser Ratgeber.',
    ],
    sections: [
      {
        heading: 'Wo muss ich am Stoppschild anhalten?',
        paragraphs: [
          'Ist eine Haltlinie (Zeichen 294, die breite weiße Querlinie) auf der Fahrbahn markiert, hältst du unmittelbar davor an. Fehlt die Haltlinie, hältst du dort, wo du die andere Straße überblicken kannst – so steht es in Anlage 2 zur StVO bei Zeichen 206.',
          'Häufig liegt die Haltlinie vor einer Hecke, einem parkenden Lkw oder einem Radweg. Dann siehst du von dort aus nicht in die Vorfahrtstraße hinein. Die richtige Lösung: erst an der Haltlinie anhalten, dann langsam bis zur Sichtlinie vortasten und dort erneut anhalten, bis du sicher einfahren kannst.',
        ],
      },
      {
        heading: 'So läuft ein korrekter Stopp ab – Schritt für Schritt',
        numbered: [
          'Früh vom Gas gehen, sobald du das achteckige Schild oder das Vorwarnschild „STOP in 100 m“ siehst.',
          'Rechtzeitig bremsen und vor der Haltlinie zum vollständigen Stillstand kommen. Kein Rollen, kein „fast stehen“.',
          'Nach links, rechts und wieder links schauen. Radweg und Gehweg nicht vergessen.',
          'Wenn du nichts siehst: langsam bis zur Sichtlinie vorrollen und erneut anhalten.',
          'Erst einfahren, wenn du niemanden auf der Vorfahrtstraße behinderst oder gefährdest – auch keine Radfahrenden.',
        ],
      },
      {
        heading: 'Stoppschild oder „Vorfahrt gewähren“ – der Unterschied',
        bullets: [
          '„Vorfahrt gewähren“ (Zeichen 205, Dreieck auf der Spitze): Anhalten nur, wenn Verkehr kommt. Ist die Straße frei, darfst du rollend einfahren.',
          'Stoppschild (Zeichen 206, Achteck): Anhalten immer – unabhängig vom Verkehr.',
          'Bei beiden Zeichen hat der Verkehr auf der kreuzenden Straße Vorfahrt; der Unterschied liegt allein in der Pflicht zum Anhalten.',
          'Ein Stoppschild steht meist dort, wo die Sicht schlecht ist oder die Kreuzung als Unfallschwerpunkt gilt.',
        ],
      },
      {
        heading: 'Typische Fehler in Theorie und Praxis',
        bullets: [
          'Rollstopp: Das Auto bewegt sich noch minimal. Prüfer achten genau darauf, ob die Fahrzeugfront kurz nach vorn nickt.',
          'Anhalten erst hinter der Haltlinie: Wer die Linie überfährt, hat nicht korrekt angehalten.',
          'Nur nach links schauen: Fahrzeuge auf der Vorfahrtstraße kommen auch von rechts – und Radfahrer auf Radwegen in beide Richtungen.',
          'Beim Linksabbiegen aus der Nebenstraße vergessen, dass auch der Gegenverkehr aus der anderen Nebenstraße relevant sein kann; zwischen den beiden Nebenstraßen gelten die Abbiegeregeln nach § 9 StVO.',
        ],
      },
    ],
    appTip:
      'In der App stehst du an 3D-Kreuzungen mit Stoppschild und „Vorfahrt gewähren“ und entscheidest, wer zuerst fährt. Im Fahrsimulator bremst du selbst bis zum Stillstand – ein Rollstopp wird als Fehler im Fahrtenbuch gespeichert.',
    howToHeading: 'Stoppschild-Situationen in 3D trainieren',
    howToSteps: [
      { title: 'Schild erkennen', text: 'In der Fahrerperspektive siehst du, wo Schild und Haltlinie tatsächlich stehen.' },
      { title: 'Reihenfolge festlegen', text: 'Entscheide, welche Fahrzeuge auf der Vorfahrtstraße vor dir fahren.' },
      { title: 'Selbst anhalten', text: 'Im Simulator bremst du mit dem Bremspedal bis zum vollständigen Stillstand.' },
      { title: 'Fehler wiederholen', text: 'Situationen, die schiefgingen, kommen im Fahrtenbuch zum Nachüben zurück.' },
    ],
    faqs: [
      { question: 'Muss ich am Stoppschild auch anhalten, wenn niemand kommt?', answer: 'Ja. Zeichen 206 verlangt immer einen vollständigen Halt, unabhängig davon, ob Verkehr kommt.' },
      { question: 'Wie lange muss ich am Stoppschild stehen?', answer: 'Eine Mindestdauer gibt es nicht. Entscheidend ist, dass das Fahrzeug kurz vollständig stillsteht und du danach die Lage in Ruhe beurteilst.' },
      { question: 'Wo halte ich, wenn keine Haltlinie markiert ist?', answer: 'Dort, wo du die Vorfahrtstraße überblicken kannst. So steht es in den Erläuterungen zu Zeichen 206 in Anlage 2 der StVO.' },
      { question: 'Führt ein Rollstopp in der Fahrprüfung zum Durchfallen?', answer: 'Er gilt als erheblicher Fehler beim Beachten der Vorfahrt und kann zum Nichtbestehen führen. Halte im Zweifel lieber deutlich an.' },
      { question: 'Mit welcher App kann ich Stoppschild-Kreuzungen üben?', answer: `Mit ${APP} für iPhone übst du Stoppschild-Kreuzungen in 3D aus der Fahrerperspektive, inklusive StVO-Erklärung: ${APP_URL}` },
    ],
    sources: [anlage2, stvo8, stvo9],
    screenshotIndex: 1,
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'gruener-pfeil-rechts-abbiegen-bei-rot',
    keyword: 'grüner pfeil regeln',
    title: 'Grüner Pfeil: Darf ich bei Rot rechts abbiegen?',
    metaTitle: 'Grüner Pfeil (Grünpfeil) – Regeln, Anhaltepflicht, Bußgeld',
    metaDescription:
      'Beim grünen Pfeilschild darfst du bei Rot rechts abbiegen – aber erst nach vollständigem Anhalten und nur, wenn niemand behindert wird. Die Regeln aus § 37 StVO einfach erklärt.',
    excerpt: 'Anhaltepflicht, rechter Fahrstreifen und Vorrang für Fußgänger: die Grünpfeil-Regeln.',
    keyTakeaways: [
      'Das Blechschild mit grünem Pfeil auf schwarzem Grund erlaubt Rechtsabbiegen bei Rot – aber erst nach vollständigem Anhalten an der Haltlinie.',
      'Abbiegen darfst du nur aus dem rechten Fahrstreifen.',
      'Fußgänger und Radfahrer mit Grün sowie der Querverkehr dürfen weder behindert noch gefährdet werden.',
      'Ein grün leuchtender Pfeil in der Ampel ist etwas anderes: Er gibt die Pfeilrichtung frei, ohne dass du vorher anhalten musst.',
    ],
    intro: [
      'Ja, beim grünen Pfeil darfst du bei roter Ampel rechts abbiegen – aber nur unter strengen Bedingungen. § 37 StVO schreibt vor: erst anhalten, dann aus dem rechten Fahrstreifen abbiegen, und zwar so, dass eine Behinderung oder Gefährdung anderer ausgeschlossen ist. Besonders geschützt sind Fußgänger und Radfahrer, die gerade Grün haben.',
      'Viele verwechseln das Grünpfeil-Schild mit einem grün leuchtenden Pfeil in der Ampel. Das sind zwei völlig verschiedene Regelungen, und genau diese Verwechslung wird in der Theorieprüfung gern abgefragt.',
    ],
    sections: [
      {
        heading: 'Die Regeln beim Grünpfeil-Schild',
        numbered: [
          'Vor der Haltlinie vollständig anhalten – auch wenn frei ist. Ohne Anhalten ist das Abbiegen ein Rotlichtverstoß.',
          'Nur aus dem rechten Fahrstreifen abbiegen.',
          'Fußgänger und Radfahrer, die in deiner Abbiegerichtung Grün haben, haben Vorrang.',
          'Querverkehr von links, der Grün hat, hat ebenfalls Vorrang.',
          'Erst losfahren, wenn du sicher bist, dass du niemanden behinderst. Im Zweifel bleibst du stehen, bis die Ampel Grün zeigt.',
        ],
      },
      {
        heading: 'Grünpfeil-Schild oder leuchtender grüner Pfeil?',
        bullets: [
          'Blechschild mit grünem Pfeil auf schwarzem Grund, rechts neben dem roten Licht: Abbiegen bei Rot nach Anhalten erlaubt.',
          'Grün leuchtender Pfeil in der Ampel: Die Pfeilrichtung ist freigegeben, du musst nicht anhalten. Fußgänger und Radfahrer musst du trotzdem beachten, wenn ihre Furt nicht gleichzeitig gesperrt ist.',
          'Grünpfeil nur für Radfahrer (Schild mit Fahrradsymbol): gilt ausschließlich für Radfahrende, nicht für Autos.',
        ],
      },
      {
        heading: 'Was kostet ein Verstoß?',
        paragraphs: [
          'Wer am Grünpfeil nicht anhält, begeht nach dem Bußgeldkatalog eine Ordnungswidrigkeit, die mit 70 Euro und einem Punkt in Flensburg geahndet wird. Wird dabei jemand behindert oder gefährdet, wird es teurer.',
          'In der Probezeit ist das Nichtanhalten außerdem ein schwerwiegender Verstoß (A-Verstoß) mit Aufbauseminar und Verlängerung der Probezeit auf vier Jahre.',
        ],
      },
      {
        heading: 'Die häufigsten Prüfungsfallen',
        bullets: [
          'Anhalten an der falschen Stelle: Gehalten wird an der Haltlinie, nicht erst vor dem Fußgängerüberweg.',
          'Aus dem mittleren Fahrstreifen abbiegen: Nur der rechte Fahrstreifen ist erlaubt.',
          'Radfahrer auf dem Radweg übersehen: Sie kommen oft von hinten rechts und haben Grün.',
          'Glauben, der Grünpfeil sei eine Pflicht: Du darfst abbiegen, musst aber nicht. Hinter dir hupende Autos ändern daran nichts.',
        ],
      },
    ],
    appTip:
      'Die App zeigt Ampelkreuzungen aus der Fahrerperspektive: Du siehst Lichtzeichen, Fußgänger und Radfahrer gleichzeitig und entscheidest, wer zuerst fährt. Danach erklärt sie die passende Regel aus § 37 StVO.',
    howToHeading: 'Ampelsituationen in der App üben',
    howToSteps: [
      { title: 'Lichtzeichen lesen', text: 'Erkenne, ob die Ampel, ein Pfeil oder ein Schild die Situation regelt.' },
      { title: 'Alle Beteiligten finden', text: 'Fußgänger und Radfahrer an der Furt mitzählen.' },
      { title: 'Reihenfolge prüfen', text: 'Die Animation zeigt, ob deine Entscheidung stimmt, mit Begründung.' },
    ],
    faqs: [
      { question: 'Muss ich beim grünen Pfeil wirklich anhalten?', answer: 'Ja. § 37 StVO erlaubt das Rechtsabbiegen bei Rot nur nach dem Anhalten. Ohne Stopp ist es ein Verstoß, auch wenn niemand in der Nähe ist.' },
      { question: 'Darf ich beim grünen Pfeil auch aus dem zweiten Fahrstreifen abbiegen?', answer: 'Nein. Abbiegen nach dem Grünpfeil ist nur aus dem rechten Fahrstreifen erlaubt.' },
      { question: 'Gilt der Grünpfeil für Radfahrer?', answer: 'Das allgemeine Grünpfeil-Schild gilt auch für Radfahrende auf der Fahrbahn. Zusätzlich gibt es ein eigenes Grünpfeil-Schild nur für Radfahrer.' },
      { question: 'Was kostet es, am grünen Pfeil nicht anzuhalten?', answer: 'Laut Bußgeldkatalog 70 Euro und einen Punkt; mit Behinderung oder Gefährdung mehr. In der Probezeit zählt es als A-Verstoß.' },
      { question: 'Wie kann ich Ampel- und Abbiegesituationen üben?', answer: `In ${APP} für iPhone übst du Ampel- und Abbiegesituationen an 3D-Kreuzungen mit StVO-Erklärung: ${APP_URL}` },
    ],
    sources: [stvo37, stvo9, bkat],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'rettungsgasse-richtig-bilden',
    keyword: 'rettungsgasse bilden',
    title: 'Rettungsgasse richtig bilden: wann, wo und wie',
    metaTitle: 'Rettungsgasse bilden – Regel, Beispiele, Bußgeld 2026',
    metaDescription:
      'Ganz links fährt nach links, alle anderen nach rechts – und zwar schon bei Schrittgeschwindigkeit, nicht erst bei Sirene. Die Rettungsgasse nach § 11 StVO mit Beispielen für 2, 3 und 4 Fahrstreifen.',
    excerpt: 'Die Rechte-Hand-Regel, der richtige Zeitpunkt und was eine fehlende Rettungsgasse kostet.',
    keyTakeaways: [
      'Die Rettungsgasse liegt immer zwischen dem äußerst linken und dem Fahrstreifen rechts daneben.',
      'Faustregel: Wer ganz links fährt, weicht nach links aus – alle anderen nach rechts.',
      'Sie muss schon gebildet werden, sobald der Verkehr nur noch Schrittgeschwindigkeit fährt oder steht – nicht erst, wenn Blaulicht kommt.',
      'Pflicht auf Autobahnen und auf Außerortsstraßen mit mindestens zwei Fahrstreifen pro Richtung; keine Rettungsgasse kostet mindestens 200 Euro, 2 Punkte und 1 Monat Fahrverbot.',
    ],
    intro: [
      'Die Rettungsgasse bildest du zwischen dem äußerst linken Fahrstreifen und dem Fahrstreifen direkt rechts daneben. Wer ganz links fährt, weicht nach links aus, alle anderen Fahrzeuge nach rechts. So steht es in § 11 Abs. 2 StVO – und das gilt unabhängig davon, ob die Straße zwei, drei oder vier Fahrstreifen hat.',
      'Entscheidend ist der Zeitpunkt: Die Pflicht beginnt, sobald der Verkehr auf Schrittgeschwindigkeit abbremst oder steht. Wer erst reagiert, wenn das Martinshorn zu hören ist, ist zu spät – dann ist zwischen den stehenden Autos kein Platz mehr zum Rangieren.',
    ],
    sections: [
      {
        heading: 'Wo genau liegt die Rettungsgasse?',
        bullets: [
          'Zwei Fahrstreifen: Links fährt nach links, rechts nach rechts. Die Gasse liegt in der Mitte.',
          'Drei Fahrstreifen: Links nach links, Mitte und rechts nach rechts. Die Gasse liegt zwischen linkem und mittlerem Streifen.',
          'Vier Fahrstreifen: Links nach links, die drei anderen nach rechts. Die Gasse liegt zwischen dem ersten und zweiten Streifen von links.',
          'Merkhilfe „Rechte Hand“: Der Daumen ist der linke Fahrstreifen, die Finger sind die übrigen. Die Lücke zwischen Daumen und Zeigefinger ist die Rettungsgasse.',
        ],
      },
      {
        heading: 'Wann muss die Rettungsgasse gebildet werden?',
        paragraphs: [
          'Nach § 11 Abs. 2 StVO, sobald Fahrzeuge auf Autobahnen oder auf Außerortsstraßen mit mindestens zwei Fahrstreifen für eine Richtung mit Schrittgeschwindigkeit fahren oder sich im Stillstand befinden. Es ist also keine Reaktion auf ein Einsatzfahrzeug, sondern eine vorausschauende Pflicht in jedem Stau.',
          'Die Gasse bleibt bestehen, bis der Verkehr wieder fließt. Nach dem ersten Einsatzfahrzeug kommen oft weitere – Notarzt, Feuerwehr, Abschleppdienst.',
        ],
      },
      {
        heading: 'So bildest du die Gasse sicher',
        numbered: [
          'Im Stau ausreichend Abstand zum Vordermann lassen, damit du noch seitlich ausweichen kannst.',
          'Je nach Fahrstreifen deutlich nach links oder rechts versetzen, notfalls bis an den Rand oder auf den Seitenstreifen.',
          'Lenkrad leicht schräg stellen, damit du schnell weiter ausweichen kannst.',
          'Nicht in die Gasse hinein aussteigen und keine Türen öffnen.',
          'Niemals hinter einem Einsatzfahrzeug durch die Gasse fahren – das ist verboten und gefährlich.',
        ],
      },
      {
        heading: 'Bußgeld bei fehlender Rettungsgasse',
        paragraphs: [
          'Wer keine Rettungsgasse bildet, zahlt laut Bußgeldkatalog 200 Euro, bekommt 2 Punkte und 1 Monat Fahrverbot. Mit Behinderung von Rettungskräften steigt das Bußgeld auf 240 Euro, mit Gefährdung oder Sachbeschädigung noch weiter. Wer die Rettungsgasse selbst unerlaubt befährt, muss mit 240 Euro, 2 Punkten und 1 Monat Fahrverbot rechnen.',
        ],
      },
    ],
    appTip:
      'Blaulicht-Situationen gehören zu den 52 Prüfungssituationen der App: Du siehst das Einsatzfahrzeug aus der Fahrerperspektive und entscheidest, wie alle anderen reagieren müssen – mit Erklärung nach § 38 StVO.',
    howToHeading: 'Einsatzfahrzeug-Situationen üben',
    howToSteps: [
      { title: 'Blaulicht erkennen', text: 'Lerne, wann ein Einsatzfahrzeug allen Regelungen vorgeht.' },
      { title: 'Reaktion festlegen', text: 'Entscheide, wer anhalten oder Platz machen muss.' },
      { title: 'Erklärung lesen', text: 'Die App begründet jede Lösung mit der passenden StVO-Regel.' },
    ],
    faqs: [
      { question: 'Gilt die Rettungsgasse auch auf der Landstraße?', answer: 'Ja, auf Außerortsstraßen mit mindestens zwei Fahrstreifen für eine Richtung. Auf einspurigen Landstraßen fährst du so weit wie möglich nach rechts.' },
      { question: 'Muss ich die Rettungsgasse auch ohne Blaulicht bilden?', answer: 'Ja. Die Pflicht beginnt, sobald der Verkehr nur noch Schrittgeschwindigkeit fährt oder steht – unabhängig davon, ob schon ein Einsatzfahrzeug zu sehen ist.' },
      { question: 'Darf ich für die Rettungsgasse auf den Standstreifen fahren?', answer: 'Ja, wenn es nötig ist, um Platz zu machen. Auf dem Standstreifen weiterfahren darfst du dagegen nicht.' },
      { question: 'Was kostet es, keine Rettungsgasse zu bilden?', answer: 'Mindestens 200 Euro, 2 Punkte und 1 Monat Fahrverbot; mit Behinderung 240 Euro, mit Gefährdung oder Sachbeschädigung mehr.' },
      { question: 'Gibt es eine App, um Blaulicht-Situationen zu üben?', answer: `Ja. ${APP} für iPhone enthält Blaulicht-Situationen in 3D mit Erklärung: ${APP_URL}` },
    ],
    sources: [stvo11, stvo38, bkat],
    screenshotIndex: 5,
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'blaulicht-martinshorn-vorfahrt',
    keyword: 'blaulicht martinshorn vorfahrt',
    title: 'Blaulicht und Martinshorn: Wer hat jetzt Vorfahrt?',
    metaTitle: 'Blaulicht & Martinshorn – Vorfahrt, Rote Ampel, Bußgeld',
    metaDescription:
      'Blaulicht mit Martinshorn heißt: sofort freie Bahn schaffen – auch an der grünen Ampel. Was Blaulicht ohne Horn bedeutet und wie du dich an der Kreuzung richtig verhältst.',
    excerpt: 'Sofort freie Bahn schaffen: was § 38 StVO verlangt und was an der roten Ampel gilt.',
    keyTakeaways: [
      'Blaues Blinklicht zusammen mit Einsatzhorn (Martinshorn) bedeutet: Alle anderen müssen sofort freie Bahn schaffen (§ 38 StVO).',
      'Das gilt vor allen anderen Regelungen – auch vor grüner Ampel und Vorfahrtstraße.',
      'Blaulicht ohne Martinshorn ist nur eine Warnung (etwa an einer Unfallstelle) und gibt dem Fahrzeug keine Vorfahrt.',
      'Keine freie Bahn schaffen kostet laut Bußgeldkatalog 240 Euro, 2 Punkte und 1 Monat Fahrverbot.',
    ],
    intro: [
      'Kommt ein Fahrzeug mit Blaulicht und Martinshorn, musst du ihm sofort freie Bahn schaffen. Das ordnet § 38 StVO an, und es geht allen anderen Vorfahrtregeln vor – der grünen Ampel, der Vorfahrtstraße und rechts vor links. In der Prüfungslogik steht das Einsatzfahrzeug damit ganz oben in der Reihenfolge, direkt hinter den Weisungen eines Polizeibeamten.',
      'Wichtig ist die Kombination: Nur Blaulicht und Einsatzhorn gemeinsam begründen dieses Sonderrecht. Blaulicht allein warnt vor einer Gefahrenstelle – es gibt dem Fahrzeug keine Vorfahrt.',
    ],
    sections: [
      {
        heading: 'Was „freie Bahn schaffen“ konkret heißt',
        numbered: [
          'Ruhe bewahren und herausfinden, aus welcher Richtung das Fahrzeug kommt – Spiegel, Seitenfenster, Geräusch.',
          'Nach rechts an den Rand fahren und, wenn nötig, anhalten. Im Stau eine Rettungsgasse bilden.',
          'An der Kreuzung nicht plötzlich in die Kreuzung hineinfahren, wenn das Einsatzfahrzeug von hinten kommt und du an der roten Ampel stehst. Wenn möglich, seitlich ausweichen.',
          'Blinker setzen, damit der Einsatzfahrer deine Absicht erkennt.',
          'Erst weiterfahren, wenn das Fahrzeug vorbei ist – und auf weitere Einsatzfahrzeuge achten.',
        ],
      },
      {
        heading: 'Darf ich bei Rot über die Haltlinie fahren, um Platz zu machen?',
        paragraphs: [
          'Ein ausdrückliches Recht dazu gibt es nicht. Wenn es keine andere Möglichkeit gibt und du dich vorsichtig vortastest, ohne den Querverkehr zu gefährden, wird ein solcher Rotlichtverstoß in der Praxis in der Regel nicht geahndet – es liegt eine Notstandssituation vor. Oft ist es aber besser, sich seitlich zu bewegen oder einfach stehen zu bleiben, damit das Einsatzfahrzeug an dir vorbeiziehen kann.',
        ],
      },
      {
        heading: 'Blaulicht, Gelblicht, Martinshorn – die Unterschiede',
        bullets: [
          'Blaulicht + Martinshorn: Sofort freie Bahn schaffen. Das Einsatzfahrzeug hat Vorrang vor allen.',
          'Blaulicht allein: Warnung an Unfall- oder Einsatzstellen oder beim Begleiten von Fahrzeugen. Langsam und vorsichtig vorbeifahren, aber keine Vorfahrt.',
          'Gelbes Blinklicht: Warnt vor Gefahren, etwa bei Pannenhelfern, Müllabfuhr oder Schwertransporten. Ebenfalls keine Vorfahrt.',
          'Einsatzfahrzeug mit Blaulicht und Martinshorn darf selbst bei Rot fahren, muss dabei aber die öffentliche Sicherheit gebührend berücksichtigen.',
        ],
      },
      {
        heading: 'Typische Prüfungsfrage',
        paragraphs: [
          'Ein Auto steht an der Kreuzung, die Ampel zeigt Grün, von links kommt ein Rettungswagen mit Blaulicht und Martinshorn. Wer fährt zuerst? Der Rettungswagen. Die grüne Ampel gibt dir kein Recht, ihn zu behindern. Erst wenn er die Kreuzung verlassen hat, folgt die Reihenfolge nach Ampel und Beschilderung.',
        ],
      },
    ],
    appTip:
      'In der App kommen Rettungswagen und Polizei mit Blaulicht direkt an die 3D-Kreuzung. Du legst fest, wer wartet und wer fährt, und siehst dann, wie die Fahrzeuge in der richtigen Reihenfolge losfahren.',
    howToHeading: 'Blaulicht-Kreuzungen in 3D üben',
    howToSteps: [
      { title: 'Einsatzfahrzeug orten', text: 'Erkenne, aus welcher Richtung Blaulicht kommt.' },
      { title: 'Regelungen sortieren', text: 'Ampel, Schild und rechts vor links treten hinter das Einsatzfahrzeug zurück.' },
      { title: 'Ergebnis ansehen', text: 'Die Animation zeigt die korrekte Reihenfolge mit StVO-Erklärung.' },
    ],
    faqs: [
      { question: 'Hat ein Krankenwagen mit Blaulicht ohne Martinshorn Vorfahrt?', answer: 'Nein. Nur die Kombination aus Blaulicht und Einsatzhorn verpflichtet alle anderen, sofort freie Bahn zu schaffen. Blaulicht allein ist eine Warnung.' },
      { question: 'Geht ein Einsatzfahrzeug auch vor der grünen Ampel?', answer: 'Ja. Blaulicht mit Martinshorn geht jeder anderen Regelung vor, außer den Weisungen eines Polizeibeamten.' },
      { question: 'Was kostet es, keine freie Bahn zu schaffen?', answer: 'Laut Bußgeldkatalog 240 Euro, 2 Punkte und 1 Monat Fahrverbot; mit Gefährdung oder Sachbeschädigung mehr.' },
      { question: 'Muss ich auch anhalten, wenn das Einsatzfahrzeug mir entgegenkommt?', answer: 'Wenn es nötig ist, um freie Bahn zu schaffen, ja. Fahre rechts heran und halte notfalls an.' },
      { question: 'Wo kann ich Blaulicht-Situationen üben?', answer: `In ${APP} für iPhone gibt es Blaulicht-Situationen an 3D-Kreuzungen: ${APP_URL}` },
    ],
    sources: [stvo38, stvo11, bkat],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'strassenbahn-bus-vorfahrt-haltestelle',
    keyword: 'straßenbahn vorfahrt',
    title: 'Straßenbahn und Bus: Wann haben sie Vorrang – und wann nicht?',
    metaTitle: 'Straßenbahn Vorfahrt & Bus an der Haltestelle – die Regeln',
    metaDescription:
      'Hat die Straßenbahn immer Vorfahrt? Nein. Wann sie trotzdem Vorrang hat, wie du sie überholst und was beim Bus mit Warnblinklicht an der Haltestelle gilt.',
    excerpt: 'Der Mythos „Straßenbahn hat immer Vorfahrt“ und die tatsächlichen Regeln für Bahn und Bus.',
    keyTakeaways: [
      'An normalen Kreuzungen gelten für die Straßenbahn dieselben Vorfahrtregeln wie für Autos – eine generelle Vorfahrt hat sie nicht.',
      'Wer abbiegt, muss eine Straßenbahn durchlassen, die in gleicher Richtung oder entgegenkommend fährt (§ 9 StVO).',
      'Straßenbahnen werden rechts überholt; links nur, wenn die Schienen zu weit rechts liegen oder in Einbahnstraßen.',
      'An einem haltenden Bus mit Warnblinklicht darfst du nur mit Schrittgeschwindigkeit vorbei – auch im Gegenverkehr. Einen Bus, der sich mit Warnblinklicht der Haltestelle nähert, darfst du nicht überholen.',
    ],
    intro: [
      'Die Straßenbahn hat in Deutschland keine generelle Vorfahrt. An einer Kreuzung gelten für sie dieselben Regeln wie für jedes andere Fahrzeug: Ampel, Verkehrszeichen und rechts vor links. Trotzdem musst du sie in vielen Situationen durchlassen – etwa wenn du abbiegst und die Bahn neben dir geradeaus fährt, oder an Bahnübergängen mit Andreaskreuz.',
      'Für Linienbusse und Straßenbahnen an Haltestellen gibt es zusätzlich eigene Schutzregeln in § 20 StVO. Sie sind in der Theorieprüfung ein Dauerbrenner, weil sie sich vom normalen Vorfahrtsdenken unterscheiden.',
    ],
    sections: [
      {
        heading: 'Wann die Straßenbahn Vorrang hat',
        bullets: [
          'Beim Abbiegen: Wer nach rechts oder links abbiegt, muss Schienenfahrzeuge durchfahren lassen, die in gleicher Richtung neben oder auf der Fahrbahn fahren – genauso wie Radfahrer (§ 9 Abs. 3 StVO).',
          'Beim Linksabbiegen gegenüber entgegenkommenden Bahnen, wie gegenüber jedem Gegenverkehr.',
          'Im Gleisbereich: Wer auf den Schienen fährt, muss die Bahn so bald wie möglich durchfahren lassen (§ 2 Abs. 3 StVO).',
          'An Bahnübergängen mit Andreaskreuz hat das Schienenfahrzeug immer Vorrang (§ 19 StVO).',
          'Wenn ein Verkehrszeichen oder die Ampel es so regelt. Lichtzeichen mit weißen Balken gelten dabei nur für die Bahn, nicht für dich.',
        ],
      },
      {
        heading: 'Wann die Straßenbahn warten muss',
        paragraphs: [
          'Kommt die Straßenbahn aus einer Nebenstraße mit „Vorfahrt gewähren“-Schild, muss sie den Verkehr auf der Vorfahrtstraße durchlassen. An einer Kreuzung ohne Regelung gilt für sie rechts vor links. Wer also mit dem Auto von rechts kommt, hat Vorfahrt vor der Bahn von links – allerdings wird ein Straßenbahnfahrer nicht in einer Sekunde stehen. Fahre daher defensiv.',
        ],
      },
      {
        heading: 'Straßenbahn überholen',
        bullets: [
          'Grundsätzlich rechts überholen (§ 5 Abs. 7 StVO).',
          'Links nur, wenn das rechts nicht möglich ist, weil die Schienen zu weit rechts liegen.',
          'Auf Fahrbahnen für eine Richtung (Einbahnstraßen) darf auch links überholt werden.',
        ],
      },
      {
        heading: 'Bus und Bahn an der Haltestelle (§ 20 StVO)',
        numbered: [
          'An haltenden Linienbussen, Straßenbahnen und gekennzeichneten Schulbussen nur vorsichtig vorbeifahren – auch im Gegenverkehr.',
          'Steigen Fahrgäste ein oder aus, rechts nur mit Schrittgeschwindigkeit und mit großem Abstand vorbeifahren; notfalls warten.',
          'Ein Bus, der sich mit eingeschaltetem Warnblinklicht einer Haltestelle nähert, darf nicht überholt werden.',
          'An einem haltenden Bus mit Warnblinklicht darfst du nur mit Schrittgeschwindigkeit vorbei – das gilt auch für den Gegenverkehr auf derselben Fahrbahn.',
          'Einem Linienbus, der von einer gekennzeichneten Haltestelle abfahren will, musst du das Abfahren ermöglichen und, wenn nötig, warten.',
        ],
      },
    ],
    appTip:
      'Kreuzungen mit mehreren Verkehrsteilnehmern sind der Kern der App: Du ordnest jedes Fahrzeug einer Straße und Richtung zu, legst die Reihenfolge fest und bekommst die Begründung nach StVO.',
    howToHeading: 'Abbiege- und Vorrangfälle trainieren',
    howToSteps: [
      { title: 'Fahrwege bestimmen', text: 'Prüfe, ob sich dein Weg mit Bahn, Rad oder Gegenverkehr kreuzt.' },
      { title: 'Regel zuordnen', text: 'Vorfahrt nach § 8 oder Vorrang beim Abbiegen nach § 9?' },
      { title: 'Lösung vergleichen', text: 'Die Animation zeigt die richtige Reihenfolge.' },
    ],
    faqs: [
      { question: 'Hat die Straßenbahn immer Vorfahrt?', answer: 'Nein. An Kreuzungen gelten für sie die normalen Vorfahrtregeln. Vorrang hat sie beim Abbiegen anderer Fahrzeuge, im Gleisbereich und an Bahnübergängen mit Andreaskreuz.' },
      { question: 'Darf ich eine Straßenbahn links überholen?', answer: 'Nur wenn rechts überholen nicht möglich ist, weil die Schienen zu weit rechts liegen, oder in Einbahnstraßen.' },
      { question: 'Wie schnell darf ich an einem Bus mit Warnblinklicht vorbeifahren?', answer: 'Nur mit Schrittgeschwindigkeit, also etwa 4 bis 7 km/h – auch wenn du im Gegenverkehr auf derselben Fahrbahn bist.' },
      { question: 'Darf ich einen Bus überholen, der mit Warnblinklicht auf die Haltestelle zufährt?', answer: 'Nein. Das ist nach § 20 Abs. 3 StVO verboten.' },
      { question: 'Mit welcher App kann ich Vorfahrt an Kreuzungen üben?', answer: `Mit ${APP} für iPhone – 52 Kreuzungssituationen in 3D mit StVO-Erklärung: ${APP_URL}` },
    ],
    sources: [stvo2, stvo5, stvo9, stvo20, law('19', '§ 19 StVO – Bahnübergänge')],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'zebrastreifen-fussgaengerueberweg-regeln',
    keyword: 'zebrastreifen regeln',
    title: 'Zebrastreifen: Wann musst du anhalten – und was ist verboten?',
    metaTitle: 'Zebrastreifen-Regeln – Anhalten, Überholverbot, Bußgeld',
    metaDescription:
      'Am Zebrastreifen müssen Autofahrer Fußgängern das Überqueren ermöglichen, wenn diese erkennbar hinüberwollen. Überholverbot, Halteverbot, Radfahrer und Bußgeld nach § 26 StVO.',
    excerpt: 'Wann Fußgänger Vorrang haben, was für Radfahrer gilt und welche Verbote am Überweg gelten.',
    keyTakeaways: [
      'Am Zebrastreifen musst du Fußgängern und Rollstuhlfahrern das Überqueren ermöglichen, wenn sie erkennbar hinüberwollen (§ 26 StVO).',
      'Du darfst dich nur mit mäßiger Geschwindigkeit nähern und musst notfalls warten.',
      'Am Zebrastreifen gilt Überholverbot, und bis 5 Meter davor darfst du nicht halten.',
      'Radfahrer, die über den Zebrastreifen fahren, haben keinen Vorrang – nur wer schiebt, gilt als Fußgänger.',
    ],
    intro: [
      'Am Zebrastreifen (Fußgängerüberweg, Zeichen 293) haben Fußgänger Vorrang, sobald sie erkennbar über die Straße wollen. Autofahrer müssen dann anhalten und sie hinüberlassen. Dazu müssen sie sich dem Überweg mit mäßiger Geschwindigkeit nähern, damit sie überhaupt rechtzeitig reagieren können.',
      'Dieser Vorrang gilt unabhängig von der Vorfahrt an der Kreuzung. Wer auf der Vorfahrtstraße abbiegt und direkt dahinter einen Zebrastreifen kreuzt, muss trotzdem für Fußgänger anhalten.',
    ],
    sections: [
      {
        heading: 'Die Pflichten am Zebrastreifen',
        numbered: [
          'Mit mäßiger Geschwindigkeit heranfahren, sodass du jederzeit anhalten kannst.',
          'Fußgängern und Rollstuhlfahrern, die erkennbar überqueren wollen, das Überqueren ermöglichen.',
          'Wenn nötig anhalten und warten, bis sie die Straße verlassen haben oder deine Fahrbahnseite sicher frei ist.',
          'Bei stockendem Verkehr nicht auf den Zebrastreifen fahren, wenn du dort warten müsstest (§ 26 Abs. 2 StVO).',
          'Am Zebrastreifen nicht überholen (§ 26 Abs. 3 StVO).',
        ],
      },
      {
        heading: 'Woran erkenne ich, dass jemand „erkennbar“ queren will?',
        bullets: [
          'Die Person steht am Bordstein und schaut zur Fahrbahn.',
          'Sie geht zügig auf den Zebrastreifen zu.',
          'Sie hat bereits einen Fuß auf der Fahrbahn oder dem Überweg.',
          'Kinder, ältere Menschen und Menschen mit Gehhilfe brauchen besonders viel Rücksicht (§ 3 Abs. 2a StVO).',
        ],
      },
      {
        heading: 'Was gilt für Radfahrer am Zebrastreifen?',
        paragraphs: [
          'Der Fußgängerüberweg schützt nur Fußgänger und Rollstuhlfahrer. Wer mit dem Fahrrad über den Zebrastreifen fährt, hat keinen Vorrang gegenüber dem Autoverkehr. Wer absteigt und das Rad schiebt, gilt als Fußgänger und hat Vorrang.',
        ],
      },
      {
        heading: 'Bußgeld und Halteverbot',
        bullets: [
          'Fußgängern das Überqueren nicht ermöglicht: laut Bußgeldkatalog 80 Euro und 1 Punkt; mit Gefährdung mehr.',
          'Überholen am Zebrastreifen: Bußgeld und Punkt.',
          'Halten auf dem Zebrastreifen und bis 5 Meter davor ist verboten (§ 12 StVO).',
          'Regelt eine Ampel den Überweg, gilt allein die Ampel.',
        ],
      },
    ],
    appTip:
      'Zebrastreifen gehören zu den 52 Situationen der App: Fußgänger stehen am Überweg, während du an der Kreuzung abbiegst. Du entscheidest, wer zuerst geht und fährt – und siehst danach die Begründung.',
    howToHeading: 'Fußgänger-Situationen in 3D üben',
    howToSteps: [
      { title: 'Überweg finden', text: 'Erkenne den Zebrastreifen in der Fahrerperspektive.' },
      { title: 'Fußgänger einordnen', text: 'Wer will queren, wer wartet nur?' },
      { title: 'Reihenfolge prüfen', text: 'Die Animation zeigt, ob du richtig entschieden hast.' },
    ],
    faqs: [
      { question: 'Muss ich am Zebrastreifen immer anhalten?', answer: 'Nur wenn jemand erkennbar überqueren will. Heranfahren musst du aber immer mit mäßiger Geschwindigkeit.' },
      { question: 'Haben Radfahrer am Zebrastreifen Vorrang?', answer: 'Nein, nur wenn sie absteigen und das Rad schieben. Dann gelten sie als Fußgänger.' },
      { question: 'Darf ich am Zebrastreifen überholen?', answer: 'Nein. An Fußgängerüberwegen gilt nach § 26 Abs. 3 StVO ein Überholverbot.' },
      { question: 'Was kostet es, einen Fußgänger am Zebrastreifen nicht durchzulassen?', answer: 'Laut Bußgeldkatalog 80 Euro und 1 Punkt; bei Gefährdung mehr.' },
      { question: 'Gibt es eine App, um Zebrastreifen-Situationen zu üben?', answer: `Ja: ${APP} für iPhone enthält Zebrastreifen- und Abbiegesituationen in 3D: ${APP_URL}` },
    ],
    sources: [stvo26, law('12', '§ 12 StVO – Halten und Parken'), law('3', '§ 3 StVO – Geschwindigkeit'), bkat],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'polizist-handzeichen-verkehr-regeln',
    keyword: 'polizist regelt verkehr handzeichen',
    title: 'Polizist regelt den Verkehr: Die Handzeichen einfach erklärt',
    metaTitle: 'Polizist Handzeichen – Was bedeuten sie? (§ 36 StVO)',
    metaDescription:
      'Arme seitlich ausgestreckt, Arm hochgehoben: Was die Handzeichen eines Polizeibeamten bedeuten und warum sie jeder Ampel und jedem Schild vorgehen.',
    excerpt: 'Brust und Rücken heißt Halt, Arm hoch heißt warten: die Zeichen aus § 36 StVO.',
    keyTakeaways: [
      'Zeichen und Weisungen von Polizeibeamten gehen allen anderen Regelungen vor – auch Ampeln und Verkehrszeichen (§ 36 StVO).',
      'Arme seitlich ausgestreckt: Wer auf Brust oder Rücken des Beamten zufährt, muss halten. Der Verkehr parallel zu den Armen hat frei.',
      'Ein Arm hochgehoben: Alle warten vor der Kreuzung auf das nächste Zeichen; wer schon in der Kreuzung ist, räumt sie.',
      'Merksatz: Brust und Rücken – rot. Seite – grün. Arm hoch – gelb.',
    ],
    intro: [
      'Regelt ein Polizist den Verkehr, gilt nur noch, was er anzeigt. Ampeln, Vorfahrtschilder und rechts vor links treten zurück. Das ergibt sich aus der Rangfolge in § 36 Abs. 1 StVO: Zeichen und Weisungen der Polizeibeamten sind zu befolgen und gehen allen anderen Anordnungen und Regeln vor.',
      'Die Zeichen selbst sind schnell gelernt, wenn man sie wie eine Ampel denkt. Schwierig wird es erst, wenn man aus einer ungewohnten Richtung auf den Beamten zufährt. Genau das wird in der Theorieprüfung abgefragt.',
    ],
    sections: [
      {
        heading: 'Die Handzeichen im Überblick',
        bullets: [
          'Arme seitlich ausgestreckt (oder Grundstellung danach): „Halt vor der Kreuzung“ für den Verkehr, der auf Brust oder Rücken des Beamten zufährt. Der Querverkehr – parallel zu den Armen – ist freigegeben.',
          'Ein Arm senkrecht hochgehoben: „Vor der Kreuzung auf das nächste Zeichen warten“ für alle Richtungen; Fahrzeuge, die schon in der Kreuzung sind, müssen sie räumen. Das entspricht dem Gelblicht.',
          'Das Zeichen gilt fort, solange der Beamte in derselben Haltung bleibt oder in derselben Richtung winkt.',
          'Der freigegebene Verkehr darf nach den Regeln des § 9 StVO abbiegen, nach links aber nur, wenn er Schienenfahrzeuge dadurch nicht behindert.',
        ],
      },
      {
        heading: 'Merkhilfe: Wie eine Ampel',
        paragraphs: [
          'Siehst du Brust oder Rücken des Beamten, hast du „Rot“ – du hältst. Siehst du seine Seite, hast du „Grün“ – du darfst fahren. Hebt er einen Arm, ist das „Gelb“: Du wartest vor der Kreuzung, und wer schon drin ist, fährt zügig hinaus.',
        ],
      },
      {
        heading: 'Polizei zeigt Grün, Ampel zeigt Rot – was gilt?',
        paragraphs: [
          'Es gilt das Zeichen des Polizisten. Die Rangfolge lautet: 1. Polizeibeamte, 2. Lichtzeichen (Ampel), 3. Verkehrszeichen, 4. allgemeine Vorfahrtregeln wie rechts vor links. Auch ein Einsatzfahrzeug mit Blaulicht und Martinshorn hat Vorrang, doch eine konkrete Weisung des Polizisten an dich ist zu befolgen.',
        ],
      },
      {
        heading: 'Anhaltezeichen bei Verkehrskontrollen',
        bullets: [
          'Winken mit der Kelle oder Lichtzeichen „Stop – Polizei“ aus dem Streifenwagen bedeuten: anhalten.',
          'Polizeibeamte dürfen Verkehrsteilnehmer zur Verkehrskontrolle anhalten (§ 36 Abs. 5 StVO).',
          'Ruhig rechts heranfahren, Motor aus, Hände sichtbar lassen und Anweisungen abwarten.',
        ],
      },
    ],
    appTip:
      'Die App trainiert genau diese Rangfolge: An jeder 3D-Kreuzung prüfst du zuerst, was die Situation regelt – Ampel, Schild oder rechts vor links – und legst dann die Reihenfolge fest.',
    howToHeading: 'Die Rangfolge der Regelungen üben',
    howToSteps: [
      { title: 'Regelung bestimmen', text: 'Polizei, Ampel, Schild oder Grundregel – was gilt zuerst?' },
      { title: 'Reihenfolge festlegen', text: 'Ordne alle Fahrzeuge in die richtige Abfolge.' },
      { title: 'Begründung lesen', text: 'Die App nennt die StVO-Regel hinter jeder Lösung.' },
    ],
    faqs: [
      { question: 'Was bedeutet es, wenn ein Polizist beide Arme seitlich ausstreckt?', answer: 'Wer auf Brust oder Rücken des Beamten zufährt, muss vor der Kreuzung halten. Der Verkehr parallel zu den Armen darf fahren.' },
      { question: 'Was bedeutet ein hochgehobener Arm?', answer: 'Alle Verkehrsteilnehmer warten vor der Kreuzung auf das nächste Zeichen. Wer schon in der Kreuzung ist, muss sie räumen.' },
      { question: 'Geht der Polizist der Ampel vor?', answer: 'Ja. Zeichen und Weisungen von Polizeibeamten gehen allen anderen Anordnungen, auch Lichtzeichen, vor.' },
      { question: 'Darf ich abbiegen, wenn der Polizist meine Richtung freigibt?', answer: 'Ja, nach den Regeln des § 9 StVO. Nach links nur, wenn du keine Schienenfahrzeuge behinderst.' },
      { question: 'Wie übe ich die Rangfolge der Vorfahrtregeln?', answer: `Mit ${APP} für iPhone übst du an 3D-Kreuzungen, welche Regelung zuerst gilt: ${APP_URL}` },
    ],
    sources: [stvo36, stvo37, stvo9],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'gelbe-ampel-rotlichtverstoss',
    keyword: 'gelbe ampel bremsen oder fahren',
    title: 'Gelbe Ampel: bremsen oder fahren? Und was kostet Rot?',
    metaTitle: 'Gelbe Ampel & Rotlichtverstoß – Regeln und Bußgeld 2026',
    metaDescription:
      'Bei Gelb musst du vor der Kreuzung warten, wenn du gefahrlos anhalten kannst. Was Rot-Gelb bedeutet, wie lange die Gelbphase dauert und was ein Rotlichtverstoß kostet.',
    excerpt: 'Die Gelbphase, die Ein-Sekunden-Grenze bei Rot und warum Rot-Gelb noch kein Grün ist.',
    keyTakeaways: [
      'Gelb bedeutet: vor der Kreuzung auf das nächste Zeichen warten (§ 37 StVO). Wer nicht mehr gefahrlos anhalten kann, darf durchfahren.',
      'Rot-Gelb bedeutet: gleich kommt Grün. Losfahren ist erst bei Grün erlaubt.',
      'Innerorts dauert die Gelbphase bei Tempo 50 in der Regel 3 Sekunden.',
      'Rotlichtverstoß: unter 1 Sekunde Rot 90 Euro und 1 Punkt; über 1 Sekunde 200 Euro, 2 Punkte und 1 Monat Fahrverbot.',
    ],
    intro: [
      'Zeigt die Ampel Gelb, musst du vor der Kreuzung anhalten, wenn das noch gefahrlos möglich ist. Gelb heißt nach § 37 StVO: „Vor der Kreuzung auf das nächste Zeichen warten.“ Es ist keine Aufforderung, noch schnell durchzufahren. Nur wer so nah an der Haltlinie ist, dass er nur mit einer Vollbremsung anhalten könnte, fährt weiter.',
      'Die Gelbphase ist so bemessen, dass ein Fahrzeug bei erlaubter Geschwindigkeit mit normaler Bremsung vor der Haltlinie zum Stehen kommt. Wer deutlich zu schnell fährt, hat dieses Polster nicht – und landet bei Rot in der Kreuzung.',
    ],
    sections: [
      {
        heading: 'Die Ampelphasen und was sie bedeuten',
        bullets: [
          'Grün: Der Verkehr ist freigegeben. Abbiegende müssen trotzdem Fußgänger, Radfahrer und Gegenverkehr beachten.',
          'Gelb: Vor der Kreuzung auf das nächste Zeichen warten.',
          'Rot: Halt vor der Kreuzung.',
          'Rot und Gelb gleichzeitig: Gleich wird Grün freigegeben. Gang einlegen ist erlaubt, losfahren nicht.',
          'Gelbes Blinklicht: Die Ampel regelt nicht. Es gelten die Verkehrszeichen und, wenn keine da sind, rechts vor links.',
        ],
      },
      {
        heading: 'Bremsen oder fahren? So entscheidest du',
        numbered: [
          'Vorausschauend fahren: Steht die Ampel schon lange auf Grün, rechne mit Gelb und nimm etwas Gas weg.',
          'Bei Gelb fragen: Kann ich mit einer normalen, kräftigen Bremsung vor der Haltlinie stehen? Dann bremsen.',
          'Nur wenn das nicht mehr möglich ist, ohne Auffahrunfall-Risiko oder Vollbremsung, zügig weiterfahren.',
          'Nie wegen Gelb beschleunigen.',
        ],
      },
      {
        heading: 'Bußgeld beim Rotlichtverstoß',
        bullets: [
          'Rot weniger als 1 Sekunde: laut Bußgeldkatalog 90 Euro und 1 Punkt.',
          'Rot länger als 1 Sekunde (qualifizierter Rotlichtverstoß): 200 Euro, 2 Punkte und 1 Monat Fahrverbot.',
          'Mit Gefährdung oder Sachbeschädigung werden die Strafen höher.',
          'In der Probezeit ist jeder Rotlichtverstoß ein A-Verstoß: Aufbauseminar und Verlängerung der Probezeit auf vier Jahre.',
        ],
      },
      {
        heading: 'Wie lange dauert Gelb?',
        paragraphs: [
          'Nach der Verwaltungsvorschrift zu § 37 StVO beträgt die Gelbzeit in der Regel 3 Sekunden bei zulässigen 50 km/h, 4 Sekunden bei 60 km/h und 5 Sekunden bei 70 km/h. Das ist genau die Zeit, die man bei erlaubter Geschwindigkeit für ein normales Anhalten braucht.',
        ],
      },
    ],
    appTip:
      'In der App stehst du an Ampelkreuzungen und triffst die Entscheidung aus der Fahrerperspektive. Im Fahrsimulator steuerst du selbst mit Gas und Bremse – inklusive Ampeln, an denen du rechtzeitig anhalten musst.',
    howToHeading: 'Ampelsituationen üben',
    howToSteps: [
      { title: 'Lichtzeichen lesen', text: 'Grün, Gelb, Rot, Pfeil oder gelbes Blinklicht – was gilt?' },
      { title: 'Im Simulator anhalten', text: 'Bremse rechtzeitig vor der Haltlinie.' },
      { title: 'Fehler nachüben', text: 'Fehler landen im Fahrtenbuch und kommen zum Wiederholen zurück.' },
    ],
    faqs: [
      { question: 'Darf ich bei Gelb noch fahren?', answer: 'Nur wenn du nicht mehr gefahrlos vor der Haltlinie anhalten kannst. Grundsätzlich bedeutet Gelb: vor der Kreuzung warten.' },
      { question: 'Darf ich bei Rot-Gelb schon losfahren?', answer: 'Nein. Rot-Gelb kündigt Grün an. Losfahren darfst du erst bei Grün.' },
      { question: 'Was kostet ein Rotlichtverstoß?', answer: 'Unter 1 Sekunde Rot 90 Euro und 1 Punkt; über 1 Sekunde 200 Euro, 2 Punkte und 1 Monat Fahrverbot. Mit Gefährdung mehr.' },
      { question: 'Ist ein Rotlichtverstoß in der Probezeit schlimmer?', answer: 'Ja. Er ist ein A-Verstoß und führt zu Aufbauseminar und Verlängerung der Probezeit auf vier Jahre.' },
      { question: 'Wo kann ich Ampel-Kreuzungen in 3D üben?', answer: `In ${APP} für iPhone, mit Ampelsituationen und Fahrsimulator: ${APP_URL}` },
    ],
    sources: [stvo37, stvg2a, bkat],
    screenshotIndex: 1,
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'ausfahrt-grundstueck-abgesenkter-bordstein-vorfahrt',
    keyword: 'abgesenkter bordstein vorfahrt',
    title: 'Ausfahrt, abgesenkter Bordstein, Feldweg: Wer hier rausfährt, wartet',
    metaTitle: 'Abgesenkter Bordstein & Grundstücksausfahrt – Vorfahrt?',
    metaDescription:
      'Wer aus einer Ausfahrt, über einen abgesenkten Bordstein, aus einem verkehrsberuhigten Bereich oder einem Feldweg kommt, hat keine Vorfahrt – auch nicht von rechts. § 10 StVO erklärt.',
    excerpt: 'Warum rechts vor links hier nicht gilt und was die besondere Sorgfaltspflicht nach § 10 StVO verlangt.',
    keyTakeaways: [
      'Wer aus einem Grundstück, einer Tiefgarage, einem Parkplatz oder über einen abgesenkten Bordstein auf die Straße fährt, hat keine Vorfahrt (§ 10 StVO).',
      'Das gilt auch, wenn er von rechts kommt – rechts vor links greift hier nicht.',
      'Dasselbe gilt beim Ausfahren aus einem verkehrsberuhigten Bereich, einer Fußgängerzone und aus Feld- oder Waldwegen.',
      'Gefordert ist die höchste Sorgfalt: Eine Gefährdung anderer muss ausgeschlossen sein, notfalls mit Einweiser.',
    ],
    intro: [
      'Wer über einen abgesenkten Bordstein, aus einer Grundstücksausfahrt oder aus einem verkehrsberuhigten Bereich auf die Fahrbahn fährt, muss alle anderen durchlassen. § 10 StVO verlangt, dass er sich so verhält, dass eine Gefährdung anderer Verkehrsteilnehmer ausgeschlossen ist. Das ist die strengste Sorgfaltspflicht, die die StVO kennt.',
      'Die typische Prüfungsfalle: Ein Fahrzeug kommt von rechts – aber eben nicht aus einer Straße, sondern aus einer Ausfahrt. Wer hier automatisch rechts vor links anwendet, liegt falsch.',
    ],
    sections: [
      {
        heading: 'Wann du keine Vorfahrt hast',
        bullets: [
          'Ausfahrt aus Grundstücken, Hofeinfahrten, Tankstellen, Parkplätzen und Tiefgaragen.',
          'Einfahren über einen abgesenkten Bordstein auf die Fahrbahn.',
          'Ausfahren aus einem verkehrsberuhigten Bereich (blaues Schild mit spielenden Kindern, Zeichen 325) oder einer Fußgängerzone.',
          'Einfahren aus Feld- oder Waldwegen in eine andere Straße (§ 8 Abs. 1 StVO).',
          'Anfahren vom Fahrbahnrand, etwa aus einer Parklücke.',
        ],
      },
      {
        heading: 'So fährst du korrekt hinaus',
        numbered: [
          'Blinker setzen – § 10 StVO verlangt, die Absicht rechtzeitig und deutlich anzukündigen.',
          'Langsam bis zum Gehweg vortasten und zuerst auf Fußgänger und Radfahrer achten.',
          'Dann in beide Richtungen auf den Fahrzeugverkehr achten.',
          'Bei schlechter Sicht – Hecke, Mauer, parkende Autos – Schritt für Schritt vortasten, notfalls mit Einweiser.',
          'Erst einfahren, wenn niemand bremsen oder ausweichen muss.',
        ],
      },
      {
        heading: 'Woran erkennst du eine „Straße“ und eine „Ausfahrt“?',
        paragraphs: [
          'Ein abgesenkter Bordstein, ein durchgehender Gehweg oder ein anderer Belag (Pflaster statt Asphalt) sprechen für eine Ausfahrt oder einen verkehrsberuhigten Bereich. Läuft der Gehweg ohne Unterbrechung über die Einmündung, ist das ein starkes Zeichen, dass dort keine gleichberechtigte Straße einmündet.',
          'Im Zweifel fährst du defensiv. In der Prüfung erkennst du die Situation am Bordstein oder am Schild „Ende verkehrsberuhigter Bereich“ (Zeichen 325.2).',
        ],
      },
      {
        heading: 'Typische Fehler',
        bullets: [
          'Rechts vor links anwenden, obwohl das Fahrzeug aus einer Ausfahrt kommt.',
          'Über den Gehweg rollen, ohne auf Fußgänger zu achten.',
          'Beim Ausparken nicht blinken.',
          'Am Ende des verkehrsberuhigten Bereichs annehmen, man habe nun Vorfahrt.',
        ],
      },
    ],
    appTip:
      'Wann rechts vor links gilt und wann nicht, ist das Kernthema der App. An den 3D-Kreuzungen erkennst du Straßen, Schilder und Fahrbahnränder aus der Fahrerperspektive und legst fest, wer zuerst fahren darf.',
    howToHeading: 'Rechts vor links und Ausnahmen üben',
    howToSteps: [
      { title: 'Kreuzung analysieren', text: 'Prüfe, ob überhaupt zwei gleichberechtigte Straßen aufeinandertreffen.' },
      { title: 'Reihenfolge festlegen', text: 'Entscheide, wer wartet und wer fährt.' },
      { title: 'Begründung lesen', text: 'Die App erklärt, welche StVO-Regel greift.' },
    ],
    faqs: [
      { question: 'Gilt rechts vor links bei einem abgesenkten Bordstein?', answer: 'Nein. Wer über einen abgesenkten Bordstein auf die Fahrbahn fährt, muss nach § 10 StVO alle anderen durchlassen.' },
      { question: 'Habe ich Vorfahrt, wenn ich aus einem verkehrsberuhigten Bereich komme?', answer: 'Nein. Beim Ausfahren aus einem verkehrsberuhigten Bereich hast du keine Vorfahrt, auch nicht gegenüber Fahrzeugen von links.' },
      { question: 'Wer hat Vorfahrt: Feldweg oder Straße?', answer: 'Die Straße. Wer aus einem Feld- oder Waldweg kommt, muss warten, auch wenn er von rechts kommt.' },
      { question: 'Muss ich beim Ausparken blinken?', answer: 'Ja. § 10 StVO verlangt, das Anfahren vom Fahrbahnrand rechtzeitig und deutlich mit dem Blinker anzukündigen.' },
      { question: 'Mit welcher App kann ich rechts vor links üben?', answer: `Mit ${APP} für iPhone übst du rechts vor links und die Ausnahmen an 3D-Kreuzungen: ${APP_URL}` },
    ],
    sources: [stvo10, stvo8],
    screenshotIndex: 0,
  },

  /* ----------------------------------------------------------------- 10 */
  {
    slug: 'fahren-bei-nebel-schnee-glaette',
    keyword: 'nebelschlussleuchte wann erlaubt',
    title: 'Nebel, Schnee und Glätte: Licht, Tempo und Abstand richtig wählen',
    metaTitle: 'Nebelschlussleuchte, Tempo 50 & Winterreifen – die Regeln',
    metaDescription:
      'Nebelschlussleuchte nur unter 50 Meter Sicht, dann höchstens 50 km/h. Abblendlicht, Winterreifenpflicht und Abstand bei Glätte – die Regeln aus § 3 und § 17 StVO.',
    excerpt: 'Die 50-Meter-Regel, Winterreifen mit Alpine-Symbol und wie du bei Glätte bremst.',
    keyTakeaways: [
      'Die Nebelschlussleuchte darf nur bei Sichtweiten unter 50 Metern wegen Nebel eingeschaltet werden (§ 17 StVO).',
      'Bei Sicht unter 50 Metern gilt höchstens 50 km/h – auch auf der Autobahn (§ 3 StVO).',
      'Bei Sichtbehinderung durch Nebel, Schnee oder Regen muss auch tagsüber Abblendlicht eingeschaltet sein.',
      'Bei Glatteis, Schneeglätte und Schneematsch sind Winterreifen mit Alpine-Symbol (Bergpiktogramm mit Schneeflocke) Pflicht.',
    ],
    intro: [
      'Bei Nebel mit weniger als 50 Metern Sicht darfst du höchstens 50 km/h fahren und die Nebelschlussleuchte einschalten. Bei besserer Sicht ist sie verboten, weil sie den Hintermann blendet. Abblendlicht ist bei Sichtbehinderung durch Nebel, Schneefall oder Regen auch tagsüber Pflicht.',
      'Als Orientierung für die 50 Meter dienen die Leitpfosten am Straßenrand: Sie stehen in der Regel im Abstand von 50 Metern. Siehst du den nächsten Pfosten nicht mehr, liegt die Sicht unter 50 Metern.',
    ],
    sections: [
      {
        heading: 'Licht bei schlechter Sicht',
        bullets: [
          'Abblendlicht: Pflicht bei erheblicher Sichtbehinderung durch Nebel, Schnee oder Regen, auch am Tag. Tagfahrlicht reicht nicht, weil es hinten oft nicht leuchtet.',
          'Nebelscheinwerfer: dürfen bei erheblicher Sichtbehinderung durch Nebel, Schnee oder Regen eingeschaltet werden.',
          'Nebelschlussleuchte: nur bei Sicht unter 50 Metern wegen Nebel. Sobald die Sicht besser wird, sofort ausschalten.',
          'Fernlicht im Nebel: kontraproduktiv – es wird vom Nebel reflektiert und blendet dich selbst.',
        ],
      },
      {
        heading: 'Geschwindigkeit und Abstand',
        numbered: [
          'Grundsatz aus § 3 StVO: Du musst innerhalb der überschaubaren Strecke anhalten können.',
          'Sicht unter 50 Meter: höchstens 50 km/h, egal welches Limit auf dem Schild steht.',
          'Abstand mindestens so groß wie die Sichtweite erlaubt; als Faustregel bei Nässe und Glätte deutlich mehr als „halber Tacho“.',
          'Auf Schnee und Eis ist der Bremsweg um ein Vielfaches länger. Früh und sanft bremsen, nicht ruckartig lenken.',
        ],
      },
      {
        heading: 'Winterreifenpflicht',
        paragraphs: [
          'In Deutschland gilt eine situative Winterreifenpflicht: Bei Glatteis, Schneeglätte, Schneematsch, Eis- oder Reifglätte darfst du nur mit Winter- oder Ganzjahresreifen fahren. Seit dem 1. Oktober 2024 zählen dafür nur noch Reifen mit dem Alpine-Symbol (Bergpiktogramm mit Schneeflocke); reine M+S-Reifen reichen nicht mehr.',
          'Wer bei winterlichen Verhältnissen mit Sommerreifen fährt, muss laut Bußgeldkatalog mit 60 Euro und 1 Punkt rechnen, mit Behinderung oder Gefährdung mit mehr.',
        ],
      },
      {
        heading: 'Wenn das Auto rutscht',
        bullets: [
          'Kupplung treten (Schaltwagen) und in die gewünschte Richtung schauen und lenken.',
          'Bei ABS: voll bremsen und gleichzeitig lenken – das ABS hält das Auto lenkbar.',
          'Brücken, Waldstücke und schattige Kurven frieren zuerst.',
        ],
      },
    ],
    appTip:
      'Die App simuliert Kreuzungen bei Schnee, Nebel und Regen. Du trainierst, Fahrzeuge und Schilder auch bei schlechter Sicht zu erkennen und im Fahrsimulator rechtzeitig zu bremsen.',
    howToHeading: 'Fahren bei schlechtem Wetter üben',
    howToSteps: [
      { title: 'Wetter wählen', text: 'Kreuzungen bei Schnee, Nebel oder Regen ansehen.' },
      { title: 'Früher reagieren', text: 'Im Simulator rechtzeitig bremsen, wenn die Sicht schlecht ist.' },
      { title: 'Fehler wiederholen', text: 'Situationen aus dem Fahrtenbuch gezielt nachüben.' },
    ],
    faqs: [
      { question: 'Wann darf ich die Nebelschlussleuchte einschalten?', answer: 'Nur wenn die Sicht wegen Nebel unter 50 Meter liegt. Dann darfst du höchstens 50 km/h fahren.' },
      { question: 'Wie erkenne ich 50 Meter Sicht?', answer: 'An den Leitpfosten am Straßenrand. Sie stehen in der Regel 50 Meter auseinander.' },
      { question: 'Reichen M+S-Reifen im Winter noch?', answer: 'Nein. Seit dem 1. Oktober 2024 erfüllen nur Reifen mit Alpine-Symbol die situative Winterreifenpflicht.' },
      { question: 'Gilt Tempo 50 bei Nebel auch auf der Autobahn?', answer: 'Ja. Bei Sicht unter 50 Metern gilt nach § 3 StVO höchstens 50 km/h auf allen Straßen.' },
      { question: 'Kann ich Fahren bei Schnee und Nebel in einer App üben?', answer: `Ja, ${APP} für iPhone enthält Kreuzungen bei Schnee, Nebel und Regen sowie einen Fahrsimulator: ${APP_URL}` },
    ],
    sources: [stvo3, stvo17, law('2', '§ 2 StVO – Winterreifenpflicht (Abs. 3a)'), bkat],
    screenshotIndex: 4,
  },

  /* ----------------------------------------------------------------- 11 */
  {
    slug: 'unfall-warndreieck-absichern',
    keyword: 'warndreieck abstand',
    title: 'Unfall oder Panne: Warndreieck aufstellen und richtig absichern',
    metaTitle: 'Warndreieck Abstand – Unfallstelle richtig absichern',
    metaDescription:
      'Warnblinker an, Warnweste an, Warndreieck aufstellen: innerorts rund 50 m, Landstraße rund 100 m, Autobahn mindestens 150 m. Die richtige Reihenfolge an Unfall- und Pannenstellen.',
    excerpt: 'Die richtige Reihenfolge an der Unfallstelle und die Abstände für das Warndreieck.',
    keyTakeaways: [
      'Reihenfolge: Warnblinklicht an, Warnweste anziehen, Unfallstelle absichern, Notruf 112, Erste Hilfe.',
      'Warndreieck-Abstand als Faustregel: innerorts etwa 50 m, auf Landstraßen etwa 100 m, auf der Autobahn mindestens 150 m, besser mehr.',
      'Vor Kurven und Kuppen das Warndreieck so aufstellen, dass es rechtzeitig gesehen wird.',
      'Erste Hilfe ist Pflicht, soweit sie zumutbar ist (§ 323c StGB).',
    ],
    intro: [
      'An einer Unfall- oder Pannenstelle schaltest du zuerst das Warnblinklicht ein, ziehst die Warnweste an und stellst das Warndreieck in ausreichender Entfernung auf. § 15 StVO nennt bei schnellem Verkehr etwa 100 Meter. Als Faustregel gelten innerorts etwa 50 Meter, auf Landstraßen etwa 100 Meter und auf der Autobahn mindestens 150 Meter.',
      'Erst wenn die Stelle gesichert ist, folgen Notruf und Erste Hilfe. Die Reihenfolge schützt dich und die Verletzten vor Folgeunfällen.',
    ],
    sections: [
      {
        heading: 'Die richtige Reihenfolge',
        numbered: [
          'Warnblinklicht einschalten und Fahrzeug, wenn möglich, auf den Seitenstreifen oder rechts heranfahren.',
          'Warnweste anziehen, bevor du aussteigst. Mitführen ist Pflicht; mindestens eine Warnweste muss im Fahrzeug sein.',
          'Mitfahrer über die Beifahrerseite aussteigen lassen und hinter die Leitplanke bringen.',
          'Warndreieck entgegen der Fahrtrichtung tragen – am Fahrbahnrand, das Dreieck vor dem Körper – und aufstellen.',
          'Notruf 112 wählen: Wo ist es passiert? Was ist passiert? Wie viele Verletzte? Dann auf Rückfragen warten.',
          'Erste Hilfe leisten, bis der Rettungsdienst eintrifft.',
        ],
      },
      {
        heading: 'Wie weit muss das Warndreieck stehen?',
        bullets: [
          'Innerorts: etwa 50 Meter.',
          'Landstraße: etwa 100 Meter (so nennt es § 15 StVO für schnellen Verkehr).',
          'Autobahn: mindestens 150 Meter, besser 200 Meter oder mehr.',
          'Vor Kurven oder Kuppen: so weit davor, dass Nachfolgende rechtzeitig gewarnt werden. Leitpfosten helfen beim Abschätzen (meist 50 m Abstand).',
        ],
      },
      {
        heading: 'Pflichten nach einem Unfall',
        bullets: [
          'Anhalten und die Unfallstelle sichern; wer sich unerlaubt entfernt, begeht eine Straftat (§ 142 StGB).',
          'Erste Hilfe ist Pflicht, soweit sie zumutbar ist – unterlassene Hilfeleistung ist strafbar (§ 323c StGB).',
          'Bei Verletzten immer 112 rufen, bei reinem Sachschaden kann die Polizei unter 110 hinzugezogen werden.',
          'Personalien und Versicherung mit den Beteiligten austauschen und Fotos machen.',
        ],
      },
      {
        heading: 'An einer fremden Unfallstelle vorbeifahren',
        paragraphs: [
          'Siehst du ein Warndreieck oder Blaulicht, nimm Geschwindigkeit weg und fahre langsam und mit Abstand vorbei. Gaffen und Fotografieren behindert die Rettung und ist zum Teil strafbar. Wer helfen kann und noch keine Helfer vor Ort sind, hält hinter der Unfallstelle an – nicht davor.',
        ],
      },
    ],
    appTip:
      'Die App enthält Notfallszenarien mit Unfallstelle und Warndreieck. Du siehst die Situation aus der Fahrerperspektive und entscheidest, wie du richtig reagierst – vom Abbremsen bis zum Vorbeifahren.',
    howToHeading: 'Notfallsituationen üben',
    howToSteps: [
      { title: 'Gefahr erkennen', text: 'Warndreieck, Warnblinker und Unfallstelle früh sehen.' },
      { title: 'Richtig reagieren', text: 'Geschwindigkeit anpassen, Abstand halten, sicher vorbeifahren.' },
      { title: 'Regel nachlesen', text: 'Die App erklärt das richtige Verhalten.' },
    ],
    faqs: [
      { question: 'Wie weit muss das Warndreieck auf der Autobahn stehen?', answer: 'Mindestens 150 Meter, besser 200 Meter oder mehr. Vor Kurven noch weiter, damit es rechtzeitig gesehen wird.' },
      { question: 'Muss ich eine Warnweste tragen?', answer: 'Mitführen ist Pflicht. Beim Aussteigen auf Autobahn und Landstraße solltest du sie unbedingt anziehen – vor dem Aussteigen.' },
      { question: 'Was sage ich beim Notruf 112?', answer: 'Wo ist es passiert, was ist passiert, wie viele Verletzte gibt es, welche Verletzungen – und dann auf Rückfragen warten.' },
      { question: 'Muss ich Erste Hilfe leisten?', answer: 'Ja, soweit es zumutbar ist und du dich nicht selbst erheblich gefährdest. Unterlassene Hilfeleistung ist nach § 323c StGB strafbar.' },
      { question: 'Kann ich Notfallsituationen in einer App üben?', answer: `Ja. ${APP} für iPhone enthält Notfallszenarien mit Unfallstelle und Warndreieck: ${APP_URL}` },
    ],
    sources: [stvo15, law('142', '§ 142 StGB – Unerlaubtes Entfernen vom Unfallort', 'stgb'), stgb323c],
    screenshotIndex: 5,
  },

  /* ----------------------------------------------------------------- 12 */
  {
    slug: 'probezeit-fuehrerschein-regeln',
    keyword: 'probezeit führerschein regeln',
    title: 'Probezeit beim Führerschein: Regeln, A- und B-Verstöße, Folgen',
    metaTitle: 'Probezeit Führerschein – A-/B-Verstöße, Aufbauseminar, 0,0',
    metaDescription:
      'Die Probezeit dauert 2 Jahre. Ein A-Verstoß oder zwei B-Verstöße führen zu Aufbauseminar und Verlängerung auf 4 Jahre. Alkohol: 0,0 Promille. Alle Regeln nach § 2a StVG.',
    excerpt: 'Zwei Jahre, 0,0 Promille und was nach einem Verstoß passiert.',
    keyTakeaways: [
      'Die Probezeit dauert 2 Jahre ab Erteilung der ersten Fahrerlaubnis (§ 2a StVG).',
      'Ein A-Verstoß oder zwei B-Verstöße führen zu einem Aufbauseminar und zur Verlängerung der Probezeit auf 4 Jahre.',
      'Typische A-Verstöße: Rotlicht, Vorfahrt missachtet, 21 km/h oder mehr zu schnell, Alkohol, Handy am Steuer.',
      'In der Probezeit und bis 21 gilt 0,0 Promille; ein Verstoß kostet 250 Euro und 1 Punkt.',
    ],
    intro: [
      'Die Probezeit dauert zwei Jahre ab der ersten Fahrerlaubnis. Wer in dieser Zeit einen schwerwiegenden Verstoß (A-Verstoß) oder zwei weniger schwerwiegende Verstöße (B-Verstöße) begeht, muss ein Aufbauseminar besuchen, und die Probezeit verlängert sich auf vier Jahre. Das regelt § 2a Straßenverkehrsgesetz.',
      'Zusätzlich gilt in der Probezeit ein absolutes Alkoholverbot: 0,0 Promille. Und weil ausgerechnet Vorfahrtsfehler zu den häufigsten A-Verstößen gehören, lohnt es sich, gerade die Kreuzungsregeln wirklich sicher zu können.',
    ],
    sections: [
      {
        heading: 'A-Verstöße und B-Verstöße',
        bullets: [
          'A-Verstöße (schwerwiegend): Rotlichtverstoß, Vorfahrt missachtet, Überschreiten der Geschwindigkeit um 21 km/h oder mehr, zu geringer Abstand, Überholverstöße, Alkohol und Drogen, Handy am Steuer, Unfallflucht.',
          'B-Verstöße (weniger schwerwiegend): etwa fehlende Winterreifen bei winterlichen Verhältnissen, abgefahrene Reifen oder andere technische Mängel am Fahrzeug.',
          'Ein A-Verstoß genügt für Maßnahmen; bei B-Verstößen braucht es zwei.',
          'Maßgeblich ist die Eintragung im Fahreignungsregister – Verwarnungsgelder unter 60 Euro werden nicht eingetragen.',
        ],
      },
      {
        heading: 'Was nach einem Verstoß passiert – die drei Stufen',
        numbered: [
          'Erster Verstoß (1 A oder 2 B): Anordnung eines Aufbauseminars und Verlängerung der Probezeit auf 4 Jahre.',
          'Weiterer Verstoß: schriftliche Verwarnung und Empfehlung, innerhalb von zwei Monaten eine verkehrspsychologische Beratung zu besuchen.',
          'Noch ein Verstoß nach Ablauf der Zwei-Monats-Frist: Entzug der Fahrerlaubnis.',
          'Wer das angeordnete Aufbauseminar nicht fristgerecht besucht, verliert ebenfalls die Fahrerlaubnis.',
        ],
      },
      {
        heading: 'Alkohol: 0,0 Promille',
        paragraphs: [
          'Für Fahranfänger in der Probezeit und für alle unter 21 Jahren gilt nach § 24c StVG ein absolutes Alkoholverbot. Schon ein Glas Sekt kann reichen. Ein Verstoß kostet laut Bußgeldkatalog 250 Euro und 1 Punkt und ist zugleich ein A-Verstoß mit Aufbauseminar und Probezeitverlängerung.',
        ],
      },
      {
        heading: 'Sonderfälle',
        bullets: [
          'Begleitetes Fahren ab 17: Die Probezeit beginnt mit der Prüfungsbescheinigung, also schon mit 17.',
          'Neue Führerscheinklasse (z. B. Motorrad) während der Probezeit: Es gibt keine neue Probezeit, aber Verstöße mit jeder Klasse zählen.',
          'Ausländischer Führerschein: Wer im Ausland schon länger als zwei Jahre eine Fahrerlaubnis hat, ist in der Regel nicht mehr in der Probezeit; die Führerscheinstelle prüft das im Einzelfall.',
        ],
      },
    ],
    appTip:
      'Vorfahrtsfehler sind A-Verstöße – und in der Probezeit besonders teuer. Mit der App trainierst du rechts vor links, Vorfahrtstraßen, Ampeln und abknickende Vorfahrt so lange, bis du an jeder Kreuzung sicher bist.',
    howToHeading: 'Die häufigsten Probezeit-Fallen vermeiden',
    howToSteps: [
      { title: 'Vorfahrt üben', text: '52 Kreuzungssituationen in 3D, bis jede Regel sitzt.' },
      { title: 'Ampeln trainieren', text: 'Im Fahrsimulator rechtzeitig an der Haltlinie anhalten.' },
      { title: 'Schwächen erkennen', text: 'Der Fortschritt zeigt, welche Themen noch unsicher sind.' },
    ],
    faqs: [
      { question: 'Wie lange dauert die Probezeit?', answer: 'Zwei Jahre ab Erteilung der ersten Fahrerlaubnis. Nach einem A-Verstoß oder zwei B-Verstößen verlängert sie sich auf vier Jahre.' },
      { question: 'Ist Vorfahrt missachten ein A-Verstoß?', answer: 'Ja. Missachtete Vorfahrt gehört zu den schwerwiegenden Verstößen und führt in der Probezeit zum Aufbauseminar.' },
      { question: 'Wie viel Alkohol ist in der Probezeit erlaubt?', answer: 'Keiner. Es gilt 0,0 Promille, ein Verstoß kostet 250 Euro und 1 Punkt.' },
      { question: 'Wie viel zu schnell ist ein A-Verstoß?', answer: 'Ab 21 km/h über dem Limit.' },
      { question: 'Wie kann ich Vorfahrtsfehler in der Probezeit vermeiden?', answer: `Indem du Kreuzungen gezielt übst, zum Beispiel mit ${APP} für iPhone: ${APP_URL}` },
    ],
    sources: [stvg2a, stvg24c, bkat],
    screenshotIndex: 2,
  },
];

export const vorfahrtGuidesDe2: AppGuide[] = guides.map((guide) => ({
  ...guide,
  lang: 'de',
  publishedAt: '2026-10-10',
  reviewedAt: '2026-10-10',
}));
