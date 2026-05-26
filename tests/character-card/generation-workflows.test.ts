import assert from "node:assert/strict";
import test from "node:test";

import {
  compilePersonaConstructionPrompt,
  compileScenarioConstructionPrompt,
  createBlankPersonaArtifact,
  createImportedPersonaArtifact,
  createImportedRuntimeBundleArtifact,
  createBlankScenarioArtifact,
  createImportedScenarioArtifact,
  createScenarioInputFromTemplate,
  createBlankLorebookArtifact,
  createLorebookArtifactFromV3Document,
  createPersonaArtifactFromEditable,
  createRuntimeBundleArtifactFromEditable,
  createScenarioArtifactFromEditable,
  createRuntimeBundleArtifact,
  generateLorebookArtifact,
  generatePersonaArtifact,
  generateScenarioArtifact,
  generateSuggestedLorebookFromScenario,
  getScenarioTemplateCategories,
  SCENARIO_TEMPLATES,
} from "../../features/generation/workflows";
import { generatedLorebookArtifactToV3Document } from "../../features/lorebooks/adapters";

test("generates persona artifact with prompt and normalized tags", () => {
  const persona = generatePersonaArtifact({
    archetype: "Protective realist",
    boundaries: "No user dialogue.",
    characteristics: "observant, careful",
    emotionalNeed: "to feel trusted",
    name: "Ari",
    playStyle: "Story roleplay",
    pointOfView: "AnyPOV",
    referenceCharacter: "Riven, a guarded rival",
    relationshipToCharacter: "guarded rival with romantic tension",
    tags: "Slow Burn, slow burn, guarded",
  });

  assert.equal(persona.name, "Ari");
  assert.match(persona.prompt, /USER PERSONA: Ari/);
  assert.match(persona.prompt, /Matched character\/context: Riven/);
  assert.match(persona.prompt, /Relationship role: guarded rival/);
  assert.ok(persona.tags.includes("slow burn"));
  assert.equal(
    persona.tags.filter((tag) => tag === "slow burn").length,
    1,
  );
  assert.equal(persona.source, "generated");
});

test("compiles hidden persona construction prompts for advanced controls", () => {
  const prompt = compilePersonaConstructionPrompt({
    archetype: "Protective realist",
    boundaries: "No user dialogue.",
    characteristics: "observant, careful",
    constructionPrompt: "Custom persona construction rule.",
    emotionalNeed: "to feel trusted",
    name: "Ari",
    playStyle: "Story roleplay",
    pointOfView: "AnyPOV",
    referenceCharacter: "Riven, a guarded rival",
    relationshipToCharacter: "guarded rival with romantic tension",
    tags: "guarded",
  });

  assert.match(prompt, /Custom persona construction rule/);
  assert.match(prompt, /Matched character\/context: Riven/);
  assert.match(prompt, /Relationship role: guarded rival/);
  assert.match(prompt, /OUTPUT REQUIREMENTS/);
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
    openingBeat: "Begin at the moment the archive lights fail.",
    professionalDomain: "Corporate_Finance",
    relationshipPressure: "competitive tension under forced cooperation",
    settingNotes: "rain-dark archive room",
    title: "Archive Night",
    trope: "Academic rivals forced proximity",
  });

  assert.equal(scenario.title, "Archive Night");
  assert.equal(scenario.source, "generated");
  assert.equal(scenario.occupation.kind, "student");
  assert.ok(scenario.summary.includes("{{char}}"));
  assert.ok(scenario.summary.includes("{{user}}"));
  assert.match(scenario.summary, /rain-dark archive room/);
  assert.match(scenario.firstMessage.aiOutputConstraint, /archive lights fail/);
  assert.ok(scenario.firstMessage.aiOutputConstraint.length > 40);
});

test("provides guided scenario templates as editable generation inputs", () => {
  assert.equal(SCENARIO_TEMPLATES.length, 20);
  assert.ok(getScenarioTemplateCategories().includes("University rivalry"));
  assert.ok(getScenarioTemplateCategories().includes("Meet ugly"));

  const input = createScenarioInputFromTemplate(
    "mafia_protection_witness",
    { constructionPrompt: "Keep this template agency-safe." },
  );
  const scenario = generateScenarioArtifact(input);

  assert.equal(input.title, "Witness Under Guard");
  assert.equal(input.professionalDomain, "Underworld");
  assert.equal(input.constructionPrompt, "Keep this template agency-safe.");
  assert.match(scenario.summary, /safehouse door|Protected Witness|protection/i);
  assert.match(scenario.firstMessage.aiOutputConstraint, /mob heir/i);
  assert.ok(scenario.tags.includes("mafia protection forced proximity"));
});

test("generates optional suggested lore from an active scenario", () => {
  const scenario = generateScenarioArtifact(
    createScenarioInputFromTemplate("workplace_taboo_coverup"),
  );
  const lorebook = generateSuggestedLorebookFromScenario(scenario, {
    professionalDomain: "Corporate_Finance",
  });

  assert.equal(lorebook.title, "Ethics Breach Lore");
  assert.ok(lorebook.tags.includes("suggested lore"));
  assert.ok(lorebook.tags.includes("scenario bridge"));
  assert.match(lorebook.summary.aiLoreInstruction, /Scenario bridge:/);
  assert.match(lorebook.summary.aiLoreInstruction, /Opening constraint:/);
  assert.ok(lorebook.entries.length >= 4);
});

