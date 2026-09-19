import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

interface RiskGaugeMeterProps {
  score?: number; // 0 to 100
  title?: string;
}

export const RiskGaugeMeter: React.FC<RiskGaugeMeterProps> = ({
  score = 68,
  title = 'Maritime Fleet Risk Index',
}) => {
  // Gauge semi-circle geometry: radius 90, center (130, 130)
  // angle from -180 deg (left) to 0 deg (right)
  const radius = 80;
  const cx = 120;
  const cy = 110;
  
  // Convert score (0 - 100) to angle (-180 to 0)
  const angle = -180 + (score / 100) * 180;
  const needleAngleRad = (angle * Math.PI) / 180;
  const needleLength = 65;
  const nx = cx + needleLength * Math.cos(needleAngleRad);
  const ny = cy + needleLength * Math.sin(needleAngleRad);

  const getStatus = (val: number) => {
    if (val < 35) return { label: 'Low Risk', color: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (val < 70) return { label: 'Moderate / Warning', color: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { label: 'Severe Alert', color: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  const status = getStatus(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="240" height="135" viewBox="0 0 240 135" className="overflow-visible">
          <defs>
            {/* Gauge Gradient */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#EF4444" />
            </linearGradient>

            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 40 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="#1E293B"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Foreground Colored Arc */}
          <path
            d="M 40 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Scale Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = -180 + (tick / 100) * 180;
            const rad = (tickAngle * Math.PI) / 180;
            const innerR = 64;
            const outerR = 96;
            const x1 = cx + innerR * Math.cos(rad);
            const y1 = cy + innerR * Math.sin(rad);
            const x2 = cx + outerR * Math.cos(rad);
            const y2 = cy + outerR * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#334155"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Center needle pivot */}
          <circle cx={cx} cy={cy} r="8" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />

          {/* Dynamic Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#F8FAFC"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#needleGlow)"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="text-center -mt-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold text-white font-mono">{score}</span>
            <span className="text-xs text-slate-400 font-semibold">/100</span>
          </div>
          <span
            className={clsx(
              'inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide uppercase',
              status.badge
            )}
          >
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
};
