import { feedMock } from '../mock/feed.mock';
import type { Post, FeedFilter } from '../../types/post.types';
import type { PaginatedResponse } from '../../types/core.types';

export const feedService = {
  getFeed: (page = 1, filter?: FeedFilter, signal?: AbortSignal): Promise<PaginatedResponse<Post>> =>
    feedMock.getFeed(page, filter, signal),

  getPost: (id: string): Promise<Post> =>
    feedMock.getPost(id),

  reactToPost: (postId: string, reaction: string): Promise<void> =>
    feedMock.reactToPost(postId, reaction),

  unreactToPost: (postId: string): Promise<void> =>
    feedMock.unreactToPost(postId),

  bookmarkPost: (postId: string): Promise<void> =>
    feedMock.bookmarkPost(postId),

  createPost: (payload: Partial<Post>): Promise<Post> =>
    feedMock.createPost(payload),

  deletePost: (postId: string): Promise<void> =>
    feedMock.deletePost(postId),
};
