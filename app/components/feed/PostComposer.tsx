'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import type { Post, PostType } from '../../types/post.types';

interface PostComposerProps {
  onPost?: (post: Post) => void;
}

type ComposerMode = 'update' | 'case_study' | 'carousel' | 'poll';

const MODES: { id: ComposerMode; label: string; icon: React.ReactNode }[] = [
  {
    id: 'update',
    label: 'Update',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: 'case_study',
    label: 'Case study',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
  },
  {
    id: 'carousel',
    label: 'Carousel',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    id: 'poll',
    label: 'Poll',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

// ─── Poll builder ─────────────────────────────────────────────────────────────

function PollBuilder({ options, onChange }: {
  options: string[];
  onChange: (opts: string[]) => void;
}) {
  function updateOption(i: number, val: string) {
    const next = [...options];
    next[i] = val;
    onChange(next);
  }

  function addOption() {
    if (options.length < 4) onChange([...options, '']);
  }

  function removeOption(i: number) {
    onChange(options.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-[var(--color-border)] shrink-0" />
          <input
            type="text"
            value={opt}
            onChange={e => updateOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            maxLength={80}
            className="input-base flex-1 h-8 text-sm px-3"
          />
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(i)}
              className="w-6 h-6 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors"
              aria-label="Remove option"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      ))}
      {options.length < 4 && (
        <button
          type="button"
          onClick={addOption}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-brand)] hover:underline"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add option
        </button>
      )}
    </div>
  );
}

// ─── Main composer ────────────────────────────────────────────────────────────

export function PostComposer({ onPost }: PostComposerProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded]   = useState(false);
  const [mode,       setMode]         = useState<ComposerMode>('update');
  const [body,       setBody]         = useState('');
  const [pollOpts,   setPollOpts]     = useState(['', '']);
  const [audience,   setAudience]     = useState<'public' | 'connections'>('public');
  const [isPosting,  setIsPosting]    = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const CHAR_LIMIT = 3000;
  const remaining  = CHAR_LIMIT - body.length;
  const isOverLimit = remaining < 0;
  const canPost = body.trim().length > 0 && !isOverLimit && !isPosting;

  function autoResize() {
    const el = textareaRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  }

  function handleExpand() {
    setIsExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 60);
  }

  function handleCancel() {
    setIsExpanded(false);
    setBody('');
    setPollOpts(['', '']);
    setMode('update');
  }

  async function handleSubmit() {
    if (!canPost || !user) return;
    setIsPosting(true);
    await new Promise(r => setTimeout(r, 600));

    // In production: call feedService.createPost()
    const newPost: Partial<Post> = {
      id:   `post_new_${Date.now()}`,
      type: mode,
      body,
      audience,
    };

    setIsPosting(false);
    handleCancel();
    // onPost?.(newPost as Post);
  }

  if (!user) return null;

  return (
    <motion.div
      layout
      className="card overflow-hidden"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Collapsed state ───────────────────────────── */}
      {!isExpanded ? (
        <div className="flex items-center gap-3 p-3 md:p-4">
          <Avatar src={user.avatarUrl} name={user.displayName} size="sm" className="shrink-0" />
          <button
            onClick={handleExpand}
            className={cn(
              'flex-1 text-left h-10 px-4 rounded-full',
              'bg-[var(--color-surface-raised)] border border-[var(--color-border)]',
              'text-sm text-[var(--color-text-tertiary)]',
              'hover:border-[var(--color-brand-muted)] hover:bg-[var(--color-brand-muted)]',
              'transition-all duration-150',
            )}
            aria-label="Create a post"
          >
            Share an update, case study, or insight...
          </button>

          {/* Quick media button */}
          <button
            onClick={handleExpand}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-brand)] transition-colors"
            aria-label="Add media"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
        </div>
      ) : (
        /* ── Expanded state ─────────────────────────── */
        <div className="p-4">
          {/* Mode tabs */}
          <div className="flex items-center gap-1 mb-4 border-b border-[var(--color-border)] pb-3">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  'flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium',
                  'transition-all duration-150',
                  mode === m.id
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
                )}
              >
                {m.icon}
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Avatar src={user.avatarUrl} name={user.displayName} size="sm" className="shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0">
              {/* Audience selector */}
              <button
                onClick={() => setAudience(a => a === 'public' ? 'connections' : 'public')}
                className="flex items-center gap-1 mb-2 h-6 px-2 rounded-full border border-[var(--color-border)] text-[10px] font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-all"
              >
                {audience === 'public' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                )}
                <span className="capitalize">{audience}</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Text area */}
              <textarea
                ref={textareaRef}
                value={body}
                onChange={e => { setBody(e.target.value); autoResize(); }}
                placeholder={
                  mode === 'update'     ? "What's on your mind?"            :
                  mode === 'case_study' ? "Describe the problem you solved..." :
                  mode === 'carousel'   ? "Add a caption for this carousel..."  :
                  "Ask your network a question..."
                }
                rows={3}
                className={cn(
                  'w-full resize-none bg-transparent border-0 outline-none',
                  'text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
                  'leading-relaxed min-h-[72px] mb-3',
                )}
                style={{ overflow: 'hidden' }}
              />

              {/* Poll options */}
              <AnimatePresence>
                {mode === 'poll' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
                  >
                    <PollBuilder options={pollOpts} onChange={setPollOpts} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toolbar + submit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[
                    { label: 'Add image', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>) },
                    { label: 'Tag someone', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>) },
                    { label: 'Add emoji', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>) },
                  ].map(tool => (
                    <button
                      key={tool.label}
                      type="button"
                      aria-label={tool.label}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)] transition-all"
                    >
                      {tool.icon}
                    </button>
                  ))}

                  {/* Character counter */}
                  {body.length > CHAR_LIMIT * 0.8 && (
                    <span className={cn(
                      'text-[10px] font-mono ml-1',
                      isOverLimit ? 'text-[var(--color-error)]' : 'text-[var(--color-text-tertiary)]',
                    )}>
                      {remaining}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="h-8 px-3 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canPost}
                    className={cn(
                      'h-8 px-4 rounded-lg text-xs font-semibold transition-all duration-150',
                      'bg-[var(--color-brand)] text-white',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      'hover:bg-[var(--color-brand-hover)] active:scale-95',
                    )}
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
