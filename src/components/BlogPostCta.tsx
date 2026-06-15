import Link from 'next/link';
import { ArrowRight, FileText, Search, Sparkles } from 'lucide-react';

type BlogPostCtaProps = {
  variant?: 'dark' | 'light';
};

const TOOL_LINKS = [
  { href: '/#hero', label: 'Course Finder', desc: 'Search 20,000+ programs', emoji: '🔍' },
  { href: '/cv-maker', label: 'CV Maker', desc: 'German-format CV with AI', emoji: '📄' },
  { href: '/motivation-letter', label: 'Motivation Letter', desc: 'For university applications', emoji: '✍️' },
  { href: '/cover-letter', label: 'Cover Letter', desc: 'Professional job applications', emoji: '💼' },
  { href: '/gpa-converter', label: 'GPA Converter', desc: 'Convert to German grades', emoji: '🎓' },
];

export function BlogPostCta({ variant = 'dark' }: BlogPostCtaProps) {
  if (variant === 'light') {
    return (
      <section className="mt-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-[#fff8f8] p-6 md:p-8">
        <span className="inline-block rounded-full bg-[#ffce00]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9a3412]">
          Next steps
        </span>
        <h3 className="mt-3 text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Turn this guide into an application plan
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
          Use German Path to search programs, build your CV, draft motivation letters, and unlock Pro features when you need more AI credits.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-[#dd0000] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#bb0000]"
          >
            <Sparkles size={16} />
            Explore AI Tools
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-900 transition-all hover:border-[#dd0000] hover:text-[#dd0000]"
          >
            View Pricing
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {TOOL_LINKS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-[#dd0000] hover:bg-[#fff8f8]"
            >
              <span className="text-lg">{tool.emoji}</span>
              <span>
                <strong className="block text-sm text-gray-900 group-hover:text-[#dd0000]">{tool.label}</strong>
                <span className="text-xs text-gray-500">{tool.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-xl border border-white/[0.08] bg-gradient-to-br from-blue-500/[0.08] to-purple-500/[0.08] p-6 text-center">
      <h3 className="mb-1 text-lg font-bold text-white">Ready to apply?</h3>
      <p className="mx-auto mb-5 max-w-lg text-xs leading-relaxed text-white/40">
        Search programs, build your German CV, and draft motivation letters with AI. Upgrade to Pro on pricing when you need more credits.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-purple-700"
        >
          <FileText size={15} />
          AI Tools
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-all hover:border-white/30 hover:text-white"
        >
          Pricing
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/#hero"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-all hover:border-white/30 hover:text-white"
        >
          <Search size={15} />
          Find Programs
        </Link>
      </div>
    </section>
  );
}
