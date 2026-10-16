// Cross-promo: our other apps (web port of CrossPromoKit, same Supabase tables).
// Card after a drive for free users, "Weitere Apps" list for everyone.
import { getLang } from './i18n.js?v=6';

const APP_ID = '6794609450';
const BASE = 'https://udndyfuoktaptceekodt.supabase.co/rest/v1/';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkbmR5ZnVva3RhcHRjZWVrb2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTEwMjEsImV4cCI6MjA2OTM2NzAyMX0.N-owsBdJkdVeRbDCjHxa7i-Ge3BZ5ML6nvfy6WVLRgE';
const HEADERS = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };
const CACHE = 'cp-catalog', FETCHED = 'cp-fetched', TAPS = 'cp-taps', DEVICE = 'cp-device';

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* egal */ } },
};
let catalog = store.get(CACHE, []);
let isPro = () => false;
const seen = new Set();
let pending = [], flushTimer = null;

const T = {
  de: { more: 'Weitere Apps', fromUs: 'Auch von uns', get: 'Laden', close: 'Schließen' },
  en: { more: 'More apps', fromUs: 'Also from us', get: 'Get', close: 'Close' },
  nl: { more: 'Meer apps', fromUs: 'Ook van ons', get: 'Download', close: 'Sluiten' },
  it: { more: 'Altre app', fromUs: 'Sempre da noi', get: 'Scarica', close: 'Chiudi' },
  es: { more: 'Más apps', fromUs: 'También nuestras', get: 'Descargar', close: 'Cerrar' },
  pl: { more: 'Więcej aplikacji', fromUs: 'Także od nas', get: 'Pobierz', close: 'Zamknij' },
};
const tr = (k) => (T[getLang()] || T.de)[k];

async function refresh() {
  if (window.__WEB_DEMO) return;
  if (catalog.length && Date.now() - store.get(FETCHED, 0) < 12 * 3600e3) return;
  try {
    const r = await fetch(BASE + 'promo_apps?select=app_id,key,names,icon_url,tags,interests,langs,kids,priority', { headers: HEADERS });
    if (!r.ok) return;
    catalog = await r.json();
    store.set(CACHE, catalog); store.set(FETCHED, Date.now());
  } catch { /* offline: cache */ }
}

function languages() {
  const dev = (navigator.languages || [navigator.language]).map((l) => l.split('-')[0]);
  return [getLang(), ...dev].map((l) => (l === 'nb' || l === 'nn' ? 'no' : l));
}

// Same scoring as CrossPromoKit/Ranking.swift.
function recommendations(limit = Infinity) {
  const langs = languages();
  const source = catalog.find((a) => a.app_id === APP_ID);
  const interests = new Set(source ? source.interests : []);
  const taps = store.get(TAPS, {});
  return catalog
    .filter((a) => a.app_id !== APP_ID && a.langs.some((l) => langs.includes(l) || l === 'en'))
    .map((a) => {
      let s = a.tags.filter((t) => interests.has(t)).length * 10;
      if (a.langs.includes(langs[0])) s += 5;
      s += a.priority;
      if (a.kids && !interests.has('kids-learning') && !interests.has('parents')) s -= 30;
      s -= Math.min(taps[a.app_id] || 0, 3) * 6;
      return [a, s + Math.random() * 3];
    })
    .sort((x, y) => y[1] - x[1]).slice(0, limit).map((x) => x[0]);
}

function name(a) {
  for (const l of [...languages(), 'en', 'de']) if (a.names[l]) return a.names[l];
  return Object.values(a.names)[0] || { name: a.key, subtitle: '' };
}

function deviceId() {
  let id = store.get(DEVICE, null);
  if (!id) { id = crypto.randomUUID(); store.set(DEVICE, id); }
  return id;
}

