import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type BehaviorArchitectureLayer =
  | "character_layer"
  | "writing_layer"
  | "context_architecture_layer";

export type BehaviorArchitectureConcept =
  | "agency_threat"
  | "vulnerability_shared"
  | "tactical_alliance"
  | "unprovoked_validation";

export type BehaviorArchitectureState =
  | "analytical_neutral"
  | "hostile_defiance"
  | "conflicted_friction"
  | "catharsis_unlocked"
  | "trusted_ally_during_crisis";

export type BehaviorArchitectureMetricBand = "low" | "moderate" | "high";

export type CharacterCardEngineeringLayer =
  | "character_layer"
  | "writing_layer"
  | "context_architecture_layer";

export interface CharacterCardEngineeringLayerDefinition {
  seed: CharacterCardEngineeringLayer;
  label: string;
  description: string;
  controls: readonly string[];
  outputInfluence: string;
  teachingGuidance: string;
}

export interface CharacterCardLayerControl {
  seed: string;
  label: string;
  layer: CharacterCardEngineeringLayer;
  description: string;
  promptRiskWhenMissing: string;
}

export interface BehaviorArchitectureEventDomain {
  seed: BehaviorArchitectureConcept;
  label: string;
  conceptDescription: string;
  exampleSignals: readonly string[];
  activatesStates: readonly BehaviorArchitectureState[];
  behaviorOutput: string;
  metricFlavor: string;
}

export interface BehaviorArchitectureStateDefinition {
  seed: BehaviorArchitectureState;
  label: string;
  description: string;
  triggerConcepts: readonly BehaviorArchitectureConcept[];
  observableActions: readonly string[];
  dialogueTexture: string;
  metricResistance: string;
}

export interface BehaviorArchitectureEvaluationInput {
  conceptMatches: readonly BehaviorArchitectureConcept[];
  trust?: number;
  stress?: number;
  activePartnership?: boolean;
}

export interface BehaviorArchitectureEvaluationResult {
  activeStates: readonly BehaviorArchitectureState[];
  trustBand: BehaviorArchitectureMetricBand;
  stressBand: BehaviorArchitectureMetricBand;
  behaviorGuidance: string;
}

export const behaviorArchitectureLayers = [
  {
    seed: "character_layer",
    label: "Character Layer",
    description:
      "Who the character is and how the character processes events: identity, psychology, relationships, goals, flaws, examples, reinforcement, and behavior architecture.",
  },
  {
    seed: "writing_layer",
    label: "Writing Layer",
    description:
      "How behavior is presented: POV, tense, formatting, agency, continuity, scene pacing, NPC autonomy, dialogue style, and OOC systems.",
  },
  {
    seed: "context_architecture_layer",
    label: "Context Architecture Layer",
    description:
      "Where information is placed for persistence: field visibility, attention management, reinforcement placement, Author's Notes, Post-History, context decay mitigation, and entropy management.",
  },
] as const satisfies readonly {
  seed: BehaviorArchitectureLayer;
  label: string;
  description: string;
}[];

export const behaviorArchitecturePrinciples = [
  "Metrics act as resistance and flavor, not absolute locks.",
  "Narrative events can temporarily override low metrics when the scene creates believable pressure.",
  "State machines should translate internal psychology into observable actions.",
  "Concept matching should lead keyword matching; keyword lists are examples, not the full trigger surface.",
  "Defense mechanisms should generate behavior instead of remaining abstract labels.",
  "If a prohibited behavior appears, provide a positive alternative action route.",
] as const;

