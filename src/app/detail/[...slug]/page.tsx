import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Return 404 for all legacy /detail/... URLs (spam/junk pages)
// Combined with robots noindex ensures Google deindexes these
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DetailPage() {
  notFound();
}
