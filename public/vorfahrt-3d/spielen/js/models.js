// Bausteine: Autos, Schilder, Ampeln, Personen, Bäume, Häuser, Texturen
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ---------- Canvas-Texturen ---------- */

function canvasTexture(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function speckle(g, s, n, alpha, light, dark) {
  for (let i = 0; i < n; i++) {
    const r = 0.6 + Math.random() * 1.8;
    g.fillStyle = Math.random() < 0.5 ? light : dark;
    g.globalAlpha = alpha * (0.4 + Math.random() * 0.6);
    g.beginPath();
    g.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
}

let _asphalt = null;
export function asphaltTexture() {
  if (_asphalt) return _asphalt;
  _asphalt = canvasTexture(256, (g, s) => {
    g.fillStyle = '#43474e'; g.fillRect(0, 0, s, s);
    // große weiche Flecken
    for (let i = 0; i < 14; i++) {
      const cx = Math.random() * s, cy = Math.random() * s;
      const r = 30 + Math.random() * 50;
      const grd = g.createRadialGradient(cx, cy, 2, cx, cy, r);
      grd.addColorStop(0, 'rgba(30,32,38,0.16)');
      grd.addColorStop(1, 'rgba(30,32,38,0)');
      g.fillStyle = grd; g.fillRect(0, 0, s, s);
    }
    speckle(g, s, 900, 0.16, '#6a6f78', '#23262c');
  });
  _asphalt.wrapS = _asphalt.wrapT = THREE.RepeatWrapping;
  return _asphalt;
}

let _grass = null;
export function grassTexture() {
  if (_grass) return _grass;
  _grass = canvasTexture(256, (g, s) => {
    g.fillStyle = '#79ad55'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 26; i++) {
      const cx = Math.random() * s, cy = Math.random() * s;
      const r = 22 + Math.random() * 42;
      const grd = g.createRadialGradient(cx, cy, 2, cx, cy, r);
      grd.addColorStop(0, Math.random() < 0.5 ? 'rgba(140,190,96,0.28)' : 'rgba(96,146,66,0.28)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd; g.fillRect(0, 0, s, s);
    }
    speckle(g, s, 700, 0.14, '#96c46c', '#5d8f42');
  });
  _grass.wrapS = _grass.wrapT = THREE.RepeatWrapping;
  return _grass;
}

function shrinkTri(pts, f) {
  const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
  const cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
  return pts.map(([x, y]) => [cx + (x - cx) * f, cy + (y - cy) * f]);
}

function poly(g, pts) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath();
}

const signDrawers = {
  // Zeichen 205 — Vorfahrt gewähren
  yield(g, s) {
    const tri = [[0.05 * s, 0.12 * s], [0.95 * s, 0.12 * s], [0.5 * s, 0.9 * s]];
    g.fillStyle = '#c1121f'; poly(g, tri); g.fill();
    g.fillStyle = '#f6f6f4'; poly(g, shrinkTri(tri, 0.55)); g.fill();
  },
  // Zeichen 206 — Stop
  stop(g, s) {
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 8) + i * (Math.PI / 4);
      pts.push([0.5 * s + 0.47 * s * Math.cos(a), 0.5 * s + 0.47 * s * Math.sin(a)]);
    }
    g.fillStyle = '#b81420'; poly(g, pts); g.fill();
    g.strokeStyle = '#f6f6f4'; g.lineWidth = 0.045 * s;
    poly(g, pts.map(([x, y]) => [0.5 * s + (x - 0.5 * s) * 0.9, 0.5 * s + (y - 0.5 * s) * 0.9]));
    g.stroke();
    g.fillStyle = '#ffffff';
    g.font = `900 ${0.24 * s}px "Arial Black", Arial, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('STOP', 0.5 * s, 0.53 * s);
  },
  // Zeichen 306 — Vorfahrtsstraße
  priority(g, s) {
    const d = (r) => [[0.5 * s, (0.5 - r) * s], [(0.5 + r) * s, 0.5 * s], [0.5 * s, (0.5 + r) * s], [(0.5 - r) * s, 0.5 * s]];
    g.fillStyle = '#3b3b3b'; poly(g, d(0.48)); g.fill();
    g.fillStyle = '#f6f6f4'; poly(g, d(0.455)); g.fill();
    g.fillStyle = '#f2b705'; poly(g, d(0.31)); g.fill();
  },
  // Zusatzzeichen: abknickende Vorfahrt (Standard: Sicht von unten, Vorfahrt knickt nach links ab)
  bend(g, s) { drawBend(g, s, 'bend:bl:rt'); },
  // Zeichen 215 — Kreisverkehr
  roundabout(g, s) {
    const c = 0.5 * s;
    g.fillStyle = '#1261c4';
    g.beginPath(); g.arc(c, c, 0.47 * s, 0, Math.PI * 2); g.fill();
    // Drei Pfeile im Kreis, gegen den Uhrzeigersinn (Rechtsverkehr)
    g.strokeStyle = '#f6f6f4';
    g.fillStyle = '#f6f6f4';
    g.lineWidth = 0.075 * s;
    g.lineCap = 'butt';
    const r = 0.25 * s;
    for (let i = 0; i < 3; i++) {
      const a0 = -Math.PI / 2 + i * (Math.PI * 2 / 3) + 0.30;
      const a1 = a0 + 1.28;
      g.beginPath(); g.arc(c, c, r, a0, a1); g.stroke();
      // Pfeilspitze am Ende des Bogens, tangential
      const tx = c + r * Math.cos(a1), ty = c + r * Math.sin(a1);
      const tan = a1 + Math.PI / 2;
      const w = 0.075 * s, l = 0.115 * s;
      g.beginPath();
      g.moveTo(tx + Math.cos(tan) * l, ty + Math.sin(tan) * l);
      g.lineTo(tx + Math.cos(tan + 2.3) * w, ty + Math.sin(tan + 2.3) * w);
      g.lineTo(tx + Math.cos(tan - 2.3) * w, ty + Math.sin(tan - 2.3) * w);
      g.closePath(); g.fill();
    }
  },
  // Zeichen 350 — Fußgängerüberweg
  zebra(g, s) {
    g.fillStyle = '#1261c4'; g.fillRect(0, 0, s, s);
    g.fillStyle = '#f6f6f4';
    poly(g, [[0.5 * s, 0.12 * s], [0.08 * s, 0.84 * s], [0.92 * s, 0.84 * s]]); g.fill();
    g.fillStyle = '#111';
    g.beginPath(); g.arc(0.52 * s, 0.38 * s, 0.055 * s, 0, Math.PI * 2); g.fill();
    g.lineWidth = 0.055 * s; g.strokeStyle = '#111'; g.lineCap = 'round';
    g.beginPath(); g.moveTo(0.52 * s, 0.44 * s); g.lineTo(0.48 * s, 0.62 * s); g.stroke();
    g.beginPath(); g.moveTo(0.48 * s, 0.62 * s); g.lineTo(0.38 * s, 0.78 * s); g.stroke();
    g.beginPath(); g.moveTo(0.48 * s, 0.62 * s); g.lineTo(0.58 * s, 0.77 * s); g.stroke();
    g.fillStyle = '#111';
    for (let i = 0; i < 3; i++) g.fillRect((0.3 + i * 0.16) * s, 0.79 * s, 0.09 * s, 0.035 * s);
  }
};

/* Zusatzzeichen „abknickende Vorfahrt" (1002): `spec` = 'bend:<dick>:<dünn>' mit den
   Richtungen aus Sicht des Fahrers — b unten (eigene Straße), l links, t oben, r rechts.
   Dicke Linie = Verlauf der Vorfahrtsstraße, dünne Linien = die übrigen Straßen. */
const BEND_END = { b: [0.5, 0.92], t: [0.5, 0.08], l: [0.08, 0.5], r: [0.92, 0.5] };
function drawBend(g, s, spec) {
  const [, thick = 'bl', thin = ''] = spec.split(':');
  g.fillStyle = '#f6f6f4'; g.fillRect(0, 0, s, s);
  g.strokeStyle = '#222'; g.lineWidth = 0.03 * s;
  g.strokeRect(0.02 * s, 0.02 * s, 0.96 * s, 0.96 * s);
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.lineWidth = 0.05 * s;
  for (const d of thin) {
    const [x, y] = BEND_END[d];
    g.beginPath(); g.moveTo(0.5 * s, 0.5 * s); g.lineTo(x * s, y * s); g.stroke();
  }
  const [a, b] = [BEND_END[thick[0]], BEND_END[thick[1]]];
  g.lineWidth = 0.14 * s;
  g.beginPath(); g.moveTo(a[0] * s, a[1] * s); g.lineTo(0.5 * s, 0.5 * s); g.lineTo(b[0] * s, b[1] * s); g.stroke();
}
const drawerFor = (key) => (key.startsWith('bend:') ? (g, s) => drawBend(g, s, key) : signDrawers[key]);

const texCache = {};
function signTexture(type) {
  if (!texCache[type]) texCache[type] = canvasTexture(256, drawerFor(type));
  return texCache[type];
}

/* 2D-Icons der Schilder/Ampeln für das HUD (Frage-Panel + Erklärung) */
const iconCache = {};
export function signIconDataURL(type) {
  const base = type.startsWith('bend:') ? type : type.replace('-bend', '').replace('-round', '');
  if (!iconCache[base]) {
    const c = document.createElement('canvas');
    c.width = c.height = 96;
    drawerFor(base)(c.getContext('2d'), 96);
    iconCache[base] = c.toDataURL();
  }
  return iconCache[base];
}

export function lightIconDataURL(state) {
  const key = 'tl-' + state;
  if (!iconCache[key]) {
    const c = document.createElement('canvas');
    c.width = c.height = 96;
    const g = c.getContext('2d');
    g.fillStyle = '#1c222b';
    g.beginPath(); g.roundRect(30, 4, 36, 88, 8); g.fill();
    const cols = { red: '#ff3b30', yellow: '#ffcc00', green: '#34d158' };
    const on = {
      red: state === 'red' || state === 'redyellow',
      yellow: state === 'yellow' || state === 'redyellow' || state === 'blink',
      green: state === 'green'
    };
    [['red', 20], ['yellow', 48], ['green', 76]].forEach(([k, y]) => {
      g.fillStyle = on[k] ? cols[k] : '#3a3f46';
      g.beginPath(); g.arc(48, y, 11, 0, Math.PI * 2); g.fill();
      if (on[k]) {
        g.strokeStyle = cols[k]; g.globalAlpha = 0.4; g.lineWidth = 4;
        g.beginPath(); g.arc(48, y, 14, 0, Math.PI * 2); g.stroke();
        g.globalAlpha = 1;
      }
    });
    iconCache[key] = c.toDataURL();
  }
  return iconCache[key];
}

let windowTex = null;
function windowTexture() {
  if (windowTex) return windowTex;
  windowTex = canvasTexture(256, (g, s) => {
    g.fillStyle = '#ece7df'; g.fillRect(0, 0, s, s);
    const cols = 4, rows = 5;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const wx = (0.09 + x * 0.225) * s, wy = (0.08 + y * 0.185) * s;
        const ww = 0.15 * s, wh = 0.12 * s;
        // Rahmen
        g.fillStyle = '#f8f6f2';
        g.fillRect(wx - 0.012 * s, wy - 0.012 * s, ww + 0.024 * s, wh + 0.024 * s);
        // Glas mit Verlauf, teils warm erleuchtet
        const lit = Math.random() < 0.2;
        const grd = g.createLinearGradient(0, wy, 0, wy + wh);
        if (lit) { grd.addColorStop(0, '#ffe2a0'); grd.addColorStop(1, '#f2b95d'); }
        else { grd.addColorStop(0, '#9fb6ce'); grd.addColorStop(1, '#48607c'); }
        g.fillStyle = grd;
        g.fillRect(wx, wy, ww, wh);
        // Fensterkreuz
        g.fillStyle = 'rgba(248,246,242,0.85)';
        g.fillRect(wx + ww / 2 - 0.005 * s, wy, 0.01 * s, wh);
        // Sims-Schatten
        g.fillStyle = 'rgba(60,55,50,0.25)';
        g.fillRect(wx - 0.012 * s, wy + wh + 0.012 * s, ww + 0.024 * s, 0.012 * s);
      }
    }
  });
  windowTex.wrapS = windowTex.wrapT = THREE.RepeatWrapping;
  return windowTex;
}

/* ---------- Autos ---------- */

const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x10161f, metalness: 0.6, roughness: 0.08, envMapIntensity: 1.2 });
const tyreMat = new THREE.MeshStandardMaterial({ color: 0x16161c, roughness: 0.92 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4dae1, metalness: 0.85, roughness: 0.3 });
const bumperMat = new THREE.MeshStandardMaterial({ color: 0x22262c, roughness: 0.5, metalness: 0.3 });

function rbox(w, h, d, r, mat, x, y, z) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

// Auto-Modell: Front zeigt in +Z
export function createCar({ color = 0xd7263d, police = false } = {}) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: police ? 0xf2f5f7 : color,
    metalness: 0.12, roughness: 0.32,
    clearcoat: 0.9, clearcoatRoughness: 0.22
  });

  // Karosserie: Unterbau + sanft gerundete Haube/Heck
  const body = rbox(1.84, 0.52, 4.3, 0.16, bodyMat, 0, 0.6, 0);
  const upper = rbox(1.74, 0.3, 3.7, 0.14, bodyMat, 0, 0.88, 0.05);
  // Kabine als Glaskuppel + Dach in Wagenfarbe
  const cabin = rbox(1.58, 0.52, 2.15, 0.2, glassMat, 0, 1.16, -0.2);
  const roof = rbox(1.46, 0.1, 1.8, 0.05, bodyMat, 0, 1.45, -0.2);
  // Stoßfänger
  const bumperF = rbox(1.8, 0.24, 0.42, 0.1, bumperMat, 0, 0.4, 2.02);
  const bumperR = rbox(1.8, 0.24, 0.42, 0.1, bumperMat, 0, 0.4, -2.02);
  const grille = box(1.05, 0.16, 0.05, bumperMat, 0, 0.66, 2.18);
  g.add(body, upper, cabin, roof, bumperF, bumperR, grille);

  // Räder mit Felgen
  const wheels = [];
  const tg = new THREE.CylinderGeometry(0.36, 0.36, 0.3, 20);
  tg.rotateZ(Math.PI / 2);
  const rg = new THREE.CylinderGeometry(0.2, 0.2, 0.31, 16);
  rg.rotateZ(Math.PI / 2);
  for (const [x, z] of [[-0.85, 1.32], [0.85, 1.32], [-0.85, -1.32], [0.85, -1.32]]) {
    const w = new THREE.Group();
    const tyre = new THREE.Mesh(tg, tyreMat);
    const rim = new THREE.Mesh(rg, rimMat);
    tyre.castShadow = true;
    w.add(tyre, rim);
    w.position.set(x, 0.36, z);
    g.add(w); wheels.push(w);
  }

  // Lichter
  const mkLight = (c, i) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i });
  const headMat = mkLight(0xfff3cf, 1.1);
  const tailMat = mkLight(0xff2418, 0.45);
  g.add(rbox(0.4, 0.16, 0.09, 0.05, headMat, -0.6, 0.68, 2.16));
  g.add(rbox(0.4, 0.16, 0.09, 0.05, headMat, 0.6, 0.68, 2.16));
  g.add(rbox(0.44, 0.15, 0.09, 0.05, tailMat, -0.6, 0.72, -2.16));
  g.add(rbox(0.44, 0.15, 0.09, 0.05, tailMat, 0.6, 0.72, -2.16));

  // Blinker (vorn + hinten, je Seite).
  // Das Modell schaut nach +Z: aus Fahrersicht liegt links dann bei +X.
  const blink = { L: [], R: [] };
  for (const side of [-1, 1]) {
    const bm = new THREE.MeshStandardMaterial({ color: 0xffa424, emissive: 0xffa424, emissiveIntensity: 0 });
    const f = box(0.14, 0.13, 0.1, bm, side * 0.88, 0.62, 2.06);
    const r = box(0.14, 0.13, 0.1, bm, side * 0.88, 0.62, -2.06);
    g.add(f, r);
    blink[side < 0 ? 'R' : 'L'].push(bm);
  }

  let beacon = null;
  if (police) {
    g.add(rbox(1.86, 0.24, 3.5, 0.1, new THREE.MeshStandardMaterial({ color: 0x0e5bb5, roughness: 0.35, metalness: 0.2 }), 0, 0.74, 0.1));
    const bar = box(0.9, 0.13, 0.4, new THREE.MeshStandardMaterial({ color: 0x101820 }), 0, 1.56, -0.2);
    const bA = new THREE.MeshStandardMaterial({ color: 0x2277ff, emissive: 0x2277ff, emissiveIntensity: 0.2 });
    const bB = new THREE.MeshStandardMaterial({ color: 0x2277ff, emissive: 0x2277ff, emissiveIntensity: 0.2 });
    const mA = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.17, 0.34), bA);
    mA.position.x = -0.24;
    const mB = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.17, 0.34), bB);
    mB.position.x = 0.24;
    bar.add(mA, mB);
    g.add(bar);
    beacon = { a: bA, b: bB };
  }

  g.userData = { bodyMat, wheels, blink, beacon, blinker: null };
  return g;
}

export function setBlinker(car, side /* 'L' | 'R' | 'B' (Warnblinker) | null */) {
  car.userData.blinker = side;
  for (const s of ['L', 'R']) {
    if (s !== side && side !== 'B') car.userData.blink[s].forEach((m) => (m.emissiveIntensity = 0));
  }
}

export function tickCarLights(car, t) {
  const u = car.userData;
  if (u.blinker) {
    const on = Math.sin(t * 9) > 0 ? 2.4 : 0.04;
    const mats = u.blinker === 'B' ? [...u.blink.L, ...u.blink.R] : u.blink[u.blinker];
    mats.forEach((m) => (m.emissiveIntensity = on));
  }
  if (u.beacon) {
    const p = Math.sin(t * 14) > 0;
    u.beacon.a.emissiveIntensity = p ? 3.4 : 0.15;
    u.beacon.b.emissiveIntensity = p ? 0.15 : 3.4;
  }
}

export function spinWheels(car, dist) {
  car.userData.wheels.forEach((w) => (w.rotation.x += dist / 0.36));
}

/* ---------- Antwort-Marker über Autos ---------- */

export function createBadge({ colorCss = '#ffffff', text = '' } = {}) {
  const tex = canvasTexture(128, (g, s) => {
    // weicher Schatten
    g.fillStyle = 'rgba(0,0,0,0.22)';
    g.beginPath(); g.arc(0.5 * s, 0.56 * s, 0.42 * s, 0, Math.PI * 2); g.fill();
    // weißer Ring + farbige Füllung
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(0.5 * s, 0.5 * s, 0.42 * s, 0, Math.PI * 2); g.fill();
    g.fillStyle = colorCss;
    g.beginPath(); g.arc(0.5 * s, 0.5 * s, 0.34 * s, 0, Math.PI * 2); g.fill();
    if (text) {
      g.fillStyle = '#ffffff';
      g.font = `900 ${0.3 * s}px -apple-system, Arial, sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 0.03 * s;
      g.strokeText(text, 0.5 * s, 0.52 * s);
      g.fillText(text, 0.5 * s, 0.52 * s);
    } else {
      // Pfeil nach unten
      g.fillStyle = '#ffffff';
      poly(g, [[0.38 * s, 0.42 * s], [0.62 * s, 0.42 * s], [0.5 * s, 0.62 * s]]);
      g.fill();
    }
  });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.renderOrder = 999;
  sp.scale.set(1.5, 1.5, 1);
  return sp;
}

