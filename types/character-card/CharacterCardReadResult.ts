import { CharacterCardMetadataSource } from "./CharacterCardMetadataSource";
import { CharacterCardPayload } from "./CharacterCardPayload";

export interface CharacterCardReadResult {
  source: CharacterCardMetadataSource;
  card: CharacterCardPayload;
}
