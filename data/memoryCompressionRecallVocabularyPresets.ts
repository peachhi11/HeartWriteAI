import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type MemoryCompressionTier =
  | "core_identity"
  | "relationship_memory"
  | "contextual_memory";

export type MemoryDecayRate = "none" | "slow" | "fast";

export type MemoryRecallTrigger =
  | "similar_situation"
  | "same_emotional_trigger"
  | "repeated_behavior_pattern"
  | "state_threshold_crossed";

export interface MemoryTierDefinition {
  seed: MemoryCompressionTier;
  label: string;
  persistence: "never_lost" | "compressed" | "disposable";
  decayRate: MemoryDecayRate;
  stores: readonly string[];
  behavior: string;
}

export interface MemoryCompressionRule {
  seed: string;
  label: string;
  input: string;
  compressedForm: string;
  principle: string;
}

export interface MemoryRecallRule {
  seed: MemoryRecallTrigger;
  label: string;
  condition: string;
  recallEffect: string;
}

export interface MemoryCompressionEventInput {
  event: string;
  meaning: string;
  stateImpact: string;
  tier?: MemoryCompressionTier;
}

export interface CompressedMemoryEvent {
  tier: MemoryCompressionTier;
  summary: string;
}

export interface MemoryRecallContextInput {
  coreIdentity?: readonly string[];
  relationshipMemories?: readonly string[];
  contextualMemories?: readonly string[];
  activeRecallTriggers?: readonly MemoryRecallTrigger[];
}

export const memoryCompressionRecallSemanticChain = [
  "Raw Interaction",
  "Event",
  "Meaning",
  "State Impact",
  "Compressed Memory",
  "Recall Trigger",
  "Reinforced Behavior",
] as const;

export const memoryCompressionRecallPrinciples = [
  "Do not remember everything; remember what changes behavior.",
  "Core identity is always reinforced and never compressed away.",
  "Relationship memory should store emotional events, promises, betrayals, confessions, and state shifts as summaries rather than raw logs.",
  "Contextual memory should decay quickly unless it becomes relevant to a later trigger.",
  "Compression should preserve event, meaning, and state impact while discarding exact wording.",
  "Recall should happen only when the current situation meaningfully resembles a stored pattern.",
  "Important memories should alter tone, expectation, and subtext rather than producing clumsy transcript callbacks.",
  "When new behavior contradicts memory, the system should update memory, reject the change, or enter suspicion mode based on trust and traits.",
] as const;

export const memoryTierDefinitions = [
  {
    seed: "core_identity",
    label: "Tier 1 - Core Identity",
    persistence: "never_lost",
    decayRate: "none",
    stores: [
      "character laws",
      "core traits",
      "speech profile",
      "motivational drivers",
    ],
    behavior:
      "Always reinforced and never compressed away from the active character model.",
  },
  {
    seed: "relationship_memory",
    label: "Tier 2 - Relationship Memory",
    persistence: "compressed",
    decayRate: "slow",
    stores: [
      "trust shifts",
      "key emotional events",
      "relationship turning points",
      "promises",
      "betrayals",
      "confessions",
    ],
    behavior:
      "Stored as compressed summaries that preserve meaning and state impact.",
  },
  {
    seed: "contextual_memory",
    label: "Tier 3 - Contextual Memory",
    persistence: "disposable",
    decayRate: "fast",
    stores: [
      "locations",
      "minor actions",
      "temporary states",
      "scene details",
    ],
    behavior:
      "Decays quickly and is recalled only if it becomes relevant again.",
  },
] as const satisfies readonly MemoryTierDefinition[];

