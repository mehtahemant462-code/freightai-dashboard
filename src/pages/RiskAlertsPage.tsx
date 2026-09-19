import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { RiskGaugeMeter } from '../components/charts/RiskGaugeMeter';
import { RISK_ALERTS } from '../data/mockData';
import { RiskAlert } from '../types';
import { idleRiskAlert } from '../services/pipelineEngine';
import { 
  AlertTriangle, 
  CloudLightning, 
  CloudRain, 
  Anchor, 
  Fuel, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

export const RiskAlertsPage: React.FC = () => {
  const [selectedAlertId, setSelectedAlertId] = useState<string>('alert-2');

  const disruptionTimeline = [
    { day: 'Day 1-2 (Today)', event: 'Tropical Depression 04B peak wind escalation (95 km/h) in Bay of Bengal', severity: 'high', type: 'Weather' },
    { day: 'Day 3', event: 'Monsoon squall window at Paradip & Haldia (discharge slowed ~30%)', severity: 'medium', type: 'Weather' },
    { day: 'Day 4-6', event: 'Safe departure corridor opens; Singapore bunker prices consolidate', severity: 'low', type: 'Operational' },
    { day: 'Day 7-10', event: 'Vizag conveyor belt overhaul concludes; outer anchorage queue normalizes', severity: 'medium', type: 'Port' },
    { day: 'Day 14-16', event: 'Optimal charter fixture window arrives; BDI futures stabilize near 1,480 pts', severity: 'low', type: 'Market' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather':
        return CloudLightning;
      case 'port':
        return Anchor;
      case 'market':
        return TrendingUp;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Risk & Anomaly Detection Center
            </h1>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 font-bold uppercase">
              Early Warning Radar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-source surveillance of metocean hazards, port congestions, and freight index shocks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-rose-400 font-bold bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping-slow"></span>
            <span>Composite Severity: 68/100 (Moderate Alert)</span>
          </span>
        </div>
      </div>

      {/* Top Row: Risk Gauge Meter & Severity Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <GlassCard glow="amber" className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Fleet Risk Gauge</h3>
                </div>
                <Badge variant="amber" size="sm" pulse dot>
                  Live Sensor Feed
                </Badge>
              </div>

              <div className="mt-4 flex justify-center py-2">
                <RiskGaugeMeter score={68} title="Voyage Fleet Hazard Index" />
              </div>

              <p className="text-xs text-slate-300 text-center px-4 mt-2 leading-relaxed">
                Elevated fleet risk driven primarily by <strong className="text-rose-400">Cyclone 04B</strong> and <strong className="text-amber-400">Vizag mechanical downtime</strong>. Risk expected to subside by Day 4.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Threshold Limit: <strong className="text-white font-mono">75.0</strong></span>
              <span>Updated: <strong className="text-white font-mono">3m ago</strong></span>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-7">
          <GlassCard className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Sub-System Severity Vector Breakdown
                </h3>
                <span className="text-xs text-slate-400 font-mono">4 Vectors Monitored</span>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <CloudLightning className="w-4 h-4 text-rose-400" />
                      <span>Metocean & Cyclone Hazard</span>
                    </span>
                    <span className="font-mono font-bold text-rose-400">78 / 100 (Severe)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Bay of Bengal Tropical Depression 04B generates 4.8m wave swells near eastern approach.
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <Anchor className="w-4 h-4 text-amber-400" />
                      <span>Port Berthing Bottleneck</span>
                    </span>
                    <span className="font-mono font-bold text-amber-400">65 / 100 (Moderate)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Vizag inner basin mechanical delays averaging 48 hrs outer anchorage dwell.
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span>BDI Freight Index Volatility</span>
                    </span>
                    <span className="font-mono font-bold text-amber-400">74 / 100 (High)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '74%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    FFA forward contracts swinging ±8% weekly due to speculative Pacific charter fixtures.
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-blue-400" />
                      <span>Bunker Fuel Price Spike</span>
                    </span>
                    <span className="font-mono font-bold text-blue-400">52 / 100 (Normal)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '52%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Singapore VLSFO currently steady at $648/MT after initial +$28 bump.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Risk Aggregation: Multi-Criteria Decision Analysis (AHP)</span>
              <span className="text-emerald-400 font-semibold">Mitigation Strategy Ready</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 5 Risk Alert Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Anomaly Feeds & Incident Advisories
            </h3>
          </div>
          <span className="text-xs text-slate-400">5 Critical Disruption Vectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RISK_ALERTS.map((alert: RiskAlert) => {
            const Icon = getCategoryIcon(alert.category);
            const isSelected = selectedAlertId === alert.id;

            return (
              <GlassCard
                key={alert.id}
                glow={alert.severity === 'high' ? 'rose' : alert.severity === 'medium' ? 'amber' : 'none'}
                onClick={() => setSelectedAlertId(alert.id)}
                className={clsx(
                  'p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden',
                  isSelected && 'ring-1 ring-blue-400/80 bg-slate-800/80',
                  alert.severity === 'high' && 'border-rose-500/40 bg-gradient-to-b from-rose-950/10 to-slate-900',
                  alert.severity === 'medium' && 'border-amber-500/30'
                )}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={clsx(
                        'p-1.5 rounded-lg border',
                        alert.severity === 'high' && 'bg-rose-500/20 text-rose-400 border-rose-500/40',
                        alert.severity === 'medium' && 'bg-amber-500/20 text-amber-400 border-amber-500/40',
                        alert.severity === 'low' && 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={clsx(
                        'text-[10px] font-bold uppercase tracking-wider',
                        alert.severity === 'high' ? 'text-rose-400' : alert.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                      )}>
                        {alert.category} • {alert.severity} Risk
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {alert.timestamp}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2.5 leading-snug">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {alert.impactDescription}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-0.5">
                      Recommended Mitigation Protocol:
                    </span>
                    <p className="text-slate-200 text-[11px] leading-snug">
                      {alert.actionRequired}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{alert.location}</span>
                  <span className="font-mono font-bold text-white">Score: {alert.severityScore}/100</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Timeline of Upcoming Disruptions */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Timeline of Upcoming Maritime & Market Disruptions
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              16-Day rolling operational milestone window for Australia → Paradip coking coal shipments.
            </p>
          </div>
          <span className="text-xs text-blue-400 font-mono">Days 0 to 16 Horizon</span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {disruptionTimeline.map((item, idx) => (
            <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div
                className={clsx(
                  'absolute -left-6 sm:-left-8 w-3 h-3 rounded-full border-2 border-[#0B1120] flex-shrink-0 mt-1 sm:mt-0',
                  item.severity === 'high' && 'bg-rose-500 shadow-glow-rose',
                  item.severity === 'medium' && 'bg-amber-400 shadow-sm',
                  item.severity === 'low' && 'bg-emerald-400 shadow-glow-emerald'
                )}
              />

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">{item.day}</span>
                  <span
                    className={clsx(
                      'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                      item.severity === 'high' && 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
                      item.severity === 'medium' && 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
                      item.severity === 'low' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    )}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{item.event}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <span
                  className={clsx(
                    'text-xs font-semibold font-mono',
                    item.severity === 'high' && 'text-rose-400',
                    item.severity === 'medium' && 'text-amber-400',
                    item.severity === 'low' && 'text-emerald-400'
                  )}
                >
                  {item.severity === 'high' ? 'High Impact' : item.severity === 'medium' ? 'Moderate Risk' : 'Optimal Window'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Pipeline 4: Interactive Idle-Risk & Demurrage Calculator */}
      <Pipeline4Simulator />
    </div>
  );
};

const Pipeline4Simulator: React.FC = () => {
  const [orig, setOrig] = useState('Australia_Newcastle');
  const [dest, setDest] = useState('Paradip');
  const [vt, setVt] = useState('Panamax');
  const [rain, setRain] = useState(38);
  const [wind, setWind] = useState(42);
  const [cyclone, setCyclone] = useState(1);
  const [disrupt, setDisrupt] = useState(1);
  const [cong, setCong] = useState(0.55);
  const [waitShips, setWaitShips] = useState(16);

  const idleCalc = React.useMemo(() => {
    return idleRiskAlert(
      orig,
      dest,
      vt,
      { rainfall_mm_avg: rain, wind_kmph_avg: wind, cyclone_alert_days: cyclone, disruption_days: disrupt },
      { congestion_index_0to1: cong, vessels_waiting: waitShips }
    );
  }, [orig, dest, vt, rain, wind, cyclone, disrupt, cong, waitShips]);

  return (
    <GlassCard glow="rose" className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pipeline 4: Dual-Channel Idle-Risk & Demurrage Simulator
            </h3>
            <span className="text-[10px] bg-rose-500/15 text-rose-400 font-bold px-2 py-0.5 rounded border border-rose-500/30 uppercase">
              ML Logistic + Ridge
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time simulation of mining weather disruption probability and destination port congestion extra hire exposure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={idleCalc.overall_risk_tier === 'HIGH' ? 'rose' : idleCalc.overall_risk_tier === 'MEDIUM' ? 'amber' : 'emerald'} size="sm">
            Risk Tier: {idleCalc.overall_risk_tier} ({idleCalc.composite_risk_score}/100)
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="text-slate-400 block mb-1">Origin Mining Port</label>
          <select value={orig} onChange={(e) => setOrig(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:outline-none">
            <option value="Australia_Newcastle">Australia - Newcastle</option>
            <option value="Port_Hedland">Australia - Port Hedland</option>
            <option value="Indonesia_Kalimantan">Indonesia - Kalimantan</option>
            <option value="Mozambique_Nacala">Mozambique - Nacala</option>
            <option value="Richards_Bay">South Africa - Richards Bay</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Destination Discharge Port</label>
          <select value={dest} onChange={(e) => setDest(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:outline-none">
            <option value="Paradip">Paradip Port</option>
            <option value="Gangavaram">Gangavaram Deepwater</option>
            <option value="Haldia">Haldia Dock</option>
            <option value="Gopalpur">Gopalpur Port</option>
            <option value="Visakhapatnam">Visakhapatnam</option>
            <option value="Dhamra">Dhamra Deepwater</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Vessel Class</label>
          <select value={vt} onChange={(e) => setVt(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:outline-none">
            <option value="Capesize">Capesize ($23.5k/day)</option>
            <option value="Panamax">Panamax ($14.2k/day)</option>
            <option value="Supramax">Supramax ($12.8k/day)</option>
            <option value="Handysize">Handysize ($10.5k/day)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Weather Controls */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <span className="font-bold text-blue-400 uppercase text-[11px] block">Channel 1: Mining Weather Variables</span>
          <div>
            <div className="flex justify-between text-slate-300 mb-0.5">
              <span>Rainfall: {rain} mm</span>
              <span>Wind: {wind} km/h</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="range" min={0} max={100} value={rain} onChange={(e) => setRain(Number(e.target.value))} className="accent-blue-500" />
              <input type="range" min={10} max={90} value={wind} onChange={(e) => setWind(Number(e.target.value))} className="accent-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block text-[10px]">Cyclone Alert Days: {cyclone}</label>
              <input type="range" min={0} max={5} value={cyclone} onChange={(e) => setCyclone(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-slate-400 block text-[10px]">Disruption Days: {disrupt}</label>
              <input type="range" min={0} max={5} value={disrupt} onChange={(e) => setDisrupt(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono flex justify-between">
            <span className="text-slate-400">ML Event Probability:</span>
            <span className="text-rose-400 font-bold">{(idleCalc.mining_weather_risk.probability_idle_event * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Congestion Controls */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <span className="font-bold text-amber-400 uppercase text-[11px] block">Channel 2: Destination Congestion Variables</span>
          <div>
            <div className="flex justify-between text-slate-300 mb-0.5">
              <span>Congestion Index: {cong.toFixed(2)}</span>
              <span>Waiting Ships: {waitShips}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="range" min={0.1} max={0.95} step={0.05} value={cong} onChange={(e) => setCong(Number(e.target.value))} className="accent-amber-500" />
              <input type="range" min={2} max={35} value={waitShips} onChange={(e) => setWaitShips(Number(e.target.value))} className="accent-amber-500" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Congestion Idle Days:</span>
              <span className="text-amber-400 font-bold">{idleCalc.destination_congestion_risk?.expected_congestion_idle_days} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Daily Vessel Hire:</span>
              <span className="text-slate-200">${idleCalc.current_charter_rate_usd_per_day.toLocaleString()}/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Exposure Verdict */}
      <div className="mt-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-rose-300 uppercase tracking-wider block">Combined Demurrage / Idle Exposure</span>
          <span className="text-slate-300 mt-0.5 block">
            Weather Idle Days: {idleCalc.mining_weather_risk.expected_idle_days_if_occurs}d + Congestion Waiting: {idleCalc.destination_congestion_risk?.expected_congestion_idle_days}d
          </span>
        </div>
        <div className="text-right font-mono">
          <span className="text-xl font-extrabold text-rose-400 block">${idleCalc.total_expected_extra_cost_usd.toLocaleString()} USD</span>
          <span className="text-[10px] text-slate-400">Total Demurrage Risk</span>
        </div>
      </div>
    </GlassCard>
  );
};

