import type { RelationshipState } from "./relationshipState.schema";
import type { RelationshipTracking } from "./relationshipTracking";

export type RelationshipInsightAudience = "standard" | "advanced";

export type RelationshipInsight = {
  id: string;
  label: string;
  summary: string;
  confidence: number;
  visibleTo: RelationshipInsightAudience;
  tone?: "default" | "good" | "risk" | "warm";
  rawPaths?: string[];
};

export function buildRelationshipInsights(
  state: RelationshipState,
  tracking?: RelationshipTracking | null,
): RelationshipInsight[] {
  const insights: RelationshipInsight[] = [
    {
      id: "relationship_tracker",
      label: "Relationship Tracker",
      summary: relationshipSummary(state, tracking),
      confidence: 85,
      visibleTo: "standard",
      tone: toneFromRisk(tracking?.trajectory.ruptureRisk ?? 0),
    },
    {
      id: "emotional_brain",
      label: "Character Emotional Brain",
      summary: emotionalBrainSummary(state),
      confidence: 80,
      visibleTo: "standard",
      tone: state.rupture.active ? "risk" : "good",
    },
    {
      id: "attachment_direction",
      label: "Attachment Direction",
      summary: attachmentSummary(state),
      confidence: 78,
      visibleTo: "standard",
      tone: state.momentum.attachment >= 0 ? "good" : "warm",
    },
    {
      id: "trajectory",
      label: "Trajectory",
      summary: trajectorySummary(state, tracking),
      confidence: tracking ? 82 : 65,
      visibleTo: "standard",
      tone: tracking?.trajectory.dominantMomentum === "fracturing"
        ? "risk"
        : tracking?.trajectory.dominantMomentum === "repairing"
          ? "warm"
          : "good",
    },
    {
      id: "raw_trust",
      label: "Raw Trust State",
      summary: `emotional=${state.trust.emotional}; vulnerability=${state.trust.vulnerability}; loyalty=${state.trust.loyalty}; momentum=${state.momentum.trust}`,
      confidence: 100,
      visibleTo: "advanced",
      rawPaths: [
        "trust.emotional",
        "trust.vulnerability",
        "trust.loyalty",
        "momentum.trust",
      ],
    },
    {
      id: "raw_rupture",
      label: "Raw Rupture State",
      summary: `active=${state.rupture.active}; type=${state.rupture.type ?? "none"}; severity=${state.rupture.severity}; repair=${state.rupture.repairProgress}`,
      confidence: 100,
      visibleTo: "advanced",
      rawPaths: [
        "rupture.active",
        "rupture.type",
        "rupture.severity",
        "rupture.repairProgress",
      ],
    },
  ];

  return insights;
}

export function filterRelationshipInsights(
  insights: RelationshipInsight[],
  audience: RelationshipInsightAudience,
) {
  if (audience === "advanced") {
    return insights;
  }

  return insights.filter((insight) => insight.visibleTo === "standard");
}

function relationshipSummary(
  state: RelationshipState,
  tracking?: RelationshipTracking | null,
) {
  const lifecycle = humanize(state.lifecycleState);
  const trustDirection = state.momentum.trust >= 8
    ? "trust is rising"
    : state.momentum.trust <= -8
      ? "trust is under strain"
      : "trust is relatively steady";
  const trajectory = tracking
    ? ` Current trajectory reads as ${humanize(tracking.trajectory.dominantMomentum)}.`
    : "";

  return `The bond is currently in ${lifecycle}; ${trustDirection}.${trajectory}`;
}

function emotionalBrainSummary(state: RelationshipState) {
  if (state.rupture.active) {
    return `The character is processing a ${humanize(state.rupture.type ?? "relationship")} rupture and is most sensitive around ${humanize(state.rupture.repairArc)}.`;
  }

  const needs = strongestNeeds(state.needs);
  const insecurity = state.attachment.abandonmentSensitivity >
    state.attachment.engulfmentSensitivity
    ? "abandonment sensitivity"
    : "engulfment sensitivity";

  return `The character is emotionally oriented around ${needs.join(", ")} with ${humanize(insecurity)} as the strongest attachment pressure.`;
}

function attachmentSummary(state: RelationshipState) {
  if (state.momentum.attachment > 20) {
    return "Attachment is actively deepening through repeated positive emotional signals.";
  }

  if (state.momentum.attachment < -20) {
    return "Attachment is pulling back; distance, rupture, or overwhelm is weakening closeness.";
  }

  if (state.attachment.bondDepth > 65) {
    return "The bond is already meaningful, but current attachment momentum is stable rather than escalating.";
  }

  return "Attachment is still forming and will respond strongly to consistency, reassurance, and rupture/repair.";
}

function trajectorySummary(
  state: RelationshipState,
  tracking?: RelationshipTracking | null,
) {
  if (!tracking) {
    return `Likely next movement depends on whether ${humanize(state.lifecycleState)} is reinforced or disrupted.`;
  }

  return `Most likely next states: ${tracking.trajectory.predictedNextStates.map(humanize).join(", ")}. Rupture risk is ${tracking.trajectory.ruptureRisk}/100 and survivability is ${tracking.trajectory.survivability}/100.`;
}

function strongestNeeds(needs: RelationshipState["needs"]) {
  return Object.entries(needs)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => humanize(key));
}

function toneFromRisk(risk: number) {
  if (risk >= 65) {
    return "risk";
  }

  if (risk >= 35) {
    return "warm";
  }

  return "good";
}

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase();
}
