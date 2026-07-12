import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildCanonicalUrl } from '@/lib/seo';
import { ALL_APPS } from '@/content/apps';
import { AppleGlyph, hexToRgba } from '@/components/apps/AppLandingPage';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our iOS Apps – Learn German, Track Health, Plan & More',
  description:
    'Explore our iOS apps: Lesen Lab (learn German with stories), Einbürgerungstest 2026, DoseBuddy pill reminder, MacroMora AI calorie tracker, BabyName for couples and more.',
  alternates: { canonical: buildCanonicalUrl('/apps') },
  openGraph: {
    title: 'Our iOS Apps',
    description: 'Apps for German learners, families and everyday life — built by Smarvia Studio.',
    url: buildCanonicalUrl('/apps'),
    type: 'website',
  },
};

export default function AppsHubPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: ALL_APPS.map((app, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: buildCanonicalUrl(`/${app.slug}`),
      name: app.storeName,
    })),
  };

  return (
    <div className="min-h-screen bg-[#07070d] antialiased" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] rounded-full blur-[140px] opacity-25 bg-[#7c3aed]" />
          <div className="absolute -top-20 right-1/4 w-[500px] h-[450px] rounded-full blur-[140px] opacity-20 bg-[#db2777]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-7 text-white/80"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <AppleGlyph className="w-3.5 h-3.5" />
            Made for iPhone & iPad
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Our iOS Apps
          </h1>
          <p className="text-lg text-white/55 max-w-2xl mx-auto">
            Apps for German learners, families and everyday life — from story-based German reading to citizenship test prep, health tracking and more.
          </p>
        </div>
      </section>

      {/* grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_APPS.map((app) => (
              <Link
                key={app.slug}
                href={`/${app.slug}`}
                className="group rounded-3xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: `linear-gradient(150deg, ${hexToRgba(app.accent, 0.1)}, rgba(255,255,255,0.03))`,
                  border: `1px solid ${hexToRgba(app.accent, 0.22)}`,
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <Image src={app.icon} alt={`${app.storeName} icon`} width={56} height={56} className="rounded-[14px] shadow-xl ring-1 ring-white/10" />
                  <ArrowUpRight
                    className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: app.accent }}
                  />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {app.name}
                </h2>
                <p className="text-sm mb-4" style={{ color: hexToRgba(app.accent, 0.9) }}>{app.subtitle}</p>
                <p className="text-white/50 text-sm leading-relaxed">{app.metaDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/[0.07] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Smarvia Studio</p>
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link href="/" className="hover:text-white transition-colors">GermanPath</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
