'use client';

import React, { useState } from 'react';
import { cn, getInitials } from '../../lib/utils';
import type { OnlineStatus } from '../../types/core.types';

interface AvatarProps {
  src:          string | null;
  name:         string;
  size?:        'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onlineStatus?: OnlineStatus;
  isOpenToWork?: boolean;
  isHiring?:     boolean;
  className?:    string;
  onClick?:      () => void;
}

const sizeMap = {
  xs:  { px: 32,  text: 'text-xs',  ring: 'ring-2', dot: 'w-2 h-2',     dotPos: '-bottom-0 -right-0' },
  sm:  { px: 40,  text: 'text-sm',  ring: 'ring-2', dot: 'w-2.5 h-2.5', dotPos: 'bottom-0 right-0'   },
  md:  { px: 48,  text: 'text-base',ring: 'ring-2', dot: 'w-3 h-3',     dotPos: 'bottom-0 right-0'   },
  lg:  { px: 64,  text: 'text-lg',  ring: 'ring-2', dot: 'w-3.5 h-3.5', dotPos: 'bottom-0.5 right-0.5'},
  xl:  { px: 96,  text: 'text-2xl', ring: 'ring-4', dot: 'w-4 h-4',     dotPos: 'bottom-1 right-1'   },
  '2xl':{ px: 128, text: 'text-3xl', ring: 'ring-4', dot: 'w-5 h-5',    dotPos: 'bottom-1.5 right-1.5'},
};

const statusColor: Record<OnlineStatus, string> = {
  online:  'bg-emerald-500',
  away:    'bg-amber-400',
  offline: 'bg-[var(--color-border)]',
};

export function Avatar({
  src,
  name,
  size = 'md',
  onlineStatus,
  isOpenToWork,
  isHiring,
  className,
  onClick,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const cfg = sizeMap[size];
  const initials = getInitials(name);
  const showImg = src && !imgError;

  // Determine ring color based on badge
  const ringClass = isOpenToWork
    ? 'ring-emerald-500 dark:ring-emerald-400'
    : isHiring
    ? 'ring-[var(--color-accent)] dark:ring-[var(--color-accent)]'
    : 'ring-transparent';

  return (
    <div
      className={cn('relative inline-flex shrink-0', className)}
      style={{ width: cfg.px, height: cfg.px }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Main circle */}
      <div
        className={cn(
          'w-full h-full rounded-full overflow-hidden',
          'bg-[var(--color-surface-raised)] select-none',
          cfg.ring,
          ringClass,
          onClick && 'cursor-pointer'
        )}
      >
        {showImg ? (
          <img
            src={src}
            alt={name}
            width={cfg.px}
            height={cfg.px}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              'bg-[var(--color-brand-muted)] text-[var(--color-brand)]',
              'font-semibold tracking-wide',
              cfg.text
            )}
            aria-label={name}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Online status dot */}
      {onlineStatus && onlineStatus !== 'offline' && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-[var(--color-bg)]',
            cfg.dot,
            cfg.dotPos,
            statusColor[onlineStatus]
          )}
          aria-label={`Status: ${onlineStatus}`}
        />
      )}
    </div>
  );
}
