import { z } from "zod";

import {
  compactRelationshipMemories,
  RelationshipStateSchema,
  type RelationshipState,
} from "./relationshipState.schema";
import { trackRelationshipUpdate, type RelationshipTracking } from "./relationshipTracking";

const score = z.number().min(0).max(100);

export type RelationshipEdgeId = `${string}:${string}`;

export const RivalWinTypeSchema = z.enum([
  "rival_gets_attention",
  "rival_gets_laughter",
  "rival_gets_confession",
  "rival_gets_comfort_role",
  "rival_gets_public_praise",
  "rival_gets_physical_closeness",
  "rival_gets_trusted_secret",
  "rival_gets_chosen_in_conflict",
  "rival_gets_defended",
  "rival_gets_date",
  "rival_gets_kiss",
]);

export const NPCImpactEventSchema = z.object({
  id: z.string().trim().min(1),
  timestamp: z.number(),
  actorId: z.string().trim().min(1),
  targetId: z.string().trim().min(1),
  observerIds: z.array(z.string().trim().min(1)).default([]),
  npcId: z.string().trim().min(1).optional(),
  type: z.enum([
    "rival_flirt",
    "rival_comfort",
    "rival_confession",
    "rival_kiss",
    "rival_public_claim",
    "rival_rescue",
    "rival_betrayal",
    "rival_outcompetes_user",
    "char_chooses_rival",
    "char_rejects_rival",
    "char_reassures_user",
  ]),
  summary: z.string().trim().min(1),
  visibility: z.enum(["seen", "heard_about", "hidden"]),
  emotionalWeight: score,
  romanticThreat: score,
  humiliationImpact: score,
  replacementThreat: score,
  affectedEdges: z.array(z.string().trim().min(3)).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const NPCImpactResultSchema = z.object({
  state: RelationshipStateSchema,
  tracking: z.custom<RelationshipTracking>(),
  promotedToMemory: z.boolean(),
});

export type RivalWinType = z.infer<typeof RivalWinTypeSchema>;
export type NPCImpactEvent = z.infer<typeof NPCImpactEventSchema>;
export type NPCImpactResult = z.infer<typeof NPCImpactResultSchema>;

export function relationshipEdgeId(
  firstId: string,
  secondId: string,
): RelationshipEdgeId {
  return [firstId, secondId].sort().join(":") as RelationshipEdgeId;
}

export function shouldPromoteNPCImpactToMemory(event: NPCImpactEvent) {
  return (
    event.tags.some((tag) => isPinnedMemoryTag(tag)) ||
    event.emotionalWeight >= 70 ||
    event.romanticThreat >= 70 ||
    event.replacementThreat >= 70 ||
    event.humiliationImpact >= 70 ||
    event.type === "rival_confession" ||
    event.type === "rival_kiss" ||
    event.type === "rival_public_claim" ||
    event.type === "char_chooses_rival"
  );
}

export function applyNPCImpact(
  current: RelationshipState,
  input: NPCImpactEvent,
): RelationshipState {
  const event = NPCImpactEventSchema.parse(input);
  const state = RelationshipStateSchema.parse(structuredClone(current));

  if (!affectsCurrentRelationship(state, event)) {
    return state;
  }

  const userId = state.characters.aId;
  const charId = state.characters.bId;
  const rivalId = resolveRivalId(state, event);
  const rivalry = findOrCreateRivalry(state, rivalId, charId, userId);
  const threatScale = event.visibility === "hidden" ? 0.35 : 1;
  const romanticThreat = Math.round(event.romanticThreat * threatScale);
  const replacementThreat = Math.round(event.replacementThreat * threatScale);
  const humiliationImpact = Math.round(event.humiliationImpact * threatScale);

  rivalry.rivalThreatLevel = clamp(
    rivalry.rivalThreatLevel + Math.round(romanticThreat * 0.18),
  );
  rivalry.userInsecurity = clamp(
    rivalry.userInsecurity + Math.round(replacementThreat * 0.16),
  );
  rivalry.publicHumiliation = clamp(
    rivalry.publicHumiliation + Math.round(humiliationImpact * 0.2),
  );
  rivalry.replacementFear = clamp(
    rivalry.replacementFear + Math.round(replacementThreat * 0.18),
  );
  rivalry.jealousyMomentum = clamp(
    rivalry.jealousyMomentum + Math.round(event.emotionalWeight * 0.12),
  );

  applyImpactByType(state, event, rivalry);

  if (shouldPromoteNPCImpactToMemory(event)) {
    state.memories.push({
      id: `mem_${event.id}`,
      type: memoryTypeForNPCImpact(event),
      summary: event.summary,
      emotionalWeight: event.emotionalWeight,
      trustImpact: trustImpactForNPCImpact(event),
      intimacyImpact: intimacyImpactForNPCImpact(event),
      timestamp: event.timestamp,
      tags: Array.from(new Set(["npc_impact", ...event.tags])),
    });

    state.memories = compactRelationshipMemories(state.memories);
  }

  return RelationshipStateSchema.parse(state);
}

export function applyNPCImpactWithTracking(
  current: RelationshipState,
  input: NPCImpactEvent,
): NPCImpactResult {
  const event = NPCImpactEventSchema.parse(input);
  const previous = RelationshipStateSchema.parse(structuredClone(current));
  const state = applyNPCImpact(previous, event);
  const promotedToMemory = state.memories.some(
    (memory) => memory.id === `mem_${event.id}`,
  );
  const tracking = trackRelationshipUpdate(
    previous,
    state,
    [
      {
        id: event.id,
        timestamp: event.timestamp,
        source: "scene",
        type: trackedEventTypeForNPCImpact(event),
        summary: event.summary,
        importance: clamp(
          Math.max(
            event.romanticThreat,
            event.replacementThreat,
            event.humiliationImpact,
          ),
        ),
        emotionalWeight: event.emotionalWeight,
        effects: {
          trust: state.trust.loyalty - previous.trust.loyalty,
          intimacy: state.intimacy.emotional - previous.intimacy.emotional,
          chemistry: state.chemistry.tension - previous.chemistry.tension,
          momentum: state.momentum.conflict - previous.momentum.conflict,
          attachment:
            state.attachment.abandonmentSensitivity -
            previous.attachment.abandonmentSensitivity,
        },
        tags: Array.from(new Set(["npc_impact", ...event.tags])),
      },
    ],
  );

  return NPCImpactResultSchema.parse({
    state,
    tracking,
    promotedToMemory,
  });
}

export function mapRivalWinToNPCImpact(input: {
  id: string;
  timestamp: number;
  rivalId: string;
  charId: string;
  userId: string;
  winType: RivalWinType;
  summary: string;
  visibility?: NPCImpactEvent["visibility"];
}): NPCImpactEvent {
  const mapping: Record<
    RivalWinType,
    Pick<
      NPCImpactEvent,
      "type" | "romanticThreat" | "humiliationImpact" | "replacementThreat"
    > & { tags: string[] }
  > = {
    rival_gets_attention: {
      type: "rival_outcompetes_user",
      romanticThreat: 45,
      humiliationImpact: 25,
      replacementThreat: 50,
      tags: ["rivalry", "jealousy", "replacement_fear"],
    },
    rival_gets_laughter: {
      type: "rival_outcompetes_user",
      romanticThreat: 40,
      humiliationImpact: 35,
      replacementThreat: 45,
      tags: ["rivalry", "playful_chemistry", "replacement_fear"],
    },
    rival_gets_confession: {
      type: "rival_confession",
      romanticThreat: 90,
      humiliationImpact: 65,
      replacementThreat: 90,
      tags: ["rivalry", "confession", "replacement_fear"],
    },
    rival_gets_comfort_role: {
      type: "rival_comfort",
      romanticThreat: 70,
      humiliationImpact: 55,
      replacementThreat: 75,
      tags: ["rivalry", "role_displacement", "comfort_role"],
    },
    rival_gets_public_praise: {
      type: "rival_public_claim",
      romanticThreat: 65,
      humiliationImpact: 80,
      replacementThreat: 65,
      tags: ["rivalry", "public_humiliation"],
    },
    rival_gets_physical_closeness: {
      type: "rival_kiss",
      romanticThreat: 85,
      humiliationImpact: 60,
      replacementThreat: 80,
      tags: ["rivalry", "physical_closeness", "romantic_threat"],
    },
    rival_gets_trusted_secret: {
      type: "rival_outcompetes_user",
      romanticThreat: 75,
      humiliationImpact: 55,
      replacementThreat: 80,
      tags: ["rivalry", "trusted_secret", "emotional_betrayal_risk"],
    },
    rival_gets_chosen_in_conflict: {
      type: "char_chooses_rival",
      romanticThreat: 85,
      humiliationImpact: 85,
      replacementThreat: 85,
      tags: ["rivalry", "loyalty_rupture", "public_choice"],
    },
    rival_gets_defended: {
      type: "char_chooses_rival",
      romanticThreat: 80,
      humiliationImpact: 75,
      replacementThreat: 80,
      tags: ["rivalry", "defended_rival", "loyalty_rupture"],
    },
    rival_gets_date: {
      type: "char_chooses_rival",
      romanticThreat: 90,
      humiliationImpact: 70,
      replacementThreat: 92,
      tags: ["rivalry", "date", "replacement_fear"],
    },
    rival_gets_kiss: {
      type: "rival_kiss",
      romanticThreat: 95,
      humiliationImpact: 85,
      replacementThreat: 95,
      tags: ["rivalry", "kiss", "romantic_threat"],
    },
  };
  const mapped = mapping[input.winType];
  const emotionalWeight = clamp(
    Math.max(
      mapped.romanticThreat,
      mapped.humiliationImpact,
      mapped.replacementThreat,
    ),
  );

  return NPCImpactEventSchema.parse({
    id: input.id,
    timestamp: input.timestamp,
    actorId: input.rivalId,
    targetId: input.charId,
    observerIds: [input.userId],
    npcId: input.rivalId,
    type: mapped.type,
    summary: input.summary,
    visibility: input.visibility ?? "seen",
    emotionalWeight,
    romanticThreat: mapped.romanticThreat,
    humiliationImpact: mapped.humiliationImpact,
    replacementThreat: mapped.replacementThreat,
    affectedEdges: [
      relationshipEdgeId(input.userId, input.charId),
      relationshipEdgeId(input.rivalId, input.charId),
    ],
    tags: mapped.tags,
  });
}

function applyImpactByType(
  state: RelationshipState,
  event: NPCImpactEvent,
  rivalry: RelationshipState["npcDynamics"]["rivalries"][number],
) {
  switch (event.type) {
    case "rival_comfort":
      applyRivalWin(state, event, rivalry, "comfortRoleOwner");
      state.npcDynamics.roleOwnership.comfortRoleOwner =
        event.npcId ?? event.actorId;
      break;
    case "rival_rescue":
      applyRivalWin(state, event, rivalry, "protectorRoleOwner");
      state.npcDynamics.roleOwnership.protectorRoleOwner =
        event.npcId ?? event.actorId;
      break;
    case "rival_flirt":
      applyRivalWin(state, event, rivalry, "flirtationRoleOwner");
      state.npcDynamics.roleOwnership.flirtationRoleOwner =
        event.npcId ?? event.actorId;
      break;
    case "rival_confession":
      applyRivalWin(state, event, rivalry, "romanticPriorityOwner");
      state.npcDynamics.roleOwnership.romanticPriorityOwner =
        event.npcId ?? event.actorId;
      break;
    case "rival_kiss":
      applyRivalWin(state, event, rivalry, "sexualTensionOwner");
      state.npcDynamics.roleOwnership.sexualTensionOwner =
        event.npcId ?? event.actorId;
      break;
    case "rival_public_claim":
    case "rival_outcompetes_user":
      applyRivalWin(state, event, rivalry);
      break;
    case "char_chooses_rival":
      applyRivalWin(state, event, rivalry, "romanticPriorityOwner");
      state.trust.loyalty = clamp(
        state.trust.loyalty - (event.romanticThreat > 70 ? 10 : 5),
      );
      state.rupture.active = event.humiliationImpact >= 75;
      state.rupture.type = event.humiliationImpact >= 75
        ? "humiliation"
        : state.rupture.type;
      state.rupture.severity = Math.max(
        state.rupture.severity,
        event.humiliationImpact >= 75 ? 3 : 1,
      );
      break;
    case "char_rejects_rival":
    case "char_reassures_user":
      applyCharReassurance(state, event, rivalry);
      break;
    case "rival_betrayal":
      state.trust.loyalty = clamp(state.trust.loyalty + 4);
      rivalry.rivalThreatLevel = clamp(rivalry.rivalThreatLevel - 12);
      rivalry.replacementFear = clamp(rivalry.replacementFear - 10);
      rivalry.lastUserWin = event.id;
      break;
  }
}

function applyRivalWin(
  state: RelationshipState,
  event: NPCImpactEvent,
  rivalry: RelationshipState["npcDynamics"]["rivalries"][number],
  role?: keyof RelationshipState["npcDynamics"]["roleOwnership"],
) {
  state.chemistry.tension = clamp(
    state.chemistry.tension + Math.round(event.romanticThreat * 0.1),
  );
  state.exclusivity.jealousyReactivity = clamp(
    state.exclusivity.jealousyReactivity +
      Math.round(event.replacementThreat * 0.16),
  );
  state.wounds.replacement = clamp(
    state.wounds.replacement + Math.round(event.replacementThreat * 0.14),
  );
  state.momentum.conflict = clampSigned(
    state.momentum.conflict + Math.round(event.emotionalWeight * 0.1),
  );
  state.trust.loyalty = clamp(
    state.trust.loyalty - (event.romanticThreat > 70 ? 8 : 3),
  );
  state.attachment.abandonmentSensitivity = clamp(
    state.attachment.abandonmentSensitivity +
      Math.round(event.replacementThreat * 0.08),
  );
  rivalry.targetResponsivenessToRival = clamp(
    rivalry.targetResponsivenessToRival +
      Math.round(event.romanticThreat * 0.12),
  );
  rivalry.lastRivalWin = event.id;

  if (role) {
    state.npcDynamics.roleOwnership[role] = event.npcId ?? event.actorId;
  }
}

function applyCharReassurance(
  state: RelationshipState,
  event: NPCImpactEvent,
  rivalry: RelationshipState["npcDynamics"]["rivalries"][number],
) {
  state.trust.loyalty = clamp(state.trust.loyalty + 8);
  state.trust.emotional = clamp(state.trust.emotional + 6);
  state.exclusivity.jealousyReactivity = clamp(
    state.exclusivity.jealousyReactivity -
      Math.max(4, Math.round(event.replacementThreat * 0.1)),
  );
  state.wounds.replacement = clamp(
    state.wounds.replacement - Math.max(4, Math.round(event.replacementThreat * 0.1)),
  );
  state.momentum.stability = clampSigned(state.momentum.stability + 8);
  state.momentum.conflict = clampSigned(state.momentum.conflict - 6);
  rivalry.targetResponsivenessToUser = clamp(
    rivalry.targetResponsivenessToUser + 12,
  );
  rivalry.replacementFear = clamp(rivalry.replacementFear - 10);
  rivalry.jealousyMomentum = clamp(rivalry.jealousyMomentum - 8);
  rivalry.lastUserWin = event.id;
  state.npcDynamics.roleOwnership.romanticPriorityOwner = state.characters.aId;
}

function affectsCurrentRelationship(
  state: RelationshipState,
  event: NPCImpactEvent,
) {
  const currentEdge = relationshipEdgeId(
    state.characters.aId,
    state.characters.bId,
  );
  const rawEdge = `${state.characters.aId}:${state.characters.bId}`;
  const reverseRawEdge = `${state.characters.bId}:${state.characters.aId}`;

  return event.affectedEdges.some(
    (edge) => edge === currentEdge || edge === rawEdge || edge === reverseRawEdge,
  );
}

function findOrCreateRivalry(
  state: RelationshipState,
  rivalId: string,
  targetId: string,
  userId: string,
) {
  const existing = state.npcDynamics.rivalries.find(
    (rivalry) =>
      rivalry.rivalId === rivalId &&
      rivalry.targetId === targetId &&
      rivalry.userId === userId,
  );

  if (existing) return existing;

  const rivalry = {
    rivalId,
    targetId,
    userId,
    rivalThreatLevel: 0,
    userInsecurity: 0,
    targetResponsivenessToRival: 0,
    targetResponsivenessToUser: 0,
    publicHumiliation: 0,
    replacementFear: 0,
    jealousyMomentum: 0,
  };

  state.npcDynamics.rivalries.push(rivalry);
  return rivalry;
}

function resolveRivalId(state: RelationshipState, event: NPCImpactEvent) {
  if (event.npcId) return event.npcId;
  if (event.type.startsWith("rival_")) return event.actorId;

  return (
    state.npcDynamics.rivalries.find(
      (rivalry) =>
        rivalry.targetId === state.characters.bId &&
        rivalry.userId === state.characters.aId,
    )?.rivalId ?? event.actorId
  );
}

function trackedEventTypeForNPCImpact(
  event: NPCImpactEvent,
): Parameters<typeof trackRelationshipUpdate>[2][number]["type"] {
  if (event.type === "char_reassures_user" || event.type === "char_rejects_rival") {
    return "reassurance";
  }
  if (event.type === "rival_betrayal") return "betrayal";
  if (event.type === "rival_kiss") return "intimacy";
  if (event.type === "rival_comfort") return "comfort";

  return "jealousy";
}

function memoryTypeForNPCImpact(
  event: NPCImpactEvent,
): RelationshipState["memories"][number]["type"] {
  if (event.type === "rival_betrayal") return "betrayal";
  if (event.type === "char_reassures_user" || event.type === "char_rejects_rival") {
    return "reassurance";
  }

  return "jealousy";
}

function isPinnedMemoryTag(tag: string) {
  return [
    "anchor",
    "anchored",
    "important",
    "memory_anchor",
    "milestone",
    "permanent",
    "pinned",
    "story_beat",
  ].includes(tag.trim().toLowerCase());
}

function trustImpactForNPCImpact(event: NPCImpactEvent) {
  if (event.type === "char_reassures_user" || event.type === "char_rejects_rival") {
    return 8;
  }
  if (event.type === "rival_betrayal") return 4;

  return event.romanticThreat > 70 ? -8 : -3;
}

function intimacyImpactForNPCImpact(event: NPCImpactEvent) {
  if (event.type === "char_reassures_user" || event.type === "char_rejects_rival") {
    return 4;
  }

  return event.replacementThreat > 70 ? -4 : -2;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function clampSigned(value: number) {
  return Math.max(-100, Math.min(100, Math.round(value)));
}
