'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/lib/types';
import { X, MapPin, GraduationCap, Calendar, Euro, Globe, Clock, Users, Award, ExternalLink, Sparkles, BookOpen, CreditCard, FileText, Settings, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface ProgramModalProps {
  programId: string;
  onClose: () => void;
}

type TabType = 'overview' | 'details' | 'costs' | 'requirements' | 'services';

export function ProgramModal({ programId, onClose }: ProgramModalProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/programs/${programId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch program details');
        }
        
        const data = await response.json();
        setProgram(data.program);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [programId]);

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BookOpen },
    { id: 'details' as TabType, label: 'Course Details', icon: GraduationCap },
    { id: 'costs' as TabType, label: 'Costs & Funding', icon: CreditCard },
    { id: 'requirements' as TabType, label: 'Requirements', icon: FileText },
    { id: 'services' as TabType, label: 'Services', icon: Settings },
  ];

  const formatTuition = (amount: number | null, currency = 'EUR') => {
    if (amount === null || amount === undefined) return 'Contact university';
    if (amount === 0) return 'Free';
    return `€${amount.toLocaleString()}/year`;
  };

  const formatDuration = (months: number | null) => {
    if (!months) return 'Contact university';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  const renderTabContent = () => {
    if (!program) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Program Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Overview</h3>
              {program.tab_overview ? (
                <div className="prose max-w-none text-gray-700">
                  <div className="whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg mb-6">
                    {program.tab_overview}
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {program.description || 'No description available.'}
                </p>
              )}
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Degree Level</span>
                </div>
                <p className="text-gray-700 capitalize">{program.degree_level || 'Not specified'}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Subject Area</span>
                </div>
                <p className="text-gray-700 capitalize">{program.subject_area || 'Not specified'}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Duration</span>
                </div>
                <p className="text-gray-700">{formatDuration(program.duration_months)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Language</span>
                </div>
                <p className="text-gray-700">
                  {program.languages_array?.join(', ') || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Quality Warnings */}
            {program.quality_warnings && program.quality_warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-2">Data Notes</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      {program.quality_warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
              {program.tab_course_details ? (
                <div className="prose max-w-none text-gray-700">
                  <div className="whitespace-pre-line leading-relaxed">
                    {program.tab_course_details}
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none text-gray-700">
                  <p>Detailed course information from DAAD enhanced dataset.</p>
                  {program.programme_duration && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Program Duration</h4>
                      <p className="text-gray-700">{program.programme_duration}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'costs':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuition & Costs</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-3">
                  <Euro className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="text-lg font-semibold text-blue-900">
                    {formatTuition(program.tuition_fee_number, program.tuition_fee_currency)}
                  </span>
                </div>
                
                {program.tuition_eur_min !== program.tuition_eur_max && (
                  <p className="text-sm text-blue-700">
                    Range: €{program.tuition_eur_min?.toLocaleString()} - €{program.tuition_eur_max?.toLocaleString()}
                  </p>
                )}
              </div>

              {program.tab_costs_funding && (
                <div className="prose max-w-none text-gray-700">
                  <h4 className="font-medium text-gray-900 mb-3">Detailed Cost Information</h4>
                  <div className="whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {program.tab_costs_funding}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Requirements</h3>
              
              {program.tab_requirements_registration ? (
                <div className="prose max-w-none text-gray-700">
                  <div className="whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {program.tab_requirements_registration}
                  </div>
                </div>
              ) : (
                <>
                  {program.requirements && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">General Requirements</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{program.requirements}</p>
                    </div>
                  )}

                  {program.application_deadline && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-red-600 mr-2" />
                        <span className="font-medium text-red-900">Application Deadline</span>
                      </div>
                      <p className="text-red-800 mt-1">{program.application_deadline}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Services</h3>
              {program.tab_services ? (
                <div className="prose max-w-none text-gray-700">
                  <div className="whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {program.tab_services}
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none text-gray-700">
                  <p>Student support services and additional information will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading program details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Program</h3>
            <p className="text-gray-600 mb-4">{error || 'Program not found'}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white h-full w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative">
          {/* Hero Image or Gradient */}
          {program.image_url && program.image_url.trim() !== '' ? (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={program.image_url}
                alt={program.program_name}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized={true}
                onError={(e) => {
                  console.log('Modal image failed to load:', program.image_url);
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                    `;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </div>
          ) : (
            <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Program Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{program.program_name}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{program.university}</span>
              </div>
              {program.city && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{program.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {program.confidence_score && (
                <div className="flex items-center text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>Data Quality: {Math.round(program.confidence_score * 100)}%</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {program.detail_url && (
                <a
                  href={program.detail_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on DAAD
                </a>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
