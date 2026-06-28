import {
  HeartWriteLorebookRuntimeSchema,
  LorebookV3DocumentSchema,
  type LorebookV3,
  type LorebookV3Document,
  type LorebookV3Entry,
} from "./schema";

export type LorebookKeywordField = "keys" | "secondary_keys";

export type LorebookHealthSeverity =
  | "error"
  | "warning"
  | "info"
  | "suggestion";

export type LorebookHealthCategory =
  | "structure"
  | "config"
  | "keywords"
  | "recursion"
  | "budget"
  | "spoiler";

export interface LorebookKeywordMatchOptions {
  caseSensitive?: boolean;
  matchWholeWords?: boolean;
  useRegex?: boolean;
}

export interface LorebookKeywordMatch {
  entryId: string;
  field: LorebookKeywordField;
  isRegex: boolean;
  keyword: string;
  position: number;
}

export interface LorebookGraphNode {
  constant: boolean;
  enabled: boolean;
  entryId: string;
  hiddenFromUser: boolean;
  id: string;
  keyCount: number;
  name: string;
  reviewRequired: boolean;
  tokenEstimate: number;
}

export interface LorebookGraphEdge {
  blockedByExcludeRecursion: boolean;
  blockedByPreventRecursion: boolean;
  matchedKeys: string[];
  sourceId: string;
  targetId: string;
}

export interface LorebookActivationGraph {
  edges: LorebookGraphEdge[];
  nodes: LorebookGraphNode[];
}

export interface LorebookKeywordInventoryItem {
  entries: Array<{
    entryId: string;
    field: LorebookKeywordField;
    name: string;
  }>;
  isGeneric: boolean;
  isRegex: boolean;
  keyword: string;
  normalized: string;
}

export interface LorebookKeywordInventory {
  duplicateKeywords: LorebookKeywordInventoryItem[];
  genericKeywords: LorebookKeywordInventoryItem[];
  invalidRegexKeywords: LorebookKeywordInventoryItem[];
  items: LorebookKeywordInventoryItem[];
  substringOverlaps: Array<{
    containedBy: string;
    keyword: string;
  }>;
}

export interface LorebookHealthFinding {
  category: LorebookHealthCategory;
  code: string;
  details?: string;
  entryId?: string;
  message: string;
  severity: LorebookHealthSeverity;
}

export interface LorebookHealthReport {
  findings: LorebookHealthFinding[];
  graph: LorebookActivationGraph;
  score: number;
  summary: {
    errors: number;
    warnings: number;
    infos: number;
    suggestions: number;
  };
}

export interface LorebookActivationSimulationOptions {
  maxRecursionDepth?: number;
  scanDepth?: number;
  tokenBudget?: number;
}

export interface LorebookSimulatedActivation {
  depth: number;
  entryId: string;
  matchedKeys: string[];
  name: string;
  reason: "constant" | "keyword" | "recursion";
  tokenCost: number;
  triggeredByEntryId?: string;
}

export interface LorebookRecursionTraceStep {
  activatedEntryIds: string[];
  matchedKeys: string[];
  scannedEntryId: string;
  step: number;
}

export interface LorebookActivationSimulation {
  activatedEntries: LorebookSimulatedActivation[];
  budgetExhausted: boolean;
  budgetRemaining: number;
  recursionTrace: LorebookRecursionTraceStep[];
  skippedEntries: Array<{
    entryId: string;
    name: string;
    reason: "budget_exhausted";
  }>;
  totalTokens: number;
}

const GENERIC_KEYWORDS = new Set([
  "a",
  "an",
  "character",
  "he",
  "it",
  "location",
  "magic",
  "name",
  "person",
  "place",
  "she",
  "sword",
  "the",
  "they",
  "weapon",
]);

