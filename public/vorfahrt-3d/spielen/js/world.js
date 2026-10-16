// Statische Welt + Fahrbahn-Geometrie (Spuren, Pfade, Arme)
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  createTree, createBuilding, createCloud, createLamp, createSunGlow,
  asphaltTexture, grassTexture
} from './models.js';

export const LANE = 1.7;        // Abstand Spurmitte zur Straßenmitte
export const ROAD_HALF = 3.4;   // halbe Fahrbahnbreite
export const STOP_D = 5.4;      // Haltlinie (Abstand zur Kreuzungsmitte)
export const CAR_STOP = STOP_D + 2.4; // Fahrzeugmittelpunkt beim Warten
export const SPAWN_D = 30;      // Startabstand bei Anfahrt
export const EXIT_D = 55;       // Ausfahrt-Distanz
export const ARM_LEN = 95;

// Arm = Richtung, aus der der Verkehr KOMMT. dir zeigt zur Kreuzungsmitte (x, z).
export const ARMS = {
  N: { dir: new THREE.Vector2(0, 1) },
  E: { dir: new THREE.Vector2(-1, 0) },
  S: { dir: new THREE.Vector2(0, -1) },
  W: { dir: new THREE.Vector2(1, 0) }
};
const RING = ['N', 'E', 'S', 'W'];

/* Kreisverkehr: Außenrand schließt bündig an die Gehwege der Arme an. */
/* Maßstab: Die Autos sind gut 4 Einheiten lang. Ein Kreisel, den ein Auto
   flüssig umrunden kann, braucht deshalb einen Außenradius um die 12 — bei
   einem kleineren Ring wird der Einfahrbogen enger als der Wendekreis des
   Autos, und die Fahrt sieht abgehackt aus. */
export const RA_OUTER = 12.0;              // Außenkante der Kreisfahrbahn
export const RA_LANE = RA_OUTER - 1.8;     // Spurmitte im Kreis
export const RA_ISLAND = RA_OUTER - 3.6;   // Inneninsel
export const RA_BAND = RA_OUTER + 0.5;     // hier beginnen die Gehwege der Arme
// Winkel der Arme in der XZ-Ebene: p(a) = (r·cos a, r·sin a)
const ARM_ANGLE = { E: 0, S: Math.PI / 2, W: Math.PI, N: -Math.PI / 2 };
const ringPoint = (r, a) => new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a));

/* Exakter Kreisbogen in der XZ-Ebene. Eine echte Kurve statt abgetasteter
   Punkte — nur so stimmen Tangente (= Blickrichtung des Autos) und
   Bogenlänge (= gleichmäßiges Tempo) über den ganzen Bogen. */
class ArcXZ extends THREE.Curve {
  constructor(r, a0, a1) { super(); this.r = r; this.a0 = a0; this.a1 = a1; }
  getPoint(t, target = new THREE.Vector3()) {
    const a = this.a0 + (this.a1 - this.a0) * t;
    return target.set(this.r * Math.cos(a), 0, this.r * Math.sin(a));
  }
}
// Fahrtrichtung auf dem Ring (Winkel nimmt ab) als Einheitsvektor
const ringTangent = (a) => new THREE.Vector3(Math.sin(a), 0, -Math.cos(a));

const rightOf = (d) => new THREE.Vector2(-d.y, d.x);   // rechte Hand des Fahrers
const turnRight = (d) => new THREE.Vector2(-d.y, d.x);
const turnLeft = (d) => new THREE.Vector2(d.y, -d.x);

const v3 = (v2x, v2z) => new THREE.Vector3(v2x, 0, v2z);
function combine(...terms) {
  const out = new THREE.Vector2();
  for (const [v, s] of terms) out.addScaledVector(v, s);
  return v3(out.x, out.y);
}

// Blickrichtung (rotation.y) für Modelle mit Front = +Z
export const headingY = (dx, dz) => Math.atan2(dx, dz);

