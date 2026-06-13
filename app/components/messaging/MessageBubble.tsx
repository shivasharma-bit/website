'use client';

import React from 'react';
import { cn, formatRelativeTime } from '../../lib/utils';
import type { Message } from '../../types/message.types';

interface MessageBubbleProps {
  message:    Message;
  isMine:     boolean;
  showAvatar: boolean;
  avatarUrl:  string | null;
  name:       string;
}

export function MessageBubble({ message, isMine, showAvatar, avatarUrl, name }: MessageBubbleProps) {
  return (
    <div className={cn('flex items-end gap-2 group', isMine ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar spacer / avatar */}
      <div className="w-7 shrink-0">
        {showAvatar && !isMine && (
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-[var(--color-brand)]">
                {name[0]}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={cn('flex flex-col gap-0.5 max-w-[72%]', isMine ? 'items-end' : 'items-start')}>
        {/* Media */}
        {message.mediaUrl && (
          <div className="rounded-[var(--radius-md)] overflow-hidden max-w-xs">
            <img src={message.mediaUrl} alt="Attachment" className="block max-h-64 object-cover" />
          </div>
        )}

        {/* Text bubble */}
        {message.body && (
          <div className={cn(
            'px-3 py-2 rounded-2xl text-sm leading-relaxed',
            isMine
              ? 'bg-[var(--color-brand)] text-white rounded-br-sm'
              : 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] rounded-bl-sm border border-[var(--color-border)]',
          )}>
            {message.body}
          </div>
        )}

        {/* Timestamp + status */}
        <div className={cn(
          'flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity',
          isMine ? 'flex-row-reverse' : 'flex-row',
        )}>
          <span className="text-[10px] text-[var(--color-text-tertiary)]">
            {formatRelativeTime(message.createdAt)}
          </span>
          {isMine && (
            <span className="text-[10px] text-[var(--color-text-tertiary)]">
              {message.status === 'sending'   && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                </svg>
              )}
              {message.status === 'delivered' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {message.status === 'read' && (
                <svg width="14" height="12" viewBox="0 0 28 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 12 9 19 26 2"/>
                  <polyline points="8 12 15 19"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
