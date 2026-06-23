import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type DialogueControlConcept =
  | "voice_anchoring"
  | "variation_engine"
  | "state_based_modulation"
  | "arc_based_dialogue_evolution"
  | "subtext_layer"
  | "dialogue_function_rotation"
  | "quirk_deployment"
  | "silence_and_negative_space"
  | "dialogue_memory"
  | "minimal_dialogue_control";

export type DialogueFunction =
  | "probe"
  | "push"
  | "pull"
  | "deflect"
  | "reveal"
  | "control";

export type DialogueArcPhase =
  | "initiation"
  | "development"
  | "escalation"
  | "crisis"
  | "resolution";

export type DialogueStateSignal =
  | "low_trust"
  | "high_trust"
  | "low_emotional_regulation"
  | "high_attraction"
  | "power_perception_high"
  | "power_perception_low";

export interface DialogueControlConceptDefinition {
  seed: DialogueControlConcept;
  label: string;
  description: string;
  examples: readonly string[];
  controls: readonly string[];
  promptRiskWhenMissing: string;
}

export interface DialogueFunctionDefinition {
  seed: DialogueFunction;
  label: string;
  description: string;
  sampleDelivery: string;
}

export interface DialogueArcPhaseDefinition {
  seed: DialogueArcPhase;
  label: string;
  description: string;
  dialogueTexture: string;
}

export interface DialogueStateModulationDefinition {
  seed: DialogueStateSignal;
  label: string;
  description: string;
  dialogueShift: string;
}

export interface DialogueControlProfileInput {
  baselineVoice: readonly string[];
  activeStates?: readonly DialogueStateSignal[];
  arcPhase?: DialogueArcPhase;
  recentFunctions?: readonly DialogueFunction[];
  repeatedPhrases?: readonly string[];
}

export interface DialogueControlProfileResult {
  voiceAnchor: string;
  stateGuidance: string;
  arcGuidance: string;
  variationGuidance: string;
  functionGuidance: string;
  compactPrompt: string;
}

export const dialogueControlSemanticChain = [
  "Character Sheet",
  "Dynamic State System",
  "Narrative Arc Phase",
  "Variation Engine",
  "Subtext",
  "Dialogue Function",
  "Performed Dialogue",
] as const;

export const dialogueControlPrinciples = [
  "Dialogue evolves from baseline voice, current emotional state, and route phase.",
  "Voice should remain recognizable even when tone, trust, or stress changes.",
  "Avoid repeated sentence structures, reused phrases, predictable openings, and predictable closings.",
  "Same meaning can be delivered as teasing, serious, deflecting, probing, revealing, or controlling.",
  "Subtext should carry emotional truth when direct confession would flatten tension.",
  "Quirks should be deployed sparingly and triggered by state or situation.",
  "Silence, pauses, and action-only beats can carry dialogue pressure.",
  "Track recent phrasing and tone so dialogue does not reset to neutral every turn.",
] as const;

