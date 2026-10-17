import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createMemoryRepository, type MemoryRecordDraft } from "../../lib/memory/memoryRepository";

const storyBookExists = async (storyBookId: string) =>
  ["quiet-harbor", "winter-garden"].includes(storyBookId);

describe("Memory Core repository", () => {
  it("saves and reads a validated memory record for a StoryBook", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists,
    });
    const draft: MemoryRecordDraft = {
      id: "memory-quiet-harbor-1",
      storyBookId: "quiet-harbor",
      kind: "episodic",
      content: "They left the lantern burning after the argument.",
      source: "authored",
      privacy: "private",
      status: "active",
    };

    const saved = await repository.save(draft);

    assert.deepEqual(await repository.get("quiet-harbor", draft.id), saved);
    assert.equal(saved.content, draft.content);
    assert.equal(saved.source, "authored");
    assert.equal(saved.privacy, "private");
    assert.equal(saved.status, "active");
  });

  it("updates a memory while preserving identity and creation time", async () => {
    const timestamps = ["2026-10-17T00:00:00.000Z", "2026-10-17T01:00:00.000Z"];
    const repository = createMemoryRepository({
      now: () => timestamps.shift() ?? "",
      storyBookExists,
    });
    const saved = await repository.save({
      id: "memory-quiet-harbor-2",
      storyBookId: "quiet-harbor",
      kind: "relationship",
      content: "They still avoid the subject of the missing letter.",
      source: "derived",
      privacy: "project",
      status: "active",
    });

    const updated = await repository.update("quiet-harbor", saved.id, {
      content: "They finally name the missing letter between them.",
      status: "superseded",
    });

    assert.equal(updated.id, saved.id);
    assert.equal(updated.storyBookId, saved.storyBookId);
    assert.equal(updated.createdAt, saved.createdAt);
    assert.equal(updated.updatedAt, "2026-10-17T01:00:00.000Z");
    assert.equal(updated.content, "They finally name the missing letter between them.");
    assert.equal(updated.status, "superseded");
    assert.deepEqual(await repository.get("quiet-harbor", saved.id), updated);
  });

  it("deletes a memory within its StoryBook without affecting another StoryBook", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists,
    });
    await repository.save({
      id: "memory-shared-id",
      storyBookId: "quiet-harbor",
      kind: "episodic",
      content: "The harbor bell rang once.",
      source: "authored",
      privacy: "private",
      status: "active",
    });
    await repository.save({
      id: "memory-shared-id",
      storyBookId: "winter-garden",
      kind: "episodic",
      content: "The garden gate stayed open.",
      source: "authored",
      privacy: "private",
      status: "active",
    });

    await repository.delete("quiet-harbor", "memory-shared-id");

    assert.equal(await repository.get("quiet-harbor", "memory-shared-id"), null);
    assert.equal(
      (await repository.get("winter-garden", "memory-shared-id"))?.content,
      "The garden gate stayed open.",
    );
  });

  it("rejects invalid updates without changing the stored record", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists,
    });
    const saved = await repository.save({
      id: "memory-validation-1",
      storyBookId: "quiet-harbor",
      kind: "knowledge",
      content: "The west door is locked after sunset.",
      source: "authored",
      privacy: "do_not_send",
      status: "active",
    });

    await assert.rejects(
      repository.update("quiet-harbor", saved.id, {
        status: "invalid-status" as "active",
      }),
    );

    assert.deepEqual(await repository.get("quiet-harbor", saved.id), saved);
  });

  it("rejects saving a memory for a StoryBook that does not exist", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists: async (storyBookId) => storyBookId === "quiet-harbor",
    });

    await assert.rejects(
      repository.save({
        id: "memory-orphaned-1",
        storyBookId: "missing-storybook",
        kind: "episodic",
        content: "This memory has nowhere to belong.",
        source: "authored",
        privacy: "private",
        status: "active",
      }),
    );
  });
});
