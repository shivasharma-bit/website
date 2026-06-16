import { apiClient, setToken, clearToken } from './client';
import type { AuthUser } from '../../types/core.types';

interface ApiAuth { data: AuthUser; success: boolean; }

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const res = await apiClient.post<ApiAuth>('/auth/login', { email, password });
    setToken(res.data.accessToken);
    localStorage.setItem('forge_refresh_token', res.data.refreshToken);
    return res.data;
  },

  async register(payload: { email: string; password: string; displayName: string; username: string }): Promise<AuthUser> {
    const res = await apiClient.post<ApiAuth>('/auth/register', payload);
    setToken(res.data.accessToken);
    localStorage.setItem('forge_refresh_token', res.data.refreshToken);
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', {}).catch(() => {});
    clearToken();
    localStorage.removeItem('forge_session');
  },

  async refresh(): Promise<string> {
    const refreshToken = localStorage.getItem('forge_refresh_token');
    const res = await apiClient.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', { refreshToken });
    setToken(res.data.accessToken);
    localStorage.setItem('forge_refresh_token', res.data.refreshToken);
    return res.data.accessToken;
  },

  async getMe(): Promise<AuthUser> {
    const res = await apiClient.get<ApiAuth>('/auth/me');
    return res.data;
  },
};
