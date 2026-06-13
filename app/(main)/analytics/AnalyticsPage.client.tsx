'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, SingleColLayout } from '../../components/layout/PageWrapper';
import { KPIStrip }             from '../../components/analytics/KPIStrip';
import { ImpressionsChart }     from '../../components/analytics/ImpressionsChart';
import { EngagementBreakdown }  from '../../components/analytics/EngagementBreakdown';
import { AudienceDemographics } from '../../components/analytics/AudienceDemographics';
import { PostPerformanceTable } from '../../components/analytics/PostPerformanceTable';
import { useAnalytics }         from '../../hooks/useAnalytics';
import { cn }                   from '../../lib/utils';
import type { AnalyticsPeriod } from '../../types/analytics.types';

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: '7d',  label: '7 days'  },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

export function AnalyticsPageClient() {
  const { summary, isLoading, period, setPeriod } = useAnalytics();

  return (
    <PageWrapper>
      <SingleColLayout maxWidth="2xl">
        {/* Page header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-semibold text-[var(--color-text-primary)] tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              How your content is performing
            </p>
          </div>

          {/* Period switcher */}
          <div className="flex border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  'h-8 px-3.5 text-xs font-medium transition-colors',
                  period === p.value
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={period}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <KPIStrip
              metrics={summary?.kpis ?? []}
              isLoading={isLoading}
            />

            <ImpressionsChart
              data={summary?.timeSeries ?? []}
              isLoading={isLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EngagementBreakdown
                data={summary?.engagementByType ?? []}
                isLoading={isLoading}
              />
              {/* Audience side stacked */}
              <div className="space-y-4">
                {summary?.audienceIndustry && !isLoading && (
                  <AudienceDemographics
                    industry={summary.audienceIndustry}
                    location={summary.audienceLocation}
                    isLoading={isLoading}
                  />
                )}
                {isLoading && (
                  <>
                    <div className="card p-5 h-44 skeleton" />
                    <div className="card p-5 h-44 skeleton" />
                  </>
                )}
              </div>
            </div>

            <PostPerformanceTable
              rows={summary?.topPosts ?? []}
              isLoading={isLoading}
            />
          </motion.div>
        </AnimatePresence>
      </SingleColLayout>
    </PageWrapper>
  );
}
