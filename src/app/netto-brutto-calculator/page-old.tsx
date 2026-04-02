'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Home,
  Info,
  Landmark,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import {
  calculateGermanPayroll2026,
  estimateGrossFromNet2026,
  GERMAN_PAYROLL_2026,
  type HealthInsuranceType,
  type TaxClass,
} from '@/lib/nettoBrutto2026';

type CalculationMode = 'brutto-to-netto' | 'netto-to-brutto';

const BUNDESLAENDER = [
  { value: 'BY', label: 'Bayern (Bavaria)', churchTaxRate: 0.08 },
  { value: 'BW', label: 'Baden-Wuerttemberg', churchTaxRate: 0.08 },
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
  { value: 'TH', label: 'Thueringen', churchTaxRate: 0.09 },
];

export default function NettoBruttoCalculatorPage() {
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

  const buildInput = (annualGross: number) => {
    const parsedChildren = Math.max(0, Math.min(5, parseInt(childrenCount || '0', 10) || 0));
    return {
      annualGross,
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

  const currentInput = parseFloat(mode === 'brutto-to-netto' ? bruttoSalary : nettoSalary) || 0;
  const annualInput = salaryPeriod === 'monthly' ? currentInput * 12 : currentInput;
  const annualGross = mode === 'brutto-to-netto'
    ? annualInput
    : estimateGrossFromNet2026(annualInput, buildInput(0));
  const result = calculateGermanPayroll2026(buildInput(annualGross));
  const annualNet = result.netto;
  const displayGross = salaryPeriod === 'monthly' ? annualGross / 12 : annualGross;
  const displayNet = salaryPeriod === 'monthly' ? annualNet / 12 : annualNet;
  const monthlyGross = annualGross / 12;
  const monthlyNet = annualNet / 12;
  const churchTaxRate = BUNDESLAENDER.find((item) => item.value === bundesland)?.churchTaxRate ?? 0.09;
  const primaryTitle = mode === 'brutto-to-netto'
    ? `Estimated ${salaryPeriod === 'monthly' ? 'Monthly' : 'Annual'} Net`
    : `Estimated ${salaryPeriod === 'monthly' ? 'Monthly' : 'Annual'} Gross`;
  const primaryValue = mode === 'brutto-to-netto' ? displayNet : displayGross;
  const primaryDetail = mode === 'brutto-to-netto'
    ? `${formatEuro(displayGross)} gross`
    : `${formatEuro(displayNet)} net`;
  const deductions = [
    { label: 'Income tax', amount: result.incomeTax, note: 'Lohnsteuer' },
    { label: 'Solidarity surcharge', amount: result.solidaritySurcharge, note: 'Soli' },
    { label: 'Church tax', amount: result.churchTaxAmount, note: churchTax ? `${Math.round(churchTaxRate * 100)}% of wage tax` : undefined },
    {
      label: 'Pension insurance',
      amount: result.pensionInsurance,
      note: pensionInsuranceMandatory ? `${formatRate(GERMAN_PAYROLL_2026.pensionEmployeeRate)} employee share` : 'Not applied',
    },
    {
      label: 'Unemployment insurance',
      amount: result.unemploymentInsurance,
      note: unemploymentInsuranceMandatory ? `${formatRate(GERMAN_PAYROLL_2026.unemploymentEmployeeRate)} employee share` : 'Not applied',
    },
    {
      label: healthInsuranceType === 'public' ? 'Health insurance' : 'Private health and care',
      amount: result.healthInsurance,
      note: healthInsuranceType === 'public' ? `${formatRate(result.healthEmployeeRate)} employee share` : 'Premium minus employer subsidy',
    },
    {
      label: 'Care insurance',
      amount: result.careInsurance,
      note: healthInsuranceType === 'public' ? `${formatRate(result.careEmployeeRate)} employee share` : 'Included above for private insurance',
    },
  ].filter((item) => item.amount > 0);
  const maxDeduction = Math.max(...deductions.map((item) => item.amount), 1);

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(221,0,0,0.08), transparent 24%), radial-gradient(circle at top right, rgba(124,58,237,0.08), transparent 22%), linear-gradient(180deg, #fff 0%, #faf8f6 100%)',
      }}
    >
      <SiteNav />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '114px 24px 80px' }}>
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)',
            gap: 24,
            marginBottom: 32,
            alignItems: 'stretch',
          }}
          className="salary-hero"
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(17,17,17,0.08)',
              borderRadius: 28,
              padding: 28,
              boxShadow: '0 24px 60px rgba(17,17,17,0.06)',
            }}
          >
            <Link
              href="/netto-brutto-calculator/landing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#666',
                textDecoration: 'none',
                fontSize: 14,
                marginBottom: 18,
              }}
            >
              <Home className="w-4 h-4" />
              Back to Salary Calculator Info
            </Link>

            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 26,
                  background: 'linear-gradient(145deg, #dd0000, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 16px 36px rgba(124,58,237,0.22)',
                  flexShrink: 0,
                }}
              >
                <Calculator className="w-9 h-9" style={{ color: '#fff' }} />
              </div>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                  <span style={badgeStyle('#fff2f2', '#c21313')}>2026 payroll rules</span>
                  <span style={badgeStyle('#f4f0ff', '#6d28d9')}>Germany employee estimate</span>
                  <span style={badgeStyle('#eefbf3', '#15803d')}>Official BMF basis</span>
                </div>
                <h1
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    lineHeight: 1,
                    fontWeight: 800,
                    color: '#0f0f10',
                    margin: '0 0 14px',
                  }}
                >
                  Netto-Brutto Calculator
                </h1>
                <p style={{ fontSize: 18, color: '#626262', lineHeight: 1.6, margin: '0 0 18px', maxWidth: 720 }}>
                  Enter your salary, choose your tax profile, and get a clean 2026 estimate without digging through payroll jargon first.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, color: '#4b5563', fontSize: 14 }}>
                  <span style={bulletItemStyle}>
                    <CheckCircle2 className="w-4 h-4" />
                    Essential inputs first
                  </span>
                  <span style={bulletItemStyle}>
                    <CheckCircle2 className="w-4 h-4" />
                    Advanced settings only if needed
                  </span>
                  <span style={bulletItemStyle}>
                    <CheckCircle2 className="w-4 h-4" />
                    Live estimate while you edit
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(180deg, #171717 0%, #242424 100%)',
              borderRadius: 28,
              padding: 28,
              color: '#fff',
              boxShadow: '0 26px 60px rgba(17,17,17,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Sparkles className="w-5 h-5" style={{ color: '#f9a8d4' }} />
              <span style={{ fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f0abfc', fontWeight: 700 }}>
                Better calculator flow
              </span>
            </div>
            <h2 style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 800, margin: '0 0 14px' }}>
              The page now starts with what most people actually know.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', margin: '0 0 18px' }}>
              Gross or net salary, tax class, state, health insurance, church tax, and children usually give a strong estimate. Less common payroll adjustments stay out of the way until you open Advanced.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={darkStatStyle}>
                <ShieldCheck className="w-5 h-5" style={{ color: '#86efac' }} />
                Uses the official 2026 tax tariff and current social contribution ceilings.
              </div>
              <div style={darkStatStyle}>
                <HeartPulse className="w-5 h-5" style={{ color: '#fca5a5' }} />
                Handles public and private health insurance differently, including the 2026 add-on rate.
              </div>
              <div style={darkStatStyle}>
                <Landmark className="w-5 h-5" style={{ color: '#c4b5fd' }} />
                State selection matters because church tax differs between 8% and 9%.
              </div>
            </div>
          </div>
        </header>

        <div
          className="salary-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(330px, 0.9fr)',
            gap: 28,
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'grid', gap: 24 }}>
            <section style={sectionCardStyle}>
              <div style={stepHeaderStyle}>
                <span style={stepPillStyle}>Step 1</span>
                <span style={helperTextStyle}>Choose what you want to convert</span>
              </div>
              <h2 style={sectionTitleStyle}>Start with the salary you know</h2>
              <p style={sectionDescriptionStyle}>
                Most people only need one number here. The estimate updates instantly as you change inputs.
              </p>

              <div className="two-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22 }}>
                <button onClick={() => setMode('brutto-to-netto')} style={toggleCardStyle(mode === 'brutto-to-netto')}>
                  <TrendingDown className="w-6 h-6" style={{ color: mode === 'brutto-to-netto' ? '#c21313' : '#707070' }} />
                  <div>
                    <div style={toggleTitleStyle(mode === 'brutto-to-netto')}>Gross to net</div>
                    <div style={toggleDescriptionStyle}>You know your salary before deductions.</div>
                  </div>
                </button>
                <button onClick={() => setMode('netto-to-brutto')} style={toggleCardStyle(mode === 'netto-to-brutto')}>
                  <TrendingUp className="w-6 h-6" style={{ color: mode === 'netto-to-brutto' ? '#c21313' : '#707070' }} />
                  <div>
                    <div style={toggleTitleStyle(mode === 'netto-to-brutto')}>Net to gross</div>
                    <div style={toggleDescriptionStyle}>You know what you want to take home.</div>
                  </div>
                </button>
              </div>

              <div
                style={{
                  marginTop: 20,
                  padding: 22,
                  borderRadius: 22,
                  background: 'linear-gradient(180deg, #fffaf7 0%, #ffffff 100%)',
                  border: '1px solid rgba(221,0,0,0.08)',
                }}
              >
                <div
                  className="salary-input-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) auto',
                    gap: 16,
                    alignItems: 'end',
                  }}
                >
                  <Field
                    label={mode === 'brutto-to-netto' ? 'Gross salary' : 'Net salary'}
                    hint={salaryPeriod === 'monthly' ? 'Per month' : 'Per year'}
                  >
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        value={mode === 'brutto-to-netto' ? bruttoSalary : nettoSalary}
                        onChange={(event) => (
                          mode === 'brutto-to-netto'
                            ? setBruttoSalary(event.target.value)
                            : setNettoSalary(event.target.value)
                        )}
                        style={amountInputStyle}
                        placeholder={mode === 'brutto-to-netto' ? '50000' : '3200'}
                      />
                      <span style={currencyTagStyle}>EUR</span>
                    </div>
                  </Field>

                  <div>
                    <div style={tinyLabelStyle}>Period</div>
                    <div style={segmentedStyle}>
                      <button onClick={() => setSalaryPeriod('monthly')} style={pillStyle(salaryPeriod === 'monthly')}>
                        Monthly
                      </button>
                      <button onClick={() => setSalaryPeriod('annual')} style={pillStyle(salaryPeriod === 'annual')}>
                        Annual
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={stepHeaderStyle}>
                <span style={stepPillStyle}>Step 2</span>
                <span style={helperTextStyle}>Set the inputs that drive the estimate most</span>
              </div>
              <h2 style={sectionTitleStyle}>Your core tax profile</h2>
              <p style={sectionDescriptionStyle}>
                These are the same core inputs the major German salary calculators ask for first.
              </p>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 22 }}>
                <Field label="Tax class" hint={taxClassLabel(taxClass)}>
                  <select value={taxClass} onChange={(event) => setTaxClass(event.target.value as TaxClass)} style={selectStyle}>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                  </select>
                </Field>

                <Field label="Federal state" hint={`Church tax is ${Math.round(churchTaxRate * 100)}% here`}>
                  <select value={bundesland} onChange={(event) => setBundesland(event.target.value)} style={selectStyle}>
                    {BUNDESLAENDER.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Children under 25" hint="Relevant for care insurance">
                  <select value={childrenCount} onChange={(event) => setChildrenCount(event.target.value)} style={selectStyle}>
                    {[0, 1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Church tax" hint={churchTax ? 'Included in estimate' : 'Not applied'}>
                  <div style={segmentedStyle}>
                    <button onClick={() => setChurchTax(false)} style={pillStyle(!churchTax)}>
                      No
                    </button>
                    <button onClick={() => setChurchTax(true)} style={pillStyle(churchTax)}>
                      Yes
                    </button>
                  </div>
                </Field>
              </div>

              <div
                style={{
                  marginTop: 22,
                  padding: 20,
                  borderRadius: 22,
                  border: '1px solid rgba(17,17,17,0.08)',
                  background: '#fcfcfc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={tinyLabelStyle}>Health insurance</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>Choose your insurance setup</div>
                  </div>
                  <HeartPulse className="w-6 h-6" style={{ color: '#dd0000' }} />
                </div>

                <div className="two-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <button onClick={() => setHealthInsuranceType('public')} style={toggleCardStyle(healthInsuranceType === 'public')}>
                    <div>
                      <div style={toggleTitleStyle(healthInsuranceType === 'public')}>Public insurance</div>
                      <div style={toggleDescriptionStyle}>Use the employee share plus your add-on rate.</div>
                    </div>
                  </button>
                  <button onClick={() => setHealthInsuranceType('private')} style={toggleCardStyle(healthInsuranceType === 'private')}>
                    <div>
                      <div style={toggleTitleStyle(healthInsuranceType === 'private')}>Private insurance</div>
                      <div style={toggleDescriptionStyle}>Enter your monthly premium and subsidy.</div>
                    </div>
                  </button>
                </div>

                {healthInsuranceType === 'public' ? (
                  <div style={{ marginTop: 16 }}>
                    <Field label="Additional health rate" hint="Average published for 2026: 2.9%">
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          step="0.1"
                          value={healthInsuranceRate}
                          onChange={(event) => setHealthInsuranceRate(event.target.value)}
                          style={inputStyle}
                        />
                        <span style={suffixStyle}>%</span>
                      </div>
                    </Field>
                  </div>
                ) : (
                  <div className="two-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                    <Field label="Monthly private premium" hint="Health plus care insurance">
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          value={privateHealthAndCareMonthly}
                          onChange={(event) => setPrivateHealthAndCareMonthly(event.target.value)}
                          placeholder="450"
                          style={inputStyle}
                        />
                        <span style={suffixStyle}>EUR</span>
                      </div>
                    </Field>
                    <Field label="Employer subsidy" hint="Monthly subsidy">
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          value={privateEmployerSubsidyMonthly}
                          onChange={(event) => setPrivateEmployerSubsidyMonthly(event.target.value)}
                          placeholder="225"
                          style={inputStyle}
                        />
                        <span style={suffixStyle}>EUR</span>
                      </div>
                    </Field>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: 18,
                  padding: 16,
                  borderRadius: 18,
                  background: '#faf7ff',
                  border: '1px solid rgba(124,58,237,0.12)',
                  color: '#5b5568',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                The fields above cover the inputs most employees need. Open Advanced only if you already know special payroll details like child allowance, extra tax allowances, or insurance exemptions.
              </div>
            </section>

            <section style={sectionCardStyle}>
              <button
                onClick={() => setShowAdvanced((current) => !current)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={stepHeaderStyle}>
                    <span style={stepPillStyle}>Advanced</span>
                    <span style={helperTextStyle}>Only for fine-tuning</span>
                  </div>
                  <h2 style={{ ...sectionTitleStyle, marginBottom: 8 }}>
                    Payroll details most people can skip
                  </h2>
                  <p style={{ ...sectionDescriptionStyle, marginBottom: 0 }}>
                    Open this if you have private insurer subsidy details, child allowance, tax allowances, or special insurance treatment.
                  </p>
                </div>
                {showAdvanced ? <ChevronUp className="w-6 h-6" style={{ color: '#111' }} /> : <ChevronDown className="w-6 h-6" style={{ color: '#111' }} />}
              </button>

              {showAdvanced && (
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                  <Field label="Tax child allowance" hint="Usually 0.5 per parent and child">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={taxChildAllowance}
                      onChange={(event) => setTaxChildAllowance(event.target.value)}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Birth year" hint="Used for 64+ tax relief">
                    <input
                      type="number"
                      value={birthYear}
                      onChange={(event) => setBirthYear(event.target.value)}
                      placeholder="1961"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Annual tax allowance" hint="Freibetrag">
                    <input
                      type="number"
                      value={annualTaxAllowance}
                      onChange={(event) => setAnnualTaxAllowance(event.target.value)}
                      placeholder="0"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Annual tax addition" hint="Hinzurechnung">
                    <input
                      type="number"
                      value={annualTaxAddition}
                      onChange={(event) => setAnnualTaxAddition(event.target.value)}
                      placeholder="0"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Childless care surcharge" hint="Usually yes if 23+ and no children">
                    <div style={segmentedStyle}>
                      <button onClick={() => setChildlessCareSurcharge(false)} style={pillStyle(!childlessCareSurcharge)}>
                        Off
                      </button>
                      <button onClick={() => setChildlessCareSurcharge(true)} style={pillStyle(childlessCareSurcharge)}>
                        On
                      </button>
                    </div>
                  </Field>

                  <Field label="Pension insurance" hint="Employee statutory share">
                    <div style={segmentedStyle}>
                      <button onClick={() => setPensionInsuranceMandatory(true)} style={pillStyle(pensionInsuranceMandatory)}>
                        Included
                      </button>
                      <button onClick={() => setPensionInsuranceMandatory(false)} style={pillStyle(!pensionInsuranceMandatory)}>
                        Exempt
                      </button>
                    </div>
                  </Field>

                  <Field label="Unemployment insurance" hint="Employee statutory share">
                    <div style={segmentedStyle}>
                      <button onClick={() => setUnemploymentInsuranceMandatory(true)} style={pillStyle(unemploymentInsuranceMandatory)}>
                        Included
                      </button>
                      <button onClick={() => setUnemploymentInsuranceMandatory(false)} style={pillStyle(!unemploymentInsuranceMandatory)}>
                        Exempt
                      </button>
                    </div>
                  </Field>
                </div>
              )}
            </section>
          </div>

          <aside style={{ position: 'sticky', top: 108, display: 'grid', gap: 20 }}>
            <section
              style={{
                borderRadius: 28,
                padding: 28,
                color: '#fff',
                background: 'linear-gradient(145deg, #111111 0%, #8b1dff 100%)',
                boxShadow: '0 24px 70px rgba(80, 0, 140, 0.22)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.76 }}>
                    Live estimate
                  </div>
                  <div style={{ fontSize: 15, opacity: 0.84, marginTop: 6 }}>{primaryTitle}</div>
                </div>
                <span style={{ ...badgeStyle('rgba(255,255,255,0.12)', '#fff'), border: '1px solid rgba(255,255,255,0.12)' }}>
                  2026
                </span>
              </div>

              <div style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 0.95, fontWeight: 800, marginBottom: 10 }}>
                {formatEuro(primaryValue)}
              </div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', marginBottom: 22 }}>
                {primaryDetail} for the selected {salaryPeriod} view
              </div>

              <div className="result-stat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={resultStatStyle}>
                  <div style={resultStatLabelStyle}>Annual gross</div>
                  <div style={resultStatValueStyle}>{formatEuro(annualGross)}</div>
                </div>
                <div style={resultStatStyle}>
                  <div style={resultStatLabelStyle}>Annual net</div>
                  <div style={resultStatValueStyle}>{formatEuro(annualNet)}</div>
                </div>
                <div style={resultStatStyle}>
                  <div style={resultStatLabelStyle}>Monthly gross</div>
                  <div style={resultStatValueStyle}>{formatEuro(monthlyGross)}</div>
                </div>
                <div style={resultStatStyle}>
                  <div style={resultStatLabelStyle}>Monthly net</div>
                  <div style={resultStatValueStyle}>{formatEuro(monthlyNet)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                <span style={ghostPillStyle}>Tax class {taxClass}</span>
                <span style={ghostPillStyle}>{BUNDESLAENDER.find((item) => item.value === bundesland)?.label ?? bundesland}</span>
                <span style={ghostPillStyle}>{healthInsuranceType === 'public' ? 'Public insurance' : 'Private insurance'}</span>
                <span style={ghostPillStyle}>{churchTax ? `Church tax ${Math.round(churchTaxRate * 100)}%` : 'No church tax'}</span>
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
                <div>
                  <h2 style={sectionTitleStyle}>Where the money goes</h2>
                  <p style={{ ...sectionDescriptionStyle, marginBottom: 0 }}>
                    Employee deductions for the selected annual estimate.
                  </p>
                </div>
                <span style={badgeStyle('#f5f3ff', '#6d28d9')}>{formatRate(result.effectiveRate / 100)} total</span>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {deductions.map((item) => (
                  <div key={item.label} style={{ padding: '14px 0', borderBottom: '1px solid rgba(17,17,17,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#18181b' }}>{item.label}</div>
                        {item.note ? <div style={{ fontSize: 12, color: '#7a7a7a', marginTop: 3 }}>{item.note}</div> : null}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#c21313', whiteSpace: 'nowrap' }}>
                        {formatEuro(item.amount)}
                      </div>
                    </div>
                    <div style={{ height: 9, borderRadius: 999, background: '#f2f2f2', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.max(6, (item.amount / maxDeduction) * 100)}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: 'linear-gradient(90deg, #dd0000, #7c3aed)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: '1px solid rgba(17,17,17,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: '#777' }}>Total deductions</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{formatEuro(result.totalDeductions)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#777' }}>Take-home ratio</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#16a34a' }}>
                    {formatRate(annualGross > 0 ? annualNet / annualGross : 0)}
                  </div>
                </div>
              </div>
            </section>

            <section
              style={{
                borderRadius: 24,
                padding: 24,
                background: 'linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%)',
                border: '1px solid rgba(59,130,246,0.14)',
              }}
            >
              <div style={{ display: 'flex', gap: 12 }}>
                <Info className="w-5 h-5" style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 10px' }}>What this estimate uses</h3>
                  <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: '0 0 12px' }}>
                    Official 2026 BMF wage-tax tariff, 2026 contribution ceilings, state-based church tax, public vs private insurance logic, and employee-side social insurance rates.
                  </p>
                  <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                    This layout follows what strong German salary calculators surface first: salary, period, tax class, state, health insurance, church tax, and children. Less common corrections stay in Advanced so the page stays usable.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1100px) {
          .salary-hero,
          .salary-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 860px) {
          .form-grid,
          .two-up,
          .result-stat-grid,
          .salary-input-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <div>
        <div style={tinyLabelStyle}>{label}</div>
        {hint ? <div style={{ fontSize: 12, color: '#8a8a8a', marginTop: 3 }}>{hint}</div> : null}
      </div>
      {children}
    </label>
  );
}

function formatEuro(value: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatRate(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function taxClassLabel(taxClass: TaxClass) {
  const labels: Record<TaxClass, string> = {
    '1': 'Single',
    '2': 'Single parent',
    '3': 'Married, higher earner',
    '4': 'Married, similar income',
    '5': 'Married, lower earner',
    '6': 'Second job',
  };
  return labels[taxClass];
}

const sectionCardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(17,17,17,0.08)',
  borderRadius: 28,
  padding: 28,
  boxShadow: '0 20px 54px rgba(17,17,17,0.05)',
};

const stepHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 14,
  flexWrap: 'wrap',
};

const stepPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 10px',
  borderRadius: 999,
  background: '#fff1f1',
  color: '#c21313',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#707070',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 800,
  color: '#111',
  margin: '0 0 10px',
};

const sectionDescriptionStyle: React.CSSProperties = {
  fontSize: 15,
  color: '#6a6a6a',
  lineHeight: 1.7,
  margin: 0,
};

const tinyLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#707070',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 54,
  padding: '14px 16px',
  borderRadius: 16,
  border: '1px solid rgba(17,17,17,0.1)',
  background: '#fff',
  color: '#111',
  fontSize: 16,
  outline: 'none',
};

const amountInputStyle: React.CSSProperties = {
  ...inputStyle,
  paddingRight: 70,
  fontSize: 28,
  fontWeight: 800,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

const segmentedStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: 6,
  borderRadius: 16,
  background: '#f4f4f5',
  border: '1px solid rgba(17,17,17,0.06)',
};

const currencyTagStyle: React.CSSProperties = {
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#8a8a8a',
};

const suffixStyle: React.CSSProperties = {
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#8a8a8a',
  pointerEvents: 'none',
};

const bulletItemStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const darkStatStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: 'rgba(255,255,255,0.82)',
  fontSize: 14,
  lineHeight: 1.6,
};

const resultStatStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: 'rgba(255,255,255,0.11)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const resultStatLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 8,
};

const resultStatValueStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: '#fff',
};

const ghostPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: 999,
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: 13,
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 16px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
    color: active ? '#fff' : '#535353',
    background: active ? 'linear-gradient(135deg, #dd0000, #7c3aed)' : 'transparent',
    boxShadow: active ? '0 12px 28px rgba(124,58,237,0.2)' : 'none',
  };
}

function toggleCardStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: 18,
    borderRadius: 20,
    border: active ? '1.5px solid rgba(194,19,19,0.3)' : '1px solid rgba(17,17,17,0.08)',
    background: active ? 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)' : '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: active ? '0 18px 40px rgba(221,0,0,0.08)' : 'none',
  };
}

function toggleTitleStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 18,
    fontWeight: 800,
    color: active ? '#c21313' : '#111',
    marginBottom: 6,
  };
}

const toggleDescriptionStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6d6d6d',
  lineHeight: 1.6,
};

function badgeStyle(background: string, color: string): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: 999,
    background,
    color,
    fontSize: 13,
    fontWeight: 700,
  };
}
