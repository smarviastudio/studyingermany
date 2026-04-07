'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Calculator } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import {
  calculateGermanPayroll2026,
  estimateGrossFromNet2026,
  type HealthInsuranceType,
  type TaxClass,
} from '@/lib/nettoBrutto2026';

type CalculationMode = 'brutto-to-netto' | 'netto-to-brutto';

const BUNDESLAENDER = [
  { value: 'BY', label: 'Bavaria', churchTaxRate: 0.08 },
  { value: 'BW', label: 'Baden-Württemberg', churchTaxRate: 0.08 },
  { value: 'BE', label: 'Berlin', churchTaxRate: 0.09 },
  { value: 'BB', label: 'Brandenburg', churchTaxRate: 0.09 },
  { value: 'HB', label: 'Bremen', churchTaxRate: 0.09 },
  { value: 'HH', label: 'Hamburg', churchTaxRate: 0.09 },
  { value: 'HE', label: 'Hesse', churchTaxRate: 0.09 },
  { value: 'MV', label: 'Mecklenburg-Vorpommern', churchTaxRate: 0.09 },
  { value: 'NI', label: 'Lower Saxony', churchTaxRate: 0.09 },
  { value: 'NW', label: 'North Rhine-Westphalia', churchTaxRate: 0.09 },
  { value: 'RP', label: 'Rhineland-Palatinate', churchTaxRate: 0.09 },
  { value: 'SL', label: 'Saarland', churchTaxRate: 0.09 },
  { value: 'SN', label: 'Saxony', churchTaxRate: 0.09 },
  { value: 'ST', label: 'Saxony-Anhalt', churchTaxRate: 0.09 },
  { value: 'SH', label: 'Schleswig-Holstein', churchTaxRate: 0.09 },
  { value: 'TH', label: 'Thuringia', churchTaxRate: 0.09 },
];

