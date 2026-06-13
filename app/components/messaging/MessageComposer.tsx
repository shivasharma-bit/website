'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../lib/utils';

interface MessageComposerProps {
  onSend:     (body: string, mediaUrl?: string) => Promise<void>;
  isSending:  boolean;
  disabled?:  boolean;
}

export function MessageComposer({ onSend, isSending, disabled }: MessageComposerProps) {
  const [body,        setBody]        = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  const handleSend = useCallback(async () => {
    const trimmed = body.trim();
    if (!trimmed || isSending || disabled) return;
    setBody('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await onSend(trimmed);
  }, [body, isSending, disabled, onSend]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = body.trim().length > 0 && !isSending && !disabled;

  return (
    <div className={cn(
      'border-t border-[var(--color-border)] bg-[var(--color-surface)]',
      'px-3 py-2.5',
    )}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-2">
        {[
          { label: 'Attach image', icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>) },
          { label: 'Attach file',  icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>) },
          { label: 'Share a post', icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>) },
        ].map(tool => (
          <button
            key={tool.label}
            aria-label={tool.label}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)] transition-all"
          >
            {tool.icon}
          </button>
        ))}
        <div className="flex-1" />
        {/* Voice note */}
        <button
          aria-label={isRecording ? 'Stop recording' : 'Record voice note'}
          onClick={() => setIsRecording(v => !v)}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded-lg transition-all',
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)]',
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={e => { setBody(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          rows={1}
          disabled={disabled}
          className={cn(
            'flex-1 resize-none rounded-2xl border border-[var(--color-border)]',
            'bg-[var(--color-surface-raised)] px-3.5 py-2',
            'text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent',
            'transition-all leading-relaxed',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[38px] max-h-[120px] overflow-y-auto',
          )}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
            'transition-all duration-150 active:scale-95',
            canSend
              ? 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] shadow-lg shadow-[var(--color-brand)]/20'
              : 'bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)] cursor-not-allowed',
          )}
          aria-label="Send message"
        >
          {isSending ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>

      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1.5 text-center">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
