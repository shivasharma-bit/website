'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { AudienceSegment } from '../../types/analytics.types';

interface AudienceDemographicsProps {
  industry:  AudienceSegment[];
  location:  AudienceSegment[];
  isLoading: boolean;
}

function BarList({ segments }: { segments: AudienceSegment[] }) {
  return (
    <ul className="space-y-2.5">
      {segments.map((seg, i) => (
        <li key={seg.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--color-text-secondary)]">{seg.label}</span>
            <span className="text-xs font-semibold text-[var(--color-text-primary)] tabular-nums">{seg.pct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-raised)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: seg.color }}
              initial={{ width: 0 }}
              animate={{ width: `${seg.pct}%` }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AudienceDemographics({ industry, location, isLoading }: AudienceDemographicsProps) {
  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="card p-5 h-44 skeleton" />
      <div className="card p-5 h-44 skeleton" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[
        { title: 'Audience by industry', data: industry },
        { title: 'Audience by location', data: location },
      ].map(panel => (
        <div key={panel.title} className="card p-4 md:p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">{panel.title}</h2>
          <BarList segments={panel.data} />
        </div>
      ))}
    </div>
  );
}
