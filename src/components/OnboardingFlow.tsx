'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { ChevronRight, ChevronLeft, Sparkles, GraduationCap, Globe, MapPin, Euro, Calendar, Award, BookOpen } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 'degree',
    title: 'What degree are you pursuing?',
    subtitle: 'Tell us about your academic goals',
    icon: <GraduationCap className="w-8 h-8" />
  },
  {
    id: 'subjects',
    title: 'What subjects interest you?',
    subtitle: 'Help us understand your passions',
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    id: 'language',
    title: 'Language preferences?',
    subtitle: 'Choose your preferred teaching language',
    icon: <Globe className="w-8 h-8" />
  },
  {
    id: 'language_tests',
    title: 'Do you have language test scores?',
    subtitle: 'IELTS, TOEFL, or other certifications',
    icon: <Award className="w-8 h-8" />
  },
  {
    id: 'academic_background',
    title: 'What\'s your academic background?',
    subtitle: 'Tell us about your previous education',
    icon: <BookOpen className="w-8 h-8" />
  },
  {
    id: 'scholarship',
    title: 'Are you looking for scholarships?',
    subtitle: 'We can prioritize programs with funding',
    icon: <Award className="w-8 h-8" />
  },
  {
    id: 'location',
    title: 'Where would you like to study?',
    subtitle: 'Select your preferred cities in Germany',
    icon: <MapPin className="w-8 h-8" />
  },
  {
    id: 'budget',
    title: 'What\'s your budget?',
    subtitle: 'Help us find programs within your range',
    icon: <Euro className="w-8 h-8" />
  },
  {
    id: 'timing',
    title: 'When do you want to start?',
    subtitle: 'Choose your preferred intake timing',
    icon: <Calendar className="w-8 h-8" />
  }
];

const degreeOptions = [
  { value: 'bachelor', label: 'Bachelor\'s Degree', description: 'Undergraduate programs' },
  { value: 'master', label: 'Master\'s Degree', description: 'Graduate programs' },
  { value: 'phd', label: 'PhD/Doctorate', description: 'Doctoral research programs' },
  { value: 'non_degree', label: 'Non-degree', description: 'Certificates & short courses' }
];

const languageOptions = [
  { value: 'english', label: 'English', description: 'Programs taught in English' },
  { value: 'german', label: 'German', description: 'Programs taught in German' },
  { value: 'either', label: 'Either', description: 'I\'m flexible with language' }
];

const germanCities = {
  major: [
    'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart',
    'Düsseldorf', 'Dortmund', 'Essen', 'Bremen', 'Hannover', 'Nuremberg'
  ],
  university: [
    'Heidelberg', 'Freiburg', 'Tübingen', 'Göttingen', 'Marburg', 'Würzburg',
    'Aachen', 'Dresden', 'Leipzig', 'Darmstadt', 'Karlsruhe', 'Mainz'
  ],
  emerging: [
    'Potsdam', 'Konstanz', 'Bamberg', 'Regensburg', 'Passau', 'Bayreuth',
    'Greifswald', 'Rostock', 'Kiel', 'Lübeck', 'Oldenburg', 'Osnabrück'
  ]
};

const allCities = [...germanCities.major, ...germanCities.university, ...germanCities.emerging];

const popularSubjects = [
  'Computer Science', 'Engineering', 'Business', 'Medicine', 'Physics',
  'Mathematics', 'Chemistry', 'Biology', 'Economics', 'Psychology',
  'Architecture', 'Design', 'Art', 'Music', 'Literature', 'History'
];

