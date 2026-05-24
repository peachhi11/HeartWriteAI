import { z } from "zod";

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
  events: z.array(RelationshipGraphEventSchema).default([]),
  updatedAt: z.string().datetime().optional(),
});

export type RelationshipGraphKind = z.infer<typeof RelationshipGraphKindSchema>;
export type RelationshipGraphEvent = z.infer<typeof RelationshipGraphEventSchema>;
export type RelationshipGraphEdge = z.infer<typeof RelationshipGraphEdgeSchema>;
export type RelationshipGraph = z.infer<typeof RelationshipGraphSchema>;

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
    events: [],
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
  promoteGraphEventMemory(event, actorTarget, userMain);

  next.events = [...next.events, event].slice(-100);
  next.updatedAt = new Date(event.timestamp || Date.now()).toISOString();

  return RelationshipGraphSchema.parse(next);
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

function addMemoryId(edge: RelationshipGraphEdge, eventId: string) {
  if (edge.memories.includes(eventId)) return;

  edge.memories = [...edge.memories, eventId].slice(-80);
  edge.flags.emotionallySignificant = true;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
