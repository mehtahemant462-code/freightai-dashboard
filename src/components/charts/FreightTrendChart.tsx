import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { FREIGHT_TREND_30 } from '../../data/mockData';

interface FreightTrendChartProps {
  data?: typeof FREIGHT_TREND_30;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs">
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <span className="font-bold text-white font-mono">{data.day}</span>
          {data.isOptimal && (
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              OPTIMAL CHARTER DAY
            </span>
          )}
        </div>
        <div className="space-y-1.5 mt-2">
          {data.actualRate && (
            <div className="flex justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Historical Spot:</span>
              </span>
              <span className="font-mono font-bold text-white">${data.actualRate.toFixed(2)}/T</span>
            </div>
          )}
          {data.predictedRate && (
            <div className="flex justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>AI Forecast:</span>
              </span>
              <span className="font-mono font-bold text-cyan-400">${data.predictedRate.toFixed(2)}/T</span>
            </div>
          )}
          {data.lowerBound && (
            <div className="flex justify-between gap-4 text-slate-400 text-[11px]">
              <span>95% Confidence Band:</span>
              <span className="font-mono">${data.lowerBound.toFixed(2)} - ${data.upperBound.toFixed(2)}/T</span>
            </div>
          )}
          {data.isOptimal && (
            <div className="pt-1.5 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
              ★ Save 16.0% vs Current Spot ($18.20/T)
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const FreightTrendChart: React.FC<FreightTrendChartProps> = ({
  data = FREIGHT_TREND_30,
  height = 320,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <defs>
            {/* Shaded Confidence Interval Gradient */}
            <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
            </linearGradient>

            {/* AI Forecast Line Gradient */}
            <linearGradient id="forecastLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

          <XAxis
            dataKey="day"
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />

          <YAxis
            stroke="#64748B"
            fontSize={11}
            domain={[13, 22]}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            tickFormatter={(val) => `$${val}`}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Shaded Confidence Area between upper and lower bound */}
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="url(#confidenceArea)"
            fillOpacity={1}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="#080D1A"
            fillOpacity={1}
            isAnimationActive={false}
          />

          {/* Baseline Spot Rate line */}
          <ReferenceLine
            y={18.20}
            stroke="#64748B"
            strokeDasharray="4 4"
            label={{ value: 'Current Spot $18.20', fill: '#94A3B8', fontSize: 10, position: 'insideTopRight' }}
          />

          {/* Optimal Day Reference Line */}
          <ReferenceLine
            x="D +15"
            stroke="#10B981"
            strokeDasharray="3 3"
            label={{ value: 'Day 15 Target ($15.28)', fill: '#10B981', fontSize: 10, position: 'top' }}
          />

          {/* Optimal Point Dot */}
          <ReferenceDot
            x="D +15"
            y={15.28}
            r={6}
            fill="#10B981"
            stroke="#FFFFFF"
            strokeWidth={2}
          />

          {/* Historical Actual Rate Line */}
          <Line
            type="monotone"
            dataKey="actualRate"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 3, fill: '#3B82F6', stroke: '#1E293B' }}
            activeDot={{ r: 6, fill: '#60A5FA' }}
            name="Historical Spot"
          />

          {/* AI Predicted Rate Line */}
          <Line
            type="monotone"
            dataKey="predictedRate"
            stroke="url(#forecastLine)"
            strokeWidth={3}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#06B6D4', stroke: '#0F172A' }}
            activeDot={{ r: 7, fill: '#34D399', stroke: '#FFFFFF', strokeWidth: 2 }}
            name="AI Forecast"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
