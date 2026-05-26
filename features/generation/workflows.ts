import {
  generateFirstMessageData,
  generateLorebookSummaryData,
  generateLoreEntriesData,
  generateOccupationData,
  generateRelationshipsData,
  generateScenarioData,
  generateSpeciesData,
  generateWorldLorePlaceholders,
  type GeneratedFirstMessageData,
  type GeneratedLorebookSummaryData,
  type GeneratedLoreEntryData,
  type GeneratedOccupationData,
  type GeneratedScenarioData,
  type GeneratedSpeciesData,
  type GeneratedWorldLorePlaceholderData,
  type OccupationProfessionalDomain,
  type SpeciesType,
} from "../../lib/character-card/generator";
import {
  createLorebookV3Document,
  LorebookV3EntrySchema,
  type LorebookV3Document,
} from "../lorebooks/schema";

export type PersonaGenerationInput = {
  name: string;
  archetype: string;
  characteristics: string;
  constructionPrompt?: string;
  pointOfView: string;
  playStyle: string;
  referenceCharacter: string;
  relationshipToCharacter: string;
  emotionalNeed: string;
  boundaries: string;
  tags: string;
};

export type GeneratedPersonaArtifact = {
  id: string;
  name: string;
  summary: string;
  prompt: string;
  tags: string[];
  updatedAt: number;
  source?: "blank" | "generated" | "imported";
};

export type ScenarioGenerationInput = {
  constructionPrompt?: string;
  openingBeat?: string;
  relationshipPressure?: string;
  settingNotes?: string;
  title: string;
  trope: string;
  jobTitle: string;
  professionalDomain: OccupationProfessionalDomain;
};

export type GeneratedScenarioArtifact = {
  id: string;
  title: string;
  trope: string;
  summary: string;
  tags: string[];
  scenario: GeneratedScenarioData;
  firstMessage: GeneratedFirstMessageData;
  occupation: GeneratedOccupationData;
  updatedAt: number;
  source?: "blank" | "generated" | "imported";
};

export type LorebookGenerationInput = {
  title: string;
  trope: string;
  speciesType: SpeciesType;
  jobTitle: string;
  professionalDomain: OccupationProfessionalDomain;
};

export type GeneratedLorebookArtifact = {
  id: string;
  title: string;
  trope: string;
  summary: GeneratedLorebookSummaryData;
  entries: GeneratedLoreEntryData[];
  placeholders: GeneratedWorldLorePlaceholderData[];
  species: GeneratedSpeciesData;
  occupation: GeneratedOccupationData;
  tags: string[];
  updatedAt: number;
  source?: "blank" | "generated" | "imported";
  v3Document?: LorebookV3Document;
};

export type BundlePersonaSource = {
  id: string;
  name: string;
  prompt?: string;
  summary?: string;
  tags?: string[];
};

export type RuntimeBundleArtifact = {
  id: string;
  title: string;
  source?: "created" | "imported";
  persona?: {
    id: string;
    name: string;
    summary: string;
    prompt: string;
  };
  scenario?: {
    id: string;
    title: string;
    summary: string;
    openingConstraint: string;
    settingType: string;
    startingTension: string;
  };
  lorebook?: {
    id: string;
    title: string;
    universeAnchor: string;
    summary: string;
    entries: {
      title: string;
      activationKeys: string[];
      content: string;
    }[];
  };
  tags: string[];
  compiledContext: string;
  updatedAt: number;
};

export type RuntimeBundleInput = {
  title: string;
  persona?: BundlePersonaSource | null;
  scenario?: GeneratedScenarioArtifact | null;
  lorebook?: GeneratedLorebookArtifact | null;
};

export const DEFAULT_PERSONA_CONSTRUCTION_PROMPT = [
  "Build a playable user persona for romance roleplay.",
  "Keep the persona lean, user-controlled, emotionally specific, and compatible with the selected character or scenario.",
  "Do not overwrite the user's agency. Do not write their private thoughts, dialogue, consent, or decisions.",
  "Prioritize POV, boundaries, relationship role, emotional pressure points, speech posture, and post-history instructions.",
].join("\n");

