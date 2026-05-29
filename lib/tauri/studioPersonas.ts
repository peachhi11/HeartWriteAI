"use client";

import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";
import { RomanceTropeClassSchema } from "@/types/character-card/RomanceTropeClassification";
import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";
import type { SavedPersonaMetadata } from "@/types/studio";

const LOCAL_STORAGE_KEY = "heartwriteai:persona-library";

export async function fetchSavedPersonasList(): Promise<SavedPersonaMetadata[]> {
  if (isTauriRuntime()) {
    const nativePersonas = await invoke<unknown[]>("fetch_saved_personas_list");
    return nativePersonas
      .map(normalizePersonaMetadata)
      .filter((item): item is SavedPersonaMetadata => Boolean(item));
  }

  return loadBrowserPersonaSummaries();
}

export async function deleteSavedPersonaFile(personaId: string): Promise<void> {
  if (isTauriRuntime()) {
    await invoke("delete_saved_persona_file", { personaId });
    return;
  }

  deleteBrowserPersonaSummary(personaId);
}

function loadBrowserPersonaSummaries(): SavedPersonaMetadata[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeBrowserPersona)
      .filter((item): item is SavedPersonaMetadata => Boolean(item))
      .sort((a, b) => b.lastUsed.localeCompare(a.lastUsed));
  } catch {
    return [];
  }
}

function deleteBrowserPersonaSummary(personaId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return;
    }

    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(
        parsed.filter((item) => {
          if (!item || typeof item !== "object") {
            return true;
          }

          return readString((item as Record<string, unknown>).id) !== personaId;
        }),
      ),
    );
  } catch {
    // Keep browser previews forgiving if the local test store is malformed.
  }
}

function normalizePersonaMetadata(value: unknown): SavedPersonaMetadata | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = readString(record.id);
  const name = readString(record.name);

  if (!id || !name) {
    return null;
  }

  return {
    charm: inferScore(record, "charm", 50),
    coreClass: inferCoreClass(record),
    id,
    lastUsed: readString(record.lastUsed) || readString(record.last_used) || "--",
    name,
    vulnerability: inferScore(record, "vulnerability", 50),
    willpower: inferScore(record, "willpower", 50),
  };
}

function normalizeBrowserPersona(value: unknown): SavedPersonaMetadata | null {
  const metadata = normalizePersonaMetadata(value);
  if (!metadata || !value || typeof value !== "object") {
    return metadata;
  }

  const record = value as Record<string, unknown>;
  return {
    ...metadata,
    lastUsed: formatTimestamp(record.updatedAt),
  };
}

function inferCoreClass(record: Record<string, unknown>): RomanceTropeClass {
  const explicit = readString(record.coreClass) || readString(record.core_class);
  const parsed = RomanceTropeClassSchema.safeParse(explicit);
  if (parsed.success) {
    return parsed.data;
  }

  const haystack = [
    readString(record.summary),
    readString(record.prompt),
    Array.isArray(record.tags) ? record.tags.map(readString).join(" ") : "",
  ]
    .join(" ")
    .toLowerCase();

  for (const trope of RomanceTropeClassSchema.options) {
    if (haystack.includes(trope.replace("_", " "))) {
      return trope;
    }
    if (haystack.includes(trope)) {
      return trope;
    }
  }

  return "casual";
}

function inferScore(
  record: Record<string, unknown>,
  key: "charm" | "vulnerability" | "willpower",
  fallback: number,
) {
  const explicit = readNumber(record[key]);
  if (explicit !== null) {
    return clampScore(explicit);
  }

  const haystack = [
    readString(record.summary),
    readString(record.prompt),
    Array.isArray(record.tags) ? record.tags.map(readString).join(" ") : "",
  ]
    .join(" ")
    .toLowerCase();

  if (key === "charm" && /banter|sunshine|charm|social|playful/.test(haystack)) {
    return 68;
  }
  if (key === "willpower" && /guard|rival|defiant|boundar|stubborn/.test(haystack)) {
    return 70;
  }
  if (key === "vulnerability" && /yearn|fluster|soft|need|intimate/.test(haystack)) {
    return 66;
  }

  return fallback;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatTimestamp(value: unknown) {
  const numeric = readNumber(value);
  if (numeric !== null) {
    return new Date(numeric).toISOString();
  }

  return readString(value) || "--";
}
