'use client';

import { CookieConsentBanner } from './CookieConsentBanner';
import { SiteFooter } from './SiteFooter';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
      <CookieConsentBanner />
    </>
  );
}
