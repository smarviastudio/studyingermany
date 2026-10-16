// Vorfahrt 3D — Spielsteuerung, Rendering, Szenario-Regie
import * as THREE from 'three';
import {
  buildWorld, buildAutobahn, setLayout, carRoute, roundaboutRoute, roadsidePose, makeStopLine, makeZebra, zebraWalk,
  relationTo, headingY, ARMS, CAR_STOP, LANE, ROAD_HALF, AB_SEG, AB_LANES, RA_OUTER, LAYOUTS
} from './world.js';
import {
  createCar, createBicycle, createTruck, setBlinker, tickCarLights, spinWheels,
  createSign, createTrafficLight, createPedestrian, createBadge,
  createWarnTriangle, signIconDataURL, lightIconDataURL
} from './models.js';
import { SCENARIOS, QUIZ, SIMS, CATEGORIES, byId, catOf, PLAYER_COLOR, CAR_COLORS } from './scenarios.js';
import { initUI } from './ui.js?v=6';
import { initCrossPromo } from './crosspromo.js?v=2';
import {
  t, tr, trMistake, trOption, trCat, carName, carNameSentence, relWord,
  getLang, setLang, onLangChange, applyStaticTexts
} from './i18n.js?v=6';

/* ============ Renderer & Szene ============ */

const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const BASE_FOV = 55;
const camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.1, 600);

/* Bildausschnitt der Frage-Szenen: Oben liegt die Titelleiste, unten die
   Frage-Karte. Die Projektionsmitte wandert in die Mitte des freien Bereichs
   dazwischen (setViewOffset) — bei unverändertem Maßstab. Vorher lag das eigene
   Auto in manchen Szenen unter der Karte. `shift` = Pixel, um die die Bildmitte
   nach oben rückt (0 = normale Kamera). */
function frameFromShift(W, H, shift) {
  if (Math.abs(shift) < 0.5) return null;
  const fullH = H + 2 * Math.abs(shift);
  const t = Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2)) * fullH / H;
  return { fullH, offY: shift > 0 ? fullH - H : 0, fov: 2 * THREE.MathUtils.radToDeg(Math.atan(t)) };
}
function applyFrame(cam, W, H, shift) {
  const f = frameFromShift(W, H, shift);
  if (f) {
    cam.fov = f.fov;
    cam.setViewOffset(W, f.fullH, 0, f.offY, W, H); // setzt aspect und die Projektionsmatrix
  } else {
    cam.fov = BASE_FOV;
    cam.aspect = W / H;
    cam.clearViewOffset();
  }
}

const hemi = new THREE.HemisphereLight(0xcfe4ff, 0x6f9a55, 0.75);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffedd0, 1.5);
sun.position.set(38, 58, 22);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -55; sun.shadow.camera.right = 55;
sun.shadow.camera.top = 55; sun.shadow.camera.bottom = -55;
sun.shadow.camera.far = 160;
sun.shadow.bias = -0.0004;
sun.shadow.radius = 5;
scene.add(sun);

const world = buildWorld(scene);
const { clouds, sky, glow, city } = world;
const abWorld = buildAutobahn(scene);

/* Wetter-Stimmung für Wissensfragen (snow | rain | fog | null) */
const weatherEl = document.getElementById('weather');
function applyEnv(env) {
  weatherEl.className = env || '';
  sky.visible = !env;
  glow.visible = !env;
  for (const c of clouds) c.visible = !env || env === 'rain';
  if (env === 'fog') {
    scene.fog.color.set(0xccd5dd); scene.fog.near = 16; scene.fog.far = 65;
    scene.background = new THREE.Color(0xccd5dd);
    sun.intensity = 0.7; hemi.intensity = 0.9;
  } else if (env === 'snow') {
    scene.fog.color.set(0xe8edf3); scene.fog.near = 35; scene.fog.far = 140;
    scene.background = new THREE.Color(0xe8edf3);
    sun.intensity = 0.95; hemi.intensity = 1.05;
  } else if (env === 'rain') {
    scene.fog.color.set(0x97a3af); scene.fog.near = 30; scene.fog.far = 130;
    scene.background = new THREE.Color(0x97a3af);
    sun.intensity = 0.55; hemi.intensity = 0.8;
  } else {
    scene.fog.color.set(0xd7ebf8); scene.fog.near = 90; scene.fog.far = 260;
    scene.background = null;
    sun.intensity = 1.5; hemi.intensity = 0.75;
  }
}

const dynamic = new THREE.Group(); // alles Szenario-Spezifische
scene.add(dynamic);

// Passanten, die dauerhaft auf den Gehwegen unterwegs sind (nur Kulisse)
const walkers = [];
{
  const defs = [
    { a: [-4.4, 14], b: [-4.4, 46], color: 0x4a7fb5, speed: 0.045, off: 0 },
    { a: [4.4, -12], b: [4.4, -48], color: 0x6f9a3f, speed: 0.035, off: 0.9 },
    { a: [14, 4.4], b: [50, 4.4], color: 0xb5764a, speed: 0.04, off: 1.5 },
    { a: [-16, -4.4], b: [-46, -4.4], color: 0x8a5fb0, speed: 0.05, off: 0.4 }
  ];
  for (const d of defs) {
    const p = createPedestrian(d.color);
    scene.add(p);
    walkers.push({
      obj: p,
      a: new THREE.Vector3(d.a[0], 0.12, d.a[1]),
      b: new THREE.Vector3(d.b[0], 0.12, d.b[1]),
      speed: d.speed, off: d.off
    });
  }
}

window.addEventListener('resize', () => {
  applyFrame(camera, window.innerWidth, window.innerHeight, camState.shift);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Im Frage-Modus: Kamera neu auf das Seitenverhältnis einpassen
  // (nicht im Quiz/Simulator — dort führen eigene Kameras)
  if (typeof current !== 'undefined' && current && !current.kind &&
      (camState.mode === 'fly' || camState.mode === 'player')) {
    const fit = fitPlayerCamera(current);
    camState.shiftTarget = fit.shift;
    flyCamera(fit.pos, fit.target, 0.45);
  }
});

/* ============ Mini-Tween-Engine ============ */

const tweens = new Set();
const easings = {
  linear: (t) => t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
};

function tween(dur, onUpdate, ease = 'linear', scope = 'scene') {
  let resolveFn;
  const p = new Promise((res) => (resolveFn = res));
  const tw = {
    t0: performance.now(), dur: dur * 1000, ease: easings[ease], onUpdate, scope,
    finish(cancelled) { tweens.delete(tw); resolveFn(!cancelled); }
  };
  tweens.add(tw);
  return { promise: p, cancel: () => tw.finish(true) };
}

function updateTweens(now) {
  for (const tw of [...tweens]) {
    const t = Math.min(1, (now - tw.t0) / tw.dur);
    tw.onUpdate(tw.ease(t));
    if (t >= 1) tw.finish(false);
  }
}

function cancelSceneTweens() {
  for (const tw of [...tweens]) if (tw.scope === 'scene') tw.finish(true);
}

const wait = (s) => new Promise((r) => setTimeout(r, s * 1000));

/* ============ Sound (WebAudio, synthetisch) ============ */

let audio = null;
function ensureAudio() {
  if (!audio) {
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* egal */ }
  }
  if (audio && audio.state === 'suspended') audio.resume();
}
function beep(freq, dur, type = 'sine', vol = 0.12, delay = 0) {
  if (!audio) return;
  const t = audio.currentTime + delay;
  const o = audio.createOscillator();
  const g = audio.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(audio.destination);
  o.start(t); o.stop(t + dur + 0.02);
}
const sfx = {
  click: () => beep(880, 0.05, 'sine', 0.05),
  good: () => { beep(523, 0.1, 'sine', 0.1); beep(784, 0.16, 'sine', 0.1, 0.09); beep(1046, 0.22, 'sine', 0.08, 0.18); },
  bad: () => beep(150, 0.32, 'square', 0.08),
  siren: () => { for (let i = 0; i < 4; i++) beep(i % 2 ? 435 : 580, 0.32, 'sawtooth', 0.035, i * 0.33); },
  // Blechschaden: dumpfer Aufprall + metallisches Klirren
  crash: () => {
    beep(70, 0.45, 'sawtooth', 0.3);
    beep(48, 0.6, 'square', 0.22, 0.02);
    beep(1900, 0.06, 'square', 0.13);
    beep(950, 0.1, 'square', 0.11, 0.05);
    beep(2600, 0.05, 'square', 0.08, 0.11);
  },
  // Fahrfehler im Simulator: unüberhörbarer Alarm
  alarm: () => {
    for (let i = 0; i < 3; i++) {
      beep(932, 0.16, 'square', 0.16, i * 0.22);
      beep(622, 0.16, 'square', 0.14, i * 0.22 + 0.11);
    }
    beep(165, 0.7, 'sawtooth', 0.12, 0.68);
  }
};
window.addEventListener('pointerdown', ensureAudio, { once: false });

/* ============ Spielstand ============ */

