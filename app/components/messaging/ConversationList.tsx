'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { cn, formatRelativeTime, truncate } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../context/AuthContext';
import type { Thread } from '../../types/message.types';

type FilterTab = 'all' | 'active' | 'requests';

export function ConversationList() {
  const { user }                    = useAuth();
  const { threads, isLoading }      = useMessages();
  const pathname                    = usePathname();
  const [search,    setSearch]      = useState('');
  const [activeTab, setActiveTab]   = useState<FilterTab>('all');

  const filtered = useMemo(() => {
    let list = threads;
    if (activeTab === 'active')   list = list.filter(t => t.status === 'active');
    if (activeTab === 'requests') list = list.filter(t => t.status === 'request');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.participants.some(p => p.displayName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [threads, activeTab, search]);

  const requestCount = threads.filter(t => t.status === 'request').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-semibold text-[var(--color-text-primary)]">Messages</h1>
          <Link
            href="/messages/new"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-brand)] transition-colors"
            aria-label="New message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations"
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mt-2.5">
          {(['all', 'active', 'requests'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10px] font-medium capitalize transition-all',
                activeTab === tab
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]',
              )}
            >
              {tab}
              {tab === 'requests' && requestCount > 0 && (
                <span className={cn(
                  'min-w-[14px] h-3.5 px-1 rounded-full text-[9px] font-bold flex items-center justify-center',
                  activeTab === tab ? 'bg-white/30 text-white' : 'bg-[var(--color-accent)] text-white',
                )}>
                  {requestCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-2">
                <div className="w-10 h-10 rounded-full skeleton shrink-0" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-3 w-28 rounded skeleton" />
                  <div className="h-2.5 w-full rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">No conversations found</p>
          </div>
        ) : (
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="py-1"
          >
            {filtered.map(thread => (
              <motion.li key={thread.id} variants={staggerItem}>
                <ThreadItem
                  thread={thread}
                  currentUserId={user?.id ?? ''}
                  isActive={pathname === `/messages/${thread.id}`}
                />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
}

function ThreadItem({
  thread,
  currentUserId,
  isActive,
}: {
  thread: Thread;
  currentUserId: string;
  isActive: boolean;
}) {
  const other = thread.participants[0];
  if (!other) return null;

  const isUnread  = thread.unreadCount > 0;
  const isMine    = thread.lastMessage?.senderId === currentUserId;
  const preview   = thread.lastMessage
    ? (isMine ? `You: ${thread.lastMessage.body}` : thread.lastMessage.body)
    : 'No messages yet';

  return (
    <Link
      href={`/messages/${thread.id}`}
      className={cn(
        'flex items-center gap-3 px-4 py-3 transition-colors duration-100',
        'hover:bg-[var(--color-surface-raised)]',
        isActive && 'bg-[var(--color-brand-muted)] hover:bg-[var(--color-brand-muted)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand)]',
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={other.avatarUrl}
          name={other.displayName}
          size="md"
          onlineStatus={other.onlineStatus}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'text-sm truncate',
            isUnread ? 'font-semibold text-[var(--color-text-primary)]' : 'font-medium text-[var(--color-text-primary)]',
          )}>
            {other.displayName}
          </span>
          {thread.lastMessage && (
            <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0">
              {formatRelativeTime(thread.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-xs truncate',
            isUnread ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]',
          )}>
            {truncate(preview, 50)}
          </p>
          {isUnread && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-[var(--color-brand)] text-white text-[9px] font-bold flex items-center justify-center">
              {thread.unreadCount}
            </span>
          )}
        </div>
        {thread.status === 'request' && (
          <span className="inline-block mt-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-accent)] bg-[var(--color-accent-muted)] px-1.5 py-0.5 rounded">
            Message request
          </span>
        )}
      </div>
    </Link>
  );
}
