import assert from "node:assert/strict";
import test from "node:test";

import {
  findHeightStaturePresetById,
  getHeightStaturePresetsByCategory,
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
