import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: 'StudyGermany — Study in Germany: AI Course Search, CV & Application Tools',
    template: '%s | StudyGermany',
  },
  description: 'Search 20,000+ German university programs with AI, build your German CV, write cover & motivation letters — all free. Your complete guide to studying in Germany.',
  metadataBase: new URL('https://germanpath.com'),
  keywords: ['study in Germany', 'German university programs', 'student visa Germany', 'DAAD scholarship', 'AI CV maker', 'study abroad Germany', 'master programs Germany'],
  openGraph: {
    siteName: 'StudyGermany',
    type: 'website',
    locale: 'en_US',
    title: 'StudyGermany — Your AI-Powered Guide to Studying in Germany',
    description: 'Search 20,000+ German university programs, build your CV, write application letters — everything free.',
    url: 'https://germanpath.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyGermany — AI Course Search & Application Tools',
    description: 'Find German university programs, build your CV and write application letters — free AI tools for international students.',
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
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#ffffff', color: '#171717' }}>
        <Providers>{children}</Providers>
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
