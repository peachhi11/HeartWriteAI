"use client";

import { invoke } from "@tauri-apps/api/core";

import { generatedLorebookArtifactToV3Document } from "@/features/lorebooks/adapters";
import type { GeneratedLorebookArtifact } from "@/features/generation/workflows";
import { isTauriRuntime } from "@/lib/tauri/native";
import type { LoreRecallAuditLog } from "@/types/lorebook";

export interface LoreActivationMatch {
  entryId: string;
  entryTitle: string;
  injectedSnippet: string;
  matchedKeys: string[];
}

export interface LoreActivationPayload {
  hasMatches: boolean;
  loreInjectionChunk: string;
  matches: LoreActivationMatch[];
}

export async function scanActiveLorebookForChatTurn(
  lorebook: GeneratedLorebookArtifact | null,
  userInputText: string,
): Promise<LoreActivationPayload> {
  if (!lorebook) {
    return emptyLoreActivationPayload();
  }

  if (isTauriRuntime()) {
    try {
      const nativePayload = await invoke<LoreActivationPayload>(
        "execute_lore_context_scan",
        {
          bookId: lorebook.id,
          userInputText,
        },
      );

      if (nativePayload.hasMatches) {
        return nativePayload;
      }

      const browserPayload = scanLorebookInBrowser(lorebook, userInputText);
      return browserPayload.hasMatches ? browserPayload : nativePayload;
    } catch (error) {
      console.warn("Native lore recall failed, using browser fallback.", error);
    }
  }

  return scanLorebookInBrowser(lorebook, userInputText);
}

export function buildLoreRecallMessages(payload: LoreActivationPayload) {
  return payload.loreInjectionChunk.trim()
    ? [
        {
          content: [
            "LORE REMEMBERED FOR THIS REPLY:",
            payload.loreInjectionChunk,
            "Use only the remembered lore that directly fits this turn. Do not dump unrelated background.",
          ].join("\n"),
          role: "system",
        },
      ]
    : [];
}

export function createLoreRecallAuditLogs(
  payload: LoreActivationPayload,
  lorebook: GeneratedLorebookArtifact | null,
  messageId: string,
): LoreRecallAuditLog[] {
  if (!lorebook || !payload.hasMatches) {
    return [];
  }

  const timestamp = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return payload.matches.map((match) => ({
    bookTitle: lorebook.title,
    id: `${messageId}:${match.entryId}`,
    injectedSnippet: match.injectedSnippet,
    matchedKeys: match.matchedKeys,
    messageId,
    timestamp,
  }));
}

function scanLorebookInBrowser(
  lorebook: GeneratedLorebookArtifact,
  userInputText: string,
): LoreActivationPayload {
  const document = lorebook.v3Document ?? generatedLorebookArtifactToV3Document(lorebook);
  const matches: LoreActivationMatch[] = [];

  document.data.entries.forEach((entry, index) => {
    if (!entry.enabled || !entry.content.trim()) {
      return;
    }

    const matchedKeys = entry.keys.filter((key) =>
      doesLoreActivationKeyMatch(userInputText, key, Boolean(entry.use_regex)),
    );

    if (matchedKeys.length === 0) {
      return;
    }

    matches.push({
      entryId: String(entry.id ?? `entry-${index + 1}`),
      entryTitle: entry.name ?? "Lore entry",
      injectedSnippet: entry.content.trim(),
      matchedKeys,
    });
  });

  return {
    hasMatches: matches.length > 0,
    loreInjectionChunk: matches.map(formatLoreActivationMatch).join("\n\n"),
    matches,
  };
}

function formatLoreActivationMatch(match: LoreActivationMatch) {
  return [
    `[LORE RECALL: ${match.entryTitle}]`,
    `Matched keys: ${match.matchedKeys.join(", ")}`,
    match.injectedSnippet,
  ].join("\n");
}

export function doesLoreActivationKeyMatch(
  userInputText: string,
  key: string,
  useRegex: boolean,
) {
  const trimmedKey = key.trim();

  if (!trimmedKey) {
    return false;
  }

  if (useRegex) {
    try {
      return new RegExp(trimmedKey, "i").test(userInputText);
    } catch {
      // Fall back to whole-word matching below.
    }
  }

  const escaped = trimmedKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}_])${escaped}($|[^\\p{L}\\p{N}_])`, "iu").test(
    userInputText,
  );
}

function emptyLoreActivationPayload(): LoreActivationPayload {
  return {
    hasMatches: false,
    loreInjectionChunk: "",
    matches: [],
  };
}
