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

  return {
    firstMessage,
    id: createArtifactId("scenario", `${title}:${trope}`),
    occupation,
    scenario,
    summary: scenario.scenePremiseDescription,
    tags: normalizeTags(`${trope}, ${scenario.settingType}, ${scenario.startingTension}`),
    title,
    trope,
    updatedAt: Date.now(),
  };
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
    tags,
    title,
    updatedAt: Date.now(),
  };
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
