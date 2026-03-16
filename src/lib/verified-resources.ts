/**
 * Verified Resources Database
 * Contains real, working URLs for application-related resources
 */

export const VERIFIED_RESOURCES = {
  // Language Preparation
  language: {
    german: {
      courses: [
        { name: "Goethe Institut Online Courses", url: "https://www.goethe.de/en/spr/kup.html", description: "Official German language courses from A1 to C2" },
        { name: "DW Learn German", url: "https://learngerman.dw.com/en/overview", description: "Free German courses by Deutsche Welle" },
        { name: "VHS (Volkshochschule)", url: "https://www.volkshochschule.de/", description: "Affordable local German courses across Germany" },
      ],
      tests: [
        { name: "TestDaF Official", url: "https://www.testdaf.de/en/", description: "Test Deutsch als Fremdsprache - Required for many programs" },
        { name: "Goethe-Zertifikat", url: "https://www.goethe.de/en/spr/kup/prf.html", description: "Internationally recognized German certificates" },
        { name: "DSH Information", url: "https://www.dsh-germany.com/", description: "Deutsche Sprachprüfung für den Hochschulzugang" },
        { name: "telc Deutsch", url: "https://www.telc.net/en/candidates/language-examinations/tests/german.html", description: "European language certificates" },
      ],
    },
    english: {
      tests: [
        { name: "IELTS Official", url: "https://www.ielts.org/", description: "International English Language Testing System" },
        { name: "IELTS Preparation", url: "https://www.ielts.org/for-test-takers/how-to-prepare", description: "Official IELTS preparation resources" },
        { name: "TOEFL Official", url: "https://www.ets.org/toefl.html", description: "Test of English as a Foreign Language" },
        { name: "TOEFL Preparation", url: "https://www.ets.org/toefl/test-takers/ibt/prepare.html", description: "Official TOEFL iBT preparation" },
        { name: "Cambridge English", url: "https://www.cambridgeenglish.org/exams-and-tests/", description: "Cambridge Assessment English tests" },
        { name: "Duolingo English Test", url: "https://englishtest.duolingo.com/", description: "Online English proficiency test" },
      ],
    },
  },

  // Application Portals
  applicationPortals: {
    uniAssist: {
      name: "uni-assist",
      url: "https://www.uni-assist.de/en/",
      description: "Central application service for international students - processes applications for 170+ German universities",
    },
    directApplication: {
      name: "Direct University Application",
      description: "Apply directly through the university's online portal",
    },
    hochschulstart: {
      name: "Hochschulstart",
      url: "https://www.hochschulstart.de/",
      description: "Central portal for medicine, pharmacy, dentistry, and veterinary medicine",
    },
  },

  // Financial Requirements
  financial: {
    blockedAccount: [
      { name: "Fintiba", url: "https://www.fintiba.com/", description: "Digital blocked account + health insurance bundle" },
      { name: "Expatrio", url: "https://www.expatrio.com/", description: "Blocked account provider with student services" },
      { name: "Deutsche Bank", url: "https://www.deutsche-bank.de/pk/konto-und-karte/konten-im-ueberblick/internationales-studentenkonto.html", description: "Traditional bank blocked account" },
      { name: "Coracle (formerly X-patrio)", url: "https://www.coracle.de/", description: "Blocked account for international students" },
    ],
    scholarships: [
      { name: "DAAD Scholarships", url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/", description: "German Academic Exchange Service scholarships" },
      { name: "Deutschlandstipendium", url: "https://www.deutschlandstipendium.de/de/english-1700.html", description: "National scholarship program" },
      { name: "Studienstiftung", url: "https://www.studienstiftung.de/en/", description: "German Academic Scholarship Foundation" },
      { name: "Heinrich Böll Foundation", url: "https://www.boell.de/en/scholarships", description: "Scholarships for international students" },
    ],
    financialProofInfo: {
      amount: 11904, // EUR per year (2024/2025)
      monthlyAmount: 992, // EUR per month
      description: "As of 2024, international students must prove €11,904/year (€992/month) in a blocked account for visa purposes.",
      note: "This amount is updated annually. Check the German embassy website for the latest requirements.",
    },
  },

  // Visa & Immigration
  visa: {
    general: [
      { name: "German Embassy/Consulate Finder", url: "https://www.auswaertiges-amt.de/en/aussenpolitik/laenderinformationen", description: "Find your local German embassy or consulate" },
      { name: "Germany Visa Information", url: "https://www.germany.info/us-en/service/visa", description: "Official visa information (US example - find your country)" },
      { name: "Make it in Germany", url: "https://www.make-it-in-germany.com/en/visa-residence/types/studying", description: "Official German government portal for studying" },
    ],
    requirements: {
      description: "Student visa requirements typically include: valid passport, university admission letter, proof of finances (blocked account), health insurance, and completed visa application form.",
      processingTime: "4-12 weeks depending on your country",
    },
  },

  // Health Insurance
  healthInsurance: [
    { name: "TK (Techniker Krankenkasse)", url: "https://www.tk.de/en", description: "Public health insurance - popular among students" },
    { name: "AOK", url: "https://en.zuwanderer.aok.de/", description: "Public health insurance for international students" },
    { name: "Barmer", url: "https://www.barmer.de/en", description: "Public health insurance provider" },
    { name: "DAK", url: "https://www.dak.de/", description: "Public health insurance" },
    { name: "Mawista", url: "https://www.mawista.com/en/", description: "Private health insurance for students" },
    { name: "Care Concept", url: "https://www.care-concept.de/", description: "Travel and student health insurance" },
  ],

  // Document Services
  documents: {
    aps: {
      name: "APS Certificate",
      url: "https://www.aps.org.cn/en/",
      description: "Academic evaluation certificate required for students from China, Vietnam, Mongolia, and India",
      countries: ["China", "Vietnam", "Mongolia", "India"],
    },
    anabin: {
      name: "Anabin Database",
      url: "https://anabin.kmk.org/",
      description: "Check if your degree is recognized in Germany",
    },
    apostille: {
      description: "Official certification of documents - obtain from your country's designated authority",
    },
    translation: {
      description: "Certified translations of documents not in German or English may be required",
    },
  },

  // Accommodation
  accommodation: [
    { name: "Studierendenwerk", url: "https://www.studierendenwerke.de/en/topics/housing", description: "Student housing services at German universities" },
    { name: "WG-Gesucht", url: "https://www.wg-gesucht.de/en/", description: "Find shared apartments (WG) in Germany" },
    { name: "Immobilienscout24", url: "https://www.immobilienscout24.de/", description: "Germany's largest property portal" },
    { name: "Studenten-WG", url: "https://www.studenten-wg.de/", description: "Student flat-sharing portal" },
  ],

  // Internal Tools (our platform)
  internalTools: {
    cvMaker: { url: "/cv-maker", label: "Create CV", type: "cv" as const },
    motivationLetter: { url: "/motivation-letter", label: "Write Motivation Letter", type: "letter" as const },
    profile: { url: "/profile", label: "Complete Your Profile", type: "document" as const },
  },
};

// Helper function to get resource by step type
export function getResourcesForStep(stepType: string): { name: string; url: string; description: string }[] {
  switch (stepType.toLowerCase()) {
    case 'language_german':
    case 'german_test':
      return [...VERIFIED_RESOURCES.language.german.courses, ...VERIFIED_RESOURCES.language.german.tests];
    case 'language_english':
    case 'english_test':
      return VERIFIED_RESOURCES.language.english.tests;
    case 'blocked_account':
    case 'financial':
      return VERIFIED_RESOURCES.financial.blockedAccount;
    case 'scholarship':
      return VERIFIED_RESOURCES.financial.scholarships;
    case 'visa':
      return VERIFIED_RESOURCES.visa.general;
    case 'health_insurance':
      return VERIFIED_RESOURCES.healthInsurance;
    case 'accommodation':
      return VERIFIED_RESOURCES.accommodation;
    default:
      return [];
  }
}

// Get financial proof requirements
export function getFinancialProofInfo() {
  return VERIFIED_RESOURCES.financial.financialProofInfo;
}

// Get application portal based on channel
export function getApplicationPortal(channel?: string) {
  if (!channel) return VERIFIED_RESOURCES.applicationPortals.uniAssist;
  const lower = channel.toLowerCase();
  if (lower.includes('uni-assist') || lower.includes('uniassist')) {
    return VERIFIED_RESOURCES.applicationPortals.uniAssist;
  }
  if (lower.includes('hochschulstart')) {
    return VERIFIED_RESOURCES.applicationPortals.hochschulstart;
  }
  return VERIFIED_RESOURCES.applicationPortals.directApplication;
}
