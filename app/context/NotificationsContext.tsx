'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { Notification } from '../types/core.types';
import { sleep } from '../lib/utils';

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

// ─── Mock data factory ────────────────────────────────────────────────────────

function makeMockNotifications(offset = 0): Notification[] {
  const actors = [
    { id: 'u1', displayName: 'James Okafor',   avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', headline: 'Senior Engineer at Vercel' },
    { id: 'u2', displayName: 'Priya Sundaram',  avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', headline: 'Product Lead at Linear'  },
    { id: 'u3', displayName: 'Tom Eriksson',    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', headline: 'Founder at Loom'         },
    { id: 'u4', displayName: 'Arjun Mehta',     avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', headline: 'Staff Designer at Notion' },
  ];

  const templates: Array<{ type: Notification['type']; excerpt: string; targetUrl: string }> = [
    { type: 'post_reaction',       excerpt: 'reacted Insightful to your case study',   targetUrl: '/feed' },
    { type: 'connection_request',  excerpt: 'wants to connect with you',               targetUrl: '/notifications' },
    { type: 'post_comment',        excerpt: 'commented on your post',                  targetUrl: '/feed' },
    { type: 'profile_view',        excerpt: 'viewed your profile',                     targetUrl: '/profile/maya.chen' },
    { type: 'endorsement',         excerpt: 'endorsed you for Design Systems',         targetUrl: '/profile/maya.chen' },
    { type: 'post_mention',        excerpt: 'mentioned you in a post',                 targetUrl: '/feed' },
    { type: 'connection_accepted', excerpt: 'accepted your connection request',        targetUrl: '/profile/james.okafor' },
  ];

  return Array.from({ length: 10 }, (_, i) => {
    const tmpl  = templates[(offset + i) % templates.length];
    const actor = actors[(offset + i) % actors.length];
    const minsAgo = (offset + i + 1) * 23;
    return {
      id:        `notif_${offset}_${i}`,
      type:      tmpl.type,
      actor,
      excerpt:   tmpl.excerpt,
      targetUrl: tmpl.targetUrl,
      isRead:    offset > 0,
      createdAt: new Date(Date.now() - minsAgo * 60_000).toISOString(),
    };
  });
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [hasMore,    setHasMore]    = useState(true);
  const pageRef = useRef(0);

  useEffect(() => {
    async function initialLoad() {
      await sleep(500);
      setNotifications(makeMockNotifications(0));
      setIsLoading(false);
      pageRef.current = 1;
    }
    initialLoad();
  }, []);

  // Simulate a real-time notification arriving after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif: Notification = {
        id:        'notif_realtime_1',
        type:      'post_reaction',
        actor:     { id: 'u5', displayName: 'Selin Kaya', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', headline: 'Creative Director at Figma' },
        excerpt:   'reacted Innovative to your case study',
        targetUrl: '/feed',
        isRead:    false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 8_000);
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const fetchMore = useCallback(async () => {
    if (!hasMore) return;
    await sleep(600);
    const next = makeMockNotifications(pageRef.current * 10);
    setNotifications(prev => [...prev, ...next]);
    pageRef.current += 1;
    if (pageRef.current >= 4) setHasMore(false);
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
