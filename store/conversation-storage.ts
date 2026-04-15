export interface StoredConversation {
    id: string
    title: string
    updatedAt: string
    messages: StoredMessage[]
  }
  
  export interface StoredMessage {
    id: string
    role: "user" | "assistant"
    content?: string
    data?: StampleyResponseData
    timestamp: string
  }
  
  export interface StampleyResponseData {
    greeting?: string
    validation: string
    reflection_question: string
    micro_skill: string
    education_chip: string
    closure?: string
  }
  
  const STORAGE_KEY = "stampley_conversations"
  
  export function getConversations(): StoredConversation[] {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }
  
  export function saveConversations(conversations: StoredConversation[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    } catch {
      console.error("Failed to save conversations")
    }
  }
  
  export function deleteConversation(id: string): void {
    const convs = getConversations().filter(c => c.id !== id)
    saveConversations(convs)
  }