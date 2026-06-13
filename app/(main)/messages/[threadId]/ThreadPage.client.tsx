'use client';

import React, { useEffect, useState } from 'react';
import { PageWrapper, SplitPaneLayout } from '../../../components/layout/PageWrapper';
import { ConversationList } from '../../../components/messaging/ConversationList';
import { MessageThread }    from '../../../components/messaging/MessageThread';
import { SkeletonCard }     from '../../../components/shared/Primitives';
import { messagesService }  from '../../../services/api/messages.service';
import type { Thread }      from '../../../types/message.types';

export function ThreadPageClient({ threadId }: { threadId: string }) {
  const [thread,    setThread]    = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    messagesService.getThread(threadId).then(t => {
      if (active) { setThread(t); setIsLoading(false); }
    });
    return () => { active = false; };
  }, [threadId]);

  return (
    <PageWrapper noAnimation>
      <SplitPaneLayout
        pane={<ConversationList />}
        content={
          isLoading || !thread ? (
            <div className="flex-1 p-4 space-y-3">
              <SkeletonCard lines={2} hasAvatar />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  <div className="w-7 h-7 rounded-full skeleton shrink-0" />
                  <div className={`h-10 rounded-2xl skeleton ${i % 3 === 0 ? 'w-48' : 'w-32'}`} />
                </div>
              ))}
            </div>
          ) : (
            <MessageThread thread={thread} />
          )
        }
      />
    </PageWrapper>
  );
}
