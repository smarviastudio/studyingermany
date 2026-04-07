'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Calculator } from 'lucide-react';
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

export default function NettoBruttoCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState<string>('50000');
  const [salaryPeriod, setSalaryPeriod] = useState<'monthly' | 'annual'>('annual');
  const [taxClass, setTaxClass] = useState<TaxClass>('1');
  const [bundesland, setBundesland] = useState<string>('NW');
  const [childrenCount, setChildrenCount] = useState<string>('0');
  const [churchTax, setChurchTax] = useState(false);
  const [healthInsuranceType, setHealthInsuranceType] = useState<HealthInsuranceType>('public');
  const [healthInsuranceRate, setHealthInsuranceRate] = useState('2.9');
  
  const [result, setResult] = useState<ReturnType<typeof calculateGermanPayroll2026> | null>(null);

  const handleCalculate = () => {
    const gross = parseFloat(grossSalary) || 0;
    const annualGross = salaryPeriod === 'monthly' ? gross * 12 : gross;
    
    const input = {
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
    };

    const calculated = calculateGermanPayroll2026(input);
    setResult(calculated);
  };

  const displayGross = salaryPeriod === 'monthly' 
    ? (parseFloat(grossSalary) || 0) 
    : (parseFloat(grossSalary) || 0);
  const annualGross = salaryPeriod === 'monthly' 
    ? (parseFloat(grossSalary) || 0) * 12 
    : (parseFloat(grossSalary) || 0);
  
  const monthlyGross = annualGross / 12;
  const monthlyNet = result ? result.netto / 12 : 0;
  const annualNet = result ? result.netto : 0;

  const deductions = result ? [
    { label: 'Income Tax', amount: result.incomeTax, color: '#dc2626' },
    { label: 'Pension Insurance', amount: result.pensionInsurance, color: '#ea580c' },
    { label: 'Health Insurance', amount: result.healthInsurance, color: '#2563eb' },
    { label: 'Unemployment', amount: result.unemploymentInsurance, color: '#0891b2' },
    { label: 'Care Insurance', amount: result.careInsurance, color: '#059669' },
    { label: 'Solidarity Surcharge', amount: result.solidaritySurcharge, color: '#7c3aed' },
    { label: 'Church Tax', amount: result.churchTaxAmount, color: '#9333ea' },
  ].filter((item) => item.amount > 0) : [];

  const totalDeductions = result?.totalDeductions || 0;
  const effectiveRate = result?.effectiveRate || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 20px 20px' }}>
        {/* Compact Header */}
        <div style={{ marginBottom: 16 }}>
          <Link href="/netto-brutto-calculator/landing" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>
            <ArrowLeft className="w-4 h-4" style={{ display: 'inline', marginRight: 4 }} />
            Back
          </Link>
        </div>

        {/* Main Card */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>
              German Salary Calculator 2026
            </h1>
            <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>
              Calculate your take-home pay from gross salary
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px' }}>
            {/* Left: Inputs */}
            <div style={{ padding: 20, display: 'grid', gap: 16 }}>
              {/* Gross Salary */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6, display: 'block' }}>
                  Gross Salary
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 12px',
                        border: '2px solid #e5e5e5',
                        borderRadius: 8,
                        fontSize: 20,
                        fontWeight: 700,
                        outline: 'none',
                      }}
                    />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#999' }}>€</span>
                  </div>
                  <select 
                    value={salaryPeriod} 
                    onChange={(e) => setSalaryPeriod(e.target.value as 'monthly' | 'annual')}
                    style={{ padding: '8px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, background: '#fff' }}
                  >
                    <option value="annual">per year</option>
                    <option value="monthly">per month</option>
                  </select>
                </div>
              </div>

              {/* Compact Grid for Settings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4, display: 'block' }}>Tax Class</label>
                  <select value={taxClass} onChange={(e) => setTaxClass(e.target.value as TaxClass)} style={selectStyle}>
                    <option value="1">Class 1 (Single)</option>
                    <option value="2">Class 2 (Single parent)</option>
                    <option value="3">Class 3 (Married, higher)</option>
                    <option value="4">Class 4 (Married, similar)</option>
                    <option value="5">Class 5 (Married, lower)</option>
                    <option value="6">Class 6 (Second job)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4, display: 'block' }}>State</label>
                  <select value={bundesland} onChange={(e) => setBundesland(e.target.value)} style={selectStyle}>
                    {BUNDESLAENDER.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4, display: 'block' }}>Children</label>
                  <select value={childrenCount} onChange={(e) => setChildrenCount(e.target.value)} style={selectStyle}>
                    {[0, 1, 2, 3, 4, 5].map((v) => (
                      <option key={v} value={v}>{v} {v === 1 ? 'child' : 'children'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4, display: 'block' }}>Church Tax</label>
                  <select value={churchTax ? 'yes' : 'no'} onChange={(e) => setChurchTax(e.target.value === 'yes')} style={selectStyle}>
                    <option value="no">No</option>
                    <option value="yes">Yes (8-9%)</option>
                  </select>
                </div>
              </div>

              {/* Health Insurance Toggle */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => setHealthInsuranceType('public')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: healthInsuranceType === 'public' ? '2px solid #dc2626' : '1px solid #e5e5e5',
                    background: healthInsuranceType === 'public' ? '#fef2f2' : '#fff',
                    color: healthInsuranceType === 'public' ? '#dc2626' : '#666',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Public Health Insurance
                </button>
                <button 
                  onClick={() => setHealthInsuranceType('private')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: healthInsuranceType === 'private' ? '2px solid #dc2626' : '1px solid #e5e5e5',
                    background: healthInsuranceType === 'private' ? '#fef2f2' : '#fff',
                    color: healthInsuranceType === 'private' ? '#dc2626' : '#666',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Private Health Insurance
                </button>
              </div>

              {healthInsuranceType === 'public' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4, display: 'block' }}>
                    Additional Health Insurance Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={healthInsuranceRate}
                    onChange={(e) => setHealthInsuranceRate(e.target.value)}
                    style={{ ...selectStyle, width: 120 }}
                  />
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: '#dc2626',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                  marginTop: 4,
                }}
              >
                <Calculator className="w-5 h-5" />
                Calculate Net Salary
              </button>
            </div>

            {/* Right: Results */}
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: 24, color: '#fff' }}>
              {!result ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Calculator className="w-12 h-12" style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                  <p style={{ fontSize: 14, opacity: 0.7 }}>Enter your details and click Calculate</p>
                </div>
              ) : (
                <>
                  {/* Net Salary */}
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.7, marginBottom: 8 }}>
                      Your Net Salary
                    </p>
                    <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
                      {formatEuro(salaryPeriod === 'monthly' ? monthlyNet : annualNet)}
                    </div>
                    <p style={{ fontSize: 12, opacity: 0.7 }}>
                      {salaryPeriod === 'monthly' ? 'per month' : 'per year'}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Gross</p>
                      <p style={{ fontSize: 16, fontWeight: 700 }}>{formatEuro(salaryPeriod === 'monthly' ? monthlyGross : annualGross)}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Deductions</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#fca5a5' }}>{formatEuro(salaryPeriod === 'monthly' ? totalDeductions/12 : totalDeductions)}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Tax Rate</p>
                      <p style={{ fontSize: 16, fontWeight: 700 }}>{effectiveRate.toFixed(1)}%</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Take-Home</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#86efac' }}>{(100 - effectiveRate).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Deductions List */}
                  <div>
                    <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: 12 }}>
                      Deduction Breakdown
                    </p>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {deductions.map((item) => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                            <span style={{ fontSize: 12, opacity: 0.9 }}>{item.label}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {formatEuro(salaryPeriod === 'monthly' ? item.amount/12 : item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#888' }}>
          <Info className="w-4 h-4" />
          <span>Based on 2026 German tax rules (BMF). For employees only. Actual amounts may vary slightly.</span>
        </div>
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
  border: '1px solid #e5e5e5',
  borderRadius: 6,
  fontSize: 13,
  background: '#fff',
  cursor: 'pointer',
};
