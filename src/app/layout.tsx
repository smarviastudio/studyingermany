import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { ClientProviders } from "@/components/ClientProviders";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: 'German Path – Study in Germany: 20,000+ Programs, AI Tools & Free Guides',
    template: '%s | German Path',
  },
  description: 'Study in Germany with German Path. Search 20,000+ English-taught bachelor & master programs, build your CV with AI, and get step-by-step guidance for international students from Pakistan, India, and worldwide.',
  metadataBase: new URL(SITE_URL),
  keywords: [
    'study in Germany',
    'study in Germany for international students',
    'English-taught programs Germany',
    'master programs Germany',
    'bachelor programs Germany',
    'German university programs',
    'student visa Germany',
    'DAAD scholarship',
    'AI CV maker Germany',
    'study abroad Germany',
    'tuition-free universities Germany',
    'study in Germany from Pakistan',
    'study in Germany from India',
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    title: 'German Path – Study in Germany with AI Tools & 20,000+ Programs',
    description: 'Your AI-powered guide to studying in Germany. Search English-taught bachelor & master programs, build your CV, and get free step-by-step guidance for international students.',
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Path – Study in Germany with AI Tools',
    description: 'Search 20,000+ German university programs, build your CV with AI, and get free guidance for international students.',
    images: [DEFAULT_OG_IMAGE.url],
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
    canonical: SITE_URL,
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
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE_NAME,
              legalName: 'GermanPath UG (haftungsbeschränkt)',
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              description: 'German Path is an AI-powered platform helping international students study in Germany. Search 20,000+ English-taught bachelor and master programs, build your CV, and get step-by-step guidance.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Berlin',
                addressCountry: 'DE',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'smarviastudio@gmail.com',
                contactType: 'Customer Service',
              },
              sameAs: [
                SITE_URL,
                'https://www.facebook.com/studyingermay1',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              description: 'Study in Germany with AI-powered tools. Search 20,000+ programs, build your CV, and get free guidance.',
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
