'use client';

import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export function ActionCenter() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Action Center</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-white font-medium">Find Programs</p>
              <p className="text-sm text-gray-400">Search 600+ study programs</p>
            </div>
          </div>
          <div className="text-sm text-orange-400">Start Now</div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 opacity-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Research Programs</p>
              <p className="text-sm text-gray-400">Find matching study programs</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">Locked</div>
        </div>
      </div>
    </div>
  );
}
