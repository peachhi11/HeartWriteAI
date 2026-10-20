import assert from "node:assert/strict";
import test from "node:test";

import {
  createCharacterRepository,
  createMemoryCharacterStorage,
  type CharacterRecordDraft,
} from "../../lib/character-card/characterRepository";

const characterDraft: CharacterRecordDraft = {
  id: "character-mara",
  title: "Mara Vale",
  values: {
    fullName: "Mara Vale",
    aliasesNicknames: "Mara",
    ageBirthdate: "29",
    raceEthnicity: "Human",
    species: "Human",
    birthplace: "Northport",
    height: "Tall",
    description: "A guarded harbor cartographer.",
    relationshipsConnections: "Keeps people at arm's length.",
    physicalAppearance: "Dark hair and a weathered coat.",
    personalityPsychology: "Observant, dry, and careful.",
    backgroundStory: "She maps coastlines for a living.",
    speechStyle: "Short, precise sentences.",
    intimacyProfile: "Slow to trust.",
    scenario: "A storm has closed the harbor.",
    first_mes: "You should not be out here tonight.",
    mes_example: "The tide is turning.",
    creator_notes: "Keep her grounded and self-directed.",
    system_prompt: "Preserve her agency and voice.",
    post_history_instructions: "Keep continuity with the harbor map.",
    tagsText: "guarded, cartographer",
    alternateOpenings: [],
    groupOnlyGreetings: [],
  },
  createdAt: "2026-10-19T00:00:00.000Z",
  updatedAt: "2026-10-19T00:00:00.000Z",
};

test("saves and reloads a validated reusable Character Book record", async () => {
  const storage = createMemoryCharacterStorage();
  const firstRepository = createCharacterRepository({ storage });

  const saved = await firstRepository.save(characterDraft);
  const secondRepository = createCharacterRepository({ storage });

  assert.deepEqual(await secondRepository.get(characterDraft.id), saved);
  assert.deepEqual(await secondRepository.list(), [saved]);
});
