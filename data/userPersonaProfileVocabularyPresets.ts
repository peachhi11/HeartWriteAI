import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export interface UserPersonaProfileSectionDefinition {
  seed: string;
  label: string;
  purpose: string;
  fields: readonly string[];
  matchingSignals: readonly string[];
}

export interface UserPersonaBasicProfile {
  nameAlias?: string;
  age?: string;
  background?: string;
  roleArchetype?: string;
  startingSituation?: string;
}

export interface UserPersonaPsychologyProfile {
  coreTraits?: readonly string[];
  insecurities?: readonly string[];
  desires?: readonly string[];
  boundaries?: readonly string[];
}

export interface UserPersonaCognitionProfile {
  attention?: string;
  perception?: string;
  memory?: string;
  decisionStyle?: string;
}

export interface UserPersonaMotivationalDriversProfile {
  autonomy?: string;
  competence?: string;
  relatedness?: string;
  intrinsic?: string;
  extrinsic?: string;
}

export interface UserPersonaRelationalStyleProfile {
  attachmentStyle?: string;
  trustFormation?: string;
  conflictStyle?: string;
}

export interface UserPersonaAttractionChemistryProfile {
  whatTheyRespondTo?: readonly string[];
  whatDestabilizesThem?: readonly string[];
}

export interface UserPersonaBehaviorPattern {
  trigger: string;
  interpretation: string;
  response: string;
}

export interface UserPersonaStoryHooksProfile {
  goals?: readonly string[];
  internalConflicts?: readonly string[];
  externalPressures?: readonly string[];
}

export interface UserPersonaProfile {
  basic?: UserPersonaBasicProfile;
  psychology?: UserPersonaPsychologyProfile;
  cognition?: UserPersonaCognitionProfile;
  motivationalDrivers?: UserPersonaMotivationalDriversProfile;
  relationalStyle?: UserPersonaRelationalStyleProfile;
  attractionChemistryHooks?: UserPersonaAttractionChemistryProfile;
  behaviorPatterns?: readonly UserPersonaBehaviorPattern[];
  storyHooks?: UserPersonaStoryHooksProfile;
}

export const userPersonaProfileSemanticChain = [
  "User Persona Basic",
  "Persona Psychology",
  "Cognition",
  "Motivational Drivers",
  "Relational Style",
  "Attraction and Chemistry Hooks",
  "Behavior Patterns",
  "Story Hooks",
] as const;

export const userPersonaProfilePrinciples = [
  "User persona fields should describe the user's playable stance without writing their actions, thoughts, or consent for them.",
  "Persona psychology should expose traits, insecurities, desires, and boundaries as matching signals rather than fixed behavior commands.",
  "Cognition should shape how the persona notices, remembers, and decides inside route matching.",
  "Motivational drivers should separate autonomy, competence, relatedness, intrinsic rewards, and extrinsic pressure.",
  "Relational style should help compatibility scoring predict trust formation and conflict loops.",
  "Attraction and chemistry hooks should name what the persona responds to and what destabilizes them.",
  "Behavior patterns should be stored as trigger to interpretation to response templates for matching, not as forced user behavior.",
  "Story hooks should identify goals, internal conflicts, and external pressures that can ignite scenes.",
] as const;

export const userPersonaProfileSections = [
  {
    seed: "user_persona_basic",
    label: "User Persona Basic",
    purpose:
      "Captures the visible user persona identity and the starting situation the route should respect.",
    fields: [
      "name or alias",
      "age",
      "background",
      "role or archetype",
      "starting situation",
    ],
    matchingSignals: [
      "identity anchor",
      "route entry point",
      "scene context",
    ],
  },
  {
    seed: "persona_psychology",
    label: "Persona Psychology",
    purpose:
      "Stores core traits, insecurities, desires, and boundaries as compatibility inputs.",
    fields: [
      "core traits",
      "insecurities",
      "desires",
      "boundaries",
    ],
    matchingSignals: [
      "personality fit",
      "wound and desire resonance",
      "boundary constraints",
    ],
  },
  {
    seed: "persona_cognition",
    label: "Cognition",
    purpose:
      "Describes how the persona attends, perceives, remembers, and decides.",
    fields: [
      "attention",
      "perception",
      "memory",
      "decision style",
    ],
    matchingSignals: [
      "attention pattern",
      "interpretation bias",
      "decision pressure",
    ],
  },
  {
    seed: "persona_motivational_drivers",
    label: "Motivational Drivers",
    purpose:
      "Separates autonomy, competence, relatedness, intrinsic motivation, and extrinsic pressure.",
    fields: [
      "autonomy",
      "competence",
      "relatedness",
      "intrinsic",
      "extrinsic",
    ],
    matchingSignals: [
      "agency need",
      "competence need",
      "connection need",
      "pressure source",
    ],
  },
  {
    seed: "persona_relational_style",
    label: "Relational Style",
    purpose:
      "Defines attachment, trust formation, and conflict patterns for relationship matching.",
    fields: [
      "attachment style",
      "trust formation",
      "conflict style",
    ],
    matchingSignals: [
      "attachment compatibility",
      "trust pacing",
      "conflict loop",
    ],
  },
  {
    seed: "persona_attraction_chemistry_hooks",
    label: "Attraction and Chemistry Hooks",
    purpose:
      "Names what the persona responds to and what destabilizes their romantic or emotional footing.",
    fields: [
      "what they respond to",
      "what destabilizes them",
    ],
    matchingSignals: [
      "chemistry activator",
      "destabilizer",
      "slow-burn pressure",
    ],
  },
  {
    seed: "persona_behavior_patterns",
    label: "Behavior Patterns",
    purpose:
      "Stores trigger to interpretation to response loops for compatibility and route prediction.",
    fields: [
      "trigger",
      "interpretation",
      "response",
    ],
    matchingSignals: [
      "feedback loop",
      "escalation pattern",
      "de-escalation pattern",
    ],
  },
  {
    seed: "persona_story_hooks",
    label: "Story Hooks",
    purpose:
      "Captures goals, internal conflicts, and external pressures that can seed scenes.",
    fields: [
      "goals",
      "internal conflicts",
      "external pressures",
    ],
    matchingSignals: [
      "goal pressure",
      "internal conflict",
      "external plot hook",
    ],
  },
] as const satisfies readonly UserPersonaProfileSectionDefinition[];

