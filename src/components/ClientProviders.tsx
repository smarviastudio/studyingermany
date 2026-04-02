'use client';

import { CookieConsentBanner } from './CookieConsentBanner';
import { SiteFooter } from './SiteFooter';
import { ContactModalProvider } from './ContactModalProvider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <SiteFooter />
      <CookieConsentBanner />
    </ContactModalProvider>
  );
}