// Beziehung eines Arms zum Spieler-Arm: 'links' | 'vorne' | 'rechts'
export function relationTo(playerArm, otherArm) {
  const d = (RING.indexOf(otherArm) - RING.indexOf(playerArm) + 4) % 4;
  return d === 1 ? 'links' : d === 2 ? 'vorne' : 'rechts';
}

/**
 * Fahrgeometrie für ein Fahrzeug: Anfahrt (Spawn → Haltepunkt)
 * und Kreuzungspfad (Haltepunkt → Ausfahrt).
 */
export function carRoute(arm, turn /* 'straight' | 'left' | 'right' */, { laneOff = LANE, stopExtra = 0 } = {}) {
  const dir = ARMS[arm].dir;
  const right = rightOf(dir);
  const spawn = combine([dir, -(SPAWN_D + stopExtra)], [right, laneOff]);
  const entry = combine([dir, -(CAR_STOP + stopExtra)], [right, laneOff]);

  const path = new THREE.CurvePath();
  if (turn === 'straight') {
    path.add(new THREE.LineCurve3(entry, combine([dir, EXIT_D], [right, laneOff])));
  } else {
    const nd = turn === 'right' ? turnRight(dir) : turnLeft(dir);
    const nr = rightOf(nd);
    const ctrl = combine([right, laneOff], [nr, laneOff]);
    const bezEnd = combine([nd, CAR_STOP], [nr, laneOff]);
    path.add(new THREE.QuadraticBezierCurve3(entry, ctrl, bezEnd));
    path.add(new THREE.LineCurve3(bezEnd, combine([nd, EXIT_D], [nr, laneOff])));
  }
  return {
    spawn, entry,
    approach: new THREE.LineCurve3(spawn, entry),
    path,
    headIn: headingY(dir.x, dir.y)
  };
}

/**
 * Fahrweg durch den Kreisverkehr: Zufahrt aus `fromArm`, Ausfahrt in `toArm`.
 * Im Rechtsverkehr wird der Kreis gegen den Uhrzeigersinn befahren — in dieser
 * Parametrisierung heißt das: der Winkel nimmt ab.
 * `inCircle` setzt das Fahrzeug bereits in den Kreis (es hat dann Vorfahrt).
 */
export function roundaboutRoute(fromArm, toArm, { laneOff = LANE, inCircle = false } = {}) {
  const dir = ARMS[fromArm].dir;
  const right = rightOf(dir);
  const a0 = ARM_ANGLE[fromArm];
  let a1 = ARM_ANGLE[toArm];
  while (a1 >= a0) a1 -= Math.PI * 2;          // immer in Fahrtrichtung (fallender Winkel)

  // Ein- und Ausfädeln passieren nicht auf der Armachse, sondern etwas
  // versetzt — genau dort, wo die rechte Spur den Ring trifft.
  // Ein-/Ausfädelwinkel und Bézier-Griffe sind gemessen, nicht geraten: diese
  // Kombination hält den engsten Kurvenradius bei rund 5 Einheiten — ein Auto
  // ist gut 4 lang, engere Bögen sehen nach Einparken statt Fahren aus.
  const JOIN = 0.6;
  const aJoin = inCircle ? a0 : a0 - JOIN;
  const aLeave = a1 + JOIN;

  const outDir = ARMS[toArm].dir.clone().multiplyScalar(-1);   // vom Kreis weg
  const outRight = rightOf(outDir);
  const dir3 = new THREE.Vector3(dir.x, 0, dir.y);
  const out3 = new THREE.Vector3(outDir.x, 0, outDir.y);

  const path = new THREE.CurvePath();
  let spawn, entry, approach;

  if (inCircle) {
    // Fährt schon im Kreis: Anfahrt ist selbst ein Stück Kreisfahrt
    const aStart = a0 + Math.PI / 2;
    spawn = ringPoint(RA_LANE, aStart);
    entry = ringPoint(RA_LANE, a0);
    approach = new ArcXZ(RA_LANE, aStart, a0);
  } else {
    spawn = combine([dir, -SPAWN_D], [right, laneOff]);
    entry = combine([dir, -(RA_OUTER + 2.4)], [right, laneOff]);
    approach = new THREE.LineCurve3(spawn, entry);
    // Einfahrt: Bézier, dessen Tangenten an beiden Enden passen —
    // vorne die Fahrtrichtung des Arms, hinten die Ringtangente.
    const pJoin = ringPoint(RA_LANE, aJoin);
    const k = entry.distanceTo(pJoin) * 0.40;
    path.add(new THREE.CubicBezierCurve3(
      entry,
      entry.clone().addScaledVector(dir3, k),
      pJoin.clone().addScaledVector(ringTangent(aJoin), -k),
      pJoin
    ));
  }

  // Kreisfahrt
  path.add(new ArcXZ(RA_LANE, aJoin, aLeave));

  // Ausfahrt: wieder mit passenden Tangenten heraus
  const pLeave = ringPoint(RA_LANE, aLeave);
  const mouth = combine([outDir, RA_OUTER + 2.0], [outRight, laneOff]);
  const k2 = pLeave.distanceTo(mouth) * 0.40;
  path.add(new THREE.CubicBezierCurve3(
    pLeave,
    pLeave.clone().addScaledVector(ringTangent(aLeave), k2),
    mouth.clone().addScaledVector(out3, -k2),
    mouth
  ));
  path.add(new THREE.LineCurve3(mouth, combine([outDir, EXIT_D], [outRight, laneOff])));

  const headIn = inCircle
    ? headingY(ringTangent(a0 + Math.PI / 2).x, ringTangent(a0 + Math.PI / 2).z)
    : headingY(dir.x, dir.y);
  return { spawn, entry, approach, path, headIn, roundabout: true };
}

