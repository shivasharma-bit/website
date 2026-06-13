'use client';

import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/api/profile.service';
import type { User } from '../types/core.types';
import type { Project, Experience, Education, Skill, Recommendation } from '../types/project.types';
import type { Post } from '../types/post.types';

interface ProfileData {
  user:            User | null;
  projects:        Project[];
  experiences:     Experience[];
  education:       Education[];
  skills:          Skill[];
  recommendations: Recommendation[];
  activity:        Post[];
}

interface UseProfileReturn extends ProfileData {
  isLoading:  boolean;
  error:      string | null;
  isFollowing:boolean;
  toggleFollow: () => Promise<void>;
}

export function useProfile(username: string): UseProfileReturn {
  const [data,        setData]        = useState<ProfileData>({
    user: null, projects: [], experiences: [], education: [], skills: [], recommendations: [], activity: [],
  });
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) return;
    let active = true;
    setIsLoading(true);
    setError(null);

    async function load() {
      try {
        const user = await profileService.getProfile(username);
        if (!active) return;

        const [projects, experiences, education, skills, recommendations, activity] = await Promise.all([
          profileService.getProjects(user.id),
          profileService.getExperiences(user.id),
          profileService.getEducation(user.id),
          profileService.getSkills(user.id),
          profileService.getRecommendations(user.id),
          profileService.getActivity(user.id),
        ]);

        if (!active) return;
        setData({ user, projects, experiences, education, skills, recommendations, activity });
      } catch {
        if (active) setError('Profile not found');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [username]);

  const toggleFollow = useCallback(async () => {
    setIsFollowing(prev => !prev);
    try {
      isFollowing
        ? await profileService.unfollow(data.user?.id ?? '')
        : await profileService.follow(data.user?.id ?? '');
    } catch {
      setIsFollowing(prev => !prev);
    }
  }, [isFollowing, data.user]);

  return { ...data, isLoading, error, isFollowing, toggleFollow };
}
