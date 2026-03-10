'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Calculator, Info, GraduationCap, ChevronDown, RotateCcw
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

type GradingPreset = {
  id: string;
  country: string;
  flag: string;
  name: string;
  max: string;
  min: string;
  placeholder: string;
};

const PRESETS: GradingPreset[] = [
  { id: 'pakistan-4', country: 'Pakistan', flag: '��', name: 'CGPA (4.0)', max: '4', min: '2', placeholder: 'e.g. 3.2' },
  { id: 'india-10', country: 'India', flag: '🇮🇳', name: 'CGPA (10.0)', max: '10', min: '4', placeholder: 'e.g. 8.5' },
  { id: 'india-pct', country: 'India', flag: '��', name: 'Percentage (100)', max: '100', min: '40', placeholder: 'e.g. 78' },
  { id: 'us-4', country: 'USA', flag: '��', name: 'GPA (4.0)', max: '4', min: '1', placeholder: 'e.g. 3.5' },
  { id: 'uk-100', country: 'UK', flag: '��', name: 'Percentage (100)', max: '100', min: '40', placeholder: 'e.g. 65' },
  { id: 'bangladesh-4', country: 'Bangladesh', flag: '🇧🇩', name: 'CGPA (4.0)', max: '4', min: '2', placeholder: 'e.g. 3.4' },
  { id: 'nigeria-5', country: 'Nigeria', flag: '🇳🇬', name: 'CGPA (5.0)', max: '5', min: '1', placeholder: 'e.g. 4.2' },
  { id: 'nigeria-7', country: 'Nigeria', flag: '🇳🇬', name: 'CGPA (7.0)', max: '7', min: '1', placeholder: 'e.g. 5.5' },
  { id: 'china-4', country: 'China', flag: '🇨🇳', name: 'GPA (4.0)', max: '4', min: '1', placeholder: 'e.g. 3.3' },
  { id: 'china-5', country: 'China', flag: '🇨🇳', name: 'GPA (5.0)', max: '5', min: '2', placeholder: 'e.g. 4.0' },
  { id: 'iran-20', country: 'Iran', flag: '🇮🇷', name: 'GPA (20.0)', max: '20', min: '10', placeholder: 'e.g. 16.5' },
  { id: 'turkey-4', country: 'Turkey', flag: '🇹🇷', name: 'GPA (4.0)', max: '4', min: '2', placeholder: 'e.g. 3.1' },
  { id: 'brazil-10', country: 'Brazil', flag: '🇧🇷', name: 'GPA (10.0)', max: '10', min: '5', placeholder: 'e.g. 7.8' },
  { id: 'egypt-4', country: 'Egypt', flag: '🇪🇬', name: 'GPA (4.0)', max: '4', min: '2', placeholder: 'e.g. 3.0' },
  { id: 'ethiopia-4', country: 'Ethiopia', flag: '🇪🇹', name: 'CGPA (4.0)', max: '4', min: '2', placeholder: 'e.g. 3.5' },
  { id: 'ghana-4', country: 'Ghana', flag: '🇬🇭', name: 'CGPA (4.0)', max: '4', min: '1', placeholder: 'e.g. 3.2' },
  { id: 'kenya-100', country: 'Kenya', flag: '🇰🇪', name: 'Percentage (100)', max: '100', min: '40', placeholder: 'e.g. 68' },
  { id: 'custom', country: 'Other', flag: '🌍', name: 'Custom scale', max: '', min: '', placeholder: 'Your grade' },
];

const GRADE_SCALE = [
  { range: '1.0 – 1.5', label: 'Sehr gut', en: 'Very Good', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: '#10b981' },
  { range: '1.6 – 2.5', label: 'Gut', en: 'Good', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: '#3b82f6' },
  { range: '2.6 – 3.5', label: 'Befriedigend', en: 'Satisfactory', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: '#f59e0b' },
  { range: '3.6 – 4.0', label: 'Ausreichend', en: 'Sufficient', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: '#f97316' },
  { range: '4.1 – 5.0', label: 'Nicht ausreichend', en: 'Fail', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: '#ef4444' },
];

