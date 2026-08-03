'use client';

import { AlertCircle } from 'lucide-react';

/**
 * Shown above generated documents. German universities screen applications with
 * AI-detection tooling and embassies have rejected visa letters that read as
 * machine-written, so telling people to personalise the draft is a real
 * protection for them, not a disclaimer.
 */
export function DraftNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        padding: compact ? '10px 12px' : '13px 15px',
        background: 'rgba(245,158,11,0.07)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 12,
        margin: compact ? '0 0 12px' : '0 0 16px',
      }}
    >
      <AlertCircle size={16} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#78350f', margin: 0 }}>
        <strong>This is a first draft — edit it before you submit.</strong> Add your own specifics
        (modules, projects, a professor&apos;s work) and check every fact against your CV. Universities
        and embassies screen for unedited AI text, and generic letters get discarded.
      </p>
    </div>
  );
}
