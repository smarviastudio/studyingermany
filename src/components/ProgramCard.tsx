'use client';

import { ProgramSummary } from '@/lib/types';
import { MapPin, GraduationCap, Euro, Calendar, AlertTriangle, Bookmark } from 'lucide-react';
import Image from 'next/image';

interface ProgramCardProps {
  program: ProgramSummary;
  onClick: () => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const formatTuition = (amount: number | null, currency?: string) => {
    if (amount === null || amount === undefined) return 'Contact university';
    if (amount === 0) return 'Free';
    return `€${amount.toLocaleString()}/year`;
  };

  const matchScore = program.match_score ? Math.round(program.match_score * 100) : null;

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#dd0000';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e5e5';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, width: '100%', background: '#f5f5f5', overflow: 'hidden' }}>
        {program.image_url && program.image_url.trim() !== '' ? (
          <Image
            src={program.image_url}
            alt={program.program_name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.5)' }} />
          </div>
        )}

        {/* Match Score Badge */}
        {matchScore && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
          }}>
            {matchScore}% match
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* Title */}
        <h3 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#111',
          margin: '0 0 8px',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {program.program_name}
        </h3>

        {/* University & Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14, color: '#666' }}>
          <span style={{ fontWeight: 500 }}>{program.university}</span>
          {program.city && (
            <>
              <span style={{ color: '#ddd' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin style={{ width: 14, height: 14 }} />
                <span>{program.city}</span>
              </div>
            </>
          )}
        </div>

        {/* Key Info Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 12,
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 16
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, fontWeight: 600 }}>
              Degree
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111', textTransform: 'capitalize' }}>
              {program.degree_level || 'Not specified'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, fontWeight: 600 }}>
              Tuition
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
              {formatTuition(program.tuition_fee_number, program.tuition_fee_currency)}
            </div>
          </div>
          {program.beginning_normalized && (
            <>
              <div>
                <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, fontWeight: 600 }}>
                  Start
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', textTransform: 'capitalize' }}>
                  {program.beginning_normalized}
                </div>
              </div>
            </>
          )}
          {program.subject_area && (
            <div style={{ gridColumn: program.beginning_normalized ? 'auto' : '1 / -1' }}>
              <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, fontWeight: 600 }}>
                Subject
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                {program.subject_area}
              </div>
            </div>
          )}
        </div>

        {/* Match Reason */}
        {program.match_reason && (
          <div style={{
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 13, color: '#495057', lineHeight: 1.5 }}>
              {program.match_reason}
            </div>
          </div>
        )}

        {/* Quality Warnings */}
        {program.quality_warnings && program.quality_warnings.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            background: '#fff9e6',
            border: '1px solid #ffe066',
            borderRadius: 6,
            marginBottom: 12,
          }}>
            <AlertTriangle style={{ width: 14, height: 14, color: '#f59e0b', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>
              {program.quality_warnings.length} data note{program.quality_warnings.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#dd0000',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
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
