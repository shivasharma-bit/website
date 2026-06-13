'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatNumber } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { Project, ProjectCategory } from '../../types/project.types';

interface PortfolioGridProps {
  projects:  Project[];
  username:  string;
  isOwner?:  boolean;
}

const CATEGORY_LABELS: Record<ProjectCategory | 'all', string> = {
  all:         'All work',
  design:      'Design',
  engineering: 'Engineering',
  writing:     'Writing',
  speaking:    'Speaking',
  research:    'Research',
  other:       'Other',
};

export function PortfolioGrid({ projects, username, isOwner }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const categories = useMemo<(ProjectCategory | 'all')[]>(() => {
    const cats = new Set<ProjectCategory>(projects.map(p => p.category));
    return ['all', ...Array.from(cats)] as (ProjectCategory | 'all')[];
  }, [projects]);

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? projects
      : projects.filter(p => p.category === activeCategory),
    [projects, activeCategory]
  );

  return (
    <div className="card overflow-hidden">
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          Portfolio
        </h2>
        <div className="flex items-center gap-2">
          {isOwner && (
            <Link
              href="/create?type=case_study"
              className="btn btn-primary h-8 text-xs gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add project
            </Link>
          )}
          {/* Layout toggle */}
          <div className="flex border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
            {(['grid', 'list'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={cn(
                  'w-8 h-8 flex items-center justify-center transition-colors',
                  layout === l
                    ? 'bg-[var(--color-brand-muted)] text-[var(--color-brand)]'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]',
                )}
                aria-label={`${l} view`}
                aria-pressed={layout === l}
              >
                {l === 'grid' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6"  x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6"  x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category filters ─────────────────────── */}
      {categories.length > 2 && (
        <div className="flex gap-1.5 px-4 md:px-5 py-3 overflow-x-auto scrollbar-hidden border-b border-[var(--color-border)]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'h-7 px-3 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150',
                activeCategory === cat
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]',
              )}
            >
              {CATEGORY_LABELS[cat]}
              {cat !== 'all' && (
                <span className={cn(
                  'ml-1.5 text-[10px]',
                  activeCategory === cat ? 'text-white/70' : 'text-[var(--color-text-tertiary)]'
                )}>
                  {projects.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Project items ────────────────────────── */}
      <div className="p-4 md:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${layout}`}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className={cn(
              layout === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                : 'flex flex-col divide-y divide-[var(--color-border)]',
            )}
          >
            {filtered.map(project => (
              <motion.div key={project.id} variants={staggerItem}>
                {layout === 'grid' ? (
                  <GridProjectCard project={project} username={username} />
                ) : (
                  <ListProjectCard project={project} username={username} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[var(--color-text-secondary)]">
              No {activeCategory === 'all' ? '' : activeCategory + ' '}projects yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridProjectCard({ project, username }: { project: Project; username: string }) {
  const [coverError, setCoverError] = useState(false);

  return (
    <Link
      href={`/profile/${username}/work/${project.slug}`}
      className={cn(
        'group block rounded-[var(--radius-md)] border border-[var(--color-border)]',
        'overflow-hidden hover:border-[var(--color-brand-muted)] hover:shadow-[var(--shadow-elevated)]',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] bg-[var(--color-surface-raised)] overflow-hidden">
        {project.coverUrl && !coverError ? (
          <img
            src={project.coverUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-muted)] to-[var(--color-surface-raised)]">
            <span className="text-3xl font-display font-bold text-[var(--color-brand)]/20">
              {project.title[0]}
            </span>
          </div>
        )}
        {project.isHighlighted && (
          <span className="absolute top-2 left-2 badge badge-accent text-[9px]">
            Featured
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>

      {/* Meta */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-brand)] transition-colors">
            {project.title}
          </h3>
          <span className="badge badge-brand text-[9px] shrink-0 capitalize">
            {project.category}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
          {project.summary}
        </p>
        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-[var(--color-border)]">
          <span className="text-[10px] text-[var(--color-text-tertiary)]">{project.year}</span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-tertiary)]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            {formatNumber(project.viewCount)}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-tertiary)]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
            </svg>
            {formatNumber(project.reactionCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── List card ────────────────────────────────────────────────────────────────

function ListProjectCard({ project, username }: { project: Project; username: string }) {
  return (
    <Link
      href={`/profile/${username}/work/${project.slug}`}
      className="group flex items-center gap-4 py-4 first:pt-0 hover:opacity-90 transition-opacity focus-visible:outline-none"
    >
      {/* Thumbnail */}
      <div className="w-20 h-14 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] overflow-hidden shrink-0">
        {project.coverUrl ? (
          <img src={project.coverUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-display font-bold text-[var(--color-brand)]/30">{project.title[0]}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-brand)] transition-colors">
            {project.title}
          </h3>
          {project.isHighlighted && <span className="badge badge-accent text-[9px] shrink-0">Featured</span>}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">{project.summary}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="badge badge-brand text-[9px] capitalize">{project.category}</span>
          <span className="text-[10px] text-[var(--color-text-tertiary)]">{project.year}</span>
          <span className="text-[10px] text-[var(--color-text-tertiary)]">{formatNumber(project.viewCount)} views</span>
        </div>
      </div>

      <svg
        className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </Link>
  );
}
