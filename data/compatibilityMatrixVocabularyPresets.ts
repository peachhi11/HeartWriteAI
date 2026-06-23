import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type CompatibilityAlignment = "high" | "medium" | "low";

export type CompatibilityChemistryResult =
  | "immediate_chemistry"
  | "slow_burn"
  | "no_spark";

export type CompatibilityCollisionType =
  | "value_clash"
  | "emotional_mismatch"
  | "pacing_mismatch"
  | "power_imbalance";

export type CompatibilityFrictionResult =
  | "productive_tension"
  | "destructive_loop"
  | "avoidance_pattern";

export type EmotionalEconomyResult =
  | "balanced"
  | "asymmetrical"
  | "parasitic"
  | "volatile";

export type CompatibilityControlAxis =
  | "dominant"
  | "reactive"
  | "avoidant";

export type CompatibilityStability =
  | "stable"
  | "shifting"
  | "unstable";

export type CompatibilityLoopType =
  | "reinforcing"
  | "degrading"
  | "chaotic";

export type CompatibilityTrajectory =
  | "collapse"
  | "growth"
  | "obsession"
  | "rivalry"
  | "slow_bond";

export type CompatibilitySustainability =
  | "short_term"
  | "mid_term"
  | "long_term_viable";

export interface CompatibilityMatrixSectionDefinition {
  seed: string;
  label: string;
  purpose: string;
  fields: readonly string[];
  outputSignals: readonly string[];
}

export interface CompatibilityMatrixProfile {
  characterAttraction: readonly string[];
  personaSignals: readonly string[];
  characterSensitivities: readonly string[];
  personaPressurePoints: readonly string[];
  whoInvestsFirst: string;
  whoWithholds: string;
  reciprocityPattern: string;
  controlAxis: CompatibilityControlAxis;
  dependencyAxis: string;
  loopExample: string;
  burnoutRisks: readonly string[];
  repetitionRisks: readonly string[];
  derailmentTriggers: readonly string[];
}

export interface CompatibilityMatrixAssessment {
  attractionAlignment: CompatibilityAlignment;
  chemistryResult: CompatibilityChemistryResult;
  collisionType: CompatibilityCollisionType;
  frictionResult: CompatibilityFrictionResult;
  emotionalEconomy: EmotionalEconomyResult;
  powerStability: CompatibilityStability;
  feedbackLoopType: CompatibilityLoopType;
  likelyTrajectory: CompatibilityTrajectory;
  sustainability: CompatibilitySustainability;
  overallCompatibility: CompatibilityAlignment;
  bestUseCase: string;
  requiredAdjustments: readonly string[];
}

export interface CompatibilityMatrixResult {
  profile: CompatibilityMatrixProfile;
  assessment: CompatibilityMatrixAssessment;
  compactPrompt: string;
}

export const compatibilityMatrixSemanticChain = [
  "Character Attraction Vector",
  "Persona Emission",
  "Friction Points",
  "Emotional Economy",
  "Power Dynamics",
  "Behavioral Feedback Loop",
  "Narrative Trajectory",
  "Risk Factors",
  "Final Assessment",
] as const;

export const compatibilityMatrixPrinciples = [
  "Compatibility should compare what the character is drawn to with what the persona emits.",
  "Friction is not automatically bad; productive tension can create chemistry and route momentum.",
  "Emotional economy asks who invests first, who withholds, and whether reciprocity becomes balanced or volatile.",
  "Power dynamics should track control, dependency, and stability rather than flattening everything into dominant or submissive labels.",
  "Behavioral feedback loops should describe character to persona to character escalation or de-escalation.",
  "Trajectory prediction should name likely arc and sustainability, not just whether a pair is good or bad.",
  "Risk factors should identify burnout, repetition, and derailment triggers before generation begins.",
] as const;

