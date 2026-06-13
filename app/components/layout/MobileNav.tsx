'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Avatar } from '../shared/Avatar';
import { cn } from '../../lib/utils';

export function MobileNav() {
  const pathname        = usePathname();
  const { user }        = useAuth();
  const { unreadCount } = useNotifications();

  const tabs = [
    {
      href:  '/feed',
      label: 'Home',
      icon: (fill: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fill ? '0' : '1.75'} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" stroke={fill ? 'white' : 'currentColor'} strokeWidth="1.75" fill="none" />
        </svg>
      ),
    },
    {
      href:  '/explore',
      label: 'Explore',
      icon: (fill: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={fill ? '2.25' : '1.75'} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      href:  '/create',
      label: 'Post',
      isCreate: true,
      icon: (_fill: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5"  y1="12" x2="19" y2="12" />
        </svg>
      ),
    },
    {
      href:  '/notifications',
      label: 'Alerts',
      badge: unreadCount,
      icon: (fill: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fill ? '0' : '1.75'} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" fill="none" />
        </svg>
      ),
    },
    {
      href:  user ? `/profile/${user.username}` : '/profile',
      label: 'Profile',
      isProfile: true,
      icon: (_fill: boolean) => (
        <Avatar
          src={user?.avatarUrl ?? null}
          name={user?.displayName ?? 'You'}
          size="xs"
        />
      ),
    },
  ];

  if (!user) return null;

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'h-[var(--mobile-nav-height)]',
        'bg-[var(--color-bg)]/95 backdrop-blur-md',
        'border-t border-[var(--color-border)]',
        'flex items-center',
        'safe-area-bottom',
      )}
      aria-label="Mobile navigation"
    >
      <div className="w-full flex items-center justify-around px-2">
        {tabs.map(tab => {
          const isActive = tab.href === '/feed'
            ? pathname === '/feed' || pathname === '/'
            : pathname.startsWith(tab.href);

          if (tab.isCreate) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label="Create post"
                className={cn(
                  'flex items-center justify-center',
                  'w-12 h-12 rounded-2xl',
                  'bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/30',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
                  'transition-transform active:scale-95',
                )}
              >
                {tab.icon(false)}
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1',
                'w-12 h-full py-2',
                'focus-visible:outline-none',
                'transition-colors duration-150',
                isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-tertiary)]',
              )}
            >
              {tab.badge != null && tab.badge > 0 && (
                <span className="absolute top-2 right-2 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold bg-[var(--color-accent)] text-white z-10">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}

              {tab.isProfile ? (
                <span
                  className={cn(
                    'rounded-full overflow-hidden transition-shadow',
                    isActive && 'ring-2 ring-[var(--color-brand)] ring-offset-1 ring-offset-[var(--color-bg)]'
                  )}
                >
                  {tab.icon(isActive)}
                </span>
              ) : (
                <>
                  {tab.icon(isActive)}
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-dot"
                      className="w-1 h-1 rounded-full bg-[var(--color-brand)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
