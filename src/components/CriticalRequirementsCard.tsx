import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2
} from 'lucide-react';
import { useState } from 'react';

interface CriticalRequirement {
  type: string;
  label: string;
  programRequirement: string;
  userProvided: string;
  status: 'met' | 'partial' | 'missing' | 'unknown';
  statusScore: number;
  notes: string;
  askUserQuestions?: string[];
}

interface CriticalRequirementsCardProps {
  requirements: CriticalRequirement[];
  onAnswerQuestion?: (requirementType: string, answers: Record<string, string>) => void;
}

export function CriticalRequirementsCard({ requirements, onAnswerQuestion }: CriticalRequirementsCardProps) {
  const [expandedReq, setExpandedReq] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, Record<number, string>>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const handleResponseChange = (reqType: string, questionIdx: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [reqType]: {
        ...(prev[reqType] || {}),
        [questionIdx]: value
      }
    }));
  };

  const handleSubmitAnswers = async (req: CriticalRequirement) => {
    if (!req.askUserQuestions?.length) return;
    const answers: Record<string, string> = {};
    req.askUserQuestions.forEach((question, idx) => {
      const value = responses[req.type]?.[idx];
      if (value) {
        answers[question] = value;
      }
    });

    if (Object.keys(answers).length === 0) return;

    try {
      setSubmitting(req.type);
      await onAnswerQuestion?.(req.type, answers);
      setResponses((prev) => ({
        ...prev,
        [req.type]: {}
      }));
    } finally {
      setSubmitting(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met': return <CheckCircle2 className="w-5 h-5" />;
      case 'partial': return <AlertCircle className="w-5 h-5" />;
      case 'missing': return <AlertCircle className="w-5 h-5" />;
      case 'unknown': return <HelpCircle className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met': return '#22c55e';
      case 'partial': return '#f59e0b';
      case 'missing': return '#ef4444';
      case 'unknown': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'met': return 'rgba(34, 197, 94, 0.08)';
      case 'partial': return 'rgba(245, 158, 11, 0.08)';
      case 'missing': return 'rgba(239, 68, 68, 0.08)';
      case 'unknown': return 'rgba(107, 114, 128, 0.08)';
      default: return 'rgba(107, 114, 128, 0.08)';
    }
  };

  const overallScore = requirements.length > 0 
    ? Math.round(requirements.reduce((sum, r) => sum + r.statusScore, 0) / requirements.length)
    : 0;

  return (
    <div className="critical-req-card">
      <div className="critical-req-header">
        <div className="critical-req-title-row">
          <TrendingUp className="w-6 h-6" style={{ color: '#dd0000' }} />
          <div>
            <h3>Readiness Meter</h3>
            <span>Critical requirements analysis</span>
          </div>
        </div>
        <div className="critical-req-score" style={{
          background: overallScore >= 80 ? 'linear-gradient(135deg, #22c55e, #16a34a)' :
                      overallScore >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                      'linear-gradient(135deg, #ef4444, #dc2626)'
        }}>
          <span className="score-value">{overallScore}%</span>
          <span className="score-label">Ready</span>
        </div>
      </div>

      <div className="critical-req-list">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className={`critical-req-item ${expandedReq === req.type ? 'critical-req-item-expanded' : ''}`}
            style={{ borderLeftColor: getStatusColor(req.status) }}
          >
            <div className="critical-req-item-header" onClick={() => setExpandedReq(expandedReq === req.type ? null : req.type)}>
              <div className="critical-req-item-left">
                <div className="critical-req-icon" style={{ color: getStatusColor(req.status), background: getStatusBg(req.status) }}>
                  {getStatusIcon(req.status)}
                </div>
                <div className="critical-req-info">
                  <h4>{req.label}</h4>
                  <div className="critical-req-comparison">
                    <span className="req-label">Required:</span>
                    <span className="req-value">{req.programRequirement}</span>
                  </div>
                  <div className="critical-req-comparison">
                    <span className="req-label">You have:</span>
                    <span className="req-value" style={{ color: getStatusColor(req.status) }}>
                      {req.userProvided || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="critical-req-item-right">
                <div className="critical-req-status" style={{ 
                  background: getStatusBg(req.status),
                  color: getStatusColor(req.status),
                  borderColor: getStatusColor(req.status)
                }}>
                  {req.status}
                </div>
                {expandedReq === req.type ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {expandedReq === req.type && (
              <div className="critical-req-expanded">
                <p className="critical-req-notes">{req.notes}</p>
                
                {req.askUserQuestions && req.askUserQuestions.length > 0 && (
                  <div className="critical-req-questions">
                    <div className="critical-req-questions-header">
                      <div>
                        <h5>Help us verify</h5>
                        <span>Share quick answers so we can update your readiness.</span>
                      </div>
                      <span className="critical-req-required">Required*</span>
                    </div>
                    <div className="critical-req-question-list">
                      {req.askUserQuestions.map((q, qIdx) => (
                        <label key={qIdx} className="critical-req-question-item">
                          <span>{q}</span>
                          <textarea
                            rows={2}
                            placeholder="Type your answer"
                            value={responses[req.type]?.[qIdx] || ''}
                            onChange={(e) => handleResponseChange(req.type, qIdx, e.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                    <button
                      className="critical-req-answer-btn"
                      onClick={() => handleSubmitAnswers(req)}
                      disabled={submitting === req.type}
                    >
                      {submitting === req.type ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {submitting === req.type ? 'Submitting...' : 'Share Answers'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .critical-req-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        }

        .critical-req-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .critical-req-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .critical-req-title-row h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .critical-req-title-row span {
          font-size: 11px;
          color: #94a3b8;
        }

        .critical-req-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          color: #fff;
          flex-shrink: 0;
        }

        .critical-req-score .score-value {
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
        }

        .critical-req-score .score-label {
          font-size: 9px;
          font-weight: 600;
          opacity: 0.9;
          margin-top: 2px;
        }

        .critical-req-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .critical-req-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left-width: 3px;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.15s;
        }

        .critical-req-item-expanded {
          background: #fff;
          border-color: #cbd5e1;
        }

        .critical-req-item:hover {
          border-color: #cbd5e1;
        }

        .critical-req-item-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 10px 12px;
          cursor: pointer;
          gap: 8px;
        }

        .critical-req-item-left {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }

        .critical-req-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .critical-req-icon svg {
          width: 16px;
          height: 16px;
        }

        .critical-req-info {
          flex: 1;
          min-width: 0;
        }

        .critical-req-info h4 {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .critical-req-comparison {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 2px;
        }

        .req-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .req-value {
          font-size: 11px;
          color: #475569;
          font-weight: 500;
        }

        .critical-req-item-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .critical-req-status {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border: 1px solid;
        }

        .critical-req-expanded {
          padding: 12px;
          border-top: 1px solid #e2e8f0;
          background: #fff;
        }

        .critical-req-notes {
          margin: 0 0 12px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        .critical-req-questions {
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .critical-req-questions-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .critical-req-questions-header h5 {
          font-size: 12px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .critical-req-questions-header span {
          display: block;
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        .critical-req-required {
          font-size: 10px;
          text-transform: uppercase;
          color: #ef4444;
          font-weight: 600;
        }

        .critical-req-question-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .critical-req-question-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #334155;
          font-weight: 500;
        }

        .critical-req-question-item textarea {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 12px;
          resize: none;
          background: #fff;
        }

        .critical-req-question-item textarea:focus {
          outline: none;
          border-color: #dd0000;
        }

        .critical-req-answer-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          padding: 8px 14px;
          background: #dd0000;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .critical-req-answer-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .critical-req-answer-btn:hover:not(:disabled) {
          background: #b91c1c;
        }
      `}</style>
    </div>
  );
}
