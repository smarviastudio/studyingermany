// Shared FAQ content for the German Tax Calculator page.
// Used both for the visible FAQ section (page.tsx) and the FAQPage JSON-LD (layout.tsx),
// so the structured data always matches what users see.

export const TAX_CALCULATOR_FAQS = [
  {
    q: 'How much tax do I pay in Germany?',
    a: 'German income tax is progressive: 0% on the first €12,348 of taxable income (the 2026 tax-free allowance), then rising from 14% to 42% for income just under €70,000, with a 45% top rate on very high incomes. On top of income tax, employees pay social contributions (pension, health, unemployment and care insurance). In total, most full-time employees keep roughly 58–65% of their gross salary — use the calculator above to see your exact number.',
  },
  {
    q: 'What is the difference between Brutto and Netto salary?',
    a: 'Brutto (gross) is your salary before deductions — the number in your work contract. Netto (net) is what actually arrives in your bank account after income tax, solidarity surcharge, church tax (if applicable) and social security contributions. In Germany the difference is significant: typically 35–45% of gross salary goes to taxes and contributions.',
  },
  {
    q: 'Which social contributions are deducted from my German salary?',
    a: 'In 2026, employees pay 9.3% pension insurance (up to €101,400 income ceiling), about 8.75% health insurance (7.3% base + half of the average 2.9% additional rate, up to €69,750 ceiling), 1.3% unemployment insurance, and 1.8–2.4% long-term care insurance (childless employees over 23 pay a surcharge). Your employer pays roughly the same amounts on top of your gross salary.',
  },
  {
    q: 'What are the German tax classes (Steuerklasse)?',
    a: 'Germany has 6 tax classes: Class 1 (single), Class 2 (single parents), Class 3 (married, higher earner), Class 4 (married, equal earners), Class 5 (married, lower earner), and Class 6 (second job). Your class only changes your monthly withholding, not the total yearly tax — differences are settled with your annual tax return. The calculator supports all 6 classes.',
  },
  {
    q: 'How much tax do international students pay in Germany?',
    a: 'Working students (Werkstudent, up to 20 hours/week during the semester) pay the same income tax rules as everyone else — but if you earn below the tax-free allowance of €12,348/year (2026), you pay little or no income tax and usually only contribute to pension insurance. Mini-jobs up to €603/month (2026) are tax-free for you as the employee.',
  },
  {
    q: 'What is a good salary in Germany in 2026?',
    a: 'The average gross salary for full-time employees is around €50,000–55,000 per year; the median is lower. Tech, engineering and finance roles in cities like Munich or Frankfurt often pay €60,000–80,000+, while typical entry-level graduate positions start around €40,000–50,000. Remember to compare net salaries — cost of living and tax class change the picture.',
  },
  {
    q: 'Do I need to pay church tax in Germany?',
    a: 'Church tax (Kirchensteuer) only applies if you are a registered member of a tax-collecting religious community (Catholic, Protestant, or Jewish). It is 8% of your income tax in Bavaria and Baden-Württemberg and 9% in all other states. If you are not registered, you pay nothing — toggle it in the calculator to see the difference.',
  },
  {
    q: 'Is this German tax calculator up to date for 2026?',
    a: 'Yes. The calculator uses the official 2026 German payroll parameters (BMF): €12,348 basic tax-free allowance, updated contribution ceilings (€101,400 pension / €69,750 health), current social insurance rates and all 6 tax classes, for every federal state including the Saxony care-insurance difference.',
  },
] as const;
