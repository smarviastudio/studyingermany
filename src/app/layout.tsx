import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: {
    default: 'StudyGermany — Study in Germany: AI Course Search, CV & Application Tools',
    template: '%s | StudyGermany',
  },
  description: 'Search 20,000+ German university programs with AI, build your German CV, write cover & motivation letters — all free. Your complete guide to studying in Germany.',
  metadataBase: new URL('https://germanpath.com'),
  keywords: ['study in Germany', 'German university programs', 'student visa Germany', 'DAAD scholarship', 'AI CV maker', 'study abroad Germany', 'master programs Germany'],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    siteName: 'StudyGermany',
    type: 'website',
    locale: 'en_US',
    title: 'StudyGermany — Your AI-Powered Guide to Studying in Germany',
    description: 'Search 20,000+ German university programs, build your CV, write application letters — everything free.',
    url: 'https://germanpath.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StudyGermany - Your Guide to Studying in Germany',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyGermany — AI Course Search & Application Tools',
    description: 'Find German university programs, build your CV and write application letters — free AI tools for international students.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://germanpath.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Smarvia Studio',
              url: 'https://germanpath.com',
              logo: 'https://germanpath.com/logo.png',
              description: 'AI-powered platform helping international students find German university programs, build CVs, and prepare application materials.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Schoeneggstrasse 45',
                addressLocality: 'Dietikon',
                postalCode: '8953',
                addressCountry: 'CH',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'smarviastudio@gmail.com',
                contactType: 'Customer Service',
              },
              sameAs: [
                'https://germanpath.com',
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#ffffff', color: '#171717' }}>
        <Providers>
          <ClientProviders>{children}</ClientProviders>
        </Providers>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
