'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { ToolLandingRedirect } from '@/components/ToolLandingRedirect';
import { 
  Calculator, Sparkles, CheckCircle2, 
  ArrowRight, GraduationCap, Globe, BookOpen,
  ChevronDown, Award, BarChart3, Zap
} from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Globe,
    title: 'Multiple Grading Systems',
    description: 'Convert grades from US, UK, India, Pakistan, Bangladesh, and 50+ other countries to the German scale.'
  },
  {
    icon: Calculator,
    title: 'Modified Bavarian Formula',
    description: 'Uses the official formula recommended by German universities for accurate grade conversion.'
  },
  {
    icon: BarChart3,
    title: 'Instant Results',
    description: 'Get your converted German grade immediately with detailed breakdown and explanations.'
  },
  {
    icon: BookOpen,
    title: 'University Requirements',
    description: 'See if your converted grade meets admission requirements for top German universities.'
  }
];

const FAQS = [
  {
    q: 'How do German universities convert foreign grades?',
    a: 'Most German universities use the Modified Bavarian Formula to convert international grades to the German grading scale (1.0-5.0). This formula considers your grade, the maximum possible grade, and the minimum passing grade from your country\'s system. Our calculator uses this official formula for accurate conversions.'
  },
  {
    q: 'What is the German grading scale?',
    a: 'Germany uses a 1.0 to 5.0 scale where 1.0 is the best (excellent) and 4.0 is the minimum passing grade. Grades above 4.0 are failing. For reference: 1.0-1.5 is "sehr gut" (very good), 1.6-2.5 is "gut" (good), 2.6-3.5 is "befriedigend" (satisfactory), and 3.6-4.0 is "ausreichend" (sufficient).'
  },
  {
    q: 'What GPA do I need to study in Germany?',
    a: 'Requirements vary by university and program. Competitive programs like Computer Science at TU Munich may require grades equivalent to 2.0 or better. Many programs accept students with grades up to 2.5 or 3.0. Some programs have no grade requirements (NC-frei). Use our converter to check your eligibility.'
  },
  {
    q: 'How do I convert my US GPA to German grades?',
    a: 'A US 4.0 GPA typically converts to approximately 1.0 on the German scale. A 3.0 GPA converts to around 2.3-2.5, and a 2.0 GPA converts to approximately 3.5-3.7. Our calculator provides precise conversions based on the Modified Bavarian Formula.'
  },
  {
    q: 'How do I convert Indian percentage to German grades?',
    a: 'Indian percentages are converted using the Modified Bavarian Formula. Generally, 90%+ converts to around 1.0-1.3, 80-89% to 1.4-2.0, 70-79% to 2.1-2.7, and 60-69% to 2.8-3.5. Our calculator handles the exact conversion for your specific percentage.'
  },
  {
    q: 'Is this GPA converter accurate for uni-assist applications?',
    a: 'Our converter uses the same Modified Bavarian Formula that uni-assist and most German universities use. However, final grade conversion is always done officially by the university or uni-assist. Use our tool to estimate your converted grade before applying.'
  }
];

const STATS = [
  { num: '100,000+', label: 'Conversions Done' },
  { num: '50+', label: 'Countries Supported' },
  { num: '99%', label: 'Accuracy Rate' }
];

export default function GPAConverterLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <ToolLandingRedirect target="/gpa-converter" />
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.06),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              German Grade Calculator
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Convert Your GPA to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500"> German Grades</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Use the Modified Bavarian Formula to convert your international grades to the German grading scale. 
              Check if you meet admission requirements for German universities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/gpa-converter" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
              >
                Convert Your Grade Now
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

      {/* Supported Countries */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Convert Grades From Any Country</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our calculator supports grading systems from over 50 countries worldwide.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100">
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-5">
                <Globe className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">South Asia</h3>
              <p className="text-gray-600 leading-relaxed">India (percentage & CGPA), Pakistan, Bangladesh, Sri Lanka, Nepal — convert your grades accurately.</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Americas & Europe</h3>
              <p className="text-gray-600 leading-relaxed">US GPA (4.0 scale), UK degree classifications, Canadian grades, and European ECTS credits.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Africa & Middle East</h3>
              <p className="text-gray-600 leading-relaxed">Nigeria, Egypt, Iran, Turkey, and many more — all major grading systems supported.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accurate Grade Conversion for German Universities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our calculator uses the official Modified Bavarian Formula trusted by German universities.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Check Your Eligibility for German Universities</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Convert your grades instantly and see if you meet the requirements for your dream program in Germany.</p>
          <Link 
            href="/gpa-converter" 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Convert Your Grade Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about German grade conversion</p>
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Check Your German Grade?</h2>
          <p className="text-slate-400 mb-8">Use our calculator to convert your grades and plan your German university application.</p>
          <Link 
            href="/gpa-converter" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
          >
            Start Converting
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
