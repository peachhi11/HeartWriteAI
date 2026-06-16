import {
  expandSemanticSeedGraphNodeIds,
  findSemanticSeedGraphNodeById,
  type SemanticSeedNode,
  type SemanticSeedNodeCategory,
} from "../../data/semanticSeedRegistry";
import {
  containsNegativeBehaviorConstraint,
} from "../../data/semanticExpansionQc";

export interface SemanticSeedResolutionOptions {
  includeParents?: boolean;
  includeChildren?: boolean;
  includeRelated?: boolean;
  includeOpposite?: boolean;
  categories?: readonly SemanticSeedNodeCategory[];
  maxNodes?: number;
}

export interface SemanticSeedPromptOptions extends SemanticSeedResolutionOptions {
  header?: string;
  includeAgencyReminder?: boolean;
}

const PSYCHOLOGY_CATEGORIES = new Set<SemanticSeedNodeCategory>([
  "traits",
  "wounds",
  "fears",
  "desires",
  "motivations",
  "emotions",
  "moods",
  "responses",
  "humor",
  "speech_patterns",
  "attachment_styles",
  "conflict_styles",
  "repair_styles",
  "love_languages",
  "archetypes",
  "intelligence",
  "goals_short",
  "goals_long",
]);

const RELATIONSHIP_CATEGORIES = new Set<SemanticSeedNodeCategory>([
  "relationship_dynamics",
  "romance_tropes",
  "relationship_gates",
  "routes",
]);

export function resolveSemanticSeedIds(
  ids: readonly string[] = [],
  options: SemanticSeedResolutionOptions = {},
): readonly SemanticSeedNode[] {
  const expandedIds = expandSemanticSeedGraphNodeIds(
    ids.map(normalizeSemanticSeedId),
    options,
  );
  const categories = new Set(options.categories);
  const nodes: SemanticSeedNode[] = [];
  const seen = new Set<string>();

  for (const id of expandedIds) {
    const node = findSemanticSeedGraphNodeById(id);
    if (!node || seen.has(node.id)) {
      continue;
    }
    if (categories.size > 0 && !categories.has(node.category)) {
      continue;
    }

    seen.add(node.id);
    nodes.push(node);
    if (options.maxNodes !== undefined && nodes.length >= options.maxNodes) {
      break;
    }
  }

  return nodes;
}

export function compileSemanticSeedPromptAdditions(
  ids: readonly string[] = [],
  options: SemanticSeedPromptOptions = {},
): string {
  const nodes = resolveSemanticSeedIds(ids, options);
  if (nodes.length === 0) {
    return "";
  }

  const header = options.header ?? "Semantic seed guidance";
  const lines = nodes.map(compileSemanticSeedPromptLine);
  const agencyReminder =
    options.includeAgencyReminder === false
      ? ""
      : "Use these as soft internal guidance; preserve player agency, consent, and character dimensionality.";

  return [header, ...lines, agencyReminder].filter(Boolean).join("\n");
}

export function compileSemanticSeedPromptAdditionsByLane(
  ids: readonly string[] = [],
): {
  psychologyAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
} {
  return {
    psychologyAddition: compileSemanticSeedPromptAdditions(ids, {
      categories: Array.from(PSYCHOLOGY_CATEGORIES),
      header: "Semantic psychology guidance",
    }),
    relationshipAddition: compileSemanticSeedPromptAdditions(ids, {
      categories: Array.from(RELATIONSHIP_CATEGORIES),
      header: "Semantic relationship guidance",
    }),
    systemPromptAddition: compileSemanticSeedPromptAdditions(ids, {
      header: "Internal semantic routing guidance",
    }),
  };
}

export function compileSemanticSeedVisibleTags(
  ids: readonly string[] = [],
): readonly string[] {
  return resolveSemanticSeedIds(ids).map((node) => node.label);
}

export function compileSemanticSeedCreatorNote(
  ids: readonly string[] = [],
): string {
  const labels = compileSemanticSeedVisibleTags(ids);
  return labels.length > 0 ? `Semantic tags: ${labels.join(", ")}.` : "";
}

function compileSemanticSeedPromptLine(node: SemanticSeedNode): string {
  const description = firstNonEmpty([
    node.description,
    node.internalMeaning,
    node.emotionalMeaning,
    node.guidance,
    node.visual,
    node.impression,
  ]);
  const hasNegativeConstraint = nodeHasNegativeBehaviorConstraint(node);
  const actionRoute = compileSemanticSeedActionRoute(node);
  const behaviorPrefix = hasNegativeConstraint
    ? "Do instead"
    : "Show through";
  const triggers = takeJoined(node.commonTriggers ?? node.triggers, 2);
  const growth = takeJoined(node.growthPath, 1);
  const parts = [
    description,
    actionRoute ? `${behaviorPrefix}: ${actionRoute}.` : "",
    triggers ? `Watch for: ${triggers}.` : "",
    growth ? `Growth: ${growth}.` : "",
  ].filter(Boolean);

  return `- ${node.label} (${formatCategory(node.category)}): ${parts.join(" ")}`;
}

function normalizeSemanticSeedId(id: string): string {
  if (id.includes(":")) {
    return id.trim().toLowerCase();
  }

  return id.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function firstNonEmpty(values: readonly (string | undefined)[]): string {
  return values.find((value) => value?.trim())?.trim() ?? "";
}

function takeJoined(values: readonly string[] | undefined, count: number): string {
  return (values ?? []).slice(0, count).join("; ");
}

function compileSemanticSeedActionRoute(node: SemanticSeedNode): string {
  return firstNonEmpty([
    takeJoined(node.behaviors, 2),
    takeJoined(node.bodyLanguage, 2),
    takeJoined(node.dialogueExamples, 1),
    takeJoined(node.relatedConcepts, 2),
  ]);
}

function nodeHasNegativeBehaviorConstraint(node: SemanticSeedNode): boolean {
  return [
    node.description,
    node.internalMeaning,
    node.emotionalMeaning,
    node.guidance,
    ...(node.dialogueExamples ?? []),
  ].some((value) => containsNegativeBehaviorConstraint(value ?? ""));
}

function formatCategory(category: SemanticSeedNodeCategory): string {
  return category.replace(/_/g, " ");
}
