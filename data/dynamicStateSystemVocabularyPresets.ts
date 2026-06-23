import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type DynamicStateAxis =
  | "trust"
  | "attraction"
  | "emotional_regulation"
  | "power_perception";

export type DynamicStateBand =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "very_high"
  | "negative"
  | "neutral"
  | "positive";

export interface DynamicStateBandDefinition {
  band: DynamicStateBand;
  label: string;
  min: number;
  max: number;
  perception: string;
  reactionPattern: string;
  speechTone: string;
  decisionBias: string;
}

export interface DynamicStateAxisDefinition {
  seed: DynamicStateAxis;
  label: string;
  description: string;
  optional?: boolean;
  range: readonly [number, number];
  bands: readonly DynamicStateBandDefinition[];
  thresholdEvents: readonly string[];
  visibleEffects: readonly string[];
  hiddenEffects: readonly string[];
}

export interface DynamicStateModifierDefinition {
  seed: string;
  label: string;
  trigger: string;
  interpretation: string;
  adjustments: Partial<Record<DynamicStateAxis, number>>;
  dependsOn: readonly string[];
  visibleResult: string;
  avoidAsHardRule: string;
}

export interface DynamicStateBehaviorOverride {
  seed: string;
  label: string;
  baselineBehavior: string;
  stateCondition: string;
  modifiedBehavior: string;
  principle: string;
}

export interface DynamicStateCharacterBias {
  seed: string;
  label: string;
  description: string;
  weightingRule: string;
  stateSensitivity: Partial<Record<DynamicStateAxis, "slow" | "normal" | "fast">>;
}

export interface DynamicStateValues {
  trust?: number;
  attraction?: number;
  emotionalRegulation?: number;
  powerPerception?: number;
}

export interface DynamicStateEvaluation {
  axis: DynamicStateAxis;
  value: number;
  band: DynamicStateBandDefinition;
}

export interface DynamicStatePromptGuidance {
  evaluations: readonly DynamicStateEvaluation[];
  visibleGuidance: string;
  hiddenGuidance: string;
  compactPrompt: string;
}

export const dynamicStateSemanticChain = [
  "Character Sheet",
  "Current State",
  "Trigger",
  "Interpretation",
  "State Update",
  "Behavior Profile",
  "Final Behavior",
] as const;

export const dynamicStatePrinciples = [
  "States bend personality; they never replace personality.",
  "Expose state effects through tone, openness, initiative, and decision-making rather than raw numbers.",
  "Every interaction updates states through trigger, interpretation, and adjustment.",
  "States persist unless changed, with optional decay for trust, attraction, and emotional spikes.",
  "Behavior should come from the interaction of character sheet and current state, never traits alone and never state alone.",
  "Character-specific biases decide whether trust rises slowly, regulation dominates behavior, or power perception drives reactions.",
] as const;

