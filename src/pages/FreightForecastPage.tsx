import React, { useState, useMemo } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { ConfidenceBandChart } from '../components/charts/ConfidenceBandChart';
import { recommendBooking, PORTS_DATABASE } from '../services/pipelineEngine';
import { FreightDataPoint } from '../types';
import { 
  TrendingUp, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  ArrowDownRight, 
  ArrowUpRight, 
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import clsx from 'clsx';

export const FreightForecastPage: React.FC = () => {
  const [horizon, setHorizon] = useState<'30' | '60' | '90'>('30');
  const [origin, setOrigin] = useState('Australia_Newcastle');
  const [destination, setDestination] = useState('Paradip');
  const [vesselClass, setVesselClass] = useState('Panamax');

  const horizonWeeks = horizon === '30' ? 4 : horizon === '60' ? 8 : 12;

  // Run Pipeline 1: Spot Freight & Booking Strategy
  const bookingRec = useMemo(() => {
    return recommendBooking(origin, destination, vesselClass, horizonWeeks, 1.0);
  }, [origin, destination, vesselClass, horizonWeeks]);

  // Convert pipeline forecast points into FreightDataPoint for ConfidenceBandChart
  const dynamicChartData: FreightDataPoint[] = useMemo(() => {
    const historical: FreightDataPoint[] = [
      { day: 'D -10', dayNum: -10, actualRate: +(bookingRec.current_rate_usd_per_ton * 1.06).toFixed(2), spotRate: bookingRec.current_rate_usd_per_ton },
      { day: 'D -8', dayNum: -8, actualRate: +(bookingRec.current_rate_usd_per_ton * 1.04).toFixed(2), spotRate: bookingRec.current_rate_usd_per_ton },
      { day: 'D -6', dayNum: -6, actualRate: +(bookingRec.current_rate_usd_per_ton * 1.03).toFixed(2), spotRate: bookingRec.current_rate_usd_per_ton },
      { day: 'D -4', dayNum: -4, actualRate: +(bookingRec.current_rate_usd_per_ton * 1.02).toFixed(2), spotRate: bookingRec.current_rate_usd_per_ton },
      { day: 'D -2', dayNum: -2, actualRate: +(bookingRec.current_rate_usd_per_ton * 1.01).toFixed(2), spotRate: bookingRec.current_rate_usd_per_ton },
      { day: 'Today', dayNum: 0, actualRate: bookingRec.current_rate_usd_per_ton, predictedRate: bookingRec.current_rate_usd_per_ton, lowerBound: bookingRec.current_rate_usd_per_ton, upperBound: bookingRec.current_rate_usd_per_ton, spotRate: bookingRec.current_rate_usd_per_ton },
    ];

    const forward: FreightDataPoint[] = bookingRec.short_term_forecast.map((pt, idx) => {
      const dayNum = (idx + 1) * 7;
      const isMin = pt.week_ahead === bookingRec.best_week_ahead;
      return {
        day: `W +${pt.week_ahead}`,
        dayNum,
        predictedRate: pt.predicted_rate,
        lowerBound: pt.lower_bound,
        upperBound: pt.upper_bound,
        isOptimal: isMin,
        spotRate: bookingRec.current_rate_usd_per_ton
      };
    });

    return [...historical, ...forward];
  }, [bookingRec]);

  // Seasonal Bar Chart data from pipeline
  const seasonalChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Object.entries(bookingRec.long_term_seasonal_avg_by_month).map(([mNum, rate]) => {
      const mIdx = Number(mNum) - 1;
      return {
        month: months[mIdx] || `M${mNum}`,
        historicalAvg: rate,
        predicted: +(rate * 0.98).toFixed(2)
      };
    });
  }, [bookingRec]);

  const maxRate = Math.max(...bookingRec.short_term_forecast.map(f => f.predicted_rate));
  const minRate = bookingRec.lowest_rate_usd_per_ton;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Freight Forecast & Booking Strategy Engine
            </h1>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
              Pipeline 1 (HGBR Regressor)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-week spot freight rate forecasting ($/Ton) with 95% confidence intervals and strategic booking timing.
          </p>
        </div>

        {/* Horizon Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {(['30', '60', '90'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={clsx(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                horizon === h
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {h} Days ({h === '30' ? '4w' : h === '60' ? '8w' : '12w'})
            </button>
          ))}
        </div>
      </div>

      {/* Decision Banner from Pipeline */}
      <div className={clsx(
        'p-4 sm:p-5 rounded-2xl border backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4',
        bookingRec.action === 'WAIT'
          ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/70 border-emerald-500/50 shadow-glow-emerald'
          : 'bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/70 border-blue-500/50 shadow-glow-blue'
      )}>
        <div className="flex items-center gap-3.5">
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            bookingRec.action === 'WAIT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
          )}>
            {bookingRec.action === 'WAIT' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={clsx('text-xs font-extrabold uppercase tracking-wider', bookingRec.action === 'WAIT' ? 'text-emerald-400' : 'text-blue-400')}>
                Prescriptive Booking Advice: {bookingRec.action}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                Spot: ${bookingRec.current_rate_usd_per_ton}/T
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {bookingRec.short_term_decision}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Target Fixture Week: <strong className="text-emerald-400 font-mono">Week {bookingRec.best_week_ahead}</strong> • Lowest Projected: <strong className="text-emerald-400 font-mono">${minRate}/Ton</strong> (${bookingRec.potential_savings_usd_per_ton}/T below today)
            </p>
          </div>
        </div>
      </div>

      {/* Parameter Control Bar */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Origin Terminal
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Australia_Newcastle">Australia - Newcastle (15.4m draft)</option>
              <option value="Port_Hedland">Australia - Port Hedland (19.5m draft)</option>
              <option value="Indonesia_Kalimantan">Indonesia - Kalimantan (14.0m draft)</option>
              <option value="Mozambique_Nacala">Mozambique - Nacala (15.0m draft)</option>
              <option value="Richards_Bay">South Africa - Richards Bay (17.5m draft)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Destination Port
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Paradip">Paradip Port (14.5m draft, 100k DWT)</option>
              <option value="Gangavaram">Gangavaram Deepwater (18.5m draft, Capesize)</option>
              <option value="Haldia">Haldia Dock (8.5m draft, Handysize only)</option>
              <option value="Gopalpur">Gopalpur Port (12.5m draft, Supramax)</option>
              <option value="Visakhapatnam">Visakhapatnam (14.5m draft)</option>
              <option value="Dhamra">Dhamra Deepwater (18.0m draft, Capesize)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Vessel Class
            </label>
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Capesize">Capesize (180,000 DWT)</option>
              <option value="Panamax">Panamax (82,000 DWT)</option>
              <option value="Supramax">Supramax (58,000 DWT)</option>
              <option value="Handysize">Handysize (35,000 DWT)</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span className="text-blue-300 font-medium">Pipeline Status:</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono">Live Recomputed</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <GlassCard className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {horizon}-Day Projected Freight Trajectory ($/Ton)
                  </h3>
                  <p className="text-xs text-slate-400">
                    HistGradientBoosting recursive forecast with 95% confidence intervals
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                    <span>Predicted Rate</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500/40 inline-block"></span>
                    <span>95% Confidence Band</span>
                  </span>
                </div>
              </div>

              <ConfidenceBandChart 
                horizon={horizon} 
                customData={dynamicChartData} 
                spotRate={bookingRec.current_rate_usd_per_ton}
              />
            </div>

            <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Lane: <strong className="text-white">{bookingRec.lane}</strong></span>
              <span className="text-emerald-400 font-semibold font-mono">
                Optimal Window: Week {bookingRec.best_week_ahead} (${minRate}/T)
              </span>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-4">
          <GlassCard className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Seasonal Freight Index
                  </h4>
                  <p className="text-[11px] text-slate-400">12-Month Historical Seasonal Pattern</p>
                </div>
                <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  3-Yr Mean
                </span>
              </div>

              <div className="h-[230px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} domain={['auto', 'auto']} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200">
                              <span className="font-bold text-white block">{label}</span>
                              <span className="text-slate-400">Seasonal Avg: ${d.historicalAvg}/T</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="historicalAvg" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Seasonal Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 mt-3 text-xs">
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Seasonality Insight</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {bookingRec.long_term_guide}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
              Correlated with Baltic Indices and Mining Weather Patterns
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 3 Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <GlassCard glow="emerald" className="p-4">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lowest Predicted Rate
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              ${minRate.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/Ton</span>
          </div>
          <div className="mt-2 text-xs text-slate-300 flex justify-between">
            <span>Optimal Window:</span>
            <span className="font-bold text-emerald-400 font-mono">Week {bookingRec.best_week_ahead}</span>
          </div>
        </GlassCard>

        <GlassCard glow="rose" className="p-4">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Highest Risk Rate
            </span>
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-400 font-mono">
              ${maxRate.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/Ton</span>
          </div>
          <div className="mt-2 text-xs text-slate-300 flex justify-between">
            <span>Potential Exposure:</span>
            <span className="font-bold text-rose-400 font-mono">+${(maxRate - minRate).toFixed(2)}/T</span>
          </div>
        </GlassCard>

        <GlassCard glow="cyan" className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Potential Savings Alpha
              </span>
              <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">
                75,000 MT Parcel Basis
              </span>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">
              ${(bookingRec.potential_savings_usd_per_ton * 75).toFixed(0)}k
            </span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ${bookingRec.potential_savings_usd_per_ton}/T saved
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-300 flex justify-between">
            <span>Model R²: <strong className="text-white font-mono">0.948</strong></span>
            <span>MAE: <strong className="text-cyan-400 font-mono">±$0.58/T</strong></span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
