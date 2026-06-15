export type CountryGuide = {
  slug: string;
  country: string;
  demonym: string;
  flag: string;
  studentCount: string;
  seo: {
    title: string;
    description: string;
    path: string;
    keywords: string[];
  };
  heroSubtitle: string;
  intro: string[];
  steps: Array<{ step: number; title: string; desc: string }>;
  documents: string[];
  costs: Array<[string, string]>;
  programs: string[];
  universities?: string[];
};

export const COUNTRY_GUIDE_LINKS = [
  { href: '/study-in-germany-from-india', title: 'India', flag: '🇮🇳' },
  { href: '/study-in-germany-from-pakistan', title: 'Pakistan', flag: '🇵🇰' },
  { href: '/study-in-germany-from-nigeria', title: 'Nigeria', flag: '🇳🇬' },
  { href: '/study-in-germany-from-bangladesh', title: 'Bangladesh', flag: '🇧🇩' },
  { href: '/study-in-germany-from-turkey', title: 'Turkey', flag: '🇹🇷' },
  { href: '/study-in-germany-from-nepal', title: 'Nepal', flag: '🇳🇵' },
] as const;

export const COUNTRY_GUIDES: Record<string, CountryGuide> = {
  nigeria: {
    slug: 'nigeria',
    country: 'Nigeria',
    demonym: 'Nigerian',
    flag: '🇳🇬',
    studentCount: '4,000+',
    seo: {
      title: 'Study in Germany from Nigeria - 2026 Complete Guide',
      description:
        'Complete guide for Nigerian students to study in Germany. Learn about WAEC/NECO recognition, blocked account, IELTS requirements, visa process, and tuition-free universities.',
      path: '/study-in-germany-from-nigeria',
      keywords: [
        'study in Germany from Nigeria',
        'Nigerian students Germany',
        'Germany student visa Nigeria',
        'blocked account Nigeria',
        'tuition-free Germany Nigeria',
        'IELTS Germany Nigeria',
      ],
    },
    heroSubtitle:
      'Everything Nigerian students need to know — from credential evaluation to blocked accounts, embassy appointments, and tuition-free programs.',
    intro: [
      'Germany is increasingly popular among Nigerian students who want quality education without US or UK tuition costs. Public universities charge no tuition for most bachelor\'s and master\'s programs.',
      'Nigerian students typically apply with WAEC/NECO, a bachelor\'s degree for master\'s programs, and proof of English proficiency. Many choose English-taught STEM and business programs.',
    ],
    steps: [
      { step: 1, title: 'Verify Your Certificates', desc: 'Prepare WAEC/NECO, university transcripts, and degree certificates. Universities and uni-assist evaluate whether your qualifications meet German admission standards.' },
      { step: 2, title: 'Take Language Tests', desc: 'English programs usually require IELTS 6.0–7.0 or TOEFL 80–100. German-taught programs need TestDaF or DSH. Most Nigerian applicants target English-taught master\'s degrees.' },
      { step: 3, title: 'Search & Apply', desc: 'Use our AI course finder to shortlist programs. Apply via uni-assist (€75) or directly to universities. Winter intake (October) deadlines are often July 15.' },
      { step: 4, title: 'Open Blocked Account', desc: 'Deposit €11,904 in a Sperrkonto through Expatrio, Fintiba, or Coracle before your visa appointment. You can withdraw €992 per month in Germany.' },
      { step: 5, title: 'Get Health Insurance', desc: 'Arrange travel health insurance for the visa stage, then switch to German public insurance after arrival (around €110/month).' },
      { step: 6, title: 'Apply for Student Visa', desc: 'Book an appointment at the German Embassy in Abuja or Lagos. Processing often takes 6–12 weeks. Bring admission letter, blocked account proof, insurance, and financial documents.' },
      { step: 7, title: 'Arrive & Register', desc: 'Complete city registration (Anmeldung), open a bank account, enroll at university, and apply for your residence permit if required.' },
    ],
    documents: [
      'WAEC/NECO certificate and scratch card verification',
      'Bachelor degree and transcripts (for master\'s applicants)',
      'IELTS/TOEFL score report',
      'Valid passport',
      'Blocked account confirmation (€11,904)',
      'Health insurance certificate',
      'University admission letter',
      'Motivation letter and CV',
      'Passport-size biometric photos',
    ],
    costs: [
      ['Tuition (Public Universities)', 'Free (€0)'],
      ['Semester Fee', '€150–350 per semester'],
      ['Blocked Account', '€11,904 per year'],
      ['Health Insurance', '~€110 per month'],
      ['Rent (Shared)', '€300–500 per month'],
      ['Food & Living', '€200–350 per month'],
      ['Visa Fee', '€75'],
      ['uni-assist Fee', '€75 per application'],
    ],
    programs: [
      'Computer Science & Software Engineering',
      'Mechanical & Electrical Engineering',
      'Data Science & Artificial Intelligence',
      'Business Administration & Finance',
      'Renewable Energy',
      'Public Health & Biotechnology',
    ],
    universities: [
      'TU Munich — strong engineering and technology',
      'RWTH Aachen — top engineering faculty',
      'University of Stuttgart — automotive and manufacturing',
      'TU Berlin — diverse English-taught options',
      'University of Mannheim — business and economics',
    ],
  },
  bangladesh: {
    slug: 'bangladesh',
    country: 'Bangladesh',
    demonym: 'Bangladeshi',
    flag: '🇧🇩',
    studentCount: '8,000+',
    seo: {
      title: 'Study in Germany from Bangladesh - 2026 Complete Guide',
      description:
        'Complete guide for Bangladeshi students to study in Germany. Learn about certificate attestation, blocked account, IELTS requirements, visa appointments, and tuition-free universities.',
      path: '/study-in-germany-from-bangladesh',
      keywords: [
        'study in Germany from Bangladesh',
        'Bangladeshi students Germany',
        'Germany student visa Bangladesh',
        'blocked account Bangladesh',
        'tuition-free Germany Bangladesh',
      ],
    },
    heroSubtitle:
      'Everything Bangladeshi students need to know — from document attestation to blocked accounts, embassy appointments, and English-taught programs.',
    intro: [
      'Germany is one of the most affordable high-quality destinations for Bangladeshi students. Public universities offer tuition-free education, and English-taught master\'s programs are widely available in engineering, IT, and business.',
      'Thousands of Bangladeshi students already study in Germany, especially in Berlin, Munich, and smaller university towns with lower living costs.',
    ],
    steps: [
      { step: 1, title: 'Attest Your Documents', desc: 'Get academic certificates and transcripts attested as required by the German Embassy and your target universities. Keep both original and certified copies ready.' },
      { step: 2, title: 'Take Language Tests', desc: 'For English programs: IELTS 6.0–7.0 or TOEFL 80–100. German-taught programs require TestDaF or DSH. English master\'s programs are the most common route from Bangladesh.' },
      { step: 3, title: 'Search & Apply', desc: 'Shortlist programs with our AI search. Apply through uni-assist or directly. Track winter (July 15) and summer (January 15) deadlines carefully.' },
      { step: 4, title: 'Open Blocked Account', desc: 'Transfer €11,904 to a blocked account provider before your visa interview. This proves you can cover living costs in Germany.' },
      { step: 5, title: 'Get Health Insurance', desc: 'Purchase travel health insurance for visa submission, then enroll in public health insurance after arrival.' },
      { step: 6, title: 'Apply for Student Visa', desc: 'Schedule your appointment at the German Embassy in Dhaka. Bring admission letter, blocked account, insurance, passport, and academic documents.' },
      { step: 7, title: 'Arrive & Register', desc: 'Register your address, enroll at university, open a bank account, and start your residence permit process if needed.' },
    ],
    documents: [
      'SSC & HSC certificates and transcripts',
      'Bachelor degree and transcripts (for master\'s applicants)',
      'Attested academic documents',
      'IELTS/TOEFL score report',
      'Valid passport',
      'Blocked account confirmation',
      'Health insurance certificate',
      'Admission letter from university',
      'Motivation letter and CV',
      'Passport-size photos',
    ],
    costs: [
      ['Tuition (Public Universities)', 'Free (€0)'],
      ['Semester Fee', '€150–350 per semester'],
      ['Blocked Account', '€11,904 per year'],
      ['Health Insurance', '~€110 per month'],
      ['Rent (Shared)', '€250–450 per month'],
      ['Food & Living', '€200–300 per month'],
      ['Visa Fee', '€75'],
      ['uni-assist Fee', '€75 per application'],
    ],
    programs: [
      'Computer Science & IT',
      'Mechanical & Civil Engineering',
      'Business Analytics & Supply Chain',
      'Environmental Science',
      'Electrical Engineering',
      'Economics & Development Studies',
    ],
  },
  turkey: {
    slug: 'turkey',
    country: 'Turkey',
    demonym: 'Turkish',
    flag: '🇹🇷',
    studentCount: '12,000+',
    seo: {
      title: 'Study in Germany from Turkey - 2026 Complete Guide',
      description:
        'Complete guide for Turkish students to study in Germany. Learn about diploma recognition, blocked account, language requirements, visa process, and tuition-free universities.',
      path: '/study-in-germany-from-turkey',
      keywords: [
        'study in Germany from Turkey',
        'Turkish students Germany',
        'Germany student visa Turkey',
        'blocked account Turkey',
        'tuition-free Germany Turkey',
      ],
    },
    heroSubtitle:
      'Everything Turkish students need to know — from diploma recognition to blocked accounts, consulate appointments, and tuition-free programs.',
    intro: [
      'Germany is the top study-abroad destination for Turkish students in Europe. Geographic proximity, strong engineering universities, and tuition-free public education make it especially attractive.',
      'Many Turkish students already speak some German, which opens both German-taught and English-taught programs. After graduation, the 18-month job-seeker visa is a major advantage.',
    ],
    steps: [
      { step: 1, title: 'Check Diploma Recognition', desc: 'Turkish high school and university diplomas are often recognized, but requirements vary by program. Confirm whether your qualification is sufficient or if Studienkolleg is needed.' },
      { step: 2, title: 'Prove Language Skills', desc: 'German-taught programs need TestDaF or DSH. English programs require IELTS or TOEFL. Turkish students frequently qualify for both pathways.' },
      { step: 3, title: 'Search & Apply', desc: 'Apply directly to universities or through uni-assist. Prepare your CV, motivation letter, and transcripts early because competitive programs fill quickly.' },
      { step: 4, title: 'Open Blocked Account', desc: 'Non-EU students must show €11,904 in a blocked account before the visa appointment, even when applying from Turkey.' },
      { step: 5, title: 'Get Health Insurance', desc: 'Arrange visa-stage travel insurance, then register with a German public insurer after arrival.' },
      { step: 6, title: 'Apply for Student Visa', desc: 'Book an appointment at the German consulate in Istanbul, Ankara, or Izmir. Visa processing typically takes several weeks.' },
      { step: 7, title: 'Arrive & Register', desc: 'Complete Anmeldung, enroll at your university, and transition to a residence permit if required.' },
    ],
    documents: [
      'Lise diploma and university transcripts',
      'Bachelor degree (for master\'s applicants)',
      'Language certificate (IELTS, TOEFL, TestDaF, or DSH)',
      'Valid passport',
      'Blocked account confirmation',
      'Health insurance proof',
      'University admission letter',
      'Motivation letter and CV',
      'Biometric photos',
    ],
    costs: [
      ['Tuition (Public Universities)', 'Free (€0)'],
      ['Semester Fee', '€150–350 per semester'],
      ['Blocked Account', '€11,904 per year'],
      ['Health Insurance', '~€110 per month'],
      ['Rent (Shared)', '€300–550 per month'],
      ['Food & Living', '€200–350 per month'],
      ['Visa Fee', '€75'],
      ['uni-assist Fee', '€75 per application'],
    ],
    programs: [
      'Mechanical & Automotive Engineering',
      'Computer Science',
      'Architecture & Design',
      'Business & Management',
      'Medicine-related master\'s programs',
      'Renewable Energy',
    ],
  },
  nepal: {
    slug: 'nepal',
    country: 'Nepal',
    demonym: 'Nepali',
    flag: '🇳🇵',
    studentCount: '2,500+',
    seo: {
      title: 'Study in Germany from Nepal - 2026 Complete Guide',
      description:
        'Complete guide for Nepali students to study in Germany. Learn about document requirements, blocked account, IELTS scores, visa process, and tuition-free universities.',
      path: '/study-in-germany-from-nepal',
      keywords: [
        'study in Germany from Nepal',
        'Nepali students Germany',
        'Germany student visa Nepal',
        'blocked account Nepal',
        'tuition-free Germany Nepal',
      ],
    },
    heroSubtitle:
      'Everything Nepali students need to know — from academic documents to blocked accounts, embassy appointments, and English-taught programs.',
    intro: [
      'Germany is a top destination for Nepali students seeking affordable, high-quality education abroad. Tuition-free public universities and strong post-study work options make it especially appealing compared with Australia or the UK.',
      'Most Nepali applicants target English-taught master\'s programs in engineering, IT, and business, though German-language pathways are also possible with sufficient language preparation.',
    ],
    steps: [
      { step: 1, title: 'Prepare Academic Documents', desc: 'Gather SEE/SLC, +2, and bachelor\'s transcripts and degrees. Universities may require notarized copies and detailed course descriptions for credit evaluation.' },
      { step: 2, title: 'Take Language Tests', desc: 'English-taught programs usually require IELTS 6.0–7.0. German-taught programs need TestDaF or DSH. Start test preparation early because slots fill quickly in Kathmandu.' },
      { step: 3, title: 'Search & Apply', desc: 'Use our program search to find matching courses. Apply through uni-assist or directly. Winter semester deadlines are typically July 15.' },
      { step: 4, title: 'Open Blocked Account', desc: 'Transfer €11,904 to a blocked account provider and keep the confirmation letter for your visa file.' },
      { step: 5, title: 'Get Health Insurance', desc: 'Buy travel health insurance for the visa application, then switch to German public insurance after arrival.' },
      { step: 6, title: 'Apply for Student Visa', desc: 'Book your appointment at the German Embassy in Kathmandu. Processing times vary, so apply as soon as you receive admission.' },
      { step: 7, title: 'Arrive & Register', desc: 'Register your address, complete university enrollment, and settle banking and residence permit formalities.' },
    ],
    documents: [
      'SEE/SLC and +2 transcripts',
      'Bachelor degree and transcripts (for master\'s applicants)',
      'IELTS/TOEFL score report',
      'Valid passport',
      'Blocked account confirmation',
      'Health insurance certificate',
      'Admission letter',
      'Motivation letter and CV',
      'Passport-size photos',
    ],
    costs: [
      ['Tuition (Public Universities)', 'Free (€0)'],
      ['Semester Fee', '€150–350 per semester'],
      ['Blocked Account', '€11,904 per year'],
      ['Health Insurance', '~€110 per month'],
      ['Rent (Shared)', '€300–500 per month'],
      ['Food & Living', '€200–300 per month'],
      ['Visa Fee', '€75'],
      ['uni-assist Fee', '€75 per application'],
    ],
    programs: [
      'Computer Science & IT',
      'Civil & Mechanical Engineering',
      'Hospitality & Tourism Management',
      'Business Administration',
      'Environmental Science',
      'Social Sciences',
    ],
  },
};
