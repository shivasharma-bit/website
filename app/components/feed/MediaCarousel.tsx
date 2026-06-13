'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { MediaItem } from '../../types/post.types';

interface MediaCarouselProps {
  items:      MediaItem[];
  onExpand?:  (index: number) => void;
  className?: string;
}

export function MediaCarousel({ items, onExpand, className }: MediaCarouselProps) {
  const [index,      setIndex]      = useState(0);
  const [direction,  setDirection]  = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const go = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    setDirection(clamped > index ? 1 : -1);
    setIndex(clamped);
  }, [index, items.length]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setIsDragging(false);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = dragStartX.current - e.clientX;
    if (Math.abs(dx) > 40) {
      go(dx > 0 ? index + 1 : index - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1);
    if (e.key === 'ArrowLeft')  go(index - 1);
  };

  if (items.length === 0) return null;

  const current = items[index];
  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className={cn('relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-raised)]', className)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Media ${index + 1} of ${items.length}`}
      role="region"
    >
      {/* ── Main media ─────────────────────────────── */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {current.type === 'video' ? (
              <video
                src={current.url}
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                aria-label={current.alt}
              />
            ) : (
              <img
                src={current.url}
                alt={current.alt}
                className="w-full h-full object-cover select-none"
                draggable={false}
                onClick={() => onExpand?.(index)}
                style={{ cursor: onExpand ? 'zoom-in' : 'default' }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Caption overlay */}
        {current.caption && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-xs">{current.caption}</p>
          </div>
        )}

        {/* Expand button */}
        {onExpand && current.type === 'image' && (
          <button
            onClick={() => onExpand(index)}
            className="absolute top-2 right-2 w-7 h-7 rounded-md bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            aria-label="Expand image"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </button>
        )}

        {/* Prev / Next arrows */}
        {items.length > 1 && (
          <>
            {index > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); go(index - 1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            )}
            {index < items.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); go(index + 1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Dot pagination ──────────────────────────── */}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist" aria-label="Slides">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-200',
                i === index
                  ? 'w-4 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
