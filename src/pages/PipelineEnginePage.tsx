import React, { useState, useMemo } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { 
  PORTS_DATABASE, 
  VESSEL_SPECS, 
  recommendBooking, 
  forecastCharterRate, 
  recommendVessel, 
  idleRiskAlert,
  CAPESIZE_SPEC_DRIVERS
} from '../services/pipelineEngine';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  TrendingUp, 
  Ship, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  Sliders, 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const PipelineEnginePage: React.FC = () => {
  const [activePipeline, setActivePipeline] = useState<'freight' | 'charter' | 'vessel' | 'idle'>('freight');
  const [copiedCode, setCopiedCode] = useState(false);

  // Common Controls State
  const [origin, setOrigin] = useState<string>('Australia_Newcastle');
  const [destination, setDestination] = useState<string>('Paradip');
  const [vesselType, setVesselType] = useState<string>('Panamax');
  const [cargoQty, setCargoQty] = useState<number>(75000);
  const [horizonWeeks, setHorizonWeeks] = useState<number>(8);
  const [bunkerPrice, setBunkerPrice] = useState<number>(620);
  const [waitThreshold, setWaitThreshold] = useState<number>(1.0);

  // Idle Risk Overrides
  const [rainfall, setRainfall] = useState<number>(38);
  const [windSpeed, setWindSpeed] = useState<number>(42);
  const [cycloneAlerts, setCycloneAlerts] = useState<number>(1);
  const [disruptionDays, setDisruptionDays] = useState<number>(1);
  const [congestionIndex, setCongestionIndex] = useState<number>(0.55);
  const [vesselsWaiting, setVesselsWaiting] = useState<number>(16);

  // Computed Outputs
  const freightResult = useMemo(() => {
    return recommendBooking(origin, destination, vesselType, horizonWeeks, waitThreshold, bunkerPrice);
  }, [origin, destination, vesselType, horizonWeeks, waitThreshold, bunkerPrice]);

  const charterResult = useMemo(() => {
    return forecastCharterRate(vesselType, horizonWeeks, bunkerPrice);
  }, [vesselType, horizonWeeks, bunkerPrice]);

  const vesselResult = useMemo(() => {
    return recommendVessel(origin, destination, cargoQty);
  }, [origin, destination, cargoQty]);

  const idleResult = useMemo(() => {
    return idleRiskAlert(
      origin, 
      destination, 
      vesselType, 
      { rainfall_mm_avg: rainfall, wind_kmph_avg: windSpeed, cyclone_alert_days: cycloneAlerts, disruption_days: disruptionDays },
      { congestion_index_0to1: congestionIndex, vessels_waiting: vesselsWaiting }
    );
  }, [origin, destination, vesselType, rainfall, windSpeed, cycloneAlerts, disruptionDays, congestionIndex, vesselsWaiting]);

  const handleCopyPythonCode = () => {
    const codeSnippet = `# Run standalone entry point from coal_shipping_pipeline.py
from coal_shipping_pipeline import recommend_booking, forecast_charter_rate, recommend_vessel, idle_risk_alert

# Section 1: Spot Freight & Booking Strategy
booking = recommend_booking("${origin}", "${destination}", "${vesselType}", horizon_weeks=${horizonWeeks})

# Section 2: Vessel Charter Hire Forecast
charter = forecast_charter_rate("${vesselType}", horizon_weeks=${horizonWeeks})

# Section 3: Physical Vessel Constraint & Cost Ranking
vessel = recommend_vessel("${origin}", "${destination}", ${cargoQty})

# Section 4: Dual-Channel Idle Risk & Demurrage Alert
idle = idle_risk_alert("${origin}", "${destination}", "${vesselType}")`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Consolidated Coal-Shipping Analytics Pipeline Engine
            </h1>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-bold uppercase">
              End-to-End ML Core
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Production orchestration of 4 serialized predictive pipelines with real-time constraint solvers and namespaced artifact states.
          </p>
        </div>

        <button
          onClick={handleCopyPythonCode}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copiedCode ? 'Copied Python API' : 'Copy Python Snippet'}</span>
        </button>
      </div>

      {/* 4-Pipeline Segment Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'freight', name: 'Section 1: Freight-Rate Pipeline', sub: 'Spot $/Ton + Booking Strategy', icon: TrendingUp, color: 'blue' },
          { id: 'charter', name: 'Section 2: Charter-Rate Pipeline', sub: 'Time Hire $/Day Forecasting', icon: DollarSign, color: 'emerald' },
          { id: 'vessel', name: 'Section 3: Vessel Recommender', sub: 'Draft/LOA Constraints & Ranking', icon: Ship, color: 'cyan' },
          { id: 'idle', name: 'Section 4: Idle-Risk Pipeline', sub: 'Weather + Congestion Extra Cost', icon: ShieldAlert, color: 'rose' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePipeline === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePipeline(tab.id as any)}
              className={clsx(
                'p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between',
                isActive 
                  ? 'bg-slate-800/90 border-blue-500 ring-1 ring-blue-500/50 shadow-glow-blue' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              )}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={clsx('text-xs font-bold', isActive ? 'text-blue-400' : 'text-slate-300')}>
                  {tab.name}
                </span>
                <Icon className={clsx('w-4 h-4', isActive ? 'text-blue-400' : 'text-slate-500')} />
              </div>
              <span className="text-[11px] text-slate-400 truncate">
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Global Corridor & Parameter Control Bar */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>Pipeline Input Variables & Exogenous Drivers</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Origin Port</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="Australia_Newcastle">Australia - Newcastle (15.4m draft)</option>
              <option value="Port_Hedland">Australia - Port Hedland (19.5m draft)</option>
              <option value="Indonesia_Kalimantan">Indonesia - Kalimantan (14.0m draft)</option>
              <option value="Mozambique_Nacala">Mozambique - Nacala (15.0m draft)</option>
              <option value="Richards_Bay">South Africa - Richards Bay (17.5m draft)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Destination Port</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="Paradip">Paradip Port (14.5m draft, 100k DWT)</option>
              <option value="Gangavaram">Gangavaram (18.5m draft, 200k DWT Capesize)</option>
              <option value="Haldia">Haldia Dock (8.5m draft, 45k Handysize only)</option>
              <option value="Gopalpur">Gopalpur Port (12.5m draft, Supramax)</option>
              <option value="Visakhapatnam">Visakhapatnam Inner/Outer (14.5m draft)</option>
              <option value="Dhamra">Dhamra Deepwater (18.0m draft, Capesize)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Target Vessel Class</label>
            <select
              value={vesselType}
              onChange={(e) => setVesselType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="Capesize">Capesize (180,000 DWT • 18.2m Draft)</option>
              <option value="Panamax">Panamax (82,000 DWT • 14.4m Draft)</option>
              <option value="Supramax">Supramax (58,000 DWT • 12.8m Draft)</option>
              <option value="Handysize">Handysize (35,000 DWT • 10.0m Draft)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">VLSFO Bunker Price ($/ton)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={450}
                max={850}
                step={10}
                value={bunkerPrice}
                onChange={(e) => setBunkerPrice(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="font-mono font-bold text-white w-14 text-right">${bunkerPrice}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ========================================================================= */}
      {/* PIPELINE 1: FREIGHT RATE FORECASTING & BOOKING STRATEGY */}
      {/* ========================================================================= */}
      {activePipeline === 'freight' && (
        <div className="space-y-5">
          {/* Recommendation Banner */}
          <div className={clsx(
            'p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl',
            freightResult.action === 'WAIT' 
              ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/70 border-emerald-500/50 shadow-glow-emerald' 
              : 'bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/70 border-blue-500/50 shadow-glow-blue'
          )}>
            <div className="flex items-center gap-3.5">
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                freightResult.action === 'WAIT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              )}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={clsx('text-xs font-extrabold uppercase tracking-wider', freightResult.action === 'WAIT' ? 'text-emerald-400' : 'text-blue-400')}>
                    Strategic Decision: {freightResult.action}
                  </span>
                  <Badge variant={freightResult.action === 'WAIT' ? 'emerald' : 'blue'} size="sm">
                    {freightResult.action === 'WAIT' ? `Save $${freightResult.potential_savings_usd_per_ton}/ton` : 'Firm Pricing'}
                  </Badge>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {freightResult.short_term_decision}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Current Spot Benchmark: <strong className="font-mono text-white">${freightResult.current_rate_usd_per_ton}/ton</strong> • Corridor Distance: <strong className="font-mono text-cyan-300">{vesselResult.distance_nm.toLocaleString()} NM</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Horizon Window</span>
                <select
                  value={horizonWeeks}
                  onChange={(e) => setHorizonWeeks(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                >
                  <option value={4}>4 Weeks Ahead</option>
                  <option value={8}>8 Weeks Ahead</option>
                  <option value={12}>12 Weeks Ahead</option>
                </select>
              </div>
            </div>
          </div>

          {/* Forecast Chart & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Recursive Freight Forecast ($/ton) with Confidence Bounds
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      HistGradientBoosting recursive step trajectory for {freightResult.lane}
                    </p>
                  </div>
                  <Badge variant="blue" size="sm">HGBR Regressor</Badge>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={freightResult.short_term_forecast}>
                      <defs>
                        <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} unit="$" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                        formatter={(value: any) => [`$${value}/ton`, 'Rate']}
                      />
                      <Area type="monotone" dataKey="upper_bound" stroke="#3b82f6" strokeDasharray="4 4" fillOpacity={1} fill="url(#colorUpper)" />
                      <Area type="monotone" dataKey="lower_bound" stroke="#3b82f6" strokeDasharray="4 4" fillOpacity={0} />
                      <Line type="monotone" dataKey="predicted_rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-4">
              <GlassCard className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                    Long-Term Seasonal Pattern
                  </h3>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {freightResult.long_term_guide}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    {Object.entries(freightResult.long_term_seasonal_avg_by_month).map(([m, rate]) => {
                      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const isCheapest = Number(m) === freightResult.cheapest_month;
                      const isPriciest = Number(m) === freightResult.priciest_month;
                      return (
                        <div key={m} className={clsx(
                          'flex items-center justify-between p-1.5 rounded-lg font-mono text-[11px]',
                          isCheapest && 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30',
                          isPriciest && 'bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30',
                          !isCheapest && !isPriciest && 'text-slate-300'
                        )}>
                          <span>{monthNames[Number(m)]}</span>
                          <div className="flex items-center gap-2">
                            <span>${rate}/ton</span>
                            {isCheapest && <span className="text-[9px] bg-emerald-500 text-slate-950 font-sans font-extrabold px-1 rounded">CHEAPEST</span>}
                            {isPriciest && <span className="text-[9px] bg-rose-500 text-white font-sans font-extrabold px-1 rounded">PEAK</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PIPELINE 2: CHARTER-RATE FORECASTING */}
      {/* ========================================================================= */}
      {activePipeline === 'charter' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['Handysize', 'Supramax', 'Panamax', 'Capesize'] as const).map((vt) => {
              const fc = forecastCharterRate(vt, horizonWeeks, bunkerPrice);
              const isSelected = vesselType === vt;
              return (
                <GlassCard
                  key={vt}
                  onClick={() => setVesselType(vt)}
                  glow={isSelected ? 'emerald' : 'none'}
                  className={clsx(
                    'p-4 cursor-pointer transition-all',
                    isSelected ? 'border-emerald-500/60 ring-1 ring-emerald-500/40 bg-emerald-950/20' : 'hover:border-slate-700'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-300">{vt}</span>
                    <Badge variant={isSelected ? 'emerald' : 'default'} size="sm">
                      {isSelected ? 'Active' : 'Select'}
                    </Badge>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-white mt-1">
                    ${fc.current_rate_usd_per_day.toLocaleString()}
                    <span className="text-xs text-slate-400 font-sans font-normal ml-1">/day</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ridge Regression Autoregressive Hire Projection
                  </p>
                </GlassCard>
              );
            })}
          </div>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {vesselType} Multi-Week Time Charter Hire Rate ($/Day)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Auto-regressive momentum + VLSFO bunker fuel pass-through coefficients (Ridge Alpha=1.0)
                </p>
              </div>
              <Badge variant="emerald" size="sm">Ridge Model</Badge>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charterResult.forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} unit="$" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    formatter={(val: any) => [`$${val.toLocaleString()} / day`, 'Charter Rate']}
                  />
                  <Line type="monotone" dataKey="predicted_rate_usd_per_day" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PIPELINE 3: VESSEL RECOMMENDER & CONSTRAINT ENGINE */}
      {/* ========================================================================= */}
      {activePipeline === 'vessel' && (
        <div className="space-y-5">
          {/* Cargo Parcel Slider */}
          <GlassCard className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Cargo Parcel Tonnage: <strong className="font-mono text-cyan-400 text-base">{cargoQty.toLocaleString()} MT</strong>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Constraint engine checks draft, beam, LOA, and DWT limits at both ports.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-72">
                <input
                  type="range"
                  min={30000}
                  max={220000}
                  step={5000}
                  value={cargoQty}
                  onChange={(e) => setCargoQty(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </GlassCard>

          {/* Feasible & Infeasible Vessels Table */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Vessel Compatibility & Cost Ranking Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Route: {PORTS_DATABASE[origin]?.name} → {PORTS_DATABASE[destination]?.name} ({vesselResult.distance_nm} NM)
                </p>
              </div>
              <Badge variant="cyan" size="sm">Constraint Solver</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 px-3">Vessel Type</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Effective DWT</th>
                    <th className="pb-3 px-3">Trips Needed</th>
                    <th className="pb-3 px-3">Capacity Util.</th>
                    <th className="pb-3 px-3">Freight $/Ton</th>
                    <th className="pb-3 px-3">Total Freight Cost</th>
                    <th className="pb-3 px-3">Charter Cross-Check</th>
                    <th className="pb-3 px-3">Cost Alpha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {vesselResult.feasible_vessel_types_ranked_by_cost.map((v, i) => (
                    <tr key={v.vessel_type} className={clsx('hover:bg-slate-800/40 transition-colors', i === 0 && 'bg-cyan-950/20')}>
                      <td className="py-3 px-3 font-bold font-sans text-white flex items-center gap-2">
                        {i === 0 && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                        <span>{v.vessel_type}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-sans font-bold text-[10px] border border-emerald-500/30">
                          FEASIBLE
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">{v.capacity_per_vessel_tons.toLocaleString()} MT</td>
                      <td className="py-3 px-3 text-slate-200">{v.trips_needed} trip(s)</td>
                      <td className="py-3 px-3 text-slate-200">{v.utilization_pct}%</td>
                      <td className="py-3 px-3 text-slate-200">${v.predicted_freight_rate_usd_per_ton?.toFixed(2)}</td>
                      <td className="py-3 px-3 font-bold text-white">${v.total_freight_cost_usd?.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-400">${v.cross_check_charter_based_cost_usd?.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold">
                        {i === 0 ? (
                          <span className="text-emerald-400 font-sans font-bold">Optimal (#1)</span>
                        ) : (
                          <span className="text-rose-400">+${v.cost_alpha_vs_baseline?.toLocaleString()}</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {vesselResult.infeasible_vessels.map((v) => (
                    <tr key={v.vessel_type} className="opacity-60 bg-rose-950/10">
                      <td className="py-3 px-3 font-sans font-bold text-slate-400">{v.vessel_type}</td>
                      <td className="py-3 px-3">
                        <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-sans font-bold text-[10px] border border-rose-500/30">
                          RESTRICTED
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500" colSpan={7}>
                        <span className="text-rose-300 font-sans text-xs">
                          {v.infeasible_reason}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recommendation Footnote */}
            <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span><strong>Recommendation:</strong> {vesselResult.recommendation}</span>
            </div>
          </GlassCard>

          {/* Bonus: Capesize Spec Driver Model */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Capesize Specification Driver Model (Random Forest Regressor)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Permutation feature importances for daily charter hire rate ($/day)
                </p>
              </div>
              <Badge variant="cyan" size="sm">RandomForest</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CAPESIZE_SPEC_DRIVERS} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} unit="%" tickFormatter={(v) => `${(v * 100).toFixed(0)}`} />
                    <YAxis dataKey="feature" type="category" stroke="#64748b" tick={{ fontSize: 9 }} width={120} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                      formatter={(v: any) => [`${(Number(v) * 100).toFixed(1)}%`, 'Permutation Importance']}
                    />
                    <Bar dataKey="importance" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {CAPESIZE_SPEC_DRIVERS.map((item) => (
                  <div key={item.feature} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.feature}</span>
                      <span className="text-cyan-400 font-mono">{(item.importance * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PIPELINE 4: IDLE-RISK PIPELINE */}
      {/* ========================================================================= */}
      {activePipeline === 'idle' && (
        <div className="space-y-5">
          {/* Risk Level Alert Header */}
          <div className={clsx(
            'p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl',
            idleResult.overall_risk_tier === 'HIGH' ? 'bg-rose-950/40 border-rose-500/50 shadow-glow-rose' :
            idleResult.overall_risk_tier === 'MEDIUM' ? 'bg-amber-950/40 border-amber-500/50 shadow-glow-amber' :
            'bg-emerald-950/40 border-emerald-500/50 shadow-glow-emerald'
          )}>
            <div className="flex items-center gap-3.5">
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                idleResult.overall_risk_tier === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                idleResult.overall_risk_tier === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              )}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
                    Dual-Channel Risk Tier: {idleResult.overall_risk_tier}
                  </span>
                  <Badge variant={idleResult.overall_risk_tier === 'HIGH' ? 'rose' : idleResult.overall_risk_tier === 'MEDIUM' ? 'amber' : 'emerald'} size="sm">
                    Score: {idleResult.composite_risk_score}/100
                  </Badge>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Total Expected Extra Demurrage / Idle Exposure: <span className="font-mono text-rose-400">${idleResult.total_expected_extra_cost_usd.toLocaleString()} USD</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Origin: {idleResult.origin_port} • Destination: {idleResult.destination_port} • Vessel Hire: ${idleResult.current_charter_rate_usd_per_day.toLocaleString()}/day
                </p>
              </div>
            </div>
          </div>

          {/* Channel A and Channel B Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Channel A: Mining Weather */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-white uppercase">Channel A: Mining Region Weather Disruption</span>
                <Badge variant="blue" size="sm">Logistic + Ridge</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Average Rainfall (mm)</span>
                    <span className="font-mono font-bold text-blue-400">{rainfall} mm</span>
                  </div>
                  <input type="range" min={0} max={120} value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Average Wind Speed (km/h)</span>
                    <span className="font-mono font-bold text-blue-400">{windSpeed} km/h</span>
                  </div>
                  <input type="range" min={10} max={100} value={windSpeed} onChange={(e) => setWindSpeed(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Cyclone Alert Days</label>
                    <input type="number" min={0} max={7} value={cycloneAlerts} onChange={(e) => setCycloneAlerts(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Disruption Days</label>
                    <input type="number" min={0} max={7} value={disruptionDays} onChange={(e) => setDisruptionDays(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono" />
                  </div>
                </div>

                {/* Model Predictions */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occurrence Probability:</span>
                    <span className={clsx('font-bold', idleResult.mining_weather_risk.probability_idle_event > 0.4 ? 'text-rose-400' : 'text-emerald-400')}>
                      {(idleResult.mining_weather_risk.probability_idle_event * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Idle Days:</span>
                    <span className="text-white font-bold">{idleResult.mining_weather_risk.expected_idle_days_if_occurs} days</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1">
                    <span className="text-slate-300">Expected Extra Cost:</span>
                    <span className="text-rose-400 font-bold">${idleResult.mining_weather_risk.expected_extra_cost_usd.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Channel B: Destination Port Congestion */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-white uppercase">Channel B: Destination Port Congestion</span>
                <Badge variant="rose" size="sm">Ridge Regressor</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Congestion Index (0 to 1)</span>
                    <span className="font-mono font-bold text-rose-400">{congestionIndex.toFixed(2)}</span>
                  </div>
                  <input type="range" min={0.1} max={0.95} step={0.05} value={congestionIndex} onChange={(e) => setCongestionIndex(Number(e.target.value))} className="w-full accent-rose-500" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Vessels Waiting at Anchorage</span>
                    <span className="font-mono font-bold text-rose-400">{vesselsWaiting} ships</span>
                  </div>
                  <input type="range" min={1} max={40} value={vesselsWaiting} onChange={(e) => setVesselsWaiting(Number(e.target.value))} className="w-full accent-rose-500" />
                </div>

                {/* Model Predictions */}
                <div className="mt-8 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Congestion Risk Tier:</span>
                    <span className={clsx('font-bold', idleResult.destination_congestion_risk?.risk_tier === 'HIGH' ? 'text-rose-400' : 'text-emerald-400')}>
                      {idleResult.destination_congestion_risk?.risk_tier}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Waiting Idle Days:</span>
                    <span className="text-white font-bold">{idleResult.destination_congestion_risk?.expected_congestion_idle_days} days</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1">
                    <span className="text-slate-300">Expected Congestion Cost:</span>
                    <span className="text-rose-400 font-bold">${idleResult.destination_congestion_risk?.expected_congestion_extra_cost_usd.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Terminal View: Raw JSON Output from the Pipeline */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Real-Time Execution Payload ({activePipeline.toUpperCase()} PIPELINE OUTPUT)</span>
          </div>
          <Badge variant="emerald" size="sm">JSON API</Badge>
        </div>

        <pre className="p-3 rounded-xl bg-slate-950/80 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-56 custom-scrollbar border border-slate-800">
          {JSON.stringify(
            activePipeline === 'freight' ? freightResult :
            activePipeline === 'charter' ? charterResult :
            activePipeline === 'vessel' ? vesselResult :
            idleResult,
            null,
            2
          )}
        </pre>
      </GlassCard>
    </div>
  );
};
