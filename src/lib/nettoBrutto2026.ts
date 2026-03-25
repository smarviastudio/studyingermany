export type TaxClass = '1' | '2' | '3' | '4' | '5' | '6';
export type HealthInsuranceType = 'public' | 'private';

export type CalculatorInput2026 = {
  annualGross: number;
  taxClass: TaxClass;
  stateCode: string;
  churchTax: boolean;
  healthInsuranceType: HealthInsuranceType;
  publicHealthAdditionalRate: number;
  privateHealthAndCareMonthly: number;
  privateEmployerSubsidyMonthly: number;
  childrenCount: number;
  taxChildAllowance: number;
  childlessCareSurcharge: boolean;
  birthYear?: number;
  annualTaxAllowance: number;
  annualTaxAddition: number;
  pensionInsuranceMandatory: boolean;
  unemploymentInsuranceMandatory: boolean;
};

export type CalculatorResult2026 = {
  annualGross: number;
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
  taxableIncomeForWageTax: number;
  wageTaxBase: number;
  careEmployeeRate: number;
  healthEmployeeRate: number;
};

export const GERMAN_PAYROLL_2026 = {
  year: 2026,
  pensionContributionCeilingAnnual: 101400,
  healthContributionCeilingAnnual: 69750,
  pensionEmployeeRate: 0.093,
  unemploymentEmployeeRate: 0.013,
  actualPublicHealthEmployeeBaseRate: 0.073,
  taxAllowancePublicHealthEmployeeBaseRate: 0.07,
  solidarityFreeLimit: 20350,
  basicAllowance: 12348,
  employeeExpenseAllowance: 1230,
  specialExpenseAllowance: 36,
  singleParentRelief: 4260,
  childAllowancePerChild: 9756,
  childAllowanceClass4PerChild: 4878,
  class5Threshold1: 14071,
  class5Threshold2: 34939,
  class5Threshold3: 222260,
} as const;

const AGE_RELIEF_RATES = [
  0,
  0.4, 0.384, 0.368, 0.352, 0.336, 0.32, 0.304, 0.288, 0.272, 0.256, 0.24,
  0.224, 0.208, 0.192, 0.176, 0.16, 0.152, 0.144, 0.14, 0.136, 0.132, 0.128,
  0.124, 0.12, 0.116, 0.112, 0.108, 0.104, 0.1, 0.096, 0.092, 0.088, 0.084,
  0.08, 0.076, 0.072, 0.068, 0.064, 0.06, 0.056, 0.052, 0.048, 0.044, 0.04,
  0.036, 0.032, 0.028, 0.024, 0.02, 0.016, 0.012, 0.008, 0.004, 0,
] as const;

