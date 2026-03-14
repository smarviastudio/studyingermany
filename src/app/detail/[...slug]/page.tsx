import { notFound } from 'next/navigation';

// This catch-all route returns 404 for all legacy /detail/... URLs
// These were spam/junk pages indexed by Google that need to be removed
export default function DetailPage() {
  notFound();
}

// Ensure these pages are not indexed
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
