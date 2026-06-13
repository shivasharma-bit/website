'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, ThreeColLayout } from '../../components/layout/PageWrapper';
import { RightPanel }     from '../../components/layout/RightPanel';
import { SpotlightRail }  from '../../components/feed/SpotlightRail';
import { PostComposer }   from '../../components/feed/PostComposer';
import { FeedContainer }  from '../../components/feed/FeedContainer';
import { cn } from '../../lib/utils';

type FeedTab = 'for-you' | 'following' | 'trending';

const TABS: { id: FeedTab; label: string }[] = [
  { id: 'for-you',   label: 'For you'   },
  { id: 'following', label: 'Following' },
  { id: 'trending',  label: 'Trending'  },
];

export function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');

  return (
    <PageWrapper>
      <ThreeColLayout
        center={
          <div className="space-y-3">
            {/* Spotlight rail */}
            <SpotlightRail />

            {/* Feed filter tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-[var(--color-border)]">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative flex-1 h-11 text-sm font-medium transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand)]',
                      activeTab === tab.id
                        ? 'text-[var(--color-brand)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.span
                        layoutId="feed-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand)] rounded-t-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Post composer */}
            <PostComposer />

            {/* Feed content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeedContainer />
              </motion.div>
            </AnimatePresence>
          </div>
        }
        right={<RightPanel />}
      />
    </PageWrapper>
  );
}
