import React, { useState } from 'react';
import { KpiCard } from '../components/common/KpiCard';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { FreightTrendChart } from '../components/charts/FreightTrendChart';
import { ShippingRouteMap } from '../components/maps/ShippingRouteMap';
import { KPI_SUMMARY, RISK_ALERTS } from '../data/mockData';
import { NavTab } from '../types';
import { 
  DollarSign, 
  CalendarCheck, 
  Ship, 
  Percent, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal,
  CheckCircle2,
  Anchor,
  Clock,
  RefreshCw,
  Layers,
  Scale,
  Cpu
} from 'lucide-react';
import clsx from 'clsx';

interface DashboardPageProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  // Interactive Cargo & Voyage Parameters (State directly driven by user input form)
  const [cargoType, setCargoType] = useState('Coking Coal (Prime Hard Metallurgical)');
  const [quantityMT, setQuantityMT] = useState<number>(75000);
  const [originPort, setOriginPort] = useState('Port Hedland, Australia (Deepwater Ore/Coal)');
  const [destinationPort, setDestinationPort] = useState('Paradip Port, India (Mechanized Coal Berth)');
  const [contractDuration, setContractDuration] = useState('Single Spot Voyage Charter');
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Dynamic AI Cost & Savings Calculation
  const spotRate = 18.20;
  const optimalRate = 15.28;
  const totalSpotCost = quantityMT * spotRate;
  const totalOptimalCost = quantityMT * optimalRate;
  const netSavingsDollar = totalSpotCost - totalOptimalCost;
  const savingsPct = 16.04;

  // Determine optimal vessel dynamically from parcel size
  const optimalVessel = quantityMT <= 60000 
    ? { name: 'Supramax', dwt: '58,000 DWT', draft: '13.3m', clearance: '100% Fit' }
    : quantityMT <= 100000
    ? { name: 'Panamax', dwt: '82,000 DWT', draft: '14.5m', clearance: '100% Inner Harbor Fit' }
    : { name: 'Capesize', dwt: '180,000 DWT', draft: '18.2m', clearance: 'Draft Restricted (Lightering Req.)' };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityMT(Number(e.target.value));
  };

  const handleRecalibrate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 450);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner with SIH Context & Dynamic Route Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-slate-900/70 border border-blue-500/30 backdrop-blur-xl shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              SIH 2026 Innovation Challenge
            </span>
            <span className="text-[11px] text-slate-400">
              Consolidated Coal-Shipping Analytics Pipeline
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Intelligent Freight Forecasting & Operations Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Corridor: <span className="font-semibold text-blue-400 font-mono">{originPort.split(' (')[0]} → {destinationPort.split(' (')[0]}</span> • Parcel: {cargoType.split(' (')[0]} ({quantityMT.toLocaleString()} MT)
          </p>

          {/* 4 Core Pipeline Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] font-mono">
            <span className="bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
              P1: Freight Spot HGBR
            </span>
            <span className="bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              P2: Charter Ridge ($/Day)
            </span>
            <span className="bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
              P3: Berth Constraints & Ranker
            </span>
            <span className="bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
              P4: Idle-Risk Demurrage Radar
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('pipelines')}
            className="px-3.5 py-2 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-glow-blue flex items-center gap-2 transition-all"
          >
            <Cpu className="w-4 h-4 text-indigo-300" />
            <span>ML Pipeline Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('optimizer')}
            className="px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-glow-emerald flex items-center gap-2 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Charter Optimizer</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (Live updated based on Cargo Parameters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          title="Current Freight Rate"
          value={`$${KPI_SUMMARY.currentRate.toFixed(1)}`}
          unit="/Ton"
          icon={DollarSign}
          accentColor="blue"
          change={{
            value: `${KPI_SUMMARY.rateChange24h}%`,
            positive: true,
            label: 'vs 7d avg',
          }}
          badge={{
            text: 'Spot Benchmark',
            variant: 'blue',
          }}
        />

        <KpiCard
          title="Best Charter Day"
          value={KPI_SUMMARY.bestCharterDay}
          subtitle={`Target: $${KPI_SUMMARY.targetRate}/Ton`}
          icon={CalendarCheck}
          accentColor="emerald"
          badge={{
            text: 'Trough Window',
            variant: 'emerald',
          }}
        />

        <KpiCard
          title="Recommended Vessel"
          value={optimalVessel.name}
          subtitle={`${optimalVessel.dwt} • ${optimalVessel.draft}`}
          icon={Ship}
          accentColor="cyan"
          badge={{
            text: optimalVessel.name === 'Panamax' ? 'Optimal Fit' : 'Alternative',
            variant: optimalVessel.name === 'Panamax' ? 'cyan' : 'amber',
          }}
        />

        <KpiCard
          title="Estimated Savings"
          value={`${savingsPct.toFixed(0)}%`}
          subtitle={`~$${(netSavingsDollar / 1000).toFixed(0)}k Projected Savings`}
          icon={Percent}
          accentColor="emerald"
          change={{
            value: `+$${(netSavingsDollar / 1000).toFixed(0)}k`,
            positive: true,
            label: 'Net Cost Alpha',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* NEW: CARGO & VOYAGE PARAMETERS SIMULATOR SECTION EMBEDDED IN DASHBOARD    */}
      {/* Matches user's exact uploaded component & UI screenshot                  */}
      {/* ========================================================================= */}
      {/* Cargo & Voyage Parameters Simulator Section (Full Width matching user specification) */}
      <div className="w-full">
        <GlassCard glow="blue" className="p-5 sm:p-6 bg-slate-900/90 border-slate-700/80">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Cargo & Voyage Parameters Simulator
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono uppercase">
                  Live Inputs
                </span>
                <button
                  onClick={handleRecalibrate}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  title="Recalibrate"
                >
                  <RefreshCw className={clsx('w-3.5 h-3.5', isRecalculating && 'animate-spin text-blue-400')} />
                </button>
              </div>
            </div>

            {/* Form Controls exactly matching the image */}
            <div className="space-y-4">
              
              {/* 1. Cargo Type */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Cargo Type
                </label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full bg-[#0E172A] border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                >
                  <option value="Coking Coal (Prime Hard Metallurgical)">Coking Coal (Prime Hard Metallurgical)</option>
                  <option value="Thermal Coal (High Calorific 5500 GAR)">Thermal Coal (High Calorific 5500 GAR)</option>
                  <option value="Iron Ore Fines (62% Fe Grade)">Iron Ore Fines (62% Fe Grade)</option>
                  <option value="Bauxite (Alumina Trihydrate)">Bauxite (Alumina Trihydrate)</option>
                  <option value="Limestone (Blast Furnace Grade)">Limestone (Blast Furnace Grade)</option>
                </select>
              </div>

              {/* 2. Quantity (Metric Tons) with Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Quantity (Metric Tons)
                  </label>
                  <span className="text-sm font-mono font-bold text-blue-400">
                    {quantityMT.toLocaleString()} MT
                  </span>
                </div>
                
                {/* Slider Control */}
                <input
                  type="range"
                  min={35000}
                  max={180000}
                  step={5000}
                  value={quantityMT}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all"
                />

                {/* Tick Labels */}
                <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span className={clsx(quantityMT <= 55000 && 'text-cyan-400 font-bold')}>
                    40,000 MT (Supramax)
                  </span>
                  <span className={clsx(quantityMT > 55000 && quantityMT <= 100000 && 'text-blue-400 font-bold')}>
                    75,000 MT (Panamax)
                  </span>
                  <span className={clsx(quantityMT > 100000 && 'text-amber-400 font-bold')}>
                    180,000 MT (Capesize)
                  </span>
                </div>
              </div>

              {/* 3. Origin Port (Loading) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Origin Port (Loading)
                </label>
                <select
                  value={originPort}
                  onChange={(e) => setOriginPort(e.target.value)}
                  className="w-full bg-[#0E172A] border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                >
                  <option value="Port Hedland, Australia (Deepwater Ore/Coal)">Port Hedland, Australia (Deepwater Ore/Coal)</option>
                  <option value="Newcastle, Australia (PWCS Coal Terminals)">Newcastle, Australia (PWCS Coal Terminals)</option>
                  <option value="Dampier, Australia (Bulk Terminal)">Dampier, Australia (Bulk Terminal)</option>
                  <option value="Richards Bay, South Africa (Coal Terminal)">Richards Bay, South Africa (Coal Terminal)</option>
                  <option value="Samarinda Anchorage, Indonesia (Barge Transshipment)">Samarinda Anchorage, Indonesia (Barge Transshipment)</option>
                </select>
              </div>

              {/* 4. Destination Port (Discharge) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Destination Port (Discharge)
                </label>
                <select
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  className="w-full bg-[#0E172A] border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                >
                  <option value="Paradip Port, India (Mechanized Coal Berth)">Paradip Port, India (Mechanized Coal Berth)</option>
                  <option value="Visakhapatnam (Vizag), India (Inner Basin)">Visakhapatnam (Vizag), India (Inner Basin)</option>
                  <option value="Haldia Dock Complex, India (Finger Jetty)">Haldia Dock Complex, India (Finger Jetty)</option>
                  <option value="Gangavaram Port, India (Deepwater Berth)">Gangavaram Port, India (Deepwater Berth)</option>
                  <option value="Dhamra Port, India (Bulk Handling Complex)">Dhamra Port, India (Bulk Handling Complex)</option>
                </select>
              </div>

              {/* 5. Contract Duration / Structure */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Contract Duration / Structure
                </label>
                <select
                  value={contractDuration}
                  onChange={(e) => setContractDuration(e.target.value)}
                  className="w-full bg-[#0E172A] border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                >
                  <option value="Single Spot Voyage Charter">Single Spot Voyage Charter</option>
                  <option value="3-Month Consecutive Time Charter">3-Month Consecutive Time Charter</option>
                  <option value="6-Month Contract of Affreightment (COA)">6-Month Contract of Affreightment (COA)</option>
                  <option value="1-Year Long-Term Volume Commitment">1-Year Long-Term Volume Commitment</option>
                </select>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active Voyage Simulation Engine</span>
            </span>
            <span className="font-mono text-slate-300">Transit: ~14.5 Days (4,150 NM)</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Row: 30-Day Freight Trend & AI Insight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Large Line Chart: 30-Day Freight Trend */}
        <div className="lg:col-span-8">
          <GlassCard className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      30-Day Freight Trend & AI Predictive Horizon
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Historical spot rate vs ensemble forecast with 95% Confidence Interval
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2.5 h-0.5 bg-blue-500 inline-block"></span>
                    <span>Historical</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-2.5 h-0.5 bg-cyan-400 inline-block border-dashed"></span>
                    <span>AI Forecast</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    <span>Day 15 Trough</span>
                  </span>
                </div>
              </div>

              <FreightTrendChart height={300} />
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>Confidence Level: <strong className="text-cyan-400 font-mono">91.4% (94.8% Accuracy)</strong></span>
              </div>
              <button
                onClick={() => onNavigateTab('forecast')}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Deep Multi-Horizon Forecast Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right side AI Insight Card */}
        <div className="lg:col-span-4">
          <GlassCard glow="blue" className="p-5 h-full flex flex-col justify-between bg-gradient-to-b from-slate-900/90 to-blue-950/40">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-blue-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">AI Chartering Intelligence</h4>
                </div>
                <Badge variant="emerald" size="sm" pulse dot>
                  Live Guidance
                </Badge>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                  Strategic Recommendation
                </div>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  "Freight expected to decrease over the next 15 days."
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Supply easing in Southeast Asia combined with localized coal stockpiling at Chinese hubs indicates a rate trough at <strong className="text-emerald-400 font-mono">$15.28/Ton on Day 15</strong>.
                </p>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Current Booking (Today):</span>
                  <span className="font-mono text-slate-300 font-semibold">${spotRate.toFixed(2)} / Ton (${(totalSpotCost / 1000000).toFixed(2)}M)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">AI Target Booking (Day 15):</span>
                  <span className="font-mono text-emerald-400 font-bold">${optimalRate.toFixed(2)} / Ton (${(totalOptimalCost / 1000000).toFixed(2)}M)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Total Net Cost Saving:</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">+${(netSavingsDollar / 1000).toFixed(0)}k (16.0%)</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Recommended Hull:</span>
                  <span className="font-mono text-cyan-400 font-bold">{optimalVessel.name} ({optimalVessel.dwt})</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3">
              <button
                onClick={() => onNavigateTab('strategy')}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald flex items-center justify-center gap-2 transition-all"
              >
                <span>Structure Contract Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Middle Row: Shipping Route Small World Map (Australia -> Paradip) */}
      <div className="w-full">
        <ShippingRouteMap />
      </div>

      {/* Bottom Row: Recent Alerts Section with Colored Alert Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Operational Risk & Maritime Anomaly Alerts
            </h3>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
              3 Active Bottlenecks
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('risks')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>View All Anomalies</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Vizag Port Congestion */}
          <GlassCard glow="amber" className="p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping-slow"></span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Port Congestion Alert
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">28m ago</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-2">Vizag Port Berth Congestion</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Mechanized berth 1 & 2 conveyor maintenance creating 48h wait time. 11 bulkers currently queued at outer anchorage.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Action: Divert to Paradip</span>
              <span className="font-bold text-amber-400 font-mono">Avoid $52k Demurrage</span>
            </div>
          </GlassCard>

          {/* Card 2: Cyclone Risk */}
          <GlassCard glow="rose" className="p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping-slow"></span>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Metocean Storm Alert
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">1h ago</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-2">Bay of Bengal Cyclone Risk</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Tropical Depression 04B intensifying. Sustained wind 95 km/h, wave heights 4.8m near Andaman corridor.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Action: Deviate South 45 NM</span>
              <span className="font-bold text-rose-400 font-mono">Window: Day 4</span>
            </div>
          </GlassCard>

          {/* Card 3: Market Volatility */}
          <GlassCard glow="amber" className="p-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping-slow"></span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Financial Volatility Alert
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">3h ago</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-2">Baltic Dry Index Volatility</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Panamax 4TC index spiked +142 points following short-covering by Chinese power generation procurers.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Action: Lock Forward COA</span>
              <span className="font-bold text-emerald-400 font-mono">Hedge Spot Rally</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
