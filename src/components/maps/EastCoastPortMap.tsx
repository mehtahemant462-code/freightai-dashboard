import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { PortData } from '../../types';
import { EAST_COAST_PORTS } from '../../data/mockData';
import { Anchor, AlertCircle, CheckCircle2, Clock, Layers } from 'lucide-react';
import clsx from 'clsx';

interface EastCoastPortMapProps {
  selectedPortId?: string;
  onSelectPort?: (port: PortData) => void;
}

export const EastCoastPortMap: React.FC<EastCoastPortMapProps> = ({
  selectedPortId,
  onSelectPort,
}) => {
  const [hoveredPort, setHoveredPort] = useState<PortData | null>(null);

  const getStatusColor = (status: PortData['congestionStatus']) => {
    switch (status) {
      case 'normal':
        return { fill: '#10B981', ring: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400', label: 'Normal (<24h)' };
      case 'moderate':
        return { fill: '#F59E0B', ring: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400', label: 'Moderate (24-48h)' };
      case 'critical':
        return { fill: '#EF4444', ring: 'rgba(239, 68, 68, 0.4)', text: 'text-rose-400', label: 'Congested (>48h)' };
    }
  };

  return (
    <GlassCard className="p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Anchor className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              India East Coast Maritime Terminals
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              6 Strategic Bulk Ports
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any port pin to view draft limits, berth queues, and vessel compatibility.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-300">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-300">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span className="text-slate-300">Congested</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive SVG Coastline */}
        <div className="lg:col-span-8 relative h-[360px] sm:h-[400px] bg-[#070D1B] rounded-xl border border-slate-800 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="200 60 300 320"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="port-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(51, 65, 85, 0.1)" strokeWidth="0.5" />
              </pattern>
              {/* Bathymetry depth shading */}
              <linearGradient id="depthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="100%" stopColor="#070D1B" />
              </linearGradient>
            </defs>

            {/* Ocean background */}
            <rect x="0" y="0" width="600" height="500" fill="url(#depthGradient)" />
            <rect x="0" y="0" width="600" height="500" fill="url(#port-grid)" />

            {/* India East Coast Geographical Path (West Bengal -> Odisha -> Andhra Pradesh) */}
            <path
              d="
                M 180 60
                L 440 60
                L 440 90
                L 420 110
                L 405 145
                L 380 190
                L 345 250
                L 310 310
                L 300 335
                L 260 380
                L 180 380
                Z
              "
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Depth contours (shelf lines) */}
            <path
              d="M 445 110 Q 405 210 320 330"
              fill="none"
              stroke="rgba(37, 99, 235, 0.2)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <path
              d="M 470 120 Q 425 220 340 345"
              fill="none"
              stroke="rgba(37, 99, 235, 0.15)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x="440" y="240" fill="rgba(148, 163, 184, 0.4)" fontSize="10" transform="rotate(65 440 240)">
              Bay of Bengal Deepwater Basin
            </text>

            {/* Maritime Sea Lanes */}
            <path
              d="M 480 360 L 380 190"
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 480 360 L 310 310"
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Render East Coast Port Pins */}
            {EAST_COAST_PORTS.map((port) => {
              const status = getStatusColor(port.congestionStatus);
              const isSelected = selectedPortId === port.id;
              const isHovered = hoveredPort?.id === port.id;

              return (
                <g
                  key={port.id}
                  transform={`translate(${port.coordinates.x}, ${port.coordinates.y})`}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPort(port)}
                  onMouseLeave={() => setHoveredPort(null)}
                  onClick={() => onSelectPort && onSelectPort(port)}
                >
                  {/* Outer pulse ring for selected or critical ports */}
                  {(isSelected || port.congestionStatus === 'critical') && (
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill={status.ring}
                      className="animate-ping-slow"
                    />
                  )}

                  {/* Highlight halo on hover/select */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="2"
                    />
                  )}

                  {/* Center pin circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "8" : "6.5"}
                    fill={status.fill}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="drop-shadow-lg"
                  />

                  {/* Port Label */}
                  <text
                    x="12"
                    y="4"
                    fill={isSelected ? '#60A5FA' : '#F1F5F9'}
                    fontSize="10.5"
                    fontWeight={isSelected ? 'bold' : '600'}
                    className="select-none filter drop-shadow-md"
                  >
                    {port.name}
                  </text>
                  <text
                    x="12"
                    y="15"
                    fill="#94A3B8"
                    fontSize="8.5"
                    fontWeight="500"
                    className="select-none"
                  >
                    Draft: {port.draft}m • Wait: {port.waitTimeHours}h
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Controls / Compass Indicator */}
          <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-400 backdrop-blur-md">
            <span>East Coast Nautical Grid (WGS84)</span>
          </div>
        </div>

        {/* Port Quick Specification Card */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {(() => {
            const active = hoveredPort || EAST_COAST_PORTS.find(p => p.id === selectedPortId) || EAST_COAST_PORTS[0];
            const status = getStatusColor(active.congestionStatus);

            return (
              <div className="h-full flex flex-col justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                        Selected Terminal
                      </span>
                      <h4 className="text-lg font-bold text-white mt-0.5">{active.name}</h4>
                      <p className="text-xs text-slate-400">{active.state}, India</p>
                    </div>
                    <span
                      className={clsx(
                        'px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-tight border',
                        active.congestionStatus === 'normal' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                        active.congestionStatus === 'moderate' && 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                        active.congestionStatus === 'critical' && 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      )}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Technical Specs List */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400 text-[10px] block">MAX DRAFT</span>
                      <span className="font-bold text-white text-sm font-mono">{active.draft} m</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Chart Datum</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400 text-[10px] block">MAX LOA</span>
                      <span className="font-bold text-white text-sm font-mono">{active.loa} m</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Length Overall</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400 text-[10px] block">BEAM LIMIT</span>
                      <span className="font-bold text-white text-sm font-mono">{active.beamLimit} m</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Channel Width</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400 text-[10px] block">ANNUAL CAPACITY</span>
                      <span className="font-bold text-white text-sm font-mono">{active.capacity} MTPA</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Handling Vol</span>
                    </div>
                  </div>

                  {/* Berthing & Anchorage Queue */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>Average Wait Time:</span>
                      </span>
                      <span className="font-mono font-bold text-white">{active.waitTimeHours} hrs</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Vessels in Outer Anchorage:</span>
                      <span className="font-mono font-bold text-amber-400">{active.vesselsAtAnchorage} ships</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Active Berths Occupied:</span>
                      <span className="font-mono font-bold text-slate-200">{active.vesselsAtBerth} berths</span>
                    </div>
                  </div>

                  {/* Primary Commodities */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Main Handled Bulk Commodities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {active.majorCargo.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button 
                    onClick={() => onSelectPort && onSelectPort(active)}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-glow-blue transition-all"
                  >
                    Select {active.name} for Optimizer
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </GlassCard>
  );
};
