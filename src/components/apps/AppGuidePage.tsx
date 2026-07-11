import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { buildCanonicalUrl } from '@/lib/seo';
import type { AppContent, AppGuide } from '@/content/apps/types';
import { Apple, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

const UI = {
  en: {
    home: 'Home',
    apps: 'Apps',
    guides: 'Guides',
    download: 'Download on the App Store',
    downloadFree: 'Download Free',
    faqHeading: 'Frequently asked questions',
    relatedGuides: 'Related guides',
    backToApp: 'Everything about {app}',
    ctaNote: 'Free to download on iPhone & iPad',
  },
  de: {
    home: 'Start',
    apps: 'Apps',
    guides: 'Ratgeber',
    download: 'Im App Store laden',
    downloadFree: 'Kostenlos laden',
    faqHeading: 'Häufige Fragen',
    relatedGuides: 'Weitere Ratgeber',
    backToApp: 'Alles über {app}',
    ctaNote: 'Kostenlos für iPhone & iPad',
  },
} as const;

export function AppGuidePage({ app, guide }: { app: AppContent; guide: AppGuide }) {
  const ui = UI[app.lang];
  const canonical = buildCanonicalUrl(`/${app.slug}/guides/${guide.slug}`);
  const screenshot = app.screenshots[guide.screenshotIndex ?? 0];
  const related = app.guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    image: buildCanonicalUrl(app.icon),
    author: { '@type': 'Organization', name: 'GermanPath' },
    publisher: { '@type': 'Organization', name: 'GermanPath', logo: { '@type': 'ImageObject', url: buildCanonicalUrl('/logo.png') } },
    mainEntityOfPage: canonical,
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.howToHeading,
    description: guide.metaDescription,
    tool: [{ '@type': 'HowToTool', name: app.storeName }],
    step: guide.howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  };

  const faqSchema = guide.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ui.home, item: buildCanonicalUrl('/') },
      { '@type': 'ListItem', position: 2, name: app.name, item: buildCanonicalUrl(`/${app.slug}`) },
      { '@type': 'ListItem', position: 3, name: guide.title, item: canonical },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteNav />

      {/* Header */}
      <header className="bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e] pt-24 pb-14">
        <div className="max-w-3xl mx-auto px-6">
          <nav className="flex items-center flex-wrap gap-1 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/80">{ui.home}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/apps" className="hover:text-white/80">{ui.apps}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/${app.slug}`} className="hover:text-white/80">{app.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">{ui.guides}</span>
          </nav>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {guide.title}
          </h1>

          <div className="flex items-center gap-3">
            <Image src={app.icon} alt={`${app.storeName} icon`} width={40} height={40} className="rounded-xl" />
            <div className="text-white/70 text-sm">
              <Link href={`/${app.slug}`} className="font-semibold text-white hover:underline">{app.storeName}</Link>
              <span className="mx-2">·</span>
              {app.subtitle}
            </div>
          </div>
        </div>
      </header>

      {/* Article body */}
      <article className="py-14">
        <div className="max-w-3xl mx-auto px-6">
          {guide.intro.map((p, i) => (
            <p key={i} className="text-lg text-gray-700 leading-relaxed mb-5">{p}</p>
          ))}

          {guide.sections.map((section, i) => (
            <section key={i} className="mt-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {section.heading}
              </h2>
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-gray-700 leading-relaxed mb-4">{p}</p>
              ))}
              {section.bullets && (
                <ul className="space-y-2.5 mb-4">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: app.accentDark }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.numbered && (
                <ol className="space-y-2.5 mb-4 list-decimal pl-5 marker:font-bold" style={{ color: '#374151' }}>
                  {section.numbered.map((b, j) => (
                    <li key={j} className="text-gray-700 pl-1">{b}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}

          {/* How-to with the app */}
          <section className="mt-12 rounded-3xl overflow-hidden border border-gray-200 bg-gray-50">
            <div className="p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {guide.howToHeading}
              </h2>
              <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                <ol className="space-y-5">
                  {guide.howToSteps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: app.accentDark }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                {screenshot && (
                  <div className="hidden md:block">
                    <Image src={screenshot.src} alt={screenshot.alt} width={200} height={433} className="rounded-2xl shadow-xl" />
                  </div>
                )}
              </div>
              <a
                href={app.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 px-6 py-3.5 bg-[#0a0a1a] text-white rounded-xl font-semibold hover:bg-[#1a1a2e] transition-colors"
              >
                <Apple className="w-5 h-5" />
                {ui.download}
              </a>
              <p className="text-gray-500 text-xs mt-3">{ui.ctaNote}</p>
            </div>
          </section>

          {/* Guide FAQ */}
          {guide.faqs && guide.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {ui.faqHeading}
              </h2>
              <div className="space-y-4">
                {guide.faqs.map((faq, i) => (
                  <details key={i} className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </summary>
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related guides */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {ui.relatedGuides}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/${app.slug}/guides/${g.slug}`}
                    className="group bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:underline">{g.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: app.accentDark }}>
                      {ui.guides}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/${app.slug}`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold hover:underline"
                style={{ color: app.accentDark }}
              >
                {ui.backToApp.replace('{app}', app.name)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </section>
          )}
        </div>
      </article>

      {/* Final CTA */}
      <section className="py-16" style={{ background: `linear-gradient(to bottom right, ${app.accentDark}, ${app.accent})` }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {app.ctaHeading}
          </h2>
          <p className="text-lg text-white/80 mb-6">{app.ctaText}</p>
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3.5 bg-white text-gray-900 rounded-2xl font-bold transition-all hover:scale-105 shadow-2xl"
          >
            <Apple className="w-5 h-5" />
            {ui.downloadFree}
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
