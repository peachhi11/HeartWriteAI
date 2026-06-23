import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type NarrativeArcPhase =
  | "initiation"
  | "development"
  | "escalation"
  | "crisis_turning_point"
  | "resolution_stabilization";

export type NarrativeEventScale =
  | "micro_event"
  | "meso_event"
  | "major_event"
  | "soft_interpersonal_event"
  | "environmental_hook";

export type NarrativePacingMode = "slow_burn" | "fast_paced" | "chaotic";

export type NarrativeFatigueSignal =
  | "too_calm"
  | "too_chaotic"
  | "too_repetitive"
  | "premature_crisis"
  | "dragging_resolution";

export type NarrativeStateMovementSpeed = "slow" | "fluctuating" | "rapid" | "extreme" | "stabilizing";

export interface NarrativeArcPhaseDefinition {
  seed: NarrativeArcPhase;
  label: string;
  goal: string;
  characteristics: readonly string[];
  allowedEvents: readonly NarrativeEventScale[];
  stateBehavior: readonly string[];
  constraints: readonly string[];
  failureMode: string;
  transitionSignals: readonly string[];
  stateMovementSpeed: NarrativeStateMovementSpeed;
}

export interface NarrativePacingModeDefinition {
  seed: NarrativePacingMode;
  label: string;
  description: string;
  phaseBehavior: string;
  transitionBias: string;
}

export interface NarrativeArcCorrectionRule {
  seed: NarrativeFatigueSignal;
  label: string;
  description: string;
  correction: string;
  targetPhase?: NarrativeArcPhase;
}

export interface NarrativeArcControllerInput {
  currentPhase: NarrativeArcPhase;
  dominantState: string;
  pacingMode?: NarrativePacingMode;
  stateThresholds?: readonly string[];
  eventOutcomes?: readonly string[];
  fatigueSignals?: readonly NarrativeFatigueSignal[];
}

export interface NarrativeArcControllerResult {
  phase: NarrativeArcPhase;
  allowedEvents: readonly NarrativeEventScale[];
  blockedEvents: readonly string[];
  stateMovementSpeed: NarrativeStateMovementSpeed;
  transitionCandidates: readonly NarrativeArcPhase[];
  correctionGuidance: readonly string[];
  compactPrompt: string;
}

export const narrativeArcControllerSemanticChain = [
  "Current Phase",
  "Allowed Event Type",
  "Event Outcome",
  "State Change",
  "Behavior Modulation",
  "Next Phase Pressure",
] as const;

export const narrativeArcControllerPrinciples = [
  "Phase controls events; events change states; states modify behavior.",
  "States alone should not drive the story, and events alone should not drive the story.",
  "Early phases protect slow burn by restricting premature crisis beats.",
  "Escalation increases stakes, but crisis should still require a turning-point event.",
  "Resolution should process consequences and establish a new baseline instead of looping forever.",
  "Arc correction should respond to calm, chaos, repetition, premature crisis, or dragging aftermath.",
] as const;

