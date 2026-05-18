import { CharacterCardFormValues } from "./CharacterCardFormValues";
import { CharacterCardImportSummary } from "./CharacterCardImportSummary";
import { CharacterCardPayload } from "./CharacterCardPayload";

export interface NativeCharacterCardImportData {
  card: CharacterCardPayload;
  formValues: CharacterCardFormValues;
  summary: CharacterCardImportSummary;
}
