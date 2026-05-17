import { CharacterCardMetadataSource } from "./CharacterCardMetadataSource";
import { CharacterCardLoadedSummary } from "./CharacterCardLoadedSummary";

export interface CharacterCardImportSummary {
  fileName: string;
  source: CharacterCardMetadataSource;
  spec?: string;
  specVersion?: string;
  loadedSummary: CharacterCardLoadedSummary;
}