export function matchLorebookEntryKeys(
  entry: LorebookV3Entry,
  text: string,
  field: LorebookKeywordField = "keys",
  options: LorebookKeywordMatchOptions = {},
): LorebookKeywordMatch[] {
  const entryId = getDisplayEntryId(entry, 0);
  const keys = field === "keys" ? entry.keys : entry.secondary_keys ?? [];
  const matches: LorebookKeywordMatch[] = [];

  for (const keyword of keys) {
    const trimmed = keyword.trim();
    if (!trimmed) continue;

    if (options.useRegex ?? entry.use_regex) {
      const regex = createKeywordRegex(trimmed, options.caseSensitive ?? false);
      if (!regex) continue;

      for (const match of text.matchAll(regex)) {
        matches.push({
          entryId,
          field,
          isRegex: true,
          keyword,
          position: match.index ?? 0,
        });
      }
      continue;
    }

    matchLiteralKeyword(trimmed, text, {
      caseSensitive: options.caseSensitive ?? entry.case_sensitive ?? false,
      entryId,
      field,
      matchWholeWords: options.matchWholeWords ?? false,
      matches,
      originalKeyword: keyword,
    });
  }

  return matches;
}

export function entryMatchesLorebookText(
  entry: LorebookV3Entry,
  text: string,
  options: LorebookKeywordMatchOptions = {},
): LorebookKeywordMatch[] {
  const primaryMatches = matchLorebookEntryKeys(entry, text, "keys", options);

  if (primaryMatches.length === 0) {
    return [];
  }

  if (!entry.selective) {
    return primaryMatches;
  }

  const secondaryMatches = matchLorebookEntryKeys(
    entry,
    text,
    "secondary_keys",
    options,
  );

  return secondaryMatches.length > 0
    ? [...primaryMatches, ...secondaryMatches]
    : [];
}

export function buildLorebookActivationGraph(
  input: LorebookV3Document | LorebookV3,
): LorebookActivationGraph {
  const lorebook = readLorebook(input);
  const nodes = lorebook.entries.map(createGraphNode);
  const edges: LorebookGraphEdge[] = [];

  for (const [sourceIndex, source] of lorebook.entries.entries()) {
    if (!source.content.trim()) continue;

    for (const [targetIndex, target] of lorebook.entries.entries()) {
      if (sourceIndex === targetIndex || target.keys.length === 0) continue;

      const matches = entryMatchesLorebookText(target, source.content, {
        caseSensitive: target.case_sensitive ?? false,
        useRegex: target.use_regex,
      });

      if (matches.length === 0) continue;

      edges.push({
        blockedByExcludeRecursion: readSillyTavernBoolean(
          target,
          "excludeRecursion",
        ),
        blockedByPreventRecursion: readSillyTavernBoolean(
          source,
          "preventRecursion",
        ),
        matchedKeys: uniqueStrings(matches.map((match) => match.keyword)),
        sourceId: getGraphEntryId(source, sourceIndex),
        targetId: getGraphEntryId(target, targetIndex),
      });
    }
  }

  return { edges, nodes };
}

export function findLorebookCycles(
  graph: LorebookActivationGraph,
): string[][] {
  const adjacency = new Map<string, string[]>();
  const cycles: string[][] = [];
  const path: string[] = [];
  const visited = new Set<string>();
  const onStack = new Set<string>();

  for (const node of graph.nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of graph.edges) {
    if (edge.blockedByExcludeRecursion || edge.blockedByPreventRecursion) {
      continue;
    }
    adjacency.get(edge.sourceId)?.push(edge.targetId);
  }

  function visit(nodeId: string) {
    visited.add(nodeId);
    onStack.add(nodeId);
    path.push(nodeId);

    for (const nextId of adjacency.get(nodeId) ?? []) {
      if (!visited.has(nextId)) {
        visit(nextId);
        continue;
      }

      if (onStack.has(nextId)) {
        const cycleStart = path.lastIndexOf(nextId);
        cycles.push([...path.slice(cycleStart), nextId]);
      }
    }

    path.pop();
    onStack.delete(nodeId);
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      visit(node.id);
    }
  }

  return cycles;
}

export function findLorebookOrphanNodeIds(
  graph: LorebookActivationGraph,
): string[] {
  const incoming = new Set(graph.edges.map((edge) => edge.targetId));

  return graph.nodes
    .filter((node) => node.enabled && !node.constant && !incoming.has(node.id))
    .map((node) => node.id);
}

