import Image from 'next/image';
import Link from 'next/link';
import { buildCanonicalUrl } from '@/lib/seo';
import type { AppContent } from '@/content/apps/types';
import { ArrowRight, ArrowUpRight, Check, Plus, Star } from 'lucide-react';

/* ---------------------------------- i18n ---------------------------------- */

const UI = {
  en: {
    iosApp: 'iOS App',
    free: 'Free',
    price: 'Price',
    category: 'Category',
    platforms: 'Platforms',
    rating: 'Rating',
    onAppStore: 'on the App Store',
    features: 'Features',
    featuresTitle: 'Everything {app} can do',
    preview: 'Screenshots',
    previewTitle: 'A look inside {app}',
    howItWorks: 'How it works',
    howItWorksTitle: 'Up and running in {n} steps',
    guides: 'Guides',
    guidesTitle: 'Go deeper with {app}',
    guidesSubtitle: 'In-depth answers to what people actually search for — and how {app} solves it.',
    readGuide: 'Read the guide',
    faq: 'FAQ',
    faqTitle: 'Questions, answered',
    learnMore: 'Learn more',
    pro: 'What PRO unlocks',
    allApps: 'All Apps',
    privacy: 'Privacy',
    terms: 'Terms',
    impressum: 'Impressum',
    madeBy: 'Made by Smarvia Studio',
  },
  de: {
    iosApp: 'iOS-App',
    free: 'Gratis',
    price: 'Preis',
    category: 'Kategorie',
    platforms: 'Geräte',
    rating: 'Bewertung',
    onAppStore: 'im App Store',
    features: 'Funktionen',
    featuresTitle: 'Alles, was {app} kann',
    preview: 'Screenshots',
    previewTitle: 'Ein Blick in {app}',
    howItWorks: 'So funktioniert es',
    howItWorksTitle: 'In {n} Schritten startklar',
    guides: 'Ratgeber',
    guidesTitle: 'Mehr aus {app} herausholen',
    guidesSubtitle: 'Ausführliche Antworten auf echte Suchfragen — und wie {app} sie löst.',
    readGuide: 'Ratgeber lesen',
    faq: 'FAQ',
    faqTitle: 'Fragen & Antworten',
    learnMore: 'Mehr erfahren',
    pro: 'Das bietet PRO',
    allApps: 'Alle Apps',
    privacy: 'Datenschutz',
    terms: 'AGB',
    impressum: 'Impressum',
    madeBy: 'Von Smarvia Studio',
  },
} as const;

const t = (s: string, app: string, n?: number) => s.replace('{app}', app).replace('{n}', String(n ?? ''));

/* ------------------------------- primitives ------------------------------- */

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function AppStoreBadge({ lang, height = 52 }: { lang: 'en' | 'de'; height?: number }) {
  return (
    <Image
      src={lang === 'de' ? '/badges/appstore-de.svg' : '/badges/appstore-en.svg'}
      alt={lang === 'de' ? 'Laden im App Store' : 'Download on the App Store'}
      width={Math.round(height * 2.9916)}
      height={height}
      priority
    />
  );
}

