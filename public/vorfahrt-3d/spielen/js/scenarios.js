// Die 10 Kreuzungs-Szenarien (Spieler kommt immer von Süden)
// order[0] ist die richtige Antwort auf „Wer darf zuerst fahren?"

export const PLAYER_COLOR = 0x2fb3a4;

export const CAR_COLORS = {
  rot: 0xd7263d,
  blau: 0x2166c9,
  gelb: 0xf0b429,
  weiss: 0xe4e6ea,
  gruen: 0x2f9e44,
  lila: 0x7048b6
};

export const SCENARIOS = [
  {
    id: 'rvl1', title: 'Rechts vor links I', free: true,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'E', turn: 'straight', color: CAR_COLORS.rot, name: 'Rotes Auto' }],
    signs: {}, lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Keine Schilder, keine Ampel — welche Grundregel gilt?',
    explanation: 'An dieser Kreuzung gibt es weder Schilder noch Ampeln — es gilt rechts vor links (§ 8 StVO). Das rote Auto kommt für dich von rechts und darf zuerst fahren.',
    rule: '§ 8 StVO · Rechts vor links'
  },
  {
    id: 'rvl2', title: 'Rechts vor links II', free: true,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'W', turn: 'straight', color: CAR_COLORS.blau, name: 'Blaues Auto' }],
    signs: {}, lights: null, ped: null,
    order: ['player', 'A'],
    hint: 'Von welcher Seite kommt das andere Auto?',
    explanation: 'Rechts vor links: Von rechts kommt niemand — du darfst zuerst fahren. Das blaue Auto von links muss dich durchlassen.',
    rule: '§ 8 StVO · Rechts vor links'
  },
  {
    id: 'prio', title: 'Vorfahrtsstraße', free: true,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'E', turn: 'straight', color: CAR_COLORS.gelb, name: 'Gelbes Auto' }],
    signs: { S: 'priority', N: 'priority', E: 'yield', W: 'yield' },
    lights: null, ped: null,
    order: ['player', 'A'],
    hint: 'Achte auf das gelbe Schild an deiner Straße.',
    explanation: 'Du fährst auf der Vorfahrtsstraße (Zeichen 306). Das gelbe Auto hat „Vorfahrt gewähren" (Zeichen 205) und muss warten — obwohl es von rechts kommt.',
    rule: 'Zeichen 306 · Vorfahrtsstraße'
  },
  {
    id: 'yield', title: 'Vorfahrt gewähren', free: false,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'W', turn: 'straight', color: CAR_COLORS.gruen, name: 'Grünes Auto' }],
    signs: { S: 'yield', N: 'yield', E: 'priority', W: 'priority' },
    lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Wer steht hier auf der Vorfahrtsstraße?',
    explanation: 'Du hast Zeichen 205 („Vorfahrt gewähren"). Der Querverkehr auf der Vorfahrtsstraße fährt zuerst — auch wenn er von links kommt. Rechts vor links gilt nur ohne Schilder.',
    rule: 'Zeichen 205 · Vorfahrt gewähren'
  },
  {
    id: 'rvl3', title: 'Drei an der Kreuzung', free: false,
    playerTurn: 'straight',
    cars: [
      { id: 'A', arm: 'E', turn: 'straight', color: CAR_COLORS.rot, name: 'Rotes Auto' },
      { id: 'B', arm: 'W', turn: 'straight', color: CAR_COLORS.blau, name: 'Blaues Auto' }
    ],
    signs: {}, lights: null, ped: null,
    order: ['A', 'player', 'B'],
    hint: 'Rechts vor links — reihum gedacht.',
    explanation: 'Rechts vor links, reihum aufgelöst: Das rote Auto hat rechts frei und fährt zuerst. Danach bist du dran, zuletzt fährt das blaue Auto von links.',
    rule: '§ 8 StVO · Rechts vor links'
  },
  {
    id: 'stop', title: 'Stoppschild', free: false,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'W', turn: 'straight', color: CAR_COLORS.weiss, name: 'Weißes Auto' }],
    signs: { S: 'stop', N: 'stop', E: 'priority', W: 'priority' },
    lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'STOP heißt: anhalten — und dann?',
    explanation: 'Am Stoppschild (Zeichen 206) musst du an der Haltlinie vollständig anhalten und Vorfahrt gewähren. Das weiße Auto auf der Vorfahrtsstraße fährt zuerst.',
    rule: 'Zeichen 206 · Halt. Vorfahrt gewähren.'
  },
  {
    id: 'ampel', title: 'Grün — aber Linksabbieger', free: false,
    playerTurn: 'left',
    cars: [{ id: 'A', arm: 'N', turn: 'straight', color: CAR_COLORS.lila, name: 'Lila Auto' }],
    signs: {}, lights: { S: 'green', N: 'green', E: 'red', W: 'red' }, ped: null,
    order: ['A', 'player'],
    hint: 'Ihr habt beide Grün. Du willst links abbiegen …',
    explanation: 'Ihr habt beide Grün. Als Linksabbieger musst du den entgegenkommenden Geradeaus- und Rechtsverkehr durchfahren lassen (§ 9 Abs. 3 StVO) — erst dann darfst du abbiegen.',
    rule: '§ 9 Abs. 3 StVO · Linksabbiegen'
  },
  {
    id: 'bend', title: 'Abknickende Vorfahrt', free: false,
    playerTurn: 'left',
    cars: [{ id: 'A', arm: 'N', turn: 'straight', color: CAR_COLORS.gelb, name: 'Gelbes Auto' }],
    // Die Vorfahrtsstraße verläuft von Süden nach Westen: dort 306, an den anderen Armen 205 —
    // jeweils mit dem Zusatzzeichen aus Sicht des Fahrers an diesem Arm.
    signs: { S: 'priority-bend', W: 'priority-bend', N: 'yield-bend', E: 'yield-bend' },
    bendCourse: ['S', 'W'],
    lights: null, ped: null,
    order: ['player', 'A'],
    hint: 'Das Zusatzzeichen zeigt den Verlauf der Vorfahrtsstraße.',
    explanation: 'Die Vorfahrtsstraße knickt hier nach links ab (Zeichen 306 mit Zusatzzeichen). Du folgst ihrem Verlauf und hast Vorfahrt — musst aber blinken! Das Auto von vorne kommt aus einer untergeordneten Straße (Zeichen 205) und wartet.',
    rule: 'Zeichen 306 + Zusatzzeichen 1002'
  },
  {
    id: 'zebra', title: 'Zebrastreifen', free: false,
    playerTurn: 'right',
    cars: [],
    signs: { S: 'zebra' }, lights: null,
    ped: { arm: 'E' },
    order: ['ped', 'player'],
    hint: 'Beim Abbiegen: Wer ist am Überweg unterwegs?',
    explanation: 'Am Zebrastreifen (Zeichen 350) haben Fußgänger Vorrang (§ 26 StVO). Beim Abbiegen musst du warten, bis die Person die Fahrbahn vollständig überquert hat.',
    rule: '§ 26 StVO · Fußgängerüberweg'
  },
  {
    id: 'blau', title: 'Blaulicht', free: false,
    playerTurn: 'straight',
    cars: [
      { id: 'P', arm: 'W', turn: 'straight', police: true, name: 'Polizei' },
      { id: 'A', arm: 'E', turn: 'straight', color: CAR_COLORS.gelb, name: 'Gelbes Auto' }
    ],
    signs: {}, lights: null, ped: null,
    order: ['P', 'A', 'player'],
    hint: 'Blaulicht und Martinshorn schlagen jede Regel.',
    explanation: 'Blaulicht mit Martinshorn bedeutet: sofort freie Bahn schaffen (§ 38 StVO) — das gilt vor allen Vorfahrtsregeln. Erst danach wird die Kreuzung normal nach rechts vor links aufgelöst.',
    rule: '§ 38 StVO · Wegerecht'
  },
  {
    id: 'rvl-links', title: 'Linksabbieger ohne Schilder', free: false,
    playerTurn: 'left',
    cars: [{ id: 'A', arm: 'N', turn: 'straight', color: CAR_COLORS.lila, name: 'Lila Auto' }],
    signs: {}, lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Du willst links — wer kommt dir entgegen?',
    explanation: 'Auch ohne Schilder gilt: Wer links abbiegt, muss den entgegenkommenden Verkehr zuerst durchfahren lassen (§ 9 Abs. 3 StVO). Das lila Auto fährt geradeaus und hat Vorrang.',
    rule: '§ 9 Abs. 3 StVO · Linksabbiegen'
  },
  {
    id: 'rvl-abbieger', title: 'Abbieger von rechts', free: false,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'E', turn: 'right', color: CAR_COLORS.rot, name: 'Rotes Auto' }],
    signs: {}, lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Rechts vor links gilt auch für Abbieger.',
    explanation: 'Das rote Auto kommt von rechts — rechts vor links gilt unabhängig davon, wohin es abbiegen möchte (der Blinker verrät es dir). Es fährt zuerst, du folgst.',
    rule: '§ 8 StVO · Rechts vor links'
  },
  {
    id: 'bike-rechts', title: 'Radweg beim Abbiegen', free: false,
    playerTurn: 'right',
    cars: [{ id: 'B', arm: 'S', turn: 'straight', bike: true, color: 0x3b74c4, name: 'Radfahrer' }],
    signs: {}, lights: null, ped: null,
    order: ['B', 'player'],
    hint: 'Blick über die Schulter: Wer fährt neben dir geradeaus?',
    explanation: 'Beim Rechtsabbiegen musst du Radfahrer, die neben dir geradeaus weiterfahren wollen, zuerst durchfahren lassen (§ 9 Abs. 3 StVO). Schulterblick nicht vergessen!',
    rule: '§ 9 Abs. 3 StVO · Schulterblick'
  },
  {
    id: 'bike-rvl', title: 'Fahrrad von rechts', free: false,
    playerTurn: 'straight',
    cars: [{ id: 'B', arm: 'E', turn: 'straight', bike: true, color: 0xe07b39, name: 'Radfahrer' }],
    signs: {}, lights: null, ped: null,
    order: ['B', 'player'],
    hint: 'Gilt rechts vor links auch für Fahrräder?',
    explanation: 'Ja — Fahrräder sind Fahrzeuge. Der Radfahrer kommt von rechts und hat Vorfahrt (§ 8 StVO). Unterschätze seine Geschwindigkeit nicht.',
    rule: '§ 8 StVO · Rechts vor links'
  },
  {
    id: 'prio-links', title: 'Vorfahrtsstraße — links ab', free: false,
    playerTurn: 'left',
    cars: [{ id: 'A', arm: 'N', turn: 'straight', color: CAR_COLORS.gelb, name: 'Gelbes Auto' }],
    signs: { S: 'priority', N: 'priority', E: 'yield', W: 'yield' },
    lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Vorfahrt heißt nicht: freie Fahrt beim Abbiegen.',
    explanation: 'Ihr seid beide auf der Vorfahrtsstraße. Als Linksabbieger musst du den Gegenverkehr trotzdem zuerst durchfahren lassen (§ 9 Abs. 3 StVO) — die Vorfahrtsstraße schützt dich nur vor dem Querverkehr.',
    rule: '§ 9 Abs. 3 StVO · Linksabbiegen'
  },
  {
    id: 'stop-links', title: 'Stopp & links abbiegen', free: false,
    playerTurn: 'left',
    cars: [{ id: 'A', arm: 'N', turn: 'straight', color: CAR_COLORS.weiss, name: 'Weißes Auto' }],
    signs: { S: 'stop', N: 'stop', E: 'priority', W: 'priority' },
    lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Nach dem Halt gelten die normalen Regeln.',
    explanation: 'Beide müsst ihr am Stoppschild anhalten. Danach gelten die normalen Regeln: Als Linksabbieger lässt du den Gegenverkehr zuerst fahren (§ 9 Abs. 3 StVO).',
    rule: 'Zeichen 206 + § 9 StVO'
  },
  {
    id: 'ampel-rot', title: 'Rote Ampel', free: false,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'E', turn: 'straight', color: CAR_COLORS.blau, name: 'Blaues Auto' }],
    signs: {}, lights: { S: 'red', N: 'red', E: 'green', W: 'green' }, ped: null,
    switchGreen: true,
    order: ['A', 'player'],
    hint: 'Deine Ampel zeigt Rot.',
    explanation: 'Bei Rot musst du an der Haltlinie warten (§ 37 StVO). Der Querverkehr hat Grün und fährt zuerst — du darfst erst bei Grün losfahren. Achte auf die Rot-Gelb-Phase.',
    rule: '§ 37 StVO · Rot'
  },
  {
    id: 'ampel-blink', title: 'Ampel ausgefallen', free: false,
    playerTurn: 'straight',
    cars: [{ id: 'A', arm: 'W', turn: 'straight', color: CAR_COLORS.gruen, name: 'Grünes Auto' }],
    signs: { S: 'yield', N: 'yield', E: 'priority', W: 'priority' },
    lights: { S: 'blink', N: 'blink', E: 'blink', W: 'blink' }, ped: null,
    order: ['A', 'player'],
    hint: 'Gelbes Blinken: Welche Regel gilt jetzt?',
    explanation: 'Blinkt die Ampel gelb, ist sie außer Betrieb — jetzt gelten die Verkehrszeichen (§ 37 StVO). Du hast „Vorfahrt gewähren", das grüne Auto ist auf der Vorfahrtsstraße und fährt zuerst.',
    rule: '§ 37 StVO + Zeichen 205'
  },
  {
    id: 'zebra-direkt', title: 'Zebrastreifen voraus', free: false,
    playerTurn: 'straight', playerStopExtra: 2.4,
    cars: [],
    signs: { S: 'zebra' }, lights: null,
    ped: { arm: 'S' },
    order: ['ped', 'player'],
    hint: 'Direkt vor dir ist ein Überweg.',
    explanation: 'Am Zebrastreifen haben Fußgänger Vorrang (§ 26 StVO) — auch wenn du geradeaus fährst. Halte an und warte, bis die Person die Fahrbahn vollständig überquert hat.',
    rule: '§ 26 StVO · Fußgängerüberweg'
  },
  {
    id: 'blau-gegen', title: 'Blaulicht von vorne', free: false,
    playerTurn: 'straight',
    cars: [{ id: 'P', arm: 'N', turn: 'left', police: true, name: 'Polizei' }],
    signs: {}, lights: null, ped: null,
    order: ['P', 'player'],
    hint: 'Eigentlich hättest du Vorfahrt …',
    explanation: 'Normalerweise wartet der abbiegende Gegenverkehr auf dich — aber mit Blaulicht und Martinshorn hat der Streifenwagen Wegerecht (§ 38 StVO). Er biegt zuerst ab, du wartest.',
    rule: '§ 38 StVO · Wegerecht'
  }