const SAVE_KEY = 'vorfahrt3d-v1';
// unlockSub: the unlock is a subscription — only then may an expired entitlement re-lock the app.
// Lifetime and older buyers (no flag) are never re-locked.
let save = { progress: {}, unlocked: false, unlockSub: false, debug: false, reviewAsked: false, reviewVersion: null };
try { save = { ...save, ...JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') }; } catch { /* frisch */ }
if (window.__WEB_DEMO) { save.unlocked = false; save.debug = false; }
const persist = () => localStorage.setItem(SAVE_KEY, JSON.stringify(save));
// Debug schaltet frei, ohne den echten Kaufstatus zu verändern — beim Ausschalten
// ist die App wieder genau im Zustand, in dem sie ohne Debug wäre.
const effectiveUnlocked = () => save.unlocked || save.debug;

/* ============ Bewertungs-Anfrage ============
   Wir fragen nur nach einem Erfolgserlebnis: ab 2 bestandenen Übungen, nach
   einer geschafften Kategorie oder nach bestandener Praktischer Prüfung —
   einmal pro App-Version (window.__appVersion kommt aus dem nativen Bundle).
   iOS zeigt den Dialog ohnehin nur, wenn es will (max. dreimal pro Jahr). */
const REVIEW_MIN_PASSED = 2;
// Version kommt per User-Script (__appVersion) oder spätestens mit IAP.status().
const appVersion = () => window.__appVersion || 'web';
// Alte Installationen speicherten nur reviewAsked:true — die gelten als "vor dieser Version gefragt".
if (save.reviewAsked && !save.reviewVersion) save.reviewVersion = 'legacy';

function passedCount() {
  let n = 0;
  for (const k in save.progress) if (save.progress[k] === 'passed') n++;
  return n;
}

function maybeAskReview(force = false) {
  if (save.reviewVersion === appVersion()) return;
  if (!window.IAP || !IAP.native) return;      // im Browser gibt es keinen Dialog
  if (!force && passedCount() < REVIEW_MIN_PASSED) return;
  const prev = save.reviewVersion;
  save.reviewVersion = appVersion();
  persist();
  // Erst den Erfolgsmoment stehen lassen, dann fragen.
  setTimeout(() => {
    // Nie über der Paywall fragen — dann lieber beim nächsten Erfolg.
    const paywallOpen = document.getElementById('paywall').classList.contains('visible');
    if (paywallOpen) { save.reviewVersion = prev; persist(); return; }
    IAP.review();
  }, 1800);
}

/* Debug-Freischaltung: siehe Verdrahtung weiter unten, nach der ui-Initialisierung. */
const debugBar = document.getElementById('debug-bar');

/* ============ Kamera-Regie ============ */

const camState = {
  mode: 'orbit', // orbit | fly | player
  pos: new THREE.Vector3(30, 14, 30),
  target: new THREE.Vector3(0, 0, 0),
  shift: 0, shiftTarget: 0   // Verschiebung der Bildmitte in Pixeln (siehe applyFrame)
};

/* Freier Bereich zwischen Titelleiste und Frage-Karte (CSS-Pixel von oben/unten).
   Die Karte ist zu diesem Zeitpunkt schon befüllt (ui.prepareQuestion), aber noch
   versteckt — so stimmt ihre Höhe. */
function questionBand() {
  const H = window.innerHeight;
  const hudTop = document.getElementById('hud-top');
  const panel = document.getElementById('question-panel');
  const hr = hudTop ? hudTop.getBoundingClientRect() : null;
  const top = hr && hr.height ? hr.bottom + 10 : 90;
  const gap = parseFloat(getComputedStyle(panel).bottom) || 22;
  const bottom = (panel.offsetHeight || 260) + gap + 12;
  // Auf sehr kleinen Geräten nie mehr als gut die Hälfte des Bildes abgeben
  return { top: Math.min(top, H * 0.28), bottom: Math.min(bottom, H * 0.5) };
}
/**
 * Spieler-Kamera: sucht die kleinste Distanz, bei der ALLE beteiligten
 * Fahrzeuge/Personen im Bild sind. Auf schmalen Hochkant-Screens wird die
 * Perspektive automatisch steiler und weiter — sonst sieht man die
 * Querverkehr-Autos nicht und kann die Frage gar nicht beantworten.
 */
function fitPlayerCamera(sc) {
  const W = window.innerWidth, H = window.innerHeight;
  const aspect = W / H;
  const steep = THREE.MathUtils.clamp((1.5 - aspect) / 1.0, 0, 1);
  const dirOff = new THREE.Vector3(0.3 - 0.1 * steep, 0.42 + 0.55 * steep, 1).normalize();
  // Der Kreisverkehr ist deutlich größer als eine Kreuzung: Blickpunkt etwas
  // nach Süden ziehen, damit der wartende Spieler nicht unter dem Fragepanel liegt.
  const roundLayout = !!sc && sc.layout === 'circle';
  const target = new THREE.Vector3(0, 0.4, roundLayout ? RA_OUTER * 0.34 : 0.5);

  const { round, poseOpts, zebraOpts } = layoutOpts(sc);
  const pts = [new THREE.Vector3(0, 0.5, -6)];
  // Ganzes Fahrzeug einpassen, nicht nur seine Mitte: auch das Heck (von der
  // Kreuzung weg) und die Antwort-Marke darüber. Sonst lag das eigene Auto in
  // manchen Szenen halb unter der Frage-Karte.
  const addVehicle = (e, len) => {
    pts.push(e.clone().setY(1.2));
    const out = new THREE.Vector3(e.x, 0, e.z).normalize();
    pts.push(e.clone().addScaledVector(out, len).setY(0.4));
    pts.push(e.clone().setY(3.4));
  };
  // Startpunkt des Spielers — im Kreisverkehr steht er weiter draußen
  addVehicle(sc && sc.playerExit
    ? routeFor('S', sc.playerTurn, { exit: sc.playerExit, inCircle: sc.playerInCircle }).entry.clone()
    : new THREE.Vector3(LANE, 0, CAR_STOP), 2.3);
  // Der ganze Ring muss ins Bild, sonst sieht man den Kreisverkehr nicht als solchen
  if (round) {
    for (const [x, z] of [[RA_OUTER, 0], [-RA_OUTER, 0], [0, RA_OUTER], [0, -RA_OUTER]]) {
      pts.push(new THREE.Vector3(x, 0.6, z));
    }
  }
  for (const c of ((sc && sc.cars) || [])) {
    addVehicle(routeFor(c.arm, c.turn, c).entry.clone(), c.bike ? 1.0 : 2.3);
  }
  if (sc && sc.ped) {
    const { from, to } = zebraWalk(sc.ped.arm, zebraOpts);
    pts.push(from.clone().setY(1.7), to.clone().setY(1.7));
  }
  // Schilder und Ampeln müssen sichtbar sein — sonst ist die Frage unfair
  if (sc) {
    for (const arm of Object.keys(sc.signs || {})) {
      const p = roadsidePose(arm, poseOpts).pos.clone();
      p.y = 3.0;
      pts.push(p);
    }
    if (sc.lights) {
      const p = roadsidePose('S', poseOpts).pos.clone();
      p.y = 3.6;
      pts.push(p);
    }
  }

  // Alles Wichtige muss zwischen Titelleiste und Frage-Karte liegen
  const band = questionBand();
  const shift = H / 2 - (band.top + (H - band.bottom)) / 2;
  const minY = -1 + 2 * band.bottom / H;
  const maxY = 1 - 2 * band.top / H;
  const probe = new THREE.PerspectiveCamera(BASE_FOV, aspect, 0.1, 600);
  applyFrame(probe, W, H, shift);
  const v = new THREE.Vector3();
  const maxD = roundLayout ? 90 : 48;
  for (let d = 10; d <= maxD; d += 0.75) {
    probe.position.copy(target).addScaledVector(dirOff, d);
    probe.lookAt(target);
    probe.updateMatrixWorld(true);
    const ok = pts.every((p) => {
      v.copy(p).project(probe);
      return Math.abs(v.x) < 0.84 && v.y < maxY && v.y > minY;
    });
    if (ok) return { pos: probe.position.clone(), target: target.clone(), shift };
  }
  return { pos: target.clone().addScaledVector(dirOff, maxD), target: target.clone(), shift };
}
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
window.addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

let camTween = null;
function flyCamera(pos, target, dur = 1.5) {
  if (camTween) camTween.cancel();
  camState.mode = 'fly';
  const p0 = camState.pos.clone(), t0 = camState.target.clone();
  camTween = tween(dur, (t) => {
    camState.pos.lerpVectors(p0, pos, t);
    camState.target.lerpVectors(t0, target, t);
  }, 'inOutCubic', 'cam');
  return camTween.promise.then((done) => {
    if (done) camState.mode = 'player';
  });
}
function stopCamTween() {
  if (camTween) { camTween.cancel(); camTween = null; }
}

/* ============ Entities (Autos, Fußgänger) ============ */

let entities = {}; // id -> {obj, route, kind, walking}
let sceneToken = 0; // entwertet laufende Abläufe beim Szenenwechsel

function clearDynamic() {
  sceneToken++;
  cancelSceneTweens();
  dynamic.clear();
  entities = {};
  quizAnims.length = 0;
  sim.active = false;
  sim.gas = sim.brake = false;
}

function addCar(id, arm, turn, opts) {
  // `exit` schaltet auf den Kreisverkehr um; `turn` steuert dann nur noch den Blinker.
  const route = opts.exit
    ? roundaboutRoute(arm, opts.exit, { ...opts.routeOpts, inCircle: !!opts.inCircle })
    : carRoute(arm, turn, opts.routeOpts);
  const car = opts.bike ? createBicycle({ jacket: opts.color }) : createCar(opts);
  car.position.copy(route.spawn);
  car.rotation.y = route.headIn;
  if (car.userData.blink) {
    if (turn === 'left') setBlinker(car, 'L');
    if (turn === 'right') setBlinker(car, 'R');
  }
  car.userData.pickId = id;
  dynamic.add(car);
  entities[id] = { obj: car, route, kind: 'car', arm, turn, bike: !!opts.bike };
  return entities[id];
}

// Anfahrt: Spawn → Haltepunkt
function driveApproach(ent, delay = 0, dur = 1.5) {
  const { obj, route } = ent;
  // Im Kreisverkehr ist schon die Anfahrt ein Bogen — dann muss sich das Auto
  // mitdrehen, sonst schiebt es sich seitwärts über die Fahrbahn.
  const curved = !!route.roundabout;
  const len = curved ? route.approach.getLength() : route.spawn.distanceTo(route.entry);
  const tmpT = new THREE.Vector3();
  let last = 0;
  return wait(delay).then(() => tween(dur, (t) => {
    route.approach.getPointAt(t, obj.position);
    if (curved) {
      route.approach.getTangentAt(Math.min(t, 0.999), tmpT);
      obj.rotation.y = headingY(tmpT.x, tmpT.z);
    }
    spinWheels(obj, (t - last) * len); last = t;
  }, 'outCubic').promise);
}

// Über die Kreuzung: Haltepunkt → Ausfahrt
function driveThrough(ent) {
  const { obj, route } = ent;
  const len = route.path.getLength();
  // Im Kreisverkehr ist der Weg deutlich länger — mit dem Kreuzungs-Tempo
  // würde das Auto durch den Kreis schießen statt ihn zu umrunden.
  const dur = route.roundabout
    ? Math.min(6.5, Math.max(2.2, len / 7.5))
    : Math.min(2.8, Math.max(1.2, len / 14));
  const tmpT = new THREE.Vector3();
  let last = 0;
  return tween(dur, (t) => {
    route.path.getPointAt(t, obj.position);
    route.path.getTangentAt(Math.min(t, 0.999), tmpT);
    obj.rotation.y = headingY(tmpT.x, tmpT.z);
    spinWheels(obj, (t - last) * len); last = t;
    if (route.roundabout) {
      // Im Kreisel wird erst zur Ausfahrt hin geblinkt — und dann bis zum Schluss.
      if (t > 0.55 && obj.userData.blink && obj.userData.blinker !== 'R') setBlinker(obj, 'R');
    } else if (t > 0.55 && ent.turn !== 'straight' && obj.userData.blinker) {
      setBlinker(obj, null);
    }
  }, route.roundabout ? 'inOutSine' : 'inOutSine').promise;
}

function addPedestrian(arm, opts) {
  const ped = createPedestrian();
  const { from, to } = zebraWalk(arm, opts);
  ped.position.copy(from);
  ped.rotation.y = headingY(to.x - from.x, to.z - from.z);
  ped.userData.pickId = 'ped';
  dynamic.add(ped);
  entities.ped = { obj: ped, kind: 'ped', from, to, walking: false };
  return entities.ped;
}

function pedWalk(ent) {
  ent.walking = true;
  return tween(3.0, (t) => {
    ent.obj.position.lerpVectors(ent.from, ent.to, t);
  }, 'inOutSine').promise.then(() => { ent.walking = false; });
}

/* ============ Szenario-Aufbau ============ */

let current = null;      // aktuelles Item (3D-Szenario oder Quiz)
let currentCatId = null; // Kategorie des aktuellen Items
let answered = false;
let mode = 'title';      // title | menu | briefing | question | playback | done | quiz

let lightsMap = {}; // arm -> Ampel-Objekt (für Blinken/Umschalten)

// Statische Elemente einer Situation: Schilder, Ampeln, Haltlinien, Zebrastreifen.
// Wird vom Frage-Modus UND vom Fahrsimulator genutzt.
// Im Kreisverkehr liegen Schilder, Zebrastreifen und Haltepunkte weiter außen.
function layoutOpts(sc) {
  const round = !!sc && sc.layout === 'circle';
  return {
    round,
    poseOpts: round ? { dist: RA_OUTER + 1.6 } : undefined,
    zebraOpts: round ? { dist: RA_OUTER + 3.4 } : undefined
  };
}

// Route eines Fahrzeugs — im Kreisverkehr über den Ring, sonst über die Kreuzung
function routeFor(arm, turn, spec = {}) {
  return spec.exit
    ? roundaboutRoute(arm, spec.exit, { laneOff: spec.bike ? 2.95 : LANE, inCircle: !!spec.inCircle })
    : carRoute(arm, turn, { laneOff: spec.bike ? 2.95 : LANE });
}

/* Stadt oder Autobahn als Kulisse (auch für Wissensfragen) */
function setWorld(kind) {
  const ab = kind === 'autobahn';
  city.visible = !ab;
  abWorld.visible = ab;
  for (const w of walkers) w.obj.visible = !ab;
}

/* Zusatzzeichen „abknickende Vorfahrt" aus Sicht des Fahrers an `arm`:
   b = eigene Straße (unten), l / t / r = links / geradeaus / rechts.
   Dicke Linie = Verlauf der Vorfahrtsstraße, dünne Linien = übrige Straßen. */
const RING_ORDER = ['N', 'E', 'S', 'W'];
function bendKey(sc, arm) {
  const rel = (to) => 'bltr'[(RING_ORDER.indexOf(to) - RING_ORDER.indexOf(arm) + 4) % 4];
  const course = sc.bendCourse || ['S', 'W'];
  const missing = LAYOUTS[sc.layout || 'cross'] || [];
  const thick = course.map(rel).sort().join('');
  const thin = RING_ORDER.filter((a) => !missing.includes(a) && !course.includes(a)).map(rel).sort().join('');
  return `bend:${thick}:${thin}`;
}

/* Fahrbahnmarkierung vor der Kreuzung: Haltlinie an Ampel und Stoppschild,
   gestrichelte Wartelinie bei „Vorfahrt gewähren", keine auf der Vorfahrtsstraße. */
function lineStyleFor(sc, arm) {
  if (sc.lights && sc.lights[arm]) return 'solid';
  const type = sc.signs && sc.signs[arm];
  if (type === 'stop') return 'solid';
  if (type && type.startsWith('yield')) return 'dashed';
  return null;
}

function buildStatics(sc) {
  clearDynamic();
  lightsMap = {};
  setLayout(world, sc.layout);

  const { round, poseOpts, zebraOpts } = layoutOpts(sc);

  // Schilder / Ampeln
  for (const [arm, type] of Object.entries(sc.signs || {})) {
    const { pos, rotY } = roadsidePose(arm, poseOpts);
    const sign = createSign(type, { bend: type.endsWith('-bend') ? bendKey(sc, arm) : null });
    sign.position.copy(pos);
    // Wenn am selben Arm eine Ampel steht, rückt das Schild dahinter
    if (sc.lights && sc.lights[arm]) {
      const d = ARMS[arm].dir;
      sign.position.x -= d.x * 1.5;
      sign.position.z -= d.y * 1.5;
    }
    sign.rotation.y = rotY;
    dynamic.add(sign);
  }
  if (sc.lights) {
    for (const [arm, state] of Object.entries(sc.lights)) {
      const { pos, rotY } = roadsidePose(arm, poseOpts);
      const tl = createTrafficLight();
      tl.position.copy(pos);
      tl.rotation.y = rotY;
      tl.userData.setState(state === 'blink' ? 'yellow' : state);
      dynamic.add(tl);
      lightsMap[arm] = tl;
    }
  }
  // Im Kreisverkehr markiert die Wartelinie des Rings die Zufahrt — dort nichts zusätzlich.
  if (!round) {
    for (const arm of ['N', 'E', 'S', 'W']) {
      const style = lineStyleFor(sc, arm);
      if (style) dynamic.add(makeStopLine(arm, style));
    }
  }
  if (sc.ped) {
    dynamic.add(makeZebra(sc.ped.arm, zebraOpts));
    addPedestrian(sc.ped.arm, zebraOpts);
  }
}

function buildScenario(sc) {
  buildStatics(sc);

  // Fahrzeuge
  addCar('player', 'S', sc.playerTurn, {
    color: PLAYER_COLOR,
    exit: sc.playerExit, inCircle: sc.playerInCircle,
    routeOpts: { stopExtra: sc.playerStopExtra || 0 }
  });
  for (const c of sc.cars) {
    addCar(c.id, c.arm, c.turn, {
      color: c.color, police: c.police, bike: c.bike,
      exit: c.exit, inCircle: c.inCircle,
      routeOpts: { laneOff: c.bike ? 2.95 : LANE }
    });
  }
}

// Schwebende Marker über allen wählbaren Fahrzeugen/Personen
function showBadges(sc) {
  candidates(sc).forEach((c, i) => {
    const ent = entities[c.id];
    if (!ent) return;
    const badge = createBadge({
      colorCss: c.colorCss,
      text: c.id === 'player' ? t('me').toLocaleUpperCase() : ''
    });
    const baseY = ent.kind === 'ped' ? 2.2 : 2.7;
    badge.position.y = baseY;
    badge.userData.baseY = baseY;
    badge.userData.phase = i * 1.3;
    ent.obj.add(badge);
    ent.badge = badge;
  });
}

function hideBadges() {
  for (const ent of Object.values(entities)) {
    if (ent.badge) { ent.obj.remove(ent.badge); ent.badge = null; }
  }
}

// Nach der Antwort: nummerierte Marker zeigen die richtige Reihenfolge
function showOrderBadges(sc) {
  hideBadges();
  sc.order.forEach((id, i) => {
    const ent = entities[id];
    if (!ent) return;
    const badge = createBadge({
      colorCss: i === 0 ? '#22c55e' : '#546178',
      text: String(i + 1) + '.'
    });
    const baseY = ent.kind === 'ped' ? 2.2 : 2.7;
    badge.position.y = baseY;
    badge.userData.baseY = baseY;
    badge.userData.phase = i * 1.3;
    ent.obj.add(badge);
    ent.badge = badge;
  });
}

function candidates(sc) {
  const meTurn = sc.playerTurn === 'left' ? t('wantsLeft') : sc.playerTurn === 'right' ? t('wantsRight') : '';
  const list = [{ id: 'player', label: `${t('me')}${meTurn}`, colorCss: cssColor(PLAYER_COLOR) }];
  for (const c of sc.cars) {
    const rel = c.arm === 'S' ? t('besideYou') : relWord(relationTo('S', c.arm));
    const blink = c.turn === 'left' ? t('blinksLeft') : c.turn === 'right' ? t('blinksRight') : '';
    const who = c.police ? t('police') : c.bike ? t('cyclist') : carName(c.name);
    list.push({
      id: c.id,
      label: `${who} · ${rel}${blink}`,
      colorCss: c.police ? '#2277ff' : cssColor(c.color)
    });
  }
  if (sc.ped) list.push({ id: 'ped', label: t('pedestrian'), colorCss: '#d94f30' });
  return list;
}

// Schilder/Ampeln als 2D-Icons fürs HUD
const armLabel = (arm) =>
  arm === 'S' ? t('yourSign') : arm === 'N' ? t('oncoming') : arm === 'E' ? t('fromRight') : t('fromLeft');

// Frage-Panel: NUR was für den Spieler gilt — kompakt, damit es nicht
// wie zusätzliche Antwortmöglichkeiten aussieht
function signInfoCompact(sc) {
  const out = [];
  if (sc.lights) out.push({ img: lightIconDataURL(sc.lights.S), label: t('yourLight') });
  const type = sc.signs && sc.signs.S;
  if (type) {
    out.push({ img: signIconDataURL(type), label: t('yourSign') });
    if (type.endsWith('-bend')) out.push({ img: signIconDataURL(bendKey(sc, 'S')), label: t('bendCourse') });
  }
  return out;
}

// Erklärung: das volle Bild aller Arme
function signInfoFull(sc) {
  const out = [];
  for (const arm of ['S', 'E', 'W', 'N']) {
    const type = sc.signs && sc.signs[arm];
    if (type) {
      out.push({ img: signIconDataURL(type), label: armLabel(arm) });
      if (type.endsWith('-bend') && arm === 'S') out.push({ img: signIconDataURL(bendKey(sc, 'S')), label: t('bend') });
    }
  }
  if (sc.lights) {
    out.unshift({ img: lightIconDataURL(sc.lights.S), label: t('yourLight') });
  }
  return out.slice(0, 4);
}

const cssColor = (hex) => '#' + hex.toString(16).padStart(6, '0');

// „Rotes Auto" → „das rote Auto" (für Sätze wie „… fährt zuerst")
function labelOf(sc, id) {
  if (id === 'ped') return t('thePed');
  const c = sc.cars.find((x) => x.id === id);
  if (!c) return id;
  if (c.police) return t('thePolice');
  if (c.bike) return t('theCyclist');
  return carNameSentence(c.name);
}

// Einheitlicher Einstieg: 3D-Szenario, Wissensfrage oder Simulator
function startItem(id) {
  const item = byId(id);
  // Sicherheitsnetz: gesperrte Inhalte starten nie, egal über welchen Weg.
  if (!item.free && !effectiveUnlocked()) { ui.showPaywall(); return; }
  const cat = catOf(id);
  currentCatId = cat ? cat.id : null;
  // Kurz-Anleitung vor dem allerersten Simulator-Level oder der ersten Dauerfahrt
  if ((item.kind === 'sim' || item.kind === 'drive') && !save.seenSimHowto) {
    ui.showSimHowto(() => {
      save.seenSimHowto = true;
      persist();
      startItem(id);
    });
    return;
  }
  // Kurz-Anleitung vor der allerersten 3D-Übung
  if (!item.kind && !save.seenHowto) {
    ui.showHowto(() => {
      save.seenHowto = true;
      persist();
      startItem(id);
    });
    return;
  }
  if (item.kind === 'quiz') startQuiz(item);
  else if (item.kind === 'sim') startSim(item);
  else if (item.kind === 'drive') startDrive(item);
  else startScenario(item);
}

function itemPos(id) {
  const cat = catOf(id);
  if (!cat) return { idx: 1, total: 1 };
  // Dauerfahrten haben keine Nummer; Simulator-Level zählen wie in ihrer Liste (ohne Dauerfahrten)
  if (byId(id).kind === 'drive') return { idx: 0, total: 0 };
  const list = cat.items.filter((x) => byId(x).kind !== 'drive');
  return { idx: list.indexOf(id) + 1, total: list.length };
}

/* Beobachtungsphase: Die Situation ist erst einige Sekunden lang zu sehen,
   dann kommt die Frage. So MUSS man hinschauen, bevor man antwortet. */
const OBSERVE_SECONDS = 5;

async function runObserve(token, seconds = OBSERVE_SECONDS) {
  ui.showObserve(seconds);
  for (let n = seconds; n > 0; n--) {
    ui.setObserveCount(n);
    await wait(1);
    if (sceneToken !== token) return false;
  }
  ui.hideObserve();
  return true;
}

async function startScenario(sc) {
  current = sc;
  answered = false;
  mode = 'briefing';
  applyEnv(null);
  setWorld('city');
  ui.hideQuiz();
  ui.hideSim();
  ui.hideAlarm();
  buildScenario(sc); // erhöht via clearDynamic den sceneToken
  const token = sceneToken;

  ui.hideExplanation();
  ui.hideQuestion();
  const { idx, total } = itemPos(sc.id);
  ui.showHUD(tr(sc, 'title'), idx, total);
  // Karte schon befüllen (unsichtbar), damit die Kamera ihre Höhe kennt
  ui.prepareQuestion(sc, candidates(sc), signInfoCompact(sc));
  const fit = fitPlayerCamera(sc);
  camState.shiftTarget = fit.shift;
  flyCamera(fit.pos, fit.target, 1.2);

  // Anfahrt füllt die Beobachtungszeit: Autos, Blinker, Schilder sind gut zu sehen
  Object.values(entities)
    .filter((e) => e.kind === 'car')
    .forEach((e, i) => driveApproach(e, i * 0.15, 3.2));

  const ok = await runObserve(token);
  if (!ok || current !== sc) return;
  mode = 'question';
  ui.showQuestion(sc, candidates(sc), signInfoCompact(sc));
  showBadges(sc);
}

/* ---- Wissensfragen: inszenierte 3D-Szene statt nacktem Fragetext ---- */

let quizAnims = []; // fahrende Autos in Quiz-Szenen (Endlosschleife)

function buildQuizScene(item) {
  clearDynamic();
  setLayout(world, 'cross');
  quizAnims = [];
  const s = item.scene;
  setWorld((s && s.world) || 'city');
  if (!s) return;

  for (const c of s.cars || []) {
    const car = createCar({ color: c.color, police: c.police });
    car.position.set(c.x, 0, c.z);
    car.rotation.y = c.rot ?? Math.PI;
    if (c.blinker) setBlinker(car, c.blinker);
    dynamic.add(car);
    if (c.drive) {
      const [tx, tz] = c.drive.to;
      car.rotation.y = headingY(tx - c.x, tz - c.z);
      quizAnims.push({
        obj: car, fx: c.x, fz: c.z, tx, tz,
        dur: c.drive.dur, start: elapsed + (c.drive.delay || 0),
        len: Math.hypot(tx - c.x, tz - c.z), lastT: 0
      });
    }
  }
  for (const p of s.peds || []) {
    const ped = createPedestrian(p.color);
    ped.position.set(p.x, 0.12, p.z);
    ped.rotation.y = p.rot || 0;
    dynamic.add(ped);
  }
  if (s.triangle) {
    const tri = createWarnTriangle();
    tri.position.set(s.triangle.x, 0.04, s.triangle.z);
    tri.rotation.y = s.triangle.rot || 0;
    dynamic.add(tri);
  }
  if (s.light) {
    const { pos, rotY } = roadsidePose(s.light.arm);
    const tl = createTrafficLight();
    tl.position.copy(pos);
    tl.rotation.y = rotY;
    tl.userData.setState(s.light.state);
    dynamic.add(tl);
    dynamic.add(makeStopLine(s.light.arm));
  }
}

async function startQuiz(item) {
  current = item;
  answered = false;
  mode = 'quiz';
  stopCamTween();
  camState.shiftTarget = 0;
  ui.hideSim();
  ui.hideAlarm();
  buildQuizScene(item); // erhöht via clearDynamic den sceneToken
  const token = sceneToken;
  camState.mode = item.scene ? 'cine' : 'orbit';
  applyEnv(item.env || null);
  ui.hideExplanation();
  ui.hideQuestion();
  ui.hideQuiz();
  const { idx, total } = itemPos(item.id);
  ui.showHUD(tr(item, 'title'), idx, total);

  // Erst die Situation zeigen, dann fragen
  if (item.scene) {
    const ok = await runObserve(token);
    if (!ok || current !== item) return;
  }
  // Optionen mischen, damit die richtige Antwort nicht immer oben steht
  const opts = item.options
    .map((o, i) => ({ ...o, label: trOption(item, i) }))
    .sort(() => Math.random() - 0.5);
  ui.showQuiz(item, opts);
}

function answerQuiz(opt, el) {
  if (mode !== 'quiz' || answered) return;
  answered = true;
  const correct = !!opt.ok;
  ui.markQuiz(el, correct);
  correct ? sfx.good() : sfx.bad();
  if (correct || save.progress[current.id] !== 'passed') {
    save.progress[current.id] = correct ? 'passed' : 'failed';
  }
  persist();
  setTimeout(() => {
    if (mode !== 'quiz') return;
    mode = 'done';
    ui.showExplanation(current, correct, []);
  }, 900);
  if (correct) maybeAskReview();
}

async function answer(pickId) {
  if (mode !== 'question' || answered) return;
  answered = true;
  mode = 'playback';
  const sc = current;
  const token = sceneToken;
  const correctId = sc.order[0];
  const correct = pickId === correctId;

  ui.markChips(pickId, correctId);
  showOrderBadges(sc); // „Trailer": nummerierte Reihenfolge über den Fahrzeugen
  correct ? sfx.good() : sfx.bad();
  const who = correctId === 'player' ? t('youFirst') : `${labelOf(sc, correctId)} ${t('goesFirst')}`;
  ui.toast(correct ? t('toastRight') : t('toastWrong', who), 3600);

  // Fortschritt: „bestanden" nur beim ersten Versuch richtig; nie zurückstufen
  if (correct || save.progress[sc.id] !== 'passed') {
    save.progress[sc.id] = correct ? 'passed' : 'failed';
  }
  persist();
  if (correct) maybeAskReview();

  await wait(0.7);
  if (sceneToken !== token) return;
  ui.hideQuestion();

  // Ablauf jederzeit überspringbar — niemand wartet gern zwangsweise
  let skipped = false;
  ui.showSkip(() => { skipped = true; cancelSceneTweens(); });

  for (const id of sc.order) {
    if (sceneToken !== token) return;
    if (skipped) break;
    const ent = entities[id];
    if (!ent) continue;
    // Rote Ampel: Vor dem Spieler-Zug auf Rot-Gelb → Grün umschalten
    if (id === 'player' && sc.switchGreen && lightsMap.S) {
      lightsMap.S.userData.setState('redyellow');
      await wait(0.6);
      if (sceneToken !== token) return;
      lightsMap.S.userData.setState('green');
      await wait(0.35);
    }
    if (skipped) break;
    if (ent.kind === 'ped') {
      await pedWalk(ent);
    } else {
      if (ent.obj.userData.beacon) sfx.siren();
      await driveThrough(ent);
    }
    if (!skipped) await wait(0.2);
  }

  if (sceneToken !== token) return;
  if (skipped) {
    // Alle Beteiligten ans Ziel setzen, Ampel ggf. auf Grün
    if (sc.switchGreen && lightsMap.S) lightsMap.S.userData.setState('green');
    for (const id of sc.order) {
      const ent = entities[id];
      if (!ent) continue;
      if (ent.kind === 'ped') { ent.obj.position.copy(ent.to); ent.walking = false; }
      else ent.route.path.getPointAt(1, ent.obj.position);
    }
  }
  ui.hideSkip();
  mode = 'done';
  hideBadges();
  ui.showExplanation(sc, correct, signInfoFull(sc));
}

/* ============ Fahrsimulator ============
   Der Spieler fährt selbst (Gas/Bremse) von Süden über die Kreuzung.
   Regelverstöße — Stoppschild, Rotlicht, Vorfahrt, Zebrastreifen,
   Kollision — lösen sofort Alarm und Erklärung aus. */

const SIM_STOPLINE = 5.65; // Haltlinie (z) für Verkehr von Süden
const SIM_ZEBRALINE = 7.6; // Vorderkante Zebrastreifen
const SIM_ENTER = 4.2;     // Beginn des Kreuzungsbereichs
const SIM_VMAX = 10;       // Höchsttempo (~45 km/h Anzeige)

const sim = {
  active: false, sc: null, player: null, token: 0,
  v: 0, gas: false, brake: false,
  hasStopped: false, crossedLine: false, crossedZebra: false, entered: false,
  hazards: [], pedTriggered: false,
  lightPhase: null, lightT: 0, sirenT: 0, done: false
};

// Verfolgerkamera: Auf schmalen Hochkant-Screens höher und weiter zurück,
// sonst ist der Querverkehr von rechts/links nicht im Bild.
function simCamOffsets() {
  const k = THREE.MathUtils.clamp((1.15 - camera.aspect) / 0.65, 0, 1);
  return {
    h: 6.4 + 8.6 * k,      // Kamerahöhe
    back: 11.5 + 8 * k,    // Abstand hinter dem Auto
    ahead: 8 + 4 * k,      // Blickpunkt vor dem Auto
    ty: 1.1 - 0.5 * k      // Blickpunkt-Höhe
  };
}

function startSim(sc) {
  current = sc;
  answered = false;
  mode = 'sim';
  applyEnv(sc.env || null);
  setWorld('city');
  stopCamTween();
  camState.shiftTarget = 0;
  ui.hideQuiz();
  ui.hideExplanation();
  ui.hideQuestion();
  ui.hideAlarm();
  buildStatics(sc); // erhöht via clearDynamic den sceneToken

  const player = addCar('player', 'S', 'straight', { color: PLAYER_COLOR });
  player.obj.position.set(LANE, 0, 36);

  Object.assign(sim, {
    active: true, sc, player, token: sceneToken,
    v: 0, gas: false, brake: false,
    hasStopped: false, crossedLine: false, crossedZebra: false, entered: false,
    pedTriggered: false, lightPhase: sc.lightCycle ? 'red' : null,
    lightT: 0, sirenT: 0, done: false
  });
  // Hazards können abbiegen (turn), Radfahrer sein (bike) und verzögert
  // starten (delay) — so entstehen mittlere und schwere Situationen.
  sim.hazards = (sc.hazards || []).map((h) => ({
    def: h,
    ent: addCar(h.id, h.arm, h.turn || 'straight', {
      color: h.color, police: h.police, bike: h.bike,
      routeOpts: { laneOff: h.bike ? 2.95 : LANE }
    }),
    started: false, cleared: false
  }));

  const { idx, total } = itemPos(sc.id);
  ui.showHUD(tr(sc, 'title'), idx, total);
  ui.showSim(tr(sc, 'task'));

  // Verfolgerkamera hinter dem eigenen Auto
  const off = simCamOffsets();
  camState.mode = 'sim';
  camState.pos.set(LANE, off.h, 36 + off.back);
  camState.target.set(LANE, off.ty, 36 - off.ahead);
}

/* Sichtbarer Crash: 💥-Sprite, umherfliegende Trümmer, Kamera-Wackler.
   Läuft in `dynamic` — der nächste Szenenwechsel räumt automatisch auf. */
const camShake = { t: 0, amp: 0 };

function crashEffect(aPos, bPos = null) {
  const p = bPos ? aPos.clone().add(bPos).multiplyScalar(0.5) : aPos.clone();
  p.y = 0.9;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const cx = cv.getContext('2d');
  cx.font = '100px sans-serif';
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText('💥', 64, 72);
  const smat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false });
  const sp = new THREE.Sprite(smat);
  sp.position.copy(p);
  sp.scale.setScalar(1.2);
  dynamic.add(sp);

  const bits = [];
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.09, 0.16),
      new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? 0xd8dde4 : i % 3 === 1 ? 0x2c3340 : 0xd7263d })
    );
    m.position.copy(p);
    dynamic.add(m);
    const a = Math.random() * Math.PI * 2;
    bits.push({
      m,
      vx: Math.cos(a) * (1.6 + Math.random() * 2.2),
      vz: Math.sin(a) * (1.6 + Math.random() * 2.2),
      vy: 2.4 + Math.random() * 2.2,
      rx: Math.random() * 10, rz: Math.random() * 10
    });
  }
  tween(0.85, (tt) => {
    sp.scale.setScalar(1.2 + tt * 3.6);
    smat.opacity = 1 - tt;
    for (const b of bits) {
      b.m.position.set(
        p.x + b.vx * tt,
        Math.max(0.05, p.y + b.vy * tt - 5.6 * tt * tt),
        p.z + b.vz * tt
      );
      b.m.rotation.x = b.rx * tt;
      b.m.rotation.z = b.rz * tt;
    }
  }, 'linear').promise.then(() => {
    dynamic.remove(sp);
    for (const b of bits) dynamic.remove(b.m);
  });
  camShake.t = 0.55;
  camShake.amp = 0.6;
  sfx.crash();
}

