import { GraduationCap } from 'lucide-react';

interface GermanPulseLoaderProps {
  headline?: string;
  subline?: string;
  progressLabel?: string;
}

export function GermanPulseLoader({
  headline = 'Shaping your study plan…',
  subline = 'Connecting verified guidance · Personalizing milestones',
  progressLabel = 'Building your academic roadmap'
}: GermanPulseLoaderProps) {
  return (
    <div className="german-loader" aria-live="polite" role="status">
      <div className="german-loader-aura">
        <div className="german-loader-orbit orbit-black" />
        <div className="german-loader-orbit orbit-red" />
        <div className="german-loader-orbit orbit-gold" />
        <div className="german-loader-core" />
        <div className="german-loader-center">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="german-loader-spark" />
      </div>
      <p className="german-loader-headline">{headline}</p>
      <div className="german-loader-progress">
        <div className="german-loader-progress-track">
          <div className="german-loader-progress-glow" />
        </div>
        <span>{progressLabel}</span>
      </div>
      <p className="german-loader-subline">{subline}</p>

      <style jsx>{`
        .german-loader {
          text-align: center;
          color: #1f2937;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .german-loader-headline {
          font-weight: 600;
          color: #111;
          margin: 0;
        }

        .german-loader-subline {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .german-loader-aura {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .german-loader-orbit {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 3px solid transparent;
          animation: loader-orbit-spin 2.4s linear infinite;
        }

        .orbit-black { border-top-color: #0b1119; }
        .orbit-red { border-right-color: #dd0000; animation-delay: 0.15s; }
        .orbit-gold { border-bottom-color: #f4c300; animation-delay: 0.3s; }

        .german-loader-core {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          background: radial-gradient(circle at 30% 30%, #fff 0%, #ffe7a3 45%, #f4c300 100%);
          filter: drop-shadow(0 10px 18px rgba(0,0,0,0.18));
          animation: loader-core-pulse 1.8s ease-in-out infinite;
        }

        .german-loader-center {
          position: absolute;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: linear-gradient(135deg, #111, #dd0000, #f4c300);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: loader-center-bob 1.7s ease-in-out infinite;
        }

        .german-loader-center :global(svg) {
          stroke-width: 2.4px;
        }

        .german-loader-spark {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(221,0,0,0.15), rgba(244,195,0,0.25), rgba(0,0,0,0.2), transparent 70%);
          filter: blur(8px);
          animation: loader-spark-spin 3.2s linear infinite;
        }

        .german-loader-progress {
          width: 240px;
          text-align: center;
        }

        .german-loader-progress-track {
          position: relative;
          height: 6px;
          border-radius: 999px;
          background: rgba(0,0,0,0.08);
          overflow: hidden;
          margin-bottom: 6px;
        }

        .german-loader-progress-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #0b1119, #dd0000, #f4c300);
          animation: loader-progress-slide 1.4s ease-in-out infinite;
        }

        .german-loader-progress span {
          font-size: 12px;
          color: #6b7280;
          letter-spacing: 0.02em;
        }

        @keyframes loader-orbit-spin { to { transform: rotate(360deg); } }
        @keyframes loader-core-pulse { 0%, 100% { transform: scale(0.94); } 50% { transform: scale(1.05); } }
        @keyframes loader-center-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes loader-spark-spin { to { transform: rotate(-360deg); } }
        @keyframes loader-progress-slide {
          0% { transform: translateX(-60%); }
          100% { transform: translateX(60%); }
        }
      `}</style>
    </div>
  );
}
