import Image from 'next/image';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';
import { 
  BookOpen, CheckCircle2, ChevronRight, Smartphone, Tablet, Monitor, Glasses,
  HelpCircle, ArrowRight, Star, FileQuestion, Timer, MapPin, Globe, Shield, Sparkles,
  ListChecks, Target, Clock, Languages
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Einbürgerungstest 2026 App – All 310 BAMF Questions + Leben in Deutschland (iOS)',
  description: 'Einbürgerungstest 2026 App with all 310 official BAMF questions, LiD test, practice mode, exam simulation, state filter and multilingual support for iPhone, iPad and Mac.',
  keywords: 'Einbürgerungstest 2026 App, BAMF test app, German citizenship test, Leben in Deutschland test, Einbürgerungstest questions, German naturalization test app',
  openGraph: {
    title: 'Einbürgerungstest 2026 App – Pass the BAMF Test on Your First Try',
    description: 'All 310 official BAMF questions with practice mode, exam simulation, state filter and multilingual support.',
    url: 'https://germanpath.com/einbuergerungstest-2026-app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Einbürgerungstest 2026 App – German Citizenship Test',
    description: 'All 310 official BAMF questions with practice mode, exam simulation and multilingual support.',
  },
  alternates: {
    canonical: 'https://germanpath.com/einbuergerungstest-2026-app',
  },
};

const APP_STORE_URL = 'https://apps.apple.com/us/app/einb%C3%BCrgerungstest-2026-bamf/id6748231679';

const FEATURES = [
  {
    icon: FileQuestion,
    title: 'All 310 Official BAMF Questions Including LiD',
    description: 'The app contains all 310 official questions from the Federal Office for Migration and Refugees (BAMF), including the "Leben in Deutschland" test. The database is current for 2025/2026 and includes new topics like "Jewish Life in Germany".',
    color: '#dd0000',
  },
  {
    icon: ListChecks,
    title: 'Practice Mode with Instant Feedback',
    description: 'In practice mode, answer questions at your own pace and receive immediate feedback on whether your answer was correct. Incorrectly answered questions are automatically added to an error list so you can specifically review your weak areas.',
    color: '#7c3aed',
  },
  {
    icon: Timer,
    title: 'Realistic Exam Simulation',
    description: 'The exam simulation replicates the real citizenship test: 33 questions in 60 minutes including a timer. Train for the real thing, improve your time management, and realistically assess your chances of passing.',
    color: '#059669',
  },
  {
    icon: MapPin,
    title: 'State Filter for Region-Specific Questions',
    description: 'With the state filter, you can specifically practice questions for your federal state (Bundesland). This is particularly important as some questions are tailored to your state and frequently appear in the exam.',
    color: '#d97706',
  },
  {
    icon: Globe,
    title: 'Multilingual & Offline Learning',
    description: 'The app supports multiple languages including German, English, Russian, Turkish, Farsi, Polish, Romanian, Hindi and more. You can also learn offline, so you can practice anywhere without an internet connection.',
    color: '#0284c7',
  },
  {
    icon: Shield,
    title: 'No Registration, No Data Collection',
    description: 'You can use the app without registration and start immediately. According to the App Store listing, the developer does not collect any data from this app, ensuring your privacy is protected.',
    color: '#be185d',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Select Your State',
    description: 'Choose your federal state (Bundesland) and activate the state filter to train with relevant region-specific questions.',
  },
  {
    number: '02',
    title: 'Practice Mode',
    description: 'Start in practice mode, answer questions and use instant feedback to learn quickly and identify mistakes.',
  },
  {
    number: '03',
    title: 'Review Errors',
    description: 'Regularly review your error list until you have mastered the questions confidently.',
  },
  {
    number: '04',
    title: 'Exam Simulation',
    description: 'Use the exam simulation with 33 questions and a 60-minute timer to replicate the real test situation.',
  },
  {
    number: '05',
    title: 'Learn Your Way',
    description: 'Switch languages as needed to better understand content, and learn offline whenever it suits you.',
  },
];

