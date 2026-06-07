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
  occupation?: {
    authorityDynamic?: string;
    jobTitle?: string;
    workplaceVibe?: string;
  };
  archetype?: {
    personaType?: string;
    coreMotivation?: string;
    defenseMechanism?: string;
  };
  personalityTraits?: readonly string[];
  coreValues?: readonly string[];
  goals?: readonly string[];
  fears?: readonly string[];
  relationshipDynamic?: string;
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

export type AdultOffspringDevelopmentalPath =
  | "harmonious_synthesis"
  | "conflicted_division"
  | "rebellious_rejection"
  | "selective_adoption"
  | "transformation"
  | "trauma_response";

export type AdultOffspringEmotionalTemperature =
  | "cold_detached"
  | "warm_protective"
  | "volatile_reactive"
  | "guarded_cautious"
  | "controlled_intense";

export interface AdultOffspringSeedOptions extends AdultOffspringGeneratorOptions {
  contentMode?: "SFW" | "NSFW" | "Platform-Safe";
  relationshipAnchor?: string;
}

export interface AdultOffspringSeedSynthesis {
  developmentalPath: AdultOffspringDevelopmentalPath;
  emotionalTemperature: AdultOffspringEmotionalTemperature;
  inheritedPressure: string;
  lineageSignals: readonly string[];
  powerDynamic: string;
  seed: string;
  tensionAxis: string;
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

export function synthesizeAdultOffspringSeed({
  contentMode,
  parents,
  random = Math.random,
  relationshipAnchor = "{{user}}",
}: AdultOffspringSeedOptions): AdultOffspringSeedSynthesis {
  if (!parents.length) {
    throw new Error("At least one parent is required to synthesize an offspring seed.");
  }

  const species = inheritSpecies(parents, random);
  const developmentalPath = chooseDevelopmentalPath(parents, random);
  const emotionalTemperature = chooseEmotionalTemperature(parents);
  const inheritedPressure = chooseInheritedPressure(parents);
  const powerDynamic = choosePowerDynamic(parents);
  const tensionAxis = chooseTensionAxis(parents, relationshipAnchor);
  const lineageSignals = buildLineageSignals(parents, species);
  const role = chooseOffspringRole(parents, species);
  const modeText = contentMode ? ` Mode: ${contentMode}.` : "";

  return {
    developmentalPath,
    emotionalTemperature,
    inheritedPressure,
    lineageSignals,
    powerDynamic,
    seed: [
      `Adult ${role} shaped by ${formatSignal(inheritedPressure)}, ${formatDevelopmentalPath(developmentalPath)}`,
      `${tensionAxis}, ${formatEmotionalTemperature(emotionalTemperature)}.`,
      `Power dynamic: ${powerDynamic}.`,
      `${modeText}`,
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim(),
    tensionAxis,
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
    occupation: card.occupation,
    archetype: card.archetype,
    personalityTraits: compactStrings([
      card.archetype?.personaType,
      card.tone?.worldviewFilter,
      card.speechStyle?.speechPatternInstruction,
    ]),
    coreValues: compactStrings([card.archetype?.coreMotivation]),
    goals: compactStrings([
      card.archetype?.coreMotivation,
      card.relationshipStatus?.statusContext,
    ]),
    fears: compactStrings([
      card.archetype?.defenseMechanism,
      card.turnOffs?.aiReactionPrompt,
    ]),
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

function buildLineageSignals(
  parents: OffspringParentInput[],
  species: string,
): readonly string[] {
  return Array.from(
    new Set(
      [
        species !== "Human" ? `${species} lineage` : undefined,
        ...parents.flatMap((parent) => [
          parent.archetype?.coreMotivation,
          parent.archetype?.defenseMechanism,
          parent.relationshipDynamic,
          parent.tone?.worldviewFilter,
          ...(parent.coreValues ?? []),
          ...(parent.fears ?? []),
        ]),
      ].filter((value): value is string => Boolean(value)),
    ),
  ).slice(0, 8);
}

function chooseDevelopmentalPath(
  parents: OffspringParentInput[],
  random: () => number,
): AdultOffspringDevelopmentalPath {
  const values = parents.flatMap((parent) => parent.coreValues ?? []);
  const fears = parents.flatMap((parent) => parent.fears ?? []);

  if (parents.length >= 2 && compareNormalizedOverlap(values) === 0) {
    return "conflicted_division";
  }
  if (fears.length >= 3) {
    return "trauma_response";
  }
  if (parents.some((parent) => parent.archetype?.defenseMechanism?.includes("Autonomy"))) {
    return "rebellious_rejection";
  }

  return pick(
    [
      "harmonious_synthesis",
      "selective_adoption",
      "transformation",
    ] as const,
    random,
  );
}

function chooseEmotionalTemperature(
  parents: OffspringParentInput[],
): AdultOffspringEmotionalTemperature {
  const source = parents
    .flatMap((parent) => [
      parent.tone?.worldviewFilter,
      parent.archetype?.defenseMechanism,
      ...(parent.personalityTraits ?? []),
    ])
    .join(" ")
    .toLowerCase();

  if (source.includes("jaded") || source.includes("silent") || source.includes("cold")) {
    return "cold_detached";
  }
  if (source.includes("aggressive") || source.includes("vengeance") || source.includes("volatile")) {
    return "volatile_reactive";
  }
  if (source.includes("protection") || source.includes("guardian")) {
    return "warm_protective";
  }
  if (source.includes("rational") || source.includes("control")) {
    return "controlled_intense";
  }

  return "guarded_cautious";
}

function chooseInheritedPressure(parents: OffspringParentInput[]): string {
  return (
    pickExisting(parents.flatMap((parent) => parent.coreValues ?? [])) ??
    pickExisting(parents.map((parent) => parent.archetype?.coreMotivation)) ??
    pickExisting(parents.map((parent) => parent.tone?.worldviewFilter)) ??
    "family legacy"
  );
}

function choosePowerDynamic(parents: OffspringParentInput[]): string {
  const source = parents
    .flatMap((parent) => [
      parent.relationshipDynamic,
      parent.occupation?.authorityDynamic,
      parent.archetype?.personaType,
    ])
    .join(" ")
    .toLowerCase();

  if (source.includes("dominant") || source.includes("authority") || source.includes("protector")) {
    return "asymmetric toward {{char}}, softened by earned trust";
  }
  if (source.includes("subordinate") || source.includes("caretaker")) {
    return "asymmetric toward {{user}}, complicated by caretaking reflexes";
  }

  return "equal but emotionally uneven";
}

function chooseTensionAxis(
  parents: OffspringParentInput[],
  relationshipAnchor: string,
): string {
  const fear =
    pickExisting(parents.flatMap((parent) => parent.fears ?? [])) ??
    pickExisting(parents.map((parent) => parent.archetype?.defenseMechanism)) ??
    "becoming a copy of the people who shaped them";
  const goal =
    pickExisting(parents.flatMap((parent) => parent.goals ?? [])) ??
    pickExisting(parents.map((parent) => parent.archetype?.coreMotivation)) ??
    "building a self-authored life";

  return `protective of ${relationshipAnchor} because ${formatSignal(goal)}, terrified of ${formatSignal(fear)}`;
}

function chooseOffspringRole(
  parents: OffspringParentInput[],
  species: string,
): string {
  const occupation =
    pickExisting(parents.map((parent) => parent.occupation?.jobTitle)) ??
    pickExisting(parents.flatMap((parent) => parent.goals ?? []));

  if (occupation) {
    return `${species} ${formatSignal(occupation)}`;
  }

  return species === "Human" ? "legacy-burdened romantic lead" : `${species} legacy-bearer`;
}

function compareNormalizedOverlap(values: readonly string[]): number {
  const normalized = values.map((value) => value.trim().toLowerCase()).filter(Boolean);

  return new Set(normalized).size === normalized.length ? 0 : 1;
}

function formatSignal(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function formatDevelopmentalPath(path: AdultOffspringDevelopmentalPath): string {
  return {
    conflicted_division: "torn between incompatible inherited values",
    harmonious_synthesis: "carrying both households' strengths without fully trusting either",
    rebellious_rejection: "rebelling against the emotional rules they were taught",
    selective_adoption: "choosing one inheritance and rejecting the other",
    transformation: "turning inherited patterns into something sharper and stranger",
    trauma_response: "overcorrecting around old family damage",
  }[path];
}

function formatEmotionalTemperature(
  temperature: AdultOffspringEmotionalTemperature,
): string {
  return {
    cold_detached: "cold on the surface and watchful underneath",
    controlled_intense: "controlled, intense, and slow to reveal need",
    guarded_cautious: "guarded, cautious, and hungry for proof",
    volatile_reactive: "volatile when cornered but loyal once chosen",
    warm_protective: "warmly protective with a hard line around betrayal",
  }[temperature];
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

function compactStrings(values: readonly (string | undefined)[]): readonly string[] {
  return values.filter((value): value is string => Boolean(value));
}