/* ---------- Schilder & Ampeln ---------- */

const poleMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.7, roughness: 0.35 });

/* Schildfläche nur von vorn sichtbar; von hinten sieht man graues Blech in der Form
   des Schilds (früher: die Vorderseite spiegelverkehrt, z. B. ein STOP rückwärts).
   Die Rückseite nutzt die Textur nur für die Form (Alpha) und leuchtet flach grau. */
const backMats = new Map();
function signPlate(tex, size, y) {
  const geo = new THREE.PlaneGeometry(size, size);
  const face = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.4 }));
  face.position.y = y;
  let bm = backMats.get(tex);
  if (!bm) {
    bm = new THREE.MeshStandardMaterial({ map: tex, color: 0x000000, emissive: 0x6c737b, transparent: true, roughness: 0.8 });
    backMats.set(tex, bm);
  }
  const back = new THREE.Mesh(geo, bm);
  back.position.set(0, y, -0.012);
  back.rotation.y = Math.PI;
  return [face, back];
}

export function createSign(type /* yield|stop|priority|priority-bend|yield-bend|zebra|roundabout|yield-round */, { bend = null } = {}) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.0, 10), poleMat);
  pole.position.y = 1.5; pole.castShadow = true;
  g.add(pole);

  const base = type.replace('-bend', '').replace('-round', '');
  g.add(...signPlate(signTexture(base), 1.05, 2.62));

  if (type.endsWith('-round')) g.add(...signPlate(signTexture('roundabout'), 0.7, 1.82));
  // Zusatzzeichen: je Arm aus Sicht des dort wartenden Fahrers (siehe bendKey in main.js)
  if (type.endsWith('-bend')) g.add(...signPlate(signTexture(bend || 'bend:bl:rt'), 0.62, 1.85));
  return g;
}

