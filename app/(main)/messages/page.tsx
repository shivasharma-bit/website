import type { Metadata } from 'next';
import { MessagesPageClient } from './MessagesPage.client';

export const metadata: Metadata = { title: 'Messages' };

export default function MessagesPage() {
  return <MessagesPageClient />;
}
