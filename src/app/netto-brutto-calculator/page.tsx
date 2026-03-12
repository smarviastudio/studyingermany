'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Home, Info, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

type TaxClass = '1' | '2' | '3' | '4' | '5' | '6';
type CalculationMode = 'brutto-to-netto' | 'netto-to-brutto';

// Church tax rates by Bundesland (most states 9%, Bavaria/Baden-Württemberg 8%)
const BUNDESLAENDER = [
  { value: 'BY', label: 'Bayern (Bavaria)', churchTaxRate: 0.08 },
  { value: 'BW', label: 'Baden-Württemberg', churchTaxRate: 0.08 },
  { value: 'BE', label: 'Berlin', churchTaxRate: 0.09 },
  { value: 'BB', label: 'Brandenburg', churchTaxRate: 0.09 },
  { value: 'HB', label: 'Bremen', churchTaxRate: 0.09 },
  { value: 'HH', label: 'Hamburg', churchTaxRate: 0.09 },
  { value: 'HE', label: 'Hessen', churchTaxRate: 0.09 },
  { value: 'MV', label: 'Mecklenburg-Vorpommern', churchTaxRate: 0.09 },
  { value: 'NI', label: 'Niedersachsen', churchTaxRate: 0.09 },
  { value: 'NW', label: 'Nordrhein-Westfalen', churchTaxRate: 0.09 },
  { value: 'RP', label: 'Rheinland-Pfalz', churchTaxRate: 0.09 },
  { value: 'SL', label: 'Saarland', churchTaxRate: 0.09 },
  { value: 'SN', label: 'Sachsen', churchTaxRate: 0.09 },
  { value: 'ST', label: 'Sachsen-Anhalt', churchTaxRate: 0.09 },
  { value: 'SH', label: 'Schleswig-Holstein', churchTaxRate: 0.09 },
  { value: 'TH', label: 'Thüringen', churchTaxRate: 0.09 },
];

// Additional allowances by class (annual, 2025)
// NOTE: Grundfreibetrag is already built into the progressive tax formula,
// so we only apply class-specific extras (e.g. single parent relief, splitting).
const TAX_ALLOWANCES: Record<TaxClass, number> = {
  '1': 0,
  '2': 4260,        // single parent allowance (Entlastungsbetrag)
  '3': 11784,       // approximate extra allowance for splitting advantage
  '4': 0,
  '5': 0,           // no allowance, all taxed from first euro
  '6': 0,           // second job, no allowance
};

