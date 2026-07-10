export type CharacterTemplateFieldTarget =
  | "overview"
  | "personaDescription"
  | "personaPersonality"
  | "personaScenario"
  | "personaBackstory";

export type CharacterTemplateTruthTier =
  | "overview"
  | "character_truth"
  | "runtime_context"
  | "setting_truth"
  | "story_infrastructure"
  | "arc_engine";

export interface CharacterTemplateSection {
  title: string;
  prompts: readonly string[];
}

export interface CharacterTemplateModule {
  moduleNumber: number;
  id: string;
  label: string;
  fieldTarget: CharacterTemplateFieldTarget;
  truthTier: CharacterTemplateTruthTier;
  description: string;
  outputUse: string;
  sections: readonly CharacterTemplateSection[];
  generatedLast?: boolean;
  placedFirst?: boolean;
  promptSafeRules?: readonly string[];
}

export interface CharacterTemplateAuditIssue {
  severity: "error" | "warning";
  moduleId?: string;
  message: string;
}

export interface CompileCharacterTemplateOutlineOptions {
  includeSections?: boolean;
  includeRules?: boolean;
}

export const CHARACTER_TEMPLATE_MODULES = [
  {
    moduleNumber: 1,
    id: "identity",
    label: "Identity",
    fieldTarget: "personaDescription",
    truthTier: "character_truth",
    description:
      "Stable identity, appearance, physical presence, and style signals.",
    outputUse:
      "Feeds the description field with portable identity and visual presence.",
    sections: [
      section("Full Name", ["Full name", "Goes by", "Pronouns"]),
      section("Core Identity", [
        "Age",
        "Ethnicity, heritage, nationality, occupation, and class position",
      ]),
      section("Physical Appearance", [
        "Height and build",
        "Face, eyes, hair, skin, and distinguishing features",
      ]),
      section("Physical Presence", [
        "Movement",
        "Posture",
        "Default expression",
        "How others first read them",
      ]),
      section("Style", [
        "Clothing style",
        "Signature detail",
        "Dress under pressure",
        "Dress when comfortable",
      ]),
    ],
  },
  {
    moduleNumber: 2,
    id: "personality",
    label: "Personality",
    fieldTarget: "personaPersonality",
    truthTier: "character_truth",
    description:
      "Values, character laws, moral code, contradictions, flaws, and strengths.",
    outputUse:
      "Feeds personality with the laws and contradictions that generate behavior.",
    sections: [
      section("Core Values", ["Three to five values they would defend at cost"]),
      section("Character Laws", [
        "Non-negotiable internal rules",
        "Lines the story will eventually pressure",
      ]),
      section("Moral Code", [
        "What they believe is right",
        "What they believe is wrong",
        "Where the code bends",
        "Where it does not bend",
      ]),
      section("Contradictions", [
        "The internal contradictions that create dramatic tension",
      ]),
      section("Flaws and Strengths", [
        "Flaws that cost them something",
        "Human strengths that create believable competence",
      ]),
    ],
  },
  {
    moduleNumber: 3,
    id: "cognition",
    label: "Cognition",
    fieldTarget: "personaPersonality",
    truthTier: "character_truth",
    description:
      "How the character thinks, learns, notices, misses, and misreads.",
    outputUse:
      "Feeds personality with decision style, perception, blind spots, and pressure cognition.",
    sections: [
      section("Intelligence Style", [
        "Primary intelligence type",
        "How they learn",
        "How they solve problems",
        "How they make decisions",
      ]),
      section("Perception", [
        "What they notice first",
        "What they miss",
        "What they misread",
        "What they are unusually accurate about",
      ]),
      section("Thinking Patterns", [
        "Under pressure",
        "When curious",
        "When threatened",
        "When safe",
      ]),
      section("Blind Spots and Biases", [
        "What they cannot see",
        "What they assume without evidence",
      ]),
    ],
  },
  {
    moduleNumber: 4,
    id: "psychology",
    label: "Psychology",
    fieldTarget: "personaPersonality",
    truthTier: "character_truth",
    description:
      "Core wound, lie, truth, attachment style, defenses, triggers, shame, and fear.",
    outputUse:
      "Feeds personality with the cause-based psychology underneath behavior.",
    sections: [
      section("Core Wound", ["The original injury that powers the engine"]),
      section("Lie and Truth", [
        "The false belief the wound created",
        "The growth truth they are moving toward",
      ]),
      section("Attachment Style", [
        "How attachment presents",
        "How attachment breaks down under stress",
      ]),
      section("Defense Mechanisms", [
        "Primary defense",
        "Secondary defense",
        "What bypasses defenses",
      ]),
      section("Triggers", [
        "Specific inputs that activate the wound",
        "Visible response for each trigger",
      ]),
      section("Shame and Fear Profiles", [
        "What shame looks like",
        "What soothes or worsens it",
        "Deepest fear and admitted surface fear",
      ]),
    ],
  },
  {
    moduleNumber: 5,
    id: "relationships",
    label: "Relationships",
    fieldTarget: "personaPersonality",
    truthTier: "character_truth",
    description:
      "How the character connects, deepens, protects, withdraws, and needs.",
    outputUse:
      "Feeds personality with relationship behavior that is portable across stories.",
    sections: [
      section("Attachment Pattern", [
        "Start of relationship",
        "Deepening relationship",
        "Threatened relationship",
        "Ending relationship",
      ]),
      section("Trust Ladder", [
        "Stranger",
        "Acquaintance",
        "Familiar",
        "Trusted",
        "Intimate",
      ]),
      section("Intimacy Style", [
        "Emotional intimacy",
        "Physical intimacy",
        "Verbal intimacy",
        "Comfortable intimacy",
        "Fearful intimacy",
      ]),
      section("Distance and Needs", [
        "How they push people away",
        "What they need but cannot ask for",
      ]),
    ],
  },
  {
    moduleNumber: 6,
    id: "sexuality",
    label: "Sexuality",
    fieldTarget: "personaPersonality",
    truthTier: "character_truth",
    description:
      "Adult-only desire architecture, safety needs, limits, and aftermath behavior.",
    outputUse:
      "Feeds personality only when adult fields are enabled; otherwise remains non-explicit or omitted.",
    sections: [
      section("Sexual Identity", [
        "Orientation",
        "Desire style",
        "Baseline libido",
      ]),
      section("Arousal Phases", [
        "Indifferent",
        "Aware",
        "Attached",
        "Focused",
      ]),
      section("Desire Signature", [
        "What draws them",
        "What repels them",
        "What they want but would not admit",
        "What they need to feel safe",
      ]),
      section("Limits and Aftermath", [
        "Hard limits",
        "Soft limits",
        "What trust changes",
        "Immediate aftermath",
        "Next-day aftermath",
      ]),
    ],
    promptSafeRules: [
      "Use only for adult fictional characters when adult field mode is explicitly enabled.",
      "Keep consent, boundaries, trust, and safety needs visible.",
    ],
  },
  {
    moduleNumber: 7,
    id: "speech",
    label: "Speech",
    fieldTarget: "personaPersonality",
    truthTier: "character_truth",
    description:
      "Voice, language patterns, silence, pressure speech, writing style, and staged examples.",
    outputUse:
      "Feeds personality and example messages with voice laws rather than catchphrase loops.",
    sections: [
      section("Voice", ["Tone", "Pace", "Volume", "Register"]),
      section("Language Patterns", [
        "Vocabulary level",
        "Sentence structure",
        "Filler words",
        "Signature phrases",
        "What they never say",
      ]),
      section("Dialect and Silence", [
        "Accent or code-switching when specific",
        "Comfortable silence",
        "Threatened silence",
        "Hurt silence",
        "Thinking silence",
      ]),
      section("Speech Under Pressure", [
        "Stress",
        "Anger",
        "Fear",
        "Lying",
        "Love",
      ]),
      section("Conditional Dialogue Examples", [
        "Stage 1 voice",
        "Stage 3 voice",
        "Stage 5 voice",
      ]),
    ],
  },
  {
    moduleNumber: 8,
    id: "runtime",
    label: "Runtime",
    fieldTarget: "personaScenario",
    truthTier: "runtime_context",
    description:
      "Mutable now-state for active arc, scene, mood, stress, memories, relationship state, and agent routing.",
    outputUse:
      "Feeds scenario/runtime context, never permanent character truth.",
    sections: [
      section("Static Snapshot", [
        "Story position",
        "Character state",
        "Psychological state",
        "Arc state",
        "Relationship state",
        "Relational pressure",
        "Active memories",
      ]),
      section("User Persona Runtime", [
        "Relationship state",
        "Mood",
        "Goal",
        "Active memories",
        "Arousal phase",
      ]),
      section("Agentic Runtime System", [
        "Narrative arc controller",
        "Character and inner character",
        "User shadow",
        "Narrator and NPC",
        "Intimacy coordinator",
        "Lorebook, scenario, and scene agents",
        "Editor and debugger",
      ]),
      section("Memory Ledger", [
        "What happened",
        "Whether it felt safe or unsafe",
        "Boundary, attraction, trust, shame, and expectation changes",
      ]),
    ],
    promptSafeRules: [
      "Runtime is mutable story truth.",
      "Do not bake runtime state into portable card identity.",
      "Expose effects, not raw scores or private agent names.",
    ],
  },
  {
    moduleNumber: 9,
    id: "world",
    label: "World",
    fieldTarget: "personaBackstory",
    truthTier: "setting_truth",
    description:
      "External reality, time, location, genre, technology, social norms, power systems, mortality, and constraints.",
    outputUse:
      "Feeds scenario/backstory setting truth and world lorebook material.",
    sections: [
      section("Setting Environment", ["Physical and cultural world"]),
      section("Time and Place", [
        "Era",
        "Explicit start date",
        "Current events",
        "Primary location",
      ]),
      section("Genre, Technology, and Class", [
        "Genre and tone",
        "Technology baseline",
        "Technology exceptions",
        "Socioeconomic climate",
      ]),
      section("Power and Norms", [
        "Politics",
        "Social norms",
        "Power systems",
      ]),
      section("Behavioral Constraints", [
        "Pacing",
        "Physics",
        "NPC agency",
        "Environmental reactivity",
      ]),
    ],
    promptSafeRules: [
      "Setting applies pressure but does not define personality.",
      "Start with minimum viable setting and expand through story evidence.",
    ],
  },
  {
    moduleNumber: 10,
    id: "relational_infrastructure",
    label: "Relational Infrastructure",
    fieldTarget: "personaBackstory",
    truthTier: "story_infrastructure",
    description:
      "Supporting cast, friendship groups, NPC tiers, NPC pressure functions, and lorebook profile rules.",
    outputUse:
      "Feeds lorebook/backstory infrastructure while keeping named NPC detail out of portable character truth.",
    sections: [
      section("NPC Tiers", [
        "In-card name and role",
        "Lorebook full profile",
        "Lorebook basic note",
        "No file for disposable background people",
      ]),
      section("Supporting Cast", [
        "Name and role only for token-efficient main cast references",
      ]),
      section("Full NPC Profile", [
        "Role",
        "Appearance",
        "Speech",
        "Surface and hidden personality",
        "Relationship layer",
        "Conflict function",
        "Growth function",
      ]),
      section("Group Entry", [
        "Group dynamic",
        "Members",
        "Shared pressure function",
      ]),
    ],
    promptSafeRules: [
      "NPCs are relational pressure systems, not name clutter.",
      "Only promote NPCs when they create pressure, conflict, growth, or recurring scene utility.",
    ],
  },
  {
    moduleNumber: 11,
    id: "director_arc_engine",
    label: "Director / Arc Engine",
    fieldTarget: "personaBackstory",
    truthTier: "arc_engine",
    description:
      "Cause-based arc control, trope stages, progression gates, regression, conflict, growth, law breakers, and output logic.",
    outputUse:
      "Feeds arc-engine/backstory guidance and runtime controllers without replacing character law.",
    sections: [
      section("Arc Trope", [
        "Selected route shape",
        "Romance beat framework",
        "Pattern references, not scripts",
      ]),
      section("Arc Stages", [
        "Status quo or mask",
        "Disruption",
        "Testing",
        "Partial softening",
        "Rupture",
        "Repair",
        "Integration",
      ]),
      section("Progression Gates", [
        "Safety",
        "Specific attention",
        "Repair",
        "Mutual exposure",
        "Choice",
      ]),
      section("Regression and Sexual Arc Control", [
        "Regression triggers",
        "What regression must not erase",
        "Desire",
        "Trust",
        "Attachment",
        "Vulnerability",
      ]),
      section("Conflict and Growth Engine", [
        "Law collisions",
        "Anti-loop rules",
        "Growth framework",
        "Law breakers",
        "Setting pressure",
      ]),
      section("Output Logic", [
        "What they want now",
        "What they fear admitting",
        "Which law is pressured",
        "Which defense activates",
        "What evidence changes trust or fear",
        "Whether the reply maintains, escalates, ruptures, or repairs",
      ]),
    ],
    promptSafeRules: [
      "Behavior is generated from cause, not traits or plot convenience.",
      "Story truth cannot overwrite immutable truth.",
      "Arc movement must be earned by evidence, not elapsed time.",
    ],
  },
  {
    moduleNumber: 12,
    id: "overview",
    label: "Overview",
    fieldTarget: "overview",
    truthTier: "overview",
    description:
      "A synthesized storyless summary generated after modules 1-11 and placed first in the card.",
    outputUse:
      "Frames who the character is, what story function they serve, their wound, lie, truth, use cases, and flattening risks.",
    generatedLast: true,
    placedFirst: true,
    sections: [
      section("Who They Are", ["Two to three sentences; person, not trait list"]),
      section("Core Function", [
        "What kind of story they are built to tell",
        "What they do to a narrative",
      ]),
      section("Arc Trope", ["Named trope and romance beat framework"]),
      section("Dominant Wound", ["The psychological engine in one sentence"]),
      section("Lie and Truth", [
        "False belief driving behavior",
        "Growth direction",
      ]),
      section("How To Use Them", [
        "Persona types, scenarios, and pressure patterns that activate them without inventing a current relationship",
      ]),
      section("What To Avoid", [
        "Interactions that flatten them",
        "Pressure that collapses dramatic potential",
      ]),
      section("Modular Note", [
        "Setting-independent character law, wound, psychology, and arc",
      ]),
    ],
    promptSafeRules: [
      "Generate overview last, then place it first.",
      "Keep it setting-independent and free of unsupported story, NPC, or target-specific relationship facts.",
    ],
  },
] as const satisfies readonly CharacterTemplateModule[];

