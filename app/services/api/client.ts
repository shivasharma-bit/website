const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.forge.app/v1';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('forge_access_token');
}

function buildHeaders(): Headers {
  const h = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  const t = getToken();
  if (t) h.set('Authorization', `Bearer ${t}`);
  return h;
}

async function request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  const json = await res.json();
  if (!res.ok) throw { code: json.code, message: json.message, status: res.status };
  return json;
}

export const apiClient = {
  get:    <T>(path: string, signal?: AbortSignal) => request<T>('GET',    path, undefined, signal),
  post:   <T>(path: string, body: unknown)        => request<T>('POST',   path, body),
  patch:  <T>(path: string, body: unknown)        => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                       => request<T>('DELETE', path),
};

export function setToken(token: string) {
  localStorage.setItem('forge_access_token', token);
}

export function clearToken() {
  localStorage.removeItem('forge_access_token');
  localStorage.removeItem('forge_refresh_token');
}