export const narrativeArcPhases = [
  {
    seed: "initiation",
    label: "Phase 1 - Initiation",
    goal:
      "Establish tone, relationship dynamic, baseline states, and the first points of curiosity.",
    characteristics: [
      "low stakes",
      "high curiosity",
      "subtle tension",
      "baseline state discovery",
    ],
    allowedEvents: [
      "micro_event",
      "environmental_hook",
    ],
    stateBehavior: [
      "trust grows slowly",
      "attraction stays in curiosity stage",
      "power dynamic is being established",
    ],
    constraints: [
      "no confessions",
      "no extreme attachment",
      "no major betrayal",
      "no irreversible crisis",
    ],
    failureMode:
      "Moving too fast kills slow burn and makes later intimacy feel unearned.",
    transitionSignals: [
      "repeated successful interactions",
      "trust above early threshold",
      "baseline dynamic established",
    ],
    stateMovementSpeed: "slow",
  },
  {
    seed: "development",
    label: "Phase 2 - Development",
    goal:
      "Build connection, behavior patterns, tension loops, and early emotional investment.",
    characteristics: [
      "repeated interactions with variation",
      "growing investment",
      "recognizable pattern formation",
      "early vulnerability",
    ],
    allowedEvents: [
      "micro_event",
      "meso_event",
      "environmental_hook",
      "soft_interpersonal_event",
    ],
    stateBehavior: [
      "trust fluctuates",
      "attraction grows or destabilizes",
      "power dynamics start shifting",
    ],
    constraints: [
      "avoid repetition loops",
      "avoid full crisis before emotional investment exists",
      "keep vulnerability partial and earned",
    ],
    failureMode:
      "Repeated scenes can loop without changing the dynamic or creating new pressure.",
    transitionSignals: [
      "emotional investment detected",
      "attraction rising",
      "conflict rising",
      "pattern has become too stable",
    ],
    stateMovementSpeed: "fluctuating",
  },
  {
    seed: "escalation",
    label: "Phase 3 - Escalation",
    goal:
      "Increase stakes, sharpen conflict, and make emotional exposure harder to avoid.",
    characteristics: [
      "meaningful conflict",
      "visible emotional stakes",
      "pressure from choices",
      "instability possible",
    ],
    allowedEvents: [
      "meso_event",
      "major_event",
      "soft_interpersonal_event",
    ],
    stateBehavior: [
      "states change rapidly",
      "threshold triggers become possible",
      "attraction or conflict destabilizes behavior",
    ],
    constraints: [
      "avoid chaos without direction",
      "major events should be selective",
      "do not resolve the central tension too soon",
    ],
    failureMode:
      "Escalation becomes noise if events pile up without a clear turning pressure.",
    transitionSignals: [
      "major tension unresolved",
      "states unstable",
      "choice pressure rising",
      "external and internal arcs intersect",
    ],
    stateMovementSpeed: "rapid",
  },
  {
    seed: "crisis_turning_point",
    label: "Phase 4 - Crisis / Turning Point",
    goal:
      "Force irreversible change through decision, revelation, confession, rupture, or confrontation.",
    characteristics: [
      "high tension",
      "critical decisions",
      "emotional peak",
      "irreversible consequence",
    ],
    allowedEvents: [
      "major_event",
    ],
    stateBehavior: [
      "extreme shifts",
      "threshold triggers activate",
      "avoidance patterns break or harden",
    ],
    constraints: [
      "no small talk loops",
      "no low-stakes filler",
      "do not trigger crisis before escalation has earned it",
    ],
    failureMode:
      "The crisis feels underwhelming if it has no cost, or premature if the route has not built enough pressure.",
    transitionSignals: [
      "decision occurs",
      "revelation occurs",
      "confession occurs",
      "separation or confrontation changes the dynamic",
    ],
    stateMovementSpeed: "extreme",
  },
  {
    seed: "resolution_stabilization",
    label: "Phase 5 - Resolution / Stabilization",
    goal:
      "Resolve tension, process consequences, or redefine the relationship into a new equilibrium.",
    characteristics: [
      "emotional processing",
      "new equilibrium",
      "aftermath",
      "trust recalibration",
    ],
    allowedEvents: [
      "soft_interpersonal_event",
      "micro_event",
    ],
    stateBehavior: [
      "states stabilize",
      "trust resets at a new baseline",
      "new rules or rituals emerge",
    ],
    constraints: [
      "avoid dragging the aftermath too long",
      "avoid reopening crisis without new pressure",
      "do not erase consequences instantly",
    ],
    failureMode:
      "Dragging too long turns emotional processing into boredom or circular reassurance.",
    transitionSignals: [
      "new baseline established",
      "repair or separation has consequences",
      "next arc seed appears",
    ],
    stateMovementSpeed: "stabilizing",
  },
] as const satisfies readonly NarrativeArcPhaseDefinition[];

