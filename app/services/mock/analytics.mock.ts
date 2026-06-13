import { sleep } from '../../lib/utils';
import { createPosts } from './factories/post.factory';
import type {
  AnalyticsSummary, AnalyticsPeriod, KPIMetric,
  TimeSeriesPoint, EngagementByType, AudienceSegment, PostPerformanceRow,
} from '../../types/analytics.types';

function makeDays(n: number): TimeSeriesPoint[] {
  let impressions  = 1_200;
  let followers    = 14_400;
  return Array.from({ length: n }, (_, i) => {
    impressions  = Math.max(200, impressions  + (Math.random() - 0.4) * 400);
    followers   += Math.floor(Math.random() * 8);
    const date   = new Date(Date.now() - (n - i) * 86400_000).toISOString().slice(0, 10);
    return {
      date,
      impressions:  Math.round(impressions),
      engagements:  Math.round(impressions * (0.04 + Math.random() * 0.03)),
      profileViews: Math.round(impressions * 0.015),
      newFollowers: Math.floor(Math.random() * 12),
    };
  });
}

function makeKPIs(period: AnalyticsPeriod): KPIMetric[] {
  const mult = period === '7d' ? 1 : period === '30d' ? 4.2 : 12;
  return [
    { label: 'Impressions',   value: Math.round(8_400  * mult), delta:  12.4, deltaType: 'increase', format: 'number'  },
    { label: 'Profile views', value: Math.round(1_100  * mult), delta:  7.2,  deltaType: 'increase', format: 'number'  },
    { label: 'New followers', value: Math.round(62     * mult), delta: -3.1,  deltaType: 'decrease', format: 'number'  },
    { label: 'Eng. rate',     value: 4.8,                        delta:  0.6,  deltaType: 'increase', format: 'percent' },
  ];
}

export const analyticsMock = {
  async getSummary(period: AnalyticsPeriod = '30d'): Promise<AnalyticsSummary> {
    await sleep(600);
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

    const engagementByType: EngagementByType[] = [
      { type: 'Reactions',  count: 4_820, pct: 52 },
      { type: 'Comments',   count: 1_940, pct: 21 },
      { type: 'Reposts',    count: 1_380, pct: 15 },
      { type: 'Bookmarks',  count:   920, pct: 10 },
      { type: 'Link clicks',count:   220, pct:  2 },
    ];

    const audienceIndustry: AudienceSegment[] = [
      { label: 'Design',        pct: 38, color: '#1F3480' },
      { label: 'Engineering',   pct: 29, color: '#6678B8' },
      { label: 'Product',       pct: 18, color: '#9EAAD6' },
      { label: 'Leadership',    pct:  9, color: '#D5DCF0' },
      { label: 'Other',         pct:  6, color: '#EEECE7' },
    ];

    const audienceLocation: AudienceSegment[] = [
      { label: 'United States', pct: 44, color: '#1F3480' },
      { label: 'Europe',        pct: 28, color: '#6678B8' },
      { label: 'Asia Pacific',  pct: 17, color: '#9EAAD6' },
      { label: 'Other',         pct: 11, color: '#D5DCF0' },
    ];

    const rawPosts = createPosts(10);
    const topPosts: PostPerformanceRow[] = rawPosts.map(p => ({
      post:        { id: p.id, body: p.body, type: p.type, media: p.media, createdAt: p.createdAt },
      impressions: Math.floor(Math.random() * 8000) + 500,
      reactions:   p.totalReactions,
      comments:    p.commentCount,
      reposts:     p.repostCount,
      ctr:         parseFloat((Math.random() * 6 + 1).toFixed(1)),
    }));

    return {
      period,
      kpis:             makeKPIs(period),
      timeSeries:       makeDays(days),
      engagementByType,
      audienceIndustry,
      audienceLocation,
      topPosts:         topPosts.sort((a, b) => b.impressions - a.impressions),
    };
  },
};
