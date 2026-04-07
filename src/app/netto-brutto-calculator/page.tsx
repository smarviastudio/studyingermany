'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, TrendingDown, Wallet, Percent, Calendar, Building2, Users, Heart, Shield, Cross, Coins } from 'lucide-react';
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

const TAX_CLASS_INFO: Record<TaxClass, { label: string; desc: string }> = {
  '1': { label: 'Class 1', desc: 'Single, not married' },
  '2': { label: 'Class 2', desc: 'Single parent' },
  '3': { label: 'Class 3', desc: 'Married, higher earner' },
  '4': { label: 'Class 4', desc: 'Married, similar income' },
  '5': { label: 'Class 5', desc: 'Married, lower earner' },
  '6': { label: 'Class 6', desc: 'Second job' },
};

export default function SalaryCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState<string>('50000');
  const [salaryPeriod, setSalaryPeriod] = useState<'monthly' | 'annual'>('annual');
  const [taxClass, setTaxClass] = useState<TaxClass>('1');
  const [bundesland, setBundesland] = useState<string>('NW');
  const [childrenCount, setChildrenCount] = useState<string>('0');
  const [churchTax, setChurchTax] = useState(false);
  const [healthInsuranceType, setHealthInsuranceType] = useState<HealthInsuranceType>('public');
  const [healthInsuranceRate, setHealthInsuranceRate] = useState('2.9');
  const [showDetails, setShowDetails] = useState(false);

  // Auto-calculate whenever inputs change
  const result = useMemo(() => {
    const gross = parseFloat(grossSalary) || 0;
    const annualGross = salaryPeriod === 'monthly' ? gross * 12 : gross;
    
    if (annualGross <= 0) return null;

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
  }, [grossSalary, salaryPeriod, taxClass, bundesland, childrenCount, churchTax, healthInsuranceType, healthInsuranceRate]);

  const annualGross = useMemo(() => {
    const gross = parseFloat(grossSalary) || 0;
    return salaryPeriod === 'monthly' ? gross * 12 : gross;
  }, [grossSalary, salaryPeriod]);

  const monthlyGross = annualGross / 12;
  const monthlyNet = result ? result.netto / 12 : 0;
  const annualNet = result?.netto || 0;

  const deductions = useMemo(() => {
    if (!result) return [];
    return [
      { 
        label: 'Income Tax', 
        amount: result.incomeTax, 
        icon: Building2,
        color: '#dc2626',
        bgColor: '#fef2f2',
        desc: 'Lohnsteuer'
      },
      { 
        label: 'Pension Insurance', 
        amount: result.pensionInsurance, 
        icon: Shield,
        color: '#ea580c',
        bgColor: '#fff7ed',
        desc: 'Rentenversicherung'
      },
      { 
        label: 'Health Insurance', 
        amount: result.healthInsurance, 
        icon: Heart,
        color: '#0891b2',
        bgColor: '#ecfeff',
        desc: 'Krankenversicherung'
      },
      { 
        label: 'Unemployment', 
        amount: result.unemploymentInsurance, 
        icon: Users,
        color: '#7c3aed',
        bgColor: '#f5f3ff',
        desc: 'Arbeitslosenversicherung'
      },
      { 
        label: 'Care Insurance', 
        amount: result.careInsurance, 
        icon: Cross,
        color: '#059669',
        bgColor: '#ecfdf5',
        desc: 'Pflegeversicherung'
      },
      { 
        label: 'Solidarity Surcharge', 
        amount: result.solidaritySurcharge, 
        icon: TrendingDown,
        color: '#9333ea',
        bgColor: '#faf5ff',
        desc: 'Solidaritätszuschlag'
      },
      { 
        label: 'Church Tax', 
        amount: result.churchTaxAmount, 
        icon: Coins,
        color: '#d97706',
        bgColor: '#fffbeb',
        desc: 'Kirchensteuer'
      },
    ].filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [result]);

  const totalDeductions = result?.totalDeductions || 0;
  const effectiveRate = result?.effectiveRate || 0;
  const maxDeduction = deductions.length > 0 ? Math.max(...deductions.map(d => d.amount)) : 1;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <SiteNav />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '80px 20px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/netto-brutto-calculator/landing" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6, 
            color: 'rgba(255,255,255,0.8)', 
            textDecoration: 'none',
            fontSize: 14,
            marginBottom: 16
          }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <h1 style={{ 
            fontSize: 36, 
            fontWeight: 800, 
            color: '#fff', 
            margin: '0 0 8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Salary Calculator 2026
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Calculate your take-home pay from gross salary
          </p>
        </div>

        {/* Main Input Section */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: 40,
          marginBottom: 24,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Salary Input */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <label style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: '#666', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 16,
              display: 'block'
            }}>
              Your Gross Salary
            </label>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 12,
              marginBottom: 16 
            }}>
              <span style={{ fontSize: 48, fontWeight: 300, color: '#999' }}>€</span>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  border: 'none',
                  borderBottom: '3px solid #667eea',
                  background: 'transparent',
                  width: 300,
                  textAlign: 'center',
                  outline: 'none',
                  color: '#111',
                  padding: '0 0 8px'
                }}
              />
            </div>

            {/* Period Toggle */}
            <div style={{ 
              display: 'inline-flex', 
              background: '#f3f4f6', 
              borderRadius: 12,
              padding: 4
            }}>
              <button
                onClick={() => setSalaryPeriod('annual')}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: salaryPeriod === 'annual' ? '#fff' : 'transparent',
                  color: salaryPeriod === 'annual' ? '#667eea' : '#666',
                  boxShadow: salaryPeriod === 'annual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Per Year
              </button>
              <button
                onClick={() => setSalaryPeriod('monthly')}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: salaryPeriod === 'monthly' ? '#fff' : 'transparent',
                  color: salaryPeriod === 'monthly' ? '#667eea' : '#666',
                  boxShadow: salaryPeriod === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Per Month
              </button>
            </div>
          </div>

          {/* Settings Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 16,
            marginTop: 32
          }}>
            {/* Tax Class */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6, display: 'block' }}>
                Tax Class
              </label>
              <select 
                value={taxClass} 
                onChange={(e) => setTaxClass(e.target.value as TaxClass)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  background: '#fff',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {Object.entries(TAX_CLASS_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.label} - {info.desc}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6, display: 'block' }}>
                Federal State
              </label>
              <select 
                value={bundesland} 
                onChange={(e) => setBundesland(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  background: '#fff',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {BUNDESLAENDER.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Children */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6, display: 'block' }}>
                Children
              </label>
              <select 
                value={childrenCount} 
                onChange={(e) => setChildrenCount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  background: '#fff',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>{v} {v === 1 ? 'child' : 'children'}</option>
                ))}
              </select>
            </div>

            {/* Church Tax */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6, display: 'block' }}>
                Church Tax
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setChurchTax(false)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid #e5e7eb',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: !churchTax ? '#667eea' : '#fff',
                    color: !churchTax ? '#fff' : '#666'
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => setChurchTax(true)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid #e5e7eb',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: churchTax ? '#667eea' : '#fff',
                    color: churchTax ? '#fff' : '#666'
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>

          {/* Health Insurance Toggle */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#666' }}>Health Insurance:</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setHealthInsuranceType('public')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: '2px solid #e5e7eb',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: healthInsuranceType === 'public' ? '#10b981' : '#fff',
                    color: healthInsuranceType === 'public' ? '#fff' : '#666'
                  }}
                >
                  Public (GKV)
                </button>
                <button
                  onClick={() => setHealthInsuranceType('private')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: '2px solid #e5e7eb',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: healthInsuranceType === 'private' ? '#10b981' : '#fff',
                    color: healthInsuranceType === 'private' ? '#fff' : '#666'
                  }}
                >
                  Private (PKV)
                </button>
              </div>
              {healthInsuranceType === 'public' && (
                <input
                  type="number"
                  step="0.1"
                  value={healthInsuranceRate}
                  onChange={(e) => setHealthInsuranceRate(e.target.value)}
                  style={{
                    width: 70,
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                  placeholder="2.9%"
                />
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            {/* Net Salary Display */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                padding: '16px 32px',
                borderRadius: 16,
                marginBottom: 24
              }}>
                <Wallet className="w-6 h-6" />
                <span style={{ fontSize: 16, fontWeight: 600 }}>Your Net Salary</span>
              </div>

              <div style={{ fontSize: 72, fontWeight: 800, color: '#059669', marginBottom: 8 }}>
                {formatEuro(salaryPeriod === 'monthly' ? monthlyNet : annualNet)}
              </div>
              <p style={{ fontSize: 16, color: '#666', margin: 0 }}>
                {salaryPeriod === 'monthly' ? 'per month' : 'per year'}
              </p>

              {/* Quick Stats */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 32, 
                marginTop: 32,
                paddingTop: 32,
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Gross Salary</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>
                    {formatEuro(salaryPeriod === 'monthly' ? monthlyGross : annualGross)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Total Deductions</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>
                    {formatEuro(salaryPeriod === 'monthly' ? totalDeductions / 12 : totalDeductions)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Effective Tax Rate</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#667eea' }}>
                    {effectiveRate.toFixed(1)}%
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Take-Home %</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>
                    {(100 - effectiveRate).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Deduction Breakdown */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 24
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>
                  Deduction Breakdown
                </h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#667eea',
                    cursor: 'pointer'
                  }}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {deductions.map((item) => (
                  <div 
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: 16,
                      background: item.bgColor,
                      borderRadius: 12,
                      border: `1px solid ${item.color}20`
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <item.icon className="w-6 h-6" style={{ color: '#fff' }} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{item.label}</span>
                        <span style={{ fontSize: 12, color: '#666' }}>({item.desc})</span>
                      </div>
                      <div style={{ 
                        height: 6, 
                        background: 'rgba(255,255,255,0.5)', 
                        borderRadius: 3,
                        marginTop: 8,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${(item.amount / maxDeduction) * 100}%`,
                          background: item.color,
                          borderRadius: 3,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>
                        {formatEuro(salaryPeriod === 'monthly' ? item.amount / 12 : item.amount)}
                      </div>
                      {showDetails && (
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                          {((item.amount / annualGross) * 100).toFixed(1)}% of gross
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
                paddingTop: 20,
                borderTop: '2px solid #e5e7eb'
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Total Deductions</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>
                  {formatEuro(salaryPeriod === 'monthly' ? totalDeductions / 12 : totalDeductions)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div style={{ 
          marginTop: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 8, 
          fontSize: 12, 
          color: 'rgba(255,255,255,0.7)' 
        }}>
          <Info className="w-4 h-4" />
          <span>Based on 2026 German tax rules (BMF). For employees only.</span>
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
