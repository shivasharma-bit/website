'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageWrapper, SingleColLayout } from '../../components/layout/PageWrapper';
import { Avatar } from '../../components/shared/Avatar';
import { VerifiedBadge } from '../../components/shared/Primitives';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import { cn, formatNumber, sleep } from '../../lib/utils';
import { profileService } from '../../services/api/profile.service';
import type { User } from '../../types/core.types';

const TRENDING_TOPICS = [
  { tag: 'DesignSystems',  posts: 2840  },
  { tag: 'AIProducts',     posts: 14200 },
  { tag: 'BuildInPublic',  posts: 7630  },
  { tag: 'FrontendDev',    posts: 9100  },
  { tag: 'ProductStrategy',posts: 3420  },
  { tag: 'OpenSource',     posts: 5600  },
  { tag: 'RemoteWork',     posts: 4100  },
  { tag: 'CareerGrowth',   posts: 6800  },
];

const FEATURED_COMPANIES = [
  { name: 'Vercel',        desc: 'Frontend cloud platform',       logo: null, followers: 128_000 },
  { name: 'Linear',        desc: 'Modern issue tracking',         logo: null, followers: 84_000  },
  { name: 'Figma',         desc: 'Collaborative design tool',     logo: null, followers: 312_000 },
  { name: 'Notion',        desc: 'All-in-one workspace',          logo: null, followers: 441_000 },
  { name: 'Anthropic',     desc: 'AI safety and research',        logo: null, followers: 96_000  },
  { name: 'Raycast',       desc: 'Supercharged productivity',     logo: null, followers: 52_000  },
];

function PeopleGrid({ users, onFollow }: { users: User[]; onFollow: (id: string) => void }) {
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setFollowed(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    onFollow(id);
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {users.map(user => (
        <motion.div
          key={user.id}
          variants={staggerItem}
          className="card p-4 flex flex-col items-center text-center gap-3 hover:shadow-[var(--shadow-elevated)] transition-shadow"
        >
          <Link href={`/profile/${user.username}`}>
            <Avatar src={user.avatarUrl} name={user.displayName} size="lg" onlineStatus={user.onlineStatus} />
          </Link>
          <div className="min-w-0 w-full">
            <div className="flex items-center justify-center gap-1.5">
              <Link href={`/profile/${user.username}`} className="text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors truncate">
                {user.displayName}
              </Link>
              {user.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">{user.headline}</p>
            <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{formatNumber(user.followersCount)} followers</p>
          </div>
          <button
            onClick={() => toggle(user.id)}
            className={cn(
              'w-full h-7 rounded-full text-xs font-medium border transition-all duration-150',
              followed.has(user.id)
                ? 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-red-300 hover:text-red-500'
                : 'border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white',
            )}
          >
            {followed.has(user.id) ? 'Following' : 'Follow'}
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ExplorePage() {
  const router      = useSearchParams();
  const navRouter   = useRouter();
  const [users,     setUsers]     = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    profileService.getSuggestedUsers().then(u => { setUsers(u); setIsLoading(false); });
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) navRouter.push(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <PageWrapper>
      <SingleColLayout maxWidth="xl">
        {/* Search hero */}
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-3xl font-display font-semibold text-[var(--color-text-primary)] tracking-tight">
            Discover people and ideas
          </h1>
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search people, topics, companies…"
                className="w-full h-11 pl-10 pr-4 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent shadow-[var(--shadow-card)]"
              />
            </div>
          </form>
        </div>

        {/* Trending topics */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Trending topics</h2>
          <div className="flex flex-wrap gap-2">
            {TRENDING_TOPICS.map(t => (
              <Link
                key={t.tag}
                href={`/explore?topic=${t.tag}`}
                className={cn(
                  'flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-medium',
                  'border border-[var(--color-border)] bg-[var(--color-surface)]',
                  'text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]',
                  'transition-all duration-150 shadow-[var(--shadow-card)]',
                )}
              >
                <span className="text-[var(--color-text-tertiary)]">#</span>
                {t.tag}
                <span className="text-[10px] text-[var(--color-text-tertiary)]">{formatNumber(t.posts)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* People to follow */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">People to follow</h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-4 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full skeleton" />
                  <div className="space-y-1.5 w-full">
                    <div className="h-3 w-24 rounded skeleton mx-auto" />
                    <div className="h-2.5 w-32 rounded skeleton mx-auto" />
                  </div>
                  <div className="h-7 w-full rounded-full skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <PeopleGrid users={users} onFollow={() => {}} />
          )}
        </section>

        {/* Featured companies */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Featured companies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURED_COMPANIES.map((co, i) => (
              <motion.div
                key={co.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="card p-4 flex items-center gap-3 hover:shadow-[var(--shadow-elevated)] transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-muted)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                  <span className="text-sm font-bold text-[var(--color-brand)]">{co.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{co.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">{co.desc}</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{formatNumber(co.followers)} followers</p>
                </div>
                <button className="btn btn-secondary h-7 text-xs shrink-0">Follow</button>
              </motion.div>
            ))}
          </div>
        </section>
      </SingleColLayout>
    </PageWrapper>
  );
}