export const DEFAULT_SCENARIO_CONSTRUCTION_PROMPT = [
  "Build a romance roleplay scenario that gives the selected character and user persona a specific place, pressure, and opening direction.",
  "Keep it playable, sensory, emotionally directional, and easy to edit.",
  "Do not write the user's reply, private thoughts, consent, or choices.",
  "Prioritize scene premise, relationship pressure, opening constraint, sensory anchors, and the first turn's call-to-action.",
].join("\n");

export function generatePersonaArtifact(
  input: PersonaGenerationInput,
): GeneratedPersonaArtifact {
  const name = input.name.trim() || "New Persona";
  const tags = normalizeTags(
    `${input.tags}, ${input.pointOfView}, ${input.playStyle}, ${input.archetype}, ${input.relationshipToCharacter}`,
  );
  const characteristics = input.characteristics.trim() ||
    "emotionally observant, consent-aware, and responsive to character tone";
  const referenceCharacter = input.referenceCharacter.trim();
  const relationshipToCharacter = input.relationshipToCharacter.trim() ||
    "romantic lead / user-controlled counterpart";
  const emotionalNeed = input.emotionalNeed.trim() ||
    "to feel emotionally respected without having their agency overwritten";
  const boundaries = input.boundaries.trim() ||
    "Do not write this persona's thoughts, dialogue, or decisions for them.";
  const summary = [
    `${name} is a ${input.pointOfView} persona built for ${input.playStyle.toLowerCase()}.`,
    `They are shaped as ${relationshipToCharacter.toLowerCase()}.`,
    `Their roleplay pressure point is ${emotionalNeed}.`,
  ].join(" ");
  const prompt = [
    `USER PERSONA: ${name}`,
    `Archetype: ${input.archetype}`,
    `POV: ${input.pointOfView}`,
    `Play style: ${input.playStyle}`,
    `Desired characteristics: ${characteristics}`,
    `Relationship role: ${relationshipToCharacter}`,
    referenceCharacter ? `Matched character/context: ${referenceCharacter}` : "",
    `Core emotional need: ${emotionalNeed}`,
    `Boundaries: ${boundaries}`,
    "Runtime rule: treat this persona as user-controlled. Never narrate their private thoughts, unstated feelings, dialogue, choices, or consent.",
  ].filter(Boolean).join("\n");

  return {
    id: createArtifactId("persona", name),
    name,
    prompt,
    summary,
    tags,
    updatedAt: Date.now(),
    source: "generated",
  };
}

export function compilePersonaConstructionPrompt(input: PersonaGenerationInput) {
  const constructionPrompt = input.constructionPrompt?.trim() ||
    DEFAULT_PERSONA_CONSTRUCTION_PROMPT;

  return [
    constructionPrompt,
    "",
    "[PERSONA INGREDIENTS]",
    `Name: ${input.name.trim() || "New Persona"}`,
    `Archetype: ${input.archetype.trim() || "Unspecified"}`,
    `POV: ${input.pointOfView}`,
    `Play style: ${input.playStyle}`,
    `Desired characteristics: ${input.characteristics.trim() || "Unspecified"}`,
    `Relationship role: ${input.relationshipToCharacter.trim() || "Unspecified"}`,
    `Matched character/context: ${input.referenceCharacter.trim() || "None provided"}`,
    `Core emotional need: ${input.emotionalNeed.trim() || "Unspecified"}`,
    `Boundaries: ${input.boundaries.trim() || "Use default agency-safe boundaries"}`,
    `Tags: ${input.tags.trim() || "None"}`,
    "",
    "[OUTPUT REQUIREMENTS]",
    "Return a concise editable persona artifact with summary, tags, and runtime prompt text.",
  ].join("\n");
}

export function createBlankPersonaArtifact(
  name = "Untitled Persona",
): GeneratedPersonaArtifact {
  return createPersonaArtifactFromEditable({
    id: createArtifactId("persona", `${name}:blank`),
    name,
    prompt: [
      `USER PERSONA: ${name}`,
      "POV: AnyPOV",
      "Play style: Story roleplay",
      "Boundaries: Do not write this persona's thoughts, dialogue, decisions, consent, or hidden feelings.",
      "Runtime rule: treat this persona as user-controlled. Never narrate their private thoughts, unstated feelings, dialogue, choices, or consent.",
    ].join("\n"),
    source: "blank",
    summary: "A blank editable user persona draft.",
    tags: ["blank", "persona"],
  });
}

