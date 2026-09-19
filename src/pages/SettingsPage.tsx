import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Settings, Cpu, Database, Bell, Shield, Sliders, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [modelMode, setModelMode] = useState('ensemble');
  const [confidenceInterval, setConfidenceInterval] = useState('95');
  const [bunkerFeed, setBunkerFeed] = useState('singapore-vlsfo');

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            System Configuration & AI Model Parameters
          </h1>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-bold uppercase">
            FreightAI Core
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tune neural forecasting hyperparameters, external telemetry feeds, and alert thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Model Architecture Settings */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Forecasting Engine Ensemble</span>
          </div>

          <div className="space-y-4 mt-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Active Architecture
              </label>
              <select
                value={modelMode}
                onChange={(e) => setModelMode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ensemble">Hybrid Ensemble (LSTM + XGBoost + Facebook Prophet) - Recommended</option>
                <option value="transformer">Temporal Fusion Transformer (TFT)</option>
                <option value="arima">Seasonal Auto-Regressive SARIMAX (Baseline)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Monte Carlo Confidence Interval Band
              </label>
              <select
                value={confidenceInterval}
                onChange={(e) => setConfidenceInterval(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="90">90% CI (Tighter Bounds, Lower Coverage)</option>
                <option value="95">95% CI (Industry Standard ISO 31000)</option>
                <option value="99">99% CI (Maximum Risk Aversion)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Live Bunker Benchmark Feed
              </label>
              <select
                value={bunkerFeed}
                onChange={(e) => setBunkerFeed(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="singapore-vlsfo">S&P Global Platts - Singapore VLSFO 0.5% (Real-time)</option>
                <option value="fujairah-vlsfo">Fujairah Bunker Index</option>
                <option value="rotterdam-vlsfo">Rotterdam Bunker Hub</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Real-time Feeds & Sensor Telemetry */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Connected External Ingestion Feeds</span>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Baltic Dry Exchange (BDI & BPI)</span>
                <span className="text-[10px] text-slate-400">London FFA Derivatives Feed • Latency 120ms</span>
              </div>
              <Badge variant="emerald" size="sm" dot>Active</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">IMD & NOAA Metocean Satellite</span>
                <span className="text-[10px] text-slate-400">Wave Height & Cyclone Vector Stream • 15m Sync</span>
              </div>
              <Badge variant="emerald" size="sm" dot>Active</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Indian Major Ports AIS Berth Radar</span>
                <span className="text-[10px] text-slate-400">Paradip, Vizag, Haldia Berth Queues • Real-time</span>
              </div>
              <Badge variant="emerald" size="sm" dot>Active</Badge>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
