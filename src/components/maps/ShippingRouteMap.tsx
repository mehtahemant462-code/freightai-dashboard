import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Ship, Navigation, Anchor, Compass, Info, Wind, Waves } from 'lucide-react';
import clsx from 'clsx';

export const ShippingRouteMap: React.FC = () => {
  const [activeWaypoint, setActiveWaypoint] = useState<string | null>(null);

  // SVG dimensions: 700 x 360
  // Australia Port Hedland: ~ (560, 290)
  // Sunda / Lombok Strait: ~ (450, 220)
  // Nicobar / Malacca West: ~ (320, 160)
  // Paradip Port (India East Coast): ~ (220, 95)
  // Curved route path

  return (
    <GlassCard className="p-5 overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Strategic Shipping Corridor
            </h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
              Live AIS Tracking
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Australia (Port Hedland) → India (Paradip Port) • Distance: 4,150 NM • Avg Speed: 13.5 kts
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>Origin / Dest</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping-slow"></span>
            <span>Active Vessel</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual */}
      <div className="relative w-full h-[260px] sm:h-[300px] bg-[#070D1B] rounded-xl border border-slate-800 overflow-hidden shadow-inner">
        {/* Ocean Grid & Latitude/Longitude lines */}
        <svg
          className="w-full h-full"
          viewBox="0 0 700 340"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="ocean-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(51, 65, 85, 0.15)" strokeWidth="1" />
            </pattern>

            {/* Linear route gradient */}
            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Vessel glow filter */}
            <filter id="vessel-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="#070D1B" />
          <rect width="100%" height="100%" fill="url(#ocean-grid)" />

          {/* Abstract stylized landmass contours */}
          {/* India Subcontinent */}
          <path
            d="M 120 10 L 230 10 L 260 80 L 220 120 L 190 200 L 160 210 L 140 140 Z"
            fill="#131C31"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Bay of Bengal waters outline */}
          {/* Myanmar & SE Asia */}
          <path
            d="M 280 40 L 370 60 L 360 140 L 380 200 L 420 220 L 400 240 L 340 180 Z"
            fill="#131C31"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Indonesia / Sumatra / Java Islands */}
          <path
            d="M 330 200 L 460 230 L 490 250 L 470 260 L 370 230 Z"
            fill="#131C31"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Australia North-West Coast */}
          <path
            d="M 500 260 L 680 250 L 690 330 L 520 335 Z"
            fill="#131C31"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Weather disturbance zone (Bay of Bengal) */}
          <circle cx="270" cy="130" r="45" fill="rgba(239, 68, 68, 0.08)" stroke="rgba(239, 68, 68, 0.3)" strokeDasharray="3 3" />
          <text x="240" y="132" fill="#F87171" fontSize="9" fontWeight="600" opacity="0.85">Cyclone Alert Zone</text>

          {/* Shipping Route Curved Corridor */}
          {/* Origin Australia (570, 275) -> Sunda passage (420, 220) -> Nicobar corridor (320, 160) -> Paradip (215, 100) */}
          <path
            d="M 570 275 C 470 240, 390 210, 320 160 C 270 125, 235 110, 215 100"
            fill="none"
            stroke="rgba(59, 130, 246, 0.25)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 570 275 C 470 240, 390 210, 320 160 C 270 125, 235 110, 215 100"
            fill="none"
            stroke="url(#route-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-dash-flow"
          />

          {/* Active Vessel Indicator midway at (335, 168) */}
          <g transform="translate(335, 168)" filter="url(#vessel-glow)">
            <circle cx="0" cy="0" r="16" fill="rgba(16, 185, 129, 0.2)" className="animate-ping-slow" />
            <circle cx="0" cy="0" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            {/* Small ship direction heading pointer */}
            <line x1="0" y1="0" x2="-10" y2="-7" stroke="#34D399" strokeWidth="2" />
          </g>

          {/* Destination: Paradip Port (215, 100) */}
          <g 
            transform="translate(215, 100)" 
            className="cursor-pointer"
            onClick={() => setActiveWaypoint('paradip')}
          >
            <circle cx="0" cy="0" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <text x="-15" y="-14" fill="#60A5FA" fontSize="11" fontWeight="700">Paradip Port (Dest)</text>
            <text x="-15" y="19" fill="#94A3B8" fontSize="9" fontWeight="500">Draft: 14.5m • Ready</text>
          </g>

          {/* Origin: Port Hedland (570, 275) */}
          <g 
            transform="translate(570, 275)" 
            className="cursor-pointer"
            onClick={() => setActiveWaypoint('hedland')}
          >
            <circle cx="0" cy="0" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <text x="-110" y="-12" fill="#60A5FA" fontSize="11" fontWeight="700">Port Hedland (Origin)</text>
            <text x="-110" y="5" fill="#94A3B8" fontSize="9" fontWeight="500">Loading Terminal 4</text>
          </g>

          {/* Intermediate Waypoint: Sunda Trench */}
          <g 
            transform="translate(420, 220)" 
            className="cursor-pointer"
            onClick={() => setActiveWaypoint('sunda')}
          >
            <circle cx="0" cy="0" r="4" fill="#06B6D4" />
            <text x="10" y="4" fill="#67E8F9" fontSize="9">WP2: Sunda Strait</text>
          </g>

          {/* Intermediate Waypoint: Nicobar South */}
          <g 
            transform="translate(320, 160)" 
            className="cursor-pointer"
            onClick={() => setActiveWaypoint('nicobar')}
          >
            <circle cx="0" cy="0" r="4" fill="#06B6D4" />
            <text x="10" y="4" fill="#67E8F9" fontSize="9">WP3: Nicobar Passage</text>
          </g>
        </svg>

        {/* Live Ship Telemetry Overlay Card */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 backdrop-blur-md shadow-xl text-xs max-w-xs">
          <div className="flex items-center justify-between gap-4 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">MV Ocean Pioneer</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Underway
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px]">
            <div>
              <span className="text-slate-400">Class:</span> <span className="text-slate-200 font-mono">Panamax</span>
            </div>
            <div>
              <span className="text-slate-400">Speed:</span> <span className="text-slate-200 font-mono">13.6 kts</span>
            </div>
            <div>
              <span className="text-slate-400">Heading:</span> <span className="text-slate-200 font-mono">315° NW</span>
            </div>
            <div>
              <span className="text-slate-400">Cargo:</span> <span className="text-slate-200 font-mono">75,000 MT</span>
            </div>
            <div className="col-span-2 pt-1 text-[10px] text-blue-400 flex items-center justify-between border-t border-slate-800/80 mt-1">
              <span>ETA Paradip: 6d 14h</span>
              <span className="text-slate-400">Rem: 1,840 NM</span>
            </div>
          </div>
        </div>

        {/* Waypoint Click Popover */}
        {activeWaypoint && (
          <div className="absolute top-3 right-3 bg-slate-900/95 border border-blue-500/40 rounded-xl p-3 backdrop-blur-xl shadow-2xl text-xs max-w-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 uppercase text-[10px]">Waypoint Details</span>
              <button onClick={() => setActiveWaypoint(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-slate-300 mt-1">
              {activeWaypoint === 'paradip' && 'Destination: Paradip Outer Anchorage. Channel depth maintained at 14.5m CD. Zero wait-time forecast for Day 15.'}
              {activeWaypoint === 'hedland' && 'Origin: Port Hedland Utah Point bulk terminal. Coking coal loaded at 8,200 MT/hour average berth rate.'}
              {activeWaypoint === 'sunda' && 'Transit Point: Sunda Deepwater Strait. Current swell 1.8m, wind 16 kts. Safe clearance verified.'}
              {activeWaypoint === 'nicobar' && 'AI Reroute Point: Heading altered 45 NM south to bypass tropical depression 04B peak wind bands.'}
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
