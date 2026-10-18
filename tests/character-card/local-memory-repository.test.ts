import { test } from "node:test";
import assert from "node:assert/strict";

import { createLocalMemoryRepositoryStorage } from "../../lib/memory/localMemoryRepository";
import { createMemoryRepository } from "../../lib/memory/memoryRepository";

function createBrowserStorage() {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
}

test("local memory storage reloads revisions and preserves originals", async () => {
  const browserStorage = createBrowserStorage();
  const storageOptions = {
    browserStorage,
    isBrowser: () => true,
    isTauri: () => false,
  };
  const storyBookExists = async (storyBookId: string) => storyBookId === "quiet-harbor";

  const firstRepository = createMemoryRepository({
    now: () => "2026-10-18T00:00:00.000Z",
    storage: createLocalMemoryRepositoryStorage(storageOptions),
    storyBookExists,
  });
  const original = await firstRepository.save({
    id: "memory-local-1",
    storyBookId: "quiet-harbor",
    kind: "episodic",
    content: "The original note remains recoverable.",
    source: "authored",
    privacy: "private",
    status: "active",
  });
  const revision = await firstRepository.revise("quiet-harbor", original.id, {
    content: "The working note has been edited.",
  });

  const secondRepository = createMemoryRepository({
    storage: createLocalMemoryRepositoryStorage(storageOptions),
    storyBookExists,
  });

  assert.equal(
    (await secondRepository.get("quiet-harbor", original.id))?.content,
    original.content,
  );
  assert.equal((await secondRepository.get("quiet-harbor", original.id))?.status, "superseded");
  assert.equal(
    (await secondRepository.get("quiet-harbor", revision.id))?.content,
    revision.content,
  );

  await secondRepository.delete("quiet-harbor", original.id);

  const thirdRepository = createMemoryRepository({
    storage: createLocalMemoryRepositoryStorage(storageOptions),
    storyBookExists,
  });
  assert.equal(await thirdRepository.get("quiet-harbor", original.id), null);
  assert.equal((await thirdRepository.get("quiet-harbor", revision.id))?.content, revision.content);
});
