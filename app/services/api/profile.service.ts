import { profileMock } from '../mock/profile.mock';
import type { User } from '../../types/core.types';
import type { Project, Experience, Education, Skill, Recommendation } from '../../types/project.types';
import type { Post } from '../../types/post.types';

export const profileService = {
  getProfile:        (username: string): Promise<User>             => profileMock.getProfile(username),
  getProjects:       (userId: string):   Promise<Project[]>        => profileMock.getProjects(userId),
  getProject:        (userId: string, slug: string): Promise<Project> => profileMock.getProject(userId, slug),
  getExperiences:    (userId: string):   Promise<Experience[]>     => profileMock.getExperiences(userId),
  getEducation:      (userId: string):   Promise<Education[]>      => profileMock.getEducation(userId),
  getSkills:         (userId: string):   Promise<Skill[]>          => profileMock.getSkills(userId),
  getRecommendations:(userId: string):   Promise<Recommendation[]> => profileMock.getRecommendations(userId),
  getActivity:       (userId: string, page?: number): Promise<Post[]> => profileMock.getActivity(userId, page),
  follow:            (userId: string):   Promise<void>             => profileMock.follow(userId),
  unfollow:          (userId: string):   Promise<void>             => profileMock.unfollow(userId),
  connect:           (userId: string):   Promise<void>             => profileMock.connect(userId),
  getSuggestedUsers: ():                 Promise<User[]>           => profileMock.getSuggestedUsers(),
};
