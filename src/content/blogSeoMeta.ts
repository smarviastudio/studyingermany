/**
 * SEO title and description overrides for WordPress-authored blog posts.
 *
 * The posts in `cms.germanpath.com` were written with long, descriptive headlines.
 * They read well as an H1 but overflow the ~60 character limit Google renders, so the
 * keyword ends up truncated in results. These overrides replace the <title> only —
 * the H1 on the page still uses the original WordPress headline.
 *
 * Keyed by post slug. A slug that is not listed keeps its WordPress title. When a
 * headline is fixed in WordPress itself, delete its entry here.
 */
export const WP_SEO_TITLE_OVERRIDES: Record<string, string> = {
  '18-month-job-seeking-residence-permit-in-germany-after-graduation-full-guide-for-international-students-2025-2026':
    '18-Month Job-Seeking Visa in Germany After Graduation',
  'state-examination-staatsexamen-in-germany-law-medicine-teaching-and-other-regulated-professions':
    'Staatsexamen in Germany: Law, Medicine & Teaching',
  'german-higher-education-entrance-qualification-hzb-do-you-qualify-for-a-bachelor-in-germany':
    'HZB Explained: Do You Qualify for a German Bachelor?',
  '2026-financial-changes-in-germany-higher-social-security-caps-and-health-insurance-thresholds':
    '2026 Financial Changes in Germany: Caps & Thresholds',
  'understanding-tuition-fees-and-studying-for-free-at-public-universities-in-germany':
    'Tuition Fees at German Public Universities Explained',
  'studying-a-bachelor-in-germany-full-guide-for-international-students-2025-2026':
    'Bachelor in Germany: Full Guide for Internationals',
  'university-vs-university-of-applied-sciences-in-germany-which-is-right-for-you':
    'University vs. Fachhochschule in Germany: Which Fits?',
  'can-i-get-an-eu-blue-card-after-studying-in-germany-2026-guide-for-graduates':
    'EU Blue Card After Studying in Germany (2026 Guide)',
  'what-is-a-studienkolleg-in-germany-preparatory-year-for-international-students':
    'What Is a Studienkolleg in Germany? Full Guide',
  'sim-card-or-mobile-contract-in-germany-best-options-for-international-students':
    'SIM Card vs Mobile Contract in Germany for Students',
  'bachelor-and-master-in-germany-explained-duration-credits-and-degree-types':
    'Bachelor & Master in Germany: Duration and Credits',
  'masters-degree-in-germany-for-international-students-full-guide-2025-2026':
    "Master's Degree in Germany: Full Guide for 2026",
  'german-grading-system-explained-gpa-conversion-for-international-students':
    'German Grading System & GPA Conversion Explained',
  'phd-in-germany-explained-structure-admission-funding-and-career-paths':
    'PhD in Germany: Structure, Admission and Funding',
  'master-and-phd-in-germany-explained-advanced-degrees-and-research-paths':
    'Master and PhD in Germany: Advanced Degree Paths',
  'tuition-free-studies-in-germany-2026-guide-for-international-students':
    'Tuition-Free Studies in Germany: 2026 Guide',
  'germany-may-end-free-public-health-insurance-for-non-working-spouses':
    'Germany May End Free Health Cover for Spouses',
  'german-bachelor-degrees-explained-duration-credits-and-entry-paths':
    'German Bachelor Degrees: Duration, Credits, Entry',
  // Migration-remnant slug; the post itself is a real admission checklist.
  '29-2': 'Admission Letter to Arrival: Your Germany Checklist',
  'blocked-account-health-insurance-for-pakistani-students-in-germany':
    'Blocked Account & Health Insurance for Pakistanis',
  'ace-your-application-statement-of-purpose-for-german-universities':
    'Statement of Purpose for German Universities',
  'blocked-account-vs-scholarship-vs-sponsor-best-proof-of-funds':
    'Blocked Account vs Scholarship vs Sponsor',
  'phd-scholarships-in-germany-daad-more-for-international-students':
    'PhD Scholarships in Germany: DAAD and More',
  'chancenkarte-germany-2026-complete-guide-to-the-opportunity-card':
    'Chancenkarte Germany 2026: Opportunity Card Guide',
  'top-in-demand-jobs-in-germany-for-international-graduates-in-2026':
    'In-Demand Jobs in Germany for Graduates (2026)',
  'how-to-write-a-strong-motivation-letter-for-german-universities':
    'Motivation Letter for German Universities: How-To',
  'learn-german-from-zero-a-guide-for-students-in-pakistan-india':
    'Learn German from Zero: Guide for Pakistan & India',
  // The WordPress headline renders as "Top Master s in Germany" — a lost apostrophe.
  'top-masters-in-germany-for-data-science-ai-computer-science':
    "Top Master's in Germany for Data Science and AI",
  'germanys-new-immigration-and-skilled-worker-reforms-for-2026':
    "Germany's New Immigration & Skilled Worker Reforms",
  'private-student-apartments-in-germany-is-living-alone-right':
    'Private Student Apartments in Germany: Worth It?',
  'abitur-a-levels-fsc-waec-accepted-certificates-in-germany':
    'Abitur, A-Levels, FSc, WAEC: Accepted in Germany?',
};

