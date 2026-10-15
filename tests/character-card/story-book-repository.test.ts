import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createMemoryStoryBookStorage,
  createStoryBookRepository,
  type StoryBook,
} from "../../lib/storybook/storyBookRepository";

const makeClock = (...timestamps: string[]) => {
  let index = 0;
  return () => timestamps[index++] ?? timestamps[timestamps.length - 1];
};

describe("StoryBook repository", () => {
  it("saves and lists validated books in latest-update order", async () => {
    const repository = createStoryBookRepository({
      now: makeClock("2026-10-15T00:00:00.000Z", "2026-10-15T01:00:00.000Z"),
      storage: createMemoryStoryBookStorage(),
    });

    await repository.save({
      id: "quiet-harbor",
      title: "Quiet Harbor",
      summary: "A coastal romance.",
      status: "draft",
    });
    await repository.save({
      id: "glass-house",
      title: "Glass House",
      summary: "A guarded second chance.",
      status: "active",
    });

    assert.deepEqual(
      (await repository.list()).map((book) => book.id),
      ["glass-house", "quiet-harbor"],
    );
  });

  it("preserves creation time while updating an existing book", async () => {
    const repository = createStoryBookRepository({
      now: makeClock("2026-10-15T00:00:00.000Z", "2026-10-15T01:00:00.000Z"),
      storage: createMemoryStoryBookStorage(),
    });

    const created = await repository.save({
      id: "quiet-harbor",
      title: "Quiet Harbor",
      summary: "A coastal romance.",
      status: "draft",
    });
    const updated = await repository.save({
      ...created,
      summary: "A coastal romance with a second chance.",
      status: "active",
    });

    assert.equal(updated.createdAt, created.createdAt);
    assert.notEqual(updated.updatedAt, created.updatedAt);
    assert.equal(updated.status, "active");
  });

  it("returns null for unknown books and removes saved books", async () => {
    const repository = createStoryBookRepository({
      now: () => "2026-10-15T00:00:00.000Z",
      storage: createMemoryStoryBookStorage(),
    });

    assert.equal(await repository.get("missing"), null);
    await repository.save({
      id: "quiet-harbor",
      title: "Quiet Harbor",
      summary: "A coastal romance.",
      status: "draft",
    });
    await repository.delete("quiet-harbor");
    assert.equal(await repository.get("quiet-harbor"), null);
  });

  it("rejects blank titles and unsupported statuses", async () => {
    const repository = createStoryBookRepository({
      now: () => "2026-10-15T00:00:00.000Z",
      storage: createMemoryStoryBookStorage(),
    });

    await assert.rejects(
      repository.save({
        id: "quiet-harbor",
        title: "   ",
        summary: "A coastal romance.",
        status: "draft",
      }),
    );
    await assert.rejects(
      repository.save({
        id: "quiet-harbor",
        title: "Quiet Harbor",
        summary: "A coastal romance.",
        status: "published" as StoryBook["status"],
      }),
    );
  });
});
