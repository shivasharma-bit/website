// ─── User ────────────────────────────────────────────────────────────────────

export type ConnectionDegree = '1st' | '2nd' | '3rd' | 'following';
export type OnlineStatus     = 'online' | 'away' | 'offline';

export interface User {
  id:               string;
  username:         string;
  displayName:      string;
  avatarUrl:        string | null;
  coverUrl:         string | null;
  headline:         string;
  location:         string;
  company:          string;
  companyLogoUrl:   string | null;
  pronouns:         string | null;
  website:          string | null;
  bio:              string;
  isVerified:       boolean;
  isOpenToWork:     boolean;
  isHiring:         boolean;
  followersCount:   number;
  followingCount:   number;
  connectionsCount: number;
  degree:           ConnectionDegree | null;
  onlineStatus:     OnlineStatus;
  joinedAt:         string;
  mutualConnections: Pick<User, 'id' | 'displayName' | 'avatarUrl'>[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser extends User {
  email:        string;
  accessToken:  string;
  refreshToken: string;
}

export interface AuthState {
  user:        AuthUser | null;
  isLoading:   boolean;
  isAuthenticated: boolean;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  id:       string;
  label:    string;
  href:     string;
  icon:     string;
  badge?:   number;
  exact?:   boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data:    T;
  success: boolean;
  message: string | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page:       number;
    pageSize:   number;
    totalItems: number;
    totalPages: number;
    hasMore:    boolean;
  };
}

export interface ApiError {
  code:    string;
  message: string;
  status:  number;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'post_reaction'
  | 'post_comment'
  | 'post_mention'
  | 'profile_view'
  | 'endorsement';

export interface Notification {
  id:        string;
  type:      NotificationType;
  actor:     Pick<User, 'id' | 'displayName' | 'avatarUrl' | 'headline'>;
  excerpt:   string | null;
  targetUrl: string;
  isRead:    boolean;
  createdAt: string;
}