,
  /* ---------- T-Einmündungen ----------
     `layout` blendet einen Arm aus (siehe world.js/LAYOUTS). Bei 'T-N' steht
     der Spieler am Stamm und kann nicht geradeaus — bei 'T-E'/'T-W' fährt er
     auf der Durchgangsstraße und die Seitenstraße mündet ein. */
  {
    id: 't-rvl', title: 'Einmündung ohne Schilder', free: false, layout: 'T-N',
    playerTurn: 'right',
    cars: [{ id: 'A', arm: 'W', turn: 'straight', color: CAR_COLORS.blau, name: 'Blaues Auto' }],
    signs: {}, lights: null, ped: null,
    order: ['player', 'A'],
    hint: 'Kleine Straße heißt nicht automatisch „warten" — schau nach Schildern.',
    explanation: 'Hier steht kein einziges Schild. Dann gilt auch an einer Einmündung rechts vor links (§ 8 StVO) — die einmündende Straße ist nicht automatisch untergeordnet. Das blaue Auto kommt von deiner linken Seite, also darfst du zuerst fahren.',
    rule: '§ 8 StVO · Rechts vor links'
  },
  {
    id: 't-yield', title: 'Einmündung mit Zeichen 205', free: false, layout: 'T-N',
    playerTurn: 'right',
    cars: [{ id: 'A', arm: 'W', turn: 'straight', color: CAR_COLORS.gruen, name: 'Grünes Auto' }],
    signs: { S: 'yield', E: 'priority', W: 'priority' }, lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Vergleiche mit der Einmündung ohne Schilder — was ändert das Schild?',
    explanation: 'Jetzt steht an deinem Stamm Zeichen 205 „Vorfahrt gewähren". Damit ist deine Straße untergeordnet: Du musst den Verkehr auf der Durchgangsstraße durchlassen — egal, ob er von rechts oder von links kommt.',
    rule: 'Zeichen 205 · Vorfahrt gewähren'
  },
  {
    id: 't-stop', title: 'Stopp an der Einmündung', free: false, layout: 'T-N',
    playerTurn: 'left',
    cars: [{ id: 'A', arm: 'E', turn: 'straight', color: CAR_COLORS.rot, name: 'Rotes Auto' }],
    signs: { S: 'stop', E: 'priority', W: 'priority' }, lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Du willst nach links — wie viele Richtungen musst du beachten?',
    explanation: 'Zeichen 206 verlangt: an der Haltlinie vollständig anhalten, dann Vorfahrt gewähren. Beim Linksabbiegen kreuzt du beide Fahrtrichtungen der Durchgangsstraße — das rote Auto von rechts fährt zuerst.',
    rule: 'Zeichen 206 · Halt. Vorfahrt gewähren'
  },
  {
    id: 't-links', title: 'Links in die Seitenstraße', free: false, layout: 'T-E',
    playerTurn: 'left',
    cars: [{ id: 'A', arm: 'N', turn: 'straight', color: CAR_COLORS.gelb, name: 'Gelbes Auto' }],
    signs: {}, lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Diesmal bist du auf der durchgehenden Straße — wer stört dich beim Abbiegen?',
    explanation: 'Du biegst von der durchgehenden Straße nach links in die Seitenstraße ab. Wer abbiegt, muss den entgegenkommenden Verkehr durchlassen (§ 9 Abs. 3 StVO) — das gelbe Auto fährt geradeaus und damit zuerst.',
    rule: '§ 9 Abs. 3 StVO · Abbiegen'
  }
