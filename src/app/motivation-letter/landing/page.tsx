'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { ToolLandingRedirect } from '@/components/ToolLandingRedirect';
import { 
  FileText, Sparkles, Download, CheckCircle2, 
  ArrowRight, GraduationCap, Target, Lightbulb,
  ChevronDown, BookOpen, Award, Globe
} from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Writing',
    description: 'Generate compelling motivation letters tailored to your target program and university in Germany.'
  },
  {
    icon: Target,
    title: 'Program-Specific Content',
    description: 'Our AI understands German university requirements and creates content that resonates with admission committees.'
  },
  {
    icon: BookOpen,
    title: 'Structure & Guidelines',
    description: 'Follow proven structures for motivation letters that German universities expect and appreciate.'
  },
  {
    icon: Download,
    title: 'Export & Edit',
    description: 'Download your letter as a document, make edits, and submit with confidence.'
  }
];

const FAQS = [
  {
    q: 'What is a motivation letter for German universities?',
    a: 'A motivation letter (Motivationsschreiben) is a personal statement explaining why you want to study a specific program at a German university. It covers your academic background, career goals, and reasons for choosing Germany. Most German universities require this as part of the application package.'
  },
  {
    q: 'How is a motivation letter different from a statement of purpose (SOP)?',
    a: 'While often used interchangeably, a motivation letter focuses more on your personal motivation and fit with the program, while a statement of purpose (SOP) emphasizes your academic and research interests. German universities typically use the term "motivation letter" but expect similar content to an SOP.'
  },
  {
    q: 'What should I include in my motivation letter?',
    a: 'A strong motivation letter should include: your academic background and achievements, why you chose this specific program, why you want to study in Germany, your career goals, and how the program aligns with your aspirations. Our AI helps you structure all these elements professionally.'
  },
  {
    q: 'How long should a motivation letter be?',
    a: 'Most German universities expect motivation letters between 500-1000 words (1-2 pages). Some programs specify exact requirements. Our tool helps you create content within appropriate length guidelines while covering all essential points.'
  },
  {
    q: 'Can I use this for DAAD scholarship applications?',
    a: 'Yes! Our motivation letter generator is designed for various German applications including DAAD scholarships, Deutschlandstipendium, university admissions, and visa applications. The AI adapts the tone and content based on your specific application type.'
  },
  {
    q: 'Is the AI-generated content unique?',
    a: 'Yes, each motivation letter is generated uniquely based on your personal information, background, and goals. The AI creates original content tailored to your specific situation, ensuring your letter stands out from generic templates.'
  }
];

const STATS = [
  { num: '10,000+', label: 'Letters Generated' },
  { num: '500+', label: 'Universities Covered' },
  { num: '90%', label: 'User Satisfaction' }
];

export default function MotivationLetterLanding() {
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
      <ToolLandingRedirect target="/motivation-letter" />
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.06),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI Motivation Letter Generator
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Write Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-500"> Motivation Letter</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Create compelling motivation letters for German university applications, DAAD scholarships, and student visas. 
              AI-powered writing that impresses admission committees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/motivation-letter" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30 hover:-translate-y-0.5"
              >
                Generate Your Letter
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect For Every German Application</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you're applying to universities, scholarships, or need a visa motivation letter, we've got you covered.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">University Applications</h3>
              <p className="text-gray-600 leading-relaxed">Apply to TU Munich, LMU, RWTH Aachen, and other top German universities with a motivation letter that stands out.</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl border border-amber-100">
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">DAAD Scholarships</h3>
              <p className="text-gray-600 leading-relaxed">Craft compelling motivation letters for DAAD, Erasmus+, Deutschlandstipendium, and other prestigious German scholarships.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                <Globe className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Student Visa</h3>
              <p className="text-gray-600 leading-relaxed">Create a motivation letter for your German student visa application at the embassy or consulate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Motivation Letter Writing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our intelligent system understands what German universities look for and helps you articulate your story effectively.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Write Your Motivation Letter?</h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of students who have successfully applied to German universities with our AI-powered motivation letter generator.</p>
          <Link 
            href="/motivation-letter" 
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Start Writing Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about motivation letters for Germany</p>
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Your German University Journey Starts Here</h2>
          <p className="text-slate-400 mb-8">Create a motivation letter that opens doors to your dream program in Germany.</p>
          <Link 
            href="/motivation-letter" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all"
          >
            Generate Your Letter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
