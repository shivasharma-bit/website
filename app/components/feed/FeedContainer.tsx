'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { PostCard }           from './PostCard';
import { SkeletonCard, EmptyState } from '../shared/Primitives';
import { useFeed }            from '../../hooks/useFeed';
import { useInfiniteScroll }  from '../../hooks/useInfiniteScroll';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { Post, ReactionType } from '../../types/post.types';
import { cn } from '../../lib/utils';

interface FeedContainerProps {
  className?: string;
}

export function FeedContainer({ className }: FeedContainerProps) {
  const {
    posts, isLoading, isLoadingMore, hasMore, error,
    loadMore, refresh, reactToPost, bookmarkPost,
  } = useFeed();

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading:  isLoadingMore,
  });

  const handleReact = useCallback((postId: string, type: ReactionType) => {
    reactToPost(postId, type);
  }, [reactToPost]);

  const handleBookmark = useCallback((postId: string) => {
    bookmarkPost(postId);
  }, [bookmarkPost]);

  // ── Error state ─────────────────────────────────
  if (error && posts.length === 0) {
    return (
      <div className={cn('card', className)}>
        <EmptyState
          title="Could not load feed"
          description={error}
          action={
            <button
              onClick={refresh}
              className="btn btn-secondary text-sm h-9"
            >
              Try again
            </button>
          }
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          }
        />
      </div>
    );
  }

  // ── Loading skeleton ─────────────────────────────
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={3} hasAvatar hasImage={i % 2 === 0} />
        ))}
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────
  if (posts.length === 0) {
    return (
      <div className={cn('card', className)}>
        <EmptyState
          title="Your feed is empty"
          description="Follow people and topics to see their updates here."
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          }
          action={
            <button className="btn btn-primary text-sm h-9">
              Explore people to follow
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* ── Post list ─────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {posts.map(post => (
          <motion.div key={post.id} variants={staggerItem}>
            <PostCard
              post={post}
              onReact={handleReact}
              onBookmark={handleBookmark}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Infinite scroll sentinel ──────────────── */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="h-4"
      />

      {/* ── Loading more indicator ────────────────── */}
      {isLoadingMore && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={`more_${i}`} lines={3} hasAvatar hasImage={i === 0} />
          ))}
        </div>
      )}

      {/* ── End of feed ───────────────────────────── */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            You're all caught up
          </p>
          <div className="w-8 h-px bg-[var(--color-border)] mx-auto mt-2" />
        </div>
      )}
    </div>
  );
}
