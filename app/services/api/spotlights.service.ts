import { apiClient } from './client';

export interface Spotlight {
  id:        string;
  coverUrl:  string;
  caption:   string | null;
  expiresAt: string;
  createdAt: string;
  user: { id: string; username: string; displayName: string; avatarUrl: string | null };
  _count: { views: number };
}

export const spotlightsService = {
  async getAll(): Promise<Spotlight[]> {
    const r = await apiClient.get<{ data: Spotlight[] }>('/spotlights');
    return r.data;
  },
  async create(coverUrl: string, caption?: string): Promise<Spotlight> {
    const r = await apiClient.post<{ data: Spotlight }>('/spotlights', { coverUrl, caption });
    return r.data;
  },
  async view(id: string): Promise<void> {
    return apiClient.post(`/spotlights/${id}/view`, {});
  },
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/spotlights/${id}`);
  },
};
