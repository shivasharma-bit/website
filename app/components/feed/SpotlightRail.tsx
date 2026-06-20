'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../shared/Avatar';
import { cn, formatRelativeTime } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { spotlightsService } from '../../services/api/spotlights.service';

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

// Spotlights loaded from API

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
  const [spotlights, setSpotlights]         = useState<Spotlight[]>([]);

  useEffect(() => {
    spotlightsService.getAll()
      .then(data => setSpotlights(data.map(s => ({
        id:        s.id,
        author:    { id: s.user.id, username: s.user.username, displayName: s.user.displayName, avatarUrl: s.user.avatarUrl, headline: '' },
        coverUrl:  s.coverUrl,
        caption:   s.caption ?? '',
        createdAt: s.createdAt,
        isViewed:  false,
      }))))
      .catch(() => {});
  }, []);
  const [viewerIndex, setViewerIndex]       = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  function openSpotlight(index: number) {
    if (isDragging.current) return;
    const s = spotlights[index];
    if (s) spotlightsService.view(s.id).catch(() => {});
    setSpotlights(prev =>
      prev.map((sp, i) => (i === index ? { ...sp, isViewed: true } : sp))
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
