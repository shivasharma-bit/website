'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../feed/PostCard';
import { SkeletonCard } from '../shared/Primitives';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { Post, ReactionType } from '../../types/post.types';

interface ActivityTabProps {
  posts:     Post[];
  isLoading: boolean;
}

export function ActivityTab({ posts, isLoading }: ActivityTabProps) {
  // Local optimistic state for profile activity reactions
  const [localPosts, setLocalPosts] = React.useState<Post[]>(posts);

  React.useEffect(() => { setLocalPosts(posts); }, [posts]);

  function handleReact(postId: string, type: ReactionType) {
    setLocalPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const alreadyReacted = p.userReaction === type;
      return {
        ...p,
        userReaction: alreadyReacted ? null : type,
        totalReactions: p.totalReactions + (alreadyReacted ? -1 : 1),
      };
    }));
  }

  function handleBookmark(postId: string) {
    setLocalPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} hasAvatar hasImage={i === 1} />)}
      </div>
    );
  }

  if (localPosts.length === 0) {
    return (
      <div className="card py-12 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">No posts yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {localPosts.map(post => (
        <motion.div key={post.id} variants={staggerItem}>
          <PostCard
            post={post}
            onReact={handleReact}
            onBookmark={handleBookmark}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
