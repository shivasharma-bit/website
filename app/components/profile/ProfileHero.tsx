'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { VerifiedBadge } from '../shared/Primitives';
import { cn, formatNumber } from '../../lib/utils';
import type { User } from '../../types/core.types';
import { useAuth } from '../../context/AuthContext';

interface ProfileHeroProps {
  user:        User;
  isFollowing: boolean;
  onFollow:    () => void;
  isLoading?:  boolean;
}

export function ProfileHero({ user, isFollowing, onFollow, isLoading }: ProfileHeroProps) {
  const { user: authUser } = useAuth();
  const isOwnProfile = authUser?.id === user.id;
  const [coverError, setCoverError] = useState(false);

  return (
    <div className="card overflow-hidden">
      {/* ── Cover image ───────────────────────────────── */}
      <div className="relative h-36 md:h-52 bg-gradient-to-br from-[var(--color-brand-muted)] to-[var(--color-surface-raised)] overflow-hidden">
        {user.coverUrl && !coverError ? (
          <img
            src={user.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-muted)] via-[var(--color-surface-raised)] to-[var(--color-brand-muted)]" />
        )}

        {/* Edit cover button — own profile only */}
        {isOwnProfile && (
          <button
            className={cn(
              'absolute bottom-3 right-3',
              'flex items-center gap-1.5 h-7 px-3 rounded-full',
              'bg-black/40 hover:bg-black/60 text-white text-xs font-medium',
              'backdrop-blur-sm transition-colors',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Edit cover
          </button>
        )}
      </div>

      {/* ── Identity strip ────────────────────────────── */}
      <div className="px-4 md:px-6 pb-4 md:pb-5">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-10 md:-mt-14 mb-3">
          <div className="relative">
            <div className={cn(
              'rounded-full border-4 border-[var(--color-surface)]',
              'bg-[var(--color-surface)]',
              user.isOpenToWork  && 'ring-4 ring-emerald-500/40',
              user.isHiring      && !user.isOpenToWork && 'ring-4 ring-[var(--color-accent)]/40',
            )}>
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="2xl"
                onlineStatus={user.onlineStatus}
                isOpenToWork={user.isOpenToWork}
                isHiring={user.isHiring}
              />
            </div>

            {/* Open-to-work / hiring badge */}
            {(user.isOpenToWork || user.isHiring) && (
              <span className={cn(
                'absolute -bottom-1 left-1/2 -translate-x-1/2',
                'whitespace-nowrap text-[9px] font-semibold uppercase tracking-wide',
                'px-2 py-0.5 rounded-full border',
                user.isOpenToWork
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-[var(--color-accent-muted)] border-[var(--color-accent)]/30 text-[var(--color-accent)]',
              )}>
                {user.isOpenToWork ? 'Open to work' : 'Hiring'}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-1">
            {isOwnProfile ? (
              <>
                <Link
                  href="/settings/profile"
                  className="btn btn-secondary h-9 text-sm"
                >
                  Edit profile
                </Link>
                <Link
                  href="/create"
                  className="btn btn-primary h-9 text-sm"
                >
                  Post
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/messages?new=${user.id}`}
                  className="btn btn-secondary h-9 text-sm gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Message
                </Link>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onFollow}
                  disabled={isLoading}
                  className={cn(
                    'btn h-9 text-sm transition-all duration-150',
                    isFollowing
                      ? 'btn-secondary hover:border-red-300 hover:text-red-500'
                      : 'btn-primary',
                  )}
                >
                  {isFollowing ? 'Following' : '+ Follow'}
                </motion.button>
                {/* Connect button if 2nd/3rd degree */}
                {(user.degree === '2nd' || user.degree === '3rd') && (
                  <button className="btn btn-secondary h-9 text-sm">
                    Connect
                  </button>
                )}
              </>
            )}

            {/* More menu */}
            <button
              className="w-9 h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] transition-colors"
              aria-label="More options"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1" fill="currentColor"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="12" cy="19" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Name + headline */}
        <div className="mt-2 md:mt-3 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-display font-semibold text-[var(--color-text-primary)] tracking-tight">
              {user.displayName}
            </h1>
            {user.isVerified && <VerifiedBadge size="md" />}
            {user.pronouns && (
              <span className="text-sm text-[var(--color-text-tertiary)]">
                {user.pronouns}
              </span>
            )}
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] leading-snug">
            {user.headline}
          </p>

          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {user.location && (
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[var(--color-brand)] hover:underline"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-border)]">
          {[
            { label: 'Followers',    value: user.followersCount   },
            { label: 'Following',    value: user.followingCount   },
            { label: 'Connections',  value: user.connectionsCount },
          ].map(stat => (
            <button
              key={stat.label}
              className="flex items-baseline gap-1.5 hover:text-[var(--color-brand)] transition-colors group"
            >
              <span className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                {formatNumber(stat.value)}
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {stat.label}
              </span>
            </button>
          ))}

          {/* Connection degree */}
          {user.degree && user.degree !== null && !isOwnProfile && (
            <span className="ml-auto badge badge-brand text-[10px]">
              {user.degree} degree
            </span>
          )}

          {/* Mutual connections */}
          {user.mutualConnections.length > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="flex -space-x-1.5">
                {user.mutualConnections.slice(0, 3).map(m => (
                  <Avatar key={m.id} src={m.avatarUrl} name={m.displayName} size="xs" className="ring-2 ring-[var(--color-surface)]" />
                ))}
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {user.mutualConnections.length} mutual
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
