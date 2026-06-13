import { messagesMock } from '../mock/messages.mock';
import type { Thread, Message } from '../../types/message.types';

export const messagesService = {
  getThreads:  ():                                               Promise<Thread[]>  => messagesMock.getThreads(),
  getThread:   (threadId: string):                               Promise<Thread>    => messagesMock.getThread(threadId),
  getMessages: (threadId: string, currentUserId: string):        Promise<Message[]> => messagesMock.getMessages(threadId, currentUserId),
  sendMessage: (threadId: string, body: string, mediaUrl?: string): Promise<Message> => messagesMock.sendMessage(threadId, body, mediaUrl),
  markRead:    (threadId: string):                               Promise<void>      => messagesMock.markRead(threadId),
};
