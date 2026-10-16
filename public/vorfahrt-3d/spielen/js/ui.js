// DOM-Overlay: Screens, Kategorien, HUD, Chips, Quiz, Paywall
import { CATEGORIES, TOTAL_ITEMS, byId } from './scenarios.js';
import { t, tr, trCat } from './i18n.js?v=6';

const $ = (id) => document.getElementById(id);

function renderSigns(container, chips) {
  container.innerHTML = '';
  for (const c of chips) {
    const el = document.createElement('div');
    el.className = 'sign-chip';
    el.innerHTML = `<img src="${c.img}" alt=""><span>${c.label}</span>`;
    container.appendChild(el);
  }
}

// Kompakte Info-Zeile im Frage-Panel: darf NICHT wie Antwort-Buttons aussehen
function renderSignsCompact(container, chips) {
  container.innerHTML = '';
  if (!chips.length) return;
  const lab = document.createElement('span');
  lab.className = 'qs-label';
  lab.textContent = t('hereApplies');
  container.appendChild(lab);
  for (const c of chips) {
    const img = document.createElement('img');
    img.src = c.img;
    img.alt = c.label;
    img.title = c.label;
    container.appendChild(img);
  }
}

const envLabel = (env) => (env ? t('env')[env] : null);

export function initUI(cb) {
  const els = {
    title: $('screen-title'), menu: $('screen-menu'), hud: $('hud'),
    grid: $('level-grid'), menuTitle: $('menu-title'), menuDesc: $('menu-desc'),
    progLabel: $('progress-label'), progBar: $('progress-bar').querySelector('i'),
    qPanel: $('question-panel'), qText: $('question-text'), qHint: $('question-hint'), chips: $('chips'),
    qSigns: $('question-signs'), expSigns: $('explain-signs'),
    toast: $('toast'), explain: $('explain'), explainCard: $('explain-card'),
    verdict: $('explain-verdict'), rule: $('explain-rule'), expText: $('explain-text'),
    hudTitle: $('hud-title'), hudCount: $('hud-count'),
    paywall: $('paywall'), skip: $('btn-skip'),
    quiz: $('quiz'), quizEnv: $('quiz-env'), quizQ: $('quiz-q'), quizOpts: $('quiz-options'),
    howto: $('howto'),
    observe: $('observe'), observeCount: $('observe-count'),
    simHud: $('sim-hud'), simTask: $('sim-task'), simSpeed: $('sim-speed'),
    alarm: $('alarm'), alarmText: $('alarm-text'),
    simHowto: $('sim-howto'),
    driveTimer: $('drive-timer'), driveMist: $('drive-mist'),
    blinkL: $('blink-l'), blinkR: $('blink-r'),
    mflash: $('mistake-flash'),
    driveResults: $('drive-results'), drEmoji: $('dr-emoji'), drTitle: $('dr-title'),
    drVerdict: $('dr-verdict'), drList: $('dr-list')
  };

  let toastTimer = null;
  let menuView = 'cats';       // 'cats' | 'levels'
  let menuCatId = null;
  let lastProgress = {};
  let lastUnlocked = false;
  let skipCb = null;
  let howtoCb = null;
  let simHowtoCb = null;
  let catsScroll = 0;          // Scrollposition der Themenliste, für den Weg zurück
  const menuCard = els.menu.querySelector('.menu-card');

  $('btn-start').onclick = () => cb.onStart();
  $('btn-levels').onclick = () => cb.onStart();
  $('btn-menu-back').onclick = () => {
    if (menuView === 'levels') renderCats();
    else cb.onTitle();
  };
  $('btn-back').onclick = () => cb.onOpenMenu();
  $('btn-next').onclick = () => cb.onNext();
  $('btn-retry').onclick = () => cb.onRetry();
  $('btn-buy').onclick = () => cb.onBuy();
  // Großer Kauf-Einstieg auf dem Startbildschirm (App Review fand die Paywall sonst nicht).
  $('btn-unlock').onclick = () => api.showPaywall();
  // Delegiert: der Restore-Link wird beim Sprachwechsel neu erzeugt
  els.paywall.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-restore') { e.preventDefault(); cb.onRestore(); }
  });
  $('btn-pay-close').onclick = () => api.hidePaywall();
  els.skip.onclick = () => { if (skipCb) skipCb(); };
  $('btn-howto-ok').onclick = () => {
    els.howto.classList.remove('visible');
    if (howtoCb) { const f = howtoCb; howtoCb = null; f(); }
  };
  $('btn-sim-howto-ok').onclick = () => {
    els.simHowto.classList.remove('visible');
    if (simHowtoCb) { const f = simHowtoCb; simHowtoCb = null; f(); }
  };
  $('btn-alarm-retry').onclick = () => cb.onAlarmRetry();
  $('btn-alarm-menu').onclick = () => cb.onAlarmMenu();

  // Pedale: gedrückt halten = Gas/Bremse (Touch & Maus)
  function bindPedal(el, which) {
    const set = (down) => (e) => {
      e.preventDefault();
      el.classList.toggle('down', down);
      cb.onPedal(which, down);
    };
    el.addEventListener('pointerdown', set(true));
    el.addEventListener('pointerup', set(false));
    el.addEventListener('pointercancel', set(false));
    el.addEventListener('pointerleave', set(false));
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  bindPedal($('pedal-gas'), 'gas');
  bindPedal($('pedal-brake'), 'brake');

  // Blinker (Dauerfahrten): antippen schaltet um, gleiche Seite nochmal = aus
  els.blinkL.onclick = () => cb.onIndicator('L');
  els.blinkR.onclick = () => cb.onIndicator('R');
  $('btn-dr-ok').onclick = () => {
    els.driveResults.classList.remove('visible');
    cb.onDriveDone();
  };

  function hideGameOverlays() {
    els.hud.classList.remove('visible');
    els.explain.classList.remove('visible');
    els.quiz.classList.remove('visible');
    els.driveResults.classList.remove('visible');
    api.hideQuestion();
    api.hideSkip();
    api.hideObserve();
    api.hideSim();
    api.hideAlarm();
  }

  function catProgress(cat) {
    let done = 0;
    for (const id of cat.items) if (lastProgress[id] === 'passed') done++;
    return done;
  }

  // Eine Kategorie ist gesperrt, wenn keine einzige ihrer Übungen offen ist
  function catLocked(cat) {
    return !lastUnlocked && cat.items.every((id) => !byId(id).free);
  }

  function catCard(cat, extraClass = '') {
    const total = cat.items.length;
    const done = catProgress(cat);
    const locked = catLocked(cat);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const chips = [
      cat.isNew ? `<i class="chip new">${t('badgeNew')}</i>` : '',
      locked ? `<i class="chip lock">🔒</i>` : ''
    ].join('');
    const b = document.createElement('button');
    b.className = 'cat-card' + (locked ? ' locked' : '') + (extraClass ? ` ${extraClass}` : '');
    b.innerHTML = `<span class="emoji">${cat.emoji}</span>
      <span class="info">
        <b>${trCat(cat, 'title')}${chips}</b>
        <small>${trCat(cat, 'desc')}</small>
        <span class="bar"><i style="width:${pct}%"></i></span>
      </span>
      <span class="count ${done === total ? 'done' : ''}">${done}/${total}</span>`;
    b.onclick = () => renderLevels(cat.id);
    return b;
  }

  /* Nächste offene Übung — Grundlage der „Weiter üben"-Karte.
     Dauerfahrten bleiben außen vor: als Einstieg ist eine kurze Übung besser. */
  function nextOpenItem() {
    let lockedAhead = false;
    for (const cat of CATEGORIES) {
      for (const id of cat.items) {
        const item = byId(id);
        if (item.kind === 'drive') continue;
        if (lastProgress[id] === 'passed') continue;
        if (!item.free && !lastUnlocked) { lockedAhead = true; continue; }
        return { id, item, cat };
      }
    }
    return lockedAhead ? { locked: true } : null;
  }

  function resumeCard() {
    const next = nextOpenItem();
    const b = document.createElement('button');
    b.className = 'menu-hero';
    if (!next) {
      b.classList.add('is-done');
      b.innerHTML = `<span class="emoji">🏁</span>
        <span class="info"><b>${t('allDone')}</b><small>${t('allDoneDesc')}</small></span>`;
      b.onclick = () => renderLevels(CATEGORIES[0].id);
      return b;
    }
    if (next.locked) {
      b.innerHTML = `<span class="emoji">🔓</span>
        <span class="info"><b>${t('unlockTitle')}</b><small>${t('unlockDesc')}</small></span>
        <span class="go">${t('resumeGo')}</span>`;
      b.onclick = () => api.showPaywall();
      return b;
    }
    const started = Object.keys(lastProgress).length > 0;
    b.innerHTML = `<span class="emoji">${next.cat.emoji}</span>
      <span class="info">
        <b>${started ? t('resumeTitle') : t('resumeStart')}</b>
        <small>${trCat(next.cat, 'title')} · ${tr(next.item, 'title')}</small>
      </span>
      <span class="go">${t('resumeGo')}</span>`;
    b.onclick = () => cb.onSelectLevel(next.id);
    return b;
  }

  function sectionHeader(text) {
    const sep = document.createElement('div');
    sep.className = 'menu-section';
    sep.textContent = text;
    return sep;
  }

  function levelButton(id, i) {
    const item = byId(id);
    const st = lastProgress[id];
    const locked = !item.free && !lastUnlocked;
    const b = document.createElement('button');
    b.className = 'level' + (locked ? ' locked' : st === 'passed' ? ' passed' : st === 'failed' ? ' failed' : '');
    b.innerHTML = `<span class="nr">${locked ? '🔒' : i + 1}</span>
      <span class="ttl">${tr(item, 'title')}</span>
      <span class="status">${st === 'passed' ? '✓' : st === 'failed' ? '↻' : ''}</span>`;
    b.onclick = () => (locked ? api.showPaywall() : cb.onSelectLevel(id));
    return b;
  }

  function renderCats() {
    const back = menuView === 'levels';
    menuView = 'cats';
    menuCatId = null;
    els.menuTitle.textContent = t('menuTitle');
    els.menuDesc.textContent = t('menuDesc');
    let total = 0;
    for (const c of CATEGORIES) total += catProgress(c);
    els.progLabel.textContent = `${total} / ${TOTAL_ITEMS}`;
    els.progBar.style.width = `${(total / TOTAL_ITEMS) * 100}%`;
    els.grid.className = 'cats';
    els.grid.innerHTML = '';

    // 1. Einstieg: dort weitermachen, wo es aufgehört hat
    els.grid.appendChild(resumeCard());

    // 2. Vorfahrt & Kreuzungen — die klassischen Übungen
    const groups = t('groups');
    els.grid.appendChild(sectionHeader(groups.vorfahrt));
    for (const cat of CATEGORIES) {
      if ((cat.group || 'vorfahrt') !== 'vorfahrt') continue;
      els.grid.appendChild(catCard(cat));
    }

    // 3. Selbst fahren: Dauerfahrten einzeln, kurze Sim-Level gesammelt
    const simCat = CATEGORIES.find((c) => c.id === 'sim');
    if (simCat) {
      els.grid.appendChild(sectionHeader(groups.fahren));
      const DRIVE_EMOJI = { 'drive-free': '🚗', 'drive-test': '📋', 'drive-autobahn': '🛣️' };
      for (const id of simCat.items) {
        const item = byId(id);
        if (item.kind !== 'drive') continue;
        const st = lastProgress[id];
        const locked = !item.free && !lastUnlocked;
        const b = document.createElement('button');
        b.className = 'cat-card sim-feature' + (locked ? ' locked' : '');
        b.innerHTML = `<span class="emoji">${locked ? '🔒' : DRIVE_EMOJI[id] || '🚗'}</span>
          <span class="info"><b>${tr(item, 'title')}</b><small>${t('driveDescs')[id] || ''}</small></span>
          <span class="count ${st === 'passed' ? 'done' : ''}">${st === 'passed' ? '✓' : st === 'failed' ? '↻' : ''}</span>`;
        b.onclick = () => (locked ? api.showPaywall() : cb.onSelectLevel(id));
        els.grid.appendChild(b);
      }

      const levels = simCat.items.filter((id) => byId(id).kind !== 'drive');
      let done = 0;
      for (const id of levels) if (lastProgress[id] === 'passed') done++;
      const pct = levels.length ? Math.round((done / levels.length) * 100) : 0;
      const b = document.createElement('button');
      b.className = 'cat-card';
      b.innerHTML = `<span class="emoji">🎯</span>
        <span class="info">
          <b>${t('simLevels')}</b>
          <small>${t('simLevelsDesc')}</small>
          <span class="bar"><i style="width:${pct}%"></i></span>
        </span>
        <span class="count ${done === levels.length ? 'done' : ''}">${done}/${levels.length}</span>`;
      b.onclick = () => renderLevels('sim');
      els.grid.appendChild(b);
    }

    // 4. Wissensfragen
    const rest = CATEGORIES.filter((c) => (c.group || 'vorfahrt') === 'wissen');
    if (rest.length) {
      els.grid.appendChild(sectionHeader(groups.wissen));
      for (const cat of rest) els.grid.appendChild(catCard(cat));
    }
    // Zurück aus einer Levelliste: dort weiter, wo man in der Themenliste war
    if (menuCard) menuCard.scrollTop = back ? catsScroll : 0;
  }

  function renderLevels(catId) {
    if (menuView === 'cats' && menuCard) catsScroll = menuCard.scrollTop;
    menuView = 'levels';
    menuCatId = catId;
    const cat = CATEGORIES.find((c) => c.id === catId);
    els.menuTitle.textContent = `${cat.emoji} ${trCat(cat, 'title')}`;
    els.menuDesc.textContent = trCat(cat, 'desc');
    // Im Simulator zeigt die Liste nur die kurzen Level (die Dauerfahrten
    // stehen im Hauptmenü) — gruppiert nach Schwierigkeit
    const items = cat.id === 'sim'
      ? cat.items.filter((id) => byId(id).kind !== 'drive')
      : cat.items;
    let done = 0;
    for (const id of items) if (lastProgress[id] === 'passed') done++;
    els.progLabel.textContent = `${done} / ${items.length}`;
    els.progBar.style.width = `${(done / items.length) * 100}%`;
    els.grid.className = '';
    els.grid.innerHTML = '';
    let lastTier = null;
    items.forEach((id, i) => {
      const item = byId(id);
      if (item.tier && item.tier !== lastTier) {
        lastTier = item.tier;
        const sep = document.createElement('div');
        sep.className = 'menu-section';
        sep.textContent = t('tiers')[item.tier];
        els.grid.appendChild(sep);
      }
      els.grid.appendChild(levelButton(id, i));
    });
    // Levelliste immer von oben zeigen — sonst lag sie halb gescrollt und die
    // kostenlosen Level waren außer Sicht
    if (menuCard) menuCard.scrollTop = 0;
  }

  const api = {
    showTitle() {
      els.title.classList.add('visible');
      els.menu.classList.remove('visible');
      hideGameOverlays();
    },

    // catId gesetzt → direkt die Levelliste dieser Kategorie zeigen
    showMenu(progress, unlocked, catId = null) {
      lastProgress = progress;
      lastUnlocked = unlocked;
      els.title.classList.remove('visible');
      hideGameOverlays();
      if (catId) renderLevels(catId); else renderCats();
      els.menu.classList.add('visible');
    },

    refreshMenu(progress, unlocked) {
      document.body.classList.toggle('pro', !!unlocked);
      lastProgress = progress;
      lastUnlocked = unlocked;
      if (els.menu.classList.contains('visible')) {
        if (menuView === 'levels' && menuCatId) renderLevels(menuCatId); else renderCats();
      }
    },

    showHUD(title, index, total) {
      els.title.classList.remove('visible');
      els.menu.classList.remove('visible');
      els.explain.classList.remove('visible');
      els.quiz.classList.remove('visible');
      els.hudTitle.textContent = title;
      els.hudCount.textContent = index ? `${index}/${total}` : '';
      els.hud.classList.add('visible');
    },

    showQuestion(sc, candidates, signChips = []) {
      api.prepareQuestion(sc, candidates, signChips);
      els.qPanel.classList.add('visible');
    },

    // Inhalt setzen, Karte bleibt versteckt (für die Kamera-Einpassung vorab)
    prepareQuestion(sc, candidates, signChips = []) {
      els.qText.textContent = t('whoFirst');
      els.qHint.textContent = tr(sc, 'hint') || '';
      renderSignsCompact(els.qSigns, signChips);
      els.chips.innerHTML = '';
      for (const c of candidates) {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.dataset.id = c.id;
        chip.innerHTML = `<span class="dot" style="background:${c.colorCss}"></span>${c.label}`;
        chip.onclick = () => cb.onAnswer(c.id);
        els.chips.appendChild(chip);
      }
    },

    markChips(pickedId, correctId) {
      for (const chip of els.chips.children) {
        chip.disabled = true;
        if (chip.dataset.id === correctId) chip.classList.add('correct');
        else if (chip.dataset.id === pickedId) chip.classList.add('wrong');
      }
    },

    hideQuestion() { els.qPanel.classList.remove('visible'); },

    /* ---- Quiz ---- */
    showQuiz(item, options) {
      els.menu.classList.remove('visible');
      els.title.classList.remove('visible');
      els.explain.classList.remove('visible');
      api.hideQuestion();
      const env = envLabel(item.env);
      els.quizEnv.textContent = env || '';
      els.quizEnv.classList.toggle('visible', !!env);
      els.quizQ.textContent = tr(item, 'q');
      els.quizOpts.innerHTML = '';
      for (const opt of options) {
        const b = document.createElement('button');
        b.className = 'quiz-opt';
        b.textContent = opt.label ?? opt.t;
        if (opt.ok) b.dataset.ok = '1';
        b.onclick = () => cb.onQuizAnswer(opt, b);
        els.quizOpts.appendChild(b);
      }
      els.quiz.classList.add('visible');
    },

    markQuiz(pickedEl, pickedOk) {
      for (const b of els.quizOpts.children) {
        b.disabled = true;
        if (b.dataset.ok) b.classList.add('correct');
      }
      if (!pickedOk && pickedEl) pickedEl.classList.add('wrong');
    },

    hideQuiz() { els.quiz.classList.remove('visible'); },

    /* ---- Überspringen ---- */
    showSkip(onSkip) { skipCb = onSkip; els.skip.classList.add('visible'); },
    hideSkip() { skipCb = null; els.skip.classList.remove('visible'); },

    /* ---- Beobachtungsphase ---- */
    showObserve(n) { els.observeCount.textContent = n; els.observe.classList.add('visible'); },
    setObserveCount(n) { els.observeCount.textContent = n; },
    hideObserve() { els.observe.classList.remove('visible'); },

    /* ---- Fahrsimulator ---- */
    showSim(task) {
      document.body.classList.add('in-sim');
      els.simHud.classList.remove('drive'); // Timer/Fehlerzähler gehören nur zu den Dauerfahrten
      els.simTask.textContent = task;
      els.simSpeed.textContent = '0 km/h';
      els.simHud.classList.add('visible');
    },
    hideSim() {
      document.body.classList.remove('in-sim');
      els.simHud.classList.remove('visible', 'drive');
      $('pedal-gas').classList.remove('down');
      $('pedal-brake').classList.remove('down');
      api.setIndicator(null);
    },

    /* ---- Dauerfahrten (Freies Fahren / Praktische Prüfung) ---- */
    showDrive(task) {
      document.body.classList.add('in-sim');
      els.simTask.textContent = task;
      els.simSpeed.textContent = '0 km/h';
      els.driveMist.textContent = '';
      els.driveTimer.textContent = '';
      els.simHud.classList.add('visible', 'drive');
    },
    setDriveTask(task) { els.simTask.textContent = task; },
    setDriveInfo(timer, mist) {
      els.driveTimer.textContent = timer;
      els.driveMist.textContent = mist || '';
    },
    setIndicator(side) {
      els.blinkL.classList.toggle('active', side === 'L');
      els.blinkR.classList.toggle('active', side === 'R');
    },
    flashMistake() {
      els.mflash.classList.remove('visible');
      void els.mflash.offsetWidth; // Animation neu starten
      els.mflash.classList.add('visible');
    },
    showDriveResults({ title, emoji, verdict, verdictGood, items, footer }) {
      api.hideSim();
      api.hideToast();
      els.drTitle.textContent = title;
      els.drEmoji.textContent = emoji;
      els.drVerdict.textContent = verdict || '';
      els.drVerdict.className = verdictGood == null ? '' : verdictGood ? 'good' : 'bad';
      els.drList.innerHTML = '';
      if (!items.length) {
        const li = document.createElement('li');
        li.className = 'clean';
        li.textContent = footer;
        els.drList.appendChild(li);
      } else {
        for (const it of items) {
          const li = document.createElement('li');
          li.innerHTML = `${it.text}<small>${it.where}</small>`;
          els.drList.appendChild(li);
        }
        if (footer) {
          const li = document.createElement('li');
          li.className = 'clean';
          li.textContent = footer;
          els.drList.appendChild(li);
        }
      }
      if (window.CrossPromo) window.CrossPromo.renderCard('dr-promo');
      els.driveResults.classList.add('visible');
    },
    setSimSpeed(kmh) { els.simSpeed.textContent = `${kmh} km/h`; },
    showAlarm(msg) { els.alarmText.textContent = msg; els.alarm.classList.add('visible'); },
    hideAlarm() { els.alarm.classList.remove('visible'); },

    /* ---- Anleitung ---- */
    showHowto(onDone) { howtoCb = onDone; els.howto.classList.add('visible'); },
    showSimHowto(onDone) { simHowtoCb = onDone; els.simHowto.classList.add('visible'); },

    toast(msg, ms = 2600) {
      els.toast.textContent = msg;
      els.toast.classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => els.toast.classList.remove('visible'), ms);
    },
    hideToast() {
      clearTimeout(toastTimer);
      els.toast.classList.remove('visible');
    },

    showExplanation(sc, correct, signChips = [], verdict = null) {
      els.verdict.textContent = verdict || (correct ? t('correct') : t('wrong'));
      els.verdict.className = correct ? 'good' : 'bad';
      els.rule.textContent = tr(sc, 'rule');
      renderSigns(els.expSigns, signChips);
      els.expText.textContent = tr(sc, 'explanation');
      els.explain.classList.add('visible');
    },

    hideExplanation() { els.explain.classList.remove('visible'); },

    showPaywall() {
      if (cb.onPaywallOpen) cb.onPaywallOpen();
      // Remote-Paywall zuerst (RevenueCat Paywalls, A/B-Test-fähig); DOM-Paywall als Fallback.
      if (window.IAP && window.IAP.native) {
        window.IAP.paywall().then((res) => {
          if (res && res.shown) {
            if (res.unlocked && window.__onEntitlement) window.__onEntitlement(true);
            return;
          }
          els.paywall.classList.add('visible');
        });
        return;
      }
      els.paywall.classList.add('visible');
    },
    hidePaywall() { els.paywall.classList.remove('visible'); }
  };

  return api;
}
