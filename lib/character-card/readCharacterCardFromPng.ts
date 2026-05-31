import { CharacterCardReadResult } from "../../types/character-card/CharacterCardReadResult";
import { PngTextChunk } from "../../types/character-card/PngTextChunk";
import { decodeCharacterCardText } from "./decodeCharacterCardText";

const MAX_PNG_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_TEXT_CHUNK_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_TEXT_BYTES = 4 * 1024 * 1024;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const textDecoder = new TextDecoder("utf-8", { fatal: false });

export function readCharacterCardFromPng(pngData: Uint8Array): CharacterCardReadResult {
  const textChunks = readBoundedTextChunks(pngData);

  return readCharacterCardFromTextChunks(textChunks);
}

function readBoundedTextChunks(pngData: Uint8Array): PngTextChunk[] {
  if (pngData.byteLength > MAX_PNG_FILE_SIZE_BYTES) {
    throw new Error("PNG file is too large for safe character card import.");
  }

  if (!hasPngSignature(pngData)) {
    throw new Error("Source file is not a PNG image.");
  }

  const view = new DataView(
    pngData.buffer,
    pngData.byteOffset,
    pngData.byteLength,
  );
  const textChunks: PngTextChunk[] = [];
  let offset = PNG_SIGNATURE.length;
  let accumulatedTextBytes = 0;

  while (offset + 12 <= pngData.byteLength) {
    const chunkLength = view.getUint32(offset);
    const chunkType = decodeAscii(pngData.subarray(offset + 4, offset + 8));
    const dataStart = offset + 8;
    const dataEnd = dataStart + chunkLength;
    const nextOffset = dataEnd + 4;

    if (dataEnd < dataStart || nextOffset < dataEnd || nextOffset > pngData.byteLength) {
      throw new Error("PNG chunk table is truncated or corrupt.");
    }

    if (chunkType === "IEND") {
      break;
    }

    if (isTextChunkType(chunkType)) {
      if (chunkLength > MAX_TEXT_CHUNK_BYTES) {
        throw new Error("PNG text metadata chunk is too large for safe import.");
      }

      const chunk = decodeBoundedTextChunk(
        chunkType,
        pngData.subarray(dataStart, dataEnd),
      );

      if (chunk && isSupportedTextKeyword(chunk.keyword)) {
        accumulatedTextBytes += utf8ByteLength(chunk.text);
        if (accumulatedTextBytes > MAX_TOTAL_TEXT_BYTES) {
          throw new Error("Combined PNG metadata text is too large for safe import.");
        }

        textChunks.push(chunk);
      }
    }

    offset = nextOffset;
  }

  return textChunks;
}

function hasPngSignature(pngData: Uint8Array) {
  return PNG_SIGNATURE.every((byte, index) => pngData[index] === byte);
}

function isTextChunkType(chunkType: string) {
  return chunkType === "tEXt" || chunkType === "zTXt" || chunkType === "iTXt";
}

function decodeBoundedTextChunk(
  chunkType: string,
  chunkData: Uint8Array,
): PngTextChunk | null {
  const separatorIndex = chunkData.indexOf(0);
  if (separatorIndex === -1) {
    return null;
  }

  const keyword = decodeAscii(chunkData.subarray(0, separatorIndex));
  if (!isSupportedTextKeyword(keyword)) {
    return null;
  }

  if (chunkType === "zTXt" || chunkType === "iTXt") {
    throw new Error(
      `Compressed PNG ${chunkType} character metadata needs the desktop app for safe import.`,
    );
  }

  return {
    keyword,
    text: textDecoder.decode(chunkData.subarray(separatorIndex + 1)),
  };
}

function isSupportedTextKeyword(keyword: string) {
  const normalizedKeyword = keyword.toLowerCase();

  return normalizedKeyword === "ccv3" || normalizedKeyword === "chara";
}

function decodeAscii(bytes: Uint8Array) {
  return textDecoder.decode(bytes);
}

function utf8ByteLength(value: string) {
  return new TextEncoder().encode(value).byteLength;
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
