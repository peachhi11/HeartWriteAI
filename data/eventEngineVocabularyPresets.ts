import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type EventEngineCategory =
  | "interpersonal"
  | "environmental"
  | "internal"
  | "relationship";

export type EventEngineTier =
  | "micro_event"
  | "meso_event"
  | "major_event";

export type EventEngineFatigueLevel =
  | "none"
  | "loop_detected"
  | "state_plateau"
  | "predictable_trajectory"
  | "too_stable"
  | "high_tension_loop"
  | "strong_moment_active";

export type EventEngineStateSignal =
  | "trust_rising"
  | "low_conflict"
  | "high_tension"
  | "low_trust"
  | "high_attraction"
  | "power_imbalance"
  | "emotional_plateau"
  | "moral_pressure";

export interface EventEngineDefinition {
  seed: string;
  label: string;
  category: EventEngineCategory;
  tier: EventEngineTier;
  trigger: string;
  interpretation: string;
  stateImpact: readonly string[];
  behavioralOutcome: string;
  alignsWith: readonly string[];
  avoidWhen: readonly string[];
  chainInto: readonly string[];
}

export interface EventEngineCategoryDefinition {
  seed: EventEngineCategory;
  label: string;
  description: string;
  eventExamples: readonly string[];
}

export interface EventEngineTierDefinition {
  seed: EventEngineTier;
  label: string;
  description: string;
  eventExamples: readonly string[];
  tierRule: string;
}

export interface EventEngineSelectionInput {
  currentStates: readonly EventEngineStateSignal[];
  recentInteractionPattern?: string;
  narrativeFatigueLevel?: EventEngineFatigueLevel;
  recentEventTypes?: readonly EventEngineCategory[];
  maxTier?: EventEngineTier;
}

export interface EventEngineSelectionResult {
  recommendedEvents: readonly EventEngineDefinition[];
  selectedCategory: EventEngineCategory;
  selectedTier: EventEngineTier;
  guidance: string;
  compactPrompt: string;
}

export const eventEngineSemanticChain = [
  "Context",
  "Current State",
  "Recent Interaction Pattern",
  "Narrative Fatigue",
  "Event Pressure",
  "Character Interpretation",
  "State Impact",
  "Behavioral Outcome",
] as const;

export const eventEnginePrinciples = [
  "Events are injected pressures, not random incidents.",
  "Events should be context-aware, state-aware, and character-aware.",
  "Events reveal hidden traits, force state changes, prevent repetition, and create momentum.",
  "Do not jump escalation tiers too quickly unless the current phase or premise justifies it.",
  "Avoid injecting when a strong moment is already unfolding or natural progression is happening.",
  "The same event should have different effects depending on fears, desires, values, and attachment style.",
  "Track recent event types and vary category or scale to avoid repeating the same beat.",
] as const;

export const eventEngineCategories = [
  {
    seed: "interpersonal",
    label: "Interpersonal Events",
    description:
      "Events that pressure the direct exchange between characters through conflict, vulnerability, misunderstanding, or power shifts.",
    eventExamples: [
      "conflict",
      "vulnerability moment",
      "misunderstanding",
      "power shift",
    ],
  },
  {
    seed: "environmental",
    label: "Environmental Events",
    description:
      "Events that add pressure through place, danger, scarcity, interruption, or time.",
    eventExamples: [
      "new location",
      "external threat",
      "resource limitation",
      "time pressure",
    ],
  },
  {
    seed: "internal",
    label: "Internal Events",
    description:
      "Events that pressure the character from inside through memory, emotion, morals, or identity.",
    eventExamples: [
      "emotional spike",
      "memory trigger",
      "moral dilemma",
      "identity conflict",
    ],
  },
  {
    seed: "relationship",
    label: "Relationship Events",
    description:
      "Events that pressure the bond through third parties, jealousy, loyalty, betrayal, or replacement fears.",
    eventExamples: [
      "third-party interference",
      "jealousy trigger",
      "loyalty test",
      "betrayal opportunity",
    ],
  },
] as const satisfies readonly EventEngineCategoryDefinition[];

