import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { KpiCard } from '../components/common/KpiCard';
import { WeatherOceanMap } from '../components/maps/WeatherOceanMap';
import { WEATHER_DATA, HOURLY_WEATHER_SERIES, SEVEN_DAY_FORECAST } from '../data/mockData';
import { 
  Waves, 
  Wind, 
  Thermometer, 
  Eye, 
  Calendar, 
  Compass
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import clsx from 'clsx';

export const WeatherIntelligencePage: React.FC = () => {
  const [route, setRoute] = useState('Australia (Port Hedland) → India (Paradip)');
  const [dateRange, setDateRange] = useState('Next 7 Days');
  const [selectedForecastTab, setSelectedForecastTab] = useState<'wind' | 'waves' | 'rain'>('wind');

  return (
    <div className="space-y-6 pb-8">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-blue-950/60 border border-cyan-500/30 backdrop-blur-xl shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
              Metocean Analytics Engine
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping-slow"></span>
              Live Weather Feed: NOAA GFS & IMD INSAT-3D
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Weather Intelligence & Oceanic Voyage Safeguard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Dynamic sea-state modeling, cyclone trajectory prediction, and AI-driven weather routing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
            <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Australia (Port Hedland) → India (Paradip)" className="bg-slate-900">
                Australia (Port Hedland) → Paradip
              </option>
              <option value="Australia (Newcastle) → India (Vizag)" className="bg-slate-900">
                Australia (Newcastle) → Vizag
              </option>
              <option value="Indonesia (Samarinda) → India (Haldia)" className="bg-slate-900">
                Indonesia → Haldia
              </option>
            </select>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Next 7 Days" className="bg-slate-900">Next 7 Days</option>
              <option value="Next 14 Days" className="bg-slate-900">Next 14 Days</option>
              <option value="Voyage Transit (16 Days)" className="bg-slate-900">Full Transit (16 Days)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          title="Wave Height"
          value={`${WEATHER_DATA.waveHeight.toFixed(1)}`}
          unit="m"
          subtitle="Moderate Swell • SSW (205°)"
          icon={Waves}
          accentColor="cyan"
          badge={{
            text: 'Beaufort 5',
            variant: 'cyan',
          }}
        />

        <KpiCard
          title="Wind Speed"
          value={`${WEATHER_DATA.windSpeed}`}
          unit="km/h"
          subtitle="20.5 Knots • Fresh Breeze"
          icon={Wind}
          accentColor="blue"
          badge={{
            text: 'Gusts 48 km/h',
            variant: 'blue',
          }}
        />

        <KpiCard
          title="Sea Temperature"
          value={`${WEATHER_DATA.seaTemperature.toFixed(0)}`}
          unit="°C"
          subtitle="Tropical Warm Pool Threshold"
          icon={Thermometer}
          accentColor="amber"
          badge={{
            text: 'Cyclone Favorable',
            variant: 'amber',
          }}
        />

        <KpiCard
          title="Navigational Visibility"
          value={`${WEATHER_DATA.visibility.toFixed(0)}`}
          unit="km"
          subtitle="Clear Horizonal Sightline"
          icon={Eye}
          accentColor="emerald"
          badge={{
            text: 'Good Clarity',
            variant: 'emerald',
          }}
        />
      </div>

      {/* Main Visualization: WeatherOceanMap */}
      <div className="w-full">
        <WeatherOceanMap />
      </div>

      {/* Forecast Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <GlassCard className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    7-Day Marine Weather Outlook
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Waypoints along Nicobar to Paradip transit corridor
                  </p>
                </div>
                <Badge variant="blue" size="sm">
                  Daily Swell
                </Badge>
              </div>

              <div className="space-y-2 mt-4">
                {SEVEN_DAY_FORECAST.map((f: { day: string; cond: string; temp: number; wind: number; wave: number; safe: string }, i: number) => (
                  <div
                    key={i}
                    className={clsx(
                      'p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors',
                      f.safe === 'Optimal' && 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80',
                      f.safe === 'Caution' && 'bg-amber-500/10 border-amber-500/25',
                      f.safe === 'Storm Risk' && 'bg-rose-500/10 border-rose-500/30'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-white w-8">{f.day}</span>
                      <div>
                        <span className="font-medium text-slate-200 block text-[11px]">{f.cond}</span>
                        <span className="text-[10px] text-slate-400">Temp: {f.temp}°C</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div className="font-mono">
                        <span className="text-slate-300 block text-[11px]">{f.wind} km/h</span>
                        <span className="text-[10px] text-cyan-400 font-bold">{f.wave}m swell</span>
                      </div>

                      <span
                        className={clsx(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold',
                          f.safe === 'Optimal' && 'bg-emerald-500/20 text-emerald-400',
                          f.safe === 'Caution' && 'bg-amber-500/20 text-amber-400',
                          f.safe === 'Storm Risk' && 'bg-rose-500/20 text-rose-400'
                        )}
                      >
                        {f.safe}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Calm window begins: Saturday</span>
              <span className="text-emerald-400 font-semibold font-mono">Day 4 Optimal Departure</span>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-7">
          <GlassCard className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Hourly Metocean Simulation Curves
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    High-resolution 24-hour wave and wind velocity profile
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedForecastTab('wind')}
                    className={clsx(
                      'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
                      selectedForecastTab === 'wind'
                        ? 'bg-blue-600 text-white shadow-glow-blue'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Wind Speed
                  </button>
                  <button
                    onClick={() => setSelectedForecastTab('waves')}
                    className={clsx(
                      'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
                      selectedForecastTab === 'waves'
                        ? 'bg-blue-600 text-white shadow-glow-blue'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Wave Height
                  </button>
                  <button
                    onClick={() => setSelectedForecastTab('rain')}
                    className={clsx(
                      'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
                      selectedForecastTab === 'rain'
                        ? 'bg-blue-600 text-white shadow-glow-blue'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    Rain Prob %
                  </button>
                </div>
              </div>

              <div className="h-[240px] w-full mt-4">
                {selectedForecastTab === 'wind' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={HOURLY_WEATHER_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="hour" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} domain={[20, 50]} tickFormatter={(v) => `${v}k`} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs">
                                <span className="font-bold text-white block">{label}</span>
                                <span className="text-blue-400 font-mono">Wind: {payload[0].value} km/h</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="windSpeed" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} name="Wind (km/h)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {selectedForecastTab === 'waves' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={HOURLY_WEATHER_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="hour" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} domain={[1.5, 4.0]} tickFormatter={(v) => `${v}m`} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs">
                                <span className="font-bold text-white block">{label}</span>
                                <span className="text-cyan-400 font-mono">Wave: {payload[0].value} m</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="waveHeight" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4, fill: '#06B6D4' }} name="Wave (m)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {selectedForecastTab === 'rain' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={HOURLY_WEATHER_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="hour" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs">
                                <span className="font-bold text-white block">{label}</span>
                                <span className="text-indigo-400 font-mono">Precipitation: {payload[0].value}%</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="rainProb" fill="#6366F1" radius={[4, 4, 0, 0]} name="Rain Probability %" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Peak Swell Expected: 12:00 UTC (3.2m wave, 44 km/h wind)</span>
              <span className="text-blue-400 font-medium">Auto-synced with ECMWF Model</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