export const narrativePacingModes = [
  {
    seed: "slow_burn",
    label: "Slow Burn",
    description:
      "Keeps the route longer in initiation and development, delaying escalation until repeated interactions make it earned.",
    phaseBehavior:
      "Stay longer in Phase 1 and Phase 2; delay confession, crisis, and major rupture triggers.",
    transitionBias:
      "Requires more successful interactions, fatigue evidence, or unresolved pressure before moving forward.",
  },
  {
    seed: "fast_paced",
    label: "Fast-Paced",
    description:
      "Moves quickly toward escalation and crisis by injecting earlier conflict and sharper event pressure.",
    phaseBehavior:
      "Shorten Phase 1 and Phase 2; allow earlier meso events and earlier pressure.",
    transitionBias:
      "Accepts fewer setup beats before escalation if the story premise supports intensity.",
  },
  {
    seed: "chaotic",
    label: "Chaotic",
    description:
      "Allows partial phase overlap while still using the current phase as a stabilizing center.",
    phaseBehavior:
      "Permit overlap between development, escalation, and crisis, but require stabilization after spikes.",
    transitionBias:
      "Moves quickly under pressure, then forces correction when chaos starts erasing meaning.",
  },
] as const satisfies readonly NarrativePacingModeDefinition[];

export const narrativeArcCorrectionRules = [
  {
    seed: "too_calm",
    label: "Too Calm",
    description:
      "The route has low pressure, no meaningful change, or too many low-stakes turns in a row.",
    correction:
      "Inject an escalation event or a new meso-level interpersonal complication.",
    targetPhase: "escalation",
  },
  {
    seed: "too_chaotic",
    label: "Too Chaotic",
    description:
      "The route has too many spikes, competing crises, or emotional turns without processing space.",
    correction:
      "Force a stabilization event, narrow the active conflict, or process consequences before adding new pressure.",
    targetPhase: "resolution_stabilization",
  },
  {
    seed: "too_repetitive",
    label: "Too Repetitive",
    description:
      "The route repeats the same event category, emotional function, or state movement without new information.",
    correction:
      "Shift phase or introduce a new event category that changes the relationship pattern.",
  },
  {
    seed: "premature_crisis",
    label: "Premature Crisis",
    description:
      "A crisis-level event appears before initiation, development, or escalation has earned the payoff.",
    correction:
      "Downshift into development or escalation pressure instead of treating the event as irreversible crisis.",
    targetPhase: "development",
  },
  {
    seed: "dragging_resolution",
    label: "Dragging Resolution",
    description:
      "The aftermath has processed the same emotional material for too long without a new equilibrium or next arc seed.",
    correction:
      "Lock the new baseline, introduce a next-arc hook, or close the current route beat.",
  },
] as const satisfies readonly NarrativeArcCorrectionRule[];

export const NARRATIVE_ARC_CONTROLLER_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  ...narrativeArcPhases.map((phase) =>
    createVocabularySeedPreset({
      seed: phase.seed,
      label: phase.label,
      description: phase.goal,
      examples: [
        ...phase.characteristics,
        ...phase.stateBehavior,
        phase.failureMode,
      ],
      tags: [
        "narrative_arc_controller",
        "route_phase",
        phase.stateMovementSpeed,
      ],
      relatedSeeds: [
        ...phase.allowedEvents,
        ...phase.transitionSignals,
      ],
      oppositeSeeds: phase.constraints,
      romanceHooks: phase.transitionSignals,
      scenarioHooks: phase.allowedEvents,
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: phase.seed === "resolution_stabilization" ? 8 : 7,
        conflictPotential: phase.seed === "crisis_turning_point" ? 10 : 6,
      },
    }),
  ),
  ...narrativePacingModes.map((mode) =>
    createVocabularySeedPreset({
      seed: mode.seed,
      label: mode.label,
      description: mode.description,
      examples: [
        mode.phaseBehavior,
        mode.transitionBias,
      ],
      tags: [
        "narrative_arc_controller",
        "pacing_mode",
        mode.seed,
      ],
      relatedSeeds: ["phase_transition", "state_movement_speed"],
      oppositeSeeds: [],
      romanceHooks: [mode.seed],
      scenarioHooks: [mode.phaseBehavior],
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: mode.seed === "slow_burn" ? 9 : 7,
        conflictPotential: mode.seed === "fast_paced" || mode.seed === "chaotic" ? 9 : 5,
      },
    }),
  ),
  ...narrativeArcCorrectionRules.map((rule) =>
    createVocabularySeedPreset({
      seed: `${rule.seed}_arc_correction`,
      label: `${rule.label} Arc Correction`,
      description: rule.description,
      examples: [rule.correction],
      tags: [
        "narrative_arc_controller",
        "arc_correction",
        rule.seed,
      ],
      relatedSeeds: "targetPhase" in rule ? [rule.targetPhase] : [],
      oppositeSeeds: [],
      romanceHooks: [rule.seed],
      scenarioHooks: [rule.correction],
      dialoguePatterns: [],
      metadata: {
        rarity: "uncommon",
        romanceValue: 6,
        conflictPotential: rule.seed === "too_calm" ? 8 : 6,
      },
    }),
  ),
] as const satisfies readonly VocabularySeedPreset[]);

