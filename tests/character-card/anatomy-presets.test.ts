import assert from "node:assert/strict";
import test from "node:test";

import {
  ANATOMY_PRESET_CATEGORIES,
  ANATOMY_PRESETS,
  compileAnatomyPresetAdditions,
  findAnatomyPresetById,
  getAnatomyPresetsByCategory,
} from "../../data/anatomyPresets";

test("loads anatomy presets across body, movement, health, genre, and dialogue lanes", () => {
  assert.equal(ANATOMY_PRESETS.length, 292);
  assert.deepEqual(ANATOMY_PRESET_CATEGORIES, [
    "Anatomy",
    "Anatomy Health",
    "Archetype",
    "Body Structure",
    "Dialogue Seed",
    "Facial Structure",
    "Fantasy Anatomy",
    "Gate",
    "Hands",
    "High-Value Seed",
    "Movement Anatomy",
    "Musculature",
    "Romance Hook",
    "Sci-Fi Anatomy",
    "Skin",
  ]);

  const ids = ANATOMY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getAnatomyPresetsByCategory("Archetype").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Anatomy").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Body Structure").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Musculature").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Hands").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Facial Structure").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Skin").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Movement Anatomy").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Fantasy Anatomy").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Sci-Fi Anatomy").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Anatomy Health").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getAnatomyPresetsByCategory("Gate").length, 14);
  assert.equal(getAnatomyPresetsByCategory("Dialogue Seed").length, 18);
  assert.equal(getAnatomyPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises anatomy values for visible prompt text", () => {
  const labourer = findAnatomyPresetById("anatomy_archetype_labourer_s_build");
  const manualLabour = findAnatomyPresetById(
    "anatomy_musculature_manual_labour_build",
  );
  const userNotice = findAnatomyPresetById(
    "anatomy_romance_user_notices_calloused_hands",
  );
  const recognises = findAnatomyPresetById(
    "anatomy_romance_partner_recognises_exhaustion",
  );

  assert.equal(labourer?.value, "Labourer's Build");
  assert.equal(manualLabour?.value, "manual labour build");
  assert.equal(userNotice?.value, "{{user}} notices calloused hands");
  assert.equal(recognises?.value, "partner recognises exhaustion");

  const visibleText = ANATOMY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|\blabor\b|\blaborer\b|recognizes|craftsman|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles anatomy presets as soft respectful body-detail guidance", () => {
  const preset = findAnatomyPresetById("anatomy_high_value_body_as_story_gate");
  assert.ok(preset);

  const additions = compileAnatomyPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /Anatomy and physical-detail context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.personalityAddition, /reducing them to appearance/i);
  assert.match(additions.systemPromptAddition, /soft anatomy and physical-detail context/i);
  assert.match(additions.systemPromptAddition, /non-diagnostic/i);
  assert.match(additions.systemPromptAddition, /personhood-first/i);
  assert.match(additions.systemPromptAddition, /avoid treating bodies as moral ranking/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps health and touch-adjacent anatomy details respectful", () => {
  const health = findAnatomyPresetById("anatomy_health_chronic_injury");
  const touch = findAnatomyPresetById("anatomy_romance_wound_care_scene");
  const fantasy = findAnatomyPresetById("anatomy_fantasy_pointed_ears");
  const scifi = findAnatomyPresetById("anatomy_scifi_cybernetic_implants");
  assert.ok(health);
  assert.ok(touch);
  assert.ok(fantasy);
  assert.ok(scifi);

  assert.match(health.guidance, /respectful, non-diagnostic/i);
  assert.match(health.guidance, /care, accessibility, or lived experience/i);
  assert.match(touch.guidance, /without assuming touch or access/i);
  assert.match(fantasy.guidance, /without erasing personhood or agency/i);
  assert.match(scifi.guidance, /without reducing the character to hardware/i);
});
