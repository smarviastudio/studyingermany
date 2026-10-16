// UI and German lesson translations. Road-rule region is independent of language.
import nl from './locales/nl.js';
import it from './locales/it.js';
import es from './locales/es.js';
import pl from './locales/pl.js';
const LOCALIZED = { nl, it, es, pl };
export const LANGUAGES = { de: 'Deutsch', en: 'English', nl: 'Nederlands', it: 'Italiano', es: 'Español', pl: 'Polski' };
const LANG_KEY = 'vorfahrt3d-lang';
function deviceLang() {
  for (const locale of navigator.languages || [navigator.language || 'en']) {
    const code = locale.toLowerCase().split('-')[0];
    if (LANGUAGES[code]) return code;
  }
  return 'en';
}
let lang;
try {
  const stored = localStorage.getItem(LANG_KEY);
  lang = LANGUAGES[stored] ? stored : deviceLang();
} catch { lang = deviceLang(); }

const listeners = [];
export const getLang = () => lang;
export function setLang(l) {
  lang = LANGUAGES[l] ? l : deviceLang();
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* egal */ }
  applyStaticTexts();
  for (const fn of listeners) fn(lang);
}
export const onLangChange = (fn) => listeners.push(fn);

/* ---------- UI-Strings ---------- */

const UI = {
  de: {
    kicker: 'Führerschein · Theorieprüfung · Klasse B',
    sub: 'Setz dich an echte Kreuzungen und entscheide: <b>Wer darf zuerst fahren?</b><br>Der 3D‑Trainer für den Teil der Theorieprüfung, an dem die meisten scheitern.',
    start: 'Jetzt üben', allLevels: 'Alle Übungen', simBtn: '🎮 Fahrsimulator',
    badges: ['✓ Rechts vor links', '✓ Verkehrszeichen', '✓ Ampeln & Blaulicht', '✓ Fahrsimulator', '✓ Wetter & Notfälle'],
    menuTitle: 'Was willst du üben?',
    menuDesc: 'Such dir ein Thema aus — jede Übung dauert unter einer Minute.',
    simSection: 'Selbst fahren',
    whoFirst: 'Wer darf zuerst fahren?',
    hereApplies: 'Hier gilt:',
    me: 'Ich', wantsLeft: ' · will links abbiegen', wantsRight: ' · will rechts abbiegen',
    besideYou: 'neben dir', fromLeft: 'von links', fromRight: 'von rechts', fromAhead: 'von vorne',
    blinksLeft: ' · blinkt links', blinksRight: ' · blinkt rechts',
    police: 'Polizei', pedestrian: 'Fußgänger', cyclist: 'Radfahrer',
    thePolice: 'die Polizei', thePed: 'der Fußgänger', theCyclist: 'der Radfahrer',
    youFirst: 'du darfst zuerst fahren', goesFirst: 'fährt zuerst',
    toastRight: '✅ Richtig! Sieh dir den Ablauf an …',
    toastWrong: (who) => `❌ Falsch — ${who}. Sieh dir die Reihenfolge an …`,
    catDone: (t) => `🎉 Kategorie „${t}" geschafft!`,
    unlocked: '🔓 Alles freigeschaltet — viel Erfolg!',
    noRestore: 'Keine früheren Käufe gefunden.',
    purchaseFailed: 'Kauf nicht abgeschlossen. Bitte erneut versuchen.',
    unlockFor: 'Freischalten · {price}',
    correct: 'Richtig!', wrong: 'Leider falsch', doneSim: 'Geschafft! 🏁',
    again: 'Nochmal', next: 'Weiter', skip: 'Überspringen ›',
    observe: 'Sieh dir die Situation genau an …',
    yourLight: 'Deine Ampel', yourSign: 'Dein Schild',
    bendCourse: 'Verlauf der Vorfahrtsstraße', bend: 'Verlauf',
    oncoming: 'Gegenverkehr',
    brake: 'BREMSE', gas: 'GAS',
    alarmTitle: 'Fehler!', alarmRetry: 'Nochmal versuchen', alarmMenu: 'Zur Übersicht',
    simMistakeFallback: 'Das war ein Fehler — sieh dir die Situation nochmal an.',
    howtoTitle: 'So funktioniert’s',
    howtoSteps: [
      '<b>Schau dich um:</b> Schilder, Ampeln und Blinker verraten die Regel.',
      '<b>Tippe an, wer zuerst fahren darf</b> — direkt aufs Fahrzeug oder auf die Antwort unten.',
      '<b>Sieh dir die Auflösung an:</b> Alle fahren in der richtigen Reihenfolge.'
    ],
    simHowtoTitle: 'Fahrsimulator',
    simHowtoSteps: [
      '<b>Gas &amp; Bremse gedrückt halten</b> — so fährst du los und hältst an.',
      '<b>Fahre über die Kreuzung</b> und beachte Schilder, Ampeln und Vorfahrt.',
      '<b>Bei einem Fehler ertönt der Alarm</b> — du erfährst sofort, was falsch war.',
      '<b>Abbiegen mit dem Blinker:</b> In den Dauerfahrten tippst du ⬅ oder ➡ vor der Kreuzung an — dann biegst du dort ab.'
    ],
    letsGo: 'Los geht’s',
    payTitle: 'Alle Übungen freischalten',
    payItems: [
      'Alle Kreuzungen in 3D — von Stoppschild bis Blaulicht',
      'Fahrsimulator: alle Level & Dauerfahrten (Freies Fahren, Prüfung, Autobahn)',
      'Radfahrer‑, Zebrastreifen‑ &amp; Ampel‑Szenarien',
      'Wissens‑Training: Winter, Nebel, Unfall &amp; Co.',
      'Einmal zahlen, für immer üben — <b>kein Abo</b>'
    ],
    // Ohne Preis: Der echte Preis kommt aus dem App Store (unlockFor) — nie fest einbauen.
    payBtn: 'Alle Übungen freischalten',
    // Im App-Store-Build (StoreKit aktiv) gilt payNote; der Demo-Hinweis
    // erscheint nur in der Browser-Entwicklung ohne native Kaufabwicklung.
    payNote: 'Einmaliger Kauf · <a id="btn-restore" href="#">Käufe wiederherstellen</a>',
    payNoteDemo: 'Demo‑Build: Kauf wird simuliert · <a id="btn-restore" href="#">Käufe wiederherstellen</a>',
    env: { snow: '🌨️ Schnee & Glätte', rain: '🌧️ Starkregen', fog: '🌫️ Dichter Nebel' },
    /* Dauerfahrten */
    driveFreeTask: 'Fahre frei — Blinker setzen zum Abbiegen',
    instrStraight: '⬆️ Bitte geradeaus fahren',
    instrLeft: '⬅️ Bitte an der Kreuzung links abbiegen',
    instrRight: '➡️ Bitte an der Kreuzung rechts abbiegen',
    crossing: 'Kreuzung',
    mistCount: (n) => `⚠️ ${n} Fehler`,
    driveMistakes: {
      crash: 'Kollision — in der echten Prüfung sofort durchgefallen',
      red: 'Rote Ampel überfahren',
      stop: 'Stoppschild: nicht vollständig angehalten',
      yield: 'Vorfahrt missachtet',
      zebra: 'Fußgänger am Zebrastreifen gefährdet',
      wrongdir: 'Anweisung nicht befolgt (falsche Richtung)',
      speed: 'Tempolimit überschritten',
      rechts: 'Rechtsfahrgebot missachtet — rechts fahren, wenn frei'
    },
    abTask: '🛣️ Richtgeschwindigkeit 130 — Blinker wechselt die Spur',
    resDistance: (km) => `${km} km geschafft`,
    groups: {
      vorfahrt: '🚦 Vorfahrt & Kreuzungen',
      fahren: '🎮 Selbst fahren',
      wissen: '🌨️ Wissen & Notfälle'
    },
    resumeTitle: 'Weiter üben',
    resumeStart: 'Hier anfangen',
    resumeGo: 'Start ›',
    allDone: 'Alles geschafft! 🎉',
    allDoneDesc: 'Du hast jede Übung bestanden — wiederhole, was du willst.',
    unlockTitle: 'Alle Übungen freischalten',
    unlockDesc: 'Die kostenlosen Übungen sind geschafft — hier geht es weiter.',
    badgeNew: 'Neu',
    badgeLocked: 'Gesperrt',
    simLevels: 'Übungs-Level',
    simLevelsDesc: 'Kurze Situationen — eine Kreuzung, eine Regel',
    driveDescs: {
      'drive-free': 'Einfach fahren — die Fehler kommen ins Fahrtenbuch',
      'drive-test': '6 Anweisungen wie vom Prüfer — bestanden oder nicht',
      'drive-autobahn': 'Überholen, Tempolimits, Rechtsfahrgebot'
    },
    tiers: { easy: '🟢 Leicht', medium: '🟡 Mittel', hard: '🔴 Schwer' },
    resFreeTitle: 'Fahrt beendet', resTestTitle: 'Praktische Prüfung',
    resPassed: 'Bestanden! 🎉', resFailed: 'Leider nicht bestanden',
    resAborted: 'Prüfung abgebrochen — Kollision',
    resClean: 'Keine Fehler — sauber gefahren!',
    resCrossings: (n) => `${n} Kreuzungen gemeistert`,
    resDone: 'Fertig'
  },
  en: {
    kicker: 'Driving licence · Theory test · German rules',
    sub: 'Sit at real intersections and decide: <b>Who goes first?</b><br>The 3D trainer for the part of the theory test most people fail.',
    start: 'Practise now', allLevels: 'All exercises', simBtn: '🎮 Driving simulator',
    badges: ['✓ Right before left', '✓ Traffic signs', '✓ Lights & sirens', '✓ Driving simulator', '✓ Weather & emergencies'],
    menuTitle: 'What do you want to practise?',
    menuDesc: 'Pick a topic — every exercise takes under a minute.',
    simSection: 'Drive yourself',
    whoFirst: 'Who may go first?',
    hereApplies: 'Here applies:',
    me: 'Me', wantsLeft: ' · turning left', wantsRight: ' · turning right',
    besideYou: 'beside you', fromLeft: 'from the left', fromRight: 'from the right', fromAhead: 'oncoming',
    blinksLeft: ' · indicating left', blinksRight: ' · indicating right',
    police: 'Police', pedestrian: 'Pedestrian', cyclist: 'Cyclist',
    thePolice: 'the police', thePed: 'the pedestrian', theCyclist: 'the cyclist',
    youFirst: 'you may go first', goesFirst: 'goes first',
    toastRight: '✅ Correct! Watch how it plays out …',
    toastWrong: (who) => `❌ Wrong — ${who}. Watch the right order …`,
    catDone: (t) => `🎉 Category “${t}” completed!`,
    unlocked: '🔓 Everything unlocked — good luck!',
    noRestore: 'No previous purchases found.',
    purchaseFailed: 'Purchase not completed. Please try again.',
    unlockFor: 'Unlock · {price}',
    correct: 'Correct!', wrong: 'Not quite', doneSim: 'Well done! 🏁',
    again: 'Retry', next: 'Next', skip: 'Skip ›',
    observe: 'Take a good look at the situation …',
    yourLight: 'Your light', yourSign: 'Your sign',
    bendCourse: 'Course of the priority road', bend: 'Course',
    oncoming: 'Oncoming traffic',
    brake: 'BRAKE', gas: 'GAS',
    alarmTitle: 'Mistake!', alarmRetry: 'Try again', alarmMenu: 'Back to menu',
    simMistakeFallback: 'That was a mistake — take another look at the situation.',
    howtoTitle: 'How it works',
    howtoSteps: [
      '<b>Look around:</b> signs, traffic lights and indicators reveal the rule.',
      '<b>Tap who may go first</b> — directly on the vehicle or on an answer below.',
      '<b>Watch the resolution:</b> everyone drives in the correct order.'
    ],
    simHowtoTitle: 'Driving simulator',
    simHowtoSteps: [
      '<b>Hold gas &amp; brake</b> — that’s how you move and stop.',
      '<b>Drive across the intersection</b> and obey signs, lights and right of way.',
      '<b>A mistake triggers the alarm</b> — you’ll instantly learn what went wrong.',
      '<b>Turn with the indicator:</b> in the long drives, tap ⬅ or ➡ before the intersection and you turn there.'
    ],
    letsGo: 'Let’s go',
    payTitle: 'Unlock all exercises',
    payItems: [
      'All intersections in 3D — from stop sign to blue lights',
      'Driving simulator: all levels & long drives (free drive, test, motorway)',
      'Cyclist, zebra crossing &amp; traffic light scenarios',
      'Knowledge training: winter, fog, accidents &amp; more',
      'Pay once, practise forever — <b>no subscription</b>'
    ],
    payBtn: 'Unlock all exercises',
    payNote: 'One-time purchase · <a id="btn-restore" href="#">Restore purchases</a>',
    payNoteDemo: 'Demo build: purchase is simulated · <a id="btn-restore" href="#">Restore purchases</a>',
    env: { snow: '🌨️ Snow & ice', rain: '🌧️ Heavy rain', fog: '🌫️ Dense fog' },
    /* Continuous drives */
    driveFreeTask: 'Drive freely — use the indicators to turn',
    instrStraight: '⬆️ Please drive straight ahead',
    instrLeft: '⬅️ Please turn left at the intersection',
    instrRight: '➡️ Please turn right at the intersection',
    crossing: 'Intersection',
    mistCount: (n) => `⚠️ ${n} mistake${n === 1 ? '' : 's'}`,
    driveMistakes: {
      crash: 'Collision — instant fail in the real test',
      red: 'Ran a red light',
      stop: 'Stop sign: no complete stop',
      yield: 'Priority ignored',
      zebra: 'Endangered a pedestrian at the zebra crossing',
      wrongdir: 'Instruction not followed (wrong direction)',
      speed: 'Exceeded the speed limit',
      rechts: 'Keep-right rule ignored — drive right when it’s clear'
    },
    abTask: '🛣️ Advisory speed 130 — indicators change lanes',
    resDistance: (km) => `${km} km covered`,
    groups: {
      vorfahrt: '🚦 Priority & junctions',
      fahren: '🎮 Drive yourself',
      wissen: '🌨️ Knowledge & emergencies'
    },
    resumeTitle: 'Keep practising',
    resumeStart: 'Start here',
    resumeGo: 'Start ›',
    allDone: 'All done! 🎉',
    allDoneDesc: 'You passed every exercise — repeat whatever you like.',
    unlockTitle: 'Unlock all exercises',
    unlockDesc: 'You finished the free exercises — this is where it continues.',
    badgeNew: 'New',
    badgeLocked: 'Locked',
    simLevels: 'Practice levels',
    simLevelsDesc: 'Short situations — one intersection, one rule',
    driveDescs: {
      'drive-free': 'Just drive — mistakes go into your logbook',
      'drive-test': '6 examiner-style instructions — pass or fail',
      'drive-autobahn': 'Overtaking, speed limits, keep-right rule'
    },
    tiers: { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' },
    resFreeTitle: 'Drive finished', resTestTitle: 'Practical driving test',
    resPassed: 'Passed! 🎉', resFailed: 'Not passed',
    resAborted: 'Test stopped — collision',
    resClean: 'No mistakes — cleanly driven!',
    resCrossings: (n) => `${n} intersections mastered`,
    resDone: 'Done'
  }
};

Object.assign(UI, Object.fromEntries(Object.entries(LOCALIZED).map(([code, value]) => [code, value.ui])));
Object.assign(UI.de, { close: 'Schließen', blinkLeft: 'Blinker links', blinkRight: 'Blinker rechts', language: 'Sprache', back: 'Zurück', ruleScope: 'Diese Übungen verwenden deutsche Verkehrsregeln (StVO).', loyalCustomer: '🎉 <b>Du bist schon Kunde: 20 % Rabatt</b><span>Alle Apps ansehen</span>', loyalOther: '🎁 <b>Jetzt kaufen: 20 % Rabatt in unseren anderen Apps</b><span>Alle Apps ansehen</span>', insteadOf: 'statt ' });
Object.assign(UI.en, { close: 'Close', blinkLeft: 'Left indicator', blinkRight: 'Right indicator', language: 'Language', back: 'Back', ruleScope: 'These exercises use German traffic rules (StVO).', loyalCustomer: '🎉 <b>You are already a customer: 20% off</b><span>See all apps</span>', loyalOther: '🎁 <b>Buy now: 20% off in our other apps</b><span>See all apps</span>', insteadOf: 'instead of ' });
export const t = (key, ...args) => {
  const v = UI[lang][key] ?? UI.de[key];
  return typeof v === 'function' ? v(...args) : (typeof v === 'string' && args.length ? v.replaceAll('{arg}', String(args[0])) : v);
};

// Autonamen: „Rotes Auto" → EN, plus Satzform („das rote Auto")
const CAR_NAMES = {
  'Rotes Auto': ['Red car', 'the red car'],
  'Blaues Auto': ['Blue car', 'the blue car'],
  'Gelbes Auto': ['Yellow car', 'the yellow car'],
  'Weißes Auto': ['White car', 'the white car'],
  'Grünes Auto': ['Green car', 'the green car'],
  'Lila Auto': ['Purple car', 'the purple car']
};
export function carName(name) {
  if (LOCALIZED[lang]?.cars[name]) return LOCALIZED[lang].cars[name][0];
  if (lang === 'en' && CAR_NAMES[name]) return CAR_NAMES[name][0];
  return name;
}
export function carNameSentence(name) {
  if (LOCALIZED[lang]?.cars[name]) return LOCALIZED[lang].cars[name][1];
  if (lang === 'en' && CAR_NAMES[name]) return CAR_NAMES[name][1];
  return 'das ' + name.toLowerCase().replace('es auto', 'e auto').replace(' auto', ' Auto');
}
export function relWord(rel) { // relationTo liefert 'links' | 'vorne' | 'rechts'
  if (lang === 'de') return `von ${rel}`;
  return rel === 'links' ? t('fromLeft') : rel === 'rechts' ? t('fromRight') : t('fromAhead');
}

/* ---------- Englische Inhalte (Szenarien, Quiz, Simulator, Kategorien) ---------- */

const EN = {
  /* --- 3D-Szenarien --- */
  rvl1: {
    title: 'Right before left I',
    hint: 'No signs, no lights — which basic rule applies?',
    explanation: 'This intersection has neither signs nor lights — so “right before left” applies (§ 8 StVO). The red car comes from your right and may go first.',
    rule: '§ 8 StVO · Right before left'
  },
  rvl2: {
    title: 'Right before left II',
    hint: 'Which side is the other car coming from?',
    explanation: 'Right before left: nobody is coming from your right — you may go first. The blue car from the left must let you through.',
    rule: '§ 8 StVO · Right before left'
  },
  prio: {
    title: 'Priority road',
    hint: 'Notice the yellow sign on your road.',
    explanation: 'You are on the priority road (sign 306). The yellow car has “give way” (sign 205) and must wait — even though it comes from the right.',
    rule: 'Sign 306 · Priority road'
  },
  yield: {
    title: 'Give way',
    hint: 'Who is on the priority road here?',
    explanation: 'You have sign 205 (“give way”). Cross traffic on the priority road goes first — even from the left. Right before left only applies without signs.',
    rule: 'Sign 205 · Give way'
  },
  rvl3: {
    title: 'Three at the crossing',
    hint: 'Right before left — think in turns.',
    explanation: 'Right before left, resolved in turns: the red car has a clear right side and goes first. Then it’s your turn, and the blue car from the left goes last.',
    rule: '§ 8 StVO · Right before left'
  },
  stop: {
    title: 'Stop sign',
    hint: 'STOP means: halt — and then?',
    explanation: 'At the stop sign (sign 206) you must come to a complete stop at the line and give way. The white car on the priority road goes first.',
    rule: 'Sign 206 · Stop. Give way.'
  },
  ampel: {
    title: 'Green — but turning left',
    hint: 'You both have green. You want to turn left …',
    explanation: 'You both have green. As a left-turner you must let oncoming straight and right-turning traffic through first (§ 9 (3) StVO) — only then may you turn.',
    rule: '§ 9 (3) StVO · Turning left'
  },
  bend: {
    title: 'Bending priority road',
    hint: 'The extra panel shows the course of the priority road.',
    explanation: 'The priority road bends left here (sign 306 with panel). You follow its course and have priority — but you must indicate! The oncoming car is on a side road with “give way” (sign 205) and waits.',
    rule: 'Sign 306 + panel 1002'
  },
  zebra: {
    title: 'Zebra crossing',
    hint: 'When turning: who is on the crossing?',
    explanation: 'At a zebra crossing (sign 350) pedestrians have priority (§ 26 StVO). When turning you must wait until the person has completely crossed the road.',
    rule: '§ 26 StVO · Pedestrian crossing'
  },
  blau: {
    title: 'Blue lights',
    hint: 'Blue lights and siren beat every rule.',
    explanation: 'Blue lights with siren mean: clear the way immediately (§ 38 StVO) — that overrides all priority rules. Afterwards the crossing resolves normally by right before left.',
    rule: '§ 38 StVO · Right of way'
  },
  'rvl-links': {
    title: 'Turning left, no signs',
    hint: 'You want to go left — who is coming towards you?',
    explanation: 'Even without signs: whoever turns left must let oncoming traffic through first (§ 9 (3) StVO). The purple car drives straight and has priority.',
    rule: '§ 9 (3) StVO · Turning left'
  },
  'rvl-abbieger': {
    title: 'Turner from the right',
    hint: 'Right before left also applies to turning cars.',
    explanation: 'The red car comes from the right — right before left applies no matter where it wants to turn (the indicator tells you). It goes first, you follow.',
    rule: '§ 8 StVO · Right before left'
  },
  'bike-rechts': {
    title: 'Bike lane when turning',
    hint: 'Shoulder check: who rides straight on beside you?',
    explanation: 'When turning right you must first let cyclists pass who continue straight beside you (§ 9 (3) StVO). Don’t forget the shoulder check!',
    rule: '§ 9 (3) StVO · Shoulder check'
  },
  'bike-rvl': {
    title: 'Bicycle from the right',
    hint: 'Does right before left apply to bicycles too?',
    explanation: 'Yes — bicycles are vehicles. The cyclist comes from the right and has priority (§ 8 StVO). Don’t underestimate their speed.',
    rule: '§ 8 StVO · Right before left'
  },
  'prio-links': {
    title: 'Priority road — turning left',
    hint: 'Priority does not mean free passage when turning.',
    explanation: 'You are both on the priority road. As a left-turner you must still let oncoming traffic through first (§ 9 (3) StVO) — the priority road only protects you from cross traffic.',
    rule: '§ 9 (3) StVO · Turning left'
  },
  'stop-links': {
    title: 'Stop & turn left',
    hint: 'After the stop, the normal rules apply.',
    explanation: 'You both must stop at the stop sign. After that the normal rules apply: as a left-turner you let oncoming traffic go first (§ 9 (3) StVO).',
    rule: 'Sign 206 + § 9 StVO'
  },
  'ampel-rot': {
    title: 'Red light',
    hint: 'Your light shows red.',
    explanation: 'At red you must wait at the stop line (§ 37 StVO). Cross traffic has green and goes first — you may only start at green. Watch for the red-amber phase.',
    rule: '§ 37 StVO · Red'
  },
  'ampel-blink': {
    title: 'Lights out of order',
    hint: 'Flashing amber: which rule applies now?',
    explanation: 'If the lights flash amber they are out of order — now the signs apply (§ 37 StVO). You have “give way”, the green car is on the priority road and goes first.',
    rule: '§ 37 StVO + sign 205'
  },
  'zebra-direkt': {
    title: 'Zebra crossing ahead',
    hint: 'There is a crossing right in front of you.',
    explanation: 'At a zebra crossing pedestrians have priority (§ 26 StVO) — even when you are going straight. Stop and wait until the person has completely crossed the road.',
    rule: '§ 26 StVO · Pedestrian crossing'
  },
  'blau-gegen': {
    title: 'Blue lights ahead',
    hint: 'Normally you would have priority …',
    explanation: 'Normally oncoming turning traffic waits for you — but with blue lights and siren the patrol car has right of way (§ 38 StVO). It turns first, you wait.',
    rule: '§ 38 StVO · Right of way'
  },

  /* --- T-Einmündungen --- */
  't-rvl': {
    title: 'Junction without signs',
    hint: 'A smaller road does not automatically mean “wait” — look for signs.',
    explanation: 'There is not a single sign here. Then “right before left” (§ 8 StVO) applies at a T-junction too — a road that ends is not automatically the minor road. The blue car comes from your left, so you may go first.',
    rule: '§ 8 StVO · Right before left'
  },
  't-yield': {
    title: 'Junction with sign 205',
    hint: 'Compare this with the junction without signs — what does the sign change?',
    explanation: 'Now your road carries sign 205 “give way”. That makes it the minor road: you must let traffic on the through road pass — whether it comes from the right or from the left.',
    rule: 'Sign 205 · Give way'
  },
  't-stop': {
    title: 'Stop at the junction',
    hint: 'You want to turn left — how many directions must you watch?',
    explanation: 'Sign 206 requires a complete stop at the line, then give way. Turning left you cross both directions of the through road — the red car from the right goes first.',
    rule: 'Sign 206 · Stop, give way'
  },
  't-links': {
    title: 'Left into the side road',
    hint: 'This time you are on the through road — who gets in your way?',
    explanation: 'You are turning left off the through road into the side road. Anyone turning must let oncoming traffic pass (§ 9 (3) StVO) — the yellow car goes straight and therefore first.',
    rule: '§ 9 (3) StVO · Turning'
  },

  /* --- Kreisverkehr --- */
  'kv-einfahrt': {
    title: 'Entering the roundabout',
    hint: 'Who is already in the circle — and what does that mean for you?',
    explanation: 'A roundabout carries sign 215 together with sign 205: anyone entering must give way to traffic already circulating. The red car is already in the roundabout and goes first. You only indicate when you leave the circle.',
    rule: 'Signs 215 + 205 · Roundabout'
  },
  'kv-drin': {
    title: 'Already in the circle',
    hint: 'This time you are inside — who has to wait now?',
    explanation: 'Now you are in the roundabout and have priority. The blue car is waiting at the entry and must let you pass. You indicate right because you are leaving the circle — in a roundabout you only indicate when exiting.',
    rule: 'Signs 215 + 205 · Priority in the circle'
  },
  'kv-zebra': {
    title: 'Zebra crossing at the exit',
    hint: 'Priority in the circle does not mean priority over everyone.',
    explanation: 'Your priority applies to entering vehicles — not to pedestrians. At the zebra crossing just past the exit the pedestrian has right of way (§ 26 StVO): you must let them cross.',
    rule: '§ 26 StVO · Pedestrian crossing'
  },

  /* --- Wissensquiz --- */
  'q-winter': {
    title: 'Winter tyres',
    q: 'Snow on the road — what tyres may you drive with now?',
    options: ['Only winter tyres (Alpine symbol)', 'Summer tyres, if I drive carefully', 'Any tyre with 1.6 mm tread'],
    explanation: 'In snow, ice or frost the situational winter tyre rule applies (§ 2 (3a) StVO): drive only with winter tyres (Alpine symbol). Summer tyres risk a fine, points — and your insurance may cut benefits.',
    rule: '§ 2 StVO · Winter tyres'
  },
  'q-unfall': {
    title: 'First at the accident',
    q: 'You are first at this accident with injuries. What is the correct order?',
    options: ['Secure the scene → call 112 → first aid', 'First aid immediately, everything else later', 'Take photos and wait for the police'],
    explanation: 'First secure the scene (hazard lights, hi-vis vest, warning triangle), then call 112, then first aid (§ 34 StVO). If you endanger yourself, you can’t help anyone.',
    rule: '§ 34 StVO · Accidents'
  },
  'q-warndreieck': {
    title: 'Warning triangle',
    q: 'Breakdown on a country road: at what distance do you place the warning triangle?',
    options: ['About 100 metres', 'About 20 metres', 'Right behind the car'],
    explanation: 'On country roads about 100 m, on motorways much more (150–400 m) — traffic needs time to react. Hazard lights on and hi-vis vest first.',
    rule: '§ 15 StVO · Breakdown'
  },
  'q-nebel': {
    title: 'Dense fog',
    q: 'Visibility is below 50 metres. What is your maximum speed?',
    options: ['50 km/h', '80 km/h', 'As fast as the car in front'],
    explanation: 'Below 50 m visibility: at most 50 km/h (§ 3 StVO) — and only now may you switch on the rear fog light. Mnemonic: sight below 50 → speed 50.',
    rule: '§ 3 StVO · Visibility'
  },
  'q-aqua': {
    title: 'Aquaplaning',
    q: 'Heavy rain — the car suddenly “floats”. What is right now?',
    options: ['Clutch in, hold the wheel steady, don’t brake', 'Brake hard', 'Steer quickly left and right'],
    explanation: 'In aquaplaning the tyres have no road contact: off the gas, clutch in, keep the wheel straight. Braking and steering only work again once the tyres grip.',
    rule: 'Physics · Aquaplaning'
  },
  'q-glaette': {
    title: 'Black ice',
    q: 'This car’s rear has broken loose on black ice. How do you react correctly?',
    options: ['Clutch in and countersteer gently', 'Brake fully', 'Accelerate to regain stability'],
    explanation: 'Clutch in and countersteer gently — abrupt braking or throttle makes the skid worse. Drive with foresight: on ice keep double distance and drive smoothly.',
    rule: 'Physics · Ice'
  },
  'q-gasse': {
    title: 'Emergency corridor',
    q: 'Traffic is jamming, an emergency vehicle approaches. When must the corridor be formed?',
    options: ['Immediately, as soon as traffic stalls', 'Only when I see blue lights in the mirror', 'Only when the police tell me to'],
    explanation: 'Form the emergency corridor as soon as traffic stalls (§ 11 (2) StVO): leftmost lane moves left, everyone else right. Once the blue lights arrive, it’s too late.',
    rule: '§ 11 StVO · Emergency corridor'
  },
  'q-gelb': {
    title: 'Amber light',
    q: 'The light turns amber — the blue car can still stop safely. What is correct?',
    options: ['Stop and wait for green', 'Accelerate and drive through', 'Roll slowly into the intersection'],
    explanation: 'Amber means: wait before the intersection for the next signal (§ 37 StVO). If you can still stop safely, you must — “flooring it at amber” costs a fine and causes many accidents.',
    rule: '§ 37 StVO · Amber phase'
  },
  'q-regen': {
    title: 'Braking in rain',
    q: 'Wet road: what happens to these cars’ braking distance?',
    options: ['It gets much longer — keep more distance', 'It stays the same', 'It gets shorter because water brakes'],
    explanation: 'On a wet road the braking distance grows considerably. So: slow down and increase the gap (§ 4 StVO) — at least “half your speed” in metres, more in rain.',
    rule: '§ 4 StVO · Distance'
  },

  /* --- Fahrsimulator --- */
  'sim-rvl': {
    title: 'Right before left',
    task: 'Drive across the intersection — mind right before left!',
    explanation: 'Cleanly driven! You let the car from the right go first — exactly what right before left demands.',
    rule: '§ 8 StVO · Right before left',
    mistakes: {
      yield: 'Priority ignored! The red car came from the right — with “right before left” you must let it go first.',
      crash: 'Collision! You drove into a vehicle that had priority. Look first, then drive.'
    }
  },
  'sim-yield': {
    title: 'Give way',
    task: 'You have a “give way” sign — let cross traffic through!',
    explanation: 'Strong! You let traffic on the priority road go first — even though it came from the left.',
    rule: 'Sign 205 · Give way',
    mistakes: {
      yield: 'Priority ignored! With sign 205 you must let traffic on the priority road go first — even from the left.',
      crash: 'Collision! The car on the priority road had priority — you must wait until the road is clear.'
    }
  },
  'sim-stop': {
    title: 'Stop sign',
    task: 'STOP: come to a complete halt at the line, then continue.',
    explanation: 'Perfect: full stop and priority road respected — exactly how you pass the exam.',
    rule: 'Sign 206 · Stop. Give way.',
    mistakes: {
      stop: 'Stop sign ignored! At sign 206 you must come to a complete stop at the line — even if everything looks clear.',
      yield: 'Priority ignored! After stopping: traffic on the priority road goes first.',
      crash: 'Collision! Stopping alone is not enough — you may only go once the priority road is clear.'
    }
  },
  'sim-ampel': {
    title: 'Red light',
    task: 'Your light is red: stop at the line and wait for green.',
    explanation: 'Exactly right: waited at red, moved off at green. The red-amber phase announces the green.',
    rule: '§ 37 StVO · Red',
    mistakes: {
      red: 'Red light violation! At red you must wait at the stop line until the light turns green — that costs at least €90 and a point.',
      yield: 'Too early! The intersection wasn’t clear yet — only go once cross traffic has passed.',
      crash: 'Collision! Cross traffic had green — at red you wait at the stop line.'
    }
  },
  'sim-zebra': {
    title: 'Zebra crossing',
    task: 'A zebra crossing is ahead — watch for pedestrians!',
    explanation: 'Exemplary! You waited until the person had completely crossed the road.',
    rule: '§ 26 StVO · Pedestrian crossing',
    mistakes: {
      zebra: 'Pedestrian endangered! At a zebra crossing pedestrians have priority — stop until the road is clear.',
      crash: 'You hit a pedestrian! At a zebra crossing you must stop and wait — always.'
    }
  },
  'sim-blau': {
    title: 'Blue lights',
    task: 'Blue lights and siren: clear the way immediately!',
    explanation: 'Right reaction: emergency vehicles with blue lights and siren have right of way — everyone else waits.',
    rule: '§ 38 StVO · Right of way',
    mistakes: {
      yield: 'Emergency vehicle obstructed! With blue lights and siren you must clear the way immediately (§ 38 StVO) — even if you’d normally have priority.',
      crash: 'Collision with the emergency vehicle! Blue lights and siren beat every priority rule.'
    }
  },
  'sim-prio': {
    title: 'You have priority',
    task: 'You are on the priority road — drive through confidently.',
    explanation: 'Well done! You have priority here — hesitating confuses others. The yellow car has to wait for you.',
    rule: 'Sign 306 · Priority road',
    mistakes: {
      crash: 'Collision! Even with priority you must watch the crossing — never force your right of way.'
    }
  },
  'sim-rvl2': {
    title: 'Right before left II',
    task: 'Two cars at the crossing — who has to wait for whom?',
    explanation: 'Perfectly resolved! The red car from your right went first, the blue car from the left waited for you.',
    rule: '§ 8 StVO · Right before left',
    mistakes: {
      yield: 'Priority ignored! The red car came from your right — it goes before you. The blue car from the left waits.',
      crash: 'Collision! Watch both directions: right goes first, left waits for you.'
    }
  },
  'sim-gruen-blau': {
    title: 'Green — but siren',
    task: 'Your light is green — but listen! Clear the way for the emergency vehicle.',
    explanation: 'Exactly right: green does not beat blue lights. § 38 outranks the traffic light.',
    rule: '§ 38 StVO · Right of way',
    mistakes: {
      yield: 'Emergency vehicle obstructed! Even at green you must let a vehicle with blue lights and siren through first.',
      crash: 'Collision with the emergency vehicle! Green light or not — blue lights always go first.'
    }
  },
  'sim-nebel': {
    title: 'Fog at the crossing',
    task: 'Dense fog: approach slowly — cross traffic appears late!',
    explanation: 'Well driven! In fog only a careful approach saves you — you spotted the cross traffic in time.',
    rule: '§ 3 StVO · Visibility',
    mistakes: {
      yield: 'Priority ignored! In fog you must approach so slowly that you can react to late-appearing traffic.',
      crash: 'Collision in fog! Visibility was poor — approach at walking pace and only go when it’s truly clear.'
    }
  },
  'sim-regen': {
    title: 'Stop in the rain',
    task: 'Wet road: your braking distance is much longer — stop at the line!',
    explanation: 'Strong! You braked early — on wet roads the braking distance grows massively.',
    rule: '§ 4 StVO + sign 206',
    mistakes: {
      stop: 'Stop line overshot! On a wet road you must brake much earlier — the braking distance nearly doubles.',
      yield: 'Priority ignored! After the stop: the priority road goes first.',
      crash: 'Collision on a wet road! Brake earlier and gentler — water massively extends the braking distance.'
    }
  },
  'sim-abbieger': {
    title: 'Turner from the right',
    task: 'The car from the right is indicating — priority still applies!',
    explanation: 'Correct! A turning car from the right also has priority — where it goes doesn’t change right before left.',
    rule: '§ 8 StVO · Right before left',
    mistakes: {
      yield: 'Priority ignored! The indicator changes nothing: the car from the right goes first — no matter where it turns.',
      crash: 'Collision with the turning car! Wait until it has completely left the intersection.'
    }
  },
  'sim-bike': {
    title: 'Cyclist from the right',
    task: 'A cyclist is approaching — bicycles have priority too!',
    explanation: 'Clean! Bicycles are vehicles — the cyclist from the right had priority and you waited.',
    rule: '§ 8 StVO · Right before left',
    mistakes: {
      yield: 'Priority ignored! Bicycles are vehicles — the cyclist from the right goes first.',
      crash: 'You hit a cyclist! Cyclists are easy to miss and faster than you think — always look twice.'
    }
  },
  'sim-beide': {
    title: 'Traffic from both sides',
    task: '“Give way” — and traffic comes from the left AND right!',
    explanation: 'Strong! You let both vehicles on the priority road pass — only drive when it’s truly clear.',
    rule: 'Sign 205 · Give way',
    mistakes: {
      yield: 'Priority ignored! After the first car another one came — only go when BOTH directions are clear.',
      crash: 'Collision! One glance isn’t enough: check left and right before entering the intersection.'
    }
  },
  'sim-zebra-auto': {
    title: 'Zebra crossing + cross traffic',
    task: 'First the pedestrian, then the cross traffic — two tests in one!',
    explanation: 'Perfect! Zebra crossing cleared AND the car from the right respected — that’s anticipatory driving.',
    rule: '§ 26 + § 8 StVO',
    mistakes: {
      zebra: 'Pedestrian endangered! The zebra crossing comes first — stop before thinking about cross traffic.',
      yield: 'Priority ignored! After the crossing there was still a car from the right — two hazards, look twice.',
      crash: 'Collision! This intersection has two tests: pedestrian AND cross traffic. Take your time.'
    }
  },
  'sim-stop-beide': {
    title: 'Stop — both directions',
    task: 'STOP: halt — then let traffic from left and right pass.',
    explanation: 'Exam-ready! Full stop and both vehicles respected — including the second one arriving later.',
    rule: 'Sign 206 · Stop. Give way.',
    mistakes: {
      stop: 'Stop sign ignored! Come to a complete stop first — then watch the traffic.',
      yield: 'Priority ignored! After the first car another came from the left — at a stop sign you wait until EVERYTHING is clear.',
      crash: 'Collision! Stopping was only half the task — the priority road must be clear in both directions.'
    }
  },
  'sim-ampel-runner': {
    title: 'Green doesn’t mean safe',
    task: 'Wait for green — but careful: not everyone stops at red!',
    explanation: 'Very strong! You checked the intersection despite green — the red-light runner would have hit you otherwise.',
    rule: '§ 37 StVO + defensive driving',
    mistakes: {
      red: 'Red light violation! Only move off at green — and even then, look into the intersection.',
      yield: 'Too early! Green is no guarantee — that car ran the red light. Only go when the intersection is truly clear.',
      crash: 'Collision with a red-light runner! Green means “you may” — not “it’s safe”. Always check the intersection first.'
    }
  },
  'sim-mix': {
    title: 'Bike right, car left',
    task: 'Cyclist from the right, car from the left — who waits for whom?',
    explanation: 'Completely right! The cyclist from the right went first, the car from the left waited for you — and you kept the order.',
    rule: '§ 8 StVO · Right before left',
    mistakes: {
      yield: 'Priority ignored! The cyclist came from the right — they go before you, even if the car on the left politely waits.',
      crash: 'Collision! Sort the intersection: bike from the right first, then you, then the car from the left.'
    }
  },
  'sim-police-links': {
    title: 'Police turning',
    task: 'The oncoming patrol car turns left with blue lights — across your path!',
    explanation: 'Exactly right: with blue lights and siren the patrol car may turn before you — right of way beats priority.',
    rule: '§ 38 StVO · Right of way',
    mistakes: {
      yield: 'Emergency vehicle obstructed! With blue lights and siren the police turn first — even across your lane.',
      crash: 'Collision with the emergency vehicle! Its blue lights mean: it goes first — always.'
    }
  },
  'sim-schnee': {
    title: 'Snow & zebra crossing',
    task: 'Snow! Braking takes far longer — watch the zebra crossing.',
    explanation: 'Excellent! On snow you drove with foresight and stopped for the pedestrian in time.',
    rule: '§ 26 StVO + winter',
    mistakes: {
      zebra: 'Pedestrian endangered! On snow you must brake much earlier for the zebra crossing.',
      crash: 'You hit a pedestrian! On a snowy road, walking pace applies near zebra crossings.'
    }
  },

  'sim-t-rvl': {
    title: 'Junction from the right',
    task: 'A road joins from the right — carry on correctly.',
    explanation: 'Correct! Without signs, right before left applies at a junction too — the car from the side road came from your right and went first.',
    rule: '§ 8 StVO · Right before left',
    mistakes: {
      yield: 'Priority ignored! The road on the right joins without a sign — then right before left applies, even if your road looks wider.',
      crash: 'Collision! The car from the right had priority. Look first, then drive.'
    }
  },
  'sim-t-bike': {
    title: 'Cyclist from the side road',
    task: 'Watch the road joining from the right — cyclists included.',
    explanation: 'Clean! A cyclist from the right has priority too — bicycles are vehicles under the StVO.',
    rule: '§ 8 StVO · Right before left',
    mistakes: {
      yield: 'Priority ignored! The cyclist came from the right and is a vehicle like any other — right before left applies to them too.',
      crash: 'Collision with a cyclist! This is exactly where most turning and junction accidents happen.'
    }
  },

  /* --- Dauerfahrten --- */
  'drive-free': { title: 'Free driving · 2 minutes' },
  'drive-test': { title: 'Practical driving test' },
  'drive-autobahn': { title: 'Motorway · 2 minutes' },

  /* --- Kategorien --- */
  cats: {
    basics: { title: 'Right before left', desc: 'The basic rule when there are no signs' },
    signs: { title: 'Traffic signs', desc: 'Priority road, stop & bending priority' },
    lights: { title: 'Traffic lights', desc: 'Green doesn’t always mean go' },
    people: { title: 'Bikes & pedestrians', desc: 'Shoulder check and zebra crossings' },
    blue: { title: 'Blue lights', desc: 'When special rights beat all rules' },
    einmuendung: { title: 'T-junctions', desc: 'When one road ends — who has priority?' },
    kreisverkehr: { title: 'Roundabout', desc: 'Traffic in the circle has priority — and who indicates when?' },
    sim: { title: 'Driving simulator', desc: 'Drive yourself with gas & brake — mistakes trigger the alarm' },
    wissen: { title: 'Weather & emergencies', desc: 'Winter, fog, accidents — react correctly' }
  }
};

// Übersetztes Feld eines Items (Szenario/Quiz/Sim) — fällt auf Deutsch zurück
export function tr(item, field) {
  if (lang !== 'de') {
    const e = (LOCALIZED[lang]?.content || EN)[item.id];
    if (e && e[field] != null) return e[field];
  }
  if (field === 'mistake') return null;
  return item[field];
}
export function trMistake(item, kind) {
  if (lang !== 'de') {
    const e = (LOCALIZED[lang]?.content || EN)[item.id];
    if (e && e.mistakes && e.mistakes[kind]) return e.mistakes[kind];
  }
  return (item.mistakes && item.mistakes[kind]) || null;
}
export function trOption(item, idx) {
  if (lang !== 'de') {
    const e = (LOCALIZED[lang]?.content || EN)[item.id];
    if (e && e.options && e.options[idx] != null) return e.options[idx];
  }
  return item.options[idx].t;
}
export function trCat(cat, field) {
  const cats = LOCALIZED[lang]?.content.cats || EN.cats;
  if (lang !== 'de' && cats[cat.id]?.[field]) return cats[cat.id][field];
  return cat[field];
}

/* ---------- Statische Texte in index.html ---------- */

function setAll(pairs) {
  for (const [sel, html] of pairs) {
    const el = document.querySelector(sel);
    if (el) el.innerHTML = html;
  }
}

// Badge-Reihe auf dem Titel: jede ist ein Schnellzugriff auf ihre Kategorie
const BADGE_CATS = ['basics', 'signs', 'lights', 'sim', 'wissen'];

export function applyStaticTexts() {
  const badges = t('badges').map((b, i) => `<span data-cat="${BADGE_CATS[i]}">${b}</span>`).join('');
  const steps = (arr) => arr.map((s) => `<li>${s}</li>`).join('');
  const payItems = t('payItems').map((s) => `<li>${s}</li>`).join('');
  setAll([
    ['#screen-title .kicker', t('kicker')],
    ['#screen-title .sub', t('sub')],
    ['#rule-scope', t('ruleScope')],
    ['#btn-start', t('start')],
    ['#btn-sim', t('simBtn')],
    ['#btn-levels', t('allLevels')],
    ['#screen-title .badges', badges],
    ['#question-text', t('whoFirst')],
    ['#btn-skip', t('skip')],
    ['#observe > span:nth-of-type(2)', t('observe') + '&nbsp;'],
    ['#pedal-brake', `<span class="ic">🛑</span>${t('brake')}`],
    ['#pedal-gas', `<span class="ic">▲</span>${t('gas')}`],
    ['#alarm-card h2', t('alarmTitle')],
    ['#btn-alarm-retry', t('alarmRetry')],
    ['#btn-alarm-menu', t('alarmMenu')],
    ['#sim-howto h2', t('simHowtoTitle')],
    ['#sim-howto .howto-steps', steps(t('simHowtoSteps'))],
    ['#btn-sim-howto-ok', t('letsGo')],
    ['#howto h2', t('howtoTitle')],
    ['#howto .howto-steps', steps(t('howtoSteps'))],
    ['#btn-howto-ok', t('letsGo')],
    ['#btn-retry', t('again')],
    ['#btn-next', t('next')],
    ['#paywall h2', t('payTitle')],
    ['#paywall ul', payItems],
    ['#btn-buy', window.__WEB_DEMO ? window.__WEB_DEMO.t('buy') : t('payBtn')],
    ['#btn-unlock', '🔓 ' + t('payBtn')],
    ['#paywall .pay-note', window.__WEB_DEMO ? window.__WEB_DEMO.t('note') : window.IAP && window.IAP.native ? t('payNote') : t('payNoteDemo')],
    ['#btn-dr-ok', t('resDone')]
  ]);
  document.documentElement.lang = lang;
  if (!window.__WEB_DEMO) document.title = 'Vorfahrt 3D · ' + t('simHowtoTitle');
  for (const [id, key] of [['btn-pay-close', 'close'], ['blink-l', 'blinkLeft'], ['blink-r', 'blinkRight']]) {
    const button = document.getElementById(id);
    if (button) { button.title = t(key); button.setAttribute('aria-label', t(key)); }
  }
  const langSelect = document.getElementById('btn-lang');
  if (langSelect) {
    langSelect.value = lang;
    langSelect.setAttribute('aria-label', t('language'));
  }
  for (const id of ['btn-menu-back', 'btn-back']) {
    const button = document.getElementById(id);
    if (button) { button.title = t('back'); button.setAttribute('aria-label', t('back')); }
  }
}