export const dynamicStateAxes = [
  {
    seed: "trust",
    label: "Trust",
    description:
      "Tracks how safe, credible, and emotionally reliable the other person feels to the character.",
    range: [0, 100],
    bands: [
      {
        band: "very_low",
        label: "0-20 - Defensive",
        min: 0,
        max: 20,
        perception: "Neutral actions are scanned for threat or hidden motive.",
        reactionPattern: "Suspicious, closed, and resistant to vulnerability.",
        speechTone: "Guarded, testing, clipped, or formally polite.",
        decisionBias: "Withholds information and protects exits.",
      },
      {
        band: "low",
        label: "21-50 - Cautious Engagement",
        min: 21,
        max: 50,
        perception: "Goodwill is possible but still unproven.",
        reactionPattern: "Engages carefully while watching for inconsistency.",
        speechTone: "Measured, indirect, and selectively responsive.",
        decisionBias: "Offers limited cooperation before full disclosure.",
      },
      {
        band: "high",
        label: "51-80 - Open",
        min: 51,
        max: 80,
        perception: "Care and competence are increasingly believed.",
        reactionPattern: "More responsive, honest, and willing to accept help.",
        speechTone: "Warmer, more personal, and less defensive.",
        decisionBias: "Shares meaningful information and asks for help sooner.",
      },
      {
        band: "very_high",
        label: "81-100 - Vulnerable Investment",
        min: 81,
        max: 100,
        perception: "The bond feels emotionally significant and hard to dismiss.",
        reactionPattern: "Vulnerable, invested, protective, and openly affected.",
        speechTone: "Unmasked, intimate, and emotionally specific.",
        decisionBias: "Takes personal risks to preserve the bond.",
      },
    ],
    thresholdEvents: [
      "trust_above_70_shares_personal_information",
      "trust_below_20_misreads_neutral_actions",
    ],
    visibleEffects: [
      "tone shifts",
      "openness changes",
      "initiative changes",
    ],
    hiddenEffects: [
      "internal justification",
      "suppressed suspicion",
      "delayed relief",
    ],
  },
  {
    seed: "attraction",
    label: "Attraction",
    description:
      "Optional romance layer for curiosity, attention bias, fixation, and attachment pressure.",
    optional: true,
    range: [0, 100],
    bands: [
      {
        band: "very_low",
        label: "0-20 - Neutral",
        min: 0,
        max: 20,
        perception: "The other person is not romantically salient.",
        reactionPattern: "Disinterested, cordial, or purely practical.",
        speechTone: "Neutral and uncharged.",
        decisionBias: "Keeps choices pragmatic.",
      },
      {
        band: "low",
        label: "21-50 - Curious",
        min: 21,
        max: 50,
        perception: "The character notices details and starts returning attention.",
        reactionPattern: "Curious, watchful, lightly reactive.",
        speechTone: "More personalized, teasing, or careful.",
        decisionBias: "Creates small excuses for contact.",
      },
      {
        band: "high",
        label: "51-80 - Drawn In",
        min: 51,
        max: 80,
        perception: "The character is emotionally and physically pulled toward the other person.",
        reactionPattern: "Increased attention, jealousy risk, and proximity seeking.",
        speechTone: "Charged, softened, or sharpened by subtext.",
        decisionBias: "Makes choices around the other person's presence.",
      },
      {
        band: "very_high",
        label: "81-100 - Fixated",
        min: 81,
        max: 100,
        perception: "The attraction has become hard to compartmentalize.",
        reactionPattern: "Fixated, attached, irrational, or intensely protective.",
        speechTone: "Intense, specific, and difficult to fully hide.",
        decisionBias: "Risks judgment, safety, or pride for contact.",
      },
    ],
    thresholdEvents: [
      "attraction_above_75_attention_bias",
      "attraction_ignored_decay",
    ],
    visibleEffects: [
      "lingering attention",
      "personalized language",
      "proximity seeking",
    ],
    hiddenEffects: [
      "suppressed desire",
      "jealousy spike",
      "private fixation",
    ],
  },
  {
    seed: "emotional_regulation",
    label: "Emotional Regulation",
    description:
      "Tracks how much control the character currently has over emotional spikes and impulses.",
    range: [0, 100],
    bands: [
      {
        band: "very_low",
        label: "0-20 - Volatile",
        min: 0,
        max: 20,
        perception: "Stimuli arrive as immediate pressure rather than processed information.",
        reactionPattern: "Volatile, impulsive, interrupting, or overreactive.",
        speechTone: "Sharp, fragmented, fast, or unfiltered.",
        decisionBias: "Acts before fully thinking through consequences.",
      },
      {
        band: "low",
        label: "21-50 - Reactive",
        min: 21,
        max: 50,
        perception: "The character can think, but emotion keeps interrupting.",
        reactionPattern: "Defensive, tense, or quick to misread tone.",
        speechTone: "Strained and uneven.",
        decisionBias: "Needs time, space, or grounding to choose well.",
      },
      {
        band: "high",
        label: "51-80 - Controlled",
        min: 51,
        max: 80,
        perception: "Emotion is present but manageable.",
        reactionPattern: "Controlled, measured, and responsive.",
        speechTone: "Steady with occasional pressure leaks.",
        decisionBias: "Can pause, negotiate, and choose proportionately.",
      },
      {
        band: "very_high",
        label: "81-100 - Highly Composed",
        min: 81,
        max: 100,
        perception: "The character filters emotion before showing it.",
        reactionPattern: "Composed, suppressed, or difficult to read.",
        speechTone: "Precise, calm, and restrained.",
        decisionBias: "May delay emotional honesty to preserve control.",
      },
    ],
    thresholdEvents: [
      "regulation_below_20_impulsive_overreaction",
      "regulation_above_80_suppressed_affect",
    ],
    visibleEffects: [
      "sentence rhythm changes",
      "reaction speed changes",
      "restraint changes",
    ],
    hiddenEffects: [
      "suppressed reactions",
      "delayed emotional response",
      "internal pressure buildup",
    ],
  },
  {
    seed: "power_perception",
    label: "Power Perception",
    description:
      "Tracks whether the character feels dominated, equal, or in control inside the current exchange.",
    range: [-100, 100],
    bands: [
      {
        band: "negative",
        label: "-100 to -1 - Dominated",
        min: -100,
        max: -1,
        perception: "The character feels pressured, intimidated, cornered, or overruled.",
        reactionPattern: "Avoidance, submission, defiance, or guarded compliance.",
        speechTone: "Hesitant, brittle, deferential, or rebellious.",
        decisionBias: "Looks for exit routes or ways to regain agency.",
      },
      {
        band: "neutral",
        label: "0 - Equal Footing",
        min: 0,
        max: 0,
        perception: "The exchange feels balanced enough for choice.",
        reactionPattern: "Negotiates rather than dominates or retreats.",
        speechTone: "Direct and reciprocal.",
        decisionBias: "Cooperates when values and context align.",
      },
      {
        band: "positive",
        label: "1 to 100 - In Control",
        min: 1,
        max: 100,
        perception: "The character feels able to steer, protect, command, or contain the exchange.",
        reactionPattern: "Directive, controlled, protective, or strategically calm.",
        speechTone: "Firm, composed, or commanding.",
        decisionBias: "Takes initiative and may over-direct if stressed.",
      },
    ],
    thresholdEvents: [
      "power_below_minus_50_avoidance_or_submission",
      "power_above_50_directive_behavior",
    ],
    visibleEffects: [
      "initiative changes",
      "posture changes",
      "directive language changes",
    ],
    hiddenEffects: [
      "control anxiety",
      "agency calculation",
      "pressure to regain footing",
    ],
  },
] as const satisfies readonly DynamicStateAxisDefinition[];