export const compatibilityMatrixSections = [
  {
    seed: "attraction_vector",
    label: "Attraction Vector",
    purpose:
      "Compares what the character is drawn to with what the persona naturally emits.",
    fields: [
      "what the character is drawn to",
      "what the persona emits",
      "alignment",
      "chemistry result",
    ],
    outputSignals: [
      "immediate chemistry",
      "slow burn",
      "no spark",
    ],
  },
  {
    seed: "friction_points",
    label: "Friction Points",
    purpose:
      "Identifies where character sensitivities collide with persona pressure points.",
    fields: [
      "character sensitivities",
      "persona pressure points",
      "collision type",
      "friction result",
    ],
    outputSignals: [
      "value clash",
      "emotional mismatch",
      "pacing mismatch",
      "power imbalance",
      "productive tension",
      "destructive loop",
      "avoidance pattern",
    ],
  },
  {
    seed: "emotional_economy",
    label: "Emotional Economy",
    purpose:
      "Tracks investment, withholding, reciprocity, and whether emotional exchange is sustainable.",
    fields: [
      "who invests first",
      "who withholds",
      "reciprocity pattern",
      "economy result",
    ],
    outputSignals: [
      "balanced",
      "asymmetrical",
      "parasitic",
      "volatile",
    ],
  },
  {
    seed: "power_dynamics",
    label: "Power Dynamics",
    purpose:
      "Maps control, dependency, and whether the power structure remains stable or shifts under pressure.",
    fields: [
      "control axis",
      "dependency axis",
      "stability",
    ],
    outputSignals: [
      "dominant",
      "reactive",
      "avoidant",
      "stable",
      "shifting",
      "unstable",
    ],
  },
  {
    seed: "behavioral_feedback_loop",
    label: "Behavioral Feedback Loop",
    purpose:
      "Models character to persona to character reactions as escalation or de-escalation loops.",
    fields: [
      "example loop",
      "trigger",
      "response",
      "escalation or de-escalation",
      "loop type",
    ],
    outputSignals: [
      "reinforcing",
      "degrading",
      "chaotic",
    ],
  },
  {
    seed: "narrative_trajectory_prediction",
    label: "Narrative Trajectory Prediction",
    purpose:
      "Predicts likely route shape and how long the pairing can stay generative.",
    fields: [
      "likely arc",
      "sustainability",
    ],
    outputSignals: [
      "collapse",
      "growth",
      "obsession",
      "rivalry",
      "slow bond",
      "short-term",
      "mid-term",
      "long-term viable",
    ],
  },
  {
    seed: "risk_factors",
    label: "Risk Factors",
    purpose:
      "Names burnout, repetition, and derailment risks before the route starts looping.",
    fields: [
      "burnout risks",
      "repetition risks",
      "derailment triggers",
    ],
    outputSignals: [
      "burnout risk",
      "repetition risk",
      "derailment trigger",
      "required adjustment",
    ],
  },
  {
    seed: "final_assessment",
    label: "Final Assessment",
    purpose:
      "Summarizes overall compatibility, best use case, and required adjustments.",
    fields: [
      "overall compatibility",
      "best use case",
      "required adjustments",
    ],
    outputSignals: [
      "compatibility rating",
      "best use case",
      "adjustment plan",
    ],
  },
] as const satisfies readonly CompatibilityMatrixSectionDefinition[];

export const compatibilityCollisionDefinitions = [
  {
    seed: "value_clash",
    label: "Value Clash",
    description:
      "The pair disagrees over principles, ethics, loyalty, freedom, duty, or what counts as acceptable action.",
    productiveUse:
      "Use when disagreement can create respect, challenge, or growth.",
    risk:
      "Can become destructive if neither side is capable of repair or perspective-taking.",
  },
  {
    seed: "emotional_mismatch",
    label: "Emotional Mismatch",
    description:
      "One side seeks contact, reassurance, or intensity while the other manages emotion through distance, logic, or delay.",
    productiveUse:
      "Use for slow-burn learning, hurt/comfort, or attachment repair.",
    risk:
      "Can become a pursuer-withdrawer loop if unmet needs are never named.",
  },
  {
    seed: "pacing_mismatch",
    label: "Pacing Mismatch",
    description:
      "One side moves faster toward intimacy, trust, or commitment than the other can tolerate.",
    productiveUse:
      "Use for tension where restraint, waiting, and earned consent matter.",
    risk:
      "Can burn out if one side repeatedly pressures while the other repeatedly retreats.",
  },
  {
    seed: "power_imbalance",
    label: "Power Imbalance",
    description:
      "Control, rank, dependence, resources, or emotional leverage are uneven enough to shape every interaction.",
    productiveUse:
      "Use when boundaries, agency, and negotiated trust are explicit.",
    risk:
      "Can derail if power replaces choice or if dependence becomes coercive.",
  },
] as const;