export function createImportedPersonaArtifact(
  value: unknown,
  sourceFileName?: string,
): GeneratedPersonaArtifact {
  if (!isRecord(value)) {
    throw new Error("Persona JSON must be an object.");
  }

  const fileNameTitle = sourceFileName?.replace(/\.json$/i, "").trim();
  const name = readUnknownString(value.name) ||
    readUnknownString(value.title) ||
    fileNameTitle ||
    "Imported Persona";
  const prompt = readUnknownString(value.prompt) ||
    readUnknownString(value.content) ||
    `USER PERSONA: ${name}`;
  const summary = readUnknownString(value.summary) ||
    readUnknownString(value.description) ||
    `${name} is an imported user persona.`;

  return createPersonaArtifactFromEditable({
    id: readUnknownString(value.id) ||
      createArtifactId("persona", `${name}:${sourceFileName ?? "imported"}`),
    name,
    prompt,
    source: "imported",
    summary,
    tags: normalizeTagsFromUnknown(value.tags),
    updatedAt: readUnknownNumber(value.updatedAt) ?? Date.now(),
  });
}

export function createPersonaArtifactFromEditable(input: {
  id: string;
  name: string;
  prompt: string;
  source?: GeneratedPersonaArtifact["source"];
  summary: string;
  tags: string[] | string;
  updatedAt?: number;
}): GeneratedPersonaArtifact {
  const name = input.name.trim() || "Untitled Persona";
  const prompt = input.prompt.trim() || `USER PERSONA: ${name}`;
  const summary = input.summary.trim() || `${name} is a saved user persona.`;

  return {
    id: input.id,
    name,
    prompt,
    source: input.source,
    summary,
    tags: Array.isArray(input.tags)
      ? normalizeTags(input.tags.join(", "))
      : normalizeTags(input.tags),
    updatedAt: input.updatedAt ?? Date.now(),
  };
}

export function generateScenarioArtifact(
  input: ScenarioGenerationInput,
): GeneratedScenarioArtifact {
  const trope = input.trope.trim() || "Slow burn romance";
  const occupation = generateOccupationData({
    jobTitle: input.jobTitle.trim() || undefined,
    professionalDomain: input.professionalDomain,
    trope,
  });
  const scenario = generateScenarioData(trope, occupation);
  const firstMessage = generateFirstMessageData(trope, scenario);
  const title = input.title.trim() || humanize(scenario.plotHook);
  const settingNotes = input.settingNotes?.trim();
  const relationshipPressure = input.relationshipPressure?.trim();
  const openingBeat = input.openingBeat?.trim();
  const scenePremiseDescription = [
    scenario.scenePremiseDescription,
    settingNotes ? `Setting notes: ${settingNotes}` : "",
    relationshipPressure ? `Relationship pressure: ${relationshipPressure}` : "",
  ].filter(Boolean).join(" ");
  const aiOutputConstraint = [
    firstMessage.aiOutputConstraint,
    openingBeat ? `Opening beat: ${openingBeat}` : "",
  ].filter(Boolean).join(" ");

  return {
    firstMessage: {
      ...firstMessage,
      aiOutputConstraint,
    },
    id: createArtifactId("scenario", `${title}:${trope}`),
    occupation,
    scenario: {
      ...scenario,
      scenePremiseDescription,
    },
    summary: scenePremiseDescription,
    tags: normalizeTags(`${trope}, ${scenario.settingType}, ${scenario.startingTension}, ${relationshipPressure ?? ""}`),
    title,
    trope,
    updatedAt: Date.now(),
    source: "generated",
  };
}

