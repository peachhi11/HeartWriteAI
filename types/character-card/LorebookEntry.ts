export interface LorebookEntry {
  keys: string[];
  content: string;
  extensions: Record<string, unknown>;
  enabled: boolean;
  insertion_order: number;
  use_regex: boolean;
  case_sensitive?: boolean;
  constant?: boolean;
  name?: string;
  priority?: number;
  id?: number | string;
  comment?: string;
  selective?: boolean;
  secondary_keys?: string[];
  position?: "before_char" | "after_char";
}
