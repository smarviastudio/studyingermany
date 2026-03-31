'use client';

import { ProgramSummary } from '@/lib/types';
import { MapPin, Clock, Euro } from 'lucide-react';
import Image from 'next/image';

interface ProgramCardProps {
  program: ProgramSummary;
  onClick: () => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const formatTuition = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'Contact';
    if (amount === 0) return 'Free';
    return `€${amount.toLocaleString()}`;
  };

  const matchScore = program.match_score ? Math.round(program.match_score * 100) : null;
  const degreeLevel = program.degree_level?.toLowerCase() || '';
  const isMaster = degreeLevel.includes('master');
  const isBachelor = degreeLevel.includes('bachelor');
  const degreeLabel = isMaster ? 'Master' : isBachelor ? 'Bachelor' : program.degree_level;
  const languageLabel = program.languages_array?.[0] || 'English';

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#dd0000';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e5e5';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 140, width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', flexShrink: 0 }}>
        {program.image_url && program.image_url.trim() !== '' && (
          <Image
            src={program.image_url}
            alt={program.program_name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized={true}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        
        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {degreeLabel && (
            <span style={{
              background: 'rgba(139, 92, 246, 0.95)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}>
              {degreeLabel}
            </span>
          )}
          {languageLabel && (
            <span style={{
              background: 'rgba(59, 130, 246, 0.95)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}>
              {languageLabel}
            </span>
          )}
        </div>

        {/* Match Score */}
        {matchScore && (
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
          }}>
            {matchScore}%
          </div>
        )}

        {/* City & Free Badge */}
        <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {program.city && (
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '4px 10px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <MapPin style={{ width: 12, height: 12, color: '#666' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{program.city}</span>
            </div>
          )}
          {program.is_free && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.95)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
            }}>
              FREE
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#111',
          margin: '0 0 6px',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: 40,
        }}>
          {program.program_name}
        </h3>

        {/* University */}
        <div style={{ fontSize: 13, color: '#666', marginBottom: 10, fontWeight: 500 }}>
          {program.university}
        </div>

        {/* Info Row */}
        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#666', marginBottom: 10 }}>
          {program.beginning_normalized && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock style={{ width: 13, height: 13 }} />
              <span style={{ textTransform: 'capitalize' }}>{program.beginning_normalized}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Euro style={{ width: 13, height: 13 }} />
            <span style={{ fontWeight: 600 }}>{formatTuition(program.tuition_fee_number)}</span>
          </div>
        </div>

        {/* Match Reason */}
        {program.match_reason && program.match_reason !== 'General match' && (
          <div style={{
            background: '#f8f9fa',
            padding: '8px 10px',
            borderRadius: 6,
            fontSize: 12,
            color: '#495057',
            lineHeight: 1.4,
            marginTop: 'auto',
            marginBottom: 10,
          }}>
            {program.match_reason.length > 60 ? program.match_reason.substring(0, 60) + '...' : program.match_reason}
          </div>
        )}

        {/* View Button */}
        <button
          style={{
            width: '100%',
            padding: '10px',
            background: '#dd0000',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 'auto',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c20000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#dd0000';
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
