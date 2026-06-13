import { sleep } from '../../lib/utils';
import { createUser } from './factories/user.factory';
import type { Thread, Message } from '../../types/message.types';

function makeThread(i: number): Thread {
  const participant = createUser();
  const minsAgo     = (i + 1) * 37;
  const bodies = [
    'That makes a lot of sense, thanks for the context.',
    'I was thinking the same — let\'s sync this week.',
    'Just sent over the doc. Let me know what you think.',
    'Totally agree. Want to jump on a call?',
    'Appreciated the intro! Following up now.',
  ];
  return {
    id:           `thread_${i}`,
    participants: [participant],
    lastMessage: {
      body:      bodies[i % bodies.length],
      senderId:  participant.id,
      createdAt: new Date(Date.now() - minsAgo * 60_000).toISOString(),
      isRead:    i > 1,
    },
    unreadCount:  i < 2 ? Math.floor(Math.random() * 3) + 1 : 0,
    status:       i > 6 ? 'request' : 'active',
    createdAt:    new Date(Date.now() - (i + 1) * 86400_000).toISOString(),
    mutualCount:  Math.floor(Math.random() * 12),
  };
}

function makeMessages(threadId: string, currentUserId: string): Message[] {
  const otherId  = `other_${threadId}`;
  const now      = Date.now();
  const pairs: [string, string][] = [
    [otherId,        'Hey! I saw your talk at Config — really impressive work on the token system.'],
    [currentUserId,  'Thank you so much! It was a fun one to put together. Were you at the conference?'],
    [otherId,        'I watched the recording. The bit about semantic aliases was exactly what we needed to hear.'],
    [currentUserId,  "Glad it landed well. We've been iterating on that model for about a year. Happy to share more details if useful."],
    [otherId,        "That would be amazing. We're about to kick off a similar initiative and I have a lot of questions."],
    [currentUserId,  'Of course — what does your current token structure look like?'],
  ];
  return pairs.map(([senderId, body], idx) => ({
    id:          `msg_${threadId}_${idx}`,
    threadId,
    senderId,
    body,
    mediaUrl:    null,
    sharedPost:  null,
    status:      'read',
    createdAt:   new Date(now - (pairs.length - idx) * 4 * 60_000).toISOString(),
    editedAt:    null,
  }));
}

export const messagesMock = {
  async getThreads(): Promise<Thread[]> {
    await sleep(450);
    return Array.from({ length: 12 }, (_, i) => makeThread(i));
  },

  async getThread(threadId: string): Promise<Thread> {
    await sleep(300);
    return makeThread(0);
  },

  async getMessages(threadId: string, currentUserId: string): Promise<Message[]> {
    await sleep(380);
    return makeMessages(threadId, currentUserId);
  },

  async sendMessage(threadId: string, body: string, mediaUrl?: string): Promise<Message> {
    await sleep(300);
    return {
      id:         `msg_new_${Date.now()}`,
      threadId,
      senderId:   'usr_01',
      body,
      mediaUrl:   mediaUrl ?? null,
      sharedPost: null,
      status:     'delivered',
      createdAt:  new Date().toISOString(),
      editedAt:   null,
    };
  },

  async markRead(threadId: string): Promise<void> {
    await sleep(100);
  },
};