export function createBlankScenarioArtifact(
  title = "Untitled Scenario",
): GeneratedScenarioArtifact {
  const occupation = generateOccupationData({
    jobTitle: "Roleplay Setting",
    professionalDomain: "Arts_Entertainment",
    trope: "blank scenario",
  });

  return createScenarioArtifactFromEditable({
    firstMessage: {
      aiOutputConstraint:
        "Open with {{char}} reacting to the immediate scene pressure while leaving {{user}} fully free to respond.",
      entryPoint: "The_Approach",
      literaryStyle: "Action_Dialogue_Hybrid",
      tokenLengthCap: 450,
      userCallToAction: "Direct_Question",
    },
    id: createArtifactId("scenario", `${title}:blank`),
    occupation,
    scenario: {
      plotHook: "The_Chance_Encounter",
      scenePremiseDescription:
        "Write the core scene premise here, including where {{char}} and {{user}} are, why the moment matters, and what pressure keeps the exchange alive.",
      sensoryDetails: ["ambient sound", "lighting", "physical distance"],
      settingType: "Public_HighExposure",
      startingTension: "Charged_Electric",
    },
    source: "blank",
    summary:
      "Write the core scene premise here, including where {{char}} and {{user}} are, why the moment matters, and what pressure keeps the exchange alive.",
    tags: ["blank", "scenario"],
    title,
    trope: "Blank scenario",
  });
}

export function createImportedScenarioArtifact(
  value: unknown,
  sourceFileName?: string,
): GeneratedScenarioArtifact {
  if (!isRecord(value)) {
    throw new Error("Scenario JSON must be an object.");
  }

  const fallback = createBlankScenarioArtifact(
    readUnknownString(value.title) ||
      sourceFileName?.replace(/\.json$/i, "").trim() ||
      "Imported Scenario",
  );
  const scenario = isRecord(value.scenario) ? value.scenario : {};
  const firstMessage = isRecord(value.firstMessage) ? value.firstMessage : {};
  const title = readUnknownString(value.title) || fallback.title;
  const summary = readUnknownString(value.summary) ||
    readUnknownString(scenario.scenePremiseDescription) ||
    fallback.summary;

  return createScenarioArtifactFromEditable({
    firstMessage: {
      ...fallback.firstMessage,
      aiOutputConstraint:
        readUnknownString(firstMessage.aiOutputConstraint) ||
        fallback.firstMessage.aiOutputConstraint,
      entryPoint: readKnownValue(
        firstMessage.entryPoint,
        ["Active_Collision", "Mid_Action_Dialogue", "Post_Crisis_Quiet", "The_Approach"] as const,
        fallback.firstMessage.entryPoint,
      ),
      literaryStyle: readKnownValue(
        firstMessage.literaryStyle,
        ["Action_Dialogue_Hybrid", "Chat_Symphonic", "Internal_Monologue_Heavy", "Novella_Prose"] as const,
        fallback.firstMessage.literaryStyle,
      ),
      tokenLengthCap:
        readUnknownNumber(firstMessage.tokenLengthCap) ??
        fallback.firstMessage.tokenLengthCap,
      userCallToAction: readKnownValue(
        firstMessage.userCallToAction,
        ["Direct_Question", "Physical_Gesture", "Vulnerable_Slip", "Weighted_StandOff"] as const,
        fallback.firstMessage.userCallToAction,
      ),
    },
    id: readUnknownString(value.id) ||
      createArtifactId("scenario", `${title}:${sourceFileName ?? "imported"}`),
    occupation: fallback.occupation,
    scenario: {
      ...fallback.scenario,
      plotHook: readKnownValue(
        scenario.plotHook,
        ["The_Chance_Encounter", "The_Crisis", "The_Mandate", "The_Secret_Transaction"] as const,
        fallback.scenario.plotHook,
      ),
      scenePremiseDescription: summary,
      sensoryDetails: Array.isArray(scenario.sensoryDetails)
        ? scenario.sensoryDetails
            .map((detail) => readUnknownString(detail))
            .filter(Boolean)
            .slice(0, 8)
        : fallback.scenario.sensoryDetails,
      settingType: readKnownValue(
        scenario.settingType,
        ["Atmospheric_Wilderness", "Contained_Insular", "Corporate_Institutional", "Public_HighExposure"] as const,
        fallback.scenario.settingType,
      ),
      startingTension: readKnownValue(
        scenario.startingTension,
        ["Charged_Electric", "Combative_Friction", "Formal_Chilling", "Vulnerable_Exhausted"] as const,
        fallback.scenario.startingTension,
      ),
    },
    source: "imported",
    summary,
    tags: normalizeTagsFromUnknown(value.tags),
    title,
    trope: readUnknownString(value.trope) || "Imported scenario",
    updatedAt: readUnknownNumber(value.updatedAt) ?? Date.now(),
  });
}

