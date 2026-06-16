const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.forge.app/v1';

export const mediaService = {
  async upload(file: File): Promise<{ id: string; url: string; type: string; width: number; height: number }> {
    const token = localStorage.getItem('forge_access_token');
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE_URL}/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json.data;
  },
};
