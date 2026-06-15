import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { buildBreadcrumbSchema, type BreadcrumbItem } from '@/lib/seo';

type HubBreadcrumbsProps = {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
};

export function HubBreadcrumbs({ items, variant = 'light' }: HubBreadcrumbsProps) {
  const textColor = variant === 'dark' ? 'rgba(255,255,255,0.45)' : '#737373';
  const linkHover = variant === 'dark' ? 'rgba(255,255,255,0.8)' : '#171717';
  const currentColor = variant === 'dark' ? 'rgba(255,255,255,0.75)' : '#525252';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(items)) }}
      />
      <nav
        aria-label="Breadcrumb"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: variant === 'dark' ? '88px 24px 0' : '88px 24px 0',
        }}
      >
        <ol
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 6,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            fontSize: 13,
            color: textColor,
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.name}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {index > 0 ? <ChevronRight size={14} aria-hidden /> : null}
                {item.path && !isLast ? (
                  <Link
                    href={item.path}
                    style={{ color: textColor, textDecoration: 'none' }}
                    className="hub-breadcrumb-link"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span style={{ color: currentColor }}>{item.name}</span>
                )}
              </li>
            );
          })}
        </ol>
        <style>{`
          .hub-breadcrumb-link:hover { color: ${linkHover} !important; }
        `}</style>
      </nav>
    </>
  );
}
