const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
}

export interface QRResponse {
  qr: string;        // base64 PNG, empty when already connected
  connected: boolean;
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

// ── WhatsApp Status ───────────────────────────────────────────────────────────
export async function getStatus(): Promise<WAStatus> {
  const res = await fetch(`${API}/api/status`, { cache: "no-store" });
  return res.json();
}

export async function getQR(): Promise<QRResponse> {
  const res = await fetch(`${API}/api/qr`, { cache: "no-store" });
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API}/api/logout`, { method: "POST" });
}

// ── Messages ──────────────────────────────────────────────────────────────────
export async function getMessages(): Promise<Message[]> {
  const res = await fetch(`${API}/api/messages`, { cache: "no-store" });
  const json = await res.json();
  return json.data ?? [];
}

// ── Auto-Reply Rules ──────────────────────────────────────────────────────────
export async function getReplies(): Promise<AutoReply[]> {
  const res = await fetch(`${API}/api/replies`, { cache: "no-store" });
  const json = await res.json();
  return json.data ?? [];
}

export async function createReply(keyword: string, reply: string): Promise<AutoReply> {
  const res = await fetch(`${API}/api/replies`, {
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
  const res = await fetch(`${API}/api/replies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteReply(id: number): Promise<void> {
  await fetch(`${API}/api/replies/${id}`, { method: "DELETE" });
}
