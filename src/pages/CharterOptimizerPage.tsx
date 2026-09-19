import React, { useState, useMemo } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Ship, 
  DollarSign, 
  TrendingDown, 
  Clock, 
  RefreshCw, 
  FileDown,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import { recommendBooking, recommendVessel, forecastCharterRate, PORTS_DATABASE } from '../services/pipelineEngine';

export const CharterOptimizerPage: React.FC = () => {
  const [cargoType, setCargoType] = useState('Coking Coal');
  const [quantityMT, setQuantityMT] = useState<number>(75000);
  const [originPort, setOriginPort] = useState('Port_Hedland');
  const [destinationPort, setDestinationPort] = useState('Paradip');
  const [contractDuration, setContractDuration] = useState('Spot Voyage');
  const [vesselPreference, setVesselPreference] = useState('Panamax');
  const [bunkerPrice, setBunkerPrice] = useState<number>(620);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Live Pipeline 1 Calculation
  const bookingRec = useMemo(() => {
    return recommendBooking(originPort, destinationPort, vesselPreference, 8, 1.0, bunkerPrice);
  }, [originPort, destinationPort, vesselPreference, bunkerPrice]);

  // Live Pipeline 3 Calculation
  const vesselRec = useMemo(() => {
    return recommendVessel(originPort, destinationPort, quantityMT);
  }, [originPort, destinationPort, quantityMT]);

  // Live Pipeline 2 Charter Hire Rate
  const charterRec = useMemo(() => {
    return forecastCharterRate(vesselPreference, 4, bunkerPrice);
  }, [vesselPreference, bunkerPrice]);

  const spotRate = bookingRec.current_rate_usd_per_ton;
  const optimalRate = bookingRec.lowest_rate_usd_per_ton;
  const spotTotalCost = Math.round(quantityMT * spotRate);
  const optimalTotalCost = Math.round(quantityMT * optimalRate);
  const dollarSavings = Math.max(0, spotTotalCost - optimalTotalCost);
  const savingPct = spotTotalCost > 0 ? +((dollarSavings / spotTotalCost) * 100).toFixed(1) : 0;

  const handleRecalculate = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Charter Optimizer & Bulk Procurement Planner
            </h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
              Prescriptive AI Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate cargo parcel procurement variables and calculate the exact cost-minimizing fixture date.
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isOptimizing}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={clsx('w-3.5 h-3.5 text-blue-400', isOptimizing && 'animate-spin')} />
          <span>{isOptimizing ? 'Recalculating...' : 'Recalibrate Variables'}</span>
        </button>
      </div>

      {/* Large Green Recommendation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-blue-950/70 border border-emerald-500/50 backdrop-blur-xl shadow-glow-emerald flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                AI Optimization Verdict
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                High Confidence
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              {bookingRec.action === 'WAIT'
                ? `Book in Week ${bookingRec.best_week_ahead} to save ${savingPct}% freight cost.`
                : `Book Now — Spot rate ($${spotRate}/ton) is at optimal entry.`}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Locking charter on Week {bookingRec.best_week_ahead} yields an estimated <strong className="text-emerald-400 font-mono">${(dollarSavings / 1000).toFixed(0)},000 savings</strong> for {quantityMT.toLocaleString()} MT compared to immediate spot fixing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2">
            <span>Fix Allocation (Week {bookingRec.best_week_ahead})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Side Form and Right Side Recommendation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <GlassCard className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Cargo & Voyage Parameters</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Live ML Model Inputs</span>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Cargo Type
                  </label>
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Coking Coal">Coking Coal (Prime Hard Metallurgical)</option>
                    <option value="Thermal Coal">Thermal Coal (High Calorific 5500 GAR)</option>
                    <option value="Iron Ore">Iron Ore Fines (62% Fe Grade)</option>
                    <option value="Bauxite">Bauxite (Alumina Trihydrate)</option>
                    <option value="Limestone">Limestone (Blast Furnace Grade)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Quantity (Metric Tons)
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {quantityMT.toLocaleString()} MT
                    </span>
                  </div>
                  <input
                    type="range"
                    min={35000}
                    max={185000}
                    step={5000}
                    value={quantityMT}
                    onChange={(e) => setQuantityMT(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>35k MT (Handy)</span>
                    <span>75k MT (Panamax)</span>
                    <span>180k MT (Cape)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Origin Port (Loading)
                  </label>
                  <select
                    value={originPort}
                    onChange={(e) => setOriginPort(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Port_Hedland">Australia - Port Hedland (19.5m Draft, Deepwater)</option>
                    <option value="Australia_Newcastle">Australia - Newcastle (15.4m Draft, PWCS)</option>
                    <option value="Indonesia_Kalimantan">Indonesia - South Kalimantan (14.0m Draft)</option>
                    <option value="Mozambique_Nacala">Mozambique - Nacala (15.0m Draft)</option>
                    <option value="Richards_Bay">South Africa - Richards Bay RBCT (17.5m Draft)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Destination Port (Discharge)
                  </label>
                  <select
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Paradip">Paradip Port (14.5m Draft, 100k DWT)</option>
                    <option value="Visakhapatnam">Visakhapatnam Inner/Outer (14.5m Draft)</option>
                    <option value="Gangavaram">Gangavaram Deepwater (18.5m Draft, Capesize)</option>
                    <option value="Haldia">Haldia Dock (8.5m Draft, Handysize only)</option>
                    <option value="Gopalpur">Gopalpur Port (12.5m Draft, Supramax)</option>
                    <option value="Dhamra">Dhamra Deepwater (18.0m Draft, Capesize)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Vessel Preference
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Handysize', 'Supramax', 'Panamax', 'Capesize'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVesselPreference(v)}
                        className={clsx(
                          'py-1.5 px-1 text-[11px] font-semibold rounded-lg border text-center transition-all',
                          vesselPreference === v
                            ? 'bg-blue-600 text-white border-blue-500 shadow-glow-blue'
                            : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:text-white'
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>VLSFO Bunker Fuel Price ($/ton)</span>
                    <span className="font-mono text-cyan-400 font-bold">${bunkerPrice}</span>
                  </div>
                  <input
                    type="range"
                    min={450}
                    max={850}
                    step={10}
                    value={bunkerPrice}
                    onChange={(e) => setBunkerPrice(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800">
              <button
                onClick={handleRecalculate}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow-blue flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Prescriptive Optimization</span>
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-7">
          <GlassCard glow="emerald" className="p-5 h-full flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#0C1527] to-slate-900">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      AI Charter Recommendation Card
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Synthesized from 4 serialized pipelines: Freight HGBR, Charter Ridge, Berth Constraints & Idle Risks.
                  </p>
                </div>
                <Badge variant="emerald" size="md" pulse dot>
                  Optimized Result
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase text-[10px] tracking-wider">Best Booking Window</span>
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-mono">
                    Week {bookingRec.best_week_ahead} ({bookingRec.short_term_forecast[bookingRec.best_week_ahead - 1]?.date})
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
                    Expected Market Rate Trough (${optimalRate}/ton)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase text-[10px] tracking-wider">Recommended Vessel</span>
                    <Ship className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-mono">
                    {vesselRec.feasible_vessel_types_ranked_by_cost[0]?.vessel_type || vesselPreference}
                  </div>
                  <span className="text-[11px] text-cyan-400 font-medium block mt-0.5">
                    {vesselRec.feasible_vessel_types_ranked_by_cost[0]?.utilization_pct || 100}% Capacity Utilization
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase text-[10px] tracking-wider">Estimated Freight Outlay</span>
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-mono">
                    ${(optimalTotalCost / 1000000).toFixed(2)}M
                    <span className="text-xs text-slate-400 font-normal ml-1">(${optimalRate}/T)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    vs ${(spotTotalCost / 1000000).toFixed(2)}M spot today (${spotRate}/T)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <span className="font-semibold uppercase text-[10px] tracking-wider">Projected Savings</span>
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-extrabold text-emerald-400 mt-1 font-mono">
                    {savingPct.toFixed(1)}% (${(dollarSavings / 1000).toFixed(0)}k Saved)
                  </div>
                  <span className="text-[11px] text-emerald-300/80 block mt-0.5">
                    Net cash savings on single shipment parcel
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Sailing & Transit Duration:</span>
                    <span className="text-slate-400">
                      {vesselRec.feasible_vessel_types_ranked_by_cost[0]?.total_voyage_days_per_trip || 14.5} Days Total Voyage Cycle
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-blue-400 font-mono font-bold block">
                    ${charterRec.current_rate_usd_per_day.toLocaleString()}/day
                  </span>
                  <span className="text-[10px] text-slate-400">Time Charter Cross-Check</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Comparative Fixture Scenario Ledger:
                </span>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/80 text-slate-400 font-medium text-[11px]">
                      <tr>
                        <th className="p-2.5">Strategy</th>
                        <th className="p-2.5">Fixture Rate</th>
                        <th className="p-2.5">Total Outlay</th>
                        <th className="p-2.5">Savings Alpha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      <tr className="bg-slate-900/40 text-slate-300">
                        <td className="p-2.5 font-sans">Book Today (Spot)</td>
                        <td className="p-2.5 text-rose-400">${spotRate.toFixed(2)}/T</td>
                        <td className="p-2.5">${spotTotalCost.toLocaleString()}</td>
                        <td className="p-2.5 text-slate-400">Baseline ($0)</td>
                      </tr>
                      <tr className="bg-emerald-500/10 text-white font-semibold">
                        <td className="p-2.5 font-sans flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>AI Recommendation (Week {bookingRec.best_week_ahead})</span>
                        </td>
                        <td className="p-2.5 text-emerald-400">${optimalRate.toFixed(2)}/T</td>
                        <td className="p-2.5 text-emerald-400">${optimalTotalCost.toLocaleString()}</td>
                        <td className="p-2.5 text-emerald-400 font-bold">+${dollarSavings.toLocaleString()} ({savingPct}%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button 
                onClick={() => window.print()}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Charter Party Specs</span>
              </button>
              <button className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald flex items-center gap-2 transition-all">
                <span>Lock Fixture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
