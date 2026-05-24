import type { ChatMessage } from "../character-card/postHistoryRuntime";
import {
  normalizeRelationshipState,
  type RelationshipState,
} from "./relationshipState.schema";

export function createRelationshipStateContext(input: RelationshipState) {
  const state = normalizeRelationshipState(input);
  const recentMemories = state.memories
    .slice(-3)
    .map(
      (memory) =>
        `${memory.type}: ${memory.summary} (weight ${memory.emotionalWeight})`,
    );

  return [
    "[SYSTEM NOTE: RELATIONSHIP STATE]",
    `- RELATIONSHIP ID: ${state.id}`,
    `- PARTICIPANTS: ${state.characters.aId} <-> ${state.characters.bId}`,
    `- TYPE: ${state.type}`,
    `- LIFECYCLE: ${state.lifecycleState}`,
    `- PHASE: ${state.phase.macro} (${state.phase.stage}/100, gate ${state.phase.softGate}/100)`,
    `- NON-ROMANTIC BOND: ${formatNonRomanticBond(state)}`,
    `- SEXUAL-ONLY BOND: ${formatSexualOnlyBond(state)}`,
    `- ATTACHMENT: ${state.attachment.aStyle} / ${state.attachment.bStyle}; bond ${state.attachment.bondDepth}; dependency ${state.attachment.dependency}`,
    `- TRUST: emotional ${state.trust.emotional}; vulnerability ${state.trust.vulnerability}; reliability ${state.trust.reliability}; conflict ${state.trust.conflict}`,
    `- INTIMACY: emotional ${state.intimacy.emotional}; physical ${state.intimacy.physical}; sexual ${state.intimacy.sexual}; domestic ${state.intimacy.domestic}; vulnerability ${state.intimacy.vulnerability}`,
    `- CHEMISTRY: romantic ${state.chemistry.romantic}; sexual ${state.chemistry.sexual}; tension ${state.chemistry.tension}; playful ${state.chemistry.playful}; obsessive ${state.chemistry.obsessive}`,
    `- NEEDS: reassurance ${state.needs.reassurance}; autonomy ${state.needs.autonomy}; safety ${state.needs.emotionalSafety}; exclusivity ${state.needs.exclusivity}`,
    `- EXCLUSIVITY: ${state.exclusivity.style}; emotional need ${state.exclusivity.emotionalNeed}; sexual need ${state.exclusivity.sexualNeed}; jealousy ${state.exclusivity.jealousyReactivity}`,
    `- DESIRE: ${state.desire.style}; libido ${state.desire.libidoIntensity}; novelty ${state.desire.noveltyDependence}; security ${state.desire.securityDependence}; stress sensitivity ${state.desire.stressSensitivity}`,
    `- RUPTURE: ${formatRupture(state)}`,
    `- MOMENTUM: attachment ${state.momentum.attachment}; trust ${state.momentum.trust}; conflict ${state.momentum.conflict}; repair ${state.momentum.repair}; drift ${state.momentum.drift}`,
    `- EROTIC DYNAMICS: ${formatEroticDynamics(state)}`,
    `- MEMORY ANCHORS: ${recentMemories.length ? recentMemories.join(" | ") : "none"}`,
    "- USE: Treat this as private runtime state. Preserve continuity, pacing, consent, boundaries, and emotional consequences. Do not expose numeric state directly in character dialogue.",
  ].join("\n");
}

export function appendRelationshipStateContext(
  messages: ChatMessage[],
  relationshipState: RelationshipState | undefined,
): ChatMessage[] {
  if (!relationshipState) {
    return messages;
  }

  return [
    ...messages,
    {
      role: "system",
      content: createRelationshipStateContext(relationshipState),
    },
  ];
}

function formatRupture(state: RelationshipState) {
  if (!state.rupture.active) {
    return "none active";
  }

  return [
    state.rupture.type ?? "unspecified",
    `severity ${state.rupture.severity}`,
    `repair ${state.rupture.repairArc}`,
    `progress ${state.rupture.repairProgress}`,
  ].join("; ");
}

function formatNonRomanticBond(state: RelationshipState) {
  const axes = state.nonRomantic.axes;

  return [
    state.nonRomantic.state,
    `overlap ${state.nonRomantic.romanceOverlap}`,
    `significant ${state.nonRomantic.emotionallySignificant}`,
    `platonic ${axes.platonicAttachment}`,
    `trust ${axes.trust}`,
    `intimacy ${axes.emotionalIntimacy}`,
    `rivalry ${axes.rivalry}`,
    `ambiguity ${axes.ambiguity}`,
  ].join("; ");
}

function formatSexualOnlyBond(state: RelationshipState) {
  const axes = state.sexualOnly.axes;

  return [
    state.sexualOnly.state,
    `active ${state.sexualOnly.active}`,
    `structure ${state.sexualOnly.statedStructure}`,
    `complicated ${state.sexualOnly.emotionallyComplicated}`,
    `sexual chemistry ${axes.sexualChemistry}`,
    `integration ${axes.emotionalIntegration}`,
    `ambiguity ${axes.exclusivityAmbiguity}`,
    `drift ${axes.attachmentDriftRisk}`,
    `definition avoidance ${axes.definitionAvoidance}`,
  ].join("; ");
}

function formatEroticDynamics(state: RelationshipState) {
  const kinkTags = state.eroticDynamics.kinkTags.length
    ? state.eroticDynamics.kinkTags.join(", ")
    : "none";
  const fetishTags = state.eroticDynamics.fetishTags.length
    ? state.eroticDynamics.fetishTags.join(", ")
    : "none";

  return [
    `adult gated ${state.eroticDynamics.adultOnlyWhenErotic}`,
    `kinks ${kinkTags}`,
    `fetish ${state.eroticDynamics.fetishCategory ?? "none"}`,
    `fetish tags ${fetishTags}`,
    `consent ${state.eroticDynamics.consentClarity}`,
    `boundary ${state.eroticDynamics.boundaryFit}`,
  ].join("; ");
}
