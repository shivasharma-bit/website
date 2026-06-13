'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Avatar } from '../shared/Avatar';
import { VerifiedBadge } from '../shared/Primitives';
import { cn, formatNumber } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';

interface SideNavLinkProps {
  href:      string;
  label:     string;
  badge?:    number;
  isActive:  boolean;
  icon:      React.ReactNode;
}

function SideNavLink({ href, label, badge, isActive, icon }: SideNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'text-sm font-medium transition-all duration-150 group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
        isActive
          ? 'bg-[var(--color-brand-muted)] text-[var(--color-brand)]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
      )}
    >
      <span className={cn(
        'shrink-0 transition-colors',
        isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]',
      )}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge != null && badge > 0 && (
        <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-semibold bg-[var(--color-accent)] text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname        = usePathname();
  const { user }        = useAuth();
  const { unreadCount } = useNotifications();

  const navLinks = [
    {
      href:  '/feed',
      label: 'Feed',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href:  '/explore',
      label: 'Explore',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      href:  '/messages',
      label: 'Messages',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href:  '/notifications',
      label: 'Notifications',
      badge: unreadCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      href:  '/analytics',
      label: 'Analytics',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4"  />
          <line x1="6"  y1="20" x2="6"  y2="14" />
        </svg>
      ),
    },
    {
      href:  '/create',
      label: 'Create post',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
  ];

  if (!user) return null;

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col',
        'w-[var(--sidebar-width)] shrink-0',
        'pt-[var(--navbar-height)]',
        'sticky top-0 h-screen',
        'overflow-y-auto scrollbar-hidden',
      )}
    >
      <div className="flex flex-col gap-4 px-3 py-5">

        {/* ── Profile card ──────────────────────────── */}
        <Link
          href={`/profile/${user.username}`}
          className={cn(
            'flex flex-col items-center gap-3 p-4',
            'rounded-[var(--radius-card)] border border-[var(--color-border)]',
            'bg-[var(--color-surface)] hover:border-[var(--color-brand-muted)]',
            'transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
          )}
        >
          <Avatar
            src={user.avatarUrl}
            name={user.displayName}
            size="lg"
            onlineStatus={user.onlineStatus}
            isOpenToWork={user.isOpenToWork}
            isHiring={user.isHiring}
          />
          <div className="text-center min-w-0 w-full">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {user.displayName}
              </span>
              {user.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
              {user.headline}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 w-full border-t border-[var(--color-border)] pt-3 mt-0.5">
            {[
              { label: 'Followers', value: formatNumber(user.followersCount)   },
              { label: 'Following', value: formatNumber(user.followingCount)   },
              { label: 'Posts',     value: formatNumber(user.connectionsCount) },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">{stat.value}</span>
                <span className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </Link>

        {/* ── Nav links ──────────────────────────────── */}
        <motion.nav
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-0.5"
          aria-label="Sidebar navigation"
        >
          {navLinks.map(link => (
            <motion.div key={link.href} variants={staggerItem}>
              <SideNavLink
                href={link.href}
                label={link.label}
                badge={link.badge}
                isActive={
                  link.href === '/feed'
                    ? pathname === '/feed' || pathname === '/'
                    : pathname.startsWith(link.href)
                }
                icon={link.icon}
              />
            </motion.div>
          ))}
        </motion.nav>

        {/* ── Footer links ──────────────────────────── */}
        <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
          <div className="flex flex-wrap gap-x-3 gap-y-1 px-1">
            {['About', 'Privacy', 'Terms', 'Help'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[10px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 px-1">
            Forge {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </aside>
  );
}