export function inspectLorebookKeywords(
  input: LorebookV3Document | LorebookV3,
): LorebookKeywordInventory {
  const lorebook = readLorebook(input);
  const inventory = new Map<string, LorebookKeywordInventoryItem>();

  for (const [index, entry] of lorebook.entries.entries()) {
    addEntryKeywordsToInventory(inventory, entry, index, "keys");
    addEntryKeywordsToInventory(inventory, entry, index, "secondary_keys");
  }

  const items = [...inventory.values()].sort((a, b) =>
    a.normalized.localeCompare(b.normalized),
  );
  const duplicateKeywords = items.filter((item) => item.entries.length > 1);
  const genericKeywords = items.filter((item) => item.isGeneric);
  const invalidRegexKeywords = items.filter(
    (item) => item.isRegex && !createKeywordRegex(item.keyword, false),
  );
  const substringOverlaps = findKeywordSubstringOverlaps(items);

  return {
    duplicateKeywords,
    genericKeywords,
    invalidRegexKeywords,
    items,
    substringOverlaps,
  };
}

export function runLorebookHealthQc(
  input: LorebookV3Document | LorebookV3,
): LorebookHealthReport {
  const lorebook = readLorebook(input);
  const graph = buildLorebookActivationGraph(lorebook);
  const keywordInventory = inspectLorebookKeywords(lorebook);
  const findings: LorebookHealthFinding[] = [];

  if (lorebook.entries.length === 0) {
    findings.push(createFinding("structure", "empty_lorebook", "warning",
      "Lorebook has no entries."));
  }

  addStructureFindings(findings, lorebook);
  addConfigFindings(findings, lorebook);
  addKeywordFindings(findings, keywordInventory);
  addRecursionFindings(findings, lorebook, graph);
  addBudgetFindings(findings, lorebook);
  addSpoilerFindings(findings, lorebook);

  const summary = {
    errors: findings.filter((finding) => finding.severity === "error").length,
    warnings: findings.filter((finding) => finding.severity === "warning").length,
    infos: findings.filter((finding) => finding.severity === "info").length,
    suggestions: findings.filter((finding) => finding.severity === "suggestion")
      .length,
  };
  const score = Math.max(
    0,
    100 -
      summary.errors * 25 -
      summary.warnings * 10 -
      summary.suggestions * 3,
  );

  return { findings, graph, score, summary };
}

export function simulateLorebookActivation(
  input: LorebookV3Document | LorebookV3,
  recentMessages: readonly string[],
  options: LorebookActivationSimulationOptions = {},
): LorebookActivationSimulation {
  const lorebook = readLorebook(input);
  const scanDepth = options.scanDepth ?? lorebook.scan_depth ?? recentMessages.length;
  const tokenBudget = options.tokenBudget ?? lorebook.token_budget ?? Number.POSITIVE_INFINITY;
  const maxRecursionDepth = options.maxRecursionDepth ?? 4;
  const scanText = recentMessages
    .slice(-Math.max(1, scanDepth))
    .join("\n");
  const activatedIds = new Set<string>();
  const activatedEntries: LorebookSimulatedActivation[] = [];
  const recursionTrace: LorebookRecursionTraceStep[] = [];

  for (const [index, entry] of lorebook.entries.entries()) {
    if (!entry.enabled || !entry.constant) continue;

    activatedIds.add(getGraphEntryId(entry, index));
    activatedEntries.push(createSimulatedActivation(entry, index, {
      depth: 0,
      matchedKeys: [],
      reason: "constant",
    }));
  }

  for (const [index, entry] of lorebook.entries.entries()) {
    if (!entry.enabled || entry.constant || activatedIds.has(getGraphEntryId(entry, index))) {
      continue;
    }

    const matches = entryMatchesLorebookText(entry, scanText, {
      caseSensitive: entry.case_sensitive ?? false,
      useRegex: entry.use_regex,
    });
    if (matches.length === 0) continue;

    activatedIds.add(getGraphEntryId(entry, index));
    activatedEntries.push(createSimulatedActivation(entry, index, {
      depth: 0,
      matchedKeys: uniqueStrings(matches.map((match) => match.keyword)),
      reason: "keyword",
    }));
  }

  if (lorebook.recursive_scanning) {
    runRecursionSimulation({
      activatedEntries,
      activatedIds,
      lorebook,
      maxRecursionDepth,
      recursionTrace,
    });
  }

  return applySimulationBudget(activatedEntries, recursionTrace, tokenBudget);
}

