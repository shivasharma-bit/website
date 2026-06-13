'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Avatar } from '../shared/Avatar';
import { cn, formatRelativeTime } from '../../lib/utils';
import type { Recommendation } from '../../types/project.types';

interface RecommendationsCarouselProps {
  recommendations: Recommendation[];
  isOwner?:        boolean;
}

export function RecommendationsCarousel({ recommendations, isOwner }: RecommendationsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          Recommendations
          <span className="ml-2 text-sm font-normal text-[var(--color-text-tertiary)]">
            {recommendations.length}
          </span>
        </h2>
        <div className="flex items-center gap-1.5">
          {isOwner && (
            <button className="btn btn-ghost h-8 text-xs">Request</button>
          )}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              'w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center',
              'text-[var(--color-text-secondary)] transition-all',
              canScrollLeft
                ? 'hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-brand)]'
                : 'opacity-30 cursor-not-allowed',
            )}
            aria-label="Scroll left"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              'w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center',
              'text-[var(--color-text-secondary)] transition-all',
              canScrollRight
                ? 'hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-brand)]'
                : 'opacity-30 cursor-not-allowed',
            )}
            aria-label="Scroll right"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto scrollbar-hidden px-4 md:px-5 py-4"
      >
        {recommendations.map(rec => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE_LEN = 200;
  const needsTrunc = rec.body.length > TRUNCATE_LEN;

  return (
    <div className={cn(
      'shrink-0 w-72 md:w-80 rounded-[var(--radius-md)] border border-[var(--color-border)]',
      'bg-[var(--color-surface-raised)] p-4 flex flex-col gap-3',
    )}>
      {/* Recommender */}
      <div className="flex items-center gap-2.5">
        <Link href={`/profile/${rec.recommender.username}`} className="shrink-0">
          <Avatar src={rec.recommender.avatarUrl} name={rec.recommender.displayName} size="sm" />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/profile/${rec.recommender.username}`}
            className="block text-xs font-semibold text-[var(--color-text-primary)] hover:underline truncate"
          >
            {rec.recommender.displayName}
          </Link>
          <p className="text-[10px] text-[var(--color-text-secondary)] truncate">{rec.recommender.headline}</p>
          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{rec.relationship}</p>
        </div>
      </div>

      {/* Quote */}
      <div className="relative flex-1">
        <svg
          className="absolute -top-1 -left-0.5 text-[var(--color-brand)]/20"
          width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed pl-5">
          {expanded || !needsTrunc
            ? rec.body
            : rec.body.slice(0, TRUNCATE_LEN) + '…'}
        </p>
        {needsTrunc && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-1 text-[10px] font-medium text-[var(--color-brand)] hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <p className="text-[10px] text-[var(--color-text-tertiary)]">
        {formatRelativeTime(rec.createdAt)}
      </p>
    </div>
  );
}
