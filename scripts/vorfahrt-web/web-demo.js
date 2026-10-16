// Web version of Vorfahrt 3D on germanpath.com. Loaded before the game scripts.
// The web version is its own product for people without an iPhone: the free
// exercises are open to everyone, the rest is unlocked with a one-time Stripe
// payment tied to a germanpath account (/api/vorfahrt-web/*). It is separate
// from the iOS in-app purchase; the iPhone app is only offered as an
// alternative. The game checks window.__WEB_DEMO (see sync-vorfahrt-web.mjs).
(function () {
  var APP_ID = '6794609450';
  var PAGE = '/vorfahrt-3d/spielen';
  var TEXT = {
    de: {
      price: '14,99 €',
      buy: 'Hier freischalten · 14,99 €',
      note: 'Sicher bezahlen mit Stripe · gilt nur für die Web-Version',
      consent: 'Ich möchte sofort loslegen und weiß, dass mein Widerrufsrecht mit der Freischaltung erlischt. <a href="/terms#vorfahrt-3d-web" target="_blank">AGB</a> · <a href="/withdrawal-form" target="_blank">Widerruf</a>',
      consentMissing: 'Bitte bestätige zuerst das Kästchen.',
      signInHint: 'Schon gekauft? <a href="#" data-wd-signin>Anmelden</a>, um deinen Zugang zu laden.',
      appAlt: 'Du hast ein iPhone oder iPad? Es gibt Vorfahrt 3D auch als <a href="#" data-wd-store>App im App Store</a> (eigener Kauf).',
      pill: 'iPhone-App', iosOnly: 'Auch im App Store',
      cardKicker: 'Direkt im Browser', cardTitle: 'Alle 61 Übungen freischalten',
      cardPrice: 'einmalig · kein Abo',
      cardPoints: ['Alle Kreuzungen, Ampeln & Blaulicht', 'Fahrsimulator mit Prüfungsfahrt & Autobahn', 'Läuft auf jedem Laptop, PC und Handy'],
      cardBtn: 'Jetzt freischalten',
      cardApp: 'Lieber auf dem iPhone? Zur App',
      unlockedKicker: 'Freigeschaltet', unlockedTitle: 'Alle Übungen sind frei',
      unlockedAs: 'Angemeldet als', unlockedBtn: 'Zu allen Übungen',
      free: '▶ Kostenlos starten – ohne Download',
      banner: '<b>Web-Version</b> · Übungen mit 🔒 einmalig für 14,99 € freischalten.',
      bannerBtn: 'Freischalten',
      done: '✓ Freigeschaltet – viel Erfolg beim Üben!',
      failed: 'Das hat nicht geklappt. Bitte versuch es noch einmal.'
    },
    en: {
      price: '€14.99',
      buy: 'Unlock here · €14.99',
      note: 'Secure checkout with Stripe · web version only',
      consent: 'I want access right away and understand that my right of withdrawal ends once it is unlocked. <a href="/terms#vorfahrt-3d-web" target="_blank">Terms</a> · <a href="/withdrawal-form" target="_blank">Withdrawal</a>',
      consentMissing: 'Please tick the box first.',
      signInHint: 'Already bought? <a href="#" data-wd-signin>Sign in</a> to load your access.',
      appAlt: 'Got an iPhone or iPad? Vorfahrt 3D is also an <a href="#" data-wd-store>app on the App Store</a> (separate purchase).',
      pill: 'iPhone app', iosOnly: 'Also on the App Store',
      cardKicker: 'Right in your browser', cardTitle: 'Unlock all 61 exercises',
      cardPrice: 'one-time · no subscription',
      cardPoints: ['Every junction, traffic light & blue-light scene', 'Driving simulator with test drive & motorway', 'Works on any laptop, PC and phone'],
      cardBtn: 'Unlock now',
      cardApp: 'Prefer your iPhone? Get the app',
      unlockedKicker: 'Unlocked', unlockedTitle: 'All exercises are open',
      unlockedAs: 'Signed in as', unlockedBtn: 'Go to all exercises',
      free: '▶ Start free – no download',
      banner: '<b>Web version</b> · Unlock the 🔒 exercises once for €14.99.',
      bannerBtn: 'Unlock',
      done: '✓ Unlocked – enjoy practising!',
      failed: 'That did not work. Please try again.'
    },
    nl: {
      price: '€ 14,99',
      buy: 'Hier ontgrendelen · € 14,99',
      note: 'Veilig betalen met Stripe · alleen voor de webversie',
      consent: 'Ik wil direct toegang en weet dat mijn herroepingsrecht vervalt zodra het is ontgrendeld. <a href="/terms#vorfahrt-3d-web" target="_blank">Voorwaarden</a> · <a href="/withdrawal-form" target="_blank">Herroeping</a>',
      consentMissing: 'Vink eerst het vakje aan.',
      signInHint: 'Al gekocht? <a href="#" data-wd-signin>Log in</a> om je toegang te laden.',
      appAlt: 'Heb je een iPhone of iPad? Vorfahrt 3D is ook een <a href="#" data-wd-store>app in de App Store</a> (aparte aankoop).',
      pill: 'iPhone-app', iosOnly: 'Ook in de App Store',
      cardKicker: 'Direct in je browser', cardTitle: 'Alle 61 oefeningen ontgrendelen',
      cardPrice: 'eenmalig · geen abonnement',
      cardPoints: ['Alle kruispunten, verkeerslichten & zwaailichten', 'Rijsimulator met examenrit & snelweg', 'Werkt op elke laptop, pc en telefoon'],
      cardBtn: 'Nu ontgrendelen',
      cardApp: 'Liever op je iPhone? Naar de app',
      unlockedKicker: 'Ontgrendeld', unlockedTitle: 'Alle oefeningen zijn open',
      unlockedAs: 'Ingelogd als', unlockedBtn: 'Naar alle oefeningen',
      free: '▶ Gratis starten – zonder download',
      banner: '<b>Webversie</b> · Ontgrendel de 🔒-oefeningen eenmalig voor € 14,99.',
      bannerBtn: 'Ontgrendelen',
      done: '✓ Ontgrendeld – veel succes met oefenen!',
      failed: 'Dat is niet gelukt. Probeer het opnieuw.'
    },
    it: {
      price: '14,99 €',
      buy: 'Sblocca qui · 14,99 €',
      note: 'Pagamento sicuro con Stripe · solo versione web',
      consent: "Voglio l'accesso subito e so che il diritto di recesso decade con lo sblocco. <a href=\"/terms#vorfahrt-3d-web\" target=\"_blank\">Termini</a> · <a href=\"/withdrawal-form\" target=\"_blank\">Recesso</a>",
      consentMissing: 'Spunta prima la casella.',
      signInHint: 'Già acquistato? <a href="#" data-wd-signin>Accedi</a> per caricare il tuo accesso.',
      appAlt: "Hai un iPhone o iPad? Vorfahrt 3D è anche un'<a href=\"#\" data-wd-store>app sull'App Store</a> (acquisto separato).",
      pill: 'App iPhone', iosOnly: "Anche sull'App Store",
      cardKicker: 'Direttamente nel browser', cardTitle: 'Sblocca tutti i 61 esercizi',
      cardPrice: 'una tantum · nessun abbonamento',
      cardPoints: ['Tutti gli incroci, semafori e lampeggianti blu', 'Simulatore di guida con esame e autostrada', 'Funziona su ogni laptop, PC e telefono'],
      cardBtn: 'Sblocca ora',
      cardApp: "Preferisci l'iPhone? Vai all'app",
      unlockedKicker: 'Sbloccato', unlockedTitle: 'Tutti gli esercizi sono aperti',
      unlockedAs: 'Accesso come', unlockedBtn: 'Vai a tutti gli esercizi',
      free: '▶ Inizia gratis – senza download',
      banner: '<b>Versione web</b> · Sblocca gli esercizi 🔒 una volta per 14,99 €.',
      bannerBtn: 'Sblocca',
      done: '✓ Sbloccato – buon allenamento!',
      failed: 'Non ha funzionato. Riprova.'
    },
    es: {
      price: '14,99 €',
      buy: 'Desbloquear aquí · 14,99 €',
      note: 'Pago seguro con Stripe · solo versión web',
      consent: 'Quiero acceso inmediato y sé que mi derecho de desistimiento termina con el desbloqueo. <a href="/terms#vorfahrt-3d-web" target="_blank">Condiciones</a> · <a href="/withdrawal-form" target="_blank">Desistimiento</a>',
      consentMissing: 'Marca primero la casilla.',
      signInHint: '¿Ya compraste? <a href="#" data-wd-signin>Inicia sesión</a> para cargar tu acceso.',
      appAlt: '¿Tienes iPhone o iPad? Vorfahrt 3D también es una <a href="#" data-wd-store>app en la App Store</a> (compra aparte).',
      pill: 'App iPhone', iosOnly: 'También en la App Store',
      cardKicker: 'Directamente en el navegador', cardTitle: 'Desbloquea los 61 ejercicios',
      cardPrice: 'pago único · sin suscripción',
      cardPoints: ['Todos los cruces, semáforos y luces azules', 'Simulador con examen práctico y autopista', 'Funciona en cualquier portátil, PC y móvil'],
      cardBtn: 'Desbloquear ahora',
      cardApp: '¿Prefieres el iPhone? Ir a la app',
      unlockedKicker: 'Desbloqueado', unlockedTitle: 'Todos los ejercicios están abiertos',
      unlockedAs: 'Sesión iniciada como', unlockedBtn: 'Ir a todos los ejercicios',
      free: '▶ Empieza gratis – sin descargas',
      banner: '<b>Versión web</b> · Desbloquea los ejercicios 🔒 una vez por 14,99 €.',
      bannerBtn: 'Desbloquear',
      done: '✓ Desbloqueado – ¡a practicar!',
      failed: 'No ha funcionado. Inténtalo de nuevo.'
    },
    pl: {
      price: '14,99 €',
      buy: 'Odblokuj tutaj · 14,99 €',
      note: 'Bezpieczna płatność przez Stripe · tylko wersja web',
      consent: 'Chcę dostęp od razu i wiem, że prawo odstąpienia wygasa z chwilą odblokowania. <a href="/terms#vorfahrt-3d-web" target="_blank">Regulamin</a> · <a href="/withdrawal-form" target="_blank">Odstąpienie</a>',
      consentMissing: 'Najpierw zaznacz pole.',
      signInHint: 'Już kupione? <a href="#" data-wd-signin>Zaloguj się</a>, aby wczytać dostęp.',
      appAlt: 'Masz iPhone’a lub iPada? Vorfahrt 3D jest też <a href="#" data-wd-store>aplikacją w App Store</a> (osobny zakup).',
      pill: 'Aplikacja iPhone', iosOnly: 'Także w App Store',
      cardKicker: 'Bezpośrednio w przeglądarce', cardTitle: 'Odblokuj wszystkie 61 ćwiczeń',
      cardPrice: 'jednorazowo · bez subskrypcji',
      cardPoints: ['Wszystkie skrzyżowania, światła i sygnały', 'Symulator jazdy z egzaminem i autostradą', 'Działa na każdym laptopie, PC i telefonie'],
      cardBtn: 'Odblokuj teraz',
      cardApp: 'Wolisz iPhone’a? Do aplikacji',
      unlockedKicker: 'Odblokowane', unlockedTitle: 'Wszystkie ćwiczenia są otwarte',
      unlockedAs: 'Zalogowano jako', unlockedBtn: 'Do wszystkich ćwiczeń',
      free: '▶ Zacznij za darmo – bez pobierania',
      banner: '<b>Wersja web</b> · Odblokuj ćwiczenia 🔒 jednorazowo za 14,99 €.',
      bannerBtn: 'Odblokuj',
      done: '✓ Odblokowane – powodzenia!',
      failed: 'Nie udało się. Spróbuj ponownie.'
    }
  };

  function lang() {
    var l;
    try { l = localStorage.getItem('vorfahrt3d-lang'); } catch (e) { /* private mode */ }
    if (TEXT[l]) return l;
    var list = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().split('-')[0];
      if (TEXT[code]) return code;
    }
    return 'en';
  }
  function t(key) { return (TEXT[lang()] || TEXT.en)[key]; }

  // ct= shows up as a campaign in App Store Connect → App Analytics.
  function storeUrl(source) {
    return 'https://apps.apple.com/de/app/id' + APP_ID + '?pt=127944070&ct=germanpath-web-' + source + '&mt=8';
  }
  function openStore(source) { window.open(storeUrl(source), '_blank', 'noopener'); }

  var state = { signedIn: false, unlocked: false, email: null };
  var params = new URLSearchParams(location.search);

  function signIn(afterBuy) {
    location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(PAGE + (afterBuy ? '?buy=1' : ''));
  }

  // Runs fn once the game module has installed its hooks.
  function whenGameReady(fn) {
    var tries = 0;
    (function wait() {
      if (window.__onEntitlement) fn();
      else if (tries++ < 100) setTimeout(wait, 100);
    })();
  }

  function toast(msg) {
    var el = document.getElementById('wd-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'wd-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { el.classList.remove('visible'); }, 3200);
  }

  function openPaywall() {
    var b = document.getElementById('btn-unlock');
    if (b) b.click();
  }

  var buying = false;
  function buy() {
    if (state.unlocked || buying) return;
    var box = document.getElementById('wd-consent-box');
    var label = document.getElementById('wd-consent');
    if (box && !box.checked) {
      if (label) {
        label.classList.remove('wd-shake');
        void label.offsetWidth;
        label.classList.add('wd-shake', 'wd-missing');
      }
      setError(t('consentMissing'));
      return;
    }
    if (!state.signedIn) { signIn(true); return; }
    buying = true;
    setError('');
    var btn = document.getElementById('btn-buy');
    if (btn) btn.classList.add('wd-loading');
    fetch('/api/vorfahrt-web/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ consent: true, lang: lang() })
    }).then(function (r) {
      if (r.status === 401) { signIn(true); return null; }
      return r.json();
    }).then(function (res) {
      if (!res) return;
      if (res.url) { location.href = res.url; return; }
      if (res.unlocked) { applyState({ signedIn: true, unlocked: true, email: state.email }); return; }
      throw new Error(res.error || 'checkout');
    }).catch(function () {
      setError(t('failed'));
    }).then(function () {
      buying = false;
      if (btn) btn.classList.remove('wd-loading');
    });
  }

  function setError(msg) {
    var el = document.getElementById('wd-pay-error');
    if (el) el.textContent = msg;
  }

  window.__WEB_DEMO = { t: t, buy: buy, openStore: openStore, storeUrl: storeUrl };

  var isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  var APPLE_ICON = '<span class="wd-apple" aria-hidden="true"></span>';
  var ui = {};

  function applyState(next) {
    var wasUnlocked = state.unlocked;
    state = next;
    document.body.classList.toggle('wd-unlocked', state.unlocked);
    render();
    if (state.unlocked) {
      whenGameReady(function () {
        window.__onEntitlement(true);
        var pay = document.getElementById('paywall');
        if (pay) pay.classList.remove('visible');
        if (!wasUnlocked && params.get('checkout') === 'success') toast(t('done'));
      });
    } else if (params.get('buy') === '1' && state.signedIn) {
      // Back from sign-in on the way to buying: reopen the paywall.
      whenGameReady(openPaywall);
    }
  }

  function loadState() {
    var sessionId = params.get('checkout') === 'success' ? params.get('session_id') : null;
    var url = '/api/vorfahrt-web/entitlement' + (sessionId ? '?session_id=' + encodeURIComponent(sessionId) : '');
    fetch(url, { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) {
        if (res) applyState({ signedIn: !!res.signedIn, unlocked: !!res.unlocked, email: res.email || null });
        // Keep the address bar clean (and the session id out of shared links).
        if (params.has('checkout') || params.has('buy')) history.replaceState(null, '', PAGE);
      })
      .catch(function () { /* offline: the free exercises still work */ });
  }

  function render() {
    if (ui.pill) {
      ui.pill.innerHTML = APPLE_ICON + '<span class="wd-text"><b>' + t('pill') + '</b><small>' + t('iosOnly') + '</small></span>';
    }
    if (ui.free) ui.free.textContent = t('free');
    if (ui.card) {
      if (state.unlocked) {
        ui.card.innerHTML =
          '<span class="wd-kicker ok">' + t('unlockedKicker') + '</span>' +
          '<h3>' + t('unlockedTitle') + ' ✓</h3>' +
          (state.email ? '<p class="wd-muted">' + t('unlockedAs') + ' ' + escapeHtml(state.email) + '</p>' : '') +
          '<button type="button" class="wd-buy-btn" data-wd-levels>' + t('unlockedBtn') + '</button>';
      } else {
        ui.card.innerHTML =
          '<span class="wd-kicker">' + t('cardKicker') + '</span>' +
          '<h3>' + t('cardTitle') + '</h3>' +
          '<div class="wd-price"><b>' + t('price') + '</b><span>' + t('cardPrice') + '</span></div>' +
          '<ul>' + t('cardPoints').map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
          '<button type="button" class="wd-buy-btn" data-wd-open>' + t('cardBtn') + '</button>' +
          (state.signedIn ? '' : '<p class="wd-muted wd-signin-line">' + t('signInHint') + '</p>') +
          '<a class="wd-app-link" href="' + storeUrl('title-card') + '" target="_blank" rel="noopener">' + APPLE_ICON + '<span>' + t('cardApp') + '</span></a>';
      }
    }
    if (ui.banner) {
      ui.banner.innerHTML = '<span>' + t('banner') + '</span><button type="button" class="wd-buy-btn small" data-wd-open>' + t('bannerBtn') + '</button>';
    }
    if (ui.payExtra) {
      ui.consent.innerHTML = '<input type="checkbox" id="wd-consent-box"><span>' + t('consent') + '</span>';
      ui.payExtra.innerHTML =
        '<p id="wd-pay-error" role="alert"></p>' +
        (state.signedIn ? '' : '<p class="wd-muted">' + t('signInHint') + '</p>') +
        '<p class="wd-muted wd-app-alt">' + t('appAlt') + '</p>';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('web-demo');

    // Small App Store pill on the start screen, only on Apple devices.
    if (isApple) {
      ui.pill = document.createElement('a');
      ui.pill.id = 'web-demo-pill';
      ui.pill.href = storeUrl('pill');
      ui.pill.target = '_blank';
      ui.pill.rel = 'noopener';
      document.body.appendChild(ui.pill);
    }

    // Start screen: wrap the existing content and add the unlock card beside it.
    // Buttons keep their ids, so the game's handlers still find them.
    var wrap = document.querySelector('.title-wrap');
    if (wrap) {
      var main = document.createElement('div');
      main.className = 'wd-title-main';
      while (wrap.firstChild) main.appendChild(wrap.firstChild);
      wrap.appendChild(main);
      ui.card = document.createElement('aside');
      ui.card.className = 'wd-app-card';
      wrap.appendChild(ui.card);
      var firstRow = main.querySelector('.cta-row');
      if (firstRow) {
        ui.free = document.createElement('p');
        ui.free.className = 'wd-free';
        firstRow.parentNode.insertBefore(ui.free, firstRow.nextSibling);
      }
    }

    // Menu: unlock banner above the grid.
    var grid = document.getElementById('level-grid');
    if (grid) {
      ui.banner = document.createElement('div');
      ui.banner.className = 'wd-banner';
      grid.parentNode.insertBefore(ui.banner, grid);
    }

    // Paywall: consent checkbox before the buy button, notes after it.
    var buyBtn = document.getElementById('btn-buy');
    if (buyBtn) {
      ui.consent = document.createElement('label');
      ui.consent.id = 'wd-consent';
      buyBtn.parentNode.insertBefore(ui.consent, buyBtn);
      ui.payExtra = document.createElement('div');
      ui.payExtra.className = 'wd-pay-extra';
      buyBtn.parentNode.insertBefore(ui.payExtra, buyBtn.nextSibling);
      ui.consent.addEventListener('change', function () {
        ui.consent.classList.remove('wd-missing');
        setError('');
      });
    }

    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-wd-open],[data-wd-signin],[data-wd-store],[data-wd-levels]');
      if (!el) return;
      e.preventDefault();
      if (el.hasAttribute('data-wd-open')) openPaywall();
      else if (el.hasAttribute('data-wd-signin')) signIn(false);
      else if (el.hasAttribute('data-wd-store')) openStore('paywall');
      else if (el.hasAttribute('data-wd-levels')) { var lv = document.getElementById('btn-levels'); if (lv) lv.click(); }
    });

    // Pill only on the start screen, never on top of the 3D scene, HUD or a popup.
    var title = document.getElementById('screen-title');
    var lastLang = null;
    function sync() {
      if (lang() !== lastLang) { lastLang = lang(); render(); }
      if (!ui.pill) return;
      var show = !!title && title.classList.contains('visible') && !document.querySelector('.modal.visible');
      ui.pill.classList.toggle('visible', show);
    }
    var obs = new MutationObserver(sync);
    [title].concat([].slice.call(document.querySelectorAll('.modal'))).filter(Boolean).forEach(function (s) {
      obs.observe(s, { attributes: true, attributeFilter: ['class'] });
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    sync();
    loadState();
  });
})();