export function estimateLorebookEntryTokens(entryOrContent: LorebookV3Entry | string) {
  const content =
    typeof entryOrContent === "string" ? entryOrContent : entryOrContent.content;

  return Math.max(1, Math.ceil(content.length / 4));
}

function addStructureFindings(
  findings: LorebookHealthFinding[],
  lorebook: LorebookV3,
) {
  const seenIds = new Map<string, string>();

  for (const [index, entry] of lorebook.entries.entries()) {
    const entryId = getDisplayEntryId(entry, index);

    if (!entry.name?.trim()) {
      findings.push(createFinding("structure", "blank_entry_name", "warning",
        "Entry has no display name.", entryId));
    }

    if (entry.id !== undefined) {
      const id = String(entry.id);
      const previous = seenIds.get(id);
      if (previous) {
        findings.push(createFinding(
          "structure",
          "duplicate_entry_id",
          "warning",
          `Entry id "${id}" is shared with ${previous}.`,
          entryId,
        ));
      } else {
        seenIds.set(id, entryId);
      }
    }
  }
}

function addConfigFindings(
  findings: LorebookHealthFinding[],
  lorebook: LorebookV3,
) {
  for (const [index, entry] of lorebook.entries.entries()) {
    const entryId = getDisplayEntryId(entry, index);

    if (entry.enabled && !entry.constant && entry.keys.length === 0) {
      findings.push(createFinding(
        "config",
        "missing_trigger_keys",
        "error",
        "Enabled non-constant entry has no activation keys.",
        entryId,
      ));
    }

    if (entry.selective && (entry.secondary_keys ?? []).length === 0) {
      findings.push(createFinding(
        "config",
        "missing_secondary_keys",
        "warning",
        "Selective entry should define secondary keys.",
        entryId,
      ));
    }

    if (!entry.selective && (entry.secondary_keys ?? []).length > 0) {
      findings.push(createFinding(
        "config",
        "unused_secondary_keys",
        "suggestion",
        "Entry has secondary keys but selective mode is off.",
        entryId,
      ));
    }
  }
}

function addKeywordFindings(
  findings: LorebookHealthFinding[],
  inventory: LorebookKeywordInventory,
) {
  for (const item of inventory.duplicateKeywords) {
    findings.push(createFinding(
      "keywords",
      "duplicate_keyword",
      "warning",
      `Keyword "${item.keyword}" appears on ${item.entries.length} entries.`,
      item.entries[0]?.entryId,
    ));
  }

  for (const item of inventory.genericKeywords) {
    findings.push(createFinding(
      "keywords",
      "generic_keyword",
      "warning",
      `Keyword "${item.keyword}" is very generic and may activate too often.`,
      item.entries[0]?.entryId,
    ));
  }

  for (const item of inventory.invalidRegexKeywords) {
    findings.push(createFinding(
      "keywords",
      "invalid_regex_keyword",
      "warning",
      `Regex keyword "${item.keyword}" is invalid and will not match.`,
      item.entries[0]?.entryId,
    ));
  }

  for (const overlap of inventory.substringOverlaps) {
    findings.push(createFinding(
      "keywords",
      "substring_keyword_overlap",
      "suggestion",
      `Keyword "${overlap.keyword}" is contained inside "${overlap.containedBy}".`,
    ));
  }
}

function addRecursionFindings(
  findings: LorebookHealthFinding[],
  lorebook: LorebookV3,
  graph: LorebookActivationGraph,
) {
  if (!lorebook.recursive_scanning && graph.edges.length > 0) {
    findings.push(createFinding(
      "recursion",
      "recursive_scanning_off",
      "info",
      "Entry content contains keyword links, but recursive scanning is off.",
    ));
  }

  for (const cycle of findLorebookCycles(graph)) {
    findings.push(createFinding(
      "recursion",
      "recursion_cycle",
      "warning",
      `Potential recursion cycle: ${cycle.join(" -> ")}.`,
      cycle[0],
    ));
  }

  for (const nodeId of findLorebookOrphanNodeIds(graph)) {
    findings.push(createFinding(
      "recursion",
      "orphan_entry",
      "suggestion",
      "Entry is not constant and has no incoming lorebook graph links.",
      nodeId,
    ));
  }
}

