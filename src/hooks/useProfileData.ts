'use client';

import { useEffect, useState } from 'react';

export type ProfileData = {
  fullName?: string;
  phone?: string;
  nationality?: string;
  address?: string;
  dateOfBirth?: string;
  backgroundSummary?: string;
  academicBackground?: string;
  skills?: string;
  experienceHighlights?: string;
  careerGoals?: string;
  targetDegreeLevel?: string;
  targetSubjects?: string[];
  preferredLanguage?: string;
  germanLevel?: string;
  englishLevel?: string;
};

export function useProfileData(enabled: boolean = true) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        if (!cancelled) setProfile(data.profile || null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, [enabled]);

  return { profile, loading, error } as const;
}
