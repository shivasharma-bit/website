'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '../shared/Avatar';
import { cn, formatNumber } from '../../lib/utils';
import type { Thread } from '../../types/message.types';

interface ConnectionContextPanelProps {
  thread:    Thread;
  className?: string;
}

export function ConnectionContextPanel({ thread, className }: ConnectionContextPanelProps) {
  const other = thread.participants[0];
  if (!other) return null;

  return (
    <aside className={cn(
      'w-64 shrink-0 border-l border-[var(--color-border)] overflow-y-auto',
      'bg-[var(--color-surface)] scrollbar-hidden',
      className,
    )}>
      <div className="p-4 space-y-5">
        {/* Profile summary */}
        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <Avatar
            src={other.avatarUrl}
            name={other.displayName}
            size="lg"
            onlineStatus={other.onlineStatus}
          />
          <div>
            <Link
              href={`/profile/${other.username}`}
              className="text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors"
            >
              {other.displayName}
            </Link>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{other.headline}</p>
          </div>
          <Link
            href={`/profile/${other.username}`}
            className="btn btn-secondary h-7 text-xs"
          >
            View profile
          </Link>
        </div>

        {/* Mutual connections */}
        {thread.mutualCount > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
              Mutual connections
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80',
                ].map((url, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full overflow-hidden border-2 border-[var(--color-surface)] bg-[var(--color-surface-raised)]"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {thread.mutualCount} mutual
              </span>
            </div>
          </div>
        )}

        {/* Connection metadata */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            About this conversation
          </p>
          {[
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ),
              label: 'Connected',
              value: new Date(thread.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
              label: 'Mutual connections',
              value: thread.mutualCount,
            },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="text-[var(--color-text-tertiary)] shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[var(--color-text-tertiary)]">{item.label}</p>
                <p className="text-xs text-[var(--color-text-primary)] font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-1.5 pt-1 border-t border-[var(--color-border)]">
          {[
            { label: 'Mute notifications' },
            { label: 'Mark as unread'     },
            { label: 'Archive'            },
            { label: 'Block',     danger: true },
            { label: 'Report',    danger: true },
          ].map(action => (
            <button
              key={action.label}
              className={cn(
                'w-full text-left px-2 py-1.5 rounded-[var(--radius-md)] text-xs transition-colors',
                action.danger
                  ? 'text-[var(--color-error)] hover:bg-[var(--color-error-muted)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
