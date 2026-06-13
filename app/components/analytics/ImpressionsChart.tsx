'use client';

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { cn } from '../../lib/utils';
import type { TimeSeriesPoint } from '../../types/analytics.types';

type MetricKey = 'impressions' | 'engagements' | 'profileViews' | 'newFollowers';

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'impressions',  label: 'Impressions',   color: 'var(--color-brand)'   },
  { key: 'engagements',  label: 'Engagements',   color: 'var(--color-accent)'  },
  { key: 'profileViews', label: 'Profile views', color: '#2D6A4F'              },
];

interface ImpressionsChartProps {
  data:      TimeSeriesPoint[];
  isLoading: boolean;
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export function ImpressionsChart({ data, isLoading }: ImpressionsChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(['impressions', 'engagements'])
  );
  const [tooltip, setTooltip]   = useState<{ x: number; y: number; point: TimeSeriesPoint } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 640, H = 220, PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;

  const { paths, yTicks, xLabels } = useMemo(() => {
    if (!data.length) return { paths: [], yTicks: [], xLabels: [] };

    const activeKeys = METRICS.filter(m => activeMetrics.has(m.key));
    const allValues  = data.flatMap(d => activeKeys.map(m => d[m.key] as number));
    const maxV       = Math.max(...allValues, 1);
    const minV       = 0;
    const range      = maxV - minV || 1;

    const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
    const yScale = (v: number) => PAD.top  + innerH - ((v - minV) / range) * innerH;

    const paths = activeKeys.map(m => {
      const pts = data.map((d, i) => `${xScale(i).toFixed(1)},${yScale(d[m.key] as number).toFixed(1)}`);
      return {
        key:   m.key,
        color: m.color,
        d:     `M ${pts.join(' L ')}`,
        area:  `M ${PAD.left},${PAD.top + innerH} L ${pts.join(' L ')} L ${xScale(data.length - 1)},${PAD.top + innerH} Z`,
        points: data.map((d, i) => ({ x: xScale(i), y: yScale(d[m.key] as number), val: d[m.key] as number })),
      };
    });

    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
      const v = minV + (range * i) / tickCount;
      return { y: yScale(v), label: formatK(Math.round(v)) };
    });

    const step = Math.max(1, Math.floor(data.length / 6));
    const xLabels = data
      .filter((_, i) => i % step === 0 || i === data.length - 1)
      .map((d, _, arr) => {
        const idx = data.indexOf(d);
        const date = new Date(d.date);
        return {
          x:     xScale(idx),
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };
      });

    return { paths, yTicks, xLabels, xScale, yScale };
  }, [data, activeMetrics, innerW, innerH]);

  function toggleMetric(key: MetricKey) {
    setActiveMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key) && next.size === 1) return prev; // keep at least one
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !data.length) return;
    const relX    = (e.clientX - rect.left) * (W / rect.width) - PAD.left;
    const idx     = Math.round((relX / innerW) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    const x       = PAD.left + (clamped / (data.length - 1)) * innerW;
    setTooltip({ x, y: PAD.top, point: data[clamped] });
  }

  if (isLoading) {
    return <div className="card p-5 h-64 skeleton" />;
  }

  return (
    <div className="card p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Performance over time</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-opacity',
                !activeMetrics.has(m.key) && 'opacity-40',
              )}
            >
              <span className="w-3 h-0.5 rounded-full" style={{ background: m.color }} />
              <span className="text-[var(--color-text-secondary)]">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
          aria-label="Performance chart"
          role="img"
        >
          {/* Y grid lines */}
          {yTicks.map(tick => (
            <g key={tick.y}>
              <line
                x1={PAD.left} y1={tick.y.toFixed(1)}
                x2={W - PAD.right} y2={tick.y.toFixed(1)}
                stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 3"
              />
              <text
                x={PAD.left - 6} y={tick.y}
                textAnchor="end" dominantBaseline="middle"
                fontSize="9" fill="var(--color-text-tertiary)"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* X labels */}
          {xLabels.map(lbl => (
            <text
              key={lbl.x}
              x={lbl.x} y={H - 6}
              textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)"
            >
              {lbl.label}
            </text>
          ))}

          {/* Area fills */}
          {paths.map(p => (
            <path
              key={`area-${p.key}`}
              d={p.area}
              fill={p.color}
              opacity="0.08"
            />
          ))}

          {/* Lines */}
          {paths.map(p => (
            <path
              key={`line-${p.key}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Tooltip crosshair */}
          {tooltip && (
            <g>
              <line
                x1={tooltip.x} y1={PAD.top}
                x2={tooltip.x} y2={PAD.top + innerH}
                stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="3 2"
              />
              {paths.map(p => {
                const idx  = data.indexOf(tooltip.point);
                const pt   = p.points[idx];
                if (!pt) return null;
                return (
                  <circle key={p.key} cx={pt.x} cy={pt.y} r="4"
                    fill="var(--color-surface)" stroke={p.color} strokeWidth="2" />
                );
              })}
            </g>
          )}
        </svg>

        {/* Tooltip box */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)] p-2.5 min-w-[120px]"
            style={{
              left:      tooltip.x / W * 100 + '%',
              top:       '8px',
              transform: tooltip.x / W > 0.7 ? 'translateX(-110%)' : 'translateX(8px)',
            }}
          >
            <p className="text-[10px] text-[var(--color-text-tertiary)] mb-1.5">
              {new Date(tooltip.point.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            {METRICS.filter(m => activeMetrics.has(m.key)).map(m => (
              <div key={m.key} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                  <span className="text-[10px] text-[var(--color-text-secondary)]">{m.label}</span>
                </div>
                <span className="text-[10px] font-semibold text-[var(--color-text-primary)] tabular-nums">
                  {formatK(tooltip.point[m.key] as number)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
