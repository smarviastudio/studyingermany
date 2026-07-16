import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { HubBreadcrumbs } from '@/components/HubBreadcrumbs';
import { buildPageMetadata } from '@/lib/seo';
import { PROGRAM_HUBS, getHubPrograms } from '@/lib/programHubs';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
  title: 'Degree Programs in Germany by Subject (2026) – Browse All Fields',
  description:
    'Browse master\'s and bachelor\'s programs at German universities by subject: computer science, data science, engineering, business, medicine and more. Real program lists with tuition-free and English-taught filters.',
  path: '/programs',
  keywords: [
    'degree programs in germany',
    'masters in germany by subject',
    'english taught programs germany',
    'tuition free programs germany',
  ],
});

export default async function ProgramsIndexPage() {
  const hubsWithStats = await Promise.all(
    PROGRAM_HUBS.map(async (hub) => {
      const { stats } = await getHubPrograms(hub);
      return { hub, stats };
    })
  );
  const masters = hubsWithStats.filter(({ hub }) => hub.degree === 'master');
  const bachelors = hubsWithStats.filter(({ hub }) => hub.degree === 'bachelor');

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <HubBreadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Programs' }]} />

      <section style={{ padding: '24px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
            Degree Programs in Germany by Subject
          </h1>
          <p style={{ fontSize: 17, color: '#475569', maxWidth: 740, lineHeight: 1.7, margin: 0 }}>
            Real program lists at German universities — with tuition-free and English-taught counts for every field.
            Pick your subject, compare programs, then let AI write your application documents.
          </p>
        </div>
      </section>

      {[{ label: "Master's Programs", items: masters }, { label: "Bachelor's Programs", items: bachelors }].map(({ label, items }) => (
        <section key={label} style={{ padding: '8px 24px 40px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>{label}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {items.map(({ hub, stats }) => (
                <Link key={hub.slug} href={`/programs/${hub.slug}`} style={{ display: 'block', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, textDecoration: 'none', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <GraduationCap size={18} style={{ color: '#dc2626' }} />
                    <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', margin: 0 }}>{hub.subjectLabel}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px' }}>
                    {stats.total} programs · {stats.tuitionFree} tuition-free · {stats.englishTaught} in English
                  </p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                    View programs <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