export function createScenarioArtifactFromEditable(input: {
  firstMessage: GeneratedFirstMessageData;
  id: string;
  occupation: GeneratedOccupationData;
  scenario: GeneratedScenarioData;
  source?: GeneratedScenarioArtifact["source"];
  summary: string;
  tags: string[] | string;
  title: string;
  trope: string;
  updatedAt?: number;
}): GeneratedScenarioArtifact {
  const title = input.title.trim() || "Untitled Scenario";
  const summary = input.summary.trim() ||
    input.scenario.scenePremiseDescription.trim() ||
    "Untitled scenario premise.";
  const trope = input.trope.trim() || "Custom scenario";

  return {
    firstMessage: {
      ...input.firstMessage,
      aiOutputConstraint:
        input.firstMessage.aiOutputConstraint.trim() ||
        "Open the scene without writing {{user}}'s reply, choices, or internal state.",
      tokenLengthCap: Math.max(
        120,
        Math.min(1200, Math.round(input.firstMessage.tokenLengthCap)),
      ),
    },
    id: input.id,
    occupation: input.occupation,
    scenario: {
      ...input.scenario,
      scenePremiseDescription: summary,
      sensoryDetails: input.scenario.sensoryDetails
        .map((detail) => detail.trim())
        .filter(Boolean)
        .slice(0, 8),
    },
    source: input.source,
    summary,
    tags: Array.isArray(input.tags)
      ? normalizeTags(input.tags.join(", "))
      : normalizeTags(input.tags),
    title,
    trope,
    updatedAt: input.updatedAt ?? Date.now(),
  };
}

export function compileScenarioConstructionPrompt(input: ScenarioGenerationInput) {
  const constructionPrompt = input.constructionPrompt?.trim() ||
    DEFAULT_SCENARIO_CONSTRUCTION_PROMPT;

  return [
    constructionPrompt,
    "",
    "[SCENARIO INGREDIENTS]",
    `Title: ${input.title.trim() || "Untitled Scenario"}`,
    `Trope / route pressure: ${input.trope.trim() || "Unspecified"}`,
    `Occupation / role: ${input.jobTitle.trim() || "Unspecified"}`,
    `Professional domain: ${input.professionalDomain.replaceAll("_", " ")}`,
    `Setting notes: ${input.settingNotes?.trim() || "Unspecified"}`,
    `Relationship pressure: ${input.relationshipPressure?.trim() || "Unspecified"}`,
    `Opening beat: ${input.openingBeat?.trim() || "Unspecified"}`,
    "",
    "[OUTPUT REQUIREMENTS]",
    "Return a concise editable scenario artifact with scene premise, sensory anchors, opening constraint, tags, and runtime shape.",
    "Never assign {{user}} dialogue, internal thoughts, choices, or consent.",
  ].join("\n");
}

export function generateLorebookArtifact(
  input: LorebookGenerationInput,
): GeneratedLorebookArtifact {
  const trope = input.trope.trim() || "Contemporary romance";
  const species = generateSpeciesData(input.speciesType);
  const occupation = generateOccupationData({
    jobTitle: input.jobTitle.trim() || undefined,
    professionalDomain: input.professionalDomain,
    trope,
  });
  const relationships = generateRelationshipsData(trope);
  const summary = generateLorebookSummaryData(
    trope,
    species,
    occupation,
    relationships,
  );
  const placeholders = generateWorldLorePlaceholders(
    trope,
    species,
    occupation,
    summary,
  );
  const entries = generateLoreEntriesData(
    trope,
    species,
    occupation,
    relationships,
    summary,
    placeholders,
  );
  const title = input.title.trim() || summary.universeAnchor;

  return {
    entries,
    id: createArtifactId("lorebook", `${title}:${trope}`),
    occupation,
    placeholders,
    species,
    summary,
    tags: normalizeTags(`${trope}, ${species.type}, ${summary.universeAnchor}`),
    title,
    trope,
    updatedAt: Date.now(),
    source: "generated",
  };
}

