'use client';

import React from 'react';
import { PageWrapper, SplitPaneLayout } from '../../components/layout/PageWrapper';
import { ConversationList } from '../../components/messaging/ConversationList';

export function MessagesPageClient() {
  return (
    <PageWrapper noAnimation>
      <SplitPaneLayout
        pane={<ConversationList />}
        content={
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Your messages</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Select a conversation to read it</p>
            </div>
          </div>
        }
      />
    </PageWrapper>
  );
}
