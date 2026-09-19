import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { CONTRACT_STRATEGIES } from '../data/mockData';
import { ContractStrategy } from '../types';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  TrendingDown, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

export const ContractStrategyPage: React.FC = () => {
  const [activeStrategyId, setActiveStrategyId] = useState<string>('multi-voyage');

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Contract Strategy Recommendation & COA Structuring
            </h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
              Financial Hedging
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Algorithmic procurement evaluation across Spot Market, Short-Term Time Charter, and Multi-Voyage COA structures.
          </p>
        </div>

        <div>
          <Badge variant="emerald" size="md" pulse dot>
            COA Selected: Save $221k
          </Badge>
        </div>
      </div>

      {/* 3 Strategy Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CONTRACT_STRATEGIES.map((strat: ContractStrategy) => {
          const isSelected = activeStrategyId === strat.id;

          return (
            <GlassCard
              key={strat.id}
              glow={strat.isRecommended ? 'emerald' : 'none'}
              onClick={() => setActiveStrategyId(strat.id)}
              className={clsx(
                'p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden',
                strat.isRecommended && 'glass-card-glow-emerald bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/40',
                isSelected && !strat.isRecommended && 'border-slate-600 bg-slate-800/80'
              )}
            >
              {strat.isRecommended && (
                <div className="absolute top-0 right-0">
                  <div className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>Most Cost-Effective Strategy</span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">{strat.name}</h3>
                    <span className="text-xs text-slate-400">Parcel: 75,000 MT Coking Coal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Unit Freight Cost</span>
                    <span className={clsx(
                      'text-lg font-extrabold font-mono',
                      strat.isRecommended ? 'text-emerald-400' : 'text-white'
                    )}>
                      ${strat.ratePerTon.toFixed(2)}/T
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      ${(strat.totalCostEstimate / 1000000).toFixed(2)}M Total
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Risk Exposure</span>
                    <span className={clsx(
                      'text-base font-bold',
                      strat.riskLevel === 'Low' ? 'text-emerald-400' : strat.riskLevel === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                    )}>
                      {strat.riskLevel} Risk
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      Score: {strat.riskScore}/100
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Operational Flexibility</span>
                    <span className="text-base font-bold text-white font-mono">
                      {strat.flexibilityScore}/100
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Schedule Agility
                    </span>
                  </div>

                  <div className={clsx(
                    'p-2.5 rounded-xl border',
                    strat.isRecommended ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/60 border-slate-700/60'
                  )}>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">AI Recommendation</span>
                    <span className={clsx(
                      'text-base font-extrabold font-mono',
                      strat.isRecommended ? 'text-emerald-400' : 'text-slate-300'
                    )}>
                      {strat.aiRecommendationScore}% Fit
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {strat.isRecommended ? 'Optimal Choice' : 'Sub-optimal'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Strategic Trade-offs:
                  </span>
                  {strat.pros.slice(0, 2).map((pro: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{pro}</span>
                    </div>
                  ))}
                  {strat.cons.map((con: string, i: number) => (
                    <div key={i} className="flex items-start gap-1.5 text-rose-300">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  className={clsx(
                    'w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                    strat.isRecommended
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  )}
                >
                  <span>{strat.isRecommended ? 'Adopt Multi-Voyage Framework' : 'Select Option'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
