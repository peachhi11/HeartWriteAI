export type CharacterBlueprintSystemKey =
  | "cognitive"
  | "psychological"
  | "affective_somatic"
  | "interpersonal";

export interface CharacterBlueprintField {
  key: string;
  label: string;
  prompt: string;
  placeholder: string;
  tags: readonly string[];
}

export interface CharacterBlueprintSection {
  key: CharacterBlueprintSystemKey;
  title: string;
  subtitle: string;
  description: string;
  fields: readonly CharacterBlueprintField[];
}

export interface CharacterBlueprintReferenceEntry {
  key: string;
  label: string;
  description: string;
  tags: readonly string[];
  signals?: readonly string[];
}

export interface CharacterBlueprintReferenceAxis {
  key: string;
  label: string;
  description: string;
  entries: readonly CharacterBlueprintReferenceEntry[];
}

export interface WholeSystemCharacterBlueprintInput {
  characterName?: string;
  cognitive?: Partial<Record<WholeSystemBlueprintFieldKey<"cognitive">, string>>;
  psychological?: Partial<Record<WholeSystemBlueprintFieldKey<"psychological">, string>>;
  affectiveSomatic?: Partial<Record<WholeSystemBlueprintFieldKey<"affective_somatic">, string>>;
  interpersonal?: Partial<Record<WholeSystemBlueprintFieldKey<"interpersonal">, string>>;
}

export type WholeSystemBlueprintFieldKey<TSection extends CharacterBlueprintSystemKey> =
  typeof wholeSystemCharacterBlueprintSections[number] extends infer T
    ? T extends { key: TSection; fields: readonly (infer TField)[] }
      ? TField extends { key: infer TKey }
        ? TKey extends string ? TKey : never
        : never
      : never
    : never;

