import { ValidatedCharacterCardV3 } from "./CharacterCardV3Schema";

export interface CharacterCardDropZoneOverlayProps {
  onAssetTranscoded?: (filePath: string) => void;
  onCardParsed: (
    card: ValidatedCharacterCardV3,
    filePath: string,
    sourcePngData?: Uint8Array | null,
  ) => void;
  onDropError?: (message: string) => void;
}