const intakeOptions = [
  { value: 'winter', label: 'Winter Semester', description: 'October - March' },
  { value: 'summer', label: 'Summer Semester', description: 'April - September' },
  { value: 'any', label: 'Either', description: 'I\'m flexible with timing' }
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    target_subjects: [],
    preferred_language: 'either',
    preferred_cities: [],
    desired_intake: 'any',
    ielts_score: null,
    toefl_score: null,
    has_scholarship: undefined,
    academic_background: ''
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'degree':
        return profile.target_degree_level;
      case 'subjects':
        return profile.target_subjects && profile.target_subjects.length > 0;
      case 'language':
        return profile.preferred_language;
      case 'language_tests':
        return true; // Optional
      case 'academic_background':
        return true; // Optional
      case 'scholarship':
        return true; // Optional
      case 'location':
        return true; // Optional
      case 'budget':
        return true; // Optional
      case 'timing':
        return profile.desired_intake;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'degree':
        return (
          <div className="space-y-4">
            {degreeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateProfile({ target_degree_level: option.value as any })}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                  profile.target_degree_level === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{option.label}</h3>
                    <p className="text-gray-600 mt-1">{option.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                    profile.target_degree_level === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {profile.target_degree_level === option.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'subjects':
        return (
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your subjects of interest..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const newSubject = e.currentTarget.value.trim();
                    if (!profile.target_subjects?.includes(newSubject)) {
                      updateProfile({
                        target_subjects: [...(profile.target_subjects || []), newSubject]
                      });
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {popularSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => {
                    const subjects = profile.target_subjects || [];
                    if (subjects.includes(subject)) {
                      updateProfile({
                        target_subjects: subjects.filter(s => s !== subject)
                      });
                    } else {
                      updateProfile({
                        target_subjects: [...subjects, subject]
                      });
                    }
                  }}
                  className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                    profile.target_subjects?.includes(subject)
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {profile.target_subjects && profile.target_subjects.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">Selected subjects:</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.target_subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'language':
        return (
          <div className="space-y-4">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateProfile({ preferred_language: option.value as any })}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                  profile.preferred_language === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{option.label}</h3>
                    <p className="text-gray-600 mt-1">{option.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                    profile.preferred_language === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {profile.preferred_language === option.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'language_tests':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                IELTS Score (Optional)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                placeholder="e.g., 6.5"
                value={profile.ielts_score || ''}
                onChange={(e) => updateProfile({ 
                  ielts_score: e.target.value ? parseFloat(e.target.value) : null 
                })}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                TOEFL Score (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="e.g., 90"
                value={profile.toefl_score || ''}
                onChange={(e) => updateProfile({ 
                  toefl_score: e.target.value ? parseInt(e.target.value) : null 
                })}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Adding your test scores helps us match you with programs that fit your language proficiency level.
              </p>
            </div>
          </div>
        );

      case 'academic_background':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Describe your academic background (Optional)
              </label>
              <textarea
                placeholder="e.g., Bachelor's in Computer Science, 3 years work experience in software development..."
                value={profile.academic_background || ''}
                onChange={(e) => updateProfile({ academic_background: e.target.value })}
                rows={4}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg resize-none"
              />
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Include your degree, major, relevant coursework, and any work experience. This helps us find programs that match your qualifications.
              </p>
            </div>
          </div>
        );

      case 'scholarship':
        return (
          <div className="space-y-4">
            <button
              onClick={() => updateProfile({ has_scholarship: true })}
              className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                profile.has_scholarship === true
                  ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Yes, show me programs with scholarships</h3>
                  <p className="text-gray-600 mt-1">Prioritize programs offering financial aid</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                  profile.has_scholarship === true
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {profile.has_scholarship === true && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => updateProfile({ has_scholarship: false })}
              className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                profile.has_scholarship === false
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No preference</h3>
                  <p className="text-gray-600 mt-1">Show me all programs regardless of funding</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                  profile.has_scholarship === false
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {profile.has_scholarship === false && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </button>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            {/* Any City Option */}
            <button
              onClick={() => updateProfile({ preferred_cities: [] })}
              className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                !profile.preferred_cities || profile.preferred_cities.length === 0
                  ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-purple-500" />
                    I'm open to any city
                  </h3>
                  <p className="text-gray-600 mt-1">Show me programs from all German cities</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                  !profile.preferred_cities || profile.preferred_cities.length === 0
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {(!profile.preferred_cities || profile.preferred_cities.length === 0) && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </button>

            <div className="text-center text-gray-500 text-sm">
              OR select specific cities
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a German city..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const newCity = e.currentTarget.value.trim();
                    if (!profile.preferred_cities?.includes(newCity)) {
                      updateProfile({
                        preferred_cities: [...(profile.preferred_cities || []), newCity]
                      });
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            
            {/* City Categories */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Major Cities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {germanCities.major.map((city: string) => (
                    <button
                      key={city}
                      onClick={() => {
                        const cities = profile.preferred_cities || [];
                        if (cities.includes(city)) {
                          updateProfile({
                            preferred_cities: cities.filter(c => c !== city)
                          });
                        } else {
                          updateProfile({
                            preferred_cities: [...cities, city]
                          });
                        }
                      }}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-center text-sm ${
                        profile.preferred_cities?.includes(city)
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  University Towns
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {germanCities.university.map((city: string) => (
                    <button
                      key={city}
                      onClick={() => {
                        const cities = profile.preferred_cities || [];
                        if (cities.includes(city)) {
                          updateProfile({
                            preferred_cities: cities.filter(c => c !== city)
                          });
                        } else {
                          updateProfile({
                            preferred_cities: [...cities, city]
                          });
                        }
                      }}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-center text-sm ${
                        profile.preferred_cities?.includes(city)
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Emerging Locations
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {germanCities.emerging.map((city: string) => (
                    <button
                      key={city}
                      onClick={() => {
                        const cities = profile.preferred_cities || [];
                        if (cities.includes(city)) {
                          updateProfile({
                            preferred_cities: cities.filter(c => c !== city)
                          });
                        } else {
                          updateProfile({
                            preferred_cities: [...cities, city]
                          });
                        }
                      }}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-center text-sm ${
                        profile.preferred_cities?.includes(city)
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {profile.preferred_cities && profile.preferred_cities.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">Selected cities:</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_cities.map((city: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center"
                    >
                      {city}
                      <button
                        onClick={() => {
                          updateProfile({
                            preferred_cities: profile.preferred_cities?.filter(c => c !== city)
                          });
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Maximum tuition per year (EUR)
              </label>
              <input
                type="number"
                placeholder="e.g., 10000"
                value={profile.max_tuition_eur || ''}
                onChange={(e) => updateProfile({ 
                  max_tuition_eur: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 0, label: 'Free programs only' },
                { value: 5000, label: 'Under €5,000' },
                { value: 10000, label: 'Under €10,000' },
                { value: 20000, label: 'Under €20,000' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateProfile({ max_tuition_eur: option.value })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    profile.max_tuition_eur === option.value
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'timing':
        return (
          <div className="space-y-4">
            {intakeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateProfile({ desired_intake: option.value as any })}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                  profile.desired_intake === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{option.label}</h3>
                    <p className="text-gray-600 mt-1">{option.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                    profile.desired_intake === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {profile.desired_intake === option.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step content */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
              {steps[currentStep].icon}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {steps[currentStep].title}
          </h1>
          <p className="text-lg text-gray-600">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Step form */}
        <div className="mb-12">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
