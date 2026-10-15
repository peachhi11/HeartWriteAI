import assert from "node:assert/strict";
import test from "node:test";

import {
  createMemoryRelationshipStateStorage,
  createRelationshipStateRepository,
  type RelationshipStateRepository,
} from "../../lib/chat/relationshipStateRepository";
import type { RelationshipState } from "../../lib/chat/relationshipState.schema";
import { runRelationshipPersistenceDiagnostic } from "../../lib/chat/relationshipPersistenceDiagnostic";

test("relationship persistence diagnostic verifies a save/read cycle and cleans up", async () => {
  const repository = createRelationshipStateRepository(createMemoryRelationshipStateStorage());

  const result = await runRelationshipPersistenceDiagnostic(repository);

  assert.equal(result.markerVerified, true);
  assert.equal(result.cleanedUp, true);
  assert.equal(
    await repository
      .get(result.scenarioId, "diagnostic-user", "diagnostic-character")
      .then((state) => state.tags.includes("heartwrite-persistence-diagnostic")),
    false,
  );
});

test("relationship persistence diagnostic cleans up when readback fails", async () => {
  const calls: string[] = [];
  const repository: RelationshipStateRepository = {
    async delete(scenarioId, aId, bId) {
      calls.push(`delete:${scenarioId}:${aId}:${bId}`);
    },
    async get() {
      throw new Error("read failed");
    },
    async patch() {
      throw new Error("unused");
    },
    async save(state: RelationshipState) {
      return state;
    },
  };

  await assert.rejects(runRelationshipPersistenceDiagnostic(repository), /read failed/);
  assert.equal(calls.length, 1);
  assert.match(calls[0], /^delete:__private_persistence_diagnostic__:/);
});
