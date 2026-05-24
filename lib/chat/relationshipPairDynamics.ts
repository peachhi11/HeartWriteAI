import { z } from "zod";

import { RelationshipMeaningSystemsSchema } from "./relationshipMeaningfulEvents";

const score = z.coerce.number().min(0).max(100);

export const RelationshipPairTypeSchema = z.enum([
  "secure_secure",
  "anxious_avoidant",
  "fearful_fearful",
  "avoidant_avoidant",
  "anxious_anxious",
  "protector_guarded",
  "rival_rival",
  "tease_flustered",
  "devotional_independent",
  "caretaker_self_sacrificing",
  "chaotic_stabilizing",
  "obsessive_devotional",
  "emotional_stoic",
  "intellectual_emotional",
  "trauma_survivor_safe_partner",
  "high_passion_stability_seeker",
  "mutual_avoidance",
  "emotional_mirror",
  "growth_oriented",
  "fantasy_reality",
  "undetermined",
]);

export const RelationshipPairDynamicsSchema = z
  .object({
    type: RelationshipPairTypeSchema.default("undetermined"),
    pairChemistryDensity: score.default(0),
    repairCompatibility: score.default(50),
    attachmentFriction: score.default(0),
    emotionalTranslationFit: score.default(50),
    vulnerabilitySafety: score.default(50),
    tensionSustainability: score.default(0),
    growthPotential: score.default(50),
    stabilityPotential: score.default(50),
    obsessionRisk: score.default(0),
    dominantLoop: z
      .enum([
        "pursue_withdraw",
        "tease_fluster_retreat",
        "jealousy_reassurance",
        "conflict_silence_apology",
        "challenge_admiration_attraction",
        "comfort_guarded_softening",
        "stable_repair_deepening",
        "none",
      ])
      .default("none"),
    notes: z.array(z.string().trim().min(1)).default([]),
  })
  .default({
    type: "undetermined",
    pairChemistryDensity: 0,
    repairCompatibility: 50,
    attachmentFriction: 0,
    emotionalTranslationFit: 50,
    vulnerabilitySafety: 50,
    tensionSustainability: 0,
    growthPotential: 50,
    stabilityPotential: 50,
    obsessionRisk: 0,
    dominantLoop: "none",
    notes: [],
  });

export type RelationshipPairType = z.infer<typeof RelationshipPairTypeSchema>;
export type RelationshipPairDynamics = z.infer<
  typeof RelationshipPairDynamicsSchema
>;

export type PairDynamicsInput = {
  romantic: number;
  platonic: number;
  rivalry: number;
  trust: number;
  tension: number;
  jealousy: number;
  admiration: number;
  dependency: number;
  protectiveness: number;
  ambiguity: number;
  ruptureActive?: boolean;
  rivalThreat?: boolean;
  meaning: z.infer<typeof RelationshipMeaningSystemsSchema>;
};

export function resolveRelationshipPairDynamics(input: PairDynamicsInput) {
  const meaning = RelationshipMeaningSystemsSchema.parse(input.meaning);
  const attachmentFriction = clamp(
    input.jealousy * 0.35 +
      input.ambiguity * 0.2 +
      meaning.emotionalRank.replaceabilityFear * 0.25 +
      meaning.treatment.insecurityPressure * 0.2,
  );
  const pairChemistryDensity = clamp(
    input.romantic * 0.25 +
      input.tension * 0.25 +
      input.admiration * 0.15 +
      input.rivalry * 0.15 +
      meaning.desireAsymmetry.aDesiresB * 0.1 +
      meaning.desireAsymmetry.bDesiresA * 0.1,
  );
  const repairCompatibility = clamp(
    input.trust * 0.45 +
      meaning.patterns.jealousy_reassurance * 0.25 +
      meaning.patterns.conflict_silence_apology * 0.15 +
      (input.ruptureActive ? -15 : 15),
  );
  const vulnerabilitySafety = clamp(
    input.trust * 0.4 +
      input.protectiveness * 0.25 +
      (meaning.roleOwnership.safePerson ? 25 : 0),
  );
  const emotionalTranslationFit = clamp(
    input.trust * 0.25 +
      input.admiration * 0.2 +
      (meaning.roleOwnership.trustedConfidant ? 30 : 20),
  );
  const tensionSustainability = clamp(
    input.tension * 0.45 +
      input.rivalry * 0.25 +
      input.admiration * 0.15 +
      Math.max(0, 100 - attachmentFriction) * 0.15,
  );
  const stabilityPotential = clamp(
    input.trust * 0.35 +
      repairCompatibility * 0.25 +
      Math.max(0, 100 - attachmentFriction) * 0.25 +
      (input.ruptureActive ? -20 : 10),
  );
  const growthPotential = clamp(
    repairCompatibility * 0.25 +
      emotionalTranslationFit * 0.25 +
      vulnerabilitySafety * 0.2 +
      input.admiration * 0.15 +
      input.tension * 0.15,
  );
  const obsessionRisk = clamp(
    input.dependency * 0.25 +
      input.jealousy * 0.25 +
      meaning.rivalry.rivalThreat * 0.2 +
      meaning.emotionalRank.replaceabilityFear * 0.2 +
      input.ambiguity * 0.1,
  );
  const dominantLoop = resolveDominantLoop(input, meaning);
  const type = resolvePairType({
    input,
    meaning,
    attachmentFriction,
    pairChemistryDensity,
    repairCompatibility,
    vulnerabilitySafety,
    growthPotential,
    stabilityPotential,
    obsessionRisk,
    dominantLoop,
  });

  return RelationshipPairDynamicsSchema.parse({
    type,
    pairChemistryDensity,
    repairCompatibility,
    attachmentFriction,
    emotionalTranslationFit,
    vulnerabilitySafety,
    tensionSustainability,
    growthPotential,
    stabilityPotential,
    obsessionRisk,
    dominantLoop,
    notes: notesForPairType(type),
  });
}

