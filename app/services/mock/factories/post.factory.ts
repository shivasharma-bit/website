import type { Post, ReactionSummary, MediaItem } from '../../types/post.types';
import { createUser } from './user.factory';

const POST_BODIES = [
  "Shipping design tokens via a CI pipeline changed everything for our team. Zero drift between Figma and production — here's how we structured it.",
  "The fastest way to kill a product is to optimize for engagement over outcomes. Three principles we use to keep the team honest.",
  "We just open-sourced our internal component library. Six months of work, 240+ components, fully typed. Link in comments.",
  "Hot take: most 'design systems' are just UI kits with a Notion doc. A real system has decision records, migration guides, and team buy-in.",
  "Joined a new company this week. Biggest culture shock: they ship on Fridays and it *works*. Thread on how they pull it off.",
  "After two years of building in stealth, we're launching next Tuesday. The hardest part wasn't the product — it was staying patient.",
  "We reduced our LCP by 1.4s by doing exactly one thing. No, it wasn't lazy loading. It was embarrassingly simple.",
  "Interview tip that no one talks about: spend 20% of your prep time researching the *interviewer*, not the company.",
  "We ran a user research sprint with 40 participants in 4 days. The framework we used, broken down step by step.",
  "The gap between 'I can code this' and 'I can architect this' is where most senior engineers get stuck.",
];

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
];

let _counter = 0;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const REACTIONS: ReactionSummary[] = [
  { type: 'insightful', count: 0, label: 'Insightful', icon: 'lightbulb'     },
  { type: 'innovative', count: 0, label: 'Innovative', icon: 'sparkles'      },
  { type: 'agree',      count: 0, label: 'Agree',      icon: 'thumbs-up'     },
  { type: 'support',    count: 0, label: 'Support',    icon: 'heart'         },
  { type: 'celebrate',  count: 0, label: 'Celebrate',  icon: 'party-popper'  },
];

function makeReactions(): ReactionSummary[] {
  return REACTIONS.map(r => ({
    ...r,
    count: Math.floor(Math.random() * 200),
  }));
}

function makeMedia(withImage: boolean): MediaItem[] {
  if (!withImage) return [];
  return [{
    id:      `media_${_counter}`,
    url:     COVER_IMAGES[_counter % COVER_IMAGES.length],
    type:    'image',
    alt:     'Post image',
    width:   1200,
    height:  630,
    caption: null,
  }];
}

export function createPost(overrides: Partial<Post> = {}): Post {
  const id       = `post_${++_counter}`;
  const withImg  = Math.random() > 0.45;
  const reactions = makeReactions();
  const totalReactions = reactions.reduce((s, r) => s + r.count, 0);
  const minsAgo  = Math.floor(Math.random() * 60 * 48);

  return {
    id,
    type:           'update',
    author:         createUser(),
    body:           pick(POST_BODIES),
    media:          makeMedia(withImg),
    poll:           null,
    repostOf:       null,
    tags:           [],
    reactions,
    totalReactions,
    commentCount:   Math.floor(Math.random() * 80),
    repostCount:    Math.floor(Math.random() * 40),
    userReaction:   null,
    isBookmarked:   false,
    createdAt:      new Date(Date.now() - minsAgo * 60_000).toISOString(),
    editedAt:       null,
    audience:       'public',
    ...overrides,
  };
}

export function createPosts(count: number, overrides: Partial<Post> = {}): Post[] {
  return Array.from({ length: count }, () => createPost(overrides));
}
