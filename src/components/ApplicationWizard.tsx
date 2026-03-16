'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, AlertCircle,
  FileText, Globe, Wallet, Plane, Clock, ExternalLink,
  Sparkles, Loader2, ChevronRight, GraduationCap, MapPin
} from 'lucide-react';

interface StepResource {
  name: string;
  url: string;
  description: string;
}

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  detailedInfo?: string;
  deadline?: string;
  completed: boolean;
  autoCompleted?: boolean;
  autoCompletedReason?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: 'language' | 'documents' | 'application' | 'financial' | 'visa';
  resources?: StepResource[];
  action?: {
    type: 'cv' | 'letter' | 'document' | 'external' | 'info';
    label: string;
    url: string;
  };
}

interface CriticalRequirement {
  type: string;
  label: string;
  programRequirement: string;
  userProvided: string;
  status: 'met' | 'partial' | 'missing' | 'unknown';
  statusScore: number;
  notes: string;
}

interface ProfileMatch {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

interface ApplicationPlan {
  criticalRequirements?: CriticalRequirement[];
  profileMatch?: ProfileMatch;
  overview: string;
  estimatedTimeline: string;
  blockers: string[];
  steps: ApplicationStep[];
}

interface ApplicationWizardProps {
  plan: ApplicationPlan;
  programName: string;
  university: string;
  programId: string;
  onToggleStep: (stepId: string, completed: boolean) => Promise<void>;
  updatingStep: string | null;
}

export function ApplicationWizard({ 
  plan, 
  programName, 
  university, 
  programId,
  onToggleStep,
  updatingStep 
}: ApplicationWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showOverview, setShowOverview] = useState(true);