export const wholeSystemCharacterBlueprintSections = [
  {
    key: "cognitive",
    title: "The Cognitive System",
    subtitle: "The Brain Architecture",
    description:
      "Defines how the character processes information, prioritizes attention, solves problems, and stalls under mental friction.",
    fields: [
      {
        key: "dominantQuadrant",
        label: "Dominant Quadrant",
        prompt:
          "The thinking mode they instinctively trust when pressure rises.",
        placeholder: "Upper-left analytical, lower-right relational, etc.",
        tags: ["cognitive", "decision_engine", "attention"],
      },
      {
        key: "blindSpotQuadrant",
        label: "Blind Spot Quadrant",
        prompt:
          "The mental processing style they ignore, distrust, or struggle to use cleanly.",
        placeholder: "Ignores relational nuance, avoids logistics, resists emotional data.",
        tags: ["cognitive", "blind_spot", "friction"],
      },
      {
        key: "primaryCognitiveDriveOne",
        label: "Primary Cognitive Drive 1",
        prompt:
          "The first recurring drive shaping daily choices and problem solving.",
        placeholder: "Pattern mastery - reduces uncertainty by naming systems quickly.",
        tags: ["cognitive_driver", "motivation", "choice"],
      },
      {
        key: "primaryCognitiveDriveTwo",
        label: "Primary Cognitive Drive 2",
        prompt:
          "The second recurring drive that competes with or reinforces the first.",
        placeholder: "Relational monitoring - reads small shifts in tone before facts.",
        tags: ["cognitive_driver", "motivation", "choice"],
      },
      {
        key: "intellectualFrictionTrigger",
        label: "Intellectual Friction Trigger",
        prompt:
          "The type of data, ambiguity, contradiction, or chaos that stalls their brain.",
        placeholder: "Contradictory emotional signals with no clear authority to consult.",
        tags: ["trigger", "cognitive_friction", "stress"],
      },
    ],
  },
  {
    key: "psychological",
    title: "The Psychological System",
    subtitle: "The Core Psyche",
    description:
      "Defines the internal landscape, historical programming, ego defenses, self-deception, and the identity they perform to survive.",
    fields: [
      {
        key: "coreWoundLie",
        label: "The Core Wound",
        prompt:
          "The fundamental false belief they hold about themselves, other people, or the world.",
        placeholder: "If people see the real me, they will leave.",
        tags: ["wound", "internalized_lie", "psychology"],
      },
      {
        key: "existentialNeed",
        label: "The Existential Need",
        prompt:
          "The psychological element they chase to feel whole, safe, chosen, or real.",
        placeholder: "To be chosen without having to compete for it.",
        tags: ["hidden_need", "desire", "psychology"],
      },
      {
        key: "shadowSelf",
        label: "The Shadow",
        prompt:
          "The traits they possess but refuse to admit, integrate, or forgive in themselves.",
        placeholder: "Neediness, envy, tenderness, ambition, cruelty, dependence.",
        tags: ["shadow", "repressed_self", "psychology"],
      },
      {
        key: "personaMask",
        label: "The Persona",
        prompt:
          "The identity narrative they present to the world so no one sees the wound directly.",
        placeholder: "The competent one, the untouchable one, the harmless one.",
        tags: ["persona", "social_mask", "identity"],
      },
      {
        key: "rationalizationEngine",
        label: "The Rationalization Engine",
        prompt:
          "The self-justifying story they use to excuse their worst or most avoidant actions.",
        placeholder: "I am protecting them by keeping control of the truth.",
        tags: ["defense", "self_deception", "conflict"],
      },
    ],
  },
  {
    key: "affective_somatic",
    title: "The Affective-Somatic System",
    subtitle: "The Nervous System",
    description:
      "Defines how emotional energy is internalized, stored in the body, converted into safer feelings, and discharged under overload.",
    fields: [
      {
        key: "baselineResonance",
        label: "Baseline Resonance",
        prompt:
          "Their default emotional disposition and mood anchor before a scene disrupts them.",
        placeholder: "Quietly vigilant, warm but tired, brittle composure.",
        tags: ["affect", "baseline_mood", "emotion"],
      },
      {
        key: "musculoskeletalAnchor",
        label: "Musculoskeletal Anchor",
        prompt:
          "Where psychological tension settles in the body as a repeated physical pattern.",
        placeholder: "Jaw, shoulders, hands, stomach, throat, lower back.",
        tags: ["somatic", "body_tension", "physical_tell"],
      },
      {
        key: "outlawedAffect",
        label: "Outlawed Affect",
        prompt:
          "The emotion they refuse to feel, name, or show because it threatens the persona.",
        placeholder: "Need, grief, anger, fear, jealousy, tenderness.",
        tags: ["emotion", "shadow", "avoidance"],
      },
      {
        key: "transmutationMechanism",
        label: "Transmutation Mechanism",
        prompt:
          "How they convert the outlawed emotion into a safer or more socially acceptable one.",
        placeholder: "Turns fear into sarcasm, grief into competence, need into control.",
        tags: ["response", "defense", "emotional_conversion"],
      },
      {
        key: "autonomicHijackTell",
        label: "Autonomic Hijack Tell",
        prompt:
          "The involuntary fight, flight, freeze, or fawn symptoms that appear when triggered.",
        placeholder: "Cold hands, shallow breathing, locked knees, voice going flat.",
        tags: ["somatic", "trigger", "stress_response"],
      },
      {
        key: "somaticCrisis",
        label: "The Somatic Crisis",
        prompt:
          "The physical breakdown that happens when their mental load can no longer be contained.",
        placeholder: "Migraine, shaking, collapse, nausea, dissociation-like stillness.",
        tags: ["somatic", "overload", "crisis"],
      },
    ],
  },
  {
    key: "interpersonal",
    title: "The Interpersonal System",
    subtitle: "The Behavioral Coupling",
    description:
      "Defines how internal pressure becomes relational behavior, social friction, boundaries, currency, and repair.",
    fields: [
      {
        key: "relationalPolarity",
        label: "Relational Polarity",
        prompt:
          "Their default attachment stance when pressure rises: moving toward, away, or against people.",
        placeholder: "Moves toward for reassurance, away for control, against for protection.",
        tags: ["attachment", "relationship_dynamic", "stress_response"],
      },
      {
        key: "boundaryArchitecture",
        label: "Boundary Architecture",
        prompt:
          "How they protect emotional and physical space: rigid, porous, chameleon, or mixed.",
        placeholder: "Rigid with strangers, porous with loved ones, chameleon under authority.",
        tags: ["boundary", "relationship_dynamic", "agency"],
      },
      {
        key: "communicationGlitch",
        label: "Communication Glitch",
        prompt:
          "How their verbal patterns warp under stress before they can consciously correct them.",
        placeholder: "Overexplains, goes cold, jokes, becomes formal, stops asking directly.",
        tags: ["speech_pattern", "conflict_style", "stress_response"],
      },
      {
        key: "transactionalCurrency",
        label: "Transactional Currency",
        prompt:
          "The behavior they offer to buy safety, closeness, forgiveness, control, or compliance.",
        placeholder: "Caretaking, competence, charm, silence, protection, useful labor.",
        tags: ["relationship_dynamic", "fawn", "strategy"],
      },
      {
        key: "hiddenTax",
        label: "Hidden Tax",
        prompt:
          "The unspoken price they expect others to pay for receiving that currency.",
        placeholder: "Do not leave, do not criticize, need me back, stop asking questions.",
        tags: ["conflict", "unspoken_rule", "relationship_cost"],
      },
      {
        key: "repairProtocol",
        label: "Repair Protocol",
        prompt:
          "The ego-preserving action they use to repair a damaged relationship.",
        placeholder: "Makes tea instead of apologizing, explains facts before naming hurt.",
        tags: ["repair_style", "repair_beat", "relationship_dynamic"],
      },
    ],
  },
] as const satisfies readonly CharacterBlueprintSection[];

