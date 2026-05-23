import assert from "node:assert/strict";
import test from "node:test";

import {
  createDefaultRelationshipRuntimeState,
  normalizeRelationshipRuntimeState,
} from "../../lib/chat/relationshipRuntimeState";
import {
  appendRelationshipStateContext,
  createRelationshipStateContext,
} from "../../lib/chat/relationshipStateContext";
import {
  createDefaultRelationshipState,
  normalizeRelationshipState,
} from "../../lib/chat/relationshipState.schema";
import { chatRequestSchema } from "../../lib/character-card/postHistoryRuntime";

test("creates relationship state defaults from the compact core contract", () => {
  const state = createDefaultRelationshipState({
    id: "char-user",
    aId: "char",
    bId: "user",
    scenarioId: "scenario-001",
  });

  assert.equal(state.schemaVersion, 1);
  assert.equal(state.id, "char-user");
  assert.equal(state.characters.aId, "char");
  assert.equal(state.characters.bId, "user");
  assert.equal(state.scenarioId, "scenario-001");
  assert.equal(state.type, "strangers_to_lovers");
  assert.equal(state.lifecycleState, "potential");
  assert.equal(state.phase.macro, "pre_romance");
  assert.equal(state.trust.emotional, 30);
  assert.equal(state.compatibility.values, 50);
  assert.equal(state.exclusivity.style, "fully_monogamous");
  assert.equal(state.desire.style, "responsive");
  assert.equal(state.eroticDynamics.adultOnlyWhenErotic, true);
});

test("normalizes partial relationship state with memories, rupture, and erotic tags", () => {
  const state = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    type: "rivals_to_lovers",
    lifecycleState: "tension",
    trust: {
      emotional: 44,
    },
    rupture: {
      active: true,
      type: "broken_promise",
      severity: 3,
      repairArc: "accountability",
    },
    momentum: {
      attachment: 25,
      drift: -10,
    },
    eroticDynamics: {
      kinkTags: ["praise", "jealousy_play", "safe_surrender"],
      fetishCategory: "sensory",
      fetishTags: ["voice", "touch"],
      consentClarity: 95,
      boundaryFit: 90,
    },
    memories: [
      {
        id: "memory-1",
        type: "promise",
        summary: "They promised not to disappear after conflict.",
        emotionalWeight: 82,
        trustImpact: -25,
        timestamp: 1_772_000_000,
      },
    ],
  });

  assert.equal(state.type, "rivals_to_lovers");
  assert.equal(state.lifecycleState, "tension");
  assert.equal(state.trust.emotional, 44);
  assert.equal(state.trust.vulnerability, 20);
  assert.equal(state.rupture.type, "broken_promise");
  assert.equal(state.rupture.repairArc, "accountability");
  assert.equal(state.momentum.attachment, 25);
  assert.equal(state.momentum.drift, -10);
  assert.deepEqual(state.eroticDynamics.kinkTags, [
    "praise",
    "jealousy_play",
    "safe_surrender",
  ]);
  assert.deepEqual(state.eroticDynamics.fetishTags, ["voice", "touch"]);
  assert.equal(state.memories[0]?.tags.length, 0);
});

test("keeps the previous relationship runtime import path compatible", () => {
  const state = createDefaultRelationshipRuntimeState({
    id: "legacy-pair",
    aId: "char",
    bId: "user",
  });

  assert.equal(state.id, "legacy-pair");
  assert.equal(state.lifecycleState, "potential");
});

test("rejects unsupported relationship and kink labels", () => {
  assert.throws(
    () =>
      normalizeRelationshipRuntimeState({
        id: "pair-a",
        characters: {
          aId: "a",
          bId: "b",
        },
        type: "not_a_relationship_type",
      }),
    /Invalid option/,
  );

  assert.throws(
    () =>
      normalizeRelationshipRuntimeState({
        id: "pair-a",
        characters: {
          aId: "a",
          bId: "b",
        },
        eroticDynamics: {
          kinkTags: ["not_a_supported_tag"],
        },
      }),
    /Invalid option/,
  );
});

test("formats relationship state as private chat context", () => {
  const state = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    lifecycleState: "repair",
    rupture: {
      active: true,
      type: "broken_promise",
      severity: 3,
      repairArc: "accountability",
      repairProgress: 35,
    },
    memories: [
      {
        id: "memory-1",
        type: "promise",
        summary: "They promised not to disappear after conflict.",
        emotionalWeight: 82,
        timestamp: 1_772_000_000,
      },
    ],
  });

  const context = createRelationshipStateContext(state);

  assert.match(context, /\[SYSTEM NOTE: RELATIONSHIP STATE\]/);
  assert.match(context, /LIFECYCLE: repair/);
  assert.match(context, /broken_promise; severity 3; repair accountability/);
  assert.match(context, /They promised not to disappear after conflict/);
  assert.match(context, /Do not expose numeric state directly/);
});

test("appends relationship state before the final post-history override", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });
  const messages = appendRelationshipStateContext(
    [{ role: "user", content: "You went quiet." }],
    state,
  );

  assert.equal(messages.length, 2);
  assert.equal(messages[1]?.role, "system");
  assert.match(messages[1]?.content ?? "", /RELATIONSHIP ID: pair-a/);
});

test("chat request schema validates optional relationship state", () => {
  const valid = chatRequestSchema.safeParse({
    characterConfig: {
      relationshipState: {
        id: "pair-a",
        characters: {
          aId: "a",
          bId: "b",
        },
        type: "friends_to_lovers",
      },
    },
    messages: [{ role: "user", content: "Hi." }],
  });

  assert.equal(valid.success, true);

  const invalid = chatRequestSchema.safeParse({
    characterConfig: {
      relationshipState: {
        id: "pair-a",
        characters: {
          aId: "a",
          bId: "b",
        },
        type: "unsupported",
      },
    },
    messages: [{ role: "user", content: "Hi." }],
  });

  assert.equal(invalid.success, false);
});
