import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GraduationCap, Globe, Euro, MapPin, CalendarDays, Sparkles, ArrowRight, Search } from 'lucide-react';
import { HubBreadcrumbs } from '@/components/HubBreadcrumbs';
import { buildFaqSchema, buildMetaDescription, buildPageMetadata, MAX_TITLE_LENGTH } from '@/lib/seo';
import { PROGRAM_HUBS, getHubBySlug, getHubPrograms, isEnglishTaught, type ProgramHub, type HubStats } from '@/lib/programHubs';
import type { Program } from '@/lib/types';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return PROGRAM_HUBS.map((hub) => ({ slug: hub.slug }));
}

function hubTitle(hub: ProgramHub, stats: HubStats): string {
  // Subject labels vary a lot in length ("Law" vs "Environmental Science &
  // Sustainability"), so one fixed template overflows the ~60 char SERP limit on the
  // long ones. Try the richest variant first and fall back until one fits, keeping
  // "<degree> in <subject> in Germany" — the part carrying the keyword — in every case.
  const stem = `${hub.degreeLabel} in ${hub.subjectLabel} in Germany`;
  // A couple of subjects are compound ("Environmental Science & Sustainability") and
  // overflow even on their own, so the last resort keeps only the leading subject.
  const shortSubject = hub.subjectLabel.split(/\s+&\s+/)[0];
  const shortStem = `${hub.degreeLabel} in ${shortSubject} in Germany`;
  const variants = [
    `${stem} 2026 — ${stats.total} Programs`,
    `${stem} — ${stats.total} Programs`,
    `${stem} 2026`,
    stem,
    `${shortStem} 2026 — ${stats.total} Programs`,
    `${shortStem} 2026`,
    shortStem,
  ];
  return variants.find((variant) => variant.length <= MAX_TITLE_LENGTH) ?? shortStem;
}

