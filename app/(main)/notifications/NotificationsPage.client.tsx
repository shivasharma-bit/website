'use client';

import React from 'react';
import { PageWrapper, ThreeColLayout } from '../../components/layout/PageWrapper';
import { NotificationList } from '../../components/notifications/NotificationList';
import { RightPanel }       from '../../components/layout/RightPanel';

export function NotificationsPageClient() {
  return (
    <PageWrapper>
      <ThreeColLayout
        center={<NotificationList />}
        right={<RightPanel />}
      />
    </PageWrapper>
  );
}