,
  /* ---------- Kreisverkehr ----------
     `layout: 'circle'` ersetzt die Kreuzungsfläche durch den Ring. Fahrzeuge
     brauchen `exit` (Ausfahrt-Arm); `inCircle: true` setzt sie bereits in den
     Kreis — dann haben sie Vorfahrt. `turn` steuert nur noch den Blinker. */
  {
    id: 'kv-einfahrt', title: 'Einfahrt in den Kreisverkehr', free: false, layout: 'circle',
    playerTurn: 'right', playerExit: 'E',
    cars: [{ id: 'A', arm: 'W', exit: 'N', inCircle: true, turn: 'right', color: CAR_COLORS.rot, name: 'Rotes Auto' }],
    signs: { S: 'yield-round', N: 'yield-round', E: 'yield-round', W: 'yield-round' },
    lights: null, ped: null,
    order: ['A', 'player'],
    hint: 'Wer ist schon im Kreis — und was heißt das für dich?',
    explanation: 'Am Kreisverkehr steht Zeichen 215 zusammen mit Zeichen 205: Wer einfährt, muss dem Verkehr im Kreis Vorfahrt gewähren. Das rote Auto ist bereits im Kreisverkehr und fährt zuerst. Geblinkt wird erst beim Verlassen des Kreises.',
    rule: 'Zeichen 215 + 205 · Kreisverkehr'
  },
  {
    id: 'kv-drin', title: 'Du bist schon im Kreis', free: false, layout: 'circle',
    playerTurn: 'right', playerExit: 'W', playerInCircle: true,
    cars: [{ id: 'A', arm: 'E', exit: 'N', turn: 'right', color: CAR_COLORS.blau, name: 'Blaues Auto' }],
    signs: { S: 'yield-round', N: 'yield-round', E: 'yield-round', W: 'yield-round' },
    lights: null, ped: null,
    order: ['player', 'A'],
    hint: 'Diesmal bist du schon drin — wer muss jetzt warten?',
    explanation: 'Jetzt bist du im Kreisverkehr und hast Vorfahrt. Das blaue Auto steht an der Zufahrt und muss dich durchlassen. Du blinkst rechts, weil du den Kreis verlässt — im Kreisverkehr wird nur beim Ausfahren geblinkt.',
    rule: 'Zeichen 215 + 205 · Vorfahrt im Kreis'
  },
  {
    id: 'kv-zebra', title: 'Zebrastreifen an der Ausfahrt', free: false, layout: 'circle',
    playerTurn: 'right', playerExit: 'N', playerInCircle: true,
    cars: [],
    signs: { S: 'yield-round', E: 'yield-round', W: 'yield-round' },
    lights: null, ped: { arm: 'N' },
    order: ['ped', 'player'],
    hint: 'Vorfahrt im Kreis heißt nicht Vorrang gegenüber allen.',
    explanation: 'Deine Vorfahrt gilt gegenüber den einfahrenden Fahrzeugen — nicht gegenüber Fußgängern. Am Zebrastreifen hinter der Ausfahrt hat der Fußgänger Vorrang (§ 26 StVO): Du musst ihn queren lassen.',
    rule: '§ 26 StVO · Fußgängerüberweg'
  }
];

/* ---------- Wissensfragen — jede mit inszenierter 3D-Szene ----------
   scene: { cars, peds, triangle, light, zebra, cam } — die Situation wird
   erst einige Sekunden gezeigt, dann kommt die Frage. */

const PI = Math.PI;