export const compatibilityTrajectoryDefinitions = [
  {
    seed: "collapse",
    label: "Collapse",
    description:
      "The pair's friction exceeds repair capacity, leading to distance, rupture, or emotional shutdown.",
    bestUseCase:
      "Short tragic arcs, cautionary routes, or rupture-heavy testing.",
  },
  {
    seed: "growth",
    label: "Growth",
    description:
      "The pair's differences create pressure that can mature into repair, flexibility, and better self-knowledge.",
    bestUseCase:
      "Long-form romance, healing arcs, and route progression.",
  },
  {
    seed: "obsession",
    label: "Obsession",
    description:
      "Attraction and unmet need amplify each other until attention becomes fixation.",
    bestUseCase:
      "High-intensity routes that require strong boundaries and de-escalation tools.",
  },
  {
    seed: "rivalry",
    label: "Rivalry",
    description:
      "Conflict, respect, competition, and attraction keep feeding each other.",
    bestUseCase:
      "Enemies-to-lovers, academic rivals, workplace rivals, and power-duel routes.",
  },
  {
    seed: "slow_bond",
    label: "Slow Bond",
    description:
      "Compatibility emerges through repeated safety, low-pressure contact, and gradual trust.",
    bestUseCase:
      "Slow burn, friends-to-lovers, caretaker, and guarded-character routes.",
  },
] as const;

export const COMPATIBILITY_MATRIX_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  ...compatibilityMatrixSections.map((section) =>
    createVocabularySeedPreset({
      seed: `${section.seed}_compatibility_section`,
      label: `${section.label} Compatibility Section`,
      description: section.purpose,
      examples: [
        ...section.fields.map((field) => `Field: ${field}`),
        ...section.outputSignals.map((signal) => `Signal: ${signal}`),
      ],
      tags: [
        "compatibility_matrix",
        "persona_matching",
        "relationship_dynamics",
        section.seed,
      ],
      relatedSeeds: section.outputSignals,
      oppositeSeeds: [
        "flat_match_score_only",
      ],
      romanceHooks: [
        "compatibility_profile",
        "persona_matching",
        "route_prediction",
      ],
      scenarioHooks: [
        "character_persona_matrix",
        "relationship_fit_assessment",
      ],
      dialoguePatterns: [
        "Compatibility should shape likely pressure, not force a fixed outcome.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: 8,
        conflictPotential: section.seed === "friction_points" ? 9 : 7,
      },
    }),
  ),
  ...compatibilityCollisionDefinitions.map((collision) =>
    createVocabularySeedPreset({
      seed: `${collision.seed}_compatibility_collision`,
      label: `${collision.label} Compatibility Collision`,
      description: collision.description,
      examples: [
        `Productive use: ${collision.productiveUse}`,
        `Risk: ${collision.risk}`,
      ],
      tags: [
        "compatibility_matrix",
        "collision_type",
        collision.seed,
      ],
      relatedSeeds: [
        collision.productiveUse,
        collision.risk,
      ],
      oppositeSeeds: [
        "no_friction_match",
      ],
      romanceHooks: [
        "productive_tension",
        "compatibility_friction",
      ],
      scenarioHooks: [
        "friction_point",
        collision.seed,
      ],
      dialoguePatterns: [
        "Friction should create readable pressure before it escalates.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: collision.seed === "emotional_mismatch" ? 9 : 7,
        conflictPotential: 9,
      },
    }),
  ),
  ...compatibilityTrajectoryDefinitions.map((trajectory) =>
    createVocabularySeedPreset({
      seed: `${trajectory.seed}_compatibility_trajectory`,
      label: `${trajectory.label} Compatibility Trajectory`,
      description: trajectory.description,
      examples: [
        `Best use case: ${trajectory.bestUseCase}`,
      ],
      tags: [
        "compatibility_matrix",
        "trajectory_prediction",
        trajectory.seed,
      ],
      relatedSeeds: [
        trajectory.bestUseCase,
      ],
      oppositeSeeds: [
        "trajectory_unknown",
      ],
      romanceHooks: [
        "route_prediction",
        trajectory.seed,
      ],
      scenarioHooks: [
        "narrative_trajectory_prediction",
      ],
      dialoguePatterns: [
        "Trajectory should predict likely arc and sustainability, not guarantee an ending.",
      ],
      metadata: {
        rarity: trajectory.seed === "obsession" ? "uncommon" : "common",
        romanceValue: trajectory.seed === "growth" || trajectory.seed === "slow_bond" ? 9 : 7,
        conflictPotential: trajectory.seed === "collapse" || trajectory.seed === "rivalry" ? 9 : 7,
      },
    }),
  ),
] as const satisfies readonly VocabularySeedPreset[]);

