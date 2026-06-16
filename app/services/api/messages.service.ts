import { apiClient } from './client';
import type { Thread, Message } from '../../types/message.types';

export const messagesService = {
  async getThreads(): Promise<Thread[]> {
    const r = await apiClient.get<{ data: Thread[] }>('/threads');
    return r.data;
  },
  async getThread(threadId: string): Promise<Thread> {
    const r = await apiClient.get<{ data: Thread }>(`/threads/${threadId}`);
    return r.data;
  },
  async createThread(recipientId: string): Promise<Thread> {
    const r = await apiClient.post<{ data: Thread }>('/threads', { recipientId });
    return r.data;
  },
  async getMessages(threadId: string, page = 1): Promise<Message[]> {
    const r = await apiClient.get<{ data: Message[] }>(`/threads/${threadId}/messages?page=${page}`);
    return r.data;
  },
  async sendMessage(threadId: string, body: string, mediaUrl?: string): Promise<Message> {
    const r = await apiClient.post<{ data: Message }>(`/threads/${threadId}/messages`, { body, mediaUrl });
    return r.data;
  },
  async markRead(threadId: string): Promise<void> {
    return apiClient.patch(`/threads/${threadId}/read`, {});
  },
  async archive(threadId: string): Promise<void> {
    return apiClient.post(`/threads/${threadId}/archive`, {});
  },
};