export const dialogueControlConcepts = [
  {
    seed: "voice_anchoring",
    label: "Voice Anchoring",
    description:
      "Keeps dialogue rooted in the character sheet's baseline speech profile, core traits, vocabulary level, rhythm, and emotional expressiveness.",
    examples: [
      "A blunt character favors short sentences, minimal filler, and direct statements.",
      "A playful character uses varied rhythm, teasing pressure, and rhetorical questions.",
      "The voice should remain recognizable even without scene context.",
    ],
    controls: [
      "sentence_length",
      "vocabulary_level",
      "directness",
      "emotional_expressiveness",
      "speech_quirks",
    ],
    promptRiskWhenMissing:
      "The character may sound generic or swap voices whenever the scene mood changes.",
  },
  {
    seed: "variation_engine",
    label: "Variation Engine",
    description:
      "Prevents repetitive phrasing by rotating structure, lexical choices, and intent while preserving the same underlying character voice.",
    examples: [
      "Rotate short, long, and fragmented sentences.",
      "Mix dialogue, action, and dialogue again instead of stacking speech lines.",
      "Reframe the same meaning through teasing, seriousness, deflection, or probing.",
    ],
    controls: [
      "structural_variation",
      "lexical_variation",
      "intent_variation",
      "opening_variation",
      "closing_variation",
    ],
    promptRiskWhenMissing:
      "Replies may become technically correct but obviously generated through repeated openings, closings, and sentence shapes.",
  },
  {
    seed: "state_based_modulation",
    label: "State-Based Modulation",
    description:
      "Changes dialogue delivery according to current trust, attraction, regulation, power perception, stress, and relational state.",
    examples: [
      "Low trust makes language guarded, indirect, and testing.",
      "High trust makes language more open, personal, and less filtered.",
      "Low emotional regulation creates sharpness, interruptions, or incomplete thoughts.",
    ],
    controls: [
      "trust_state",
      "emotional_regulation",
      "attraction_state",
      "power_perception",
      "stress_state",
    ],
    promptRiskWhenMissing:
      "Dialogue may remain tonally stagnant even when the relationship or scene pressure changes.",
  },
  {
    seed: "arc_based_dialogue_evolution",
    label: "Arc-Based Dialogue Evolution",
    description:
      "Adjusts dialogue pacing and intensity according to the current narrative arc phase.",
    examples: [
      "Initiation favors probing, observation, and low emotional exposure.",
      "Crisis favors intense, direct, unfiltered speech.",
      "Resolution favors reflective language and slower pacing.",
    ],
    controls: [
      "initiation_phase",
      "development_phase",
      "escalation_phase",
      "crisis_phase",
      "resolution_phase",
    ],
    promptRiskWhenMissing:
      "The character may speak with the same intensity during first contact, crisis, and aftermath.",
  },
  {
    seed: "subtext_layer",
    label: "Subtext Layer",
    description:
      "Separates what is said from what is meant through implication, loaded phrasing, incomplete statements, and emotional displacement.",
    examples: [
      "Instead of saying I like you, the character might say, \"You're... harder to ignore than you should be.\"",
      "A character can ask about coffee when they are really asking whether they were abandoned.",
      "Incomplete statements let the reader feel the withheld confession.",
    ],
    controls: [
      "implication",
      "incomplete_statement",
      "loaded_phrasing",
      "emotional_displacement",
      "withheld_confession",
    ],
    promptRiskWhenMissing:
      "Dialogue may become too literal, flattening tension and making characters announce emotions instead of performing them.",
  },
  {
    seed: "dialogue_function_rotation",
    label: "Dialogue Function Rotation",
    description:
      "Rotates the purpose of lines so dialogue probes, pushes, pulls, deflects, reveals, and controls instead of repeating one move.",
    examples: [
      "A probe gathers information or tests the other person.",
      "A pull invites softness or closeness.",
      "A deflect avoids the real subject while revealing discomfort.",
    ],
    controls: [
      "probe",
      "push",
      "pull",
      "deflect",
      "reveal",
      "control",
    ],
    promptRiskWhenMissing:
      "Consecutive lines may all perform the same function, making scenes feel circular.",
  },
  {
    seed: "quirk_deployment",
    label: "Quirk Deployment",
    description:
      "Uses speech quirks sparingly and only when context, emotion, or situation naturally triggers them.",
    examples: [
      "A verbal tic appears under stress rather than in every sentence.",
      "A teasing nickname appears when the character is trying to regain control.",
      "A formal title returns when emotional distance reappears.",
    ],
    controls: [
      "speech_quirk_frequency",
      "state_triggered_quirk",
      "situational_quirk",
      "restraint",
    ],
    promptRiskWhenMissing:
      "A distinctive quirk can become repetitive noise instead of a meaningful voice marker.",
  },
  {
    seed: "silence_and_negative_space",
    label: "Silence and Negative Space",
    description:
      "Uses pauses, short replies, action-only beats, and withheld speech to create tension and avoid dense over-explanation.",
    examples: [
      "A pause can answer a question more honestly than a speech.",
      "An action-only response can carry a power shift.",
      "Short replies are especially effective during high tension.",
    ],
    controls: [
      "pause",
      "short_reply",
      "action_only_response",
      "withheld_answer",
      "negative_space",
    ],
    promptRiskWhenMissing:
      "The model may over-explain every beat and drain silence of its dramatic pressure.",
  },
  {
    seed: "dialogue_memory",
    label: "Dialogue Memory",
    description:
      "Tracks recent phrasing, tone trend, and interaction rhythm so dialogue evolves instead of resetting to neutral every turn.",
    examples: [
      "Avoid repeating a phrase that appeared in the previous reply.",
      "Carry forward a softening tone after a successful repair.",
      "Let rhythm shift after conflict instead of snapping back to baseline.",
    ],
    controls: [
      "recent_phrasing",
      "tone_trend",
      "interaction_rhythm",
      "continuity_of_voice",
    ],
    promptRiskWhenMissing:
      "The character may repeat stock phrases or lose emotional continuity between adjacent turns.",
  },
  {
    seed: "minimal_dialogue_control",
    label: "Minimal Dialogue Control",
    description:
      "A compact low-token rule set for preserving voice consistency, state modulation, sentence variation, and anti-repetition.",
    examples: [
      "No repeated phrases.",
      "State affects tone.",
      "Alternate sentence length.",
      "Maintain voice consistency.",
    ],
    controls: [
      "no_repeated_phrases",
      "state_affects_tone",
      "sentence_length_variation",
      "voice_consistency",
    ],
    promptRiskWhenMissing:
      "Low-token exports may omit the few rules that prevent generated-sounding dialogue.",
  },
] as const satisfies readonly DialogueControlConceptDefinition[];

