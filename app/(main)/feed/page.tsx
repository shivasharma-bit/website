import type { Metadata } from 'next';
import { FeedPage } from './FeedPage.client';

export const metadata: Metadata = { title: 'Feed' };

export default function Page() {
  return <FeedPage />;
}
