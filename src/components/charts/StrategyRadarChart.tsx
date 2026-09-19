import React, { useState } from 'react';
import { CONTRACT_STRATEGIES } from '../../data/mockData';
import clsx from 'clsx';

export const StrategyRadarChart: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('multi-voyage');

  // 5 Dimensions
  const axes = [
    { key: 'costEfficiency', label: 'Cost Efficiency' },
    { key: 'priceStability', label: 'Price Stability' },
    { key: 'capacityGuarantee', label: 'Capacity Guarantee' },
    { key: 'operationalFlexibility', label: 'Operational Flexibility' },
    { key: 'counterpartyRisk', label: 'Counterparty Reliability' },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 105;
  const numAxes = axes.length;

  // Helper to compute (x, y) given index and value (0 - 100)
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build polygon path for a strategy
  const getPolygonPath = (scores: Record<string, number>) => {
    return axes
      .map((axis, i) => {
        const val = scores[axis.key] || 50;
        const { x, y } = getCoordinates(i, val);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';
  };

  const strategyStyles: Record<string, { stroke: string; fill: string; dot: string; label: string }> = {
    spot: {
      stroke: '#EF4444',
      fill: 'rgba(239, 68, 68, 0.15)',
      dot: '#EF4444',
      label: 'Spot Market',
    },
    'short-term': {
      stroke: '#3B82F6',
      fill: 'rgba(59, 130, 246, 0.2)',
      dot: '#3B82F6',
      label: 'Short-Term (3-6M)',
    },
    'multi-voyage': {
      stroke: '#10B981',
      fill: 'rgba(16, 185, 129, 0.3)',
      dot: '#10B981',
      label: 'Multi-Voyage COA (AI)',
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-3">
        {CONTRACT_STRATEGIES.map((strat) => (
          <button
            key={strat.id}
            onClick={() => setSelectedStrategy(strat.id)}
            className={clsx(
              'px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5',
              selectedStrategy === strat.id
                ? 'bg-slate-800 text-white border border-slate-600 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: strategyStyles[strat.id].stroke }}
            />
            <span>{strat.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Radar concentric webs (20%, 40%, 60%, 80%, 100%) */}
        {[20, 40, 60, 80, 100].map((level) => {
          const path = axes
            .map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ') + ' Z';
          return (
            <path
              key={level}
              d={path}
              fill="none"
              stroke="#1E293B"
              strokeWidth={level === 100 ? '1.5' : '1'}
              strokeDasharray={level < 100 ? '2 2' : undefined}
            />
          );
        })}

        {/* Axes lines from center */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}

        {/* Render polygon overlays for unselected strategies with low opacity */}
        {CONTRACT_STRATEGIES.filter(s => s.id !== selectedStrategy).map((strat) => {
          const path = getPolygonPath(strat.radarScores);
          const style = strategyStyles[strat.id];
          return (
            <path
              key={strat.id}
              d={path}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth="1.5"
              opacity="0.35"
            />
          );
        })}

        {/* Render active selected strategy polygon */}
        {(() => {
          const activeStrat = CONTRACT_STRATEGIES.find(s => s.id === selectedStrategy)!;
          const path = getPolygonPath(activeStrat.radarScores);
          const style = strategyStyles[activeStrat.id];

          return (
            <g>
              <path
                d={path}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth="2.5"
                className="drop-shadow-lg"
              />
              {/* Vertex dots */}
              {axes.map((axis, i) => {
                const val = (activeStrat.radarScores as any)[axis.key];
                const { x, y } = getCoordinates(i, val);
                return (
                  <circle
                    key={axis.key}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={style.dot}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          );
        })()}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, 122);
          const isTop = y < center - 20;
          const isBottom = y > center + 20;
          const isLeft = x < center - 20;
          const isRight = x > center + 20;

          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (isLeft) textAnchor = 'end';
          if (isRight) textAnchor = 'start';

          return (
            <text
              key={axis.key}
              x={x}
              y={y + (isTop ? -4 : isBottom ? 10 : 3)}
              textAnchor={textAnchor}
              fill="#94A3B8"
              fontSize="9.5"
              fontWeight="600"
              className="tracking-tight"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