export function createBlankLorebookArtifact(
  title = "Untitled Lorebook",
): GeneratedLorebookArtifact {
  const document = createLorebookV3Document({
    description: "A small modular lorebook draft.",
    entries: [
      LorebookV3EntrySchema.parse({
        content: "Write one focused lore rule, fact, relationship, location, or runtime cue here.",
        enabled: true,
        id: `entry_${Date.now().toString(36)}`,
        insertion_order: 0,
        keys: ["new trigger"],
        name: "New lore entry",
        use_regex: false,
      }),
    ],
    extensions: {
      heartwriteai: {
        source: "blank_lorebook",
      },
    },
    name: title,
    recursive_scanning: false,
    scan_depth: 3,
    token_budget: 600,
  });

  return createLorebookArtifactFromV3Document({
    document,
    id: createArtifactId("lorebook", `${title}:blank`),
    source: "blank",
  });
}

export function createImportedLorebookArtifact(
  document: LorebookV3Document,
  sourceFileName?: string,
): GeneratedLorebookArtifact {
  return createLorebookArtifactFromV3Document({
    document,
    id: createArtifactId(
      "lorebook",
      `${document.data.name ?? sourceFileName ?? "imported"}:${sourceFileName ?? "imported"}`,
    ),
    source: "imported",
    sourceFileName,
  });
}

export function createLorebookArtifactFromV3Document(input: {
  document: LorebookV3Document;
  id: string;
  source: NonNullable<GeneratedLorebookArtifact["source"]>;
  sourceFileName?: string;
}): GeneratedLorebookArtifact {
  const { document } = input;
  const title = document.data.name?.trim() ||
    input.sourceFileName?.replace(/\.json$/i, "").trim() ||
    "Untitled Lorebook";
  const description = document.data.description?.trim() ||
    `Imported lorebook with ${document.data.entries.length} entries.`;
  const species = generateSpeciesData("Human");
  const occupation = generateOccupationData({
    jobTitle: "Lorebook",
    professionalDomain: "Arts_Entertainment",
    trope: `${input.source} lorebook`,
  });
  const tags = normalizeTags(
    [
      input.source,
      "lorebook",
      input.sourceFileName?.replace(/\.json$/i, ""),
      ...document.data.entries.flatMap((entry) => entry.keys.slice(0, 2)),
    ]
      .filter(Boolean)
      .join(", "),
  );

  return {
    entries: document.data.entries.map((entry, index) => ({
      activationKeys: entry.keys,
      domainScope: "Societal_Customs",
      entryContent: entry.content,
      entryId: String(entry.id ?? `imported_${index + 1}`),
      insertionPriority: entry.constant
        ? "Constant_Anchor"
        : entry.selective
          ? "Recursive_Linked"
          : "Reactive_Contextual",
      title: entry.name ?? entry.comment ?? `Entry ${index + 1}`,
      tokenReserveCost: Math.max(25, Math.ceil(entry.content.length / 4)),
    })),
    id: input.id,
    occupation,
    placeholders: [],
    species,
    summary: {
      aiLoreInstruction: description,
      factionOrDynastyContext: description,
      tokenOptimizationCap: document.data.token_budget ?? 1200,
      universeAnchor: title,
      worldSystemRules: document.data.entries
        .slice(0, 4)
        .map((entry) => entry.name ?? entry.comment ?? String(entry.id ?? "Lore entry")),
    },
    tags,
    title,
    trope: `${input.source} lorebook`,
    updatedAt: Date.now(),
    source: input.source,
    v3Document: document,
  };
}