const FAQS = [
  {
    question: 'What is the Einbürgerungstest 2026 : BamF App?',
    answer: 'The Einbürgerungstest 2026 : BamF App is a learning program for iOS that helps you prepare for the German citizenship test with all 310 official BAMF questions and the "Leben in Deutschland" test.',
  },
  {
    question: 'Does the app contain all official BAMF questions?',
    answer: 'Yes. The app covers all 310 official BAMF questions, including the LiD questions, and is current for 2025/2026 with new topics like "Jewish Life in Germany".',
  },
  {
    question: 'Can I do a real exam simulation with the app?',
    answer: 'Yes. The app offers an exam simulation with 33 questions and a 60-minute time limit, including a timer, that replicates the real citizenship test.',
  },
  {
    question: 'Is there a state filter?',
    answer: 'Yes. You can activate a state filter to specifically practice questions for your federal state (Bundesland).',
  },
  {
    question: 'In which languages is the app available?',
    answer: 'The app supports multiple languages including German, English, Russian, Turkish, Farsi, Polish, Romanian, Hindi and more, so you can learn in your preferred language.',
  },
  {
    question: 'Is the app free?',
    answer: 'The app is basically free to use. There is an in-app purchase to remove ads and learn ad-free.',
  },
  {
    question: 'Do I need to register or is data collected?',
    answer: 'No. You do not need to register, and according to App Store information, the developer does not collect any data from this app. Privacy practices may still vary depending on usage and age.',
  },
  {
    question: 'On which devices can I use the app?',
    answer: 'You can use the app on iPhone, iPad, iPod touch, Mac with Apple M-chip, and Apple Vision devices, provided the minimum version of iOS, iPadOS, macOS or visionOS is met.',
  },
];

const SCREENSHOTS = [
  { src: '/einbuergerungstest/screenshot-1.webp', alt: 'Einbürgerungstest App - Question practice screen' },
  { src: '/einbuergerungstest/screenshot-2.webp', alt: 'Einbürgerungstest App - Exam simulation mode' },
  { src: '/einbuergerungstest/screenshot-3.webp', alt: 'Einbürgerungstest App - State selection filter' },
  { src: '/einbuergerungstest/screenshot-4.png', alt: 'Einbürgerungstest App - Progress tracking' },
  { src: '/einbuergerungstest/screenshot-5.png', alt: 'Einbürgerungstest App - Multilingual support' },
];