export function evaluateNarrativeArcController(
  input: NarrativeArcControllerInput,
): NarrativeArcControllerResult {
  const phase = findNarrativeArcPhase(input.currentPhase);
  const pacingMode = narrativePacingModes.find((mode) => mode.seed === input.pacingMode);
  const correctionRules = (input.fatigueSignals ?? []).flatMap((signal) => {
    const rule = narrativeArcCorrectionRules.find((item) => item.seed === signal);
    return rule === undefined ? [] : [rule];
  });
  const transitionCandidates = inferTransitionCandidates(input, phase);
  const blockedEvents = inferBlockedEvents(phase);
  const correctionGuidance = correctionRules.map((rule) => rule.correction);

  return {
    phase: phase.seed,
    allowedEvents: phase.allowedEvents,
    blockedEvents,
    stateMovementSpeed: phase.stateMovementSpeed,
    transitionCandidates,
    correctionGuidance,
    compactPrompt: [
      `${phase.label}: ${phase.goal}`,
      `Allowed events: ${phase.allowedEvents.join(", ")}.`,
      `State movement speed: ${phase.stateMovementSpeed}.`,
      pacingMode ? `Pacing mode: ${pacingMode.phaseBehavior}` : "",
      correctionGuidance.length > 0
        ? `Correction: ${correctionGuidance.join(" ")}`
        : "",
      "Golden rule: phase controls events; events change states; states modify behavior.",
    ].filter(Boolean).join(" "),
  };
}

function findNarrativeArcPhase(phaseKey: NarrativeArcPhase): NarrativeArcPhaseDefinition {
  return narrativeArcPhases.find((phase) => phase.seed === phaseKey) ?? narrativeArcPhases[0];
}

function inferTransitionCandidates(
  input: NarrativeArcControllerInput,
  phase: NarrativeArcPhaseDefinition,
): readonly NarrativeArcPhase[] {
  const signals = [
    ...(input.stateThresholds ?? []),
    ...(input.eventOutcomes ?? []),
    ...(input.fatigueSignals ?? []),
  ].join(" ").toLowerCase();

  if (input.fatigueSignals?.includes("premature_crisis")) {
    return ["development"];
  }
  if (input.fatigueSignals?.includes("too_chaotic")) {
    return ["resolution_stabilization"];
  }
  if (input.fatigueSignals?.includes("too_calm")) {
    return phase.seed === "initiation" ? ["development"] : ["escalation"];
  }
  if (phase.seed === "initiation" && /successful|trust|baseline/.test(signals)) {
    return ["development"];
  }
  if (phase.seed === "development" && /investment|attraction|conflict|repetition/.test(signals)) {
    return ["escalation"];
  }
  if (phase.seed === "escalation" && /unresolved|unstable|choice|intersect/.test(signals)) {
    return ["crisis_turning_point"];
  }
  if (phase.seed === "crisis_turning_point" && /decision|revelation|confession|separation|confrontation/.test(signals)) {
    return ["resolution_stabilization"];
  }
  if (phase.seed === "resolution_stabilization" && /new baseline|next arc|repair|separation/.test(signals)) {
    return ["initiation", "development"];
  }
  return [];
}

function inferBlockedEvents(phase: NarrativeArcPhaseDefinition): readonly string[] {
  if (phase.seed === "initiation") {
    return [
      "confession",
      "extreme attachment",
      "major betrayal",
      "irreversible crisis",
    ];
  }
  if (phase.seed === "crisis_turning_point") {
    return [
      "small talk loop",
      "low-stakes filler",
      "soft reset without consequence",
    ];
  }
  if (phase.seed === "resolution_stabilization") {
    return [
      "new crisis without processing",
      "instant consequence erasure",
      "reopened rupture without new pressure",
    ];
  }
  return phase.constraints;
}
