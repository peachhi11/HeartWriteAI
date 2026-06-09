import { z } from "zod";

import type {
  HeartWriteSeedIntensity,
  HeartWriteSeedPolarity,
} from "../../data/heartwriteSeedTypes";
import type { SemanticSeedNode } from "../../data/semanticSeedRegistry";
import { resolveSemanticSeedIds } from "./semanticSeedResolver";

const score01 = z.coerce.number().min(0).max(1);
const nonEmptyString = z.string().trim().min(1);

export const BRAIN_LAYERS = Object.freeze([
  "cognitive",
  "affective",
  "somatic",
  "behavioral",
] as const);

export const BrainLayerSchema = z.enum(BRAIN_LAYERS);
export type BrainLayer = z.infer<typeof BrainLayerSchema>;

export const BrainSpokeSchema = z.object({
  id: nonEmptyString,
  text: nonEmptyString,
  intensity: score01.default(0.5),
  polarity: z.enum(["positive", "negative", "mixed", "neutral"]).optional(),
  tags: z.array(nonEmptyString).default([]),
});
export type BrainSpoke = z.infer<typeof BrainSpokeSchema>;

export const BrainSpokeLayersSchema = z.object({
  cognitive: z.array(BrainSpokeSchema).default([]),
  affective: z.array(BrainSpokeSchema).default([]),
  somatic: z.array(BrainSpokeSchema).default([]),
  behavioral: z.array(BrainSpokeSchema).default([]),
});
export type BrainSpokeLayers = z.infer<typeof BrainSpokeLayersSchema>;
export type BrainSpokes = BrainSpokeLayers;

export const BrainLinkSchema = z.object({
  targetNodeId: nonEmptyString,
  weight: score01.default(0.3),
  layerBias: z
    .object({
      cognitive: score01.optional(),
      affective: score01.optional(),
      somatic: score01.optional(),
      behavioral: score01.optional(),
    })
    .optional(),
});
export type BrainLink = z.infer<typeof BrainLinkSchema>;

export const BrainActivationSchema = z.object({
  current: score01.default(0),
  baseline: score01.default(0),
  decayRate: score01.default(0.12),
  lastTurn: z.coerce.number().int().min(0).default(0),
});
export type BrainActivation = z.infer<typeof BrainActivationSchema>;

export const SemanticBrainNodeSchema = z.object({
  id: nonEmptyString,
  seedId: nonEmptyString,
  label: nonEmptyString,
  romanceDomain: z.array(nonEmptyString).optional(),
  layers: BrainSpokeLayersSchema,
  activation: BrainActivationSchema,
  links: z.array(BrainLinkSchema).default([]),
});
export type SemanticBrainNode = z.infer<typeof SemanticBrainNodeSchema>;

export const CharacterBrainTraitsSchema = z.object({
  attachmentStyle: nonEmptyString.optional(),
  loveLanguage: z.array(nonEmptyString).optional(),
  boundaries: z.array(nonEmptyString).optional(),
  voiceRules: z.array(nonEmptyString).optional(),
});
export type CharacterBrainTraits = z.infer<typeof CharacterBrainTraitsSchema>;

export const CharacterBrainSchema = z.object({
  id: nonEmptyString,
  characterId: nonEmptyString,
  version: z.coerce.number().int().min(1).default(1),
  traits: CharacterBrainTraitsSchema.default({}),
  nodes: z.array(SemanticBrainNodeSchema).default([]),
  runtime: z
    .object({
      turn: z.coerce.number().int().min(0).default(0),
      activeNodeIds: z.array(nonEmptyString).default([]),
    })
    .default({
      turn: 0,
      activeNodeIds: [],
    }),
});
export type CharacterBrain = z.infer<typeof CharacterBrainSchema>;

export interface SemanticBrainPromptContext {
  concept: string;
  cognitive: readonly string[];
  affective: readonly string[];
  somatic: readonly string[];
  behavioral: readonly string[];
}

export interface SemanticBrainInputResult {
  brain: CharacterBrain;
  matchedConcepts: readonly string[];
  matchedNodeIds: readonly string[];
}

export interface SemanticBrainPromptOptions {
  activationThreshold?: number;
  header?: string;
  includeAgencyReminder?: boolean;
  maxActiveNodes?: number;
  maxCuesPerLayer?: number;
}

export interface SemanticBrainProcessInputOptions {
  activationAmountPerMatch?: number;
  propagateLinks?: boolean;
}