export const wholeSystemCharacterBlueprintPipeline = [
  "An event hits the psychological wound.",
  "The cognitive system tries to rationalize, solve, or categorize the pressure.",
  "The affective-somatic system produces a visceral response the character cannot fully control.",
  "The interpersonal system discharges that pressure into a flawed external behavior.",
] as const;

export const wholeBrainCognitiveQuadrants = [
  {
    key: "analytical",
    label: "Analytical System",
    description:
      "Determines what is true, evidenced, useful, efficient, and realistic.",
    tags: ["cognitive", "logic", "truth", "strategy"],
    signals: [
      "fact checking",
      "skepticism",
      "cost-benefit thinking",
      "emotional distancing under pressure",
    ],
  },
  {
    key: "conceptual",
    label: "Conceptual System",
    description:
      "Creates possibilities, imagined futures, symbolic meaning, and novelty pressure.",
    tags: ["cognitive", "imagination", "novelty", "meaning"],
    signals: [
      "possibility generation",
      "fantasy projection",
      "symbolic thinking",
      "idealization under pressure",
    ],
  },
  {
    key: "organisational",
    label: "Organisational System",
    description:
      "Maintains predictability, routine, rules, safety, boundaries, and security.",
    tags: ["cognitive", "security", "control", "structure"],
    signals: [
      "planning",
      "routine seeking",
      "boundary creation",
      "rigidity under pressure",
    ],
  },
  {
    key: "relational",
    label: "Relational System",
    description:
      "Tracks belonging, empathy, attachment, emotional resonance, and connection.",
    tags: ["cognitive", "attachment", "empathy", "belonging"],
    signals: [
      "emotional mirroring",
      "caretaking",
      "reassurance seeking",
      "people pleasing under pressure",
    ],
  },
] as const satisfies readonly CharacterBlueprintReferenceEntry[];

export const wholeSystemReferenceAxes = [
  {
    key: "psychological_stack",
    label: "Psychological Stack",
    description:
      "Explains why a character uses their cognitive tools and how self-deception becomes behavior.",
    entries: [
      {
        key: "core",
        label: "Core",
        description:
          "The primal wound, existential need, and survival drive beneath the persona.",
        tags: ["wound", "hidden_need", "survival_drive"],
      },
      {
        key: "shadow",
        label: "Shadow",
        description:
          "The repressed traits, projected judgments, and blind spots that threaten the character's self-story.",
        tags: ["shadow", "projection", "blind_spot"],
      },
      {
        key: "ego",
        label: "Ego",
        description:
          "The coping mechanisms, rationalizations, and defensive logic used to protect the core.",
        tags: ["defense", "coping", "rationalization"],
      },
      {
        key: "persona",
        label: "Persona",
        description:
          "The controlled social narrative, currency, and cracking point shown to the world.",
        tags: ["persona", "social_mask", "identity"],
      },
    ],
  },
  {
    key: "emotional_architecture",
    label: "Emotional Architecture",
    description:
      "Tracks emotional climate, repression, volatility, and cathartic release over long-form scenes.",
    entries: [
      {
        key: "baseline_resonance",
        label: "Baseline Resonance",
        description:
          "The emotional gravity the character returns to when nothing else is happening.",
        tags: ["affect", "baseline", "emotional_climate"],
      },
      {
        key: "repression_arc",
        label: "Repression Arc",
        description:
          "The outlawed feeling and the safer emotion or behavior it becomes.",
        tags: ["outlawed_affect", "transmutation", "defense"],
      },
      {
        key: "volatility_system",
        label: "Volatility System",
        description:
          "The trigger, defense vector, and recovery rate that determine escalation and cooldown.",
        tags: ["trigger", "response", "recovery_rate"],
      },
      {
        key: "cathartic_release",
        label: "Cathartic Release",
        description:
          "The breaking point, emotional discharge, and new equilibrium that create growth.",
        tags: ["breaking_point", "catharsis", "growth_arc"],
      },
    ],
  },
  {
    key: "somatic_anchor",
    label: "Somatic Anchor",
    description:
      "Maps mental and emotional load onto physical tells, sensory distortion, and stress consequences.",
    entries: [
      {
        key: "constant_constriction",
        label: "Constant Constriction",
        description:
          "The body's default armor: jaw, throat, chest, shoulders, spine, gut, or hands.",
        tags: ["somatic", "musculoskeletal_anchor", "stored_stress"],
      },
      {
        key: "autonomic_shift",
        label: "Autonomic Shift",
        description:
          "The involuntary fight, flight, freeze, or shutdown response that bypasses conscious logic.",
        tags: ["somatic", "autonomic", "stress_response"],
      },
      {
        key: "cognitive_motor_fracture",
        label: "Cognitive-Motor Fracture",
        description:
          "The self-soothing tic, sensory distortion, or body leak that reveals stress before words do.",
        tags: ["somatic", "tic", "body_language"],
      },
      {
        key: "physical_breakdown",
        label: "Physical Breakdown",
        description:
          "The point where accumulated stress becomes migraine, panic, insomnia, nausea, trembling, or collapse.",
        tags: ["somatic", "crisis", "overload"],
      },
    ],
  },
  {
    key: "interpersonal_coupling",
    label: "Interpersonal Coupling",
    description:
      "Turns internal pressure into attachment stance, social strategy, rupture, and repair.",
    entries: [
      {
        key: "relational_polarity",
        label: "Relational Polarity",
        description:
          "How the character regulates distance by moving toward, away, or against other people.",
        tags: ["attachment", "proximity", "relationship_dynamic"],
      },
      {
        key: "cognitive_rift",
        label: "Cognitive Rift",
        description:
          "How speech and small behaviors warp when social pressure exceeds regulation.",
        tags: ["speech_pattern", "communication_glitch", "stress"],
      },
      {
        key: "transactional_currency",
        label: "Transactional Currency",
        description:
          "What the character offers to buy safety, closeness, forgiveness, influence, or control.",
        tags: ["strategy", "social_currency", "hidden_tax"],
      },
      {
        key: "relational_breakpoint",
        label: "Relational Breakpoint",
        description:
          "The rupture mechanism and ego-safe repair protocol that determine how relationships fail and reconnect.",
        tags: ["rupture", "repair_style", "conflict"],
      },
    ],
  },
] as const satisfies readonly CharacterBlueprintReferenceAxis[];

