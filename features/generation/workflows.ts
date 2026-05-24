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

export type PersonaGenerationInput = {
  name: string;
  archetype: string;
  pointOfView: string;
  playStyle: string;
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
};

export function generatePersonaArtifact(
  input: PersonaGenerationInput,
): GeneratedPersonaArtifact {
  const name = input.name.trim() || "New Persona";
  const tags = normalizeTags(
    `${input.tags}, ${input.pointOfView}, ${input.playStyle}, ${input.archetype}`,
  );
  const emotionalNeed = input.emotionalNeed.trim() ||
    "to feel emotionally respected without having their agency overwritten";
  const boundaries = input.boundaries.trim() ||
    "Do not write this persona's thoughts, dialogue, or decisions for them.";
  const summary = [
    `${name} is a ${input.pointOfView} persona built for ${input.playStyle.toLowerCase()}.`,
    `Their roleplay pressure point is ${emotionalNeed}.`,
  ].join(" ");
  const prompt = [
    `USER PERSONA: ${name}`,
    `Archetype: ${input.archetype}`,
    `POV: ${input.pointOfView}`,
    `Play style: ${input.playStyle}`,
    `Core emotional need: ${emotionalNeed}`,
    `Boundaries: ${boundaries}`,
    "Runtime rule: treat this persona as user-controlled. Never narrate their private thoughts, unstated feelings, dialogue, choices, or consent.",
  ].join("\n");

  return {
    id: createArtifactId("persona", name),
    name,
    prompt,
    summary,
    tags,
    updatedAt: Date.now(),
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

function humanize(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}
