'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { sleep } from '../lib/utils';
import type { User } from '../types/core.types';

export type SearchResultType = 'person' | 'post' | 'company' | 'topic';

export interface SearchResult {
  id:       string;
  type:     SearchResultType;
  title:    string;
  subtitle: string;
  avatarUrl?: string | null;
  href:     string;
}

interface UseSearchReturn {
  query:       string;
  setQuery:    (q: string) => void;
  results:     SearchResult[];
  isSearching: boolean;
  hasResults:  boolean;
  clear:       () => void;
}

// ─── Mock search data ─────────────────────────────────────────────────────────

const MOCK_PEOPLE: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'headline'>[] = [
  { id: 'u10', username: 'james.okafor',   displayName: 'James Okafor',   avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', headline: 'Sr. Engineer at Vercel'     },
  { id: 'u11', username: 'priya.sundaram', displayName: 'Priya Sundaram', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', headline: 'Product Lead at Linear'     },
  { id: 'u12', username: 'tom.eriksson',   displayName: 'Tom Eriksson',   avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', headline: 'Founder at Loom'            },
  { id: 'u13', username: 'arjun.mehta',    displayName: 'Arjun Mehta',    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', headline: 'Staff Designer at Notion'  },
  { id: 'u14', username: 'selin.kaya',     displayName: 'Selin Kaya',     avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', headline: 'Creative Director at Figma' },
];

const MOCK_TOPICS = ['DesignSystems', 'AIProducts', 'BuildInPublic', 'FrontendDev', 'ProductStrategy', 'OpenSource'];
const MOCK_COMPANIES = [
  { id: 'c1', name: 'Vercel',  desc: 'Frontend cloud platform' },
  { id: 'c2', name: 'Linear',  desc: 'Issue tracking for modern teams' },
  { id: 'c3', name: 'Figma',   desc: 'Collaborative design tool' },
  { id: 'c4', name: 'Notion',  desc: 'All-in-one workspace' },
];

function mockSearch(q: string): SearchResult[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return [];

  const results: SearchResult[] = [];

  MOCK_PEOPLE.forEach(p => {
    if (
      p.displayName.toLowerCase().includes(lower) ||
      p.headline.toLowerCase().includes(lower) ||
      p.username.includes(lower)
    ) {
      results.push({
        id:        p.id,
        type:      'person',
        title:     p.displayName,
        subtitle:  p.headline,
        avatarUrl: p.avatarUrl,
        href:      `/profile/${p.username}`,
      });
    }
  });

  MOCK_TOPICS.forEach(tag => {
    if (tag.toLowerCase().includes(lower)) {
      results.push({
        id:       `topic_${tag}`,
        type:     'topic',
        title:    `#${tag}`,
        subtitle: 'Topic',
        href:     `/explore?topic=${tag}`,
      });
    }
  });

  MOCK_COMPANIES.forEach(c => {
    if (c.name.toLowerCase().includes(lower)) {
      results.push({
        id:       c.id,
        type:     'company',
        title:    c.name,
        subtitle: c.desc,
        href:     `/company/${c.name.toLowerCase()}`,
      });
    }
  });

  return results.slice(0, 8);
}

export function useSearch(debounceMs = 280): UseSearchReturn {
  const [query,       setQueryState] = useState('');
  const [results,     setResults]    = useState<SearchResult[]>([]);
  const [isSearching, setSearching]  = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    // Cancel previous pending search
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSearching(true);
    const timer = setTimeout(async () => {
      if (controller.signal.aborted) return;
      await sleep(180);
      if (controller.signal.aborted) return;
      setResults(mockSearch(query));
      setSearching(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs]);

  const setQuery = useCallback((q: string) => setQueryState(q), []);
  const clear    = useCallback(() => { setQueryState(''); setResults([]); }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasResults: results.length > 0,
    clear,
  };
}
