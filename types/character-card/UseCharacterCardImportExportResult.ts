import { ChangeEvent } from "react";

import { CharacterCardFormValues } from "./CharacterCardFormValues";
import { CharacterCardImportSummary } from "./CharacterCardImportSummary";

export interface UseCharacterCardImportExportResult {
  cardValues: CharacterCardFormValues;
  error: string | null;
  importSummary: CharacterCardImportSummary | null;
  isExportDisabled: boolean;
  isProcessing: boolean;
  updateCardField: (field: keyof CharacterCardFormValues, value: string) => void;
  addAlternateOpening: () => void;
  deleteAlternateOpening: (index: number) => void;
  updateAlternateOpening: (
    index: number,
    field: "scenario" | "firstMessage",
    value: string,
  ) => void;
  addGroupGreeting: () => void;
  deleteGroupGreeting: (index: number) => void;
  updateGroupGreeting: (index: number, value: string) => void;
  importPngFile: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  exportPngFile: () => void;
}
