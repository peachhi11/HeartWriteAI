import assert from "node:assert/strict";
import test from "node:test";

import {
  createDefaultRelationshipGraph,
  relationshipGraphEdgeId,
  updateRelationshipGraphFromSexualOnlyEvent,
} from "../../lib/chat/relationshipGraph";
import {
  createDefaultSexualOnlyEdge,
  sexualOnlyEdgeId,
  updateSexualOnlyEdgeFromEvent,
} from "../../lib/chat/relationshipSexualOnlyEdge";

test("creates a sexual-only edge separately from romantic graph edges", () => {
  const graph = updateRelationshipGraphFromSexualOnlyEvent({
    graph: createDefaultRelationshipGraph("scenario-a"),
    event: {
      id: "sex-edge-1",
      timestamp: 100,
      aId: "user",
      bId: "char",
      type: "hookup",
      summary: "A hookup happened without romantic definition.",
      emotionalWeight: 60,
      tags: ["sexual_only"],
    },
  });
  const sexualOnlyId = sexualOnlyEdgeId("user", "char");
  const romanticId = relationshipGraphEdgeId("user", "char");

  assert.equal(graph.sexualOnlyEdges[sexualOnlyId]?.flags.sexualIntimacyOccurred, true);
  assert.equal(graph.sexualOnlyEdges[sexualOnlyId]?.sexualChemistry, 70);
  assert.equal(graph.sexualOnlyEdges[sexualOnlyId]?.romanticFeeling, 0);
  assert.equal(graph.edges[romanticId], undefined);
  assert.equal(graph.sexualOnlyEvents.length, 1);
});

test("tracks attachment leakage from repeat intimacy and aftercare", () => {
  const initial = createDefaultSexualOnlyEdge({
    aId: "user",
    bId: "char",
    kind: "casual",
  });
  const repeated = updateSexualOnlyEdgeFromEvent(initial, "repeat_intimacy");
  const caredFor = updateSexualOnlyEdgeFromEvent(repeated, "aftercare");

  assert.equal(caredFor.kind, "friends_with_benefits");
  assert.equal(caredFor.emotionalAttachment, 23);
  assert.equal(caredFor.vulnerabilityLeakage, 10);
  assert.ok(caredFor.attachmentDriftRisk > initial.attachmentDriftRisk);
});

test("keeps romance optional while flagging jealousy and definition pressure", () => {
  const initial = createDefaultSexualOnlyEdge({
    aId: "user",
    bId: "char",
    kind: "friends_with_benefits",
  });
  const jealous = updateSexualOnlyEdgeFromEvent(initial, "jealousy");
  const questioned = updateSexualOnlyEdgeFromEvent(jealous, "asks_what_are_we");

  assert.equal(questioned.flags.romanticLeakageDetected, true);
  assert.equal(questioned.flags.exclusivityTalkNeeded, true);
  assert.equal(questioned.romanticFeeling, 0);
  assert.ok(questioned.romanticEscalationProbability > initial.romanticEscalationProbability);
});

test("resolves avoidant and attachment-denial sexual-only edge states", () => {
  const avoidant = updateSexualOnlyEdgeFromEvent(
    {
      ...createDefaultSexualOnlyEdge({
        aId: "user",
        bId: "char",
        kind: "casual",
      }),
      postIntimacyWithdrawal: 58,
      definitionAvoidance: 70,
    },
    "post_intimacy_withdrawal",
  );
  const denial = updateSexualOnlyEdgeFromEvent(
    {
      ...createDefaultSexualOnlyEdge({
        aId: "user",
        bId: "char",
        kind: "friends_with_benefits",
      }),
      emotionalAttachment: 70,
      romanticFeeling: 50,
      vulnerabilityLeakage: 65,
    },
    "romantic_confession",
  );

  assert.equal(avoidant.kind, "avoidant_sexual");
  assert.equal(denial.kind, "attachment_denial");
});

test("promotes high-weight sexual-only edge events into memory", () => {
  const graph = updateRelationshipGraphFromSexualOnlyEvent({
    graph: createDefaultRelationshipGraph("scenario-a"),
    event: {
      id: "sex-edge-memory",
      timestamp: 200,
      aId: "user",
      bId: "char",
      type: "romantic_confession",
      summary: "A confession made the sexual-only bond emotionally complicated.",
      emotionalWeight: 90,
      tags: ["sexual_only", "confession"],
    },
  });

  assert.deepEqual(
    graph.sexualOnlyEdges["char:user"]?.memories,
    ["sex-edge-memory"],
  );
});
