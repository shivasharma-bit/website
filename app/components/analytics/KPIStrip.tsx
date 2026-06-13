'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn, formatNumber } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { KPIMetric } from '../../types/analytics.types';

interface KPIStripProps {
  metrics:   KPIMetric[];
  isLoading: boolean;
}

function DeltaChip({ delta, type }: { delta: number; type: KPIMetric['deltaType'] }) {
  const isUp      = type === 'increase';
  const isDown    = type === 'decrease';
  const isNeutral = type === 'neutral';
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
      isUp      && 'bg-[var(--color-success-muted)] text-[var(--color-success)]',
      isDown    && 'bg-[var(--color-error-muted)]   text-[var(--color-error)]',
      isNeutral && 'bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)]',
    )}>
      {isUp   && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>}
      {isDown && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>}
      {Math.abs(delta)}{type !== 'neutral' && '%'}
    </span>
  );
}

export function KPIStrip({ metrics, isLoading }: KPIStripProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4 space-y-2">
            <div className="h-3 w-20 rounded skeleton" />
            <div className="h-7 w-28 rounded skeleton" />
            <div className="h-4 w-14 rounded skeleton" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {metrics.map(metric => (
        <motion.div
          key={metric.label}
          variants={staggerItem}
          className="card p-4 space-y-1.5"
        >
          <p className="text-xs text-[var(--color-text-secondary)]">{metric.label}</p>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)] tabular-nums leading-none">
            {metric.format === 'percent'
              ? `${metric.value}%`
              : metric.format === 'rate'
              ? `${metric.value}%`
              : formatNumber(metric.value)}
          </p>
          <div className="flex items-center gap-1.5">
            <DeltaChip delta={metric.delta} type={metric.deltaType} />
            <span className="text-[10px] text-[var(--color-text-tertiary)]">vs prior period</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