export const QUIZ = [
  {
    id: 'q-winter', kind: 'quiz', free: true, title: 'Winterreifen', env: 'snow',
    q: 'Schnee auf der Straße — womit darfst du jetzt fahren?',
    scene: {
      cam: { f: [0, -2], r: 16, h: 7 },
      cars: [
        { x: 1.7, z: 16, rot: PI, color: CAR_COLORS.blau, drive: { to: [1.7, -34], dur: 8 } },
        { x: -1.7, z: -26, rot: 0, color: CAR_COLORS.weiss, drive: { to: [-1.7, 30], dur: 9 } }
      ]
    },
    options: [
      { t: 'Nur mit Winterreifen (Alpine-Symbol)', ok: true },
      { t: 'Mit Sommerreifen, wenn ich vorsichtig fahre' },
      { t: 'Mit jedem Reifen ab 1,6 mm Profil' }
    ],
    explanation: 'Bei Schnee, Glätte oder Reif gilt die situative Winterreifenpflicht (§ 2 Abs. 3a StVO): fahren nur mit Winterreifen (Alpine-Symbol). Mit Sommerreifen drohen Bußgeld und Punkte — und deine Versicherung kann Leistungen kürzen.',
    rule: '§ 2 StVO · Winterreifenpflicht'
  },
  {
    id: 'q-unfall', kind: 'quiz', free: true, title: 'Erster am Unfallort',
    q: 'Du kommst als Erster zu diesem Unfall mit Verletzten. Was ist die richtige Reihenfolge?',
    scene: {
      cam: { f: [0.5, 5], r: 17, h: 9, a: PI / 2 - 0.3 },
      cars: [
        { x: 0.5, z: 0.8, rot: 2.45, color: CAR_COLORS.rot },
        { x: -1.6, z: -1.4, rot: 0.55, color: CAR_COLORS.blau, blinker: 'B' }
      ],
      triangle: { x: 1.7, z: 13, rot: PI },
      peds: [{ x: 3.1, z: 2.6, rot: -1.9 }]
    },
    options: [
      { t: 'Absichern → Notruf 112 → Erste Hilfe', ok: true },
      { t: 'Sofort Erste Hilfe, alles andere danach' },
      { t: 'Fotografieren und auf die Polizei warten' }
    ],
    explanation: 'Erst die Unfallstelle absichern (Warnblinker an, Warnweste, Warndreieck aufstellen), dann Notruf 112, dann Erste Hilfe (§ 34 StVO). Wer sich selbst in Gefahr bringt, kann niemandem mehr helfen.',
    rule: '§ 34 StVO · Verhalten bei Unfall'
  },
  {
    id: 'q-warndreieck', kind: 'quiz', free: false, title: 'Warndreieck',
    q: 'Panne auf der Landstraße: In welchem Abstand stellst du das Warndreieck auf?',
    scene: {
      cam: { f: [2.5, 19], r: 16, h: 8, a: PI / 2 - 0.15, sway: 0.25 },
      cars: [
        { x: 2.75, z: 14, rot: PI, color: CAR_COLORS.gelb, blinker: 'B' },
        { x: -1.7, z: -20, rot: 0, color: CAR_COLORS.weiss, drive: { to: [-1.7, 30], dur: 7 } }
      ],
      triangle: { x: 2.75, z: 27, rot: PI },
      peds: [{ x: 4.5, z: 13, rot: 1.6 }]
    },
    options: [
      { t: 'Etwa 100 Meter', ok: true },
      { t: 'Etwa 20 Meter' },
      { t: 'Direkt hinter dem Auto' }
    ],
    explanation: 'Auf der Landstraße ca. 100 m Abstand, auf der Autobahn deutlich mehr (150–400 m) — der Verkehr braucht Zeit zum Reagieren. Vorher Warnblinker an und Warnweste anziehen.',
    rule: '§ 15 StVO · Liegenbleiben'
  },
  {
    id: 'q-nebel', kind: 'quiz', free: false, title: 'Dichter Nebel', env: 'fog',
    q: 'Die Sichtweite liegt unter 50 Metern. Wie schnell darfst du höchstens fahren?',
    scene: {
      cam: { f: [0, 0], r: 13, h: 6 },
      cars: [
        { x: 1.7, z: 10, rot: PI, color: CAR_COLORS.weiss, drive: { to: [1.7, -26], dur: 9 } },
        { x: -1.7, z: -14, rot: 0, color: CAR_COLORS.rot, drive: { to: [-1.7, 24], dur: 10 } }
      ]
    },
    options: [
      { t: '50 km/h', ok: true },
      { t: '80 km/h' },
      { t: 'So schnell wie das Auto vor mir' }
    ],
    explanation: 'Unter 50 m Sichtweite gilt: höchstens 50 km/h (§ 3 StVO) — und erst jetzt darfst du die Nebelschlussleuchte einschalten. Merksatz: Sicht unter 50 → Tempo 50.',
    rule: '§ 3 StVO · Sichtweite'
  },
  {
    id: 'q-aqua', kind: 'quiz', free: false, title: 'Aquaplaning', env: 'rain',
    q: 'Starkregen — das Auto „schwimmt" plötzlich auf. Was ist jetzt richtig?',
    scene: {
      cam: { f: [1, -2], r: 15, h: 7 },
      cars: [
        { x: 1.7, z: 20, rot: PI, color: CAR_COLORS.lila, drive: { to: [1.7, -30], dur: 5 } }
      ]
    },
    options: [
      { t: 'Auskuppeln, Lenkrad ruhig halten, nicht bremsen', ok: true },
      { t: 'Kräftig bremsen' },
      { t: 'Schnell hin- und herlenken' }
    ],
    explanation: 'Bei Aquaplaning haben die Reifen keinen Fahrbahnkontakt: Gas weg, auskuppeln, Lenkrad gerade halten. Bremsen und Lenken wirken erst wieder, wenn die Reifen greifen.',
    rule: 'Fahrphysik · Aquaplaning'
  },
  {
    id: 'q-glaette', kind: 'quiz', free: false, title: 'Glatteis', env: 'snow',
    q: 'Das Heck dieses Autos ist auf Glatteis ausgebrochen. Wie reagiert man richtig?',
    scene: {
      cam: { f: [0, 3], r: 14, h: 7 },
      cars: [
        { x: 0.5, z: 5, rot: PI + 1.0, color: CAR_COLORS.rot, blinker: 'B' },
        { x: -1.7, z: -24, rot: 0, color: CAR_COLORS.weiss, drive: { to: [-1.7, 22], dur: 10 } }
      ]
    },
    options: [
      { t: 'Auskuppeln und vorsichtig gegenlenken', ok: true },
      { t: 'Voll bremsen' },
      { t: 'Beschleunigen, um Stabilität zu gewinnen' }
    ],
    explanation: 'Auskuppeln und behutsam gegenlenken — ruckartiges Bremsen oder Gas macht das Schleudern schlimmer. Vorausschauend fahren: Auf Glätte gilt doppelter Abstand und sanftes Fahren.',
    rule: 'Fahrphysik · Glätte'
  },
  {
    id: 'q-gasse', kind: 'quiz', free: false, title: 'Rettungsgasse',
    q: 'Der Verkehr stockt, ein Einsatzfahrzeug naht. Wann muss die Rettungsgasse gebildet werden?',
    scene: {
      world: 'autobahn',
      cam: { f: [0, 16], r: 18, h: 9, a: PI / 2 - 0.3, sway: 0.3 },
      cars: [
        { x: -2.95, z: 12, rot: PI, color: CAR_COLORS.blau },
        { x: -2.95, z: 20, rot: PI, color: CAR_COLORS.gruen },
        { x: -2.95, z: 28, rot: PI, color: CAR_COLORS.weiss },
        { x: 2.95, z: 8, rot: PI, color: CAR_COLORS.gelb },
        { x: 2.95, z: 16, rot: PI, color: CAR_COLORS.rot },
        { x: 2.95, z: 24, rot: PI, color: CAR_COLORS.lila },
        { x: 0, z: 36, rot: PI, police: true, drive: { to: [0, -30], dur: 7 } }
      ]
    },
    options: [
      { t: 'Sofort, sobald der Verkehr stockt', ok: true },
      { t: 'Erst, wenn ich Blaulicht im Spiegel sehe' },
      { t: 'Nur, wenn die Polizei dazu auffordert' }
    ],
    explanation: 'Die Rettungsgasse wird sofort gebildet, sobald der Verkehr stockt (§ 11 Abs. 2 StVO): ganz linke Spur nach links, alle anderen nach rechts. Wenn das Blaulicht kommt, ist es zu spät.',
    rule: '§ 11 StVO · Rettungsgasse'
  },
  {
    id: 'q-gelb', kind: 'quiz', free: false, title: 'Gelbe Ampel',
    q: 'Die Ampel springt auf Gelb — das blaue Auto kann noch sicher anhalten. Was ist richtig?',
    scene: {
      cam: { f: [1.5, 7], r: 13, h: 6, a: PI / 2 - 0.2, sway: 0.25 },
      light: { arm: 'S', state: 'yellow' },
      cars: [
        { x: 1.7, z: 8.6, rot: PI, color: CAR_COLORS.blau },
        { x: 1.7, z: 16, rot: PI, color: CAR_COLORS.weiss }
      ]
    },
    options: [
      { t: 'Anhalten und auf Grün warten', ok: true },
      { t: 'Beschleunigen und noch durchfahren' },
      { t: 'Langsam in die Kreuzung rollen' }
    ],
    explanation: 'Gelb bedeutet: vor der Kreuzung auf das nächste Zeichen warten (§ 37 StVO). Wer noch sicher halten kann, muss halten — „Gas geben bei Gelb" kostet Bußgeld und ist ein häufiger Unfallgrund.',
    rule: '§ 37 StVO · Gelbphase'
  },
  {
    id: 'q-regen', kind: 'quiz', free: false, title: 'Bremsweg bei Regen', env: 'rain',
    q: 'Regennasse Fahrbahn: Was passiert mit dem Bremsweg dieser Autos?',
    scene: {
      cam: { f: [1, -4], r: 15, h: 7 },
      cars: [
        { x: 1.7, z: 2, rot: PI, color: CAR_COLORS.gruen, drive: { to: [1.7, -34], dur: 6 } },
        { x: 1.7, z: 14, rot: PI, color: CAR_COLORS.rot, drive: { to: [1.7, -22], dur: 6 } }
      ]
    },
    options: [
      { t: 'Er wird deutlich länger — mehr Abstand halten', ok: true },
      { t: 'Er bleibt gleich' },
      { t: 'Er wird kürzer, weil Wasser bremst' }
    ],
    explanation: 'Auf nasser Fahrbahn verlängert sich der Bremsweg deutlich. Deshalb: Geschwindigkeit runter und Abstand vergrößern (§ 4 StVO) — mindestens „halber Tacho" in Metern, bei Nässe mehr.',
    rule: '§ 4 StVO · Abstand'
  }
];

