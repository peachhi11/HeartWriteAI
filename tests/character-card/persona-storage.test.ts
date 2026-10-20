import assert from "node:assert/strict";
import test from "node:test";

import {
  createMemoryPersonaStorage,
  createPersonaRepository,
  type PersonaRecordDraft,
} from "../../lib/persona/personaRepository";
import { createLocalPersonaRepositoryStorage } from "../../lib/persona/localPersonaRepository";

const personaDraft: PersonaRecordDraft = {
  id: "persona-mara-reader",
  name: "Mara's Reader",
  prompt: "The user is observant, self-directed, and protective of their boundaries.",
  summary: "A grounded user persona for quiet harbor scenes.",
  tags: ["grounded", "observant"],
  source: "authored",
};

test("saves and reloads a validated reusable Persona Book record", async () => {
  const storage = createMemoryPersonaStorage();
  const firstRepository = createPersonaRepository({
    now: () => "2026-10-19T01:00:00.000Z",
    storage,
  });

  const saved = await firstRepository.save(personaDraft);
  const secondRepository = createPersonaRepository({ storage });

  assert.deepEqual(await secondRepository.get(personaDraft.id), saved);
  assert.deepEqual(await secondRepository.list(), [saved]);
});

test("local Persona Book storage reloads records through the shared adapter", async () => {
  const values = new Map<string, string>();
  const browserStorage = {
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
  const storageOptions = {
    browserStorage,
    isBrowser: () => true,
    isTauri: () => false,
  };
  const firstRepository = createPersonaRepository({
    now: () => "2026-10-19T02:00:00.000Z",
    storage: createLocalPersonaRepositoryStorage(storageOptions),
  });

  const saved = await firstRepository.save(personaDraft);
  const secondRepository = createPersonaRepository({
    storage: createLocalPersonaRepositoryStorage(storageOptions),
  });

  assert.deepEqual(await secondRepository.get(personaDraft.id), saved);
});
