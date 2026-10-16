// Web demo of Vorfahrt 3D on germanpath.com. Loaded before the game scripts;
// the game checks window.__WEB_DEMO to send paid items to the App Store
// instead of simulating a purchase (see scripts/sync-vorfahrt-web.mjs).
// Also adds the web-only pieces: the App Store pill, the app card on the
// start screen (desktop) and the unlock banner in the menu.
(function () {
  var APP_ID = '6794609450';
  var TEXT = {
    de: {
      buy: 'Vollversion im App Store', note: 'Web-Demo · Alle Übungen in der App für iPhone & iPad',
      pill: 'App holen', iosOnly: 'Für iPhone & iPad',
      cardKicker: 'Vollversion', cardTitle: 'Vorfahrt 3D für iPhone & iPad',
      cardPoints: ['Alle 61 Übungen statt der Web-Demo', 'Fahrsimulator mit Prüfungsfahrt & Autobahn', 'Einmal zahlen, kein Abo'],
      banner: '<b>Web-Demo</b> · Übungen mit 🔒 sind in der App freigeschaltet.'
    },
    en: {
      buy: 'Get the full app', note: 'Web demo · All exercises in the app for iPhone & iPad',
      pill: 'Get the app', iosOnly: 'For iPhone & iPad',
      cardKicker: 'Full version', cardTitle: 'Vorfahrt 3D for iPhone & iPad',
      cardPoints: ['All 61 exercises instead of the web demo', 'Driving simulator with test drive & motorway', 'Pay once, no subscription'],
      banner: '<b>Web demo</b> · Exercises marked 🔒 are unlocked in the app.'
    },
    nl: {
      buy: 'Volledige app in de App Store', note: 'Webdemo · Alle oefeningen in de app voor iPhone & iPad',
      pill: 'App downloaden', iosOnly: 'Voor iPhone & iPad',
      cardKicker: 'Volledige versie', cardTitle: 'Vorfahrt 3D voor iPhone & iPad',
      cardPoints: ['Alle 61 oefeningen in plaats van de webdemo', 'Rijsimulator met examenrit & snelweg', 'Eenmalig betalen, geen abonnement'],
      banner: '<b>Webdemo</b> · Oefeningen met 🔒 zijn ontgrendeld in de app.'
    },
    it: {
      buy: "App completa nell'App Store", note: "Demo web · Tutti gli esercizi nell'app per iPhone e iPad",
      pill: "Scarica l'app", iosOnly: 'Per iPhone e iPad',
      cardKicker: 'Versione completa', cardTitle: 'Vorfahrt 3D per iPhone e iPad',
      cardPoints: ['Tutti i 61 esercizi invece della demo web', 'Simulatore di guida con esame e autostrada', 'Paghi una volta, nessun abbonamento'],
      banner: "<b>Demo web</b> · Gli esercizi con 🔒 sono sbloccati nell'app."
    },
    es: {
      buy: 'App completa en la App Store', note: 'Demo web · Todos los ejercicios en la app para iPhone y iPad',
      pill: 'Descargar app', iosOnly: 'Para iPhone y iPad',
      cardKicker: 'Versión completa', cardTitle: 'Vorfahrt 3D para iPhone y iPad',
      cardPoints: ['Los 61 ejercicios en lugar de la demo web', 'Simulador con examen práctico y autopista', 'Pago único, sin suscripción'],
      banner: '<b>Demo web</b> · Los ejercicios con 🔒 se desbloquean en la app.'
    },
    pl: {
      buy: 'Pełna wersja w App Store', note: 'Wersja web · Wszystkie ćwiczenia w aplikacji na iPhone i iPad',
      pill: 'Pobierz aplikację', iosOnly: 'Na iPhone i iPad',
      cardKicker: 'Pełna wersja', cardTitle: 'Vorfahrt 3D na iPhone i iPad',
      cardPoints: ['Wszystkie 61 ćwiczeń zamiast wersji web', 'Symulator jazdy z egzaminem i autostradą', 'Płacisz raz, bez subskrypcji'],
      banner: '<b>Wersja web</b> · Ćwiczenia z 🔒 są odblokowane w aplikacji.'
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
  function openStore(source) {
    window.open(storeUrl(source), '_blank', 'noopener');
  }

  window.__WEB_DEMO = { t: t, openStore: openStore, storeUrl: storeUrl };

  var isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  var APPLE_ICON = '<span class="wd-apple" aria-hidden="true"></span>';

  function storeLink(source, cls) {
    var a = document.createElement('a');
    a.className = cls;
    a.href = storeUrl(source);
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('web-demo');

    // Floating pill on the start screen (phones; on desktop the app card takes over).
    var pill = storeLink('pill', '');
    pill.id = 'web-demo-pill';
    document.body.appendChild(pill);

    // Start screen: wrap the existing content and add the app card beside it.
    // Buttons keep their ids, so the game's handlers still find them.
    var wrap = document.querySelector('.title-wrap');
    var card = null;
    if (wrap) {
      var main = document.createElement('div');
      main.className = 'wd-title-main';
      while (wrap.firstChild) main.appendChild(wrap.firstChild);
      wrap.appendChild(main);
      card = document.createElement('aside');
      card.className = 'wd-app-card';
      wrap.appendChild(card);
    }

    // Menu: banner above the grid.
    var grid = document.getElementById('level-grid');
    var banner = null;
    if (grid) {
      banner = document.createElement('div');
      banner.className = 'wd-banner';
      grid.parentNode.insertBefore(banner, grid);
    }

    function render() {
      pill.innerHTML = APPLE_ICON + '<span class="wd-text"><b>' + t('pill') + '</b>' +
        (isApple ? '' : '<small>' + t('iosOnly') + '</small>') + '</span>';
      if (card) {
        card.innerHTML =
          '<img src="/apps/vorfahrt/icon.webp" alt="" width="72" height="72">' +
          '<span class="wd-kicker">' + t('cardKicker') + '</span>' +
          '<h3>' + t('cardTitle') + '</h3>' +
          '<ul>' + t('cardPoints').map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>';
        var btn = storeLink('title-card', 'wd-store-btn');
        btn.innerHTML = APPLE_ICON + '<span>' + t('buy') + '</span>';
        card.appendChild(btn);
      }
      if (banner) {
        banner.innerHTML = '<span>' + t('banner') + '</span>';
        var b = storeLink('menu-banner', 'wd-store-btn small');
        b.innerHTML = APPLE_ICON + '<span>' + t('pill') + '</span>';
        banner.appendChild(b);
      }
    }

    // Pill only on the start screen (the menu has its banner), never on top of the 3D scene, HUD or a popup.
    var screens = ['screen-title'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var lastLang = null;
    function sync() {
      if (lang() !== lastLang) { lastLang = lang(); render(); }
      var title = document.getElementById('screen-title');
      document.body.classList.toggle('wd-on-title', !!title && title.classList.contains('visible'));
      var show = screens.some(function (s) { return s.classList.contains('visible'); }) &&
        !document.querySelector('.modal.visible');
      pill.classList.toggle('visible', show);
    }
    var obs = new MutationObserver(sync);
    var watched = screens.concat([].slice.call(document.querySelectorAll('.modal')));
    watched.forEach(function (s) { obs.observe(s, { attributes: true, attributeFilter: ['class'] }); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    sync();
  });
})();
