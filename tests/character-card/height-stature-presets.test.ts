import assert from "node:assert/strict";
import test from "node:test";

import {
  compileHeightSeedPresetAdditions,
  findHeightStaturePresetById,
  findHeightSeedPresetById,
  getHeightStaturePresetsByCategory,
  getHeightSeedPresetsByCategory,
  HEIGHT_SEED_PRESET_CATEGORIES,
  HEIGHT_SEED_PRESETS,
  HEIGHT_STATURE_CATEGORIES,
  HEIGHT_STATURE_PRESETS,
} from "../../data/heightStaturePresets";

test("loads height and stature presets with unique ids", () => {
  assert.equal(HEIGHT_STATURE_PRESETS.length, 6);

  const ids = HEIGHT_STATURE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("height_")));
});

test("groups height presets by stature category", () => {
  assert.deepEqual(HEIGHT_STATURE_CATEGORIES, [
    "Average",
    "Petite",
    "Supernatural",
    "Towering",
  ]);

  assert.equal(getHeightStaturePresetsByCategory("towering").length, 2);
  assert.equal(getHeightStaturePresetsByCategory("Petite").length, 2);
  assert.equal(getHeightStaturePresetsByCategory("missing").length, 0);
});

test("exposes stable height preset lookup data for UI seed chips", () => {
  const preset = findHeightStaturePresetById("HEIGHT_TOWER_LOFTY_GIANT");

  assert.equal(preset?.vibe, "The Imposing Mountain");
  assert.equal(preset?.measurements, "6'4\" - 6'8\"+ (193cm - 203cm+)");
  assert.ok(preset?.dynamics.includes("Height Difference Trope"));
  assert.ok(preset?.systemPromptTags.includes("spatial crowding"));
});

test("keeps supernatural height presets explicitly variable scale", () => {
  const preset = findHeightStaturePresetById("height_super_eldritch_shift");

  assert.equal(preset?.category, "Supernatural");
  assert.match(preset?.measurements ?? "", /Variable/);
  assert.ok(preset?.visuals.includes("Unnatural limb elongation"));
});

test("loads height seed presets with deterministic unique ids", () => {
  assert.equal(HEIGHT_SEED_PRESETS.length, 148);

  const ids = HEIGHT_SEED_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("height_")));
});

test("groups height seed presets by safe vocabulary category", () => {
  assert.deepEqual(HEIGHT_SEED_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "Height",
    "Height Build",
    "High-Value Seed",
    "Numerical Height",
    "Romance Hook",
  ]);

  assert.equal(getHeightSeedPresetsByCategory("archetype").length, 20);
  assert.equal(getHeightSeedPresetsByCategory("Height").length, 30);
  assert.equal(getHeightSeedPresetsByCategory("Numerical Height").length, 16);
  assert.equal(getHeightSeedPresetsByCategory("Height Build").length, 16);
  assert.equal(getHeightSeedPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getHeightSeedPresetsByCategory("Gate").length, 13);
  assert.equal(getHeightSeedPresetsByCategory("Dialogue Seed").length, 13);
  assert.equal(getHeightSeedPresetsByCategory("High-Value Seed").length, 20);
});

test("normalizes user-relative height seeds to character-card placeholders", () => {
  const tallerSeed = findHeightSeedPresetById(
    "height_height_noticeably_taller_than_user",
  );
  const shelfHook = findHeightSeedPresetById(
    "height_romance_hook_reaches_high_shelf_for_user",
  );
  const collarHook = findHeightSeedPresetById("height_romance_hook_user_fixes_their_collar");

  assert.equal(tallerSeed?.value, "noticeably_taller_than_{{user}}");
  assert.equal(tallerSeed?.label, "noticeably taller than {{user}}");
  assert.equal(shelfHook?.value, "reaches_high_shelf_for_{{user}}");
  assert.equal(collarHook?.label, "{{user}} fixes their collar");

  const combinedText = HEIGHT_SEED_PRESETS.map((preset) => preset.value).join(" ");
  assert.doesNotMatch(combinedText, /noticeably_taller_than_user/);
  assert.doesNotMatch(combinedText, /reaches_high_shelf_for_user/);
  assert.doesNotMatch(combinedText, /user_fixes_their_collar/);
});

test("compiles height seed additions as soft guidance", () => {
  const preset = findHeightSeedPresetById("height_height_gentle_giant");
  assert.ok(preset);

  const compiled = compileHeightSeedPresetAdditions(preset);
  const combinedText = [
    compiled.backgroundAddition,
    compiled.personalityAddition,
    compiled.systemPromptAddition,
  ].join(" ");

  assert.match(combinedText, /optional height\/stature guidance/);
  assert.match(combinedText, /Preserve consent, boundaries, and \{\{user\}\} agency/);
  assert.doesNotMatch(combinedText, /must|force|override|SYSTEM PROTOCOL/i);
});