export const eventEngineTiers = [
  {
    seed: "micro_event",
    label: "Tier 1 - Micro Event",
    description:
      "A subtle pressure that shifts tone, attention, or interpretation without changing the whole route.",
    eventExamples: [
      "tone change",
      "slight misunderstanding",
      "small reveal",
    ],
    tierRule:
      "Use when the scene needs motion without escalation shock.",
  },
  {
    seed: "meso_event",
    label: "Tier 2 - Meso Event",
    description:
      "A noticeable pressure that changes the emotional temperature or creates a meaningful choice.",
    eventExamples: [
      "argument",
      "emotional reveal",
      "external complication",
    ],
    tierRule:
      "Use when a loop or plateau needs a clear but still recoverable disruption.",
  },
  {
    seed: "major_event",
    label: "Tier 3 - Major Event",
    description:
      "A trajectory-shifting pressure that forces confession, crisis, rupture, or separation.",
    eventExamples: [
      "betrayal",
      "confession",
      "crisis",
      "forced separation",
    ],
    tierRule:
      "Do not jump escalation tiers; use only when the arc phase, state pressure, or premise has earned irreversible movement.",
  },
] as const satisfies readonly EventEngineTierDefinition[];

export const eventEngineDefinitions = [
  {
    seed: "slight_misunderstanding_event",
    label: "Slight Misunderstanding Event",
    category: "interpersonal",
    tier: "micro_event",
    trigger:
      "A line, gesture, or delayed answer is interpreted differently than intended.",
    interpretation:
      "The character fills ambiguity with their current insecurity or expectation.",
    stateImpact: [
      "trust shifts slightly",
      "attention sharpens",
      "defensiveness may rise",
    ],
    behavioralOutcome:
      "The character asks indirectly, tests the meaning, or responds with guarded tension.",
    alignsWith: [
      "fear_of_rejection",
      "fear_of_replacement",
      "low_trust",
    ],
    avoidWhen: [
      "a larger conflict is already active",
      "the scene needs clarity rather than ambiguity",
    ],
    chainInto: [
      "argument_event",
      "vulnerability_window_event",
    ],
  },
  {
    seed: "vulnerability_window_event",
    label: "Vulnerability Window Event",
    category: "interpersonal",
    tier: "meso_event",
    trigger:
      "A moment opens where honesty would cost less than continuing the performance.",
    interpretation:
      "The character senses a narrow chance to reveal something without losing all control.",
    stateImpact: [
      "trust may increase",
      "defenses may drop",
      "intimacy pressure rises",
    ],
    behavioralOutcome:
      "The character admits a partial truth, hesitates, or offers care more plainly than usual.",
    alignsWith: [
      "desire_to_be_seen",
      "need_for_reassurance",
      "safe_haven_dynamic",
    ],
    avoidWhen: [
      "the character has no plausible reason to soften yet",
      "the arc is still in first-contact setup",
    ],
    chainInto: [
      "emotional_reveal_event",
      "repair_attempt_event",
    ],
  },
  {
    seed: "external_interruption_event",
    label: "External Interruption Event",
    category: "environmental",
    tier: "micro_event",
    trigger:
      "A person, signal, deadline, noise, or location shift interrupts the current rhythm.",
    interpretation:
      "The character must decide whether to preserve the moment, hide it, or use the interruption as escape.",
    stateImpact: [
      "momentum redirects",
      "avoidance may become possible",
      "unspoken tension may intensify",
    ],
    behavioralOutcome:
      "The character changes posture, redirects focus, or chooses whether to protect the private beat.",
    alignsWith: [
      "avoidance_response",
      "unspoken_attraction",
      "public_private_tension",
    ],
    avoidWhen: [
      "the scene is already fragmented",
      "a decisive answer is overdue",
    ],
    chainInto: [
      "forced_cooperation_event",
      "time_pressure_event",
    ],
  },
  {
    seed: "resource_limitation_event",
    label: "Resource Limitation Event",
    category: "environmental",
    tier: "meso_event",
    trigger:
      "A necessary resource becomes limited: time, money, shelter, transport, information, energy, or safety.",
    interpretation:
      "The character's priorities become visible through what they protect first.",
    stateImpact: [
      "stress increases",
      "protective behavior may activate",
      "power dynamics may shift",
    ],
    behavioralOutcome:
      "The character triages, sacrifices comfort, negotiates, or takes practical control.",
    alignsWith: [
      "protective_response",
      "acts_of_service",
      "survival_pressure",
    ],
    avoidWhen: [
      "the route needs emotional processing rather than logistics",
      "scarcity has already been used recently",
    ],
    chainInto: [
      "forced_cooperation_event",
      "moral_dilemma_event",
    ],
  },
  {
    seed: "time_pressure_event",
    label: "Time Pressure Event",
    category: "environmental",
    tier: "meso_event",
    trigger:
      "A deadline, departure, countdown, closing window, or imminent consequence compresses choices.",
    interpretation:
      "The character loses the luxury of avoidance and must act before they feel ready.",
    stateImpact: [
      "hesitation decreases",
      "conflict potential rises",
      "confession pressure may increase",
    ],
    behavioralOutcome:
      "The character becomes more direct, cuts through small talk, or makes a rushed but revealing choice.",
    alignsWith: [
      "confession_or_escalation",
      "fear_of_loss",
      "choice_pressure",
    ],
    avoidWhen: [
      "slow burn needs more development first",
      "too many urgent events are already active",
    ],
    chainInto: [
      "confession_pressure_event",
      "forced_separation_event",
    ],
  },
  {
    seed: "memory_trigger_event",
    label: "Memory Trigger Event",
    category: "internal",
    tier: "micro_event",
    trigger:
      "A scent, phrase, place, song, gesture, or weather pattern touches an old memory.",
    interpretation:
      "The character reacts to the present through the emotional meaning of the past.",
    stateImpact: [
      "old wound may activate",
      "somatic response may surface",
      "tone may shift suddenly",
    ],
    behavioralOutcome:
      "The character pauses, withdraws, overcorrects, or reveals a small piece of history.",
    alignsWith: [
      "origin_wound",
      "sensory_trigger",
      "body_as_history",
    ],
    avoidWhen: [
      "backstory has already dominated the scene",
      "the current beat needs external action",
    ],
    chainInto: [
      "identity_conflict_event",
      "vulnerability_window_event",
    ],
  },
  {
    seed: "moral_dilemma_event",
    label: "Moral Dilemma Event",
    category: "internal",
    tier: "meso_event",
    trigger:
      "The character must choose between values, safety, loyalty, desire, duty, or self-protection.",
    interpretation:
      "The conflict exposes what the character values when comfort and image are no longer available.",
    stateImpact: [
      "moral pressure increases",
      "self-image destabilizes",
      "trust may rise or break depending on the choice",
    ],
    behavioralOutcome:
      "The character justifies, hesitates, sacrifices, refuses, or chooses a cost they cannot fully hide.",
    alignsWith: [
      "moral_framework",
      "duty_vs_desire",
      "love_over_safety_choice",
    ],
    avoidWhen: [
      "the scene has not established the competing values",
      "a simpler interpersonal event would be more readable",
    ],
    chainInto: [
      "loyalty_test_event",
      "confession_pressure_event",
    ],
  },
  {
    seed: "identity_conflict_event",
    label: "Identity Conflict Event",
    category: "internal",
    tier: "meso_event",
    trigger:
      "The character's self-concept is challenged by what they want, fear, did, or failed to do.",
    interpretation:
      "They must reconcile who they claim to be with how they are behaving now.",
    stateImpact: [
      "shame may activate",
      "defenses intensify",
      "growth pressure rises",
    ],
    behavioralOutcome:
      "The character denies, rationalizes, confesses, or makes a visible correction.",
    alignsWith: [
      "internalized_lie",
      "growth_arc",
      "self_protection",
    ],
    avoidWhen: [
      "identity pressure has not been seeded",
      "the current arc needs external stakes first",
    ],
    chainInto: [
      "emotional_reveal_event",
      "repair_attempt_event",
    ],
  },
  {
    seed: "third_party_flirtation_event",
    label: "Third-Party Flirtation Event",
    category: "relationship",
    tier: "micro_event",
    trigger:
      "A third party gives {{user}} attention that could be read as romantic, admiring, or possessive.",
    interpretation:
      "The character may read the moment as harmless, threatening, or proof they can be replaced: they might replace me.",
    stateImpact: [
      "replacement fear may rise",
      "attraction may intensify",
      "power perception may drop",
    ],
    behavioralOutcome:
      "The character becomes sharper, more attentive, quieter, or suddenly more visibly present.",
    alignsWith: [
      "fear_of_replacement",
      "jealousy_trigger",
      "desire_to_be_chosen",
    ],
    avoidWhen: [
      "jealousy was used in the last two events",
      "the route needs trust rather than rivalry pressure",
    ],
    chainInto: [
      "misunderstanding_event",
      "loyalty_test_event",
    ],
  },
  {
    seed: "loyalty_test_event",
    label: "Loyalty Test Event",
    category: "relationship",
    tier: "meso_event",
    trigger:
      "The character or {{user}} must choose where their loyalty goes under social, moral, or practical pressure.",
    interpretation:
      "The choice becomes evidence of priority, values, and whether the bond can survive cost.",
    stateImpact: [
      "trust may spike or drop",
      "commitment pressure rises",
      "relationship identity becomes clearer",
    ],
    behavioralOutcome:
      "The character asks for proof, offers proof, takes a side, or refuses a false choice.",
    alignsWith: [
      "desire_to_be_chosen",
      "public_choice_gate",
      "love_over_loyalty",
    ],
    avoidWhen: [
      "the relationship has not earned a loyalty decision",
      "the current phase blocks major commitment pressure",
    ],
    chainInto: [
      "confession_pressure_event",
      "betrayal_opportunity_event",
    ],
  },
  {
    seed: "betrayal_opportunity_event",
    label: "Betrayal Opportunity Event",
    category: "relationship",
    tier: "major_event",
    trigger:
      "A secret, offer, fear, or external pressure gives someone a meaningful chance to betray the bond.",
    interpretation:
      "The character treats the choice as proof of whether trust was real or merely convenient.",
    stateImpact: [
      "trust may collapse",
      "attachment panic may activate",
      "route may shift into rupture or repair",
    ],
    behavioralOutcome:
      "The character confronts, withdraws, tests, confesses, retaliates, or chooses repair at a cost.",
    alignsWith: [
      "betrayal_wound",
      "trust_rebuild_romance",
      "rupture_type",
    ],
    avoidWhen: [
      "the arc has not built enough stakes",
      "a major event was just used",
    ],
    chainInto: [
      "confrontation_event",
      "repair_attempt_event",
      "forced_separation_event",
    ],
  },
  {
    seed: "forced_cooperation_event",
    label: "Forced Cooperation Event",
    category: "interpersonal",
    tier: "meso_event",
    trigger:
      "The characters must work together despite friction, mistrust, or unresolved attraction.",
    interpretation:
      "The character must separate immediate function from long-term trust.",
    stateImpact: [
      "functional trust may rise",
      "resentment may soften",
      "competence recognition may increase",
    ],
    behavioralOutcome:
      "The character cooperates practically while the emotional delivery remains guarded or charged.",
    alignsWith: [
      "tactical_alliance",
      "rivals_to_lovers",
      "protector_protected_dynamic",
    ],
    avoidWhen: [
      "cooperation has already been the last event pressure",
      "the scene needs vulnerability rather than logistics",
    ],
    chainInto: [
      "vulnerability_window_event",
      "loyalty_test_event",
    ],
  },
] as const satisfies readonly EventEngineDefinition[];