export function assessCompatibilityMatrix(
  profile: CompatibilityMatrixProfile,
): CompatibilityMatrixResult {
  const attractionAlignment = scoreOverlapAlignment(
    profile.characterAttraction,
    profile.personaSignals,
  );
  const collisionType = inferCollisionType(profile);
  const frictionResult = inferFrictionResult(profile, collisionType);
  const emotionalEconomy = inferEmotionalEconomy(profile);
  const powerStability = inferPowerStability(profile);
  const feedbackLoopType = inferFeedbackLoopType(profile);
  const likelyTrajectory = inferTrajectory(
    attractionAlignment,
    frictionResult,
    emotionalEconomy,
    feedbackLoopType,
  );
  const sustainability = inferSustainability(frictionResult, feedbackLoopType, emotionalEconomy);
  const chemistryResult = inferChemistryResult(attractionAlignment, frictionResult);
  const overallCompatibility = inferOverallCompatibility(
    attractionAlignment,
    frictionResult,
    emotionalEconomy,
    sustainability,
  );

  const assessment: CompatibilityMatrixAssessment = {
    attractionAlignment,
    chemistryResult,
    collisionType,
    frictionResult,
    emotionalEconomy,
    powerStability,
    feedbackLoopType,
    likelyTrajectory,
    sustainability,
    overallCompatibility,
    bestUseCase: inferBestUseCase(likelyTrajectory, chemistryResult),
    requiredAdjustments: inferRequiredAdjustments(profile, frictionResult, emotionalEconomy),
  };

  return {
    profile,
    assessment,
    compactPrompt: compileCompatibilityMatrixPrompt(assessment),
  };
}

function scoreOverlapAlignment(
  wanted: readonly string[],
  emitted: readonly string[],
): CompatibilityAlignment {
  const wantedTokens = new Set(wanted.map(normalizeToken));
  const emittedTokens = emitted.map(normalizeToken);
  const overlap = emittedTokens.filter((token) => wantedTokens.has(token)).length;

  if (overlap >= 2) {
    return "high";
  }
  if (overlap === 1) {
    return "medium";
  }
  return "low";
}

function inferChemistryResult(
  alignment: CompatibilityAlignment,
  friction: CompatibilityFrictionResult,
): CompatibilityChemistryResult {
  if (alignment === "high" && friction !== "avoidance_pattern") {
    return "immediate_chemistry";
  }
  if (alignment === "medium" || friction === "productive_tension") {
    return "slow_burn";
  }
  return "no_spark";
}

function inferCollisionType(
  profile: CompatibilityMatrixProfile,
): CompatibilityCollisionType {
  const combined = [
    ...profile.characterSensitivities,
    ...profile.personaPressurePoints,
    profile.dependencyAxis,
  ].join(" ").toLowerCase();

  if (/control|rank|authority|dependency|dominant|power/.test(combined)) {
    return "power_imbalance";
  }
  if (/fast|slow|pace|commitment|distance|intensity/.test(combined)) {
    return "pacing_mismatch";
  }
  if (/feeling|reassurance|withdraw|avoid|attachment|emotion/.test(combined)) {
    return "emotional_mismatch";
  }
  return "value_clash";
}

function inferFrictionResult(
  profile: CompatibilityMatrixProfile,
  collisionType: CompatibilityCollisionType,
): CompatibilityFrictionResult {
  const risks = [
    ...profile.burnoutRisks,
    ...profile.repetitionRisks,
    ...profile.derailmentTriggers,
  ].join(" ").toLowerCase();

  if (/coercion|contempt|no repair|harm|exhaustion/.test(risks)) {
    return "destructive_loop";
  }
  if (/avoid|stonewall|ghost|shutdown/.test(risks) || collisionType === "pacing_mismatch") {
    return "avoidance_pattern";
  }
  return "productive_tension";
}

function inferEmotionalEconomy(profile: CompatibilityMatrixProfile): EmotionalEconomyResult {
  const economyText = [
    profile.whoInvestsFirst,
    profile.whoWithholds,
    profile.reciprocityPattern,
  ].join(" ").toLowerCase();

  if (/balanced|reciprocal|mutual/.test(profile.reciprocityPattern.toLowerCase())) {
    return "balanced";
  }
  if (/extract|uses|drains|one-sided taking|parasitic/.test(economyText)) {
    return "parasitic";
  }
  if (/spike|volatile|hot and cold|push-pull/.test(economyText)) {
    return "volatile";
  }
  if (/one-sided|asymmetrical|uneven|withholds/.test(economyText)) {
    return "asymmetrical";
  }
  return "balanced";
}