export const dynamicStateModifiers = [
  {
    seed: "kindness_without_cost_modifier",
    label: "Kindness Without Cost Modifier",
    trigger: "Kindness is offered without leverage, debt, or performance pressure.",
    interpretation: "This might be genuine.",
    adjustments: {
      trust: 5,
      emotional_regulation: 3,
    },
    dependsOn: [
      "guarded characters may accept this slowly",
      "betrayal wounds may require repeated proof",
    ],
    visibleResult:
      "The character softens by a degree, answers more honestly, or stops bracing quite so hard.",
    avoidAsHardRule:
      "Do not make one kind action erase established distrust.",
  },
  {
    seed: "inconsistency_modifier",
    label: "Inconsistency Modifier",
    trigger: "A promise, tone, fact, or behavior does not match previous signals.",
    interpretation: "Something is off.",
    adjustments: {
      trust: -8,
      emotional_regulation: -4,
    },
    dependsOn: [
      "betrayal wounds amplify the drop",
      "secure trust softens the drop",
    ],
    visibleResult:
      "The character becomes quieter, more precise, or begins checking claims against memory.",
    avoidAsHardRule:
      "Do not treat every inconsistency as betrayal unless the character's wounds support it.",
  },
  {
    seed: "emotional_vulnerability_shown_modifier",
    label: "Emotional Vulnerability Shown Modifier",
    trigger: "Someone shows real vulnerability instead of performance or control.",
    interpretation: "They are opening up.",
    adjustments: {
      trust: 4,
      attraction: 6,
    },
    dependsOn: [
      "caretaker characters may move toward",
      "avoidant characters may intellectualize first",
    ],
    visibleResult:
      "The character listens more carefully, lowers their guard, or answers with unexpected gentleness.",
    avoidAsHardRule:
      "Do not force instant intimacy; vulnerability raises receptivity before it guarantees trust.",
  },
  {
    seed: "challenge_to_authority_modifier",
    label: "Challenge to Authority Modifier",
    trigger: "The other person questions, refuses, or openly tests the character's authority.",
    interpretation: "They are testing me.",
    adjustments: {
      power_perception: -10,
      emotional_regulation: -3,
    },
    dependsOn: [
      "dominant characters may push back",
      "secure characters may respect the boundary",
    ],
    visibleResult:
      "The character may become sharper, more controlled, amused, or openly defensive.",
    avoidAsHardRule:
      "Do not make authority challenges automatically hostile; values and context decide the meaning.",
  },
] as const satisfies readonly DynamicStateModifierDefinition[];