function addBudgetFindings(
  findings: LorebookHealthFinding[],
  lorebook: LorebookV3,
) {
  const constantEntries = lorebook.entries.filter(
    (entry) => entry.enabled && entry.constant,
  );
  const constantTokenTotal = constantEntries.reduce(
    (total, entry) => total + estimateLorebookEntryTokens(entry),
    0,
  );

  if (constantEntries.length > 7) {
    findings.push(createFinding(
      "budget",
      "too_many_constant_entries",
      "warning",
      `${constantEntries.length} entries are always active.`,
    ));
  }

  if (constantTokenTotal > 2000) {
    findings.push(createFinding(
      "budget",
      "constant_token_cost",
      "warning",
      `Constant entries consume about ${constantTokenTotal} tokens before keyword lore activates.`,
    ));
  }

  if (lorebook.token_budget && constantTokenTotal > lorebook.token_budget) {
    findings.push(createFinding(
      "budget",
      "constant_entries_exceed_budget",
      "warning",
      "Always-active lore exceeds the lorebook token budget.",
    ));
  }

  for (const [index, entry] of lorebook.entries.entries()) {
    const tokenEstimate = estimateLorebookEntryTokens(entry);

    if (tokenEstimate > 300) {
      findings.push(createFinding(
        "budget",
        "large_entry",
        "info",
        `Entry is about ${tokenEstimate} tokens and may be worth splitting.`,
        getDisplayEntryId(entry, index),
      ));
    }
  }
}

function addSpoilerFindings(
  findings: LorebookHealthFinding[],
  lorebook: LorebookV3,
) {
  for (const [index, entry] of lorebook.entries.entries()) {
    const runtime = readHeartWriteRuntime(entry);
    const entryId = getDisplayEntryId(entry, index);

    if (runtime.hiddenFromUser && !runtime.spoilerPreview?.trim()) {
      findings.push(createFinding(
        "spoiler",
        "missing_spoiler_preview",
        "warning",
        "Hidden entry should include a non-spoiler preview.",
        entryId,
      ));
    }

    if (runtime.reviewRequired) {
      findings.push(createFinding(
        "spoiler",
        "review_required",
        "info",
        "Entry is flagged for human review before export.",
        entryId,
      ));
    }
  }
}

function runRecursionSimulation(input: {
  activatedEntries: LorebookSimulatedActivation[];
  activatedIds: Set<string>;
  lorebook: LorebookV3;
  maxRecursionDepth: number;
  recursionTrace: LorebookRecursionTraceStep[];
}) {
  let frontier = input.activatedEntries.filter((activation) => {
    const entry = findEntryByDisplayId(input.lorebook, activation.entryId);
    return entry && !readSillyTavernBoolean(entry.entry, "preventRecursion");
  });

  for (let depth = 1; depth <= input.maxRecursionDepth && frontier.length; depth++) {
    const nextFrontier: LorebookSimulatedActivation[] = [];

    for (const activation of frontier) {
      const source = findEntryByDisplayId(input.lorebook, activation.entryId);
      if (!source || readSillyTavernBoolean(source.entry, "preventRecursion")) {
        continue;
      }

      const activatedEntryIds: string[] = [];
      const matchedKeys: string[] = [];

      for (const [targetIndex, target] of input.lorebook.entries.entries()) {
        const targetGraphId = getGraphEntryId(target, targetIndex);
        if (
          input.activatedIds.has(targetGraphId) ||
          !target.enabled ||
          readSillyTavernBoolean(target, "excludeRecursion")
        ) {
          continue;
        }

        const matches = entryMatchesLorebookText(target, source.entry.content, {
          caseSensitive: target.case_sensitive ?? false,
          useRegex: target.use_regex,
        });
        if (matches.length === 0) continue;

        const nextActivation = createSimulatedActivation(target, targetIndex, {
          depth,
          matchedKeys: uniqueStrings(matches.map((match) => match.keyword)),
          reason: "recursion",
          triggeredByEntryId: source.displayId,
        });
        input.activatedIds.add(targetGraphId);
        input.activatedEntries.push(nextActivation);
        nextFrontier.push(nextActivation);
        activatedEntryIds.push(nextActivation.entryId);
        matchedKeys.push(...nextActivation.matchedKeys);
      }

      if (activatedEntryIds.length > 0) {
        input.recursionTrace.push({
          activatedEntryIds,
          matchedKeys: uniqueStrings(matchedKeys),
          scannedEntryId: source.displayId,
          step: depth,
        });
      }
    }

    frontier = nextFrontier;
  }
}

