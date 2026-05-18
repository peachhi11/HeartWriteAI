import { ChangeEvent } from "react";

import { CharacterCardFormValues } from "./CharacterCardFormValues";
import { CharacterCardImportSummary } from "./CharacterCardImportSummary";
import { CharacterCardIntakeRouteResult } from "./CharacterCardIntakeRouteResult";
import { CharacterCardPayload } from "./CharacterCardPayload";

export interface UseCharacterCardImportExportResult {
  cardValues: CharacterCardFormValues;
  error: string | null;
  importSummary: CharacterCardImportSummary | null;
  intakeText: string;
  isExportDisabled: boolean;
  isProcessing: boolean;
  updateIntakeText: (value: string) => void;
  routeIntakeText: () => CharacterCardIntakeRouteResult;
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
  importNativeCard: (card: CharacterCardPayload, fileName: string) => void;
  importPngFile: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  exportPngFile: () => void;
}
