'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem } from './NotificationItem';
import { EmptyState } from '../shared/Primitives';
import { useNotifications } from '../../context/NotificationsContext';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import { cn } from '../../lib/utils';
import type { Notification, NotificationType } from '../../types/core.types';

type FilterTab = 'all' | 'connections' | 'reactions' | 'mentions';

const TAB_TYPES: Record<FilterTab, NotificationType[]> = {
  all:         [],
  connections: ['connection_request', 'connection_accepted'],
  reactions:   ['post_reaction', 'endorsement'],
  mentions:    ['post_comment', 'post_mention'],
};

function groupNotifications(list: Notification[]): { label: string; items: Notification[] }[] {
  const now      = Date.now();
  const DAY      = 86400_000;
  const today:   Notification[] = [];
  const week:    Notification[] = [];
  const earlier: Notification[] = [];

  for (const n of list) {
    const age = now - new Date(n.createdAt).getTime();
    if (age < DAY)       today.push(n);
    else if (age < 7 * DAY) week.push(n);
    else                 earlier.push(n);
  }

  return [
    { label: 'Today',     items: today   },
    { label: 'This week', items: week    },
    { label: 'Earlier',   items: earlier },
  ].filter(g => g.items.length > 0);
}

export function NotificationList() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, fetchMore, hasMore } = useNotifications();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = useMemo(() => {
    const types = TAB_TYPES[activeTab];
    if (!types.length) return notifications;
    return notifications.filter(n => types.includes(n.type));
  }, [notifications, activeTab]);

  const groups = useMemo(() => groupNotifications(filtered), [filtered]);

  const TABS: { id: FilterTab; label: string }[] = [
    { id: 'all',         label: 'All'         },
    { id: 'connections', label: 'Connections' },
    { id: 'reactions',   label: 'Reactions'   },
    { id: 'mentions',    label: 'Mentions'    },
  ];

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-semibold text-[var(--color-text-primary)]">Notifications</h1>
          {unreadCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-brand)] text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-medium text-[var(--color-brand)] hover:underline focus-visible:outline-none"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[var(--color-border)] overflow-x-auto scrollbar-hidden">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative flex-shrink-0 h-10 px-4 text-xs font-medium transition-colors',
              activeTab === tab.id
                ? 'text-[var(--color-brand)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="notif-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand)] rounded-t-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="divide-y divide-[var(--color-border)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-full skeleton shrink-0" />
              <div className="flex-1 space-y-1.5 pt-0.5">
                <div className="h-3 w-48 rounded skeleton" />
                <div className="h-2.5 w-32 rounded skeleton" />
                <div className="h-2.5 w-16 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="When people react to your posts or connect with you, it'll show here."
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          }
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {groups.map(group => (
              <div key={group.label}>
                {/* Group header */}
                <div className="px-4 py-2 bg-[var(--color-surface-raised)] border-y border-[var(--color-border)]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    {group.label}
                  </span>
                </div>

                {/* Items */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-[var(--color-border)]"
                >
                  {group.items.map(notif => (
                    <motion.div key={notif.id} variants={staggerItem}>
                      <NotificationItem
                        notification={notif}
                        onRead={markAsRead}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <div className="px-4 py-4 border-t border-[var(--color-border)] text-center">
                <button
                  onClick={fetchMore}
                  className="text-xs font-medium text-[var(--color-brand)] hover:underline"
                >
                  Load more notifications
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