function applySimulationBudget(
  activatedEntries: LorebookSimulatedActivation[],
  recursionTrace: LorebookRecursionTraceStep[],
  tokenBudget: number,
): LorebookActivationSimulation {
  const finalActivations: LorebookSimulatedActivation[] = [];
  const skippedEntries: LorebookActivationSimulation["skippedEntries"] = [];
  let totalTokens = 0;

  for (const activation of activatedEntries) {
    if (
      Number.isFinite(tokenBudget) &&
      totalTokens + activation.tokenCost > tokenBudget &&
      finalActivations.length > 0
    ) {
      skippedEntries.push({
        entryId: activation.entryId,
        name: activation.name,
        reason: "budget_exhausted",
      });
      continue;
    }

    totalTokens += activation.tokenCost;
    finalActivations.push(activation);
  }

  return {
    activatedEntries: finalActivations,
    budgetExhausted: skippedEntries.length > 0,
    budgetRemaining: Number.isFinite(tokenBudget)
      ? Math.max(0, tokenBudget - totalTokens)
      : Number.POSITIVE_INFINITY,
    recursionTrace,
    skippedEntries,
    totalTokens,
  };
}

function createSimulatedActivation(
  entry: LorebookV3Entry,
  index: number,
  options: {
    depth: number;
    matchedKeys: string[];
    reason: LorebookSimulatedActivation["reason"];
    triggeredByEntryId?: string;
  },
): LorebookSimulatedActivation {
  return {
    depth: options.depth,
    entryId: getDisplayEntryId(entry, index),
    matchedKeys: options.matchedKeys,
    name: entry.name?.trim() || getDisplayEntryId(entry, index),
    reason: options.reason,
    tokenCost: estimateLorebookEntryTokens(entry),
    ...(options.triggeredByEntryId
      ? { triggeredByEntryId: options.triggeredByEntryId }
      : {}),
  };
}

function addEntryKeywordsToInventory(
  inventory: Map<string, LorebookKeywordInventoryItem>,
  entry: LorebookV3Entry,
  index: number,
  field: LorebookKeywordField,
) {
  const keys = field === "keys" ? entry.keys : entry.secondary_keys ?? [];

  for (const key of keys) {
    const trimmed = key.trim();
    if (!trimmed) continue;

    const normalized = trimmed.toLowerCase();
    const existing = inventory.get(`${field}:${normalized}`);
    const nextEntry = {
      entryId: getDisplayEntryId(entry, index),
      field,
      name: entry.name?.trim() || getDisplayEntryId(entry, index),
    };

    if (existing) {
      existing.entries.push(nextEntry);
      continue;
    }

    inventory.set(`${field}:${normalized}`, {
      entries: [nextEntry],
      isGeneric: GENERIC_KEYWORDS.has(normalized),
      isRegex: entry.use_regex,
      keyword: trimmed,
      normalized,
    });
  }
}

function findKeywordSubstringOverlaps(
  items: LorebookKeywordInventoryItem[],
): LorebookKeywordInventory["substringOverlaps"] {
  const overlaps: LorebookKeywordInventory["substringOverlaps"] = [];

  for (const item of items) {
    if (item.normalized.length < 3) continue;

    for (const other of items) {
      if (
        item.normalized === other.normalized ||
        other.normalized.length <= item.normalized.length
      ) {
        continue;
      }

      if (other.normalized.includes(item.normalized)) {
        overlaps.push({
          containedBy: other.keyword,
          keyword: item.keyword,
        });
      }
    }
  }

  return overlaps;
}

