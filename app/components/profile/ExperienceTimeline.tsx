'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { Experience } from '../../types/project.types';

interface ExperienceTimelineProps {
  experiences: Experience[];
  isOwner?:    boolean;
}

function formatDateRange(start: string, end: string | null, isCurrent: boolean): string {
  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const startStr = fmt(start);
  const endStr   = isCurrent ? 'Present' : end ? fmt(end) : '';
  return `${startStr} – ${endStr}`;
}

function getDurationMonths(start: string, end: string | null): string {
  const s   = new Date(start);
  const e   = end ? new Date(end) : new Date();
  const mos = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const yrs = Math.floor(mos / 12);
  const rem = mos % 12;
  if (yrs === 0) return `${rem} mo${rem !== 1 ? 's' : ''}`;
  if (rem === 0) return `${yrs} yr${yrs !== 1 ? 's' : ''}`;
  return `${yrs} yr${yrs !== 1 ? 's' : ''} ${rem} mo${rem !== 1 ? 's' : ''}`;
}

export function ExperienceTimeline({ experiences, isOwner }: ExperienceTimelineProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([experiences[0]?.id]));

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Experience</h2>
        {isOwner && (
          <button className="btn btn-ghost h-8 text-xs gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add
          </button>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="px-4 md:px-5 py-4"
      >
        {experiences.map((exp, i) => {
          const isExpanded = expanded.has(exp.id);
          const isLast     = i === experiences.length - 1;

          return (
            <motion.div
              key={exp.id}
              variants={staggerItem}
              className={cn('flex gap-4', !isLast && 'mb-0')}
            >
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                  'border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
                  exp.isCurrent && 'border-[var(--color-brand-muted)] bg-[var(--color-brand-muted)]',
                )}>
                  {exp.companyLogo ? (
                    <img src={exp.companyLogo} alt={exp.company} className="w-5 h-5 object-contain rounded" />
                  ) : (
                    <span className="text-xs font-bold text-[var(--color-brand)]">
                      {exp.company[0]}
                    </span>
                  )}
                </div>
                {!isLast && (
                  <div className="w-px flex-1 mt-2 mb-0 bg-[var(--color-border)] min-h-[24px]" />
                )}
              </div>

              {/* Content */}
              <div className={cn('flex-1 min-w-0', !isLast && 'pb-6')}>
                <button
                  onClick={() => toggle(exp.id)}
                  className="w-full text-left group"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                          {exp.role}
                        </span>
                        {exp.isCurrent && (
                          <span className="badge badge-brand text-[9px]">Current</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        {exp.company} · {exp.location}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)} · {getDurationMonths(exp.startDate, exp.endDate)}
                      </p>
                    </div>
                    <svg
                      className={cn(
                        'text-[var(--color-text-tertiary)] shrink-0 mt-0.5 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 space-y-2.5">
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {exp.description}
                      </p>

                      {exp.highlights.length > 0 && (
                        <ul className="space-y-1">
                          {exp.highlights.map((h, hi) => (
                            <li key={hi} className="flex gap-2 text-xs text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-brand)] mt-1.5 shrink-0">
                                <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                                  <circle cx="3" cy="3" r="3"/>
                                </svg>
                              </span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      {exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {exp.skills.map(skill => (
                            <span
                              key={skill}
                              className="h-5 px-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[10px] text-[var(--color-text-secondary)] flex items-center"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