export function createTrafficLight() {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.1, 10), poleMat);
  pole.position.y = 1.55; pole.castShadow = true;
  g.add(pole);

  const housing = rbox(0.42, 1.05, 0.32, 0.06, new THREE.MeshStandardMaterial({ color: 0x1c222b, roughness: 0.55 }), 0, 3.1, 0);
  g.add(housing);

  const lamps = {};
  const defs = [['red', 0xff2a1e, 0.33], ['yellow', 0xffb300, 0], ['green', 0x2fd455, -0.33]];
  for (const [name, col, y] of defs) {
    const m = new THREE.MeshStandardMaterial({ color: 0x14181e, emissive: col, emissiveIntensity: 0.04 });
    const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.115, 20), m);
    lamp.position.set(0, 3.1 + y, 0.17);
    g.add(lamp);
    lamps[name] = m;
  }

  g.userData.setState = (state) => {
    const on = { red: state === 'red' || state === 'redyellow', yellow: state === 'yellow' || state === 'redyellow', green: state === 'green' };
    for (const k of Object.keys(lamps)) {
      lamps[k].emissiveIntensity = on[k] ? 2.8 : 0.04;
      lamps[k].color.set(on[k] ? 0xffffff : 0x14181e);
    }
  };
  return g;
}

/* ---------- Fahrrad mit Fahrer ---------- */

