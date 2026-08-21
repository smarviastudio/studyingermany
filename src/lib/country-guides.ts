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
  /**
   * Long-form, country-specific sections. The original guides were a fixed
   * skeleton of lists which rendered at roughly 500 words — far short of the
   * pages ranking for these terms. This is where the depth lives.
   */
  sections?: Array<{
    heading: string;
    body: string[];
    table?: { headers: string[]; rows: string[][] };
  }>;
  /** Rendered as visible Q&A and emitted as FAQPage structured data. */
  faqs?: Array<{ q: string; a: string }>;
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
  india: {
    slug: 'india',
    country: 'India',
    demonym: 'Indian',
    flag: '🇮🇳',
    studentCount: '58,000+',
    seo: {
      title: 'Study in Germany from India - 2026 Complete Guide',
      description: 'Complete guide for Indian students: APS certificate, blocked account, IELTS requirements, tuition-free universities and the visa process.',
      path: '/study-in-germany-from-india',
      keywords: [
        'study in Germany from India',
        'Indian students Germany',
        'APS certificate India',
        'Germany student visa India',
        'blocked account India',
        'tuition-free Germany India',
      ],
    },
    heroSubtitle: 'Everything Indian students need to know — from the APS certificate to blocked accounts, VFS appointments and tuition-free programmes.',
    intro: [
      'India is the largest single source of international students in Germany, with more than 58,000 enrolled. The appeal is straightforward: public universities charge no tuition, and a German master\'s costs a fraction of the equivalent in the US, UK or Canada.',
      'The process is well-trodden and highly documented, which works in your favour. It is also front-loaded with verification steps that take months, so the applicants who succeed are the ones who started early rather than the ones with the best grades.',
    ],
    steps: [
      {
        step: 1,
        title: 'Apply for your APS certificate',
        desc: 'The APS office at the German Embassy in New Delhi verifies your academic credentials, and it is mandatory for Indian applicants. Processing runs roughly 4–8 weeks, with a fee of about ₹18,000. Start this before anything else.',
      },
      {
        step: 2,
        title: 'Take your language test',
        desc: 'English-taught programmes usually want IELTS Academic 6.0–7.0 or TOEFL iBT 80–100. German-taught programmes require TestDaF or DSH. Most Indian applicants target English-taught master\'s programmes.',
      },
      {
        step: 3,
        title: 'Shortlist and apply',
        desc: 'Apply through uni-assist or directly, depending on the programme. Winter intake deadlines cluster around 15 July, though selective programmes close considerably earlier.',
      },
      {
        step: 4,
        title: 'Open a blocked account',
        desc: 'Deposit €11,904 — roughly ₹10.5 lakhs — in a Sperrkonto through Expatrio, Fintiba, Coracle or a traditional bank. You draw €992 per month after arriving.',
      },
      {
        step: 5,
        title: 'Arrange health insurance',
        desc: 'Take travel health insurance for the visa stage, then switch to German public insurance after arrival, around €120–€130 per month. TK, AOK and Barmer are the common providers.',
      },
      {
        step: 6,
        title: 'Apply for the student visa',
        desc: 'Book a VFS appointment in Delhi, Mumbai, Bengaluru, Chennai, Kolkata or Hyderabad. Processing typically runs 4–12 weeks after the appointment. The visa fee is €75.',
      },
      {
        step: 7,
        title: 'Arrive and register',
        desc: 'Complete your Anmeldung within 14 days of moving in, open a German bank account, get a SIM card and enrol at your university.',
      },
    ],
    documents: [
      'APS certificate',
      'Degree certificates and transcripts',
      'IELTS or TOEFL score report',
      'Class X and XII certificates',
      'Valid passport',
      'Blocked account confirmation (€11,904)',
      'Health insurance certificate',
      'University admission letter',
      'Motivation letter and CV in German format',
      'Biometric passport photographs',
    ],
    costs: [
      [
        'Tuition (public universities)',
        'Free (₹0)',
      ],
      [
        'Semester fee',
        '₹13,000–₹36,000 per semester',
      ],
      [
        'Blocked account',
        '₹10.5 lakhs per year',
      ],
      [
        'Health insurance',
        'around ₹11,500 per month',
      ],
      [
        'Rent (shared room)',
        '₹29,000–₹63,000 per month',
      ],
      [
        'Food and living',
        '₹18,000–₹27,000 per month',
      ],
      [
        'APS fee',
        'around ₹18,000',
      ],
      [
        'Visa fee',
        '€75',
      ],
      [
        'uni-assist fee',
        '€75 first application, €30 each additional',
      ],
    ],
    programs: [
      'Computer Science and Software Engineering',
      'Data Science and Artificial Intelligence',
      'Mechanical and Automotive Engineering',
      'Electrical and Electronics Engineering',
      'Business Administration and Management',
      'Renewable Energy and Environmental Engineering',
    ],
    universities: [
      'TU Munich — consistently the highest-ranked German university',
      'RWTH Aachen — engineering and computer science',
      'TU Berlin — large international cohort',
      'KIT Karlsruhe — computer science and energy',
      'TU Darmstadt — computer science and mechatronics',
    ],
    sections: [
      {
        heading: 'APS is the gate, and it comes first',
        body: [
          'Since November 2022 the APS office at the German Embassy in New Delhi has issued APS certificates for Indian applicants, and the certificate is mandatory — for on-campus and fully online German programmes alike.',
          'The APS verifies that your academic record is genuine. Processing typically runs four to eight weeks, with a fee of around ₹18,000, and demand means the practical wait can be longer during peak periods.',
          'The sequencing point matters more than the details: your visa will not be processed without it, so APS sits in front of your entire timeline. Applicants who begin APS after receiving an admission letter routinely miss their intake.',
        ],
      },
      {
        heading: 'The 70% rule for bachelor\'s applicants',
        body: [
          'Master\'s applicants with a completed Indian bachelor\'s degree are assessed directly. Bachelor\'s applicants face a different bar, and it has recently tightened.',
          'From the winter semester 2026/27 onwards, Indian applicants need a minimum overall score of 70% of the maximum achievable marks in Class XII — for both the Studienkolleg pathway and the direct subject-restricted admission pathway. Below that threshold, direct routes into a German bachelor\'s close off.',
          'If you are applying for a bachelor\'s, check this before anything else, since it determines whether you are looking at direct admission, a Studienkolleg, or a year of Indian university study first. You can also check how your specific board and institution are graded in Anabin, the German credential database.',
        ],
        table: {
          headers: [
            'Your background',
            'Usual route',
          ],
          rows: [
            [
              'Class XII at 70% or above',
              'Studienkolleg or subject-restricted direct admission',
            ],
            [
              'Class XII below 70%',
              'Typically 1–2 years at an Indian university first',
            ],
            [
              'Completed Indian bachelor\'s',
              'Direct application to a master\'s',
            ],
            [
              'Three-year bachelor\'s',
              'Usually accepted for a master\'s; check each programme',
            ],
          ],
        },
      },
      {
        heading: 'Grades, and what German universities actually look at',
        body: [
          'German admission is closer to a checklist than a conversation. Your motivation letter matters far less than it would in the US or the Netherlands, and two things matter far more.',
          'The first is your converted grade. Indian percentages and CGPAs are converted to the German 1.0–5.0 scale, usually with the Modified Bavarian Formula, and many competitive programmes set a hard cut-off around 2.5 — with the most sought-after computer science programmes closer to 2.0. Knowing your converted grade before you build a shortlist saves wasted applications.',
          'The second is subject match. German programmes check whether your bachelor\'s contains the required credits — a specified number of ECTS in mathematics for an engineering master\'s, for instance. A strong grade in a mismatched degree is rejected routinely, and this surprises Indian applicants more than anything else in the process.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is the APS certificate mandatory for Indian students?',
        a: 'Yes. Since November 2022 the APS office at the German Embassy in New Delhi issues it for Indian applicants, and it applies regardless of whether the programme is on-campus or fully online. Your visa will not be processed without it.',
      },
      {
        q: 'How long does APS take?',
        a: 'Typically four to eight weeks of processing, with a fee of around ₹18,000, and longer in peak periods. Start it before you apply to universities rather than after you receive an offer.',
      },
      {
        q: 'Is a three-year Indian bachelor\'s enough for a German master\'s?',
        a: 'In most cases yes, though it depends on the programme and how your institution is graded in Anabin. Some programmes require specific ECTS coverage in core subjects, which matters more than the length of the degree.',
      },
      {
        q: 'What grade do I need?',
        a: 'Competitive programmes typically want a converted German grade of 2.5 or better, and the most sought-after computer science programmes closer to 2.0. Convert your transcript before shortlisting so you apply where you actually clear the threshold.',
      },
      {
        q: 'How much money do I need in the blocked account?',
        a: '€11,904 for twelve months, which is released to you at €992 per month after you arrive. The figure is set nationally and rises most years, so confirm the current amount on your embassy\'s page before transferring. Send €150–€250 over the required figure so exchange rates and intermediary bank fees cannot leave the balance short.',
      },
      {
        q: 'Can I work while studying?',
        a: 'Yes — 140 full days or 280 half days per calendar year, which is roughly 20 hours a week averaged out. A full day is more than four hours worked. A Werkstudent contract also exempts you from health, care and unemployment insurance contributions, so it pays noticeably better per hour than casual work.',
      },
      {
        q: 'Do I need to speak German for an English-taught programme?',
        a: 'Not for admission. You will need it for daily life, most part-time work and a large share of the graduate job market, so starting early is worth it even if your degree is entirely in English.',
      },
    ],
  },
  pakistan: {
    slug: 'pakistan',
    country: 'Pakistan',
    demonym: 'Pakistani',
    flag: '🇵🇰',
    studentCount: '10,000+',
    seo: {
      title: 'Study in Germany from Pakistan - 2026 Complete Guide',
      description: 'Complete guide for Pakistani students: visa requirements, blocked account, HEC attestation, IELTS scores and tuition-free German universities.',
      path: '/study-in-germany-from-pakistan',
      keywords: [
        'study in Germany from Pakistan',
        'Pakistani students Germany',
        'Germany student visa Pakistan',
        'HEC attestation Germany',
        'blocked account Pakistan',
        'APS Pakistan',
        'tuition-free Germany Pakistan',
      ],
    },
    heroSubtitle: 'Everything Pakistani students need to know — from APS and HEC attestation to blocked accounts, embassy appointments and tuition-free programmes.',
    intro: [
      'Germany has become one of the most popular destinations for Pakistani students, and the reason is simple arithmetic: public universities charge no tuition, so a master\'s degree costs a fraction of the equivalent in the UK, the US or Australia.',
      'What it costs instead is time and paperwork. Pakistani applicants face two verification steps that applicants from many other countries do not, and both take longer than people expect. Start early and the process is very manageable.',
    ],
    steps: [
      {
        step: 1,
        title: 'Start your APS certificate',
        desc: 'The APS (Akademische Prüfstelle) office at the German Embassy in Islamabad verifies your academic documents, and it is required before a student visa. Budget several months: appointment waits have been running long, and processing takes a further 8–12 weeks. PhD applicants are currently exempt.',
      },
      {
        step: 2,
        title: 'Get HEC attestation',
        desc: 'Have your degrees and transcripts attested by the Higher Education Commission. This typically takes 2–4 weeks and is required alongside your APS application and university applications.',
      },
      {
        step: 3,
        title: 'Take your language test',
        desc: 'English-taught programmes usually want IELTS Academic 6.0–7.0 or TOEFL iBT 80–100. German-taught programmes require TestDaF, DSH or telc C1 Hochschule. Most Pakistani applicants target English-taught master\'s programmes.',
      },
      {
        step: 4,
        title: 'Shortlist and apply',
        desc: 'Apply through uni-assist or directly to the university, depending on the programme. Winter intake deadlines cluster around 15 July, but many programmes close earlier — always check the individual programme page.',
      },
      {
        step: 5,
        title: 'Open a blocked account',
        desc: 'Deposit €11,904 in a Sperrkonto through Expatrio, Fintiba, Coracle or a traditional bank. You draw €992 per month once you arrive. Send a buffer over the required amount so conversion and transfer fees cannot leave it short.',
      },
      {
        step: 6,
        title: 'Arrange health insurance',
        desc: 'Take travel health insurance covering the period from departure until your German public insurance begins, then switch to public cover (around €120–€130 per month) after arrival.',
      },
      {
        step: 7,
        title: 'Apply for the student visa',
        desc: 'Book at the German Embassy in Islamabad or the Consulate in Karachi. Book the appointment as early as possible — it is usually the slowest step. Processing typically runs 6–12 weeks after the appointment.',
      },
      {
        step: 8,
        title: 'Arrive and register',
        desc: 'Complete your Anmeldung within 14 days of moving in, open a German bank account, enrol at your university, and apply for your residence permit before the visa expires.',
      },
    ],
    documents: [
      'APS certificate',
      'HEC-attested degrees and transcripts',
      'IELTS or TOEFL score report',
      'Valid passport with at least 12 months validity',
      'Blocked account confirmation (€11,904)',
      'Health insurance certificate',
      'University admission letter',
      'Motivation letter and CV in German format',
      'Biometric passport photographs',
    ],
    costs: [
      [
        'Tuition (public universities)',
        'Free (€0)',
      ],
      [
        'Semester fee',
        '€150–€400 per semester',
      ],
      [
        'Blocked account',
        '€11,904 per year',
      ],
      [
        'Health insurance',
        '€120–€130 per month',
      ],
      [
        'Rent (shared room)',
        '€320–€700 per month',
      ],
      [
        'Food and living',
        '€200–€300 per month',
      ],
      [
        'APS fee',
        'around €185',
      ],
      [
        'Visa fee',
        '€75',
      ],
      [
        'uni-assist fee',
        '€75 first application, €30 each additional',
      ],
    ],
    programs: [
      'Computer Science and Software Engineering',
      'Mechanical and Electrical Engineering',
      'Data Science and Artificial Intelligence',
      'Business Administration and Finance',
      'Renewable and Sustainable Energy',
      'Public Health and Biotechnology',
    ],
    universities: [
      'TU Munich — engineering and technology',
      'RWTH Aachen — engineering and computer science',
      'TU Berlin — broad English-taught options',
      'University of Stuttgart — automotive and manufacturing',
      'TU Dresden — microelectronics and transport',
    ],
    sections: [
      {
        heading: 'APS: the step that decides your timeline',
        body: [
          'The single most important thing for a Pakistani applicant to understand is that the APS certificate sits in front of everything else, and it is slow.',
          'The APS office at the German Embassy in Islamabad verifies that your academic documents are genuine. Applications are made online and physical documents are couriered to the Islamabad office. The fee is around €185, processing runs roughly 8–12 weeks after your interview, and appointment waiting times have been running into several months. PhD candidates are currently exempt, which makes their route considerably faster.',
          'Add those together and APS alone can consume six months. Because a student visa will not be processed without it, this is the step that determines which intake you can realistically target — not your university deadline.',
          'Requirements do change, and older guides still say Pakistani applicants do not need APS. Confirm the current position directly with the German Embassy in Islamabad before you plan around anything, including this page.',
        ],
        table: {
          headers: [
            'Stage',
            'Typical duration',
          ],
          rows: [
            [
              'APS appointment wait',
              'Several months in 2026',
            ],
            [
              'APS processing after interview',
              '8–12 weeks',
            ],
            [
              'HEC attestation',
              '2–4 weeks',
            ],
            [
              'uni-assist processing',
              '6–8 weeks',
            ],
            [
              'Visa processing after appointment',
              '6–12 weeks',
            ],
          ],
        },
      },
      {
        heading: 'Working backwards from an October intake',
        body: [
          'Because several of these stages run in sequence rather than parallel, planning forward from today is how people lose a year. Work backwards instead.',
          'For an October start you want APS underway around 12 months ahead, HEC attestation done alongside it, language test sat by roughly nine months out, applications submitted to uni-assist by mid-May at the latest, and your visa appointment booked as early as the system allows — before your documents are complete, because the slot is scarcer than the paperwork.',
          'If that timeline has already passed, the April intake is a serious option rather than a consolation prize. Fewer applicants compete for it, housing is far easier to find, and the visa appointment queue is much shorter than the one every October applicant joins between May and August.',
        ],
      },
      {
        heading: 'Funding it from Pakistan',
        body: [
          'The blocked account is your own money held in escrow, not a fee. You deposit €11,904 and draw €992 a month after arriving. What catches Pakistani applicants out is the transfer rather than the amount.',
          'Rupee transfers frequently pass through intermediary banks that deduct charges en route, and the balance only has to land marginally short for the blocking confirmation to be refused at the required amount. Send €150–€250 over, use the exact reference your provider issued, and prefer one transfer over several.',
          'Note also that €992 a month is a legal minimum rather than a comfortable budget everywhere. It works in Leipzig or Dresden and falls short in Munich or Frankfurt, so the city you choose has more effect on your finances than almost any other decision.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do Pakistani students need an APS certificate?',
        a: 'Current guidance from the APS office at the German Embassy in Islamabad is that it is required before a student visa, with PhD candidates exempt. Some older articles state the opposite, because the requirement was introduced after they were written. Confirm directly with the embassy before planning your timeline.',
      },
      {
        q: 'How long does the whole process take from Pakistan?',
        a: 'Realistically 9–12 months from starting APS to flying. APS is the long pole — appointment waits plus 8–12 weeks of processing — and the visa appointment adds more. Starting a year ahead of your intended intake is not excessive.',
      },
      {
        q: 'Is HEC attestation still needed if I have APS?',
        a: 'They serve different purposes and are generally both expected: HEC attests your Pakistani qualifications, while APS verifies your academic record for German purposes. Check what your specific university and the embassy require.',
      },
      {
        q: 'Which is better, Islamabad or Karachi, for the visa appointment?',
        a: 'Whichever gives you an earlier slot. Both handle student visas, and since the appointment is usually the bottleneck, availability matters more than location.',
      },
      {
        q: 'How much money do I need in the blocked account?',
        a: '€11,904 for twelve months, which is released to you at €992 per month after you arrive. The figure is set nationally and rises most years, so confirm the current amount on your embassy\'s page before transferring. Send €150–€250 over the required figure so exchange rates and intermediary bank fees cannot leave the balance short.',
      },
      {
        q: 'Can I work while studying?',
        a: 'Yes — 140 full days or 280 half days per calendar year, which is roughly 20 hours a week averaged out. A full day is more than four hours worked. A Werkstudent contract also exempts you from health, care and unemployment insurance contributions, so it pays noticeably better per hour than casual work.',
      },
      {
        q: 'Do I need to speak German for an English-taught programme?',
        a: 'Not for admission. You will need it for daily life, most part-time work and a large share of the graduate job market, so starting early is worth it even if your degree is entirely in English.',
      },
    ],
  },
  nigeria: {
    slug: 'nigeria',
    country: 'Nigeria',
    demonym: 'Nigerian',
    flag: '🇳🇬',
    studentCount: '4,000+',
    seo: {
      title: 'Study in Germany from Nigeria - 2026 Complete Guide',
      description:
        'Complete guide for Nigerian students: WAEC/NECO recognition, blocked account, IELTS requirements, visa process and tuition-free universities.',
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
    sections: [
      {
        heading: 'Will your WAEC or NECO certificate get you in?',
        body: [
          'This is the question that decides everything else, and it is where most Nigerian applications go wrong. Germany does not assess your school-leaving certificate on its own merits — it asks whether that certificate would have qualified you for university at home, and whether it maps onto the German higher education entrance qualification, the Hochschulzugangsberechtigung or HZB.',
          'For most Nigerian applicants, WASSCE or NECO alone is not sufficient for direct entry to a German bachelor\'s degree. The usual expectation is that you have already completed one to two years of study at a recognised Nigerian university, or that you complete a Studienkolleg — a one-year preparatory course ending in an assessment exam called the Feststellungsprüfung — before starting your degree.',
          'You can check how your specific qualification is graded in Anabin, the German database of foreign credentials. It is in German, but it is the same source the universities and uni-assist use, so it tells you the answer before you spend money on applications.',
          'Master\'s applicants have a simpler path: a completed Nigerian bachelor\'s degree from a recognised university is normally assessed directly, with no Studienkolleg involved.',
        ],
        table: {
          headers: [
            'Your background',
            'Usual route',
          ],
          rows: [
            [
              'WASSCE/NECO only',
              'Studienkolleg, then a bachelor\'s',
            ],
            [
              'WASSCE plus 1–2 years at a Nigerian university',
              'Often direct entry to a bachelor\'s',
            ],
            [
              'Completed Nigerian bachelor\'s degree',
              'Direct application to a master\'s',
            ],
            [
              'HND',
              'Assessed case by case — check Anabin first',
            ],
          ],
        },
      },
      {
        heading: 'Moving the money: the part Nigerian applicants underestimate',
        body: [
          'Opening a blocked account is straightforward. Funding it from Nigeria is the step that causes delays, and it is worth planning months rather than weeks for.',
          'You need €11,904 to arrive in the account after every fee and conversion. Naira transfers frequently pass through intermediary banks that deduct charges en route, and if the balance lands even slightly short, the blocking confirmation will not be issued for the required amount — which means no visa appointment document.',
          'Practical protections: send a buffer of €150–€250 over the requirement, ask your bank explicitly about intermediary and correspondent charges rather than only the headline fee, use the exact reference number your provider issued, and send one transfer rather than several. Start the transfer well before your appointment, because international transfers from Nigeria can take longer than the three to seven working days quoted.',
        ],
      },
      {
        heading: 'Appointments at Abuja and Lagos',
        body: [
          'Germany maintains an embassy in Abuja and a consulate-general in Lagos, and both handle student visas. Demand is high and waiting times are long enough that the appointment, not the paperwork, is usually what determines whether you make your intake.',
          'The embassy\'s own advice is to book as soon as your travel date is foreseeable. In practice that means booking before your documents are complete — you can assemble paperwork while you wait, but you cannot manufacture a slot. Screenshot any page showing no availability, with the date visible, so you have a record if you later need to explain a delay to your university.',
          'If no slot is available before your semester begins, contact your university about deferring to the next intake rather than missing enrolment entirely. The April intake is genuinely worth considering for this reason alone: its visa queue is far shorter than the one every October applicant joins between May and August.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do Nigerian students need an APS certificate?',
        a: 'No. The APS applies to applicants who studied in India, China, Vietnam and Mongolia. Nigerian qualifications are assessed by uni-assist and the universities directly. You will still need properly verified WAEC or NECO results, including scratch card verification where requested.',
      },
      {
        q: 'Is WAEC enough for direct admission to a German bachelor\'s?',
        a: 'Usually not on its own. Most Nigerian applicants either complete one to two years at a Nigerian university first or attend a Studienkolleg and pass the Feststellungsprüfung. Check your exact qualification in the Anabin database before assuming either way.',
      },
      {
        q: 'Which English test should I take?',
        a: 'IELTS Academic or TOEFL iBT are accepted essentially everywhere. Some universities accept a Medium of Instruction letter confirming your Nigerian degree was taught in English, which is free and worth checking before paying for a test. Duolingo is accepted by far fewer German universities and is often not accepted at the visa stage.',
      },
      {
        q: 'How long does the visa take from Nigeria?',
        a: 'Budget four to twelve weeks of processing after your appointment, and remember that the wait for the appointment itself is frequently longer than the processing. Do not book non-refundable flights until the visa is in your passport.',
      },
      {
        q: 'How much money do I need in the blocked account?',
        a: '€11,904 for twelve months, which is released to you at €992 per month after you arrive. The figure is set nationally and rises most years, so confirm the current amount on your embassy\'s page before transferring. Send €150–€250 over the required figure so exchange rates and intermediary bank fees cannot leave the balance short.',
      },
      {
        q: 'Can I work while studying?',
        a: 'Yes — 140 full days or 280 half days per calendar year, which is roughly 20 hours a week averaged out. A full day is more than four hours worked. A Werkstudent contract also exempts you from health, care and unemployment insurance contributions, so it pays noticeably better per hour than casual work.',
      },
      {
        q: 'Do I need to speak German for an English-taught programme?',
        a: 'Not for admission. You will need it for daily life, most part-time work and a large share of the graduate job market, so starting early is worth it even if your degree is entirely in English.',
      },
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
        'Complete guide for Bangladeshi students: certificate attestation, blocked account, IELTS requirements, visa appointments and tuition-free unis.',
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
    sections: [
      {
        heading: 'How your HSC and bachelor\'s are assessed',
        body: [
          'Germany checks whether your qualification would have admitted you to university in Bangladesh and how it maps onto the German entrance qualification, the HZB. An HSC certificate on its own is generally not enough for direct entry to a German bachelor\'s degree.',
          'The common routes are either one to two years of completed study at a recognised Bangladeshi university before applying, or a Studienkolleg in Germany — a preparatory year ending in the Feststellungsprüfung. Applicants with a completed four-year bachelor\'s from a recognised university normally apply directly to master\'s programmes without any preparatory step.',
          'The Anabin database is where you check your specific institution and qualification. It is worth doing this before paying application fees, because an institution\'s status there determines whether your application is assessable at all.',
        ],
        table: {
          headers: [
            'Your background',
            'Usual route',
          ],
          rows: [
            [
              'HSC only',
              'Studienkolleg, then a bachelor\'s',
            ],
            [
              'HSC plus 1–2 years at university',
              'Often direct entry to a bachelor\'s',
            ],
            [
              'Four-year bachelor\'s',
              'Direct application to a master\'s',
            ],
            [
              'Three-year bachelor\'s',
              'Assessed case by case; some programmes require a further year',
            ],
          ],
        },
      },
      {
        heading: 'The Dhaka embassy process',
        body: [
          'All student visa applicants at the German Embassy in Dhaka must register for an appointment online before submitting anything. Turning up without one does not work, and arriving more than fifteen minutes late means rebooking — which, given waiting times, can cost a semester.',
          'The embassy has been moving the student visa process onto its Consular Services Portal for newly registering applicants, so check the current procedure on the Dhaka mission\'s own pages rather than relying on any third-party checklist, including this one. Passports are expected to have at least twelve months of validity.',
          'Because the appointment is the bottleneck, book it as early as your plans allow and assemble documents in parallel.',
        ],
      },
      {
        heading: 'Costs, and what your funding actually has to cover',
        body: [
          'Tuition at public universities is zero for most programmes, which is the reason Germany is affordable at all compared with the UK, the US or Australia. What you must fund is living costs, and the German state requires you to prove it before issuing a visa.',
          'The €11,904 blocked account is a legal minimum, not a realistic budget in every city. It is comfortable in Leipzig or Dresden and short in Munich or Frankfurt, where rent alone can take most of the monthly release. Choosing a cheaper city is the single largest lever on your total cost — larger than every other saving combined.',
          'Fund the transfer with a margin. If conversion and intermediary charges leave the account below €11,904, the blocking confirmation will not be issued for the required amount and your appointment is wasted.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do Bangladeshi students need an APS certificate?',
        a: 'No. The APS covers applicants who studied in India, China, Vietnam and Mongolia. Bangladeshi credentials are assessed through uni-assist and the universities. Your documents will still need proper attestation, so check what your specific university and the Dhaka embassy require.',
      },
      {
        q: 'Is a three-year bachelor\'s accepted for a German master\'s?',
        a: 'It depends on the programme and how your degree is graded in Anabin. Four-year degrees are assessed more straightforwardly. Some German master\'s programmes accept three-year degrees, others expect an additional year of study — check each programme rather than assuming.',
      },
      {
        q: 'How competitive are appointments at the Dhaka embassy?',
        a: 'Competitive enough that the appointment, not the paperwork, usually decides whether you make your intake. Register online as early as you can, and be punctual — being more than fifteen minutes late means rebooking.',
      },
      {
        q: 'Can I apply before my final results are published?',
        a: 'Some universities accept conditional applications with results to follow; many do not. Check each programme individually and never assume, because a missed document at the deadline cannot be fixed afterwards.',
      },
      {
        q: 'How much money do I need in the blocked account?',
        a: '€11,904 for twelve months, which is released to you at €992 per month after you arrive. The figure is set nationally and rises most years, so confirm the current amount on your embassy\'s page before transferring. Send €150–€250 over the required figure so exchange rates and intermediary bank fees cannot leave the balance short.',
      },
      {
        q: 'Can I work while studying?',
        a: 'Yes — 140 full days or 280 half days per calendar year, which is roughly 20 hours a week averaged out. A full day is more than four hours worked. A Werkstudent contract also exempts you from health, care and unemployment insurance contributions, so it pays noticeably better per hour than casual work.',
      },
      {
        q: 'Do I need to speak German for an English-taught programme?',
        a: 'Not for admission. You will need it for daily life, most part-time work and a large share of the graduate job market, so starting early is worth it even if your degree is entirely in English.',
      },
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
        'Complete guide for Turkish students: diploma recognition, blocked account, language requirements, visa process and tuition-free universities.',
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
    sections: [
      {
        heading: 'Turkish qualifications and direct admission',
        body: [
          'Turkish applicants are in a stronger structural position than most non-EU applicants, because Turkish secondary and higher education qualifications are generally well mapped in the German system.',
          'A Turkish lise diploması combined with a sufficient YKS result and a university placement is frequently enough for direct entry to a German bachelor\'s degree, without a Studienkolleg. The condition that catches people out is that the placement usually has to be in a comparable subject — a placement in one field does not automatically qualify you to study an unrelated one in Germany.',
          'For master\'s applicants, a completed Turkish lisans degree from a recognised university is normally assessed directly. As always, check your institution and qualification in Anabin, the German credential database, before committing to applications.',
        ],
        table: {
          headers: [
            'Your background',
            'Usual route',
          ],
          rows: [
            [
              'Lise diploması plus YKS placement',
              'Often direct entry to a comparable subject',
            ],
            [
              'Lise diploması without a placement',
              'Studienkolleg may be required',
            ],
            [
              'Completed lisans degree',
              'Direct application to a master\'s',
            ],
            [
              'Ön lisans (two-year)',
              'Assessed case by case — check Anabin',
            ],
          ],
        },
      },
      {
        heading: 'Language: the decision that shapes your options',
        body: [
          'Turkish applicants have a genuine choice between English-taught and German-taught programmes, and it is worth making deliberately rather than by default.',
          'English-taught master\'s programmes are the easier entry route and require IELTS or TOEFL, but they are a subset of what German universities offer and they attract disproportionate competition precisely because they are the subset international applicants can access.',
          'German-taught programmes require TestDaF, DSH, telc C1 Hochschule or Goethe C2. They are much harder to reach, and they open the full catalogue — including many bachelor\'s programmes that have no English equivalent. If you already have German from school or family, this is a significant advantage that most applicants from other countries simply do not have.',
        ],
      },
      {
        heading: 'Visa, and travelling while you study',
        body: [
          'Turkish nationals need a national Type D visa to study in Germany. The application is made at the German mission responsible for your area — Ankara, Istanbul or İzmir — and the appointment is usually the slowest step rather than the decision itself.',
          'Once issued, a national visa allows travel within the Schengen area for up to 90 days in any 180-day period, which for Turkish students is often the first time visa-free European travel becomes practical.',
          'After arrival the visa is converted into a residence permit. That conversion depends on registering your address within fourteen days of moving in, so the very first thing to arrange after landing is somewhere you can legally register.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do Turkish students need an APS certificate?',
        a: 'No. The APS applies to applicants who studied in India, China, Vietnam and Mongolia. Turkish qualifications are assessed through uni-assist, the universities and the Anabin database.',
      },
      {
        q: 'Can I go straight into a German bachelor\'s with a lise diploması?',
        a: 'Often yes, if you also have a YKS result and a university placement in a comparable subject. Without a placement, a Studienkolleg is frequently required. Check Anabin for how your specific qualification is graded.',
      },
      {
        q: 'Is it better to study in German or English?',
        a: 'English-taught programmes are easier to enter but represent a smaller catalogue with more competition. German-taught programmes open far more options, including most bachelor\'s degrees. If you already have German, use it — it is an advantage few international applicants have.',
      },
      {
        q: 'Does studying in Germany help with long-term residence?',
        a: 'A German degree leads to an 18-month permit to look for qualified work, and from there to an EU Blue Card and eventually permanent residence. Germany actively wants graduates to stay and work.',
      },
      {
        q: 'How much money do I need in the blocked account?',
        a: '€11,904 for twelve months, which is released to you at €992 per month after you arrive. The figure is set nationally and rises most years, so confirm the current amount on your embassy\'s page before transferring. Send €150–€250 over the required figure so exchange rates and intermediary bank fees cannot leave the balance short.',
      },
      {
        q: 'Can I work while studying?',
        a: 'Yes — 140 full days or 280 half days per calendar year, which is roughly 20 hours a week averaged out. A full day is more than four hours worked. A Werkstudent contract also exempts you from health, care and unemployment insurance contributions, so it pays noticeably better per hour than casual work.',
      },
      {
        q: 'Do I need to speak German for an English-taught programme?',
        a: 'Not for admission. You will need it for daily life, most part-time work and a large share of the graduate job market, so starting early is worth it even if your degree is entirely in English.',
      },
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
        'Complete guide for Nepali students: document requirements, blocked account, IELTS scores, visa process and tuition-free universities.',
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
    sections: [
      {
        heading: 'From +2 to a German degree',
        body: [
          'Nepali secondary qualifications — the +2 or the NEB higher secondary certificate — are generally not sufficient on their own for direct entry to a German bachelor\'s degree. Germany asks whether your certificate would have admitted you to university at home and how it compares with the German entrance qualification.',
          'The usual routes are either one to two years of completed study at a recognised Nepali university before applying, or a Studienkolleg in Germany followed by the Feststellungsprüfung assessment exam. Applicants holding a completed Nepali bachelor\'s degree normally apply directly to master\'s programmes with no preparatory step.',
          'Check your specific board and institution in Anabin, the German credential database, before paying any application fees. Institutional status there is what determines whether your application can be assessed at all.',
        ],
        table: {
          headers: [
            'Your background',
            'Usual route',
          ],
          rows: [
            [
              '+2 / NEB only',
              'Studienkolleg, then a bachelor\'s',
            ],
            [
              '+2 plus 1–2 years at a Nepali university',
              'Often direct entry to a bachelor\'s',
            ],
            [
              'Completed bachelor\'s degree',
              'Direct application to a master\'s',
            ],
            [
              'Three-year bachelor\'s',
              'Assessed case by case; some programmes want a further year',
            ],
          ],
        },
      },
      {
        heading: 'Document preparation from Nepal',
        body: [
          'Nepali applicants generally need transcripts, character certificates, migration certificates and degree certificates from their institution, plus certified English translations of anything not already in English. Universities and uni-assist are strict about certification, and a translation that is not properly certified is treated as a missing document.',
          'Build in more time than seems necessary. Obtaining transcripts and equivalence documentation from Nepali institutions can take weeks, and this runs before uni-assist\'s own processing time of six to eight weeks — which itself runs before the university\'s decision.',
          'The practical implication is that a July deadline means starting document collection around February, not June.',
        ],
      },
      {
        heading: 'Budgeting realistically',
        body: [
          'The €11,904 blocked account is the legal minimum for a visa, not a comfortable budget everywhere. In Leipzig or Dresden the €992 monthly release covers a normal student month with something left over. In Munich or Frankfurt it does not cover rent plus insurance plus food, and you will need work or family support from the start.',
          'For applicants funding this from Nepal, the choice of city is therefore also a choice about financial pressure. It is the largest single lever available to you, worth more than every other saving combined.',
          'Send the transfer with a buffer of €150–€250 over the required amount. If conversion and intermediary bank charges leave the account short, the blocking confirmation will not be issued for the required figure.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do Nepali students need an APS certificate?',
        a: 'No. The APS covers applicants who studied in India, China, Vietnam and Mongolia. Nepali credentials are assessed through uni-assist and the universities, though your documents must be properly certified and translated.',
      },
      {
        q: 'Is +2 enough to start a bachelor\'s in Germany?',
        a: 'Usually not on its own. Most Nepali applicants complete one to two years at a Nepali university first, or attend a Studienkolleg and pass the Feststellungsprüfung. Check your board in Anabin before assuming.',
      },
      {
        q: 'How early should I start?',
        a: 'For a July deadline, begin collecting documents around February. Transcripts and certified translations take weeks, and uni-assist needs a further six to eight weeks on top before the university even sees your file.',
      },
      {
        q: 'Which cities are most affordable?',
        a: 'Leipzig, Dresden and other eastern cities are substantially cheaper than Munich, Frankfurt or Hamburg — often €300 to €400 a month less in rent. That difference is larger than any other saving available to you.',
      },
      {
        q: 'How much money do I need in the blocked account?',
        a: '€11,904 for twelve months, which is released to you at €992 per month after you arrive. The figure is set nationally and rises most years, so confirm the current amount on your embassy\'s page before transferring. Send €150–€250 over the required figure so exchange rates and intermediary bank fees cannot leave the balance short.',
      },
      {
        q: 'Can I work while studying?',
        a: 'Yes — 140 full days or 280 half days per calendar year, which is roughly 20 hours a week averaged out. A full day is more than four hours worked. A Werkstudent contract also exempts you from health, care and unemployment insurance contributions, so it pays noticeably better per hour than casual work.',
      },
      {
        q: 'Do I need to speak German for an English-taught programme?',
        a: 'Not for admission. You will need it for daily life, most part-time work and a large share of the graduate job market, so starting early is worth it even if your degree is entirely in English.',
      },
    ],
  },
};
