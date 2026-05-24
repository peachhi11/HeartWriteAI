import { z } from "zod";

import {
  NonRomanticRelationshipStateSchema,
  RelationshipStateSchema,
  type RelationshipState,
} from "./relationshipState.schema";

const score = z.number().min(0).max(100);

export const NonRomanticTransitionSnapshotSchema = z.object({
  currentState: NonRomanticRelationshipStateSchema,
  romanceOverlap: z.enum([
    "absent",
    "ambiguous",
    "suppressed",
    "impossible",
    "emerging",
  ]),
  emotionallySignificant: z.boolean(),
  dominantAxes: z.array(z.string().trim().min(1)),
  romanticTransitionPressure: score,
  ambiguityPressure: score,
  ruptureSensitivity: score,
  likelyNextStates: z.array(NonRomanticRelationshipStateSchema),
});

export type NonRomanticRelationshipState = z.infer<
  typeof NonRomanticRelationshipStateSchema
>;
export type NonRomanticTransitionSnapshot = z.infer<
  typeof NonRomanticTransitionSnapshotSchema
>;

export function resolveNonRomanticRelationshipState(
  input: RelationshipState,
): NonRomanticRelationshipState {
  const state = RelationshipStateSchema.parse(input);
  const axes = state.nonRomantic.axes;

  if (state.rupture.active && axes.emotionalFamiliarity > 35) {
    return "estranged";
  }
  if (state.momentum.repair > 25 && axes.platonicAttachment > 45) {
    return "repaired_friendship";
  }
  if (axes.rivalry > 70 && axes.tension > 55 && axes.admiration > 35) {
    return "rival";
  }
  if (axes.rivalry > 70 && state.trust.emotional < 20) {
    return "enemy";
  }
  if (axes.ambiguity > 70 && axes.tension > 45) {
    return "ambiguous_emotional_bond";
  }
  if (axes.platonicAttachment > 75 && axes.devotion > 70 && axes.socialCloseness > 60) {
    return "queerplatonic_bond";
  }
  if (axes.platonicAttachment > 70 && axes.protectiveness > 70 && axes.devotion > 60) {
    return "found_family";
  }
  if (axes.dependency > 75 && axes.emotionalIntimacy > 55) {
    return "emotional_dependency_friendship";
  }
  if (axes.protectiveness > 70 && axes.trust > 45) {
    return "protective_bond";
  }
  if (axes.admiration > 65 && axes.trust > 45 && axes.socialCloseness > 25) {
    return "mentor_student";
  }
  if (
    axes.emotionalIntimacy > 70 &&
    axes.trust > 65 &&
    axes.platonicAttachment > 60
  ) {
    return "deep_friendship";
  }
  if (axes.trust > 55 && axes.emotionalFamiliarity > 50) {
    return "trusted_companion";
  }
  if (axes.socialCloseness > 45 && axes.emotionalIntimacy < 35) {
    return "casual_social_bond";
  }
  if (axes.emotionalFamiliarity > 55 && axes.platonicAttachment < 25) {
    return "emotionally_detached_familiarity";
  }
  if (axes.socialCloseness > 20 || axes.emotionalFamiliarity > 20) {
    return "acquaintance";
  }

  return "stranger";
}

export function syncNonRomanticRelationshipState(
  input: RelationshipState,
): RelationshipState {
  const state = RelationshipStateSchema.parse(structuredClone(input));
  const resolvedState = resolveNonRomanticRelationshipState(state);

  state.nonRomantic.state = resolvedState;
  state.nonRomantic.emotionallySignificant = isEmotionallySignificant(state);
  state.nonRomantic.romanceOverlap = resolveRomanceOverlap(state);

  return RelationshipStateSchema.parse(state);
}