export const EVENT_ENGINE_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  ...eventEngineCategories.map((category) =>
    createVocabularySeedPreset({
      seed: `${category.seed}_event_category`,
      label: category.label,
      description: category.description,
      examples: category.eventExamples,
      tags: [
        "event_engine",
        "event_category",
        category.seed,
      ],
      relatedSeeds: category.eventExamples,
      oppositeSeeds: [],
      romanceHooks: category.eventExamples,
      scenarioHooks: category.eventExamples,
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: category.seed === "relationship" ? 9 : 7,
        conflictPotential: category.seed === "environmental" ? 6 : 8,
      },
    }),
  ),
  ...eventEngineTiers.map((tier) =>
    createVocabularySeedPreset({
      seed: tier.seed,
      label: tier.label,
      description: tier.description,
      examples: [
        ...tier.eventExamples,
        tier.tierRule,
      ],
      tags: [
        "event_engine",
        "escalation_tier",
        tier.seed,
      ],
      relatedSeeds: tier.eventExamples,
      oppositeSeeds: [],
      romanceHooks: tier.eventExamples,
      scenarioHooks: [tier.tierRule],
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: tier.seed === "major_event" ? 8 : 7,
        conflictPotential: tier.seed === "major_event" ? 10 : tier.seed === "meso_event" ? 8 : 5,
      },
    }),
  ),
  ...eventEngineDefinitions.map((event) =>
    createVocabularySeedPreset({
      seed: event.seed,
      label: event.label,
      description: event.trigger,
      examples: [
        `Interpretation: ${event.interpretation}`,
        `State impact: ${event.stateImpact.join(", ")}.`,
        `Behavioral outcome: ${event.behavioralOutcome}`,
      ],
      tags: [
        "event_engine",
        event.category,
        event.tier,
      ],
      relatedSeeds: [
        ...event.alignsWith,
        ...event.chainInto,
      ],
      oppositeSeeds: event.avoidWhen,
      romanceHooks: event.alignsWith,
      scenarioHooks: [
        event.trigger,
        ...event.stateImpact,
      ],
      dialoguePatterns: [],
      metadata: {
        rarity: event.tier === "major_event" ? "rare" : event.tier === "meso_event" ? "uncommon" : "common",
        romanceValue: event.category === "relationship" ? 9 : 7,
        conflictPotential: event.tier === "major_event" ? 10 : event.tier === "meso_event" ? 8 : 5,
      },
    }),
  ),
] as const satisfies readonly VocabularySeedPreset[]);