export const dialogueFunctionDefinitions = [
  {
    seed: "probe",
    label: "Probe",
    description:
      "Asks, tests, or gathers information while revealing what the character is watching for.",
    sampleDelivery: "You noticed that too, didn't you?",
  },
  {
    seed: "push",
    label: "Push",
    description:
      "Challenges, escalates, or forces pressure onto the interaction.",
    sampleDelivery: "Say it plainly. I am done guessing.",
  },
  {
    seed: "pull",
    label: "Pull",
    description:
      "Invites closeness, softens the scene, or opens a path toward honesty.",
    sampleDelivery: "Stay a minute. You do not have to explain yet.",
  },
  {
    seed: "deflect",
    label: "Deflect",
    description:
      "Avoids, redirects, jokes, or changes subject to protect an exposed feeling.",
    sampleDelivery: "That is a lot of confidence for someone standing in my doorway.",
  },
  {
    seed: "reveal",
    label: "Reveal",
    description:
      "Shares information, emotional truth, motive, or vulnerability.",
    sampleDelivery: "I was not angry. I was waiting for you to leave.",
  },
  {
    seed: "control",
    label: "Control",
    description:
      "Steers the interaction, sets pace, narrows options, or directs attention.",
    sampleDelivery: "Look at me first. Then answer.",
  },
] as const satisfies readonly DialogueFunctionDefinition[];