function matchLiteralKeyword(
  keyword: string,
  text: string,
  options: {
    caseSensitive: boolean;
    entryId: string;
    field: LorebookKeywordField;
    matchWholeWords: boolean;
    matches: LorebookKeywordMatch[];
    originalKeyword: string;
  },
) {
  const searchText = options.caseSensitive ? text : text.toLowerCase();
  const searchKeyword = options.caseSensitive ? keyword : keyword.toLowerCase();
  let startIndex = 0;

  while (startIndex <= searchText.length) {
    const index = searchText.indexOf(searchKeyword, startIndex);
    if (index === -1) break;

    if (
      !options.matchWholeWords ||
      isWholeWordMatch(searchText, index, searchKeyword.length)
    ) {
      options.matches.push({
        entryId: options.entryId,
        field: options.field,
        isRegex: false,
        keyword: options.originalKeyword,
        position: index,
      });
    }

    startIndex = index + Math.max(1, searchKeyword.length);
  }
}

function createKeywordRegex(keyword: string, caseSensitive: boolean): RegExp | null {
  const slashMatch = /^\/(.+)\/([dgimsuvy]*)$/.exec(keyword);
  const source = slashMatch ? slashMatch[1] : keyword;
  const rawFlags = slashMatch ? slashMatch[2] : "";
  const flags = uniqueStrings([
    ...rawFlags.split(""),
    "g",
    ...(caseSensitive || rawFlags.includes("i") ? [] : ["i"]),
  ]).join("");

  try {
    return new RegExp(source, flags);
  } catch {
    return null;
  }
}

function isWholeWordMatch(text: string, index: number, length: number): boolean {
  const before = index > 0 ? text[index - 1] : "";
  const after = index + length < text.length ? text[index + length] : "";

  return (!before || /\W/.test(before)) && (!after || /\W/.test(after));
}

function createGraphNode(entry: LorebookV3Entry, index: number): LorebookGraphNode {
  const runtime = readHeartWriteRuntime(entry);

  return {
    constant: entry.constant,
    enabled: entry.enabled,
    entryId: getDisplayEntryId(entry, index),
    hiddenFromUser: runtime.hiddenFromUser,
    id: getGraphEntryId(entry, index),
    keyCount: entry.keys.length + (entry.secondary_keys?.length ?? 0),
    name: entry.name?.trim() || getDisplayEntryId(entry, index),
    reviewRequired: runtime.reviewRequired,
    tokenEstimate: estimateLorebookEntryTokens(entry),
  };
}

function findEntryByDisplayId(
  lorebook: LorebookV3,
  displayId: string,
): { displayId: string; entry: LorebookV3Entry; index: number } | undefined {
  for (const [index, entry] of lorebook.entries.entries()) {
    if (getDisplayEntryId(entry, index) === displayId) {
      return { displayId, entry, index };
    }
  }

  return undefined;
}

function readLorebook(input: LorebookV3Document | LorebookV3): LorebookV3 {
  const direct = LorebookV3DocumentSchema.safeParse(input);
  return direct.success ? direct.data.data : input as LorebookV3;
}

function readHeartWriteRuntime(entry: LorebookV3Entry) {
  return HeartWriteLorebookRuntimeSchema.parse(
    isRecord(entry.extensions.heartwriteai)
      ? entry.extensions.heartwriteai
      : {},
  );
}

function readSillyTavernBoolean(entry: LorebookV3Entry, key: string): boolean {
  const sillytavern = isRecord(entry.extensions.sillytavern)
    ? entry.extensions.sillytavern
    : {};

  return sillytavern[key] === true;
}

function getDisplayEntryId(entry: LorebookV3Entry, index: number): string {
  return String(entry.id ?? entry.name ?? `entry:${index}`);
}

function getGraphEntryId(entry: LorebookV3Entry, index: number): string {
  return `${getDisplayEntryId(entry, index)}#${index}`;
}

function uniqueStrings(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    output.push(value);
  }

  return output;
}

function createFinding(
  category: LorebookHealthCategory,
  code: string,
  severity: LorebookHealthSeverity,
  message: string,
  entryId?: string,
  details?: string,
): LorebookHealthFinding {
  return {
    category,
    code,
    message,
    severity,
    ...(entryId ? { entryId } : {}),
    ...(details ? { details } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
