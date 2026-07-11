import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { buildCanonicalUrl } from '@/lib/seo';
import { ALL_APPS } from '@/content/apps';
import { ArrowRight, Apple } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our iOS Apps – Learn German, Track Health, Plan & More | GermanPath',
  description:
    'Explore our iOS apps: Lesen Lab (learn German with stories), Einbürgerungstest 2026, DoseBuddy pill reminder, MacroMora AI calorie tracker, BabyName for couples and more.',
  alternates: { canonical: buildCanonicalUrl('/apps') },
  openGraph: {
    title: 'Our iOS Apps | GermanPath',
    description: 'Apps for German learners, families and everyday life — built by the GermanPath team.',
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
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <SiteNav />

      <section className="bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
            <Apple className="w-4 h-4" />
            Made for iPhone & iPad
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Our iOS Apps
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Apps for German learners, families and everyday life — from story-based German reading to citizenship test prep, health tracking and more.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_APPS.map((app) => (
              <Link
                key={app.slug}
                href={`/${app.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-300 transition-all flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image src={app.icon} alt={`${app.storeName} icon`} width={56} height={56} className="rounded-xl shadow" />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:underline">{app.name}</h2>
                    <p className="text-sm text-gray-500">{app.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{app.metaDescription}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: app.accentDark }}>
                  {app.lang === 'de' ? 'Mehr erfahren' : 'Learn more'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