function resolvePairType(input: {
  input: PairDynamicsInput;
  meaning: z.infer<typeof RelationshipMeaningSystemsSchema>;
  attachmentFriction: number;
  pairChemistryDensity: number;
  repairCompatibility: number;
  vulnerabilitySafety: number;
  growthPotential: number;
  stabilityPotential: number;
  obsessionRisk: number;
  dominantLoop: RelationshipPairDynamics["dominantLoop"];
}): RelationshipPairType {
  const { meaning } = input;

  if (
    input.input.trust >= 70 &&
    input.repairCompatibility >= 65 &&
    input.attachmentFriction <= 30
  ) {
    return "secure_secure";
  }

  if (
    input.dominantLoop === "pursue_withdraw" ||
    (input.attachmentFriction >= 60 && meaning.treatment.publicDistance >= 45)
  ) {
    return "anxious_avoidant";
  }

  if (input.obsessionRisk >= 75 && input.input.dependency >= 60) {
    return "obsessive_devotional";
  }

  if (input.input.rivalry >= 60 && input.input.admiration >= 45) {
    return "rival_rival";
  }

  if (input.dominantLoop === "tease_fluster_retreat") {
    return "tease_flustered";
  }

  if (
    input.input.protectiveness >= 55 &&
    input.vulnerabilitySafety >= 60 &&
    meaning.treatment.privateAffection < 45
  ) {
    return "protector_guarded";
  }

  if (
    input.input.trust >= 55 &&
    input.input.protectiveness >= 45 &&
    meaning.roleOwnership.safePerson
  ) {
    return "trauma_survivor_safe_partner";
  }

  if (
    input.pairChemistryDensity >= 65 &&
    input.stabilityPotential <= 45
  ) {
    return "high_passion_stability_seeker";
  }

  if (
    input.input.ambiguity >= 55 &&
    Object.values(meaning.initiative).some(
      (initiative) => initiative.avoids_defining >= 40,
    )
  ) {
    return "mutual_avoidance";
  }

  if (input.growthPotential >= 70) {
    return "growth_oriented";
  }

  if (meaning.comparison.rivalIdealization >= 50) {
    return "fantasy_reality";
  }

  if (input.input.dependency >= 55 && input.attachmentFriction >= 50) {
    return "anxious_anxious";
  }

  if (input.input.trust <= 35 && input.input.romantic >= 25) {
    return "avoidant_avoidant";
  }

  return "undetermined";
}

function resolveDominantLoop(
  input: PairDynamicsInput,
  meaning: z.infer<typeof RelationshipMeaningSystemsSchema>,
): RelationshipPairDynamics["dominantLoop"] {
  const patternEntries = Object.entries(meaning.patterns).sort(
    ([, first], [, second]) => second - first,
  );
  const [pattern, value] = patternEntries[0] ?? ["none", 0];

  if (value >= 40) {
    return pattern as RelationshipPairDynamics["dominantLoop"];
  }

  if (input.rivalry >= 50 && input.admiration >= 40) {
    return "challenge_admiration_attraction";
  }

  if (input.protectiveness >= 50 && meaning.roleOwnership.safePerson) {
    return "comfort_guarded_softening";
  }

  if (input.trust >= 65) {
    return "stable_repair_deepening";
  }

  return "none";
}

function notesForPairType(type: RelationshipPairType) {
  const notes: Record<RelationshipPairType, string[]> = {
    secure_secure: ["stable intimacy", "mutual emotional safety"],
    anxious_avoidant: ["pursuit withdrawal loop", "high attachment friction"],
    fearful_fearful: ["craving and fear amplify together"],
    avoidant_avoidant: ["mutual distance management", "subtext-heavy intimacy"],
    anxious_anxious: ["mutual reassurance loops", "fusion risk"],
    protector_guarded: ["safety meets vulnerability resistance"],
    rival_rival: ["challenge admiration attraction loop"],
    tease_flustered: ["provocation creates reactive vulnerability"],
    devotional_independent: ["prioritization meets autonomy preservation"],
    caretaker_self_sacrificing: ["support loops can hide unmet needs"],
    chaotic_stabilizing: ["intensity seeks regulation"],
    obsessive_devotional: ["emotional centralization and fixation risk"],
    emotional_stoic: ["visible emotion meets containment"],
    intellectual_emotional: ["analysis and feeling need translation"],
    trauma_survivor_safe_partner: ["consistent safety can restructure trust"],
    high_passion_stability_seeker: ["chemistry and predictability collide"],
    mutual_avoidance: ["both want intimacy while avoiding exposure"],
    emotional_mirror: ["similar wounds can bond or destabilize"],
    growth_oriented: ["challenge and adaptation increase long-term potential"],
    fantasy_reality: ["idealization meets grounded realism"],
    undetermined: ["insufficient pair signal"],
  };

  return notes[type];
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
