import encodeChunks from "png-chunks-encode";
import extractChunks from "png-chunks-extract";
import { decode as decodeTextChunk, encode as encodeTextChunk } from "png-chunk-text";

import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { PngChunk } from "../../types/character-card/PngChunk";
import { WriteCharacterCardToPngOptions } from "../../types/character-card/WriteCharacterCardToPngOptions";
import { createCharacterCardV3Export } from "./createCharacterCardV3Export";
import { encodeCharacterCardText } from "./encodeCharacterCardText";
import { scrubCardForPublicExport } from "./exportPrivacyScrubber";

const MAX_PNG_TEXT_CHUNK_BYTES = 2 * 1024 * 1024;
const textEncoder = new TextEncoder();

export function writeCharacterCardToPng(
  pngData: Uint8Array,
  card: CharacterCardPayload,
  options: WriteCharacterCardToPngOptions = {},
): Uint8Array {
  const chunks = extractChunks(pngData).filter(shouldKeepChunk);
  const ccv3Card = scrubCardForPublicExport(
    createCharacterCardV3Export(card, options),
  );
  const encodedCardText = encodeCharacterCardText(ccv3Card);

  if (textEncoder.encode(encodedCardText).byteLength > MAX_PNG_TEXT_CHUNK_BYTES) {
    throw new Error(
      "CCV3 metadata is too large for safe PNG export. Limit is 2 MB.",
    );
  }

  chunks.splice(-1, 0, encodeTextChunk("ccv3", encodedCardText));

  return encodeChunks(chunks);
}

function shouldKeepChunk(chunk: PngChunk): boolean {
  if (chunk.name !== "tEXt") {
    return true;
  }

  const keyword = decodeTextChunk(chunk.data).keyword.toLowerCase();

  return keyword !== "ccv3" && keyword !== "chara";
}
