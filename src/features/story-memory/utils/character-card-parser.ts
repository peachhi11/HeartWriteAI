export type LoadedCharacterCard = {
  alternateGreetings: string[];
  creatorNotes?: string;
  description?: string;
  exampleDialog?: string;
  firstMessage?: string;
  format: string;
  importedAt: string;
  name?: string;
  personality?: string;
  postHistoryInstructions?: string;
  rawText: string;
  scenario?: string;
  systemPrompt?: string;
  tags: string[];
  warnings: string[];
};

export function parseCharacterCard(source: string, sourceName?: string): LoadedCharacterCard {
  const importedAt = new Date().toISOString();

  try {
    const parsed: unknown = JSON.parse(source);

    if (!isRecord(parsed)) {
      return {
        alternateGreetings: [],
        description: source,
        format: "Plain text card notes",
        importedAt,
        rawText: source,
        tags: [],
        warnings: ["The card JSON did not contain an object, so it was loaded as raw notes."],
      };
    }

    const cardData = isRecord(parsed.data) ? parsed.data : parsed;
    const format = getCharacterCardFormat(parsed, sourceName);

    return {
      alternateGreetings: readStringArray(cardData, [
        "alternate_greetings",
        "alternateGreetings",
        "alternate_messages",
      ]),
      creatorNotes: readString(cardData, [
        "creator_notes",
        "creatorNotes",
        "creatorcomment",
        "creator_comment",
      ]),
      description: readString(cardData, ["description", "char_description", "definition"]),
      exampleDialog: readString(cardData, ["mes_example", "example_dialogue", "exampleDialog", "examples"]),
      firstMessage: readString(cardData, ["first_mes", "first_message", "firstMessage", "greeting"]),
      format,
      importedAt,
      name: readString(cardData, ["name", "char_name", "character_name"]),
      personality: readString(cardData, ["personality", "personality_summary"]),
      postHistoryInstructions: readString(cardData, [
        "post_history_instructions",
        "postHistoryInstructions",
        "post_history",
      ]),
      rawText: source,
      scenario: readString(cardData, ["scenario", "scenario_text"]),
      systemPrompt: readString(cardData, ["system_prompt", "systemPrompt", "system"]),
      tags: readStringArray(cardData, ["tags", "tagline", "categories"]),
      warnings: [],
    };
  } catch {
    return {
      alternateGreetings: [],
      description: source,
      format: "Plain text card notes",
      importedAt,
      rawText: source,
      tags: [],
      warnings: ["This was not valid JSON, so it was loaded as plain card notes."],
    };
  }
}

export async function extractCharacterCardSourceFromPng(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!isPng(bytes)) {
    throw new Error("That file is not a valid PNG.");
  }

  const textChunks = await readPngTextChunks(bytes);
  const preferredKeys = ["chara", "ccv3", "card", "character", "character_card", "json"];
  const preferredChunks = [
    ...textChunks.filter((chunk) => preferredKeys.includes(chunk.keyword.toLowerCase())),
    ...textChunks.filter((chunk) => !preferredKeys.includes(chunk.keyword.toLowerCase())),
  ];

  for (const chunk of preferredChunks) {
    const decoded = decodePossibleCharacterPayload(chunk.text);
    if (decoded && looksLikeCharacterCardSource(decoded)) {
      return decoded;
    }
  }

  return null;
}

export function compactSentence(value: string | undefined, fallback: string) {
  if (!value) return fallback;

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 220 ? `${normalized.slice(0, 217)}...` : normalized;
}

async function readPngTextChunks(bytes: Uint8Array) {
  const chunks: { keyword: string; text: string }[] = [];
  const decoder = new TextDecoder("latin1");
  let offset = 8;

  while (offset + 12 <= bytes.length) {
    const length = readUint32(bytes, offset);
    const type = decoder.decode(bytes.slice(offset + 4, offset + 8));
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (dataEnd > bytes.length) break;

    const data = bytes.slice(dataStart, dataEnd);

    if (type === "tEXt") {
      const parsed = readPngTextChunk(data);
      if (parsed) chunks.push(parsed);
    }

    if (type === "iTXt") {
      const parsed = await readPngInternationalTextChunk(data);
      if (parsed) chunks.push(parsed);
    }

    if (type === "zTXt") {
      const parsed = await readPngCompressedTextChunk(data);
      if (parsed) chunks.push(parsed);
    }

    offset = dataEnd + 4;
    if (type === "IEND") break;
  }

  return chunks;
}

