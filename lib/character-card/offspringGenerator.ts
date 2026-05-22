import { CharacterCardData, SpeciesType } from "@/lib/character-card/generator";

export interface OffspringParentInput {
  given_name: string;
  surname?: string;
  age?: number;
  apparent_age?: number;
  species?: {
    type?: SpeciesType | string;
    isImmortal?: boolean;
    instinctualTrait?: string;
    heritage?: string;
  };
  race?: {
    macroGroup?: string;
  };
  ethnicity?: {
    culturalHeritage?: string;
  };
  nationality?: {
    passportCountry?: string;
  };
  archetype?: {
    personaType?: string;
    coreMotivation?: string;
    defenseMechanism?: string;
  };
  tone?: {
    proseTexture?: string;
    worldviewFilter?: string;
  };
}

export interface AdultOffspringGeneratorOptions {
  anchorYear?: number;
  parents: OffspringParentInput[];
  random?: () => number;
  targetAge?: number;
}

export interface AdultOffspringProfile {
  age: number;
  birthYear: number;
  fullName: string;
  givenName: string;
  minorNpcRuntimeGuardrail: string;
  surname: string;
  inheritedSignals: string[];
  relationshipSummary: string;
  safetyNotes: string[];
  species: string;
  suggestedTags: string[];
}

const GIVEN_NAMES = [
  "Ari",
  "Cassian",
  "Elian",
  "Iris",
  "Jude",
  "Kaia",
  "Lena",
  "Mara",
  "Nico",
  "Rowan",
  "Sera",
  "Theo",
] as const;

export function generateAdultOffspringProfile({
  anchorYear = new Date().getUTCFullYear(),
  parents,
  random = Math.random,
  targetAge,
}: AdultOffspringGeneratorOptions): AdultOffspringProfile {
  if (!parents.length) {
    throw new Error("At least one parent is required to generate an offspring profile.");
  }

  const age = clampWholeNumber(
    targetAge ?? randomInt(18, youngestParentAge(parents) ? 32 : 45, random),
    18,
    80,
  );
  const surname =
    pickExisting(parents.map((parent) => parent.surname), random) ?? "Vale";
  const givenName = pick(GIVEN_NAMES, random);
  const species = inheritSpecies(parents, random);
  const inheritedSignals = buildInheritedSignals(parents, species);

  return {
    age,
    birthYear: anchorYear - age,
    fullName: `${givenName} ${surname}`,
    givenName,
    minorNpcRuntimeGuardrail: MINOR_NPC_RUNTIME_GUARDRAIL,
    surname,
    inheritedSignals,
    relationshipSummary: buildRelationshipSummary(parents, givenName),
    safetyNotes: [
      "Generated offspring profiles are always adults.",
      "Keep family relationships non-romantic and non-sexual unless the related characters are clearly non-blood and all adults.",
      "Use this as lineage, legacy, or next-generation story material, not as minor-coded content.",
    ],
    species,
    suggestedTags: [
      "Adult Offspring",
      "Family Legacy",
      "Next Generation",
      species,
    ],
  };
}

export function fromCharacterCardData(
  card: CharacterCardData,
): OffspringParentInput {
  return {
    given_name: card.given_name,
    surname: card.surname,
    age: card.age,
    apparent_age: card.apparent_age,
    species: card.species,
    race: card.race,
    ethnicity: card.ethnicity,
    nationality: card.nationality,
    archetype: card.archetype,
    tone: card.tone,
  };
}

export const MINOR_NPC_RUNTIME_GUARDRAIL =
  "Minor NPCs may appear only in non-sexual, non-romantic family or slice-of-life scenes. They may speak and act as supporting NPCs under {{char}}/AI control while the scene remains SFW. {{user}} and any user persona must always be adult. If a scene becomes sexualized, intimate, fetish-coded, or otherwise NSFW, minor NPCs must immediately stop being present in the active scene; do not mention them observing, interrupting, reacting, or participating. If {{user}} attempts to sexualize, romantically engage, involve, or continue interacting with a minor NPC in an adult context, refuse briefly and do not continue that thread.";

function buildInheritedSignals(
  parents: OffspringParentInput[],
  species: string,
): string[] {
  const signals = [
    species !== "Human" ? `${species} lineage` : undefined,
    pickExisting(parents.map((parent) => parent.ethnicity?.culturalHeritage)),
    pickExisting(parents.map((parent) => parent.nationality?.passportCountry)),
    pickExisting(parents.map((parent) => parent.archetype?.coreMotivation)),
    pickExisting(parents.map((parent) => parent.tone?.worldviewFilter)),
  ].filter((signal): signal is string => Boolean(signal));

  return Array.from(new Set(signals)).slice(0, 5);
}

function buildRelationshipSummary(
  parents: OffspringParentInput[],
  givenName: string,
): string {
  const parentNames = parents.map((parent) => parent.given_name).join(" and ");

  return `${givenName} is the adult offspring of ${parentNames}, shaped by family legacy, inherited pressure, and the need to define a life outside their parents' story.`;
}

function inheritSpecies(parents: OffspringParentInput[], random: () => number) {
  const parentSpecies = parents
    .map((parent) => parent.species?.type)
    .filter((species): species is string => Boolean(species));
  const supernaturalSpecies = parentSpecies.filter((species) => species !== "Human");

  if (supernaturalSpecies.length) {
    return pick(supernaturalSpecies, random);
  }

  return pickExisting(parentSpecies, random) ?? "Human";
}

function youngestParentAge(parents: OffspringParentInput[]) {
  return parents.reduce<number | undefined>((youngest, parent) => {
    if (!parent.age) {
      return youngest;
    }

    return youngest === undefined ? parent.age : Math.min(youngest, parent.age);
  }, undefined);
}

function clampWholeNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function randomInt(min: number, max: number, random: () => number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)] ?? values[0];
}

function pickExisting<T>(
  values: Array<T | undefined>,
  random: () => number = Math.random,
): T | undefined {
  const present = values.filter((value): value is T => value !== undefined);

  if (!present.length) {
    return undefined;
  }

  return pick(present, random);
}
