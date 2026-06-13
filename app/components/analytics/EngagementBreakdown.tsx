'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import type { EngagementByType } from '../../types/analytics.types';

const COLORS = ['var(--color-brand)', 'var(--color-accent)', '#2D6A4F', '#7C3AED', '#B45309'];

interface EngagementBreakdownProps {
  data:      EngagementByType[];
  isLoading: boolean;
}

function DonutChart({ data, hovered }: { data: EngagementByType[]; hovered: number | null }) {
  const R = 56, r = 34, cx = 72, cy = 72;
  const total       = data.reduce((s, d) => s + d.count, 0);
  let   cumulativePct = 0;

  function polarToXY(pct: number, radius: number) {
    const angle = (pct * 360 - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  function describeSlice(startPct: number, endPct: number, outer: number, inner: number): string {
    if (endPct - startPct >= 1) {
      // Full circle
      return [
        `M ${cx} ${cy - outer}`,
        `A ${outer} ${outer} 0 1 1 ${cx - 0.001} ${cy - outer}`,
        `L ${cx - 0.001} ${cy - inner}`,
        `A ${inner} ${inner} 0 1 0 ${cx} ${cy - inner}`,
        'Z',
      ].join(' ');
    }
    const s1 = polarToXY(startPct, outer), e1 = polarToXY(endPct, outer);
    const s2 = polarToXY(startPct, inner), e2 = polarToXY(endPct, inner);
    const large = endPct - startPct > 0.5 ? 1 : 0;
    return [
      `M ${s1.x.toFixed(2)} ${s1.y.toFixed(2)}`,
      `A ${outer} ${outer} 0 ${large} 1 ${e1.x.toFixed(2)} ${e1.y.toFixed(2)}`,
      `L ${e2.x.toFixed(2)} ${e2.y.toFixed(2)}`,
      `A ${inner} ${inner} 0 ${large} 0 ${s2.x.toFixed(2)} ${s2.y.toFixed(2)}`,
      'Z',
    ].join(' ');
  }

  return (
    <svg viewBox="0 0 144 144" className="w-36 h-36 shrink-0" aria-hidden="true">
      {data.map((d, i) => {
        const startPct = cumulativePct;
        const slicePct = d.count / total;
        cumulativePct += slicePct;
        const isHovered = hovered === i;
        const outerR    = isHovered ? R + 4 : R;
        return (
          <path
            key={d.type}
            d={describeSlice(startPct, cumulativePct, outerR, r)}
            fill={COLORS[i % COLORS.length]}
            opacity={hovered !== null && !isHovered ? 0.45 : 1}
            style={{ transition: 'all 0.18s ease', cursor: 'pointer' }}
          />
        );
      })}
      {/* Centre text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-text-primary)">
        {total.toLocaleString()}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8.5" fill="var(--color-text-tertiary)">
        total
      </text>
    </svg>
  );
}

export function EngagementBreakdown({ data, isLoading }: EngagementBreakdownProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (isLoading) return <div className="card p-5 h-48 skeleton" />;

  return (
    <div className="card p-4 md:p-5">
      <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Engagement breakdown</h2>
      <div className="flex items-center gap-5">
        <DonutChart data={data} hovered={hovered} />
        <ul className="flex-1 space-y-2">
          {data.map((d, i) => (
            <li
              key={d.type}
              className="flex items-center justify-between gap-2 cursor-default"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className={cn(
                  'text-xs truncate transition-colors',
                  hovered === i ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)]',
                )}>
                  {d.type}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-[var(--color-text-primary)] tabular-nums">
                  {d.count.toLocaleString()}
                </span>
                <span className="text-[10px] text-[var(--color-text-tertiary)] w-7 text-right">
                  {d.pct}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
