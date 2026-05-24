import { z } from "zod";

import {
  RelationshipStateSchema,
  SexualOnlyRelationshipStateSchema,
  type RelationshipState,
} from "./relationshipState.schema";

const score = z.number().min(0).max(100);

export const SexualOnlyTrajectorySchema = z.enum([
  "inactive",
  "stable_sexual_only",
  "romantic_escalation",
  "collapse_risk",
  "obsessive_escalation",
  "avoidant_compartmentalization",
]);

export const SexualOnlySnapshotSchema = z.object({
  currentState: SexualOnlyRelationshipStateSchema,
  trajectory: SexualOnlyTrajectorySchema,
  active: z.boolean(),
  emotionallyComplicated: z.boolean(),
  dominantRisks: z.array(z.string().trim().min(1)),
  attachmentDriftRisk: score,
  romanticEscalationProbability: score,
  collapseRisk: score,
  stabilityPotential: score,
  likelyNextStates: z.array(SexualOnlyRelationshipStateSchema),
});

export type SexualOnlyRelationshipState = z.infer<
  typeof SexualOnlyRelationshipStateSchema
>;
export type SexualOnlyTrajectory = z.infer<typeof SexualOnlyTrajectorySchema>;
export type SexualOnlySnapshot = z.infer<typeof SexualOnlySnapshotSchema>;

export function resolveSexualOnlyRelationshipState(
  input: RelationshipState,
): SexualOnlyRelationshipState {
  const state = RelationshipStateSchema.parse(input);
  const axes = state.sexualOnly.axes;
  const sexualCentrality = Math.max(
    axes.eroticCentrality,
    axes.sexualChemistry,
    state.intimacy.sexual,
    state.chemistry.sexual,
  );

  if (sexualCentrality < 35) return "none";
  if (axes.secrecy > 70) return "secret_sexual_relationship";
  if (state.intimacy.domestic > 55 && axes.eroticCentrality > 50) {
    return "domestic_sexual_hybrid";
  }
  if (axes.definitionAvoidance > 70 && axes.emotionalIntegration > 45) {
    return "attachment_denial_sexual_relationship";
  }
  if (
    axes.sexualChemistry > 80 &&
    (state.chemistry.obsessive > 60 || axes.dependencyFormation > 70)
  ) {
    return "obsessive_sexual_relationship";
  }
  if (state.attachment.engulfmentSensitivity > 60 && axes.emotionalIntegration < 35) {
    return "emotionally_avoidant_sexual_relationship";
  }
  if (state.chemistry.tension > 60 || axes.exclusivityAmbiguity > 65) {
    return "tension_based_sexual_dynamic";
  }
  if (
    state.nonRomantic.state === "deep_friendship" ||
    state.nonRomantic.state === "trusted_companion" ||
    state.sexualOnly.statedStructure === "friends_with_benefits"
  ) {
    return "friends_with_benefits";
  }
  if (state.sexualOnly.statedStructure === "hookup") {
    return "hookup_dynamic";
  }
  if (state.sexualOnly.statedStructure === "transactional") {
    return "transactional_sexual_relationship";
  }
  if (state.sexualOnly.statedStructure === "casual") {
    return "casual_sexual_relationship";
  }
  if (axes.emotionalIntegration < 25) {
    return "hookup_dynamic";
  }

  return "casual_sexual_relationship";
}

export function syncSexualOnlyRelationshipState(
  input: RelationshipState,
): RelationshipState {
  const state = RelationshipStateSchema.parse(structuredClone(input));
  const resolvedState = resolveSexualOnlyRelationshipState(state);

  state.sexualOnly.state = resolvedState;
  state.sexualOnly.active = resolvedState !== "none";
  state.sexualOnly.emotionallyComplicated = isEmotionallyComplicated(state);
  state.sexualOnly.axes.attachmentDriftRisk = calculateAttachmentDriftRisk(state);
  state.sexualOnly.axes.romanticEscalationProbability =
    calculateRomanticEscalationProbability(state);

  return RelationshipStateSchema.parse(state);
}

export function buildSexualOnlySnapshot(input: RelationshipState): SexualOnlySnapshot {
  const state = syncSexualOnlyRelationshipState(input);
  const axes = state.sexualOnly.axes;
  const attachmentDriftRisk = calculateAttachmentDriftRisk(state);
  const romanticEscalationProbability =
    calculateRomanticEscalationProbability(state);
  const collapseRisk = clamp(
    axes.exclusivityAmbiguity * 0.24 +
      axes.jealousyReactivity * 0.2 +
      axes.definitionAvoidance * 0.18 +
      Math.max(0, attachmentDriftRisk - axes.boundaryClarity) * 0.22 +
      state.rupture.trustDamage * 0.16,
  );
  const stabilityPotential = clamp(
    axes.boundaryClarity * 0.4 +
      state.trust.sexual * 0.25 +
      state.trust.emotional * 0.15 +
      (100 - axes.exclusivityAmbiguity) * 0.1 +
      (100 - axes.definitionAvoidance) * 0.1,
  );

  return SexualOnlySnapshotSchema.parse({
    currentState: state.sexualOnly.state,
    trajectory: resolveSexualOnlyTrajectory(
      state,
      attachmentDriftRisk,
      romanticEscalationProbability,
      collapseRisk,
      stabilityPotential,
    ),
    active: state.sexualOnly.active,
    emotionallyComplicated: state.sexualOnly.emotionallyComplicated,
    dominantRisks: dominantSexualOnlyRisks(state),
    attachmentDriftRisk,
    romanticEscalationProbability,
    collapseRisk,
    stabilityPotential,
    likelyNextStates: likelyNextSexualOnlyStates(state),
  });
}