export function selectEventPressure(
  input: EventEngineSelectionInput,
): EventEngineSelectionResult {
  const selectedTier = selectTier(input);
  const selectedCategory = selectCategory(input);
  const recentCategories = new Set(input.recentEventTypes ?? []);
  const candidates = eventEngineDefinitions.filter((event) => {
    if (event.tier !== selectedTier) {
      return false;
    }
    if (event.category !== selectedCategory) {
      return false;
    }
    return !recentCategories.has(event.category) || input.narrativeFatigueLevel === "too_stable";
  });
  const fallbackCandidates = eventEngineDefinitions.filter((event) => event.tier === selectedTier);
  const recommendedEvents = candidates.length > 0 ? candidates : fallbackCandidates.slice(0, 3);

  return {
    recommendedEvents,
    selectedCategory,
    selectedTier,
    guidance: compileEventEngineGuidance(input, selectedCategory, selectedTier),
    compactPrompt: [
      `Inject ${selectedTier} pressure from ${selectedCategory} events.`,
      compileEventEngineGuidance(input, selectedCategory, selectedTier),
      "Event structure: trigger -> interpretation -> state impact -> behavioral outcome.",
    ].join(" "),
  };
}

function selectTier(input: EventEngineSelectionInput): EventEngineTier {
  if (input.maxTier === "micro_event") {
    return "micro_event";
  }
  if (input.narrativeFatigueLevel === "high_tension_loop") {
    return input.maxTier === "major_event" ? "meso_event" : "meso_event";
  }
  if (
    input.currentStates.includes("emotional_plateau") ||
    input.narrativeFatigueLevel === "state_plateau" ||
    input.narrativeFatigueLevel === "loop_detected"
  ) {
    return "meso_event";
  }
  if (
    input.currentStates.includes("high_tension") &&
    input.currentStates.includes("moral_pressure") &&
    input.maxTier === "major_event"
  ) {
    return "major_event";
  }
  return "micro_event";
}

