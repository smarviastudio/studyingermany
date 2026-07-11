import { notFound } from 'next/navigation';
import { AppGuidePage } from '@/components/apps/AppGuidePage';
import { buildGuideMetadata } from '@/lib/appPages';
import { kennzeichen as app } from '@/content/apps';

export function generateStaticParams() {
  return app.guides.map((guide) => ({ guideSlug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ guideSlug: string }> }) {
  const { guideSlug } = await params;
  const guide = app.guides.find((g) => g.slug === guideSlug);
  if (!guide) return {};
  return buildGuideMetadata(app, guide);
}

export default async function Page({ params }: { params: Promise<{ guideSlug: string }> }) {
  const { guideSlug } = await params;
  const guide = app.guides.find((g) => g.slug === guideSlug);
  if (!guide) notFound();
  return <AppGuidePage app={app} guide={guide} />;
}
