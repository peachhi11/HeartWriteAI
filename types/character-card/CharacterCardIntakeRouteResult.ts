import { CharacterCardFormValues } from "./CharacterCardFormValues";

export interface CharacterCardIntakeRouteResult {
  values: Partial<CharacterCardFormValues>;
  fieldNames: string[];
}
