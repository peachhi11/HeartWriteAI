import { z } from "zod";

import {
  RelationshipMeaningSystemsSchema,
  applyMeaningfulRelationshipEvent,
  type EmotionalRole,
  type MeaningfulRelationshipEventInput,
  type RelationshipMeaningSystems,
} from "./relationshipMeaningfulEvents";
import {
  RelationshipPairDynamicsSchema,
  resolveRelationshipPairDynamics,
  type RelationshipPairDynamics,
} from "./relationshipPairDynamics";
import {
  SexualOnlyEdgeEventSchema,
  SexualOnlyEdgeSchema,
  createDefaultSexualOnlyEdge,
  sexualOnlyEdgeId,
  updateSexualOnlyEdgeFromEvent,
  type SexualOnlyEdge,
  type SexualOnlyEdgeEvent,
} from "./relationshipSexualOnlyEdge";

const score = z.coerce.number().min(0).max(100);

export const RelationshipGraphKindSchema = z.enum([
  "stranger",
  "acquaintance",
  "friend",
  "deep_friend",
  "rival",
  "enemy",
  "mentor_student",
  "protective_bond",
  "found_family",
  "ambiguous",
  "romantic",
  "ex_romantic",
  "queerplatonic",
]);

export const RelationshipGraphEventSchema = z.object({
  id: z.string().trim().min(1),
  timestamp: z.number(),
  actorId: z.string().trim().min(1),
  targetId: z.string().trim().min(1),
  observerIds: z.array(z.string().trim().min(1)).default([]),
  type: z.enum([
    "rival_gets_attention",
    "rival_gets_comfort_role",
    "rival_gets_secret",
    "rival_gets_public_praise",
    "rival_gets_defended",
    "rival_gets_kiss",
    "user_gets_chosen",
    "user_gets_reassurance",
    "confession",
    "comfort",
    "betrayal",
    "abandonment",
    "repair",
    "boundary",
    "custom",
  ]),
  summary: z.string().trim().min(1),
  visibility: z.enum(["seen", "heard_about", "suspected", "hidden"]),
  emotionalWeight: score,
  romanticThreat: score.optional(),
  humiliationImpact: score.optional(),
  replacementThreat: score.optional(),
  emotionalRole: z
    .enum([
      "comfort_person",
      "protector",
      "trusted_confidant",
      "romantic_priority",
      "sexual_tension_source",
      "safe_person",
      "challenge_rival",
      "caretaker",
    ])
    .optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const RelationshipGraphEdgeSchema = z.object({
  id: z.string().trim().min(3),
  aId: z.string().trim().min(1),
  bId: z.string().trim().min(1),
  kind: RelationshipGraphKindSchema.default("stranger"),
  romantic: score.default(0),
  platonic: score.default(0),
  rivalry: score.default(0),
  trust: score.default(30),
  tension: score.default(0),
  jealousy: score.default(0),
  admiration: score.default(0),
  dependency: score.default(0),
  protectiveness: score.default(0),
  ambiguity: score.default(0),
  meaning: RelationshipMeaningSystemsSchema,
  pairDynamics: RelationshipPairDynamicsSchema,
  memories: z.array(z.string().trim().min(1)).default([]),
  flags: z
    .object({
      firstMet: z.boolean().default(false),
      emotionallySignificant: z.boolean().default(false),
      rivalThreat: z.boolean().default(false),
      romanticPossibility: z.boolean().default(false),
      ruptureActive: z.boolean().default(false),
    })
    .default({
      firstMet: false,
      emotionallySignificant: false,
      rivalThreat: false,
      romanticPossibility: false,
      ruptureActive: false,
    }),
});

export const RelationshipGraphSchema = z.object({
  scenarioId: z.string().trim().min(1).default("default"),
  edges: z.record(z.string(), RelationshipGraphEdgeSchema).default({}),
  sexualOnlyEdges: z.record(z.string(), SexualOnlyEdgeSchema).default({}),
  events: z.array(RelationshipGraphEventSchema).default([]),
  sexualOnlyEvents: z.array(SexualOnlyEdgeEventSchema).default([]),
  updatedAt: z.string().datetime().optional(),
});

export type RelationshipGraphKind = z.infer<typeof RelationshipGraphKindSchema>;
export type RelationshipGraphEvent = z.infer<typeof RelationshipGraphEventSchema>;
export type RelationshipGraphEdge = z.infer<typeof RelationshipGraphEdgeSchema>;
export type RelationshipGraph = z.infer<typeof RelationshipGraphSchema>;
export type { RelationshipMeaningSystems };
export type { RelationshipPairDynamics };

type NumericRelationshipEdgeKey = {
  [Key in keyof RelationshipGraphEdge]: RelationshipGraphEdge[Key] extends number
    ? Key
    : never;
}[keyof RelationshipGraphEdge];

export function relationshipGraphEdgeId(aId: string, bId: string) {
  return [aId, bId].sort().join(":");
}

export function createDefaultRelationshipGraph(scenarioId = "default") {
  return RelationshipGraphSchema.parse({
    scenarioId,
    edges: {},
    sexualOnlyEdges: {},
    events: [],
    sexualOnlyEvents: [],
  });
}

export function normalizeRelationshipGraph(input: unknown) {
  return RelationshipGraphSchema.parse(input);
}

export function updateRelationshipGraphFromEvent(input: {
  graph: RelationshipGraph;
  event: RelationshipGraphEvent;
  mainLoveInterestId: string;
  userId: string;
}) {
  const event = RelationshipGraphEventSchema.parse(input.event);
  const next = RelationshipGraphSchema.parse(structuredClone(input.graph));
  const actorTarget = getRelationshipGraphEdge(
    next,
    event.actorId,
    event.targetId,
  );
  const userMain = getRelationshipGraphEdge(
    next,
    input.userId,
    input.mainLoveInterestId,
  );

  actorTarget.flags.firstMet = true;

  switch (event.type) {
    case "rival_gets_attention":
      addEdgeScore(actorTarget, "romantic", 4);
      addEdgeScore(actorTarget, "ambiguity", 5);
      addEdgeScore(userMain, "jealousy", 8);
      addEdgeScore(userMain, "tension", 6);
      break;
    case "rival_gets_comfort_role":
      addEdgeScore(actorTarget, "trust", 8);
      addEdgeScore(actorTarget, "dependency", 6);
      addEdgeScore(actorTarget, "platonic", 5);
      addEdgeScore(userMain, "jealousy", 12);
      addEdgeScore(userMain, "dependency", -3);
      userMain.flags.rivalThreat = true;
      break;
    case "rival_gets_secret":
      addEdgeScore(actorTarget, "trust", 12);
      addEdgeScore(actorTarget, "platonic", 8);
      addEdgeScore(userMain, "trust", -8);
      addEdgeScore(userMain, "jealousy", 10);
      userMain.flags.rivalThreat = true;
      break;
    case "rival_gets_public_praise":
      addEdgeScore(actorTarget, "admiration", 10);
      addEdgeScore(actorTarget, "romantic", 4);
      addEdgeScore(userMain, "jealousy", 12);
      addEdgeScore(userMain, "tension", 8);
      userMain.flags.rivalThreat = true;
      break;
    case "rival_gets_defended":
      addEdgeScore(actorTarget, "trust", 10);
      addEdgeScore(actorTarget, "protectiveness", 8);
      addEdgeScore(userMain, "trust", -14);
      addEdgeScore(userMain, "jealousy", 15);
      userMain.flags.ruptureActive = true;
      userMain.flags.rivalThreat = true;
      break;
    case "rival_gets_kiss":
      addEdgeScore(actorTarget, "romantic", 20);
      addEdgeScore(actorTarget, "tension", 15);
      addEdgeScore(userMain, "trust", -25);
      addEdgeScore(userMain, "jealousy", 25);
      addEdgeScore(userMain, "romantic", -10);
      userMain.flags.ruptureActive = true;
      userMain.flags.rivalThreat = true;
      break;
    case "user_gets_chosen":
      addEdgeScore(userMain, "trust", 12);
      addEdgeScore(userMain, "romantic", 10);
      addEdgeScore(userMain, "jealousy", -10);
      userMain.flags.emotionallySignificant = true;
      break;
    case "user_gets_reassurance":
      addEdgeScore(userMain, "trust", 10);
      addEdgeScore(userMain, "dependency", 4);
      addEdgeScore(userMain, "jealousy", -12);
      userMain.flags.rivalThreat = false;
      break;
    case "comfort":
      addEdgeScore(actorTarget, "trust", 8);
      addEdgeScore(actorTarget, "platonic", 6);
      addEdgeScore(actorTarget, "dependency", 4);
      break;
    case "confession":
      addEdgeScore(actorTarget, "romantic", 18);
      addEdgeScore(actorTarget, "ambiguity", -10);
      actorTarget.flags.romanticPossibility = true;
      break;
    case "betrayal":
      addEdgeScore(actorTarget, "trust", -25);
      addEdgeScore(actorTarget, "tension", 10);
      actorTarget.flags.ruptureActive = true;
      break;
    case "abandonment":
      addEdgeScore(actorTarget, "trust", -18);
      addEdgeScore(actorTarget, "dependency", -8);
      actorTarget.flags.ruptureActive = true;
      break;
    case "repair":
      addEdgeScore(actorTarget, "trust", 12);
      actorTarget.flags.ruptureActive = false;
      break;
    case "boundary":
      addEdgeScore(actorTarget, "trust", 4);
      addEdgeScore(actorTarget, "tension", -4);
      break;
    case "custom":
      break;
  }

  actorTarget.kind = resolveRelationshipGraphKind(actorTarget);
  userMain.kind = resolveRelationshipGraphKind(userMain);
  applyGraphMeaningSystems({
    event,
    actorTarget,
    userMain,
    userId: input.userId,
    mainLoveInterestId: input.mainLoveInterestId,
  });
  refreshPairDynamics(actorTarget);
  refreshPairDynamics(userMain);
  promoteGraphEventMemory(event, actorTarget, userMain);

  next.events = [...next.events, event].slice(-100);
  next.updatedAt = new Date(event.timestamp || Date.now()).toISOString();

  return RelationshipGraphSchema.parse(next);
}

export function updateRelationshipGraphFromMeaningfulEvent(input: {
  graph: RelationshipGraph;
  edgeIdA: string;
  edgeIdB: string;
  event: MeaningfulRelationshipEventInput;
}) {
  const next = RelationshipGraphSchema.parse(structuredClone(input.graph));
  const edge = getRelationshipGraphEdge(next, input.edgeIdA, input.edgeIdB);

  edge.meaning = applyMeaningfulRelationshipEvent(edge.meaning, input.event);
  refreshPairDynamics(edge);
  edge.flags.emotionallySignificant = true;
  addMemoryId(edge, input.event.id);
  next.updatedAt = new Date().toISOString();

  return RelationshipGraphSchema.parse(next);
}

function refreshPairDynamics(edge: RelationshipGraphEdge) {
  edge.pairDynamics = resolveRelationshipPairDynamics({
    romantic: edge.romantic,
    platonic: edge.platonic,
    rivalry: edge.rivalry,
    trust: edge.trust,
    tension: edge.tension,
    jealousy: edge.jealousy,
    admiration: edge.admiration,
    dependency: edge.dependency,
    protectiveness: edge.protectiveness,
    ambiguity: edge.ambiguity,
    ruptureActive: edge.flags.ruptureActive,
    rivalThreat: edge.flags.rivalThreat,
    meaning: edge.meaning,
  });
}

export function getRelationshipGraphEdge(
  graph: RelationshipGraph,
  aId: string,
  bId: string,
) {
  const id = relationshipGraphEdgeId(aId, bId);

  if (!graph.edges[id]) {
    graph.edges[id] = RelationshipGraphEdgeSchema.parse({
      id,
      aId,
      bId,
    });
  }

  return graph.edges[id];
}

export function updateRelationshipGraphFromSexualOnlyEvent(input: {
  graph: RelationshipGraph;
  event: SexualOnlyEdgeEvent;
}) {
  const event = SexualOnlyEdgeEventSchema.parse(input.event);
  const next = RelationshipGraphSchema.parse(structuredClone(input.graph));
  const edge = getSexualOnlyGraphEdge(next, event.aId, event.bId);
  const updatedEdge = updateSexualOnlyEdgeFromEvent(edge, event);

  next.sexualOnlyEdges[updatedEdge.id] = updatedEdge;
  next.sexualOnlyEvents = [...next.sexualOnlyEvents, event].slice(-100);
  next.updatedAt = new Date(event.timestamp || Date.now()).toISOString();

  return RelationshipGraphSchema.parse(next);
}

export function getSexualOnlyGraphEdge(
  graph: RelationshipGraph,
  aId: string,
  bId: string,
): SexualOnlyEdge {
  const id = sexualOnlyEdgeId(aId, bId);

  if (!graph.sexualOnlyEdges[id]) {
    graph.sexualOnlyEdges[id] = createDefaultSexualOnlyEdge({
      aId,
      bId,
      kind: "casual",
    });
  }

  return graph.sexualOnlyEdges[id];
}

export function resolveRelationshipGraphKind(
  edge: RelationshipGraphEdge,
): RelationshipGraphKind {
  if (edge.romantic >= 60 && !edge.flags.ruptureActive) return "romantic";
  if (edge.romantic >= 35 && edge.ambiguity >= 45) return "ambiguous";
  if (edge.rivalry >= 65 && edge.trust < 25) return "enemy";
  if (edge.rivalry >= 55 || edge.jealousy >= 65) return "rival";
  if (edge.platonic >= 70 && edge.protectiveness >= 55) return "found_family";
  if (edge.platonic >= 70 && edge.dependency >= 55) return "queerplatonic";
  if (edge.platonic >= 65 && edge.trust >= 60) return "deep_friend";
  if (edge.platonic >= 35 || edge.trust >= 45) return "friend";
  if (edge.admiration >= 55 && edge.trust >= 40) return "mentor_student";
  if (edge.protectiveness >= 55) return "protective_bond";
  if (edge.flags.firstMet) return "acquaintance";

  return "stranger";
}

function addEdgeScore(
  edge: RelationshipGraphEdge,
  key: NumericRelationshipEdgeKey,
  delta: number,
) {
  edge[key] = clamp(edge[key] + delta) as never;
}

function promoteGraphEventMemory(
  event: RelationshipGraphEvent,
  actorTarget: RelationshipGraphEdge,
  userMain: RelationshipGraphEdge,
) {
  if (event.emotionalWeight < 70) return;

  addMemoryId(actorTarget, event.id);

  if (actorTarget.id !== userMain.id) {
    addMemoryId(userMain, event.id);
  }
}

function applyGraphMeaningSystems(input: {
  event: RelationshipGraphEvent;
  actorTarget: RelationshipGraphEdge;
  userMain: RelationshipGraphEdge;
  userId: string;
  mainLoveInterestId: string;
}) {
  const meaningfulEvent = mapGraphEventToMeaningfulEvent(input);

  input.actorTarget.meaning = applyMeaningfulRelationshipEvent(
    input.actorTarget.meaning,
    meaningfulEvent,
  );

  if (input.actorTarget.id === input.userMain.id) {
    return;
  }

  input.userMain.meaning = applyMeaningfulRelationshipEvent(
    input.userMain.meaning,
    meaningfulEvent,
  );
}

function mapGraphEventToMeaningfulEvent(input: {
  event: RelationshipGraphEvent;
  userId: string;
  mainLoveInterestId: string;
}): MeaningfulRelationshipEventInput {
  const { event } = input;
  const rivalId =
    event.actorId !== input.userId && event.actorId !== input.mainLoveInterestId
      ? event.actorId
      : undefined;
  const role = event.emotionalRole ?? emotionalRoleForGraphEvent(event.type);
  const witness = witnessContextForGraphEvent(event.visibility);

  return {
    id: event.id,
    action: event.summary,
    actorId: event.actorId,
    targetId: event.targetId,
    observerIds: event.observerIds,
    userId: input.userId,
    charId: input.mainLoveInterestId,
    rivalId,
    emotionalRole: role,
    witness,
    attention: attentionForGraphEvent(event.type),
    comparison: comparisonForGraphEvent(event.type),
    initiative: initiativeForGraphEvent(event.type),
    pattern: patternForGraphEvent(event.type),
    publicTreatment: publicTreatmentForGraphEvent(event.type),
    secrecy: secrecyForGraphEvent(event),
    opportunityLoss: opportunityLossForGraphEvent(event.type),
    consequence: consequenceForGraphEvent(event.type),
    impact: event.emotionalWeight,
    romanticThreat: event.romanticThreat ?? 0,
    sexualThreat: event.type === "rival_gets_kiss" ? event.romanticThreat ?? 0 : 0,
    emotionalThreat:
      event.type === "rival_gets_comfort_role" ||
      event.type === "rival_gets_secret"
        ? event.replacementThreat ?? 0
        : 0,
    socialThreat:
      event.type === "rival_gets_public_praise" ||
      event.type === "rival_gets_defended"
        ? event.humiliationImpact ?? 0
        : 0,
    humiliationThreat: event.humiliationImpact ?? 0,
  };
}

function emotionalRoleForGraphEvent(
  type: RelationshipGraphEvent["type"],
): EmotionalRole | undefined {
  switch (type) {
    case "rival_gets_comfort_role":
    case "comfort":
      return "comfort_person";
    case "rival_gets_secret":
      return "trusted_confidant";
    case "rival_gets_defended":
      return "protector";
    case "rival_gets_kiss":
      return "sexual_tension_source";
    case "rival_gets_attention":
    case "rival_gets_public_praise":
      return "challenge_rival";
    case "user_gets_chosen":
    case "confession":
      return "romantic_priority";
    case "user_gets_reassurance":
      return "safe_person";
    default:
      return undefined;
  }
}

function witnessContextForGraphEvent(
  visibility: RelationshipGraphEvent["visibility"],
) {
  if (visibility === "seen") return "seen_directly";
  if (visibility === "heard_about") return "heard_about";
  if (visibility === "suspected") return "suspected";
  return "hidden";
}

function attentionForGraphEvent(type: RelationshipGraphEvent["type"]) {
  switch (type) {
    case "rival_gets_attention":
      return "noticed_first";
    case "rival_gets_comfort_role":
    case "rival_gets_secret":
      return "private_time";
    case "rival_gets_public_praise":
      return "public_praise";
    case "rival_gets_defended":
    case "user_gets_chosen":
      return "chosen";
    default:
      return undefined;
  }
}

function comparisonForGraphEvent(type: RelationshipGraphEvent["type"]) {
  switch (type) {
    case "rival_gets_comfort_role":
    case "rival_gets_secret":
      return "understands_better";
    case "rival_gets_defended":
      return "safer";
    case "rival_gets_kiss":
      return "more_attractive";
    case "rival_gets_public_praise":
      return "more_stable";
    default:
      return undefined;
  }
}

function initiativeForGraphEvent(type: RelationshipGraphEvent["type"]) {
  if (type === "confession") return "escalates_intimacy";
  if (type === "repair") return "apologizes_first";
  if (type === "rival_gets_kiss") return "initiates_touch";
  return undefined;
}

function patternForGraphEvent(type: RelationshipGraphEvent["type"]) {
  if (type === "user_gets_reassurance") return "jealousy_reassurance";
  if (type === "repair") return "conflict_silence_apology";
  return undefined;
}

function publicTreatmentForGraphEvent(type: RelationshipGraphEvent["type"]) {
  if (type === "rival_gets_public_praise") return "public_claim";
  if (type === "user_gets_reassurance") return "private_affection";
  return undefined;
}

function secrecyForGraphEvent(event: RelationshipGraphEvent) {
  if (event.visibility !== "hidden") return undefined;
  if (event.type === "rival_gets_kiss") return "secretKiss";
  if (event.type === "betrayal") return "privateBetrayal";
  return "concealedJealousy";
}

function opportunityLossForGraphEvent(type: RelationshipGraphEvent["type"]) {
  switch (type) {
    case "rival_gets_comfort_role":
      return "rival_comforted_first";
    case "rival_gets_secret":
    case "rival_gets_attention":
      return "user_hesitated_too_long";
    case "rival_gets_defended":
      return "npc_chosen_during_crisis";
    default:
      return undefined;
  }
}

function consequenceForGraphEvent(type: RelationshipGraphEvent["type"]) {
  switch (type) {
    case "rival_gets_comfort_role":
      return "comfort role shifted toward rival";
    case "rival_gets_secret":
      return "trusted confidant role shifted toward rival";
    case "rival_gets_defended":
      return "public priority and protection favored rival";
    case "rival_gets_kiss":
      return "sexual and romantic threat escalated";
    case "user_gets_chosen":
      return "user became publicly prioritized";
    case "user_gets_reassurance":
      return "reassurance reduced replacement fear";
    default:
      return "relationship meaning changed";
  }
}

function addMemoryId(edge: RelationshipGraphEdge, eventId: string) {
  if (edge.memories.includes(eventId)) return;

  edge.memories = [...edge.memories, eventId].slice(-80);
  edge.flags.emotionallySignificant = true;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
