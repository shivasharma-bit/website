'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore:   () => void | Promise<void>;
  hasMore:      boolean;
  isLoading:    boolean;
  rootMargin?:  string;
  threshold?:   number;
}

/**
 * Attaches an IntersectionObserver to a sentinel element ref.
 * Calls onLoadMore whenever the sentinel enters the viewport
 * and hasMore is true and isLoading is false.
 *
 * Usage:
 *   const sentinelRef = useInfiniteScroll({ onLoadMore, hasMore, isLoading });
 *   return <div ref={sentinelRef} aria-hidden="true" />;
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '200px',
  threshold  = 0,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(isLoading);
  const hasMoreRef   = useRef(hasMore);

  // Keep refs in sync so the callback always sees current values
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { hasMoreRef.current   = hasMore;   }, [hasMore]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
        onLoadMore();
      }
    },
    [onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold,
    });

    observer.observe(sentinel);
    return () => observer.unobserve(sentinel);
  }, [handleIntersect, rootMargin, threshold]);

  return sentinelRef;
}
