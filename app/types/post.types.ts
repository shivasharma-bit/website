import type { User } from './core.types';

export type PostType      = 'update' | 'case_study' | 'carousel' | 'poll' | 'repost';
export type ReactionType  = 'insightful' | 'innovative' | 'agree' | 'support' | 'celebrate';

export interface MediaItem {
  id:       string;
  url:      string;
  type:     'image' | 'video';
  alt:      string;
  width:    number;
  height:   number;
  caption:  string | null;
}

export interface PollOption {
  id:          string;
  text:        string;
  voteCount:   number;
}

export interface Poll {
  id:           string;
  question:     string;
  options:      PollOption[];
  totalVotes:   number;
  expiresAt:    string;
  userVotedId:  string | null;
}

export interface ReactionSummary {
  type:   ReactionType;
  count:  number;
  label:  string;
  icon:   string;
}

export interface Post {
  id:              string;
  type:            PostType;
  author:          Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'headline' | 'company' | 'isVerified'>;
  body:            string;
  media:           MediaItem[];
  poll:            Poll | null;
  repostOf:        Post | null;
  tags:            string[];
  reactions:       ReactionSummary[];
  totalReactions:  number;
  commentCount:    number;
  repostCount:     number;
  userReaction:    ReactionType | null;
  isBookmarked:    boolean;
  createdAt:       string;
  editedAt:        string | null;
  audience:        'public' | 'connections' | 'followers';
}

export interface Comment {
  id:         string;
  postId:     string;
  parentId:   string | null;
  author:     Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'headline'>;
  body:       string;
  likes:      number;
  isLiked:    boolean;
  replies:    Comment[];
  createdAt:  string;
}

export interface FeedFilter {
  type?:      'all' | PostType;
  following?: boolean;
  topic?:     string;
}
