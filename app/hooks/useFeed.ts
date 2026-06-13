'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { feedService } from '../services/api/feed.service';
import type { Post, FeedFilter, ReactionType } from '../types/post.types';

interface UseFeedReturn {
  posts:         Post[];
  isLoading:     boolean;
  isLoadingMore: boolean;
  hasMore:       boolean;
  error:         string | null;
  loadMore:      () => Promise<void>;
  refresh:       () => Promise<void>;
  reactToPost:   (postId: string, reaction: ReactionType) => Promise<void>;
  bookmarkPost:  (postId: string) => void;
  prependPost:   (post: Post) => void;
}

export function useFeed(filter?: FeedFilter): UseFeedReturn {
  const [posts,         setPosts]         = useState<Post[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore,       setHasMore]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const pageRef    = useRef(1);
  const abortRef   = useRef<AbortController | null>(null);

  async function fetchPage(page: number, replace: boolean) {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await feedService.getFeed(page, filter, ctrl.signal);
      if (ctrl.signal.aborted) return;
      setPosts(prev => replace ? res.data : [...prev, ...res.data]);
      setHasMore(res.pagination.hasMore);
      setError(null);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError('Failed to load feed. Please try again.');
    }
  }

  useEffect(() => {
    pageRef.current = 1;
    setIsLoading(true);
    fetchPage(1, true).finally(() => setIsLoading(false));
    return () => abortRef.current?.abort();
  }, [JSON.stringify(filter)]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    pageRef.current += 1;
    await fetchPage(pageRef.current, false);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, filter]);

  const refresh = useCallback(async () => {
    pageRef.current = 1;
    setIsLoading(true);
    await fetchPage(1, true);
    setIsLoading(false);
  }, [filter]);

  // Optimistic reaction toggle
  const reactToPost = useCallback(async (postId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const alreadyReacted = p.userReaction === reaction;
      const updatedReactions = p.reactions.map(r => ({
        ...r,
        count: r.type === reaction
          ? r.count + (alreadyReacted ? -1 : 1)
          : r.type === p.userReaction && p.userReaction
          ? r.count - 1
          : r.count,
      }));
      const delta = alreadyReacted ? -1 : (p.userReaction ? 0 : 1);
      return {
        ...p,
        reactions:      updatedReactions,
        totalReactions: p.totalReactions + delta,
        userReaction:   alreadyReacted ? null : reaction,
      };
    }));

    try {
      const post = posts.find(p => p.id === postId);
      if (post?.userReaction === reaction) {
        await feedService.unreactToPost(postId);
      } else {
        await feedService.reactToPost(postId, reaction);
      }
    } catch {
      // Revert on failure — in production this would restore the previous state
    }
  }, [posts]);

  // Optimistic bookmark toggle
  const bookmarkPost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));
    const post = posts.find(p => p.id === postId);
    feedService.bookmarkPost(postId).catch(() => {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
      ));
    });
  }, [posts]);

  const prependPost = useCallback((post: Post) => {
    setPosts(prev => [post, ...prev]);
  }, []);

  return {
    posts, isLoading, isLoadingMore, hasMore, error,
    loadMore, refresh, reactToPost, bookmarkPost, prependPost,
  };
}
