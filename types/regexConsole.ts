import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export interface RegexMatchResult {
  bookTitle: string;
  entryId: string;
  matchedKeywords: string[];
  snippetPreview: string;
  tropeContext: RomanceTropeClass;
}

export interface TestConsoleState {
  isActive: boolean;
  matchResults: RegexMatchResult[];
  testInput: string;
}