function calculateAttachmentDriftRisk(state: RelationshipState) {
  const axes = state.sexualOnly.axes;

  return clamp(
    axes.emotionalIntegration * 0.24 +
      axes.vulnerabilityLeakage * 0.24 +
      axes.dependencyFormation * 0.2 +
      axes.jealousyReactivity * 0.12 +
      axes.definitionAvoidance * 0.1 +
      axes.sexualChemistry * 0.05 +
      state.attachment.bondDepth * 0.05 +
      state.intimacy.sexual * 0.04,
  );
}

function calculateRomanticEscalationProbability(state: RelationshipState) {
  const axes = state.sexualOnly.axes;

  return clamp(
    axes.attachmentDriftRisk * 0.25 +
      axes.emotionalIntegration * 0.2 +
      axes.vulnerabilityLeakage * 0.16 +
      state.chemistry.romantic * 0.16 +
      state.intimacy.emotional * 0.13 +
      Math.max(0, 100 - axes.definitionAvoidance) * 0.1,
  );
}

function resolveSexualOnlyTrajectory(
  state: RelationshipState,
  attachmentDriftRisk: number,
  romanticEscalationProbability: number,
  collapseRisk: number,
  stabilityPotential: number,
): SexualOnlyTrajectory {
  if (!state.sexualOnly.active) return "inactive";
  if (state.chemistry.obsessive > 65 || state.momentum.obsession > 55) {
    return "obsessive_escalation";
  }
  if (
    state.attachment.engulfmentSensitivity > 60 &&
    state.sexualOnly.axes.definitionAvoidance > 55
  ) {
    return "avoidant_compartmentalization";
  }
  if (romanticEscalationProbability > 65) return "romantic_escalation";
  if (collapseRisk > 65 && collapseRisk > stabilityPotential) return "collapse_risk";
  if (stabilityPotential >= 55 && attachmentDriftRisk < 55) {
    return "stable_sexual_only";
  }

  return "stable_sexual_only";
}

function isEmotionallyComplicated(state: RelationshipState) {
  const axes = state.sexualOnly.axes;

  return (
    axes.emotionalIntegration >= 45 ||
    axes.vulnerabilityLeakage >= 45 ||
    axes.jealousyReactivity >= 45 ||
    axes.dependencyFormation >= 45 ||
    axes.exclusivityAmbiguity >= 55 ||
    state.attachment.bondDepth >= 45
  );
}

function dominantSexualOnlyRisks(state: RelationshipState) {
  const axes = state.sexualOnly.axes;
  const risks = [
    ["attachment_drift", axes.attachmentDriftRisk],
    ["exclusivity_ambiguity", axes.exclusivityAmbiguity],
    ["vulnerability_leakage", axes.vulnerabilityLeakage],
    ["definition_avoidance", axes.definitionAvoidance],
    ["dependency_formation", axes.dependencyFormation],
    ["jealousy_reactivity", axes.jealousyReactivity],
    ["secrecy", axes.secrecy],
  ] as const;

  return risks
    .filter(([, value]) => value >= 55)
    .sort(([, first], [, second]) => second - first)
    .slice(0, 4)
    .map(([key]) => key);
}

function likelyNextSexualOnlyStates(
  state: RelationshipState,
): SexualOnlyRelationshipState[] {
  switch (state.sexualOnly.state) {
    case "none":
      return ["hookup_dynamic", "casual_sexual_relationship"];
    case "casual_sexual_relationship":
      return ["friends_with_benefits", "emotionally_avoidant_sexual_relationship"];
    case "friends_with_benefits":
      return [
        "attachment_denial_sexual_relationship",
        "tension_based_sexual_dynamic",
        "casual_sexual_relationship",
      ];
    case "hookup_dynamic":
      return ["casual_sexual_relationship", "tension_based_sexual_dynamic"];
    case "tension_based_sexual_dynamic":
      return [
        "attachment_denial_sexual_relationship",
        "obsessive_sexual_relationship",
        "secret_sexual_relationship",
      ];
    case "emotionally_avoidant_sexual_relationship":
      return [
        "casual_sexual_relationship",
        "attachment_denial_sexual_relationship",
      ];
    case "attachment_denial_sexual_relationship":
      return [
        "friends_with_benefits",
        "obsessive_sexual_relationship",
        "secret_sexual_relationship",
      ];
    case "obsessive_sexual_relationship":
      return [
        "attachment_denial_sexual_relationship",
        "tension_based_sexual_dynamic",
      ];
    case "transactional_sexual_relationship":
      return ["casual_sexual_relationship", "emotionally_avoidant_sexual_relationship"];
    case "secret_sexual_relationship":
      return [
        "tension_based_sexual_dynamic",
        "attachment_denial_sexual_relationship",
      ];
    case "domestic_sexual_hybrid":
      return ["friends_with_benefits", "attachment_denial_sexual_relationship"];
  }
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
