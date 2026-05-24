import { z } from "zod";

import type {
  RelationshipPatchReason,
  RelationshipUpdateResult,
} from "./relationshipUpdater";
import {
  RelationshipStateSchema,
  type RelationshipState,
} from "./relationshipState.schema";

const score = z.number().min(0).max(100);
const signedEffect = z.number().min(-500).max(500);

const TrackedEventTypeSchema = z.enum([
  "affection",
  "confession",
  "apology",
  "comfort",
  "jealousy",
  "betrayal",
  "abandonment",
  "misunderstanding",
  "reassurance",
  "boundary",
  "intimacy",
  "repair",
  "routine",
  "custom",
]);

export const TrackedEventSchema = z.object({
  id: z.string().trim().min(1),
  timestamp: z.number(),
  source: z.enum(["message", "scene", "system"]),
  type: TrackedEventTypeSchema,
  summary: z.string().trim().min(1),
  importance: score,
  emotionalWeight: score,
  effects: z
    .object({
      trust: signedEffect.optional(),
      intimacy: signedEffect.optional(),
      chemistry: signedEffect.optional(),
      rupture: signedEffect.optional(),
      momentum: signedEffect.optional(),
      attachment: signedEffect.optional(),
    })
    .default({}),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const StateDeltaSchema = z.object({
  path: z.string().trim().min(1),
  before: z.union([z.number(), z.string(), z.boolean()]),
  after: z.union([z.number(), z.string(), z.boolean()]),
  delta: z.number().optional(),
  reason: z.string().trim().min(1),
  eventId: z.string().trim().min(1).optional(),
});

export const TrajectorySnapshotSchema = z.object({
  currentLifecycle: z.string().trim().min(1),
  dominantMomentum: z.enum([
    "secure_deepening",
    "slow_burn",
    "push_pull",
    "repairing",
    "drifting",
    "fracturing",
    "obsessive",
    "domestic_stabilizing",
  ]),
  survivability: score,
  ruptureRisk: score,
  intimacyGrowthPotential: score,
  trustRecoveryPotential: score,
  predictedNextStates: z.array(z.string().trim().min(1)),
});

export const RelationshipTrackingSchema = z.object({
  currentState: RelationshipStateSchema,
  previousState: RelationshipStateSchema,
  recentEvents: z.array(TrackedEventSchema),
  importantMemories: RelationshipStateSchema.shape.memories,
  deltas: z.array(StateDeltaSchema),
  activeFlags: RelationshipStateSchema.shape.flags,
  trajectory: TrajectorySnapshotSchema,
});

export type TrackedEvent = z.infer<typeof TrackedEventSchema>;
export type StateDelta = z.infer<typeof StateDeltaSchema>;
export type TrajectorySnapshot = z.infer<typeof TrajectorySnapshotSchema>;
export type RelationshipTracking = z.infer<typeof RelationshipTrackingSchema>;

type EventEffectKey = keyof TrackedEvent["effects"];

export function shouldPromoteToMemory(event: TrackedEvent) {
  return (
    event.importance >= 70 ||
    event.emotionalWeight >= 75 ||
    event.type === "confession" ||
    event.type === "betrayal" ||
    event.type === "abandonment" ||
    event.type === "repair" ||
    event.type === "intimacy"
  );
}

export function buildTrackedEventsFromReasons(
  reasons: RelationshipPatchReason[],
  timestamp = 0,
): TrackedEvent[] {
  return reasons.map((reason, index) => {
    const type = inferEventType(reason);
    const effectKey = inferEffectKey(reason.key);
    const magnitude = Math.min(100, Math.abs(reason.delta));
    const emotionalWeight = clamp(
      baseEmotionalWeight(type) + Math.round(magnitude * 1.5),
    );
    const importance = clamp(baseImportance(type) + magnitude);
    const effects = effectKey ? { [effectKey]: reason.delta } : {};

    return TrackedEventSchema.parse({
      id: `event_${timestamp}_${index}_${type}`,
      timestamp,
      source: "message",
      type,
      summary: reason.reason,
      importance,
      emotionalWeight,
      effects,
      tags: [type, reason.key.split(".")[0]],
    });
  });
}

export function diffRelationshipState(
  previous: RelationshipState,
  next: RelationshipState,
  reasons: RelationshipPatchReason[] = [],
): StateDelta[] {
  const deltas: StateDelta[] = [];
  const reasonByPath = new Map(reasons.map((reason) => [reason.key, reason]));

  collectScalarDeltas(previous, next, "", deltas, reasonByPath);

  return deltas;
}

export function buildTrajectorySnapshot(
  state: RelationshipState,
): TrajectorySnapshot {
  const dominantMomentum = resolveDominantMomentum(state);
  const trustAverage = average([
    state.trust.emotional,
    state.trust.reliability,
    state.trust.conflict,
    state.trust.loyalty,
  ]);
  const survivability = clamp(
    trustAverage +
      state.momentum.stability * 0.25 +
      state.momentum.repair * 0.2 -
      state.rupture.trustDamage * 0.35 -
      state.rupture.vulnerabilityDamage * 0.2 -
      Math.max(0, state.momentum.drift) * 0.3,
  );
  const ruptureRisk = clamp(
    state.rupture.trustDamage +
      state.rupture.severity * 15 +
      Math.max(0, state.momentum.conflict) +
      Math.max(0, state.momentum.drift) -
      state.rupture.repairProgress * 0.45 -
      state.trust.conflict * 0.25,
  );
  const intimacyGrowthPotential = clamp(
    average([
      state.chemistry.romantic,
      state.chemistry.tension,
      state.trust.vulnerability,
      state.attachment.bondDepth,
      state.intimacy.emotional,
    ]) - state.rupture.vulnerabilityDamage * 0.25,
  );
  const trustRecoveryPotential = clamp(
    state.rupture.repairProgress * 0.35 +
      state.rupture.accountabilityLevel * 0.25 +
      state.rupture.changedBehaviorEvidence * 0.2 +
      state.trust.reliability * 0.25 +
      Math.max(0, state.momentum.repair) * 0.3,
  );

  return TrajectorySnapshotSchema.parse({
    currentLifecycle: state.lifecycleState,
    dominantMomentum,
    survivability,
    ruptureRisk,
    intimacyGrowthPotential,
    trustRecoveryPotential,
    predictedNextStates: predictedStatesForMomentum(dominantMomentum, state),
  });
}

export function trackRelationshipUpdate(
  previous: RelationshipState,
  next: RelationshipState,
  events: TrackedEvent[],
  reasons: RelationshipPatchReason[] = [],
): RelationshipTracking {
  return RelationshipTrackingSchema.parse({
    currentState: next,
    previousState: previous,
    recentEvents: events.slice(-30),
    importantMemories: next.memories,
    deltas: diffRelationshipState(previous, next, reasons),
    activeFlags: next.flags,
    trajectory: buildTrajectorySnapshot(next),
  });
}

export function createRelationshipTrackingFromUpdate(
  previous: RelationshipState,
  update: RelationshipUpdateResult,
  timestamp = 0,
): RelationshipTracking {
  return trackRelationshipUpdate(
    previous,
    update.state,
    buildTrackedEventsFromReasons(update.reasons, timestamp),
    update.reasons,
  );
}

function collectScalarDeltas(
  previous: unknown,
  next: unknown,
  path: string,
  deltas: StateDelta[],
  reasonByPath: Map<string, RelationshipPatchReason>,
) {
  if (isDeltaValue(previous) && isDeltaValue(next)) {
    if (previous === next || !path) return;

    const reason = reasonByPath.get(path);
    deltas.push(
      StateDeltaSchema.parse({
        path,
        before: previous ?? "",
        after: next ?? "",
        delta:
          typeof previous === "number" && typeof next === "number"
            ? next - previous
            : undefined,
        reason: reason?.reason ?? "State changed from relationship update.",
      }),
    );
    return;
  }

  if (Array.isArray(previous) || Array.isArray(next)) {
    const previousLength = Array.isArray(previous) ? previous.length : 0;
    const nextLength = Array.isArray(next) ? next.length : 0;

    if (previousLength !== nextLength && path) {
      deltas.push(
        StateDeltaSchema.parse({
          path: `${path}.length`,
          before: previousLength,
          after: nextLength,
          delta: nextLength - previousLength,
          reason: "Collection size changed from relationship update.",
        }),
      );
    }
    return;
  }

  if (!isRecord(previous) || !isRecord(next)) return;

  const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);

  for (const key of keys) {
    const childPath = path ? `${path}.${key}` : key;
    collectScalarDeltas(
      previous[key],
      next[key],
      childPath,
      deltas,
      reasonByPath,
    );
  }
}

function inferEventType(
  reason: RelationshipPatchReason,
): TrackedEvent["type"] {
  const haystack = `${reason.key} ${reason.reason}`.toLowerCase();

  if (
    haystack.includes("abandonment") &&
    (haystack.includes("soothed") || haystack.includes("reduced"))
  ) {
    return "reassurance";
  }
  if (haystack.includes("betrayal")) return "betrayal";
  if (haystack.includes("abandonment")) return "abandonment";
  if (haystack.includes("confession")) return "confession";
  if (haystack.includes("apology")) return "apology";
  if (haystack.includes("comfort")) return "comfort";
  if (haystack.includes("jealousy")) return "jealousy";
  if (haystack.includes("reassurance")) return "reassurance";
  if (haystack.includes("boundary")) return "boundary";
  if (haystack.includes("repair")) return "repair";
  if (
    haystack.includes("kiss") ||
    haystack.includes("sexual") ||
    haystack.includes("physical intimacy")
  ) {
    return "intimacy";
  }
  if (haystack.includes("affection") || haystack.includes("romantic warmth")) {
    return "affection";
  }
  if (haystack.includes("misunderstanding")) return "misunderstanding";

  return "custom";
}

function inferEffectKey(path: string): EventEffectKey | null {
  if (path.startsWith("trust.")) return "trust";
  if (path.startsWith("intimacy.")) return "intimacy";
  if (path.startsWith("chemistry.")) return "chemistry";
  if (path.startsWith("rupture.") || path === "rupture") return "rupture";
  if (path.startsWith("momentum.")) return "momentum";
  if (path.startsWith("attachment.")) return "attachment";

  return null;
}

function resolveDominantMomentum(
  state: RelationshipState,
): TrajectorySnapshot["dominantMomentum"] {
  const anxiousAvoidantPair =
    (state.attachment.aStyle === "anxious" &&
      state.attachment.bStyle === "avoidant") ||
    (state.attachment.aStyle === "avoidant" &&
      state.attachment.bStyle === "anxious");

  if (state.rupture.active && state.rupture.severity >= 3) {
    return state.rupture.repairProgress >= 40 ? "repairing" : "fracturing";
  }
  if (state.momentum.repair > 25 || state.rupture.repairProgress > 0) {
    return "repairing";
  }
  if (state.momentum.drift > 40) return "drifting";
  if (state.chemistry.obsessive > 70 || state.momentum.obsession > 60) {
    return "obsessive";
  }
  if (state.intimacy.domestic > 60 && state.attachment.bondDepth > 60) {
    return "domestic_stabilizing";
  }
  if (anxiousAvoidantPair && state.momentum.conflict > 20) return "push_pull";
  if (state.chemistry.tension > 45 && state.attachment.bondDepth < 60) {
    return "slow_burn";
  }

  return "secure_deepening";
}

function predictedStatesForMomentum(
  momentum: TrajectorySnapshot["dominantMomentum"],
  state: RelationshipState,
) {
  const byMomentum: Record<TrajectorySnapshot["dominantMomentum"], string[]> = {
    secure_deepening: ["vulnerability", "stable_partnership"],
    slow_burn: ["tension", "attachment_formation", "vulnerability"],
    push_pull: ["instability", "repair", "reconnection"],
    repairing: ["repair", "reconnection", "transformation"],
    drifting: ["plateau", "drift", "fracture"],
    fracturing: ["fracture", "repair", "dissolution"],
    obsessive: ["obsession", "instability", "devotional"],
    domestic_stabilizing: ["domestic_integration", "stable_partnership"],
  };
  const predicted = byMomentum[momentum];

  if (state.flags.breakupOccurred) return ["dissolution", "post_attachment"];
  if (state.rupture.active && state.rupture.severity >= 4) {
    return Array.from(new Set(["fracture", ...predicted]));
  }

  return predicted;
}

function baseImportance(type: TrackedEvent["type"]) {
  const weights: Record<TrackedEvent["type"], number> = {
    affection: 35,
    confession: 75,
    apology: 45,
    comfort: 50,
    jealousy: 55,
    betrayal: 90,
    abandonment: 85,
    misunderstanding: 45,
    reassurance: 45,
    boundary: 60,
    intimacy: 75,
    repair: 70,
    routine: 30,
    custom: 25,
  };

  return weights[type];
}

function baseEmotionalWeight(type: TrackedEvent["type"]) {
  const weights: Record<TrackedEvent["type"], number> = {
    affection: 45,
    confession: 80,
    apology: 45,
    comfort: 55,
    jealousy: 65,
    betrayal: 95,
    abandonment: 90,
    misunderstanding: 45,
    reassurance: 50,
    boundary: 60,
    intimacy: 80,
    repair: 75,
    routine: 25,
    custom: 30,
  };

  return weights[type];
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function isScalar(value: unknown): value is number | string | boolean {
  return (
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean"
  );
}

function isDeltaValue(
  value: unknown,
): value is number | string | boolean | undefined {
  return isScalar(value) || typeof value === "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
