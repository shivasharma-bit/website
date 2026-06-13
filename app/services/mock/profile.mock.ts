import { sleep } from '../../lib/utils';
import { createUser } from './factories/user.factory';
import {
  createProject, createExperiences, createEducation, createSkills, createRecommendations,
} from './factories/project.factory';
import { createPosts } from './factories/post.factory';
import type { User } from '../../types/core.types';
import type { Project, Experience, Education, Skill, Recommendation } from '../../types/project.types';
import type { Post } from '../../types/post.types';

export const profileMock = {
  async getProfile(username: string): Promise<User> {
    await sleep(400);
    return createUser({ username });
  },

  async getProjects(userId: string): Promise<Project[]> {
    await sleep(350);
    return Array.from({ length: 4 }, (_, i) => createProject(i));
  },

  async getProject(userId: string, slug: string): Promise<Project> {
    await sleep(350);
    return createProject(0);
  },

  async getExperiences(userId: string): Promise<Experience[]> {
    await sleep(300);
    return createExperiences();
  },

  async getEducation(userId: string): Promise<Education[]> {
    await sleep(250);
    return createEducation();
  },

  async getSkills(userId: string): Promise<Skill[]> {
    await sleep(250);
    return createSkills();
  },

  async getRecommendations(userId: string): Promise<Recommendation[]> {
    await sleep(350);
    return createRecommendations();
  },

  async getActivity(userId: string, page = 1): Promise<Post[]> {
    await sleep(400);
    return createPosts(8);
  },

  async follow(userId: string): Promise<void> {
    await sleep(200);
  },

  async unfollow(userId: string): Promise<void> {
    await sleep(200);
  },

  async connect(userId: string): Promise<void> {
    await sleep(200);
  },

  async getSuggestedUsers(): Promise<User[]> {
    await sleep(350);
    return Array.from({ length: 6 }, () => createUser());
  },
};