export const memoryCompressionRules = [
  {
    seed: "event_meaning_state_impact",
    label: "Event Meaning State Impact",
    input: "Raw interaction text or turn history.",
    compressedForm: "Event -> meaning -> state impact.",
    principle: "Keep meaning and consequence while discarding redundant wording.",
  },
  {
    seed: "trust_conflict_compression",
    label: "Trust Conflict Compression",
    input: "Several turns arguing about trust.",
    compressedForm: "Conflict about trust -> unresolved tension -> trust decreases.",
    principle: "A repeated exchange should become one route-relevant memory.",
  },
  {
    seed: "vulnerability_compression",
    label: "Vulnerability Compression",
    input: "The user or character reveals something emotionally risky.",
    compressedForm: "Vulnerability shared -> intimacy risk accepted -> trust increases.",
    principle: "Store emotional significance rather than exact confession wording.",
  },
  {
    seed: "boundary_violation_compression",
    label: "Boundary Violation Compression",
    input: "A boundary is ignored, pressured, mocked, or crossed.",
    compressedForm: "Boundary violation -> safety concern -> guardedness increases.",
    principle: "Boundary memories should survive because they change future consent and trust.",
  },
] as const satisfies readonly MemoryCompressionRule[];

export const keyMemoryTypesToPreserve = [
  "first_impression",
  "emotional_spike_positive",
  "emotional_spike_negative",
  "boundary_violation",
  "vulnerability_moment",
  "power_shift",
  "repeated_behavior_pattern",
  "promise",
  "betrayal",
  "confession",
] as const;

export const disposableMemoryTypes = [
  "small_talk",
  "repetitive_filler",
  "non_impactful_action",
  "redundant_exchange",
] as const;

export const memoryRecallRules = [
  {
    seed: "similar_situation",
    label: "Similar Situation Recall",
    condition: "The current scene resembles a stored emotional or relationship event.",
    recallEffect:
      "Recall the compressed memory and let it color expectation, tone, and caution.",
  },
  {
    seed: "same_emotional_trigger",
    label: "Same Emotional Trigger Recall",
    condition: "The same fear, wound, desire, or destabilizer appears again.",
    recallEffect:
      "React with learned sensitivity rather than treating the moment as new.",
  },
  {
    seed: "repeated_behavior_pattern",
    label: "Repeated Behavior Pattern Recall",
    condition: "The user or character repeats a behavior that previously changed trust.",
    recallEffect:
      "Name or imply the pattern through subtext, expectation, or guardedness.",
  },
  {
    seed: "state_threshold_crossed",
    label: "State Threshold Crossed Recall",
    condition: "Trust, attraction, regulation, or power perception crosses a meaningful threshold.",
    recallEffect:
      "Pull relevant memories that justify the changed state and response style.",
  },
] as const satisfies readonly MemoryRecallRule[];

export const memoryIntegrationSurfaces = [
  {
    seed: "dynamic_state_memory_feed",
    label: "Dynamic State Memory Feed",
    description:
      "Past compressed memories alter how quickly trust, attraction, regulation, and power perception shift.",
  },
  {
    seed: "event_engine_memory_feed",
    label: "Event Engine Memory Feed",
    description:
      "Stored patterns help the event engine choose pressures that feel earned rather than random.",
  },
  {
    seed: "dialogue_memory_subtext",
    label: "Dialogue Memory Subtext",
    description:
      "Recall changes wording, hesitation, tone, and implication without dumping old transcripts.",
  },
  {
    seed: "arc_controller_memory_feed",
    label: "Arc Controller Memory Feed",
    description:
      "Phase transitions consider major memories such as confessions, ruptures, promises, and repairs.",
  },
] as const;

