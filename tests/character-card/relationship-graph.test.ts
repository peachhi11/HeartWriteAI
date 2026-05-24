import assert from "node:assert/strict";
import test from "node:test";

import {
  createDefaultRelationshipGraph,
  getRelationshipGraphEdge,
  relationshipGraphEdgeId,
  updateRelationshipGraphFromMeaningfulEvent,
  updateRelationshipGraphFromEvent,
} from "../../lib/chat/relationshipGraph";
import {
  createMemoryRelationshipGraphStorage,
  createRelationshipGraphRepository,
  relationshipGraphKey,
} from "../../lib/chat/relationshipGraphRepository";

test("creates stable graph edge ids and default edges", () => {
  const graph = createDefaultRelationshipGraph("scenario-a");
  const edge = getRelationshipGraphEdge(graph, "char", "user");

  assert.equal(relationshipGraphEdgeId("user", "char"), "char:user");
  assert.equal(edge.id, "char:user");
  assert.equal(edge.kind, "stranger");
  assert.equal(edge.trust, 30);
  assert.equal(edge.meaning.emotionalRank.perceivedPriority, "backup");
  assert.equal(edge.meaning.trustAsymmetry.aTrustsB, 30);
  assert.equal(edge.pairDynamics.type, "undetermined");
});

test("updates rival and main edges from a rival comfort event", () => {
  const graph = createDefaultRelationshipGraph("scenario-a");
  const next = updateRelationshipGraphFromEvent({
    graph,
    userId: "user",
    mainLoveInterestId: "char",
    event: {
      id: "evt-1",
      timestamp: 100,
      actorId: "rival",
      targetId: "char",
      observerIds: ["user"],
      type: "rival_gets_comfort_role",
      summary: "The rival comforted the character before the user could.",
      visibility: "seen",
      emotionalWeight: 80,
      romanticThreat: 70,
      humiliationImpact: 45,
      replacementThreat: 75,
      tags: ["rivalry", "jealousy"],
    },
  });
  const rivalEdge = next.edges["char:rival"];
  const userEdge = next.edges["char:user"];

  assert.equal(rivalEdge?.trust, 38);
  assert.equal(rivalEdge?.dependency, 6);
  assert.equal(rivalEdge?.memories.includes("evt-1"), true);
  assert.equal(rivalEdge?.meaning.roleOwnership.comfortPerson, "rival");
  assert.equal(
    rivalEdge?.meaning.opportunityLosses[0]?.type,
    "rival_comforted_first",
  );
  assert.equal(userEdge?.jealousy, 12);
  assert.equal(userEdge?.dependency, 0);
  assert.equal(userEdge?.flags.rivalThreat, true);
  assert.equal(userEdge?.memories.includes("evt-1"), true);
  assert.equal(userEdge?.meaning.rivalry.emotionalThreat, 75);
  assert.equal(userEdge?.meaning.comparison.rivalAdvantages[0], "understands_better");
  assert.equal(next.events.length, 1);
});