// Position + Ausrichtung für Schilder/Ampeln am rechten Fahrbahnrand eines Arms
export function roadsidePose(arm, { dist = STOP_D + 0.9 } = {}) {
  const dir = ARMS[arm].dir;
  const right = rightOf(dir);
  const pos = combine([dir, -dist], [right, ROAD_HALF + 1.1]);
  pos.y = 0.12;
  return { pos, rotY: headingY(-dir.x, -dir.y) };
}

/* ---------- Statische Kulisse ---------- */

const roadTexZ = asphaltTexture();
roadTexZ.repeat.set(1.6, 44);
const roadTexX = asphaltTexture().clone();
roadTexX.needsUpdate = true;
roadTexX.repeat.set(44, 1.6);
const grassTex = grassTexture();
grassTex.repeat.set(46, 46);

const mat = {
  grass: new THREE.MeshStandardMaterial({ color: 0xffffff, map: grassTex, roughness: 1 }),
  roadZ: new THREE.MeshStandardMaterial({ color: 0xffffff, map: roadTexZ, roughness: 0.95 }),
  roadX: new THREE.MeshStandardMaterial({ color: 0xffffff, map: roadTexX, roughness: 0.95 }),
  walk: new THREE.MeshStandardMaterial({ color: 0xc3c8cf, roughness: 0.95 }),
  curb: new THREE.MeshStandardMaterial({ color: 0x878d94, roughness: 0.9 }),
  mark: new THREE.MeshStandardMaterial({ color: 0xe8ebee, roughness: 0.85 })
};

function flat(w, d, m, x, z, y = 0.03) {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
  p.rotation.x = -Math.PI / 2;
  p.position.set(x, y, z);
  p.receiveShadow = true;
  return p;
}

/* Viele gleiche Kleinteile (Markierungen, Pfosten) zu EINEM Mesh zusammenfassen.
   Die Teile dürfen noch keinen Parent haben; ihre Lage wird in die Geometrie gebacken.
   Spart hunderte Draw Calls pro Bild — wichtig für ältere iPhones. */
