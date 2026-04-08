import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';
import { 
  BookOpen, Headphones, Languages, Brain, GraduationCap, Sparkles,
  CheckCircle2, ChevronRight, Apple, Smartphone, Tablet, Monitor, Glasses,
  HelpCircle, ArrowRight, Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'LesenLab – DW German Style Reading App (A1–B2) for Goethe, telc & TestDaF',
  description: 'LesenLab is a DW German style reading app with 1000+ graded stories (A1–B2), native audio, instant translations and flashcards – perfect for Goethe, telc and TestDaF exam prep on iPhone and iPad.',
  keywords: 'LesenLab, German reading app, learn German with stories, German stories A1 A2 B1 B2, Goethe exam reading practice, telc reading practice, TestDaF reading practice app, German graded readers app',
  openGraph: {
    title: 'LesenLab – DW German Style Reading App (A1–B2)',
    description: 'Learn German with 1000+ graded stories, native audio, instant translations and flashcards. Perfect for Goethe, telc and TestDaF exam prep.',
    url: 'https://germanpath.com/lesenlab-german-reading-app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LesenLab – German Reading App (A1–B2)',
    description: 'Learn German with 1000+ graded stories, native audio, instant translations and flashcards.',
  },
  alternates: {
    canonical: 'https://germanpath.com/lesenlab-german-reading-app',
  },
};

const APP_STORE_URL = 'https://apps.apple.com/us/app/dw-german-style-lesen-lab/id6752349330';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Graded German Stories (A1–B2)',
    description: 'LesenLab includes over 1000 German stories divided by CEFR level A1, A2, B1 and B2, including fairy tales, dialogues and real-life articles. Clear level labels help you always read at the right difficulty, so you are challenged but never overwhelmed.',
    color: '#dd0000',
  },
  {
    icon: Headphones,
    title: 'Read and Listen Together',
    description: 'Every story in LesenLab comes with native German audio so you train listening and pronunciation while you read. You can use slow mode and replay tricky parts as often as you like to improve comprehension step by step.',
    color: '#7c3aed',
  },
  {
    icon: Languages,
    title: 'Instant Translations',
    description: "If you don't understand a word or sentence, just tap it to see an instant translation into English. This keeps you in the flow of the story without constantly switching to a dictionary or translator.",
    color: '#059669',
  },
  {
    icon: Brain,
    title: 'Smart Vocabulary & Grammar Support',
    description: 'LesenLab includes built-in flashcards with spaced repetition so new German words stick in your long-term memory. You also get grammar tips inspired by popular books like "Grammatik Aktiv" plus quizzes after each text to review vocabulary and key structures in context.',
    color: '#d97706',
  },
  {
    icon: GraduationCap,
    title: 'Exam-Focused Reading Practice',
    description: 'The app is designed to support Goethe, telc and TestDaF exam preparation by offering structured reading and listening practice across A1–B2 levels. You can track your progress by level and see how your German improves over time.',
    color: '#0284c7',
  },
  {
    icon: Sparkles,
    title: 'Free to Start, Upgrade When Ready',
    description: 'You can start LesenLab for free and later upgrade to PRO to unlock full access to 1000+ stories, all grammar explanations, unlimited flashcards and offline mode. PRO plans are available as weekly, monthly, yearly and lifetime options directly in the app.',
    color: '#be185d',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Choose Your Level',
    description: 'Select your German level (A1–B2) and pick a short story that matches your current skills.',
  },
  {
    number: '02',
    title: 'Read & Listen',
    description: 'Read and listen at the same time, using instant translations when you need help.',
  },
  {
    number: '03',
    title: 'Review & Practice',
    description: 'Review new vocabulary with flashcards and check your understanding with quizzes after the text.',
  },
  {
    number: '04',
    title: 'Track Progress',
    description: 'Track your progress and move up from A1 to B2 with consistent daily practice.',
  },
];

