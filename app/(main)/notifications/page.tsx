import type { Metadata } from 'next';
import { NotificationsPageClient } from './NotificationsPage.client';

export const metadata: Metadata = { title: 'Notifications' };
export default function NotificationsPage() { return <NotificationsPageClient />; }
