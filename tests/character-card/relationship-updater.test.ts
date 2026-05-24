import assert from "node:assert/strict";
import test from "node:test";

import { createDefaultRelationshipState } from "../../lib/chat/relationshipState.schema";
import { updateRelationshipFromMessages } from "../../lib/chat/relationshipUpdater";

test("updates affection reassurance and confession deterministically", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  const messages = [
    {
      role: "assistant" as const,
      content: "I love you. I'm here. You matter. Let me hold you.",
      createdAt: 100,
    },
  ];

  const first = updateRelationshipFromMessages(state, messages);
  const second = updateRelationshipFromMessages(state, messages);

  assert.deepEqual(first, second);
  assert.equal(state.flags.confessionOccurred, false);
  assert.equal(first.state.flags.confessionOccurred, true);
  assert.equal(first.state.intimacy.emotional, 10);
  assert.equal(first.state.intimacy.vulnerability, 10);
  assert.equal(first.state.attachment.bondDepth, 8);
  assert.equal(first.state.trust.emotional, 38);
  assert.equal(first.state.trust.vulnerability, 23);
  assert.equal(first.state.memories.length, 3);
  assert.equal(first.state.memories[0]?.id, "mem_100_1");
  assert.equal(first.state.lifecycleState, "potential");
  assert.ok(first.reasons.some((reason) => reason.key === "trust.emotional"));
});

test("detects betrayal rupture and records high-weight memory", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });

  const { state: nextState, reasons } = updateRelationshipFromMessages(state, [
    {
      role: "user",
      content: "You lied and kept this from me behind my back.",
      createdAt: 200,
    },
  ]);

  assert.equal(nextState.flags.betrayalOccurred, true);
  assert.equal(nextState.rupture.active, true);
  assert.equal(nextState.rupture.type, "betrayal");
  assert.equal(nextState.rupture.severity, 4);
  assert.equal(nextState.rupture.repairArc, "trust_rebuild");
  assert.equal(nextState.trust.loyalty, 5);
  assert.equal(nextState.trust.vulnerability, 0);
  assert.equal(nextState.momentum.trust, -20);
  assert.equal(nextState.lifecycleState, "fracture");
  assert.equal(nextState.memories[0]?.type, "betrayal");
  assert.equal(nextState.memories[0]?.timestamp, 200);
  assert.ok(reasons.some((reason) => reason.reason.includes("betrayal")));
});

test("advances repair through apology and accountability", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  state.rupture.active = true;
  state.rupture.type = "broken_promise";
  state.rupture.severity = 3;
  state.rupture.trustDamage = 45;
  state.rupture.vulnerabilityDamage = 40;
  state.rupture.repairProgress = 76;

  const { state: nextState } = updateRelationshipFromMessages(state, [
    {
      role: "assistant",
      content:
        "I'm sorry. I understand why that hurt. I take responsibility and I won't do that again.",
      createdAt: 300,
    },
  ]);

  assert.equal(nextState.rupture.active, false);
  assert.equal(nextState.rupture.severity, 1);
  assert.equal(nextState.rupture.trustDamage, 15);
  assert.equal(nextState.rupture.vulnerabilityDamage, 15);
  assert.equal(nextState.rupture.accountabilityLevel, 36);
  assert.equal(nextState.momentum.repair, 15);
});

test("sets milestone flags once for first kiss and commitment", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });

  const first = updateRelationshipFromMessages(state, [
    {
      role: "assistant",
      content:
        "I want us together. I want this to be official. I kiss you softly.",
      createdAt: 400,
    },
  ]);
  const second = updateRelationshipFromMessages(first.state, [
    {
      role: "assistant",
      content: "I kiss you again.",
      createdAt: 500,
    },
  ]);

  assert.equal(first.state.flags.officialRelationship, true);
  assert.equal(first.state.flags.firstKiss, true);
  assert.equal(first.state.intimacy.physical, 15);
  assert.equal(second.state.flags.firstKiss, true);
  assert.equal(second.state.intimacy.physical, 15);
});