export function createRuntimeBundleArtifact(
  input: RuntimeBundleInput,
): RuntimeBundleArtifact {
  const persona = input.persona
    ? {
        id: input.persona.id,
        name: input.persona.name,
        prompt: input.persona.prompt?.trim() ||
          `USER PERSONA: ${input.persona.name}`,
        summary: input.persona.summary?.trim() ||
          `${input.persona.name} is the selected user persona.`,
      }
    : undefined;
  const scenario = input.scenario
    ? {
        id: input.scenario.id,
        openingConstraint: input.scenario.firstMessage.aiOutputConstraint,
        settingType: input.scenario.scenario.settingType,
        startingTension: input.scenario.scenario.startingTension,
        summary: input.scenario.summary,
        title: input.scenario.title,
      }
    : undefined;
  const lorebook = input.lorebook
    ? {
        entries: input.lorebook.v3Document
          ? input.lorebook.v3Document.data.entries.map((entry) => ({
              activationKeys: entry.keys,
              content: entry.content,
              title: entry.name ?? String(entry.id ?? "Untitled entry"),
            }))
          : input.lorebook.entries.map((entry) => ({
              activationKeys: entry.activationKeys,
              content: entry.entryContent,
              title: entry.title,
            })),
        id: input.lorebook.id,
        summary:
          input.lorebook.v3Document?.data.description ??
          input.lorebook.summary.aiLoreInstruction,
        title: input.lorebook.v3Document?.data.name ?? input.lorebook.title,
        universeAnchor:
          input.lorebook.v3Document?.data.name ??
          input.lorebook.summary.universeAnchor,
      }
    : undefined;
  const title = input.title.trim() ||
    [persona?.name, scenario?.title, lorebook?.title]
      .filter(Boolean)
      .join(" + ") ||
    "Untitled Runtime Bundle";
  const tags = normalizeTags(
    [
      "bundle",
      ...(input.persona?.tags ?? []),
      ...(input.scenario?.tags ?? []),
      ...(input.lorebook?.tags ?? []),
    ].join(", "),
  );

  return {
    compiledContext: compileRuntimeBundleContext({
      lorebook,
      persona,
      scenario,
      title,
    }),
    id: createArtifactId(
      "bundle",
      `${title}:${persona?.id ?? "no-persona"}:${scenario?.id ?? "no-scenario"}:${lorebook?.id ?? "no-lorebook"}`,
    ),
    lorebook,
    persona,
    scenario,
    source: "created",
    tags,
    title,
    updatedAt: Date.now(),
  };
}

export function createRuntimeBundleArtifactFromEditable(
  input: RuntimeBundleArtifact,
): RuntimeBundleArtifact {
  const title = input.title.trim() || "Untitled Runtime Bundle";
  const tags = normalizeTags(
    [
      "bundle",
      ...(input.tags ?? []),
      input.persona?.name,
      input.scenario?.title,
      input.lorebook?.title,
    ].filter(Boolean).join(", "),
  );

  return {
    ...input,
    compiledContext: compileRuntimeBundleContext({
      lorebook: input.lorebook,
      persona: input.persona,
      scenario: input.scenario,
      title,
    }),
    tags,
    title,
    updatedAt: input.updatedAt ?? Date.now(),
  };
}

export function createImportedRuntimeBundleArtifact(
  value: unknown,
  sourceFileName?: string,
): RuntimeBundleArtifact {
  if (!isRecord(value)) {
    throw new Error("Runtime bundle JSON must be an object.");
  }

  const title = readUnknownString(value.title) ||
    sourceFileName?.replace(/\.json$/i, "").trim() ||
    "Imported Runtime Bundle";
  const persona = readBundlePersona(value.persona);
  const scenario = readBundleScenario(value.scenario);
  const lorebook = readBundleLorebook(value.lorebook);

  return createRuntimeBundleArtifactFromEditable({
    compiledContext: readUnknownString(value.compiledContext),
    id: readUnknownString(value.id) ||
      createArtifactId("bundle", `${title}:${sourceFileName ?? "imported"}`),
    lorebook,
    persona,
    scenario,
    source: "imported",
    tags: normalizeTagsFromUnknown(value.tags),
    title,
    updatedAt: readUnknownNumber(value.updatedAt) ?? Date.now(),
  });
}

export function artifactToJsonBytes(artifact: unknown) {
  return new TextEncoder().encode(JSON.stringify(artifact, null, 2));
}

