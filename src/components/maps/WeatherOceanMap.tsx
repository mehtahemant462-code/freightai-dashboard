import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { CloudRain, Wind, AlertTriangle, ShieldCheck, Eye, Compass, Layers } from 'lucide-react';
import clsx from 'clsx';

export const WeatherOceanMap: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'wind' | 'waves' | 'cyclone'>('all');
  const [showReroute, setShowReroute] = useState(true);

  return (
    <GlassCard className="p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Indian Ocean & Bay of Bengal Metocean Satellite Overlay
            </h3>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30 font-semibold animate-pulse">
              Cyclone 04B Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            IMD & NOAA GFS High-Resolution Wave, Wind Vector & Storm Surge Simulation
          </p>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveLayer('all')}
            className={clsx(
              'px-2.5 py-1 text-xs rounded-lg font-medium transition-all',
              activeLayer === 'all'
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            )}
          >
            Composite
          </button>
          <button
            onClick={() => setActiveLayer('wind')}
            className={clsx(
              'px-2.5 py-1 text-xs rounded-lg font-medium transition-all',
              activeLayer === 'wind'
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            )}
          >
            Wind (38 km/h)
          </button>
          <button
            onClick={() => setActiveLayer('waves')}
            className={clsx(
              'px-2.5 py-1 text-xs rounded-lg font-medium transition-all',
              activeLayer === 'waves'
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            )}
          >
            Waves (2.8m)
          </button>
          <button
            onClick={() => setShowReroute(!showReroute)}
            className={clsx(
              'px-2.5 py-1 text-xs rounded-lg font-medium border transition-all flex items-center gap-1.5',
              showReroute
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Safe Waypoint</span>
          </button>
        </div>
      </div>

      {/* Map Canvas SVG */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-[#060B17] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 420"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Storm surge radial gradient */}
            <radialGradient id="cycloneSurge" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#F97316" stopOpacity="0.5" />
              <stop offset="65%" stopColor="#EAB308" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>

            {/* Ocean wave height gradient band */}
            <linearGradient id="oceanWaves" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#8B5CF6" stopOpacity="0.15" />
            </linearGradient>

            <pattern id="weather-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.5)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="100%" height="100%" fill="#060B17" />
          <rect width="100%" height="100%" fill="url(#oceanWaves)" />
          <rect width="100%" height="100%" fill="url(#weather-grid)" />

          {/* Landmass contours */}
          {/* India Subcontinent */}
          <path
            d="M 160 30 L 290 30 L 330 110 L 280 180 L 250 260 L 210 270 L 180 160 Z"
            fill="#101A2F"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Sri Lanka */}
          <path d="M 245 285 L 260 280 L 255 310 L 240 300 Z" fill="#101A2F" stroke="#1E293B" strokeWidth="1" />

          {/* Myanmar & Malacca Peninsula */}
          <path
            d="M 370 60 L 460 70 L 440 180 L 470 250 L 510 280 L 480 300 L 420 220 Z"
            fill="#101A2F"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Sumatra & Java */}
          <path
            d="M 430 260 L 570 310 L 600 330 L 580 350 L 460 310 Z"
            fill="#101A2F"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* NW Australia */}
          <path
            d="M 620 330 L 790 320 L 795 410 L 640 415 Z"
            fill="#101A2F"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Wind Streamlines & Vectors */}
          {(activeLayer === 'all' || activeLayer === 'wind') && (
            <g opacity="0.65">
              {/* Wind wave streaks in Indian ocean */}
              <path d="M 350 350 Q 300 320 280 270" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="5 5" className="animate-dash-flow" />
              <path d="M 400 360 Q 360 310 320 240" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="5 5" className="animate-dash-flow" />
              <path d="M 500 380 Q 430 330 380 230" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="5 5" className="animate-dash-flow" />
              <path d="M 600 360 Q 520 290 440 210" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="5 5" className="animate-dash-flow" />
            </g>
          )}

          {/* Wave Height Intensity Contours */}
          {(activeLayer === 'all' || activeLayer === 'waves') && (
            <g opacity="0.45">
              <ellipse cx="370" cy="180" rx="90" ry="60" fill="#3B82F6" opacity="0.15" />
              <ellipse cx="370" cy="180" rx="60" ry="40" fill="#6366F1" opacity="0.25" />
              <text x="340" y="210" fill="#93C5FD" fontSize="10" fontWeight="600">Swell: 2.8m - 3.4m</text>
            </g>
          )}

          {/* Cyclone 04B Track & Vortex */}
          {(activeLayer === 'all' || activeLayer === 'cyclone') && (
            <g>
              {/* Radial heat glow */}
              <circle cx="360" cy="150" r="75" fill="url(#cycloneSurge)" />
              
              {/* Cyclone Trajectory Cone */}
              <path
                d="M 410 200 L 360 150 L 300 110"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 430 210 L 375 145 L 305 95 L 295 125 L 345 155 Z"
                fill="rgba(239, 68, 68, 0.12)"
              />

              {/* Storm Center Eye Icon */}
              <circle cx="360" cy="150" r="14" fill="#EF4444" className="animate-ping-slow" opacity="0.8" />
              <circle cx="360" cy="150" r="8" fill="#FFFFFF" stroke="#EF4444" strokeWidth="3" />
              <text x="380" y="145" fill="#FCA5A5" fontSize="11" fontWeight="700">Depression 04B</text>
              <text x="380" y="158" fill="#FECACA" fontSize="9">Wind: 95 km/h • High Risk</text>
            </g>
          )}

          {/* Original Direct Route (passes near cyclone eye) */}
          <path
            d="M 680 340 L 490 280 L 380 180 L 285 110"
            fill="none"
            stroke="#EF4444"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            opacity={showReroute ? 0.4 : 0.9}
          />
          {!showReroute && (
            <text x="430" y="245" fill="#EF4444" fontSize="10" fontWeight="bold">Hazardous Direct Route</text>
          )}

          {/* Recommended AI Optimized Safe Sailing Route (diverts south of Nicobar) */}
          {showReroute && (
            <g>
              <path
                d="M 680 340 Q 520 300 420 260 Q 320 220 285 110"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="animate-dash-flow"
              />
              <path
                d="M 680 340 Q 520 300 420 260 Q 320 220 285 110"
                fill="none"
                stroke="#34D399"
                strokeWidth="1.5"
              />
              {/* Waypoint divergence marker */}
              <circle cx="420" cy="260" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="430" y="265" fill="#6EE7B7" fontSize="10" fontWeight="bold">AI Safe Deviation (+45 NM)</text>
            </g>
          )}

          {/* Origin & Destination Labels */}
          <g transform="translate(680, 340)">
            <circle cx="0" cy="0" r="7" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
            <text x="-120" y="4" fill="#93C5FD" fontSize="11" fontWeight="bold">Port Hedland, AU</text>
          </g>

          <g transform="translate(285, 110)">
            <circle cx="0" cy="0" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <text x="-95" y="-10" fill="#6EE7B7" fontSize="11" fontWeight="bold">Paradip Port, IN</text>
          </g>
        </svg>

        {/* Metocean Color Bar Legend */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-[11px] backdrop-blur-md shadow-xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wind & Swell Intensity</span>
          <div className="w-36 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-rose-500"></div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>Calm (&lt;1.5m)</span>
            <span>Mod (2.8m)</span>
            <span>Storm (&gt;4.5m)</span>
          </div>
        </div>

        {/* Departure Window Recommendation Float */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 text-xs backdrop-blur-md shadow-xl max-w-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Departure Guidance</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Optimal Departure: <span className="text-emerald-400 font-semibold font-mono">Day 4 06:00 UTC</span>.
            Bypassing cyclone 04B via South Nicobar corridor avoids 4.5m waves and reduces demurrage risk by 100%.
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