const FAQS = [
  {
    question: 'What is LesenLab?',
    answer: 'LesenLab is a German reading app that helps you learn German with 1000+ short, graded stories from A1 to B2, complete with native audio, instant translations and flashcards.',
  },
  {
    question: 'What German level do I need for LesenLab?',
    answer: 'LesenLab supports learners from complete beginner to upper-intermediate, with content organized by CEFR levels A1, A2, B1 and B2.',
  },
  {
    question: 'Can I use LesenLab for Goethe or telc exam preparation?',
    answer: 'Yes. LesenLab is ideal for Goethe, telc and TestDaF exam prep because it focuses on structured reading and listening practice across A1–B2 levels and includes vocabulary and grammar review.',
  },
  {
    question: 'How is LesenLab different from other German apps like Duolingo or DW Deutsch?',
    answer: 'While apps like Duolingo focus on short exercises, LesenLab focuses on real German stories with native audio, instant translations and flashcards so you build deep reading and listening skills with context. It also follows a DW German-style storytelling approach instead of isolated sentences.',
  },
  {
    question: 'Is LesenLab free?',
    answer: 'You can download LesenLab for free and start reading immediately. When you are ready, you can upgrade to PRO to unlock all stories, grammar explanations, unlimited flashcards and offline mode.',
  },
  {
    question: 'On which devices can I use LesenLab?',
    answer: 'LesenLab runs on iPhone, iPad, Mac with Apple M-series chips and Apple Vision devices that meet the minimum OS requirements.',
  },
  {
    question: 'Does LesenLab collect my data?',
    answer: 'According to the App Store listing, the developer indicates that the app does not collect any data from this app. Privacy practices may still vary based on how you use it and your age.',
  },
];

const SCREENSHOTS = [
  { src: '/lesenlab/screenshot-1.webp', alt: 'LesenLab German reading app - Story selection screen' },
  { src: '/lesenlab/screenshot-2.webp', alt: 'LesenLab - Reading a German story with audio' },
  { src: '/lesenlab/screenshot-3.webp', alt: 'LesenLab - Instant translation feature' },
  { src: '/lesenlab/screenshot-4.webp', alt: 'LesenLab - Vocabulary flashcards' },
  { src: '/lesenlab/screenshot-5.webp', alt: 'LesenLab - Grammar tips and exercises' },
  { src: '/lesenlab/screenshot-6.webp', alt: 'LesenLab - Progress tracking' },
  { src: '/lesenlab/screenshot-7.webp', alt: 'LesenLab - Quiz and review' },
];

