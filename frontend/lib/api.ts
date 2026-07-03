const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper for fetch with credentials
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: "include", // Send HTTP-only cookies
  });
  if (res.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith('/login')) {
       window.location.href = '/login';
    }
  }
  return res;
}

export interface User {
  id: number;
  username: string;
}

export interface AutoReply {
  id: number;
  keyword: string;
  reply: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WAStatus {
  connected: boolean;
  logged_in: boolean;
  phone?: string;
}

export interface QRResponse {
  qr: string;        // base64 PNG, empty when already connected
  connected: boolean;
  phone?: string;
}

export interface Message {
  id: number;
  wa_message_id: string;
  from: string;
  body: string;
  replied: boolean;
  reply_text: string;
  received_at: string;
  created_at: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(username: string, password: string):Promise<User> {
  const res = await fetchAPI('/api/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  return data.user;
}

export async function register(username: string, password: string):Promise<void> {
  const res = await fetchAPI('/api/register', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
}

export async function checkAuth():Promise<User | null> {
  try {
    const res = await fetchAPI('/api/auth/me');
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function authLogout():Promise<void> {
  await fetchAPI('/api/auth/logout', { method: "POST" });
}

// ── WhatsApp Status ───────────────────────────────────────────────────────────
export async function getStatus(): Promise<WAStatus> {
  const res = await fetchAPI(`/api/status`, { cache: "no-store" });
  return res.json();
}

export async function getQR(): Promise<QRResponse> {
  const res = await fetchAPI(`/api/qr`, { cache: "no-store" });
  return res.json();
}

export async function logout(): Promise<void> {
  await fetchAPI(`/api/logout`, { method: "POST" });
}

// ── Messages ──────────────────────────────────────────────────────────────────
export async function getMessages(): Promise<Message[]> {
  const res = await fetchAPI(`/api/messages`, { cache: "no-store" });
  const json = await res.json();
  return json.data ?? [];
}

// ── Auto-Reply Rules ──────────────────────────────────────────────────────────
export async function getReplies(): Promise<AutoReply[]> {
  const res = await fetchAPI(`/api/replies`, { cache: "no-store" });
  const json = await res.json();
  return json.data ?? [];
}

export async function createReply(keyword: string, reply: string): Promise<AutoReply> {
  const res = await fetchAPI(`/api/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, reply }),
  });
  const json = await res.json();
  return json.data;
}

export async function updateReply(
  id: number,
  data: Partial<{ keyword: string; reply: string; is_active: boolean }>
): Promise<AutoReply> {
  const res = await fetchAPI(`/api/replies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteReply(id: number): Promise<void> {
  await fetchAPI(`/api/replies/${id}`, { method: "DELETE" });
}
