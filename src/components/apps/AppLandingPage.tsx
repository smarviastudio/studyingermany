import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { buildCanonicalUrl } from '@/lib/seo';
import type { AppContent } from '@/content/apps/types';
import {
  CheckCircle2, ChevronRight, Smartphone, HelpCircle, ArrowRight, Star, BookOpen, Apple,
} from 'lucide-react';

const UI = {
  en: {
    availableOnIos: 'Available on iOS',
    download: 'Download on the App Store',
    downloadFree: 'Download Free on App Store',
    whoItsFor: "Who It's For",
    appPreview: 'App Preview',
    seeInAction: 'See {app} in Action',
    features: 'Features',
    keyFeatures: 'Key Features of {app}',
    howItWorks: 'How It Works',
    howAppWorks: 'How {app} Works',
    stepsSubtitle: 'Get started in {n} simple steps',
    guides: 'Guides & Tips',
    guidesTitle: 'Guides: Get the Most Out of {app}',
    guidesSubtitle: 'Practical, in-depth answers to the questions people ask most — and exactly how {app} helps.',
    readGuide: 'Read guide',
    faq: 'FAQ',
    faqTitle: 'Frequently Asked Questions about {app}',
    learnMore: 'Learn more',
    platformsPricing: 'Platforms & Pricing',
    platformsTitle: 'Made for iPhone & iPad',
    pricingOptions: 'Pricing Options',
    freeVersion: 'Free Version',
    free: 'Free',
    bestValue: 'BEST VALUE',
    getTheApp: 'Get the App',
  },
  de: {
    availableOnIos: 'Verfügbar für iOS',
    download: 'Im App Store laden',
    downloadFree: 'Kostenlos im App Store laden',
    whoItsFor: 'Für wen ist die App?',
    appPreview: 'App-Vorschau',
    seeInAction: '{app} in Aktion',
    features: 'Funktionen',
    keyFeatures: 'Die wichtigsten Funktionen von {app}',
    howItWorks: 'So funktioniert es',
    howAppWorks: 'So funktioniert {app}',
    stepsSubtitle: 'In {n} einfachen Schritten loslegen',
    guides: 'Ratgeber & Tipps',
    guidesTitle: 'Ratgeber: Hol mehr aus {app} heraus',
    guidesSubtitle: 'Ausführliche Antworten auf die häufigsten Fragen — und wie {app} dabei hilft.',
    readGuide: 'Ratgeber lesen',
    faq: 'FAQ',
    faqTitle: 'Häufige Fragen zu {app}',
    learnMore: 'Mehr erfahren',
    platformsPricing: 'Geräte & Preise',
    platformsTitle: 'Für iPhone & iPad gemacht',
    pricingOptions: 'Preisoptionen',
    freeVersion: 'Kostenlose Version',
    free: 'Gratis',
    bestValue: 'BESTER WERT',
    getTheApp: 'App holen',
  },
} as const;

function t(str: string, app: string, n?: number) {
  return str.replace('{app}', app).replace('{n}', String(n ?? ''));
}

