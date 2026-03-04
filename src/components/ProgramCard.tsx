'use client';

import { ProgramSummary } from '@/lib/types';
import { MapPin, GraduationCap, Euro, Calendar, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface ProgramCardProps {
  program: ProgramSummary;
  onClick: () => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const formatTuition = (amount: number | null, currency?: string) => {
    if (amount === null || amount === undefined) return 'Contact university';
    if (amount === 0) return 'Free';
    return `€${amount.toLocaleString()}/year`;
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 cursor-pointer overflow-hidden relative transform hover:-translate-y-1"
    >
      {/* Program Image */}
      <div className="relative h-40 w-full overflow-hidden">
        {/* Always show fallback first */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-6 left-6 w-20 h-20 bg-white/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          {/* University Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <GraduationCap className="w-12 h-12 text-white/60" />
          </div>
        </div>

        {/* Try to load actual image on top */}
        {program.image_url && program.image_url.trim() !== '' && (
          <Image
            src={program.image_url}
            alt={program.program_name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 z-10"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            onLoad={(e) => {
              console.log('Image loaded successfully:', program.image_url);
            }}
            onError={(e) => {
              console.log('Image failed to load, keeping fallback:', program.image_url);
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
        )}

        {/* Match Score Badge */}
        {program.match_score && (
          <div className="absolute top-3 right-3 z-20">
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-black/20 backdrop-blur-md text-white border border-white/20">
              {Math.round(program.match_score * 100)}% match
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-tight">
            {program.program_name}
          </h3>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <span className="font-medium">{program.university}</span>
            {program.city && (
              <>
                <span className="mx-2">•</span>
                <MapPin className="w-3 h-3 mr-1" />
                <span>{program.city}</span>
              </>
            )}
          </div>

          {/* No image fallback match score */}
          {!program.image_url && program.match_score && (
            <div className="mb-3">
              <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                {Math.round(program.match_score * 100)}% match
              </div>
            </div>
          )}
        </div>

        {/* Key Details - Simplified */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <GraduationCap className="w-4 h-4 mr-2" />
              <span className="capitalize">{program.degree_level || 'Not specified'}</span>
            </div>
            <div className="flex items-center text-gray-900 font-semibold">
              <Euro className="w-4 h-4 mr-1" />
              <span>{formatTuition(program.tuition_fee_number, program.tuition_fee_currency)}</span>
            </div>
          </div>

          {program.beginning_normalized && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="capitalize">Starts {program.beginning_normalized}</span>
            </div>
          )}

          {program.subject_area && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{program.subject_area}</span>
            </div>
          )}
        </div>

        {/* Match Reason - Enhanced */}
        {program.match_reason && (
          <div className="mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-4">
              <div className="flex items-start">
                <Sparkles className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  {program.match_reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quality Warnings - Enhanced */}
        {program.quality_warnings && program.quality_warnings.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-amber-700 text-xs bg-amber-50 rounded-lg px-3 py-2">
              <AlertTriangle className="w-3 h-3 mr-2" />
              <span className="font-medium">{program.quality_warnings.length} data note{program.quality_warnings.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* Action - Enhanced */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100/80">
          <span className="text-xs text-gray-600 font-medium">View full details</span>
          <div className="flex items-center text-blue-600 group-hover:text-blue-700">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}