export interface CompileSemanticBrainContextOptions
  extends SemanticBrainPromptOptions {
  name?: string;
  characterId?: string;
  brainId?: string;
  seedIds: readonly string[];
  inputText: string;
  currentActivations?: Record<string, number>;
  currentState?: Record<string, number>;
  includeParents?: boolean;
  includeRelated?: boolean;
  maxNodes?: number;
  traits?: Partial<CharacterBrainTraits>;
}

export interface CreateBrainFromSemanticSeedsOptions {
  brainId?: string;
  currentActivations?: Record<string, number>;
  currentState?: Record<string, number>;
  includeParents?: boolean;
  includeRelated?: boolean;
  maxNodes?: number;
  traits?: Partial<CharacterBrainTraits>;
}

const DEFAULT_ACTIVATION_THRESHOLD = 0.25;
const DEFAULT_MAX_ACTIVE_NODES = 8;
const DEFAULT_MAX_CUES_PER_LAYER = 2;
const DEFAULT_ACTIVATION_AMOUNT_PER_MATCH = 0.18;

export class SemanticBrainService {
  static processInput(
    text: string,
    brain: CharacterBrain,
    options: SemanticBrainProcessInputOptions = {},
  ): SemanticBrainInputResult {
    const nextBrain = cloneCharacterBrain(brain);
    const normalizedText = normalizeForMatching(text);
    const matchedNodeIds: string[] = [];
    const matchBoosts = new Map<string, number>();

    decayBrain(nextBrain);

    if (normalizedText.length > 0) {
      for (const node of nextBrain.nodes) {
        const matches = countNodeMatches(normalizedText, node);

        if (matches === 0) {
          continue;
        }

        const boost =
          matches *
          (options.activationAmountPerMatch ?? DEFAULT_ACTIVATION_AMOUNT_PER_MATCH);
        activateNode(node, boost);
        if (hasPositiveFiniteAmount(boost)) {
          node.activation.lastTurn = nextBrain.runtime.turn;
        }
        matchedNodeIds.push(node.id);
        matchBoosts.set(node.id, boost);
      }
    }

    if (options.propagateLinks !== false) {
      propagateLinkedActivation(nextBrain, matchBoosts);
    }

    refreshActiveNodeIds(nextBrain);

    return {
      brain: nextBrain,
      matchedConcepts: uniqueText(
        matchedNodeIds
          .map((id) => nextBrain.nodes.find((node) => node.id === id)?.label),
      ),
      matchedNodeIds: uniqueText(matchedNodeIds),
    };
  }

  static generatePromptContext(
    brain: CharacterBrain,
    options: SemanticBrainPromptOptions = {},
  ): string {
    const context = buildPromptContext(brain, options);

    if (context.length === 0) {
      return "";
    }

    const header = options.header ?? "Current character semantic state";
    const agencyReminder =
      options.includeAgencyReminder === false
        ? ""
        : "Use as soft internal state guidance only; let active cues shape subtext, pacing, body language, and dialogue choices without naming the system state. Preserve player agency, authored boundaries, and character dimensionality.";

    return [header, toPromptProse(context), agencyReminder]
      .filter(Boolean)
      .join("\n\n");
  }

  static createBrainFromSemanticSeeds(
    characterId: string,
    seedIds: readonly string[],
    options: CreateBrainFromSemanticSeedsOptions = {},
  ): CharacterBrain {
    return createBrainFromSemanticSeeds(characterId, seedIds, options);
  }
}

export function normalizeCharacterBrain(input: unknown): CharacterBrain {
  const brain = CharacterBrainSchema.parse(input);
  refreshActiveNodeIds(brain);
  return brain;
}

export function cloneCharacterBrain(brain: CharacterBrain): CharacterBrain {
  return normalizeCharacterBrain(JSON.parse(JSON.stringify(brain)) as unknown);
}

export function decayBrain(brain: CharacterBrain): CharacterBrain {
  const nextTurn = brain.runtime.turn + 1;

  for (const node of brain.nodes) {
    const { baseline, current, decayRate } = node.activation;
    node.activation.current = roundActivation(
      baseline + (current - baseline) * (1 - decayRate),
    );
  }

  brain.runtime.turn = nextTurn;
  refreshActiveNodeIds(brain);
  return brain;
}

export function activateNode(
  node: SemanticBrainNode,
  amount: number,
): SemanticBrainNode {
  if (!Number.isFinite(amount) || amount <= 0) {
    return node;
  }

  node.activation.current = roundActivation(
    Math.min(1, node.activation.current + amount),
  );
  return node;
}

