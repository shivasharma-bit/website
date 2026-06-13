import type { Post } from './post.types';

export type AnalyticsPeriod = '7d' | '30d' | '90d';

export interface KPIMetric {
  label:      string;
  value:      number;
  delta:      number;
  deltaType:  'increase' | 'decrease' | 'neutral';
  format:     'number' | 'percent' | 'rate';
}

export interface TimeSeriesPoint {
  date:         string;
  impressions:  number;
  engagements:  number;
  profileViews: number;
  newFollowers: number;
}

export interface EngagementByType {
  type:  string;
  count: number;
  pct:   number;
}

export interface AudienceSegment {
  label: string;
  pct:   number;
  color: string;
}

export interface PostPerformanceRow {
  post:        Pick<Post, 'id' | 'body' | 'type' | 'media' | 'createdAt'>;
  impressions: number;
  reactions:   number;
  comments:    number;
  reposts:     number;
  ctr:         number;
}

export interface AnalyticsSummary {
  period:           AnalyticsPeriod;
  kpis:             KPIMetric[];
  timeSeries:       TimeSeriesPoint[];
  engagementByType: EngagementByType[];
  audienceIndustry: AudienceSegment[];
  audienceLocation: AudienceSegment[];
  topPosts:         PostPerformanceRow[];
}
