import { apiClient } from './client';
import type { AnalyticsSummary, AnalyticsPeriod } from '../../types/analytics.types';

export const analyticsService = {
  async getSummary(period: AnalyticsPeriod = '30d'): Promise<AnalyticsSummary> {
    const r = await apiClient.get<{ data: AnalyticsSummary }>(`/analytics?period=${period}`);
    return r.data;
  },
};
