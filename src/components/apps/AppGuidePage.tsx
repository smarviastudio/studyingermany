import Image from 'next/image';
import Link from 'next/link';
import { buildCanonicalUrl } from '@/lib/seo';
import type { AppContent, AppGuide } from '@/content/apps/types';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Plus } from 'lucide-react';
import { AppFooter, AppStoreBadge, AppTopBar, hexToRgba } from './AppLandingPage';

const UI = {
  en: {
    apps: 'Apps',
    guides: 'Guides',
    guide: 'Guide',
    faqHeading: 'Frequently asked questions',
    relatedGuides: 'Keep reading',
    backToApp: 'Everything about {app}',
    ctaNote: 'Free to download on iPhone & iPad',
  },
  de: {
    apps: 'Apps',
    guides: 'Ratgeber',
    guide: 'Ratgeber',
    faqHeading: 'Häufige Fragen',
    relatedGuides: 'Weiterlesen',
    backToApp: 'Alles über {app}',
    ctaNote: 'Kostenlos für iPhone & iPad',
  },
} as const;

export function AppGuidePage({ app, guide }: { app: AppContent; guide: AppGuide }) {
  const ui = UI[app.lang];
  const accent = app.accent;
  const dark = app.accentDark;
  const canonical = buildCanonicalUrl(`/${app.slug}/guides/${guide.slug}`);
  const screenshot = app.screenshots[guide.screenshotIndex ?? 0];
  const related = app.guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    image: buildCanonicalUrl(app.icon),
    author: { '@type': 'Organization', name: 'Smarvia Studio' },
    publisher: { '@type': 'Organization', name: 'Smarvia Studio', logo: { '@type': 'ImageObject', url: buildCanonicalUrl(app.icon) } },
    mainEntityOfPage: canonical,
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.howToHeading,
    description: guide.metaDescription,
    tool: [{ '@type': 'HowToTool', name: app.storeName }],
    step: guide.howToSteps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
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
      { '@type': 'ListItem', position: 1, name: ui.apps, item: buildCanonicalUrl('/apps') },
      { '@type': 'ListItem', position: 2, name: app.name, item: buildCanonicalUrl(`/${app.slug}`) },
      { '@type': 'ListItem', position: 3, name: guide.title, item: canonical },
    ],
  };

  return (
    <div className="min-h-screen bg-white antialiased" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <AppTopBar app={app} />

      {/* ============================== HEADER ============================== */}
      <header className="relative overflow-hidden bg-[#07070d] pt-36 pb-16">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-[130px] opacity-30"
            style={{ background: `radial-gradient(ellipse at center, ${accent}, transparent 65%)` }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-6">
          <nav className="flex items-center flex-wrap gap-1.5 text-sm text-white/40 mb-8" aria-label="Breadcrumb">
            <Link href="/apps" className="hover:text-white/80 transition-colors">{ui.apps}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/${app.slug}`} className="hover:text-white/80 transition-colors">{app.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">{ui.guide}</span>
          </nav>

          <h1
            className="text-3xl sm:text-4xl md:text-[3.25rem] font-bold text-white tracking-tight leading-[1.1] mb-8"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {guide.title}
          </h1>

          <div className="flex items-center gap-3.5">
            <Image src={app.icon} alt={`${app.storeName} icon`} width={44} height={44} className="rounded-xl ring-1 ring-white/15" />
            <div className="text-sm leading-tight">
              <Link href={`/${app.slug}`} className="font-semibold text-white hover:underline underline-offset-4" style={{ textDecorationColor: accent }}>
                {app.storeName}
              </Link>
              <p className="text-white/45 mt-0.5">{app.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* =============================== ARTICLE ============================== */}
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {guide.intro.map((p, i) => (
            <p key={i} className={`leading-relaxed mb-6 ${i === 0 ? 'text-xl md:text-2xl text-gray-800 font-medium tracking-tight' : 'text-lg text-gray-600'}`}>
              {p}
            </p>
          ))}

          {guide.sections.map((section, i) => (
            <section key={i} className="mt-14">
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-950 tracking-tight mb-5 flex items-start gap-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="w-1.5 self-stretch rounded-full shrink-0" style={{ background: `linear-gradient(180deg, ${accent}, ${dark})` }} />
                {section.heading}
              </h2>
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-gray-600 text-[17px] leading-[1.8] mb-5">{p}</p>
              ))}
              {section.bullets && (
                <ul className="space-y-3.5 mb-5">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3.5 text-gray-700 text-[17px] leading-relaxed">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: hexToRgba(accent, 0.14) }}
                      >
                        <Check className="w-3.5 h-3.5" style={{ color: dark }} />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.numbered && (
                <ol className="space-y-4 mb-5">
                  {section.numbered.map((b, j) => (
                    <li key={j} className="flex items-start gap-3.5 text-gray-700 text-[17px] leading-relaxed">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[13px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${dark})` }}
                      >
                        {j + 1}
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}

          {/* ============================ HOW-TO CARD =========================== */}
          <section className="relative mt-16 rounded-[2rem] overflow-hidden bg-[#07070d]">
            <div
              className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full blur-[110px] opacity-30 pointer-events-none"
              style={{ background: accent }}
              aria-hidden
            />
            <div className="relative p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <Image src={app.icon} alt="" width={40} height={40} className="rounded-xl ring-1 ring-white/15" />
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {guide.howToHeading}
                </h2>
              </div>

              <div className="grid md:grid-cols-[1fr_auto] gap-10 items-start">
                <ol className="space-y-6">
                  {guide.howToSteps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-[#07070d]"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.7)})` }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-white mb-1.5 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {step.title}
                        </h3>
                        <p className="text-white/55 text-[15px] leading-relaxed">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                {screenshot && (
                  <div className="hidden md:block">
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={220}
                      height={476}
                      className="rounded-[1.4rem] shadow-2xl ring-1 ring-white/10"
                    />
                  </div>
                )}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-block transition-transform hover:scale-105">
                  <AppStoreBadge lang={app.lang} height={50} />
                </a>
                <p className="text-white/35 text-sm">{ui.ctaNote}</p>
              </div>
            </div>
          </section>

          {/* =============================== FAQ =============================== */}
          {guide.faqs && guide.faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-950 tracking-tight mb-7" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {ui.faqHeading}
              </h2>
              <div className="space-y-3">
                {guide.faqs.map((faq, i) => (
                  <details key={i} className="group bg-gray-50 rounded-2xl border border-gray-200/70 overflow-hidden open:shadow-md transition-shadow">
                    <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none">
                      <span className="font-semibold text-gray-950 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {faq.question}
                      </span>
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-45"
                        style={{ background: hexToRgba(accent, 0.13) }}
                      >
                        <Plus className="w-4 h-4" style={{ color: dark }} />
                      </span>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ============================ RELATED ============================== */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-gray-950 tracking-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {ui.relatedGuides}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/${app.slug}/guides/${g.slug}`}
                    className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(150deg, ${hexToRgba(accent, 0.06)}, ${hexToRgba(dark, 0.03)})`,
                      border: `1px solid ${hexToRgba(accent, 0.15)}`,
                    }}
                  >
                    <h3 className="font-bold text-gray-950 text-[15px] tracking-tight leading-snug mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {g.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: dark }} />
                  </Link>
                ))}
              </div>
              <Link
                href={`/${app.slug}`}
                className="inline-flex items-center gap-2 mt-8 font-semibold hover:gap-3 transition-all"
                style={{ color: dark }}
              >
                {ui.backToApp.replace('{app}', app.name)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </section>
          )}
        </div>
      </article>

      {/* ============================== FINAL CTA ============================= */}
      <section className="relative bg-[#07070d] py-20 overflow-hidden">
        <div
          className="absolute bottom-[-180px] left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[120px] opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${accent}, transparent 70%)` }}
          aria-hidden
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {app.ctaHeading}
          </h2>
          <p className="text-white/55 mb-8">{app.ctaText}</p>
          <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-block transition-transform hover:scale-105">
            <AppStoreBadge lang={app.lang} height={54} />
          </a>
        </div>
      </section>

      <AppFooter app={app} />
    </div>
  );
}
