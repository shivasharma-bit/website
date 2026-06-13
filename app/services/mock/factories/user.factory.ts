import type { User } from '../../types/core.types';

const FIRST_NAMES = ['James','Priya','Tom','Arjun','Selin','Fatima','Carlos','Mei','Noah','Anya','Luca','Zara'];
const LAST_NAMES  = ['Okafor','Sundaram','Eriksson','Mehta','Kaya','Al-Rashid','Rivera','Lin','Park','Ivanova','Rossi','Ahmed'];
const ROLES       = ['Senior Engineer','Product Lead','Design Director','Founder','Staff Designer','Engineering Manager','Head of Growth','Principal PM'];
const COMPANIES   = ['Vercel','Linear','Figma','Notion','Stripe','Anthropic','Loom','Raycast','Arc','Superhuman','Planetscale','Resend'];
const AVATARS     = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
];

let _counter = 100;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createUser(overrides: Partial<User> = {}): User {
  const id        = `usr_${++_counter}`;
  const firstName = pick(FIRST_NAMES);
  const lastName  = pick(LAST_NAMES);
  const name      = `${firstName} ${lastName}`;
  const role      = pick(ROLES);
  const company   = pick(COMPANIES);

  return {
    id,
    username:         `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    displayName:      name,
    avatarUrl:        AVATARS[_counter % AVATARS.length],
    coverUrl:         null,
    headline:         `${role} at ${company}`,
    location:         pick(['San Francisco, CA','New York, NY','London, UK','Berlin, DE','Remote']),
    company,
    companyLogoUrl:   null,
    pronouns:         null,
    website:          null,
    bio:              `Building products at ${company}. Prev: various startups. Writing about craft and process.`,
    isVerified:       Math.random() > 0.7,
    isOpenToWork:     Math.random() > 0.85,
    isHiring:         Math.random() > 0.75,
    followersCount:   Math.floor(Math.random() * 50_000) + 500,
    followingCount:   Math.floor(Math.random() * 800)    + 50,
    connectionsCount: Math.floor(Math.random() * 3_000)  + 100,
    degree:           pick(['1st','2nd','3rd','following']),
    onlineStatus:     pick(['online','away','offline']),
    joinedAt:         new Date(Date.now() - Math.random() * 3 * 365 * 86400 * 1000).toISOString(),
    mutualConnections:[],
    ...overrides,
  };
}

export function createUsers(count: number, overrides: Partial<User> = {}): User[] {
  return Array.from({ length: count }, () => createUser(overrides));
}