function log(event, app, placement) {
  if (event === 'impression') {
    const k = placement + ':' + app.app_id;
    if (seen.has(k)) return; seen.add(k);
  }
  pending.push({ source_app: APP_ID, target_app: app.app_id, event, placement, device_id: deviceId(),
    lang: languages()[0], country: null, sdk_version: 'web-1.0.0' });
  clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, 4000);
}

async function flush() {
  if (!pending.length) return;
  const batch = pending; pending = [];
  try {
    const r = await fetch(BASE + 'promo_events', { method: 'POST', headers: { ...HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(batch) });
    if (!r.ok) throw 0;
  } catch { if (pending.length < 200) pending = batch.concat(pending); }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

async function open(app, placement) {
  const taps = store.get(TAPS, {}); taps[app.app_id] = (taps[app.app_id] || 0) + 1; store.set(TAPS, taps);
  log('tap', app, placement);
  const ct = ('xp-vorfahrt3d-' + placement).slice(0, 40);
  const res = window.IAP && window.IAP.native ? await window.IAP.store(app.app_id, ct) : { ok: false };
  if (!res.ok) window.open('https://apps.apple.com/app/id' + app.app_id + '?pt=127944070&ct=' + ct + '&mt=8', '_blank');
  log('store_open', app, placement);
}

let discountBadge = false;

function row(app, placement) {
  const n = name(app);
  const el = document.createElement('div');
  el.className = 'cp-row';
  el.innerHTML = '<img alt="" loading="lazy"><div class="cp-txt"><b></b><span></span></div><button class="cp-get"></button>';
  el.querySelector('img').src = app.icon_url;
  el.querySelector('b').textContent = n.name;
  if (discountBadge && app.tags.includes('loyalty')) {
    const tag = document.createElement('em');
    tag.className = 'cp-off'; tag.textContent = '−20%';
    el.querySelector('.cp-txt').prepend(tag);
  }
  el.querySelector('span').textContent = n.subtitle;
  el.querySelector('.cp-get').textContent = tr('get');
  el.onclick = () => open(app, placement);
  log('impression', app, placement);
  return el;
}

/** Fills #id with one recommended app, or empties it for paying users. */
function renderCard(id) {
  const box = document.getElementById(id);
  if (!box) return;
  box.innerHTML = '';
  if (isPro()) return;
  const app = recommendations(3)[Math.floor(Math.random() * 3)] || recommendations(1)[0];
  if (!app) return;
  const label = document.createElement('div');
  label.className = 'cp-label'; label.textContent = tr('fromUs');
  box.append(label, row(app, 'card'));
}

/** discount: mark every app with the 20% loyalty discount (opened from the paywall). */
function showList(discount = false) {
  discountBadge = discount;
  let modal = document.getElementById('more-apps');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'more-apps'; modal.className = 'modal';
    modal.innerHTML = '<div class="modal-card cp-list-card"><button class="btn icon close">×</button><h2></h2><div class="cp-list"></div></div>';
    modal.querySelector('.close').onclick = () => modal.classList.remove('visible');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('visible'); };
    document.getElementById('ui').appendChild(modal);
  }
  modal.querySelector('h2').textContent = tr('more');
  const list = modal.querySelector('.cp-list');
  list.innerHTML = '';
  const recs = recommendations();
  // From the paywall, the apps where the 20% applies come first.
  const ordered = discountBadge ? recs.filter((a) => a.tags.includes('loyalty')).concat(recs.filter((a) => !a.tags.includes('loyalty'))) : recs;
  for (const a of ordered) list.appendChild(row(a, 'list'));
  modal.classList.add('visible');
}

export function initCrossPromo({ proCheck }) {
  isPro = proCheck;
  refresh();
  const btn = document.getElementById('btn-more-apps');
  if (btn) {
    const label = () => { btn.textContent = '📱 ' + tr('more'); };
    label();
    btn.onclick = async () => { await refresh(); showList(); };
    window.addEventListener('cp-lang', label);
  }
  window.CrossPromo = { renderCard, showList };
}
