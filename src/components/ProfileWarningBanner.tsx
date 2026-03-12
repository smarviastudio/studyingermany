'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AlertCircle, X, ArrowRight } from 'lucide-react';

type Props = {
  /** Fields required for this tool. Defaults to ['fullName','phone','nationality'] */
  requiredFields?: string[];
};

export function ProfileWarningBanner({ requiredFields = ['fullName', 'phone', 'nationality'] }: Props) {
  const { status } = useSession();
  const [missing, setMissing] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const { profile } = await res.json();
        if (!profile) { setMissing(requiredFields); return; }
        const m = requiredFields.filter(f => !profile[f] || (Array.isArray(profile[f]) && profile[f].length === 0));
        setMissing(m);
      } catch { /* silent */ }
    };
    fetchProfile();
  }, [status]);

  if (status !== 'authenticated' || missing.length === 0 || dismissed) return null;

  const LABELS: Record<string, string> = {
    fullName: 'full name',
    phone: 'phone number',
    nationality: 'nationality',
    backgroundSummary: 'personal summary',
    skills: 'skills',
    academicBackground: 'academic background',
    careerGoals: 'career goals',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
      background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14,
      marginBottom: 20,
    }}>
      <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#92400e' }}>
          Complete your profile for a better experience
        </p>
        <p style={{ margin: '3px 0 8px', fontSize: 12, color: '#a16207' }}>
          Missing: {missing.map(f => LABELS[f] || f).join(', ')}. AI tools will auto-fill your info when your profile is complete.
        </p>
        <Link
          href="/profile"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 700, color: '#dd0000', textDecoration: 'none',
          }}
        >
          Complete profile <ArrowRight size={12} />
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#bbb', flexShrink: 0 }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