function anyHazardBlocking() {
  // Wartende Fahrzeuge (yields) blockieren nie — sie lassen den Spieler durch
  return sim.hazards.some((h) => !h.def.yields && !h.cleared);
}

function simFail(kind) {
  if (sim.done) return;
  sim.done = true;
  sim.gas = sim.brake = false;
  cancelSceneTweens(); // Szene friert im Moment des Fehlers ein
  sfx.alarm();
  if (save.progress[sim.sc.id] !== 'passed') {
    save.progress[sim.sc.id] = 'failed';
    persist();
  }
  mode = 'simfail';
  ui.showAlarm(trMistake(sim.sc, kind) || t('simMistakeFallback'));
}

function simSuccess() {
  if (sim.done) return;
  sim.done = true;
  sfx.good();
  save.progress[sim.sc.id] = 'passed';
  persist();
  mode = 'done';
  ui.hideSim();
  const sc = sim.sc;
  setTimeout(() => {
    if (current === sc) ui.showExplanation(sc, true, [], t('doneSim'));
  }, 700);
  maybeAskReview();
}

function updateSim(dt) {
  if (!sim.active || sim.done || mode !== 'sim') return;
  const sc = sim.sc;
  const obj = sim.player.obj;

  // Fahrphysik: Gas, Bremse, Rollwiderstand — auf glatter Fahrbahn (Regen/
  // Schnee) greifen Bremse und Motor deutlich schlechter
  const slippery = !!sc.slippery;
  if (sim.gas) sim.v += (slippery ? 4.5 : 6) * dt;
  else sim.v -= (sim.brake ? (slippery ? 6 : 14) : (slippery ? 1.2 : 2.4)) * dt;
  sim.v = THREE.MathUtils.clamp(sim.v, 0, SIM_VMAX);
  const dist = sim.v * dt;
  obj.position.z -= dist;
  spinWheels(obj, dist);
  ui.setSimSpeed(Math.round(sim.v * 4.5));

  const zFront = obj.position.z - 2.15;

  // Vollständiges Anhalten an der Haltlinie (Stoppschild)
  if (sc.needStop && !sim.hasStopped && sim.v < 0.12 && zFront < SIM_STOPLINE + 5 && zFront > SIM_STOPLINE - 0.7) {
    sim.hasStopped = true;
  }

  // Ampel: Grün kommt, nachdem der Spieler bei Rot an der Linie gewartet hat
  if (sim.lightPhase === 'red') {
    if (sim.v < 0.12 && zFront < SIM_STOPLINE + 7) {
      sim.lightT += dt;
      if (sim.lightT > 2.2) {
        sim.lightPhase = 'redyellow';
        sim.lightT = 0;
        for (const arm of ['E', 'W', 'N']) if (lightsMap[arm]) lightsMap[arm].userData.setState('red');
        if (lightsMap.S) lightsMap.S.userData.setState('redyellow');
      }
    }
  } else if (sim.lightPhase === 'redyellow') {
    sim.lightT += dt;
    if (sim.lightT > 0.9) {
      sim.lightPhase = 'green';
      if (lightsMap.S) lightsMap.S.userData.setState('green');
    }
  }

  // Querverkehr auslösen und beobachten
  let policeActive = false;
  for (const h of sim.hazards) {
    if (!h.started && (h.def.autostart || obj.position.z < (h.def.trigger ?? 26))) {
      h.started = true;
      const token = sim.token;
      // done=false heißt: Tween wurde abgebrochen (Alarm) → nicht weiterfahren
      driveApproach(h.ent, h.def.delay || 0, 1.6).then((done) => {
        if (h.def.yields) return; // wartet an der Linie auf den Spieler
        if (done && sceneToken === token && !sim.done) {
          // Nach vollständiger Überquerung ist der Weg sicher frei —
          // wichtig für Abbieger, deren Kurs den Richtungs-Check unterläuft
          return driveThrough(h.ent).then(() => { h.cleared = true; });
        }
      });
    }
    // Wartende Fahrzeuge fahren los, sobald der Spieler die Kreuzung passiert hat
    if (h.def.yields && h.started && !h.cleared && obj.position.z < -2) {
      h.cleared = true;
      const token = sim.token;
      if (sceneToken === token && !sim.done) driveThrough(h.ent);
    }
    if (h.started && !h.cleared) {
      // Geradeausfahrer gelten schon als durch, wenn sie die Kreuzung verlassen
      if (!h.def.turn) {
        const d = ARMS[h.def.arm].dir;
        if (h.ent.obj.position.x * d.x + h.ent.obj.position.z * d.y > 6.5) h.cleared = true;
      }
      if (h.def.police) policeActive = true;
      const hitDist = h.def.bike ? 2.0 : 2.6;
      if (obj.position.distanceTo(h.ent.obj.position) < hitDist) {
        simFail('crash');
        return crashEffect(obj.position, h.ent.obj.position);
      }
    }
  }

  // Martinshorn, solange das Einsatzfahrzeug unterwegs ist
  if (policeActive) {
    sim.sirenT -= dt;
    if (sim.sirenT <= 0) { sfx.siren(); sim.sirenT = 1.4; }
  }

  // Fußgänger am Zebrastreifen
  if (sc.ped && entities.ped) {
    if (!sim.pedTriggered && obj.position.z < (sc.pedTrigger || 20)) {
      sim.pedTriggered = true;
      pedWalk(entities.ped);
    }
    if (obj.position.distanceTo(entities.ped.obj.position) < 1.7) {
      simFail('crash');
      return crashEffect(obj.position, entities.ped.obj.position);
    }
    if (!sim.crossedZebra && zFront < SIM_ZEBRALINE) {
      sim.crossedZebra = true;
      const onRoad = entities.ped.walking && Math.abs(entities.ped.obj.position.x) < 4.6;
      if (sim.pedTriggered && onRoad) return simFail('zebra');
    }
  }

  // Haltlinie überfahren: Rotlicht- und Stoppschild-Kontrolle
  if (!sim.crossedLine && zFront < SIM_STOPLINE) {
    sim.crossedLine = true;
    if (sim.lightPhase && sim.lightPhase !== 'green') return simFail('red');
    if (sc.needStop && !sim.hasStopped) return simFail('stop');
  }

  // In die Kreuzung eingefahren: Vorfahrt-Kontrolle
  if (!sim.entered && zFront < SIM_ENTER) {
    sim.entered = true;
    if (anyHazardBlocking()) return simFail('yield');
  }

  // Kreuzung vollständig überquert → geschafft
  if (zFront < -9) simSuccess();
}