export function getWpSeoTitleOverride(slug: string): string | undefined {
  return WP_SEO_TITLE_OVERRIDES[slug];
}

/**
 * Hand-written meta descriptions for the highest-value posts.
 *
 * Posts without an entry fall back to `buildMetaDescription()` over the WordPress
 * excerpt, which is safe but generic. These are the head-term pages where a written
 * description with a clear benefit is worth the words.
 */
export const WP_SEO_DESCRIPTION_OVERRIDES: Record<string, string> = {
  'chancenkarte-germany-2026-complete-guide-to-the-opportunity-card':
    'How the German Opportunity Card (Chancenkarte) works in 2026: the points system, who qualifies, what it costs and how to apply step by step.',
  'can-i-get-an-eu-blue-card-after-studying-in-germany-2026-guide-for-graduates':
    'Salary thresholds, eligible degrees and the application route for an EU Blue Card after graduating in Germany — plus how it leads to permanent residence.',
  '18-month-job-seeking-residence-permit-in-germany-after-graduation-full-guide-for-international-students-2025-2026':
    'What the 18-month job-seeking permit allows, the documents you need, how to apply after graduation, and what happens once you find a job.',
  'tuition-free-studies-in-germany-2026-guide-for-international-students':
    'Which German universities are still tuition-free in 2026, what the semester fee actually covers, and the states that now charge non-EU students.',
  'what-is-a-studienkolleg-in-germany-preparatory-year-for-international-students':
    'Who needs a Studienkolleg, how the entrance exam (Aufnahmetest) works, the course types, and how the final Feststellungsprüfung gets you into a bachelor.',
  'masters-degree-in-germany-for-international-students-full-guide-2025-2026':
    'Admission requirements, deadlines, costs and the uni-assist process for a master’s in Germany — written for international students applying in 2026.',
  'german-grading-system-explained-gpa-conversion-for-international-students':
    'How German grades from 1.0 to 5.0 work, how to convert your GPA with the Modified Bavarian Formula, and what counts as a good grade for admission.',
  'university-vs-university-of-applied-sciences-in-germany-which-is-right-for-you':
    'Universität or Fachhochschule? Compare teaching style, research focus, admission requirements and career outcomes to pick the right one for you.',
  'phd-in-germany-explained-structure-admission-funding-and-career-paths':
    'Structured programmes versus the individual doctorate, how to find a supervisor, typical funding and salaries, and what a German PhD leads to.',
  'top-in-demand-jobs-in-germany-for-international-graduates-in-2026':
    'The sectors still hiring international graduates in 2026, typical starting salaries, and which degrees give you the strongest shot at a work visa.',
  'blocked-account-vs-scholarship-vs-sponsor-best-proof-of-funds':
    'Compare the three ways to prove financial means for a German student visa — blocked account, scholarship or a sponsor’s Verpflichtungserklärung.',
  'german-higher-education-entrance-qualification-hzb-do-you-qualify-for-a-bachelor-in-germany':
    'Find out whether your school-leaving certificate counts as a German HZB, what to do if it does not, and which countries need a Studienkolleg first.',
  'how-to-write-a-strong-motivation-letter-for-german-universities':
    'What German admissions committees look for in a motivation letter, a section-by-section structure, and the mistakes that get applications rejected.',
  'state-examination-staatsexamen-in-germany-law-medicine-teaching-and-other-regulated-professions':
    'How the Staatsexamen works for medicine, law and teaching in Germany: course length, exam stages, and whether international students can enrol.',
  'abitur-a-levels-fsc-waec-accepted-certificates-in-germany':
    'Whether your Abitur, A-Levels, FSc or WAEC certificate is accepted for direct admission in Germany — and what to do when it is not enough on its own.',
};

export function getWpSeoDescriptionOverride(slug: string): string | undefined {
  return WP_SEO_DESCRIPTION_OVERRIDES[slug];
}
