'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, Sparkles } from 'lucide-react';

export function ProfileWarningBanner() {
  const { status } = useSession();
  const [dismissed, setDismissed] = useState(false);

  if (status !== 'authenticated' || dismissed) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
      background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14,
      marginBottom: 20,
    }}>
      <Sparkles size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#166534' }}>
          Welcome to GermanPath!
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#15803d' }}>
          Use our tools below to prepare your application materials for studying in Germany.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#22c55e', flexShrink: 0 }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
