import assert from "node:assert/strict";
import test from "node:test";

import {
  compareCharacterSimilarity,
  createCharacterSimilarityProfile,
} from "../../lib/character-card/characterSimilarity";
import type { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";

function createCard(overrides: Partial<CharacterCardV3["data"]>): CharacterCardV3 {
  return {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      alternate_greetings: [],
      character_version: "1.0",
      creator: "HeartWriteAI",
      creator_notes: "",
      description: "",
      extensions: {},
      first_mes: "",
      group_only_greetings: [],
      mes_example: "",
      name: "Test Character",
      personality: "",
      post_history_instructions: "",
      scenario: "",
      system_prompt: "",
      tags: [],
      ...overrides,
    },
  };
}

test("extracts similarity profiles from HeartWriteAI character creation extensions", () => {
  const profile = createCharacterSimilarityProfile(
    createCard({
      name: "Maren Voss",
      tags: ["registrar", "slow burn"],
      extensions: {
        heartwriteai_character_creation_form: {
          semanticSeedIds: ["fear_of_abandonment", "slow_burn"],
          identity: {
            age: "34",
            occupation: "Museum registrar",
            speciesHeritage: "Human",
          },
          personality: {
            positiveTraits: "meticulous, patient",
            flaws: "controlling, suspicious",
          },
          cognitiveDrivers: {
            motivation: "control and access",
            fear: "being bypassed",
          },
          psychology: {
            beliefs: "rules keep people safe",
          },
        },
      },
    }),
  );

  assert.equal(profile.name, "Maren Voss");
  assert.equal(profile.age, 34);
  assert.equal(profile.occupation, "Museum registrar");
  assert.deepEqual(profile.semanticSeedIds, ["fear_of_abandonment", "slow_burn"]);
  assert.ok(profile.personalityTraits.includes("meticulous"));
});

test("scores overlap, redundancy, synergy, and differences across cards", () => {
  const first = createCard({
    name: "Maren Voss",
    tags: ["slow burn", "registrar"],
    description: "A museum registrar who controls access and fears being bypassed.",
    extensions: {
      heartwriteai_character_creation_form: {
        semanticSeedIds: ["fear_of_abandonment", "slow_burn"],
        identity: { occupation: "Museum registrar", speciesHeritage: "Human" },
        personality: { positiveTraits: "meticulous, patient" },
        cognitiveDrivers: { motivation: "protect the archive", fear: "replacement" },
        psychology: { beliefs: "rules protect people" },
      },
    },
  });
  const second = createCard({
    name: "Lena Voss",
    tags: ["slow burn", "archivist"],
    description: "An archivist with patient habits and fear of being replaced.",
    extensions: {
      heartwriteai_character_creation_form: {
        semanticSeedIds: ["fear_of_replacement", "slow_burn"],
        identity: { occupation: "Archivist", speciesHeritage: "Human" },
        personality: { positiveTraits: "patient, observant" },
        cognitiveDrivers: { motivation: "protect the archive", fear: "replacement" },
        psychology: { beliefs: "care requires consistency" },
      },
    },
  });

  const result = compareCharacterSimilarity(first, second);

  assert.equal(result.character1Name, "Maren Voss");
  assert.equal(result.character2Name, "Lena Voss");
  assert.ok(result.overallScore > 0.25);
  assert.ok(result.synergyPotential > 0.2);
  assert.ok(result.commonalities.some((line) => line.includes("Shared")));
  assert.ok(result.differences.some((line) => line.includes("Different occupations")));
});
