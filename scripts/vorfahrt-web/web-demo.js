// Web demo of Vorfahrt 3D on germanpath.com. Loaded before the game scripts;
// the game checks window.__WEB_DEMO to send paid items to the App Store
// instead of simulating a purchase (see scripts/sync-vorfahrt-web.mjs).
(function () {
  var APP_ID = '6794609450';
  var TEXT = {
    de: { buy: 'Vollversion im App Store', note: 'Web-Demo · Alle Übungen in der App für iPhone & iPad', pill: 'App holen', iosOnly: 'Für iPhone & iPad' },
    en: { buy: 'Get the full app', note: 'Web demo · All exercises in the app for iPhone & iPad', pill: 'Get the app', iosOnly: 'For iPhone & iPad' },
    nl: { buy: 'Volledige app in de App Store', note: 'Webdemo · Alle oefeningen in de app voor iPhone & iPad', pill: 'App downloaden', iosOnly: 'Voor iPhone & iPad' },
    it: { buy: "App completa nell'App Store", note: "Demo web · Tutti gli esercizi nell'app per iPhone e iPad", pill: "Scarica l'app", iosOnly: 'Per iPhone e iPad' },
    es: { buy: 'App completa en la App Store', note: 'Demo web · Todos los ejercicios en la app para iPhone y iPad', pill: 'Descargar app', iosOnly: 'Para iPhone y iPad' },
    pl: { buy: 'Pełna wersja w App Store', note: 'Wersja web · Wszystkie ćwiczenia w aplikacji na iPhone i iPad', pill: 'Pobierz aplikację', iosOnly: 'Na iPhone i iPad' }
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

  document.addEventListener('DOMContentLoaded', function () {
    var pill = document.createElement('a');
    pill.id = 'web-demo-pill';
    pill.href = storeUrl('pill');
    pill.target = '_blank';
    pill.rel = 'noopener';
    function render() {
      pill.innerHTML = '<span class="wd-apple" aria-hidden="true"></span><span class="wd-text"><b>' + t('pill') + '</b>' +
        (isApple ? '' : '<small>' + t('iosOnly') + '</small>') + '</span>';
    }
    render();
    document.body.appendChild(pill);

    // Only on the title and level menu, never on top of the 3D scene, HUD or a popup.
    var screens = ['screen-title', 'screen-menu'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
    function sync() {
      render();
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
