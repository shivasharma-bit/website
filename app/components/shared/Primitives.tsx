'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// ─── Verified Badge ───────────────────────────────────────────────────────────

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VerifiedBadge({ size = 'md', className }: VerifiedBadgeProps) {
  const dim = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('shrink-0', className)}
      aria-label="Verified"
    >
      <circle cx="12" cy="12" r="11" fill="var(--color-brand)" />
      <path
        d="M7.5 12.5L10.5 15.5L16.5 9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

interface SkeletonCardProps {
  lines?:     number;
  hasAvatar?: boolean;
  hasImage?:  boolean;
  className?: string;
}

export function SkeletonCard({
  lines = 3,
  hasAvatar = true,
  hasImage = false,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]',
        'p-5 space-y-4 overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {hasAvatar && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 rounded-full skeleton" />
            <div className="h-3 w-24 rounded-full skeleton" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded-full skeleton"
            style={{ width: i === lines - 1 ? '65%' : '100%' }}
          />
        ))}
      </div>
      {hasImage && (
        <div className="h-48 w-full rounded-[var(--radius-md)] skeleton" />
      )}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?:        React.ReactNode;
  title:        string;
  description?: string;
  action?:      React.ReactNode;
  className?:   string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 px-6 gap-4',
        className
      )}
    >
      {icon && (
        <div className="text-[var(--color-text-tertiary)] opacity-60">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
