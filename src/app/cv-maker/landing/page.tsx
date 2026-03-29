'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { ToolLandingRedirect } from '@/components/ToolLandingRedirect';
import { 
  FileText, Sparkles, Download, CheckCircle2, 
  ArrowRight, Star, Users, Globe, Zap,
  ChevronDown, GraduationCap, Building2, Award
} from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Let AI write professional summaries, job descriptions, and skills tailored for German employers.'
  },
  {
    icon: FileText,
    title: 'German CV Templates',
    description: 'Choose from Europass, tabular Lebenslauf, and modern formats accepted by German universities and companies.'
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download your CV as a high-quality PDF ready for uni-assist, direct applications, or job portals.'
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Create CVs in English or German with proper formatting for international applications.'
  }
];

const FAQS = [
  {
    q: 'What is a German CV (Lebenslauf)?',
    a: 'A German CV, called "Lebenslauf," is a structured resume format commonly used in Germany. Unlike American resumes, German CVs often include a professional photo, personal details, and follow a reverse-chronological tabular format. Our CV maker helps you create both traditional Lebenslauf and modern formats.'
  },
  {
    q: 'Is this CV maker free to use?',
    a: 'Yes! You can create, edit, and download your CV for free. We offer AI-powered content generation that uses credits - new users receive free credits to try the AI features. Premium templates are available for subscribers.'
  },
  {
    q: 'What CV format should I use for German universities?',
    a: 'For German university applications, the Europass CV format is widely accepted and recommended. It provides a standardized structure recognized across Europe. Our CV maker includes Europass templates specifically designed for academic applications.'
  },
  {
    q: 'Can I use this CV for job applications in Germany?',
    a: 'Absolutely! Our templates are designed for both academic and professional applications in Germany. We include formats suitable for internships (Praktikum), working student positions (Werkstudent), and full-time jobs at German companies like SAP, Siemens, and BMW.'
  },
  {
    q: 'Do I need to include a photo on my German CV?',
    a: 'While not legally required, including a professional photo is still common practice in Germany. Our CV maker supports both photo and no-photo templates. For international companies or startups, photo-free CVs are increasingly accepted.'
  },
  {
    q: 'How does the AI CV generator work?',
    a: 'Our AI analyzes your background, skills, and target role to generate professional content for each CV section. Simply provide basic information about yourself, and the AI creates tailored summaries, job descriptions, and skill highlights optimized for German employers.'
  }
];

const STATS = [
  { num: '50,000+', label: 'CVs Created' },
  { num: '2,500+', label: 'Students Helped' },
  { num: '95%', label: 'Success Rate' }
];

export default function CVMakerLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <ToolLandingRedirect target="/cv-maker" />
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(221,0,0,0.04),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered German CV Builder
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Create Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500"> German CV</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Build a professional Lebenslauf for German universities and employers. 
              Choose from Europass, tabular, and modern templates — with AI assistance to write compelling content.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/cv-maker" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5"
              >
                Start Building Your CV
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Is This CV Maker For?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you're applying to German universities or seeking employment, our CV maker helps you create the perfect application document.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">International Students</h3>
              <p className="text-gray-600 leading-relaxed">Applying to German universities? Create a Europass CV or academic resume that meets uni-assist requirements and impresses admission committees.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                <Building2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Job Seekers</h3>
              <p className="text-gray-600 leading-relaxed">Looking for internships, working student positions, or full-time jobs in Germany? Build a professional Lebenslauf that German employers expect.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scholarship Applicants</h3>
              <p className="text-gray-600 leading-relaxed">Applying for DAAD, Deutschlandstipendium, or other scholarships? Create a compelling CV that highlights your achievements and potential.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Build a German CV</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Professional templates, AI-powered content generation, and easy PDF export — all designed for German applications.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Create Your German CV?</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of international students and professionals who have successfully applied to German universities and companies with our CV maker.</p>
          <Link 
            href="/cv-maker" 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Start Building Now — It's Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about creating a German CV</p>
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Start Your German Journey Today</h2>
          <p className="text-slate-400 mb-8">Create a professional CV that opens doors to German universities and employers.</p>
          <Link 
            href="/cv-maker" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Create Your CV Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
