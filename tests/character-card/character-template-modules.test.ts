import assert from "node:assert/strict";
import test from "node:test";

import {
  CHARACTER_TEMPLATE_CARD_ORDER,
  CHARACTER_TEMPLATE_GENERATION_ORDER,
  CHARACTER_TEMPLATE_MODULES,
  auditCharacterTemplateModules,
  compileCharacterTemplateCompactFieldMap,
  compileCharacterTemplateFieldOutline,
  getCharacterTemplateModule,
  getCharacterTemplateModulesByField,
} from "../../lib/character-card/characterTemplateModules";

test("defines the full twelve-module character template with stable ordering", () => {
  assert.equal(CHARACTER_TEMPLATE_MODULES.length, 12);
  assert.deepEqual(CHARACTER_TEMPLATE_GENERATION_ORDER, [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
  assert.deepEqual(CHARACTER_TEMPLATE_CARD_ORDER, [
    12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  ]);
  assert.equal(getCharacterTemplateModule(12)?.generatedLast, true);
  assert.equal(getCharacterTemplateModule(12)?.placedFirst, true);
});

test("maps modules onto the intended card and runtime fields", () => {
  assert.deepEqual(
    getCharacterTemplateModulesByField("personaDescription").map(
      (module) => module.moduleNumber,
    ),
    [1],
  );
  assert.deepEqual(
    getCharacterTemplateModulesByField("personaPersonality").map(
      (module) => module.moduleNumber,
    ),
    [2, 3, 4, 5, 6, 7],
  );
  assert.deepEqual(
    getCharacterTemplateModulesByField("personaScenario").map(
      (module) => module.moduleNumber,
    ),
    [8],
  );
  assert.deepEqual(
    getCharacterTemplateModulesByField("personaBackstory").map(
      (module) => module.moduleNumber,
    ),
    [9, 10, 11],
  );
  assert.deepEqual(
    getCharacterTemplateModulesByField("overview").map(
      (module) => module.moduleNumber,
    ),
    [12],
  );
});

test("keeps portable character truth separate from runtime, world, NPC, and arc infrastructure", () => {
  const portableModules = CHARACTER_TEMPLATE_MODULES.filter((module) =>
    [1, 2, 3, 4, 5, 6, 7].includes(module.moduleNumber),
  );

  assert.equal(
    portableModules.every((module) => module.truthTier === "character_truth"),
    true,
  );
  assert.equal(getCharacterTemplateModule(8)?.truthTier, "runtime_context");
  assert.equal(getCharacterTemplateModule(9)?.truthTier, "setting_truth");
  assert.equal(
    getCharacterTemplateModule(10)?.truthTier,
    "story_infrastructure",
  );
  assert.equal(getCharacterTemplateModule(11)?.truthTier, "arc_engine");
});

test("compiles concise outlines for field-level generation and UI help", () => {
  const personalityOutline = compileCharacterTemplateFieldOutline(
    "personaPersonality",
    {
      includeSections: false,
    },
  );
  const scenarioOutline = compileCharacterTemplateFieldOutline(
    "personaScenario",
  );
  const compactMap = compileCharacterTemplateCompactFieldMap();

  assert.match(personalityOutline, /Module 2 - Personality/);
  assert.match(personalityOutline, /Module 7 - Speech/);
  assert.doesNotMatch(personalityOutline, /Module 8 - Runtime/);
  assert.match(scenarioOutline, /Runtime is mutable story truth/);
  assert.match(compactMap, /personaDescription: Module 1: Identity/);
  assert.match(compactMap, /overview: Module 12: Overview/);
});

test("audits the template scaffold for missing modules and tier drift", () => {
  assert.deepEqual(auditCharacterTemplateModules(), []);
});
