'use client';

import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/api/analytics.service';
import type { AnalyticsSummary, AnalyticsPeriod } from '../types/analytics.types';

interface UseAnalyticsReturn {
  summary:   AnalyticsSummary | null;
  isLoading: boolean;
  error:     string | null;
  period:    AnalyticsPeriod;
  setPeriod: (p: AnalyticsPeriod) => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [summary,   setSummary]   = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [period,    setPeriodState] = useState<AnalyticsPeriod>('30d');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    analyticsService.getSummary(period)
      .then(data  => { if (active) { setSummary(data); setError(null); } })
      .catch(()   => { if (active) setError('Failed to load analytics'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [period]);

  const setPeriod = useCallback((p: AnalyticsPeriod) => setPeriodState(p), []);

  return { summary, isLoading, error, period, setPeriod };
}