function selectCategory(input: EventEngineSelectionInput): EventEngineCategory {
  const recent = input.recentEventTypes ?? [];
  const avoidRecent = (candidate: EventEngineCategory) =>
    recent.slice(-2).every((recentType) => recentType !== candidate);

  if (
    input.currentStates.includes("trust_rising") &&
    input.currentStates.includes("low_conflict") &&
    avoidRecent("interpersonal")
  ) {
    return "interpersonal";
  }
  if (
    input.narrativeFatigueLevel === "high_tension_loop" &&
    avoidRecent("interpersonal")
  ) {
    return "interpersonal";
  }
  if (
    input.currentStates.includes("moral_pressure") &&
    avoidRecent("internal")
  ) {
    return "internal";
  }
  if (
    (input.currentStates.includes("high_attraction") ||
      input.currentStates.includes("low_trust")) &&
    avoidRecent("relationship")
  ) {
    return "relationship";
  }
  if (avoidRecent("environmental")) {
    return "environmental";
  }
  return "interpersonal";
}

function compileEventEngineGuidance(
  input: EventEngineSelectionInput,
  selectedCategory: EventEngineCategory,
  selectedTier: EventEngineTier,
): string {
  if (input.narrativeFatigueLevel === "strong_moment_active") {
    return "Avoid injecting a new event; let the current strong moment breathe unless it has begun to stall.";
  }
  if (input.narrativeFatigueLevel === "high_tension_loop") {
    return "Use vulnerability or forced cooperation to break the tension loop without adding another identical conflict.";
  }
  if (
    input.currentStates.includes("trust_rising") &&
    input.currentStates.includes("low_conflict")
  ) {
    return "Trust is rising with low conflict; inject a misunderstanding or external interruption to create movement without jumping tiers.";
  }
  if (input.narrativeFatigueLevel === "loop_detected") {
    return "Loop detected; vary event category or scale so the same emotional beat does not repeat.";
  }
  return `Use a ${selectedTier} ${selectedCategory} event that fits character fears, desires, and values.`;
}