export function AppLandingPage({ app }: { app: AppContent }) {
  const ui = UI[app.lang];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: app.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: app.storeName,
    operatingSystem: 'iOS',
    applicationCategory: app.category,
    description: app.metaDescription,
    image: buildCanonicalUrl(app.icon),
    url: buildCanonicalUrl(`/${app.slug}`),
    installUrl: app.appStoreUrl,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    ...(app.ratingValue && app.ratingCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: app.ratingValue,
            ratingCount: app.ratingCount,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: buildCanonicalUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Apps', item: buildCanonicalUrl('/apps') },
      { '@type': 'ListItem', position: 3, name: app.name, item: buildCanonicalUrl(`/${app.slug}`) },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteNav />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e] pt-24 pb-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: `${app.accent}33` }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={app.icon}
                  alt={`${app.storeName} app icon`}
                  width={64}
                  height={64}
                  className="rounded-2xl shadow-xl"
                />
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm">
                  <Apple className="w-4 h-4" />
                  {ui.availableOnIos}
                </div>
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {app.heroTitle.pre}{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: `linear-gradient(to right, ${app.accent}, ${app.accentDark})` }}
                >
                  {app.heroTitle.highlight}
                </span>
                {app.heroTitle.post && <> {app.heroTitle.post}</>}
              </h1>

              <p className="text-lg text-white/70 leading-relaxed mb-8">{app.heroDescription}</p>

              <ul className="space-y-3 mb-8">
                {app.heroBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: app.accent }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <a
                href={app.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a1a] rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-2xl"
              >
                <Apple className="w-6 h-6" />
                {ui.download}
              </a>

              <p className="text-white/50 text-sm mt-4">{app.downloadNote}</p>
            </div>

            {/* Screenshot fan */}
            <div className="relative hidden lg:block">
              <div className="flex gap-4 justify-center">
                {app.screenshots.slice(0, 3).map((shot, i) => (
                  <div
                    key={i}
                    className={
                      i === 0
                        ? 'relative w-48 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500'
                        : i === 1
                          ? 'relative w-48 transform translate-y-8 hover:translate-y-4 transition-transform duration-500'
                          : 'relative w-48 transform rotate-[5deg] hover:rotate-0 transition-transform duration-500'
                    }
                  >
                    <Image src={shot.src} alt={shot.alt} width={230} height={498} className="rounded-3xl shadow-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHO IT'S FOR ============ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full mb-4"
              style={{ backgroundColor: `${app.accent}1a`, color: app.accentDark }}
            >
              {ui.whoItsFor}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.whoItsFor, app.name)}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {app.audience.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-4" style={{ backgroundColor: item.color }}>
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SCREENSHOTS ============ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#7c3aed]/10 text-[#7c3aed] text-sm font-semibold rounded-full mb-4">
              {ui.appPreview}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.seeInAction, app.name)}
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
            {app.screenshots.map((screenshot, i) => (
              <div key={i} className="flex-shrink-0 snap-center">
                <Image src={screenshot.src} alt={screenshot.alt} width={230} height={498} className="rounded-3xl shadow-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#059669]/10 text-[#059669] text-sm font-semibold rounded-full mb-4">
              {ui.features}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.keyFeatures, app.name)}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {app.features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${feature.color}15` }}>
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-semibold rounded-full mb-4">
              {ui.howItWorks}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.howAppWorks, app.name)}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">{t(ui.stepsSubtitle, app.name, app.steps.length)}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {app.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors h-full">
                  <span className="text-5xl font-bold mb-4 block" style={{ color: `${app.accent}4d` }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </div>
                {i < app.steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-white/30 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GUIDES ============ */}
      {app.guides.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span
                className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full mb-4"
                style={{ backgroundColor: `${app.accent}1a`, color: app.accentDark }}
              >
                {ui.guides}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t(ui.guidesTitle, app.name)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t(ui.guidesSubtitle, app.name)}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {app.guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/${app.slug}/guides/${guide.slug}`}
                  className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${app.accent}15` }}>
                    <BookOpen className="w-5 h-5" style={{ color: app.accentDark }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:underline">{guide.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{guide.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: app.accentDark }}>
                    {ui.readGuide}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ PLATFORMS & PRICING ============ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#d97706]/10 text-[#d97706] text-sm font-semibold rounded-full mb-4">
                {ui.platformsPricing}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {ui.platformsTitle}
              </h2>
              <p className="text-lg text-gray-600 mb-8">{app.pricingFree}</p>

              <div className="flex flex-wrap gap-4 mb-8">
                {app.platforms.map((label, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>

              <a
                href={app.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#0a0a1a] text-white rounded-xl font-semibold hover:bg-[#1a1a2e] transition-colors"
              >
                <Apple className="w-5 h-5" />
                {ui.downloadFree}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {app.pricingPro && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{ui.pricingOptions}</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{ui.freeVersion}</span>
                      <span className="text-lg font-bold text-[#059669]">{ui.free}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-2" style={{ borderColor: `${app.accent}40` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-semibold text-gray-900">{app.pricingPro.name}</span>
                        <span className="ml-2 px-2 py-0.5 text-white text-xs font-bold rounded" style={{ backgroundColor: app.accentDark }}>
                          {ui.bestValue}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {app.pricingPro.bullets.map((b, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">{app.pricingPro.note}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#0284c7]/10 text-[#0284c7] text-sm font-semibold rounded-full mb-4">
              {ui.faq}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.faqTitle, app.name)}
            </h2>
          </div>

          <div className="space-y-4">
            {app.faqs.map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 transition-colors" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  {faq.learnMoreSlug && (
                    <Link
                      href={`/${app.slug}/guides/${faq.learnMoreSlug}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold hover:underline"
                      style={{ color: app.accentDark }}
                    >
                      {ui.learnMore}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-20" style={{ background: `linear-gradient(to bottom right, ${app.accentDark}, ${app.accent})` }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-[#ffce00] fill-[#ffce00]" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {app.ctaHeading}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">{app.ctaText}</p>
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-2xl"
          >
            <Apple className="w-6 h-6" />
            {ui.download}
          </a>
          <p className="text-white/60 text-sm mt-4">{app.downloadNote}</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
