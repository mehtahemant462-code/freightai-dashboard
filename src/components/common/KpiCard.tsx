import React from 'react';
import { GlassCard } from './GlassCard';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  change?: {
    value: string | number;
    positive?: boolean; // positive in savings or negative in cost
    label?: string;
  };
  icon: LucideIcon;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan';
  badge?: {
    text: string;
    variant: 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan';
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  change,
  icon: Icon,
  accentColor = 'blue',
  badge,
}) => {
  const iconBg = {
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };

  return (
    <GlassCard className="p-5 relative overflow-hidden group">
      {/* Background soft ambient gradient */}
      <div 
        className={clsx(
          "absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25",
          accentColor === 'blue' && 'bg-blue-500',
          accentColor === 'emerald' && 'bg-emerald-500',
          accentColor === 'amber' && 'bg-amber-500',
          accentColor === 'rose' && 'bg-rose-500',
          accentColor === 'cyan' && 'bg-cyan-500'
        )} 
      />

      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        <div className={clsx('p-2.5 rounded-xl border', iconBg[accentColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {change && (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={clsx(
                'px-1.5 py-0.5 rounded text-[11px] font-semibold',
                change.positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
              )}
            >
              {change.value}
            </span>
            {change.label && <span className="text-slate-400">{change.label}</span>}
          </div>
        )}
        {subtitle && !change && (
          <span className="text-slate-400 text-xs truncate">{subtitle}</span>
        )}

        {badge && (
          <span
            className={clsx(
              'px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border',
              badge.variant === 'emerald' && 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
              badge.variant === 'blue' && 'bg-blue-500/15 text-blue-400 border-blue-500/30',
              badge.variant === 'amber' && 'bg-amber-500/15 text-amber-400 border-amber-500/30',
              badge.variant === 'rose' && 'bg-rose-500/15 text-rose-400 border-rose-500/30',
              badge.variant === 'cyan' && 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
            )}
          >
            {badge.text}
          </span>
        )}
      </div>
    </GlassCard>
  );
};