function mergeMeshes(meshes, material, { cast = false, receive = true } = {}) {
  const geos = meshes.map((m) => {
    m.updateMatrixWorld(true);
    return m.geometry.clone().applyMatrix4(m.matrixWorld);
  });
  const mesh = new THREE.Mesh(mergeGeometries(geos, false), material);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

/* Bäume (je Baum eigene Grüntöne) als ein Mesh: Die Farbe jedes Einzelteils wandert
   als Vertex-Farbe in die Geometrie. */
const bakedTreeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, flatShading: true });
function bakeTrees(trees) {
  const geos = [];
  for (const tree of trees) {
    tree.updateMatrixWorld(true);
    tree.traverse((m) => {
      if (!m.isMesh) return;
      const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(m.matrixWorld);
      g.deleteAttribute('uv');
      const c = m.material.color;
      const n = g.attributes.position.count;
      const col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geos.push(g);
    });
  }
  const mesh = new THREE.Mesh(mergeGeometries(geos, false), bakedTreeMat);
  mesh.castShadow = true;
  return mesh;
}

export function buildWorld(scene) {
  // Himmel: Farbverlauf-Kuppel + Sonnen-Glow
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 24, 12),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: new THREE.Color(0x4a90dc) },
        bottom: { value: new THREE.Color(0xd7ebf8) }
      },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(normalize(vP).y, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, pow(h, 0.55)), 1.0); }'
    })
  );
  scene.add(sky);
  scene.fog = new THREE.Fog(0xd7ebf8, 90, 260);

  const glow = createSunGlow();
  glow.position.set(120, 170, 70);
  scene.add(glow);

  // Boden
  const ground = new THREE.Mesh(new THREE.CircleGeometry(300, 48), mat.grass);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Alles Stadt-Spezifische in eine Gruppe — der Autobahn-Modus blendet sie aus
  const city = new THREE.Group();
  scene.add(city);

  const sw = (w, h, d, x, z, m = mat.walk, parent = city) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    b.position.set(x, h / 2, z);
    b.receiveShadow = true;
    parent.add(b);
    return b;
  };

  // Kreuzungsfläche + Gehweg-Ecken — im Kreisverkehr ersetzt sie der Kreis
  const core = new THREE.Group();
  city.add(core);
  core.add(flat(ROAD_HALF * 2, ROAD_HALF * 2, mat.roadZ, 0, 0, 0.02));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    sw(2, 0.12, 2, sx * (ROAD_HALF + 1), sz * (ROAD_HALF + 1), mat.walk, core);
  }

  // Kreisverkehr: Fahrbahnring, Außenkante, bepflanzte Insel, Wartelinien
  const circle = new THREE.Group();
  circle.visible = false;
  city.add(circle);
  {
    const ringTex = asphaltTexture().clone();
    ringTex.needsUpdate = true;
    ringTex.repeat.set(5, 5);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: ringTex, roughness: 0.95 });
    const ring = new THREE.Mesh(new THREE.RingGeometry(RA_ISLAND, RA_OUTER, 64), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    ring.receiveShadow = true;
    circle.add(ring);

    const edge = new THREE.Mesh(new THREE.RingGeometry(RA_OUTER - 0.16, RA_OUTER, 64), mat.mark);
    edge.rotation.x = -Math.PI / 2;
    edge.position.y = 0.055;
    circle.add(edge);

    // Überfahrbarer Innenring (heller Pflasterring) — wie an echten Kreiseln
    const apron = new THREE.Mesh(new THREE.RingGeometry(RA_ISLAND, RA_ISLAND + 1.1, 64), mat.walk);
    apron.rotation.x = -Math.PI / 2;
    apron.position.y = 0.056;
    circle.add(apron);

    const kerb = new THREE.Mesh(new THREE.CylinderGeometry(RA_ISLAND, RA_ISLAND, 0.3, 48), mat.curb);
    kerb.position.y = 0.15;
    kerb.receiveShadow = true;
    circle.add(kerb);
    const green = new THREE.Mesh(new THREE.CircleGeometry(RA_ISLAND - 0.14, 44), mat.grass);
    green.rotation.x = -Math.PI / 2;
    green.position.y = 0.305;
    circle.add(green);
    for (let i = 0; i < 7; i++) {
      const a = i * (Math.PI * 2 / 7) + 0.4;
      const rr = RA_ISLAND * (i % 2 ? 0.34 : 0.62);
      const t = createTree(0.85 + (i % 3) * 0.12, i / 7);
      t.position.set(Math.cos(a) * rr, 0.30, Math.sin(a) * rr);
      circle.add(t);
    }

    // Wartelinie (Haifischzähne als Striche) vor jeder Zufahrt
    for (const arm of RING) {
      const dir = ARMS[arm].dir;
      const right = rightOf(dir);
      const horizontal = Math.abs(dir.x) > 0.5;
      for (let i = 0; i < 4; i++) {
        const p = combine([dir, -(RA_OUTER + 0.6)], [right, 0.35 + i * 0.66]);
        circle.add(flat(horizontal ? 0.5 : 0.42, horizontal ? 0.42 : 0.5, mat.mark, p.x, p.z, 0.06));
      }
    }
  }

  /* Ein Arm = Fahrbahn, Randlinien, Mittellinie, Gehwege, Laternen — jeweils
     als eigene Gruppe. Dazu ein „Deckel": Gehweg, Hecke und Häuser, die den
     Arm abschließen. Ein Layout zeigt entweder den Arm oder seinen Deckel,
     so wird aus der Kreuzung eine T-Einmündung (siehe setLayout). */
  const armLen = ARM_LEN - ROAD_HALF;
  const bandLen = ARM_LEN - ROAD_HALF - 2;
  const bandMid = (ROAD_HALF + 2 + ARM_LEN) / 2;
  const lampsFor = { S: [15, -33], N: [15, -33], E: [24, -42], W: [24, -42] };
  const arms = {};
  const caps = {};
  const bandsNormal = {};
  const bandsCircle = {};

  for (const arm of RING) {
    const dir = ARMS[arm].dir;
    const right = rightOf(dir);
    const horizontal = Math.abs(dir.x) > 0.5;

    const g = new THREE.Group();
    arms[arm] = g;
    city.add(g);

    // Fahrbahn
    const mid = combine([dir, -(ROAD_HALF + armLen / 2)]);
    g.add(flat(horizontal ? armLen : ROAD_HALF * 2, horizontal ? ROAD_HALF * 2 : armLen,
      horizontal ? mat.roadX : mat.roadZ, mid.x, mid.z, 0.02));

    // Randlinien + gestrichelte Mittellinie — als ein Mesh je Arm
    const marks = [];
    for (const s of [-1, 1]) {
      const p = combine([dir, -(ROAD_HALF + armLen / 2)], [right, s * (ROAD_HALF - 0.2)]);
      marks.push(flat(horizontal ? armLen : 0.14, horizontal ? 0.14 : armLen, mat.mark, p.x, p.z, 0.04));
    }
    for (let k = ROAD_HALF + 2.5; k < ARM_LEN - 4; k += 4.2) {
      const p = combine([dir, -(k + 0.85)]);
      marks.push(flat(horizontal ? 1.7 : 0.18, horizontal ? 0.18 : 1.7, mat.mark, p.x, p.z, 0.04));
    }
    g.add(mergeMeshes(marks, mat.mark));

    // Gehwege mit Bordstein — zwei Varianten, weil der Kreisverkehr weiter
    // in den Arm hineinreicht als die Kreuzung: bandsN für Kreuzung/T,
    // bandsC (kürzer, beginnt hinter dem Ring) für den Kreisverkehr.
    const bandsN = new THREE.Group();
    const bandsC = new THREE.Group();
    bandsC.visible = false;
    g.add(bandsN, bandsC);
    bandsNormal[arm] = bandsN;
    bandsCircle[arm] = bandsC;
    const cLen = ARM_LEN - RA_BAND;
    const cMid = (RA_BAND + ARM_LEN) / 2;
    for (const s of [-1, 1]) {
      const w = combine([dir, -bandMid], [right, s * (ROAD_HALF + 1)]);
      sw(horizontal ? bandLen : 2, 0.12, horizontal ? 2 : bandLen, w.x, w.z, mat.walk, bandsN);
      const c = combine([dir, -bandMid], [right, s * (ROAD_HALF + 0.06)]);
      sw(horizontal ? bandLen : 0.16, 0.15, horizontal ? 0.16 : bandLen, c.x, c.z, mat.curb, bandsN);

      const w2 = combine([dir, -cMid], [right, s * (ROAD_HALF + 1)]);
      sw(horizontal ? cLen : 2, 0.12, horizontal ? 2 : cLen, w2.x, w2.z, mat.walk, bandsC);
      const c2 = combine([dir, -cMid], [right, s * (ROAD_HALF + 0.06)]);
      sw(horizontal ? cLen : 0.16, 0.15, horizontal ? 0.16 : cLen, c2.x, c2.z, mat.curb, bandsC);
    }

    // Straßenlaternen
    for (const k of lampsFor[arm]) {
      const sgn = k > 0 ? 1 : -1;
      const p = combine([dir, -Math.abs(k)], [right, sgn * (ROAD_HALF + 1)]);
      const lamp = createLamp();
      lamp.position.set(p.x, 0.12, p.z);
      lamp.rotation.y = headingY(-right.x * sgn, -right.y * sgn);
      g.add(lamp);
    }

    // Deckel: durchgehender Gehweg quer vor der Kreuzung + Bebauung dahinter
    const cap = new THREE.Group();
    cap.visible = false;
    caps[arm] = cap;
    city.add(cap);
    const capW = ROAD_HALF * 2 + 4;
    const cw = combine([dir, -(ROAD_HALF + 1)]);
    sw(horizontal ? 2 : capW, 0.12, horizontal ? capW : 2, cw.x, cw.z, mat.walk, cap);
    const cc = combine([dir, -(ROAD_HALF + 0.06)]);
    sw(horizontal ? 0.16 : capW, 0.15, horizontal ? capW : 0.16, cc.x, cc.z, mat.curb, cap);
    for (const s of [-1, 1]) {
      const bp = combine([dir, -(ROAD_HALF + 7.5)], [right, s * 4.6]);
      const b = createBuilding(6.5, s > 0 ? 5.5 : 4.5, 6, s > 0 ? 0xd9c2a7 : 0xbcccd9);
      b.position.set(bp.x, 0, bp.z);
      cap.add(b);
      const tp = combine([dir, -(ROAD_HALF + 3.6)], [right, s * 1.9]);
      const t = createTree(0.9, s > 0 ? 0.2 : 0.6);
      t.position.set(tp.x, 0.02, tp.z);
      cap.add(t);
    }
  }

  // Häuser (deterministisch, pro Quadrant variiert)
  const palette = [0xd9c2a7, 0xbcccd9, 0xd9b8ad, 0xc5d2b4, 0xcfc0da, 0xb3c4d2];
  const plots = [
    [14, 13, 7, 8, 4.5], [23, 20, 6.5, 6, 6.5], [13, 26, 8, 7, 3.5], [28, 12, 5.5, 8, 5.5]
  ];
  let ci = 0;
  for (const qx of [-1, 1]) for (const qz of [-1, 1]) {
    for (let i = 0; i < plots.length; i++) {
      const [px, pz, w, d, h] = plots[i];
      const jitter = ((qx + 1) + (qz + 1) * 0.5 + i) % 2 ? 1 : 0;
      const b = createBuilding(w, h + jitter, d, palette[ci++ % palette.length]);
      b.position.set(qx * (px + jitter), 0, qz * (pz + i));
      city.add(b);
    }
  }

  // Bäume entlang der Arme + verstreut
  const treeSpots = [];
  for (const k of [11, 19, 28, 38, 50, 64]) {
    for (const s of [-1, 1]) {
      treeSpots.push([s * (ROAD_HALF + 3.2), k], [s * (ROAD_HALF + 3.2), -k]);
      treeSpots.push([k, s * (ROAD_HALF + 3.2)], [-k, s * (ROAD_HALF + 3.2)]);
    }
  }
  treeSpots.push([26, 26], [-30, 24], [28, -30], [-24, -27], [45, 14], [-45, -12]);
  const trees = [];
  treeSpots.forEach(([x, z], i) => {
    if (i % 3 === 1) return;
    const t = createTree(0.85 + ((i * 37) % 10) / 18, (i % 5) / 5);
    t.position.set(x, 0.02, z);
    t.rotation.y = i * 1.7;
    trees.push(t);
  });
  city.add(bakeTrees(trees));

  // Wolken
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    const c = createCloud();
    c.position.set(-140 + i * 55, 42 + (i % 3) * 7, -60 + (i * 43) % 120 - 40);
    scene.add(c);
    clouds.push(c);
  }

  return { clouds, sky, glow, city, arms, caps, core, circle, bandsNormal, bandsCircle };
}