/** Official Apple logo glyph (Simple Icons, CC0). */
export function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function AppTopBar({ app }: { app: AppContent }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <div
        className="mx-auto max-w-5xl flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5"
        style={{
          background: 'rgba(9, 9, 16, 0.6)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        <Link href={`/${app.slug}`} className="flex items-center gap-3 min-w-0">
          <Image src={app.icon} alt="" width={36} height={36} className="rounded-[10px] shadow-md" />
          <span className="text-white font-semibold tracking-tight truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {app.name}
          </span>
        </Link>
        <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 transition-transform hover:scale-105">
          <AppStoreBadge lang={app.lang} height={34} />
        </a>
      </div>
    </header>
  );
}

export function AppFooter({ app }: { app: AppContent }) {
  const ui = UI[app.lang];
  return (
    <footer className="bg-[#07070d] py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Image src={app.icon} alt="" width={40} height={40} className="rounded-xl" />
          <div>
            <p className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{app.storeName}</p>
            <p className="text-white/40 text-sm">© {new Date().getFullYear()} {ui.madeBy}</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-white/50">
          <Link href="/apps" className="hover:text-white transition-colors">{ui.allApps}</Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">{ui.privacy}</Link>
          <Link href="/terms" className="hover:text-white transition-colors">{ui.terms}</Link>
          <Link href="/impressum" className="hover:text-white transition-colors">{ui.impressum}</Link>
        </nav>
        <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
          <AppStoreBadge lang={app.lang} height={40} />
        </a>
      </div>
    </footer>
  );
}

/* --------------------------------- page ---------------------------------- */

export function AppLandingPage({ app }: { app: AppContent }) {
  const ui = UI[app.lang];
  const accent = app.accent;
  const dark = app.accentDark;

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
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: app.ratingValue, ratingCount: app.ratingCount } }
      : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Apps', item: buildCanonicalUrl('/apps') },
      { '@type': 'ListItem', position: 2, name: app.name, item: buildCanonicalUrl(`/${app.slug}`) },
    ],
  };

  const stats: { label: string; value: string }[] = [
    { label: ui.price, value: ui.free },
    { label: ui.category, value: app.category.replace('Application', '') },
    { label: ui.platforms, value: app.platforms.join(' · ') },
    ...(app.ratingValue ? [{ label: ui.rating, value: `${app.ratingValue} ★` }] : []),
  ];

  const marqueeShots = [...app.screenshots, ...app.screenshots];

  return (
    <div lang={app.lang} className="min-h-screen bg-white antialiased" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes app-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.app-marquee-track { animation: app-marquee 55s linear infinite; }
.app-marquee:hover .app-marquee-track { animation-play-state: paused; }
@keyframes app-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@media (prefers-reduced-motion: reduce) {
  .app-marquee-track { animation: none; }
  .app-hero-shot { animation: none !important; }
}`,
        }}
      />

      <AppTopBar app={app} />

      {/* ================================ HERO ================================ */}
      <section className="relative overflow-hidden bg-[#07070d] pt-36 pb-0">
        {/* mesh glow in app colors */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[140px] opacity-40"
            style={{ background: `radial-gradient(ellipse at center, ${accent}, transparent 65%)` }}
          />
          <div
            className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25"
            style={{ background: dark }}
          />
          <div
            className="absolute top-60 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25"
            style={{ background: accent }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src={app.icon}
              alt={`${app.storeName} app icon`}
              width={96}
              height={96}
              priority
              className="rounded-[22px] shadow-2xl ring-1 ring-white/15"
            />
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-7 text-white/80"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <AppleGlyph className="w-3.5 h-3.5" />
            {ui.iosApp} · {app.subtitle}
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.05] mb-7"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {app.heroTitle.pre}{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(100deg, ${accent}, color-mix(in srgb, ${accent} 45%, white))` }}
            >
              {app.heroTitle.highlight}
            </span>
            {app.heroTitle.post && <> {app.heroTitle.post}</>}
          </h1>

          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-9">{app.heroDescription}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-9">
            <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
              <AppStoreBadge lang={app.lang} height={56} />
            </a>
            {app.ratingValue && (
              <div className="flex items-center gap-2.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5" style={{ color: accent, fill: accent }} />
                  ))}
                </div>
                <span className="text-white/60 text-sm">
                  {app.ratingValue} {ui.onAppStore}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {app.heroBenefits.map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/75"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                {b}
              </span>
            ))}
          </div>

          {/* screenshot fan */}
          <div className="relative mt-16 h-[340px] sm:h-[420px] overflow-hidden" aria-hidden>
            <div className="absolute inset-x-0 top-0 flex justify-center gap-5">
              {app.screenshots.slice(0, 5).map((shot, i) => {
                const order = [2, 1, 3, 0, 4];
                const pos = order.indexOf(i);
                const rot = [-10, -5, 0, 5, 10][pos] ?? 0;
                const y = [56, 22, 0, 22, 56][pos] ?? 0;
                return (
                  <div
                    key={i}
                    className={`app-hero-shot shrink-0 w-40 sm:w-52 md:w-56 ${pos >= 3 ? 'hidden lg:block' : ''}`}
                    style={{
                      transform: `rotate(${rot}deg) translateY(${y}px)`,
                      animation: `app-float ${7 + pos}s ease-in-out infinite`,
                      animationDelay: `${pos * 0.6}s`,
                    }}
                  >
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={280}
                      height={606}
                      className="rounded-[1.6rem] shadow-2xl ring-1 ring-white/10"
                    />
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07070d] to-transparent" />
          </div>
        </div>
      </section>

      {/* ============================= STATS STRIP ============================ */}
      <section className="relative bg-[#07070d]">
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.07] rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {stats.slice(0, 4).map((s, i) => (
              <div key={i} className="px-6 py-5 text-center">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/40 mb-1">{s.label}</p>
                <p className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================== FEATURES ============================ */}
      <section className="bg-white py-24 rounded-t-[2.5rem] -mt-6 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: dark }}>{ui.features}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-950 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.featuresTitle, app.name)}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {app.features.map((feature, i) => {
              const Icon = feature.icon;
              const big = i === 0 || i === 3;
              return (
                <div
                  key={i}
                  className={`group rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${big ? 'md:col-span-2' : ''}`}
                  style={{
                    background: `linear-gradient(140deg, ${hexToRgba(feature.color, 0.07)}, ${hexToRgba(feature.color, 0.02)})`,
                    border: `1px solid ${hexToRgba(feature.color, 0.15)}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: hexToRgba(feature.color, 0.14) }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-950 mb-2.5 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================== SCREENSHOTS =========================== */}
      <section className="bg-gray-50 py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: dark }}>{ui.preview}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-950 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t(ui.previewTitle, app.name)}
          </h2>
        </div>
        <div className="app-marquee relative">
          <div className="app-marquee-track flex gap-6 w-max px-6">
            {marqueeShots.map((shot, i) => (
              <Image
                key={i}
                src={shot.src}
                alt={i < app.screenshots.length ? shot.alt : ''}
                aria-hidden={i >= app.screenshots.length}
                width={250}
                height={541}
                className="rounded-[1.6rem] shadow-xl ring-1 ring-black/5"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================= HOW IT WORKS =========================== */}
      <section className="relative bg-[#07070d] py-24 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[130px] opacity-25 pointer-events-none"
          style={{ background: accent }}
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: accent }}>{ui.howItWorks}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.howItWorksTitle, app.name, app.steps.length)}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {app.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-3xl p-7 h-full"
                style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span
                  className="inline-flex w-10 h-10 rounded-full items-center justify-center text-sm font-bold mb-5 text-[#07070d]"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})` }}
                >
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-white/55 text-[15px] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {app.pricingPro && (
            <div
              className="mt-14 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8"
              style={{
                background: `linear-gradient(120deg, ${hexToRgba(accent, 0.12)}, rgba(255,255,255,0.03))`,
                border: `1px solid ${hexToRgba(accent, 0.25)}`,
              }}
            >
              <div className="md:flex-1">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {app.pricingPro.name}
                </h3>
                <p className="text-white/50 text-sm">{app.pricingPro.note}</p>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 md:flex-[1.4]">
                {app.pricingPro.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/80 text-[15px]">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accent }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ================================ GUIDES ============================== */}
      {app.guides.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: dark }}>{ui.guides}</p>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-950 tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t(ui.guidesTitle, app.name)}
              </h2>
              <p className="text-gray-500 text-lg">{t(ui.guidesSubtitle, app.name)}</p>
            </div>

            <div className="divide-y divide-gray-100 border-y border-gray-100">
              {app.guides.map((guide, i) => (
                <Link
                  key={guide.slug}
                  href={`/${app.slug}/guides/${guide.slug}`}
                  className="group flex items-start gap-6 py-7 px-2 -mx-2 rounded-2xl transition-colors hover:bg-gray-50"
                >
                  <span
                    className="text-2xl md:text-3xl font-bold shrink-0 w-12 text-transparent bg-clip-text"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", backgroundImage: `linear-gradient(135deg, ${accent}, ${dark})` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-lg md:text-xl font-bold text-gray-950 tracking-tight mb-1.5 group-hover:underline decoration-2 underline-offset-4" style={{ fontFamily: "'Space Grotesk', sans-serif", textDecorationColor: accent }}>
                      {guide.title}
                    </span>
                    <span className="block text-gray-500 text-[15px] leading-relaxed">{guide.excerpt}</span>
                  </span>
                  <ArrowUpRight className="w-6 h-6 shrink-0 mt-1 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================= FAQ ================================ */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: dark }}>{ui.faq}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-950 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t(ui.faqTitle, app.name)}
            </h2>
          </div>

          <div className="space-y-3">
            {app.faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-shadow open:shadow-lg">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none">
                  <span className="font-semibold text-gray-950 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {faq.question}
                  </span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-45"
                    style={{ background: hexToRgba(accent, 0.12) }}
                  >
                    <Plus className="w-4 h-4" style={{ color: dark }} />
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  {faq.learnMoreSlug && (
                    <Link
                      href={`/${app.slug}/guides/${faq.learnMoreSlug}`}
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold hover:gap-2.5 transition-all"
                      style={{ color: dark }}
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

      {/* =============================== FINAL CTA ============================ */}
      <section className="relative bg-[#07070d] py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[130px] opacity-35"
            style={{ background: `radial-gradient(ellipse at center, ${accent}, transparent 70%)` }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Image
            src={app.icon}
            alt=""
            width={80}
            height={80}
            className="rounded-[18px] shadow-2xl ring-1 ring-white/15 mx-auto mb-8"
          />
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {app.ctaHeading}
          </h2>
          <p className="text-lg text-white/60 mb-9 max-w-xl mx-auto">{app.ctaText}</p>
          <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-block transition-transform hover:scale-105">
            <AppStoreBadge lang={app.lang} height={60} />
          </a>
          <p className="text-white/35 text-sm mt-5">{app.downloadNote}</p>
        </div>
      </section>

      <AppFooter app={app} />
    </div>
  );
}
