'use client';

import React, {
  createContext, useContext, useState, useCallback, type ReactNode,
} from 'react';
import type { PostType } from '../types/post.types';

interface ComposerState {
  isOpen:     boolean;
  mode:       PostType;
  prefillBody:string;
}

interface ComposerContextValue extends ComposerState {
  open:  (mode?: PostType, prefill?: string) => void;
  close: () => void;
}

const ComposerContext = createContext<ComposerContextValue | null>(null);

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ComposerState>({
    isOpen: false, mode: 'update', prefillBody: '',
  });

  const open = useCallback((mode: PostType = 'update', prefill = '') => {
    setState({ isOpen: true, mode, prefillBody: prefill });
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false, prefillBody: '' }));
  }, []);

  return (
    <ComposerContext.Provider value={{ ...state, open, close }}>
      {children}
    </ComposerContext.Provider>
  );
}

export function useComposer(): ComposerContextValue {
  const ctx = useContext(ComposerContext);
  if (!ctx) throw new Error('useComposer must be used inside <ComposerProvider>');
  return ctx;
}