/* ---------- Fahrsimulator: selbst fahren, Fehler lösen den Alarm aus ---------- */

export const SIMS = [
  {
    id: 'sim-rvl', tier: 'easy', kind: 'sim', free: true, title: 'Rechts vor links',
    task: 'Fahre über die Kreuzung — beachte rechts vor links!',
    signs: {}, lights: null, ped: null,
    hazards: [{ id: 'H', arm: 'E', color: CAR_COLORS.rot, trigger: 26 }],
    rule: '§ 8 StVO · Rechts vor links',
    explanation: 'Sauber gefahren! Du hast das Auto von rechts zuerst fahren lassen — genau das verlangt rechts vor links.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Das rote Auto kam von rechts — bei „rechts vor links" musst du es zuerst fahren lassen.',
      crash: 'Kollision! Du bist in ein vorfahrtsberechtigtes Fahrzeug gefahren. Erst schauen, dann fahren.'
    }
  },
  {
    id: 'sim-yield', tier: 'easy', kind: 'sim', free: true, title: 'Vorfahrt gewähren',
    task: 'Du hast „Vorfahrt gewähren" — lass den Querverkehr durch!',
    signs: { S: 'yield', N: 'yield', E: 'priority', W: 'priority' }, lights: null, ped: null,
    hazards: [{ id: 'H', arm: 'W', color: CAR_COLORS.gruen, trigger: 26 }],
    rule: 'Zeichen 205 · Vorfahrt gewähren',
    explanation: 'Stark! Du hast den Verkehr auf der Vorfahrtsstraße zuerst fahren lassen — auch wenn er von links kam.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Bei Zeichen 205 musst du den Verkehr auf der Vorfahrtsstraße zuerst fahren lassen — auch von links.',
      crash: 'Kollision! Das Auto auf der Vorfahrtsstraße hatte Vorfahrt — du musst warten, bis die Straße frei ist.'
    }
  },
  {
    id: 'sim-stop', tier: 'easy', kind: 'sim', free: true, title: 'Stoppschild',
    task: 'STOP: Halte an der Haltlinie vollständig an, dann fahre weiter.',
    signs: { S: 'stop', N: 'stop', E: 'priority', W: 'priority' }, lights: null, ped: null,
    needStop: true,
    hazards: [{ id: 'H', arm: 'W', color: CAR_COLORS.weiss, trigger: 26 }],
    rule: 'Zeichen 206 · Halt. Vorfahrt gewähren.',
    explanation: 'Perfekt: vollständig angehalten und die Vorfahrtsstraße freigegeben — genau so besteht man die Prüfung.',
    mistakes: {
      stop: 'Stoppschild überfahren! Am Zeichen 206 musst du an der Haltlinie vollständig anhalten — auch wenn alles frei aussieht.',
      yield: 'Vorfahrt missachtet! Nach dem Anhalten gilt: Der Verkehr auf der Vorfahrtsstraße fährt zuerst.',
      crash: 'Kollision! Anhalten allein reicht nicht — du darfst erst fahren, wenn die Vorfahrtsstraße frei ist.'
    }
  },
  {
    id: 'sim-ampel', tier: 'easy', kind: 'sim', free: true, title: 'Rote Ampel',
    task: 'Deine Ampel ist rot: Halte an der Haltlinie und warte auf Grün.',
    signs: {}, lights: { S: 'red', N: 'red', E: 'green', W: 'green' }, ped: null,
    lightCycle: true,
    hazards: [{ id: 'H', arm: 'E', color: CAR_COLORS.blau, autostart: true }],
    rule: '§ 37 StVO · Rot',
    explanation: 'Genau richtig: bei Rot gewartet, bei Grün losgefahren. Die Rot-Gelb-Phase kündigt das Grün an.',
    mistakes: {
      red: 'Rotlichtverstoß! Bei Rot musst du an der Haltlinie warten, bis die Ampel Grün zeigt — das kostet mindestens 90 € und einen Punkt.',
      yield: 'Zu früh! Die Kreuzung war noch nicht frei — fahre erst los, wenn der Querverkehr durch ist.',
      crash: 'Kollision! Der Querverkehr hatte Grün — bei Rot wird an der Haltlinie gewartet.'
    }
  },
  {
    id: 'sim-zebra', tier: 'easy', kind: 'sim', free: false, title: 'Zebrastreifen',
    task: 'Vor dir liegt ein Zebrastreifen — achte auf Fußgänger!',
    signs: { S: 'zebra' }, lights: null, ped: { arm: 'S' },
    pedTrigger: 20,
    rule: '§ 26 StVO · Fußgängerüberweg',
    explanation: 'Vorbildlich! Du hast gewartet, bis die Person die Fahrbahn vollständig überquert hat.',
    mistakes: {
      zebra: 'Fußgänger gefährdet! Am Zebrastreifen haben Fußgänger Vorrang — du musst anhalten, bis die Fahrbahn frei ist.',
      crash: 'Du hast einen Fußgänger angefahren! Am Zebrastreifen musst du anhalten und warten — immer.'
    }
  },
  {
    id: 'sim-blau', tier: 'easy', kind: 'sim', free: false, title: 'Blaulicht',
    task: 'Blaulicht und Martinshorn: Schaffe sofort freie Bahn!',
    signs: {}, lights: null, ped: null,
    hazards: [{ id: 'P', arm: 'W', police: true, trigger: 28 }],
    rule: '§ 38 StVO · Wegerecht',
    explanation: 'Richtig reagiert: Einsatzfahrzeuge mit Blaulicht und Martinshorn haben Wegerecht — alle anderen warten.',
    mistakes: {
      yield: 'Einsatzfahrzeug behindert! Bei Blaulicht mit Martinshorn musst du sofort freie Bahn schaffen (§ 38 StVO) — auch wenn du eigentlich Vorfahrt hättest.',
      crash: 'Kollision mit dem Einsatzfahrzeug! Blaulicht und Martinshorn schlagen jede Vorfahrtsregel.'
    }
  },
  {
    id: 'sim-prio', tier: 'easy', kind: 'sim', free: true, title: 'Du hast Vorfahrt',
    task: 'Du bist auf der Vorfahrtsstraße — fahre zügig durch.',
    signs: { S: 'priority', N: 'priority', E: 'yield', W: 'yield' }, lights: null, ped: null,
    hazards: [{ id: 'H', arm: 'E', color: CAR_COLORS.gelb, trigger: 30, yields: true }],
    rule: 'Zeichen 306 · Vorfahrtsstraße',
    explanation: 'Gut gemacht! Du hast hier Vorfahrt — unnötiges Zögern verwirrt die anderen. Das gelbe Auto muss auf dich warten.',
    mistakes: {
      crash: 'Kollision! Auch mit Vorfahrt musst du die Kreuzung beobachten — erzwinge deine Vorfahrt niemals.'
    }
  },
  {
    id: 'sim-rvl2', tier: 'medium', kind: 'sim', free: false, title: 'Rechts vor links II',
    task: 'Zwei Autos an der Kreuzung — wer muss auf wen warten?',
    signs: {}, lights: null, ped: null,
    hazards: [
      { id: 'H', arm: 'E', color: CAR_COLORS.rot, trigger: 26 },
      { id: 'H2', arm: 'W', color: CAR_COLORS.blau, trigger: 30, yields: true }
    ],
    rule: '§ 8 StVO · Rechts vor links',
    explanation: 'Perfekt aufgelöst! Das rote Auto von rechts fuhr zuerst — und das blaue Auto von links hat auf dich gewartet.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Das rote Auto kam von rechts — es fährt vor dir. Das blaue Auto von links wartet auf dich.',
      crash: 'Kollision! Behalte beide Richtungen im Blick: rechts fährt zuerst, links wartet auf dich.'
    }
  },
  {
    id: 'sim-gruen-blau', tier: 'medium', kind: 'sim', free: false, title: 'Grün — aber Martinshorn',
    task: 'Deine Ampel ist grün — aber horch! Schaffe dem Einsatzfahrzeug freie Bahn.',
    signs: {}, lights: { S: 'green', N: 'green', E: 'red', W: 'red' }, ped: null,
    hazards: [{ id: 'P', arm: 'E', police: true, autostart: true }],
    rule: '§ 38 StVO · Wegerecht',
    explanation: 'Genau richtig: Grün schlägt kein Blaulicht. § 38 steht über der Ampel.',
    mistakes: {
      yield: 'Einsatzfahrzeug behindert! Auch bei Grün musst du ein Fahrzeug mit Blaulicht und Martinshorn zuerst durchlassen.',
      crash: 'Kollision mit dem Einsatzfahrzeug! Grün hin oder her — Blaulicht fährt immer zuerst.'
    }
  },
  {
    id: 'sim-nebel', tier: 'hard', kind: 'sim', free: false, title: 'Nebel an der Kreuzung', env: 'fog',
    task: 'Dichter Nebel: Taste dich langsam heran — Querverkehr taucht spät auf!',
    signs: { S: 'yield', N: 'yield', E: 'priority', W: 'priority' }, lights: null, ped: null,
    hazards: [{ id: 'H', arm: 'W', color: CAR_COLORS.weiss, trigger: 24 }],
    rule: '§ 3 StVO · Sichtweite',
    explanation: 'Stark gefahren! Im Nebel rettet nur eine vorsichtige Annäherung — du hast den Querverkehr rechtzeitig erkannt.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Im Nebel musst du dich so langsam herantasten, dass du auf spät auftauchenden Verkehr reagieren kannst.',
      crash: 'Kollision im Nebel! Die Sicht war schlecht — nähere dich im Schritttempo und fahre erst, wenn wirklich frei ist.'
    }
  },
  {
    id: 'sim-regen', tier: 'hard', kind: 'sim', free: false, title: 'Stopp bei Regen', env: 'rain', slippery: true,
    task: 'Nasse Fahrbahn: Dein Bremsweg ist viel länger — halte an der Haltlinie!',
    signs: { S: 'stop', N: 'stop', E: 'priority', W: 'priority' }, lights: null, ped: null,
    needStop: true,
    hazards: [{ id: 'H', arm: 'W', color: CAR_COLORS.gelb, trigger: 26 }],
    rule: '§ 4 StVO + Zeichen 206',
    explanation: 'Stark! Du hast früh gebremst — auf nasser Fahrbahn wächst der Bremsweg massiv.',
    mistakes: {
      stop: 'Haltlinie überfahren! Auf nasser Fahrbahn musst du viel früher bremsen — der Bremsweg verdoppelt sich fast.',
      yield: 'Vorfahrt missachtet! Nach dem Anhalten gilt: Die Vorfahrtsstraße fährt zuerst.',
      crash: 'Kollision bei Nässe! Bremse früher und sanfter — Wasser verlängert den Bremsweg massiv.'
    }
  },
  /* ---- Mittel ---- */
  {
    id: 'sim-abbieger', tier: 'medium', kind: 'sim', free: false, title: 'Abbieger von rechts',
    task: 'Das Auto von rechts blinkt — Vorfahrt gilt trotzdem!',
    signs: {}, lights: null, ped: null,
    hazards: [{ id: 'H', arm: 'E', turn: 'right', color: CAR_COLORS.lila, trigger: 27 }],
    rule: '§ 8 StVO · Rechts vor links',
    explanation: 'Richtig! Auch ein Abbieger von rechts hat Vorfahrt — wohin er fährt, ändert nichts an rechts vor links.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Der Blinker ändert nichts: Das Auto von rechts fährt zuerst — egal wohin es abbiegt.',
      crash: 'Kollision mit dem Abbieger! Warte, bis er die Kreuzung vollständig verlassen hat.'
    }
  },
  {
    id: 'sim-bike', tier: 'medium', kind: 'sim', free: false, title: 'Radfahrer von rechts',
    task: 'Ein Radfahrer nähert sich — auch Räder haben Vorfahrt!',
    signs: {}, lights: null, ped: null,
    hazards: [{ id: 'B', arm: 'E', bike: true, color: 0xe07b39, trigger: 28 }],
    rule: '§ 8 StVO · Rechts vor links',
    explanation: 'Sauber! Fahrräder sind Fahrzeuge — der Radfahrer von rechts hatte Vorfahrt, und du hast gewartet.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Fahrräder sind Fahrzeuge — der Radfahrer von rechts fährt zuerst.',
      crash: 'Du hast einen Radfahrer angefahren! Radfahrer sind leicht zu übersehen und schneller als gedacht — immer doppelt schauen.'
    }
  },
  {
    id: 'sim-beide', tier: 'medium', kind: 'sim', free: false, title: 'Verkehr von beiden Seiten',
    task: '„Vorfahrt gewähren" — und es kommt von links UND rechts!',
    signs: { S: 'yield', N: 'yield', E: 'priority', W: 'priority' }, lights: null, ped: null,
    hazards: [
      { id: 'H', arm: 'E', color: CAR_COLORS.rot, trigger: 28 },
      { id: 'H2', arm: 'W', color: CAR_COLORS.gruen, trigger: 27, delay: 0.9 }
    ],
    rule: 'Zeichen 205 · Vorfahrt gewähren',
    explanation: 'Stark! Du hast beide Fahrzeuge auf der Vorfahrtsstraße durchgelassen — erst wenn wirklich frei ist, wird gefahren.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Nach dem ersten Auto kam noch eins — fahre erst, wenn BEIDE Richtungen frei sind.',
      crash: 'Kollision! Ein Blick reicht nicht: Prüfe links und rechts, bevor du in die Kreuzung fährst.'
    }
  },
  /* ---- Schwer ---- */
  {
    id: 'sim-zebra-auto', tier: 'hard', kind: 'sim', free: false, title: 'Zebrastreifen + Querverkehr',
    task: 'Erst der Fußgänger, dann der Querverkehr — zwei Prüfungen in einer!',
    signs: { S: 'zebra' }, lights: null, ped: { arm: 'S' },
    pedTrigger: 22,
    hazards: [{ id: 'H', arm: 'E', color: CAR_COLORS.blau, trigger: 14 }],
    rule: '§ 26 + § 8 StVO',
    explanation: 'Perfekt! Zebrastreifen freigegeben UND das Auto von rechts durchgelassen — genau so fährt man vorausschauend.',
    mistakes: {
      zebra: 'Fußgänger gefährdet! Erst kommt der Zebrastreifen — halte an, bevor du an den Querverkehr denkst.',
      yield: 'Vorfahrt missachtet! Nach dem Zebrastreifen kam noch das Auto von rechts — zwei Gefahren, zwei Mal schauen.',
      crash: 'Kollision! Diese Kreuzung hat zwei Prüfungen: Fußgänger UND Querverkehr. Nimm dir Zeit.'
    }
  },
  {
    id: 'sim-stop-beide', tier: 'hard', kind: 'sim', free: false, title: 'Stopp — beide Richtungen',
    task: 'STOP: Anhalten — und dann Verkehr von links und rechts durchlassen.',
    signs: { S: 'stop', N: 'stop', E: 'priority', W: 'priority' }, lights: null, ped: null,
    needStop: true,
    hazards: [
      { id: 'H', arm: 'E', color: CAR_COLORS.weiss, trigger: 26 },
      { id: 'H2', arm: 'W', color: CAR_COLORS.gelb, trigger: 26, delay: 1.6 }
    ],
    rule: 'Zeichen 206 · Halt. Vorfahrt gewähren.',
    explanation: 'Prüfungsreif! Vollständig gehalten und beide Fahrzeuge durchgelassen — auch das zweite, das erst später kam.',
    mistakes: {
      stop: 'Stoppschild überfahren! Erst vollständig anhalten — dann den Verkehr beobachten.',
      yield: 'Vorfahrt missachtet! Nach dem ersten Auto kam noch eins von links — am Stoppschild heißt es: warten, bis ALLES frei ist.',
      crash: 'Kollision! Anhalten war nur die halbe Aufgabe — die Vorfahrtsstraße muss in beide Richtungen frei sein.'
    }
  },
  {
    id: 'sim-ampel-runner', tier: 'hard', kind: 'sim', free: false, title: 'Grün heißt nicht sicher',
    task: 'Warte auf Grün — aber Vorsicht: Nicht jeder hält bei Rot!',
    signs: {}, lights: { S: 'red', N: 'red', E: 'green', W: 'green' }, ped: null,
    lightCycle: true,
    hazards: [{ id: 'H', arm: 'E', color: CAR_COLORS.rot, trigger: 10, delay: 0.3 }],
    rule: '§ 37 StVO + Defensiv fahren',
    explanation: 'Sehr stark! Du hast trotz Grün in die Kreuzung geschaut — der Rotlicht-Sünder hätte dich sonst erwischt.',
    mistakes: {
      red: 'Rotlichtverstoß! Erst bei Grün losfahren — und selbst dann mit Blick in die Kreuzung.',
      yield: 'Zu früh! Grün ist keine Garantie — dieses Auto hat Rot missachtet. Fahre erst, wenn die Kreuzung wirklich frei ist.',
      crash: 'Kollision mit einem Rotlicht-Sünder! Grün heißt „du darfst" — nicht „es ist sicher". Immer erst in die Kreuzung schauen.'
    }
  },
  {
    id: 'sim-mix', tier: 'hard', kind: 'sim', free: false, title: 'Rad rechts, Auto links',
    task: 'Radfahrer von rechts, Auto von links — wer wartet auf wen?',
    signs: {}, lights: null, ped: null,
    hazards: [
      { id: 'B', arm: 'E', bike: true, color: 0x3b74c4, trigger: 29 },
      { id: 'H', arm: 'W', color: CAR_COLORS.gelb, trigger: 30, yields: true }
    ],
    rule: '§ 8 StVO · Rechts vor links',
    explanation: 'Komplett richtig! Der Radfahrer von rechts fuhr zuerst, das Auto von links wartete auf dich — und du hast die Reihenfolge respektiert.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Der Radfahrer kam von rechts — er fährt vor dir, auch wenn das Auto von links brav wartet.',
      crash: 'Kollision! Sortiere die Kreuzung: Rad von rechts zuerst, dann du, dann das Auto von links.'
    }
  },
  {
    id: 'sim-police-links', tier: 'hard', kind: 'sim', free: false, title: 'Polizei biegt ab',
    task: 'Der Streifenwagen von vorne biegt mit Blaulicht links ab — vor dir!',
    signs: {}, lights: null, ped: null,
    hazards: [{ id: 'P', arm: 'N', turn: 'left', police: true, trigger: 26 }],
    rule: '§ 38 StVO · Wegerecht',
    explanation: 'Genau richtig: Mit Blaulicht und Martinshorn darf der Streifenwagen vor dir abbiegen — Wegerecht schlägt Vorfahrt.',
    mistakes: {
      yield: 'Einsatzfahrzeug behindert! Mit Blaulicht und Martinshorn biegt die Polizei zuerst ab — auch quer über deine Spur.',
      crash: 'Kollision mit dem Einsatzfahrzeug! Sein Blaulicht bedeutet: Er fährt zuerst — immer.'
    }
  },
  {
    id: 'sim-schnee', tier: 'hard', kind: 'sim', free: false, title: 'Schnee & Zebrastreifen', env: 'snow', slippery: true,
    task: 'Schnee! Bremsen dauert viel länger — achte auf den Zebrastreifen.',
    signs: { S: 'zebra' }, lights: null, ped: { arm: 'S' },
    pedTrigger: 22,
    rule: '§ 26 StVO + Winter',
    explanation: 'Ausgezeichnet! Auf Schnee bist du vorausschauend gefahren und hast rechtzeitig für den Fußgänger gehalten.',
    mistakes: {
      zebra: 'Fußgänger gefährdet! Auf Schnee musst du vor dem Zebrastreifen viel früher bremsen.',
      crash: 'Du hast einen Fußgänger angefahren! Auf schneeglatter Straße gilt am Zebrastreifen Schritttempo.'
    }
  }
