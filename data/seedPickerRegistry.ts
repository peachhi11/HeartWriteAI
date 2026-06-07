import {
  SEED_PRESET_REGISTRY,
  type SeedPresetRegistryEntry,
  type SeedPresetRegistryLane,
} from "./seedPresetRegistry";
import {
  SEMANTIC_SEED_NODES,
  type SemanticSeedNode,
} from "./semanticSeedRegistry";

export type SeedPickerEntryKind = "preset" | "semantic";
export type SeedPickerLane = SeedPresetRegistryLane | "semantic";

export interface SeedPickerEntry {
  category: string;
  description: string;
  guidance: string;
  id: string;
  kind: SeedPickerEntryKind;
  label: string;
  lane: SeedPickerLane;
  registryKey: string;
  searchText: string;
  sourceLabel: string;
  tags: readonly string[];
  value: string;
}

export interface SeedPickerSearchOptions {
  categories?: readonly string[];
  kinds?: readonly SeedPickerEntryKind[];
  lanes?: readonly SeedPickerLane[];
  limit?: number;
}

export const SEED_PICKER_ENTRIES = Object.freeze([
  ...SEED_PRESET_REGISTRY.map(toPresetPickerEntry),
  ...SEMANTIC_SEED_NODES.map(toSemanticPickerEntry),
] as const satisfies readonly SeedPickerEntry[]);

export function getSeedPickerEntries(
  options: Omit<SeedPickerSearchOptions, "limit"> = {},
): readonly SeedPickerEntry[] {
  return filterSeedPickerEntries(SEED_PICKER_ENTRIES, options);
}

export function searchSeedPickerEntries(
  query: string,
  options: SeedPickerSearchOptions = {},
): readonly SeedPickerEntry[] {
  const normalizedQuery = normalizeSearchToken(query);
  if (!normalizedQuery) {
    return [];
  }

  const filteredEntries = filterSeedPickerEntries(SEED_PICKER_ENTRIES, options);
  const scoredEntries = filteredEntries
    .map((entry) => ({
      entry,
      score: scoreSeedPickerEntry(entry, normalizedQuery),
    }))
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score);

  const entries = scoredEntries.map((result) => result.entry);
  return options.limit === undefined ? entries : entries.slice(0, options.limit);
}

function filterSeedPickerEntries(
  entries: readonly SeedPickerEntry[],
  options: Omit<SeedPickerSearchOptions, "limit">,
) {
  const lanes = new Set(options.lanes);
  const kinds = new Set(options.kinds);
  const categories = new Set(
    (options.categories ?? []).map((category) => category.toLowerCase()),
  );

  return entries.filter((entry) => {
    if (lanes.size > 0 && !lanes.has(entry.lane)) {
      return false;
    }
    if (kinds.size > 0 && !kinds.has(entry.kind)) {
      return false;
    }
    if (categories.size > 0 && !categories.has(entry.category.toLowerCase())) {
      return false;
    }

    return true;
  });
}

function scoreSeedPickerEntry(entry: SeedPickerEntry, query: string) {
  const tokens = query.split(/\s+/).filter(Boolean);
  let score = 0;

  for (const token of tokens) {
    if (entry.id.toLowerCase() === token || entry.registryKey.toLowerCase() === token) {
      score += 120;
      continue;
    }
    if (entry.label.toLowerCase().includes(token)) {
      score += 80;
    }
    if (entry.category.toLowerCase().includes(token)) {
      score += 55;
    }
    if (entry.sourceLabel.toLowerCase().includes(token)) {
      score += 45;
    }
    if (entry.tags.some((tag) => tag.toLowerCase().includes(token))) {
      score += 35;
    }
    if (entry.searchText.toLowerCase().includes(token)) {
      score += 15;
    }
  }

  return score;
}

function toPresetPickerEntry(entry: SeedPresetRegistryEntry): SeedPickerEntry {
  const searchValues = [
    entry.registryKey,
    entry.id,
    entry.sourceId,
    entry.sourceLabel,
    entry.lane,
    entry.category,
    entry.label,
    entry.value,
    entry.guidance,
    entry.originalLane ?? "",
    ...entry.triggerKeys,
    ...entry.systemPromptTags,
  ];

  return {
    category: entry.category,
    description: entry.guidance,
    guidance: entry.guidance,
    id: entry.id,
    kind: "preset",
    label: entry.label,
    lane: entry.lane,
    registryKey: entry.registryKey,
    searchText: searchValues.join(" "),
    sourceLabel: entry.sourceLabel,
    tags: [...entry.triggerKeys, ...entry.systemPromptTags],
    value: entry.value,
  };
}

function toSemanticPickerEntry(node: SemanticSeedNode): SeedPickerEntry {
  const searchValues = [
    node.id,
    node.category,
    node.label,
    node.description ?? "",
    node.internalMeaning ?? "",
    node.emotionalMeaning ?? "",
    node.visual ?? "",
    node.impression ?? "",
    node.payoff ?? "",
    node.guidance ?? "",
    ...node.aliases,
    ...node.parents,
    ...node.children,
    ...node.related,
    ...(node.opposite ?? []),
    ...node.tags,
    ...(node.behaviors ?? []),
    ...(node.dialogueExamples ?? []),
    ...(node.bodyLanguage ?? []),
    ...(node.commonTriggers ?? []),
    ...(node.commonConflicts ?? []),
    ...(node.hiddenNeeds ?? []),
    ...(node.commonWounds ?? []),
    ...(node.growthPath ?? []),
    ...(node.relatedConcepts ?? []),
    ...(node.associatedVibes ?? []),
    ...(node.emotionalArc ?? []),
    ...(node.triggers ?? []),
    ...(node.goals ?? []),
  ];

  return {
    category: node.category,
    description:
      node.description ??
      node.internalMeaning ??
      node.emotionalMeaning ??
      node.guidance ??
      "",
    guidance: node.guidance ?? "",
    id: node.id,
    kind: "semantic",
    label: node.label,
    lane: "semantic",
    registryKey: `semantic:${node.category}:${node.id}`,
    searchText: searchValues.join(" "),
    sourceLabel: "Semantic Registry",
    tags: node.tags,
    value: node.id,
  };
}

function normalizeSearchToken(value: string) {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ");
}