export function createArtifactFileName(title: string, suffix: string) {
  const safe = title
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safe || "heartwriteai-artifact"}${suffix}`;
}

export function createDuplicateArtifactId(prefix: string, source: string) {
  return createArtifactId(prefix, `${source}:copy`);
}

function createArtifactId(prefix: string, source: string) {
  const slug = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);

  return `${prefix}_${slug || "draft"}_${Date.now().toString(36)}`;
}

function normalizeTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, tags) => tags.indexOf(tag) === index)
    .slice(0, 12);
}

function normalizeTagsFromUnknown(value: unknown) {
  if (Array.isArray(value)) {
    return normalizeTags(
      value
        .map((tag) => readUnknownString(tag))
        .filter(Boolean)
        .join(", "),
    );
  }

  return normalizeTags(readUnknownString(value));
}

function humanize(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readUnknownString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readUnknownNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readKnownValue<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  return typeof value === "string" && allowed.includes(value as T[number])
    ? value as T[number]
    : fallback;
}

function readBundlePersona(
  value: unknown,
): RuntimeBundleArtifact["persona"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const name = readUnknownString(value.name);
  const id = readUnknownString(value.id);

  if (!name || !id) {
    return undefined;
  }

  return {
    id,
    name,
    prompt: readUnknownString(value.prompt) || `USER PERSONA: ${name}`,
    summary: readUnknownString(value.summary) ||
      `${name} is the selected user persona.`,
  };
}

function readBundleScenario(
  value: unknown,
): RuntimeBundleArtifact["scenario"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const title = readUnknownString(value.title);
  const id = readUnknownString(value.id);

  if (!title || !id) {
    return undefined;
  }

  return {
    id,
    openingConstraint: readUnknownString(value.openingConstraint) ||
      "Open the scene without writing {{user}}'s reply, choices, or internal state.",
    settingType: readUnknownString(value.settingType) || "Unspecified",
    startingTension: readUnknownString(value.startingTension) || "Unspecified",
    summary: readUnknownString(value.summary) ||
      `${title} is the selected roleplay scenario.`,
    title,
  };
}

function readBundleLorebook(
  value: unknown,
): RuntimeBundleArtifact["lorebook"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const title = readUnknownString(value.title);
  const id = readUnknownString(value.id);

  if (!title || !id) {
    return undefined;
  }

  return {
    entries: Array.isArray(value.entries)
      ? value.entries
          .filter(isRecord)
          .map((entry) => ({
            activationKeys: Array.isArray(entry.activationKeys)
              ? entry.activationKeys
                  .map((key) => readUnknownString(key))
                  .filter(Boolean)
                  .slice(0, 12)
              : [],
            content: readUnknownString(entry.content),
            title: readUnknownString(entry.title) || "Untitled entry",
          }))
          .filter((entry) => entry.content)
          .slice(0, 80)
      : [],
    id,
    summary: readUnknownString(value.summary) ||
      `${title} is the selected lorebook.`,
    title,
    universeAnchor: readUnknownString(value.universeAnchor) || title,
  };
}

function compileRuntimeBundleContext(input: {
  lorebook?: RuntimeBundleArtifact["lorebook"];
  persona?: RuntimeBundleArtifact["persona"];
  scenario?: RuntimeBundleArtifact["scenario"];
  title: string;
}) {
  const sections = [
    `RUNTIME BUNDLE: ${input.title}`,
    "",
    "[SELECTED PERSONA]",
    input.persona
      ? [
          `Name: ${input.persona.name}`,
          `Summary: ${input.persona.summary}`,
          "Prompt:",
          input.persona.prompt,
        ].join("\n")
      : "No persona selected.",
    "",
    "[SELECTED SCENARIO]",
    input.scenario
      ? [
          `Title: ${input.scenario.title}`,
          `Summary: ${input.scenario.summary}`,
          `Setting: ${input.scenario.settingType}`,
          `Starting tension: ${input.scenario.startingTension}`,
          `Opening constraint: ${input.scenario.openingConstraint}`,
        ].join("\n")
      : "No scenario selected.",
    "",
    "[SELECTED LOREBOOK]",
    input.lorebook
      ? [
          `Title: ${input.lorebook.title}`,
          `Universe anchor: ${input.lorebook.universeAnchor}`,
          `Core premise: ${input.lorebook.summary}`,
          "",
          "Entries:",
          ...input.lorebook.entries.map((entry) =>
            [
              `- ${entry.title}`,
              `  Keys: ${entry.activationKeys.join(", ")}`,
              `  Content: ${entry.content}`,
            ].join("\n"),
          ),
        ].join("\n")
      : "No lorebook selected.",
  ];

  return sections.join("\n");
}
