import type { User } from './core.types';

export type ProjectCategory = 'design' | 'engineering' | 'writing' | 'speaking' | 'research' | 'other';

export interface ProjectSection {
  id:      string;
  type:    'text' | 'image' | 'video' | 'embed' | 'divider' | 'code';
  heading: string | null;
  body:    string | null;
  media:   { url: string; alt: string; caption: string | null } | null;
  code:    { language: string; content: string } | null;
}

export interface Project {
  id:             string;
  slug:           string;
  title:          string;
  summary:        string;
  coverUrl:       string | null;
  category:       ProjectCategory;
  tags:           string[];
  year:           number;
  client:         string | null;
  role:           string;
  collaborators:  Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>[];
  sections:       ProjectSection[];
  externalUrl:    string | null;
  isHighlighted:  boolean;
  viewCount:      number;
  reactionCount:  number;
  commentCount:   number;
  createdAt:      string;
}

export interface Experience {
  id:           string;
  company:      string;
  companyLogo:  string | null;
  role:         string;
  startDate:    string;
  endDate:      string | null;
  isCurrent:    boolean;
  location:     string;
  description:  string;
  highlights:   string[];
  skills:       string[];
}

export interface Education {
  id:          string;
  institution: string;
  logo:        string | null;
  degree:      string;
  field:       string;
  startYear:   number;
  endYear:     number | null;
  description: string | null;
}

export interface Skill {
  id:           string;
  name:         string;
  endorsements: number;
  isTopSkill:   boolean;
}

export interface Recommendation {
  id:           string;
  recommender:  Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'headline'>;
  relationship: string;
  body:         string;
  createdAt:    string;
}
