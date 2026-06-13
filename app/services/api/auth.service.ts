import { sleep } from '../../lib/utils';
import type { AuthUser } from '../../types/core.types';

export interface LoginPayload  { email: string; password: string; }
export interface SignupPayload { email: string; password: string; displayName: string; username: string; }

const MOCK_USER: AuthUser = {
  id: 'usr_01', username: 'maya.chen', displayName: 'Maya Chen',
  email: 'maya@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&q=80',
  headline: 'Design Systems Lead at Stripe', location: 'San Francisco, CA',
  company: 'Stripe', companyLogoUrl: null, pronouns: 'she/her',
  website: 'https://mayachen.design',
  bio: 'Crafting the interfaces that move money. Prev: Figma, Airbnb.',
  isVerified: true, isOpenToWork: false, isHiring: true,
  followersCount: 14_800, followingCount: 382, connectionsCount: 2_100,
  degree: null, onlineStatus: 'online', joinedAt: '2021-03-15T00:00:00.000Z',
  mutualConnections: [], accessToken: 'mock_access', refreshToken: 'mock_refresh',
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    await sleep(800);
    if (!payload.email || !payload.password) throw new Error('Invalid credentials');
    return MOCK_USER;
  },

  async signup(payload: SignupPayload): Promise<AuthUser> {
    await sleep(1000);
    return { ...MOCK_USER, email: payload.email, displayName: payload.displayName, username: payload.username };
  },

  async logout(): Promise<void> {
    await sleep(300);
  },

  async refreshToken(_token: string): Promise<{ accessToken: string }> {
    await sleep(200);
    return { accessToken: 'mock_refreshed_access_token' };
  },

  async getMe(): Promise<AuthUser> {
    await sleep(400);
    return MOCK_USER;
  },
};
