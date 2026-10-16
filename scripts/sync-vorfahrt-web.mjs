#!/usr/bin/env node
// Copies the Vorfahrt 3D game (Capacitor web build) into public/vorfahrt-3d/spielen
// and turns it into a free web demo: the free scenarios stay playable, every paid
// item opens the App Store instead of the simulated browser unlock, and the
// ?debug=1 unlock switch is disabled.
//
// Re-run after every app update:
//   node scripts/sync-vorfahrt-web.mjs [path/to/Vorfahrt3D]
// Each patch asserts its anchor still exists, so an app change that moves the
// code fails loudly instead of shipping an unlockable demo.
import { cpSync, readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2] || join(process.env.HOME, 'Documents/Projects/Active Projects/Vorfahrt3D');
const out = join(root, 'public/vorfahrt-3d/spielen');
const demoDir = join(root, 'scripts/vorfahrt-web');

if (!existsSync(join(src, 'js/main.js'))) {
  console.error(`Vorfahrt3D source not found at ${src}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(src, 'index.html'), join(out, 'index.html'));
cpSync(join(src, 'css'), join(out, 'css'), { recursive: true });
cpSync(join(src, 'js'), join(out, 'js'), { recursive: true });
cpSync(join(demoDir, 'web-demo.js'), join(out, 'js/web-demo.js'));
cpSync(join(demoDir, 'web-demo.css'), join(out, 'css/web-demo.css'));

function patch(file, pairs) {
  const path = join(out, file);
  let text = readFileSync(path, 'utf8');
  for (const [from, to] of pairs) {
    if (!text.includes(from)) throw new Error(`${file}: anchor not found:\n${from}`);
    text = text.replace(from, to);
  }
  writeFileSync(path, text);
}

patch('index.html', [
  [
    '<title>Vorfahrt 3D — Der Kreuzungstrainer</title>',
    readFileSync(join(demoDir, 'head.html'), 'utf8').trim(),
  ],
  [
    '<link rel="stylesheet" href="css/style.css?v=9">',
    '<link rel="stylesheet" href="css/style.css?v=9">\n<link rel="stylesheet" href="css/web-demo.css?v=3">',
  ],
  [
    '<script src="js/iap.js?v=1"></script>',
    '<script src="js/web-demo.js?v=3"></script>\n<script src="js/iap.js?v=1"></script>',
  ],
]);

patch('js/main.js', [
  // Stored unlock/debug flags from an older visit never unlock the web demo.
  [
    'const persist = () => localStorage.setItem(SAVE_KEY, JSON.stringify(save));',
    'if (window.__WEB_DEMO) { save.unlocked = false; save.debug = false; }\n' +
      'const persist = () => localStorage.setItem(SAVE_KEY, JSON.stringify(save));',
  ],
  [
    "    // Browser dev fallback (no native StoreKit): simulate the unlock.\n    applyUnlocked();",
    "    if (window.__WEB_DEMO) { window.__WEB_DEMO.openStore('paywall'); return; }\n" +
      "    // Browser dev fallback (no native StoreKit): simulate the unlock.\n    applyUnlocked();",
  ],
  [
    "storePrice ? t('unlockFor').replace('{price}', storePrice) : t('payBtn');",
    "storePrice ? t('unlockFor').replace('{price}', storePrice) : (window.__WEB_DEMO ? window.__WEB_DEMO.t('buy') : t('payBtn'));",
  ],
  [
    "const DEBUG_UI = new URLSearchParams(location.search).get('debug') === '1';",
    "const DEBUG_UI = !window.__WEB_DEMO && new URLSearchParams(location.search).get('debug') === '1';",
  ],
]);

patch('js/i18n.js', [
  ["['#btn-buy', t('payBtn')],", "['#btn-buy', window.__WEB_DEMO ? window.__WEB_DEMO.t('buy') : t('payBtn')],"],
  [
    "['#paywall .pay-note', window.IAP && window.IAP.native ? t('payNote') : t('payNoteDemo')],",
    "['#paywall .pay-note', window.__WEB_DEMO ? window.__WEB_DEMO.t('note') : window.IAP && window.IAP.native ? t('payNote') : t('payNoteDemo')],",
  ],
  // Keep the SEO title from head.html instead of the in-game screen title.
  [
    "  document.title = 'Vorfahrt 3D · ' + t('simHowtoTitle');",
    "  if (!window.__WEB_DEMO) document.title = 'Vorfahrt 3D · ' + t('simHowtoTitle');",
  ],
]);

// The cross-promo catalog lives on Supabase, which the site CSP does not allow.
patch('js/crosspromo.js', [
  ['async function refresh() {', 'async function refresh() {\n  if (window.__WEB_DEMO) return;'],
]);

console.log(`Vorfahrt 3D web demo synced to ${out}`);
