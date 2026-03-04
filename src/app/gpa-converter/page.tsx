'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Calculator, Info, GraduationCap, ChevronDown, RotateCcw
} from 'lucide-react';

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
  { id: 'india-10', country: 'India', flag: '🇮🇳', name: 'CGPA (10.0)', max: '10', min: '4', placeholder: 'e.g. 8.5' },
  { id: 'india-pct', country: 'India', flag: '🇮🇳', name: 'Percentage (100)', max: '100', min: '40', placeholder: 'e.g. 78' },
  { id: 'us-4', country: 'USA', flag: '🇺🇸', name: 'GPA (4.0)', max: '4', min: '1', placeholder: 'e.g. 3.5' },
  { id: 'uk-100', country: 'UK', flag: '🇬🇧', name: 'Percentage (100)', max: '100', min: '40', placeholder: 'e.g. 65' },
  { id: 'pakistan-4', country: 'Pakistan', flag: '🇵🇰', name: 'CGPA (4.0)', max: '4', min: '2', placeholder: 'e.g. 3.2' },
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
  { range: '1.0 – 1.5', label: 'Sehr gut', en: 'Very Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { range: '1.6 – 2.5', label: 'Gut', en: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { range: '2.6 – 3.5', label: 'Befriedigend', en: 'Satisfactory', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { range: '3.6 – 4.0', label: 'Ausreichend', en: 'Sufficient', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { range: '4.1 – 5.0', label: 'Nicht ausreichend', en: 'Fail', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
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
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back home
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><GraduationCap className="w-3.5 h-3.5 text-white" /></div>
            <span className="text-white font-semibold text-sm">StudyGermany</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Calculator className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GPA Converter</h1>
            <p className="text-white/35 text-xs">Convert your grades to the German scale using the Modified Bavarian Formula</p>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0f0f23]">
          {/* Country / system selector */}
          <div className="px-6 pt-5 pb-4 border-b border-white/[0.04]">
            <label className="text-white/40 text-xs font-medium mb-2 block">Your grading system</label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-all text-left"
              >
                {preset ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg flex-shrink-0">{preset.flag}</span>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">{preset.country} — {preset.name}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-white/25 text-sm">Select your country & scale...</span>
                )}
                <ChevronDown className={`w-4 h-4 text-white/20 transition-transform flex-shrink-0 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg bg-[#14142b] border border-white/[0.1] shadow-2xl shadow-black/50 z-50 max-h-64 overflow-y-auto">
                  {PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => selectPreset(p.id)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0 flex items-center gap-3 ${
                        p.id === selectedPreset ? 'bg-emerald-500/10' : ''
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{p.flag}</span>
                      <div className="min-w-0">
                        <div className="text-white text-sm truncate">{p.country} — {p.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input fields */}
          {selectedPreset && (
            <div className="px-6 py-5 space-y-4">
              {/* Your grade */}
              <div>
                <label className="flex items-center gap-1.5 text-white/45 text-xs font-medium mb-1.5">
                  <Calculator className="w-3.5 h-3.5" /> Your Grade / GPA <span className="text-red-400/70">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={yourGrade}
                  onChange={e => { setYourGrade(e.target.value); setResult(null); }}
                  placeholder={preset?.placeholder || 'Enter your grade'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/15 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Max & Min in 2 cols */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/45 text-xs font-medium mb-1.5 block">Max grade in your system</label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxGrade}
                    onChange={e => { setMaxGrade(e.target.value); setResult(null); }}
                    placeholder="e.g. 10"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/15 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    readOnly={selectedPreset !== 'custom'}
                  />
                </div>
                <div>
                  <label className="text-white/45 text-xs font-medium mb-1.5 block">Min passing grade</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minGrade}
                    onChange={e => { setMinGrade(e.target.value); setResult(null); }}
                    placeholder="e.g. 4"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/15 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    readOnly={selectedPreset !== 'custom'}
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={convert}
                  disabled={!yourGrade || !maxGrade || !minGrade}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                >
                  <Calculator className="w-4 h-4" /> Convert
                </button>
                {(yourGrade || result) && (
                  <button
                    onClick={reset}
                    className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70 text-sm transition-all"
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
            <div ref={resultRef} className="border-t border-white/[0.04]">
              <div className="px-6 py-6">
                {/* Big number + classification */}
                <div className="flex items-center gap-5 mb-5">
                  <div className={`w-20 h-20 rounded-2xl ${gradeInfo.bg} border ${gradeInfo.border} flex flex-col items-center justify-center flex-shrink-0`}>
                    <span className={`text-2xl font-bold ${gradeInfo.color}`}>{result.gpa.toFixed(1)}</span>
                    <span className="text-white/25 text-[10px]">/ 5.0</span>
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${gradeInfo.color}`}>{gradeInfo.label}</p>
                    <p className="text-white/40 text-sm">{gradeInfo.en}</p>
                    <p className="text-white/20 text-xs mt-1 font-mono">{result.formula}</p>
                  </div>
                </div>

                {/* Grade scale reference */}
                <div className="space-y-1.5">
                  {GRADE_SCALE.map(g => {
                    const isActive = gradeInfo.range === g.range;
                    return (
                      <div
                        key={g.range}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive ? `${g.bg} border ${g.border}` : 'bg-white/[0.02] border border-transparent'
                        }`}
                      >
                        <span className={`text-xs font-mono w-20 flex-shrink-0 ${isActive ? g.color : 'text-white/25'}`}>{g.range}</span>
                        <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/30'}`}>{g.label}</span>
                        <span className={`text-xs ml-auto ${isActive ? 'text-white/50' : 'text-white/15'}`}>{g.en}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Disclaimer */}
                <div className="flex gap-2.5 mt-5 p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
                  <Info className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0 mt-0.5" />
                  <p className="text-white/30 text-[11px] leading-relaxed">
                    This is an estimate using the <strong className="text-white/40">Modified Bavarian Formula</strong>. Each university may use its own conversion method — always verify with your target university&apos;s admissions office.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ — compact */}
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#0f0f23] p-5">
          <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">How it works</h3>
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-white/60 font-medium mb-0.5">Modified Bavarian Formula</p>
              <p className="text-white/30">German Grade = 1 + 3 × ((Max − Your Grade) / (Max − Min Passing)). Used by most German universities for international grade conversion.</p>
            </div>
            <div>
              <p className="text-white/60 font-medium mb-0.5">Is this official?</p>
              <p className="text-white/30">It&apos;s the most widely accepted formula, but some universities have their own tables. Always double-check with your target uni.</p>
            </div>
            <div>
              <p className="text-white/60 font-medium mb-0.5">My country isn&apos;t listed</p>
              <p className="text-white/30">Choose &quot;Other — Custom scale&quot; and enter your system&apos;s max and min passing grades manually.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
