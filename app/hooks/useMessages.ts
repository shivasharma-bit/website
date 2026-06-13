'use client';

import { useState, useEffect, useCallback } from 'react';
import { messagesService } from '../services/api/messages.service';
import type { Thread, Message } from '../types/message.types';

interface UseMessagesReturn {
  threads:       Thread[];
  isLoading:     boolean;
  unreadTotal:   number;
  error:         string | null;
  refresh:       () => Promise<void>;
}

export function useMessages(): UseMessagesReturn {
  const [threads,   setThreads]   = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await messagesService.getThreads();
      setThreads(data);
      setError(null);
    } catch {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const unreadTotal = threads.reduce((s, t) => s + t.unreadCount, 0);

  return { threads, isLoading, unreadTotal, error, refresh: load };
}

interface UseThreadReturn {
  messages:    Message[];
  isLoading:   boolean;
  send:        (body: string, mediaUrl?: string) => Promise<void>;
  isSending:   boolean;
}

export function useThread(threadId: string, currentUserId: string): UseThreadReturn {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!threadId) return;
    let active = true;
    messagesService.getMessages(threadId, currentUserId).then(msgs => {
      if (active) { setMessages(msgs); setIsLoading(false); }
    });
    return () => { active = false; };
  }, [threadId, currentUserId]);

  const send = useCallback(async (body: string, mediaUrl?: string) => {
    if (!body.trim()) return;
    setIsSending(true);
    const optimistic: Message = {
      id: `optimistic_${Date.now()}`, threadId, senderId: currentUserId,
      body, mediaUrl: mediaUrl ?? null, sharedPost: null,
      status: 'sending', createdAt: new Date().toISOString(), editedAt: null,
    };
    setMessages(prev => [...prev, optimistic]);
    try {
      const real = await messagesService.sendMessage(threadId, body, mediaUrl);
      setMessages(prev => prev.map(m => m.id === optimistic.id ? real : m));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } finally {
      setIsSending(false);
    }
  }, [threadId, currentUserId]);

  return { messages, isLoading, send, isSending };
}
