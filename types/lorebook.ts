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
