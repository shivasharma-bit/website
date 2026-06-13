import type { User } from './core.types';

export type ThreadStatus = 'active' | 'request' | 'archived';

export interface Thread {
  id:              string;
  participants:    Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'headline' | 'onlineStatus'>[];
  lastMessage:     {
    body:       string;
    senderId:   string;
    createdAt:  string;
    isRead:     boolean;
  } | null;
  unreadCount:     number;
  status:          ThreadStatus;
  createdAt:       string;
  mutualCount:     number;
}

export interface Message {
  id:          string;
  threadId:    string;
  senderId:    string;
  body:        string;
  mediaUrl:    string | null;
  sharedPost:  { id: string; title: string; authorName: string } | null;
  status:      'sending' | 'delivered' | 'read';
  createdAt:   string;
  editedAt:    string | null;
}
