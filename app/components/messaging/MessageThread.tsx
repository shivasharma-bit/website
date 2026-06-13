'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { ConnectionContextPanel } from './ConnectionContextPanel';
import { cn } from '../../lib/utils';
import { useThread } from '../../hooks/useMessages';
import { useAuth } from '../../context/AuthContext';
import { messagesService } from '../../services/api/messages.service';
import type { Thread } from '../../types/message.types';

interface MessageThreadProps {
  thread: Thread;
}

function groupByDate(messages: { createdAt: string; id: string }[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const msg of messages) {
    const date = new Date(msg.createdAt);
    const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(msg.id);
  }
  return groups;
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 shrink-0" />
      <div className="flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-bl-sm bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-tertiary)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

export function MessageThread({ thread }: MessageThreadProps) {
  const { user }                          = useAuth();
  const { messages, isLoading, send, isSending } = useThread(thread.id, user?.id ?? '');
  const [showContext, setShowContext]      = useState(false);
  const [otherTyping, setOtherTyping]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const other     = thread.participants[0];

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Simulate other-party typing occasionally
  useEffect(() => {
    const on  = setTimeout(() => setOtherTyping(true),  4_500);
    const off = setTimeout(() => setOtherTyping(false), 7_000);
    return () => { clearTimeout(on); clearTimeout(off); };
  }, [messages.length]);

  const dateGroups = groupByDate(messages);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Thread header */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-3',
          'border-b border-[var(--color-border)] bg-[var(--color-surface)]',
          'shrink-0',
        )}>
          {other && (
            <>
              <Link href={`/profile/${other.username}`} className="shrink-0">
                <Avatar src={other.avatarUrl} name={other.displayName} size="sm" onlineStatus={other.onlineStatus} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${other.username}`} className="block text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors truncate">
                  {other.displayName}
                </Link>
                <p className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                  {other.onlineStatus === 'online' ? 'Active now' : other.headline}
                </p>
              </div>
            </>
          )}

          {/* Header actions */}
          <div className="flex items-center gap-1 shrink-0">
            {[
              {
                label: 'Voice call',
                icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
              },
              {
                label: 'View context',
                icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
                action: () => setShowContext(v => !v),
                active: showContext,
              },
            ].map(btn => (
              <button
                key={btn.label}
                aria-label={btn.label}
                aria-pressed={'active' in btn ? btn.active : undefined}
                onClick={btn.action}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  'active' in btn && btn.active
                    ? 'bg-[var(--color-brand-muted)] text-[var(--color-brand)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]',
                )}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn('flex gap-2', i % 2 === 0 ? 'flex-row-reverse' : '')}>
                  <div className="w-7 h-7 rounded-full skeleton shrink-0" />
                  <div className={cn('h-10 rounded-2xl skeleton', i % 3 === 0 ? 'w-48' : 'w-32')} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {Array.from(dateGroups.entries()).map(([dateLabel, msgIds]) => (
                <div key={dateLabel} className="space-y-2">
                  <DateDivider label={dateLabel} />
                  {messages
                    .filter(m => msgIds.includes(m.id))
                    .map((msg, idx, arr) => {
                      const isMine     = msg.senderId === user?.id;
                      const nextMsg    = arr[idx + 1];
                      const showAvatar = !isMine && (!nextMsg || nextMsg.senderId !== msg.senderId);
                      return (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isMine={isMine}
                          showAvatar={showAvatar}
                          avatarUrl={other?.avatarUrl ?? null}
                          name={other?.displayName ?? ''}
                        />
                      );
                    })
                  }
                </div>
              ))}

              <AnimatePresence>
                {otherTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Composer */}
        <MessageComposer onSend={send} isSending={isSending} />
      </div>

      {/* Context panel */}
      <AnimatePresence>
        {showContext && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden shrink-0"
          >
            <ConnectionContextPanel thread={thread} className="w-64 h-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