export function buildPromptContext(
  brain: CharacterBrain,
  options: SemanticBrainPromptOptions = {},
): readonly SemanticBrainPromptContext[] {
  const activationThreshold = normalizeThreshold(
    options.activationThreshold ?? DEFAULT_ACTIVATION_THRESHOLD,
  );
  const maxActiveNodes = normalizeLimit(
    options.maxActiveNodes ?? DEFAULT_MAX_ACTIVE_NODES,
    DEFAULT_MAX_ACTIVE_NODES,
  );
  const maxCuesPerLayer = normalizeLimit(
    options.maxCuesPerLayer ?? DEFAULT_MAX_CUES_PER_LAYER,
    DEFAULT_MAX_CUES_PER_LAYER,
  );

  return brain.nodes
    .filter((node) => node.activation.current > activationThreshold)
    .slice()
    .sort((a, b) => b.activation.current - a.activation.current)
    .slice(0, maxActiveNodes)
    .map((node) => ({
      concept: toPromptSafeConcept(node.label),
      cognitive: pick(node.layers.cognitive, maxCuesPerLayer),
      affective: pick(node.layers.affective, maxCuesPerLayer),
      somatic: pick(node.layers.somatic, maxCuesPerLayer),
      behavioral: pick(node.layers.behavioral, maxCuesPerLayer),
    }));
}

export function pick(
  spokes: readonly BrainSpoke[],
  limit = DEFAULT_MAX_CUES_PER_LAYER,
): readonly string[] {
  const normalizedLimit = normalizeLimit(limit);

  return spokes
    .slice()
    .sort((a, b) => b.intensity - a.intensity)
    .map((spoke) => spoke.text)
    .filter(isPromptSafeCue)
    .slice(0, normalizedLimit);
}

export function toPromptProse(
  context: readonly SemanticBrainPromptContext[],
): string {
  return context
    .map(
      (concept) => `Concept: ${toPromptSafeConcept(concept.concept)}
Inner meaning: ${toPromptSafeList(concept.cognitive).join("; ")}
Emotional charge: ${toPromptSafeList(concept.affective).join("; ")}
Body response: ${toPromptSafeList(concept.somatic).join("; ")}
Visible behavior: ${toPromptSafeList(concept.behavioral).join("; ")}`,
    )
    .join("\n\n");
}

export function createBrainFromSemanticSeeds(
  characterId: string,
  seedIds: readonly string[],
  options: CreateBrainFromSemanticSeedsOptions = {},
): CharacterBrain {
  const normalizedCharacterId = characterId.trim() || "character";
  const currentActivations = {
    ...normalizeLegacyCurrentState(options.currentState),
    ...(options.currentActivations ?? {}),
  };
  const nodes = resolveSemanticSeedIds(seedIds, {
    includeParents: options.includeParents,
    includeRelated: options.includeRelated,
    maxNodes: options.maxNodes,
  }).map((node) =>
    semanticSeedNodeToBrainNode(node, {
      current: currentActivations[node.id] ?? currentActivations[node.label],
    }),
  );

  return normalizeCharacterBrain({
    id: options.brainId ?? `brain:${slugText(normalizedCharacterId)}`,
    characterId: normalizedCharacterId,
    version: 1,
    traits: options.traits ?? {},
    nodes,
    runtime: {
      turn: 0,
      activeNodeIds: [],
    },
  });
}

export function semanticSeedNodeToBrainNode(
  node: SemanticSeedNode,
  options: {
    current?: number;
    baseline?: number;
    decayRate?: number;
    id?: string;
  } = {},
): SemanticBrainNode {
  const baseline = clampActivation(options.baseline ?? inferNodeBaseline(node));
  const baseIntensity = inferSpokeIntensity(node.intensity);
  const polarity = normalizePolarity(node.polarity);
  const bodyLanguage = node.bodyLanguage ?? [];
  const somatic = bodyLanguage.filter(isSomaticCue);
  const behavioralBodyLanguage = bodyLanguage.filter((cue) => !isSomaticCue(cue));
  const tags = [
    node.category,
    ...node.tags,
    ...(node.romanceRelevant ? ["romance"] : []),
  ];

  return normalizeSemanticBrainNode({
    id: options.id ?? `semantic-node:${slugText(node.id)}`,
    seedId: node.id,
    label: node.label,
    romanceDomain: inferRomanceDomains(node),
    layers: {
      cognitive: createLayerSpokes("cognitive", node.id, [
        node.label,
        node.description,
        node.internalMeaning,
        node.guidance,
        node.visual,
        node.impression,
        ...node.aliases,
        ...(node.relatedConcepts ?? []),
      ], baseIntensity, polarity, tags),
      affective: createLayerSpokes("affective", node.id, [
        node.emotionalMeaning,
        ...(node.hiddenNeeds ?? []),
        ...(node.commonWounds ?? []),
        ...node.tags.filter(isAffectiveTag),
      ], baseIntensity, polarity, tags),
      somatic: createLayerSpokes("somatic", node.id, [
        ...somatic,
        ...node.tags.filter(isSomaticCue),
      ], Math.min(1, baseIntensity + 0.08), polarity, tags),
      behavioral: createLayerSpokes("behavioral", node.id, [
        ...(node.behaviors ?? []),
        ...behavioralBodyLanguage,
        ...(node.dialogueExamples ?? []),
      ], baseIntensity, polarity, tags),
    },
    activation: {
      current: clampActivation(options.current ?? baseline),
      baseline,
      decayRate: options.decayRate ?? inferNodeDecayRate(node),
      lastTurn: 0,
    },
    links: [],
  });
}