export default function EinbuergerungstestPage() {
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
    name: 'Einbürgerungstest 2026 : BamF',
    operatingSystem: 'iOS',
    applicationCategory: 'EducationApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '120',
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#dd0000]/20 pt-24 pb-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ffce00]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#dd0000]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
                <Image src="/apple-icon.png" alt="Apple" width={16} height={16} className="invert" />
                Available on iOS
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Einbürgerungstest 2026 App –{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffce00] to-[#dd0000]">
                  Pass the BAMF Test
                </span>{' '}
                on Your First Try
              </h1>

              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Einbürgerungstest 2026 : BamF is your smart companion for the German citizenship test and the &quot;Leben in Deutschland&quot; test – with all 310 official BAMF questions, LiD questions, practice mode, exam simulation, state filter and multilingual support. Learn efficiently and in your language on iPhone, iPad, Mac and Apple Vision.
              </p>

              {/* Key Benefits */}
              <ul className="space-y-3 mb-8">
                {[
                  'All 310 official BAMF questions including "Leben in Deutschland" (LiD)',
                  'Current for 2025/2026 with topics like "Jewish Life in Germany"',
                  'Practice mode with instant feedback & error list',
                  'Exam simulation with 33 questions / 60 minutes & timer',
                  'State filter for your specific Bundesland questions',
                  'Multilingual & offline: DE, EN, RU, TR, FA, PL, RO, HI, …',
                  'No registration, no data collection, ad-free with optional upgrade',
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
                <Image src="/apple-icon.png" alt="Apple" width={24} height={24} />
                Download on the App Store
              </a>

              <p className="text-white/50 text-sm mt-4">Free to download • In-app purchases available</p>
            </div>

            {/* Right - Screenshots */}
            <div className="relative hidden lg:block">
              <div className="flex gap-4 justify-center">
                <div className="relative w-48 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/einbuergerungstest/screenshot-1.webp"
                    alt="Einbürgerungstest 2026 App - Practice questions"
                    width={230}
                    height={498}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="relative w-48 transform translate-y-8 hover:translate-y-4 transition-transform duration-500">
                  <Image
                    src="/einbuergerungstest/screenshot-2.webp"
                    alt="Einbürgerungstest App - Exam simulation"
                    width={230}
                    height={498}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="relative w-48 transform rotate-[5deg] hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/einbuergerungstest/screenshot-3.webp"
                    alt="Einbürgerungstest App - State filter"
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
              Who Should Use the Einbürgerungstest 2026 App?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Einbürgerungstest 2026 App is designed for everyone preparing for the German citizenship test and the &quot;Leben in Deutschland&quot; test who wants to practice specifically with the official questions. Whether you&apos;re learning on your own, attending an integration course, or about to take your exam – the app helps you learn in a structured and efficient way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Citizenship Applicants',
                description: 'People applying for German citizenship who need to pass the Einbürgerungstest.',
                color: '#dd0000',
              },
              {
                icon: BookOpen,
                title: 'Integration Course Participants',
                description: 'Participants in integration courses who want to practice additionally on mobile.',
                color: '#7c3aed',
              },
              {
                icon: Smartphone,
                title: 'Mobile Learners',
                description: 'Learners who prefer studying with their smartphone or tablet instead of paper questionnaires.',
                color: '#059669',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
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
              See the App in Action
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide justify-center">
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
              Key Features of the Einbürgerungstest 2026 App
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to pass the German citizenship test
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
      <section className="py-20 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#dd0000]/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-semibold rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              How to Prepare with the App
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Follow these steps to pass the Einbürgerungstest
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.slice(0, 3).map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors h-full">
                  <span className="text-5xl font-bold text-[#ffce00]/30 mb-4 block">{step.number}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
            {STEPS.slice(3).map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors h-full">
                  <span className="text-5xl font-bold text-[#ffce00]/30 mb-4 block">{step.number}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms & Technical Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#d97706]/10 text-[#d97706] text-sm font-semibold rounded-full mb-4">
                Platforms & Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Availability and Technical Details
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Einbürgerungstest 2026 : BamF is available for iPhone, iPad, iPod touch, Mac (with Apple M-chip) and Apple Vision devices. The app requires at least iOS 12.0, iPadOS 12.0, macOS 11.0 (with Apple M1 or newer) or visionOS 1.0.
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
                <Image src="/apple-icon.png" alt="Apple" width={20} height={20} className="invert" />
                Download Free on App Store
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
              <div className="space-y-4">
                {[
                  { label: 'Category', value: 'Education' },
                  { label: 'Size', value: '~52.6 MB' },
                  { label: 'Languages', value: 'DE, EN, RU, TR, FA, PL, RO, HI, ...' },
                  { label: 'Age Rating', value: '4+' },
                  { label: 'Price', value: 'Free (with optional ad removal)' },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
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
              Frequently Asked Questions
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
            Pass the Einbürgerungstest on Your First Try
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of learners preparing for German citizenship. Download free and start practicing with all 310 official BAMF questions today.
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#dd0000] rounded-2xl font-bold text-lg hover:bg-[#ffce00] hover:text-[#0a0a1a] transition-all hover:scale-105 shadow-2xl"
          >
            <Image src="/apple-icon.png" alt="Apple" width={24} height={24} />
            Download on the App Store
          </a>
          <p className="text-white/60 text-sm mt-4">Available for iPhone, iPad, Mac & Vision Pro</p>
        </div>
      </section>
    </div>
  );
}
