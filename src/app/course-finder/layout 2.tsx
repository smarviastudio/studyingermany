import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Course Finder',
  description: 'Find English-taught bachelor and master programs in Germany.',
  path: '/course-finder',
  noIndex: true,
});

export default function CourseFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
