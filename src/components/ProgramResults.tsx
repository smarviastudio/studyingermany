'use client';

import { ProgramSummary } from '@/lib/types';

interface ProgramResultsProps {
  programs: ProgramSummary[];
  onSelectProgram: (programId: string) => void;
}

export function ProgramResults({ programs, onSelectProgram }: ProgramResultsProps) {
  const formatTuition = (amount: number | null, currency?: string) => {
    if (amount === null || amount === undefined) return 'Not specified';
    if (amount === 0) return 'Free';
    return `${amount.toLocaleString()} ${currency || 'EUR'}`;
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Program Results
        </h2>
        <p className="text-sm text-gray-600">
          {programs.length} program{programs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto">
        {programs.map((program) => (
          <div
            key={program.id}
            onClick={() => onSelectProgram(program.id)}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {/* Program Name */}
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
              {program.program_name}
            </h3>

            {/* University */}
            <p className="text-sm text-gray-600 mb-2">
              {program.university}
              {program.city && ` • ${program.city}`}
            </p>

            {/* Details */}
            <div className="space-y-1 text-xs text-gray-500">
              {program.degree_level && (
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="capitalize">{program.degree_level}</span>
                </div>
              )}
              
              {program.subject_area && (
                <div className="flex justify-between">
                  <span>Subject:</span>
                  <span>{program.subject_area}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Tuition:</span>
                <span>{formatTuition(program.tuition_fee_number, program.tuition_fee_currency)}</span>
              </div>
              
              {program.beginning_normalized && (
                <div className="flex justify-between">
                  <span>Intake:</span>
                  <span className="capitalize">{program.beginning_normalized}</span>
                </div>
              )}

              {program.match_score && (
                <div className="flex justify-between">
                  <span>Match:</span>
                  <span>{Math.round(program.match_score * 100)}%</span>
                </div>
              )}
            </div>

            {/* Match Reason */}
            {program.match_reason && (
              <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {program.match_reason}
              </div>
            )}

            {/* Quality Warnings */}
            {program.quality_warnings && program.quality_warnings.length > 0 && (
              <div className="mt-2 text-xs text-amber-600">
                ⚠️ {program.quality_warnings.length} warning{program.quality_warnings.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}

        {programs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No programs to display yet.</p>
            <p className="text-sm mt-1">
              Ask me about your interests to see recommendations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
