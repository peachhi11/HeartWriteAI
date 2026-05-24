import assert from "node:assert/strict";
import test from "node:test";

import {
  createRuntimeBundleArtifact,
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

test("creates runtime bundle context from saved generation artifacts", () => {
  const persona = generatePersonaArtifact({
    archetype: "Protective realist",
    boundaries: "No user dialogue.",
    emotionalNeed: "to feel trusted",
    name: "Ari",
    playStyle: "Story roleplay",
    pointOfView: "AnyPOV",
    tags: "guarded",
  });
  const scenario = generateScenarioArtifact({
    jobTitle: "University Student",
    professionalDomain: "Corporate_Finance",
    title: "Archive Night",
    trope: "Academic rivals forced proximity",
  });
  const lorebook = generateLorebookArtifact({
    jobTitle: "University Student",
    professionalDomain: "Corporate_Finance",
    speciesType: "Human",
    title: "Campus Canon",
    trope: "Academic rivals forced proximity",
  });
  const bundle = createRuntimeBundleArtifact({
    lorebook,
    persona,
    scenario,
    title: "Ari Archive Runtime",
  });

  assert.equal(bundle.title, "Ari Archive Runtime");
  assert.equal(bundle.persona?.name, "Ari");
  assert.equal(bundle.scenario?.title, "Archive Night");
  assert.equal(bundle.lorebook?.title, "Campus Canon");
  assert.ok(bundle.tags.includes("bundle"));
  assert.match(bundle.compiledContext, /\[SELECTED PERSONA\]/);
  assert.match(bundle.compiledContext, /\[SELECTED SCENARIO\]/);
  assert.match(bundle.compiledContext, /\[SELECTED LOREBOOK\]/);
  assert.match(bundle.compiledContext, /Opening constraint:/);
});

test("creates partial runtime bundle context with explicit missing slots", () => {
  const bundle = createRuntimeBundleArtifact({
    title: "Partial Runtime",
  });

  assert.match(bundle.compiledContext, /No persona selected/);
  assert.match(bundle.compiledContext, /No scenario selected/);
  assert.match(bundle.compiledContext, /No lorebook selected/);
});
