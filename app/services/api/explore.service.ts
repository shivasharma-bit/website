import { apiClient } from './client';
import type { User } from '../../types/core.types';

export interface TrendingTopic   { tag: string; postCount: number; }
export interface FeaturedCompany { name: string; logoUrl: string | null; employeeCount: number; }

export const exploreService = {
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    const r = await apiClient.get<{ data: TrendingTopic[] }>('/explore/trending-topics');
    return r.data;
  },
  async getSuggestedUsers(): Promise<User[]> {
    const r = await apiClient.get<{ data: User[] }>('/explore/suggested-users');
    return r.data;
  },
  async getFeaturedCompanies(): Promise<FeaturedCompany[]> {
    const r = await apiClient.get<{ data: FeaturedCompany[] }>('/explore/featured-companies');
    return r.data;
  },
};
