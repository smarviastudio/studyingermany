'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CourseFinderRedirect() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;

  useEffect(() => {
    // Redirect old /course-finder/[id] URLs to home page
    // The program modal is now shown on the home page
    router.replace('/');
  }, [router, programId]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <p>Redirecting...</p>
    </div>
  );
}