/* LKW für die Autobahn: Fahrerhaus + Auflieger statt eines gestreckten Autos.
   Front zeigt wie beim Auto in +Z, damit dieselbe Fahrlogik greift. */
export function createTruck({ color = 0x3f6fb5, cargo = 0xe6e9ee } = {}) {
  const g = new THREE.Group();
  const cabMat = new THREE.MeshPhysicalMaterial({
    color, metalness: 0.14, roughness: 0.34, clearcoat: 0.8, clearcoatRoughness: 0.25
  });
  const boxMat = new THREE.MeshStandardMaterial({ color: cargo, roughness: 0.72 });

  // Fahrerhaus vorn
  g.add(rbox(2.3, 1.5, 2.2, 0.16, cabMat, 0, 1.25, 3.0));
  g.add(rbox(2.05, 0.72, 0.16, 0.08, glassMat, 0, 1.86, 4.06));
  g.add(rbox(2.3, 0.26, 0.5, 0.1, bumperMat, 0, 0.5, 4.2));
  // Auflieger
  g.add(rbox(2.42, 2.5, 6.4, 0.12, boxMat, 0, 1.85, -1.0));
  g.add(box(2.46, 0.12, 6.4, bumperMat, 0, 0.62, -1.0));

  const blink = { L: [], R: [] };
  for (const side of [-1, 1]) {
    const bm = new THREE.MeshStandardMaterial({ color: 0xffa424, emissive: 0xffa424, emissiveIntensity: 0 });
    g.add(box(0.16, 0.15, 0.1, bm, side * 1.1, 0.72, 4.16));
    g.add(box(0.16, 0.15, 0.1, bm, side * 1.16, 0.9, -4.2));
    blink[side < 0 ? 'R' : 'L'].push(bm);   // +X ist die Fahrerseite links
  }
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xff2418, emissive: 0xff2418, emissiveIntensity: 0.45 });
  for (const side of [-1, 1]) g.add(box(0.42, 0.16, 0.09, tailMat, side * 0.7, 0.9, -4.2));

  const wheels = [];
  const tg = new THREE.CylinderGeometry(0.48, 0.48, 0.34, 20);
  tg.rotateZ(Math.PI / 2);
  const rg = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 14);
  rg.rotateZ(Math.PI / 2);
  for (const [x, z] of [[-1.05, 3.0], [1.05, 3.0], [-1.05, -2.2], [1.05, -2.2], [-1.05, -3.3], [1.05, -3.3]]) {
    const w = new THREE.Group();
    const tyre = new THREE.Mesh(tg, tyreMat);
    tyre.castShadow = true;
    w.add(tyre, new THREE.Mesh(rg, rimMat));
    w.position.set(x, 0.48, z);
    g.add(w); wheels.push(w);
  }

  g.userData = { bodyMat: cabMat, wheels, blink, beacon: null, blinker: null };
  return g;
}