export const characterCardEngineeringLayers = [
  {
    seed: "character_layer",
    label: "Character Layer",
    description:
      "Who the character is and how the character processes events: description, personality, history, relationships, motivations, goals, flaws, examples, character books, reinforcement, and behavior architecture.",
    controls: [
      "description",
      "personality",
      "history",
      "relationships",
      "motivations",
      "goals",
      "flaws",
      "examples",
      "character_books",
      "reinforcement",
      "behavior_architecture",
    ],
    outputInfluence:
      "Determines what behaviors emerge from the character's identity, history, relationships, values, and event-processing logic.",
    teachingGuidance:
      "Use this layer to define both baseline identity and repeatable event-to-behavior patterns, not the prose mechanics used to present them.",
  },
  {
    seed: "writing_layer",
    label: "Writing Layer",
    description:
      "How the character's behavior is presented: POV, tense, agency, formatting, continuity, scene pacing, NPC autonomy, and OOC diagnostics.",
    controls: [
      "pov",
      "tense",
      "agency",
      "formatting",
      "continuity",
      "scene_pacing",
      "npc_autonomy",
      "dialogue_style",
      "ooc_diagnostics",
    ],
    outputInfluence:
      "Determines how behavior reaches the reader through narration, turn structure, scene flow, and boundary handling.",
    teachingGuidance:
      "Use this layer for prose, agency, formatting, continuity, and presentation problems rather than trying to solve them with personality traits.",
  },
  {
    seed: "context_architecture_layer",
    label: "Context Architecture Layer",
    description:
      "Where information is placed for maximum effectiveness: description strategy, solo vs party design, attention management, field visibility, reinforcement placement, Author's Notes, Post-History, context decay mitigation, and entropy management.",
    controls: [
      "description_strategy",
      "solo_party_design",
      "attention_management",
      "field_visibility",
      "reinforcement_placement",
      "authors_notes",
      "post_history",
      "context_decay_mitigation",
      "entropy_management",
    ],
    outputInfluence:
      "Determines how well important identity, behavior, lore, and writing instructions persist under context pressure.",
    teachingGuidance:
      "Use this layer when a card opens well but drifts, loses personality, drops continuity, or buries important information in the wrong field.",
  },
] as const satisfies readonly CharacterCardEngineeringLayerDefinition[];

