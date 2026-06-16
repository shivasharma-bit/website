import { apiClient } from './client';
import type { User } from '../../types/core.types';
import type { Project, Experience, Education, Skill, Recommendation } from '../../types/project.types';
import type { Post } from '../../types/post.types';

export const profileService = {
  async getProfile(username: string): Promise<User> {
    const r = await apiClient.get<{ data: User }>(`/users/${username}`);
    return r.data;
  },
  async updateMe(payload: Partial<User>): Promise<User> {
    const r = await apiClient.patch<{ data: User }>('/users/me', payload);
    return r.data;
  },
  async getProjects(userId: string): Promise<Project[]> {
    const r = await apiClient.get<{ data: Project[] }>(`/users/${userId}/projects`);
    return r.data;
  },
  async getProject(userId: string, slug: string): Promise<Project> {
    const r = await apiClient.get<{ data: Project }>(`/users/${userId}/projects/${slug}`);
    return r.data;
  },
  async getExperiences(userId: string): Promise<Experience[]> {
    const r = await apiClient.get<{ data: Experience[] }>(`/users/${userId}/experience`);
    return r.data;
  },
  async getEducation(userId: string): Promise<Education[]> {
    const r = await apiClient.get<{ data: Education[] }>(`/users/${userId}/education`);
    return r.data;
  },
  async getSkills(userId: string): Promise<Skill[]> {
    const r = await apiClient.get<{ data: Skill[] }>(`/users/${userId}/skills`);
    return r.data;
  },
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    const r = await apiClient.get<{ data: Recommendation[] }>(`/users/${userId}/recommendations`);
    return r.data;
  },
  async getActivity(userId: string, page = 1): Promise<Post[]> {
    const r = await apiClient.get<{ data: Post[] }>(`/users/${userId}/activity?page=${page}`);
    return r.data;
  },
  async follow(userId: string): Promise<void> {
    return apiClient.post(`/users/${userId}/follow`, {});
  },
  async unfollow(userId: string): Promise<void> {
    return apiClient.delete(`/users/${userId}/follow`);
  },
  async connect(userId: string): Promise<void> {
    return apiClient.post(`/users/${userId}/connect`, {});
  },
  async getSuggestedUsers(): Promise<User[]> {
    const r = await apiClient.get<{ data: User[] }>('/users/suggested');
    return r.data;
  },
};