,
  {
    id: 'sim-t-rvl', tier: 'medium', kind: 'sim', free: false, title: 'Einmündung von rechts',
    layout: 'T-W',
    task: 'Von rechts mündet eine Straße ein — fahre vorschriftsmäßig weiter.',
    signs: {}, lights: null, ped: null,
    hazards: [{ id: 'H', arm: 'E', turn: 'left', color: CAR_COLORS.rot, trigger: 26 }],
    rule: '§ 8 StVO · Rechts vor links',
    explanation: 'Richtig! Ohne Schilder gilt rechts vor links auch an einer Einmündung — das Auto aus der Seitenstraße kam von rechts und durfte zuerst.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Die Straße von rechts mündet ohne Schild ein — dann gilt rechts vor links, auch wenn deine Straße breiter aussieht.',
      crash: 'Kollision! Das Auto von rechts hatte Vorfahrt. Erst schauen, dann fahren.'
    }
  },
  {
    id: 'sim-t-bike', tier: 'hard', kind: 'sim', free: false, title: 'Radfahrer aus der Seitenstraße',
    layout: 'T-W',
    task: 'Achte auf die einmündende Straße von rechts — auch auf Radfahrer.',
    signs: {}, lights: null, ped: null,
    hazards: [{ id: 'H', arm: 'E', turn: 'left', bike: true, color: 0x2f9e44, trigger: 24 }],
    rule: '§ 8 StVO · Rechts vor links',
    explanation: 'Sauber! Auch ein Radfahrer von rechts hat Vorfahrt — Räder sind Fahrzeuge im Sinne der StVO.',
    mistakes: {
      yield: 'Vorfahrt missachtet! Der Radfahrer kam von rechts und ist ein Fahrzeug wie jedes andere — rechts vor links gilt auch für ihn.',
      crash: 'Kollision mit einem Radfahrer! Genau hier passieren die meisten Abbiege- und Einmündungsunfälle.'
    }
  }
];

