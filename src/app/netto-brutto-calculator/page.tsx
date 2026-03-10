'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, Home, Info, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

type TaxClass = '1' | '2' | '3' | '4' | '5' | '6';
type CalculationMode = 'brutto-to-netto' | 'netto-to-brutto';

export default function NettoBruttoCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>('brutto-to-netto');
  const [bruttoSalary, setBruttoSalary] = useState<string>('50000');
  const [nettoSalary, setNettoSalary] = useState<string>('');
  const [taxClass, setTaxClass] = useState<TaxClass>('1');
  const [hasChildren, setHasChildren] = useState(false);
  const [churchTax, setChurchTax] = useState(false);
  const [healthInsuranceRate, setHealthInsuranceRate] = useState('2.5');
  const [calculated, setCalculated] = useState(false);
  const [calcResult, setCalcResult] = useState<ReturnType<typeof calculateNetFromGross> | null>(null);
  const [calcGross, setCalcGross] = useState(0);

  // Calculate income tax based on German tax formula (2025)
  const calculateIncomeTax = (taxableIncome: number): number => {
    if (taxableIncome <= 11784) return 0; // Tax-free allowance 2025
    
    if (taxableIncome <= 17005) {
      const y = (taxableIncome - 11784) / 10000;
      return (922.98 * y + 1400) * y;
    }
    
    if (taxableIncome <= 66760) {
      const z = (taxableIncome - 17005) / 10000;
      return (181.19 * z + 2397) * z + 1025.38;
    }
    
    if (taxableIncome <= 277825) {
      return 0.42 * taxableIncome - 10602.13;
    }
    
    return 0.45 * taxableIncome - 18936.88;
  };

  // Calculate solidarity surcharge (5.5% only for high earners)
  const calculateSolidaritySurcharge = (incomeTax: number, taxableIncome: number): number => {
    const threshold = taxClass === '3' ? 39900 : 19950;
    if (incomeTax <= threshold) return 0;
    
    const maxThreshold = taxClass === '3' ? 211000 : 105500;
    if (taxableIncome >= maxThreshold) return incomeTax * 0.055;
    
    // Sliding scale
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
  } => {
    // Social security contributions (employee share)
    const pensionCeiling = 96600;
    const healthCeiling = 66150;
    
    const pensionBase = Math.min(gross, pensionCeiling);
    const healthBase = Math.min(gross, healthCeiling);
    
    const pensionInsurance = pensionBase * 0.093; // 9.3% employee share
    const unemploymentInsurance = pensionBase * 0.013; // 1.3% employee share
    const healthInsurance = healthBase * (0.073 + parseFloat(healthInsuranceRate) / 200); // 7.3% + half of additional rate
    const careInsurance = healthBase * (hasChildren ? 0.017 : 0.021); // 1.7% or 2.1% for childless
    
    const socialContributions = pensionInsurance + unemploymentInsurance + healthInsurance + careInsurance;
    
    // Taxable income
    const taxableIncome = gross - socialContributions;
    
    // Income tax
    const incomeTax = calculateIncomeTax(taxableIncome);
    
    // Solidarity surcharge
    const solidaritySurcharge = calculateSolidaritySurcharge(incomeTax, taxableIncome);
    
    // Church tax (8% or 9% of income tax)
    const churchTaxAmount = churchTax ? incomeTax * 0.09 : 0;
    
    // Total deductions
    const totalDeductions = socialContributions + incomeTax + solidaritySurcharge + churchTaxAmount;
    
    // Net salary
    const netto = gross - totalDeductions;
    
    return {
      netto,
      incomeTax,
      solidaritySurcharge,
      churchTaxAmount,
      pensionInsurance,
      unemploymentInsurance,
      healthInsurance,
      careInsurance,
      totalDeductions
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
      gross = parseFloat(bruttoSalary) || 0;
      const result = calculateNetFromGross(gross);
      setNettoSalary(result.netto.toFixed(2));
      setCalcResult(result);
      setCalcGross(gross);
    } else {
      const net = parseFloat(nettoSalary) || 0;
      gross = calculateGrossFromNet(net);
      setBruttoSalary(gross.toFixed(2));
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

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666', textDecoration: 'none', fontSize: 14, marginBottom: 16 }}>
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(221,0,0,0.2)' }}>
              <Calculator className="w-8 h-8" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>Netto-Brutto Calculator</h1>
              <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>Calculate your net or gross salary in Germany for 2025</p>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
          {/* Left Panel - Input */}
          <div>
            {/* Mode Selection */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Calculation Mode</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Annual Salary</h2>
              
              {mode === 'brutto-to-netto' ? (
                <div>
                  <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                    Brutto (Gross) Salary per Year
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
                    Netto (Net) Salary per Year
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
                    <option value="1">Class 1 - Single, no children</option>
                    <option value="2">Class 2 - Single parent</option>
                    <option value="3">Class 3 - Married, higher earner</option>
                    <option value="4">Class 4 - Married, equal earners</option>
                    <option value="5">Class 5 - Married, lower earner</option>
                    <option value="6">Class 6 - Second job</option>
                  </select>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ background: 'linear-gradient(135deg, #dd0000, #7c3aed)', borderRadius: 16, padding: 20, color: '#fff' }}>
                <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>Annual Gross</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>€{gross.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>€{monthlyGross.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 12, color: '#737373', marginBottom: 8 }}>Annual Net</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e' }}>€{result.netto.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{ fontSize: 12, color: '#737373', marginTop: 4 }}>€{monthlyNet.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month</div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <section style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 20px' }}>Deductions Breakdown</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Income Tax */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Income Tax</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{result.incomeTax.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Solidarity Surcharge */}
                {result.solidaritySurcharge > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: 14, color: '#111' }}>Solidarity Surcharge</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{result.solidaritySurcharge.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Church Tax */}
                {result.churchTaxAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: 14, color: '#111' }}>Church Tax</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{result.churchTaxAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Pension Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Pension Insurance (9.3%)</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{result.pensionInsurance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Unemployment Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Unemployment Insurance (1.3%)</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{result.unemploymentInsurance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Health Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Health Insurance</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{result.healthInsurance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Care Insurance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 14, color: '#111' }}>Long-term Care Insurance</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#dd0000' }}>-€{result.careInsurance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginTop: 8, borderTop: '2px solid #ebebeb' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Total Deductions</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#dd0000' }}>-€{result.totalDeductions.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
