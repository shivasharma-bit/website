import { sleep } from '../../lib/utils';
import { createPosts } from './factories/post.factory';
import type { Post, FeedFilter } from '../../types/post.types';
import type { PaginatedResponse } from '../../types/core.types';

const PAGE_SIZE = 10;

export const feedMock = {
  async getFeed(
    page       = 1,
    _filter?:  FeedFilter,
    signal?:   AbortSignal
  ): Promise<PaginatedResponse<Post>> {
    await sleep(450 + Math.random() * 200);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const posts      = createPosts(PAGE_SIZE);
    const totalItems = 80;
    return {
      data:    posts,
      success: true,
      message: null,
      pagination: {
        page,
        pageSize:   PAGE_SIZE,
        totalItems,
        totalPages: Math.ceil(totalItems / PAGE_SIZE),
        hasMore:    page * PAGE_SIZE < totalItems,
      },
    };
  },

  async getPost(id: string): Promise<Post> {
    await sleep(300);
    return createPosts(1)[0];
  },

  async reactToPost(postId: string, reaction: string): Promise<void> {
    await sleep(150);
  },

  async unreactToPost(postId: string): Promise<void> {
    await sleep(150);
  },

  async bookmarkPost(postId: string): Promise<void> {
    await sleep(150);
  },

  async createPost(payload: Partial<Post>): Promise<Post> {
    await sleep(600);
    return createPosts(1)[0];
  },

  async deletePost(postId: string): Promise<void> {
    await sleep(300);
  },
};
