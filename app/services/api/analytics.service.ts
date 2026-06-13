import { analyticsMock } from '../mock/analytics.mock';
import type { AnalyticsSummary, AnalyticsPeriod } from '../../types/analytics.types';

export const analyticsService = {
  getSummary: (period?: AnalyticsPeriod): Promise<AnalyticsSummary> =>
    analyticsMock.getSummary(period),
};
