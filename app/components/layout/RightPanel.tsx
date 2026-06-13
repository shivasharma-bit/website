'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { VerifiedBadge } from '../shared/Primitives';
import { cn, formatNumber, sleep } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { User } from '../../types/core.types';

// ─── Mock suggested users ─────────────────────────────────────────────────────

const SUGGESTED_USERS: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'headline' | 'isVerified' | 'followersCount'>[] = [
  { id: 'u10', username: 'james.okafor',   displayName: 'James Okafor',   avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', headline: 'Sr. Engineer at Vercel',      isVerified: false, followersCount: 8_420  },
  { id: 'u11', username: 'priya.sundaram', displayName: 'Priya Sundaram', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', headline: 'Product Lead at Linear',      isVerified: true,  followersCount: 22_100 },
  { id: 'u12', username: 'tom.eriksson',   displayName: 'Tom Eriksson',   avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', headline: 'Founder at Loom',             isVerified: true,  followersCount: 41_500 },
  { id: 'u13', username: 'arjun.mehta',    displayName: 'Arjun Mehta',    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', headline: 'Staff Designer at Notion',   isVerified: false, followersCount: 5_900  },
];

const TRENDING_TOPICS = [
  { tag: 'DesignSystems',   postCount: 2_840 },
  { tag: 'AIProducts',       postCount: 14_200 },
  { tag: 'BuildInPublic',    postCount: 7_630  },
  { tag: 'FrontendDev',      postCount: 9_100  },
  { tag: 'ProductStrategy',  postCount: 3_420  },
];

export function RightPanel() {
  const [followed,  setFollowed]  = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sleep(700).then(() => setIsLoading(false));
  }, []);

  function handleFollow(userId: string) {
    setFollowed(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col gap-5',
        'w-[var(--right-panel-width)] shrink-0',
        'pt-[calc(var(--navbar-height)+1.5rem)]',
        'sticky top-0 h-screen overflow-y-auto scrollbar-hidden',
      )}
    >
      {/* ── Who to follow ─────────────────────────── */}
      <div
        className={cn(
          'rounded-[var(--radius-card)] border border-[var(--color-border)]',
          'bg-[var(--color-surface)] overflow-hidden',
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            People to follow
          </h2>
          <Link
            href="/explore"
            className="text-xs text-[var(--color-brand)] hover:underline focus-visible:outline-none"
          >
            See all
          </Link>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full skeleton" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-28 rounded skeleton" />
                  <div className="h-2.5 w-20 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="divide-y divide-[var(--color-border)]"
          >
            {SUGGESTED_USERS.map(u => (
              <motion.li
                key={u.id}
                variants={staggerItem}
                className="flex items-center gap-3 px-4 py-3"
              >
                <Link href={`/profile/${u.username}`} className="shrink-0">
                  <Avatar src={u.avatarUrl} name={u.displayName} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${u.username}`} className="block hover:underline focus-visible:outline-none">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {u.displayName}
                      </span>
                      {u.isVerified && <VerifiedBadge size="sm" />}
                    </div>
                  </Link>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">
                    {u.headline}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                    {formatNumber(u.followersCount)} followers
                  </p>
                </div>
                <button
                  onClick={() => handleFollow(u.id)}
                  className={cn(
                    'shrink-0 h-7 px-3 rounded-full text-xs font-medium',
                    'border transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
                    followed.has(u.id)
                      ? 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-red-300 hover:text-red-500'
                      : 'border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white',
                  )}
                >
                  {followed.has(u.id) ? 'Following' : 'Follow'}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* ── Trending topics ───────────────────────── */}
      <div
        className={cn(
          'rounded-[var(--radius-card)] border border-[var(--color-border)]',
          'bg-[var(--color-surface)] overflow-hidden',
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Trending this week
          </h2>
        </div>

        <ul className="divide-y divide-[var(--color-border)]">
          {TRENDING_TOPICS.map((topic, i) => (
            <li key={topic.tag}>
              <Link
                href={`/explore?topic=${topic.tag}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-raised)] transition-colors duration-150 focus-visible:outline-none group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[var(--color-text-tertiary)] w-4 tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                      #{topic.tag}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {formatNumber(topic.postCount)} posts
                    </p>
                  </div>
                </div>
                <svg
                  className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