export default function NettoBruttoCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>('brutto-to-netto');
  const [bruttoSalary, setBruttoSalary] = useState<string>('50000');
  const [nettoSalary, setNettoSalary] = useState<string>('');
  const [taxClass, setTaxClass] = useState<TaxClass>('1');
  const [bundesland, setBundesland] = useState<string>('NW');
  const [hasChildren, setHasChildren] = useState(false);
  const [churchTax, setChurchTax] = useState(false);
  const [healthInsuranceRate, setHealthInsuranceRate] = useState('2.5');
  const [salaryPeriod, setSalaryPeriod] = useState<'monthly' | 'annual'>('annual');
  const [calculated, setCalculated] = useState(false);
  const [calcResult, setCalcResult] = useState<ReturnType<typeof calculateNetFromGross> | null>(null);
  const [calcGross, setCalcGross] = useState(0);

  const getChurchTaxRate = () => BUNDESLAENDER.find(b => b.value === bundesland)?.churchTaxRate ?? 0.09;

  // Calculate income tax based on German tax formula (2025), respecting tax class allowances
  const calculateIncomeTax = (taxableIncome: number, tc: TaxClass): number => {
    const allowance = TAX_ALLOWANCES[tc];
    const income = Math.max(0, taxableIncome - allowance);

    // Class 5 & 6: flat withholding approximation (no allowance, higher effective rate)
    if (tc === '5') return income * 0.30;
    if (tc === '6') return income * 0.42;

    // Standard progressive formula (classes 1, 2, 3, 4)
    if (income <= 0) return 0;

    if (income <= 17005) {
      const y = income / 10000;
      return (922.98 * y + 1400) * y;
    }
    if (income <= 66760) {
      const z = (income - 17005) / 10000;
      return (181.19 * z + 2397) * z + 1025.38;
    }
    if (income <= 277825) {
      return 0.42 * income - 10602.13;
    }
    return 0.45 * income - 18936.88;
  };

  // Calculate solidarity surcharge (5.5% only for high earners)
  const calculateSolidaritySurcharge = (incomeTax: number, tc: TaxClass): number => {
    const threshold = tc === '3' ? 39900 : 19950;
    if (incomeTax <= threshold) return 0;
    const excess = incomeTax - threshold;
    return Math.min(excess * 0.119, incomeTax * 0.055);
  };

  // Calculate net from gross
  const calculateNetFromGross = (gross: number): {
    netto: number;
    incomeTax: number;
    solidaritySurcharge: number;
    churchTaxAmount: number;
    pensionInsurance: number;
    unemploymentInsurance: number;
    healthInsurance: number;
    careInsurance: number;
    totalDeductions: number;
    effectiveRate: number;
  } => {
    const pensionCeiling = 96600;
    const healthCeiling = 66150;
    const pensionBase = Math.min(gross, pensionCeiling);
    const healthBase = Math.min(gross, healthCeiling);

    const pensionInsurance = pensionBase * 0.093;
    const unemploymentInsurance = pensionBase * 0.013;
    const healthInsurance = healthBase * (0.073 + parseFloat(healthInsuranceRate || '2.5') / 200);
    const careInsurance = healthBase * (hasChildren ? 0.017 : 0.021);
    const socialContributions = pensionInsurance + unemploymentInsurance + healthInsurance + careInsurance;

    const taxableIncome = gross - socialContributions;
    const incomeTax = calculateIncomeTax(taxableIncome, taxClass);
    const solidaritySurcharge = calculateSolidaritySurcharge(incomeTax, taxClass);
    const churchTaxAmount = churchTax ? incomeTax * getChurchTaxRate() : 0;
    const totalDeductions = socialContributions + incomeTax + solidaritySurcharge + churchTaxAmount;
    const netto = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    return {
      netto, incomeTax, solidaritySurcharge, churchTaxAmount,
      pensionInsurance, unemploymentInsurance, healthInsurance, careInsurance,
      totalDeductions, effectiveRate,
    };
  };

  // Calculate gross from net (iterative approximation)
  const calculateGrossFromNet = (targetNet: number): number => {
    let low = targetNet;
    let high = targetNet * 2;
    let iterations = 0;
    const maxIterations = 50;
    
    while (iterations < maxIterations) {
      const mid = (low + high) / 2;
      const result = calculateNetFromGross(mid);
      
      if (Math.abs(result.netto - targetNet) < 1) {
        return mid;
      }
      
      if (result.netto < targetNet) {
        low = mid;
      } else {
        high = mid;
      }
      
      iterations++;
    }
    
    return (low + high) / 2;
  };

  const handleCalculate = () => {
    let gross: number;
    if (mode === 'brutto-to-netto') {
      const inputVal = parseFloat(bruttoSalary) || 0;
      gross = salaryPeriod === 'monthly' ? inputVal * 12 : inputVal;
      const result = calculateNetFromGross(gross);
      setNettoSalary(salaryPeriod === 'monthly' ? (result.netto / 12).toFixed(2) : result.netto.toFixed(2));
      setCalcResult(result);
      setCalcGross(gross);
    } else {
      const inputVal = parseFloat(nettoSalary) || 0;
      const annualNet = salaryPeriod === 'monthly' ? inputVal * 12 : inputVal;
      gross = calculateGrossFromNet(annualNet);
      setBruttoSalary(salaryPeriod === 'monthly' ? (gross / 12).toFixed(2) : gross.toFixed(2));
      const result = calculateNetFromGross(gross);
      setCalcResult(result);
      setCalcGross(gross);
    }
    setCalculated(true);
  };

  const gross = calcGross;
  const result = calcResult ?? calculateNetFromGross(0);
  const monthlyGross = gross / 12;
  const monthlyNet = result.netto / 12;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main className="salary-main" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666', textDecoration: 'none', fontSize: 14, marginBottom: 16 }}>
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="salary-header" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="salary-header-icon" style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
              <Calculator className="w-8 h-8" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>Netto-Brutto Calculator</h1>
              <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>Calculate your net or gross salary in Germany for 2025</p>
            </div>
          </div>
        </header>

        <div className="salary-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
          {/* Left Panel - Input */}
          <div>
            {/* Mode Selection */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Calculation Mode</h2>
              <div className="salary-mode-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  onClick={() => setMode('brutto-to-netto')}
                  style={{
                    padding: '16px',
                    borderRadius: 12,
                    border: mode === 'brutto-to-netto' ? '2px solid #dd0000' : '1px solid #e5e5e5',
                    background: mode === 'brutto-to-netto' ? 'rgba(221,0,0,0.05)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <TrendingDown className="w-5 h-5" style={{ color: mode === 'brutto-to-netto' ? '#dd0000' : '#666', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: mode === 'brutto-to-netto' ? '#dd0000' : '#111' }}>Brutto → Netto</div>
                  <div style={{ fontSize: 12, color: '#737373', marginTop: 4 }}>Gross to Net</div>
                </button>
                <button
                  onClick={() => setMode('netto-to-brutto')}
                  style={{
                    padding: '16px',
                    borderRadius: 12,
                    border: mode === 'netto-to-brutto' ? '2px solid #dd0000' : '1px solid #e5e5e5',
                    background: mode === 'netto-to-brutto' ? 'rgba(221,0,0,0.05)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: mode === 'netto-to-brutto' ? '#dd0000' : '#666', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: mode === 'netto-to-brutto' ? '#dd0000' : '#111' }}>Netto → Brutto</div>
                  <div style={{ fontSize: 12, color: '#737373', marginTop: 4 }}>Net to Gross</div>
                </button>
              </div>
            </section>

            {/* Salary Input */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Salary</h2>
                <div style={{ display: 'flex', borderRadius: 10, border: '1px solid #e5e5e5', overflow: 'hidden', fontSize: 13 }}>
                  <button onClick={() => setSalaryPeriod('monthly')} style={{ padding: '7px 16px', background: salaryPeriod === 'monthly' ? '#dd0000' : 'transparent', color: salaryPeriod === 'monthly' ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>Monthly</button>
                  <button onClick={() => setSalaryPeriod('annual')} style={{ padding: '7px 16px', background: salaryPeriod === 'annual' ? '#dd0000' : 'transparent', color: salaryPeriod === 'annual' ? '#fff' : '#666', border: 'none', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}>Annual</button>
                </div>
              </div>
              
              {mode === 'brutto-to-netto' ? (
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                    Brutto (Gross) Salary {salaryPeriod === 'monthly' ? 'per Month' : 'per Year'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={bruttoSalary}
                      onChange={(e) => setBruttoSalary(e.target.value)}
                      style={{ width: '100%', padding: '14px 50px 14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 18, fontWeight: 600, color: '#111', outline: 'none' }}
                      placeholder="50000"
                    />
                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 600, color: '#737373' }}>€</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                    Netto (Net) Salary {salaryPeriod === 'monthly' ? 'per Month' : 'per Year'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={nettoSalary}
                      onChange={(e) => setNettoSalary(e.target.value)}
                      style={{ width: '100%', padding: '14px 50px 14px 16px', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 18, fontWeight: 600, color: '#111', outline: 'none' }}
                      placeholder="35000"
                    />
                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 600, color: '#737373' }}>€</span>
                  </div>
                </div>
              )}
            </section>

            {/* Settings */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Tax Class */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                    Tax Class (Steuerklasse)
                  </label>
                  <select
                    value={taxClass}
                    onChange={(e) => setTaxClass(e.target.value as TaxClass)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none', cursor: 'pointer', background: '#fff' }}
                  >
                    <option value="1">Class 1 – Single, no children</option>
                    <option value="2">Class 2 – Single parent</option>
                    <option value="3">Class 3 – Married, higher earner</option>
                    <option value="4">Class 4 – Married, equal earners</option>
                    <option value="5">Class 5 – Married, lower earner</option>
                    <option value="6">Class 6 – Second job</option>
                  </select>
                </div>

                {/* Bundesland */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                    Federal State (Bundesland)
                  </label>
                  <select
                    value={bundesland}
                    onChange={(e) => setBundesland(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none', cursor: 'pointer', background: '#fff' }}
                  >
                    {BUNDESLAENDER.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Affects church tax rate (8% or 9%)</p>
                </div>

                {/* Health Insurance Rate */}
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                    Additional Health Insurance Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={healthInsuranceRate}
                    onChange={(e) => setHealthInsuranceRate(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none' }}
                  />
                  <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Average: 2.5% (2025)</p>
                </div>

                {/* Children */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasChildren}
                    onChange={(e) => setHasChildren(e.target.checked)}
                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 14, color: '#111' }}>I have children (lower care insurance)</span>
                </label>

                {/* Church Tax */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={churchTax}
                    onChange={(e) => setChurchTax(e.target.checked)}
                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 14, color: '#111' }}>Church tax (9%)</span>
                </label>
              </div>

              <button
                onClick={handleCalculate}
                style={{
                  width: '100%',
                  marginTop: 24,
                  padding: '16px 24px',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #dd0000, #7c3aed)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(221,0,0,0.2)'
                }}
              >
                <Calculator className="w-5 h-5" />
                Calculate
              </button>
            </section>
          </div>

          {/* Right Panel - Results */}
          <div>
            {!calculated && (
              <div style={{ background: '#fff', border: '2px dashed #e5e5e5', borderRadius: 20, padding: '48px 24px', textAlign: 'center', color: '#aaa' }}>
                <Calculator className="w-12 h-12" style={{ color: '#e5e5e5', margin: '0 auto 16px' }} />
                <p style={{ fontSize: 16, fontWeight: 600, color: '#bbb', margin: '0 0 8px' }}>Results will appear here</p>
                <p style={{ fontSize: 13, color: '#ccc', margin: 0 }}>Fill in your salary and click Calculate</p>
              </div>
            )}
            {calculated && (<>
            {/* Summary Cards */}
            <div className="salary-results-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ background: 'linear-gradient(135deg, #dd0000, #7c3aed)', borderRadius: 16, padding: 20, color: '#fff' }}>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>{salaryPeriod === 'monthly' ? 'Monthly' : 'Annual'} Gross</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>€{(salaryPeriod === 'monthly' ? monthlyGross : gross).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>€{(salaryPeriod === 'monthly' ? gross : monthlyGross).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {salaryPeriod === 'monthly' ? 'year' : 'month'}</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 12, color: '#737373', marginBottom: 8 }}>{salaryPeriod === 'monthly' ? 'Monthly' : 'Annual'} Net</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e' }}>€{(salaryPeriod === 'monthly' ? monthlyNet : result.netto).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{ fontSize: 12, color: '#737373', marginTop: 4 }}>€{(salaryPeriod === 'monthly' ? result.netto : monthlyNet).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {salaryPeriod === 'monthly' ? 'year' : 'month'}</div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Deductions Breakdown</h2>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', background: '#f3f4f6', padding: '4px 10px', borderRadius: 20 }}>{salaryPeriod === 'monthly' ? 'Monthly' : 'Annual'}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Income Tax */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Income Tax</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.incomeTax / 12 : result.incomeTax).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Solidarity Surcharge */}
                {result.solidaritySurcharge > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: 14, color: '#111' }}>Solidarity Surcharge</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.solidaritySurcharge / 12 : result.solidaritySurcharge).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Church Tax */}
                {result.churchTaxAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: 14, color: '#111' }}>Church Tax</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.churchTaxAmount / 12 : result.churchTaxAmount).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Pension Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Pension Insurance (9.3%)</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.pensionInsurance / 12 : result.pensionInsurance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Unemployment Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Unemployment Insurance (1.3%)</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.unemploymentInsurance / 12 : result.unemploymentInsurance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Health Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Health Insurance</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.healthInsurance / 12 : result.healthInsurance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Care Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Long-term Care Insurance</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.careInsurance / 12 : result.careInsurance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginTop: 8, borderTop: '2px solid #ebebeb' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Total Deductions</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#dd0000' }}>-€{(salaryPeriod === 'monthly' ? result.totalDeductions / 12 : result.totalDeductions).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </section>

            {/* Info Box */}
            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Info className="w-5 h-5" style={{ color: '#3b82f6', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>About this calculator</h3>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>
                    This calculator uses the official German tax rates for 2025. Results are estimates and may vary based on individual circumstances. For exact calculations, consult a tax advisor.
                  </p>
                </div>
              </div>
            </div>
            </>)}
          </div>
        </div>
      </main>
    </div>
  );
}
