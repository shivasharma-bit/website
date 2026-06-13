'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatNumber } from '../../lib/utils';
import type { ReactionType, ReactionSummary } from '../../types/post.types';

const REACTION_META: Record<ReactionType, { label: string; color: string; icon: React.ReactNode }> = {
  insightful: {
    label: 'Insightful',
    color: '#1F3480',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
  },
  innovative: {
    label: 'Innovative',
    color: '#7C3AED',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  agree: {
    label: 'Agree',
    color: '#2D6A4F',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
    ),
  },
  support: {
    label: 'Support',
    color: '#B45309',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  celebrate: {
    label: 'Celebrate',
    color: '#F5A623',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
};

interface ReactionBarProps {
  reactions:      ReactionSummary[];
  totalReactions: number;
  userReaction:   ReactionType | null;
  commentCount:   number;
  repostCount:    number;
  isBookmarked:   boolean;
  onReact:        (type: ReactionType) => void;
  onComment:      () => void;
  onRepost:       () => void;
  onBookmark:     () => void;
  onShare:        () => void;
}

export function ReactionBar({
  reactions, totalReactions, userReaction,
  commentCount, repostCount, isBookmarked,
  onReact, onComment, onRepost, onBookmark, onShare,
}: ReactionBarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openPicker  = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    hoverTimer.current = setTimeout(() => setPickerOpen(false), 220);
  }, []);

  const handleReact = useCallback((type: ReactionType) => {
    onReact(type);
    setPickerOpen(false);
  }, [onReact]);

  const topReactions = reactions
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const currentMeta = userReaction ? REACTION_META[userReaction] : null;

  return (
    <div className="flex items-center justify-between pt-2.5 border-t border-[var(--color-border)]">

      {/* ── Left: reaction summary chips ───────────── */}
      <div className="flex items-center gap-1.5">
        {topReactions.length > 0 && (
          <div className="flex items-center gap-1">
            {topReactions.map(r => (
              <span
                key={r.type}
                title={r.label}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)]"
                style={{ color: REACTION_META[r.type].color }}
              >
                <span className="scale-75">{REACTION_META[r.type].icon}</span>
              </span>
            ))}
            <span className="text-xs text-[var(--color-text-tertiary)] ml-0.5">
              {formatNumber(totalReactions)}
            </span>
          </div>
        )}
      </div>

      {/* ── Right: action buttons ───────────────────── */}
      <div className="flex items-center gap-0.5">

        {/* React button + picker */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={openPicker}
          onMouseLeave={closePicker}
        >
          <button
            onClick={() => userReaction ? onReact(userReaction) : handleReact('insightful')}
            className={cn(
              'flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium',
              'transition-all duration-150 select-none',
              userReaction
                ? 'text-[var(--color-brand)] bg-[var(--color-brand-muted)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'
            )}
            aria-label={userReaction ? `Remove ${userReaction} reaction` : 'React'}
            aria-haspopup="true"
            aria-expanded={pickerOpen}
          >
            <span style={{ color: currentMeta?.color }}>
              {currentMeta?.icon ?? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
              )}
            </span>
            <span>{currentMeta?.label ?? 'React'}</span>
          </button>

          {/* Reaction picker popover */}
          <AnimatePresence>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.94 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'absolute bottom-full left-0 mb-2 z-30',
                  'flex items-center gap-1 p-1.5',
                  'bg-[var(--color-surface)] border border-[var(--color-border)]',
                  'rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)]',
                )}
                onMouseEnter={openPicker}
                onMouseLeave={closePicker}
                role="menu"
                aria-label="Reaction options"
              >
                {(Object.entries(REACTION_META) as [ReactionType, typeof REACTION_META[ReactionType]][]).map(([type, meta], i) => (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                    onClick={() => handleReact(type)}
                    title={meta.label}
                    role="menuitem"
                    className={cn(
                      'relative flex items-center justify-center w-9 h-9 rounded-xl',
                      'transition-all duration-150 group',
                      'hover:scale-125 hover:bg-[var(--color-surface-raised)]',
                      userReaction === type && 'bg-[var(--color-brand-muted)] scale-110'
                    )}
                    style={{ color: meta.color }}
                  >
                    {meta.icon}
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-[10px] font-medium text-white bg-[var(--color-neutral-800,#1E1C18)] px-2 py-0.5 rounded-md">
                      {meta.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment */}
        <button
          onClick={onComment}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-all duration-150"
          aria-label={`${commentCount} comments`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {commentCount > 0 && <span>{formatNumber(commentCount)}</span>}
        </button>

        {/* Repost */}
        <button
          onClick={onRepost}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-all duration-150"
          aria-label={`${repostCount} reposts`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          {repostCount > 0 && <span>{formatNumber(repostCount)}</span>}
        </button>

        {/* Bookmark */}
        <button
          onClick={onBookmark}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150',
            isBookmarked
              ? 'text-[var(--color-accent)] bg-[var(--color-accent-muted)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'
          )}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          aria-pressed={isBookmarked}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-all duration-150"
          aria-label="Share post"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
