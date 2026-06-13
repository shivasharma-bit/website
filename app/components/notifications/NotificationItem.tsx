'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { cn, formatRelativeTime } from '../../lib/utils';
import type { Notification, NotificationType } from '../../types/core.types';

const TYPE_META: Record<NotificationType, { icon: React.ReactNode; color: string; label: string }> = {
  connection_request: {
    label: 'wants to connect',
    color: 'var(--color-brand)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    ),
  },
  connection_accepted: {
    label: 'accepted your request',
    color: 'var(--color-success)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <polyline points="16 11 18 13 22 9"/>
      </svg>
    ),
  },
  post_reaction: {
    label: 'reacted to your post',
    color: '#7C3AED',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
    ),
  },
  post_comment: {
    label: 'commented on your post',
    color: 'var(--color-accent)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  post_mention: {
    label: 'mentioned you',
    color: 'var(--color-accent)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
      </svg>
    ),
  },
  profile_view: {
    label: 'viewed your profile',
    color: 'var(--color-text-tertiary)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  endorsement: {
    label: 'endorsed your skill',
    color: 'var(--color-success)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
};

interface NotificationItemProps {
  notification: Notification;
  onRead:       (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const meta = TYPE_META[notification.type];

  function handleClick() {
    if (!notification.isRead) onRead(notification.id);
  }

  return (
    <Link
      href={notification.targetUrl}
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 px-4 py-3.5',
        'hover:bg-[var(--color-surface-raised)] transition-colors duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand)]',
        !notification.isRead && 'bg-[var(--color-brand-muted)]/40',
      )}
    >
      {/* Avatar with type badge */}
      <div className="relative shrink-0">
        <Avatar
          src={notification.actor.avatarUrl}
          name={notification.actor.displayName}
          size="md"
        />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--color-surface)]"
          style={{ background: meta.color, color: 'white' }}
        >
          {meta.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--color-text-primary)] leading-snug">
          <span className="font-semibold">{notification.actor.displayName}</span>
          {' '}
          <span className="text-[var(--color-text-secondary)]">{notification.excerpt ?? meta.label}</span>
        </p>
        <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
          {notification.actor.headline}
        </p>
        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <motion.span
          layoutId={`unread-${notification.id}`}
          className="w-2 h-2 rounded-full bg-[var(--color-brand)] shrink-0 mt-1.5"
        />
      )}
    </Link>
  );
}
