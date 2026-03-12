import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { csvDataProvider } from '@/lib/data/CSVDataProvider';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profile } = await request.json();

    // Build keyword list from profile
    const subjects: string[] = profile.targetSubjects || [];
    const degree = profile.targetDegreeLevel || '';
    const cities: string[] = profile.preferredCities || [];
    const lang = profile.preferredLanguage || '';

    // Get all programs from CSV
    const allPrograms = await csvDataProvider.getAllPrograms();

    // Filter programs based on profile
    let programs = allPrograms;

    // Filter by degree level
    if (degree) {
      const degreeLower = degree.toLowerCase();
      programs = programs.filter(p => {
        const pDegree = (p.degree_level || '').toLowerCase();
        return pDegree.includes(degreeLower) || 
               (degreeLower === 'master' && (pDegree.includes('m.sc') || pDegree.includes('m.a'))) ||
               (degreeLower === 'bachelor' && (pDegree.includes('b.sc') || pDegree.includes('b.a')));
      });
    }

    // Filter by subjects (if any match)
    if (subjects.length > 0) {
      programs = programs.filter(p => {
        const text = `${p.name} ${p.subject || ''} ${p.description || ''}`.toLowerCase();
        return subjects.some(s => text.includes(s.toLowerCase()));
      });
    }

    // Score each program
    const scored = programs.slice(0, 100).map(p => {
      let score = 50;
      const text = `${p.name} ${p.subject || ''} ${p.description || ''}`.toLowerCase();

      // Subject match bonus
      subjects.forEach(s => {
        if (text.includes(s.toLowerCase())) score += 15;
      });

      // City match bonus
      if (cities.length > 0 && cities.some(c => (p.city || '').toLowerCase().includes(c.toLowerCase()))) {
        score += 10;
      }

      // Language match bonus
      if (lang) {
        const langLower = lang.toLowerCase();
        const pLang = (p.language || '').toLowerCase();
        if (langLower === 'english' && pLang.includes('english')) score += 10;
        if (langLower === 'german' && pLang.includes('german')) score += 10;
        if (langLower === 'both') score += 5;
      }

      score = Math.min(score, 98);

      const matchReasons: string[] = [];
      subjects.forEach(s => {
        if (text.includes(s.toLowerCase())) matchReasons.push(s);
      });

      return {
        id: p.id,
        name: p.name,
        university: p.university || '',
        city: p.city || 'Germany',
        language: p.language || 'English',
        degreeLevel: p.degree_level || degree,
        matchScore: score,
        matchReason: matchReasons.length > 0
          ? `Matches your interest in ${matchReasons.slice(0, 2).join(', ')}`
          : `Aligns with your ${degree || 'target'} degree goals`,
      };
    });

    // Sort by score descending, return top 3
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ programs: scored.slice(0, 3) });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ programs: [] });
  }
}
