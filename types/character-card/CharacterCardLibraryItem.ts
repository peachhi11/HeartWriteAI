import { CharacterCardFormValues } from "./CharacterCardFormValues";
import { CharacterCardPayload } from "./CharacterCardPayload";

export interface CharacterCardLibraryItem {
  id: string;
  title: string;
  values: CharacterCardFormValues;
  card?: CharacterCardPayload;
  createdAt: string;
  updatedAt: string;
}
