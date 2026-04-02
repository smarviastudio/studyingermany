'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/lib/types';
import { X, MapPin, GraduationCap, Calendar, Euro, Globe, Clock, Users, Award, ExternalLink, Sparkles, BookOpen, CreditCard, FileText, Settings, AlertTriangle, Star, CheckCircle } from 'lucide-react';
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

  const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTuition = (amount: number | null, currency = 'EUR') => {
    if (amount === null || amount === undefined || Number.isNaN(amount)) return 'Contact university';
    if (amount === 0) return 'Free';
    return `${formatCurrency(amount, currency)}/year`;
  };

  const formatDuration = (months: number | null) => {
    if (!months) return 'Contact university';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  const capitalize = (value?: string | null) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

  const parseArrayField = (field?: string[] | null) => {
    if (!field) return [];
    return field
      .flatMap(item => item.split(','))
      .map(item => item.replace(/['\[\]]/g, '').trim())
      .filter(Boolean)
      .map(item => item.charAt(0).toUpperCase() + item.slice(1));
  };

  const uniqueValues = (values: string[]) => {
    const seen = new Set<string>();
    const result: string[] = [];
    values.forEach(value => {
      if (!seen.has(value.toLowerCase())) {
        seen.add(value.toLowerCase());
        result.push(value);
      }
    });
    return result;
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Sparkles },
    { id: 'details' as TabType, label: 'Course Details', icon: GraduationCap },
    { id: 'costs' as TabType, label: 'Costs', icon: CreditCard },
    { id: 'requirements' as TabType, label: 'Requirements', icon: FileText },
    { id: 'services' as TabType, label: 'Services', icon: Settings },
  ];

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Euro className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-blue-900">
                  {formatTuition(program.tuition_fee_number)}
                </div>
                <div className="text-xs text-blue-600">Tuition</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-green-900">
                  {formatDuration(program.duration_months)}
                </div>
                <div className="text-xs text-green-600">Duration</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-purple-900">
                  {parseArrayField(program.languages_array).join(', ') || 'English'}
                </div>
                <div className="text-xs text-purple-600">Language</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-orange-900">
                  {program.beginning_normalized ?
                    program.beginning_normalized.charAt(0).toUpperCase() + program.beginning_normalized.slice(1) :
                    'Contact university'}
                </div>
                <div className="text-xs text-orange-600">Start</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Program Highlights */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Program Highlights
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {uniqueValues([
                    program.subject_area ? capitalize(program.subject_area) : '',
                    (program.degree_level ? `${capitalize(program.degree_level)} degree` : ''),
                    (program.beginning_normalized ? `${capitalize(program.beginning_normalized)} intake` : ''),
                  ]).filter(Boolean).map((item, index) => (
                    <span
                      key={`highlight-${index}`}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <ul className="space-y-3 text-gray-700 text-sm">
                  {(program.tab_overview || program.description)?.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 6)
                    .filter(line => !/course location|teaching language/i.test(line))
                    .slice(0, 3)
                    .map((line, index) => (
                      <li key={`overview-bullet-${index}`} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <p>{line}</p>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Quick Facts */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Facts</h3>
                <dl className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">University</dt>
                    <dd className="font-medium text-gray-900 text-right">{program.university}</dd>
                  </div>
                  {program.city && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Campus</dt>
                      <dd className="font-medium text-gray-900">{program.city}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Degree</dt>
                    <dd className="font-medium text-gray-900">{capitalize(program.degree_level || 'n/a')}</dd>
                  </div>
                  {program.application_deadline && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Application Deadline</dt>
                      <dd className="font-medium text-gray-900">{program.application_deadline}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            {program.tab_course_details ? (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Structure</h3>
                <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                  {program.tab_course_details.split('\n').slice(0, 8).map((line, index) => (
                    line.trim() && (
                      <p key={index}>{line.trim()}</p>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Detailed course information not available.</p>
                <p className="text-sm mt-1">Contact the university for more details.</p>
              </div>
            )}
          </div>
        );

      case 'costs':
        return (
          <div className="space-y-6">
            {/* Tuition Overview */}
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <Euro className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {formatTuition(program.tuition_fee_number)}
              </div>
              <div className="text-blue-600 text-sm">Annual Tuition Fee</div>
              {program.tuition_eur_min !== program.tuition_eur_max && (
                <div className="text-blue-700 text-xs mt-2">
                  Range: €{program.tuition_eur_min?.toLocaleString()} - €{program.tuition_eur_max?.toLocaleString()}
                </div>
              )}
            </div>

            {/* Cost Details */}
            {program.tab_costs_funding ? (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Cost Details & Funding</h3>
                <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                  {program.tab_costs_funding.split('\n').slice(0, 6).map((line, index) => (
                    line.trim() && (
                      <p key={index}>{line.trim()}</p>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl p-6">
                <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
                <h3 className="font-semibold text-green-900 mb-2">Financial Support</h3>
                <p className="text-green-800 text-sm">
                  Contact the university directly for information about scholarships, 
                  financial aid, and funding opportunities.
                </p>
              </div>
            )}
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-6">
            {program.application_deadline && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-900">Application Deadline: </span>
                  <span className="text-red-800 ml-1">{program.application_deadline}</span>
                </div>
              </div>
            )}

            {(program.tab_requirements_registration || program.requirements) ? (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Application Requirements</h3>
                <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                  {(program.tab_requirements_registration || program.requirements)?.split('\n').slice(0, 8).map((line, index) => (
                    line.trim() && (
                      <p key={index}>{line.trim()}</p>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Specific requirements not available.</p>
                <p className="text-sm mt-1">Contact the university for admission requirements.</p>
              </div>
            )}
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            {program.tab_services ? (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Student Services & Support</h3>
                <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                  {program.tab_services.split('\n').slice(0, 8).map((line, index) => (
                    line.trim() && (
                      <p key={index}>{line.trim()}</p>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Service information not available.</p>
                <p className="text-sm mt-1">Contact the university for student support details.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white h-full w-full overflow-hidden flex flex-col">
        {/* Header with Image */}
        <div className="relative h-64 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center">
          {/* Background Image */}
          {program.image_url && program.image_url.trim() !== '' && (
            <Image
              src={program.image_url}
              alt={program.program_name}
              fill
              className="object-cover opacity-80"
              sizes="100vw"
              unoptimized={true}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Program Title */}
          <div className="relative z-5 w-full text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-3xl font-bold mb-3 leading-tight">
                {program.program_name}
              </h1>
              <div className="flex items-center justify-center text-white/90 text-sm gap-4 flex-wrap">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {program.university}
                </span>
                {program.city && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {program.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex overflow-x-auto max-w-4xl mx-auto px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {program.confidence_score && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>Quality: {Math.round(program.confidence_score * 100)}%</span>
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