function readPngTextChunk(data: Uint8Array) {
  const separator = data.indexOf(0);
  if (separator === -1) return null;

  const latin1Decoder = new TextDecoder("latin1");
  const utf8Decoder = new TextDecoder();

  return {
    keyword: latin1Decoder.decode(data.slice(0, separator)),
    text: utf8Decoder.decode(data.slice(separator + 1)),
  };
}

async function readPngInternationalTextChunk(data: Uint8Array) {
  const keywordEnd = data.indexOf(0);
  if (keywordEnd === -1 || keywordEnd + 2 >= data.length) return null;

  const latin1Decoder = new TextDecoder("latin1");
  const utf8Decoder = new TextDecoder();
  const keyword = latin1Decoder.decode(data.slice(0, keywordEnd));
  const compressionFlag = data[keywordEnd + 1];
  let cursor = keywordEnd + 3;

  const languageEnd = data.indexOf(0, cursor);
  if (languageEnd === -1) return null;
  cursor = languageEnd + 1;

  const translatedKeywordEnd = data.indexOf(0, cursor);
  if (translatedKeywordEnd === -1) return null;
  cursor = translatedKeywordEnd + 1;

  const textBytes = data.slice(cursor);
  const text =
    compressionFlag === 1
      ? await inflatePngText(textBytes)
      : utf8Decoder.decode(textBytes);

  return text ? { keyword, text } : null;
}

async function readPngCompressedTextChunk(data: Uint8Array) {
  const separator = data.indexOf(0);
  if (separator === -1 || separator + 2 >= data.length) return null;

  const latin1Decoder = new TextDecoder("latin1");
  const keyword = latin1Decoder.decode(data.slice(0, separator));
  const text = await inflatePngText(data.slice(separator + 2));

  return text ? { keyword, text } : null;
}

async function inflatePngText(data: Uint8Array) {
  if (!("DecompressionStream" in globalThis)) return "";

  try {
    const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream("deflate"));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  } catch {
    return "";
  }
}

function decodePossibleCharacterPayload(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (looksLikeCharacterCardSource(trimmed)) return trimmed;

  try {
    const binary = atob(trimmed);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return decoded.trim();
  } catch {
    return trimmed;
  }
}

function looksLikeCharacterCardSource(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) return false;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!isRecord(parsed)) return false;
    const data = isRecord(parsed.data) ? parsed.data : parsed;

    return Boolean(
      readString(data, ["name", "char_name", "character_name"]) ||
        readString(data, ["description", "char_description", "definition"]) ||
        readString(data, ["scenario", "scenario_text"]) ||
        readString(parsed, ["spec"]),
    );
  } catch {
    return false;
  }
}

function getCharacterCardFormat(card: Record<string, unknown>, sourceName?: string) {
  const spec = readString(card, ["spec"]);
  const specVersion = readString(card, ["spec_version", "specVersion"]);
  const sourceLabel = sourceName ? ` from ${sourceName}` : "";

  if (spec || specVersion) {
    return `${[spec, specVersion].filter(Boolean).join(" ")}${sourceLabel}`.trim();
  }

  if (isRecord(card.data)) {
    return `Character card v2${sourceLabel}`;
  }

  return `Character card JSON${sourceLabel}`;
}

function readString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function readStringArray(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .map((item) => item.trim());
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function isPng(bytes: Uint8Array) {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  return signature.every((byte, index) => bytes[index] === byte);
}

function readUint32(bytes: Uint8Array, offset: number) {
  return (
    bytes[offset] * 2 ** 24 +
    bytes[offset + 1] * 2 ** 16 +
    bytes[offset + 2] * 2 ** 8 +
    bytes[offset + 3]
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