/* ---------- Dauerfahrten: Freies Fahren & Praktische Prüfung ----------
   kind 'drive': Der Spieler fährt über viele Kreuzungen am Stück. Fehler
   werden gesammelt statt sofort abgebrochen — die Auswertung kommt am Ende. */

export const DRIVES = [
  {
    id: 'drive-free', kind: 'drive', sub: 'free', free: false,
    title: 'Freies Fahren · 2 Minuten'
  },
  {
    id: 'drive-test', kind: 'drive', sub: 'test', free: false,
    title: 'Praktische Prüfung'
  },
  {
    id: 'drive-autobahn', kind: 'drive', sub: 'autobahn', free: false,
    title: 'Autobahn · 2 Minuten'
  }
];

/* ---------- Kategorien ---------- */

export const CATEGORIES = [
  {
    id: 'basics', emoji: '🚗', group: 'vorfahrt', title: 'Rechts vor links',
    desc: 'Die Grundregel, wenn keine Schilder da sind',
    items: ['rvl1', 'rvl2', 'rvl3', 'rvl-links', 'rvl-abbieger']
  },
  {
    id: 'signs', emoji: '🛑', group: 'vorfahrt', title: 'Verkehrszeichen',
    desc: 'Vorfahrtsstraße, Stopp & abknickende Vorfahrt',
    items: ['prio', 'yield', 'stop', 'bend', 'prio-links', 'stop-links']
  },
  {
    id: 'lights', emoji: '🚦', group: 'vorfahrt', title: 'Ampeln',
    desc: 'Grün heißt nicht immer freie Fahrt',
    items: ['ampel', 'ampel-rot', 'ampel-blink']
  },
  {
    id: 'people', emoji: '🚲', group: 'vorfahrt', title: 'Rad & Fußgänger',
    desc: 'Schulterblick und Zebrastreifen',
    items: ['bike-rechts', 'bike-rvl', 'zebra', 'zebra-direkt']
  },
  {
    id: 'blue', emoji: '🚨', group: 'vorfahrt', title: 'Blaulicht',
    desc: 'Wenn Sonderrechte alle Regeln schlagen',
    items: ['blau', 'blau-gegen']
  },
  {
    id: 'einmuendung', emoji: '🔻', group: 'vorfahrt', isNew: true, title: 'Einmündungen',
    desc: 'T-Kreuzungen: wer hat Vorfahrt, wenn eine Straße endet?',
    items: ['t-rvl', 't-yield', 't-stop', 't-links']
  },
  {
    id: 'kreisverkehr', emoji: '🔄', group: 'vorfahrt', isNew: true, title: 'Kreisverkehr',
    desc: 'Wer im Kreis fährt, hat Vorfahrt — und wer blinkt wann?',
    items: ['kv-einfahrt', 'kv-drin', 'kv-zebra']
  },
  {
    id: 'sim', emoji: '🎮', group: 'fahren', title: 'Fahrsimulator',
    desc: 'Selbst fahren mit Gas & Bremse — Fehler lösen den Alarm aus',
    items: [
      // Dauerfahrten
      'drive-free', 'drive-test', 'drive-autobahn',
      // leicht
      'sim-rvl', 'sim-prio', 'sim-yield', 'sim-stop', 'sim-ampel', 'sim-zebra', 'sim-blau',
      // mittel
      'sim-rvl2', 'sim-abbieger', 'sim-bike', 'sim-beide', 'sim-gruen-blau',
      // schwer
      'sim-zebra-auto', 'sim-stop-beide', 'sim-ampel-runner', 'sim-mix', 'sim-police-links',
      'sim-nebel', 'sim-regen', 'sim-schnee', 'sim-t-rvl', 'sim-t-bike'
    ]
  },
  {
    id: 'wissen', emoji: '🌨️', group: 'wissen', title: 'Wetter & Notfälle',
    desc: 'Winter, Nebel, Unfall — richtig reagieren',
    items: ['q-winter', 'q-unfall', 'q-warndreieck', 'q-nebel', 'q-aqua', 'q-glaette', 'q-gasse', 'q-gelb', 'q-regen']
  }
];

export const TOTAL_ITEMS = SCENARIOS.length + QUIZ.length + SIMS.length + DRIVES.length;

export const byId = (id) =>
  SCENARIOS.find((s) => s.id === id) || QUIZ.find((s) => s.id === id) ||
  SIMS.find((s) => s.id === id) || DRIVES.find((s) => s.id === id);
export const catOf = (id) => CATEGORIES.find((c) => c.items.includes(id));