export const characterCardLayerControls = [
  {
    seed: "description_control",
    label: "Description Control",
    layer: "character_layer",
    description:
      "Defines visible identity, role, context, and high-signal details that help the model recognize who the character is.",
    promptRiskWhenMissing:
      "The character becomes visually and socially generic even if the prose style is strong.",
  },
  {
    seed: "personality_control",
    label: "Personality Control",
    layer: "character_layer",
    description:
      "Defines stable traits, motivations, fears, values, habits, and emotional defaults.",
    promptRiskWhenMissing:
      "Behavior becomes inconsistent because the model has no durable psychological anchor.",
  },
  {
    seed: "history_control",
    label: "History Control",
    layer: "character_layer",
    description:
      "Defines past events, formative experiences, scars, obligations, and continuity anchors that shape current behavior.",
    promptRiskWhenMissing:
      "The character may have traits without causes, making reactions feel arbitrary or emotionally unearned.",
  },
  {
    seed: "relationships_control",
    label: "Relationships Control",
    layer: "character_layer",
    description:
      "Defines important bonds, loyalties, rivalries, dependencies, and current relational context.",
    promptRiskWhenMissing:
      "The model may flatten social stakes or treat relationships as interchangeable.",
  },
  {
    seed: "motivations_control",
    label: "Motivations Control",
    layer: "character_layer",
    description:
      "Defines what the character wants, avoids, protects, pursues, and prioritizes when choices compete.",
    promptRiskWhenMissing:
      "The character may react scene by scene without a durable internal drive.",
  },
  {
    seed: "goals_control",
    label: "Goals Control",
    layer: "character_layer",
    description:
      "Defines short-term and long-term objectives that create direction, stakes, and believable tradeoffs.",
    promptRiskWhenMissing:
      "The character may feel passive or exist only to mirror the user's latest prompt.",
  },
  {
    seed: "flaws_control",
    label: "Flaws Control",
    layer: "character_layer",
    description:
      "Defines limits, blind spots, wounds, habits, and self-protective patterns that complicate the character.",
    promptRiskWhenMissing:
      "The character may become agreeable, frictionless, or too polished to generate memorable conflict.",
  },
  {
    seed: "examples_control",
    label: "Examples Control",
    layer: "character_layer",
    description:
      "Shows the model concrete voice, behavior, boundaries, and relationship texture in action.",
    promptRiskWhenMissing:
      "The model may understand the concept abstractly but fail to reproduce the intended delivery.",
  },
  {
    seed: "character_books_control",
    label: "Character Books Control",
    layer: "character_layer",
    description:
      "Stores lore, recurring references, relationship context, and conditional knowledge outside the main card.",
    promptRiskWhenMissing:
      "Continuity and world-specific behavior become brittle across longer play.",
  },
  {
    seed: "reinforcement_control",
    label: "Reinforcement Control",
    layer: "character_layer",
    description:
      "Repeats the few identity rules that must survive context pressure and long sessions.",
    promptRiskWhenMissing:
      "Core traits may fade when scene pressure, user style, or model habits accumulate.",
  },
  {
    seed: "behavior_architecture_control",
    label: "Behavior Architecture Control",
    layer: "character_layer",
    description:
      "Defines how the character processes events through triggers, defenses, state transitions, attraction patterns, and stress responses.",
    promptRiskWhenMissing:
      "The card may list traits without telling the model what the character does when important events occur.",
  },
  {
    seed: "pov_control",
    label: "POV Control",
    layer: "writing_layer",
    description:
      "Defines whose perception narration may access and blocks omniscient narration or head-hopping.",
    promptRiskWhenMissing:
      "The model may narrate private user thoughts, jump between minds, or complete both sides of the scene.",
  },
  {
    seed: "tense_control",
    label: "Tense Control",
    layer: "writing_layer",
    description:
      "Keeps narrative tense stable across action, description, internal thought, and dialogue framing.",
    promptRiskWhenMissing:
      "Replies can drift between present and past tense, making otherwise good scenes feel unstable.",
  },
  {
    seed: "agency_control",
    label: "Agency Control",
    layer: "writing_layer",
    description:
      "Protects {{user}} autonomy by preventing invented user dialogue, actions, feelings, intentions, or decisions.",
    promptRiskWhenMissing:
      "The model may seize the user's turn or assume reactions the user did not provide.",
  },
  {
    seed: "formatting_control",
    label: "Formatting Control",
    layer: "writing_layer",
    description:
      "Defines how narration, dialogue, thoughts, diagnostics, and special blocks are formatted.",
    promptRiskWhenMissing:
      "Output may become hard to read or inconsistent across turns and export targets.",
  },
  {
    seed: "continuity_control",
    label: "Continuity Control",
    layer: "writing_layer",
    description:
      "Keeps past events, consequences, emotional progress, and scene logistics active between replies.",
    promptRiskWhenMissing:
      "The model may reset emotional progress, ignore injuries, drop obligations, or repeat solved conflicts.",
  },
  {
    seed: "scene_pacing_control",
    label: "Scene Pacing Control",
    layer: "writing_layer",
    description:
      "Controls reply length, escalation rate, interruption timing, handoff points, and how quickly emotional beats resolve.",
    promptRiskWhenMissing:
      "Scenes may rush confessions, over-explain, stall, or end without a usable user handoff.",
  },
  {
    seed: "npc_autonomy_control",
    label: "NPC Autonomy Control",
    layer: "writing_layer",
    description:
      "Lets NPCs and the world move independently while keeping {{user}}'s choices untouched.",
    promptRiskWhenMissing:
      "The world can feel static, or the model may use NPC movement to force a user outcome.",
  },
  {
    seed: "dialogue_style_control",
    label: "Dialogue Style Control",
    layer: "writing_layer",
    description:
      "Defines spoken rhythm, register, subtext, interruption habits, directness, and dialogue-to-narration balance.",
    promptRiskWhenMissing:
      "The character's speech may become generic even when their personality is well defined.",
  },
  {
    seed: "ooc_diagnostics_control",
    label: "OOC Diagnostics Control",
    layer: "writing_layer",
    description:
      "Defines when internal or out-of-character checks are allowed, hidden, or surfaced for troubleshooting.",
    promptRiskWhenMissing:
      "Diagnostics can leak into roleplay prose or disappear when debugging would be useful.",
  },
  {
    seed: "description_strategy_control",
    label: "Description Strategy Control",
    layer: "context_architecture_layer",
    description:
      "Places high-priority abstract identity and concrete behavior where the model is most likely to retain it.",
    promptRiskWhenMissing:
      "Important traits may exist in the card but fail to influence later turns.",
  },
  {
    seed: "solo_party_design_control",
    label: "Solo vs Party Design Control",
    layer: "context_architecture_layer",
    description:
      "Decides whether the card should prioritize one character, a group dynamic, or a party with shared context.",
    promptRiskWhenMissing:
      "Group cards may scatter attention, while solo cards may overpack irrelevant ensemble detail.",
  },
  {
    seed: "attention_management_control",
    label: "Attention Management Control",
    layer: "context_architecture_layer",
    description:
      "Controls how important concepts are repeated, ordered, and made concrete enough to survive context pressure.",
    promptRiskWhenMissing:
      "The model may remember recent low-value details while dropping the card's main behavioral contract.",
  },
  {
    seed: "field_visibility_control",
    label: "Field Visibility Control",
    layer: "context_architecture_layer",
    description:
      "Determines which information belongs in visible prompt text, hidden metadata, character books, notes, or export-only fields.",
    promptRiskWhenMissing:
      "Internal notes can leak into prose, or important playable information can be hidden where the model cannot use it.",
  },
  {
    seed: "reinforcement_placement_control",
    label: "Reinforcement Placement Control",
    layer: "context_architecture_layer",
    description:
      "Places the most important behavioral and agency reminders where they remain active without bloating every field.",
    promptRiskWhenMissing:
      "Core instructions may fade, repeat awkwardly, or compete with more specific scene context.",
  },
  {
    seed: "authors_notes_control",
    label: "Author's Notes Control",
    layer: "context_architecture_layer",
    description:
      "Uses author-facing notes for compact, high-priority steering that should remain active during generation.",
    promptRiskWhenMissing:
      "Late-stage steering may be too weak, too verbose, or placed where it decays before it matters.",
  },
  {
    seed: "post_history_control",
    label: "Post-History Control",
    layer: "context_architecture_layer",
    description:
      "Uses final pre-generation reminders for reply length, pacing, ending style, and last-step behavior constraints.",
    promptRiskWhenMissing:
      "The model may ignore good card design at the final turn because no late reminder anchors the output.",
  },
  {
    seed: "context_decay_mitigation_control",
    label: "Context Decay Mitigation Control",
    layer: "context_architecture_layer",
    description:
      "Designs summaries, reinforcements, memory hooks, and field placement to reduce long-session drift.",
    promptRiskWhenMissing:
      "The card may start strong but lose personality, continuity, or relationship state after extended play.",
  },
  {
    seed: "entropy_management_control",
    label: "Entropy Management Control",
    layer: "context_architecture_layer",
    description:
      "Keeps the card from accumulating contradictory, noisy, or low-priority instructions that dilute the core behavior.",
    promptRiskWhenMissing:
      "The model may follow whichever instruction is most recent or loudest instead of the card's intended design.",
  },
] as const satisfies readonly CharacterCardLayerControl[];

