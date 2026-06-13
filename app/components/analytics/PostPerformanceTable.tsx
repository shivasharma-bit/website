'use client';

import React, { useState, useMemo } from 'react';
import { cn, formatNumber, formatRelativeTime, truncate } from '../../lib/utils';
import type { PostPerformanceRow } from '../../types/analytics.types';

type SortKey = 'impressions' | 'reactions' | 'comments' | 'reposts' | 'ctr';
type SortDir = 'asc' | 'desc';

interface PostPerformanceTableProps {
  rows:      PostPerformanceRow[];
  isLoading: boolean;
}

const COLS: { key: SortKey; label: string; tip: string }[] = [
  { key: 'impressions', label: 'Impr.',    tip: 'Impressions'  },
  { key: 'reactions',   label: 'React.',   tip: 'Reactions'    },
  { key: 'comments',    label: 'Cmts.',    tip: 'Comments'     },
  { key: 'reposts',     label: 'Reposts',  tip: 'Reposts'      },
  { key: 'ctr',         label: 'CTR',      tip: 'Click-through rate' },
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke={active ? 'var(--color-brand)' : 'var(--color-text-tertiary)'}
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      {active && dir === 'asc'
        ? <polyline points="18 15 12 9 6 15" />
        : <polyline points="6 9 12 15 18 9" />
      }
    </svg>
  );
}

export function PostPerformanceTable({ rows, isLoading }: PostPerformanceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('impressions');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage]       = useState(1);
  const PER_PAGE = 5;

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  }

  const sorted = useMemo(() =>
    [...rows].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === 'desc' ? -diff : diff;
    }),
    [rows, sortKey, sortDir]
  );

  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);

  if (isLoading) return <div className="card p-5 h-64 skeleton" />;

  return (
    <div className="card overflow-hidden">
      <div className="px-4 md:px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Post performance</h2>
        <span className="text-xs text-[var(--color-text-tertiary)]">{rows.length} posts</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left" style={{ tableLayout: 'fixed', minWidth: '560px' }}>
          <colgroup>
            <col style={{ width: '42%' }} />
            {COLS.map(c => <col key={c.key} style={{ width: `${58 / COLS.length}%` }} />)}
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                Post
              </th>
              {COLS.map(col => (
                <th key={col.key} className="px-2 py-2.5">
                  <button
                    onClick={() => handleSort(col.key)}
                    title={col.tip}
                    className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide transition-colors hover:text-[var(--color-brand)]"
                    style={{ color: sortKey === col.key ? 'var(--color-brand)' : 'var(--color-text-tertiary)' }}
                  >
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {paginated.map((row, i) => (
              <tr
                key={row.post.id}
                className="hover:bg-[var(--color-surface-raised)] transition-colors"
              >
                {/* Post preview */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {row.post.media[0] ? (
                      <div className="w-10 h-7 rounded overflow-hidden shrink-0 bg-[var(--color-surface-raised)]">
                        <img src={row.post.media[0].url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-7 rounded bg-[var(--color-brand-muted)] shrink-0 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--color-text-primary)] line-clamp-2 leading-snug">
                        {truncate(row.post.body, 80)}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                        {formatRelativeTime(row.post.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>
                {/* Metrics */}
                {COLS.map(col => (
                  <td key={col.key} className={cn(
                    'px-2 py-3 text-xs font-medium tabular-nums',
                    sortKey === col.key
                      ? 'text-[var(--color-brand)]'
                      : 'text-[var(--color-text-primary)]',
                  )}>
                    {col.key === 'ctr'
                      ? `${row[col.key]}%`
                      : formatNumber(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, rows.length)} of {rows.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