/* ---------- Layouts ----------
   'cross' ist die Vollkreuzung. Ein T-Layout blendet genau einen Arm aus und
   zeigt stattdessen dessen Deckel — die Straße endet dann sichtbar an einer
   Häuserzeile. Fahrzeuge dürfen aus einem fehlenden Arm weder kommen noch
   dorthin abbiegen; das regeln die Szenarien-Daten. */

export const LAYOUTS = {
  cross: [],
  circle: [],   // Kreisverkehr: alle vier Arme, aber Ring statt Kreuzungsfläche
  'T-N': ['N'],   // Einmündung: Spieler steht am Stamm (aus Süden)
  'T-E': ['E'],   // Durchgangsstraße S-N, Seitenstraße links (W)
  'T-W': ['W']    // Durchgangsstraße S-N, Seitenstraße rechts (E)
};

export function setLayout(world, layout = 'cross') {
  const missing = LAYOUTS[layout] || [];
  for (const arm of RING) {
    world.arms[arm].visible = !missing.includes(arm);
    world.caps[arm].visible = missing.includes(arm);
  }
  const round = layout === 'circle';
  world.circle.visible = round;
  world.core.visible = !round;
  for (const arm of RING) {
    world.bandsNormal[arm].visible = !round;
    world.bandsCircle[arm].visible = round;
  }
}