// Tastatur (Desktop-Tests): ↑/W = Gas, ↓/S/Leertaste = Bremse, ←/→ = Blinker
window.addEventListener('keydown', (e) => {
  if ((mode !== 'sim' && mode !== 'drive') || e.repeat) return;
  if (e.code === 'ArrowUp' || e.code === 'KeyW') sim.gas = true;
  if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'Space') sim.brake = true;
  if (mode === 'drive' && e.code === 'ArrowLeft') setDriveIndicator('L');
  if (mode === 'drive' && e.code === 'ArrowRight') setDriveIndicator('R');
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') sim.gas = false;
  if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'Space') sim.brake = false;
});

/* ============ Dauerfahrten: Freies Fahren & Praktische Prüfung ============
   Der Spieler fährt viele zufällige Kreuzungen am Stück. Blinker = Abbiegen.
   Fehler werden gesammelt (kurzes rotes Aufblitzen), die Auswertung mit
   bestanden/nicht bestanden kommt erst am Ende — wie in der echten Prüfung. */

const FREE_SECONDS = parseInt(new URLSearchParams(location.search).get('drivesec'), 10) || 120;
const ENTRY_Z = carRoute('S', 'straight').entry.z; // Übergabepunkt Anfahrt → Kreuzungspfad

// Situations-Bausteine für die einzelnen Kreuzungen
const DRIVE_TPLS = {
  empty: { signs: {}, lights: null, ped: null, hazards: [] },
  'rvl-e': { signs: {}, lights: null, ped: null, hazards: [{ id: 'H', arm: 'E', color: CAR_COLORS.rot, trigger: 24 }] },
  'rvl-w-yield': { signs: {}, lights: null, ped: null, hazards: [{ id: 'H', arm: 'W', color: CAR_COLORS.blau, trigger: 26, yields: true }] },
  'yield-e': { signs: { S: 'yield', N: 'yield', E: 'priority', W: 'priority' }, lights: null, ped: null, hazards: [{ id: 'H', arm: 'E', color: CAR_COLORS.gruen, trigger: 25 }] },
  stop: { signs: { S: 'stop', N: 'stop', E: 'priority', W: 'priority' }, lights: null, ped: null, needStop: true, hazards: [{ id: 'H', arm: 'W', color: CAR_COLORS.weiss, trigger: 24 }] },
  lights: { signs: {}, lights: { S: 'red', N: 'red', E: 'green', W: 'green' }, ped: null, lightCycle: true, hazards: [] },
  zebra: { signs: { S: 'zebra' }, lights: null, ped: { arm: 'S' }, pedTrigger: 21, hazards: [] },
  // Gegenverkehr: nur ein Konflikt, wenn der Spieler links abbiegt
  oncoming: { signs: {}, lights: null, ped: null, hazards: [{ id: 'H', arm: 'N', color: CAR_COLORS.lila, trigger: 24, conflicts: ['left'] }] },
  police: { signs: {}, lights: null, ped: null, hazards: [{ id: 'P', arm: 'W', police: true, trigger: 26 }] },
  // Mitten auf der Strecke — keine Kreuzungssituation: Fußgänger tritt ohne
  // Zebrastreifen auf die Fahrbahn. Vorausschauend fahren!
  jaywalker: { signs: {}, lights: null, ped: null, jaywalk: true, hazards: [] }
};
const DRIVE_POOL = ['empty', 'rvl-e', 'rvl-w-yield', 'yield-e', 'stop', 'lights', 'zebra', 'oncoming', 'police', 'jaywalker'];

