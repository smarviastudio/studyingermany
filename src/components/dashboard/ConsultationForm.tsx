'use client';

import { useState } from 'react';
import { X, ChevronRight, Search, Filter, MapPin, GraduationCap, Globe, Euro, Calendar, Clock } from 'lucide-react';

interface ConsultationFormProps {
  onClose: () => void;
  onComplete: (criteria: SearchCriteria) => void;
}

interface SearchCriteria {
  degree_level: string;
  subject_area: string;
  language: string;
  budget_max: number | null;
  city: string;
  intake: string;
}

export function ConsultationForm({ onClose, onComplete }: ConsultationFormProps) {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    degree_level: '',
    subject_area: '',
    language: '',
    budget_max: null,
    city: '',
    intake: ''
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'What degree are you looking for?',
      field: 'degree_level',
      options: [
        { value: 'bachelor', label: 'Bachelor\'s Degree', desc: '3-4 years undergraduate program' },
        { value: 'master', label: 'Master\'s Degree', desc: '1-2 years postgraduate program' },
        { value: 'phd', label: 'PhD/Doctorate', desc: '3-5 years research program' }
      ]
    },
    {
      title: 'Which field interests you most?',
      field: 'subject_area',
      options: [
        { value: 'computer science', label: 'Computer Science', desc: 'Programming, AI, Software Development' },
        { value: 'engineering', label: 'Engineering', desc: 'Mechanical, Electrical, Civil Engineering' },
        { value: 'business', label: 'Business & Management', desc: 'MBA, Finance, Marketing' },
        { value: 'natural sciences', label: 'Natural Sciences', desc: 'Physics, Chemistry, Biology' },
        { value: 'social sciences', label: 'Social Sciences', desc: 'Psychology, Sociology, Political Science' },
        { value: 'arts', label: 'Arts & Humanities', desc: 'Literature, History, Philosophy' }
      ]
    },
    {
      title: 'What\'s your preferred language?',
      field: 'language',
      options: [
        { value: 'english', label: 'English', desc: 'Programs taught in English' },
        { value: 'german', label: 'German', desc: 'Programs taught in German' },
        { value: 'either', label: 'Either Language', desc: 'Open to both English and German' }
      ]
    },
    {
      title: 'What\'s your budget range?',
      field: 'budget_max',
      options: [
        { value: 0, label: 'Free Programs Only', desc: 'No tuition fees' },
        { value: 5000, label: 'Up to €5,000/year', desc: 'Low-cost programs' },
        { value: 15000, label: 'Up to €15,000/year', desc: 'Moderate tuition fees' },
        { value: null, label: 'No Budget Limit', desc: 'Any tuition range' }
      ]
    },
    {
      title: 'Any city preference?',
      field: 'city',
      options: [
        { value: 'any', label: 'Any City', desc: 'Open to all locations' },
        { value: 'berlin', label: 'Berlin', desc: 'Capital city, vibrant culture' },
        { value: 'munich', label: 'Munich', desc: 'Bavaria, traditional German culture' },
        { value: 'hamburg', label: 'Hamburg', desc: 'Northern Germany, maritime city' },
        { value: 'frankfurt', label: 'Frankfurt', desc: 'Financial hub of Germany' },
        { value: 'cologne', label: 'Cologne', desc: 'Historic city in western Germany' }
      ]
    },
    {
      title: 'When do you want to start?',
      field: 'intake',
      options: [
        { value: 'winter', label: 'Winter Semester', desc: 'Starting October 2025' },
        { value: 'summer', label: 'Summer Semester', desc: 'Starting April 2026' },
        { value: 'any', label: 'Flexible', desc: 'Either intake period' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleOptionSelect = (value: any) => {
    setCriteria(prev => ({
      ...prev,
      [currentStepData.field]: value
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(criteria);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = () => {
    const currentValue = criteria[currentStepData.field as keyof SearchCriteria];
    return currentValue !== '' && currentValue !== undefined;
  };

  const getIcon = () => {
    switch (currentStepData.field) {
      case 'degree_level': return GraduationCap;
      case 'subject_area': return Search;
      case 'language': return Globe;
      case 'budget_max': return Euro;
      case 'city': return MapPin;
      case 'intake': return Calendar;
      default: return Filter;
    }
  };

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Find Your Program</h1>
                  <p className="text-sm text-gray-300">Step {currentStep + 1} of {steps.length}</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="border-b border-white/10 bg-white/5">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentStepData.title}
            </h2>
            <p className="text-lg text-gray-300">
              Select the option that best matches your preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentStepData.options.map((option, index) => {
              const isSelected = criteria[currentStepData.field as keyof SearchCriteria] === option.value;
              
              return (
                <button
                  key={`${currentStepData.field}-${option.value ?? 'option'}-${index}`}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg backdrop-blur-sm ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className={`font-semibold mb-2 ${
                    isSelected ? 'text-blue-300' : 'text-white'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-sm ${
                    isSelected ? 'text-blue-200' : 'text-gray-300'
                  }`}>
                    {option.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <span>{isLastStep ? 'Find Programs' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