export const CHARACTER_TEMPLATE_GENERATION_ORDER = Object.freeze(
  CHARACTER_TEMPLATE_MODULES.map((module) => module.moduleNumber),
);

export const CHARACTER_TEMPLATE_CARD_ORDER = Object.freeze([
  12,
  ...CHARACTER_TEMPLATE_MODULES.filter((module) => module.moduleNumber !== 12).map(
    (module) => module.moduleNumber,
  ),
] as const);

export function getCharacterTemplateModule(
  moduleNumber: number,
): CharacterTemplateModule | undefined {
  return CHARACTER_TEMPLATE_MODULES.find(
    (module) => module.moduleNumber === moduleNumber,
  );
}

export function getCharacterTemplateModulesByField(
  fieldTarget: CharacterTemplateFieldTarget,
): readonly CharacterTemplateModule[] {
  return CHARACTER_TEMPLATE_MODULES.filter(
    (module) => module.fieldTarget === fieldTarget,
  );
}

export function compileCharacterTemplateFieldOutline(
  fieldTarget: CharacterTemplateFieldTarget,
  options: CompileCharacterTemplateOutlineOptions = {},
): string {
  const modules = getCharacterTemplateModulesByField(fieldTarget);
  const includeSections = options.includeSections ?? true;
  const includeRules = options.includeRules ?? true;

  return modules
    .map((module) => {
      const sections = includeSections
        ? module.sections.map(formatSection).join("\n")
        : "";
      const rules =
        includeRules && module.promptSafeRules?.length
          ? `\nRules: ${module.promptSafeRules.join(" ")}`
          : "";

      return [
        `Module ${module.moduleNumber} - ${module.label}`,
        module.description,
        `Target: ${module.fieldTarget}; tier: ${module.truthTier}.`,
        `Use: ${module.outputUse}`,
        sections,
        rules,
      ].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

export function compileCharacterTemplateCompactFieldMap(): string {
  const grouped = CHARACTER_TEMPLATE_MODULES.reduce(
    (groups, module) => {
      groups[module.fieldTarget] = [
        ...(groups[module.fieldTarget] ?? []),
        `Module ${module.moduleNumber}: ${module.label}`,
      ];
      return groups;
    },
    {} as Record<CharacterTemplateFieldTarget, string[]>,
  );

  return ([
    "overview",
    "personaDescription",
    "personaPersonality",
    "personaScenario",
    "personaBackstory",
  ] as const)
    .map((fieldTarget) => `${fieldTarget}: ${grouped[fieldTarget]?.join(", ")}`)
    .join("\n");
}

export function auditCharacterTemplateModules(
  modules: readonly CharacterTemplateModule[] = CHARACTER_TEMPLATE_MODULES,
): readonly CharacterTemplateAuditIssue[] {
  const issues: CharacterTemplateAuditIssue[] = [];
  const moduleNumbers = modules.map((module) => module.moduleNumber);
  const moduleIds = modules.map((module) => module.id);

  for (let number = 1; number <= 12; number += 1) {
    if (!moduleNumbers.includes(number)) {
      issues.push({
        severity: "error",
        message: `Missing module ${number}.`,
      });
    }
  }

  for (const duplicate of findDuplicates(moduleNumbers)) {
    issues.push({
      severity: "error",
      message: `Duplicate module number ${duplicate}.`,
    });
  }

  for (const duplicate of findDuplicates(moduleIds)) {
    issues.push({
      severity: "error",
      moduleId: duplicate,
      message: `Duplicate module id ${duplicate}.`,
    });
  }

  const overview = modules.find((module) => module.moduleNumber === 12);
  if (!overview?.generatedLast || !overview.placedFirst) {
    issues.push({
      severity: "error",
      moduleId: overview?.id,
      message: "Overview must be generated last and placed first.",
    });
  }

  const runtime = modules.find((module) => module.moduleNumber === 8);
  if (runtime?.truthTier !== "runtime_context") {
    issues.push({
      severity: "error",
      moduleId: runtime?.id,
      message: "Runtime module must stay in runtime context.",
    });
  }

  const world = modules.find((module) => module.moduleNumber === 9);
  if (world?.truthTier !== "setting_truth") {
    issues.push({
      severity: "error",
      moduleId: world?.id,
      message: "World module must stay in setting truth.",
    });
  }

  return issues;
}

function section(
  title: string,
  prompts: readonly string[],
): CharacterTemplateSection {
  return {
    title,
    prompts,
  };
}

function formatSection(section: CharacterTemplateSection): string {
  return `- ${section.title}: ${section.prompts.join("; ")}`;
}

function findDuplicates<T>(values: readonly T[]): readonly T[] {
  return Array.from(
    new Set(values.filter((value, index) => values.indexOf(value) !== index)),
  );
}
