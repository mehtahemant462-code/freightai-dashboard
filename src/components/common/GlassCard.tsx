import React from 'react';
import clsx from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'none';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowClasses = {
    blue: 'border-blue-500/50 shadow-glow-blue',
    emerald: 'border-emerald-500/50 shadow-glow-emerald',
    amber: 'border-amber-500/50 shadow-[0_0_25px_-3px_rgba(245,158,11,0.35)]',
    rose: 'border-rose-500/50 shadow-glow-rose',
    cyan: 'border-cyan-500/50 shadow-glow-cyan',
    none: 'border-slate-800/80 hover:border-slate-700/80',
  };

  return (
    <div
      className={clsx(
        'rounded-xl border bg-slate-900/70 backdrop-blur-md transition-all duration-200',
        interactive && 'cursor-pointer hover:bg-slate-800/70 hover:translate-y-[-2px]',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
