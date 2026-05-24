import assert from "node:assert/strict";
import test from "node:test";

import {
  generateLorebookArtifact,
  generatePersonaArtifact,
  generateScenarioArtifact,
} from "../../features/generation/workflows";

test("generates persona artifact with prompt and normalized tags", () => {
  const persona = generatePersonaArtifact({
    archetype: "Protective realist",
    boundaries: "No user dialogue.",
    emotionalNeed: "to feel trusted",
    name: "Ari",
    playStyle: "Story roleplay",
    pointOfView: "AnyPOV",
    tags: "Slow Burn, slow burn, guarded",
  });

  assert.equal(persona.name, "Ari");
  assert.match(persona.prompt, /USER PERSONA: Ari/);
  assert.ok(persona.tags.includes("slow burn"));
  assert.equal(
    persona.tags.filter((tag) => tag === "slow burn").length,
    1,
  );
});

test("generates scenario artifact with premise and first message constraints", () => {
  const scenario = generateScenarioArtifact({
    jobTitle: "University Student",
    professionalDomain: "Corporate_Finance",
    title: "Archive Night",
    trope: "Academic rivals forced proximity",
  });

  assert.equal(scenario.title, "Archive Night");
  assert.equal(scenario.occupation.kind, "student");
  assert.ok(scenario.summary.includes("{{char}}"));
  assert.ok(scenario.summary.includes("{{user}}"));
  assert.ok(scenario.firstMessage.aiOutputConstraint.length > 40);
});

test("generates lorebook artifact with scoped entries and placeholders", () => {
  const lorebook = generateLorebookArtifact({
    jobTitle: "University Student",
    professionalDomain: "Corporate_Finance",
    speciesType: "Human",
    title: "Campus Canon",
    trope: "Academic rivals forced proximity",
  });

  assert.equal(lorebook.title, "Campus Canon");
  assert.equal(lorebook.species.type, "Human");
  assert.ok(lorebook.entries.length >= 4);
  assert.ok(
    lorebook.entries.some((entry) =>
      entry.activationKeys.includes("world setting"),
    ),
  );
  assert.ok(
    lorebook.placeholders.some(
      (placeholder) => placeholder.variableKey === "{{world_setting}}",
    ),
  );
});
