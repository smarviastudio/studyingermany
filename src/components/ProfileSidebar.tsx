'use client';

import { UserProfile } from '@/lib/types';

interface ProfileSidebarProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  showDebug: boolean;
  onToggleDebug: () => void;
}

export function ProfileSidebar({ 
  userProfile, 
  onUpdateProfile, 
  showDebug, 
  onToggleDebug 
}: ProfileSidebarProps) {
  const updateProfile = (updates: Partial<UserProfile>) => {
    onUpdateProfile({ ...userProfile, ...updates });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
        <p className="text-sm text-gray-600">Tell me about your preferences</p>
      </div>

      {/* Profile Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Degree Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Degree Level
          </label>
          <select
            value={userProfile.target_degree_level || ''}
            onChange={(e) => updateProfile({ 
              target_degree_level: e.target.value as any || undefined 
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Not specified</option>
            <option value="bachelor">Bachelor's</option>
            <option value="master">Master's</option>
            <option value="phd">PhD/Doctorate</option>
            <option value="non_degree">Non-degree</option>
            <option value="any">Any</option>
          </select>
        </div>

        {/* Subject Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Interests
          </label>
          <input
            type="text"
            value={userProfile.target_subjects?.join(', ') || ''}
            onChange={(e) => updateProfile({ 
              target_subjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            placeholder="e.g., Computer Science, Engineering"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Language Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teaching Language
          </label>
          <select
            value={userProfile.preferred_language || 'either'}
            onChange={(e) => updateProfile({ 
              preferred_language: e.target.value as any 
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="either">Either English or German</option>
            <option value="english">English</option>
            <option value="german">German</option>
          </select>
        </div>

        {/* Language Levels */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              German Level
            </label>
            <select
              value={userProfile.german_level || ''}
              onChange={(e) => updateProfile({ 
                german_level: e.target.value as any || undefined 
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Not specified</option>
              <option value="none">None</option>
              <option value="a1">A1</option>
              <option value="a2">A2</option>
              <option value="b1">B1</option>
              <option value="b2">B2</option>
              <option value="c1">C1</option>
              <option value="c2">C2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Level
            </label>
            <select
              value={userProfile.english_level || ''}
              onChange={(e) => updateProfile({ 
                english_level: e.target.value as any || undefined 
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Not specified</option>
              <option value="none">None</option>
              <option value="a1">A1</option>
              <option value="a2">A2</option>
              <option value="b1">B1</option>
              <option value="b2">B2</option>
              <option value="c1">C1</option>
              <option value="c2">C2</option>
            </select>
          </div>
        </div>

        {/* Preferred Cities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Cities
          </label>
          <input
            type="text"
            value={userProfile.preferred_cities?.join(', ') || ''}
            onChange={(e) => updateProfile({ 
              preferred_cities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            placeholder="e.g., Berlin, Munich, Hamburg"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Tuition (EUR/year)
          </label>
          <input
            type="number"
            value={userProfile.max_tuition_eur || ''}
            onChange={(e) => updateProfile({ 
              max_tuition_eur: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            placeholder="e.g., 10000"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Intake Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Intake
          </label>
          <select
            value={userProfile.desired_intake || 'any'}
            onChange={(e) => updateProfile({ 
              desired_intake: e.target.value as any 
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Any</option>
            <option value="winter">Winter Semester</option>
            <option value="summer">Summer Semester</option>
          </select>
        </div>

        {/* Start Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desired Start Year
          </label>
          <input
            type="number"
            value={userProfile.desired_start_year || ''}
            onChange={(e) => updateProfile({ 
              desired_start_year: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            placeholder="e.g., 2024"
            min="2024"
            max="2030"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={userProfile.constraints || ''}
            onChange={(e) => updateProfile({ constraints: e.target.value })}
            placeholder="Any other requirements or preferences..."
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Debug Toggle */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onToggleDebug}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showDebug ? 'Hide' : 'Show'} Debug Info
        </button>
        
        {showDebug && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