/* ---------- Autobahn-Welt ----------
   Zwei Richtungsfahrbahnen mit Leitplanken. Die Welt ist periodisch
   (Segmentlänge AB_SEG): Der Spieler wird samt Verkehr und Kamera
   zurückversetzt, sobald er ein Segment durchfahren hat — endlos ohne Bruch. */

export const AB_SEG = 260;          // Wiederhol-Periode
export const AB_LANES = [2.2, -2.2]; // Spurmitten (rechts, links) in Fahrtrichtung -z

export function buildAutobahn(scene) {
  const g = new THREE.Group();
  g.visible = false;
  scene.add(g);

  const abTex = asphaltTexture().clone();
  abTex.needsUpdate = true;
  abTex.repeat.set(2.4, 64);
  const abMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: abTex, roughness: 0.95 });

  for (const off of [AB_SEG, 0, -AB_SEG]) {
    const seg = new THREE.Group();
    // Richtungsfahrbahn des Spielers (2 Spuren, Fahrtrichtung -z)
    seg.add(flat(9.4, AB_SEG, abMat, 0, -AB_SEG / 2, 0.02));
    const marks = [
      flat(0.18, AB_SEG, mat.mark, -4.35, -AB_SEG / 2, 0.04),
      flat(0.18, AB_SEG, mat.mark, 4.35, -AB_SEG / 2, 0.04)
    ];
    for (let z = 0; z < AB_SEG; z += 8) {
      marks.push(flat(0.18, 3.6, mat.mark, 0, -z - 1.8, 0.04));
    }
    seg.add(mergeMeshes(marks, mat.mark));
    // Gegenfahrbahn (Kulisse) hinter dem Mittelstreifen
    seg.add(flat(9.4, AB_SEG, abMat, -13.2, -AB_SEG / 2, 0.02));
    // Leitplanken (Pfosten als ein Mesh je Abschnitt)
    const posts = [];
    for (const x of [-5.6, 5.6, -7.9]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.3, AB_SEG), mat.curb);
      rail.position.set(x, 0.62, -AB_SEG / 2);
      rail.castShadow = true;
      seg.add(rail);
      for (let z = 5; z < AB_SEG; z += 13) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 0.12), mat.curb);
        post.position.set(x, 0.31, -z);
        posts.push(post);
      }
    }
    seg.add(mergeMeshes(posts, mat.curb, { receive: false }));
    // Bäume weit abseits als Kulisse (ein Mesh je Abschnitt)
    const trees = [];
    for (let z = 14; z < AB_SEG; z += 34) {
      const t1 = createTree(1.0 + (z % 3) / 6, (z % 5) / 5);
      t1.position.set(13 + (z % 4) * 2.4, 0.02, -z - off * 0.13);
      trees.push(t1);
      const t2 = createTree(0.9 + (z % 4) / 8, ((z + 2) % 5) / 5);
      t2.position.set(-21 - (z % 3) * 2.6, 0.02, -z - 17);
      trees.push(t2);
    }
    seg.add(bakeTrees(trees));
    seg.position.z = off;
    g.add(seg);
  }
  return g;
}