export function createBicycle({ jacket = 0x3b74c4 } = {}) {
  const g = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xc23b3b, metalness: 0.4, roughness: 0.4 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: jacket, roughness: 0.8 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2b3140, roughness: 0.85 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8b48c, roughness: 0.7 });

  // Räder (Reifen + Speichen-Scheibe)
  const tyreGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.06, 18);
  tyreGeo.rotateZ(Math.PI / 2);
  const discGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.02, 16);
  discGeo.rotateZ(Math.PI / 2);
  const discMat = new THREE.MeshStandardMaterial({ color: 0x9aa1a8, metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0.55 });
  const wheels = [];
  for (const z of [0.62, -0.5]) {
    const w = new THREE.Group();
    const tyre = new THREE.Mesh(tyreGeo, tyreMat);
    tyre.castShadow = true;
    w.add(tyre, new THREE.Mesh(discGeo, discMat));
    w.position.set(0, 0.33, z);
    g.add(w); wheels.push(w);
  }

  // Rahmen, Sattel, Lenker
  g.add(box(0.05, 0.05, 1.14, frameMat, 0, 0.56, 0.06));
  const seatpost = box(0.05, 0.5, 0.05, frameMat, 0, 0.62, -0.45);
  g.add(seatpost, box(0.26, 0.05, 0.16, pantsMat, 0, 0.9, -0.45));
  const fork = box(0.05, 0.6, 0.05, frameMat, 0, 0.6, 0.58);
  fork.rotation.x = 0.2;
  g.add(fork, box(0.48, 0.05, 0.05, frameMat, 0, 0.95, 0.52));

  // Fahrer (leicht nach vorn gebeugt)
  const legL = box(0.1, 0.44, 0.13, pantsMat, -0.1, 0.62, -0.28);
  const legR = box(0.1, 0.44, 0.13, pantsMat, 0.1, 0.62, -0.28);
  legL.rotation.x = 0.45; legR.rotation.x = 0.45;
  const torso = rbox(0.32, 0.52, 0.22, 0.07, jacketMat, 0, 1.18, -0.22);
  torso.rotation.x = 0.35;
  const armL = box(0.07, 0.42, 0.07, jacketMat, -0.17, 1.14, 0.1);
  const armR = box(0.07, 0.42, 0.07, jacketMat, 0.17, 1.14, 0.1);
  armL.rotation.x = 0.9; armR.rotation.x = 0.9;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 12), skinMat);
  head.position.set(0, 1.5, -0.05); head.castShadow = true;
  // Helm
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xf0f2f4, roughness: 0.5 })
  );
  helmet.position.copy(head.position);
  g.add(legL, legR, torso, armL, armR, head, helmet);

  g.userData = { bodyMat: frameMat, wheels, blink: null, blinker: null };
  return g;
}