export default function LesenLabPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'LesenLab - Learn German',
    operatingSystem: 'iOS',
    applicationCategory: 'EducationApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <SiteNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e] pt-24 pb-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
                <Apple className="w-4 h-4" />
                Available on iOS
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                LesenLab – Learn German with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffce00] to-[#dd0000]">
                  DW‑Style Stories
                </span>{' '}
                (A1–B2)
              </h1>

              <p className="text-lg text-white/70 leading-relaxed mb-8">
                LesenLab is a German reading app for iPhone and iPad that helps you learn German with 1000+ graded short stories from A1 to B2, complete with native audio, instant translations and smart flashcards. It is designed as a DW German‑style "Lesen Lab" so you can build real reading and listening skills instead of memorizing random sentences.
              </p>

              {/* Key Benefits */}
              <ul className="space-y-3 mb-8">
                {[
                  '1000+ German stories by level (A1, A2, B1, B2)',
                  'Native German audio for every story',
                  'Tap-to-translate any word or sentence into English',
                  'Built-in spaced-repetition flashcards and quizzes',
                  'Perfect for Goethe, telc and TestDaF exam preparation',
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-[#ffce00] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a1a] rounded-2xl font-bold text-lg hover:bg-[#ffce00] transition-all hover:scale-105 shadow-2xl"
              >
                <Apple className="w-6 h-6" />
                Download on the App Store
              </a>

              <p className="text-white/50 text-sm mt-4">Free to download • In-app purchases available</p>
            </div>

            {/* Right - Screenshots */}
            <div className="relative hidden lg:block">
              <div className="flex gap-4 justify-center">
                <div className="relative w-48 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/lesenlab/screenshot-1.webp"
                    alt="LesenLab German reading app screenshot"
                    width={230}
                    height={498}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="relative w-48 transform translate-y-8 hover:translate-y-4 transition-transform duration-500">
                  <Image
                    src="/lesenlab/screenshot-2.webp"
                    alt="LesenLab reading with audio"
                    width={230}
                    height={498}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="relative w-48 transform rotate-[5deg] hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/lesenlab/screenshot-3.webp"
                    alt="LesenLab instant translation"
                    width={230}
                    height={498}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Use Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#dd0000]/10 text-[#dd0000] text-sm font-semibold rounded-full mb-4">
              Who It&apos;s For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Who Should Use LesenLab?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              LesenLab is ideal for German learners at A1–B2 level who want to improve real-life reading and listening skills with short, graded stories. It works great as a companion to your German course, textbook or other apps like Duolingo, DW Deutsch and Readle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                level: 'A1–B1',
                title: 'Beginners & Lower-Intermediate',
                description: 'Learners who need simple, guided stories with translations to build confidence.',
                color: '#059669',
              },
              {
                level: 'B1–B2',
                title: 'Intermediate Learners',
                description: 'Students preparing for Goethe, telc or TestDaF exams needing structured reading and listening practice.',
                color: '#7c3aed',
              },
              {
                level: 'All Levels',
                title: 'Self-Learners',
                description: 'Anyone tired of random example sentences who prefers real stories, dialogues and articles.',
                color: '#dd0000',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-4"
                  style={{ backgroundColor: item.color }}
                >
                  {item.level}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Gallery */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#7c3aed]/10 text-[#7c3aed] text-sm font-semibold rounded-full mb-4">
              App Preview
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              See LesenLab in Action
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
            {SCREENSHOTS.map((screenshot, i) => (
              <div key={i} className="flex-shrink-0 snap-center">
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  width={230}
                  height={498}
                  className="rounded-3xl shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#059669]/10 text-[#059669] text-sm font-semibold rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Key Features of LesenLab
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to master German reading and listening
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-semibold rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              How LesenLab Works
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Start learning German in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors h-full">
                  <span className="text-5xl font-bold text-[#ffce00]/30 mb-4 block">{step.number}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-white/30 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms & Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#d97706]/10 text-[#d97706] text-sm font-semibold rounded-full mb-4">
                Platforms & Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Available on All Apple Devices
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                LesenLab is available for iPhone, iPad, Mac (Apple Silicon) and Apple Vision devices running the latest Apple operating systems. You can begin learning German for free and optionally subscribe to LesenLab PRO with weekly, monthly, yearly or lifetime access from within the app.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Smartphone, label: 'iPhone' },
                  { icon: Tablet, label: 'iPad' },
                  { icon: Monitor, label: 'Mac (M-series)' },
                  { icon: Glasses, label: 'Vision Pro' },
                ].map((device, i) => {
                  const Icon = device.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{device.label}</span>
                    </div>
                  );
                })}
              </div>

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#0a0a1a] text-white rounded-xl font-semibold hover:bg-[#1a1a2e] transition-colors"
              >
                <Apple className="w-5 h-5" />
                Download Free on App Store
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing Options</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900">Free Version</span>
                      <p className="text-sm text-gray-500">Limited stories and features</p>
                    </div>
                    <span className="text-lg font-bold text-[#059669]">Free</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#dd0000]/5 to-[#ffce00]/5 rounded-xl p-4 border-2 border-[#dd0000]/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-semibold text-gray-900">LesenLab PRO</span>
                      <span className="ml-2 px-2 py-0.5 bg-[#dd0000] text-white text-xs font-bold rounded">BEST VALUE</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      Full story library (1000+ stories)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      All grammar explanations & exercises
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      Unlimited flashcards
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      Offline mode
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">Weekly, monthly, yearly & lifetime options available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#0284c7]/10 text-[#0284c7] text-sm font-semibold rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Frequently Asked Questions about LesenLab
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:text-[#dd0000] transition-colors" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#dd0000] to-[#b91c1c]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-[#ffce00] fill-[#ffce00]" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Start Learning German Today
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of learners improving their German with LesenLab. Download free and start reading your first story in minutes.
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#dd0000] rounded-2xl font-bold text-lg hover:bg-[#ffce00] hover:text-[#0a0a1a] transition-all hover:scale-105 shadow-2xl"
          >
            <Apple className="w-6 h-6" />
            Download on the App Store
          </a>
          <p className="text-white/60 text-sm mt-4">Available for iPhone, iPad, Mac & Vision Pro</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a1a] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dd0000] to-[#ffce00] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">LesenLab</span>
            </div>
            <div className="flex items-center gap-6 text-white/60 text-sm">
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">App Store</a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} LesenLab. Part of German Path. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
