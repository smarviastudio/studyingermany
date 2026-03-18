'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { 
  LayoutDashboard, Sparkles, CheckCircle2, 
  ArrowRight, GraduationCap, FileText, Heart,
  ChevronDown, Calendar, Bell, Zap, Target
} from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Heart,
    title: 'Program Shortlist',
    description: 'Save and organize your favorite German university programs in one place for easy comparison.'
  },
  {
    icon: Calendar,
    title: 'Application Tracker',
    description: 'Track deadlines, application status, and required documents for each program you\'re applying to.'
  },
  {
    icon: FileText,
    title: 'Document Manager',
    description: 'Store and manage your CVs, motivation letters, and other application documents.'
  },
  {
    icon: Zap,
    title: 'AI Credits',
    description: 'Monitor your AI credits usage and access all AI-powered tools from one central hub.'
  }
];

const FAQS = [
  {
    q: 'What can I do in the dashboard?',
    a: 'The dashboard is your central hub for managing your German university applications. You can save programs to your shortlist, track application deadlines, manage your documents (CVs, motivation letters), monitor AI credits, and access all our tools from one place.'
  },
  {
    q: 'Do I need an account to use the dashboard?',
    a: 'Yes, you need to create a free account to access the dashboard. This allows us to save your shortlisted programs, track your applications, and sync your data across devices. Sign up takes less than a minute.'
  },
  {
    q: 'Is the dashboard free to use?',
    a: 'Yes! The dashboard and all its core features are completely free. You can shortlist unlimited programs, track applications, and manage documents at no cost. Some AI-powered features use credits, but new users receive free credits to get started.'
  },
  {
    q: 'Can I track multiple university applications?',
    a: 'Absolutely! You can track as many applications as you want. Add programs to your shortlist, set deadline reminders, and monitor the status of each application. The dashboard helps you stay organized throughout your application journey.'
  },
  {
    q: 'How do I save programs to my shortlist?',
    a: 'When browsing programs using our Course Finder, simply click the heart icon to add a program to your shortlist. You can then access all your saved programs from the dashboard to compare requirements, deadlines, and more.'
  },
  {
    q: 'Can I access my dashboard on mobile?',
    a: 'Yes! The dashboard is fully responsive and works on all devices. Access your shortlist, track applications, and manage documents from your phone, tablet, or computer.'
  }
];

const STATS = [
  { num: '20,000+', label: 'Programs to Explore' },
  { num: '2,500+', label: 'Active Users' },
  { num: '100%', label: 'Free to Use' }
];

export default function DashboardLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(221,0,0,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
              <LayoutDashboard className="w-4 h-4" />
              Your Application Hub
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Manage Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500"> German University Applications</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Your personal dashboard to shortlist programs, track applications, manage documents, and access all AI tools. 
              Stay organized throughout your journey to studying in Germany.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/auth/signin" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5"
              >
                Sign In to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#features" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Learn More
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              {STATS.map(({ num, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span><strong className="text-white">{num}</strong> {label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">From finding programs to submitting applications, manage your entire journey from the dashboard.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border border-red-100">
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-5">
                <GraduationCap className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Programs</h3>
              <p className="text-gray-600 leading-relaxed">Search 20,000+ study programs across German universities. Filter by subject, degree, language, and more.</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Applications</h3>
              <p className="text-gray-600 leading-relaxed">Never miss a deadline. Track application status, required documents, and important dates for each program.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Tools</h3>
              <p className="text-gray-600 leading-relaxed">Access CV maker, motivation letter generator, and other AI tools to create perfect application documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Powerful tools to help you succeed in your German university applications.</p>
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
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your German University Journey</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Create your free account and get access to all dashboard features. Track applications, save programs, and use AI tools.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-xl hover:-translate-y-0.5"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about the dashboard</p>
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 mb-8">Join thousands of students managing their German university applications with our dashboard.</p>
          <Link 
            href="/auth/signin" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Access Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
