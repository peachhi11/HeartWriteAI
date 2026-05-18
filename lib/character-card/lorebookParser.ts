import { z } from "zod";

import type { GeneratedLoreEntryData } from "./generator";

export const loreEntryRuntimeSchema = z.object({
  activationKeys: z.array(z.string().trim().min(1)).default([]),
  domainScope: z.enum([
    "Biographical_NPC",
    "Geopolitical_Faction",
    "Mythological_Rules",
    "Societal_Customs",
  ]),
  entryContent: z.string().trim().min(1),
  entryId: z.string().uuid(),
  insertionPriority: z.enum([
    "Constant_Anchor",
    "Reactive_Contextual",
    "Recursive_Linked",
  ]),
  title: z.string().trim().min(1),
  tokenReserveCost: z.number().int().min(25).max(1000).default(100),
});

export interface LorebookActivationMessage {
  content: string;
  role: "system";
}

export function parseActiveLore(
  latestUserMessage: string,
  lorebookEntries: GeneratedLoreEntryData[],
): LorebookActivationMessage[] {
  const activeEntriesToInject: LorebookActivationMessage[] = [];
  const normalizedMessage = latestUserMessage.toLowerCase();
  const seenEntryIds = new Set<string>();

  lorebookEntries.forEach((entry) => {
    const entryResult = loreEntryRuntimeSchema.safeParse(entry);

    if (!entryResult.success || seenEntryIds.has(entry.entryId)) {
      return;
    }

    const parsedEntry = entryResult.data;
    const isConstantAnchor =
      parsedEntry.insertionPriority === "Constant_Anchor";
    const matchFound = parsedEntry.activationKeys.some((key) =>
      activationKeyMatches(latestUserMessage, normalizedMessage, key),
    );

    if (!isConstantAnchor && !matchFound) {
      return;
    }

    seenEntryIds.add(parsedEntry.entryId);
    activeEntriesToInject.push({
      content: formatLoreEntrySystemMessage(parsedEntry),
      role: "system",
    });
  });

  return activeEntriesToInject;
}

export function formatLoreEntrySystemMessage(
  entry: GeneratedLoreEntryData,
): string {
  return [
    `[LOREBOOK ACTIVATION: ${entry.title}]`,
    `Scope: ${entry.domainScope}`,
    `Insertion: ${entry.insertionPriority}`,
    `Token reserve: ${entry.tokenReserveCost}`,
    entry.entryContent,
  ].join("\n");
}

function activationKeyMatches(
  latestUserMessage: string,
  normalizedMessage: string,
  key: string,
) {
  try {
    return new RegExp(key, "i").test(latestUserMessage);
  } catch {
    return normalizedMessage.includes(key.toLowerCase());
  }
}
