import { profileMock } from '../mock/profile.mock';
import type { User } from '../../types/core.types';
import type { Project, Experience, Education, Skill, Recommendation } from '../../types/project.types';
import type { Post } from '../../types/post.types';

export const profileService = {
  getProfile:         (username: string)              => profileMock.getProfile(username),
  updateMe:           (payload: Partial<User>)        => profileMock.getProfile('maya.chen'),
  getProjects:        (userId: string)                => profileMock.getProjects(userId),
  getProject:         (userId: string, slug: string)  => profileMock.getProject(userId, slug),
  getExperiences:     (userId: string)                => profileMock.getExperiences(userId),
  getEducation:       (userId: string)                => profileMock.getEducation(userId),
  getSkills:          (userId: string)                => profileMock.getSkills(userId),
  getRecommendations: (userId: string)                => profileMock.getRecommendations(userId),
  getActivity:        (userId: string, page = 1)      => profileMock.getActivity(userId, page),
  follow:             (userId: string)                => profileMock.follow(userId),
  unfollow:           (userId: string)                => profileMock.unfollow(userId),
  connect:            (userId: string)                => profileMock.connect(userId),
  getSuggestedUsers:  ()                              => profileMock.getSuggestedUsers(),
};