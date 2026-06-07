import type { CharacterCardDataV3 } from "../../types/character-card/CharacterCardDataV3";
import type { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import type { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";
import type { CharacterCardData } from "./generator";
import { resolveSemanticSeedIds } from "./semanticSeedResolver";

export interface CharacterSimilarityProfile {
  age?: number;
  backgroundKeywords: readonly string[];
  fears: readonly string[];
  gender: string;
  goals: readonly string[];
  mode: "SFW" | "NSFW" | "Platform-Safe" | "Unknown";
  name: string;
  occupation: string;
  personalityTraits: readonly string[];
  powerLevel: "high" | "medium" | "low" | "unknown";
  role: "protagonist" | "antagonist" | "supporting" | "unknown";
  semanticSeedIds: readonly string[];
  species: string;
  tags: readonly string[];
  values: readonly string[];
}

export interface CharacterSimilarityResult {
  character1Name: string;
  character2Name: string;
  commonalities: readonly string[];
  compatibility: "high" | "medium" | "low" | "conflict";
  conflictPotential: number;
  differences: readonly string[];
  overallScore: number;
  redundancy: {
    issues: readonly string[];
    level: "low" | "medium" | "high" | "extreme";
    score: number;
    uniquenessScore: number;
  };
  relationshipSuggestions: readonly string[];
  synergyPotential: number;
}

interface SimilarityScores {
  background: number;
  fears: number;
  goals: number;
  semantic: number;
  tags: number;
  traits: number;
  values: number;
}

const WEIGHTS: Record<keyof SimilarityScores, number> = {
  background: 0.05,
  fears: 0.1,
  goals: 0.15,
  semantic: 0.25,
  tags: 0.1,
  traits: 0.2,
  values: 0.15,
};

const ROLE_KEYWORDS = {
  antagonist: ["antagonist", "villain", "enemy", "nemesis", "rival"],
  protagonist: ["protagonist", "hero", "main character", "lead"],
  supporting: ["mentor", "sidekick", "companion", "supporting", "ally"],
} as const;

const HIGH_POWER_KEYWORDS = [
  "deity",
  "god",
  "immortal",
  "king",
  "queen",
  "emperor",
  "empress",
  "supreme",
  "ancient",
  "archangel",
  "demon lord",
];

const LOW_POWER_KEYWORDS = [
  "ordinary",
  "mundane",
  "civilian",
  "commoner",
  "powerless",
  "student",
  "apprentice",
];

export function createCharacterSimilarityProfile(
  source: CharacterCardV3 | CharacterCardPayload | CharacterCardData,
): CharacterSimilarityProfile {
  if (isGeneratedCharacterCardData(source)) {
    return createProfileFromGeneratedData(source);
  }

  return createProfileFromCardData(readCardData(source));
}

export function compareCharacterSimilarity(
  first: CharacterCardV3 | CharacterCardPayload | CharacterCardData,
  second: CharacterCardV3 | CharacterCardPayload | CharacterCardData,
): CharacterSimilarityResult {
  return compareCharacterSimilarityProfiles(
    createCharacterSimilarityProfile(first),
    createCharacterSimilarityProfile(second),
  );
}

export function compareCharacterSimilarityProfiles(
  first: CharacterSimilarityProfile,
  second: CharacterSimilarityProfile,
): CharacterSimilarityResult {
  const scores: SimilarityScores = {
    background: compareLists(first.backgroundKeywords, second.backgroundKeywords),
    fears: compareLists(first.fears, second.fears),
    goals: compareLists(first.goals, second.goals),
    semantic: compareSemanticSeeds(first.semanticSeedIds, second.semanticSeedIds),
    tags: compareLists(first.tags, second.tags),
    traits: compareLists(first.personalityTraits, second.personalityTraits),
    values: compareLists(first.values, second.values),
  };
  const overallScore = roundScore(
    (Object.entries(scores) as Array<[keyof SimilarityScores, number]>).reduce(
      (sum, [key, score]) => sum + score * WEIGHTS[key],
      0,
    ),
  );
  const conflictPotential = calculateConflictPotential(first, second);
  const synergyPotential = calculateSynergyPotential(first, second);
  const compatibility = assessCompatibility(overallScore, conflictPotential, synergyPotential);
  const redundancy = analyzeRedundancy(first, second, overallScore);

  return {
    character1Name: first.name || "Character 1",
    character2Name: second.name || "Character 2",
    commonalities: findCommonalities(first, second),
    compatibility,
    conflictPotential,
    differences: findDifferences(first, second),
    overallScore,
    redundancy,
    relationshipSuggestions: createRelationshipSuggestions(
      compatibility,
      conflictPotential,
      synergyPotential,
    ),
    synergyPotential,
  };
}

function createProfileFromGeneratedData(
  card: CharacterCardData,
): CharacterSimilarityProfile {
  const name = `${card.given_name} ${card.surname}`.trim();
  const text = [
    name,
    card.archetype?.personaType,
    card.archetype?.coreMotivation,
    card.archetype?.defenseMechanism,
    card.occupation?.jobTitle,
    card.occupation?.workplaceVibe,
    card.tone?.proseTexture,
    card.tone?.worldviewFilter,
    card.creatorsNotes?.contentRating,
    card.scenario?.scenePremiseDescription,
    card.relationshipStatus?.statusContext,
  ].join(" ");

  return {
    age: card.age,
    backgroundKeywords: tokenize([
      card.ethnicity?.culturalHeritage,
      card.nationality?.passportCountry,
      card.race?.macroGroup,
      card.scenario?.scenePremiseDescription,
    ]),
    fears: tokenize([card.archetype?.defenseMechanism, card.turnOffs?.aiReactionPrompt]),
    gender: "",
    goals: tokenize([card.archetype?.coreMotivation, card.relationshipStatus?.statusContext]),
    mode: card.kink?.nsfwEnabled || card.fetish?.fetishEnabled ? "NSFW" : "SFW",
    name,
    occupation: card.occupation?.jobTitle ?? "",
    personalityTraits: tokenize([
      card.archetype?.personaType,
      card.tone?.worldviewFilter,
      card.speechStyle?.speechPatternInstruction,
    ]),
    powerLevel: detectPowerLevel(text),
    role: detectRole(text),
    semanticSeedIds: [],
    species: card.species?.type ?? "Human",
    tags: [
      card.species?.type,
      card.occupation?.jobTitle,
      card.archetype?.personaType,
      card.tone?.worldviewFilter,
    ].filter((value): value is string => Boolean(value)),
    values: tokenize([card.archetype?.coreMotivation, card.tone?.worldviewFilter]),
  };
}

function createProfileFromCardData(data: CharacterCardDataV3): CharacterSimilarityProfile {
  const extensions = isRecord(data.extensions) ? data.extensions : {};
  const creationForm = readRecord(extensions.heartwriteai_character_creation_form);
  const personalityEngine = readRecord(extensions.heartwriteai_personality_engine);
  const amourai = readRecord(extensions.amourai);
  const text = [
    data.name,
    data.description,
    data.personality,
    data.system_prompt,
    data.post_history_instructions,
    data.creator_notes,
    data.scenario,
  ].join("\n");

  return {
    age: readAge(data, creationForm, amourai),
    backgroundKeywords: tokenize([
      data.scenario,
      readNestedString(creationForm, ["identity", "birthplace"]),
      readNestedString(creationForm, ["identity", "nationalityEthnicity"]),
      readNestedString(creationForm, ["identity", "speciesHeritage"]),
      readNestedString(creationForm, ["lifestyle", "residence"]),
      readNestedString(creationForm, ["relationships", "emotionalBonds", "sharedHistoryAnchor"]),
    ]),
    fears: tokenize([
      readNestedString(creationForm, ["cognitiveDrivers", "fear"]),
      readNestedString(creationForm, ["psychology", "coreWound"]),
      readNestedString(creationForm, ["psychology", "triggers"]),
      readNestedString(creationForm, ["internalThoughts", "motivationsFears"]),
    ]),
    gender: readNestedString(creationForm, ["identity", "genderIdentity"]),
    goals: tokenize([
      readNestedString(creationForm, ["cognitiveDrivers", "motivation"]),
      readNestedString(creationForm, ["behaviour", "goalOrientedActions"]),
      readNestedString(creationForm, ["relationships", "behavioralFriction", "ideologicalClash"]),
    ]),
    mode: detectMode(text),
    name: data.name,
    occupation:
      readNestedString(creationForm, ["identity", "occupation"]) ||
      readNestedString(readRecord(amourai.occupation_generation), ["jobTitle"]),
    personalityTraits: tokenize([
      data.personality,
      readNestedString(creationForm, ["personality", "archetype"]),
      readNestedString(creationForm, ["personality", "positiveTraits"]),
      readNestedString(creationForm, ["personality", "flaws"]),
      readNestedString(creationForm, ["personality", "humor"]),
      readNestedString(creationForm, ["personality", "socialBehaviour"]),
    ]),
    powerLevel: detectPowerLevel(text),
    role: detectRole(text),
    semanticSeedIds: readSemanticSeedIds(creationForm, personalityEngine),
    species:
      readNestedString(creationForm, ["identity", "speciesHeritage"]) ||
      readNestedString(readRecord(amourai.species_generation), ["type"]) ||
      "Human",
    tags: data.tags,
    values: tokenize([
      readNestedString(creationForm, ["psychology", "beliefs"]),
      readNestedString(creationForm, ["psychology", "moralFlexibility"]),
      readNestedString(creationForm, ["relationships", "affiliationCore", "factionOrGroup"]),
    ]),
  };
}

function readCardData(
  card: CharacterCardV3 | CharacterCardPayload,
): CharacterCardDataV3 {
  const data = isRecord(card.data) ? card.data : {};

  return {
    alternate_greetings: readStringArray(data.alternate_greetings),
    character_version: readString(data.character_version),
    creator: readString(data.creator),
    creator_notes: readString(data.creator_notes),
    description: readString(data.description),
    extensions: isRecord(data.extensions) ? data.extensions : {},
    first_mes: readString(data.first_mes),
    group_only_greetings: readStringArray(data.group_only_greetings),
    mes_example: readString(data.mes_example),
    name: readString(data.name),
    personality: readString(data.personality),
    post_history_instructions: readString(data.post_history_instructions),
    scenario: readString(data.scenario),
    system_prompt: readString(data.system_prompt),
    tags: readStringArray(data.tags),
  };
}

function compareLists(first: readonly string[], second: readonly string[]): number {
  const firstSet = normalizeSet(first);
  const secondSet = normalizeSet(second);

  if (!firstSet.size || !secondSet.size) {
    return 0;
  }

  return roundScore(countIntersection(firstSet, secondSet) / Math.max(firstSet.size, secondSet.size));
}

function compareSemanticSeeds(firstIds: readonly string[], secondIds: readonly string[]): number {
  const first = resolveSemanticSeedIds(firstIds, {
    includeParents: true,
    includeRelated: true,
  });
  const second = resolveSemanticSeedIds(secondIds, {
    includeParents: true,
    includeRelated: true,
  });

  return compareLists(
    first.flatMap((node) => [node.id, ...node.tags, ...node.aliases]),
    second.flatMap((node) => [node.id, ...node.tags, ...node.aliases]),
  );
}

function calculateConflictPotential(
  first: CharacterSimilarityProfile,
  second: CharacterSimilarityProfile,
): number {
  let score = 0.15;
  const valueOverlap = compareLists(first.values, second.values);
  const semanticOpposition = countSemanticOppositions(
    first.semanticSeedIds,
    second.semanticSeedIds,
  );

  if (new Set([first.role, second.role]).has("antagonist")) {
    score += 0.2;
  }
  if (first.powerLevel !== "unknown" && second.powerLevel !== "unknown" && first.powerLevel !== second.powerLevel) {
    score += 0.15;
  }
  score += Math.max(0, 0.25 - valueOverlap * 0.25);
  score += Math.min(0.3, semanticOpposition * 0.12);
  score += compareLists(first.fears, second.fears) * 0.1;

  return roundScore(clamp(score));
}

function calculateSynergyPotential(
  first: CharacterSimilarityProfile,
  second: CharacterSimilarityProfile,
): number {
  let score = 0.2;

  score += compareLists(first.goals, second.goals) * 0.3;
  score += compareLists(first.values, second.values) * 0.25;
  score += compareSemanticSeeds(first.semanticSeedIds, second.semanticSeedIds) * 0.25;
  if (new Set([first.role, second.role]).has("supporting")) {
    score += 0.1;
  }

  return roundScore(clamp(score));
}

function assessCompatibility(
  overallScore: number,
  conflictPotential: number,
  synergyPotential: number,
): CharacterSimilarityResult["compatibility"] {
  if (conflictPotential >= 0.65 && synergyPotential < 0.45) {
    return "conflict";
  }
  if (overallScore >= 0.7 || synergyPotential >= 0.65) {
    return "high";
  }
  if (overallScore >= 0.45 || synergyPotential >= 0.45) {
    return "medium";
  }
  return conflictPotential > 0.45 ? "conflict" : "low";
}

function analyzeRedundancy(
  first: CharacterSimilarityProfile,
  second: CharacterSimilarityProfile,
  overallScore: number,
): CharacterSimilarityResult["redundancy"] {
  const issues = [
    compareLists(first.personalityTraits, second.personalityTraits) >= 0.5
      ? "High overlap in personality traits."
      : "",
    compareLists(first.values, second.values) >= 0.5
      ? "Strong overlap in values or worldview."
      : "",
    first.occupation && normalizeToken(first.occupation) === normalizeToken(second.occupation)
      ? `Both share the same occupation (${first.occupation}).`
      : "",
    first.species && normalizeToken(first.species) === normalizeToken(second.species)
      ? "Same species or heritage background may reduce uniqueness."
      : "",
    overallScore >= 0.85 ? "Overall similarity is high enough to consider differentiation or merging." : "",
  ].filter(Boolean);
  const level =
    overallScore >= 0.95 ? "extreme" : overallScore >= 0.85 ? "high" : overallScore >= 0.7 ? "medium" : "low";

  return {
    issues,
    level,
    score: overallScore,
    uniquenessScore: roundScore(1 - overallScore),
  };
}

function findCommonalities(
  first: CharacterSimilarityProfile,
  second: CharacterSimilarityProfile,
): readonly string[] {
  return [
    first.species && normalizeToken(first.species) === normalizeToken(second.species)
      ? `Both carry ${first.species} species or heritage context.`
      : "",
    first.occupation && normalizeToken(first.occupation) === normalizeToken(second.occupation)
      ? `Both are linked to ${first.occupation}.`
      : "",
    describeShared("traits", first.personalityTraits, second.personalityTraits),
    describeShared("values", first.values, second.values),
    describeShared("goals", first.goals, second.goals),
    describeShared("tags", first.tags, second.tags),
  ].filter(Boolean);
}

function findDifferences(
  first: CharacterSimilarityProfile,
  second: CharacterSimilarityProfile,
): readonly string[] {
  return [
    first.species && second.species && normalizeToken(first.species) !== normalizeToken(second.species)
      ? `Different species or heritage context: ${first.species} vs ${second.species}.`
      : "",
    first.occupation && second.occupation && normalizeToken(first.occupation) !== normalizeToken(second.occupation)
      ? `Different occupations: ${first.occupation} vs ${second.occupation}.`
      : "",
    first.powerLevel !== "unknown" && second.powerLevel !== "unknown" && first.powerLevel !== second.powerLevel
      ? `Different power levels: ${first.powerLevel} vs ${second.powerLevel}.`
      : "",
    describeUnique(first.name || "Character 1", first.personalityTraits, second.personalityTraits),
    describeUnique(second.name || "Character 2", second.personalityTraits, first.personalityTraits),
  ].filter(Boolean);
}

function createRelationshipSuggestions(
  compatibility: CharacterSimilarityResult["compatibility"],
  conflictPotential: number,
  synergyPotential: number,
): readonly string[] {
  if (compatibility === "high") {
    return ["Use shared values as trust fuel, then add external pressure to avoid flat harmony."];
  }
  if (compatibility === "medium") {
    return ["Let cooperation work, but give them one recurring disagreement that keeps scenes alive."];
  }
  if (compatibility === "low") {
    return ["Use a concrete mutual need, debt, or deadline to make the connection plausible."];
  }
  if (conflictPotential > synergyPotential) {
    return ["Lean into ideological friction, rivalry, or forced proximity before asking them to trust each other."];
  }

  return ["Use alternating conflict and repair beats so the dynamic feels earned."];
}

function countSemanticOppositions(firstIds: readonly string[], secondIds: readonly string[]): number {
  const firstNodes = resolveSemanticSeedIds(firstIds);
  const secondIdSet = new Set(resolveSemanticSeedIds(secondIds).map((node) => node.id));

  return firstNodes.reduce(
    (count, node) => count + (node.opposite ?? []).filter((id) => secondIdSet.has(id)).length,
    0,
  );
}

function describeShared(
  label: string,
  first: readonly string[],
  second: readonly string[],
): string {
  const shared = Array.from(intersection(normalizeSet(first), normalizeSet(second))).slice(0, 5);

  return shared.length ? `Shared ${label}: ${shared.join(", ")}.` : "";
}

function describeUnique(
  label: string,
  first: readonly string[],
  second: readonly string[],
): string {
  const unique = Array.from(difference(normalizeSet(first), normalizeSet(second))).slice(0, 5);

  return unique.length ? `Unique signals for ${label}: ${unique.join(", ")}.` : "";
}

function readAge(
  data: CharacterCardDataV3,
  creationForm: Record<string, unknown>,
  amourai: Record<string, unknown>,
): number | undefined {
  const extensionAge = readNestedString(creationForm, ["identity", "age"]);
  const generatedAge = readNestedString(
    readRecord(amourai.age_generation),
    ["age"],
  );

  return parseAge(extensionAge) ?? parseAge(generatedAge) ?? parseAge(data.description);
}

function readSemanticSeedIds(
  creationForm: Record<string, unknown>,
  personalityEngine: Record<string, unknown>,
): readonly string[] {
  return [
    ...readStringArray(creationForm.semanticSeedIds),
    ...readStringArray(personalityEngine.semanticSeedIds),
  ];
}

function tokenize(values: readonly (string | undefined)[]): readonly string[] {
  const tokens = values
    .flatMap((value) => splitText(value ?? ""))
    .map(normalizeToken)
    .filter((value) => value.length >= 3 && !STOP_WORDS.has(value));

  return Array.from(new Set(tokens)).slice(0, 24);
}

function splitText(value: string): readonly string[] {
  return value
    .replace(/[_/|]+/g, " ")
    .split(/[^A-Za-z0-9'’-]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeSet(values: readonly string[]): Set<string> {
  return new Set(values.map(normalizeToken).filter(Boolean));
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function intersection<T>(first: Set<T>, second: Set<T>): Set<T> {
  return new Set([...first].filter((value) => second.has(value)));
}

function difference<T>(first: Set<T>, second: Set<T>): Set<T> {
  return new Set([...first].filter((value) => !second.has(value)));
}

function countIntersection<T>(first: Set<T>, second: Set<T>): number {
  return [...first].filter((value) => second.has(value)).length;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function readNestedString(
  value: Record<string, unknown>,
  path: readonly string[],
): string {
  let current: unknown = value;

  for (const key of path) {
    if (!isRecord(current)) {
      return "";
    }
    current = current[key];
  }

  return readString(current);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isGeneratedCharacterCardData(value: unknown): value is CharacterCardData {
  return isRecord(value) && typeof value.given_name === "string" && typeof value.surname === "string";
}

function parseAge(value: string): number | undefined {
  const match = value.match(/\b([1-9][0-9]{1,2})\b/);
  const age = match ? Number(match[1]) : NaN;

  return Number.isFinite(age) ? age : undefined;
}

function detectMode(text: string): CharacterSimilarityProfile["mode"] {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("platform-safe") || lowerText.includes("platform safe")) {
    return "Platform-Safe";
  }
  if (lowerText.includes("nsfw") || lowerText.includes("x_rated") || lowerText.includes("explicit")) {
    return "NSFW";
  }
  if (lowerText.includes("sfw")) {
    return "SFW";
  }

  return "Unknown";
}

function detectRole(text: string): CharacterSimilarityProfile["role"] {
  const lowerText = text.toLowerCase();

  for (const role of Object.keys(ROLE_KEYWORDS) as Array<keyof typeof ROLE_KEYWORDS>) {
    if (ROLE_KEYWORDS[role].some((keyword) => lowerText.includes(keyword))) {
      return role;
    }
  }

  return "unknown";
}

function detectPowerLevel(text: string): CharacterSimilarityProfile["powerLevel"] {
  const lowerText = text.toLowerCase();

  if (HIGH_POWER_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
    return "high";
  }
  if (LOW_POWER_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
    return "low";
  }

  return "unknown";
}

function roundScore(value: number): number {
  return Math.round(clamp(value) * 100) / 100;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

const STOP_WORDS = new Set([
  "and",
  "are",
  "but",
  "for",
  "from",
  "has",
  "have",
  "into",
  "not",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "with",
  "you",
  "your",
]);
