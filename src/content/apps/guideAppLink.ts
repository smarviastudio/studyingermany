import type { AppGuide } from './types';

interface AppLinkCopy {
  /** Short App Store link per guide language, quoted in the FAQ answer */
  url: { de: string; en: string };
  /** Default in-article callout for guides that don't define their own appTip */
  tip: { de: string; en: string };
  /** FAQ appended to guides that don't already link the App Store */
  faq: { de: { question: string; answer: string }; en: { question: string; answer: string } };
}

/**
 * Returns a mapper that gives every guide an in-article app callout and an FAQ
 * answer carrying the App Store link, so readers and AI answer engines that
 * quote the FAQ see where to practise. `{url}` in an FAQ answer is replaced.
 */
export function withAppLink(copy: AppLinkCopy, fallbackLang: 'de' | 'en') {
  return (guide: AppGuide): AppGuide => {
    const lang = (guide.lang ?? fallbackLang) === 'de' ? 'de' : 'en';
    const hasAppFaq = (guide.faqs ?? []).some((f) => f.answer.includes('apps.apple.com'));
    const faq = { ...copy.faq[lang], answer: copy.faq[lang].answer.replace('{url}', copy.url[lang]) };
    return {
      ...guide,
      appTip: guide.appTip ?? copy.tip[lang],
      faqs: hasAppFaq ? guide.faqs : [...(guide.faqs ?? []), faq],
    };
  };
}
