'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, FileText, CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

interface ApplicationPlan {
  id: string;
  programId: string;
  programName: string;
  university: string;
  planData: string;
  checklistState: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MyApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-applications');
      return;
    }

    if (status === 'authenticated') {
      fetchApplications();
    }
  }, [status, router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/application-plans');
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.plans || []);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (plan: ApplicationPlan) => {
    try {
      const planData = JSON.parse(plan.planData);
      const checklistState = plan.checklistState ? JSON.parse(plan.checklistState) : {};
      const steps = planData.steps || [];
      const completed = steps.filter((step: any) => checklistState[step.id] === true).length;
      return { completed, total: steps.length };
    } catch {
      return { completed: 0, total: 0 };
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
            <p className="text-purple-200">
              Track your application progress for {applications.length} program{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/my-shortlist"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            View Shortlist
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <FileText className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No application plans yet</h2>
            <p className="text-purple-200 mb-6">
              Start by shortlisting programs and creating application plans
            </p>
            <Link
              href="/course-finder"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Programs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => {
              const progress = getProgress(app);
              const progressPercent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

              return (
                <div
                  key={app.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {app.programName}
                      </h3>
                      <p className="text-purple-200 mb-3">{app.university}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-purple-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Last updated {new Date(app.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/my-applications/${app.programId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-medium">Progress</span>
                      <span className="text-sm text-purple-200">
                        {progress.completed} of {progress.total} steps completed
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {progressPercent === 100 ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-200 rounded-full text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </span>
                    ) : progressPercent > 0 ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-200 rounded-full text-sm font-semibold">
                        <Circle className="w-4 h-4" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 rounded-full text-sm font-semibold">
                        <Clock className="w-4 h-4" />
                        Not Started
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