export function buildNonRomanticTransitionSnapshot(
  input: RelationshipState,
): NonRomanticTransitionSnapshot {
  const state = syncNonRomanticRelationshipState(input);
  const axes = state.nonRomantic.axes;
  const romanticTransitionPressure = clamp(
    axes.ambiguity * 0.28 +
      axes.tension * 0.22 +
      axes.devotion * 0.18 +
      axes.emotionalIntimacy * 0.16 +
      state.chemistry.romantic * 0.16,
  );
  const ambiguityPressure = clamp(
    axes.ambiguity * 0.45 +
      axes.tension * 0.22 +
      axes.devotion * 0.13 +
      axes.platonicAttachment * 0.1 +
      state.chemistry.tension * 0.1,
  );
  const ruptureSensitivity = clamp(
    axes.dependency * 0.24 +
      axes.devotion * 0.18 +
      axes.emotionalIntimacy * 0.18 +
      axes.rivalry * 0.14 +
      state.attachment.abandonmentSensitivity * 0.16 +
      state.wounds.rejection * 0.1,
  );

  return NonRomanticTransitionSnapshotSchema.parse({
    currentState: state.nonRomantic.state,
    romanceOverlap: state.nonRomantic.romanceOverlap,
    emotionallySignificant: state.nonRomantic.emotionallySignificant,
    dominantAxes: dominantAxes(state),
    romanticTransitionPressure,
    ambiguityPressure,
    ruptureSensitivity,
    likelyNextStates: likelyNextNonRomanticStates(state),
  });
}

function resolveRomanceOverlap(
  state: RelationshipState,
): RelationshipState["nonRomantic"]["romanceOverlap"] {
  const axes = state.nonRomantic.axes;

  if (state.type === "forbidden_romance" && axes.tension > 45) {
    return "suppressed";
  }
  if (axes.ambiguity > 65 || state.lifecycleState === "tension") {
    return "ambiguous";
  }
  if (state.chemistry.romantic > 45 || state.lifecycleState === "attraction") {
    return "emerging";
  }

  return "absent";
}

function isEmotionallySignificant(state: RelationshipState) {
  const axes = state.nonRomantic.axes;

  return (
    axes.platonicAttachment >= 55 ||
    axes.emotionalIntimacy >= 55 ||
    axes.dependency >= 55 ||
    axes.devotion >= 55 ||
    axes.rivalry >= 65 ||
    axes.protectiveness >= 65 ||
    axes.ambiguity >= 65
  );
}

function dominantAxes(state: RelationshipState) {
  return Object.entries(state.nonRomantic.axes)
    .filter(([, value]) => value >= 55)
    .sort(([, first], [, second]) => second - first)
    .slice(0, 4)
    .map(([key]) => key);
}

function likelyNextNonRomanticStates(
  state: RelationshipState,
): NonRomanticRelationshipState[] {
  switch (state.nonRomantic.state) {
    case "stranger":
      return ["acquaintance", "casual_social_bond"];
    case "acquaintance":
      return ["casual_social_bond", "functional_partnership", "rival"];
    case "casual_social_bond":
      return ["trusted_companion", "deep_friendship"];
    case "functional_partnership":
      return ["trusted_companion", "rival", "public_alliance_private_tension"];
    case "trusted_companion":
      return ["deep_friendship", "protective_bond", "ambiguous_emotional_bond"];
    case "deep_friendship":
      return ["queerplatonic_bond", "ambiguous_emotional_bond", "found_family"];
    case "queerplatonic_bond":
      return ["deep_friendship", "found_family", "ambiguous_emotional_bond"];
    case "protective_bond":
      return ["trusted_companion", "found_family", "mentor_student"];
    case "mentor_student":
      return ["trusted_companion", "rival", "ambiguous_emotional_bond"];
    case "rival":
      return ["public_alliance_private_tension", "ambiguous_emotional_bond", "enemy"];
    case "enemy":
      return ["rival", "estranged"];
    case "obsessive_non_romantic_bond":
      return ["rival", "emotional_dependency_friendship", "ambiguous_emotional_bond"];
    case "trauma_bond_shared_survival":
      return ["trusted_companion", "found_family", "emotional_dependency_friendship"];
    case "found_family":
      return ["deep_friendship", "protective_bond"];
    case "emotional_dependency_friendship":
      return ["deep_friendship", "ambiguous_emotional_bond", "estranged"];
    case "ambiguous_emotional_bond":
      return ["deep_friendship", "rival", "queerplatonic_bond"];
    case "estranged":
      return ["repaired_friendship", "emotionally_detached_familiarity"];
    case "repaired_friendship":
      return ["trusted_companion", "deep_friendship"];
    case "public_alliance_private_tension":
      return ["rival", "ambiguous_emotional_bond", "functional_partnership"];
    case "emotionally_detached_familiarity":
      return ["acquaintance", "estranged"];
  }
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
