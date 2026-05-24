import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRelationshipInsights,
  filterRelationshipInsights,
} from "../../lib/chat/relationshipInsights";
import { createDefaultRelationshipState } from "../../lib/chat/relationshipState.schema";

test("standard relationship insights hide raw runtime state", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  state.trust.emotional = 72;
  state.attachment.bondDepth = 68;

  const insights = buildRelationshipInsights(state);
  const standard = filterRelationshipInsights(insights, "standard");

  assert.ok(
    standard.some((insight) => insight.id === "relationship_tracker"),
  );
  assert.ok(standard.some((insight) => insight.id === "emotional_brain"));
  assert.equal(standard.some((insight) => insight.id === "raw_trust"), false);
  assert.equal(
    standard.some((insight) => insight.rawPaths && insight.rawPaths.length > 0),
    false,
  );
});

test("advanced relationship insights include raw debug state", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  state.rupture.active = true;
  state.rupture.type = "betrayal";
  state.rupture.severity = 4;

  const insights = buildRelationshipInsights(state);
  const advanced = filterRelationshipInsights(insights, "advanced");

  assert.ok(advanced.some((insight) => insight.id === "raw_trust"));
  assert.ok(advanced.some((insight) => insight.id === "raw_rupture"));
  assert.ok(
    advanced.some((insight) =>
      insight.summary.includes("active=true; type=betrayal"),
    ),
  );
});
