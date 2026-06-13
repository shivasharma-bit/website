'use client';

import { useState, useCallback, useRef } from 'react';
import { sleep } from '../lib/utils';

export type MediaType = 'image' | 'video';

export interface MediaFile {
  id:          string;
  file:        File;
  previewUrl:  string;
  type:        MediaType;
  name:        string;
  sizeBytes:   number;
  uploadState: 'idle' | 'uploading' | 'done' | 'error';
  uploadedUrl: string | null;
  progress:    number;
  error:       string | null;
}

interface UseMediaUploadOptions {
  maxFiles?:     number;
  maxSizeMb?:    number;
  acceptedTypes?: string[];
}

interface UseMediaUploadReturn {
  files:         MediaFile[];
  isDragging:    boolean;
  addFiles:      (fileList: FileList | File[]) => void;
  removeFile:    (id: string) => void;
  reorderFiles:  (fromIndex: number, toIndex: number) => void;
  uploadAll:     () => Promise<void>;
  clearAll:      () => void;
  dragHandlers:  {
    onDragEnter:  React.DragEventHandler;
    onDragLeave:  React.DragEventHandler;
    onDragOver:   React.DragEventHandler;
    onDrop:       React.DragEventHandler;
  };
  error:         string | null;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];

export function useMediaUpload({
  maxFiles     = 10,
  maxSizeMb    = 50,
  acceptedTypes = ACCEPTED_TYPES,
}: UseMediaUploadOptions = {}): UseMediaUploadReturn {
  const [files,      setFiles]      = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const dragCounterRef = useRef(0);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    setError(null);
    const incoming = Array.from(fileList);

    if (files.length + incoming.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validated: MediaFile[] = [];

    for (const file of incoming) {
      if (!acceptedTypes.includes(file.type)) {
        setError(`${file.name}: unsupported file type`);
        continue;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`${file.name}: file exceeds ${maxSizeMb}MB limit`);
        continue;
      }
      validated.push({
        id:          crypto.randomUUID(),
        file,
        previewUrl:  URL.createObjectURL(file),
        type:        file.type.startsWith('video/') ? 'video' : 'image',
        name:        file.name,
        sizeBytes:   file.size,
        uploadState: 'idle',
        uploadedUrl: null,
        progress:    0,
        error:       null,
      });
    }

    setFiles(prev => [...prev, ...validated]);
  }, [files.length, maxFiles, maxSizeMb, acceptedTypes]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.previewUrl);
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  // Simulates upload with progress — replace with real API call in production
  const uploadAll = useCallback(async () => {
    const pending = files.filter(f => f.uploadState === 'idle');
    if (!pending.length) return;

    for (const file of pending) {
      setFiles(prev =>
        prev.map(f => f.id === file.id ? { ...f, uploadState: 'uploading', progress: 0 } : f)
      );

      // Simulate incremental progress
      for (let pct = 10; pct <= 90; pct += 20) {
        await sleep(120);
        setFiles(prev =>
          prev.map(f => f.id === file.id ? { ...f, progress: pct } : f)
        );
      }

      await sleep(200);

      // Simulate a mock uploaded URL (CDN path)
      const mockUrl = `https://cdn.forge.app/media/${crypto.randomUUID()}.${file.name.split('.').pop()}`;
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...f, uploadState: 'done', progress: 100, uploadedUrl: mockUrl }
            : f
        )
      );
    }
  }, [files]);

  const clearAll = useCallback(() => {
    files.forEach(f => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setError(null);
  }, [files]);

  const dragHandlers = {
    onDragEnter: useCallback((e: React.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current += 1;
      setIsDragging(true);
    }, []),

    onDragLeave: useCallback((e: React.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current === 0) setIsDragging(false);
    }, []),

    onDragOver: useCallback((e: React.DragEvent) => {
      e.preventDefault();
    }, []),

    onDrop: useCallback((e: React.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [addFiles]),
  };

  return { files, isDragging, addFiles, removeFile, reorderFiles, uploadAll, clearAll, dragHandlers, error };
}
