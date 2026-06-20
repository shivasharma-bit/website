'use client';

import React from 'react';
import { PostComposer } from '../../components/feed/PostComposer';
import { PageWrapper, SingleColLayout } from '../../components/layout/PageWrapper';

export default function CreatePage() {
  return (
    <PageWrapper>
      <SingleColLayout maxWidth="lg">
        <h1 className="text-2xl font-display font-semibold text-[var(--color-text-primary)] mb-4 tracking-tight">
          Create a post
        </h1>
        <PostComposer />
      </SingleColLayout>
    </PageWrapper>
  );
}