export const USER_PERSONA_PROFILE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  userPersonaProfileSections.map((section) =>
    createVocabularySeedPreset({
      seed: `${section.seed}_profile_section`,
      label: `${section.label} Profile Section`,
      description: section.purpose,
      examples: [
        ...section.fields.map((field) => `Field: ${field}`),
        ...section.matchingSignals.map((signal) => `Matching signal: ${signal}`),
      ],
      tags: [
        "user_persona_profile",
        "persona_matching",
        "profile_section",
        section.seed,
      ],
      relatedSeeds: section.matchingSignals,
      oppositeSeeds: [
        "user_puppeting",
        "forced_user_behavior",
      ],
      romanceHooks: [
        "persona_compatibility",
        "chemistry_matching",
        "route_personalization",
      ],
      scenarioHooks: [
        "persona_profile_form",
        "user_persona_matching",
        section.seed,
      ],
      dialoguePatterns: [
        "Use persona fields as matching context without writing the user's actions or inner life.",
      ],
      metadata: {
        rarity: "common",
        romanceValue: section.seed === "persona_attraction_chemistry_hooks" ? 9 : 7,
        conflictPotential:
          section.seed === "persona_behavior_patterns" ||
          section.seed === "persona_relational_style"
            ? 8
            : 6,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function compileUserPersonaProfilePrompt(profile: UserPersonaProfile): string {
  const lines = [
    formatBasicProfile(profile.basic),
    formatListSection("Core traits", profile.psychology?.coreTraits),
    formatListSection("Insecurities", profile.psychology?.insecurities),
    formatListSection("Desires", profile.psychology?.desires),
    formatListSection("Boundaries", profile.psychology?.boundaries),
    formatKeyValueSection("Cognition", profile.cognition),
    formatKeyValueSection("Motivational drivers", profile.motivationalDrivers),
    formatKeyValueSection("Relational style", profile.relationalStyle),
    formatListSection(
      "Responds to",
      profile.attractionChemistryHooks?.whatTheyRespondTo,
    ),
    formatListSection(
      "Destabilized by",
      profile.attractionChemistryHooks?.whatDestabilizesThem,
    ),
    formatBehaviorPatterns(profile.behaviorPatterns),
    formatStoryHooks(profile.storyHooks),
  ].filter(Boolean);

  return lines.length > 0
    ? `User Persona Profile: ${lines.join(" ")}`
    : "User Persona Profile: no persona details supplied.";
}

function formatBasicProfile(profile: UserPersonaBasicProfile | undefined): string {
  if (!profile) return "";

  return [
    profile.nameAlias ? `Name or alias: ${profile.nameAlias}.` : "",
    profile.age ? `Age: ${profile.age}.` : "",
    profile.background ? `Background: ${profile.background}.` : "",
    profile.roleArchetype ? `Role or archetype: ${profile.roleArchetype}.` : "",
    profile.startingSituation ? `Starting situation: ${profile.startingSituation}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function formatListSection(label: string, values: readonly string[] | undefined): string {
  if (!values || values.length === 0) return "";

  return `${label}: ${values.join(", ")}.`;
}

function formatKeyValueSection(
  label: string,
  values: object | undefined,
): string {
  if (!values) return "";

  const entries = Object.entries(values)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${toReadableFieldName(key)}: ${value}`);

  return entries.length > 0 ? `${label}: ${entries.join("; ")}.` : "";
}

function formatBehaviorPatterns(
  patterns: readonly UserPersonaBehaviorPattern[] | undefined,
): string {
  if (!patterns || patterns.length === 0) return "";

  const compiledPatterns = patterns.map(
    (pattern) =>
      `${pattern.trigger} -> ${pattern.interpretation} -> ${pattern.response}`,
  );

  return `Behavior patterns: ${compiledPatterns.join("; ")}.`;
}

function formatStoryHooks(profile: UserPersonaStoryHooksProfile | undefined): string {
  if (!profile) return "";

  return [
    formatListSection("Goals", profile.goals),
    formatListSection("Internal conflicts", profile.internalConflicts),
    formatListSection("External pressures", profile.externalPressures),
  ]
    .filter(Boolean)
    .join(" ");
}

function toReadableFieldName(fieldName: string): string {
  return fieldName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
}