/* ---------- Warndreieck (für Unfall-/Pannen-Szenen) ---------- */

export function createWarnTriangle() {
  const g = new THREE.Group();
  const tex = canvasTexture(128, (c, s) => {
    const tri = [[0.5 * s, 0.05 * s], [0.95 * s, 0.92 * s], [0.05 * s, 0.92 * s]];
    c.fillStyle = '#d7263d'; poly(c, tri); c.fill();
    c.fillStyle = '#fff4e8'; poly(c, shrinkTri(tri, 0.55)); c.fill();
  });
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.62),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, roughness: 0.5, emissive: 0x992222, emissiveIntensity: 0.25 })
  );
  face.position.y = 0.34;
  face.rotation.x = -0.14;
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.2), new THREE.MeshStandardMaterial({ color: 0x8c1220, roughness: 0.6 }));
  foot.position.y = 0.02;
  g.add(face, foot);
  return g;
}

/* ---------- Fußgänger ---------- */

export function createPedestrian(jacketColor = 0xd94f30) {
  const g = new THREE.Group();
  const jacket = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.8 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x2b3a55, roughness: 0.85 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xe8b48c, roughness: 0.7 });

  const legL = box(0.13, 0.52, 0.15, pants, -0.09, 0.26, 0);
  const legR = box(0.13, 0.52, 0.15, pants, 0.09, 0.26, 0);
  legL.geometry.translate(0, -0.26, 0); legL.position.y = 0.52;
  legR.geometry.translate(0, -0.26, 0); legR.position.y = 0.52;
  const torso = rbox(0.36, 0.55, 0.22, 0.08, jacket, 0, 0.82, 0);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), skin);
  head.position.y = 1.26; head.castShadow = true;
  g.add(legL, legR, torso, head);

  g.userData.walkAnim = (t, walking) => {
    const a = walking ? Math.sin(t * 8) * 0.55 : 0;
    legL.rotation.x = a;
    legR.rotation.x = -a;
    torso.position.y = 0.82 + (walking ? Math.abs(Math.sin(t * 8)) * 0.03 : 0);
  };
  return g;
}