function getGradeInfo(gpa: number) {
  if (gpa <= 1.5) return GRADE_SCALE[0];
  if (gpa <= 2.5) return GRADE_SCALE[1];
  if (gpa <= 3.5) return GRADE_SCALE[2];
  if (gpa <= 4.0) return GRADE_SCALE[3];
  return GRADE_SCALE[4];
}

export default function GPAConverterPage() {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [yourGrade, setYourGrade] = useState('');
  const [maxGrade, setMaxGrade] = useState('');
  const [minGrade, setMinGrade] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ gpa: number; formula: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const preset = PRESETS.find(p => p.id === selectedPreset);

  const selectPreset = (id: string) => {
    setSelectedPreset(id);
    setShowDropdown(false);
    setResult(null);
    setError('');
    const p = PRESETS.find(x => x.id === id);
    if (p && id !== 'custom') {
      setMaxGrade(p.max);
      setMinGrade(p.min);
    } else {
      setMaxGrade('');
      setMinGrade('');
    }
    setYourGrade('');
  };

  const convert = () => {
    setError('');
    const g = parseFloat(yourGrade);
    const mx = parseFloat(maxGrade);
    const mn = parseFloat(minGrade);

    if (isNaN(g) || isNaN(mx) || isNaN(mn)) {
      setError('Please fill in all fields with valid numbers.');
      return;
    }
    if (mx <= mn) {
      setError('Maximum grade must be greater than minimum passing grade.');
      return;
    }
    if (g > mx) {
      setError(`Your grade (${g}) cannot exceed the maximum (${mx}).`);
      return;
    }
    if (g < mn) {
      setError(`Your grade (${g}) is below the minimum passing grade (${mn}). The result would be a failing grade.`);
    }

    const raw = 1 + 3 * ((mx - g) / (mx - mn));
    const clamped = Math.min(5.0, Math.max(1.0, raw));
    const rounded = Math.round(clamped * 100) / 100;
    const formula = `1 + 3 × ((${mx} − ${g}) / (${mx} − ${mn})) = ${rounded.toFixed(2)}`;

    setResult({ gpa: rounded, formula });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const reset = () => {
    setSelectedPreset('');
    setYourGrade('');
    setMaxGrade('');
    setMinGrade('');
    setError('');
    setResult(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const gradeInfo = result ? getGradeInfo(result.gpa) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #10b981, #059669)', marginBottom: 16, boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }}>
            <Calculator className="w-8 h-8" style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 12px' }}>GPA Converter</h1>
          <p style={{ fontSize: 16, color: '#737373', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>Convert your grades to the German scale using the Modified Bavarian Formula</p>
        </div>

        {/* Main card */}
        <div style={{ borderRadius: 20, border: '1px solid #ebebeb', background: '#fff' }}>
          {/* Country / system selector */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #f5f5f5', position: 'relative' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#999', marginBottom: 8, display: 'block' }}>Your grading system</label>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: '#fff', border: '1px solid #e5e5e5', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
              >
                {preset ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{preset.flag}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preset.country} — {preset.name}</div>
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: 14, color: '#999' }}>Select your country & scale...</span>
                )}
                <ChevronDown className="w-4 h-4" style={{ color: '#999', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
              </button>

              {showDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, borderRadius: 12, background: '#fff', border: '1px solid #e5e5e5', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 9999, maxHeight: 256, overflowY: 'auto' }}>
                  {PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => selectPreset(p.id)}
                      style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: p.id === selectedPreset ? 'rgba(16,185,129,0.05)' : 'transparent', border: 'none', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 12 }}
                      onMouseEnter={e => p.id !== selectedPreset && (e.currentTarget.style.background = '#fafafa')}
                      onMouseLeave={e => p.id !== selectedPreset && (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{p.flag}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.country} — {p.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input fields */}
          {selectedPreset && (
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Your grade */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 6 }}>
                  <Calculator className="w-4 h-4" /> Your Grade / GPA <span style={{ color: '#dd0000' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={yourGrade}
                  onChange={e => { setYourGrade(e.target.value); setResult(null); }}
                  placeholder={preset?.placeholder || 'Enter your grade'}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#fff', border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = '#e5e5e5'}
                />
              </div>

              {/* Max & Min in 2 cols */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 6, display: 'block' }}>Max grade in your system</label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxGrade}
                    onChange={e => { setMaxGrade(e.target.value); setResult(null); }}
                    placeholder="e.g. 10"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: selectedPreset !== 'custom' ? '#f5f5f5' : '#fff', border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none', transition: 'all 0.2s', cursor: selectedPreset !== 'custom' ? 'not-allowed' : 'text' }}
                    readOnly={selectedPreset !== 'custom'}
                    onFocus={e => selectedPreset === 'custom' && (e.target.style.borderColor = '#10b981')}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 6, display: 'block' }}>Min passing grade</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minGrade}
                    onChange={e => { setMinGrade(e.target.value); setResult(null); }}
                    placeholder="e.g. 4"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: selectedPreset !== 'custom' ? '#f5f5f5' : '#fff', border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none', transition: 'all 0.2s', cursor: selectedPreset !== 'custom' ? 'not-allowed' : 'text' }}
                    readOnly={selectedPreset !== 'custom'}
                    onFocus={e => selectedPreset === 'custom' && (e.target.style.borderColor = '#10b981')}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
              </div>

              {error && <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                <button
                  onClick={convert}
                  disabled={!yourGrade || !maxGrade || !minGrade}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, background: (!yourGrade || !maxGrade || !minGrade) ? '#ccc' : 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: (!yourGrade || !maxGrade || !minGrade) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: (!yourGrade || !maxGrade || !minGrade) ? 'none' : '0 4px 16px rgba(16,185,129,0.2)', opacity: (!yourGrade || !maxGrade || !minGrade) ? 0.4 : 1 }}
                >
                  <Calculator className="w-5 h-5" /> Convert
                </button>
                {(yourGrade || result) && (
                  <button
                    onClick={reset}
                    style={{ padding: '12px 16px', borderRadius: 12, background: '#fff', border: '1px solid #e5e5e5', color: '#666', fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                    title="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Result — inline */}
          {result && gradeInfo && (
            <div ref={resultRef} style={{ borderTop: '1px solid #f5f5f5' }}>
              <div style={{ padding: '24px 28px' }}>
                {/* Big number + classification */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 16, background: gradeInfo.bg, border: `2px solid ${gradeInfo.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: gradeInfo.color }}>{result.gpa.toFixed(1)}</span>
                    <span style={{ fontSize: 10, color: '#999' }}>/ 5.0</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 700, color: gradeInfo.color, margin: '0 0 4px' }}>{gradeInfo.label}</p>
                    <p style={{ fontSize: 14, color: '#999', margin: '0 0 6px' }}>{gradeInfo.en}</p>
                    <p style={{ fontSize: 12, color: '#ccc', margin: 0, fontFamily: 'monospace' }}>{result.formula}</p>
                  </div>
                </div>

                {/* Grade scale reference */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {GRADE_SCALE.map(g => {
                    const isActive = gradeInfo.range === g.range;
                    return (
                      <div
                        key={g.range}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: isActive ? g.bg : '#fafafa', border: `1px solid ${isActive ? g.border : 'transparent'}`, transition: 'all 0.2s' }}
                      >
                        <span style={{ fontSize: 13, fontFamily: 'monospace', width: 80, flexShrink: 0, color: isActive ? g.color : '#999', fontWeight: 600 }}>{g.range}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#111' : '#999' }}>{g.label}</span>
                        <span style={{ fontSize: 13, marginLeft: 'auto', color: isActive ? '#666' : '#ccc' }}>{g.en}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Disclaimer */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20, padding: 12, borderRadius: 12, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <Info className="w-4 h-4" style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, margin: 0 }}>
                    This is an estimate using the <strong style={{ color: '#111' }}>Modified Bavarian Formula</strong>. Each university may use its own conversion method — always verify with your target university&apos;s admissions office.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ — compact */}
        <div style={{ marginTop: 24, borderRadius: 20, border: '1px solid #ebebeb', background: '#fff', padding: 28 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>How it works</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>Modified Bavarian Formula</p>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>German Grade = 1 + 3 × ((Max − Your Grade) / (Max − Min Passing)). Used by most German universities for international grade conversion.</p>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>Is this official?</p>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>It&apos;s the most widely accepted formula, but some universities have their own tables. Always double-check with your target uni.</p>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>My country isn&apos;t listed</p>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>Choose &quot;Other — Custom scale&quot; and enter your system&apos;s max and min passing grades manually.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