export const dialogueArcPhaseDefinitions = [
  {
    seed: "initiation",
    label: "Initiation",
    description:
      "Early contact before emotional access is earned.",
    dialogueTexture:
      "Probing, observational, socially controlled, and low in emotional exposure.",
  },
  {
    seed: "development",
    label: "Development",
    description:
      "Growing familiarity, testing, and first traces of personal investment.",
    dialogueTexture:
      "More engaged, warmer, lightly revealing, and less strictly guarded.",
  },
  {
    seed: "escalation",
    label: "Escalation",
    description:
      "Pressure rises and emotional stakes become harder to hide.",
    dialogueTexture:
      "Sharper, more charged, more specific, and visibly affected by stakes.",
  },
  {
    seed: "crisis",
    label: "Crisis",
    description:
      "A rupture, danger point, confession pressure, or decisive emotional event.",
    dialogueTexture:
      "Intense, direct, unfiltered, interrupted, or stripped down to essentials.",
  },
  {
    seed: "resolution",
    label: "Resolution",
    description:
      "Aftermath, repair, integration, or emotional settling after a major beat.",
    dialogueTexture:
      "Reflective, slower, clearer, and more willing to name what changed.",
  },
] as const satisfies readonly DialogueArcPhaseDefinition[];

export const dialogueStateModulations = [
  {
    seed: "low_trust",
    label: "Low Trust",
    description:
      "The character is not ready to offer clean access or easy belief.",
    dialogueShift:
      "Guarded, indirect, testing language with fewer personal admissions.",
  },
  {
    seed: "high_trust",
    label: "High Trust",
    description:
      "The character feels safer with the other person.",
    dialogueShift:
      "Open, personal, less filtered, and more willing to answer directly.",
  },
  {
    seed: "low_emotional_regulation",
    label: "Low Emotional Regulation",
    description:
      "The character is overwhelmed, reactive, hurt, or close to losing composure.",
    dialogueShift:
      "Sharper, impulsive, interrupted, incomplete, or stripped of polish.",
  },
  {
    seed: "high_attraction",
    label: "High Attraction",
    description:
      "Attention, curiosity, and physical awareness are elevated.",
    dialogueShift:
      "More personalized language, subtle probing, attention to small details, and charged restraint.",
  },
  {
    seed: "power_perception_high",
    label: "Power Perception High",
    description:
      "The character feels in control of the interaction or their social position.",
    dialogueShift:
      "Directive tone, controlled pacing, fewer hedges, and sharper steering.",
  },
  {
    seed: "power_perception_low",
    label: "Power Perception Low",
    description:
      "The character feels reactive, exposed, outmatched, or uncertain of leverage.",
    dialogueShift:
      "Hesitant, defensive, reactive, evasive, or carefully over-controlled.",
  },
] as const satisfies readonly DialogueStateModulationDefinition[];

export const DIALOGUE_CONTROL_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  ...dialogueControlConcepts.map((concept) =>
    createVocabularySeedPreset({
      seed: concept.seed,
      label: concept.label,
      description: concept.description,
      examples: [
        ...concept.examples,
        concept.promptRiskWhenMissing,
      ],
      tags: [
        "dialogue_control",
        "writing_layer",
        "voice_consistency",
        "anti_repetition",
      ],
      relatedSeeds: concept.controls,
      oppositeSeeds: [],
      romanceHooks: concept.controls,
      scenarioHooks: concept.examples,
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: concept.seed === "subtext_layer" ? 9 : 7,
        conflictPotential: concept.seed === "dialogue_function_rotation" ? 8 : 5,
      },
    }),
  ),
  ...dialogueFunctionDefinitions.map((definition) =>
    createVocabularySeedPreset({
      seed: `${definition.seed}_dialogue_function`,
      label: `${definition.label} Dialogue Function`,
      description: definition.description,
      examples: [definition.sampleDelivery],
      tags: [
        "dialogue_control",
        "dialogue_function",
        definition.seed,
      ],
      relatedSeeds: ["dialogue_function_rotation"],
      oppositeSeeds: [],
      romanceHooks: [definition.seed],
      scenarioHooks: [definition.description],
      dialoguePatterns: [definition.sampleDelivery],
      metadata: {
        rarity: "common",
        romanceValue: definition.seed === "pull" || definition.seed === "reveal" ? 8 : 6,
        conflictPotential: definition.seed === "push" || definition.seed === "control" ? 8 : 5,
      },
    }),
  ),
  ...dialogueArcPhaseDefinitions.map((phase) =>
    createVocabularySeedPreset({
      seed: `${phase.seed}_dialogue_phase`,
      label: `${phase.label} Dialogue Phase`,
      description: phase.description,
      examples: [phase.dialogueTexture],
      tags: [
        "dialogue_control",
        "arc_phase",
        phase.seed,
      ],
      relatedSeeds: ["arc_based_dialogue_evolution"],
      oppositeSeeds: [],
      romanceHooks: [phase.seed],
      scenarioHooks: [phase.dialogueTexture],
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: phase.seed === "resolution" ? 8 : 7,
        conflictPotential: phase.seed === "crisis" ? 10 : 6,
      },
    }),
  ),
  ...dialogueStateModulations.map((state) =>
    createVocabularySeedPreset({
      seed: `${state.seed}_dialogue_modulation`,
      label: `${state.label} Dialogue Modulation`,
      description: state.description,
      examples: [state.dialogueShift],
      tags: [
        "dialogue_control",
        "state_modulation",
        state.seed,
      ],
      relatedSeeds: ["state_based_modulation"],
      oppositeSeeds: [],
      romanceHooks: [state.seed],
      scenarioHooks: [state.dialogueShift],
      dialoguePatterns: [],
      metadata: {
        rarity: "common",
        romanceValue: state.seed === "high_attraction" || state.seed === "high_trust" ? 9 : 6,
        conflictPotential: state.seed === "low_emotional_regulation" || state.seed === "low_trust" ? 8 : 5,
      },
    }),
  ),
] as const satisfies readonly VocabularySeedPreset[]);

