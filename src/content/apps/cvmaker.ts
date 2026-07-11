import { Wand2, LayoutTemplate, FileText, Zap, Share2, BadgeCheck } from 'lucide-react';
import type { AppContent } from './types';

export const cvmaker: AppContent = {
  slug: 'cv-maker-resume-builder-app',
  appId: '6763612700',
  name: 'CV Maker',
  storeName: 'CV Maker: Resume Builder App',
  subtitle: 'Professional Job Templates',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/cv-maker-resume-builder-app/id6763612700',
  icon: '/apps/cvmaker/icon.webp',
  accent: '#60a5fa',
  accentDark: '#1d4ed8',
  heroTitle: {
    pre: 'Build a Professional Resume',
    highlight: 'On Your iPhone',
    post: 'in Minutes',
  },
  heroDescription:
    'CV Maker is an AI-powered resume builder for iPhone: pick a professional template, add your experience, and let AI help you phrase it powerfully. Export a polished PDF that\'s ready to send — whether it\'s your first job application or your next career move.',
  heroBenefits: [
    'AI-assisted writing for summaries and work experience',
    'Large library of professional, ATS-friendly templates',
    'Perfect for first resumes, students and career changers',
    'Edit anytime, tailor a version for every application',
    'Clean PDF export, ready to send from your phone',
  ],
  metaTitle: 'CV Maker – Resume Builder App for iPhone: AI Writing + PDF Export',
  metaDescription:
    'Create a professional resume on your iPhone in minutes. AI-assisted writing, professional templates, ATS-friendly layouts and instant PDF export. Free to download.',
  metaKeywords:
    'resume builder app, cv maker app, resume app iphone, first resume, resume for teens, ats friendly resume, cv template app, job application, cover letter, pdf resume maker',
  screenshots: [
    { src: '/apps/cvmaker/screenshot-1.webp', alt: 'CV Maker resume builder app – professional resume templates on iPhone' },
    { src: '/apps/cvmaker/screenshot-2.webp', alt: 'CV Maker – AI-assisted resume writing' },
    { src: '/apps/cvmaker/screenshot-3.webp', alt: 'CV Maker app – edit resume sections quickly' },
    { src: '/apps/cvmaker/screenshot-4.webp', alt: 'CV Maker – clean ATS-friendly resume layouts' },
    { src: '/apps/cvmaker/screenshot-5.webp', alt: 'CV Maker app – export resume as PDF and share' },
  ],
  audience: [
    {
      badge: 'First Job',
      title: 'Students & Teens',
      description: 'No experience yet? Templates and AI phrasing turn school projects, volunteering and side gigs into a resume that gets interviews.',
      color: '#1d4ed8',
    },
    {
      badge: 'Job Hunt',
      title: 'Active Job Seekers',
      description: 'Tailor a version of your resume for every application in minutes — from your phone, wherever the job ad finds you.',
      color: '#059669',
    },
    {
      badge: 'Upgrade',
      title: 'Career Changers',
      description: 'Reframe your experience for a new field with AI help that strengthens weak wording and highlights transferable skills.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: Wand2,
      title: 'AI-Assisted Writing',
      description:
        'Writing about yourself is the hardest part. CV Maker\'s AI helps you phrase experience clearly, strengthen weak wording and turn duties into achievements.',
      color: '#1d4ed8',
    },
    {
      icon: LayoutTemplate,
      title: 'Professional Template Library',
      description:
        'A large library of polished templates for different industries and job levels — from conservative corporate to modern creative.',
      color: '#7c3aed',
    },
    {
      icon: BadgeCheck,
      title: 'ATS-Friendly Layouts',
      description:
        'Clean, readable structures that applicant tracking systems parse correctly — so your resume reaches human eyes.',
      color: '#059669',
    },
    {
      icon: Zap,
      title: 'Fast Editing',
      description:
        'Update your resume anytime and spin off a tailored version for each role in minutes — no desktop software needed.',
      color: '#d97706',
    },
    {
      icon: FileText,
      title: 'Cover Letters Too',
      description:
        'Pair your resume with a matching cover letter, written faster with the same AI assistance.',
      color: '#db2777',
    },
    {
      icon: Share2,
      title: 'Instant PDF Export',
      description:
        'Export a pixel-perfect PDF and send it straight from your phone — apply to a job the moment you find it.',
      color: '#0284c7',
    },
  ],
  steps: [
    { title: 'Pick a Template', description: 'Choose a professional template that fits your industry and personality.' },
    { title: 'Add Your Details', description: 'Fill in experience, education and skills — quick forms, no formatting fights.' },
    { title: 'Polish With AI', description: 'Let AI strengthen your summaries and bullet points until they sound like your best self.' },
    { title: 'Export & Apply', description: 'Download the finished PDF and send your application — all from your iPhone.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'CV Maker is free to download on iPhone and iPad. Build your resume right away — premium unlocks the full template library and unlimited AI assistance.',
  guides: [
    {
      slug: 'resume-for-first-job-no-experience',
      keyword: 'resume for first job no experience',
      title: 'How to Write a Resume for Your First Job (With No Experience)',
      metaTitle: 'Resume for First Job With No Experience: What to Put (+ Template)',
      metaDescription:
        'No work experience yet? Your first resume runs on school, projects, volunteering and skills. Here is exactly what to include, section by section, and how to phrase it.',
      excerpt: 'What goes on a resume when you have never had a job — section by section, with phrasing that works.',
      intro: [
        'Everyone\'s first resume faces the same paradox: you need experience to get a job, and a job to get experience. Here is the secret hiring managers already know — for entry-level roles, they are not expecting work history. They are looking for signals: reliability, initiative, and basic skills.',
        'Your job is to surface those signals from the life you have already lived: school, projects, volunteering, sports, side hustles. Every teenager who babysat, tutored, ran a fundraiser or built something has resume material.',
      ],
      sections: [
        {
          heading: 'What to include (section by section)',
          bullets: [
            'Contact info: name, phone, professional email, city. No photo, no age needed (in the US/UK).',
            'Summary (2 sentences): who you are and what you bring — "Reliable high school senior with strong customer-service instincts from two years of volunteer work…"',
            'Education: school, expected graduation, GPA if strong, relevant coursework and awards.',
            'Experience — broadly defined: babysitting, lawn care, tutoring, family business help, volunteering, club leadership. Real work, even if unpaid.',
            'Skills: languages, software, certifications (first aid, food handling), soft skills you can back with an example.',
            'Projects & activities: sports teams, school plays, coding projects, fundraising — anything showing commitment over time.',
          ],
        },
        {
          heading: 'Phrasing that turns activities into experience',
          paragraphs: [
            'The trick is outcome-focused phrasing. "Babysat neighbors\' kids" becomes "Provided reliable childcare for three families, managing schedules, meals and bedtime routines for children aged 2–9." Same facts — but the second version demonstrates responsibility, logistics and trust. Do this for every bullet: what did you handle, and what does that prove?',
          ],
        },
        {
          heading: 'Mistakes that sink first resumes',
          bullets: [
            'Padding to two pages — one page, always, for a first resume.',
            'Listing hobbies with no signal ("watching movies") instead of activities with proof of commitment.',
            'Typos — with no experience to judge, employers judge care. Proofread three times.',
            'One generic resume for every application — mirror keywords from each job ad.',
          ],
        },
      ],
      howToHeading: 'How to build your first resume with CV Maker',
      howToSteps: [
        { title: 'Choose a clean template', text: 'Pick a simple, professional template — for first resumes, clarity beats creativity.' },
        { title: 'Fill in guided sections', text: 'The app walks you through education, experience and skills, so nothing important is forgotten.' },
        { title: 'Let AI upgrade your phrasing', text: 'Type what you did in plain words; the AI turns it into strong, outcome-focused resume language.' },
        { title: 'Export and apply today', text: 'Download the polished PDF and send your first application — the whole process fits in an afternoon.' },
      ],
      faqs: [
        {
          question: 'How long should a first resume be?',
          answer: 'One page. Recruiters spend under a minute on entry-level resumes; a tight page reads as focus, not lack of material.',
        },
        {
          question: 'Should I include a photo?',
          answer: 'In the US, UK and Canada: no. In Germany and parts of Europe photos are still common but no longer required — when in doubt for international applications, skip it.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'ats-friendly-resume-on-iphone',
      keyword: 'ats friendly resume',
      title: 'ATS-Friendly Resumes: How to Get Past the Software (From Your Phone)',
      metaTitle: 'ATS-Friendly Resume: Formatting Rules That Get Past the Software',
      metaDescription:
        'Most companies screen resumes with software before humans see them. These formatting rules — standard headings, real text, keyword mirroring — get your resume through the ATS.',
      excerpt: 'The formatting rules that stop tracking software from silently rejecting you — and how to apply them in minutes.',
      intro: [
        'At most mid-size and large companies, your resume\'s first reader is software: an Applicant Tracking System (ATS) that parses your file into a database and often scores it against the job description. Resumes the parser cannot read cleanly get ranked low or lost — no matter how qualified the candidate.',
        'The fix is not gaming the system; it is removing the obstacles. ATS-friendly formatting is mostly about what to avoid.',
      ],
      sections: [
        {
          heading: 'The formatting rules',
          bullets: [
            'Use standard section headings: "Work Experience", "Education", "Skills" — parsers key on these exact words.',
            'Real text only: no text embedded in images, no icon fonts for contact info.',
            'Single-column layouts parse most reliably; complex multi-column designs can scramble reading order.',
            'Standard fonts and simple bullets — decorative symbols can turn into garbage characters.',
            'Export as PDF with selectable text (if you can highlight the text in the PDF, a parser can read it).',
            'Dates in consistent format: "May 2024 – Aug 2025" — parsers compute your experience length from them.',
          ],
        },
        {
          heading: 'Keywords: mirror the job description',
          paragraphs: [
            'ATS scoring compares your resume against the job posting. If the ad says "customer service" and your resume says "client relations", you may lose the match. Before each application, scan the posting for its recurring terms — skills, tools, certifications — and use the same wording where it is truthfully yours. Tailoring three to five keywords per application measurably improves pass-through rates.',
          ],
        },
        {
          heading: 'What NOT to do',
          bullets: [
            'No keyword stuffing in white text — modern systems detect it and recruiters reject it on sight.',
            'No headers/footers for critical info — some parsers skip them; keep contact details in the body.',
            'No tables for layout — table cells parse unpredictably.',
          ],
        },
      ],
      howToHeading: 'Building an ATS-safe resume in CV Maker',
      howToSteps: [
        { title: 'Pick an ATS-friendly template', text: 'CV Maker\'s clean layouts use standard headings and parse-safe structure out of the box.' },
        { title: 'Fill standard sections', text: 'The guided sections map exactly to what tracking systems look for — experience, education, skills.' },
        { title: 'Tailor keywords with AI', text: 'Paste the job\'s key phrases into your bullets and let AI weave them in naturally and truthfully.' },
        { title: 'Export a text-true PDF', text: 'The exported PDF contains real selectable text — exactly what parsers need.' },
      ],
      faqs: [
        {
          question: 'Do beautiful designed resumes fail ATS?',
          answer: 'Heavily designed multi-column resumes often parse badly. Save the creative version for networking and portfolios; submit the clean version through application portals.',
        },
        {
          question: 'PDF or Word for ATS?',
          answer: 'A text-based PDF is safe for virtually all modern systems and preserves your formatting. Only submit .docx if the posting explicitly asks for it.',
        },
      ],
      screenshotIndex: 3,
    },
    {
      slug: 'german-cv-lebenslauf-format',
      keyword: 'german cv lebenslauf format',
      title: 'The German CV (Lebenslauf): Format, Rules & Differences That Matter',
      metaTitle: 'German CV Format (Lebenslauf): Rules, Photo, Structure & Examples',
      metaDescription:
        'Applying for jobs or study places in Germany? The German Lebenslauf has its own rules: tabular format, photo conventions, signature and date. Complete format guide.',
      excerpt: 'Applying in Germany? The Lebenslauf follows different rules — tabular format, photo customs, signature — explained.',
      intro: [
        'If you are applying for a job, apprenticeship or university place in Germany, your resume needs to become a Lebenslauf — and the differences are more than translation. German recruiters expect a specific tabular format, different personal details, and conventions (like signing your CV) that surprise international applicants.',
        'Getting the format right signals cultural fluency before anyone reads a word about your qualifications.',
      ],
      sections: [
        {
          heading: 'How a Lebenslauf differs from a US/UK resume',
          bullets: [
            'Tabular format: two clean columns — dates left, details right — in strict reverse-chronological order.',
            'Personal details block: full name, address, phone, email, date and place of birth are customary (though anti-discrimination law makes some optional).',
            'Photo: a professional headshot remains common and often expected in practice, though legally optional.',
            'Length: 1–2 pages is normal; two pages are fine for experienced candidates.',
            'Signature: traditionally you date and sign the Lebenslauf at the bottom — a formality German recruiters notice.',
            'No gaps: German recruiters expect a complete timeline; explain gaps briefly rather than hiding them.',
          ],
        },
        {
          heading: 'The standard structure',
          numbered: [
            'Persönliche Daten — personal details (with optional photo top right).',
            'Berufserfahrung — work experience, reverse-chronological with month/year dates.',
            'Ausbildung / Studium — education, including your degree grade if good.',
            'Kenntnisse — skills: languages with CEFR levels (B2, C1), software, driving license.',
            'Optional: Weiterbildung (training), Ehrenamt (volunteering), Interessen.',
            'Ort, Datum, Unterschrift — place, date, signature.',
          ],
        },
        {
          heading: 'Language levels: use CEFR',
          paragraphs: [
            'German employers expect language skills stated in CEFR levels — "Deutsch: B2, Englisch: C1" — not vague words like "fluent". If you hold a Goethe, telc or TestDaF certificate, name it: certified levels carry real weight, especially for international applicants.',
          ],
        },
      ],
      howToHeading: 'Creating a German-style CV with CV Maker',
      howToSteps: [
        { title: 'Choose a tabular template', text: 'Pick a clean two-column template matching the German convention — dates left, content right.' },
        { title: 'Add the German details block', text: 'Include the personal information German recruiters expect, with an optional professional photo.' },
        { title: 'State languages in CEFR', text: 'List each language with its level (B1, B2, C1) and certificates — the format German HR reads instantly.' },
        { title: 'Export, date and sign', text: 'Export the PDF, add place and date, sign it — and your Bewerbung is ready to send.' },
      ],
      faqs: [
        {
          question: 'Is a photo required on a German CV?',
          answer: 'Legally no — anti-discrimination law makes it optional. In practice, a professional headshot is still common and many applicants include one.',
        },
        {
          question: 'Should the Lebenslauf be in German or English?',
          answer: 'Match the job ad\'s language. German-language postings expect a German Lebenslauf; international companies posting in English accept English CVs — ideally still in the German tabular format.',
        },
      ],
      screenshotIndex: 1,
    },
  ],
  faqs: [
    {
      question: 'What is CV Maker?',
      answer:
        'CV Maker is an AI-powered resume builder for iPhone and iPad: choose a professional template, add your details, let AI polish the wording, and export a job-ready PDF in minutes.',
      learnMoreSlug: 'resume-for-first-job-no-experience',
    },
    {
      question: 'Can I make a resume with no work experience?',
      answer:
        'Yes — CV Maker is ideal for first resumes. Guided sections help you present school, projects, volunteering and skills, and the AI phrases them professionally.',
      learnMoreSlug: 'resume-for-first-job-no-experience',
    },
    {
      question: 'Are the templates ATS-friendly?',
      answer:
        'Yes — the layouts use standard headings and clean, parse-safe structure, and the exported PDFs contain real selectable text that applicant tracking systems read correctly.',
      learnMoreSlug: 'ats-friendly-resume-on-iphone',
    },
    {
      question: 'Can I create a German-style CV (Lebenslauf)?',
      answer:
        'Yes — use a tabular template, include the German personal-details conventions and CEFR language levels. Our guide walks through the exact format German recruiters expect.',
      learnMoreSlug: 'german-cv-lebenslauf-format',
    },
    {
      question: 'How does the AI writing help work?',
      answer:
        'Describe your experience in plain words and the AI strengthens the phrasing — turning duties into achievements, tightening summaries and fixing weak wording, while you keep full control.',
    },
    {
      question: 'Is CV Maker free?',
      answer:
        'CV Maker is free to download and use. Premium unlocks the complete template library and unlimited AI assistance.',
    },
  ],
  ctaHeading: 'Your Next Job Starts With a Better Resume',
  ctaText: 'Download CV Maker free and have a polished, professional PDF resume ready to send within the hour.',
  category: 'ProductivityApplication',
  downloadNote: 'Free to download • In-app purchases available',
};