export function normalizeSemanticBrainNode(
  input: unknown,
): SemanticBrainNode {
  return SemanticBrainNodeSchema.parse(input);
}

export function compileSemanticBrainContextFromSeedIds(
  options: CompileSemanticBrainContextOptions,
): {
  brain: CharacterBrain;
  matchedConcepts: readonly string[];
  promptContext: string;
} {
  const characterId = options.characterId ?? options.name ?? "character";
  const startingBrain = createBrainFromSemanticSeeds(
    characterId,
    options.seedIds,
    {
      brainId: options.brainId,
      currentActivations: options.currentActivations,
      currentState: options.currentState,
      includeParents: options.includeParents,
      includeRelated: options.includeRelated,
      maxNodes: options.maxNodes,
      traits: options.traits,
    },
  );
  const result = SemanticBrainService.processInput(
    options.inputText,
    startingBrain,
  );

  return {
    brain: result.brain,
    matchedConcepts: result.matchedConcepts,
    promptContext: SemanticBrainService.generatePromptContext(
      result.brain,
      options,
    ),
  };
}

function refreshActiveNodeIds(
  brain: CharacterBrain,
  threshold = DEFAULT_ACTIVATION_THRESHOLD,
): void {
  brain.runtime.activeNodeIds = getActiveNodeIds(brain, threshold);
}

function getActiveNodeIds(
  brain: CharacterBrain,
  threshold = DEFAULT_ACTIVATION_THRESHOLD,
): string[] {
  return brain.nodes
    .filter((node) => node.activation.current > threshold)
    .slice()
    .sort((a, b) => b.activation.current - a.activation.current)
    .map((node) => node.id);
}

function countNodeMatches(text: string, node: SemanticBrainNode): number {
  return uniqueText([
    node.label,
    ...node.layers.cognitive.map((spoke) => spoke.text),
    ...node.layers.affective.map((spoke) => spoke.text),
    ...node.layers.somatic.map((spoke) => spoke.text),
    ...node.layers.behavioral.map((spoke) => spoke.text),
    ...(node.romanceDomain ?? []),
  ]).filter((keyword) => {
    const normalizedKeyword = normalizeForMatching(keyword);
    return normalizedKeyword.length > 2 &&
      doesNormalizedTextMatchKeyword(text, normalizedKeyword);
  }).length;
}

function propagateLinkedActivation(
  brain: CharacterBrain,
  matchBoosts: ReadonlyMap<string, number>,
): void {
  if (matchBoosts.size === 0) {
    return;
  }

  const nodesById = new Map(brain.nodes.map((node) => [node.id, node]));

  for (const [sourceNodeId, boost] of matchBoosts) {
    const sourceNode = nodesById.get(sourceNodeId);

    if (!sourceNode) {
      continue;
    }

    for (const link of sourceNode.links) {
      const targetNode = nodesById.get(link.targetNodeId);

      if (!targetNode) {
        continue;
      }

      const linkedAmount = boost * link.weight * averageLayerBias(link);
      activateNode(targetNode, linkedAmount);

      if (hasPositiveFiniteAmount(linkedAmount)) {
        targetNode.activation.lastTurn = brain.runtime.turn;
      }
    }
  }
}