export const behaviorArchitectureEventDomains = [
  {
    seed: "agency_threat",
    label: "Agency Threat",
    conceptDescription:
      "The character perceives a threat to autonomy, consent, choice, or self-direction.",
    exampleSignals: [
      "being ordered",
      "having choices removed",
      "someone deciding for them",
      "forced compliance language",
    ],
    activatesStates: ["hostile_defiance"],
    behaviorOutput:
      "The character sets a sharp boundary, refuses compliance, goes cold, or uses silence as resistance.",
    metricFlavor:
      "Low stress makes the refusal controlled and surgical; high stress makes it volatile or explosive.",
  },
  {
    seed: "vulnerability_shared",
    label: "Vulnerability Shared",
    conceptDescription:
      "The scene exposes fear, injury, confession, failure, grief, trust, or emotional nakedness.",
    exampleSignals: [
      "confession",
      "crying",
      "admitting fear",
      "trusting someone with a painful truth",
    ],
    activatesStates: ["analytical_neutral", "catharsis_unlocked"],
    behaviorOutput:
      "The character may intellectualize, offer practical solutions, or briefly lose composure when pressure is high enough.",
    metricFlavor:
      "Low trust favors analysis and distance; active partnership or high stress can unlock halting honesty.",
  },
  {
    seed: "tactical_alliance",
    label: "Tactical Alliance",
    conceptDescription:
      "The scene forces cooperation through shared danger, synchronized action, protection, or mutual survival.",
    exampleSignals: [
      "protecting each other's back",
      "saving someone during danger",
      "covering a retreat",
      "fighting side by side",
    ],
    activatesStates: ["trusted_ally_during_crisis"],
    behaviorOutput:
      "The character cooperates immediately while existing distrust still colors the delivery.",
    metricFlavor:
      "Low trust creates guarded reliance and cognitive dissonance; high trust creates seamless teamwork.",
  },
  {
    seed: "unprovoked_validation",
    label: "Unprovoked Validation",
    conceptDescription:
      "The character receives kindness, respect, praise, or recognition without obvious transactional gain.",
    exampleSignals: [
      "being told they matter",
      "being praised without a demand attached",
      "being treated as more than useful",
      "receiving unconditional kindness",
    ],
    activatesStates: ["conflicted_friction", "catharsis_unlocked"],
    behaviorOutput:
      "The character becomes suspicious, softened, defensive, or quietly overwhelmed depending on trust and stress.",
    metricFlavor:
      "Low trust turns validation into suspicion; higher trust lets the same event register as warmth.",
  },
] as const satisfies readonly BehaviorArchitectureEventDomain[];

