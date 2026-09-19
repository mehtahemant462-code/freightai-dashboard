import React, { useState, useMemo } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { 
  Ship, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle, 
  Ruler, 
  Scale, 
  ArrowRight,
  Flame,
  Sliders,
  DollarSign,
  Layers,
  BarChart3
} from 'lucide-react';
import clsx from 'clsx';
import { 
  recommendVessel, 
  PORTS_DATABASE, 
  VESSEL_SPECS, 
  CAPESIZE_SPEC_DRIVERS 
} from '../services/pipelineEngine';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const VesselRecommendationPage: React.FC = () => {
  const [origin, setOrigin] = useState<string>('Australia_Newcastle');
  const [destination, setDestination] = useState<string>('Paradip');
  const [cargoQty, setCargoQty] = useState<number>(75000);
  const [selectedVesselType, setSelectedVesselType] = useState<string>('Panamax');

  const vesselRec = useMemo(() => {
    return recommendVessel(origin, destination, cargoQty);
  }, [origin, destination, cargoQty]);

  const origPort = PORTS_DATABASE[origin];
  const destPort = PORTS_DATABASE[destination];

  const allVessels = ['Capesize', 'Panamax', 'Supramax', 'Handysize'];

  const getVesselRankInfo = (vt: string) => {
    const feasible = vesselRec.feasible_vessel_types_ranked_by_cost.find(v => v.vessel_type === vt);
    if (feasible) return { ...feasible, isFeasible: true };
    const infeasible = vesselRec.infeasible_vessels.find(v => v.vessel_type === vt);
    return { ...infeasible, isFeasible: false };
  };

  const topFeasibleVessel = vesselRec.feasible_vessel_types_ranked_by_cost[0]?.vessel_type || 'Panamax';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Vessel Selection & Berth Constraint Matching Engine
            </h1>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
              Pipeline 3 Solver
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluating draft clearance, LOA constraints, trip logistics, and cost alpha across 4 dry bulk carrier classes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="blue" size="md" dot pulse>
            Optimal Match: {topFeasibleVessel}
          </Badge>
        </div>
      </div>

      {/* Corridor & Cargo Control Bar */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Origin Port (Load)</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Australia_Newcastle">Australia - Newcastle (15.4m draft, 180k DWT)</option>
              <option value="Port_Hedland">Australia - Port Hedland (19.5m draft, 260k DWT)</option>
              <option value="Indonesia_Kalimantan">Indonesia - Kalimantan (14.0m draft, 85k DWT)</option>
              <option value="Mozambique_Nacala">Mozambique - Nacala (15.0m draft, 120k DWT)</option>
              <option value="Richards_Bay">South Africa - Richards Bay (17.5m draft, 180k DWT)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Destination Port (Discharge)</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Paradip">Paradip Port, India (14.5m draft, 100k DWT)</option>
              <option value="Gangavaram">Gangavaram Deepwater, India (18.5m draft, Capesize)</option>
              <option value="Haldia">Haldia Dock, India (8.5m draft limit - Handysize only)</option>
              <option value="Gopalpur">Gopalpur Port, India (12.5m draft, Supramax)</option>
              <option value="Visakhapatnam">Visakhapatnam (Vizag), India (14.5m draft)</option>
              <option value="Dhamra">Dhamra Deepwater, India (18.0m draft, Capesize)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Cargo Parcel Size</label>
              <span className="text-xs font-mono font-bold text-cyan-400">{cargoQty.toLocaleString()} MT</span>
            </div>
            <input
              type="range"
              min={35000}
              max={200000}
              step={5000}
              value={cargoQty}
              onChange={(e) => setCargoQty(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
              <span>35k MT</span>
              <span>80k MT</span>
              <span>200k MT</span>
            </div>
          </div>
        </div>

        {/* Physical Limits Comparison Pills */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span>Origin Limits ({origPort?.name}):</span>
            <span className="font-mono text-white">Draft {origPort?.maxDraft}m • LOA {origPort?.maxLoa}m • Max {origPort?.maxDwt / 1000}k DWT</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Destination Limits ({destPort?.name}):</span>
            <span className="font-mono text-cyan-300">Draft {destPort?.maxDraft}m • LOA {destPort?.maxLoa}m • Max {destPort?.maxDwt / 1000}k DWT</span>
          </div>
        </div>
      </GlassCard>

      {/* 4 Vessel Class Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allVessels.map((vt) => {
          const spec = VESSEL_SPECS[vt];
          const info = getVesselRankInfo(vt);
          const isTopChoice = vt === topFeasibleVessel && info.isFeasible;
          const isSelected = selectedVesselType === vt;

          return (
            <GlassCard
              key={vt}
              onClick={() => setSelectedVesselType(vt)}
              glow={isTopChoice ? 'blue' : 'none'}
              className={clsx(
                'p-4 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden',
                isTopChoice && 'border-blue-500 ring-1 ring-blue-500/50 bg-blue-950/20 shadow-glow-blue',
                !info.isFeasible && 'opacity-70 bg-slate-900/40 border-slate-800'
              )}
            >
              {isTopChoice && (
                <div className="absolute top-0 right-0">
                  <div className="bg-blue-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-bl-lg shadow uppercase">
                    AI Optimal
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-white">{vt}</span>
                  {info.isFeasible ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Feasible
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <X className="w-3 h-3" /> Restricted
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 space-y-1 font-mono mb-3">
                  <div className="flex justify-between">
                    <span>Draft:</span>
                    <span className={clsx('font-bold', (destPort && spec.draft > destPort.maxDraft) ? 'text-rose-400' : 'text-slate-200')}>
                      {spec.draft}m (Limit: {destPort?.maxDraft}m)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>LOA Length:</span>
                    <span className="text-slate-200">{spec.loa}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="text-slate-200">{spec.dwtMax.toLocaleString()} DWT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Burn:</span>
                    <span className="text-slate-200">{spec.fuelTonsDay} MT/day</span>
                  </div>
                </div>

                {info.isFeasible ? (
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Trips Needed:</span>
                      <span className="font-bold text-white font-mono">{info.trips_needed} trip(s)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Utilization:</span>
                      <span className="font-bold text-cyan-400 font-mono">{info.utilization_pct}%</span>
                    </div>
                    <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-1">
                      <span>Total Freight:</span>
                      <span className="font-bold text-emerald-400 font-mono">${info.total_freight_cost_usd?.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-[11px] text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-rose-400" />
                    {info.infeasible_reason}
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Cost Ranking & Trip Logistics Matrix */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Constraint & Cost Ranking Matrix ({cargoQty.toLocaleString()} MT Coal Logistics)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by lowest total freight expenditure with charter-based cross-check validation
            </p>
          </div>
          <Badge variant="cyan" size="sm">Ranking Engine</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Hull Class</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Effective DWT</th>
                <th className="pb-3 px-3">Trips Required</th>
                <th className="pb-3 px-3">Capacity Util.</th>
                <th className="pb-3 px-3">Freight Rate</th>
                <th className="pb-3 px-3">Total Freight Outlay</th>
                <th className="pb-3 px-3">Charter Equivalent</th>
                <th className="pb-3 px-3">Cost Alpha vs Best</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {vesselRec.feasible_vessel_types_ranked_by_cost.map((v, i) => (
                <tr key={v.vessel_type} className={clsx('hover:bg-slate-800/40 transition-colors', i === 0 && 'bg-blue-950/20')}>
                  <td className="py-3 px-3 font-bold font-sans text-white flex items-center gap-2">
                    {i === 0 && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                    <span>{v.vessel_type}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-sans font-bold text-[10px] border border-emerald-500/30">
                      FEASIBLE
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-200">{v.capacity_per_vessel_tons.toLocaleString()} MT</td>
                  <td className="py-3 px-3 text-slate-200">{v.trips_needed}</td>
                  <td className="py-3 px-3 text-slate-200">{v.utilization_pct}%</td>
                  <td className="py-3 px-3 text-slate-200">${v.predicted_freight_rate_usd_per_ton?.toFixed(2)}/T</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">${v.total_freight_cost_usd?.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-400">${v.cross_check_charter_based_cost_usd?.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold">
                    {i === 0 ? (
                      <span className="text-emerald-400 font-sans font-bold">Optimal Choice</span>
                    ) : (
                      <span className="text-rose-400">+${v.cost_alpha_vs_baseline?.toLocaleString()}</span>
                    )}
                  </td>
                </tr>
              ))}

              {vesselRec.infeasible_vessels.map((v) => (
                <tr key={v.vessel_type} className="opacity-60 bg-rose-950/10">
                  <td className="py-3 px-3 font-sans font-bold text-slate-400">{v.vessel_type}</td>
                  <td className="py-3 px-3">
                    <span className="bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded font-sans font-bold text-[10px] border border-rose-500/30">
                      RESTRICTED
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500" colSpan={7}>
                    <span className="text-rose-300 font-sans text-xs">{v.infeasible_reason}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Bonus: Capesize Specification Drivers (Random Forest Regressor) */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Capesize Specification Driver Model (Random Forest Permutation Importance)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical drivers of daily charter hire rates ($/day) trained on 150 Capesize vessels
            </p>
          </div>
          <Badge variant="cyan" size="sm">RandomForest</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CAPESIZE_SPEC_DRIVERS} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} unit="%" tickFormatter={(v) => `${(v * 100).toFixed(0)}`} />
                <YAxis dataKey="feature" type="category" stroke="#64748b" tick={{ fontSize: 9 }} width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  formatter={(v: any) => [`${(Number(v) * 100).toFixed(1)}%`, 'Permutation Importance']}
                />
                <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {CAPESIZE_SPEC_DRIVERS.map((item) => (
              <div key={item.feature} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{item.feature}</span>
                  <span className="text-blue-400 font-mono">{(item.importance * 100).toFixed(1)}%</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
