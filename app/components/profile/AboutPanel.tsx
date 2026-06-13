'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import type { User } from '../../types/core.types';
import type { Education } from '../../types/project.types';

interface AboutPanelProps {
  user:      User;
  education: Education[];
  isOwner?:  boolean;
}

export function AboutPanel({ user, education, isOwner }: AboutPanelProps) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const BIO_LIMIT = 220;
  const needsTrunc = user.bio.length > BIO_LIMIT;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">About</h2>
        {isOwner && (
          <button className="btn btn-ghost h-8 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>
        )}
      </div>

      <div className="px-4 md:px-5 py-4 space-y-4">
        {/* Bio */}
        {user.bio && (
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {bioExpanded || !needsTrunc ? user.bio : user.bio.slice(0, BIO_LIMIT) + '…'}
            </p>
            {needsTrunc && (
              <button
                onClick={() => setBioExpanded(v => !v)}
                className="mt-1 text-xs font-medium text-[var(--color-brand)] hover:underline"
              >
                {bioExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Meta items */}
        <div className="space-y-2">
          {user.company && (
            <div className="flex items-center gap-2.5">
              <svg className="text-[var(--color-text-tertiary)] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span className="text-sm text-[var(--color-text-secondary)]">{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-2.5">
              <svg className="text-[var(--color-text-tertiary)] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-sm text-[var(--color-text-secondary)]">{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-2.5">
              <svg className="text-[var(--color-text-tertiary)] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-brand)] hover:underline truncate"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <svg className="text-[var(--color-text-tertiary)] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-sm text-[var(--color-text-secondary)]">
              Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <>
            <div className="border-t border-[var(--color-border)]" />
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Education
              </p>
              {education.map(edu => (
                <div key={edu.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    {edu.logo ? (
                      <img src={edu.logo} alt={edu.institution} className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="text-xs font-bold text-[var(--color-text-tertiary)]">{edu.institution[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{edu.institution}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">
                      {edu.startYear} – {edu.endYear ?? 'Present'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
