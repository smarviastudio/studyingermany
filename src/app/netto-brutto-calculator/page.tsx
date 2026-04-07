'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Euro, TrendingDown, Building2, Users, Heart, Shield, Coins, Sparkles } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import {
  calculateGermanPayroll2026,
  type HealthInsuranceType,
  type TaxClass,
} from '@/lib/nettoBrutto2026';

const BUNDESLAENDER = [
  { value: 'BY', label: 'Bavaria' },
  { value: 'BW', label: 'Baden-Württemberg' },
  { value: 'BE', label: 'Berlin' },
  { value: 'BB', label: 'Brandenburg' },
  { value: 'HB', label: 'Bremen' },
  { value: 'HH', label: 'Hamburg' },
  { value: 'HE', label: 'Hesse' },
  { value: 'MV', label: 'Mecklenburg-Vorpommern' },
  { value: 'NI', label: 'Lower Saxony' },
  { value: 'NW', label: 'North Rhine-Westphalia' },
  { value: 'RP', label: 'Rhineland-Palatinate' },
  { value: 'SL', label: 'Saarland' },
  { value: 'SN', label: 'Saxony' },
  { value: 'ST', label: 'Saxony-Anhalt' },
  { value: 'SH', label: 'Schleswig-Holstein' },
  { value: 'TH', label: 'Thuringia' },
];