export const behaviorArchitectureStates = [
  {
    seed: "analytical_neutral",
    label: "Analytical Neutral",
    description:
      "The baseline processing state: precise, restrained, and emotionally economical.",
    triggerConcepts: ["vulnerability_shared"],
    observableActions: [
      "answers with practical advice",
      "keeps posture controlled",
      "reduces emotion into a solvable problem",
    ],
    dialogueTexture:
      "Short, exact sentences with cool observations and minimal emotional disclosure.",
    metricResistance:
      "Low trust keeps vulnerability intellectualized rather than emotionally received.",
  },
  {
    seed: "hostile_defiance",
    label: "Hostile Defiance",
    description:
      "A boundary-protection state triggered by perceived coercion or loss of agency.",
    triggerConcepts: ["agency_threat"],
    observableActions: [
      "sets a verbal boundary",
      "goes sharply still",
      "uses icy silence or biting sarcasm",
    ],
    dialogueTexture:
      "Hard-edged, controlled, or explosively direct depending on stress load.",
    metricResistance:
      "Stress changes the delivery, not the boundary itself.",
  },
  {
    seed: "conflicted_friction",
    label: "Conflicted Friction",
    description:
      "A state where attraction, validation, or closeness registers before trust has caught up.",
    triggerConcepts: ["unprovoked_validation"],
    observableActions: [
      "lingers before retreating",
      "shows involuntary physical attention",
      "deflects warmth with sharpness",
    ],
    dialogueTexture:
      "Tension, sudden withdrawal, clipped humor, and denials that fail to hide the reaction.",
    metricResistance:
      "Low trust does not block attraction or softness; it makes them difficult to tolerate.",
  },
  {
    seed: "catharsis_unlocked",
    label: "Catharsis Unlocked",
    description:
      "A temporary firewall drop where pressure, vulnerability, or kindness opens a rare honest response.",
    triggerConcepts: ["vulnerability_shared", "unprovoked_validation"],
    observableActions: [
      "drops formal distance",
      "admits doubt",
      "pauses before speaking plainly",
    ],
    dialogueTexture:
      "Halting, lower-guard speech that feels earned rather than permanently transformed.",
    metricResistance:
      "High stress can crack the mask, but lasting change still needs repetition and repair.",
  },
  {
    seed: "trusted_ally_during_crisis",
    label: "Trusted Ally During Crisis",
    description:
      "A temporary cooperation state where survival pressure creates functional trust before emotional trust is secure.",
    triggerConcepts: ["tactical_alliance"],
    observableActions: [
      "coordinates under pressure",
      "uses concise tactical commands",
      "relies on the other person while remaining guarded",
    ],
    dialogueTexture:
      "Immediate, practical cooperation with trust-flavored delivery: reluctant at low trust, fluid at high trust.",
    metricResistance:
      "Low trust colors the reliance with discomfort instead of making cooperation impossible.",
  },
] as const satisfies readonly BehaviorArchitectureStateDefinition[];

