import assert from "node:assert/strict";
import test from "node:test";

import {
  createMemoryRelationshipStateStorage,
  createRelationshipStateRepository,
  relationshipKey,
} from "../../lib/chat/relationshipStateRepository";

test("creates one default relationship record per scenario and character pair", async () => {
  const repository = createRelationshipStateRepository(
    createMemoryRelationshipStateStorage(),
  );

  const state = await repository.get("scenario-a", "char-a", "user");

  assert.equal(state.id, "relationship:scenario-a:char-a:user");
  assert.equal(state.scenarioId, "scenario-a");
  assert.equal(state.characters.aId, "char-a");
  assert.equal(state.characters.bId, "user");
  assert.equal(state.trust.emotional, 30);
  assert.ok(state.createdAt);
  assert.ok(state.updatedAt);
});

test("uses the same key for reversed character pairs", () => {
  assert.equal(
    relationshipKey("scenario-a", "user", "char-a"),
    relationshipKey("scenario-a", "char-a", "user"),
  );
});

test("saves and reloads full relationship state through the repository", async () => {
  const repository = createRelationshipStateRepository(
    createMemoryRelationshipStateStorage(),
  );
  const state = await repository.get("scenario-a", "char-a", "user");
  const saved = await repository.save({
    ...state,
    lifecycleState: "tension",
    trust: {
      ...state.trust,
      emotional: 64,
    },
  });
  const reloaded = await repository.get("scenario-a", "user", "char-a");

  assert.equal(saved.lifecycleState, "tension");
  assert.equal(reloaded.lifecycleState, "tension");
  assert.equal(reloaded.trust.emotional, 64);
});

test("patches state while preserving ids and pair ownership", async () => {
  const repository = createRelationshipStateRepository(
    createMemoryRelationshipStateStorage(),
  );
  const current = await repository.get("scenario-a", "char-a", "user");
  const patched = await repository.patch("scenario-a", "char-a", "user", {
    characters: {
      aId: "wrong",
      bId: "wrong",
    },
    id: "wrong",
    memories: [
      {
        id: "memory-1",
        type: "comfort",
        summary: "The user comforted the character after an argument.",
        emotionalWeight: 70,
        intimacyImpact: 0,
        timestamp: 1_772_000_000,
        trustImpact: 0,
        tags: [],
      },
    ],
    trust: {
      ...current.trust,
      emotional: 45,
    },
  });

  assert.equal(patched.id, "relationship:scenario-a:char-a:user");
  assert.equal(patched.characters.aId, "char-a");
  assert.equal(patched.characters.bId, "user");
  assert.equal(patched.trust.emotional, 45);
  assert.equal(patched.memories[0]?.type, "comfort");
  assert.ok(patched.updatedAt);
  assert.doesNotThrow(() => new Date(patched.updatedAt ?? "").toISOString());
});

test("deletes saved relationship state and returns a fresh default next time", async () => {
  const repository = createRelationshipStateRepository(
    createMemoryRelationshipStateStorage(),
  );
  await repository.patch("scenario-a", "char-a", "user", {
    lifecycleState: "tension",
  });

  await repository.delete("scenario-a", "char-a", "user");

  const fresh = await repository.get("scenario-a", "char-a", "user");

  assert.equal(fresh.lifecycleState, "potential");
});
