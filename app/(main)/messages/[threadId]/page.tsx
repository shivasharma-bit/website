import type { Metadata } from 'next';
import { ThreadPageClient } from './ThreadPage.client';

interface Props { params: Promise<{ threadId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { threadId } = await params;
  return { title: `Conversation — Forge` };
}

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params;
  return <ThreadPageClient threadId={threadId} />;
}
