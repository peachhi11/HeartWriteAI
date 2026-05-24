import assert from "node:assert/strict";
import test from "node:test";

import {
  createDefaultRelationshipState,
  normalizeRelationshipState,
} from "../../lib/chat/relationshipState.schema";
import { createRelationshipStateContext } from "../../lib/chat/relationshipStateContext";
import {
  buildNonRomanticTransitionSnapshot,
  resolveNonRomanticRelationshipState,
  syncNonRomanticRelationshipState,
} from "../../lib/chat/relationshipNonRomantic";

test("defaults non-romantic bond state without implying low importance forever", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });

  assert.equal(state.nonRomantic.state, "stranger");
  assert.equal(state.nonRomantic.romanceOverlap, "absent");
  assert.equal(state.nonRomantic.emotionallySignificant, false);
  assert.equal(state.nonRomantic.axes.platonicAttachment, 0);
  assert.equal(state.nonRomantic.axes.relationshipFluidity, 50);
});

test("normalizes deep friendship axes separately from romance lifecycle", () => {
  const state = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    lifecycleState: "potential",
    nonRomantic: {
      axes: {
        platonicAttachment: 78,
        emotionalIntimacy: 82,
        socialCloseness: 70,
        trust: 76,
        devotion: 55,
      },
    },
  });
  const synced = syncNonRomanticRelationshipState(state);

  assert.equal(synced.lifecycleState, "potential");
  assert.equal(synced.nonRomantic.state, "deep_friendship");
  assert.equal(synced.nonRomantic.emotionallySignificant, true);
  assert.equal(synced.nonRomantic.romanceOverlap, "absent");
});

test("resolves rivalry and ambiguity as emotionally specific non-romantic states", () => {
  const rivalState = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    nonRomantic: {
      axes: {
        rivalry: 86,
        tension: 70,
        admiration: 58,
      },
    },
  });
  const ambiguousState = normalizeRelationshipState({
    id: "pair-b",
    characters: {
      aId: "a",
      bId: "b",
    },
    nonRomantic: {
      axes: {
        ambiguity: 86,
        tension: 75,
        platonicAttachment: 58,
      },
    },
  });

  assert.equal(resolveNonRomanticRelationshipState(rivalState), "rival");
  assert.equal(
    resolveNonRomanticRelationshipState(ambiguousState),
    "ambiguous_emotional_bond",
  );
});

test("builds transition pressure for friendship to ambiguous romance overlap", () => {
  const state = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    chemistry: {
      romantic: 35,
      tension: 60,
    },
    nonRomantic: {
      axes: {
        platonicAttachment: 72,
        emotionalIntimacy: 70,
        ambiguity: 82,
        tension: 68,
        devotion: 60,
      },
    },
  });
  const snapshot = buildNonRomanticTransitionSnapshot(state);

  assert.equal(snapshot.currentState, "ambiguous_emotional_bond");
  assert.equal(snapshot.romanceOverlap, "ambiguous");
  assert.equal(snapshot.emotionallySignificant, true);
  assert.ok(snapshot.romanticTransitionPressure > 60);
  assert.ok(snapshot.ambiguityPressure > 70);
  assert.deepEqual(snapshot.dominantAxes.slice(0, 2), ["ambiguity", "platonicAttachment"]);
  assert.ok(snapshot.likelyNextStates.includes("deep_friendship"));
});

test("includes non-romantic bond context in private relationship state prompt", () => {
  const state = syncNonRomanticRelationshipState(
    normalizeRelationshipState({
      id: "pair-a",
      characters: {
        aId: "a",
        bId: "b",
      },
      nonRomantic: {
        axes: {
          protectiveness: 78,
          trust: 62,
          platonicAttachment: 55,
        },
      },
    }),
  );
  const context = createRelationshipStateContext(state);

  assert.match(context, /NON-ROMANTIC BOND: protective_bond/);
  assert.match(context, /overlap absent/);
  assert.match(context, /platonic 55/);
});