export default function NettoBruttoCalculatorPage() {
  // Input states
  const [mode, setMode] = useState<CalculationMode>('brutto-to-netto');
  const [bruttoSalary, setBruttoSalary] = useState<string>('50000');
  const [nettoSalary, setNettoSalary] = useState<string>('3200');
  const [taxClass, setTaxClass] = useState<TaxClass>('1');
  const [bundesland, setBundesland] = useState<string>('NW');
  const [childrenCount, setChildrenCount] = useState<string>('0');
  const [taxChildAllowance, setTaxChildAllowance] = useState<string>('0');
  const [childlessCareSurcharge, setChildlessCareSurcharge] = useState(true);
  const [churchTax, setChurchTax] = useState(false);
  const [healthInsuranceType, setHealthInsuranceType] = useState<HealthInsuranceType>('public');
  const [healthInsuranceRate, setHealthInsuranceRate] = useState('2.9');
  const [privateHealthAndCareMonthly, setPrivateHealthAndCareMonthly] = useState('');
  const [privateEmployerSubsidyMonthly, setPrivateEmployerSubsidyMonthly] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [annualTaxAllowance, setAnnualTaxAllowance] = useState('');
  const [annualTaxAddition, setAnnualTaxAddition] = useState('');
  const [pensionInsuranceMandatory, setPensionInsuranceMandatory] = useState(true);
  const [unemploymentInsuranceMandatory, setUnemploymentInsuranceMandatory] = useState(true);
  const [salaryPeriod, setSalaryPeriod] = useState<'monthly' | 'annual'>('annual');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Result states - only calculated when button clicked
  const [result, setResult] = useState<ReturnType<typeof calculateGermanPayroll2026> | null>(null);
  const [annualGross, setAnnualGross] = useState<number>(0);
  const [annualNet, setAnnualNet] = useState<number>(0);

  const buildInput = (annualGrossValue: number) => {
    const parsedChildren = Math.max(0, Math.min(5, parseInt(childrenCount || '0', 10) || 0));
    return {
      annualGross: annualGrossValue,
      taxClass,
      stateCode: bundesland,
      churchTax,
      healthInsuranceType,
      publicHealthAdditionalRate: parseFloat(healthInsuranceRate || '2.9') || 2.9,
      privateHealthAndCareMonthly: parseFloat(privateHealthAndCareMonthly || '0') || 0,
      privateEmployerSubsidyMonthly: parseFloat(privateEmployerSubsidyMonthly || '0') || 0,
      childrenCount: parsedChildren,
      taxChildAllowance: parseFloat(taxChildAllowance || '0') || 0,
      childlessCareSurcharge,
      birthYear: birthYear ? parseInt(birthYear, 10) : undefined,
      annualTaxAllowance: parseFloat(annualTaxAllowance || '0') || 0,
      annualTaxAddition: parseFloat(annualTaxAddition || '0') || 0,
      pensionInsuranceMandatory,
      unemploymentInsuranceMandatory,
    };
  };

  const handleCalculate = () => {
    const currentInput = parseFloat(mode === 'brutto-to-netto' ? bruttoSalary : nettoSalary) || 0;
    const annualInput = salaryPeriod === 'monthly' ? currentInput * 12 : currentInput;
    
    let calculatedAnnualGross: number;
    let calculatedResult: ReturnType<typeof calculateGermanPayroll2026>;

    if (mode === 'brutto-to-netto') {
      calculatedAnnualGross = annualInput;
      calculatedResult = calculateGermanPayroll2026(buildInput(calculatedAnnualGross));
    } else {
      // Net to gross - need to estimate
      calculatedAnnualGross = estimateGrossFromNet2026(annualInput, buildInput(0));
      calculatedResult = calculateGermanPayroll2026(buildInput(calculatedAnnualGross));
    }

    setAnnualGross(calculatedAnnualGross);
    setAnnualNet(calculatedResult.netto);
    setResult(calculatedResult);
  };

  const displayGross = salaryPeriod === 'monthly' ? annualGross / 12 : annualGross;
  const displayNet = salaryPeriod === 'monthly' ? annualNet / 12 : annualNet;
  const monthlyGross = annualGross / 12;
  const monthlyNet = annualNet / 12;

  const deductions = result ? [
    { label: 'Income tax', amount: result.incomeTax },
    { label: 'Solidarity surcharge', amount: result.solidaritySurcharge },
    { label: 'Church tax', amount: result.churchTaxAmount },
    { label: 'Pension insurance', amount: result.pensionInsurance },
    { label: 'Unemployment insurance', amount: result.unemploymentInsurance },
    { label: healthInsuranceType === 'public' ? 'Health insurance' : 'Private health', amount: result.healthInsurance },
    { label: 'Care insurance', amount: result.careInsurance },
  ].filter((item) => item.amount > 0) : [];

  const maxDeduction = deductions.length > 0 ? Math.max(...deductions.map((item) => item.amount), 1) : 1;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 20px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link
            href="/netto-brutto-calculator/landing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#666',
              textDecoration: 'none',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>
            German Salary Calculator
          </h1>
          <p style={{ fontSize: 16, color: '#666', margin: 0 }}>
            Calculate your net salary from gross (or vice versa) using 2026 German tax rules
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'start' }} className="calc-layout">
          {/* Left: Inputs */}
          <div style={{ display: 'grid', gap: 20 }}>
            {/* Calculation Mode */}
            <div style={card}>
              <h2 style={cardTitle}>Calculation Mode</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button onClick={() => setMode('brutto-to-netto')} style={modeBtn(mode === 'brutto-to-netto')}>
                  Gross → Net
                </button>
                <button onClick={() => setMode('netto-to-brutto')} style={modeBtn(mode === 'netto-to-brutto')}>
                  Net → Gross
                </button>
              </div>
            </div>

            {/* Salary Input */}
            <div style={card}>
              <h2 style={cardTitle}>{mode === 'brutto-to-netto' ? 'Gross Salary' : 'Net Salary'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={mode === 'brutto-to-netto' ? bruttoSalary : nettoSalary}
                    onChange={(e) => (mode === 'brutto-to-netto' ? setBruttoSalary(e.target.value) : setNettoSalary(e.target.value))}
                    style={largeInput}
                    placeholder="50000"
                  />
                  <span style={inputSuffix}>€</span>
                </div>
                <select value={salaryPeriod} onChange={(e) => setSalaryPeriod(e.target.value as 'monthly' | 'annual')} style={select}>
                  <option value="annual">Annual</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Tax Profile */}
            <div style={card}>
              <h2 style={cardTitle}>Tax Profile</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={label}>Tax Class</label>
                  <select value={taxClass} onChange={(e) => setTaxClass(e.target.value as TaxClass)} style={select}>
                    <option value="1">Class 1 - Single</option>
                    <option value="2">Class 2 - Single parent</option>
                    <option value="3">Class 3 - Married, higher</option>
                    <option value="4">Class 4 - Married, similar</option>
                    <option value="5">Class 5 - Married, lower</option>
                    <option value="6">Class 6 - Second job</option>
                  </select>
                </div>
                <div>
                  <label style={label}>State</label>
                  <select value={bundesland} onChange={(e) => setBundesland(e.target.value)} style={select}>
                    {BUNDESLAENDER.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={label}>Children under 25</label>
                  <select value={childrenCount} onChange={(e) => setChildrenCount(e.target.value)} style={select}>
                    {[0, 1, 2, 3, 4, 5].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={label}>Church Tax</label>
                  <select value={churchTax ? 'yes' : 'no'} onChange={(e) => setChurchTax(e.target.value === 'yes')} style={select}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Health Insurance */}
            <div style={card}>
              <h2 style={cardTitle}>Health Insurance</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <button onClick={() => setHealthInsuranceType('public')} style={modeBtn(healthInsuranceType === 'public')}>
                  Public
                </button>
                <button onClick={() => setHealthInsuranceType('private')} style={modeBtn(healthInsuranceType === 'private')}>
                  Private
                </button>
              </div>
              {healthInsuranceType === 'public' ? (
                <div>
                  <label style={label}>Additional Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={healthInsuranceRate}
                    onChange={(e) => setHealthInsuranceRate(e.target.value)}
                    style={input}
                    placeholder="2.9"
                  />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={label}>Monthly Premium (€)</label>
                    <input
                      type="number"
                      value={privateHealthAndCareMonthly}
                      onChange={(e) => setPrivateHealthAndCareMonthly(e.target.value)}
                      style={input}
                      placeholder="450"
                    />
                  </div>
                  <div>
                    <label style={label}>Employer Subsidy (€)</label>
                    <input
                      type="number"
                      value={privateEmployerSubsidyMonthly}
                      onChange={(e) => setPrivateEmployerSubsidyMonthly(e.target.value)}
                      style={input}
                      placeholder="225"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced */}
            {showAdvanced && (
              <div style={card}>
                <h2 style={cardTitle}>Advanced Settings</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={label}>Tax Child Allowance</label>
                    <input type="number" step="0.5" value={taxChildAllowance} onChange={(e) => setTaxChildAllowance(e.target.value)} style={input} />
                  </div>
                  <div>
                    <label style={label}>Birth Year</label>
                    <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} style={input} placeholder="1961" />
                  </div>
                  <div>
                    <label style={label}>Annual Tax Allowance (€)</label>
                    <input type="number" value={annualTaxAllowance} onChange={(e) => setAnnualTaxAllowance(e.target.value)} style={input} />
                  </div>
                  <div>
                    <label style={label}>Annual Tax Addition (€)</label>
                    <input type="number" value={annualTaxAddition} onChange={(e) => setAnnualTaxAddition(e.target.value)} style={input} />
                  </div>
                  <div>
                    <label style={label}>Childless Care Surcharge</label>
                    <select value={childlessCareSurcharge ? 'yes' : 'no'} onChange={(e) => setChildlessCareSurcharge(e.target.value === 'yes')} style={select}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label style={label}>Pension Insurance</label>
                    <select value={pensionInsuranceMandatory ? 'yes' : 'no'} onChange={(e) => setPensionInsuranceMandatory(e.target.value === 'yes')} style={select}>
                      <option value="yes">Included</option>
                      <option value="no">Exempt</option>
                    </select>
                  </div>
                  <div>
                    <label style={label}>Unemployment Insurance</label>
                    <select value={unemploymentInsuranceMandatory ? 'yes' : 'no'} onChange={(e) => setUnemploymentInsuranceMandatory(e.target.value === 'yes')} style={select}>
                      <option value="yes">Included</option>
                      <option value="no">Exempt</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  padding: '12px 20px',
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#666',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
              </button>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                style={{
                  padding: '12px 24px',
                  background: '#dd0000',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(221,0,0,0.3)',
                }}
              >
                <Calculator className="w-5 h-5" />
                Calculate
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div style={{ position: 'sticky', top: 100, display: 'grid', gap: 16 }}>
            {/* Main Result */}
            <div style={{ ...card, background: 'linear-gradient(135deg, #111 0%, #dd0000 100%)', color: '#fff', border: 'none' }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: 8 }}>
                {mode === 'brutto-to-netto' ? 'Net Salary' : 'Gross Salary'}
              </div>
              <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
                {result ? formatEuro(mode === 'brutto-to-netto' ? displayNet : displayGross) : '—'}
              </div>
              {result && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, opacity: 0.9 }}>
                  <div>
                    <div style={{ opacity: 0.7 }}>Monthly</div>
                    <div style={{ fontWeight: 700 }}>{formatEuro(mode === 'brutto-to-netto' ? monthlyNet : monthlyGross)}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.7 }}>Annual</div>
                    <div style={{ fontWeight: 700 }}>{formatEuro(mode === 'brutto-to-netto' ? annualNet : annualGross)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Breakdown */}
            {result && (
              <div style={card}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 12px' }}>Deductions</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {deductions.map((item) => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                        <span style={{ color: '#666' }}>{item.label}</span>
                        <span style={{ fontWeight: 700, color: '#111' }}>{formatEuro(item.amount)}</span>
                      </div>
                      <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${(item.amount / maxDeduction) * 100}%`, height: '100%', background: '#dd0000' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 700, color: '#dd0000' }}>{formatEuro(result.totalDeductions)}</span>
                </div>
              </div>
            )}

            {/* Info */}
            <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, fontSize: 12, color: '#666', display: 'flex', gap: 8 }}>
              <Info className="w-4 h-4" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>Click Calculate to see results based on 2026 German tax rules. This is an estimate for employees.</div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1000px) {
          .calc-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 12,
  padding: 20,
};

const cardTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#111',
  margin: '0 0 16px',
};

const label: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#666',
  marginBottom: 6,
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #e5e5e5',
  borderRadius: 6,
  fontSize: 14,
  outline: 'none',
  background: '#fff',
};

const largeInput: React.CSSProperties = {
  ...input,
  fontSize: 24,
  fontWeight: 700,
  paddingRight: 40,
};

const select: React.CSSProperties = {
  ...input,
  cursor: 'pointer',
};

const inputSuffix: React.CSSProperties = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: 14,
  fontWeight: 700,
  color: '#999',
  pointerEvents: 'none',
};

function modeBtn(active: boolean): React.CSSProperties {
  return {
    padding: '10px 16px',
    border: active ? '2px solid #dd0000' : '1px solid #e5e5e5',
    borderRadius: 6,
    background: active ? '#fff5f5' : '#fff',
    color: active ? '#dd0000' : '#666',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };
}