export const MEMORY_COMPRESSION_RECALL_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  ...memoryTierDefinitions.map((tier) =>
    createVocabularySeedPreset({
      seed: `${tier.seed}_memory_tier`,
      label: `${tier.label} Memory Tier`,
      description: tier.behavior,
      examples: [
        `Stores: ${tier.stores.join(", ")}`,
        `Persistence: ${tier.persistence}`,
        `Decay: ${tier.decayRate}`,
      ],
      tags: [
        "memory_compression",
        "recall_system",
        "memory_tier",
        tier.seed,
      ],
      relatedSeeds: [
        ...tier.stores,
        tier.persistence,
        tier.decayRate,
      ],
      oppositeSeeds: [
        "remember_everything",
        "raw_log_persistence",
      ],
      romanceHooks: [
        "relationship_continuity",
        "emotional_memory",
      ],
      scenarioHooks: [
        "long_context_stability",
        "memory_tier_routing",
      ],
      dialoguePatterns: [
        "Recall should change tone and expectation before it quotes old events.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: tier.seed === "relationship_memory" ? 9 : 7,
        conflictPotential: tier.seed === "relationship_memory" ? 8 : 5,
      },
    }),
  ),
  ...memoryCompressionRules.map((rule) =>
    createVocabularySeedPreset({
      seed: `${rule.seed}_memory_compression_rule`,
      label: `${rule.label} Memory Compression Rule`,
      description: rule.principle,
      examples: [
        `Input: ${rule.input}`,
        `Compressed form: ${rule.compressedForm}`,
      ],
      tags: [
        "memory_compression",
        "compression_rule",
        rule.seed,
      ],
      relatedSeeds: [
        rule.compressedForm,
      ],
      oppositeSeeds: [
        "raw_dialogue_log",
        "wording_over_meaning",
      ],
      romanceHooks: [
        "relationship_memory",
        "state_impact_memory",
      ],
      scenarioHooks: [
        "compress_turn_history",
        "store_route_relevant_memory",
      ],
      dialoguePatterns: [
        "Keep meaning, discard wording.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: rule.seed === "vulnerability_compression" ? 9 : 7,
        conflictPotential: rule.seed === "boundary_violation_compression" ? 9 : 7,
      },
    }),
  ),
  ...memoryRecallRules.map((rule) =>
    createVocabularySeedPreset({
      seed: `${rule.seed}_memory_recall_rule`,
      label: `${rule.label} Memory Recall Rule`,
      description: rule.recallEffect,
      examples: [
        `Condition: ${rule.condition}`,
      ],
      tags: [
        "memory_recall",
        "recall_trigger",
        rule.seed,
      ],
      relatedSeeds: [
        rule.condition,
      ],
      oppositeSeeds: [
        "always_active_memory",
        "context_dumping",
      ],
      romanceHooks: [
        "continuity_recall",
        "pattern_recognition",
      ],
      scenarioHooks: [
        "recall_trigger",
        "relationship_state_recall",
      ],
      dialoguePatterns: [
        "Reference memory indirectly through expectation, tone, and subtext.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: 8,
        conflictPotential:
          rule.seed === "same_emotional_trigger" ||
          rule.seed === "repeated_behavior_pattern"
            ? 8
            : 6,
      },
    }),
  ),
  ...memoryIntegrationSurfaces.map((surface) =>
    createVocabularySeedPreset({
      seed: `${surface.seed}_memory_integration`,
      label: `${surface.label} Memory Integration`,
      description: surface.description,
      examples: [
        "Memory feeds runtime behavior without exposing raw logs.",
      ],
      tags: [
        "memory_compression",
        "system_integration",
        surface.seed,
      ],
      relatedSeeds: [
        "dynamic_state_system",
        "event_engine",
        "dialogue_control",
        "narrative_arc_controller",
      ],
      oppositeSeeds: [
        "stateless_generation",
      ],
      romanceHooks: [
        "long_form_continuity",
        "earned_relationship_change",
      ],
      scenarioHooks: [
        "memory_system_integration",
        surface.seed,
      ],
      dialoguePatterns: [
        "Memory should make the character feel changed by what mattered.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: 8,
        conflictPotential: 7,
      },
    }),
  ),
] as const satisfies readonly VocabularySeedPreset[]);

export function compressMemoryEvent(
  input: MemoryCompressionEventInput,
): CompressedMemoryEvent {
  const tier = input.tier ?? "relationship_memory";

  return {
    tier,
    summary: `${input.event} -> ${input.meaning} -> ${input.stateImpact}`,
  };
}

export function compileMemoryRecallPrompt(input: MemoryRecallContextInput): string {
  const lines = [
    formatMemoryList("Core identity", input.coreIdentity),
    formatMemoryList("Relationship memory", input.relationshipMemories),
    formatMemoryList("Contextual memory", input.contextualMemories),
    formatMemoryList("Active recall triggers", input.activeRecallTriggers),
  ].filter(Boolean);

  return lines.length > 0
    ? `Memory Recall Context: ${lines.join(" ")}`
    : "Memory Recall Context: no active memory context supplied.";
}

function formatMemoryList(label: string, values: readonly string[] | undefined): string {
  if (!values || values.length === 0) return "";

  return `${label}: ${values.join(", ")}.`;
}
