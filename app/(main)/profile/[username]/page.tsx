import type { Metadata } from 'next';
import { ProfilePageClient } from './ProfilePage.client';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} — Forge`,
    description: `View ${username}'s professional profile and portfolio on Forge.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  return <ProfilePageClient username={username} />;
}
