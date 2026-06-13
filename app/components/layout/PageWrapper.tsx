'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface PageWrapperProps {
  children:  React.ReactNode;
  className?: string;
  /** Skip the entrance animation — useful for shell-level layouts */
  noAnimation?: boolean;
}

export function PageWrapper({ children, className, noAnimation }: PageWrapperProps) {
  if (noAnimation) {
    return (
      <div className={cn('min-h-[calc(100vh-var(--navbar-height))]', className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -6 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className={cn('min-h-[calc(100vh-var(--navbar-height))]', className)}
    >
      {children}
    </motion.div>
  );
}

// ─── Three-column shell (feed layout) ────────────────────────────────────────

interface ThreeColLayoutProps {
  left?:      React.ReactNode;
  center:     React.ReactNode;
  right?:     React.ReactNode;
  className?: string;
}

export function ThreeColLayout({ left, center, right, className }: ThreeColLayoutProps) {
  return (
    <div
      className={cn(
        'max-w-screen-xl mx-auto px-4',
        'pt-[calc(var(--navbar-height)+1.5rem)]',
        'pb-[calc(var(--mobile-nav-height)+1.5rem)] lg:pb-8',
        'flex gap-6 items-start',
        className,
      )}
    >
      {/* Left column — shown only on xl */}
      {left && (
        <div className="hidden xl:block w-[var(--sidebar-width)] shrink-0">
          {left}
        </div>
      )}

      {/* Center column — main content */}
      <div className="flex-1 min-w-0 max-w-[var(--content-max-width)] mx-auto w-full">
        {center}
      </div>

      {/* Right column — shown only on lg */}
      {right && (
        <div className="hidden lg:block w-[var(--right-panel-width)] shrink-0">
          {right}
        </div>
      )}
    </div>
  );
}

// ─── Full-width single-column layout ─────────────────────────────────────────

interface SingleColLayoutProps {
  children:   React.ReactNode;
  maxWidth?:  'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const maxWidthMap = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  '2xl':'max-w-6xl',
  full: 'max-w-none',
};

export function SingleColLayout({ children, maxWidth = 'lg', className }: SingleColLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4',
        'pt-[calc(var(--navbar-height)+1.5rem)]',
        'pb-[calc(var(--mobile-nav-height)+1.5rem)] lg:pb-8',
        maxWidthMap[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Split-pane layout (messages) ────────────────────────────────────────────

interface SplitPaneLayoutProps {
  pane:       React.ReactNode;
  content:    React.ReactNode;
  className?: string;
}

export function SplitPaneLayout({ pane, content, className }: SplitPaneLayoutProps) {
  return (
    <div
      className={cn(
        'max-w-screen-xl mx-auto',
        'h-[calc(100vh-var(--navbar-height))]',
        'pt-[var(--navbar-height)]',
        'pb-[var(--mobile-nav-height)] lg:pb-0',
        'flex',
        className,
      )}
    >
      {/* Left pane: conversation list */}
      <div className="w-full md:w-80 lg:w-96 shrink-0 border-r border-[var(--color-border)] overflow-y-auto">
        {pane}
      </div>
      {/* Right pane: active thread */}
      <div className="hidden md:flex flex-1 flex-col min-w-0 overflow-hidden">
        {content}
      </div>
    </div>
  );
}
