export interface LoreEntry {
  content: string;
  enabled: boolean;
  id: string;
  keys: string[];
}

export interface LorebookConfig {
  description: string;
  enabled: boolean;
  entryCount: number;
  fileSizeKb: number;
  id: string;
  keywords: string[];
  status: "compiled" | "fault" | "idle";
  title: string;
}

export interface LoreRecallAuditLog {
  bookTitle: string;
  id: string;
  injectedSnippet: string;
  matchedKeys: string[];
  messageId: string;
  timestamp: string;
}
