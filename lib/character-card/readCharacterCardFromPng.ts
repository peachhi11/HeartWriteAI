import extractChunks from "png-chunks-extract";
import { decode as decodeTextChunk } from "png-chunk-text";

import { CharacterCardReadResult } from "../../types/character-card/CharacterCardReadResult";
import { PngTextChunk } from "../../types/character-card/PngTextChunk";
import { decodeCharacterCardText } from "./decodeCharacterCardText";

export function readCharacterCardFromPng(pngData: Uint8Array): CharacterCardReadResult {
  const textChunks = extractChunks(pngData)
    .filter((chunk) => chunk.name === "tEXt")
    .map((chunk) => decodeTextChunk(chunk.data));

  return readCharacterCardFromTextChunks(textChunks);
}

function readCharacterCardFromTextChunks(
  textChunks: PngTextChunk[],
): CharacterCardReadResult {
  const ccv3Chunk = textChunks.find(
    (chunk) => chunk.keyword.toLowerCase() === "ccv3",
  );

  if (ccv3Chunk) {
    return {
      source: "ccv3",
      card: decodeCharacterCardText(ccv3Chunk.text),
    };
  }

  const charaChunk = textChunks.find(
    (chunk) => chunk.keyword.toLowerCase() === "chara",
  );

  if (charaChunk) {
    return {
      source: "chara",
      card: decodeCharacterCardText(charaChunk.text),
    };
  }

  throw new Error("PNG does not contain supported character card metadata.");
}
