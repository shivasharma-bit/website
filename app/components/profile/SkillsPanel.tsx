'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatNumber } from '../../lib/utils';
import { staggerContainer, staggerItem } from '../../lib/transitions';
import type { Skill } from '../../types/project.types';

interface SkillsPanelProps {
  skills:   Skill[];
  isOwner?: boolean;
}

export function SkillsPanel({ skills, isOwner }: SkillsPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const top    = skills.filter(s => s.isTopSkill);
  const rest   = skills.filter(s => !s.isTopSkill);
  const visible = showAll ? rest : rest.slice(0, 4);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Skills</h2>
        {isOwner && (
          <button className="btn btn-ghost h-8 text-xs gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add
          </button>
        )}
      </div>

      <div className="px-4 md:px-5 py-4 space-y-4">
        {/* Top skills */}
        {top.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Top skills
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {top.map(skill => (
                <motion.div
                  key={skill.id}
                  variants={staggerItem}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shrink-0" />
                    <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {skill.name}
                    </span>
                  </div>
                  <EndorsementBadge count={skill.endorsements} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Divider */}
        {top.length > 0 && rest.length > 0 && (
          <div className="border-t border-[var(--color-border)]" />
        )}

        {/* Other skills */}
        {rest.length > 0 && (
          <div className="space-y-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-1.5"
            >
              {visible.map(skill => (
                <motion.button
                  key={skill.id}
                  variants={staggerItem}
                  className={cn(
                    'group flex items-center gap-1.5 h-7 pl-2.5 pr-2 rounded-full',
                    'border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
                    'text-xs text-[var(--color-text-secondary)] font-medium',
                    'hover:border-[var(--color-brand-muted)] hover:text-[var(--color-brand)]',
                    'transition-all duration-150',
                  )}
                >
                  {skill.name}
                  <span className="text-[9px] text-[var(--color-text-tertiary)] group-hover:text-[var(--color-brand)]/70">
                    {formatNumber(skill.endorsements)}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {rest.length > 4 && (
              <button
                onClick={() => setShowAll(v => !v)}
                className="text-xs font-medium text-[var(--color-brand)] hover:underline mt-1"
              >
                {showAll ? 'Show less' : `Show ${rest.length - 4} more skills`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EndorsementBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <div className="flex items-center gap-0.5">
        {[...Array(Math.min(3, Math.ceil(count / 50)))].map((_, i) => (
          <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="var(--color-brand)" stroke="none">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
          </svg>
        ))}
      </div>
      <span className="text-[10px] font-medium text-[var(--color-text-tertiary)]">
        {formatNumber(count)}
      </span>
    </div>
  );
}
