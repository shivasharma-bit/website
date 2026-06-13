'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Avatar } from '../shared/Avatar';
import { ThemeToggle } from '../shared/ThemeToggle';
import { cn } from '../../lib/utils';
import { transitions } from '../../lib/transitions';

interface NavIconButtonProps {
  href:      string;
  label:     string;
  badge?:    number;
  isActive?: boolean;
  children:  React.ReactNode;
}

function NavIconButton({ href, label, badge, isActive, children }: NavIconButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        'relative flex flex-col items-center justify-center gap-0.5',
        'w-12 h-12 rounded-xl transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
        isActive
          ? 'text-[var(--color-brand)] bg-[var(--color-brand-muted)]'
          : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]'
      )}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className={cn(
            'absolute top-1.5 right-1.5',
            'min-w-[18px] h-[18px] px-1',
            'flex items-center justify-center',
            'rounded-full text-[10px] font-semibold leading-none',
            'bg-[var(--color-accent)] text-white',
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-brand)]"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount }  = useNotifications();
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  const navLinks = [
    {
      href: '/feed',
      label: 'Feed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: '/explore',
      label: 'Explore',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      href: '/messages',
      label: 'Messages',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: '/notifications',
      label: 'Notifications',
      badge: unreadCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4"  />
          <line x1="6"  y1="20" x2="6"  y2="14" />
        </svg>
      ),
    },
  ];

  if (!user) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-[var(--navbar-height)]',
        'bg-[var(--color-bg)]/90 backdrop-blur-md',
        'border-b border-[var(--color-border)]',
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center gap-3">

        {/* ── Wordmark ──────────────────────────────── */}
        <Link
          href="/feed"
          className="flex items-center gap-2 mr-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] rounded-md"
        >
          <div className="w-7 h-7 rounded-[6px] bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-white font-bold text-sm font-display leading-none">F</span>
          </div>
          <span className="hidden lg:block font-display font-semibold text-lg text-[var(--color-text-primary)] tracking-tight">
            Forge
          </span>
        </Link>

        {/* ── Search bar ─────────────────────────────── */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs"
        >
          <label className="relative w-full">
            <span className="sr-only">Search</span>
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search people, posts, topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={cn(
                'w-full h-9 pl-9 pr-3 rounded-xl',
                'bg-[var(--color-surface-raised)] border border-[var(--color-border)]',
                'text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent',
                'transition-all duration-150',
              )}
            />
          </label>
        </form>

        <div className="flex-1 hidden md:block" />

        {/* ── Nav icon links ─────────────────────────── */}
        <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map(link => (
            <NavIconButton
              key={link.href}
              href={link.href}
              label={link.label}
              badge={link.badge}
              isActive={
                link.href === '/feed'
                  ? pathname === '/feed' || pathname === '/'
                  : pathname.startsWith(link.href)
              }
            >
              {link.icon}
            </NavIconButton>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-1">
          {/* ── Create button ─────────────────────────── */}
          <Link
            href="/create"
            className={cn(
              'hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl',
              'bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white',
              'text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Post</span>
          </Link>

          {/* ── Theme toggle ───────────────────────────── */}
          <ThemeToggle />

          {/* ── User menu ──────────────────────────────── */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className={cn(
                'flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl',
                'hover:bg-[var(--color-surface-raised)] transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
              )}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Account menu"
            >
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="xs"
                onlineStatus={user.onlineStatus}
              />
              <svg
                className={cn(
                  'hidden sm:block text-[var(--color-text-tertiary)] transition-transform duration-200',
                  menuOpen && 'rotate-180'
                )}
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  {...transitions.modal}
                  className={cn(
                    'absolute right-0 top-full mt-2 w-64',
                    'bg-[var(--color-surface)] border border-[var(--color-border)]',
                    'rounded-[var(--radius-lg)] shadow-xl shadow-black/10',
                    'overflow-hidden z-50',
                  )}
                >
                  {/* Profile peek */}
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--color-surface-raised)] transition-colors duration-150"
                  >
                    <Avatar src={user.avatarUrl} name={user.displayName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{user.displayName}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] truncate">{user.headline}</p>
                    </div>
                  </Link>

                  <div className="border-t border-[var(--color-border)]" />

                  {[
                    { label: 'Your profile',  href: `/profile/${user.username}` },
                    { label: 'Analytics',     href: '/analytics'                },
                    { label: 'Settings',      href: '/settings'                 },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'block px-4 py-2.5 text-sm text-[var(--color-text-secondary)]',
                        'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
                        'transition-colors duration-150',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="border-t border-[var(--color-border)]" />

                  <button
                    onClick={async () => { setMenuOpen(false); await logout(); router.push('/'); }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm',
                      'text-[var(--color-error)] hover:bg-[var(--color-error-muted)]',
                      'transition-colors duration-150',
                    )}
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