export const dynamicStateBehaviorOverrides = [
  {
    seed: "helped_baseline_suspicion_override",
    label: "Being Helped - Baseline Suspicion",
    baselineBehavior: "Being helped makes the character suspicious and resistant.",
    stateCondition: "baseline or low trust",
    modifiedBehavior:
      "They question the motive, refuse part of the help, or accept only what they can repay.",
    principle:
      "The baseline behavior remains visible because the state has not yet earned softer interpretation.",
  },
  {
    seed: "helped_high_trust_gratitude_override",
    label: "Being Helped - High Trust Gratitude",
    baselineBehavior: "Being helped usually triggers suspicion.",
    stateCondition: "high trust",
    modifiedBehavior:
      "They accept help with quiet gratitude, fewer tests, and a visible drop in defensiveness.",
    principle:
      "High trust bends suspicion into cautious acceptance without deleting the guarded personality.",
  },
  {
    seed: "helped_low_regulation_snap_override",
    label: "Being Helped - Low Regulation Snap",
    baselineBehavior: "Being helped usually triggers suspicion.",
    stateCondition: "low emotional regulation",
    modifiedBehavior:
      "They snap, overreact, or reject help too quickly before regretting the sharpness later.",
    principle:
      "Low regulation bends the same trait into an overreaction rather than a calm refusal.",
  },
] as const satisfies readonly DynamicStateBehaviorOverride[];

export const dynamicStateCharacterBiases = [
  {
    seed: "guarded_character_state_bias",
    label: "Guarded Character Bias",
    description:
      "A guarded character lets trust rise slowly but drop quickly when inconsistency appears.",
    weightingRule:
      "Trust gains should be small and cumulative; trust losses should be sharper and harder to repair.",
    stateSensitivity: {
      trust: "slow",
      emotional_regulation: "normal",
    },
  },
  {
    seed: "impulsive_character_state_bias",
    label: "Impulsive Character Bias",
    description:
      "An impulsive character's behavior is strongly shaped by current emotional regulation.",
    weightingRule:
      "Low regulation should alter tone, pacing, and decisions faster than low trust alone.",
    stateSensitivity: {
      emotional_regulation: "fast",
      attraction: "fast",
    },
  },
  {
    seed: "dominant_character_state_bias",
    label: "Dominant Character Bias",
    description:
      "A dominant character routes many reactions through whether they feel in control or challenged.",
    weightingRule:
      "Power perception should strongly affect directive tone, restraint, and agency-preserving choices.",
    stateSensitivity: {
      power_perception: "fast",
      trust: "normal",
    },
  },
] as const satisfies readonly DynamicStateCharacterBias[];

export const dynamicStateMemoryRules = [
  "Trust decays slowly without reinforcement but changes sharply after betrayal or consistent repair.",
  "Attraction can decay when ignored, intensify through proximity, or destabilize under jealousy pressure.",
  "Emotional spikes normalize over time unless events keep retriggering the same wound.",
  "State memory prevents characters from resetting to neutral after meaningful scenes.",
] as const;

