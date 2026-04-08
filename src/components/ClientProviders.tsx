'use client';

import { CookieConsentBanner } from './CookieConsentBanner';
import { SiteFooter } from './SiteFooter';
import { ContactModalProvider } from './ContactModalProvider';
import { GlobalChatbot } from './GlobalChatbot';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <SiteFooter />
      <CookieConsentBanner />
      <GlobalChatbot />
    </ContactModalProvider>
  );
}