export const wholeSystemFeedbackLoop = [
  "Core wound",
  "Shadow conflict",
  "Ego defense",
  "Cognitive processing",
  "Emotional activation",
  "Somatic response",
  "Interpersonal behavior",
  "Social consequence",
  "Core wound reinforced or challenged",
] as const;

export function compileWholeSystemLorebookScaffold(): string {
  return [
    "Whole-system character architecture",
    "Cognitive quadrants: analytical truth, conceptual possibility, organisational security, relational belonging.",
    ...wholeSystemReferenceAxes.map((axis) =>
      `${axis.label}: ${axis.entries.map((entry) => entry.label).join(", ")}.`
    ),
    `Feedback loop: ${wholeSystemFeedbackLoop.join(" -> ")}.`,
  ].join("\n");
}

export function compileWholeSystemCharacterBlueprintPrompt(
  blueprint: WholeSystemCharacterBlueprintInput,
): string {
  const characterName = cleanText(blueprint.characterName) || "[Character Name]";
  const sections = wholeSystemCharacterBlueprintSections.map((section) => {
    const values = getSectionValues(blueprint, section.key);
    const filledFields = section.fields
      .map((field) => {
        const value = cleanText(values[field.key]);
        return value ? `- ${field.label}: ${value}` : "";
      })
      .filter(Boolean);

    if (filledFields.length === 0) {
      return "";
    }

    return [
      `${section.title} (${section.subtitle})`,
      section.description,
      ...filledFields,
    ].join("\n");
  }).filter(Boolean);

  return [
    `Whole-system character blueprint: ${characterName}`,
    ...sections,
    "Scene deployment pipeline:",
    ...wholeSystemCharacterBlueprintPipeline.map((step, index) =>
      `${index + 1}. ${step}`
    ),
  ].join("\n\n");
}

export function listWholeSystemCharacterBlueprintFields():
readonly CharacterBlueprintField[] {
  return (wholeSystemCharacterBlueprintSections as readonly CharacterBlueprintSection[])
    .flatMap((section) => section.fields);
}

function getSectionValues(
  blueprint: WholeSystemCharacterBlueprintInput,
  section: CharacterBlueprintSystemKey,
): Partial<Record<string, string>> {
  switch (section) {
    case "cognitive":
      return blueprint.cognitive ?? {};
    case "psychological":
      return blueprint.psychological ?? {};
    case "affective_somatic":
      return blueprint.affectiveSomatic ?? {};
    case "interpersonal":
      return blueprint.interpersonal ?? {};
  }
}

function cleanText(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}
