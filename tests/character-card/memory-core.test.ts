import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createMemoryRepository, type MemoryRecordDraft } from "../../lib/memory/memoryRepository";
import { readMemoryPromptProjection } from "../../lib/memory/memoryPromptProjection";

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

  it("updates memory metadata while preserving identity and content", async () => {
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
      status: "superseded",
    });

    assert.equal(updated.id, saved.id);
    assert.equal(updated.storyBookId, saved.storyBookId);
    assert.equal(updated.createdAt, saved.createdAt);
    assert.equal(updated.updatedAt, "2026-10-17T01:00:00.000Z");
    assert.equal(updated.content, saved.content);
    assert.equal(updated.status, "superseded");
    assert.deepEqual(await repository.get("quiet-harbor", saved.id), updated);
  });

  it("creates an editable revision while preserving the original record", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists,
    });
    const original = await repository.save({
      id: "memory-revision-1",
      storyBookId: "quiet-harbor",
      kind: "relationship",
      content: "They still avoid the subject of the missing letter.",
      source: "authored",
      privacy: "project",
      status: "active",
    });

    const revision = await repository.revise("quiet-harbor", original.id, {
      content: "They finally name the missing letter between them.",
    });

    assert.notEqual(revision.id, original.id);
    assert.equal(revision.storyBookId, original.storyBookId);
    assert.equal(revision.content, "They finally name the missing letter between them.");
    assert.equal(revision.status, "active");
    assert.equal(revision.originalMemoryId, original.id);
    assert.deepEqual(await repository.get("quiet-harbor", original.id), {
      ...original,
      status: "superseded",
    });
    assert.deepEqual(await repository.get("quiet-harbor", revision.id), revision);
  });

  it("rejects direct content updates and keeps the original revision chain", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists,
    });
    const original = await repository.save({
      id: "memory-revision-2",
      storyBookId: "quiet-harbor",
      kind: "episodic",
      content: "The door stayed closed.",
      source: "authored",
      privacy: "private",
      status: "active",
    });

    await assert.rejects(
      repository.update("quiet-harbor", original.id, { content: "The door opened." }),
      /Use revise\(\)/,
    );
    const firstRevision = await repository.revise("quiet-harbor", original.id, {
      content: "The door opened once.",
    });
    const secondRevision = await repository.revise("quiet-harbor", firstRevision.id, {
      content: "The door opened twice.",
    });

    assert.equal(firstRevision.originalMemoryId, original.id);
    assert.equal(secondRevision.originalMemoryId, original.id);
    assert.equal((await repository.get("quiet-harbor", original.id))?.content, original.content);
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

  it("moves a preserved memory through Needs a StoryBook and reassigns it", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists,
    });
    const saved = await repository.save({
      id: "memory-reassign-1",
      storyBookId: "quiet-harbor",
      kind: "episodic",
      content: "The lantern stayed lit after the StoryBook was archived.",
      source: "authored",
      privacy: "private",
      status: "active",
    });

    const unassigned = await repository.unassign("quiet-harbor", saved.id);

    assert.equal(unassigned.storyBookId, null);
    assert.deepEqual(await repository.listNeedsStoryBook(), [unassigned]);

    const reassigned = await repository.reassign(saved.id, "winter-garden");

    assert.equal(reassigned.storyBookId, "winter-garden");
    assert.equal((await repository.listNeedsStoryBook()).length, 0);
    assert.deepEqual(await repository.get("winter-garden", saved.id), reassigned);
  });

  it("projects only active prompt-safe memories for a StoryBook", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
      storyBookExists,
    });
    await repository.save({
      id: "memory-prompt-active",
      storyBookId: "quiet-harbor",
      kind: "episodic",
      content: "The lantern stayed lit after the argument.",
      source: "authored",
      privacy: "project",
      status: "active",
    });
    await repository.save({
      id: "memory-prompt-private",
      storyBookId: "quiet-harbor",
      kind: "secret",
      content: "The private letter is hidden in the desk.",
      source: "authored",
      privacy: "private",
      status: "active",
    });
    await repository.save({
      id: "memory-prompt-do-not-send",
      storyBookId: "quiet-harbor",
      kind: "knowledge",
      content: "Never include this in generated context.",
      source: "authored",
      privacy: "do_not_send",
      status: "active",
    });
    await repository.save({
      id: "memory-prompt-superseded",
      storyBookId: "quiet-harbor",
      kind: "residue",
      content: "This older version must stay out of the prompt.",
      source: "authored",
      privacy: "project",
      status: "superseded",
    });
    await repository.save({
      id: "memory-prompt-other-story",
      storyBookId: "winter-garden",
      kind: "episodic",
      content: "This belongs to another StoryBook.",
      source: "authored",
      privacy: "project",
      status: "active",
    });

    assert.deepEqual(
      await readMemoryPromptProjection(repository, {
        storyBookId: "quiet-harbor",
        privacyMode: "local",
      }),
      [
        {
          id: "memory-prompt-active",
          kind: "episodic",
          content: "The lantern stayed lit after the argument.",
        },
        {
          id: "memory-prompt-private",
          kind: "secret",
          content: "The private letter is hidden in the desk.",
        },
      ],
    );

    assert.deepEqual(
      await readMemoryPromptProjection(repository, {
        storyBookId: "quiet-harbor",
        privacyMode: "provider_safe",
      }),
      [
        {
          id: "memory-prompt-active",
          kind: "episodic",
          content: "The lantern stayed lit after the argument.",
        },
      ],
    );
  });
});
