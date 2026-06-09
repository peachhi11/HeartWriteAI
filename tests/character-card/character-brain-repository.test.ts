import assert from "node:assert/strict";
import test from "node:test";

import {
  characterBrainKey,
  createCharacterBrainRepository,
  createMemoryCharacterBrainStorage,
} from "../../lib/chat/characterBrainRepository";
import { createJulianBrainTemplate } from "../../lib/character-card/semanticBrainTemplates";

test("uses one local store key per character brain", () => {
  assert.equal(
    characterBrainKey("Julian"),
    "character-brain:julian",
  );
  assert.equal(
    characterBrainKey("  Mara   Vale  "),
    "character-brain:mara vale",
  );
  assert.equal(
    characterBrainKey("   "),
    "character-brain:character",
  );
});

test("saves and reloads character brain JSON through the repository", async () => {
  const repository = createCharacterBrainRepository(
    createMemoryCharacterBrainStorage(),
  );
  const brain = createJulianBrainTemplate();
  brain.nodes[1]!.activation.current = 0.7;
  brain.runtime.activeNodeIds = ["stale-id"];

  const saved = await repository.save(brain);
  const reloaded = await repository.get("julian");

  assert.equal(saved.characterId, "julian");
  assert.deepEqual(saved.runtime.activeNodeIds, [
    "semantic-node:julian:abandonment",
  ]);
  assert.equal(reloaded?.nodes[1]?.activation.current, 0.7);
  assert.deepEqual(reloaded?.runtime.activeNodeIds, [
    "semantic-node:julian:abandonment",
  ]);
});

test("deletes saved character brain records", async () => {
  const repository = createCharacterBrainRepository(
    createMemoryCharacterBrainStorage(),
  );

  await repository.save(createJulianBrainTemplate());
  assert.ok(await repository.get("julian"));

  await repository.delete("julian");

  assert.equal(await repository.get("julian"), null);
});
