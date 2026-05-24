import assert from "node:assert/strict";
import test from "node:test";

import {
  createDefaultRelationshipState,
  normalizeRelationshipState,
} from "../../lib/chat/relationshipState.schema";
import { createRelationshipStateContext } from "../../lib/chat/relationshipStateContext";
import {
  buildSexualOnlySnapshot,
  resolveSexualOnlyRelationshipState,
  syncSexualOnlyRelationshipState,
} from "../../lib/chat/relationshipSexualOnly";

test("defaults sexual-only relationship state as inactive", () => {
  const state = createDefaultRelationshipState({
    id: "pair-a",
    aId: "a",
    bId: "b",
  });

  assert.equal(state.sexualOnly.state, "none");
  assert.equal(state.sexualOnly.active, false);
  assert.equal(state.sexualOnly.emotionallyComplicated, false);
  assert.equal(state.sexualOnly.axes.boundaryClarity, 50);
});

test("resolves friends-with-benefits without forcing romance lifecycle", () => {
  const state = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    lifecycleState: "potential",
    nonRomantic: {
      state: "deep_friendship",
    },
    sexualOnly: {
      statedStructure: "friends_with_benefits",
      axes: {
        sexualChemistry: 72,
        eroticCentrality: 68,
        emotionalIntegration: 44,
        boundaryClarity: 70,
      },
    },
  });
  const synced = syncSexualOnlyRelationshipState(state);

  assert.equal(synced.lifecycleState, "potential");
  assert.equal(synced.sexualOnly.state, "friends_with_benefits");
  assert.equal(synced.sexualOnly.active, true);
  assert.equal(synced.sexualOnly.emotionallyComplicated, false);
});

test("detects attachment denial when integration and definition avoidance are high", () => {
  const state = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    sexualOnly: {
      axes: {
        sexualChemistry: 86,
        eroticCentrality: 82,
        emotionalIntegration: 66,
        definitionAvoidance: 88,
        vulnerabilityLeakage: 70,
      },
    },
  });
  const snapshot = buildSexualOnlySnapshot(state);

  assert.equal(snapshot.currentState, "attachment_denial_sexual_relationship");
  assert.equal(snapshot.active, true);
  assert.equal(snapshot.emotionallyComplicated, true);
  assert.ok(snapshot.attachmentDriftRisk > 45);
  assert.ok(snapshot.dominantRisks.includes("definition_avoidance"));
});

test("detects secret and avoidant sexual-only structures", () => {
  const secret = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    sexualOnly: {
      axes: {
        sexualChemistry: 70,
        eroticCentrality: 70,
        secrecy: 85,
      },
    },
  });
  const avoidant = normalizeRelationshipState({
    id: "pair-b",
    characters: {
      aId: "a",
      bId: "b",
    },
    attachment: {
      engulfmentSensitivity: 75,
    },
    sexualOnly: {
      axes: {
        sexualChemistry: 78,
        eroticCentrality: 72,
        emotionalIntegration: 20,
        definitionAvoidance: 64,
      },
    },
  });

  assert.equal(
    resolveSexualOnlyRelationshipState(secret),
    "secret_sexual_relationship",
  );
  assert.equal(
    buildSexualOnlySnapshot(avoidant).trajectory,
    "avoidant_compartmentalization",
  );
});

test("projects romantic escalation when repeated intimacy leaks attachment", () => {
  const state = normalizeRelationshipState({
    id: "pair-a",
    characters: {
      aId: "a",
      bId: "b",
    },
    intimacy: {
      emotional: 55,
      sexual: 78,
    },
    chemistry: {
      romantic: 58,
      sexual: 88,
    },
    attachment: {
      bondDepth: 58,
    },
    sexualOnly: {
      axes: {
        sexualChemistry: 90,
        eroticCentrality: 86,
        emotionalIntegration: 72,
        vulnerabilityLeakage: 78,
        dependencyFormation: 64,
        jealousyReactivity: 56,
        definitionAvoidance: 20,
      },
    },
  });
  const snapshot = buildSexualOnlySnapshot(state);

  assert.equal(snapshot.trajectory, "romantic_escalation");
  assert.ok(snapshot.romanticEscalationProbability > 65);
  assert.ok(snapshot.dominantRisks.includes("vulnerability_leakage"));
});

test("includes sexual-only bond context in private relationship prompt", () => {
  const state = syncSexualOnlyRelationshipState(
    normalizeRelationshipState({
      id: "pair-a",
      characters: {
        aId: "a",
        bId: "b",
      },
      sexualOnly: {
        statedStructure: "casual",
        axes: {
          sexualChemistry: 75,
          eroticCentrality: 72,
          exclusivityAmbiguity: 55,
          definitionAvoidance: 60,
        },
      },
    }),
  );
  const context = createRelationshipStateContext(state);

  assert.match(context, /SEXUAL-ONLY BOND:/);
  assert.match(context, /casual_sexual_relationship/);
  assert.match(context, /definition avoidance 60/);
});