function averageLayerBias(link: BrainLink): number {
  const values = Object.values(link.layerBias ?? {}).filter(
    (value): value is number => typeof value === "number",
  );

  if (values.length === 0) {
    return 1;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function createLayerSpokes(
  layer: BrainLayer,
  seedId: string,
  values: readonly (string | undefined)[],
  baseIntensity: number,
  polarity: HeartWriteSeedPolarity | undefined,
  tags: readonly string[],
): BrainSpoke[] {
  return uniqueText(values)
    .filter(isPromptSafeCue)
    .map((text, index) => ({
      id: `brain-spoke:${slugText(seedId)}:${layer}:${index + 1}`,
      text,
      intensity: roundActivation(Math.max(0.25, baseIntensity - index * 0.035)),
      polarity,
      tags: [...tags],
    }));
}

function normalizeLegacyCurrentState(
  currentState?: Record<string, number>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(currentState ?? {}).map(([key, value]) => [
      key,
      value > 1 ? clampActivation(value / 100) : clampActivation(value),
    ]),
  );
}

function inferNodeBaseline(node: SemanticSeedNode): number {
  if (node.category === "wounds" || node.category === "fears") {
    return node.romanceRelevant ? 0.14 : 0.1;
  }

  if (node.category === "desires" || node.category === "love_languages") {
    return 0.12;
  }

  return node.romanceRelevant ? 0.09 : 0.06;
}

function inferNodeDecayRate(node: SemanticSeedNode): number {
  if (node.category === "wounds" || node.category === "fears") {
    return 0.12;
  }

  if (node.category === "desires" || node.category === "love_languages") {
    return 0.16;
  }

  return 0.22;
}

function inferSpokeIntensity(intensity?: HeartWriteSeedIntensity): number {
  switch (intensity) {
    case "soft":
      return 0.45;
    case "intense":
      return 0.78;
    case "extreme":
      return 0.92;
    case "moderate":
    default:
      return 0.62;
  }
}

function normalizePolarity(
  polarity?: HeartWriteSeedPolarity,
): HeartWriteSeedPolarity | undefined {
  return polarity;
}

function inferRomanceDomains(node: SemanticSeedNode): string[] | undefined {
  const text = normalizeForMatching([
    node.category,
    node.label,
    node.description,
    node.internalMeaning,
    node.emotionalMeaning,
    ...node.tags,
    ...(node.relatedConcepts ?? []),
  ].filter(Boolean).join(" "));
  const domains: string[] = [];

  if (/intimacy|closeness|touch|affection|desire/.test(text)) {
    domains.push("intimacy");
  }
  if (/jealous|replacement|rival|chosen/.test(text)) {
    domains.push("jealousy");
  }
  if (/longing|yearn|want|desire/.test(text)) {
    domains.push("longing");
  }
  if (/trust|safety|secure|reassurance|consistency/.test(text)) {
    domains.push("trust");
  }
  if (/vulnerab|exposure|shame|fear|wound/.test(text)) {
    domains.push("vulnerability");
  }

  return domains.length > 0 ? uniqueText(domains) : undefined;
}

function isAffectiveTag(value: string): boolean {
  return /anger|grief|shame|fear|hope|love|trust|insecurity|jealous|vulnerab|lonely|comfort|devotion|desire/i.test(value);
}

function isSomaticCue(value: string): boolean {
  return /breath|chest|stomach|throat|skin|flush|heat|cold|chill|shake|shiver|pulse|heart|nausea|hands|still|tense|trembl/i.test(value);
}

function isPromptSafeCue(value: string): boolean {
  const trimmed = value.trim();

  return (
    trimmed.length > 0 &&
    !trimmed.includes(":") &&
    !trimmed.includes("__") &&
    !/standard_vocabulary/i.test(trimmed) &&
    !/^[a-z0-9]+(?:[_-][a-z0-9]+)+$/.test(trimmed)
  );
}

function toPromptSafeConcept(value: string): string {
  return isPromptSafeCue(value) ? value.trim() : "Active cue";
}

function toPromptSafeList(values: readonly string[]): string[] {
  return values.filter(isPromptSafeCue).map((value) => value.trim());
}

function normalizeForMatching(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function doesNormalizedTextMatchKeyword(
  text: string,
  normalizedKeyword: string,
): boolean {
  return text === normalizedKeyword ||
    text.startsWith(`${normalizedKeyword} `) ||
    text.endsWith(` ${normalizedKeyword}`) ||
    text.includes(` ${normalizedKeyword} `);
}

function clampActivation(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function hasPositiveFiniteAmount(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function roundActivation(value: number): number {
  return Math.round(clampActivation(value) * 1000) / 1000;
}

function normalizeThreshold(
  value: number,
  fallback = DEFAULT_ACTIVATION_THRESHOLD,
): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return clampActivation(value);
}

function normalizeLimit(
  value: number,
  fallback = DEFAULT_MAX_CUES_PER_LAYER,
): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}

function slugText(value: string): string {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "character";
}

function uniqueText(
  values: readonly (string | undefined)[],
): string[] {
  return Array.from(new Set(values.filter((value): value is string =>
    value !== undefined && value.trim().length > 0,
  )));
}
