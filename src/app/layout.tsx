import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: {
    default: 'German Path – Study in Germany: 20,000+ Programs, AI Tools & Free Guides',
    template: '%s | German Path',
  },
  description: 'Study in Germany with German Path. Search 20,000+ English-taught bachelor & master programs, build your CV with AI, and get step-by-step guidance for international students from Pakistan, India, and worldwide.',
  metadataBase: new URL('https://germanpath.com'),
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
    siteName: 'German Path',
    type: 'website',
    locale: 'en_US',
    title: 'German Path – Study in Germany with AI Tools & 20,000+ Programs',
    description: 'Your AI-powered guide to studying in Germany. Search English-taught bachelor & master programs, build your CV, and get free step-by-step guidance for international students.',
    url: 'https://germanpath.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'German Path - Study in Germany for International Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Path – Study in Germany with AI Tools',
    description: 'Search 20,000+ German university programs, build your CV with AI, and get free guidance for international students.',
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
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'German Path',
              legalName: 'GermanPath UG (haftungsbeschränkt)',
              url: 'https://germanpath.com',
              logo: 'https://germanpath.com/logo.png',
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
                'https://germanpath.com',
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
              name: 'German Path',
              url: 'https://germanpath.com',
              description: 'Study in Germany with AI-powered tools. Search 20,000+ programs, build your CV, and get free guidance.',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://germanpath.com/?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is studying in Germany really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Most public universities in Germany charge no tuition fees for bachelor and master programs — even for international students. You only pay a semester fee of €150-350 which includes public transport.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need to speak German to study in Germany?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Not necessarily. There are 2,000+ English-taught programs in Germany. However, learning basic German helps with daily life and job opportunities after graduation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much money do I need for a German student visa?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You need to prove €11,904 per year (€992/month) in a blocked account. This is the minimum required for a German student visa as of 2024.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I work while studying in Germany?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! International students can work 140 full days or 280 half days per year. Many students work part-time jobs to cover living expenses.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What are the requirements for admission to German universities?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Requirements vary by program, but typically include: recognized school-leaving certificate, language proficiency (English/German), and sometimes entrance exams or portfolios.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I stay in Germany after graduation?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Graduates get an 18-month job-seeker visa to find employment in Germany. With a job, you can transition to a work permit and eventually permanent residency.',
                  },
                },
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