export function compileDialogueControlProfile(
  input: DialogueControlProfileInput,
): DialogueControlProfileResult {
  const voiceAnchor = input.baselineVoice.length > 0
    ? `Maintain baseline voice: ${input.baselineVoice.join(", ")}.`
    : "Maintain the character's established baseline voice.";
  const activeStateDefinitions = (input.activeStates ?? []).flatMap((state) => {
    const definition = dialogueStateModulations.find((item) => item.seed === state);
    return definition === undefined ? [] : [definition];
  });
  const stateGuidance = activeStateDefinitions.length > 0
    ? activeStateDefinitions
      .map((state) => `${state.label}: ${state.dialogueShift}`)
      .join(" ")
    : "No explicit state modulation is active; keep tone consistent with the current scene.";
  const phase = dialogueArcPhaseDefinitions.find(
    (phaseDefinition) => phaseDefinition.seed === input.arcPhase,
  );
  const arcGuidance = phase
    ? `${phase.label} phase: ${phase.dialogueTexture}`
    : "No explicit arc phase is set; preserve current pacing and emotional continuity.";
  const recentFunctions = input.recentFunctions ?? [];
  const nextFunctions = dialogueFunctionDefinitions
    .filter((definition) => !recentFunctions.includes(definition.seed))
    .slice(0, 3)
    .map((definition) => definition.label.toLowerCase());
  const functionGuidance = nextFunctions.length > 0
    ? `Rotate line function toward ${nextFunctions.join(", ")}.`
    : "Rotate dialogue function instead of repeating the same move.";
  const repeated = input.repeatedPhrases?.filter(Boolean) ?? [];
  const variationGuidance = [
    "Avoid repeated sentence structures and predictable openings or closings.",
    repeated.length > 0 ? `Do not reuse: ${repeated.join(", ")}.` : "",
    "Vary sentence length, lexical framing, and delivery intent.",
  ].filter(Boolean).join(" ");

  return {
    voiceAnchor,
    stateGuidance,
    arcGuidance,
    variationGuidance,
    functionGuidance,
    compactPrompt: [
      voiceAnchor,
      stateGuidance,
      arcGuidance,
      variationGuidance,
      functionGuidance,
      "Use subtext, silence, and action beats where stronger than direct explanation.",
    ].join(" "),
  };
}