function buildHubFaqs(hub: ProgramHub, stats: HubStats) {
  const subject = hub.subjectLabel;
  const degree = hub.degreeLabel.toLowerCase();
  return [
    {
      q: `How many ${degree} programs in ${subject} are there in Germany?`,
      a: `Our database currently lists ${stats.total} ${degree} programs in ${subject} at German universities, of which ${stats.tuitionFree} are tuition-free (you only pay a small semester fee) and ${stats.englishTaught} are taught in English.${stats.topCities.length ? ` Most programs are in ${stats.topCities.slice(0, 3).join(', ')}.` : ''}`,
    },
    {
      q: `Can I study ${subject} in Germany in English?`,
      a: `Yes — ${stats.englishTaught} of the ${stats.total} ${subject} ${degree} programs listed here are taught in English. Most require IELTS 6.0–7.0 or TOEFL 80–100; no German is needed for admission to English-taught programs, though basic German helps with daily life and part-time jobs.`,
    },
    {
      q: `Is studying ${subject} in Germany free?`,
      a: `${stats.tuitionFree} of the ${stats.total} programs listed are tuition-free: public universities in most German states charge no tuition, only a semester contribution of roughly €150–€400 which usually includes a public transport ticket. Private universities and some specialized programs charge tuition.`,
    },
    {
      q: `How do I apply for a ${subject} ${degree} in Germany?`,
      a: `Typical steps: (1) convert your grades to the German scale to check eligibility, (2) shortlist programs and check requirements on each university page, (3) prepare your documents — CV in German format and a program-specific motivation letter carry real weight, (4) apply via uni-assist or the university portal before the deadline (often 15 July for winter intake), and (5) apply for your student visa once admitted. German Path's free and AI tools cover every step.`,
    },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = getHubBySlug(slug);
  if (!hub) return {};
  const { stats } = await getHubPrograms(hub);
  return buildPageMetadata({
    title: hubTitle(hub, stats),
    // The old template ran past 200 characters on every hub. buildMetaDescription is
    // the backstop for the longest subject labels.
    description: buildMetaDescription(
      `Compare ${stats.total} ${hub.degreeLabel.toLowerCase()} programs in ${hub.subjectLabel} at German universities: ${stats.tuitionFree} tuition-free, ${stats.englishTaught} in English. Updated for 2026/27.`
    ),
    path: `/programs/${hub.slug}`,
    keywords: [
      `${hub.degreeLabel.toLowerCase()} in ${hub.subjectLabel.toLowerCase()} in germany`,
      `${hub.subjectLabel.toLowerCase()} in germany`,
      `study ${hub.subjectLabel.toLowerCase()} in germany in english`,
      `tuition free ${hub.subjectLabel.toLowerCase()} germany`,
    ],
  });
}

const MAX_LISTED = 100;
const MAX_ITEMLIST = 50;

export default async function ProgramHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getHubBySlug(slug);
  if (!hub) notFound();

  const { programs, stats } = await getHubPrograms(hub);
  const faqs = buildHubFaqs(hub, stats);
  const listed = programs.slice(0, MAX_LISTED);
  const related = PROGRAM_HUBS.filter((h) => h.slug !== hub.slug && h.degree === hub.degree).slice(0, 8);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: hubTitle(hub, stats),
    numberOfItems: stats.total,
    itemListElement: listed.slice(0, MAX_ITEMLIST).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.program_name} — ${p.university}`,
    })),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqs)) }} />

      <HubBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Programs', path: '/programs' },
          { name: `${hub.degreeLabel} in ${hub.subjectLabel}` },
        ]}
      />

      {/* Hero */}
      <section style={{ padding: '24px 24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.15 }}>
            {hub.degreeLabel} in {hub.subjectLabel} in Germany
          </h1>
          <p style={{ fontSize: 17, color: '#475569', maxWidth: 760, lineHeight: 1.7, margin: '0 0 24px' }}>
            <strong>{stats.total} {hub.degreeLabel.toLowerCase()} programs</strong> at German universities
            {stats.tuitionFree > 0 && <> — <strong>{stats.tuitionFree} tuition-free</strong></>}
            {stats.englishTaught > 0 && <>, <strong>{stats.englishTaught} taught in English</strong></>}.
            {' '}Compare universities, cities and intakes below, then generate your application documents with AI.
          </p>

          {/* Stats chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            <span style={chipStyle('#eff6ff', '#1d4ed8')}><GraduationCap size={15} /> {stats.total} programs</span>
            {stats.tuitionFree > 0 && <span style={chipStyle('#f0fdf4', '#15803d')}><Euro size={15} /> {stats.tuitionFree} tuition-free</span>}
            {stats.englishTaught > 0 && <span style={chipStyle('#fefce8', '#a16207')}><Globe size={15} /> {stats.englishTaught} in English</span>}
            {stats.winterIntake > 0 && <span style={chipStyle('#faf5ff', '#7e22ce')}><CalendarDays size={15} /> {stats.winterIntake} winter intake</span>}
            {stats.topCities.length > 0 && <span style={chipStyle('#f1f5f9', '#334155')}><MapPin size={15} /> {stats.topCities.slice(0, 3).join(' · ')}</span>}
          </div>

          {/* Primary CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href={`/?q=${encodeURIComponent(`${hub.subjectLabel} ${hub.degree} in English`)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dc2626', color: '#fff', padding: '12px 22px', borderRadius: 10, fontSize: 14.5, fontWeight: 700, textDecoration: 'none' }}>
              <Search size={16} /> Search these with AI
            </Link>
            <Link href="/gpa-converter" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0f172a', border: '2px solid #e2e8f0', padding: '12px 22px', borderRadius: 10, fontSize: 14.5, fontWeight: 700, textDecoration: 'none' }}>
              Check your GPA eligibility <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Program list */}
      <section style={{ padding: '8px 24px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', padding: '32px 0 16px', margin: 0 }}>
            All {hub.subjectLabel} {hub.degreeLabel} Programs ({stats.total})
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {listed.map((p, idx) => (
              <ProgramRow key={`${p.id}-${idx}`} program={p} />
            ))}
          </div>

          {stats.total > MAX_LISTED && (
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 16 }}>
              Showing {MAX_LISTED} of {stats.total} programs.{' '}
              <Link href={`/?q=${encodeURIComponent(hub.subjectLabel + ' ' + hub.degree)}`} style={{ color: '#dc2626', fontWeight: 600 }}>
                Search all {stats.total} with AI →
              </Link>
            </p>
          )}

          {/* Conversion block */}
          <div style={{ marginTop: 32, borderRadius: 16, background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: 28 }}>
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#fbbf24', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Sparkles size={15} /> Next step
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
              Found a program you like? Your motivation letter decides.
            </h2>
            <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 18px', maxWidth: 640, lineHeight: 1.6 }}>
              German admissions committees read thousands of applications. A program-specific motivation letter and a German-format CV are what set you apart — generate both with AI, preview free, no signup.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/motivation-letter/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dc2626', color: '#fff', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Write my motivation letter <ArrowRight size={15} />
              </Link>
              <Link href="/cv-maker/landing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Build my German CV
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
            {hub.subjectLabel} in Germany — FAQ
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {faqs.map((faq) => (
              <details key={faq.q} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', background: '#fafbfc' }}>
                <summary style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>{faq.q}</summary>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: '10px 0 0' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related hubs */}
      {related.length > 0 && (
        <section style={{ padding: '0 24px 64px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
              Explore other {hub.degreeLabel.toLowerCase()} programs
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {related.map((h) => (
                <Link key={h.slug} href={`/programs/${h.slug}`} style={{ fontSize: 13.5, fontWeight: 600, color: '#334155', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: 999, textDecoration: 'none' }}>
                  {h.subjectLabel}
                </Link>
              ))}
              <Link href="/programs" style={{ fontSize: 13.5, fontWeight: 700, color: '#dc2626', padding: '8px 14px', borderRadius: 999, textDecoration: 'none' }}>
                All subjects →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProgramRow({ program }: { program: Program }) {
  const english = isEnglishTaught(program);
  const duration = program.duration_months && program.duration_months >= 6 && program.duration_months <= 72
    ? `${program.duration_months} months`
    : null;
  const winter = program.intake_terms.some((t) => t.toLowerCase().includes('winter'));
  const summer = program.intake_terms.some((t) => t.toLowerCase().includes('summer'));
  const intake = winter && summer ? 'Winter + Summer' : winter ? 'Winter intake' : summer ? 'Summer intake' : null;
  const city = (program.city || '').split(',')[0].trim();

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', margin: 0 }}>{program.program_name}</h3>
      </div>
      <p style={{ fontSize: 13.5, color: '#475569', margin: '0 0 10px' }}>
        {program.university}
        {city ? ` · ${city}` : ''}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {program.is_free && <span style={badgeStyle('#f0fdf4', '#15803d')}>Tuition-free</span>}
        {english && <span style={badgeStyle('#eff6ff', '#1d4ed8')}>English</span>}
        {duration && <span style={badgeStyle('#f8fafc', '#475569')}>{duration}</span>}
        {intake && <span style={badgeStyle('#faf5ff', '#7e22ce')}>{intake}</span>}
        {program.detail_url && (
          <a href={program.detail_url} target="_blank" rel="nofollow noopener" style={{ fontSize: 12.5, fontWeight: 600, color: '#dc2626', textDecoration: 'none', marginLeft: 'auto' }}>
            Official page ↗
          </a>
        )}
      </div>
    </div>
  );
}

function chipStyle(bg: string, color: string): React.CSSProperties {
  return { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color, background: bg, padding: '8px 14px', borderRadius: 999 };
}

function badgeStyle(bg: string, color: string): React.CSSProperties {
  return { fontSize: 12, fontWeight: 700, color, background: bg, padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(0,0,0,0.05)' };
}