// Die Prüfung: feste Route mit Anweisungen — wie beim Fahrprüfer
const TEST_SCRIPT = [
  { dir: 'straight', tpl: 'rvl-e' },
  { dir: 'right', tpl: 'zebra' },
  { dir: 'left', tpl: 'oncoming' },
  { dir: 'straight', tpl: 'stop' },
  { dir: 'left', tpl: 'lights' },
  { dir: 'straight', tpl: 'police' }
];

const drv = {
  item: null, sub: 'free', round: 0, timeLeft: 0, mistakes: [],
  player: null, tpl: null, instr: null, hazards: [],
  phase: 'idle', v: 0, indicator: null, chosen: null,
  path: null, pathLen: 0, pathS: 0, fwd: new THREE.Vector3(0, 0, -1),
  flags: {}, lightPhase: null, lightT: 0, sirenT: 0, crashT: 0, token: 0
};

const instrText = (dir) =>
  dir === 'left' ? t('instrLeft') : dir === 'right' ? t('instrRight') :
  dir === 'straight' ? t('instrStraight') : t('driveFreeTask');

function startDrive(item) {
  current = item;
  answered = false;
  mode = 'drive';
  setLayout(world, 'cross'); // Dauerfahrten laufen über Vollkreuzungen
  applyEnv(null);
  setWorld('city');
  stopCamTween();
  camState.shiftTarget = 0;
  ui.hideQuiz();
  ui.hideExplanation();
  ui.hideQuestion();
  ui.hideAlarm();
  Object.assign(drv, {
    item, sub: item.sub, round: 0, mistakes: [], aborted: false,
    timeLeft: item.sub === 'test' ? Infinity : FREE_SECONDS, v: 0
  });
  const { idx, total } = itemPos(item.id);
  ui.showHUD(tr(item, 'title'), idx, total);
  camState.mode = 'sim';
  if (item.sub === 'autobahn') {
    startAutobahn();
    return;
  }
  ui.showDrive(instrText(null));
  camState.pos.set(LANE, 10, 46);
  camState.target.set(LANE, 1, 24);
  nextDriveRound();
}

function nextDriveRound() {
  if (mode !== 'drive') return;
  if (drv.sub === 'test' && drv.round >= TEST_SCRIPT.length) return endDrive();
  if (drv.sub === 'free' && drv.timeLeft <= 0) return endDrive();
  drv.round++;
  const spec = drv.sub === 'test'
    ? TEST_SCRIPT[drv.round - 1]
    : { dir: null, tpl: DRIVE_POOL[Math.floor(Math.random() * DRIVE_POOL.length)] };
  const tpl = DRIVE_TPLS[spec.tpl];
  buildStatics(tpl); // erhöht via clearDynamic den sceneToken
  drv.player = addCar('player', 'S', 'straight', { color: PLAYER_COLOR });
  drv.player.obj.position.set(LANE, 0, 30);
  // Fußgänger mitten auf der Strecke (ohne Zebrastreifen)
  if (tpl.jaywalk) {
    const ped = createPedestrian(0xc95f4a);
    const from = new THREE.Vector3(ROAD_HALF + 1.6, 0.12, 17);
    const to = new THREE.Vector3(-(ROAD_HALF + 1.6), 0.12, 17);
    ped.position.copy(from);
    ped.rotation.y = headingY(to.x - from.x, to.z - from.z);
    dynamic.add(ped);
    entities.ped = { obj: ped, kind: 'ped', from, to, walking: false };
  }
  drv.hazards = (tpl.hazards || []).map((h) => ({
    def: h,
    ent: addCar(h.id, h.arm, h.turn || 'straight', { color: h.color, police: h.police, bike: h.bike }),
    started: false, cleared: false
  }));
  Object.assign(drv, {
    tpl, instr: spec.dir, token: sceneToken,
    // Tempo bleibt erhalten — die Fahrt läuft nahtlos von Kreuzung zu Kreuzung
    phase: 'approach', indicator: null, chosen: null,
    path: null, pathLen: 0, pathS: 0,
    flags: { stopped: false, crossed: false, zebraChecked: false, pedTrig: false, recorded: {} },
    lightPhase: tpl.lightCycle ? 'red' : null, lightT: 0, sirenT: 0
  });
  drv.fwd.set(0, 0, -1);
  ui.setIndicator(null);
  ui.setDriveTask(instrText(spec.dir));
  // Kamera hart auf die ideale Verfolgerposition setzen: Das alte und das neue
  // Bild (gerade Straße, Kreuzung voraus) sind fast identisch — so wirkt der
  // Rundenwechsel wie eine durchgehende Fahrt statt eines Neustarts.
  const off = simCamOffsets();
  camState.pos.set(LANE, off.h, 30 + off.back);
  camState.target.set(LANE, off.ty, 30 - off.ahead);
  // clearDynamic hat die Pedale zurückgesetzt — gedrückt gehaltene wiederherstellen,
  // damit die Fahrt zwischen den Kreuzungen nicht stockt
  sim.gas = document.getElementById('pedal-gas').classList.contains('down');
  sim.brake = document.getElementById('pedal-brake').classList.contains('down');
}

function driveMistakeText(key) { return t('driveMistakes')[key]; }

function recordDriveMistake(key) {
  if (drv.flags.recorded[key]) return; // pro Kreuzung/Zone nur einmal
  drv.flags.recorded[key] = true;
  const where = drv.sub === 'autobahn'
    ? `${(ab.dist * 1.25 / 1000).toFixed(1)} km`
    : `${t('crossing')} ${drv.round}`;
  drv.mistakes.push({ round: drv.round, key, where });
  sfx.bad();
  ui.flashMistake();
  ui.toast(`⚠️ ${driveMistakeText(key)}`, 2400);
}

function setDriveIndicator(side) {
  if (mode !== 'drive' || !drv.player) return;
  if (drv.sub === 'autobahn') {
    // Auf der Autobahn wechselt der Blinker die Spur
    const want = side === 'L' ? 1 : 0; // AB_LANES: [rechts, links]
    if (ab.lane !== want) {
      ab.lane = want;
      drv.indicator = side;
      ui.setIndicator(side);
      setBlinker(drv.player.obj, side);
    }
    return;
  }
  drv.indicator = drv.indicator === side ? null : side;
  ui.setIndicator(drv.indicator);
  setBlinker(drv.player.obj, drv.indicator);
}

function endDrive() {
  if (mode !== 'drive') return;
  mode = 'done';
  const majors = drv.mistakes.filter((m) => m.key !== 'wrongdir');
  const passed = drv.sub === 'test'
    ? majors.length === 0 && drv.mistakes.length <= 1
    : majors.length === 0;
  save.progress[drv.item.id] = passed ? 'passed' : 'failed';
  persist();
  // Bestandene Praktische Prüfung ist der stärkste Moment — hier fragen wir
  // auch dann, wenn noch keine 5 Übungen bestanden sind.
  if (passed && drv.sub === 'test') maybeAskReview(true);
  const items = drv.mistakes.map((m) => ({
    text: driveMistakeText(m.key),
    where: m.where
  }));
  const verdict = drv.sub === 'test'
    ? (passed ? t('resPassed') : drv.aborted ? t('resAborted') : t('resFailed'))
    : drv.sub === 'autobahn'
      ? t('resDistance', (ab.dist * 1.25 / 1000).toFixed(1))
      : t('resCrossings', Math.max(0, drv.round - 1));
  ui.showDriveResults({
    title: drv.sub === 'test' ? t('resTestTitle') : t('resFreeTitle'),
    emoji: passed ? '🏁' : '📋',
    verdict,
    verdictGood: drv.sub === 'test' ? passed : null,
    items,
    footer: items.length ? '' : t('resClean')
  });
}

