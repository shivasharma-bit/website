'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { cn, formatRelativeTime, formatNumber } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { Comment } from '../../types/post.types';
import { useAuth } from '../../context/AuthContext';

// ─── Mock comment generator ───────────────────────────────────────────────────

function makeMockComments(postId: string): Comment[] {
  const base: Comment[] = [
    {
      id: 'c1', postId, parentId: null,
      author: { id: 'u10', username: 'james.okafor', displayName: 'James Okafor', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', headline: 'Sr. Engineer at Vercel' },
      body: 'This is exactly what we needed — the semantic alias approach solves the drift problem elegantly. How did you handle dark mode token overrides?',
      likes: 14, isLiked: false,
      replies: [
        {
          id: 'c1r1', postId, parentId: 'c1',
          author: { id: 'u11', username: 'priya.sundaram', displayName: 'Priya Sundaram', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', headline: 'Product Lead at Linear' },
          body: 'Seconding this — dark mode is the hard part. We ended up with a separate theme token layer rather than inverting everything.',
          likes: 6, isLiked: false, replies: [],
          createdAt: new Date(Date.now() - 35 * 60_000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 90 * 60_000).toISOString(),
    },
    {
      id: 'c2', postId, parentId: null,
      author: { id: 'u12', username: 'tom.eriksson', displayName: 'Tom Eriksson', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', headline: 'Founder at Loom' },
      body: 'We went through a similar migration last year. The hardest part was getting engineers to stop hardcoding hex values in components. Any advice there?',
      likes: 8, isLiked: false, replies: [],
      createdAt: new Date(Date.now() - 55 * 60_000).toISOString(),
    },
  ];
  return base;
}

// ─── Single comment ───────────────────────────────────────────────────────────

interface CommentItemProps {
  comment:    Comment;
  depth:      number;
  onReply:    (parentId: string, authorName: string) => void;
}

function CommentItem({ comment, depth, onReply }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likes,   setLikes]   = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(true);

  function handleLike() {
    setIsLiked(prev => !prev);
    setLikes(prev => prev + (isLiked ? -1 : 1));
  }

  return (
    <motion.div variants={staggerItem} className={cn('flex gap-2.5', depth > 0 && 'ml-8 mt-2')}>
      <Avatar
        src={comment.author.avatarUrl}
        name={comment.author.displayName}
        size="xs"
        className="shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="inline-block max-w-full">
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] rounded-tl-sm px-3 py-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
                {comment.author.displayName}
              </span>
              <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap">
                {comment.author.headline}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-primary)] mt-0.5 leading-relaxed">
              {comment.body}
            </p>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-3 mt-1 px-1">
          <button
            onClick={handleLike}
            className={cn(
              'text-[10px] font-semibold transition-colors',
              isLiked
                ? 'text-[var(--color-brand)]'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
            )}
          >
            {isLiked ? 'Liked' : 'Like'}{likes > 0 && ` · ${formatNumber(likes)}`}
          </button>
          <button
            onClick={() => onReply(comment.id, comment.author.displayName)}
            className="text-[10px] font-semibold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            Reply
          </button>
          <span className="text-[10px] text-[var(--color-text-tertiary)]">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        {/* Nested replies */}
        {comment.replies.length > 0 && depth === 0 && (
          <div className="mt-2">
            {!showReplies ? (
              <button
                onClick={() => setShowReplies(true)}
                className="text-xs font-medium text-[var(--color-brand)] hover:underline ml-1"
              >
                Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
                  ))}
                  <button
                    onClick={() => setShowReplies(false)}
                    className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] ml-8 transition-colors"
                  >
                    Hide replies
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface CommentThreadProps {
  postId:     string;
  isExpanded: boolean;
}

export function CommentThread({ postId, isExpanded }: CommentThreadProps) {
  const { user } = useAuth();
  const [comments,     setComments]     = useState<Comment[]>(() => makeMockComments(postId));
  const [replyTarget,  setReplyTarget]  = useState<{ id: string; name: string } | null>(null);
  const [inputValue,   setInputValue]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleReply = useCallback((parentId: string, authorName: string) => {
    setReplyTarget({ id: parentId, name: authorName });
    setInputValue(`@${authorName} `);
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;
    setIsSubmitting(true);

    await new Promise(r => setTimeout(r, 400));

    const newComment: Comment = {
      id:        `c_${Date.now()}`,
      postId,
      parentId:  replyTarget?.id ?? null,
      author: {
        id:          user.id,
        username:    user.username,
        displayName: user.displayName,
        avatarUrl:   user.avatarUrl,
        headline:    user.headline,
      },
      body:      inputValue.trim(),
      likes:     0,
      isLiked:   false,
      replies:   [],
      createdAt: new Date().toISOString(),
    };

    if (replyTarget) {
      setComments(prev => prev.map(c =>
        c.id === replyTarget.id
          ? { ...c, replies: [...c.replies, newComment] }
          : c
      ));
    } else {
      setComments(prev => [...prev, newComment]);
    }

    setInputValue('');
    setReplyTarget(null);
    setIsSubmitting(false);
  }

  if (!isExpanded) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="pt-3 space-y-3 border-t border-[var(--color-border)]">
          {/* Existing comments */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {comments.map(c => (
              <CommentItem key={c.id} comment={c} depth={0} onReply={handleReply} />
            ))}
          </motion.div>

          {/* Composer */}
          {user && (
            <form onSubmit={handleSubmit} className="flex gap-2.5 items-start">
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="xs"
                className="shrink-0 mt-1"
              />
              <div className="flex-1 relative">
                {replyTarget && (
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[var(--color-text-secondary)]">
                    <span>Replying to <span className="font-medium text-[var(--color-brand)]">@{replyTarget.name}</span></span>
                    <button
                      type="button"
                      onClick={() => { setReplyTarget(null); setInputValue(''); }}
                      className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Write a comment..."
                    className={cn(
                      'flex-1 h-8 px-3 rounded-full text-xs',
                      'bg-[var(--color-surface-raised)] border border-[var(--color-border)]',
                      'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent',
                      'transition-all duration-150',
                    )}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSubmitting}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                      'bg-[var(--color-brand)] text-white transition-all duration-150',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      'hover:bg-[var(--color-brand-hover)] active:scale-95',
                    )}
                    aria-label="Post comment"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
