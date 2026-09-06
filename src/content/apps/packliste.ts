import { ListChecks, Users, Sparkles, BellRing, ShieldCheck, Copy } from 'lucide-react';
import type { AppContent } from './types';

export const packliste: AppContent = {
  slug: 'packliste-app-reisen',
  appId: '6795642073',
  name: 'Packliste',
  storeName: 'Packliste für Reisen & Urlaub',
  subtitle: 'Automatisch erstellt, gemeinsam gepackt',
  lang: 'de',
  appStoreUrl: 'https://apps.apple.com/de/app/packliste-f%C3%BCr-reisen-urlaub/id6795642073',
  icon: '/apps/packliste/icon.webp',
  accent: '#f97316',
  accentDark: '#c2410c',
  heroTitle: {
    pre: 'Ein paar Fragen zur Reise und du hast',
    highlight: 'eine fertige Packliste',
    post: 'mit den richtigen Mengen',
  },
  heroDescription:
    'Ziel, Dauer, Wetter, wer mitkommt — daraus erstellt Packliste in Sekunden eine vollständige Liste. Nicht „Socken", sondern 16 Paar für 7 Nächte zu zweit. Und wenn ihr zu mehreren packt, sieht jeder sofort, was der andere schon erledigt hat.',
  heroBenefits: [
    'Mengen automatisch aus Reisedauer und Personenzahl berechnet',
    '8 Reisearten: Strand, Städtereise, Wandern, Business, Ski, Camping, Roadtrip, Festival',
    'Gemeinsam packen per Code — ohne Konto für die anderen',
    'Pass, Karte und Medikamente werden markiert und nie ausgeblendet',
    'Erinnerung abends vor der Abreise, wenn du noch etwas tun kannst',
    'Ohne Anmeldung, ohne Werbung, ohne Tracking',
  ],
  metaTitle: 'Packliste App: Urlaubs-Packliste automatisch erstellen',
  metaDescription:
    'Packliste erstellt aus Ziel, Dauer und Wetter automatisch eine vollständige Urlaubs-Packliste mit den richtigen Mengen — und ihr packt gemeinsam auf allen Geräten.',
  metaKeywords:
    'packliste app, packliste urlaub, packliste erstellen, urlaub checkliste, packliste strandurlaub, packliste wandern, reise checkliste app, packliste familie, packliste handgepäck',
  screenshots: [
    { src: '/apps/packliste/screenshot-1.webp', alt: 'Packliste App – automatisch erstellte Liste für eine Reise' },
    { src: '/apps/packliste/screenshot-2.webp', alt: 'Packliste – Reisearten Strand, Städtereise, Wandern, Ski' },
    { src: '/apps/packliste/screenshot-3.webp', alt: 'Packliste gemeinsam packen mit Partner und Familie' },
    { src: '/apps/packliste/screenshot-4.webp', alt: 'Packliste – Mengen nach Reisedauer und Personenzahl' },
    { src: '/apps/packliste/screenshot-5.webp', alt: 'Packliste – Erinnerung vor der Abreise' },
  ],
  audience: [
    {
      badge: 'Familien',
      title: 'Familien mit Kindern',
      description:
        'Für vier Personen zu packen heißt vier Listen im Kopf zu führen. Hier bekommt jeder seinen eigenen Stapel, und Windeln oder Schwimmflügel ergänzt die App von selbst.',
      color: '#c2410c',
    },
    {
      badge: 'Paare',
      title: 'Paare, die zusammen packen',
      description:
        'Eine Liste auf beiden Handys. Was dein Partner eingepackt hat, siehst du sofort — statt „Hast du die Ladekabel?" per WhatsApp.',
      color: '#be185d',
    },
    {
      badge: 'Vielreisende',
      title: 'Wer oft dieselbe Reise macht',
      description:
        'Vorlagen und Duplikate: Die Wochenend-Liste, die Business-Trip-Liste, die Skiwoche — einmal aufgebaut, danach in zehn Sekunden wieder da.',
      color: '#0369a1',
    },
  ],
  features: [
    {
      icon: Sparkles,
      title: 'Liste in Sekunden',
      description:
        'Beantworte ein paar Fragen zu Ziel, Dauer, Wetter und Mitreisenden — die vollständige Liste steht danach da, inklusive der Dinge, an die man erst am Flughafen denkt.',
      color: '#c2410c',
    },
    {
      icon: ListChecks,
      title: 'Richtige Mengen',
      description:
        'Die App rechnet Stückzahlen aus Reisedauer und Personenzahl. 7 Nächte zu zweit sind 16 Paar Socken — eine Liste ohne Mengen ist nur eine halbe Liste.',
      color: '#059669',
    },
    {
      icon: Users,
      title: 'Gemeinsam packen',
      description:
        'Teile die Liste per Code mit Partner, Familie oder Freunden. Jede Änderung erscheint auf allen Geräten, und wer beitritt, braucht kein Konto und zahlt nichts.',
      color: '#7c3aed',
    },
    {
      icon: ShieldCheck,
      title: 'Wichtiges zuerst',
      description:
        'Pass, Ausweis, Karte und Medikamente werden markiert und nie ausgeblendet. Ein Blick genügt, um zu sehen, ob das Reise-Entscheidende schon im Koffer liegt.',
      color: '#0369a1',
    },
    {
      icon: BellRing,
      title: 'Rechtzeitig erinnert',
      description:
        'Eine Erinnerung 1 Tag bis 1 Woche vor Abreise — abends um 18 Uhr, wenn du zu Hause bist und noch etwas besorgen kannst.',
      color: '#d97706',
    },
    {
      icon: Copy,
      title: 'Vorlagen & Duplikate',
      description:
        'Reisen, die du öfter machst, speicherst du als Vorlage. Die Liste als Text teilen geht auch — für WhatsApp oder die Notizen-App.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Reise beschreiben', description: 'Ziel, Dauer, Reiseart, Wetter und wer mitkommt — mehr braucht die App nicht.' },
    { title: 'Liste bekommen', description: 'Vollständige Packliste mit Mengen, Kategorien und markierten Reisedokumenten.' },
    { title: 'Liste teilen', description: 'Ein Code verbindet die Handys der Mitreisenden. Jeder hakt ab, alle sehen den Stand.' },
    { title: 'Abhaken und los', description: 'Die Erinnerung kommt am Abend vor der Abreise, solange du noch reagieren kannst.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'Eine Reise mit dem vollen Funktionsumfang der Listenerstellung ist kostenlos — inklusive Mengenberechnung, Reisearten und Erinnerung.',
  pricingPro: {
    name: 'Packliste Pro',
    bullets: [
      'Unbegrenzt viele Reisen gleichzeitig',
      'Gemeinsam packen mit Familie und Freunden',
      'Packen nach Person mit eigenen Stapeln',
      'Vorlagen, Duplikate und Liste als Text teilen',
    ],
    note: 'Einmalig zahlen, kein Abo',
  },
  guides: [
    {
      slug: 'packliste-urlaub-erstellen',
      lang: 'de',
      keyword: 'packliste urlaub',
      title: 'Packliste für den Urlaub: was wirklich hineingehört',
      metaTitle: 'Packliste Urlaub – vollständige Liste nach Reiseart',
      metaDescription:
        'Die Grundausstattung für jede Reise, die Ergänzungen nach Reiseart und die Mengenformel, die verhindert dass du zu viel oder zu wenig einpackst.',
      excerpt: 'Die Grundliste, die Ergänzungen je Reiseart und die Mengenformel dahinter.',
      intro: [
        'Fast jede Packliste im Internet hat dasselbe Problem: Sie zählt Gegenstände auf, aber keine Mengen. „Socken" hilft nicht, wenn die Frage ist, ob sechs oder sechzehn Paar in den Koffer sollen. Und sie ignoriert, dass eine Skiwoche und ein Städtetrip fast nichts gemeinsam haben außer Ladekabel und Zahnbürste.',
        'Eine brauchbare Liste hat drei Ebenen: was immer mitmuss, was die Reiseart verlangt, und wie viel davon bei eurer Dauer und Personenzahl.',
      ],
      sections: [
        {
          heading: 'Ebene 1: was auf jeder Reise dabei ist',
          bullets: [
            'Reisedokumente: Ausweis oder Pass, Führerschein, Buchungsbestätigungen, Versicherungskarte.',
            'Zahlungsmittel: eine Karte, eine Zweitkarte an anderer Stelle, etwas Bargeld in Landeswährung.',
            'Medikamente in Originalverpackung, plus die Dauermedikation für die gesamte Reise und ein paar Tage Puffer.',
            'Technik: Handy, Ladekabel, Adapter für das Zielland, Powerbank ins Handgepäck.',
            'Hygiene-Grundausstattung in erlaubten Größen, wenn es Handgepäck ist.',
          ],
        },
        {
          heading: 'Ebene 2: was die Reiseart bestimmt',
          bullets: [
            'Strand: Badesachen doppelt, Sonnenschutz mit hohem Faktor, Kopfbedeckung, Strandtasche, After-Sun.',
            'Städtereise: eingelaufene Schuhe, Tagesrucksack, Regenschicht, ein besseres Outfit fürs Abendessen.',
            'Wandern: Schichten statt einer dicken Jacke, Blasenpflaster, Trinkflasche, Stirnlampe, Karte offline.',
            'Business: knitterarme Kleidung, Ersatzhemd im Handgepäck, Laptop plus Ladegerät, Visitenkarten.',
            'Ski, Camping, Roadtrip und Festival haben jeweils eigene Pflichtteile — vom Schlafsack bis zum Ohrstöpsel.',
          ],
        },
        {
          heading: 'Ebene 3: die Mengenformel',
          paragraphs: [
            'Wäsche skaliert mit Nächten und Personen, aber nicht linear: Ab etwa zehn Tagen lohnt sich Waschen unterwegs mehr als der zweite Koffer. Bis dahin gilt grob ein Satz Unterwäsche und Socken pro Tag plus zwei Reserve.',
            'Oberbekleidung skaliert schwächer — Hosen und Pullover werden mehrfach getragen. Wer hier dieselbe Zahl wie bei Socken einplant, schleppt Gewicht spazieren.',
            'Alles Flüssige richtet sich nach Regeln, nicht nach Bedarf: 100 ml pro Behälter im Handgepäck, ein durchsichtiger Beutel, ein Liter gesamt.',
          ],
        },
        {
          heading: 'Was zuverlässig vergessen wird',
          bullets: [
            'Das Ladekabel, das zu Hause in der Steckdose bleibt, weil es beim Packen noch in Benutzung ist.',
            'Der Reiseadapter für Länder mit anderem Stecksystem — inklusive Großbritannien und der Schweiz.',
            'Ersatzbrille oder Kontaktlinsenflüssigkeit in ausreichender Menge.',
            'Ein Ausdruck oder Offline-Screenshot der Buchung, falls das Handy leer oder ohne Netz ist.',
          ],
        },
      ],
      howToHeading: 'Eine Liste in der App erstellen',
      howToSteps: [
        { title: 'Reise anlegen', text: 'Ziel, Reisedaten und Reiseart auswählen — daraus entsteht die Grundstruktur.' },
        { title: 'Mitreisende eintragen', text: 'Personenzahl und Alter bestimmen die Mengen und ergänzen Kinder- oder Babyartikel.' },
        { title: 'Liste durchgehen', text: 'Streichen, was du nicht brauchst, eigene Einträge mit Menge und Kategorie ergänzen.' },
        { title: 'Erinnerung setzen', text: 'Ein bis sieben Tage vor Abreise, damit Fehlendes noch besorgt werden kann.' },
      ],
      faqs: [
        {
          question: 'Kann ich eigene Sachen zur Liste hinzufügen?',
          answer: 'Ja — mit Menge und Kategorie, damit sie sich in die automatisch erzeugte Struktur einfügen.',
        },
        {
          question: 'Funktioniert die Liste auch offline?',
          answer: 'Ja. Deine Listen liegen auf dem iPhone; übertragen wird nur, was du selbst zum gemeinsamen Packen freigibst.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'packliste-familie-gemeinsam',
      lang: 'de',
      keyword: 'packliste familie',
      title: 'Zu mehreren packen, ohne dass etwas doppelt oder gar nicht mitkommt',
      metaTitle: 'Packliste für Familien – gemeinsam packen ohne Chaos',
      metaDescription:
        'Wenn zwei Erwachsene dieselbe Liste im Kopf haben, fehlt am Ende trotzdem etwas. Wie ihr Zuständigkeiten aufteilt und den Stand sichtbar macht.',
      excerpt: 'Warum zwei Listen im Kopf schlechter sind als eine geteilte — und wie ihr aufteilt.',
      intro: [
        'Der klassische Fehler beim Packen zu zweit ist nicht Vergesslichkeit, sondern doppelte Annahme: Beide denken, der andere hat die Reiseapotheke eingepackt. Oder beide packen sie ein, und der Föhn fehlt.',
        'Das Problem ist die fehlende gemeinsame Sicht. Sobald sichtbar ist, wer was schon erledigt hat, verschwindet der größte Teil der Rückfragen von selbst.',
      ],
      sections: [
        {
          heading: 'Zuständigkeiten, die sich bewährt haben',
          bullets: [
            'Eine Person übernimmt alle Dokumente und Zahlungsmittel — das ist der Bereich, in dem Doppelarbeit am teuersten ist.',
            'Kinder-Sachen packt, wer sie täglich benutzt; wer sie nicht anzieht, vergisst die Zwischengröße.',
            'Technik und Ladekabel bündeln statt verteilen: ein Beutel, eine verantwortliche Person.',
            'Gemeinsame Dinge wie Reiseapotheke, Sonnencreme und Adapter explizit zuweisen, statt sie als „packt schon jemand" zu behandeln.',
          ],
        },
        {
          heading: 'Packen nach Person statt nach Kategorie',
          paragraphs: [
            'Sobald mehr als zwei Menschen reisen, ist die Kategorie-Ansicht („alle Oberteile") unbrauchbar. Wichtiger ist, ob Kind 1 vollständig gepackt ist.',
            'Deshalb lohnt es sich, jede Position einer Person zuzuordnen und die Liste danach zu gruppieren. Jeder sieht seinen eigenen Stapel und kann ihn abschließen, ohne die ganze Liste zu lesen.',
          ],
        },
        {
          heading: 'Der Abend vor der Abreise',
          numbered: [
            'Erst die markierten Reisedokumente prüfen — sie sind das Einzige, was sich am Zielort nicht ersetzen lässt.',
            'Dann pro Person durchgehen, nicht pro Kategorie.',
            'Handgepäck getrennt kontrollieren: Medikamente, Ladekabel, Wechselwäsche, Dokumente.',
            'Zuletzt die Dinge einsammeln, die bis zur letzten Minute in Benutzung sind — Ladekabel, Kulturbeutel, Brille.',
          ],
        },
      ],
      howToHeading: 'Gemeinsames Packen einrichten',
      howToSteps: [
        { title: 'Liste teilen', text: 'Ein Code verbindet die Handys. Wer beitritt, braucht weder Konto noch Kauf.' },
        { title: 'Personen anlegen', text: 'Jede Position einer Person zuordnen und die Liste danach gruppieren.' },
        { title: 'Live mitverfolgen', text: 'Abgehakte Dinge erscheinen sofort bei allen — Rückfragen erübrigen sich.' },
        { title: 'Für andere eintragen', text: 'Du kannst Sachen auch für Mitreisende ergänzen, wenn dir etwas auffällt.' },
      ],
      faqs: [
        {
          question: 'Muss mein Partner die App kaufen?',
          answer: 'Nein. Wer einer geteilten Liste beitritt, braucht kein Konto und zahlt nichts.',
        },
        {
          question: 'Was passiert mit der Liste, wenn ich das Teilen beende?',
          answer: 'Die geteilte Kopie wird vom Server gelöscht. Deine eigene Liste bleibt auf deinem iPhone.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'handgepaeck-packen-regeln',
      lang: 'de',
      keyword: 'handgepäck packliste',
      title: 'Handgepäck packen: die Regeln und was wirklich hineingehört',
      metaTitle: 'Handgepäck Packliste – Regeln, Flüssigkeiten und Aufteilung',
      metaDescription:
        'Was ins Handgepäck darf, was hineingehört auch wenn der Koffer aufgegeben wird, und wie du die 100-ml-Regel ohne Diskussion am Schalter übersteht.',
      excerpt: 'Die 100-ml-Regel, die Aufteilung zwischen Koffer und Kabine, und was am Gate teuer wird.',
      intro: [
        'Handgepäck ist kein kleinerer Koffer, sondern eine andere Kategorie: Es ist das, was du bei dir hast, wenn der aufgegebene Koffer nicht ankommt. Das ändert die Frage von „was passt hinein" zu „was darf auf keinen Fall unten liegen".',
        'Dazu kommen Regeln, die zwar seit Jahren gelten, aber jedes Jahr wieder jemanden am Sicherheitscheck kosten.',
      ],
      sections: [
        {
          heading: 'Die Flüssigkeitsregel in der Praxis',
          bullets: [
            'Maximal 100 ml pro Behälter — entscheidend ist die aufgedruckte Größe, nicht der Inhalt. Eine halbvolle 200-ml-Flasche wird aussortiert.',
            'Alle Behälter zusammen in einen durchsichtigen, wiederverschließbaren Beutel von etwa einem Liter.',
            'Ein Beutel pro Person, beim Check separat aufs Band.',
            'Als flüssig gelten auch Cremes, Gels, Zahnpasta, Deo-Roller und Joghurt.',
            'Medikamente und Babynahrung sind ausgenommen, sollten aber angemeldet und belegbar sein.',
          ],
        },
        {
          heading: 'Was immer ins Handgepäck gehört',
          bullets: [
            'Alle Reisedokumente und Zahlungsmittel.',
            'Dauermedikation für mindestens zwei Tage, in Originalverpackung.',
            'Powerbank und Ersatz-Akkus — im aufgegebenen Gepäck sind sie verboten.',
            'Ein kompletter Satz Wechselwäsche, falls der Koffer einen Umweg fliegt.',
            'Wertsachen, Laptop, Kamera, Schlüssel.',
          ],
        },
        {
          heading: 'Wo es am Gate teuer wird',
          paragraphs: [
            'Die meisten Zusatzkosten entstehen nicht durch verbotene Gegenstände, sondern durch Maße und Gewicht. Billigflieger messen inzwischen konsequent, und die Nachzahlung am Gate ist regelmäßig teurer als das aufgegebene Gepäck im Voraus.',
            'Wenn ihr zu zweit reist, ist es fast immer günstiger, ein Gepäckstück aufzugeben und zwei kleine Handgepäckstücke mitzunehmen, als zweimal am Gate nachzuzahlen.',
          ],
        },
      ],
      howToHeading: 'Handgepäck in der App abbilden',
      howToSteps: [
        { title: 'Transportmittel angeben', text: 'Die App berücksichtigt Handgepäck-Regeln, sobald du Flug als Transportmittel wählst.' },
        { title: 'Wichtiges markiert lassen', text: 'Dokumente, Karten und Medikamente bleiben immer sichtbar und werden nicht weggefiltert.' },
        { title: 'Zweite Liste anlegen', text: 'Eine Liste für Koffer, eine für Handgepäck — beide lassen sich getrennt abhaken.' },
        { title: 'Am Vorabend prüfen', text: 'Die Erinnerung kommt um 18 Uhr, wenn Fehlendes noch besorgt werden kann.' },
      ],
      faqs: [
        {
          question: 'Gelten die Regeln bei allen Airlines gleich?',
          answer:
            'Die Flüssigkeitsregel gilt einheitlich an EU-Flughäfen. Maße und Gewicht des Handgepäcks legt aber jede Airline selbst fest — vor dem Packen einmal nachsehen lohnt sich.',
        },
        {
          question: 'Darf ich Medikamente über 100 ml mitnehmen?',
          answer:
            'Ja, für die Reisedauer benötigte Medikamente sind ausgenommen. Nimm die Originalverpackung mit und, wenn möglich, das Rezept oder eine ärztliche Bescheinigung.',
        },
      ],
      screenshotIndex: 1,
    },
  ],
  faqs: [
    {
      question: 'Wie erstellt die App die Packliste?',
      answer:
        'Aus deinen Angaben zu Ziel, Dauer, Reiseart, Wetter, Transportmittel und Mitreisenden. Daraus ergeben sich sowohl die Positionen als auch die Mengen — 7 Nächte zu zweit sind 16 Paar Socken, nicht einfach „Socken".',
      learnMoreSlug: 'packliste-urlaub-erstellen',
    },
    {
      question: 'Können mehrere Personen dieselbe Liste benutzen?',
      answer:
        'Ja. Ein Code verbindet die Geräte, jede Änderung erscheint bei allen. Wer beitritt, braucht kein Konto und zahlt nichts.',
      learnMoreSlug: 'packliste-familie-gemeinsam',
    },
    {
      question: 'Denkt die App an Kinder und Haustiere?',
      answer:
        'Ja. Reist ein Baby mit, kommen Windeln dazu; kommt der Hund mit, die Leine. Das ergänzt die App automatisch aus deinen Angaben.',
    },
    {
      question: 'Welche Reisearten gibt es?',
      answer:
        'Acht: Strand, Städtereise, Wandern, Business, Ski, Camping, Roadtrip und Festival. Jede bringt ihre eigenen Pflichtteile mit.',
      learnMoreSlug: 'packliste-urlaub-erstellen',
    },
    {
      question: 'Was ist kostenlos?',
      answer:
        'Eine Reise mit dem vollen Funktionsumfang der Listenerstellung. Pro schaltet unbegrenzt viele Reisen, gemeinsames Packen, Packen nach Person, Vorlagen und Duplikate frei — einmalig, ohne Abo.',
    },
    {
      question: 'Brauche ich ein Konto?',
      answer:
        'Nein. Keine Anmeldung, keine Werbung, kein Tracking. Deine Listen liegen auf deinem iPhone; beendest du das Teilen, wird die geteilte Liste vom Server gelöscht.',
    },
  ],
  ctaHeading: 'Nie wieder etwas vergessen',
  ctaText:
    'Ein paar Fragen beantworten, fertige Liste bekommen, gemeinsam abhaken. Kostenlos laden und die nächste Reise entspannt packen.',
  category: 'TravelApplication',
  downloadNote: 'Kostenlos laden • Optionale Einmalzahlung',
};
