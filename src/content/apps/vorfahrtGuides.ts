import type { AppGuide } from './types';

const stvo8 = { title: '§ 8 StVO – Vorfahrt', url: 'https://www.gesetze-im-internet.de/stvo_2013/__8.html' };
const stvo9 = { title: '§ 9 StVO – Abbiegen, Wenden und Rückwärtsfahren', url: 'https://www.gesetze-im-internet.de/stvo_2013/__9.html' };
const stvo37 = { title: '§ 37 StVO – Lichtzeichen', url: 'https://www.gesetze-im-internet.de/stvo_2013/__37.html' };
const signs = { title: 'Anlage 3 StVO – Richtzeichen und abknickende Vorfahrt', url: 'https://www.gesetze-im-internet.de/stvo_2013/anlage_3.html' };
const signs2 = { title: 'Anlage 2 StVO – Vorschriftzeichen und Kreisverkehr', url: 'https://www.gesetze-im-internet.de/stvo_2013/anlage_2.html' };
const fevExam = { title: 'Anlage 7 FeV – Fahrerlaubnisprüfung und Prüfungssprachen', url: 'https://www.gesetze-im-internet.de/fev_2010/anlage_7.html' };

const guides: AppGuide[] = [
  {
    slug: 'abknickende-vorfahrt-wer-faehrt-zuerst',
    keyword: 'abknickende vorfahrt wer fährt zuerst',
    title: 'Abknickende Vorfahrt: Wer fährt zuerst und wann musst du blinken?',
    metaTitle: 'Abknickende Vorfahrt einfach erklärt: Reihenfolge und Blinken',
    metaDescription: 'Die dicke Linie auf dem Zusatzschild entscheidet: So löst du abknickende Vorfahrt, Abbiegeregeln und Blinken mit einem konkreten Beispiel.',
    excerpt: 'Der Verlauf der Vorfahrtstraße, das Blinken und die Reihenfolge an einer schwierigen Kreuzung.',
    intro: [
      'Bei einer abknickenden Vorfahrtstraße folgt die Vorfahrt der dicken Linie auf dem Zusatzschild. Wer auf dieser Linie weiterfährt, behält gegenüber den einmündenden Nebenstraßen die Vorfahrt – auch wenn die Hauptstraße nach links oder rechts abbiegt. Wer dem Knick folgt, muss die Richtungsänderung rechtzeitig anzeigen.',
      'Die häufigste Verwechslung: „Ich fahre geradeaus, also habe ich Vorfahrt.“ Die Fahrtrichtung allein entscheidet das nicht. Erst das Vorfahrtsschild mit Verlaufsskizze, dann die Position der anderen Fahrzeuge und schließlich mögliche Abbiegeregeln ergeben die Antwort.',
    ],
    sections: [
      { heading: 'Was zeigt das Zusatzschild genau?', paragraphs: [
        'Das breite schwarze Band ist der Verlauf der Vorfahrtstraße; dünnere Linien stehen für untergeordnete Straßen. Stell dir vor, du kommst von unten und die dicke Linie biegt nach links ab. Das Auto von links fährt ebenfalls auf der Vorfahrtstraße. Die Fahrzeuge von oben und rechts kommen aus Nebenstraßen und müssen den bevorrechtigten Verkehr durchlassen.',
        'Das Schild sagt noch nicht, dass jedes Fahrzeug auf der dicken Linie immer vor jedem anderen fahren darf. Treffen zwei Fahrzeuge auf derselben Vorfahrtstraße aufeinander und kreuzen ihre Wege, musst du zusätzlich auf Fahrtrichtung und Abbiegeregeln achten. Ein freier Weg ist nie eine Einladung, andere zu schneiden.'
      ] },
      { heading: 'Ein Beispiel Schritt für Schritt', numbered: [
        'Lies zuerst das Zeichen 306 und das Zusatzschild: Welche beiden Straßenarme bilden die Vorfahrtstraße?',
        'Ordne jedes Fahrzeug einem Arm zu. Fahrzeuge auf den dünnen Armen warten zunächst auf Verkehr der Vorfahrtstraße.',
        'Prüfe danach, ob Fahrzeuge auf der Vorfahrtstraße einander kreuzen. Beim Abbiegen können Gegenverkehr und andere Beteiligte nach § 9 StVO Vorrang haben.',
        'Erst wenn die bevorrechtigten Fahrwege frei sind, klären die Fahrzeuge aus den Nebenstraßen ihre Reihenfolge anhand ihrer eigenen Schilder und der konkreten Fahrwege.'
      ], paragraphs: [
        'Beispiel: Die Vorfahrtstraße biegt von deiner Richtung nach links ab. Du folgst ihr nach links; ein Auto aus der rechten Nebenstraße will geradeaus. Du fährst zuerst, sofern dein Weg frei ist. Das andere Auto erhält durch sein Geradeausfahren keine Vorfahrt gegenüber der Vorfahrtstraße.'
      ] },
      { heading: 'Wann wird geblinkt?', paragraphs: [
        'Folgst du dem Verlauf der abknickenden Vorfahrtstraße, musst du die Richtungsänderung rechtzeitig und deutlich anzeigen. Das steht ausdrücklich bei Zeichen 306 mit entsprechendem Zusatzschild. Wer die Vorfahrtstraße verlässt und tatsächlich abbiegt, kündigt das Abbiegen nach § 9 StVO ebenfalls an.',
        'Fährst du geometrisch geradeaus aus der Vorfahrtstraße heraus, setzt du nicht allein deshalb den Blinker, weil du die dicke Linie verlässt. Entscheidend ist die tatsächliche Fahrbewegung. Beobachte trotzdem die Beschilderung auf deinem Straßenarm; „geradeaus“ ist keine Abkürzung an einer Wartepflicht vorbei.'
      ] },
      { heading: 'Typische Prüfungsfehler', bullets: [
        'Die dünne Linie für die Hauptstraße halten, weil sie auf dem Bild geradeaus verläuft.',
        'Dem geradeaus fahrenden Nebenstraßenverkehr automatisch den Vorrang geben.',
        'Beim Folgen des Knicks nicht blinken.',
        'Nur das Vorfahrtsschild beachten und abbiegende Fahrzeuge oder Fußgänger übersehen.'
      ] },
      { heading: 'So behältst du den Überblick', paragraphs: [
        'Sprich die Lage in einem Satz aus: „Die Vorfahrtstraße kommt von hier und geht dort weiter.“ Zeichne gedanklich zuerst diese Verbindung, bevor du eine Fahrreihenfolge festlegst. In einer Übung mit mehreren Fahrzeugen notierst du danach für jedes Auto den Startarm und die beabsichtigte Richtung. So trennst du Vorfahrt von Abbiegevorgängen und kannst deinen Entschluss begründen.'
      ] },
    ],
    howToHeading: 'Abknickende Vorfahrt in 3D üben',
    howToSteps: [
      { title: 'Verlauf suchen', text: 'Erkenne die dicke Linie auf dem Zusatzschild in der Kreuzungsansicht.' },
      { title: 'Reihenfolge festlegen', text: 'Ordne jedes Fahrzeug seiner Straße und Fahrtrichtung zu.' },
      { title: 'Auflösung prüfen', text: 'Vergleiche deine Entscheidung mit der Animation und der StVO-Erklärung.' },
    ],
    faqs: [
      { question: 'Muss ich blinken, wenn ich auf der abknickenden Vorfahrtstraße bleibe?', answer: 'Ja. Wer dem abknickenden Verlauf folgt, muss die Richtungsänderung rechtzeitig und deutlich mit dem Fahrtrichtungsanzeiger ankündigen.' },
      { question: 'Hat ein geradeaus fahrendes Auto aus der Nebenstraße Vorfahrt?', answer: 'Nein. Geradeausfahren hebt die Wartepflicht gegenüber der durch Zeichen 306 gekennzeichneten Vorfahrtstraße nicht auf.' },
      { question: 'Darf ich auf der Vorfahrtstraße ohne weitere Prüfung abbiegen?', answer: 'Nein. Vorfahrt gegenüber Nebenstraßen beseitigt nicht die Sorgfaltspflichten beim Abbiegen, etwa gegenüber Gegenverkehr, Radfahrenden oder Fußgängern.' },
    ],
    sources: [stvo8, stvo9, signs], screenshotIndex: 2,
  },
  {
    slug: 'kreisverkehr-vorfahrt-einfahren-ausfahren',
    keyword: 'kreisverkehr vorfahrt einfahren ausfahren',
    title: 'Kreisverkehr in Deutschland: Vorfahrt beim Einfahren und Ausfahren',
    metaTitle: 'Kreisverkehr: Vorfahrt, Blinken und typische Fehler',
    metaDescription: 'Wer hat im deutschen Kreisverkehr Vorfahrt? Erklärung zu Zeichen 215 und 205, Blinken beim Ein- und Ausfahren und einem Praxisbeispiel.',
    excerpt: 'Die Kombination aus Zeichen 215 und 205 entscheidet, wer wartet – plus Regeln fürs Blinken.',
    intro: [
      'Am üblichen deutschen Kreisverkehr mit Zeichen 215 („Kreisverkehr“) und Zeichen 205 („Vorfahrt gewähren“) hat der Verkehr auf der Kreisfahrbahn Vorfahrt. Wer einfährt, wartet auf eine ausreichend große Lücke. Beim Einfahren ist Blinken in dieser Kombination ausdrücklich verboten; beim Ausfahren zeigst du die Richtungsänderung an.',
      'Wichtig ist die Beschilderung an der tatsächlichen Einfahrt. Eine rund angelegte Kreuzung ohne diese Zeichenkombination ist rechtlich nicht automatisch derselbe Fall. Verlasse dich daher nicht nur auf die Form der Verkehrsinsel.',
    ],
    sections: [
      { heading: 'Die beiden Schilder zusammen lesen', paragraphs: [
        'Zeichen 215 gibt die Fahrtrichtung im Kreisverkehr vor. Steht darunter Zeichen 205, müssen Einfahrende die Fahrzeuge im Kreis durchfahren lassen. § 8 Absatz 1a StVO formuliert diese Kombination ausdrücklich. Reduziere deine Geschwindigkeit schon vor der Haltelinie und beobachte vor allem den Verkehr, der deine Einfahrt kreuzt.',
        'Gibt es keine solche Kombination, lies die vorhandenen Schilder und gegebenenfalls die allgemeine Vorfahrtregel neu. Genau deshalb ist „Im Kreis hat immer jeder Vorfahrt“ keine verlässliche Lernregel.'
      ] },
      { heading: 'Blinken: Einfahrt und Ausfahrt unterscheiden', paragraphs: [
        'Beim Einfahren in den nach § 8 Absatz 1a geregelten Kreisverkehr darfst du den Blinker nicht benutzen. Du fährst in die vorgeschriebene Richtung und suchst eine Lücke. Bevor du den Kreis verlässt, zeigst du dein Abbiegen rechtzeitig an. Setze den Blinker so, dass andere deine Ausfahrt erkennen können, ohne sie mit einer früheren Ausfahrt zu verwechseln.',
        'Ein Blinker eines anderen Fahrzeugs allein garantiert keine freie Einfahrt. Beobachte, ob das Fahrzeug tatsächlich ausfährt. Im Zweifel wartest du; § 8 verlangt, dass der bevorrechtigte Verkehr weder gefährdet noch wesentlich behindert wird.'
      ] },
      { heading: 'Beispiel mit drei Fahrzeugen', paragraphs: [
        'Du wartest an der Einfahrt. Links nähert sich ein Auto auf der Kreisfahrbahn; hinter dir wartet ein weiteres Auto. Das Auto im Kreis fährt zuerst. Sobald es deine Einfahrt passiert hat oder sicher vorher ausfährt und eine ausreichende Lücke entsteht, kannst du einfahren. Das Fahrzeug hinter dir folgt erst danach und beurteilt die Lage selbst neu.',
        'Möchtest du an der nächsten Ausfahrt herausfahren, kündige das an und beobachte Radfahrende oder Fußgänger im Bereich der Ausfahrt. Deine Vorfahrt auf der Kreisfahrbahn bedeutet nicht, dass du beim Abbiegen andere Verkehrsteilnehmer übersehen darfst.'
      ] },
      { heading: 'Vier Fehler, die häufig passieren', bullets: [
        'Schon vor der Einfahrt blinken, obwohl Zeichen 215 und 205 gelten.',
        'Sich nur am Blinker des Fahrzeugs im Kreis orientieren und zu früh losfahren.',
        'Die gewünschte Ausfahrt zu spät oder gar nicht anzeigen.',
        'Eine ähnlich aussehende, aber anders beschilderte Kreuzung wie einen geregelten Kreisverkehr behandeln.'
      ] },
      { heading: 'Prüfschema für Theorie und Praxis', numbered: [
        'Suche an deiner Einfahrt Zeichen 215 und 205.',
        'Prüfe, ob Verkehr auf der Kreisfahrbahn deine Einfahrt erreicht.',
        'Fahre ohne Einfahrtsblinker ein, sobald du sicher niemanden behinderst.',
        'Zeige die gewählte Ausfahrt rechtzeitig an und prüfe den querenden Verkehr.'
      ] },
    ],
    howToHeading: 'Kreisverkehr-Regeln systematisch lernen',
    howToSteps: [
      { title: 'Schilder erkennen', text: 'Trenne die Regel für den Kreisverkehr von ähnlich aussehenden Kreuzungen.' },
      { title: 'Vorfahrt entscheiden', text: 'Übe, den bevorrechtigten Verkehr vor deiner Einfahrt zu erkennen.' },
      { title: 'Abbiegen mitdenken', text: 'Übertrage die allgemeine Abbiege-Sorgfalt auf das Ausfahren.' },
    ],
    faqs: [
      { question: 'Wer hat im deutschen Kreisverkehr Vorfahrt?', answer: 'Bei der Kombination aus Zeichen 215 und Zeichen 205 hat der Verkehr auf der Kreisfahrbahn Vorfahrt. Ohne diese Kombination musst du die konkrete Beschilderung prüfen.' },
      { question: 'Muss ich beim Einfahren blinken?', answer: 'Bei einem Kreisverkehr mit Zeichen 215 und 205 ist das Blinken beim Einfahren nach § 8 Absatz 1a StVO unzulässig.' },
      { question: 'Wann blinke ich beim Ausfahren?', answer: 'Vor der gewählten Ausfahrt, rechtzeitig und eindeutig. Das Ausfahren ist eine Richtungsänderung; beobachte dabei auch querenden Rad- und Fußverkehr.' },
    ],
    sources: [stvo8, stvo9, signs2], screenshotIndex: 0,
  },
  {
    slug: 'ampel-ausgefallen-gelb-blinkend-vorfahrt',
    keyword: 'ampel ausgefallen gelb blinkend vorfahrt',
    title: 'Ampel ausgefallen oder gelb blinkend: Wer hat Vorfahrt?',
    metaTitle: 'Ampel ausgefallen: Vorfahrt sicher bestimmen',
    metaDescription: 'Wenn die Ampel aus ist oder gelb blinkt: So prüfst du Polizei, Vorfahrtsschilder und rechts vor links in der richtigen Reihenfolge.',
    excerpt: 'Die richtige Reihenfolge bei einer nicht regelnden Ampel – mit Kreuzungsbeispiel.',
    intro: [
      'Ist eine Ampel ausgeschaltet oder zeigt sie nur gelbes Blinklicht als Warnsignal, regelt sie die Vorfahrt der Kreuzung nicht wie eine normale Rot-Gelb-Grün-Anlage. Prüfe zuerst, ob die Polizei den Verkehr regelt. Danach beachtest du die Vorfahrtsschilder. Fehlen auch diese, gilt an Kreuzungen und Einmündungen grundsätzlich rechts vor links nach § 8 StVO.',
      '„Die Ampel ist kaputt, also darf ich vorsichtig fahren“ reicht nicht. Du brauchst eine konkrete Regel für deine Fahrtrichtung und musst dich bei schlechter Sicht notfalls langsam vortasten.',
    ],
    sections: [
      { heading: 'Die Rangfolge an der Kreuzung', numbered: [
        'Weisungen der Polizei beachten, falls jemand den Verkehr regelt.',
        'Prüfen, ob eine funktionsfähige Lichtzeichenregelung für deine Fahrtrichtung gilt.',
        'Bei ausgeschalteter oder nur warnend blinkender Anlage die Verkehrszeichen für die Kreuzung lesen.',
        'Ohne regelnde Zeichen die Grundregel rechts vor links anwenden und zusätzlich Abbiegevorgänge prüfen.'
      ], paragraphs: [
        '§ 37 StVO stellt Lichtzeichen über Vorrangregeln und Vorrang regelnde Verkehrszeichen. Das hilft aber nur, wenn das Lichtzeichen für deinen Verkehr tatsächlich eine Regelung trifft. Ein gelbes Warnblinken ist kein grünes Freigabesignal.'
      ] },
      { heading: 'Beispiel: Hauptstraße und Nebenstraße', paragraphs: [
        'Du stehst auf einer Nebenstraße vor einem „Vorfahrt gewähren“-Schild. Die Ampel an der Kreuzung ist dunkel. Auf der querenden Straße fährt ein Auto. Du musst warten, weil das Schild weiterhin deine Vorfahrtspflicht bestimmt. Dass die andere Fahrerin wegen der ausgeschalteten Ampel ebenfalls langsamer wird, ändert die Schilder nicht.',
        'Anderes Beispiel: Auf keiner Seite stehen Vorfahrtsschilder und die Ampel regelt niemanden. Ein Auto kommt von rechts. Du lässt es durchfahren. Willst du anschließend links abbiegen, prüfst du zusätzlich den Gegenverkehr und die übrigen Abbiegepflichten.'
      ] },
      { heading: 'Was gilt bei Gelb?', paragraphs: [
        'Unterscheide ein gelbes Dauerlicht innerhalb der normalen Ampelphase vom gelben Blinklicht. Das normale Gelb fordert dich nach § 37 StVO grundsätzlich auf, vor der Kreuzung auf das nächste Signal zu warten. Gelbes Blinken warnt dagegen vor einer Gefahrenstelle oder einer nicht normal geregelten Kreuzung; die Vorfahrtsentscheidung ergibt sich dann aus den übrigen Regelungen.',
        'Verlass dich nie darauf, dass alle anderen denselben Defekt gleich schnell erkannt haben. Fahre so, dass du jederzeit auf eine Fehlentscheidung anderer reagieren kannst.'
      ] },
      { heading: 'Bei schlechter Sicht richtig warten', paragraphs: [
        '§ 8 StVO erlaubt vorsichtiges Hineintasten, wenn du den bevorrechtigten Verkehr wegen einer unübersichtlichen Stelle nicht überblicken kannst. Das ist kein Recht zum Erzwingen der Vorfahrt. Halte zunächst dort, wo du musst, taste dich nur langsam bis zur Sichtlinie vor und fahre erst weiter, wenn du den anderen Verkehr weder gefährdest noch wesentlich behinderst.'
      ] },
      { heading: 'Merksatz', paragraphs: [
        'Polizei – funktionierende Ampel – Schilder – rechts vor links. Danach kommen die Regeln für die konkrete Fahrbewegung, besonders beim Abbiegen. Diese Reihenfolge ist zuverlässiger als die Vermutung, die breitere Straße müsse automatisch Vorfahrt haben.'
      ] },
    ],
    howToHeading: 'Vorfahrt ohne Ampel üben',
    howToSteps: [
      { title: 'Regelung erkennen', text: 'Prüfe in der 3D-Situation, ob eine Ampel tatsächlich den Verkehr regelt.' },
      { title: 'Schilder suchen', text: 'Bestimme danach die Vorfahrt anhand der vorhandenen Zeichen.' },
      { title: 'Ohne Schilder lösen', text: 'Wende rechts vor links nur an, wenn keine vorrangige Regel greift.' },
    ],
    faqs: [
      { question: 'Gilt bei einer ausgefallenen Ampel sofort rechts vor links?', answer: 'Nicht automatisch. Zuerst gelten mögliche Weisungen der Polizei und vorhandene Vorfahrtsschilder. Erst ohne eine solche Regelung kommt die allgemeine Vorfahrtregel zum Zug.' },
      { question: 'Ist gelbes Blinken dasselbe wie normales Gelb?', answer: 'Nein. Das normale Gelb ist Teil der Ampelphase; gelbes Blinklicht ist ein Warnsignal und gibt keine freie Fahrt.' },
      { question: 'Darf ich mich in eine unübersichtliche Kreuzung hineintasten?', answer: 'Ja, vorsichtig, wenn du den bevorrechtigten Verkehr sonst nicht sehen kannst. Du darfst ihn dabei weder gefährden noch wesentlich behindern.' },
    ],
    sources: [stvo8, stvo37], screenshotIndex: 2,
  },
  {
    slug: 'linksabbiegen-gegenverkehr-vorfahrt',
    keyword: 'linksabbiegen gegenverkehr vorfahrt',
    title: 'Linksabbiegen an der Kreuzung: Gegenverkehr und Vorfahrt richtig beurteilen',
    metaTitle: 'Linksabbiegen: Gegenverkehr, Grün und Vorfahrt erklärt',
    metaDescription: 'Beim Linksabbiegen entscheidet nicht nur die Ampel: Erfahre, wann Gegenverkehr durchfahren darf und wie du die Situation sicher löst.',
    excerpt: 'Warum Grün allein nicht genügt und wie du Gegenverkehr beim Linksabbiegen einordnest.',
    intro: [
      'Wer links abbiegt, muss grundsätzlich entgegenkommende Fahrzeuge durchfahren lassen. Das gilt auch, wenn die eigene Ampel Grün zeigt: Eine normale grüne Ampel gibt den Verkehr frei, beseitigt aber die Abbiegepflichten aus § 9 StVO nicht. Ein gesondertes grünes Pfeilsignal kann eine andere, geschützte Situation anzeigen.',
      'Für die Theorieprüfung hilft ein klarer Ablauf: erst die Regelung der Kreuzung lesen, dann deine Abbiegerichtung, den Gegenverkehr und den querenden Fuß- oder Radverkehr prüfen.',
    ],
    sections: [
      { heading: 'Grün bedeutet Freigabe, nicht automatisch freie Strecke', paragraphs: [
        'Bei normalem Grün darfst du in die Kreuzung einfahren, aber nur unter Beachtung der Abbiegevorschriften. Kommt dir ein Auto geradeaus entgegen, lässt du es passieren. Das gilt auch für ein entgegenkommendes Fahrzeug, das rechts abbiegt. Schienenfahrzeuge sind besonders zu beachten.',
        'Ein grüner Pfeil als eigenes Lichtzeichen für deine Richtung ist nicht dasselbe wie ein gewöhnliches rundes Grün. § 37 StVO beschreibt ausdrücklich, wann ein grüner Pfeil links hinter der Kreuzung anzeigt, dass der Gegenverkehr durch Rot angehalten wird. Prüfe genau, welches Signal du tatsächlich siehst.'
      ] },
      { heading: 'Ein konkreter Kreuzungsfall', paragraphs: [
        'Du willst links abbiegen, gegenüber kommt ein Auto geradeaus. Beide haben normales Grün. Du wartest, bis das entgegenkommende Auto durchgefahren ist und der restliche Weg frei ist. Ein hinter dir wartendes Auto ändert daran nichts. Druck von hinten ersetzt keine Lücke im Gegenverkehr.',
        'Kommt gleichzeitig ein Fußgänger über die Straße, in die du einbiegen willst, musst du besondere Rücksicht nehmen und nötigenfalls warten. Fährt neben dem Gegenverkehr ein Fahrrad, darfst du dessen Weg ebenfalls nicht abschneiden.'
      ] },
      { heading: 'Zwei Linksabbieger gegenüber', paragraphs: [
        'Wollen zwei einander entgegenkommende Fahrzeuge beide links abbiegen, biegen sie grundsätzlich voreinander ab. Manchmal erfordern Verkehrsführung oder tatsächliche Lage eine andere Fahrweise. Beobachte daher Markierungen und die Stellung der Fahrzeuge; versuche nicht, eine enge Situation durch schnelles Ziehen zu lösen.',
        'Bei unklaren Blickverhältnissen bleibst du defensiv und suchst eindeutige Verständigung. Die Regeln zur Vorfahrt auf den Zufahrtsstraßen und die Abbiegepflichten sind getrennte Fragen.'
      ] },
      { heading: 'Fünf-Punkte-Blick vor dem Abbiegen', numbered: [
        'Rechtzeitig blinken und passend einordnen.',
        'Auf nachfolgenden Verkehr achten.',
        'Ampel, Schilder oder Polizeizeichen für die Kreuzung lesen.',
        'Gegenverkehr einschließlich Rad- und Schienenverkehr durchfahren lassen.',
        'Querenden Fuß- und Radverkehr am Ziel der Abbiegefahrt prüfen.'
      ] },
      { heading: 'So lernst du es für die Prüfung', paragraphs: [
        'Formuliere bei jeder Aufgabe ausdrücklich: „Ich biege links ab; wer kreuzt meinen Fahrweg?“ Das verhindert, dass du nur nach einem grünen Licht oder einem Vorfahrtsschild suchst. Wiederhole anschließend Varianten mit entgegenkommendem Rechtsabbieger, Fahrrad und Fußgänger. Die Antwort kann sich mit einem einzigen zusätzlichen Verkehrsteilnehmer ändern.'
      ] },
    ],
    howToHeading: 'Linksabbiegen aus Fahrerperspektive üben',
    howToSteps: [
      { title: 'Fahrwege ansehen', text: 'Markiere gedanklich deinen linken Bogen und den Weg des Gegenverkehrs.' },
      { title: 'Reihenfolge entscheiden', text: 'Lass kreuzende Fahrzeuge zuerst fahren, wo § 9 das verlangt.' },
      { title: 'Erklärung vergleichen', text: 'Lies nach der Animation, warum die Reihenfolge gilt.' },
    ],
    faqs: [
      { question: 'Darf ich bei Grün sofort links abbiegen?', answer: 'Nur wenn der Weg frei ist. Bei normalem Grün musst du entgegenkommende Fahrzeuge und die Abbiegepflichten weiterhin beachten.' },
      { question: 'Wer fährt zuerst, wenn ich links und der Gegenverkehr rechts abbiegt?', answer: 'Grundsätzlich lässt der Linksabbieger das entgegenkommende Fahrzeug, das rechts abbiegt, durchfahren.' },
      { question: 'Wie biegen zwei gegenüberstehende Linksabbieger ab?', answer: 'Grundsätzlich voreinander; Verkehrslage oder Gestaltung der Kreuzung können eine andere Führung erforderlich machen.' },
    ],
    sources: [stvo9, stvo37], screenshotIndex: 0,
  },
  {
    slug: 'fussgaenger-radfahrer-beim-abbiegen',
    keyword: 'fussgaenger radfahrer beim abbiegen vorfahrt',
    title: 'Fußgänger und Radfahrer beim Abbiegen: Wann musst du warten?',
    metaTitle: 'Abbiegen mit Fußgängern und Radfahrern: Regeln und Beispiele',
    metaDescription: 'So beachtest du Fußgänger und Radfahrer beim Rechts- und Linksabbiegen – auch bei Grün und auf einer Vorfahrtstraße.',
    excerpt: 'Abbiegende Autos müssen mehr beachten als Schilder: Fuß- und Radverkehr im Kreuzungsbereich.',
    intro: [
      'Beim Abbiegen musst du den Fahrweg anderer Verkehrsteilnehmer sorgfältig prüfen. § 9 StVO verlangt, entgegenkommende Fahrzeuge durchfahren zu lassen; dazu gehören ausdrücklich auch Fahrräder und Elektrokleinstfahrzeuge, die auf oder neben der Fahrbahn in derselben Richtung fahren. Auf zu Fuß Gehende ist besondere Rücksicht zu nehmen, nötigenfalls musst du warten.',
      'Diese Pflicht verschwindet nicht, weil du auf einer Vorfahrtstraße bist oder eine normale grüne Ampel siehst. Vorfahrt regelt vor allem das Verhältnis der zufahrenden Straßen; beim Abbiegen kommen weitere Konflikte hinzu.',
    ],
    sections: [
      { heading: 'Rechtsabbiegen: Der Blick nach rechts und hinten', paragraphs: [
        'Du fährst auf einer Straße geradeaus und willst rechts in eine Seitenstraße. Rechts neben dir fährt ein Fahrrad auf einem Radweg in dieselbe Richtung. Wenn sich eure Wege beim Abbiegen kreuzen, lässt du das Fahrrad durchfahren. Prüfe vor dem Einordnen und nochmals vor dem Abbiegen den nachfolgenden Verkehr. Ein schneller Schulterblick kann einen Radfahrer zeigen, den der Spiegel nicht erfasst.',
        'Fußgänger können die Straße queren, in die du einbiegst. Fahre so, dass du sie erkennst und nötigenfalls wartest. Ein grünes Licht für den Fahrverkehr ist keine pauschale Freigabe, den querenden Fußverkehr zu verdrängen.'
      ] },
      { heading: 'Linksabbiegen: Mehrere Konflikte nacheinander', paragraphs: [
        'Beim Linksabbiegen prüfst du zunächst den Gegenverkehr. Dazu zählen auch entgegenkommende Fahrräder. Anschließend achtest du auf Fußgänger und Radfahrer im Zielbereich. Es ist möglich, dass du den ersten Konflikt gelöst hast, aber wegen des zweiten noch warten musst. „Das Auto ist weg“ bedeutet also nicht automatisch „der ganze Weg ist frei“.',
        'Wenn du aus einem Grundstück ein- oder ausfährst, gelten besonders strenge Sorgfaltspflichten nach § 10 StVO beziehungsweise beim Abbiegen in ein Grundstück nach § 9 Absatz 5. Diese Situation darfst du nicht wie eine normale Kreuzung mit rechts vor links behandeln.'
      ] },
      { heading: 'Beispiel für eine Prüfungsfrage', paragraphs: [
        'Du hast Grün und möchtest rechts abbiegen. Ein Radfahrer fährt rechts neben dir geradeaus; ein Fußgänger überquert bereits die Zielstraße. Du wartest, bis beide den Konfliktbereich sicher verlassen haben. Erst dann biegst du ab. Die grüne Ampel und deine Stellung auf der Hauptstraße ändern die Abbiegepflicht nicht.',
        'In Zeichnungen steht das Fahrrad oft klein am Bildrand. In der Praxis kann es hinter einem Fahrzeug oder durch eine Hecke verdeckt sein. Suche aktiv nach dem Radweg und nach Furten, statt nur die Mitte der Kreuzung anzusehen.'
      ] },
      { heading: 'Praktische Blickreihenfolge', numbered: [
        'Blinken und vor dem Einordnen den nachfolgenden Verkehr prüfen.',
        'Ampel und Schilder für deine Fahrtrichtung erfassen.',
        'Radwege und Gehwege entlang deiner bisherigen Straße kontrollieren.',
        'Den Zielbereich der Abbiegefahrt auf querende Menschen prüfen.',
        'Erst abbiegen, wenn du niemanden gefährdest und erforderliche Wartepflichten erfüllt sind.'
      ] },
      { heading: 'Warum Perspektivwechsel hilft', paragraphs: [
        'Eine Kreuzung von oben zu lesen ist leichter als aus dem Fahrersitz. Gerade beim Abbiegen verschwindet ein Radweg aus dem direkten Blick. Übe deshalb Situationen aus der Fahrerperspektive und benenne laut, wen du vor dem Lenken sehen musst. Das macht aus einer auswendig gelernten Regel eine wiederholbare Blickroutine.'
      ] },
    ],
    howToHeading: 'Abbiegende Situationen in 3D trainieren',
    howToSteps: [
      { title: 'Alle Beteiligten finden', text: 'Suche auch den Rad- und Fußverkehr am Rand der Kreuzung.' },
      { title: 'Fahrwege kreuzen', text: 'Prüfe, wen deine Abbiegelinie schneiden würde.' },
      { title: 'Regel nachlesen', text: 'Vergleiche deine Entscheidung mit der Auflösung und § 9 StVO.' },
    ],
    faqs: [
      { question: 'Darf ich bei Grün vor einem geradeaus fahrenden Radfahrer rechts abbiegen?', answer: 'Nein, wenn du dabei seinen Fahrweg kreuzt. Die Abbiegepflicht gegenüber Radverkehr gilt auch bei einer normalen grünen Ampel.' },
      { question: 'Muss ich beim Abbiegen Fußgänger durchlassen?', answer: 'Auf zu Fuß Gehende ist besondere Rücksicht zu nehmen; wenn nötig, musst du warten. Beurteile den konkreten Kreuzungsbereich und die Signale.' },
      { question: 'Gilt meine Vorfahrtstraße auch gegenüber Radfahrern auf dem Radweg?', answer: 'Ein Vorfahrtsschild hebt die Pflichten beim Abbiegen nicht auf. Prüfe Radfahrende, deren Weg du beim Abbiegen kreuzt.' },
    ],
    sources: [stvo9, { title: '§ 10 StVO – Einfahren und Anfahren', url: 'https://www.gesetze-im-internet.de/stvo_2013/__10.html' }, stvo37], screenshotIndex: 0,
  },
  {
    slug: 'vorfahrt-oder-vorrang-unterschied',
    keyword: 'vorfahrt vorrang unterschied',
    title: 'Vorfahrt oder Vorrang? Der Unterschied mit klaren Beispielen',
    metaTitle: 'Vorfahrt und Vorrang: Unterschied einfach erklärt',
    metaDescription: 'Vorfahrt an Kreuzungen, Vorrang etwa bei Engstellen und beim Abbiegen: So trennst du die Begriffe und löst Prüfungsfragen.',
    excerpt: 'Zwei ähnliche Wörter, verschiedene Verkehrssituationen – mit drei gut merkbaren Beispielen.',
    intro: [
      'Vorfahrt beschreibt in der StVO vor allem, wer an Kreuzungen und Einmündungen zuerst fahren darf. Vorrang ist der breitere Begriff für andere Begegnungen und Fahrwege, zum Beispiel an einer Engstelle oder gegenüber Fußgängern beim Abbiegen. Die Wörter werden im Alltag vermischt; für Prüfungsfragen hilft die Unterscheidung.',
      'Wichtiger als das richtige Fachwort ist immer die konkrete Regel: Welches Schild steht dort, von wo kommen die Beteiligten und kreuzen sich ihre Wege? Die Antwort ergibt sich aus der Situation, nicht allein aus einer Merkhilfe.',
    ],
    sections: [
      { heading: 'Vorfahrt an Kreuzungen und Einmündungen', paragraphs: [
        '§ 8 StVO regelt die Vorfahrt an Kreuzungen und Einmündungen. Ohne besondere Beschilderung hat dort grundsätzlich Vorfahrt, wer von rechts kommt. Die Zeichen 205 („Vorfahrt gewähren“), 206 (Stopp), 301 (Vorfahrt an der nächsten Kreuzung) und 306 (Vorfahrtstraße) können diese Grundregel ersetzen.',
        'Beispiel: Zwei Autos treffen auf einer Kreuzung ohne Schilder ein. Das Auto rechts von dir darf zuerst fahren. Steht vor deiner Zufahrt jedoch ein Stoppschild, hältst du vollständig an und gewährst dem Verkehr auf der bevorrechtigten Straße Vorfahrt, unabhängig davon, ob er von links oder rechts kommt.'
      ] },
      { heading: 'Vorrang an der Engstelle', paragraphs: [
        'Bei einer Fahrbahnverengung steht oft kein klassisches Kreuzungsschild. Wer wegen eines Hindernisses auf seiner Seite links vorbeifahren muss, lässt nach § 6 StVO grundsätzlich den Gegenverkehr durch. Zeichen 208 oder 308 können die Reihenfolge ausdrücklich anders regeln.',
        'Beispiel: Ein parkendes Auto blockiert deine Fahrbahnhälfte. Ein Wagen kommt dir entgegen und es ist kein Platz für beide. Du wartest vor dem Hindernis. Dieses Warten erklärt sich nicht mit „rechts vor links“; es ist eine Vorrangfrage beim Vorbeifahren.'
      ] },
      { heading: 'Vorrang und Rücksicht beim Abbiegen', paragraphs: [
        'Auch wer auf einer Vorfahrtstraße fährt, muss beim Abbiegen § 9 StVO beachten. Entgegenkommende Fahrzeuge und Radfahrende dürfen ihren Weg fortsetzen; auf Fußgänger ist besondere Rücksicht zu nehmen. Die Vorfahrt der Straße sagt nicht, dass jede Bewegung des Fahrzeugs Vorrang vor allen anderen hat.',
        'Beispiel: Du hast auf deiner Zufahrt Vorfahrt, möchtest aber links abbiegen. Ein Auto kommt auf derselben Vorfahrtstraße entgegen und fährt geradeaus. Du lässt es durchfahren. Das Vorfahrtsschild löst den Konflikt zwischen Haupt- und Nebenstraße, nicht den zwischen Linksabbieger und Gegenverkehr.'
      ] },
      { heading: 'So löst du eine Aufgabe ohne Wortfalle', numbered: [
        'Bestimme die Art der Situation: Kreuzung, Abbiegen, Engstelle oder eine andere Begegnung.',
        'Suche die dazu passende Regel und die vorhandenen Verkehrszeichen.',
        'Zeichne gedanklich die Fahrwege; nur sich kreuzende Wege erzeugen eine Reihenfolgefrage.',
        'Prüfe danach besondere Verkehrsteilnehmer wie Radfahrende und Fußgänger.'
      ] },
      { heading: 'Eine wichtige Grenze der Merkhilfe', paragraphs: [
        '„Vorfahrt nur an Kreuzungen“ ist eine nützliche Orientierung, aber kein Ersatz für die StVO. § 8 enthält etwa ausdrücklich die Regel für den beschilderten Kreisverkehr. Mehrere Regeln können an derselben Stelle nacheinander wichtig werden: Erst wird die Vorfahrt der Zufahrt geklärt, danach der Vorrang beim Abbiegen. Genau diese zweite Prüfung verhindert viele falsche Antworten.'
      ] },
    ],
    howToHeading: 'Vorfahrt und Vorrang gezielt üben',
    howToSteps: [
      { title: 'Situation benennen', text: 'Erkenne, ob die Frage eine Kreuzung oder einen anderen Fahrweg betrifft.' },
      { title: 'Regel anwenden', text: 'Löse die Reihenfolge anhand von Schild und Bewegung.' },
      { title: 'Begründung prüfen', text: 'Vergleiche deine Erklärung mit der Auflösung in der App.' },
    ],
    faqs: [
      { question: 'Ist Vorfahrt dasselbe wie Vorrang?', answer: 'Im Alltag werden beide oft gleich verwendet. In der Prüfung hilft: Vorfahrt betrifft typischerweise Kreuzungen und Einmündungen; Vorrang kann auch bei Engstellen oder Abbiegemanövern entscheidend sein.' },
      { question: 'Habe ich beim Linksabbiegen automatisch Vorrang, wenn ich auf einer Vorfahrtstraße fahre?', answer: 'Nein. Gegenverkehr auf derselben Straße muss nach den Abbiegevorschriften grundsätzlich durchfahren können.' },
      { question: 'Wer wartet an einem Hindernis auf seiner Fahrbahnseite?', answer: 'Grundsätzlich die Person, die zum Vorbeifahren auf die Gegenseite ausweichen muss. Verkehrszeichen 208 oder 308 können die Reihenfolge anders festlegen.' },
    ],
    sources: [stvo8, stvo9, { title: '§ 6 StVO – Vorbeifahren', url: 'https://www.gesetze-im-internet.de/stvo_2013/__6.html' }, signs], screenshotIndex: 1,
  },
  {
    slug: 'german-driving-licence-steps-class-b',
    lang: 'en',
    keyword: 'how to get a driving licence in Germany class B',
    title: 'How to get a driving licence in Germany: the Class B steps',
    metaTitle: 'German Driving Licence Class B: Steps, Lessons and Tests',
    metaDescription: 'A clear guide to a first German Class B licence: application, driving school, theory and practical tests, and where intersection practice fits.',
    excerpt: 'The route from your first driving school enquiry to the two tests and your licence.',
    intro: [
      'For a first German Class B car licence, the usual route is to enrol at a driving school, apply to the local driver licensing authority, complete the required training, and pass both a theory and a practical test. The authority checks your documents and eligibility; your driving school organises instruction and helps prepare you for the examinations.',
      'This guide is for a first licence. If you already hold a licence issued abroad, the procedure may be different. Ask your local Fahrerlaubnisbehörde which rules apply to your country of issue before paying for a full training package.',
    ],
    sections: [
      { heading: '1. Choose a driving school and prepare the application', paragraphs: [
        'Compare schools on teaching language, lesson availability, total price structure and how they schedule tests. You will normally need proof of identity, a biometric photo, an eyesight test and proof of first aid training for the application. Your local authority may request additional documents, so use its own checklist rather than a generic internet list.',
        'Submit the application early enough that administrative processing does not delay your test. A driving school can explain the local workflow, but the licence is issued by the competent authority, not by the school or a practice app.'
      ] },
      { heading: '2. Study theory and take driving lessons', paragraphs: [
        'German training has general theory lessons and Class B specific lessons. The training regulation sets minimum theory units; it also provides special practical drives such as rural road, motorway and darkness training. Your instructor decides with you when your driving is sufficiently safe and consistent for a test, beyond any statutory minimum.',
        'Treat priority, signs, turning and hazard perception as connected topics. Learning a question bank by memory can fail when an intersection is rotated or an extra cyclist is added. Practise explaining why one road user may go first, not just which answer box to tick.'
      ] },
      { heading: '3. Pass the theory test', paragraphs: [
        'The German theory test checks legal rules, hazards and safe driving knowledge. It can be taken in English and several other listed languages under the Fahrerlaubnis-Verordnung. The exact question format and assessment are governed by the current examination rules, so confirm the test language and booking with your school before the appointment.',
        'For right-of-way questions, use a repeatable method: look for police direction, traffic lights and priority signs; only then consider the default priority rule. After that, check turning movements, cyclists and pedestrians. This method is more reliable than deciding from the width of the road.'
      ] },
      { heading: '4. Prepare for the practical test', paragraphs: [
        'During driving lessons, practise the same decisions in real traffic: approach speed, observation, indicating, position and safe gaps. At an intersection, identify the controlling signal early and say to yourself which road users could cross your path. Your instructor will help you judge when you can do that consistently without prompting.',
        'The practical test assesses safe control of the vehicle and application of the rules in traffic. A phone exercise can help you understand priority, but it cannot replace supervised driving or teach the physical observation routine on its own.'
      ] },
      { heading: 'Where a 3D practice app can help', paragraphs: [
        'Fahrschule 3D: Vorfahrt üben focuses on intersection and priority decisions. It presents a junction from the driver’s viewpoint, asks who goes first, then shows the movement and explanation. Use that kind of practice between lessons when you repeatedly hesitate at right-before-left junctions, signs or turning conflicts.',
        'Keep a short error log: Which sign did you miss? Was the other vehicle on the priority road? Did a pedestrian or cyclist change the answer? Bring those patterns to your next driving lesson. That connects digital practice with the decisions you must make on the road.'
      ] },
    ],
    howToHeading: 'Use junction practice between lessons',
    howToSteps: [
      { title: 'Choose one priority topic', text: 'Start with right-before-left, signs or a turning conflict.' },
      { title: 'Predict the order', text: 'Explain who goes first before viewing the animation.' },
      { title: 'Discuss mistakes', text: 'Take unclear examples to your driving instructor.' },
    ],
    faqs: [
      { question: 'Can I take the German theory test in English?', answer: 'Yes. English is one of the permitted theory test languages listed in Annex 7 of the Fahrerlaubnis-Verordnung. Confirm the language when booking.' },
      { question: 'Do I need a first aid course and eyesight test?', answer: 'These are normally part of a first Class B application. Check the exact document list with your local licensing authority.' },
      { question: 'Can a practice app replace a driving school?', answer: 'No. The app is a supplement for understanding junction decisions; formal training and the official tests remain part of the licence process.' },
      { question: 'Does this guide apply when exchanging a foreign licence?', answer: 'Not necessarily. Exchange and recognition depend on the issuing country and your circumstances. Ask the local driver licensing authority for the relevant procedure.' },
    ],
    sources: [
      { title: 'German federal service portal – applying for a Class B licence', url: 'https://verwaltung.bund.de/leistungsverzeichnis/DE/leistung/99108047001001' },
      { title: '§ 4 FahrschAusbO – theory instruction', url: 'https://www.gesetze-im-internet.de/fahrschausbo_2012/__4.html' },
      { title: 'Annex 4 FahrschAusbO – special practical drives', url: 'https://www.gesetze-im-internet.de/fahrschausbo_2012/anlage_4.html' },
      fevExam,
    ], screenshotIndex: 3,
  },
  {
    slug: 'german-theory-test-in-english-priority',
    lang: 'en',
    keyword: 'German driving theory test in English priority questions',
    title: 'German theory test in English: how to solve priority questions',
    metaTitle: 'German Theory Test in English: Right-of-Way Questions',
    metaDescription: 'English preparation for German theory test priority questions: a repeatable method for signs, lights, right-before-left and turning traffic.',
    excerpt: 'A five-step way to reason through German right-of-way questions in English.',
    intro: [
      'You can take the German driving theory test in English, but the traffic rules you must apply are the same German StVO rules as in any other language. Priority questions become easier when you stop guessing from the picture and check the junction in a fixed order: directions from police, working lights, priority signs, the default rule, then turning conflicts.',
      'The order matters. “Right before left” is a useful phrase, but it is not the first answer to every question. A stop sign, a priority road or a cyclist crossing your turning path can change who moves first.',
    ],
    sections: [
      { heading: 'Know the five German words behind the question', bullets: [
        'Vorfahrt: priority at a junction or intersection.',
        'Vorrang: precedence in other movement conflicts, such as passing an obstruction.',
        'Rechts vor links: the default rule that traffic from the right goes first where no higher rule applies.',
        'Vorfahrt gewähren: yield to traffic on the priority road.',
        'Abbiegen: turning; the manoeuvre brings its own duties toward oncoming and crossing traffic.'
      ], paragraphs: [
        'Even if the exam text is in English, you will see these words on driving school materials, road signs or explanations. Connect each term to a visible action rather than memorising a translation alone.'
      ] },
      { heading: 'Apply a five-step decision method', numbered: [
        'Look for an officer directing traffic. Their instructions control the movement.',
        'Look for traffic lights that are actually regulating your direction.',
        'Read each relevant priority sign and any small supplementary sign underneath it.',
        'If no higher rule controls the junction, apply the default rule from § 8 StVO.',
        'Check turning paths, oncoming traffic, cyclists and pedestrians under § 9 StVO.'
      ], paragraphs: [
        'Do not stop at step three just because you found a priority road. Two vehicles on the same road can still conflict when one turns left. Likewise, a vehicle from a side road that travels straight does not gain priority over a signed main road.'
      ] },
      { heading: 'Worked example: green light and a left turn', paragraphs: [
        'Your signal is ordinary green and you want to turn left. A vehicle opposite you is travelling straight. Both vehicles are allowed to enter the junction, but you let the oncoming vehicle pass before crossing its path. If a pedestrian then crosses the road you are entering, you may need to wait again. Green is permission to proceed under the rules, not a promise that every turning path is clear.',
        'Change one detail: a separate green arrow for your direction can indicate a protected movement. Do not assume such protection from a round green light; read the signal shown in the actual question.'
      ] },
      { heading: 'A study routine that improves reasoning', paragraphs: [
        'After each wrong answer, write the missed cue in one line: “I ignored the supplementary sign” or “I forgot the cyclist on the right.” Sort mistakes by cue, not just by question number. Revisit the same type a few days later with a different scene. If you can explain the order without reading the multiple-choice options, you understand the rule.',
        'Use drawings, real junctions and driver-view exercises together. A 3D junction is valuable because a small sign or bicycle may be visible in a different place than in a top-down theory picture.'
      ] },
      { heading: 'What an app can and cannot do', paragraphs: [
        'Fahrschule 3D: Vorfahrt üben concentrates on priority decisions through interactive junction scenes and rule explanations. It can help you transfer a rule to a new view. It does not replace the official question materials, the required instruction or the practical driving lessons. For the official exam, follow the current material and guidance supplied through your driving school.'
      ] },
    ],
    howToHeading: 'Practise priority from the driver’s view',
    howToSteps: [
      { title: 'Spot the controlling rule', text: 'Find lights, signs and the road layout before choosing a vehicle.' },
      { title: 'Say why', text: 'Explain the order aloud before you reveal the answer.' },
      { title: 'Review the error', text: 'Read the rule after the animated solution and record the cue you missed.' },
    ],
    faqs: [
      { question: 'Is the theory test available in English in Germany?', answer: 'Yes. English is among the languages permitted by Annex 7 of the Fahrerlaubnis-Verordnung for the theory test.' },
      { question: 'Does right-before-left apply at every unsigned-looking junction?', answer: 'No. Check for working lights, signs and special situations first. A sign on your approach may be easy to miss in a picture.' },
      { question: 'Does a green light mean a left turn has priority over oncoming traffic?', answer: 'Ordinary green does not remove the duty to let oncoming traffic pass when turning left. A separate arrow signal must be assessed separately.' },
    ],
    sources: [fevExam, stvo8, stvo9, stvo37], screenshotIndex: 3,
  },
  {
    slug: 'who-goes-first-german-intersection',
    lang: 'en',
    keyword: 'who goes first at German intersection',
    title: 'Who goes first at a German intersection? A driver-view guide',
    metaTitle: 'German Intersection Priority: Who Goes First?',
    metaDescription: 'Work out who goes first at a German intersection using signs, lights, right-before-left and turning movements, with realistic examples.',
    excerpt: 'A simple way to read an unfamiliar German junction from behind the wheel.',
    intro: [
      'At a German intersection, first identify what controls the junction. Police directions, working traffic lights and priority signs take precedence over the default “traffic from the right” rule. Then consider each vehicle’s intended movement: a left turn can require waiting for oncoming traffic even on a priority road.',
      'The best question is not “Which car is on the widest road?” It is “Which rule applies to this exact approach, and whose path would my vehicle cross?” Road width and driver confidence do not create priority.',
    ],
    sections: [
      { heading: 'Read the junction before reading the cars', paragraphs: [
        'Look beyond the vehicle positions. A small triangular yield sign, a red stop sign or a supplementary diagram beneath a priority-road sign may change the entire answer. At a bent priority road, the thick line on the diagram traces the priority road. A vehicle going straight out of it may still have to yield to a vehicle following it around the bend.',
        'If lights are off, read the signs that remain. If no applicable sign controls the approaches, § 8 StVO normally gives priority to traffic from the right. A field or forest track joining another road is an express exception to that default rule.'
      ] },
      { heading: 'Example one: a residential crossroads', paragraphs: [
        'You approach an unsigned crossroads in a residential area. A car approaches from your right; another waits on your left. You yield to the car on your right. Once it has passed, reassess the car on your left and your own path. Do not assume every driver will move in a fixed queue regardless of which direction each plans to turn.',
        'If all four approaches have vehicles and everyone has someone on the right, the drivers need clear communication and a safe voluntary waiver of priority to break the deadlock. Do not force your way through just because waiting feels awkward.'
      ] },
      { heading: 'Example two: a signed priority road', paragraphs: [
        'You are on a road marked with the yellow diamond priority-road sign. A car from a side road wants to go straight across. You are continuing along the priority road, so the side-road car yields. Its straight movement does not outrank the signed priority road.',
        'Now add an oncoming car on your own priority road while you want to turn left. You may need to let that oncoming car pass before completing the turn. This is why priority between roads and precedence between intersecting movements must be checked separately.'
      ] },
      { heading: 'Example three: green traffic light', paragraphs: [
        'Your light is green and you want to turn right. A cyclist travelling straight beside you reaches the junction. You must account for that cyclist’s path under the turning rules. The signal does not erase the need to observe a cycle lane or crossing. Look ahead and to the side before steering across the line of travel.',
        'If the light is out, do not treat your previous green phase as still valid. Slow down and re-evaluate any officer, signs and the default rule.'
      ] },
      { heading: 'A repeatable decision checklist', numbered: [
        'Identify the traffic controller or signal affecting your approach.',
        'Read your sign and the visible signs on other approaches.',
        'Trace the roads and intended turning paths.',
        'Apply the default right-before-left rule only where it remains relevant.',
        'Check vulnerable road users and only proceed when your full route is clear.'
      ] },
    ],
    howToHeading: 'Turn the checklist into a habit',
    howToSteps: [
      { title: 'Pause the scene', text: 'Locate every sign and road user before deciding.' },
      { title: 'Choose the order', text: 'Name the first movement and explain the controlling rule.' },
      { title: 'Watch the result', text: 'Use the animation to compare your prediction with the safe sequence.' },
    ],
    faqs: [
      { question: 'Is it always right-before-left in Germany?', answer: 'No. That is the default at many junctions, but police directions, working lights and priority signs can control the situation first.' },
      { question: 'Does the wider road have priority?', answer: 'Width alone does not establish priority. Check the applicable signs and legal rules.' },
      { question: 'What if every car has another car on its right?', answer: 'Drivers must resolve the deadlock by clear, safe communication; one can visibly waive priority. Nobody should force the first move.' },
    ],
    sources: [stvo8, stvo9, stvo37, signs], screenshotIndex: 0,
  },
  {
    slug: 'german-roundabouts-and-turning-rules',
    lang: 'en',
    keyword: 'German roundabout priority and turning rules',
    title: 'German roundabouts and turning rules for new drivers',
    metaTitle: 'German Roundabouts: Priority, Signals and Safe Exits',
    metaDescription: 'New to driving in Germany? Learn who yields at a signed roundabout, when to signal, and how to check cyclists and pedestrians on exit.',
    excerpt: 'A practical guide to entering, leaving and signalling at German roundabouts.',
    intro: [
      'At a German roundabout signed with both sign 215 (roundabout) and sign 205 (give way), traffic already circulating has priority. You wait for a safe gap before entering. Do not signal when entering this signed type of roundabout; signal before your exit and check the people whose paths your exit crosses.',
      'That familiar layout is common, but the shape of a circular island is not enough to establish its priority rule. Read the signs at your own approach every time.',
    ],
    sections: [
      { heading: 'Approach: find both signs', paragraphs: [
        'Sign 215 directs traffic around the island; sign 205 tells you to yield. German § 8 StVO specifically gives circulating traffic priority when those signs appear together. Reduce speed early, read the lane and watch approaching vehicles in the circle. Enter only when you can do so without endangering or significantly obstructing them.',
        'A driver already in the roundabout may be indicating an exit, but do not rely solely on the indicator. Confirm the vehicle’s movement and available space. A missed signal by another driver is a reason to wait, not a reason to rush.'
      ] },
      { heading: 'Entry: no indicator for this signed roundabout', paragraphs: [
        'Under § 8 paragraph 1a, indicating while entering a roundabout with signs 215 and 205 is prohibited. Continue around the island in the prescribed direction. Maintain enough distance to respond if a vehicle ahead slows for its exit or for a person crossing near it.',
        'Different junction designs can have different signs or signal controls. If there is no sign 205 beneath sign 215, do not transfer this exact rule by habit. Work from the actual traffic control.'
      ] },
      { heading: 'Exit: indicate and look across the full route', paragraphs: [
        'Before your intended exit, indicate the turn in good time without suggesting you will take an earlier exit. Check the side and the road you are entering. A cyclist moving around the circle or a pedestrian crossing near the exit may be in your path. The turning duties in § 9 StVO still matter.',
        'For example, you approach the second exit. You pass the first one without signalling. After it, you indicate your intended exit, check mirrors and the side, then leave only if the exit path is clear. At a busy location, slower and more deliberate observation is safer than trying to hold your speed.'
      ] },
      { heading: 'Common misunderstandings', bullets: [
        '“Circular road means the circulating car always wins.” Read the signs before deciding.',
        '“I should indicate right as soon as I enter.” Not for the sign 215 plus 205 arrangement.',
        '“The vehicle’s indicator proves it is leaving.” Wait for the movement to be clear.',
        '“Priority in the circle lets me exit across anyone.” Turning and crossing traffic still need attention.'
      ] },
      { heading: 'A short practice method', paragraphs: [
        'Practise each roundabout in two decisions. First: may I enter, given the signs and circulating traffic? Second: may I exit, given my intended turn and anyone crossing the exit? Treating those as separate questions stops an easy entry from becoming a careless exit. Rehearse the same two-step pattern when walking through theory pictures and when driving with an instructor.'
      ] },
    ],
    howToHeading: 'Practise the priority decision',
    howToSteps: [
      { title: 'Identify the signs', text: 'Check whether the familiar 215 and 205 combination is present.' },
      { title: 'Choose a safe entry', text: 'Allow circulating traffic to pass before entering.' },
      { title: 'Review the exit', text: 'Think through signalling and crossing road users.' },
    ],
    faqs: [
      { question: 'Who has priority in a German roundabout?', answer: 'With signs 215 and 205 together at the entrance, traffic already on the circular roadway has priority. Other layouts require their own sign check.' },
      { question: 'Should I indicate when entering?', answer: 'No. For the roundabout regulated by signs 215 and 205, indicating on entry is prohibited by § 8 paragraph 1a StVO.' },
      { question: 'When do I indicate when leaving?', answer: 'Indicate in good time before your chosen exit, without misleading others about an earlier exit, and check the full turning path.' },
      { question: 'Can cyclists or pedestrians affect my exit?', answer: 'Yes. Check the actual cycle and pedestrian routes at the exit and comply with the duties for turning traffic.' },
    ],
    sources: [stvo8, stvo9, signs2], screenshotIndex: 0,
  },
];

export const vorfahrtGuides: AppGuide[] = guides.map((guide) => ({
  ...guide,
  reviewedAt: '2026-09-30',
  ...(guide.lang === 'en' ? {
    ctaHeading: 'Practise German junction decisions in 3D',
    ctaText: 'Test who goes first from the driver’s viewpoint, then review the rule behind each decision in Fahrschule 3D: Vorfahrt üben.',
  } : {}),
}));
