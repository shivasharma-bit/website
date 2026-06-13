'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthUser, AuthState } from '../types/core.types';
import { sleep } from '../lib/utils';

// ─── Mock authenticated user ──────────────────────────────────────────────────

const MOCK_USER: AuthUser = {
  id:               'usr_01',
  username:         'maya.chen',
  displayName:      'Maya Chen',
  email:            'maya@example.com',
  avatarUrl:        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  coverUrl:         'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&q=80',
  headline:         'Design Systems Lead at Stripe',
  location:         'San Francisco, CA',
  company:          'Stripe',
  companyLogoUrl:   null,
  pronouns:         'she/her',
  website:          'https://mayachen.design',
  bio:              'Crafting the interfaces that move money. Prev: Figma, Airbnb. Writing about design systems, collaboration, and creative work.',
  isVerified:       true,
  isOpenToWork:     false,
  isHiring:         true,
  followersCount:   14_800,
  followingCount:   382,
  connectionsCount: 2_100,
  degree:           null,
  onlineStatus:     'online',
  joinedAt:         '2021-03-15T00:00:00.000Z',
  mutualConnections:[],
  accessToken:      'mock_access_token',
  refreshToken:     'mock_refresh_token',
};

// ─── Context types ─────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login:  (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user:            null,
    isLoading:       true,
    isAuthenticated: false,
  });

  // Simulate session restore on mount
  useEffect(() => {
    async function restoreSession() {
      await sleep(400);
      const stored = typeof window !== 'undefined'
        ? localStorage.getItem('forge_session')
        : null;

      if (stored === 'active') {
        setState({ user: MOCK_USER, isLoading: false, isAuthenticated: true });
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    }
    restoreSession();
  }, []);

  const login = useCallback(async (_email: string, _password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await sleep(800);
    localStorage.setItem('forge_session', 'active');
    setState({ user: MOCK_USER, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(async () => {
    await sleep(300);
    localStorage.removeItem('forge_session');
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setState(prev =>
      prev.user ? { ...prev, user: { ...prev.user, ...partial } } : prev
    );
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
