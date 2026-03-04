'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/lib/types';
import { X, MapPin, GraduationCap, Calendar, Euro, Globe, Clock, Users, Award, ExternalLink, Sparkles, BookOpen, CreditCard, FileText, Settings, AlertTriangle, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface ProgramModalProps {
  programId: string;
  onClose: () => void;
}

export function ProgramModal({ programId, onClose }: ProgramModalProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const capitalize = (value: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

  const parseListField = (field?: string[] | null) => {
    if (!field) return [];
    return field
      .flatMap(item => item.split(','))
      .map(item => item.replace(/['\[\]]/g, '').trim())
      .filter(Boolean);
  };

  const languages = parseListField(program.languages_array).map(capitalize);

  const intakeLabels = (() => {
    const parsed = parseListField(program.intake_terms).map(term => `${capitalize(term)} Semester`);
    if (parsed.length) return parsed;
    if (program.beginning_normalized) {
      return [`${capitalize(program.beginning_normalized)} Semester`];
    }
    return [];
  })();

  const buildSectionContent = (text?: string | null) => {
    const lines = (text || '')
      .split('\n')
      .map(line => line.replace(/\s+/g, ' ').trim())
      .filter(line => line.length > 3);

    const keyFacts = lines.filter(line => line.includes(':')).slice(0, 6);
    const descriptions = lines.filter(line => !line.includes(':')).slice(0, 6);

    return {
      keyFacts,
      descriptions,
      hasMore: lines.length > 6,
    };
  };

  const renderTextSection = (
    title: string,
    icon: React.ReactNode,
    text?: string | null
  ) => {
    if (!text) return null;

    const { keyFacts, descriptions, hasMore } = buildSectionContent(text);

    return (
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="text-xl font-semibold text-gray-900 ml-3">{title}</h3>
        </div>

        {keyFacts.length > 0 && (
          <dl className="grid md:grid-cols-2 gap-4 mb-4">
            {keyFacts.map((fact, index) => {
              const [label, ...valueParts] = fact.split(':');
              const value = valueParts.join(':').trim();
              return (
                <div
                  key={`${title}-fact-${index}`}
                  className="rounded-xl bg-gray-50 border border-gray-100 p-4"
                >
                  <dt className="text-xs uppercase tracking-wide text-gray-500">{label.trim()}</dt>
                  <dd className="text-sm text-gray-900 font-medium mt-1">{value}</dd>
                </div>
              );
            })}
          </dl>
        )}

        {descriptions.length > 0 && (
          <ul className="space-y-3 text-gray-700">
            {descriptions.map((desc, index) => (
              <li key={`${title}-desc-${index}`} className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="leading-relaxed">{desc}</p>
              </li>
            ))}
          </ul>
        )}

        {hasMore && program.detail_url && (
          <div className="mt-4 text-sm">
            <a
              className="text-blue-600 font-medium hover:underline"
              href={program.detail_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View full details on DAAD
            </a>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white h-full w-full overflow-hidden flex flex-col">
        {/* Hero Section */}
        <div className="relative h-48 overflow-hidden">
          {/* Background Image or Gradient */}
          {program.image_url && program.image_url.trim() !== '' ? (
            <Image
              src={program.image_url}
              alt={program.program_name}
              fill
              className="object-cover"
              sizes="100vw"
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
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {program.program_name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
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
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      <span className="capitalize">{program.degree_level || 'Degree Program'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-1">
                      {formatTuition(program.tuition_fee_number, program.tuition_fee_currency)}
                    </div>
                    <div className="text-white/70 text-xs">per year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-6xl mx-auto p-8">
            <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
              {/* Summary Column */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Snapshot
                  </h3>
                  <div className="space-y-4 text-sm text-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tuition</span>
                      <span className="font-semibold">{formatTuition(program.tuition_fee_number, program.tuition_fee_currency)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span>{formatDuration(program.duration_months)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">City</span>
                      <span>{program.city || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Degree</span>
                      <span className="capitalize">{program.degree_level || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {(languages.length ? languages : ['English']).map((lang, index) => (
                        <span
                          key={`lang-${index}`}
                          className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Intakes</p>
                    <div className="flex flex-wrap gap-2">
                      {(intakeLabels.length ? intakeLabels : ['Contact university']).map((term, index) => (
                        <span
                          key={`intake-${index}`}
                          className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>

                  {program.subject_area && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Subject</p>
                      <span className="inline-flex px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                        {capitalize(program.subject_area)}
                      </span>
                    </div>
                  )}
                </div>

                {program.detail_url && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600 mb-3">
                      Need the full syllabus, housing info, or visa tips?
                    </p>
                    <a
                      href={program.detail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      View on DAAD
                    </a>
                  </div>
                )}
              </div>

              {/* Detail Column */}
              <div className="space-y-6">
                {renderTextSection('Program Overview', <Sparkles className="w-5 h-5 text-blue-600" />, program.tab_overview || program.description)}
                {renderTextSection('Course Structure', <GraduationCap className="w-5 h-5 text-blue-600" />, program.tab_course_details)}
                {renderTextSection('Costs & Funding', <CreditCard className="w-5 h-5 text-blue-600" />, program.tab_costs_funding)}
                {renderTextSection('Application Requirements', <FileText className="w-5 h-5 text-blue-600" />, program.tab_requirements_registration || program.requirements)}
                {renderTextSection('Student Services & Support', <Settings className="w-5 h-5 text-blue-600" />, program.tab_services)}

                {program.quality_warnings && program.quality_warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-start">
                      <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-3">Data Notes</h4>
                        <ul className="text-amber-800 space-y-2">
                          {program.quality_warnings.map((warning, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {program.confidence_score && (
                <div className="flex items-center text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-medium">Data Quality: {Math.round(program.confidence_score * 100)}%</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {program.detail_url && (
                <a
                  href={program.detail_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on DAAD
                </a>
              )}
              <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
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
