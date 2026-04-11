'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { ToolLandingRedirect } from '@/components/ToolLandingRedirect';
import { 
  FileText, Sparkles, Download, CheckCircle2, 
  ArrowRight, Briefcase, Target, Building2,
  ChevronDown, Users, Award, Zap
} from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Writing',
    description: 'Generate professional cover letters tailored to German job applications and company culture.'
  },
  {
    icon: Target,
    title: 'Job-Specific Content',
    description: 'Our AI analyzes job descriptions and creates targeted content that highlights your relevant skills.'
  },
  {
    icon: Building2,
    title: 'German Business Format',
    description: 'Follow the Anschreiben format expected by German employers with proper structure and tone.'
  },
  {
    icon: Download,
    title: 'Multiple Formats',
    description: 'Export your cover letter as PDF or Word document, ready to submit with your application.'
  }
];

const FAQS = [
  {
    q: 'What is a German cover letter (Anschreiben)?',
    a: 'A German cover letter, called "Anschreiben" or "Bewerbungsschreiben," is a formal letter accompanying your CV when applying for jobs in Germany. It explains your motivation, qualifications, and why you\'re the right fit for the position. German employers place high importance on well-written cover letters.'
  },
  {
    q: 'How is a German cover letter different from other countries?',
    a: 'German cover letters tend to be more formal and structured than American or British versions. They typically include your contact details, the company\'s address, date, subject line, formal salutation, and a clear structure covering motivation, qualifications, and closing. Our tool helps you follow these conventions.'
  },
  {
    q: 'What should I include in my cover letter for a German job?',
    a: 'A strong German cover letter should include: why you\'re interested in the specific position and company, your relevant qualifications and experience, how your skills match the job requirements, your availability and salary expectations (if requested), and a professional closing. Our AI structures all these elements properly.'
  },
  {
    q: 'Can I use this for internship applications in Germany?',
    a: 'Absolutely! Our cover letter generator works for all types of German job applications including internships (Praktikum), working student positions (Werkstudent), trainee programs, and full-time positions. The AI adapts the tone and content based on your experience level.'
  },
  {
    q: 'Should I write my cover letter in German or English?',
    a: 'This depends on the job posting. If the position requires German, write in German. For international companies or English-speaking roles, English is appropriate. Our tool can help you create cover letters in both languages with proper business conventions.'
  },
  {
    q: 'How long should a German cover letter be?',
    a: 'German cover letters should typically be one page (about 300-500 words). They should be concise yet comprehensive, covering all essential points without unnecessary filler. Our AI helps you create focused content that fits this standard.'
  }
];

const STATS = [
  { num: '15,000+', label: 'Letters Created' },
  { num: '85%', label: 'Interview Rate' },
  { num: '4.8/5', label: 'User Rating' }
];

export default function CoverLetterLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
      <ToolLandingRedirect target="/cover-letter" />
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.06),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI Cover Letter Generator for Germany
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Write a Winning
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500"> German Cover Letter</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Create professional Anschreiben for German job applications. 
              AI-powered writing that follows German business conventions and impresses employers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/cover-letter" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              >
                Create Your Cover Letter
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

      {/* Use Cases */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cover Letters for Every German Job Application</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you're applying for an internship or a senior position, create the perfect Anschreiben.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Internships & Praktikum</h3>
              <p className="text-gray-600 leading-relaxed">Apply for internships at German companies like Bosch, BMW, Siemens, and SAP with a professional cover letter.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100">
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-5">
                <Briefcase className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Working Student Jobs</h3>
              <p className="text-gray-600 leading-relaxed">Create compelling Werkstudent applications that highlight your academic background and relevant skills.</p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-2xl border border-violet-100">
              <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Full-Time Positions</h3>
              <p className="text-gray-600 leading-relaxed">Land your dream job in Germany with a cover letter that showcases your experience and cultural fit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Cover Letter Writing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our intelligent system understands German business culture and helps you create impactful applications.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Land Your German Job?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of job seekers who have successfully applied to German companies with our AI-powered cover letter generator.</p>
          <Link 
            href="/cover-letter" 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Create Your Cover Letter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about German cover letters</p>
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Start Your German Career Today</h2>
          <p className="text-slate-400 mb-8">Create a cover letter that opens doors to opportunities in Germany.</p>
          <Link 
            href="/cover-letter" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
