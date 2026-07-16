import type { Program } from '@/lib/types';
import { csvLoader } from '@/lib/csv/loadPrograms';

// Programmatic SEO hubs: each hub is a curated degree × subject slice of the
// real program dataset, targeting queries like "masters in data science in germany".
// Only hubs with a healthy number of matching programs are defined here.

export type ProgramHub = {
  slug: string;
  degree: 'master' | 'bachelor';
  /** "Master's" / "Bachelor's" — used in H1/copy */
  degreeLabel: string;
  /** e.g. "Computer Science" */
  subjectLabel: string;
  /** lowercase keywords matched against subject tags */
  tagKeywords: string[];
  /** lowercase keywords matched against the program name */
  nameKeywords: string[];
};

export const PROGRAM_HUBS: ProgramHub[] = [
  { slug: 'masters-in-computer-science', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Computer Science', tagKeywords: ['computer science', 'informatics'], nameKeywords: ['computer science', 'informatics'] },
  { slug: 'masters-in-data-science', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Data Science', tagKeywords: ['data science', 'data analytics', 'big data'], nameKeywords: ['data science', 'data analytics', 'data engineering'] },
  { slug: 'masters-in-artificial-intelligence', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Artificial Intelligence', tagKeywords: ['artificial intelligence', 'machine learning'], nameKeywords: ['artificial intelligence', 'machine learning'] },
  { slug: 'masters-in-mechanical-engineering', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Mechanical Engineering', tagKeywords: ['mechanical engineering'], nameKeywords: ['mechanical engineering'] },
  { slug: 'masters-in-electrical-engineering', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Electrical Engineering', tagKeywords: ['electrical'], nameKeywords: ['electrical'] },
  { slug: 'masters-in-civil-engineering', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Civil Engineering', tagKeywords: ['civil engineering', 'civil'], nameKeywords: ['civil engineering'] },
  { slug: 'masters-in-chemical-engineering', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Chemical Engineering', tagKeywords: ['chemical engineering'], nameKeywords: ['chemical engineering'] },
  { slug: 'mba-in-germany', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Business Administration (MBA)', tagKeywords: ['business administration'], nameKeywords: ['mba', 'business administration'] },
  { slug: 'masters-in-economics', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Economics', tagKeywords: ['economics'], nameKeywords: ['economics'] },
  { slug: 'masters-in-finance', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Finance', tagKeywords: ['financial', 'finance'], nameKeywords: ['finance'] },
  { slug: 'masters-in-international-relations', degree: 'master', degreeLabel: "Master's", subjectLabel: 'International Relations', tagKeywords: ['international relations'], nameKeywords: ['international relations'] },
  { slug: 'masters-in-psychology', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Psychology', tagKeywords: ['psychology'], nameKeywords: ['psychology'] },
  { slug: 'masters-in-law', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Law (LL.M.)', tagKeywords: ['law'], nameKeywords: [' law', 'llm'] },
  { slug: 'masters-in-architecture', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Architecture', tagKeywords: ['architecture'], nameKeywords: ['architecture'] },
  { slug: 'masters-in-mathematics', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Mathematics', tagKeywords: ['mathematics'], nameKeywords: ['mathematics'] },
  { slug: 'masters-in-physics', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Physics', tagKeywords: ['physics'], nameKeywords: ['physics'] },
  { slug: 'masters-in-biology', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Biology & Biotechnology', tagKeywords: ['biology', 'biochemistry', 'biotechnology', 'bioengineering'], nameKeywords: ['biolog', 'biotech'] },
  { slug: 'masters-in-environmental-science', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Environmental Science & Sustainability', tagKeywords: ['environmental', 'renewable', 'sustainab'], nameKeywords: ['environment', 'renewable', 'sustainab'] },
  { slug: 'masters-in-public-health', degree: 'master', degreeLabel: "Master's", subjectLabel: 'Public Health & Medicine', tagKeywords: ['public health', 'medicine', 'biomedicine'], nameKeywords: ['public health', 'medical', 'biomedic'] },
  { slug: 'bachelors-in-computer-science', degree: 'bachelor', degreeLabel: "Bachelor's", subjectLabel: 'Computer Science', tagKeywords: ['computer science', 'informatics'], nameKeywords: ['computer science'] },
  { slug: 'bachelors-in-business', degree: 'bachelor', degreeLabel: "Bachelor's", subjectLabel: 'Business', tagKeywords: ['business'], nameKeywords: ['business'] },
  { slug: 'bachelors-in-engineering', degree: 'bachelor', degreeLabel: "Bachelor's", subjectLabel: 'Engineering', tagKeywords: ['engineering'], nameKeywords: ['engineering'] },
];

export function getHubBySlug(slug: string): ProgramHub | undefined {
  return PROGRAM_HUBS.find((hub) => hub.slug === slug);
}

export type HubStats = {
  total: number;
  tuitionFree: number;
  englishTaught: number;
  topCities: string[];
  winterIntake: number;
};

function matchesHub(program: Program, hub: ProgramHub): boolean {
  if ((program.degree_level || '').toLowerCase() !== hub.degree) return false;
  const name = program.program_name.toLowerCase();
  if (name === 'unknown program') return false;
  const tags = program.tags_array.map((t) => t.toLowerCase());
  const tagHit = hub.tagKeywords.some((kw) => tags.some((t) => t.includes(kw)));
  const nameHit = hub.nameKeywords.some((kw) => name.includes(kw));
  return tagHit || nameHit;
}

function isEnglishTaught(program: Program): boolean {
  return program.languages_array.some((l) => l.toLowerCase().includes('english'));
}

export async function getHubPrograms(hub: ProgramHub): Promise<{ programs: Program[]; stats: HubStats }> {
  const all = await csvLoader.loadPrograms();
  const seen = new Set<string>();
  const programs = all.filter((p) => {
    if (!matchesHub(p, hub)) return false;
    // Dedupe by university + program name (dataset contains occasional duplicates)
    const key = `${p.university}::${p.program_name}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Tuition-free first, then English-taught, then alphabetical — deterministic order
  programs.sort((a, b) => {
    const freeDiff = Number(b.is_free ?? false) - Number(a.is_free ?? false);
    if (freeDiff !== 0) return freeDiff;
    const enDiff = Number(isEnglishTaught(b)) - Number(isEnglishTaught(a));
    if (enDiff !== 0) return enDiff;
    return a.program_name.localeCompare(b.program_name);
  });

  const cityCounts = new Map<string, number>();
  let tuitionFree = 0;
  let englishTaught = 0;
  let winterIntake = 0;
  for (const p of programs) {
    if (p.is_free) tuitionFree += 1;
    if (isEnglishTaught(p)) englishTaught += 1;
    if (p.intake_terms.some((t) => t.toLowerCase().includes('winter'))) winterIntake += 1;
    const city = (p.city || '').split(',')[0].trim();
    if (city) cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
  }
  const topCities = [...cityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city]) => city);

  return { programs, stats: { total: programs.length, tuitionFree, englishTaught, topCities, winterIntake } };
}

export { isEnglishTaught };