// Quer über die ankommende Spur eines Arms: 'solid' = Haltlinie (Zeichen 294,
// an Stoppschild und Ampel), 'dashed' = Wartelinie (Zeichen 341, „Vorfahrt gewähren")
export function makeStopLine(arm, style = 'solid') {
  const dir = ARMS[arm].dir;
  const right = rightOf(dir);
  const p = combine([dir, -(STOP_D + 0.25)], [right, LANE]);
  const horizontal = Math.abs(dir.x) > 0.5;
  const len = ROAD_HALF - 0.4;
  if (style !== 'dashed') {
    return flat(horizontal ? 0.45 : len, horizontal ? len : 0.45, mat.mark, p.x, p.z, 0.045);
  }
  // Wartelinie: kurze Striche mit Lücken, etwas schmaler als die Haltlinie
  const dashes = [];
  const n = 5, dash = len / (n * 1.6), step = len / n;
  for (let i = 0; i < n; i++) {
    const o = -len / 2 + step * (i + 0.5);
    const q = combine([dir, -(STOP_D + 0.25)], [right, LANE + o]);
    dashes.push(flat(horizontal ? 0.3 : dash, horizontal ? dash : 0.3, mat.mark, q.x, q.z, 0.045));
  }
  return mergeMeshes(dashes, mat.mark);
}

// Zebrastreifen quer über einen Arm
export function makeZebra(arm, { dist = ROAD_HALF + 2.6 } = {}) {
  const g = new THREE.Group();
  const dir = ARMS[arm].dir;
  const center = combine([dir, -dist], [new THREE.Vector2(0, 0), 0]);
  const horizontal = Math.abs(dir.x) > 0.5;
  for (let i = -3; i <= 3; i++) {
    const off = i * 0.95;
    const s = horizontal
      ? flat(2.6, 0.5, mat.mark, center.x, off, 0.045)
      : flat(0.5, 2.6, mat.mark, off, center.z, 0.045);
    g.add(s);
  }
  return g;
}

// Punkte am Gehwegrand für Fußgänger, der Arm `arm` überquert
export function zebraWalk(arm, { dist = ROAD_HALF + 2.6 } = {}) {
  const dir = ARMS[arm].dir;
  const right = rightOf(dir);
  const from = combine([dir, -dist], [right, ROAD_HALF + 1.4]);
  const to = combine([dir, -dist], [right, -(ROAD_HALF + 1.4)]);
  from.y = to.y = 0.12;
  return { from, to };
}