test("compiles hidden scenario construction prompts for advanced controls", () => {
  const prompt = compileScenarioConstructionPrompt({
    constructionPrompt: "Custom scenario construction rule.",
    jobTitle: "University Student",
    openingBeat: "Begin at the moment the archive lights fail.",
    professionalDomain: "Corporate_Finance",
    relationshipPressure: "competitive tension under forced cooperation",
    settingNotes: "rain-dark archive room",
    title: "Archive Night",
    trope: "Academic rivals forced proximity",
  });

  assert.match(prompt, /Custom scenario construction rule/);
  assert.match(prompt, /rain-dark archive room/);
  assert.match(prompt, /competitive tension/);
  assert.match(prompt, /OUTPUT REQUIREMENTS/);
});

test("creates blank and imported scenario artifacts as editable drafts", () => {
  const blank = createBlankScenarioArtifact("Blank Scene");

  assert.equal(blank.source, "blank");
  assert.equal(blank.title, "Blank Scene");
  assert.ok(blank.tags.includes("blank"));

  const imported = createImportedScenarioArtifact({
    firstMessage: {
      aiOutputConstraint: "Open with a careful question.",
      tokenLengthCap: 350,
    },
    scenario: {
      scenePremiseDescription: "Imported scene premise.",
      sensoryDetails: ["rain", "old wood"],
      settingType: "Contained_Insular",
      startingTension: "Formal_Chilling",
    },
    tags: ["Imported", "imported"],
    title: "Imported Scene",
    trope: "Secret alliance",
  });

  assert.equal(imported.source, "imported");
  assert.equal(imported.title, "Imported Scene");
  assert.equal(imported.summary, "Imported scene premise.");
  assert.equal(
    imported.tags.filter((tag) => tag === "imported").length,
    1,
  );

  const edited = createScenarioArtifactFromEditable({
    ...imported,
    summary: "Edited scene premise.",
    title: "Edited Scene",
  });

  assert.equal(edited.id, imported.id);
  assert.equal(edited.title, "Edited Scene");
  assert.equal(edited.scenario.scenePremiseDescription, "Edited scene premise.");
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
    characteristics: "observant, careful",
    emotionalNeed: "to feel trusted",
    name: "Ari",
    playStyle: "Story roleplay",
    pointOfView: "AnyPOV",
    referenceCharacter: "",
    relationshipToCharacter: "slow-burn romantic counterpart",
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

test("imports and syncs runtime bundle artifacts from editable JSON", () => {
  const imported = createImportedRuntimeBundleArtifact({
    id: "bundle_custom",
    lorebook: {
      entries: [
        {
          activationKeys: ["archive"],
          content: "The archive is watched after midnight.",
          title: "Archive Rule",
        },
      ],
      id: "lore_custom",
      summary: "A campus lorebook.",
      title: "Campus Canon",
      universeAnchor: "Campus Canon",
    },
    persona: {
      id: "persona_custom",
      name: "Ari",
      prompt: "USER PERSONA: Ari",
      summary: "A guarded persona.",
    },
    scenario: {
      id: "scenario_custom",
      openingConstraint: "Open at the locked archive door.",
      settingType: "Contained_Insular",
      startingTension: "Charged_Electric",
      summary: "A rainy archive confrontation.",
      title: "Archive Night",
    },
    source: "created",
    tags: ["Bundle", "bundle", "Archive"],
    title: "Imported Runtime",
    updatedAt: 123,
  });

  assert.equal(imported.id, "bundle_custom");
  assert.equal(imported.source, "imported");
  assert.equal(imported.updatedAt, 123);
  assert.equal(imported.persona?.name, "Ari");
  assert.equal(imported.scenario?.title, "Archive Night");
  assert.equal(imported.lorebook?.entries.length, 1);
  assert.match(imported.compiledContext, /RUNTIME BUNDLE: Imported Runtime/);
  assert.match(imported.compiledContext, /Archive Rule/);
  assert.equal(
    imported.tags.filter((tag) => tag === "bundle").length,
    1,
  );

  const synced = createRuntimeBundleArtifactFromEditable({
    ...imported,
    title: "Edited Runtime",
  });

  assert.equal(synced.id, imported.id);
  assert.equal(synced.title, "Edited Runtime");
  assert.match(synced.compiledContext, /RUNTIME BUNDLE: Edited Runtime/);
});

test("creates partial runtime bundle context with explicit missing slots", () => {
  const bundle = createRuntimeBundleArtifact({
    title: "Partial Runtime",
  });

  assert.match(bundle.compiledContext, /No persona selected/);
  assert.match(bundle.compiledContext, /No scenario selected/);
  assert.match(bundle.compiledContext, /No lorebook selected/);
});