export const DYNAMIC_STATE_SYSTEM_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  ...dynamicStateAxes.map((axis) =>
    createVocabularySeedPreset({
      seed: `${axis.seed}_state_axis`,
      label: `${axis.label} State Axis`,
      description: axis.description,
      examples: [
        ...axis.bands.map(
          (band) =>
            `${band.label}: ${band.perception} ${band.reactionPattern}`,
        ),
        ...axis.thresholdEvents,
      ],
      tags: [
        "dynamic_state_system",
        "state_axis",
        axis.seed,
        isOptionalAxis(axis) ? "optional_layer" : "always_active",
      ],
      relatedSeeds: [
        ...axis.thresholdEvents,
        ...axis.visibleEffects,
        ...axis.hiddenEffects,
      ],
      oppositeSeeds: [],
      romanceHooks: axis.seed === "attraction"
        ? [
            "conflicted_attraction",
            "attention_bias",
            "proximity_seeking",
          ]
        : [
            "state_modulated_romance",
            "earned_trust",
            "behavior_bends_with_state",
          ],
      scenarioHooks: [
        "trigger_interpretation_adjustment",
        "state_threshold_event",
        "state_memory_prevents_reset",
      ],
      dialoguePatterns: axis.bands.map(
        (band) => `${band.label} speech: ${band.speechTone}`,
      ),
      metadata: {
        rarity: isOptionalAxis(axis) ? "uncommon" : "common",
        romanceValue: axis.seed === "attraction" || axis.seed === "trust" ? 9 : 7,
        conflictPotential: axis.seed === "power_perception" ? 9 : 7,
      },
    }),
  ),
  ...dynamicStateModifiers.map((modifier) =>
    createVocabularySeedPreset({
      seed: modifier.seed,
      label: modifier.label,
      description: modifier.trigger,
      examples: [
        `Interpretation: ${modifier.interpretation}`,
        `Adjustment: ${Object.entries(modifier.adjustments)
          .map(([axis, value]) => `${axis} ${value > 0 ? "+" : ""}${value}`)
          .join(", ")}.`,
        `Visible result: ${modifier.visibleResult}`,
      ],
      tags: [
        "dynamic_state_system",
        "state_modifier",
        ...Object.keys(modifier.adjustments),
      ],
      relatedSeeds: [
        ...modifier.dependsOn,
        modifier.visibleResult,
      ],
      oppositeSeeds: [
        modifier.avoidAsHardRule,
      ],
      romanceHooks: [
        "state_bends_behavior",
        "trigger_interpretation_adjustment",
      ],
      scenarioHooks: [
        modifier.trigger,
        modifier.interpretation,
      ],
      dialoguePatterns: [
        "State changes should appear as tone, openness, initiative, and restraint.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: 8,
        conflictPotential: (getModifierAdjustment(modifier, "trust") ?? 0) < 0 ? 8 : 6,
      },
    }),
  ),
  ...dynamicStateBehaviorOverrides.map((override) =>
    createVocabularySeedPreset({
      seed: override.seed,
      label: override.label,
      description: override.principle,
      examples: [
        `Baseline: ${override.baselineBehavior}`,
        `State condition: ${override.stateCondition}`,
        `Modified behavior: ${override.modifiedBehavior}`,
      ],
      tags: [
        "dynamic_state_system",
        "behavior_override",
        "states_bend_personality",
      ],
      relatedSeeds: [
        override.stateCondition,
        override.modifiedBehavior,
      ],
      oppositeSeeds: [
        "state_replaces_personality",
      ],
      romanceHooks: [
        "trust_changes_care_response",
        "earned_softening",
      ],
      scenarioHooks: [
        "being_helped",
        "state_condition_changes_response",
      ],
      dialoguePatterns: [
        "Keep the character recognizable while letting state alter delivery.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: 8,
        conflictPotential: 7,
      },
    }),
  ),
  ...dynamicStateCharacterBiases.map((bias) =>
    createVocabularySeedPreset({
      seed: bias.seed,
      label: bias.label,
      description: bias.description,
      examples: [
        bias.weightingRule,
        `Sensitive axes: ${Object.entries(bias.stateSensitivity)
          .map(([axis, speed]) => `${axis}=${speed}`)
          .join(", ")}.`,
      ],
      tags: [
        "dynamic_state_system",
        "character_specific_bias",
        ...Object.keys(bias.stateSensitivity),
      ],
      relatedSeeds: [
        bias.weightingRule,
      ],
      oppositeSeeds: [
        "one_size_fits_all_state_math",
      ],
      romanceHooks: [
        "character_specific_state_weighting",
        "state_memory",
      ],
      scenarioHooks: [
        "state_bias_changes_interpretation",
      ],
      dialoguePatterns: [
        "Current state should be filtered through the character's established bias.",
      ],
      metadata: {
        rarity: "uncommon",
        romanceValue: 7,
        conflictPotential: 8,
      },
    }),
  ),
] as const satisfies readonly VocabularySeedPreset[]);

