// Bridge to the native StoreKit 2 unlock (see ios/App/App/AppDelegate.swift → BridgeViewController).
// On non-native builds (browser dev) `native` is false and callers fall back to the local simulation.
(function () {
  const hasNative = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.iap);
  const pending = {};

  window.__iapResolve = function (reqId, res) {
    const resolve = pending[reqId];
    if (resolve) { delete pending[reqId]; resolve(res || {}); }
  };
  // Live entitlement updates pushed by native (Ask to Buy, restore on another device, etc.)
  window.__iapEntitlement = function (unlocked, sub) {
    if (window.__onEntitlement) window.__onEntitlement(!!unlocked, sub);
  };

  function callWith(msg) {
    return new Promise(function (resolve) {
      if (!hasNative) { resolve({ ok: false, error: 'not_native' }); return; }
      const reqId = 'r' + Math.random().toString(36).slice(2);
      pending[reqId] = resolve;
      setTimeout(function () { if (pending[reqId]) { delete pending[reqId]; resolve({ ok: false, error: 'timeout' }); } }, 60000);
      window.webkit.messageHandlers.iap.postMessage(Object.assign({ reqId: reqId }, msg));
    });
  }

  function call(action) {
    return new Promise(function (resolve) {
      if (!hasNative) { resolve({ ok: false, error: 'not_native' }); return; }
      const reqId = 'r' + Math.random().toString(36).slice(2);
      pending[reqId] = resolve;
      // Safety timeout so the UI never hangs on a lost message.
      setTimeout(function () {
        if (pending[reqId]) { delete pending[reqId]; resolve({ ok: false, error: 'timeout' }); }
      }, 60000);
      window.webkit.messageHandlers.iap.postMessage({ action: action, reqId: reqId });
    });
  }

  window.IAP = {
    native: hasNative,
    status: function () { return call('status'); },
    purchase: function () { return call('purchase'); },
    restore: function () { return call('restore'); },
    // Bittet iOS, den nativen Bewertungs-Dialog zu zeigen (System entscheidet).
    review: function () { return call('review'); },
    // Zeigt die in RevenueCat konfigurierte Paywall (Design + Pläne kommen vom Dashboard).
    // Antwort {shown:false} → kein Remote-Paywall vorhanden, DOM-Paywall verwenden.
    paywall: function () { return call('paywall'); },
    // Öffnet die App-Store-Seite einer unserer anderen Apps im App-Sheet (Cross-Promo).
    store: function (appId, campaign) { return callWith({ action: 'store', appId: appId, campaign: campaign }); }
  };
})();