export default function SalaryCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState<string>('50000');
  const [salaryPeriod, setSalaryPeriod] = useState<'monthly' | 'annual'>('annual');
  const [taxClass, setTaxClass] = useState<TaxClass>('1');
  const [bundesland, setBundesland] = useState<string>('NW');
  const [childrenCount, setChildrenCount] = useState<string>('0');
  const [churchTax, setChurchTax] = useState(false);
  const [healthInsuranceType, setHealthInsuranceType] = useState<HealthInsuranceType>('public');
  const [healthInsuranceRate, setHealthInsuranceRate] = useState('2.9');
  const [hasCalculated, setHasCalculated] = useState(false);

  const annualGross = useMemo(() => {
    const gross = parseFloat(grossSalary) || 0;
    return salaryPeriod === 'monthly' ? gross * 12 : gross;
  }, [grossSalary, salaryPeriod]);

  const result = useMemo(() => {
    if (!hasCalculated || annualGross <= 0) return null;

    return calculateGermanPayroll2026({
      annualGross,
      taxClass,
      stateCode: bundesland,
      churchTax,
      healthInsuranceType,
      publicHealthAdditionalRate: parseFloat(healthInsuranceRate) || 2.9,
      privateHealthAndCareMonthly: 0,
      privateEmployerSubsidyMonthly: 0,
      childrenCount: parseInt(childrenCount) || 0,
      taxChildAllowance: 0,
      childlessCareSurcharge: true,
      birthYear: undefined,
      annualTaxAllowance: 0,
      annualTaxAddition: 0,
      pensionInsuranceMandatory: true,
      unemploymentInsuranceMandatory: true,
    });
  }, [hasCalculated, annualGross, taxClass, bundesland, childrenCount, churchTax, healthInsuranceType, healthInsuranceRate]);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  const monthlyGross = annualGross / 12;
  const monthlyNet = result ? result.netto / 12 : 0;
  const annualNet = result?.netto || 0;
  const totalDeductions = result?.totalDeductions || 0;
  const effectiveRate = result?.effectiveRate || 0;

  const deductions = useMemo(() => {
    if (!result) return [];
    return [
      { label: 'Income Tax', amount: result.incomeTax, icon: Building2, color: '#dc2626' },
      { label: 'Pension Insurance', amount: result.pensionInsurance, icon: Shield, color: '#ea580c' },
      { label: 'Health Insurance', amount: result.healthInsurance, icon: Heart, color: '#0891b2' },
      { label: 'Unemployment', amount: result.unemploymentInsurance, icon: Users, color: '#7c3aed' },
      { label: 'Care Insurance', amount: result.careInsurance, icon: Sparkles, color: '#059669' },
      { label: 'Solidarity Surcharge', amount: result.solidaritySurcharge, icon: TrendingDown, color: '#9333ea' },
      { label: 'Church Tax', amount: result.churchTaxAmount, icon: Coins, color: '#d97706' },
    ].filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [result]);

  const maxDeduction = deductions.length > 0 ? Math.max(...deductions.map(d => d.amount)) : 1;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <SiteNav />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 20px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <Link href="/tools" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
            German Salary Calculator 2026
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Calculate your take-home pay from gross salary
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
          {/* LEFT: Input Form */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* Salary Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8, display: 'block' }}>
                Gross Salary
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Euro className="w-5 h-5" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => { setGrossSalary(e.target.value); setHasCalculated(false); }}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '2px solid #e2e8f0',
                      borderRadius: 10,
                      fontSize: 20,
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  />
                </div>
                <select 
                  value={salaryPeriod} 
                  onChange={(e) => { setSalaryPeriod(e.target.value as 'monthly' | 'annual'); setHasCalculated(false); }}
                  style={{ padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#fff' }}
                >
                  <option value="annual">/ year</option>
                  <option value="monthly">/ month</option>
                </select>
              </div>
            </div>

            {/* Settings Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' }}>Tax Class</label>
                <select value={taxClass} onChange={(e) => { setTaxClass(e.target.value as TaxClass); setHasCalculated(false); }} style={selectStyle}>
                  <option value="1">Class 1 - Single</option>
                  <option value="2">Class 2 - Single Parent</option>
                  <option value="3">Class 3 - Married (high)</option>
                  <option value="4">Class 4 - Married (similar)</option>
                  <option value="5">Class 5 - Married (low)</option>
                  <option value="6">Class 6 - 2nd Job</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' }}>State</label>
                <select value={bundesland} onChange={(e) => { setBundesland(e.target.value); setHasCalculated(false); }} style={selectStyle}>
                  {BUNDESLAENDER.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' }}>Children</label>
                <select value={childrenCount} onChange={(e) => { setChildrenCount(e.target.value); setHasCalculated(false); }} style={selectStyle}>
                  {[0, 1, 2, 3, 4, 5].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' }}>Church Tax</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => { setChurchTax(false); setHasCalculated(false); }} style={toggleBtn(!churchTax, '#dc2626')}>No</button>
                  <button onClick={() => { setChurchTax(true); setHasCalculated(false); }} style={toggleBtn(churchTax, '#dc2626')}>Yes</button>
                </div>
              </div>
            </div>

            {/* Health Insurance */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, display: 'block' }}>Health Insurance</label>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => { setHealthInsuranceType('public'); setHasCalculated(false); }} style={toggleBtn(healthInsuranceType === 'public', '#0891b2')}>Public (GKV)</button>
                <button onClick={() => { setHealthInsuranceType('private'); setHasCalculated(false); }} style={toggleBtn(healthInsuranceType === 'private', '#0891b2')}>Private (PKV)</button>
              </div>
              {healthInsuranceType === 'public' && (
                <input
                  type="number"
                  step="0.1"
                  value={healthInsuranceRate}
                  onChange={(e) => { setHealthInsuranceRate(e.target.value); setHasCalculated(false); }}
                  style={{ ...selectStyle, width: 80, marginTop: 8 }}
                  placeholder="2.9%"
                />
              )}
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              style={{
                width: '100%',
                padding: '14px',
                background: '#dc2626',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
              }}
            >
              <Calculator className="w-5 h-5" />
              Calculate
            </button>
          </div>

          {/* RIGHT: Results */}
          <div>
            {!result ? (
              <div style={{ background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Calculator className="w-10 h-10" style={{ color: '#94a3b8' }} />
                </div>
                <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
                  Enter your details and click Calculate to see your results
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {/* Annual */}
                  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: '0 0 8px', textTransform: 'uppercase' }}>Per Year</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Gross</span>
                      <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{formatEuro(annualGross)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Net</span>
                      <span style={{ fontSize: 32, fontWeight: 800, color: '#059669' }}>{formatEuro(annualNet)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>-{formatEuro(totalDeductions)}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>({effectiveRate.toFixed(1)}%)</span>
                    </div>
                  </div>

                  {/* Monthly */}
                  <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: '0 0 8px', textTransform: 'uppercase' }}>Per Month</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Gross</span>
                      <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{formatEuro(monthlyGross)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Net</span>
                      <span style={{ fontSize: 32, fontWeight: 800, color: '#059669' }}>{formatEuro(monthlyNet)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>-{formatEuro(totalDeductions / 12)}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>({effectiveRate.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Deduction Breakdown */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Deduction Breakdown</h3>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {deductions.map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <item.icon className="w-5 h-5" style={{ color: item.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                              {formatEuro(item.amount / 12)}/mo
                            </span>
                          </div>
                          <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${(item.amount / maxDeduction) * 100}%`, background: item.color, borderRadius: 2 }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b', width: 70, textAlign: 'right' }}>
                          {formatEuro(item.amount)}/yr
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Total Deductions</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', display: 'block' }}>{formatEuro(totalDeductions / 12)}/mo</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{formatEuro(totalDeductions)}/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20, textAlign: 'center' }}>
          Based on 2026 German tax rules (BMF). For employees only. Click Calculate after changing any input.
        </p>
      </main>
    </div>
  );
}

function formatEuro(value: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '2px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  background: '#fff',
};

function toggleBtn(active: boolean, color: string): React.CSSProperties {
  return {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 8,
    border: active ? `2px solid ${color}` : '2px solid #e2e8f0',
    background: active ? color + '10' : '#fff',
    color: active ? color : '#64748b',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  };
}