function inferPowerStability(profile: CompatibilityMatrixProfile): CompatibilityStability {
  const powerText = `${profile.controlAxis} ${profile.dependencyAxis}`.toLowerCase();
  if (/unstable|coercive|volatile|unsafe/.test(powerText)) {
    return "unstable";
  }
  if (/shifting|negotiated|switch|changes/.test(powerText) || profile.controlAxis === "reactive") {
    return "shifting";
  }
  return "stable";
}

function inferFeedbackLoopType(profile: CompatibilityMatrixProfile): CompatibilityLoopType {
  const loopText = profile.loopExample.toLowerCase();
  if (/chaos|unpredictable|spiral|whiplash/.test(loopText)) {
    return "chaotic";
  }
  if (/de-escalat|reinforc|repair|stabiliz/.test(loopText)) {
    return "reinforcing";
  }
  if (/degrade|worse|retreat|punish|\bescalates?\b/.test(loopText)) {
    return "degrading";
  }
  return "reinforcing";
}

function inferTrajectory(
  attraction: CompatibilityAlignment,
  friction: CompatibilityFrictionResult,
  economy: EmotionalEconomyResult,
  loop: CompatibilityLoopType,
): CompatibilityTrajectory {
  if (friction === "destructive_loop" || economy === "parasitic") {
    return "collapse";
  }
  if (loop === "chaotic" && attraction !== "low") {
    return "obsession";
  }
  if (friction === "productive_tension" && attraction !== "low") {
    return "rivalry";
  }
  if (economy === "balanced") {
    return "growth";
  }
  return "slow_bond";
}

function inferSustainability(
  friction: CompatibilityFrictionResult,
  loop: CompatibilityLoopType,
  economy: EmotionalEconomyResult,
): CompatibilitySustainability {
  if (friction === "destructive_loop" || loop === "chaotic" || economy === "parasitic") {
    return "short_term";
  }
  if (friction === "avoidance_pattern" || economy === "asymmetrical") {
    return "mid_term";
  }
  return "long_term_viable";
}

function inferOverallCompatibility(
  attraction: CompatibilityAlignment,
  friction: CompatibilityFrictionResult,
  economy: EmotionalEconomyResult,
  sustainability: CompatibilitySustainability,
): CompatibilityAlignment {
  if (
    attraction === "high" &&
    friction === "productive_tension" &&
    economy === "balanced" &&
    sustainability === "long_term_viable"
  ) {
    return "high";
  }
  if (sustainability === "short_term" || economy === "parasitic") {
    return "low";
  }
  return "medium";
}

function inferBestUseCase(
  trajectory: CompatibilityTrajectory,
  chemistry: CompatibilityChemistryResult,
): string {
  if (trajectory === "collapse") {
    return "Rupture-heavy, short-form, or cautionary compatibility test.";
  }
  if (trajectory === "obsession") {
    return "High-intensity route with explicit de-escalation and boundaries.";
  }
  if (trajectory === "rivalry") {
    return chemistry === "immediate_chemistry"
      ? "High-chemistry rivals or enemies-to-lovers route."
      : "Slow-burn rivalry with respect earned through repeated contact.";
  }
  if (trajectory === "slow_bond") {
    return "Slow burn, guarded trust, or low-pressure bonding route.";
  }
  return "Long-form growth, repair, and sustainable romance route.";
}

function inferRequiredAdjustments(
  profile: CompatibilityMatrixProfile,
  friction: CompatibilityFrictionResult,
  economy: EmotionalEconomyResult,
): readonly string[] {
  const adjustments = [
    ...(friction === "destructive_loop"
      ? ["Add explicit repair beats before repeating the same collision."]
      : []),
    ...(friction === "avoidance_pattern"
      ? ["Add low-pressure contact and clear return rituals."]
      : []),
    ...(economy === "asymmetrical" || economy === "parasitic"
      ? ["Balance investment so one side is not always chasing or absorbing."]
      : []),
    ...(profile.derailmentTriggers.length > 0
      ? [`Watch derailment triggers: ${profile.derailmentTriggers.join(", ")}.`]
      : []),
  ];

  return adjustments.length > 0 ? adjustments : ["No major adjustment required."];
}

function compileCompatibilityMatrixPrompt(
  assessment: CompatibilityMatrixAssessment,
): string {
  return [
    "Compatibility Matrix:",
    `overall=${assessment.overallCompatibility}`,
    `chemistry=${assessment.chemistryResult}`,
    `friction=${assessment.frictionResult}`,
    `trajectory=${assessment.likelyTrajectory}`,
    `sustainability=${assessment.sustainability}`,
    `best use=${assessment.bestUseCase}`,
  ].join(" ");
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}
