'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Target, GraduationCap, Globe, MapPin, Euro, Calendar } from 'lucide-react';

interface ProfileData {
  degree_level: string;
  subject_areas: string[];
  language_preference: string;
  german_level: string;
  budget_max: number | null;
  preferred_cities: string[];
  intake_preference: string;
  timeline: string;
}

interface ProfileIntakeProps {
  onClose: () => void;
  onComplete: (profile: ProfileData) => void;
}

export function ProfileIntake({ onClose, onComplete }: ProfileIntakeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<ProfileData>({
    degree_level: '',
    subject_areas: [],
    language_preference: '',
    german_level: '',
    budget_max: null,
    preferred_cities: [],
    intake_preference: '',
    timeline: ''
  });

  const steps = [
    {
      title: 'Study Goals',
      subtitle: 'What degree are you pursuing?',
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Bachelor', 'Master', 'PhD', 'Non-degree'].map((level) => (
              <button
                key={level}
                onClick={() => setProfile(prev => ({ ...prev, degree_level: level.toLowerCase() }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  profile.degree_level === level.toLowerCase()
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                }`}
              >
                <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">{level}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Subject Areas',
      subtitle: 'What fields interest you?',
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Computer Science', 'Engineering', 'Business', 'Medicine', 
              'Natural Sciences', 'Social Sciences', 'Arts & Humanities', 
              'Mathematics', 'Physics'
            ].map((subject) => (
              <button
                key={subject}
                onClick={() => {
                  const isSelected = profile.subject_areas.includes(subject);
                  setProfile(prev => ({
                    ...prev,
                    subject_areas: isSelected
                      ? prev.subject_areas.filter(s => s !== subject)
                      : [...prev.subject_areas, subject]
                  }));
                }}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  profile.subject_areas.includes(subject)
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Language',
      subtitle: 'What\'s your language preference?',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { key: 'english', label: 'English Only', desc: 'Programs taught in English' },
              { key: 'german', label: 'German Only', desc: 'Programs taught in German' },
              { key: 'either', label: 'Either', desc: 'Open to both languages' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setProfile(prev => ({ ...prev, language_preference: option.key }))}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  profile.language_preference === option.key
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm opacity-70">{option.desc}</div>
              </button>
            ))}
          </div>
          
          {(profile.language_preference === 'german' || profile.language_preference === 'either') && (
            <div>
              <label className="block text-white font-medium mb-3">German Level</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {['None', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setProfile(prev => ({ ...prev, german_level: level.toLowerCase() }))}
                    className={`p-2 rounded-lg border transition-all text-sm ${
                      profile.german_level === level.toLowerCase()
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Budget',
      subtitle: 'What\'s your budget range?',
      icon: Euro,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[ 
              { key: 0, label: 'Free Programs', desc: 'No tuition fees' },
              { key: 5000, label: 'Up to €5,000', desc: 'Per year' },
              { key: 15000, label: 'Up to €15,000', desc: 'Per year' },
              { key: null, label: 'No Limit', desc: 'Any budget range' }
            ].map((option, index) => (
              <button
                type="button"
                key={`${option.key ?? 'unlimited'}-${index}`}
                onClick={() => setProfile(prev => ({ ...prev, budget_max: option.key }))}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  profile.budget_max === option.key
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                    : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm opacity-70">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Location',
      subtitle: 'Any city preferences?',
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 
              'Stuttgart', 'Dresden', 'Heidelberg', 'Any City'
            ].map((city) => (
              <button
                key={city}
                onClick={() => {
                  if (city === 'Any City') {
                    setProfile(prev => ({ ...prev, preferred_cities: [] }));
                  } else {
                    const isSelected = profile.preferred_cities.includes(city);
                    setProfile(prev => ({
                      ...prev,
                      preferred_cities: isSelected
                        ? prev.preferred_cities.filter(c => c !== city)
                        : [...prev.preferred_cities, city]
                    }));
                  }
                }}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  (city === 'Any City' && profile.preferred_cities.length === 0) ||
                  profile.preferred_cities.includes(city)
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Timeline',
      subtitle: 'When do you want to start?',
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'winter_2025', label: 'Winter 2025', desc: 'Starting October 2025' },
              { key: 'summer_2026', label: 'Summer 2026', desc: 'Starting April 2026' },
              { key: 'winter_2026', label: 'Winter 2026', desc: 'Starting October 2026' },
              { key: 'flexible', label: 'Flexible', desc: 'Open to any intake' }
            ].map((option) => (
              <button
                type="button"
                key={option.key}
                onClick={() => setProfile(prev => ({ ...prev, timeline: option.key }))}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  profile.timeline === option.key
                    ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                    : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                }`}
              >
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm opacity-70">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return profile.degree_level !== '';
      case 1: return profile.subject_areas.length > 0;
      case 2: return profile.language_preference !== '';
      case 3: return profile.budget_max !== undefined;
      case 4: return true; // Cities are optional
      case 5: return profile.timeline !== '';
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentStepData.title}</h2>
              <p className="text-gray-400">{currentStepData.subtitle}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