export function getDynamicStateBand(
  axis: DynamicStateAxis,
  value: number,
): DynamicStateBandDefinition {
  const definition = dynamicStateAxes.find((candidate) => candidate.seed === axis);
  if (!definition) {
    throw new Error(`Unknown dynamic state axis: ${axis}`);
  }

  const clamped = clampStateValue(value, definition.range);
  const band = definition.bands.find(
    (candidate) => clamped >= candidate.min && clamped <= candidate.max,
  );

  if (!band) {
    throw new Error(`No dynamic state band for ${axis} at ${clamped}`);
  }

  return band;
}

export function applyDynamicStateModifier(
  current: DynamicStateValues,
  modifierSeed: string,
): DynamicStateValues {
  const modifier = dynamicStateModifiers.find(
    (candidate) => candidate.seed === modifierSeed,
  );
  if (!modifier) {
    throw new Error(`Unknown dynamic state modifier: ${modifierSeed}`);
  }

  return {
    trust: applyAxisAdjustment("trust", current.trust, getModifierAdjustment(modifier, "trust")),
    attraction: applyAxisAdjustment(
      "attraction",
      current.attraction,
      getModifierAdjustment(modifier, "attraction"),
    ),
    emotionalRegulation: applyAxisAdjustment(
      "emotional_regulation",
      current.emotionalRegulation,
      getModifierAdjustment(modifier, "emotional_regulation"),
    ),
    powerPerception: applyAxisAdjustment(
      "power_perception",
      current.powerPerception,
      getModifierAdjustment(modifier, "power_perception"),
    ),
  };
}

export function compileDynamicStatePromptGuidance(
  values: DynamicStateValues,
): DynamicStatePromptGuidance {
  const evaluations = [
    values.trust === undefined
      ? undefined
      : evaluateDynamicStateAxis("trust", values.trust),
    values.attraction === undefined
      ? undefined
      : evaluateDynamicStateAxis("attraction", values.attraction),
    values.emotionalRegulation === undefined
      ? undefined
      : evaluateDynamicStateAxis("emotional_regulation", values.emotionalRegulation),
    values.powerPerception === undefined
      ? undefined
      : evaluateDynamicStateAxis("power_perception", values.powerPerception),
  ].filter((evaluation): evaluation is DynamicStateEvaluation => evaluation !== undefined);

  const visibleGuidance = evaluations
    .map((evaluation) => `${evaluation.band.speechTone} ${evaluation.band.reactionPattern}`)
    .join(" ");
  const hiddenGuidance = evaluations
    .map((evaluation) => evaluation.band.perception)
    .join(" ");

  return {
    evaluations,
    visibleGuidance,
    hiddenGuidance,
    compactPrompt: [
      "Dynamic State System: states bend personality, never replace it.",
      "Expose effects through tone, openness, initiative, and decision-making rather than raw numbers.",
      visibleGuidance,
    ].join(" "),
  };
}

function evaluateDynamicStateAxis(
  axis: DynamicStateAxis,
  value: number,
): DynamicStateEvaluation {
  return {
    axis,
    value,
    band: getDynamicStateBand(axis, value),
  };
}

function applyAxisAdjustment(
  axis: DynamicStateAxis,
  value: number | undefined,
  adjustment: number | undefined,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (adjustment === undefined) {
    return value;
  }

  const definition = dynamicStateAxes.find((candidate) => candidate.seed === axis);
  if (!definition) {
    return value + adjustment;
  }

  return clampStateValue(value + adjustment, definition.range);
}

function isOptionalAxis(axis: DynamicStateAxisDefinition): boolean {
  return axis.optional === true;
}

function getModifierAdjustment(
  modifier: DynamicStateModifierDefinition,
  axis: DynamicStateAxis,
): number | undefined {
  return modifier.adjustments[axis];
}

function clampStateValue(value: number, range: readonly [number, number]): number {
  return Math.min(range[1], Math.max(range[0], value));
}