/* ---------- Umgebung ---------- */

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4b2a, roughness: 0.9 });

export function createTree(scale = 1, tone = 0) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.19, 1.1, 8), trunkMat);
  trunk.position.y = 0.55; trunk.castShadow = true;
  const leafMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.29 + tone * 0.04, 0.5, 0.34 + tone * 0.05),
    roughness: 0.85, flatShading: true
  });
  const leafMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.27 + tone * 0.04, 0.55, 0.42 + tone * 0.04),
    roughness: 0.85, flatShading: true
  });
  const f1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 0), leafMat);
  f1.position.y = 1.75; f1.castShadow = true;
  const f2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 0), leafMat2);
  f2.position.set(0.25, 2.5, 0.1); f2.castShadow = true;
  const f3 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), leafMat2);
  f3.position.set(-0.4, 2.2, -0.2); f3.castShadow = true;
  g.add(trunk, f1, f2, f3);
  g.scale.setScalar(scale);
  return g;
}

export function createBuilding(w, h, d, color) {
  const g = new THREE.Group();
  const tex = windowTexture().clone();
  tex.needsUpdate = true;
  tex.repeat.set(Math.max(1, Math.round(w / 5)), Math.max(1, Math.round(h / 4)));
  const mat = new THREE.MeshStandardMaterial({ color, map: tex, roughness: 0.85 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  body.position.y = h / 2; body.castShadow = true; body.receiveShadow = true;
  // Erdgeschoss-Sockel
  const baseMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.62), roughness: 0.9 });
  const base = box(w + 0.25, 1.1, d + 0.25, baseMat, 0, 0.55, 0);
  base.receiveShadow = true;
  // Dach mit Attika
  const roof = box(w + 0.45, 0.35, d + 0.45, new THREE.MeshStandardMaterial({ color: 0x39404b, roughness: 0.9 }), 0, h + 0.17, 0);
  g.add(body, base, roof);
  return g;
}

export function createLamp() {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 4.4, 8), poleMat);
  pole.position.y = 2.2; pole.castShadow = true;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.1, 8), poleMat);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(0.5, 4.35, 0);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xfff2cc, emissive: 0xffe9b0, emissiveIntensity: 0.35 })
  );
  head.position.set(1.0, 4.3, 0);
  g.add(pole, arm, head);
  return g;
}

export function createSunGlow() {
  const tex = canvasTexture(256, (g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,246,220,0.95)');
    grd.addColorStop(0.25, 'rgba(255,240,200,0.35)');
    grd.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = grd; g.fillRect(0, 0, s, s);
  });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false
  }));
  sp.scale.set(90, 90, 1);
  return sp;
}

export function createCloud() {
  const g = new THREE.Group();
  const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, fog: false });
  const n = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < n; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(3 + Math.random() * 3, 10, 8), m);
    s.position.set(i * 4 - n * 2, Math.random() * 1.2, Math.random() * 2);
    s.scale.y = 0.42;
    g.add(s);
  }
  return g;
}
