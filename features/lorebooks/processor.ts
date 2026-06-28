import type { LorebookV3, LorebookV3Entry } from "./schema";

export type LorebookActivation = {
  entry: LorebookV3Entry;
  matchedKeys: string[];
  reason: "constant" | "keyword";
};

export function getActiveLorebookEntries(
  lorebook: LorebookV3,
  recentMessages: string[],
): LorebookActivation[] {
  const scanDepth = lorebook.scan_depth ?? recentMessages.length;
  const text = recentMessages
    .slice(-Math.max(1, scanDepth))
    .join("\n");
  const activations: LorebookActivation[] = [];

  for (const entry of lorebook.entries.filter((item) => item.enabled)) {
    if (entry.constant) {
      activations.push({
        entry,
        matchedKeys: [],
        reason: "constant",
      });
      continue;
    }

    const options = {
      caseSensitive: entry.case_sensitive ?? false,
      useRegex: entry.use_regex,
    };
    const matchedKeys = entry.keys.filter((key) =>
      keyMatches(text, key, options),
    );

    if (matchedKeys.length === 0) {
      continue;
    }

    const matchedSecondaryKeys = (entry.secondary_keys ?? []).filter((key) =>
      keyMatches(text, key, options),
    );

    if (entry.selective && matchedSecondaryKeys.length === 0) {
      continue;
    }

    activations.push({
      entry,
      matchedKeys: [...matchedKeys, ...matchedSecondaryKeys],
      reason: "keyword",
    });
  }

  return applyTokenBudget(lorebook, activations);
}

function applyTokenBudget(
  lorebook: LorebookV3,
  activations: LorebookActivation[],
) {
  const tokenBudget = lorebook.token_budget;
  if (!tokenBudget) {
    return sortActivations(activations);
  }

  let used = 0;
  const selected: LorebookActivation[] = [];

  for (const activation of sortActivations(activations)) {
    const cost = estimateTokens(activation.entry.content);
    if (used + cost > tokenBudget && selected.length > 0) {
      continue;
    }

    used += cost;
    selected.push(activation);
  }

  return selected;
}

function sortActivations(activations: LorebookActivation[]) {
  return [...activations].sort((a, b) => {
    const priority = (b.entry.priority ?? 0) - (a.entry.priority ?? 0);
    return priority === 0
      ? a.entry.insertion_order - b.entry.insertion_order
      : priority;
  });
}

function keyMatches(
  text: string,
  key: string,
  options: { caseSensitive: boolean; useRegex: boolean },
) {
  if (options.useRegex) {
    try {
      return new RegExp(key, options.caseSensitive ? "" : "i").test(text);
    } catch {
      return false;
    }
  }

  return options.caseSensitive
    ? text.includes(key)
    : text.toLowerCase().includes(key.toLowerCase());
}

function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 4));
}
