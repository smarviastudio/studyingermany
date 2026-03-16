import { CheckCircle2, AlertCircle, HelpCircle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
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
          <div key={idx} className="critical-req-item" style={{ borderLeftColor: getStatusColor(req.status) }}>
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
                    <h5>Help us verify:</h5>
                    <ul>
                      {req.askUserQuestions.map((q, qIdx) => (
                        <li key={qIdx}>{q}</li>
                      ))}
                    </ul>
                    <button 
                      className="critical-req-answer-btn"
                      onClick={() => onAnswerQuestion?.(req.type, {})}
                    >
                      Provide Information
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
          background: linear-gradient(135deg, rgba(221,0,0,0.02), rgba(124,58,237,0.02));
          border: 1px solid rgba(221,0,0,0.12);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .critical-req-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .critical-req-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .critical-req-title-row h3 {
          font-size: 18px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .critical-req-title-row span {
          font-size: 13px;
          color: #666;
        }

        .critical-req-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 16px;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .critical-req-score .score-value {
          font-size: 26px;
          font-weight: 800;
          line-height: 1;
        }

        .critical-req-score .score-label {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.9;
          margin-top: 4px;
        }

        .critical-req-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .critical-req-item {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-left-width: 4px;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .critical-req-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .critical-req-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          cursor: pointer;
        }

        .critical-req-item-left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
        }

        .critical-req-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .critical-req-info {
          flex: 1;
        }

        .critical-req-info h4 {
          font-size: 15px;
          font-weight: 600;
          color: #111;
          margin: 0 0 8px;
        }

        .critical-req-comparison {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 4px;
        }

        .req-label {
          font-size: 12px;
          color: #999;
          font-weight: 500;
        }

        .req-value {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .critical-req-item-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .critical-req-status {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid;
        }

        .critical-req-expanded {
          padding: 0 16px 16px;
          border-top: 1px solid #f0f0f0;
        }

        .critical-req-notes {
          margin: 12px 0;
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }

        .critical-req-questions {
          margin-top: 16px;
          padding: 16px;
          background: rgba(59,130,246,0.05);
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 10px;
        }

        .critical-req-questions h5 {
          font-size: 13px;
          font-weight: 600;
          color: #1d4ed8;
          margin: 0 0 8px;
        }

        .critical-req-questions ul {
          margin: 0 0 12px;
          padding-left: 18px;
          font-size: 13px;
          color: #444;
        }

        .critical-req-questions li {
          margin-bottom: 4px;
        }

        .critical-req-answer-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #dd0000, #b91c1c);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .critical-req-answer-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(221,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
