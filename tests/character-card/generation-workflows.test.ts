import assert from "node:assert/strict";
import test from "node:test";

import {
  createBlankPersonaArtifact,
  createImportedPersonaArtifact,
  createBlankLorebookArtifact,
  createLorebookArtifactFromV3Document,
  createPersonaArtifactFromEditable,
  createRuntimeBundleArtifact,
  generateLorebookArtifact,
  generatePersonaArtifact,
  generateScenarioArtifact,
} from "../../features/generation/workflows";
import { generatedLorebookArtifactToV3Document } from "../../features/lorebooks/adapters";

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
  assert.equal(persona.source, "generated");
});

test("creates blank persona artifacts as editable drafts", () => {
  const persona = createBlankPersonaArtifact("Blank Reader");

  assert.equal(persona.source, "blank");
  assert.equal(persona.name, "Blank Reader");
  assert.match(persona.prompt, /USER PERSONA: Blank Reader/);
  assert.ok(persona.tags.includes("blank"));
});

test("imports and syncs persona artifacts from editable JSON", () => {
  const imported = createImportedPersonaArtifact({
    id: "persona_custom",
    name: "Rae",
    prompt: "USER PERSONA: Rae",
    summary: "A guarded user persona.",
    tags: ["Guarded", "guarded", "AnyPOV"],
    updatedAt: 123,
  });

  assert.equal(imported.id, "persona_custom");
  assert.equal(imported.source, "imported");
  assert.equal(imported.updatedAt, 123);
  assert.equal(
    imported.tags.filter((tag) => tag === "guarded").length,
    1,
  );

  const synced = createPersonaArtifactFromEditable({
    ...imported,
    name: "Rae Edited",
    summary: "Edited summary.",
  });

  assert.equal(synced.id, imported.id);
  assert.equal(synced.name, "Rae Edited");
  assert.equal(synced.summary, "Edited summary.");
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

test("creates blank lorebook artifacts as editable v3 drafts", () => {
  const lorebook = createBlankLorebookArtifact("Blank Campus Notes");

  assert.equal(lorebook.source, "blank");
  assert.equal(lorebook.title, "Blank Campus Notes");
  assert.equal(lorebook.v3Document?.data.name, "Blank Campus Notes");
  assert.equal(lorebook.v3Document?.data.entries.length, 1);
  assert.ok(lorebook.tags.includes("blank"));
});

test("syncs lorebook artifact metadata from edited v3 documents", () => {
  const lorebook = generateLorebookArtifact({
    jobTitle: "University Student",
    professionalDomain: "Corporate_Finance",
    speciesType: "Human",
    title: "Campus Canon",
    trope: "Academic rivals forced proximity",
  });
  const document = generatedLorebookArtifactToV3Document(lorebook);

  document.data.name = "Renamed Canon";
  document.data.description = "Edited description.";

  const synced = createLorebookArtifactFromV3Document({
    document,
    id: lorebook.id,
    source: "generated",
  });

  assert.equal(synced.id, lorebook.id);
  assert.equal(synced.title, "Renamed Canon");
  assert.equal(synced.summary.aiLoreInstruction, "Edited description.");
  assert.equal(synced.v3Document?.data.name, "Renamed Canon");
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

test("runtime bundles prefer edited lorebook v3 documents when present", () => {
  const lorebook = generateLorebookArtifact({
    jobTitle: "University Student",
    professionalDomain: "Corporate_Finance",
    speciesType: "Human",
    title: "Campus Canon",
    trope: "Academic rivals forced proximity",
  });
  const v3Document = generatedLorebookArtifactToV3Document(lorebook);

  v3Document.data.name = "Edited Campus Canon";
  v3Document.data.entries[0] = {
    ...v3Document.data.entries[0]!,
    content: "Edited archive rule.",
    keys: ["edited archive"],
    name: "Edited Rule",
  };

  const bundle = createRuntimeBundleArtifact({
    lorebook: {
      ...lorebook,
      v3Document,
    },
    title: "Edited Runtime",
  });

  assert.equal(bundle.lorebook?.title, "Edited Campus Canon");
  assert.match(bundle.compiledContext, /Edited Rule/);
  assert.match(bundle.compiledContext, /edited archive/);
  assert.match(bundle.compiledContext, /Edited archive rule/);
});

test("creates partial runtime bundle context with explicit missing slots", () => {
  const bundle = createRuntimeBundleArtifact({
    title: "Partial Runtime",
  });

  assert.match(bundle.compiledContext, /No persona selected/);
  assert.match(bundle.compiledContext, /No scenario selected/);
  assert.match(bundle.compiledContext, /No lorebook selected/);
});
