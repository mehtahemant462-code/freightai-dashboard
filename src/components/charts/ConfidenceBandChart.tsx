import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { FREIGHT_TREND_30, FREIGHT_TREND_60, FREIGHT_TREND_90 } from '../../data/mockData';
import { FreightDataPoint } from '../../types';

interface ConfidenceBandChartProps {
  horizon: '30' | '60' | '90';
  customData?: FreightDataPoint[];
  spotRate?: number;
}

export const ConfidenceBandChart: React.FC<ConfidenceBandChartProps> = ({ horizon, customData, spotRate = 18.20 }) => {
  const chartData = customData || (horizon === '30' ? FREIGHT_TREND_30 : horizon === '60' ? FREIGHT_TREND_60 : FREIGHT_TREND_90);

  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 25, left: -5, bottom: 5 }}>
          <defs>
            <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.03} />
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
            domain={[13, 23]}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            tickFormatter={(val) => `$${val}`}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs font-sans">
                    <div className="font-bold text-white mb-1.5">{item.day}</div>
                    <div className="space-y-1">
                      {item.predictedRate && (
                        <div className="text-cyan-400 font-mono">
                          Forecast: ${item.predictedRate.toFixed(2)}/Ton
                        </div>
                      )}
                      {item.lowerBound && (
                        <div className="text-slate-400 font-mono text-[11px]">
                          95% Band: ${item.lowerBound.toFixed(2)} - ${item.upperBound.toFixed(2)}
                        </div>
                      )}
                      {item.actualRate && (
                        <div className="text-blue-400 font-mono">
                          Historical: ${item.actualRate.toFixed(2)}/Ton
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Shaded Confidence Intervals */}
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="url(#forecastArea)"
            name="Upper 95% Bound"
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="#080D1A"
            name="Lower 95% Bound"
          />

          <ReferenceLine y={spotRate} stroke="#475569" strokeDasharray="3 3" label={{ value: `Spot $${spotRate.toFixed(2)}`, fill: '#94A3B8', fontSize: 10 }} />
          <ReferenceLine x="D +15" stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Min Rate $15.28', fill: '#10B981', fontSize: 10 }} />

          <Line
            type="monotone"
            dataKey="actualRate"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 3, fill: '#3B82F6' }}
            name="Historical Spot"
          />
          <Line
            type="monotone"
            dataKey="predictedRate"
            stroke="#06B6D4"
            strokeWidth={3}
            dot={{ r: 3, fill: '#06B6D4' }}
            name="Forecast Rate"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
