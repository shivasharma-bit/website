'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { sleep } from '../lib/utils';

export type MessageStatus = 'sending' | 'delivered' | 'read';

export interface RealtimeMessage {
  id:         string;
  threadId:   string;
  senderId:   string;
  body:       string;
  mediaUrl:   string | null;
  status:     MessageStatus;
  createdAt:  string;
}

interface UseRealtimeMessagesOptions {
  threadId:        string;
  currentUserId:   string;
  /** Fires whenever a new message arrives (from self or other party) */
  onMessage?:      (msg: RealtimeMessage) => void;
}

interface UseRealtimeMessagesReturn {
  messages:     RealtimeMessage[];
  isConnected:  boolean;
  isSending:    boolean;
  sendMessage:  (body: string, mediaUrl?: string) => Promise<void>;
  markAllRead:  () => void;
}

// ─── Simulated inbound message pool ──────────────────────────────────────────

function makeInboundMessage(threadId: string, senderId: string): RealtimeMessage {
  const replies = [
    'That makes a lot of sense, thanks for sharing.',
    'Agreed — really useful perspective.',
    'Have you seen the Vercel announcement on this?',
    'Worth a deeper dive when you have time.',
    'Let me pull up that doc and get back to you.',
    'Great call — I was thinking the same thing.',
    "I'll loop in the team on this.",
  ];
  return {
    id:        crypto.randomUUID(),
    threadId,
    senderId,
    body:      replies[Math.floor(Math.random() * replies.length)],
    mediaUrl:  null,
    status:    'delivered',
    createdAt: new Date().toISOString(),
  };
}

export function useRealtimeMessages({
  threadId,
  currentUserId,
  onMessage,
}: UseRealtimeMessagesOptions): UseRealtimeMessagesReturn {
  const [messages,    setMessages]    = useState<RealtimeMessage[]>([]);
  const [isConnected, setConnected]   = useState(false);
  const [isSending,   setSending]     = useState(false);
  const onMessageRef = useRef(onMessage);
  const otherUserId  = threadId.replace(currentUserId, '').replace('_', '') || 'u_other';

  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  // Simulate connection + initial message load
  useEffect(() => {
    let active = true;
    async function connect() {
      await sleep(300);
      if (!active) return;
      setConnected(true);
    }
    connect();
    return () => { active = false; setConnected(false); };
  }, [threadId]);

  // Simulate occasional inbound replies (random cadence 6–14s)
  useEffect(() => {
    if (!isConnected) return;
    let timer: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const delay = 6_000 + Math.random() * 8_000;
      timer = setTimeout(async () => {
        const msg = makeInboundMessage(threadId, otherUserId);
        setMessages(prev => [...prev, msg]);
        onMessageRef.current?.(msg);
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => clearTimeout(timer);
  }, [isConnected, threadId, otherUserId]);

  const sendMessage = useCallback(async (body: string, mediaUrl?: string) => {
    if (!body.trim() && !mediaUrl) return;
    setSending(true);

    const outbound: RealtimeMessage = {
      id:        crypto.randomUUID(),
      threadId,
      senderId:  currentUserId,
      body:      body.trim(),
      mediaUrl:  mediaUrl ?? null,
      status:    'sending',
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, outbound]);

    await sleep(350 + Math.random() * 200);

    // Mark as delivered
    setMessages(prev =>
      prev.map(m => m.id === outbound.id ? { ...m, status: 'delivered' } : m)
    );

    setSending(false);
    onMessageRef.current?.(outbound);

    // Simulate read receipt from other party after a short delay
    await sleep(800 + Math.random() * 1_200);
    setMessages(prev =>
      prev.map(m => m.id === outbound.id ? { ...m, status: 'read' } : m)
    );
  }, [threadId, currentUserId]);

  const markAllRead = useCallback(() => {
    setMessages(prev =>
      prev.map(m => m.senderId !== currentUserId ? { ...m, status: 'read' } : m)
    );
  }, [currentUserId]);

  return { messages, isConnected, isSending, sendMessage, markAllRead };
}
