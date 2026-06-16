'use client';

import React, {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from 'react';
import type { AuthUser, AuthState } from '../types/core.types';

const MOCK_USER: AuthUser = {
  id: 'usr_01', username: 'maya.chen', displayName: 'Maya Chen',
  email: 'maya@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&q=80',
  headline: 'Design Systems Lead at Stripe', location: 'San Francisco, CA',
  company: 'Stripe', companyLogoUrl: null, pronouns: 'she/her',
  website: 'https://mayachen.design', bio: 'Crafting interfaces that move money.',
  isVerified: true, isOpenToWork: false, isHiring: true,
  followersCount: 14800, followingCount: 382, connectionsCount: 2100,
  degree: null, onlineStatus: 'online', joinedAt: '2021-03-15T00:00:00.000Z',
  mutualConnections: [], accessToken: 'mock', refreshToken: 'mock',
};

interface AuthContextValue extends AuthState {
  login:      (email: string, password: string) => Promise<void>;
  register:   (payload: { email: string; password: string; displayName: string; username: string }) => Promise<void>;
  logout:     () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null, isLoading: true, isAuthenticated: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('forge_session');
    if (stored === 'active') {
      setState({ user: MOCK_USER, isLoading: false, isAuthenticated: true });
    } else {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 500));
    const user = { ...MOCK_USER, email };
    localStorage.setItem('forge_session', 'active');
    localStorage.setItem('forge_access_token', 'mock_token');
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(async (payload: { email: string; password: string; displayName: string; username: string }) => {
    setState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 500));
    const user = { ...MOCK_USER, email: payload.email, displayName: payload.displayName, username: payload.username };
    localStorage.setItem('forge_session', 'active');
    localStorage.setItem('forge_access_token', 'mock_token');
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('forge_session');
    localStorage.removeItem('forge_access_token');
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setState(prev => prev.user ? { ...prev, user: { ...prev.user, ...partial } } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}