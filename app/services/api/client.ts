import type { ApiResponse, ApiError } from '../../types/core.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.forge.app/v1';
const REQUEST_TIMEOUT_MS = 12_000;

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  // In production this would read from a secure httpOnly cookie or
  // an in-memory token store — never localStorage for access tokens.
  // For the mock layer we use localStorage purely for DX convenience.
  return localStorage.getItem('forge_access_token');
}

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    ...extra,
  });
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

class ApiClientError extends Error implements ApiError {
  code:   string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name   = 'ApiClientError';
    this.code   = code;
    this.status = status;
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ApiClientError('Request timed out', 'TIMEOUT', 408)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

// ─── Core request function ────────────────────────────────────────────────────

async function request<T>(
  method:   'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path:     string,
  body?:    unknown,
  options?: { retries?: number; signal?: AbortSignal }
): Promise<ApiResponse<T>> {
  const { retries = 1, signal } = options ?? {};
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchPromise = fetch(url, {
        method,
        headers: buildHeaders(),
        body:    body != null ? JSON.stringify(body) : undefined,
        signal,
      });

      const response = await withTimeout(fetchPromise, REQUEST_TIMEOUT_MS);

      if (!response.ok) {
        let errorBody: { code?: string; message?: string } = {};
        try { errorBody = await response.json(); } catch {}
        throw new ApiClientError(
          errorBody.message ?? `HTTP ${response.status}`,
          errorBody.code    ?? 'HTTP_ERROR',
          response.status
        );
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (err) {
      lastError = err as Error;
      // Don't retry on abort or client errors (4xx)
      if (
        (err instanceof ApiClientError && err.status >= 400 && err.status < 500) ||
        (err instanceof DOMException && err.name === 'AbortError')
      ) {
        break;
      }
      if (attempt < retries) await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  throw lastError;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string, options?: { signal?: AbortSignal }) =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body: unknown, options?: { signal?: AbortSignal }) =>
    request<T>('POST', path, body, options),

  put: <T>(path: string, body: unknown, options?: { signal?: AbortSignal }) =>
    request<T>('PUT', path, body, options),

  patch: <T>(path: string, body: unknown, options?: { signal?: AbortSignal }) =>
    request<T>('PATCH', path, body, options),

  delete: <T>(path: string, options?: { signal?: AbortSignal }) =>
    request<T>('DELETE', path, undefined, options),
};

export type { ApiClientError };
