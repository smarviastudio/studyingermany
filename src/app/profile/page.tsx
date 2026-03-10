'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, CheckCircle, Circle, User, GraduationCap, Target, Globe, Briefcase, Award } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

type UserProfile = {
  targetDegreeLevel?: string;
  targetSubjects?: string[];
  preferredLanguage?: string;
  germanLevel?: string;
  englishLevel?: string;
  academicBackground?: string;
  backgroundSummary?: string;
  skills?: string;
  careerGoals?: string;
  preferredCities?: string[];
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Calculate profile completion percentage
  const calculateProfileCompletion = (profile: UserProfile | null) => {
    if (!profile) return 0;
    const fields = [
      profile.targetDegreeLevel,
      profile.targetSubjects && profile.targetSubjects.length > 0,
      profile.preferredLanguage,
      profile.germanLevel,
      profile.englishLevel,
      profile.academicBackground,
      profile.backgroundSummary,
      profile.skills,
      profile.careerGoals,
      profile.preferredCities && profile.preferredCities.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Load user profile
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data.profile || null);
          setProfileCompletion(calculateProfileCompletion(data.profile || null));
        }
      } catch (error) {
        console.warn('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [isAuthenticated]);

  const handleSaveProfile = async () => {
    if (!isAuthenticated) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      });
      
      if (res.ok) {
        setProfileCompletion(calculateProfileCompletion(userProfile));
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.warn('Failed to save profile', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => {
      const updated = prev ? { ...prev, [field]: value } : { [field]: value };
      setProfileCompletion(calculateProfileCompletion(updated));
      return updated;
    });
  };

  const profileSections = [
    {
      title: 'Academic Goals',
      icon: <GraduationCap className="w-5 h-5" />,
      fields: [
        { key: 'targetDegreeLevel', label: 'Target Degree Level', type: 'select', options: ['Bachelor', 'Master', 'PhD', 'Other'] },
        { key: 'targetSubjects', label: 'Target Subjects', type: 'tags' },
        { key: 'preferredLanguage', label: 'Preferred Language', type: 'select', options: ['English', 'German', 'Both'] }
      ]
    },
    {
      title: 'Language Skills',
      icon: <Globe className="w-5 h-5" />,
      fields: [
        { key: 'germanLevel', label: 'German Level', type: 'select', options: ['None', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'] },
        { key: 'englishLevel', label: 'English Level', type: 'select', options: ['None', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'] }
      ]
    },
    {
      title: 'Background',
      icon: <User className="w-5 h-5" />,
      fields: [
        { key: 'academicBackground', label: 'Academic Background', type: 'textarea' },
        { key: 'backgroundSummary', label: 'Background Summary', type: 'textarea' },
        { key: 'skills', label: 'Skills', type: 'textarea' }
      ]
    },
    {
      title: 'Career Goals',
      icon: <Target className="w-5 h-5" />,
      fields: [
        { key: 'careerGoals', label: 'Career Goals', type: 'textarea' },
        { key: 'preferredCities', label: 'Preferred Cities', type: 'tags' }
      ]
    }
  ];

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <User className="w-16 h-16" style={{ color: '#999', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#111', marginBottom: 16 }}>Please Sign In</h2>
            <p style={{ fontSize: 16, color: '#737373', marginBottom: 24 }}>You need to be signed in to complete your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa' }}>
        <SiteNav />
        <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 40, height: 40, margin: '0 auto', border: '4px solid #f3f3f3', borderTop: '4px solid #dd0000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ fontSize: 16, color: '#737373', marginTop: 16 }}>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <SiteNav />
      
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#666', textDecoration: 'none', fontSize: 14, marginBottom: 16 }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#0a0a0a', margin: '0 0 6px' }}>Complete Your Profile</h1>
              <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>Fill in your information for better program recommendations</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: profileCompletion === 100 ? '#22c55e' : '#dd0000' }}>{profileCompletion}%</div>
              <div style={{ fontSize: 12, color: '#737373' }}>Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${profileCompletion}%`, height: '100%', background: profileCompletion === 100 ? '#22c55e' : 'linear-gradient(90deg, #dd0000, #7c3aed)', borderRadius: 4, transition: 'width 0.3s ease' }} />
          </div>
        </header>

        {/* Profile Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {profileSections.map((section, sectionIndex) => (
            <section key={sectionIndex} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #dd0000, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {section.icon}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>{section.title}</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <label style={{ fontSize: 12, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>
                      {field.label}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={userProfile?.[field.key as keyof UserProfile] || ''}
                        onChange={(e) => updateProfile(field.key as keyof UserProfile, e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none', cursor: 'pointer', background: '#fff' }}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={userProfile?.[field.key as keyof UserProfile] || ''}
                        onChange={(e) => updateProfile(field.key as keyof UserProfile, e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                        placeholder={`Enter your ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === 'tags' ? (
                      <input
                        type="text"
                        value={Array.isArray(userProfile?.[field.key as keyof UserProfile]) ? (userProfile[field.key as keyof UserProfile] as string[]).join(', ') : ''}
                        onChange={(e) => updateProfile(field.key as keyof UserProfile, e.target.value.split(',').map(item => item.trim()).filter(Boolean))}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, color: '#111', outline: 'none' }}
                        placeholder={`Enter ${field.label.toLowerCase()} separated by commas...`}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Save Button */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            style={{
              padding: '16px 32px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              background: saving ? '#999' : 'linear-gradient(135deg, #dd0000, #7c3aed)',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(221,0,0,0.2)',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          
          {saveStatus === 'success' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: '#22c55e', fontSize: 14, fontWeight: 600 }}>
              <CheckCircle className="w-5 h-5" />
              Profile saved successfully!
            </div>
          )}
          {saveStatus === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: '#dd0000', fontSize: 14, fontWeight: 600 }}>
              Failed to save profile. Please try again.
            </div>
          )}
          {saveStatus === 'idle' && profileCompletion === 100 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: '#22c55e', fontSize: 14, fontWeight: 600 }}>
              <CheckCircle className="w-5 h-5" />
              Profile complete! You'll get better program recommendations.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
