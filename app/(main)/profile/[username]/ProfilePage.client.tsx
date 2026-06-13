'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper, ThreeColLayout } from '../../../components/layout/PageWrapper';
import { ProfileHero }              from '../../../components/profile/ProfileHero';
import { AboutPanel }               from '../../../components/profile/AboutPanel';
import { PortfolioGrid }            from '../../../components/profile/PortfolioGrid';
import { ExperienceTimeline }       from '../../../components/profile/ExperienceTimeline';
import { SkillsPanel }              from '../../../components/profile/SkillsPanel';
import { RecommendationsCarousel }  from '../../../components/profile/RecommendationsCarousel';
import { ActivityTab }              from '../../../components/profile/ActivityTab';
import { SkeletonCard }             from '../../../components/shared/Primitives';
import { useProfile }               from '../../../hooks/useProfile';
import { useAuth }                  from '../../../context/AuthContext';
import { cn }                       from '../../../lib/utils';

type ProfileTab = 'portfolio' | 'experience' | 'activity';

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'portfolio',  label: 'Portfolio'   },
  { id: 'experience', label: 'Experience'  },
  { id: 'activity',   label: 'Activity'    },
];

interface ProfilePageClientProps {
  username: string;
}

export function ProfilePageClient({ username }: ProfilePageClientProps) {
  const { user: authUser } = useAuth();
  const {
    user, projects, experiences, education, skills,
    recommendations, activity,
    isLoading, error, isFollowing, toggleFollow,
  } = useProfile(username);

  const [activeTab, setActiveTab] = useState<ProfileTab>('portfolio');
  const isOwner = authUser?.id === user?.id;

  // ── Loading skeleton ──────────────────────────
  if (isLoading) {
    return (
      <PageWrapper>
        <ThreeColLayout
          center={
            <div className="space-y-3">
              <div className="card h-64 skeleton" />
              <SkeletonCard lines={4} hasAvatar={false} />
              <SkeletonCard lines={3} hasAvatar hasImage />
            </div>
          }
        />
      </PageWrapper>
    );
  }

  // ── Error ────────────────────────────────────
  if (error || !user) {
    return (
      <PageWrapper>
        <div className="max-w-xl mx-auto mt-16 text-center px-4">
          <h1 className="text-2xl font-display font-semibold text-[var(--color-text-primary)] mb-2">
            Profile not found
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This account may have been removed or the URL may be incorrect.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ThreeColLayout
        center={
          <div className="space-y-3">
            {/* Hero */}
            <ProfileHero
              user={user}
              isFollowing={isFollowing}
              onFollow={toggleFollow}
            />

            {/* Profile tabs */}
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
                        layoutId="profile-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand)] rounded-t-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3"
              >
                {activeTab === 'portfolio' && (
                  <>
                    <PortfolioGrid
                      projects={projects}
                      username={username}
                      isOwner={isOwner}
                    />
                    {recommendations.length > 0 && (
                      <RecommendationsCarousel
                        recommendations={recommendations}
                        isOwner={isOwner}
                      />
                    )}
                  </>
                )}

                {activeTab === 'experience' && (
                  <>
                    {experiences.length > 0 && (
                      <ExperienceTimeline
                        experiences={experiences}
                        isOwner={isOwner}
                      />
                    )}
                    {skills.length > 0 && (
                      <SkillsPanel skills={skills} isOwner={isOwner} />
                    )}
                    <AboutPanel
                      user={user}
                      education={education}
                      isOwner={isOwner}
                    />
                  </>
                )}

                {activeTab === 'activity' && (
                  <ActivityTab posts={activity} isLoading={isLoading} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        }

        right={
          <div className="space-y-3 sticky top-[calc(var(--navbar-height)+1.5rem)]">
            {/* Compact about card for right panel */}
            <div className="card p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                About
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-4">
                {user.bio}
              </p>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--color-brand)] hover:underline"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            {/* Top skills compact */}
            {skills.filter(s => s.isTopSkill).length > 0 && (
              <div className="card p-4 space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Top skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.filter(s => s.isTopSkill).map(s => (
                    <span
                      key={s.id}
                      className="h-6 px-2.5 rounded-full bg-[var(--color-brand-muted)] text-[var(--color-brand)] text-[10px] font-medium flex items-center"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
      />
    </PageWrapper>
  );
}
