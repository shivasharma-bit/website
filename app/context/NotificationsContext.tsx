'use client';

import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode,
} from 'react';
import type { Notification } from '../types/core.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.forge.app/v1';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('forge_access_token') : null;
}

interface NotificationsContextValue {
  notifications:  Notification[];
  unreadCount:    number;
  isLoading:      boolean;
  markAsRead:     (id: string) => void;
  markAllAsRead:  () => void;
  fetchMore:      () => Promise<void>;
  hasMore:        boolean;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [hasMore,       setHasMore]       = useState(true);
  const pageRef = useRef(1);

  useEffect(() => {
    async function initialLoad() {
      const token = getToken();
      if (!token) { setIsLoading(false); return; }
      try {
        const res  = await fetch(`${BASE_URL}/notifications?page=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setNotifications(json.data ?? []);
        setHasMore(json.pagination?.hasMore ?? false);
      } catch {}
      setIsLoading(false);
      pageRef.current = 1;
    }
    initialLoad();
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    const token = getToken();
    if (!token) return;
    await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    const token = getToken();
    if (!token) return;
    await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }, []);

  const fetchMore = useCallback(async () => {
    if (!hasMore) return;
    const token = getToken();
    if (!token) return;
    pageRef.current += 1;
    const res  = await fetch(`${BASE_URL}/notifications?page=${pageRef.current}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setNotifications(prev => [...prev, ...(json.data ?? [])]);
    setHasMore(json.pagination?.hasMore ?? false);
  }, [hasMore]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, isLoading, markAsRead, markAllAsRead, fetchMore, hasMore }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}