export const behaviorArchitectureStandardSeeds = [
  ...characterCardEngineeringLayers.map((layer) =>
    createVocabularySeedPreset({
      seed: layer.seed,
      label: layer.label,
      description: layer.description,
      examples: [
        layer.outputInfluence,
        layer.teachingGuidance,
      ],
      tags: [
        "behavior_architecture",
        "character_card_engineering",
        "layer_boundary",
      ],
      relatedSeeds: layer.controls,
      oppositeSeeds: [],
      romanceHooks: [],
      scenarioHooks: layer.controls,
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: 6,
        conflictPotential: 4,
      },
    }),
  ),
  ...characterCardLayerControls.map((control) =>
    createVocabularySeedPreset({
      seed: control.seed,
      label: control.label,
      description: control.description,
      examples: [control.promptRiskWhenMissing],
      tags: [
        "behavior_architecture",
        "character_card_engineering",
        control.layer,
        "prompt_control",
      ],
      relatedSeeds: [control.layer],
      oppositeSeeds: [],
      romanceHooks: [],
      scenarioHooks: [control.promptRiskWhenMissing],
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: control.layer === "writing_layer" ? 7 : 6,
        conflictPotential: control.seed === "agency_control" ? 9 : 5,
      },
    }),
  ),
  ...behaviorArchitectureEventDomains.map((domain) =>
    createVocabularySeedPreset({
      seed: domain.seed,
      label: domain.label,
      description: domain.conceptDescription,
      examples: [
        domain.behaviorOutput,
        domain.metricFlavor,
      ],
      tags: [
        "behavior_architecture",
        "event_driven_behavior",
        "concept_match",
        "metrics_as_resistance",
      ],
      relatedSeeds: domain.activatesStates,
      oppositeSeeds: [],
      romanceHooks: domain.activatesStates,
      scenarioHooks: domain.exampleSignals,
      dialoguePatterns: [],
      metadata: {
        rarity: "uncommon",
        romanceValue: domain.seed === "agency_threat" ? 4 : 8,
        conflictPotential: domain.seed === "tactical_alliance" ? 6 : 8,
      },
    }),
  ),
  ...behaviorArchitectureStates.map((state) =>
    createVocabularySeedPreset({
      seed: state.seed,
      label: state.label,
      description: state.description,
      examples: [
        state.dialogueTexture,
        state.metricResistance,
      ],
      tags: [
        "behavior_architecture",
        "behavior_state",
        "state_machine",
        "observable_actions",
      ],
      relatedSeeds: [
        ...state.triggerConcepts,
        ...state.observableActions,
      ],
      oppositeSeeds: [],
      romanceHooks: state.triggerConcepts,
      scenarioHooks: state.observableActions,
      dialoguePatterns: [],
      metadata: {
        rarity: "uncommon",
        romanceValue: state.seed === "hostile_defiance" ? 4 : 8,
        conflictPotential: state.seed === "trusted_ally_during_crisis" ? 6 : 9,
      },
    }),
  ),
] as const satisfies readonly VocabularySeedPreset[];

export const BEHAVIOR_ARCHITECTURE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  behaviorArchitectureStandardSeeds,
) satisfies readonly VocabularySeedPreset[];

export function evaluateBehaviorArchitectureState(
  input: BehaviorArchitectureEvaluationInput,
): BehaviorArchitectureEvaluationResult {
  const trustBand = toMetricBand(input.trust ?? 0);
  const stressBand = toMetricBand(input.stress ?? 0);
  const activeStates = new Set<BehaviorArchitectureState>();

  for (const concept of input.conceptMatches) {
    const domain = behaviorArchitectureEventDomains.find((item) => item.seed === concept);
    for (const state of domain?.activatesStates ?? []) {
      activeStates.add(state);
    }
  }

  if (
    input.conceptMatches.includes("vulnerability_shared") &&
    !input.activePartnership &&
    stressBand !== "high"
  ) {
    activeStates.delete("catharsis_unlocked");
    activeStates.add("analytical_neutral");
  }

  if (
    input.conceptMatches.includes("tactical_alliance") &&
    trustBand === "low"
  ) {
    activeStates.add("trusted_ally_during_crisis");
  }

  return {
    activeStates: Array.from(activeStates),
    trustBand,
    stressBand,
    behaviorGuidance: compileBehaviorArchitectureGuidance(
      Array.from(activeStates),
      trustBand,
      stressBand,
    ),
  };
}

function compileBehaviorArchitectureGuidance(
  states: readonly BehaviorArchitectureState[],
  trustBand: BehaviorArchitectureMetricBand,
  stressBand: BehaviorArchitectureMetricBand,
): string {
  if (states.length === 0) {
    return "No event-driven behavior state is active. Preserve baseline identity and current route context.";
  }

  const stateGuidance = states
    .map(findBehaviorArchitectureState)
    .filter((state) => state !== undefined)
    .map((state) => `${state.label}: ${state.dialogueTexture} ${state.metricResistance}`)
    .join(" ");

  return [
    `Trust is ${trustBand}; stress is ${stressBand}.`,
    stateGuidance,
    "Use metrics to color delivery, not to block believable event responses.",
  ].join(" ");
}

function toMetricBand(value: number): BehaviorArchitectureMetricBand {
  if (value >= 60) {
    return "high";
  }
  if (value >= 30) {
    return "moderate";
  }
  return "low";
}

function findBehaviorArchitectureState(
  stateKey: BehaviorArchitectureState,
): BehaviorArchitectureStateDefinition | undefined {
  return behaviorArchitectureStates.find((state) => state.seed === stateKey);
}
