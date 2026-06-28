import {
  CharacterGenSchema,
  type CharacterGen,
} from "./appCharacterGenSchema";

const TAGS = [
  "NAME",
  "DESCRIPTION",
  "PERSONALITY",
  "SCENARIO",
  "FIRST_MESSAGE",
  "EXAMPLE_MESSAGES",
  "TAGS",
  "CREATOR_NOTES",
  "IMAGE_PROMPT",
  "NEGATIVE_PROMPT",
  "POV",
] as const;

const TAG_SET = new Set<string>(TAGS);

export type CharacterResponseFailureKind =
  | "truncated"
  | "invalid_json"
  | "schema_mismatch"
  | "unknown";

export function extractJsonBlock(raw: string): string | null {
  const match = raw.match(/```json\s*([\s\S]*?)```/i);
  return match ? match[1].trim() : null;
}

export function tryParseJson(raw: string): unknown | null {
  const candidates: string[] = [];
  const block = extractJsonBlock(raw);
  if (block) {
    candidates.push(block);
  }

  candidates.push(raw.trim());

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    try {
      return JSON.parse(candidate) as unknown;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

export function classifyRawFailure(raw: string): CharacterResponseFailureKind {
  const text = raw.trim();

  if (!text) {
    return "unknown";
  }

  if (looksLikeTruncatedJson(text)) {
    return "truncated";
  }

  if (text.startsWith("{") || text.startsWith("[") || extractJsonBlock(text)) {
    return "invalid_json";
  }

  return "invalid_json";
}

export function parseTaggedSections(raw: string): Record<string, string> {
  const map: Record<string, string> = {};
  let current: string | null = null;
  let buffer: string[] = [];

  function flush() {
    if (current) {
      map[current] = buffer.join("\n").trim();
    }

    buffer = [];
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    const match = trimmed.match(/^#([A-Z_]+)#$/);

    if (match?.[1] && TAG_SET.has(match[1])) {
      flush();
      current = match[1];
      continue;
    }

    if (current) {
      buffer.push(line);
    }
  }

  flush();
  return map;
}

export function buildCharacterFromTaggedSections(
  map: Record<string, string>,
): Record<string, unknown> {
  const get = (key: string) => (map[key] ?? "").trim();
  const pov = normalizePov(map.POV);
  const result: Record<string, unknown> = {
    creator_notes: get("CREATOR_NOTES"),
    description: get("DESCRIPTION"),
    first_mes: get("FIRST_MESSAGE"),
    image_prompt: get("IMAGE_PROMPT"),
    mes_example: get("EXAMPLE_MESSAGES"),
    name: get("NAME"),
    negative_prompt: get("NEGATIVE_PROMPT"),
    personality: get("PERSONALITY"),
    scenario: get("SCENARIO"),
    tags: parseTags(map.TAGS ?? ""),
  };

  if (pov) {
    result.pov = pov;
  }

  return result;
}

export function parseCharacterResponse(raw: string): CharacterGen {
  const json = tryParseJson(raw);

  if (json) {
    const validated = CharacterGenSchema.safeParse(json);
    if (!validated.success) {
      throw new Error("LLM response parsed but did not match schema");
    }

    return validated.data;
  }

  const sections = parseTaggedSections(raw);
  if (!Object.keys(sections).length) {
    throw new Error("Unable to parse LLM response as JSON or tagged sections");
  }

  const built = buildCharacterFromTaggedSections(sections);
  const validated = CharacterGenSchema.safeParse(built);
  if (!validated.success) {
    throw new Error("Tagged response did not match schema");
  }

  return validated.data;
}

function parseTags(value: string) {
  return value
    .split(/,|\n/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizePov(value: string | undefined) {
  const pov = (value ?? "").trim().toLowerCase();
  if (pov === "first" || pov === "second" || pov === "third") {
    return pov;
  }

  return undefined;
}

function looksLikeTruncatedJson(text: string) {
  if (!(text.startsWith("{") || text.startsWith("["))) {
    return false;
  }

  const openCurly = countMatches(text, "{");
  const closeCurly = countMatches(text, "}");
  const openSquare = countMatches(text, "[");
  const closeSquare = countMatches(text, "]");

  return openCurly > closeCurly || openSquare > closeSquare;
}

function countMatches(value: string, needle: string) {
  return value.split(needle).length - 1;
}
