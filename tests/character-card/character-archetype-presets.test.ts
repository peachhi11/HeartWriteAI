import assert from "node:assert/strict";
import test from "node:test";

import {
  CHARACTER_ARCHETYPE_PRESET_CATEGORIES,
  CHARACTER_ARCHETYPE_PRESETS,
  CHARACTER_ARCHETYPE_PROFILES,
  compileCharacterArchetypePresetAdditions,
  findCharacterArchetypePresetById,
  getCharacterArchetypePresetsByCategory,
} from "../../data/characterArchetypePresets";

test("loads Tavernsprite-inspired character archetypes as original prompt-safe presets", () => {
  assert.equal(CHARACTER_ARCHETYPE_PROFILES.length, 22);
  assert.equal(CHARACTER_ARCHETYPE_PRESETS.length, 22);
  assert.deepEqual(CHARACTER_ARCHETYPE_PRESET_CATEGORIES, [
    "Character Archetype",
  ]);
  assert.equal(
    getCharacterArchetypePresetsByCategory("Character Archetype").length,
    22,
  );

  const ids = CHARACTER_ARCHETYPE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("keeps archetype descriptions behavioral rather than copied source slogans", () => {
  const tsundere = findCharacterArchetypePresetById(
    "character_archetype_tsundere",
  );
  const kuudere = findCharacterArchetypePresetById(
    "character_archetype_kuudere",
  );
  const morallyComplex = findCharacterArchetypePresetById(
    "character_archetype_morally_complex",
  );
  const visibleText = CHARACTER_ARCHETYPE_PRESETS.map((preset) =>
    [
      preset.label,
      preset.guidance,
      preset.profile.description,
      preset.profile.surfaceSignal,
      preset.profile.internalEngine,
    ].join(" "),
  ).join(" ");

  assert.equal(tsundere?.value, "Tsundere");
  assert.equal(kuudere?.value, "Kuudere");
  assert.equal(morallyComplex?.value, "Morally Complex");
  assert.match(tsundere?.profile.description ?? "", /Defensive sharpness/);
  assert.match(kuudere?.profile.internalEngine ?? "", /visible emotion feels risky/);
  assert.match(morallyComplex?.profile.behaviorRules.join(" ") ?? "", /consequence/i);
  assert.doesNotMatch(visibleText, /Cold on the outside, burning with hidden feeling inside/i);
  assert.doesNotMatch(visibleText, /Power, hunger, and contempt wrapped in absolute conviction/i);
});

test("compiles character archetypes as soft routing with agency and growth safeguards", () => {
  const obsessive = findCharacterArchetypePresetById(
    "character_archetype_obsessive",
  );
  assert.ok(obsessive);

  const additions = compileCharacterArchetypePresetAdditions(obsessive);

  assert.match(additions.personalityAddition, /Character archetype texture: Obsessive/);
  assert.match(additions.relationshipAddition, /devotion_without_possession/);
  assert.match(additions.systemPromptAddition, /soft archetype routing/i);
  assert.match(additions.systemPromptAddition, /consent, consequences, and \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid caricature, forced romance/i);
});
