import type { Project, Experience, Education, Skill, Recommendation } from '../../types/project.types';
import { createUser } from './user.factory';

const PROJECT_DATA = [
  {
    title:   'Stripe Design System v3',
    summary: 'Led the ground-up rebuild of Stripe\'s internal design system, unifying 14 product surfaces under a single token-driven architecture.',
    category: 'design' as const,
    tags:    ['Design Systems','Tokens','React','Figma'],
    coverUrl:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    year:    2024,
  },
  {
    title:   'Payments Onboarding Redesign',
    summary: 'Reduced time-to-first-payment from 6 days to 18 hours by reimagining the merchant onboarding flow end-to-end.',
    category: 'design' as const,
    tags:    ['Product Design','UX Research','Conversion'],
    coverUrl:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    year:    2023,
  },
  {
    title:   'Component Migration CLI',
    summary: 'Built an internal CLI tool that automated 80% of the legacy component migration, cutting engineering effort by ~600 hours.',
    category: 'engineering' as const,
    tags:    ['TypeScript','AST','Tooling','CLI'],
    coverUrl:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    year:    2023,
  },
  {
    title:   'Design Systems Conference Talk',
    summary: 'Keynoted Config 2023 on the topic of token governance at scale — watched by 18,000+ people live and on replay.',
    category: 'speaking' as const,
    tags:    ['Public Speaking','Design Tokens','Config 2023'],
    coverUrl:'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    year:    2023,
  },
];

let _ctr = 0;

export function createProject(index = 0): Project {
  const data = PROJECT_DATA[index % PROJECT_DATA.length];
  const id   = `proj_${++_ctr}`;
  return {
    id,
    slug:          id,
    title:         data.title,
    summary:       data.summary,
    coverUrl:      data.coverUrl,
    category:      data.category,
    tags:          data.tags,
    year:          data.year,
    client:        null,
    role:          'Lead Designer / Engineer',
    collaborators: [createUser(), createUser()],
    sections: [
      { id: 's1', type: 'text',  heading: 'The Problem',  body: 'Teams across the org were maintaining divergent component implementations, leading to visual inconsistency and duplicated effort.', media: null, code: null },
      { id: 's2', type: 'image', heading: null,           body: null, media: { url: data.coverUrl ?? '', alt: 'Project image', caption: 'Before and after comparison' }, code: null },
      { id: 's3', type: 'text',  heading: 'The Approach', body: 'We audited 14 product surfaces, identified 240 unique components, and consolidated to 80 shared primitives backed by a semantic token layer.', media: null, code: null },
      { id: 's4', type: 'text',  heading: 'The Outcome',  body: 'Design-to-production time dropped by 60%. Engineer satisfaction scores for the design system increased from 3.1 to 4.7/5.', media: null, code: null },
    ],
    externalUrl:   null,
    isHighlighted: index < 2,
    viewCount:     Math.floor(Math.random() * 5000) + 200,
    reactionCount: Math.floor(Math.random() * 300)  + 10,
    commentCount:  Math.floor(Math.random() * 40),
    createdAt:     new Date(2024 - index, 0, 1).toISOString(),
  };
}

export function createExperiences(): Experience[] {
  return [
    {
      id: 'exp_1', company: 'Stripe', companyLogo: null,
      role: 'Design Systems Lead', startDate: '2022-03', endDate: null, isCurrent: true,
      location: 'San Francisco, CA',
      description: 'Leading the design systems practice across all Stripe product surfaces.',
      highlights: ['Rebuilt design system from scratch', 'Managed team of 6 designers and 4 engineers', 'Shipped 240+ components'],
      skills: ['Design Systems','Figma','React','TypeScript'],
    },
    {
      id: 'exp_2', company: 'Figma', companyLogo: null,
      role: 'Senior Product Designer', startDate: '2019-06', endDate: '2022-02', isCurrent: false,
      location: 'San Francisco, CA',
      description: 'Designed core editing and collaboration features used by millions of designers daily.',
      highlights: ['Led redesign of the properties panel','Shipped branching feature','Grew NPS from 42 to 67'],
      skills: ['Product Design','User Research','Prototyping'],
    },
    {
      id: 'exp_3', company: 'Airbnb', companyLogo: null,
      role: 'Product Designer', startDate: '2017-01', endDate: '2019-05', isCurrent: false,
      location: 'San Francisco, CA',
      description: 'Worked on the host experience team, redesigning the listing creation flow.',
      highlights: ['Increased listing completion rate by 22%','Shipped mobile-first redesign'],
      skills: ['Product Design','A/B Testing','Mobile Design'],
    },
  ];
}

export function createEducation(): Education[] {
  return [
    { id: 'edu_1', institution: 'Rhode Island School of Design', logo: null, degree: 'BFA', field: 'Graphic Design', startYear: 2013, endYear: 2017, description: null },
  ];
}

export function createSkills(): Skill[] {
  return [
    { id: 'sk_1', name: 'Design Systems',    endorsements: 148, isTopSkill: true  },
    { id: 'sk_2', name: 'Figma',             endorsements: 203, isTopSkill: true  },
    { id: 'sk_3', name: 'TypeScript',         endorsements: 89,  isTopSkill: true  },
    { id: 'sk_4', name: 'User Research',      endorsements: 76,  isTopSkill: false },
    { id: 'sk_5', name: 'React',             endorsements: 112, isTopSkill: false },
    { id: 'sk_6', name: 'Product Strategy',  endorsements: 54,  isTopSkill: false },
    { id: 'sk_7', name: 'Team Leadership',   endorsements: 67,  isTopSkill: false },
    { id: 'sk_8', name: 'Prototyping',       endorsements: 91,  isTopSkill: false },
  ];
}

export function createRecommendations(): Recommendation[] {
  return [
    {
      id: 'rec_1',
      recommender: createUser(),
      relationship: 'Managed Maya directly at Figma',
      body: "Maya is one of the sharpest systems thinkers I've worked with. She has a rare ability to zoom between pixel-level decisions and organizational impact without losing either. Her work on our properties panel set the quality bar for everything that followed.",
      createdAt: '2022-03-10T00:00:00.000Z',
    },
    {
      id: 'rec_2',
      recommender: createUser(),
      relationship: 'Collaborated on the design system at Stripe',
      body: "Working with Maya on the v3 design system was a masterclass in how to run a complex, multi-team initiative. She brought structure without bureaucracy, and pushed the quality bar in a way that brought engineers and designers genuinely closer together.",
      createdAt: '2024-01-15T00:00:00.000Z',
    },
  ];
}
