import { apiClient } from './client';
import { feedMock } from '../mock/feed.mock';
import type { Post, FeedFilter } from '../../types/post.types';
import type { PaginatedResponse } from '../../types/core.types';

const USE_MOCK = true; // set to false when backend is ready

export const feedService = {
  async getFeed(page = 1, filter?: FeedFilter, signal?: AbortSignal): Promise<PaginatedResponse<Post>> {
    if (USE_MOCK) return feedMock.getFeed(page, filter, signal);
    const params = new URLSearchParams({ page: String(page) });
    if (filter?.type && filter.type !== 'all') params.set('type', filter.type);
    if (filter?.following) params.set('following', 'true');
    if (filter?.topic) params.set('topic', filter.topic);
    return apiClient.get(`/feed?${params}`, signal);
  },
  async getPost(id: string): Promise<{ data: Post }> {
    if (USE_MOCK) return { data: (await feedMock.getPost(id)) };
    return apiClient.get(`/posts/${id}`);
  },
  async createPost(payload: Partial<Post>): Promise<{ data: Post }> {
    if (USE_MOCK) return { data: (await feedMock.createPost(payload)) };
    return apiClient.post('/posts', payload);
  },
  async deletePost(id: string): Promise<void> {
    if (USE_MOCK) return feedMock.deletePost(id);
    return apiClient.delete(`/posts/${id}`);
  },
  async reactToPost(postId: string, reaction: string): Promise<void> {
    if (USE_MOCK) return feedMock.reactToPost(postId, reaction);
    return apiClient.post(`/posts/${postId}/react`, { reaction });
  },
  async unreactToPost(postId: string): Promise<void> {
    if (USE_MOCK) return feedMock.unreactToPost(postId);
    return apiClient.delete(`/posts/${postId}/react`);
  },
  async bookmarkPost(postId: string): Promise<void> {
    if (USE_MOCK) return feedMock.bookmarkPost(postId);
    return apiClient.post(`/posts/${postId}/bookmark`, {});
  },
  async unbookmarkPost(postId: string): Promise<void> {
    return apiClient.delete(`/posts/${postId}/bookmark`);
  },
  async repost(postId: string): Promise<void> {
    return apiClient.post(`/posts/${postId}/repost`, {});
  },
  async getComments(postId: string, page = 1): Promise<PaginatedResponse<any>> {
    return apiClient.get(`/posts/${postId}/comments?page=${page}`);
  },
  async createComment(postId: string, body: string, parentId: string | null = null): Promise<void> {
    return apiClient.post(`/posts/${postId}/comments`, { body, parentId });
  },
  async deleteComment(commentId: string): Promise<void> {
    return apiClient.delete(`/comments/${commentId}`);
  },
  async likeComment(commentId: string): Promise<void> {
    return apiClient.post(`/comments/${commentId}/like`, {});
  },
  async unlikeComment(commentId: string): Promise<void> {
    return apiClient.delete(`/comments/${commentId}/like`);
  },
};