function updateDrive(dt) {
  if (mode !== 'drive' || !drv.player) return;
  if (drv.sub === 'autobahn') return updateAutobahn(dt);

  if (drv.phase === 'crashed') {
    drv.crashT -= dt;
    if (drv.crashT <= 0) {
      // In der Praktischen Prüfung endet die Fahrt mit einer Kollision — wie in der echten Prüfung
      if (drv.sub === 'test') { drv.aborted = true; return endDrive(); }
      nextDriveRound();
    }
    return;
  }

  // Zeit läuft nur im Freien Fahren
  if (drv.sub === 'free') drv.timeLeft -= dt;
  const secs = Math.max(0, Math.ceil(drv.timeLeft));
  const timer = drv.sub === 'free'
    ? `⏱ ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
    : `${t('crossing')} ${drv.round}/${TEST_SCRIPT.length}`;
  ui.setDriveInfo(timer, drv.mistakes.length ? t('mistCount', drv.mistakes.length) : '');

  // Zeit um & noch sicher vor der Kreuzung → sofort auswerten
  if (drv.sub === 'free' && drv.timeLeft <= 0 && drv.phase === 'approach' && drv.player.obj.position.z > ENTRY_Z + 5) {
    return endDrive();
  }

  // Fahrphysik wie im Simulator
  if (sim.gas) drv.v += 6 * dt;
  else drv.v -= (sim.brake ? 14 : 2.4) * dt;
  drv.v = THREE.MathUtils.clamp(drv.v, 0, SIM_VMAX);
  const dist = drv.v * dt;
  const obj = drv.player.obj;
  const tpl = drv.tpl;
  ui.setSimSpeed(Math.round(drv.v * 4.5));

  if (drv.phase === 'approach') {
    obj.position.z -= dist;
    spinWheels(obj, dist);
    const zFront = obj.position.z - 2.15;

    // Vollständiges Anhalten am Stoppschild
    if (tpl.needStop && !drv.flags.stopped && drv.v < 0.12 && zFront < SIM_STOPLINE + 5 && zFront > SIM_STOPLINE - 0.7) {
      drv.flags.stopped = true;
    }

    // Ampelphasen (Rot → Rot-Gelb → Grün, wenn der Spieler wartet)
    if (drv.lightPhase === 'red') {
      if (drv.v < 0.12 && zFront < SIM_STOPLINE + 7) {
        drv.lightT += dt;
        if (drv.lightT > 2.2) {
          drv.lightPhase = 'redyellow';
          drv.lightT = 0;
          for (const arm of ['E', 'W', 'N']) if (lightsMap[arm]) lightsMap[arm].userData.setState('red');
          if (lightsMap.S) lightsMap.S.userData.setState('redyellow');
        }
      }
    } else if (drv.lightPhase === 'redyellow') {
      drv.lightT += dt;
      if (drv.lightT > 0.9) {
        drv.lightPhase = 'green';
        if (lightsMap.S) lightsMap.S.userData.setState('green');
      }
    }

    // Fußgänger tritt mitten auf der Strecke auf die Fahrbahn (ohne Zebrastreifen)
    if (tpl.jaywalk && entities.ped) {
      if (!drv.flags.pedTrig && obj.position.z < 26) {
        drv.flags.pedTrig = true;
        pedWalk(entities.ped);
      }
      if (obj.position.distanceTo(entities.ped.obj.position) < 1.7) {
        recordDriveMistake('crash');
        return driveCrash(entities.ped.obj.position);
      }
    }

    // Fußgänger am Zebrastreifen
    if (tpl.ped && entities.ped) {
      if (!drv.flags.pedTrig && obj.position.z < (tpl.pedTrigger || 20)) {
        drv.flags.pedTrig = true;
        pedWalk(entities.ped);
      }
      if (obj.position.distanceTo(entities.ped.obj.position) < 1.7) {
        recordDriveMistake('crash');
        return driveCrash(entities.ped.obj.position);
      }
      if (!drv.flags.zebraChecked && zFront < SIM_ZEBRALINE) {
        drv.flags.zebraChecked = true;
        const onRoad = entities.ped.walking && Math.abs(entities.ped.obj.position.x) < 4.6;
        if (drv.flags.pedTrig && onRoad) recordDriveMistake('zebra');
      }
    }

    // Haltlinie: Rotlicht & Stoppschild
    if (!drv.flags.crossed && zFront < SIM_STOPLINE) {
      drv.flags.crossed = true;
      if (drv.lightPhase && drv.lightPhase !== 'green') recordDriveMistake('red');
      if (tpl.needStop && !drv.flags.stopped) recordDriveMistake('stop');
    }

    // Übergabepunkt: Richtung festlegen, Vorfahrt prüfen, auf Kurvenpfad wechseln
    if (obj.position.z <= ENTRY_Z) {
      const chosen = drv.indicator === 'L' ? 'left' : drv.indicator === 'R' ? 'right' : 'straight';
      drv.chosen = chosen;
      if (drv.instr && chosen !== drv.instr) recordDriveMistake('wrongdir');
      const blocking = drv.hazards.some((h) =>
        !h.cleared && !h.def.yields &&
        (!h.def.conflicts || h.def.conflicts.includes(chosen)));
      if (blocking) recordDriveMistake('yield');
      const route = carRoute('S', chosen);
      drv.path = route.path;
      drv.pathLen = drv.path.getLength();
      drv.pathS = Math.max(0, ENTRY_Z - obj.position.z);
      drv.phase = 'path';
    }
  } else if (drv.phase === 'path') {
    drv.pathS += dist;
    const tp = Math.min(1, drv.pathS / drv.pathLen);
    drv.path.getPointAt(tp, obj.position);
    const tan = new THREE.Vector3();
    drv.path.getTangentAt(Math.min(tp, 0.999), tan);
    tan.y = 0; tan.normalize();
    obj.rotation.y = headingY(tan.x, tan.z);
    drv.fwd.copy(tan);
    spinWheels(obj, dist);
    // Blinker nach der Kurve automatisch aus
    if (tp > 0.55 && drv.indicator) setDriveIndicator(drv.indicator);
    // Runde endet kurz HINTER der Kreuzung — nicht erst am fernen Straßenende.
    // Zusammen mit erhaltenem Tempo und Kamera-Schnitt wirkt das nahtlos.
    if (drv.pathS >= 26 || tp >= 1) return nextDriveRound();
  }

  // Querverkehr: auslösen, freigeben, Kollisionen
  let policeActive = false;
  for (const h of drv.hazards) {
    if (!h.started && (h.def.autostart || obj.position.z < (h.def.trigger ?? 26))) {
      h.started = true;
      const token = drv.token;
      driveApproach(h.ent, h.def.delay || 0, 1.6).then((done) => {
        if (h.def.yields) return;
        if (done && sceneToken === token && mode === 'drive') {
          return driveThrough(h.ent).then(() => { h.cleared = true; });
        }
      });
    }
    if (h.def.yields && h.started && !h.cleared && obj.position.z < -2) {
      h.cleared = true;
      if (sceneToken === drv.token && mode === 'drive') driveThrough(h.ent);
    }
    if (h.started && !h.cleared) {
      if (!h.def.turn) {
        const d = ARMS[h.def.arm].dir;
        if (h.ent.obj.position.x * d.x + h.ent.obj.position.z * d.y > 6.5) h.cleared = true;
      }
      if (h.def.police) policeActive = true;
      if (obj.position.distanceTo(h.ent.obj.position) < (h.def.bike ? 2.0 : 2.6)) {
        recordDriveMistake('crash');
        return driveCrash(h.ent.obj.position);
      }
    }
  }
  if (policeActive) {
    drv.sirenT -= dt;
    if (drv.sirenT <= 0) { sfx.siren(); drv.sirenT = 1.4; }
  }
}

function driveCrash(otherPos = null) {
  cancelSceneTweens();
  crashEffect(drv.player.obj.position, otherPos);
  drv.phase = 'crashed';
  drv.crashT = 1.1;
  drv.v = 0;
}

/* ---------- Autobahn ----------
   Zwei Spuren in Fahrtrichtung, Blinker = Spurwechsel. Langsame LKW/PKW
   zum Überholen, Tempolimit-Zonen und Rechtsfahrgebot. Die Welt ist
   periodisch: Spieler, Verkehr und Kamera werden unsichtbar zurückversetzt. */

const AB_VMAX = 32;          // ~144 km/h
const AB_LIMIT_ZONES = [null, 120, null, 100]; // Wechsel alle ~AB_ZONE_LEN Einheiten
const AB_ZONE_LEN = 620;

const ab = {
  cars: [], signs: [], spawnT: 0, lane: 0, dist: 0,
  limit: null, zoneIdx: -1, speedT: 0, leftT: 0, crashCool: 0
};

// Rundes Tempolimit-Schild (Canvas-Textur), am rechten Fahrbahnrand
function makeLimitSign(limit) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d');
  ctx.beginPath(); ctx.arc(64, 64, 62, 0, Math.PI * 2);
  ctx.fillStyle = '#f2f3f5'; ctx.fill();
  ctx.lineWidth = 14; ctx.strokeStyle = limit ? '#c1121f' : '#8a9097';
  ctx.beginPath(); ctx.arc(64, 64, 54, 0, Math.PI * 2); ctx.stroke();
  if (limit) {
    ctx.fillStyle = '#14181f';
    ctx.font = '900 52px -apple-system, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(limit), 64, 68);
  } else {
    // Aufhebungszeichen: graue Diagonalstreifen
    ctx.strokeStyle = '#8a9097'; ctx.lineWidth = 9;
    for (const o of [-16, 0, 16]) {
      ctx.beginPath(); ctx.moveTo(28 + o, 100); ctx.lineTo(100 + o, 28); ctx.stroke();
    }
  }
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 2.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x9aa1a8 })
  );
  pole.position.y = 1.3;
  g.add(pole);
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 24),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) })
  );
  face.position.set(0, 2.9, 0);
  g.add(face);
  return g;
}

function abSpawnCar() {
  const truck = Math.random() < 0.4;
  const colors = [CAR_COLORS.weiss, CAR_COLORS.blau, CAR_COLORS.gelb, 0x8b929b, 0x5b6670];
  const color = colors[Math.floor(Math.random() * colors.length)];
  // LKW sind ein eigenes Modell — ein hochskaliertes Auto sah aus wie ein Spielzeug
  const car = truck ? createTruck({ color }) : createCar({ color });
  const lane = truck ? 0 : (Math.random() < 0.7 ? 0 : 1); // LKW immer rechts
  car.position.set(AB_LANES[lane], 0, drv.player.obj.position.z - 150);
  car.rotation.y = Math.PI; // Fahrtrichtung -z
  dynamic.add(car);
  ab.cars.push({
    obj: car, lane, truck,
    speed: truck ? 13 + Math.random() * 3 : 17 + Math.random() * 5,
    targetLane: lane, changeT: 4 + Math.random() * 6
  });
}

function startAutobahn() {
  clearDynamic();
  setWorld('autobahn'); // Stadt samt Passanten ausblenden
  applyEnv(null);
  drv.player = { obj: createCar({ color: PLAYER_COLOR }) };
  drv.player.obj.rotation.y = Math.PI;
  drv.player.obj.position.set(AB_LANES[0], 0, -10);
  dynamic.add(drv.player.obj);
  Object.assign(drv, {
    phase: 'approach', v: 10, indicator: null,
    flags: { recorded: {} }, token: sceneToken
  });
  drv.fwd.set(0, 0, -1);
  Object.assign(ab, {
    cars: [], signs: [], spawnT: 1.2, lane: 0, dist: 0,
    limit: null, zoneIdx: -1, speedT: 0, leftT: 0, crashCool: 0
  });
  ui.showDrive(t('abTask'));
  ui.setIndicator(null);
  const off = simCamOffsets();
  camState.pos.set(AB_LANES[0], off.h, -10 + off.back + 4);
  camState.target.set(AB_LANES[0], off.ty, -10 - off.ahead);
}

function updateAutobahn(dt) {
  const obj = drv.player.obj;

  if (drv.phase === 'crashed') {
    drv.crashT -= dt;
    if (drv.crashT <= 0) { drv.phase = 'approach'; drv.v = 8; }
    return;
  }

  drv.timeLeft -= dt;
  const secs = Math.max(0, Math.ceil(drv.timeLeft));
  ui.setDriveInfo(
    `⏱ ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}${ab.limit ? ` · max ${ab.limit}` : ''}`,
    drv.mistakes.length ? t('mistCount', drv.mistakes.length) : ''
  );
  if (drv.timeLeft <= 0) return endDrive();

  // Physik: höheres Tempo, längere Wege
  if (sim.gas) drv.v += 8 * dt;
  else drv.v -= (sim.brake ? 18 : 1.6) * dt;
  drv.v = THREE.MathUtils.clamp(drv.v, 0, AB_VMAX);
  const dist = drv.v * dt;
  obj.position.z -= dist;
  ab.dist += dist;
  spinWheels(obj, dist);
  ui.setSimSpeed(Math.round(drv.v * 4.5));

  // Spurwechsel sanft ausführen, Blinker danach aus
  const targetX = AB_LANES[ab.lane];
  obj.position.x += (targetX - obj.position.x) * Math.min(1, dt * 3.0);
  obj.rotation.y = Math.PI - (targetX - obj.position.x) * 0.22;
  if (drv.indicator && Math.abs(targetX - obj.position.x) < 0.12) {
    drv.indicator = null;
    ui.setIndicator(null);
    setBlinker(obj, null);
  }

  // Tempolimit-Zonen: Schild ankündigen, dann gilt das Limit
  const zone = Math.floor(ab.dist / AB_ZONE_LEN) % AB_LIMIT_ZONES.length;
  if (zone !== ab.zoneIdx) {
    ab.zoneIdx = zone;
    ab.limit = AB_LIMIT_ZONES[zone];
    drv.flags.recorded.speed = false;
    const sign = makeLimitSign(ab.limit);
    sign.position.set(6.6, 0.1, obj.position.z - 90);
    sign.rotation.y = 0;
    dynamic.add(sign);
    ab.signs.push(sign);
  }
  if (ab.limit && drv.v * 4.5 > ab.limit + 9) {
    ab.speedT += dt;
    if (ab.speedT > 1.2) recordDriveMistake('speed');
  } else {
    ab.speedT = 0;
  }

  // Rechtsfahrgebot: links bleiben, obwohl rechts frei ist
  const rightClear = !ab.cars.some((c) =>
    c.lane === 0 && c.obj.position.z < obj.position.z + 6 && c.obj.position.z > obj.position.z - 70);
  if (ab.lane === 1 && rightClear && drv.v > 4) {
    ab.leftT += dt;
    if (ab.leftT > 6) recordDriveMistake('rechts');
  } else {
    ab.leftT = 0;
  }

  // Verkehr: spawnen, bewegen, aufräumen, Auffahr-Check
  ab.spawnT -= dt;
  if (ab.spawnT <= 0 && ab.cars.length < 7) {
    abSpawnCar();
    ab.spawnT = 2.4 + Math.random() * 2.2;
  }
  ab.crashCool = Math.max(0, ab.crashCool - dt);
  for (let i = ab.cars.length - 1; i >= 0; i--) {
    const c = ab.cars[i];
    c.obj.position.z -= c.speed * dt;
    spinWheels(c.obj, c.speed * dt);

    /* Eigenes Fahrverhalten: PKW scheren zum Überholen aus, blinken dabei und
       ziehen danach wieder nach rechts — vorher fuhr alles starr geradeaus. */
    if (!c.truck) {
      c.changeT -= dt;
      if (c.changeT <= 0) {
        const blocked = ab.cars.some((o) => o !== c && o.lane === 1 - c.lane
          && Math.abs(o.obj.position.z - c.obj.position.z) < 14);
        if (!blocked) {
          c.targetLane = c.lane === 0 ? 1 : 0;
          c.lane = c.targetLane;
          setBlinker(c.obj, c.targetLane === 1 ? 'L' : 'R');
        }
        c.changeT = 6 + Math.random() * 8;
      }
      const tx = AB_LANES[c.targetLane];
      const dx = tx - c.obj.position.x;
      if (Math.abs(dx) > 0.02) {
        c.obj.position.x += dx * Math.min(1, dt * 1.6);
        c.obj.rotation.y = Math.PI - dx * 0.20;
      } else if (c.obj.userData.blinker) {
        c.obj.position.x = tx;
        c.obj.rotation.y = Math.PI;
        setBlinker(c.obj, null);
      }
    }
    if (c.obj.position.z > obj.position.z + 45) {
      dynamic.remove(c.obj);
      ab.cars.splice(i, 1);
      continue;
    }
    const gap = obj.position.z - c.obj.position.z; // > 0: Fahrzeug voraus
    if (Math.abs(c.obj.position.x - obj.position.x) < 1.6 && gap > 0 && gap < (c.truck ? 5.6 : 3.4)) {
      if (ab.crashCool <= 0) {
        drv.flags.recorded.crash = false;
        recordDriveMistake('crash');
        crashEffect(obj.position, c.obj.position);
        ab.crashCool = 4;
        dynamic.remove(c.obj);
        ab.cars.splice(i, 1);
        drv.phase = 'crashed';
        drv.crashT = 0.9;
        drv.v = 0;
        return;
      }
    }
  }

  // Periodische Welt: alles unsichtbar um eine Segmentlänge zurückversetzen
  if (obj.position.z < -AB_SEG) {
    obj.position.z += AB_SEG;
    camState.pos.z += AB_SEG;
    camState.target.z += AB_SEG;
    for (const c of ab.cars) c.obj.position.z += AB_SEG;
    for (let i = ab.signs.length - 1; i >= 0; i--) {
      const s = ab.signs[i];
      s.position.z += AB_SEG;
      if (s.position.z > obj.position.z + 60) {
        dynamic.remove(s);
        ab.signs.splice(i, 1);
      }
    }
  }
}

function nextItem() {
  ui.hideExplanation();
  ui.hideQuiz();
  const cat = CATEGORIES.find((c) => c.id === currentCatId);
  if (!cat) { openMenu(); return; }
  const idx = cat.items.indexOf(current.id);
  const nextId = cat.items[idx + 1];
  if (!nextId) {
    openMenu();
    ui.toast(t('catDone', trCat(cat, 'title')));
    maybeAskReview(true);
    return;
  }
  const next = byId(nextId);
  if (!next.free && !effectiveUnlocked()) {
    openMenu(currentCatId);
    ui.showPaywall();
    return;
  }
  startItem(nextId);
}

/* ============ Attract-Modus (Titel/Menü) ============ */

const ATTRACT_ARMS = ['S', 'E', 'N', 'W'];
const ATTRACT_COLORS = [0xd7263d, 0x2166c9, 0xf0b429, 0xe4e6ea, 0x2f9e44, 0x7048b6];
let attractIdx = 0;
let attractTimer = 0;

function spawnAttractCar(now) {
  const arm = ATTRACT_ARMS[attractIdx++ % 4];
  const turns = ['straight', 'straight', 'left', 'right'];
  const turn = turns[Math.floor(Math.random() * turns.length)];
  const route = carRoute(arm, turn);
  const car = createCar({ color: ATTRACT_COLORS[Math.floor(Math.random() * ATTRACT_COLORS.length)] });
  car.position.copy(route.spawn);
  car.rotation.y = route.headIn;
  if (turn !== 'straight') setBlinker(car, turn === 'left' ? 'L' : 'R');
  dynamic.add(car);

  // Ganzer Weg: Anfahrt + Kreuzung in einem Zug
  const full = new THREE.CurvePath();
  full.add(route.approach);
  for (const c of route.path.curves) full.add(c);
  const len = full.getLength();
  const tmpT = new THREE.Vector3();
  let last = 0;
  tween(len / 10, (t) => {
    full.getPointAt(t, car.position);
    full.getTangentAt(Math.min(t, 0.999), tmpT);
    car.rotation.y = headingY(tmpT.x, tmpT.z);
    spinWheels(car, (t - last) * len); last = t;
  }, 'linear').promise.then(() => dynamic.remove(car));
}

/* ============ UI-Verdrahtung ============ */

function openMenu(catId = null) {
  mode = 'menu';
  clearDynamic();
  stopCamTween();
  camState.mode = 'orbit';
  camState.shiftTarget = 0;
  applyEnv(null);
  setWorld('city'); // falls wir von der Autobahn kommen
  ui.showMenu(save.progress, effectiveUnlocked(), catId);
}

const ui = initUI({
  onStart: () => { sfx.click(); openMenu(); },
  onOpenMenu: () => { sfx.click(); openMenu(currentCatId); },
  onTitle: () => {
    sfx.click(); mode = 'title'; clearDynamic(); stopCamTween();
    camState.mode = 'orbit'; camState.shiftTarget = 0; applyEnv(null); setWorld('city'); ui.showTitle();
  },
  onSelectLevel: (id) => { sfx.click(); startItem(id); },
  onAnswer: (id) => answer(id),
  onQuizAnswer: (opt, el) => answerQuiz(opt, el),
  onNext: () => { sfx.click(); nextItem(); },
  onRetry: () => { sfx.click(); ui.hideExplanation(); startItem(current.id); },
  onPedal: (which, down) => {
    ensureAudio();
    if (which === 'gas') sim.gas = down;
    else sim.brake = down;
  },
  onAlarmRetry: () => { sfx.click(); ui.hideAlarm(); startItem(current.id); },
  onAlarmMenu: () => { sfx.click(); ui.hideAlarm(); openMenu(currentCatId); },
  onIndicator: (side) => { ensureAudio(); sfx.click(); setDriveIndicator(side); },
  onDriveDone: () => { sfx.click(); openMenu(currentCatId); },
  onBuy: () => {
    if (window.IAP && IAP.native) {
      ui.toast('…');
      IAP.purchase().then((res) => {
        if (res && res.ok && res.unlocked) { applyUnlocked(res.sub); }
        else if (res && res.error === 'cancelled') { /* user cancelled — no message */ }
        else { ui.toast(t('purchaseFailed')); }
      });
      return;
    }
    if (window.__WEB_DEMO) { window.__WEB_DEMO.openStore('paywall'); return; }
    // Browser dev fallback (no native StoreKit): simulate the unlock.
    applyUnlocked();
  },
  onRestore: () => {
    if (window.IAP && IAP.native) {
      ui.toast('…');
      IAP.restore().then((res) => {
        if (res && res.ok && res.unlocked) applyUnlocked(res.sub);
        else ui.toast(t('noRestore'));
      });
      return;
    }
    ui.toast(t('noRestore'));
  },
  // Preis fehlt noch (z. B. beim Start offline)? Beim Öffnen der Paywall erneut holen.
  onPaywallOpen: () => { if (!storePrice) refreshStoreStatus(); }
});

// Apply a confirmed unlock (native purchase/restore, or browser-dev fallback).
function applyUnlocked(sub) {
  sfx.good();
  save.unlocked = true;
  save.unlockSub = !!sub;
  persist();
  ui.hidePaywall();
  ui.refreshMenu(save.progress, effectiveUnlocked());
  ui.toast(t('unlocked'));
}

// Sync entitlement from the App Store on launch, and react to entitlements that
// arrive asynchronously (Ask to Buy approval, restore on another device).
// `sub` is undefined when the caller doesn't know the kind (remote paywall result) — keep the flag then.
window.__onEntitlement = (unlocked, sub) => syncEntitlement(unlocked, sub);

function syncEntitlement(unlocked, sub) {
  const before = save.unlocked + '|' + save.unlockSub;
  if (unlocked) {
    save.unlocked = true;
    if (sub !== undefined) save.unlockSub = !!sub;
  } else if (save.unlocked && save.unlockSub) {
    // Subscription ended (cancelled, expired, refunded) → back to the free exercises.
    save.unlocked = false;
    save.unlockSub = false;
  }
  if (before === save.unlocked + '|' + save.unlockSub) return;
  persist();
  ui.refreshMenu(save.progress, effectiveUnlocked());
}

/* Preis im Kauf-Button: nur der echte App-Store-Preis, nie ein fest eingebauter.
   applyStaticTexts() schreibt den Button bei jedem Sprachwechsel neu — deshalb
   wird der Preis danach wieder eingesetzt. Ohne bekannten Preis steht dort
   „Alle Übungen freischalten" ohne Betrag. */
let storePrice = null;
// Cross-promo loyalty: first buyers are told they get 20% off our other apps;
// people who already bought one of them pay 20% less here (native swaps the product).
let loyalty = { loyal: false, regularPrice: null };
function updateLoyalty() {
  const tag = document.getElementById('pay-loyalty');
  if (tag) {
    tag.innerHTML = t(loyalty.loyal ? 'loyalCustomer' : 'loyalOther');
    tag.onclick = () => window.CrossPromo && window.CrossPromo.showList(true);
  }
  const was = document.getElementById('pay-loyal-price');
  if (was) was.textContent = loyalty.loyal && loyalty.regularPrice ? t('insteadOf') + loyalty.regularPrice : '';
}
onLangChange(updateLoyalty);
function updateBuyLabel() {
  const buyBtn = document.getElementById('btn-buy');
  if (buyBtn) buyBtn.textContent = storePrice ? t('unlockFor').replace('{price}', storePrice) : (window.__WEB_DEMO ? window.__WEB_DEMO.t('buy') : t('payBtn'));
}
function refreshStoreStatus() {
  if (!window.IAP || !IAP.native) return;
  IAP.status().then((res) => {
    if (res && res.version) window.__appVersion = res.version;
    if (!res || !res.ok) return;
    // Only a confirmed "not entitled" may re-lock; an unanswered check (offline) changes nothing.
    if (res.unlocked || res.verified) syncEntitlement(!!res.unlocked, res.sub);
    if (res.price) {
      storePrice = res.price;
      updateBuyLabel();
    }
    loyalty = { loyal: !!res.loyal, regularPrice: res.regularPrice || null };
    updateLoyalty();
  });
}
onLangChange(updateBuyLabel);
refreshStoreStatus();
// Back in the foreground: a subscription may have renewed or ended meanwhile.
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshStoreStatus(); });
updateLoyalty();

/* ============ Sprachwechsel DE/EN ============ */

applyStaticTexts();
// Direkter Einstieg in den Fahrsimulator vom Titelbildschirm
document.getElementById('btn-sim').onclick = () => { sfx.click(); openMenu('sim'); };
// Titel-Badges sind Schnellzugriffe auf ihre Kategorie (delegiert, da die
// Spans beim Sprachwechsel neu erzeugt werden)
document.querySelector('#screen-title .badges').addEventListener('click', (e) => {
  const cat = e.target.dataset && e.target.dataset.cat;
  if (cat) { sfx.click(); openMenu(cat); }
});
document.getElementById('btn-lang').onchange = (event) => {
  sfx.click();
  setLang(event.target.value);
  ui.refreshMenu(save.progress, effectiveUnlocked());
  window.dispatchEvent(new Event('cp-lang'));
};
initCrossPromo({ proCheck: () => save.unlocked });

/* ============ Debug-Freischaltung (nur Entwicklung) ============
   Schalter oben links: schaltet alle Übungen frei, ohne zu bezahlen. */
const debugCheckbox = document.getElementById('debug-checkbox');

function setDebug(on) {
  save.debug = on;
  persist();
  debugBar.classList.toggle('visible', on);
  debugCheckbox.checked = on;
  ui.refreshMenu(save.progress, effectiveUnlocked());
}

debugCheckbox.onchange = () => {
  setDebug(debugCheckbox.checked);
  ui.toast(save.debug ? '🐞 Debug-Modus an — alles freigeschaltet' : '🐞 Debug-Modus aus');
};

document.getElementById('btn-debug-reset').onclick = () => {
  save.progress = {};
  save.seenHowto = false;
  save.seenSimHowto = false;
  save.unlocked = false; // auch simulierte Test-Käufe zurücksetzen, um die Paywall erneut zu sehen
  save.reviewAsked = false;
  save.reviewVersion = null;
  persist();
  ui.refreshMenu(save.progress, effectiveUnlocked());
  ui.toast('🐞 Fortschritt & Kauf zurückgesetzt');
};

// Der Debug-Schalter erscheint NUR mit ?debug=1 in der URL (Browser-Entwicklung).
// Im iOS-Build gibt es keine Query-Parameter — dort bleibt die UI unsichtbar.
const DEBUG_UI = !window.__WEB_DEMO && new URLSearchParams(location.search).get('debug') === '1';
if (DEBUG_UI) {
  document.body.classList.add('debug-ui');
  save.debug = true;
  // Steuer-Hook für die Video-Aufnahme (video/record.mjs) — nur im Browser mit ?debug=1
  window.__v3d = {
    startItem, answer, openMenu, sim,
    state: () => ({ mode, id: current ? current.id : null, answered, correct: current && current.order ? current.order[0] : null })
  };
}
if (save.debug) { debugCheckbox.checked = true; debugBar.classList.add('visible'); }

/* ============ 3D-Auswahl per Klick ============ */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function pickAt(clientX, clientY) {
  pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(dynamic.children, true);
  for (const h of hits) {
    let o = h.object;
    while (o && !o.userData.pickId) o = o.parent;
    if (o) return o.userData.pickId;
  }
  return null;
}

renderer.domElement.addEventListener('click', (e) => {
  if (mode !== 'question') return;
  const id = pickAt(e.clientX, e.clientY);
  if (id) answer(id);
});

let hovered = null;
renderer.domElement.addEventListener('pointermove', (e) => {
  if (mode !== 'question') {
    if (hovered) { hovered.userData.bodyMat.emissive.setHex(0x000000); hovered = null; }
    renderer.domElement.style.cursor = '';
    return;
  }
  const id = pickAt(e.clientX, e.clientY);
  const obj = id && entities[id] && entities[id].kind === 'car' ? entities[id].obj : null;
  if (hovered && hovered !== obj) hovered.userData.bodyMat.emissive.setHex(0x000000);
  hovered = obj;
  if (hovered) hovered.userData.bodyMat.emissive.setHex(0x2a2a18);
  renderer.domElement.style.cursor = id ? 'pointer' : '';
});

/* ============ Haupt-Loop ============ */

const clock = new THREE.Clock();
let elapsed = 0;

/* Leistung: Läuft die App dauerhaft unter ~45 Bildern/s (ältere iPhones), werden
   erst die Auflösung und dann auch die Schattenqualität gesenkt. Nur nach unten,
   nie zurück — so flackert die Qualität nicht hin und her. */
const perf = { t: 0, n: 0, level: 0 };
function perfSample(rawDt) {
  if (rawDt > 0.25 || document.hidden || perf.level >= 2) return; // App-Wechsel ignorieren
  perf.t += rawDt;
  perf.n++;
  if (perf.n < 150) return;
  const avg = perf.t / perf.n;
  perf.t = 0;
  perf.n = 0;
  if (avg < 1 / 45) return;
  perf.level++;
  if (perf.level === 1) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  } else {
    renderer.setPixelRatio(1);
    sun.shadow.mapSize.set(1024, 1024);
    if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loop() {
  requestAnimationFrame(loop);
  // dt begrenzen: Nach App-Wechsel/Hintergrund darf kein Riesensprung passieren,
  // sonst teleportieren Autos und Regelchecks werden übersprungen.
  const rawDt = clock.getDelta();
  const dt = Math.min(rawDt, 0.05);
  elapsed += dt;
  const now = performance.now();
  perfSample(rawDt);

  // Bildmitte weich in den freien Bereich über der Frage-Karte schieben (und zurück)
  if (camState.shift !== camState.shiftTarget) {
    camState.shift += (camState.shiftTarget - camState.shift) * (1 - Math.exp(-dt * 5));
    if (Math.abs(camState.shiftTarget - camState.shift) < 0.5) camState.shift = camState.shiftTarget;
    applyFrame(camera, window.innerWidth, window.innerHeight, camState.shift);
  }

  updateTweens(now);

  // Fahrsimulator: Physik & Regelkontrolle
  updateSim(dt);

  // Dauerfahrten (Freies Fahren / Praktische Prüfung)
  updateDrive(dt);

  // Attract-Verkehr
  if (mode === 'title' || mode === 'menu') {
    attractTimer -= dt;
    if (attractTimer <= 0) { spawnAttractCar(now); attractTimer = 3.1; }
  }

  // Fahrende Autos in Quiz-Szenen (Endlosschleife)
  for (const a of quizAnims) {
    const t = ((elapsed - a.start) / a.dur) % 1;
    if (t < 0) continue;
    a.obj.position.set(a.fx + (a.tx - a.fx) * t, 0, a.fz + (a.tz - a.fz) * t);
    if (t > a.lastT) spinWheels(a.obj, (t - a.lastT) * a.len);
    a.lastT = t;
  }

  // Lichter / Fußgänger animieren
  for (const obj of dynamic.children) {
    if (obj.userData.blink) tickCarLights(obj, elapsed);
    if (obj.userData.walkAnim) obj.userData.walkAnim(elapsed, entities.ped ? entities.ped.walking : false);
  }

  // Antwort-Marker sanft schweben lassen
  for (const ent of Object.values(entities)) {
    if (ent.badge) {
      ent.badge.position.y = ent.badge.userData.baseY + Math.sin(elapsed * 2.6 + ent.badge.userData.phase) * 0.14;
    }
  }

  // Passanten auf den Gehwegen (hin und zurück)
  for (const w of walkers) {
    const tt = (elapsed * w.speed + w.off) % 2;
    const u = tt < 1 ? tt : 2 - tt;
    w.obj.position.lerpVectors(w.a, w.b, u);
    const d = tt < 1 ? w.b.clone().sub(w.a) : w.a.clone().sub(w.b);
    w.obj.rotation.y = headingY(d.x, d.z);
    w.obj.userData.walkAnim(elapsed + w.off * 7, true);
  }

  // Ausgefallene Ampeln blinken gelb
  if (current && current.lights) {
    const phase = Math.floor(elapsed * 1.6) % 2 ? 'yellow' : 'off';
    for (const [arm, state] of Object.entries(current.lights)) {
      if (state === 'blink' && lightsMap[arm]) lightsMap[arm].userData.setState(phase);
    }
  }

  // Wolken driften
  for (const c of clouds) {
    c.position.x += dt * 0.7;
    if (c.position.x > 180) c.position.x = -180;
  }

  // Kamera
  if (camState.mode === 'orbit') {
    const a = elapsed * 0.09;
    camState.pos.set(Math.cos(a) * 33, 19, Math.sin(a) * 33);
    camState.target.set(0, 0, -2);
  } else if (camState.mode === 'cine' && current && current.scene) {
    // Sanftes Hin- und Herschwenken um eine feste Blickrichtung (cam.a): Das Wichtige
    // der Szene (Ampel, Warndreieck …) bleibt im Bild. Früher drehte die Kamera ganz
    // herum und zeigte es oft gerade nicht, wenn die Frage kam.
    const cc = current.scene.cam || { f: [0, 2], r: 15, h: 7 };
    const a = (cc.a ?? Math.PI / 2 - 0.35) + Math.sin(elapsed * 0.3) * (cc.sway ?? 0.4);
    camState.pos.set(cc.f[0] + Math.cos(a) * cc.r, cc.h, cc.f[1] + Math.sin(a) * cc.r);
    camState.target.set(cc.f[0], 0.7, cc.f[1]);
  } else if (camState.mode === 'sim' && (sim.active || (mode === 'drive' && drv.player))) {
    const off = simCamOffsets();
    const k = 1 - Math.exp(-dt * 3.4);
    if (sim.active) {
      // Klassischer Simulator: Verfolgerkamera hinter dem eigenen Auto
      const p = sim.player.obj.position;
      camState.pos.lerp(new THREE.Vector3(p.x, off.h, p.z + off.back), k);
      camState.target.lerp(new THREE.Vector3(p.x, off.ty, p.z - off.ahead), k);
    } else {
      // Dauerfahrt: Kamera folgt der Fahrtrichtung (auch durch Kurven)
      const p = drv.player.obj.position;
      const f = drv.fwd;
      camState.pos.lerp(new THREE.Vector3(p.x - f.x * off.back, off.h, p.z - f.z * off.back), k);
      camState.target.lerp(new THREE.Vector3(p.x + f.x * off.ahead, off.ty, p.z + f.z * off.ahead), k);
    }
  }
  mouse.sx += (mouse.x - mouse.sx) * 0.06;
  mouse.sy += (mouse.y - mouse.sy) * 0.06;
  const par = camState.mode === 'sim' ? 0 : 1; // im Simulator kein Parallax-Wackeln
  const dir = camState.target.clone().sub(camState.pos).normalize();
  const right = dir.clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
  camera.position.copy(camState.pos)
    .addScaledVector(right, mouse.sx * 1.1 * par)
    .addScaledVector(new THREE.Vector3(0, 1, 0), -mouse.sy * 0.55 * par);
  // Kurzer Kamera-Wackler nach einer Kollision
  if (camShake.t > 0) {
    camShake.t -= dt;
    const s = camShake.amp * Math.max(0, camShake.t);
    camera.position.x += (Math.random() - 0.5) * s;
    camera.position.y += (Math.random() - 0.5) * s * 0.6;
  }
  camera.lookAt(camState.target);

  renderer.render(scene, camera);
}

ui.showTitle();
loop();
