/**
 * Client-only persistence for Stampley chat history (Option 1).
 * Replace this with API/DB calls later without changing the rest of the app.
 */

function makeStorageKey(userId: string) {
  return `stampley_conversations:${userId}`;
}

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  data?: {
    validationText: string;
    reflectionText: string;
    followUpQuestion: string;
    microSkill: { title: string; description: string };
    education: { title: string; description: string };
    resourceLink: string | null;
  };
  timestamp: string;
}

export interface StoredConversation {
  id: string;
  title: string;
  updatedAt: string; // ISO
  messages: StoredMessage[];
}

function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function getConversations(userId: string): StoredConversation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(makeStorageKey(userId));
  if (!raw) return [];
  return safeParse(raw, []);
}

export function saveConversations(userId: string, conversations: StoredConversation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(makeStorageKey(userId), JSON.stringify(conversations));
}
