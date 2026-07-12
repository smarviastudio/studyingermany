'use client';

import { usePathname } from 'next/navigation';
import { CookieConsentBanner } from './CookieConsentBanner';
import { SiteFooter } from './SiteFooter';
import { ContactModalProvider } from './ContactModalProvider';
import { GlobalChatbot } from './GlobalChatbot';
import { isAppPage } from '@/content/apps/slugs';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // App marketing pages are standalone: no site footer, no chatbot bubble.
  const appPage = isAppPage(pathname ?? '');

  return (
    <ContactModalProvider>
      {children}
      {!appPage && <SiteFooter />}
      <CookieConsentBanner />
      {!appPage && <GlobalChatbot />}
    </ContactModalProvider>
  );
}
