'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { 
  Calculator, Euro, CheckCircle2, 
  ArrowRight, Briefcase, PiggyBank, FileText,
  ChevronDown, Building2, TrendingUp, Wallet
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FEATURES = [
  {
    icon: Calculator,
    title: 'Accurate Calculations',
    description: 'Calculate your net salary from gross income including all German taxes and social contributions.'
  },
  {
    icon: Euro,
    title: '2024/2025 Tax Rates',
    description: 'Updated with the latest German income tax brackets, solidarity surcharge, and church tax rates.'
  },
  {
    icon: PiggyBank,
    title: 'Social Contributions',
    description: 'Includes health insurance, pension, unemployment, and nursing care insurance deductions.'
  },
  {
    icon: FileText,
    title: 'Detailed Breakdown',
    description: 'See exactly where your money goes with a complete breakdown of all deductions.'
  }
];

const FAQS = [
  {
    q: 'How is salary calculated in Germany?',
    a: 'German salaries are typically quoted as gross (Brutto) annual amounts. From this, various deductions are made: income tax (Lohnsteuer), solidarity surcharge (Solidaritätszuschlag), church tax (if applicable), and social security contributions (health, pension, unemployment, and nursing care insurance). Our calculator shows you the exact net (Netto) amount you\'ll receive.'
  },
  {
    q: 'What is the difference between Brutto and Netto salary?',
    a: 'Brutto (gross) is your total salary before any deductions. Netto (net) is what you actually receive in your bank account after all taxes and social contributions are deducted. In Germany, the difference can be significant — typically 35-45% of your gross salary goes to taxes and social contributions.'
  },
  {
    q: 'What are the German tax classes (Steuerklasse)?',
    a: 'Germany has 6 tax classes: Class 1 (single), Class 2 (single parents), Class 3 (married, higher earner), Class 4 (married, equal earners), Class 5 (married, lower earner), and Class 6 (second job). Your tax class significantly affects your monthly net salary. Our calculator lets you select your tax class for accurate results.'
  },
  {
    q: 'How much tax do international students pay in Germany?',
    a: 'International students working part-time (up to 20 hours/week during semester) pay the same taxes as German residents. If you earn below the tax-free allowance (Grundfreibetrag) of approximately €11,604/year in 2024, you may pay little to no income tax. Mini-jobs up to €520/month are tax-free.'
  },
  {
    q: 'What is the average salary in Germany?',
    a: 'The average gross salary in Germany is approximately €50,000-55,000 per year. However, this varies significantly by industry, location, and experience. Tech and engineering roles in cities like Munich often pay €60,000-80,000+, while entry-level positions may start around €35,000-45,000.'
  },
  {
    q: 'Do I need to pay church tax in Germany?',
    a: 'Church tax (Kirchensteuer) is only paid if you\'re a registered member of a recognized religious community (Catholic, Protestant, or Jewish). It\'s 8-9% of your income tax depending on the state. If you\'re not a member, you don\'t pay this tax. Our calculator lets you toggle this option.'
  }
];

const STATS = [
  { num: '50,000+', label: 'Calculations Done' },
  { num: '2024', label: 'Tax Rates Updated' },
  { num: '100%', label: 'Free to Use' }
];

export default function SalaryCalculatorLanding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/netto-brutto-calculator');
    }
  }, [status, session, router]);

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">Loading...</p>
      </div>
    );
  }

  // Don't render landing page if already authenticated
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">Redirecting to Salary Calculator...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.06),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              German Salary Calculator
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Calculate Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500"> German Net Salary</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Convert your gross salary (Brutto) to net salary (Netto) with our German tax calculator. 
              See exactly how much you'll take home after taxes and social contributions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/netto-brutto-calculator" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30 hover:-translate-y-0.5"
              >
                Calculate Your Salary
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#features" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Learn More
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              {STATS.map(({ num, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span><strong className="text-gray-900">{num}</strong> {label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Understand Your German Salary</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you're negotiating a job offer or planning your budget, know exactly what you'll earn.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <Briefcase className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Job Seekers</h3>
              <p className="text-gray-600 leading-relaxed">Evaluating a job offer in Germany? Calculate your actual take-home pay before accepting.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                <Building2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Working Students</h3>
              <p className="text-gray-600 leading-relaxed">Working part-time while studying? See how much you'll actually earn from your Werkstudent job.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Salary Negotiation</h3>
              <p className="text-gray-600 leading-relaxed">Planning to negotiate a raise? Understand how a higher gross salary translates to net income.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete German Tax Calculation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our calculator includes all German taxes and social contributions for accurate results.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Know Your True Earnings in Germany</h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">Don't be surprised by your first paycheck. Calculate your net salary now and plan your finances with confidence.</p>
          <Link 
            href="/netto-brutto-calculator" 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Calculate Now — It's Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about German salaries and taxes</p>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Plan Your German Income Today</h2>
          <p className="text-slate-400 mb-8">Use our calculator to understand German taxes and plan your budget effectively.</p>
          <Link 
            href="/netto-brutto-calculator" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all"
          >
            Start Calculating
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
