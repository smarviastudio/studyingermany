import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export const runtime = 'edge';
export const alt = 'German Path - Study in Germany for International Students';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 45%, #3b0000 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: '#dd0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            GP
          </div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Study in Germany with AI
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.4, color: 'rgba(255,255,255,0.82)' }}>{SITE_TAGLINE}</div>
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 22, color: 'rgba(255,255,255,0.72)' }}>
          <span>20,000+ Programs</span>
          <span>•</span>
          <span>AI CV Maker</span>
          <span>•</span>
          <span>Free Guides</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