test("marks main edge rupture from rival kiss and lets reassurance reduce jealousy", () => {
  const graph = createDefaultRelationshipGraph("scenario-a");
  const kissed = updateRelationshipGraphFromEvent({
    graph,
    userId: "user",
    mainLoveInterestId: "char",
    event: {
      id: "evt-2",
      timestamp: 200,
      actorId: "rival",
      targetId: "char",
      observerIds: ["user"],
      type: "rival_gets_kiss",
      summary: "The rival kissed the character.",
      visibility: "seen",
      emotionalWeight: 95,
      romanticThreat: 95,
      humiliationImpact: 85,
      replacementThreat: 95,
      tags: ["rivalry", "kiss"],
    },
  });
  const reassured = updateRelationshipGraphFromEvent({
    graph: kissed,
    userId: "user",
    mainLoveInterestId: "char",
    event: {
      id: "evt-3",
      timestamp: 300,
      actorId: "char",
      targetId: "user",
      observerIds: ["user"],
      type: "user_gets_reassurance",
      summary: "The character reassured the user after rival tension.",
      visibility: "seen",
      emotionalWeight: 80,
      replacementThreat: 40,
      tags: ["reassurance"],
    },
  });
  const userEdge = reassured.edges["char:user"];

  assert.equal(kissed.edges["char:user"]?.flags.ruptureActive, true);
  assert.equal(kissed.edges["char:user"]?.flags.rivalThreat, true);
  assert.equal(userEdge?.trust, 15);
  assert.equal(userEdge?.jealousy, 13);
  assert.equal(userEdge?.flags.rivalThreat, false);
  assert.equal(userEdge?.flags.ruptureActive, true);
  assert.equal(userEdge?.meaning.patterns.jealousy_reassurance, 80);
  assert.equal(userEdge?.pairDynamics.dominantLoop, "jealousy_reassurance");
});

test("applies explicit meaningful events to graph edge systems", () => {
  const graph = updateRelationshipGraphFromMeaningfulEvent({
    graph: createDefaultRelationshipGraph("scenario-a"),
    edgeIdA: "user",
    edgeIdB: "char",
    event: {
      id: "meaning-1",
      action: "private affection followed by public distance",
      actorId: "char",
      targetId: "user",
      observerIds: ["user"],
      userId: "user",
      charId: "char",
      emotionalRole: "safe_person",
      witness: "seen_directly",
      attention: "chosen",
      publicTreatment: "public_distance",
      secrecy: "hiddenCrush",
      consequence: "private softness became public insecurity",
      impact: 70,
    },
  });
  const edge = graph.edges["char:user"];

  assert.equal(edge?.meaning.roleOwnership.safePerson, "char");
  assert.equal(edge?.meaning.attention.lastChosenId, "char");
  assert.equal(edge?.meaning.treatment.publicDistance, 70);
  assert.equal(edge?.meaning.treatment.insecurityPressure, 39);
  assert.equal(edge?.meaning.secrecy.hiddenCrush, true);
  assert.equal(edge?.meaning.meaningfulEvents[0]?.consequence, "private softness became public insecurity");
  assert.equal(edge?.pairDynamics.attachmentFriction, 8);
});

test("does not promote low-weight graph events to edge memory", () => {
  const graph = updateRelationshipGraphFromEvent({
    graph: createDefaultRelationshipGraph("scenario-a"),
    userId: "user",
    mainLoveInterestId: "char",
    event: {
      id: "evt-low",
      timestamp: 400,
      actorId: "rival",
      targetId: "char",
      observerIds: ["user"],
      type: "rival_gets_attention",
      summary: "The rival got the character's attention briefly.",
      visibility: "seen",
      emotionalWeight: 40,
      replacementThreat: 35,
      tags: ["rivalry"],
    },
  });

  assert.equal(graph.edges["char:rival"]?.memories.length, 0);
  assert.equal(graph.edges["char:user"]?.memories.length, 0);
});

test("persists relationship graphs through repository storage adapters", async () => {
  const storage = createMemoryRelationshipGraphStorage();
  const repository = createRelationshipGraphRepository(storage);
  const graph = createDefaultRelationshipGraph("scenario-a");
  graph.edges[relationshipGraphEdgeId("user", "char")] = getRelationshipGraphEdge(
    graph,
    "user",
    "char",
  );
  graph.edges["char:user"]!.romantic = 42;

  await repository.save(graph);

  const reloaded = await repository.get("scenario-a");
  assert.equal(reloaded.edges["char:user"]?.romantic, 42);
  assert.equal(relationshipGraphKey("scenario-a"), "relationship-graph:scenario-a");

  await repository.delete("scenario-a");
  const fresh = await repository.get("scenario-a");
  assert.deepEqual(fresh.edges, {});
});
