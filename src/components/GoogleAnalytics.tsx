'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const CONSENT_KEY = 'gp_cookie_consent';

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const consent = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      return consent?.analytics === true;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleConsent = (event: Event) => {
      const detail = (event as CustomEvent<{ analytics?: boolean }>).detail;
      setEnabled(detail?.analytics === true);
    };
    window.addEventListener('cookieConsent', handleConsent);
    return () => window.removeEventListener('cookieConsent', handleConsent);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
