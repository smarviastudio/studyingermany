import { CalendarClock, BellRing, Calculator, FileText, ScanLine, WalletMinimal } from 'lucide-react';
import type { AppContent } from './types';

export const kindergeld: AppContent = {
  slug: 'kindergeld-termine-rechner-app',
  appId: '6797101675',
  name: 'Kindergeld Termine',
  storeName: 'Kindergeld Termine & Rechner',
  subtitle: 'Auszahlungstermin & Kinderzuschlag',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/kindergeld-termine-rechner/id6797101675',
  icon: '/apps/kindergeld/icon.webp',
  accent: '#0ea5e9',
  accentDark: '#0369a1',
  heroTitle: {
    pre: 'Eine Ziffer eingeben und sofort sehen,',
    highlight: 'wann dein Kindergeld kommt',
    post: '',
  },
  heroDescription:
    'Die Familienkasse zahlt nach der letzten Ziffer deiner Kindergeldnummer aus. Gib diese eine Ziffer ein und die App zeigt dir den nächsten Auszahlungstermin mit Countdown, erinnert dich am Abend vorher und rechnet aus, ob dir zusätzlich Kinderzuschlag zusteht.',
  heroBenefits: [
    'Nächster Auszahlungstermin mit Countdown auf dem Startbildschirm',
    'Erinnerung am Abend vorher und am Auszahlungstag',
    'Komplette Termintabelle für alle Endziffern 0–9',
    'Anspruchs-Check: bekomme ich für mein Kind noch Kindergeld?',
    'Kinderzuschlag-Rechner: bis zu 297 € pro Kind zusätzlich',
    'Funktioniert komplett offline, ohne Konto und ohne Werbung',
  ],
  metaTitle: 'Kindergeld Auszahlungstermine 2026 – App mit Countdown & Rechner',
  metaDescription:
    'Wann kommt das Kindergeld? Endziffer eingeben und den nächsten Auszahlungstermin der Familienkasse sehen — mit Erinnerung, Anspruchs-Check und Kinderzuschlag-Rechner.',
  metaKeywords:
    'kindergeld auszahlungstermine, kindergeld termine 2026, wann kommt kindergeld, kindergeldnummer endziffer, familienkasse auszahlung, kinderzuschlag rechner, kindergeld app, kindergeld countdown, kindergeld anspruch',
  screenshots: [
    { src: '/apps/kindergeld/screenshot-1.webp', alt: 'Kindergeld App – nächster Auszahlungstermin mit Countdown' },
    { src: '/apps/kindergeld/screenshot-2.webp', alt: 'Kindergeld Termine – Tabelle aller Endziffern 0 bis 9' },
    { src: '/apps/kindergeld/screenshot-3.webp', alt: 'Kinderzuschlag-Rechner mit fünf Angaben' },
    { src: '/apps/kindergeld/screenshot-4.webp', alt: 'Kindergeld App – Erinnerungen vor dem Auszahlungstag' },
    { src: '/apps/kindergeld/screenshot-5.webp', alt: 'Bescheid-Erklärer für Briefe der Familienkasse' },
  ],
  audience: [
    {
      badge: 'Eltern',
      title: 'Familien, die knapp planen',
      description:
        'Wenn Miete, Kita-Beitrag und Einkauf auf den Kindergeld-Eingang warten, macht ein Tag Unterschied. Der Countdown sagt dir genau, wann das Geld auf dem Konto ist.',
      color: '#0369a1',
    },
    {
      badge: 'Neu in Deutschland',
      title: 'Zugewanderte Familien',
      description:
        'Die Endziffern-Regel der Familienkasse steht in keinem Willkommensheft. Die App erklärt das System und zeigt in verständlichem Deutsch, was ein Bescheid bedeutet.',
      color: '#7c3aed',
    },
    {
      badge: 'Mehrere Kinder',
      title: 'Eltern mit älteren Kindern',
      description:
        'Ab 18 zahlt die Familienkasse nur weiter, wenn ein Nachweis vorliegt. Die App erinnert 60 Tage vorher, statt dass die Zahlung kommentarlos ausbleibt.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: CalendarClock,
      title: 'Termin nach Endziffer',
      description:
        'Die Familienkasse überweist nach der letzten Ziffer der Kindergeldnummer. Eine Ziffer eingeben — der nächste Termin steht groß auf dem Startbildschirm, mit Countdown in Tagen.',
      color: '#0369a1',
    },
    {
      icon: BellRing,
      title: 'Erinnerung vorher',
      description:
        'Eine Nachricht am Abend vor der Auszahlung und eine am Auszahlungstag selbst. Kein Nachschauen mehr, kein tägliches Kontostand-Prüfen.',
      color: '#d97706',
    },
    {
      icon: Calculator,
      title: 'Kinderzuschlag-Rechner',
      description:
        'Bis zu 297 € pro Kind zusätzlich zum Kindergeld — eine Leistung, die viele Familien nie beantragen, weil die offizielle Prüfung so kompliziert ist. Hier reichen fünf Angaben.',
      color: '#059669',
    },
    {
      icon: ScanLine,
      title: 'Bescheid-Erklärer',
      description:
        'Brief der Familienkasse abfotografieren und in normalem Deutsch lesen, was Aufhebung, Erstattung oder Mitwirkung bedeuten — und ob du etwas tun musst.',
      color: '#be185d',
    },
    {
      icon: FileText,
      title: 'Fristen pro Kind',
      description:
        'Mehrere Kinder mit eigenen Fristen. Die App erinnert 60 Tage vor dem 18. Geburtstag und bevor ein Ausbildungsnachweis ausläuft — genau dann, wenn die Zahlung sonst stoppt.',
      color: '#7c3aed',
    },
    {
      icon: WalletMinimal,
      title: 'Zahlungsverlauf',
      description:
        'Erfasse, was tatsächlich angekommen ist, und sieh sofort, wenn eine Überweisung fehlt — bevor Wochen vergehen und die Rückfrage schwierig wird.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Endziffer eingeben', description: 'Die letzte Ziffer deiner Kindergeldnummer steht auf jedem Bescheid der Familienkasse.' },
    { title: 'Termin sehen', description: 'Der nächste Auszahlungstag erscheint sofort, mit Countdown und der Tabelle für alle Endziffern.' },
    { title: 'Erinnerung einschalten', description: 'Am Abend vorher und am Auszahlungstag — damit du nicht selbst nachrechnen musst.' },
    { title: 'Anspruch prüfen', description: 'Anspruchs-Check und Kinderzuschlag-Rechner zeigen, ob dir mehr zusteht als du bekommst.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Auszahlungstermine, Countdown, Erinnerungen, die komplette Endziffern-Tabelle und der Anspruchs-Check sind dauerhaft kostenlos.',
  pricingPro: {
    name: 'Kindergeld Plus',
    bullets: [
      'Mehrere Kinder mit eigenen Fristen und Vorwarnung',
      'Kinderzuschlag-Rechner mit fünf Angaben',
      'Bescheid-Erklärer und Antrag-Helfer',
      'Zahlungsverlauf und Übersicht zu Elterngeld & Co.',
    ],
    note: 'Einmalzahlung, kein Abo',
  },
  guides: [
    {
      slug: 'kindergeld-auszahlungstermine',
      lang: 'de',
      keyword: 'kindergeld auszahlungstermine',
      title: 'Kindergeld Auszahlungstermine: Wann die Familienkasse überweist',
      metaTitle: 'Kindergeld Auszahlungstermine – wann kommt das Geld?',
      metaDescription:
        'Die Familienkasse zahlt nach der Endziffer der Kindergeldnummer aus. So findest du deine Ziffer, so liest du die Tabelle, und das passiert an Feiertagen.',
      excerpt: 'Warum manche Familien am 2. und andere am 20. Geld bekommen — und wie du deinen eigenen Termin findest.',
      intro: [
        'Kindergeld kommt nicht bei allen am selben Tag. Die Familienkasse verteilt die Auszahlungen über den Monat und richtet sich dabei nach der letzten Ziffer deiner Kindergeldnummer. Wer eine 0 am Ende hat, bekommt früh im Monat Geld; wer eine 9 hat, wartet bis gegen Ende.',
        'Das ist keine Willkür, sondern Verwaltungslogik: Millionen Überweisungen lassen sich nicht an einem einzigen Tag ausführen. Für dich heißt es nur eines — du musst deine Ziffer kennen, dann ist der Termin jeden Monat vorhersehbar.',
      ],
      sections: [
        {
          heading: 'Wo du deine Endziffer findest',
          bullets: [
            'Auf jedem Bescheid der Familienkasse, oben im Briefkopf bei der Kindergeldnummer.',
            'Im Betreff älterer Schreiben, meist im Format „Kindergeld-Nr.: FK 123456789".',
            'Auf dem Kontoauszug im Verwendungszweck der letzten Überweisung.',
            'Entscheidend ist wirklich nur die allerletzte Ziffer — der Rest der Nummer spielt für den Termin keine Rolle.',
          ],
        },
        {
          heading: 'So verteilt sich der Monat',
          paragraphs: [
            'Niedrige Endziffern werden am Monatsanfang bedient, hohe gegen Monatsende. Die genauen Tage legt die Bundesagentur für Arbeit jedes Jahr neu fest und veröffentlicht sie im Voraus, meist im Herbst für das Folgejahr.',
            'Die Termine verschieben sich innerhalb eines Jahres leicht, weil Wochenenden und Feiertage berücksichtigt werden. Deshalb lohnt es sich nicht, sich einen festen Kalendertag zu merken — die Ziffer bleibt gleich, der Tag nicht.',
          ],
        },
        {
          heading: 'Was an Feiertagen und Wochenenden passiert',
          bullets: [
            'Fällt der Termin auf ein Wochenende oder einen Feiertag, wird in der Regel vorgezogen, nicht verschoben.',
            'Die Wertstellung auf deinem Konto kann trotzdem einen Bankarbeitstag später sein — besonders bei Banken ohne Wochenendbuchung.',
            'Zwischen Weihnachten und Neujahr sind die Termine am unregelmäßigsten; hier hilft nur die aktuelle Tabelle.',
          ],
        },
        {
          heading: 'Wenn das Geld nicht kommt',
          numbered: [
            'Erst zwei bis drei Bankarbeitstage abwarten — Buchungslauf und Wertstellung sind nicht dasselbe.',
            'Prüfen, ob ein Schreiben der Familienkasse offen ist: Ein fehlender Nachweis stoppt die Zahlung ohne weitere Ankündigung.',
            'Bei Kindern über 18 prüfen, ob der Ausbildungs- oder Studiennachweis noch gültig ist.',
            'Kontowechsel gemeldet? Ohne aktualisierte IBAN läuft die Überweisung ins Leere und kommt zurück.',
            'Erst danach bei der Familienkasse nachfragen — mit Kindergeldnummer, sonst dauert es doppelt so lange.',
          ],
        },
      ],
      howToHeading: 'Deinen Termin in der App einrichten',
      howToSteps: [
        { title: 'Endziffer eintragen', text: 'Die letzte Ziffer deiner Kindergeldnummer genügt — mehr fragt die App nicht ab.' },
        { title: 'Countdown ansehen', text: 'Der nächste Auszahlungstag steht groß auf dem Startbildschirm, mit den verbleibenden Tagen.' },
        { title: 'Erinnerungen aktivieren', text: 'Eine am Abend vorher, eine am Auszahlungstag. Beides lässt sich einzeln abschalten.' },
        { title: 'Tabelle teilen', text: 'Die komplette Übersicht aller Endziffern lässt sich Familie und Freunden zeigen, ohne dass sie die App brauchen.' },
      ],
      faqs: [
        {
          question: 'Bekomme ich das Kindergeld immer am selben Tag im Monat?',
          answer:
            'Die Endziffer bleibt gleich, der Kalendertag verschiebt sich leicht, weil Wochenenden und Feiertage berücksichtigt werden. Die App lädt die aktuellen Termine der Bundesagentur für Arbeit automatisch nach.',
        },
        {
          question: 'Ändert sich meine Endziffer, wenn ich umziehe?',
          answer:
            'Ein Umzug innerhalb Deutschlands ändert die Kindergeldnummer normalerweise nicht. Wechselt die zuständige Familienkasse und du bekommst eine neue Nummer, prüfe die letzte Ziffer auf dem neuen Bescheid.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'kinderzuschlag-beantragen',
      lang: 'de',
      keyword: 'kinderzuschlag beantragen',
      title: 'Kinderzuschlag: bis zu 297 € pro Kind, die viele nie beantragen',
      metaTitle: 'Kinderzuschlag beantragen – wer Anspruch hat und wie es geht',
      metaDescription:
        'Der Kinderzuschlag ist die am seltensten beantragte Familienleistung in Deutschland. Wer Anspruch hat, welche Grenzen gelten und wie der Antrag läuft.',
      excerpt: 'Die Leistung, die an der Antragshürde scheitert — und die fünf Angaben, die zeigen ob sie dir zusteht.',
      intro: [
        'Der Kinderzuschlag ist zusätzliches Geld für Familien, die zwar ihren eigenen Bedarf mit dem Einkommen decken, aber nicht den ihrer Kinder. Er wird zusätzlich zum Kindergeld gezahlt und kann pro Kind einen dreistelligen Betrag im Monat ausmachen.',
        'Trotzdem holen ihn viele berechtigte Familien nie ab. Der Grund ist selten Unwissen über die Existenz der Leistung, sondern die Prüfung: Die offizielle Berechnung verlangt Zahlen, die man erst zusammensuchen muss, und viele brechen genau dort ab.',
      ],
      sections: [
        {
          heading: 'Wer grundsätzlich in Frage kommt',
          bullets: [
            'Du beziehst für das Kind Kindergeld und das Kind lebt in deinem Haushalt.',
            'Das Kind ist unter 25 und unverheiratet.',
            'Dein Bruttoeinkommen liegt über einer Mindestgrenze — Kinderzuschlag ist für Erwerbstätige gedacht, nicht als Ersatz für Bürgergeld.',
            'Das Einkommen der Familie reicht für euch als Eltern, aber nicht für den gesamten Familienbedarf.',
            'Mit dem Kinderzuschlag entfällt die Hilfebedürftigkeit — sonst führt der Weg über das Bürgergeld.',
          ],
        },
        {
          heading: 'Was oft übersehen wird',
          paragraphs: [
            'Wohnkosten zählen mit. Zwei Familien mit demselben Gehalt können unterschiedlich anspruchsberechtigt sein, weil die eine in München und die andere in Chemnitz wohnt. Wer die Miete nicht mit angibt, rechnet sich den Anspruch weg.',
            'Auch das Vermögen wird geprüft, allerdings mit Freibeträgen. Ein normales Girokonto und ein Auto stehen dem Anspruch in der Regel nicht im Weg.',
            'Der Kinderzuschlag öffnet zusätzlich die Tür zum Bildungs- und Teilhabepaket — Schulbedarf, Mittagessen, Vereinsbeiträge. Dieser Nebeneffekt ist oft mehr wert als der Zuschlag selbst.',
          ],
        },
        {
          heading: 'Der Antrag Schritt für Schritt',
          numbered: [
            'Vorab überschlägig prüfen, ob ein Anspruch überhaupt plausibel ist — das erspart den Papierkram im aussichtslosen Fall.',
            'Einkommensnachweise der letzten sechs Monate zusammenlegen, für beide Elternteile.',
            'Mietvertrag oder Nebenkostenabrechnung bereithalten — die Wohnkosten sind ein Kernwert der Berechnung.',
            'Antrag online bei der Familienkasse stellen; der Kindergeldbezug ist dabei Voraussetzung, kein zweiter Antrag.',
            'Bewilligung gilt in der Regel für sechs Monate, danach neu beantragen — auch wenn sich nichts geändert hat.',
          ],
        },
      ],
      howToHeading: 'Anspruch in der App überschlagen',
      howToSteps: [
        { title: 'Fünf Angaben eintragen', text: 'Einkommen, Wohnkosten, Kinderzahl und Alter genügen für eine erste Einschätzung.' },
        { title: 'Ergebnis lesen', text: 'Die App zeigt, ob ein Anspruch plausibel ist — als Orientierung, nicht als Bescheid.' },
        { title: 'Unterlagen sammeln', text: 'Der Antrag-Helfer listet auf, welches Formblatt und welche Nachweise du brauchst.' },
        { title: 'Frist im Blick behalten', text: 'Die Bewilligung läuft nach sechs Monaten aus; die App erinnert vor dem Ablauf.' },
      ],
      faqs: [
        {
          question: 'Ist der Rechner in der App verbindlich?',
          answer:
            'Nein. Er gibt eine Orientierung, ob sich ein Antrag lohnt. Verbindlich entscheidet allein die Familienkasse auf Basis deiner vollständigen Unterlagen.',
        },
        {
          question: 'Verliere ich Kindergeld, wenn ich Kinderzuschlag beantrage?',
          answer:
            'Nein. Der Kinderzuschlag kommt zusätzlich zum Kindergeld und ersetzt es nicht.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'kindergeld-ab-18-nachweis',
      lang: 'de',
      keyword: 'kindergeld ab 18',
      title: 'Kindergeld ab 18: warum die Zahlung plötzlich stoppt',
      metaTitle: 'Kindergeld ab 18 – Nachweis, Fristen und was die Zahlung stoppt',
      metaDescription:
        'Mit dem 18. Geburtstag endet der automatische Kindergeldanspruch. Welche Nachweise die Familienkasse braucht und wann du sie einreichen musst.',
      excerpt: 'Ab 18 zahlt niemand mehr automatisch. Was die Familienkasse braucht und wann.',
      intro: [
        'Bis zum 18. Geburtstag läuft Kindergeld ohne Zutun. Danach kehrt sich die Logik um: Die Familienkasse zahlt nur weiter, wenn du nachweist, dass das Kind sich in Ausbildung, Studium, einem Freiwilligendienst oder einer Übergangsphase befindet.',
        'Der häufigste Fehler ist nicht, den Nachweis nicht zu haben, sondern ihn zu spät zu schicken. Die Zahlung stoppt zum Monatsende des Geburtstags — ohne Mahnung, ohne Vorwarnung, ohne Anruf.',
      ],
      sections: [
        {
          heading: 'Gründe, die den Anspruch verlängern',
          bullets: [
            'Schulbesuch, Studium oder betriebliche Ausbildung — bis maximal zum 25. Geburtstag.',
            'Übergangszeit zwischen zwei Ausbildungsabschnitten, längstens vier Monate.',
            'Ein Freiwilligendienst wie FSJ, FÖJ oder Bundesfreiwilligendienst.',
            'Kein Ausbildungsplatz trotz nachweislicher Bemühung — die Bewerbungen müssen belegbar sein.',
            'Arbeitslos gemeldet und unter 21, wenn keine Beschäftigung gefunden wurde.',
          ],
        },
        {
          heading: 'Welche Nachweise akzeptiert werden',
          bullets: [
            'Immatrikulationsbescheinigung der Hochschule, jedes Semester neu.',
            'Ausbildungsvertrag oder eine Bescheinigung des Ausbildungsbetriebs.',
            'Schulbescheinigung mit dem voraussichtlichen Abschlussdatum.',
            'Vertrag oder Bestätigung der Einsatzstelle beim Freiwilligendienst.',
            'Bei Bewerbungsphasen: die Bewerbungen selbst, gesammelt und datiert.',
          ],
        },
        {
          heading: 'Der Zeitplan, der Ärger erspart',
          paragraphs: [
            'Sinnvoll ist es, zwei Monate vor dem 18. Geburtstag anzufangen — nicht danach. Zu diesem Zeitpunkt steht in den meisten Fällen fest, was das Kind ab Sommer macht, und der Nachweis lässt sich beschaffen, bevor die Zahlung stoppt.',
            'Dasselbe gilt für jedes auslaufende Semester und jeden befristeten Ausbildungsnachweis. Ein Kalendereintrag pro Kind reicht — die Familienkasse erinnert nicht von sich aus.',
            'Wurde die Zahlung schon eingestellt, wird bei nachgereichtem Nachweis in der Regel rückwirkend gezahlt. Das kostet allerdings Wochen, in denen das Geld fehlt.',
          ],
        },
      ],
      howToHeading: 'Fristen pro Kind in der App hinterlegen',
      howToSteps: [
        { title: 'Kind anlegen', text: 'Geburtsdatum eintragen — daraus berechnet die App die 18-Jahres-Frist automatisch.' },
        { title: 'Vorwarnung erhalten', text: 'Eine Erinnerung 60 Tage vor dem Geburtstag, solange noch Zeit zum Beschaffen ist.' },
        { title: 'Nachweis-Ablauf eintragen', text: 'Immatrikulation oder Ausbildungsvertrag mit Enddatum hinterlegen, damit die nächste Frist nicht überrascht.' },
        { title: 'Zahlungen abhaken', text: 'Im Zahlungsverlauf siehst du sofort, wenn eine Überweisung ausgeblieben ist.' },
      ],
      faqs: [
        {
          question: 'Bekomme ich Kindergeld rückwirkend, wenn ich den Nachweis zu spät schicke?',
          answer:
            'In der Regel ja — die Familienkasse zahlt nach Prüfung nach. Bis das Geld ankommt, vergehen aber meist mehrere Wochen.',
        },
        {
          question: 'Zählt ein Nebenjob des Kindes gegen den Anspruch?',
          answer:
            'Bei einer Erstausbildung spielt das Einkommen des Kindes keine Rolle. Nach einer abgeschlossenen Erstausbildung kann eine zu umfangreiche Erwerbstätigkeit den Anspruch beenden.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'Wann wird mein Kindergeld ausgezahlt?',
      answer:
        'Die Familienkasse zahlt nach der letzten Ziffer deiner Kindergeldnummer aus: niedrige Ziffern früh im Monat, hohe gegen Monatsende. Gib die Ziffer in der App ein und du siehst den nächsten Termin mit Countdown.',
      learnMoreSlug: 'kindergeld-auszahlungstermine',
    },
    {
      question: 'Woher kommen die Termine in der App?',
      answer:
        'Von der Bundesagentur für Arbeit. Neue Termine lädt die App automatisch nach, sobald sie veröffentlicht werden — ein App-Update ist dafür nicht nötig.',
      learnMoreSlug: 'kindergeld-auszahlungstermine',
    },
    {
      question: 'Was ist der Kinderzuschlag?',
      answer:
        'Eine Zusatzleistung von bis zu 297 € pro Kind für Familien, deren Einkommen für sie selbst reicht, aber nicht für den Bedarf der Kinder. Der Rechner in der App schätzt mit fünf Angaben ab, ob sich ein Antrag lohnt.',
      learnMoreSlug: 'kinderzuschlag-beantragen',
    },
    {
      question: 'Warum ist mein Kindergeld plötzlich ausgeblieben?',
      answer:
        'Der häufigste Grund bei Kindern über 18 ist ein fehlender Ausbildungs- oder Studiennachweis. Die App erinnert 60 Tage vor dem 18. Geburtstag und vor dem Ablauf hinterlegter Nachweise.',
      learnMoreSlug: 'kindergeld-ab-18-nachweis',
    },
    {
      question: 'Brauche ich ein Konto oder eine Anmeldung?',
      answer:
        'Nein. Die App funktioniert komplett offline. Kein Datum und kein Foto verlässt dein Gerät — auch der Bescheid-Erklärer arbeitet direkt auf dem iPhone.',
    },
    {
      question: 'Ist die App mit der Familienkasse verbunden?',
      answer:
        'Nein. Sie ist ein privates Angebot und steht in keiner Verbindung zur Bundesagentur für Arbeit oder zur Familienkasse. Sie ersetzt keine Rechts- oder Sozialberatung, und die Termine begründen keinen Rechtsanspruch auf Zahlung an einem bestimmten Tag.',
    },
  ],
  ctaHeading: 'Nie wieder rätseln, wann das Kindergeld kommt',
  ctaText:
    'Eine Ziffer eingeben, Termin sehen, erinnert werden. Kostenlos laden — ohne Konto, ohne Werbung, komplett offline.',
  category: 'FinanceApplication',
  downloadNote: 'Kostenlos laden • Optionale Einmalzahlung',
};