  const steps = plan.steps || [];
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.completed || s.autoCompleted).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const currentStep = steps[currentStepIndex];

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'language': return <Globe className="w-6 h-6" />;
      case 'documents': return <FileText className="w-6 h-6" />;
      case 'financial': return <Wallet className="w-6 h-6" />;
      case 'visa': return <Plane className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met': return '#22c55e';
      case 'partial': return '#f59e0b';
      case 'missing': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const goNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setShowOverview(false);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      setShowOverview(true);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
    setShowOverview(false);
  };

  // Overview Screen
  if (showOverview) {
    return (
      <div className="wizard-container">
        <div className="wizard-header">
          <Link href="/my-shortlist" className="wizard-back">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="wizard-header-info">
            <h1>{programName}</h1>
            <p><GraduationCap className="w-4 h-4" /> {university}</p>
          </div>
        </div>

        <div className="wizard-content">
          <div className="wizard-overview">
            <div className="wizard-overview-icon">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2>Your Application Plan</h2>
            <p className="wizard-overview-summary">{plan.overview}</p>

            <div className="wizard-stats">
              <div className="wizard-stat">
                <span className="wizard-stat-value">{totalSteps}</span>
                <span className="wizard-stat-label">Steps</span>
              </div>
              <div className="wizard-stat">
                <span className="wizard-stat-value">{completedSteps}</span>
                <span className="wizard-stat-label">Done</span>
              </div>
              <div className="wizard-stat">
                <span className="wizard-stat-value">{plan.estimatedTimeline}</span>
                <span className="wizard-stat-label">Timeline</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="wizard-progress-section">
              <div className="wizard-progress-header">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="wizard-progress-bar">
                <div 
                  className="wizard-progress-fill" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Requirements Summary */}
            {plan.criticalRequirements && plan.criticalRequirements.length > 0 && (
              <div className="wizard-requirements">
                <h3>Requirements Check</h3>
                {plan.criticalRequirements.map((req, i) => (
                  <div key={i} className="wizard-req-item">
                    <div 
                      className="wizard-req-status"
                      style={{ background: getStatusColor(req.status) }}
                    >
                      {req.status === 'met' ? <CheckCircle2 className="w-4 h-4" /> : 
                       req.status === 'missing' ? <AlertCircle className="w-4 h-4" /> :
                       <Circle className="w-4 h-4" />}
                    </div>
                    <div className="wizard-req-info">
                      <span className="wizard-req-label">{req.label}</span>
                      <span className="wizard-req-detail">{req.programRequirement}</span>
                    </div>
                    <span 
                      className="wizard-req-badge"
                      style={{ 
                        color: getStatusColor(req.status),
                        background: `${getStatusColor(req.status)}15`
                      }}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button 
              className="wizard-start-btn"
              onClick={() => setShowOverview(false)}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <style jsx>{wizardStyles}</style>
      </div>
    );
  }

  // Step View
  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <button onClick={goPrev} className="wizard-back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="wizard-header-progress">
          <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          <div className="wizard-mini-progress">
            <div 
              className="wizard-mini-progress-fill"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        <button 
          onClick={() => setShowOverview(true)} 
          className="wizard-overview-btn"
        >
          Overview
        </button>
      </div>

      {/* Step Dots */}
      <div className="wizard-dots">
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => goToStep(i)}
            className={`wizard-dot ${i === currentStepIndex ? 'active' : ''} ${step.completed || step.autoCompleted ? 'done' : ''}`}
          />
        ))}
      </div>

      <div className="wizard-content">
        {currentStep && (
          <div className="wizard-step">
            <div className="wizard-step-icon" style={{ 
              background: currentStep.completed || currentStep.autoCompleted ? '#22c55e' : '#dd0000' 
            }}>
              {getCategoryIcon(currentStep.category)}
            </div>

            <h2 className="wizard-step-title">{currentStep.title}</h2>
            
            {currentStep.deadline && (
              <div className="wizard-step-deadline">
                <Clock className="w-4 h-4" />
                {currentStep.deadline}
              </div>
            )}

            <p className="wizard-step-description">{currentStep.description}</p>

            {currentStep.detailedInfo && (
              <div className="wizard-step-details">
                <p>{currentStep.detailedInfo}</p>
              </div>
            )}

            {currentStep.autoCompleted && currentStep.autoCompletedReason && (
              <div className="wizard-step-auto">
                <CheckCircle2 className="w-5 h-5" />
                <span>Auto-verified: {currentStep.autoCompletedReason}</span>
              </div>
            )}

            {/* Resources */}
            {currentStep.resources && currentStep.resources.length > 0 && (
              <div className="wizard-step-resources">
                <h4>Helpful Resources</h4>
                {currentStep.resources.map((resource, i) => (
                  <a 
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wizard-resource-link"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{resource.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}

            {/* Action Button */}
            {currentStep.action && (
              <Link 
                href={currentStep.action.url}
                className="wizard-action-btn"
              >
                {currentStep.action.label}
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="wizard-footer">
        {!currentStep?.autoCompleted && (
          <button
            onClick={() => currentStep && onToggleStep(currentStep.id, currentStep.completed)}
            disabled={updatingStep === currentStep?.id}
            className={`wizard-complete-btn ${currentStep?.completed ? 'completed' : ''}`}
          >
            {updatingStep === currentStep?.id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : currentStep?.completed ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-5 h-5" />
                Mark as Done
              </>
            )}
          </button>
        )}

        <button
          onClick={goNext}
          disabled={currentStepIndex >= totalSteps - 1}
          className="wizard-next-btn"
        >
          {currentStepIndex >= totalSteps - 1 ? 'Finish' : 'Next Step'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{wizardStyles}</style>
    </div>
  );
}

const wizardStyles = `
  .wizard-container {
    min-height: 100vh;
    background: #fafafa;
    display: flex;
    flex-direction: column;
  }

  .wizard-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .wizard-back {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid #e5e5e5;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wizard-back:hover {
    background: #f5f5f5;
    border-color: #ddd;
  }

  .wizard-header-info {
    flex: 1;
  }

  .wizard-header-info h1 {
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin: 0;
    line-height: 1.3;
  }

  .wizard-header-info p {
    font-size: 13px;
    color: #666;
    margin: 4px 0 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .wizard-header-progress {
    flex: 1;
    text-align: center;
  }

  .wizard-header-progress span {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .wizard-mini-progress {
    height: 4px;
    background: #e5e5e5;
    border-radius: 2px;
    margin-top: 6px;
    overflow: hidden;
  }

  .wizard-mini-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #dd0000, #ff4444);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .wizard-overview-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    background: #fff;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wizard-overview-btn:hover {
    background: #f5f5f5;
    color: #333;
  }

  .wizard-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    background: #fff;
  }

  .wizard-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid #ddd;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wizard-dot.active {
    border-color: #dd0000;
    background: #dd0000;
    transform: scale(1.2);
  }

  .wizard-dot.done {
    border-color: #22c55e;
    background: #22c55e;
  }

  .wizard-content {
    flex: 1;
    padding: 24px 20px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  /* Overview Styles */
  .wizard-overview {
    text-align: center;
  }

  .wizard-overview-icon {
    width: 80px;
    height: 80px;
    border-radius: 24px;
    background: linear-gradient(135deg, #dd0000, #ff4444);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: #fff;
  }

  .wizard-overview h2 {
    font-size: 24px;
    font-weight: 700;
    color: #111;
    margin: 0 0 12px;
  }

  .wizard-overview-summary {
    font-size: 15px;
    color: #666;
    line-height: 1.6;
    margin: 0 0 32px;
  }

  .wizard-stats {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-bottom: 32px;
  }

  .wizard-stat {
    text-align: center;
  }

  .wizard-stat-value {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: #dd0000;
  }

  .wizard-stat-label {
    font-size: 13px;
    color: #888;
    margin-top: 4px;
  }

  .wizard-progress-section {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #eee;
  }

  .wizard-progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .wizard-progress-bar {
    height: 8px;
    background: #e5e5e5;
    border-radius: 4px;
    overflow: hidden;
  }

  .wizard-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #dd0000, #22c55e);
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .wizard-requirements {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #eee;
    text-align: left;
  }

  .wizard-requirements h3 {
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin: 0 0 16px;
  }

  .wizard-req-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .wizard-req-item:last-child {
    border-bottom: none;
  }

  .wizard-req-status {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .wizard-req-info {
    flex: 1;
  }

  .wizard-req-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .wizard-req-detail {
    display: block;
    font-size: 12px;
    color: #888;
    margin-top: 2px;
  }

  .wizard-req-badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .wizard-start-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, #dd0000, #b91c1c);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wizard-start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(221, 0, 0, 0.3);
  }

  /* Step View Styles */
  .wizard-step {
    text-align: center;
  }

  .wizard-step-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: #fff;
  }

  .wizard-step-title {
    font-size: 22px;
    font-weight: 700;
    color: #111;
    margin: 0 0 12px;
    line-height: 1.3;
  }

  .wizard-step-deadline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #fff3cd;
    color: #856404;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .wizard-step-description {
    font-size: 16px;
    color: #555;
    line-height: 1.7;
    margin: 0 0 24px;
  }

  .wizard-step-details {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: left;
  }

  .wizard-step-details p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }

  .wizard-step-auto {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background: #dcfce7;
    color: #166534;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .wizard-step-resources {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    text-align: left;
  }

  .wizard-step-resources h4 {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px;
  }

  .wizard-resource-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 8px;
    text-decoration: none;
    color: #333;
    transition: all 0.2s;
  }

  .wizard-resource-link:last-child {
    margin-bottom: 0;
  }

  .wizard-resource-link:hover {
    background: #f0f0f0;
  }

  .wizard-resource-link span {
    flex: 1;
    font-size: 14px;
  }

  .wizard-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 20px;
    background: #fff;
    border: 2px solid #dd0000;
    color: #dd0000;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    margin-bottom: 16px;
  }

  .wizard-action-btn:hover {
    background: #dd0000;
    color: #fff;
  }

  /* Footer */
  .wizard-footer {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    background: #fff;
    border-top: 1px solid #eee;
    position: sticky;
    bottom: 0;
  }

  .wizard-complete-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    background: #fff;
    border: 2px solid #ddd;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wizard-complete-btn:hover:not(:disabled) {
    border-color: #22c55e;
    color: #22c55e;
  }

  .wizard-complete-btn.completed {
    background: #dcfce7;
    border-color: #22c55e;
    color: #166534;
  }

  .wizard-complete-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .wizard-next-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    background: linear-gradient(135deg, #dd0000, #b91c1c);
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wizard-next-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(221, 0, 0, 0.3);
  }

  .wizard-next-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    .wizard-header {
      padding: 12px 16px;
    }

    .wizard-content {
      padding: 20px 16px;
    }

    .wizard-overview h2 {
      font-size: 20px;
    }

    .wizard-stats {
      gap: 20px;
    }

    .wizard-stat-value {
      font-size: 24px;
    }

    .wizard-step-title {
      font-size: 18px;
    }

    .wizard-footer {
      flex-direction: column;
    }
  }
`;