const AGE_RELIEF_CAPS = [
  0,
  1900, 1824, 1748, 1672, 1596, 1520, 1444, 1368, 1292, 1216, 1140, 1064,
  988, 912, 836, 760, 722, 684, 665, 646, 627, 608, 589, 570, 551, 532, 513,
  494, 475, 456, 437, 418, 399, 380, 361, 342, 323, 304, 285, 266, 247, 228,
  209, 190, 171, 152, 133, 114, 95, 76, 57, 38, 19, 0,
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function floorEuro(value: number) {
  return Math.floor(value);
}

function ceilEuro(value: number) {
  return Math.ceil(value);
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function getAgeRelief(birthYear: number | undefined, annualGross: number) {
  if (!birthYear) return 0;

  // BMF PAP input AJAHR is the year after the employee turned 64.
  const ajahr = birthYear + 65;
  if (ajahr > GERMAN_PAYROLL_2026.year) return 0;

  const index = clamp(ajahr < 2006 ? 1 : ajahr - 2004, 1, 54);
  const relief = ceilEuro(annualGross * AGE_RELIEF_RATES[index]);
  return Math.min(relief, AGE_RELIEF_CAPS[index]);
}

function getCareEmployeeRate(stateCode: string, childrenCount: number, childlessCareSurcharge: boolean) {
  const isSaxony = stateCode === 'SN';
  let rate = isSaxony ? 0.023 : 0.018;

  if (childrenCount <= 0) {
    if (childlessCareSurcharge) rate += 0.006;
    return rate;
  }

  const discountSteps = clamp(childrenCount - 1, 0, 4);
  rate -= discountSteps * 0.0025;
  return Math.max(rate, 0);
}

function calculateTariff2026(x: number) {
  if (x <= GERMAN_PAYROLL_2026.basicAllowance) return 0;

  if (x < 17800) {
    const y = (x - GERMAN_PAYROLL_2026.basicAllowance) / 10000;
    return floorEuro((914.51 * y + 1400) * y);
  }

  if (x < 69879) {
    const y = (x - 17799) / 10000;
    return floorEuro(((173.1 * y + 2397) * y) + 1034.87);
  }

  if (x < 277826) {
    return floorEuro((x * 0.42) - 11135.63);
  }

  return floorEuro((x * 0.45) - 19470.38);
}

function calculateClass5Or6Tax(x: number) {
  const up56 = (zx: number) => {
    const st1 = calculateTariff2026(floorEuro(zx * 1.25));
    const st2 = calculateTariff2026(floorEuro(zx * 0.75));
    const diff = (st1 - st2) * 2;
    const minimumTax = floorEuro(zx * 0.14);
    return Math.max(diff, minimumTax);
  };

  if (x > GERMAN_PAYROLL_2026.class5Threshold2) {
    let tax = up56(GERMAN_PAYROLL_2026.class5Threshold2);

    if (x > GERMAN_PAYROLL_2026.class5Threshold3) {
      tax = floorEuro(
        tax
        + ((GERMAN_PAYROLL_2026.class5Threshold3 - GERMAN_PAYROLL_2026.class5Threshold2) * 0.42)
        + ((x - GERMAN_PAYROLL_2026.class5Threshold3) * 0.45)
      );
    } else {
      tax = floorEuro(tax + ((x - GERMAN_PAYROLL_2026.class5Threshold2) * 0.42));
    }

    return tax;
  }

  let tax = up56(x);

  if (x > GERMAN_PAYROLL_2026.class5Threshold1) {
    const comparisonTax = tax;
    const thresholdTax = up56(GERMAN_PAYROLL_2026.class5Threshold1);
    const highTax = floorEuro(thresholdTax + ((x - GERMAN_PAYROLL_2026.class5Threshold1) * 0.42));
    tax = Math.min(comparisonTax, highTax);
  }

  return tax;
}

function calculateAnnualWageTax(
  wageTaxBase: number,
  taxClass: TaxClass,
) {
  const splittingFactor = taxClass === '3' ? 2 : 1;
  const x = floorEuro(Math.max(0, wageTaxBase / splittingFactor));

  if (taxClass === '5' || taxClass === '6') {
    return calculateClass5Or6Tax(x);
  }

  return calculateTariff2026(x) * splittingFactor;
}

function getChildAllowanceAmount(taxClass: TaxClass, taxChildAllowance: number) {
  if (taxChildAllowance <= 0) return 0;
  if (taxClass === '4') return floorEuro(taxChildAllowance * GERMAN_PAYROLL_2026.childAllowanceClass4PerChild);
  if (taxClass === '1' || taxClass === '2' || taxClass === '3') {
    return floorEuro(taxChildAllowance * GERMAN_PAYROLL_2026.childAllowancePerChild);
  }
  return 0;
}

function getActualSocialContributions(input: CalculatorInput2026, careEmployeeRate: number) {
  const annualGross = Math.max(0, input.annualGross);
  const pensionBase = Math.min(annualGross, GERMAN_PAYROLL_2026.pensionContributionCeilingAnnual);
  const healthBase = Math.min(annualGross, GERMAN_PAYROLL_2026.healthContributionCeilingAnnual);

  const pensionInsurance = input.pensionInsuranceMandatory
    ? pensionBase * GERMAN_PAYROLL_2026.pensionEmployeeRate
    : 0;

  const unemploymentInsurance = input.unemploymentInsuranceMandatory
    ? pensionBase * GERMAN_PAYROLL_2026.unemploymentEmployeeRate
    : 0;

  let healthInsurance = 0;
  let careInsurance = 0;
  let healthEmployeeRate = 0;

  if (input.healthInsuranceType === 'private') {
    healthInsurance = Math.max(0, (input.privateHealthAndCareMonthly - input.privateEmployerSubsidyMonthly) * 12);
  } else {
    healthEmployeeRate = GERMAN_PAYROLL_2026.actualPublicHealthEmployeeBaseRate + (input.publicHealthAdditionalRate / 200);
    healthInsurance = healthBase * healthEmployeeRate;
    careInsurance = healthBase * careEmployeeRate;
  }

  return {
    pensionInsurance: roundMoney(pensionInsurance),
    unemploymentInsurance: roundMoney(unemploymentInsurance),
    healthInsurance: roundMoney(healthInsurance),
    careInsurance: roundMoney(careInsurance),
    healthEmployeeRate,
  };
}

function getVorsorgeAllowance(
  input: CalculatorInput2026,
  annualGross: number,
  careEmployeeRate: number,
) {
  const pensionBase = Math.min(annualGross, GERMAN_PAYROLL_2026.pensionContributionCeilingAnnual);
  const healthBase = Math.min(annualGross, GERMAN_PAYROLL_2026.healthContributionCeilingAnnual);
  const pensionAllowance = input.pensionInsuranceMandatory
    ? pensionBase * GERMAN_PAYROLL_2026.pensionEmployeeRate
    : 0;

  let healthAndCareAllowance = 0;

  if (input.healthInsuranceType === 'private') {
    healthAndCareAllowance = Math.max(0, (input.privateHealthAndCareMonthly - input.privateEmployerSubsidyMonthly) * 12);
  } else {
    const taxHealthRate = GERMAN_PAYROLL_2026.taxAllowancePublicHealthEmployeeBaseRate + (input.publicHealthAdditionalRate / 200);
    healthAndCareAllowance = healthBase * (taxHealthRate + careEmployeeRate);
  }

  let vsp = ceilEuro(pensionAllowance + healthAndCareAllowance);

  if (input.unemploymentInsuranceMandatory && input.taxClass !== '6') {
    const unemploymentAllowance = pensionBase * GERMAN_PAYROLL_2026.unemploymentEmployeeRate;
    const cappedNonPension = Math.min(1900, unemploymentAllowance + healthAndCareAllowance);
    const alternative = ceilEuro(pensionAllowance + cappedNonPension);
    vsp = Math.max(vsp, alternative);
  }

  return vsp;
}

export function calculateGermanPayroll2026(input: CalculatorInput2026): CalculatorResult2026 {
  const annualGross = Math.max(0, input.annualGross);
  const careEmployeeRate = getCareEmployeeRate(input.stateCode, input.childrenCount, input.childlessCareSurcharge && input.childrenCount === 0);
  const social = getActualSocialContributions(input, careEmployeeRate);
  const ageRelief = getAgeRelief(input.birthYear, annualGross);
  const annualTaxAllowance = Math.max(0, input.annualTaxAllowance);
  const annualTaxAddition = Math.max(0, input.annualTaxAddition);
  const specialExpenseAllowance = input.taxClass === '6' ? 0 : GERMAN_PAYROLL_2026.specialExpenseAllowance;
  const employeeExpenseAllowance = input.taxClass === '6'
    ? 0
    : Math.min(GERMAN_PAYROLL_2026.employeeExpenseAllowance, annualGross);
  const singleParentRelief = input.taxClass === '2' ? GERMAN_PAYROLL_2026.singleParentRelief : 0;
  const vorsorgeAllowance = getVorsorgeAllowance(input, annualGross, careEmployeeRate);

  const zre4 = Math.max(0, annualGross - ageRelief - annualTaxAllowance + annualTaxAddition);
  const ztabfb = employeeExpenseAllowance + specialExpenseAllowance + singleParentRelief;
  const wageTaxBase = Math.max(0, zre4 - ztabfb - vorsorgeAllowance);
  const incomeTax = calculateAnnualWageTax(wageTaxBase, input.taxClass);

  const childAllowanceAmount = getChildAllowanceAmount(input.taxClass, input.taxChildAllowance);
  const solidarityBaseTax = childAllowanceAmount > 0
    ? calculateAnnualWageTax(Math.max(0, wageTaxBase - childAllowanceAmount), input.taxClass)
    : incomeTax;

  const solidarityThreshold = GERMAN_PAYROLL_2026.solidarityFreeLimit * (input.taxClass === '3' ? 2 : 1);
  const solidaritySurcharge = solidarityBaseTax > solidarityThreshold
    ? roundMoney(Math.min(
        solidarityBaseTax * 0.055,
        (solidarityBaseTax - solidarityThreshold) * 0.119,
      ))
    : 0;

  const churchTaxRate = input.stateCode === 'BY' || input.stateCode === 'BW' ? 0.08 : 0.09;
  const churchTaxAmount = input.churchTax ? roundMoney(solidarityBaseTax * churchTaxRate) : 0;
  const totalDeductions = roundMoney(
    social.pensionInsurance
    + social.unemploymentInsurance
    + social.healthInsurance
    + social.careInsurance
    + incomeTax
    + solidaritySurcharge
    + churchTaxAmount
  );
  const netto = roundMoney(annualGross - totalDeductions);

  return {
    annualGross: roundMoney(annualGross),
    netto,
    incomeTax: roundMoney(incomeTax),
    solidaritySurcharge,
    churchTaxAmount,
    pensionInsurance: social.pensionInsurance,
    unemploymentInsurance: social.unemploymentInsurance,
    healthInsurance: social.healthInsurance,
    careInsurance: social.careInsurance,
    totalDeductions,
    effectiveRate: annualGross > 0 ? (totalDeductions / annualGross) * 100 : 0,
    taxableIncomeForWageTax: roundMoney(zre4),
    wageTaxBase: roundMoney(wageTaxBase),
    careEmployeeRate,
    healthEmployeeRate: social.healthEmployeeRate,
  };
}

export function estimateGrossFromNet2026(
  targetAnnualNet: number,
  input: Omit<CalculatorInput2026, 'annualGross'>,
) {
  let low = Math.max(0, targetAnnualNet);
  let high = Math.max(12000, targetAnnualNet * 2.2);

  while (calculateGermanPayroll2026({ ...input, annualGross: high }).netto < targetAnnualNet) {
    high *= 1.35;
    if (high > 2_000_000) break;
  }

  for (let i = 0; i < 70; i += 1) {
    const mid = (low + high) / 2;
    const result = calculateGermanPayroll2026({ ...input, annualGross: mid });

    if (Math.abs(result.netto - targetAnnualNet) < 0.5) {
      return roundMoney(mid);
    }

    if (result.netto < targetAnnualNet) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return roundMoney((low + high) / 2);
}
