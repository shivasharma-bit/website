import { apiClient } from './client';
import type { User } from '../../types/core.types';
import type { Post } from '../../types/post.types';

export interface SearchResults {
  persons: User[];
  posts:   Post[];
  topics:  { tag: string }[];
}

export const searchService = {
  async search(q: string, type = 'all', page = 1): Promise<SearchResults> {
    const params = new URLSearchParams({ q, type, page: String(page) });
    const r = await apiClient.get<{ data: SearchResults }>(`/search?${params}`);
    return r.data;
  },
};
