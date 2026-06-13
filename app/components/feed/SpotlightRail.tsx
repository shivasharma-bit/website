'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { cn, formatRelativeTime } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface Spotlight {
  id:          string;
  author: {
    id:          string;
    username:    string;
    displayName: string;
    avatarUrl:   string | null;
    headline:    string;
  };
  coverUrl:    string;
  caption:     string;
  createdAt:   string;
  isViewed:    boolean;
}

// ─── Mock spotlights ──────────────────────────────────────────────────────────

const MOCK_SPOTLIGHTS: Spotlight[] = [
  {
    id: 'sp1',
    author: { id: 'u10', username: 'james.okafor', displayName: 'James', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', headline: 'Sr. Engineer at Vercel' },
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    caption: 'Shipped our new component library today',
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    isViewed: false,
  },
  {
    id: 'sp2',
    author: { id: 'u11', username: 'priya.sundaram', displayName: 'Priya', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', headline: 'Product Lead at Linear' },
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    caption: 'Linear\'s roadmap planning process',
    createdAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
    isViewed: false,
  },
  {
    id: 'sp3',
    author: { id: 'u12', username: 'tom.eriksson', displayName: 'Tom', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', headline: 'Founder at Loom' },
    coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    caption: 'Behind the scenes: async culture at Loom',
    createdAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    isViewed: true,
  },
  {
    id: 'sp4',
    author: { id: 'u13', username: 'arjun.mehta', displayName: 'Arjun', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', headline: 'Staff Designer at Notion' },
    coverUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80',
    caption: 'Notion\'s new AI design explorations',
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
    isViewed: true,
  },
  {
    id: 'sp5',
    author: { id: 'u14', username: 'selin.kaya', displayName: 'Selin', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', headline: 'Creative Director at Figma' },
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    caption: 'Config 2024 prep is underway',
    createdAt: new Date(Date.now() - 10 * 3600_000).toISOString(),
    isViewed: true,
  },
];

// ─── Spotlight viewer modal ────────────────────────────────────────────────────

interface SpotlightViewerProps {
  spotlights:   Spotlight[];
  initialIndex: number;
  onClose:      () => void;
}

function SpotlightViewer({ spotlights, initialIndex, onClose }: SpotlightViewerProps) {
  const [index,    setIndex]    = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 5000;

  const current = spotlights[index];

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
    const step = 50;
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (step / DURATION) * 100;
        if (next >= 100) {
          clearInterval(timerRef.current!);
          goNext();
          return 100;
        }
        return next;
      });
    }, step);
  }

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [index]);

  function goNext() {
    if (index < spotlights.length - 1) setIndex(i => i + 1);
    else onClose();
  }

  function goPrev() {
    if (index > 0) setIndex(i => i - 1);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-sm h-[80vh] max-h-[700px] rounded-2xl overflow-hidden"
      >
        {/* Cover image */}
        <img
          src={current.coverUrl}
          alt={current.caption}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
          {spotlights.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
                transition={{ duration: 0 }}
              />
            </div>
          ))}
        </div>

        {/* Author header */}
        <div className="absolute top-7 left-3 right-10 flex items-center gap-2.5 z-10">
          <Avatar src={current.author.avatarUrl} name={current.author.displayName} size="sm" />
          <div>
            <p className="text-sm font-semibold text-white">{current.author.displayName}</p>
            <p className="text-xs text-white/70">{formatRelativeTime(current.createdAt)}</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-7 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center z-10 transition-colors"
          aria-label="Close spotlight"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Caption */}
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <p className="text-sm text-white font-medium leading-snug">{current.caption}</p>
        </div>

        {/* Tap zones */}
        <button className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={goPrev} aria-label="Previous spotlight" />
        <button className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={goNext} aria-label="Next spotlight" />
      </motion.div>
    </motion.div>
  );
}

// ─── Rail ─────────────────────────────────────────────────────────────────────

export function SpotlightRail() {
  const { user }                            = useAuth();
  const [spotlights, setSpotlights]         = useState<Spotlight[]>(MOCK_SPOTLIGHTS);
  const [viewerIndex, setViewerIndex]       = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  function openSpotlight(index: number) {
    if (isDragging.current) return;
    setSpotlights(prev =>
      prev.map((s, i) => (i === index ? { ...s, isViewed: true } : s))
    );
    setViewerIndex(index);
  }

  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = false;
    startX.current = e.pageX - (railRef.current?.offsetLeft ?? 0);
    scrollLeft.current = railRef.current?.scrollLeft ?? 0;
    railRef.current?.style.setProperty('cursor', 'grabbing');
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!e.buttons) return;
    const x    = e.pageX - (railRef.current?.offsetLeft ?? 0);
    const walk = x - startX.current;
    if (Math.abs(walk) > 4) isDragging.current = true;
    if (railRef.current) railRef.current.scrollLeft = scrollLeft.current - walk;
  }

  function handleMouseUp() {
    railRef.current?.style.setProperty('cursor', 'grab');
    setTimeout(() => { isDragging.current = false; }, 50);
  }

  return (
    <>
      <div className="card p-3 overflow-hidden">
        <div
          ref={railRef}
          className="flex gap-3 overflow-x-auto scrollbar-hidden cursor-grab active:cursor-grabbing select-none pb-0.5"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          role="list"
          aria-label="Professional spotlights"
        >
          {/* Add your spotlight CTA */}
          {user && (
            <div className="flex flex-col items-center gap-1.5 shrink-0 w-16" role="listitem">
              <div className="relative">
                <div className={cn(
                  'w-14 h-14 rounded-full overflow-hidden',
                  'border-2 border-dashed border-[var(--color-border-strong)]',
                  'flex items-center justify-center',
                  'bg-[var(--color-surface-raised)] cursor-pointer',
                  'hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-muted)] transition-all duration-150',
                )}>
                  <Avatar src={user.avatarUrl} name={user.displayName} size="md" className="opacity-60" />
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[var(--color-brand)] flex items-center justify-center border-2 border-[var(--color-surface)]">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
              </div>
              <span className="text-[10px] text-[var(--color-text-secondary)] text-center leading-tight">Add</span>
            </div>
          )}

          {/* Spotlight items */}
          {spotlights.map((spotlight, i) => (
            <motion.div
              key={spotlight.id}
              role="listitem"
              className="flex flex-col items-center gap-1.5 shrink-0 w-16 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onClick={() => openSpotlight(i)}
            >
              <div className={cn(
                'w-14 h-14 rounded-full overflow-hidden',
                'border-2 transition-all duration-150',
                spotlight.isViewed
                  ? 'border-[var(--color-border)]'
                  : 'border-[var(--color-brand)] p-0.5 bg-[var(--color-brand)]',
              )}>
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={spotlight.coverUrl}
                    alt={spotlight.caption}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </div>
              <span className={cn(
                'text-[10px] text-center leading-tight truncate w-full text-center',
                spotlight.isViewed
                  ? 'text-[var(--color-text-tertiary)]'
                  : 'text-[var(--color-text-primary)] font-medium',
              )}>
                {spotlight.author.displayName.split(' ')[0]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Viewer modal */}
      <AnimatePresence>
        {viewerIndex !== null && (
          <SpotlightViewer
            spotlights={spotlights}
            initialIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
