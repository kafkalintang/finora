const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
export class ApiError extends Error {
  constructor(public status: number, message: string, public fields?: Record<string, string[]>) { super(message); }
}
export async function api<T = unknown>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const res = await fetch(BASE + path, { ...init, credentials: "include", headers: { "Content-Type": "application/json", ...init.headers } });
  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    const r = await fetch(BASE + "/auth/refresh", { method: "POST", credentials: "include" });
    if (r.ok) return api<T>(path, init, false);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.message ?? "Terjadi kesalahan", body.fields);
  return body as T;
}
export const post = <T,>(path: string, data?: unknown) => api<T>(path, { method: "POST", body: JSON.stringify(data ?? {}) });
export type User = { id: string; name: string; email: string; role: string; company: { id: string; name: string; baseCurrency: string } | null };
