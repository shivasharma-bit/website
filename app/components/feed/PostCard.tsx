'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { VerifiedBadge } from '../shared/Primitives';
import { MediaCarousel } from './MediaCarousel';
import { ReactionBar } from './ReactionBar';
import { CommentThread } from './CommentThread';
import { cn, formatRelativeTime, truncate } from '../../lib/utils';
import { hoverLift } from '../../lib/transitions';
import type { Post, ReactionType } from '../../types/post.types';
import { useAuth } from '../../context/AuthContext';

interface PostCardProps {
  post:        Post;
  onReact:     (postId: string, type: ReactionType) => void;
  onBookmark:  (postId: string) => void;
  onShare?:    (post: Post) => void;
  className?:  string;
}

const BODY_TRUNCATE_LEN = 280;

export function PostCard({ post, onReact, onBookmark, onShare, className }: PostCardProps) {
  const { user }                          = useAuth();
  const [expanded,     setExpanded]       = useState(false);
  const [commentOpen,  setCommentOpen]    = useState(false);
  const [menuOpen,     setMenuOpen]       = useState(false);
  const [reposted,     setReposted]       = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const needsTruncation = post.body.length > BODY_TRUNCATE_LEN;
  const displayBody     = expanded || !needsTruncation
    ? post.body
    : truncate(post.body, BODY_TRUNCATE_LEN);

  // Close menu on outside click
  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleReact = useCallback(() => {
    onReact(post.id, 'insightful');
  }, [post.id, onReact]);

  const handleRepost = useCallback(() => {
    setReposted(prev => !prev);
  }, []);

  const isOwnPost = user?.id === post.author.id;

  return (
    <motion.article
      {...hoverLift}
      className={cn(
        'card p-4 md:p-5',
        'transition-shadow duration-200',
        className,
      )}
      aria-label={`Post by ${post.author.displayName}`}
    >
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <Link href={`/profile/${post.author.username}`} className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] rounded-full">
            <Avatar
              src={post.author.avatarUrl}
              name={post.author.displayName}
              size="md"
            />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/profile/${post.author.username}`}
                className="text-sm font-semibold text-[var(--color-text-primary)] hover:underline truncate focus-visible:outline-none"
              >
                {post.author.displayName}
              </Link>
              {post.author.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {post.author.headline}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[var(--color-text-tertiary)]">
                {formatRelativeTime(post.createdAt)}
              </span>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">·</span>
              <span className="text-[10px] text-[var(--color-text-tertiary)]" title={`Visible to: ${post.audience}`}>
                {post.audience === 'public' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Overflow menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-colors"
            aria-label="Post options"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1,    y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 2 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-1 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)] overflow-hidden z-20"
                role="menu"
              >
                {[
                  { label: 'Save post',       action: () => { onBookmark(post.id); setMenuOpen(false); } },
                  { label: 'Copy link',       action: () => { setMenuOpen(false); } },
                  { label: 'Follow author',   action: () => { setMenuOpen(false); } },
                  ...(isOwnPost ? [
                    { label: 'Edit post',     action: () => { setMenuOpen(false); } },
                    { label: 'Delete post',   action: () => { setMenuOpen(false); }, danger: true },
                  ] : [
                    { label: 'Report post',   action: () => { setMenuOpen(false); }, danger: true },
                  ]),
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    role="menuitem"
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs transition-colors',
                      item.danger
                        ? 'text-[var(--color-error)] hover:bg-[var(--color-error-muted)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Body text ────────────────────────────────── */}
      {post.body && (
        <div className="mb-3">
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">
            {displayBody}
          </p>
          {needsTruncation && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-1 text-xs font-medium text-[var(--color-brand)] hover:underline"
            >
              {expanded ? 'Show less' : '...more'}
            </button>
          )}
        </div>
      )}

      {/* ── Tags ─────────────────────────────────────── */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/explore?topic=${tag}`}
              className="text-xs text-[var(--color-brand)] hover:underline"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* ── Media ────────────────────────────────────── */}
      {post.media.length > 0 && (
        <div className="mb-3 -mx-0">
          <MediaCarousel items={post.media} />
        </div>
      )}

      {/* ── Repost indicator ─────────────────────────── */}
      {reposted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-3 flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          </svg>
          <span>Reposted</span>
        </motion.div>
      )}

      {/* ── Reaction bar ─────────────────────────────── */}
      <ReactionBar
        reactions={post.reactions}
        totalReactions={post.totalReactions}
        userReaction={post.userReaction}
        commentCount={post.commentCount}
        repostCount={post.repostCount}
        isBookmarked={post.isBookmarked}
        onReact={(type) => onReact(post.id, type)}
        onComment={() => setCommentOpen(v => !v)}
        onRepost={handleRepost}
        onBookmark={() => onBookmark(post.id)}
        onShare={() => onShare?.(post)}
      />

      {/* ── Comment thread ────────────────────────────── */}
      <CommentThread postId={post.id} isExpanded={commentOpen} />
    </motion.article>
  );
}
